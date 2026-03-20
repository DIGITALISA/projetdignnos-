import { NextRequest, NextResponse } from 'next/server';
import { generateProfessionalAssessment } from '@/lib/deepseek';

export const maxDuration = 120;

export async function POST(req: NextRequest) {
    try {
        const { auditResult, narrative, messages, language } = await req.json();

        if (!auditResult || !narrative) {
            return NextResponse.json({ success: false, error: "Missing required data" }, { status: 400 });
        }

        const result = await generateProfessionalAssessment(
            auditResult,
            narrative,
            messages || [],
            language || 'en'
        );

        if (result.success) {
            return NextResponse.json({ success: true, questions: result.questions });
        } else {
            return NextResponse.json({ success: false, error: result.error }, { status: 500 });
        }
    } catch (error) {
        console.error("Assessment generation failed:", error);
        return NextResponse.json({ success: false, error: "Assessment generation failed" }, { status: 500 });
    }
}
