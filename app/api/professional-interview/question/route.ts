import { NextRequest, NextResponse } from "next/server";
import { generateProfessionalInterviewQuestion } from "@/lib/deepseek";

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try {
        const { auditResult, formData, conversationHistory, language } = await req.json();

        if (!auditResult || !formData) {
            return NextResponse.json({ error: "Missing data" }, { status: 400 });
        }

        const result = await generateProfessionalInterviewQuestion(
            auditResult,
            formData,
            conversationHistory || [],
            language || "en"
        );

        return NextResponse.json(result);
    } catch (error) {
        console.error("Interview Question API Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
