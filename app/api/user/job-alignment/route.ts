import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import JobAlignment from '@/models/JobAlignment';
import Diagnosis from '@/models/Diagnosis';
import { analyzeJobAndCompany, generateJobAlignmentMCQ, generateMockInterviewQuestion, analyzeMockInterview, generatePersonalizedDocuments, generateJobAlignmentFinalAudit } from '@/lib/deepseek';

export async function POST(request: NextRequest) {
    try {
        const { 
            userId, userName, type, jobTitle, jobDescription, 
            companyName, companySector, companyAddress, companyWebsite, 
            additionalCompanyInfo, language = 'en' 
        } = await request.json();

        if (!userId || !jobDescription || !jobTitle || !companyName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await connectDB();

        // 1. Fetch User Diagnosis for profile context
        const diagnosis = await Diagnosis.findOne({ 
            $or: [
                { userId: { $regex: new RegExp(`^${userId}$`, 'i') } },
                { userId: userId.toString() }
            ]
        }).sort({ updatedAt: -1 });

        if (!diagnosis) {
            return NextResponse.json({ error: 'Please complete your initial diagnosis first' }, { status: 404 });
        }

        // 2. Analyze Job & Company (Stage 1)
        const jobInfo = { jobTitle, jobDescription, companyName, companySector, companyWebsite, additionalCompanyInfo };
        const researchReport = await analyzeJobAndCompany(jobInfo, language);

        // 3. Generate 30 MCQs (Stage 2)
        const mcqData = await generateJobAlignmentMCQ(jobInfo, language);

        let referenceId = `ALIGN-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
        if (diagnosis && (diagnosis as { referenceId?: string }).referenceId) {
            const baseId = (diagnosis as { referenceId: string }).referenceId.split('-').pop();
            referenceId = `ALIGN-${new Date().getFullYear()}-${baseId}`;
        }

        const alignment = await JobAlignment.create({
            userId,
            userName,
            type,
            jobTitle,
            jobDescription,
            companyName,
            companySector,
            companyAddress,
            companyWebsite,
            additionalCompanyInfo,
            researchReport,
            mcqQuestions: mcqData.questions,
            currentStage: 'research',
            language,
            referenceId,
            status: 'pending'
        });

        return NextResponse.json({ success: true, alignment });
    } catch (error) {
        console.error('Job Alignment Start Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { alignmentId, action, data, language = 'en' } = await request.json();

        if (!alignmentId || !action) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await connectDB();
        const alignment = await JobAlignment.findById(alignmentId);

        if (!alignment) {
            return NextResponse.json({ error: 'Alignment record not found' }, { status: 404 });
        }

        if (action === 'submit_mcq') {
            alignment.mcqAnswers = data.answers;
            // Calculate score
            let correctCount = 0;
            alignment.mcqQuestions.forEach((q: { correctAnswer: number }, i: number) => {
                if (q.correctAnswer === data.answers[i]) correctCount++;
            });
            alignment.mcqScore = Math.round((correctCount / alignment.mcqQuestions.length) * 100);
            alignment.currentStage = 'mcq_finished'; // Custom intermediary for frontend logic
            await alignment.save();

            // Generate first interview question
            const firstQuestion = await generateMockInterviewQuestion([], alignment, language);
            alignment.interviewChat = [{ role: 'assistant', content: firstQuestion || "Welcome to the interview. Tell me about yourself." }];
            alignment.currentStage = 'interview';
            await alignment.save();
        } 
        else if (action === 'interview_answer') {
            alignment.interviewChat.push({ role: 'user', content: data.answer });
            
            if (alignment.interviewChat.filter((m: { role: string }) => m.role === 'user').length >= 20) {
                // End of interview
                const analysis = await analyzeMockInterview(alignment.interviewChat, alignment, language);
                alignment.interviewAnalysis = analysis;
                alignment.currentStage = 'cv-prep';
            } else {
                // Get next question
                const nextQuestion = await generateMockInterviewQuestion(alignment.interviewChat, alignment, language);
                alignment.interviewChat.push({ role: 'assistant', content: nextQuestion || "Thank you. Next question." });
            }
            await alignment.save();
        }
        else if (action === 'generate_documents') {
            // Fetch diagnosis for full context
            const diagnosis = await Diagnosis.findOne({ userId: alignment.userId }).sort({ updatedAt: -1 });
            
            const docData = {
                jobTitle: alignment.jobTitle,
                companyName: alignment.companyName,
                userProfile: diagnosis?.analysis,
                interviewAnalysis: alignment.interviewAnalysis,
                mcqScore: alignment.mcqScore
            };

            const docs = await generatePersonalizedDocuments(docData, language);
            alignment.generatedCV = docs.cv;
            alignment.generatedCoverLetter = docs.coverLetter;
            alignment.currentStage = 'completed';
            alignment.status = 'completed';
            await alignment.save();
        }
        else if (action === 'generate_final_audit') {
            const diagnosis = await Diagnosis.findOne({ userId: alignment.userId }).sort({ updatedAt: -1 });

            const audit = await generateJobAlignmentFinalAudit({
                userName: alignment.userName,
                jobTitle: alignment.jobTitle,
                companyName: alignment.companyName,
                diagnosis: diagnosis?.analysis,
                researchReport: alignment.researchReport,
                mcqScore: alignment.mcqScore,
                interviewAnalysis: alignment.interviewAnalysis,
                interviewChat: alignment.interviewChat
            }, language);

            alignment.finalAudit = audit;
            alignment.currentStage = 'completed'; // We keep it as completed or add a new stage
            await alignment.save();
        }

        return NextResponse.json({ success: true, alignment });
    } catch (error) {
        console.error('Job Alignment Update Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        await connectDB();
        const alignments = await JobAlignment.find({ userId }).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, alignments });
    } catch (error) {
        console.error('Job Alignment Fetch Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
