import { NextRequest, NextResponse } from 'next/server';
import { generateInterviewQuestion } from '@/lib/deepseek';

export async function POST(request: NextRequest) {
    try {
        const { cvAnalysis, conversationHistory, language = 'en' } = await request.json();

        if (!cvAnalysis) {
            return NextResponse.json(
                { error: 'CV analysis is required' },
                { status: 400 }
            );
        }

        const result = await generateInterviewQuestion(cvAnalysis, conversationHistory, language);

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
