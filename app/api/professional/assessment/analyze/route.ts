import { NextRequest, NextResponse } from 'next/server';
import { analyzeAssessmentResults } from '@/lib/deepseek';

export const maxDuration = 120;

export async function POST(req: NextRequest) {
    try {
        const { questions, userAnswers, auditResult, language } = await req.json();

        if (!questions || !userAnswers || !auditResult) {
            return NextResponse.json({ success: false, error: "Missing required data" }, { status: 400 });
        }

        const result = await analyzeAssessmentResults(
            questions,
            userAnswers,
            auditResult,
            language || 'en'
        );

        if (result.success) {
            return NextResponse.json({ success: true, analysis: result.analysis });
        } else {
            return NextResponse.json({ success: false, error: result.error }, { status: 500 });
        }
    } catch (error) {
        console.error("Assessment analysis failed:", error);
        return NextResponse.json({ success: false, error: "Assessment analysis failed" }, { status: 500 });
    }
}
