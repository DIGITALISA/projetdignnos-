import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Diagnosis from '@/models/Diagnosis';

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

        // You might want to define a cutoff time (e.g., if > 24 hours, start over)
        // For now, we assume it's always resumable unless 'completed' maybe? 
        // Or strictly follow user request "doesn't return to beginning".

        return NextResponse.json({
            hasActiveSession: true,
            currentStep: latestDiagnosis.currentStep,
            diagnosisId: latestDiagnosis._id,
            analysis: latestDiagnosis.analysis,
            language: latestDiagnosis.language,
            conversationHistory: latestDiagnosis.conversationHistory
        });

    } catch (error) {
        console.error('Error fetching progress:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
