import { NextRequest, NextResponse } from 'next/server';
import { generateNextCVQuestion } from '@/lib/cv-generation';

export async function POST(request: NextRequest) {
    try {
        const {
            cvAnalysis,
            interviewEvaluation,
            selectedRole,
            conversationHistory,
            language = 'en',
            questionNumber,
            totalQuestions
        } = await request.json();

        if (!cvAnalysis || !interviewEvaluation || !selectedRole) {
            return NextResponse.json(
                { error: 'CV analysis, interview evaluation, and selected role are required' },
                { status: 400 }
            );
        }

        const result = await generateNextCVQuestion(
            cvAnalysis,
            interviewEvaluation,
            selectedRole,
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
