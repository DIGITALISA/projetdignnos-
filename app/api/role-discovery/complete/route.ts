import { NextRequest, NextResponse } from 'next/server';
import { completeRoleDiscovery } from '@/lib/role-discovery';

export async function POST(request: NextRequest) {
    try {
        const { cvAnalysis, interviewEvaluation, conversationHistory, language = 'en' } = await request.json();

        if (!cvAnalysis || !interviewEvaluation || !conversationHistory) {
            return NextResponse.json(
                { error: 'CV analysis, interview evaluation, and conversation history are required' },
                { status: 400 }
            );
        }

        const result = await completeRoleDiscovery(cvAnalysis, interviewEvaluation, conversationHistory, language);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            roles: result.roles,
            closingMessage: result.closingMessage,
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
