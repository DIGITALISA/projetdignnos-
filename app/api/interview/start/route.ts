import { NextRequest, NextResponse } from 'next/server';
import { startStructuredInterview } from '@/lib/deepseek';

export async function POST(request: NextRequest) {
    try {
        const { cvAnalysis, language = 'en' } = await request.json();

        if (!cvAnalysis) {
            return NextResponse.json(
                { error: 'CV analysis is required' },
                { status: 400 }
            );
        }

        const result = await startStructuredInterview(cvAnalysis, language);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            welcomeMessage: result.welcomeMessage,
            firstQuestion: result.firstQuestion,
            totalQuestions: result.totalQuestions,
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
