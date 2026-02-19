import { NextRequest, NextResponse } from 'next/server';
import { generateRecommendationLetter } from '@/lib/deepseek';
import connectDB from '@/lib/mongodb';
import Recommendation from '@/models/Recommendation';
import Certificate from '@/models/Certificate';
import Diagnosis from '@/models/Diagnosis';
import Simulation from '@/models/Simulation';

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

        function escapeRegExp(string: string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }

        const userQuery = { 
            $or: [
                { userId: { $regex: new RegExp(`^${escapeRegExp(userId)}$`, 'i') } },
                { userId: userId.toString() }
            ]
        };

        // Fetch completed courses (certificates)
        const certificates = await Certificate.find(userQuery);

        // Fetch Diagnosis (Audit)
        // We look for any completed diagnosis or one with a report ready
        const diagnosis = await Diagnosis.findOne({ 
            ...userQuery,
            $or: [{ currentStep: 'completed' }, { 'analysis.sciReport': { $exists: true } }]
        }).sort({ updatedAt: -1 });

        // Fetch Simulations
        const simulations = await Simulation.find({ 
            ...userQuery,
            status: 'completed' 
        });

        if (!diagnosis) {
            return NextResponse.json(
                { error: 'No completed diagnosis found. Please complete the assessment first.' },
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
            diagnosis.analysis,
            simulations,
            language
        );

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }

        // Generate a unique reference ID
        // Use the diagnosis reference ID as base if available to keep official assets consistent
        let referenceId = `RECOM-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
        if (diagnosis && (diagnosis as { referenceId?: string }).referenceId) {
            const baseId = (diagnosis as { referenceId: string }).referenceId.split('-').pop();
            referenceId = `RECOM-${new Date().getFullYear()}-${baseId}`;
        }

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
