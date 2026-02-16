import { NextRequest, NextResponse } from 'next/server';
import { completeCVGeneration } from '@/lib/cv-generation';

export async function POST(request: NextRequest) {
    try {
        const {
            cvAnalysis,
            interviewEvaluation,
            selectedRole,
            conversationHistory,
            language = 'en'
        } = await request.json();

        const missingParams = [];
        if (!cvAnalysis) missingParams.push('cvAnalysis');
        if (!interviewEvaluation) missingParams.push('interviewEvaluation');
        if (!selectedRole) missingParams.push('selectedRole');
        if (!conversationHistory) missingParams.push('conversationHistory');

        if (missingParams.length > 0) {
            console.error('Missing parameters in /api/cv-generation/complete:', missingParams);
            return NextResponse.json(
                { error: `Missing parameters: ${missingParams.join(', ')}` },
                { status: 400 }
            );
        }

        const result = await completeCVGeneration(
            cvAnalysis,
            interviewEvaluation,
            selectedRole,
            conversationHistory,
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
            documents: result.documents,
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
