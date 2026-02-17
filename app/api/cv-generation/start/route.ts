import { NextRequest, NextResponse } from 'next/server';
import { startCVGeneration } from '@/lib/cv-generation';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
    const startTime = Date.now();
    console.log('[API] /api/cv-generation/start - Request received');
    
    try {
        const body = await request.json();
        const { cvAnalysis, interviewEvaluation, selectedRole, language = 'en' } = body;

        console.log('[API] Request params:', {
            hasCV: !!cvAnalysis,
            hasEvaluation: !!interviewEvaluation,
            hasRole: !!selectedRole,
            roleTitle: selectedRole?.title,
            language
        });

        if (!cvAnalysis || !interviewEvaluation || !selectedRole) {
            console.error('[API] Missing required data:', {
                hasCV: !!cvAnalysis,
                hasEvaluation: !!interviewEvaluation,
                hasRole: !!selectedRole
            });
            return NextResponse.json(
                { success: false, error: 'CV analysis, interview evaluation, and selected role are required' },
                { status: 400 }
            );
        }

        console.log('[API] Calling startCVGeneration...');
        const result = await startCVGeneration(cvAnalysis, interviewEvaluation, selectedRole, language);

        const duration = Date.now() - startTime;
        console.log(`[API] CV generation started in ${duration}ms`, {
            success: result.success,
            hasWelcomeMessage: !!result.welcomeMessage,
            hasFirstQuestion: !!result.firstQuestion,
            welcomeLength: result.welcomeMessage?.length || 0,
            questionLength: result.firstQuestion?.length || 0
        });

        if (!result.success) {
            console.error('[API] CV generation start failed:', result.error);
            return NextResponse.json(
                { success: false, error: result.error || 'Failed to start CV generation' },
                { status: 500 }
            );
        }

        if (!result.welcomeMessage || !result.firstQuestion) {
            console.error('[API] Empty response from AI');
            return NextResponse.json(
                { success: false, error: 'AI returned incomplete response' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            welcomeMessage: result.welcomeMessage,
            firstQuestion: result.firstQuestion,
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
