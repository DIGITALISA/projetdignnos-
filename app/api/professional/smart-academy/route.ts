import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Diagnosis from '@/models/Diagnosis';
import { generateProfessionalSmartAcademyStructure } from '@/lib/ai-professional-academy';

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

        const u = userDiag as Record<string, { finalReport?: { level2Analysis?: { criticalGaps?: string[] } } }>;
        const progress = u.professionalProgress;

        if (!progress || !progress.finalReport) {
            return NextResponse.json({ success: false, error: 'No completed diagnosis found' }, { status: 400 });
        }

        // Try to get critical gaps from level2Analysis of the finalReport
        const gaps = progress.finalReport?.level2Analysis?.criticalGaps || [];
        
        if (gaps.length === 0) {
            // Backup, maybe grandFinalReport?
            gaps.push("Advanced Strategy & Leadership"); // Generic fallback
        }

        const result = await generateProfessionalSmartAcademyStructure(gaps, language);

        if (!result.success) {
            return NextResponse.json({ success: false, error: result.error }, { status: 500 });
        }

        return NextResponse.json({ success: true, structure: result.structure });
    } catch (error) {
        console.error('Smart Academy Structure Error:', error);
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}
