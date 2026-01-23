import { NextRequest, NextResponse } from 'next/server';
import { evaluateInterview } from '@/lib/deepseek';
import connectDB from '@/lib/mongodb';
import InterviewResult from '@/models/InterviewResult';

export async function POST(request: NextRequest) {
    try {
        const { cvAnalysis, conversationHistory, language = 'en', userId, userName } = await request.json();

        if (!cvAnalysis || !conversationHistory) {
            return NextResponse.json(
                { error: 'CV analysis and conversation history are required' },
                { status: 400 }
            );
        }

        const result = await evaluateInterview(cvAnalysis, conversationHistory, language);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }

        // Save to MongoDB if user info is provided
        if (userId && userName) {
            try {
                await connectDB();
                await InterviewResult.create({
                    userId,
                    userName,
                    cvAnalysis,
                    conversationHistory,
                    evaluation: result.evaluation,
                    language
                });
            } catch (dbError) {
                console.error('Database Error:', dbError);
            }
        }

        return NextResponse.json({
            success: true,
            evaluation: result.evaluation,
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
