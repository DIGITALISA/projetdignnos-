import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Diagnosis from '@/models/Diagnosis';
import InterviewResult from '@/models/InterviewResult';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        await connectDB();

        // Find the most recent diagnosis for this user
        const latestDiagnosis = await Diagnosis.findOne({ userId }).sort({ createdAt: -1 });

        if (!latestDiagnosis) {
            return NextResponse.json({
                hasActiveSession: false
            });
        }

        let evaluation = null;
        if (latestDiagnosis.currentStep === 'interview_complete' || latestDiagnosis.currentStep === 'completed') {
            const latestResult = await InterviewResult.findOne({ userId }).sort({ createdAt: -1 });
            if (latestResult) {
                evaluation = latestResult.evaluation;
            }
        }

        return NextResponse.json({
            hasActiveSession: true,
            currentStep: latestDiagnosis.currentStep,
            diagnosisId: latestDiagnosis._id,
            analysis: latestDiagnosis.analysis,
            language: latestDiagnosis.language,
            conversationHistory: latestDiagnosis.conversationHistory,
            totalQuestions: latestDiagnosis.totalQuestions,
            evaluation
        });

    } catch (error) {
        console.error('Error fetching progress:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
