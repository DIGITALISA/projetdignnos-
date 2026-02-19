import { NextRequest, NextResponse } from 'next/server';
import { startSimulation } from '@/lib/simulation';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
    const startTime = Date.now();
    console.log('[API] /api/simulation/start - Request received');

    try {
        const body = await request.json();
        const { selectedRole, cvAnalysis, generatedCV, language = 'en', scenarioNumber = 1 } = body;

        console.log('[API] Request params:', {
            hasRole: !!selectedRole,
            roleTitle: selectedRole?.title,
            hasCV: !!cvAnalysis,
            language,
            scenarioNumber
        });

        if (!selectedRole || !cvAnalysis) {
            console.error('[API] Missing required parameters');
            return NextResponse.json(
                { error: 'Selected role and CV analysis are required' },
                { status: 400 }
            );
        }

        const result = await startSimulation(selectedRole, cvAnalysis, generatedCV, language, scenarioNumber);

        const duration = Date.now() - startTime;
        console.log(`[API] Simulation started in ${duration}ms`, {
            success: result.success,
            hasWelcome: !!result.welcomeMessage,
            hasScenario: !!result.scenario,
            scenarioLength: result.scenario?.length
        });

        if (!result.success) {
            console.error('[API] Simulation start failed:', result.error);
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            welcomeMessage: result.welcomeMessage,
            scenario: result.scenario,
            scenarioType: result.scenarioType,
            expectedSkills: result.expectedSkills,
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
