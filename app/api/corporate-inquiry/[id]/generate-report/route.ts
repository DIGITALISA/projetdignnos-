import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CorporateInquiry from '@/models/CorporateInquiry';
import Diagnosis from '@/models/Diagnosis';
import Simulation from '@/models/Simulation';
import InterviewResult from '@/models/InterviewResult';
import PerformanceProfile from '@/models/PerformanceProfile';
import { generateCorporateStrategicReport } from '@/lib/deepseek';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { language = 'fr' } = await request.json();

        await connectDB();

        // 1. Fetch Inquiry
        const inquiry = await CorporateInquiry.findById(id);
        if (!inquiry) {
            return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
        }

        // 2. Fetch Candidate Data using Ref ID
        // The candidateRefId from inquiry matches referenceId in Diagnosis
        const diagnosis = await Diagnosis.findOne({ referenceId: inquiry.candidateRefId });
        
        if (!diagnosis) {
            return NextResponse.json({ 
                error: "Candidate data not found. Ensure the Reference ID is correct and the candidate has completed their diagnostic." 
            }, { status: 404 });
        }

        const identifier = diagnosis.userId; // This is the user email/id

        // 3. Fetch related candidate records
        const [interview, simulations, profile] = await Promise.all([
            InterviewResult.findOne({ userId: identifier }),
            Simulation.find({ userId: identifier, status: 'completed' }),
            PerformanceProfile.findOne({ userId: identifier })
        ]);

        // 4. Generate AI Report
        const aiResult = await generateCorporateStrategicReport(
            {
                position: inquiry.targetPosition,
                description: inquiry.jobDescription,
                company: inquiry.companyName
            },
            {
                diagnosis: diagnosis.analysis,
                interview: interview?.evaluation,
                simulations: simulations,
                expertNotes: profile?.expertNotes
            },
            language
        );

        if (!aiResult.success || !aiResult.report) {
            throw new Error(aiResult.error || "AI Generation failed");
        }

        // 5. Update Inquiry with Report and set status to Reviewed
        inquiry.corporateReport = {
            ...aiResult.report,
            generatedAt: new Date()
        };
        inquiry.status = 'reviewed';
        await inquiry.save();

        return NextResponse.json({ 
            success: true, 
            report: inquiry.corporateReport 
        });

    } catch (error) {
        console.error("Corporate Report Gen Error:", error);
        return NextResponse.json({ 
            error: (error as Error).message || "Internal Server Error" 
        }, { status: 500 });
    }
}
