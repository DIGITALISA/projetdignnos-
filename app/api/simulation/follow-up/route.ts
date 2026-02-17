import { NextRequest, NextResponse } from 'next/server';
import { generateFollowUpQuestion } from '@/lib/simulation';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
    try {
        const {
            selectedRole,
            scenario,
            userResponse,
            conversationHistory,
            language = 'en',
            questionNumber = 1
        } = await request.json();

        if (!selectedRole || !scenario || !userResponse) {
            return NextResponse.json(
                { error: 'Selected role, scenario, and user response are required' },
                { status: 400 }
            );
        }

        console.log('[Follow-up API] Generating follow-up question...');
        console.log('[Follow-up API] Question number:', questionNumber);

        const result = await generateFollowUpQuestion(
            selectedRole,
            scenario,
            userResponse,
            conversationHistory || [],
            language,
            questionNumber
        );

        if (!result.success) {
            console.error('[Follow-up API] Generation failed:', result.error);
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }

        console.log('[Follow-up API] Successfully generated follow-up question');

        return NextResponse.json({
            success: true,
            followUpQuestion: result.followUpQuestion,
            focusArea: result.focusArea,
        });
    } catch (error) {
        console.error('[Follow-up API] Unexpected error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
