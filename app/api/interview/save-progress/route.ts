import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Diagnosis from '@/models/Diagnosis';

export async function POST(request: NextRequest) {
    try {
        const { diagnosisId, messages, currentQuestionIndex, totalQuestions } = await request.json();

        if (!diagnosisId) {
            return NextResponse.json({ error: 'Diagnosis ID is required' }, { status: 400 });
        }

        await connectDB();

        await Diagnosis.findByIdAndUpdate(diagnosisId, {
            conversationHistory: messages,
            currentStep: 'interview_in_progress',
            // We could store question index too if we added it to schema, but user only asked for "step" generally.
            // But to resume exactly where left off, saving messages is enough IF we can deduce state from messages.
            // However, saving question index is safer.
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error saving progress:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
