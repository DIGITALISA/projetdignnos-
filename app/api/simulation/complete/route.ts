import { NextRequest, NextResponse } from 'next/server';
import { completeSimulation } from '@/lib/simulation';

export async function POST(request: NextRequest) {
    try {
        const {
            selectedRole,
            cvAnalysis,
            scenarioResults,
            language = 'en'
        } = await request.json();

        if (!selectedRole || !cvAnalysis || !scenarioResults) {
            return NextResponse.json(
                { error: 'All parameters are required' },
                { status: 400 }
            );
        }

        const result = await completeSimulation(
            selectedRole,
            cvAnalysis,
            scenarioResults,
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
            report: result.report,
            completionMessage: result.completionMessage,
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
