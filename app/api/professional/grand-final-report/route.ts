import { NextRequest, NextResponse } from 'next/server';
import { generateGrandFinalReport } from '@/lib/deepseek';

export const maxDuration = 60; // 1 minute timeout for deep analysis

export async function POST(req: NextRequest) {
    try {
        const { auditResult, interviewTranscript, assessmentAnalysis, mindsetAnalysis, language } = await req.json();

        const result = await generateGrandFinalReport(
            auditResult,
            interviewTranscript,
            assessmentAnalysis,
            mindsetAnalysis,
            language || 'en'
        );

        if (result.success) {
            return NextResponse.json({ success: true, report: result.report });
        } else {
            return NextResponse.json({ success: false, error: result.error }, { status: 500 });
        }
    } catch (error) {
        console.error("Grand report API failed:", error);
        return NextResponse.json({ success: false, error: "Report generation failed" }, { status: 500 });
    }
}
