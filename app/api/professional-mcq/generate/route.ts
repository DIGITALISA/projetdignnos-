import { NextRequest, NextResponse } from "next/server";
import { generateProfessionalMCQ } from "@/lib/deepseek";

export async function POST(req: NextRequest) {
  try {
    const { auditResult, formData, interviewTranscript, type, count, language } = await req.json();

    if (!auditResult || !formData) {
      return NextResponse.json({ success: false, error: "Missing required data" }, { status: 400 });
    }

    const result = await generateProfessionalMCQ(
      auditResult,
      formData,
      interviewTranscript || [],
      type || 'hard',
      count || 15,
      language || 'en'
    );

    if (result.success) {
      return NextResponse.json({ success: true, questions: result.questions });
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("MCQ Generation API Error:", errorMsg);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
