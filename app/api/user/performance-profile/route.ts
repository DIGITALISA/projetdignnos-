import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PerformanceProfile from '@/models/PerformanceProfile';
import Certificate from '@/models/Certificate';
import Diagnosis from '@/models/Diagnosis';
import Simulation from '@/models/Simulation';
import { generatePerformanceProfile } from '@/lib/deepseek';

export async function POST(request: NextRequest) {
    try {
        const { userId, userName, language = 'en' } = await request.json();

        if (!userId || !userName) {
            return NextResponse.json({ error: 'User information required' }, { status: 400 });
        }

        await connectDB();

        // 1. Gather all data
        const certificates = await Certificate.find({ userId });
        const diagnosis = await Diagnosis.findOne({ userId, currentStep: 'completed' });
        const simulations = await Simulation.find({ userId, status: 'completed' });

        if (!diagnosis) {
            return NextResponse.json({ error: 'Diagnosis not found' }, { status: 404 });
        }

        // 2. Generate with AI
        const result = await generatePerformanceProfile(
            { fullName: userName, userId },
            certificates,
            diagnosis.analysis,
            simulations,
            language
        );

        if (!result.success || !result.profile) {
            return NextResponse.json({ error: 'AI Generation failed' }, { status: 500 });
        }

        // 3. Save to DB
        // Use the diagnosis reference ID as base if available to keep official assets consistent
        let referenceId = `PERF-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
        if (diagnosis && (diagnosis as { referenceId?: string }).referenceId) {
            const baseId = (diagnosis as { referenceId: string }).referenceId.split('-').pop();
            referenceId = `PERF-${new Date().getFullYear()}-${baseId}`;
        }
        const profile = await PerformanceProfile.findOneAndUpdate(
            { userId },
            {
                userName,
                summary: result.profile.summary,
                competencies: result.profile.competencies,
                verdict: result.profile.verdict,
                language,
                referenceId
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true, profile });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        await connectDB();
        const profile = await PerformanceProfile.findOne({ userId });

        if (!profile) {
            return NextResponse.json({ error: 'No profile found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, profile });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
