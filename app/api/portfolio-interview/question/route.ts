import { NextRequest, NextResponse } from "next/server";
import { generatePortfolioQuestion } from "@/lib/deepseek";

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try {
        const { auditResult, formData, interviewTranscript, mcqResults, currentHistory, language } = await req.json();

        if (!auditResult || !formData) {
            return NextResponse.json({ error: "Missing data" }, { status: 400 });
        }

        const question = await generatePortfolioQuestion(
            auditResult,
            formData,
            interviewTranscript || [],
            mcqResults || { hardScore: 0, softScore: 0, totalQuestions: 0 },
            currentHistory || [],
            language || "en"
        );

        return NextResponse.json({ success: true, question });
    } catch (error) {
        console.error("Portfolio Question API Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
