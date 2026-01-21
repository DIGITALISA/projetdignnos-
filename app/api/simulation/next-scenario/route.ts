import { NextRequest, NextResponse } from 'next/server';
import { generateNextScenario } from '@/lib/simulation';

export async function POST(request: NextRequest) {
    try {
        const {
            selectedRole,
            cvAnalysis,
            scenarioNumber,
            previousResults,
            language = 'en'
        } = await request.json();

        if (!selectedRole || !cvAnalysis || !scenarioNumber) {
            return NextResponse.json(
                { error: 'All parameters are required' },
                { status: 400 }
            );
        }

        const result = await generateNextScenario(
            selectedRole,
            cvAnalysis,
            scenarioNumber,
            previousResults || [],
            language
        );

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            scenario: result.scenario,
            focusAreas: result.focusAreas,
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
