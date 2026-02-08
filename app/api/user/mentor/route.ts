import { NextRequest, NextResponse } from 'next/server';
import { generateMentorGuidance } from '@/lib/deepseek';
import connectDB from '@/lib/mongodb';
import InterviewResult from '@/models/InterviewResult';

export async function POST(request: NextRequest) {
    try {
        const { userId, userName, language = 'en' } = await request.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        await connectDB();

        // Fetch latest diagnostic (interview result)
        const interviewResult = await InterviewResult.findOne({ userId }).sort({ createdAt: -1 });

        if (!interviewResult) {
            return NextResponse.json(
                { error: 'No diagnostic results found. Please complete the assessment first.' },
                { status: 404 }
            );
        }

        const userProfile = {
            fullName: userName || 'Participant',
            userId: userId
        };

        const result = await generateMentorGuidance(
            userProfile,
            interviewResult.evaluation,
            language
        );

        if (!result.success) {
            console.error('Mentor Generation Error:', result.error);
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            guidance: result.guidance
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
