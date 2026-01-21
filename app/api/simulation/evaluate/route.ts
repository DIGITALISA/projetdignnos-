import { NextRequest, NextResponse } from 'next/server';
import { evaluateResponse } from '@/lib/simulation';

export async function POST(request: NextRequest) {
    try {
        const {
            selectedRole,
            cvAnalysis,
            scenarioNumber,
            userResponse,
            conversationHistory,
            language = 'en'
        } = await request.json();

        if (!selectedRole || !cvAnalysis || !userResponse) {
            return NextResponse.json(
                { error: 'All parameters are required' },
                { status: 400 }
            );
        }

        const result = await evaluateResponse(
            selectedRole,
            cvAnalysis,
            scenarioNumber,
            userResponse,
            conversationHistory,
            language
        );

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            scenarioTitle: result.scenarioTitle,
            evaluation: result.evaluation,
            feedback: result.feedback,
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
