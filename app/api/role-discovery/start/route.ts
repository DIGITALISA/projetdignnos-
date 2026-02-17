import { NextRequest, NextResponse } from 'next/server';
import { startRoleDiscoveryInterview } from '@/lib/role-discovery';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
    try {
        const { cvAnalysis, interviewEvaluation, language = 'en' } = await request.json();

        if (!cvAnalysis || !interviewEvaluation) {
            return NextResponse.json(
                { error: 'CV analysis and interview evaluation are required' },
                { status: 400 }
            );
        }

        const result = await startRoleDiscoveryInterview(cvAnalysis, interviewEvaluation, language);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            welcomeMessage: result.welcomeMessage,
            firstQuestion: result.firstQuestion,
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
