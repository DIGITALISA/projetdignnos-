import { NextRequest, NextResponse } from 'next/server';
import { generateRecommendationLetter } from '@/lib/deepseek';
import connectDB from '@/lib/mongodb';
import Recommendation from '@/models/Recommendation';
import Certificate from '@/models/Certificate';
import InterviewResult from '@/models/InterviewResult';

export async function POST(request: NextRequest) {
    try {
        const { userId, userName, language = 'en' } = await request.json();

        if (!userId || !userName) {
            return NextResponse.json(
                { error: 'User information is required' },
                { status: 400 }
            );
        }

        await connectDB();

        // Check if a recommendation already exists for this user
        const existingRecommendation = await Recommendation.findOne({ userId }).sort({ createdAt: -1 });

        // If the user wants to regenerate or if none exists, we proceed.
        // For simplicity, let's always generate a new one if requested via POST, 
        // but the frontend can use GET to just fetch the latest.

        // Fetch completed courses (certificates)
        const certificates = await Certificate.find({ userId });

        // Fetch latest interview result
        const interviewResult = await InterviewResult.findOne({ userId }).sort({ createdAt: -1 });

        if (!interviewResult) {
            return NextResponse.json(
                { error: 'No interview results found. Please complete the assessment first.' },
                { status: 404 }
            );
        }

        const userProfile = {
            fullName: userName,
            userId: userId
        };

        const result = await generateRecommendationLetter(
            userProfile,
            certificates,
            interviewResult.evaluation,
            language
        );

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }

        // Generate a unique reference ID
        const referenceId = `RECOM-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

        // Save recommendation
        const recommendation = await Recommendation.create({
            userId,
            userName,
            subject: result.recommendation.subject,
            content: result.recommendation.content,
            keyEndorsements: result.recommendation.keyEndorsements,
            language,
            referenceId
        });

        return NextResponse.json({
            success: true,
            recommendation
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        await connectDB();
        const recommendation = await Recommendation.findOne({ userId }).sort({ createdAt: -1 });

        if (!recommendation) {
            return NextResponse.json(
                { error: 'No recommendation letter found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            recommendation
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
