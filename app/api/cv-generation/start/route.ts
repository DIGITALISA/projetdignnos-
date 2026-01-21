import { NextRequest, NextResponse } from 'next/server';
import { startCVGeneration } from '@/lib/cv-generation';

export async function POST(request: NextRequest) {
    try {
        const { cvAnalysis, interviewEvaluation, selectedRole, language = 'en' } = await request.json();

        if (!cvAnalysis || !interviewEvaluation || !selectedRole) {
            return NextResponse.json(
                { error: 'CV analysis, interview evaluation, and selected role are required' },
                { status: 400 }
            );
        }

        const result = await startCVGeneration(cvAnalysis, interviewEvaluation, selectedRole, language);

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
