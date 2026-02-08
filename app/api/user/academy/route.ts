import { NextRequest, NextResponse } from 'next/server';
import { generateAcademyStructure } from '@/lib/deepseek';
import connectDB from '@/lib/mongodb';
import InterviewResult from '@/models/InterviewResult';

export async function POST(request: NextRequest) {
    try {
        const { userId, language = 'en' } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        await connectDB();
        const interviewResult = await InterviewResult.findOne({ userId }).sort({ createdAt: -1 });

        if (!interviewResult) {
            return NextResponse.json({ error: 'Diagnostic not found' }, { status: 404 });
        }

        const userProfile = { userId };
        const result = await generateAcademyStructure(userProfile, interviewResult.evaluation, language);

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
