import { NextRequest, NextResponse } from 'next/server';
import { startSimulation } from '@/lib/simulation';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
    try {
        const { selectedRole, cvAnalysis, generatedCV, language = 'en', scenarioNumber = 1 } = await request.json();

        if (!selectedRole || !cvAnalysis) {
            return NextResponse.json(
                { error: 'Selected role and CV analysis are required' },
                { status: 400 }
            );
        }

        const result = await startSimulation(selectedRole, cvAnalysis, generatedCV, language, scenarioNumber);

        if (!result.success) {
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
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
