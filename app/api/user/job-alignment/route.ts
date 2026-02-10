import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import JobAlignment from '@/models/JobAlignment';
import Diagnosis from '@/models/Diagnosis';
import { generateJobAlignmentQuestions, evaluateJobAlignment } from '@/lib/deepseek';

export async function POST(request: NextRequest) {
    try {
        const { userId, userName, type, jobDescription, language = 'en' } = await request.json();

        if (!userId || !jobDescription || !type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await connectDB();

        // Fetch User Diagnosis for profile context
        const diagnosis = await Diagnosis.findOne({ 
            $or: [
                { userId: { $regex: new RegExp(`^${userId}$`, 'i') } },
                { userId: userId.toString() }
            ]
        }).sort({ updatedAt: -1 });

        if (!diagnosis) {
            return NextResponse.json({ error: 'Please complete your initial diagnosis first' }, { status: 404 });
        }

        const userProfile = { fullName: userName, userId };
        
        // Generate Questions
        const aiResponse = await generateJobAlignmentQuestions(
            userProfile,
            diagnosis.analysis,
            jobDescription,
            type,
            language
        );

        const referenceId = `ALIGN-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

        const alignment = await JobAlignment.create({
            userId,
            userName,
            type,
            jobDescription,
            questions: aiResponse.questions,
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
        const { alignmentId, answers, language = 'en' } = await request.json();

        if (!alignmentId || !answers) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await connectDB();
        const alignment = await JobAlignment.findById(alignmentId);

        if (!alignment) {
            return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
        }

        const report = await evaluateJobAlignment(
            alignment.jobDescription,
            alignment.questions,
            answers,
            { fullName: alignment.userName, userId: alignment.userId },
            language
        );

        alignment.answers = answers;
        alignment.score = report.score;
        alignment.report = {
            verdict: report.verdict,
            analysis: report.analysis,
            strengths: report.strengths,
            gaps: report.gaps,
            roadmap: report.roadmap
        };
        alignment.status = 'completed';
        await alignment.save();

        return NextResponse.json({ success: true, alignment });
    } catch (error) {
        console.error('Job Alignment Evaluation Error:', error);
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
