import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Diagnosis from '@/models/Diagnosis';

export async function POST(request: NextRequest) {
    try {
        const { userId, messages, results, currentScenario, totalScenarios } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        await connectDB();

        const updated = await Diagnosis.findOneAndUpdate(
            { userId },
            {
                $set: {
                    simulationConversation: messages,
                    simulationResults: results,
                    'completionStatus.simulationComplete': currentScenario > totalScenarios
                }
            },
            { sort: { createdAt: -1 }, new: true }
        );

        return NextResponse.json({ success: true, diagnosis: updated });
    } catch (error) {
        console.error('Error saving simulation progress:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
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

        const diagnosis = await Diagnosis.findOne({ userId }).sort({ createdAt: -1 });

        if (!diagnosis) {
            return NextResponse.json({ hasProgress: false });
        }

        return NextResponse.json({
            hasProgress: !!(diagnosis.simulationConversation && diagnosis.simulationConversation.length > 0),
            messages: diagnosis.simulationConversation || [],
            results: diagnosis.simulationResults || [],
            currentScenario: (diagnosis.simulationResults?.length || 0) + 1,
            isComplete: diagnosis.completionStatus?.simulationComplete || false
        });
    } catch (error) {
        console.error('Error fetching simulation progress:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
