import { NextRequest, NextResponse } from 'next/server';
import { generateFollowUpQuestion } from '@/lib/simulation';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
    const startTime = Date.now();
    console.log('[API] /api/simulation/follow-up - Request received');

    try {
        const body = await request.json();
        const {
            selectedRole,
            scenario,
            userResponse,
            conversationHistory,
            language = 'en',
            questionNumber = 1
        } = body;

        console.log('[API] Request params:', {
            hasRole: !!selectedRole,
            roleTitle: selectedRole?.title,
            hasScenario: !!scenario,
            scenarioLength: scenario?.length,
            hasResponse: !!userResponse,
            responseLength: userResponse?.length,
            historyLength: conversationHistory?.length,
            language,
            questionNumber
        });

        if (!selectedRole || !scenario || !userResponse) {
            console.error('[API] Missing required parameters');
            return NextResponse.json(
                { error: 'Selected role, scenario, and user response are required' },
                { status: 400 }
            );
        }

        const result = await generateFollowUpQuestion(
            selectedRole,
            scenario,
            userResponse,
            conversationHistory || [],
            language,
            questionNumber
        );

        const duration = Date.now() - startTime;
        console.log(`[API] Follow-up generated in ${duration}ms`, {
            success: result.success,
            hasQuestion: !!result.followUpQuestion,
            hasFocus: !!result.focusArea
        });

        if (!result.success) {
            console.error('[API] Follow-up generation failed:', result.error);
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            followUpQuestion: result.followUpQuestion,
            focusArea: result.focusArea,
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
