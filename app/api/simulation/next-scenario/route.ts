import { NextRequest, NextResponse } from 'next/server';
import { generateNextScenario } from '@/lib/simulation';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
    const startTime = Date.now();
    console.log('[API] /api/simulation/next-scenario - Request received');
    
    try {
        const body = await request.json();
        const {
            selectedRole,
            cvAnalysis,
            scenarioNumber,
            previousResults,
            language = 'en'
        } = body;

        console.log('[API] Request params:', {
            hasRole: !!selectedRole,
            roleTitle: selectedRole?.title,
            hasCV: !!cvAnalysis,
            scenarioNumber,
            previousResultsCount: previousResults?.length || 0,
            language
        });

        if (!selectedRole || !cvAnalysis || !scenarioNumber) {
            console.error('[API] Missing required parameters:', {
                hasRole: !!selectedRole,
                hasCV: !!cvAnalysis,
                hasScenarioNumber: !!scenarioNumber
            });
            return NextResponse.json(
                { success: false, error: 'All parameters are required' },
                { status: 400 }
            );
        }

        console.log('[API] Calling generateNextScenario...');
        const result = await generateNextScenario(
            selectedRole,
            cvAnalysis,
            scenarioNumber,
            previousResults || [],
            language
        );

        const duration = Date.now() - startTime;
        console.log(`[API] Scenario generation completed in ${duration}ms`, {
            success: result.success,
            hasScenario: !!result.scenario,
            scenarioLength: result.scenario?.length || 0,
            hasFocusAreas: !!result.focusAreas
        });

        if (!result.success) {
            console.error('[API] Scenario generation failed:', result.error);
            return NextResponse.json(
                { success: false, error: result.error || 'Failed to generate scenario' },
                { status: 500 }
            );
        }

        if (!result.scenario || result.scenario.trim().length === 0) {
            console.error('[API] Empty scenario returned from AI');
            return NextResponse.json(
                { success: false, error: 'AI returned empty scenario' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            scenario: result.scenario,
            focusAreas: result.focusAreas,
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
