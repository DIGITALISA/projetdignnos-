import { NextRequest, NextResponse } from 'next/server';
import { generateNextInterviewQuestion } from '@/lib/deepseek';

export async function POST(request: NextRequest) {
    try {
        const { cvAnalysis, conversationHistory, language = 'en', questionNumber, totalQuestions } = await request.json();

        if (!cvAnalysis) {
            return NextResponse.json(
                { error: 'CV analysis is required' },
                { status: 400 }
            );
        }

        const result = await generateNextInterviewQuestion(
            cvAnalysis,
            conversationHistory,
            language,
            questionNumber,
            totalQuestions
        );

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            question: result.question,
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
