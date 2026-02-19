import { NextRequest, NextResponse } from 'next/server';
import { evaluateResponse } from '@/lib/simulation';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
    const startTime = Date.now();
    console.log('[API] /api/simulation/evaluate - Request received');

    try {
        const body = await request.json();
        const {
            selectedRole,
            cvAnalysis,
            scenarioNumber,
            userResponse,
            conversationHistory,
            language = 'en'
        } = body;

        console.log('[API] Request params:', {
            hasRole: !!selectedRole,
            roleTitle: selectedRole?.title,
            hasCV: !!cvAnalysis,
            scenarioNumber,
            hasResponse: !!userResponse,
            responseLength: userResponse?.length,
            historyLength: conversationHistory?.length,
            language
        });

        if (!selectedRole || !cvAnalysis || !userResponse) {
            console.error('[API] Missing required parameters');
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

        const duration = Date.now() - startTime;
        console.log(`[API] Evaluation completed in ${duration}ms`, {
            success: result.success,
            hasEvaluation: !!result.evaluation,
            hasFeedback: !!result.feedback,
        });

        if (!result.success) {
            console.error('[API] Evaluation failed:', result.error);
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
    } catch (error: unknown) {
        const duration = Date.now() - startTime;
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : undefined;
        
        console.error(`[API] Error after ${duration}ms:`, error);
        
        return NextResponse.json(
            { 
                error: 'Internal server error',
                details: errorMessage,
                stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
            },
            { status: 500 }
        );
    }
}
