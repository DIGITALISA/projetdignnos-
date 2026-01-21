import { NextRequest, NextResponse } from 'next/server';
import { evaluateInterview } from '@/lib/deepseek';

export async function POST(request: NextRequest) {
    try {
        const { cvAnalysis, conversationHistory, language = 'en' } = await request.json();

        if (!cvAnalysis || !conversationHistory) {
            return NextResponse.json(
                { error: 'CV analysis and conversation history are required' },
                { status: 400 }
            );
        }

        const result = await evaluateInterview(cvAnalysis, conversationHistory, language);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            evaluation: result.evaluation,
            closingMessage: result.closingMessage,
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
