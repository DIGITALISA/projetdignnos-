import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Diagnosis from '@/models/Diagnosis';
import { generateProfessionalSmartCoach } from '@/lib/ai-professional-coach';

export async function POST(request: NextRequest) {
    try {
        const { email, language = 'en' } = await request.json();

        if (!email) {
            return NextResponse.json({ success: false, error: 'Email required' }, { status: 400 });
        }

        await connectDB();
        const userDiag = await Diagnosis.findOne({ userId: email }).lean();

        if (!userDiag) {
            return NextResponse.json({ success: false, error: 'No diagnosis found' }, { status: 404 });
        }

        const u = userDiag as Record<string, { finalReport?: unknown, grandFinalReport?: unknown }>;
        const progress = u.professionalProgress as { finalReport?: unknown, grandFinalReport?: unknown } | undefined;

        if (!progress || (!progress.finalReport && !progress.grandFinalReport)) {
            return NextResponse.json({ success: false, error: 'No completed diagnosis found' }, { status: 400 });
        }

        const coachingDataTarget = progress.grandFinalReport || progress.finalReport;

        const result = await generateProfessionalSmartCoach(coachingDataTarget, language);

        if (!result.success) {
            return NextResponse.json({ success: false, error: result.error }, { status: 500 });
        }

        return NextResponse.json({ success: true, consultation: result.consultation });
    } catch (error) {
        console.error('Smart Coach Error:', error);
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}
