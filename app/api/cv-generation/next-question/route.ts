import { NextRequest, NextResponse } from 'next/server';
import { generateNextCVQuestion } from '@/lib/cv-generation';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
    const startTime = Date.now();
    console.log('[API] /api/cv-generation/next-question - Request received');
    
    try {
        const body = await request.json();
        const {
            cvAnalysis,
            interviewEvaluation,
            selectedRole,
            conversationHistory,
            language = 'en',
            questionNumber,
            totalQuestions
        } = body;

        console.log('[API] Request params:', {
            hasCV: !!cvAnalysis,
            hasEvaluation: !!interviewEvaluation,
            hasRole: !!selectedRole,
            roleTitle: selectedRole?.title,
            historyLength: conversationHistory?.length || 0,
            language,
            questionNumber,
            totalQuestions
        });

        if (!cvAnalysis || !interviewEvaluation || !selectedRole) {
            console.error('[API] Missing required fields:', { 
                hasCVAnalysis: !!cvAnalysis, 
                hasInterviewEvaluation: !!interviewEvaluation, 
                hasSelectedRole: !!selectedRole 
            });
            return NextResponse.json(
                { success: false, error: 'CV analysis, interview evaluation, and selected role are required' },
                { status: 400 }
            );
        }

        console.log('[API] Calling generateNextCVQuestion...');
        const result = await generateNextCVQuestion(
            cvAnalysis,
            interviewEvaluation,
            selectedRole,
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
