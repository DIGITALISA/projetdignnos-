import { NextRequest, NextResponse } from 'next/server';
import { generateNextInterviewQuestion } from '@/lib/deepseek';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
    const startTime = Date.now();
    console.log('[API] /api/interview/next-question - Request received');
    
    try {
        const body = await request.json();
        const { cvAnalysis, conversationHistory, language = 'en', questionNumber, totalQuestions } = body;

        console.log('[API] Request params:', {
            hasCV: !!cvAnalysis,
            historyLength: conversationHistory?.length || 0,
            language,
            questionNumber,
            totalQuestions
        });

        if (!cvAnalysis) {
            console.error('[API] Missing CV analysis');
            return NextResponse.json(
                { success: false, error: 'CV analysis is required' },
                { status: 400 }
            );
        }

        console.log('[API] Calling generateNextInterviewQuestion...');
        const result = await generateNextInterviewQuestion(
            cvAnalysis,
            conversationHistory,
            language,
            questionNumber,
            totalQuestions
        );

        const duration = Date.now() - startTime;
        console.log(`[API] Question generation completed in ${duration}ms`, {
            success: result.success,
            hasQuestion: !!result.question,
            questionLength: result.question?.length || 0
        });

        if (!result.success) {
            console.error('[API] Question generation failed:', result.error);
            return NextResponse.json(
                { success: false, error: result.error || 'Failed to generate question' },
                { status: 500 }
            );
        }

        if (!result.question || result.question.trim().length === 0) {
            console.error('[API] Empty question returned from AI');
            return NextResponse.json(
                { success: false, error: 'AI returned empty question' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            question: result.question,
        });
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`[API] Error after ${duration}ms:`, error);
        console.error('[API] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        
        return NextResponse.json(
            { 
                success: false, 
                error: error instanceof Error ? error.message : 'Internal server error',
                details: 'Check server logs for more information'
            },
            { status: 500 }
        );
    }
}
