import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Diagnosis from '@/models/Diagnosis';
import { generateProfessionalSmartAcademyModule } from '@/lib/ai-professional-academy';

export async function POST(request: NextRequest) {
    try {
        const { email, themeTitle, language = 'en' } = await request.json();

        if (!email || !themeTitle) {
            return NextResponse.json({ success: false, error: 'Email and theme title required' }, { status: 400 });
        }

        await connectDB();
        const userDiag = await Diagnosis.findOne({ userId: email }).lean();

        if (!userDiag) {
            return NextResponse.json({ success: false, error: 'No diagnosis found' }, { status: 404 });
        }

        const u = userDiag as Record<string, { finalReport?: { level2Analysis?: { criticalGaps?: string[] } } }>;
        const progress = u.professionalProgress;

        if (!progress || !progress.finalReport) {
            return NextResponse.json({ success: false, error: 'No completed diagnosis found' }, { status: 400 });
        }

        const gaps = progress.finalReport?.level2Analysis?.criticalGaps || [];
        if (gaps.length === 0) gaps.push("Advanced Strategy & Leadership");

        const result = await generateProfessionalSmartAcademyModule(themeTitle, gaps, language);

        if (!result.success) {
            return NextResponse.json({ success: false, error: result.error }, { status: 500 });
        }

        return NextResponse.json({ success: true, slides: result.content });
    } catch (error) {
        console.error('Smart Academy Module Generation Error:', error);
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}
