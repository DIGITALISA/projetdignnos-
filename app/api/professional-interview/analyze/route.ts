import { NextRequest, NextResponse } from "next/server";
import { analyzeProfessionalInterview } from "@/lib/deepseek";
import connectDB from "@/lib/mongodb";
import Diagnosis from "@/models/Diagnosis";

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try {
        const { auditResult, formData, conversationHistory, language, userId } = await req.json();

        if (!auditResult || !formData || !conversationHistory) {
            return NextResponse.json({ error: "Missing data" }, { status: 400 });
        }

        const result = await analyzeProfessionalInterview(
            auditResult,
            formData,
            conversationHistory,
            language || "en"
        );

        if (result.success && userId) {
            try {
                await connectDB();
                await Diagnosis.findOneAndUpdate(
                    { userId },
                    {
                        $set: {
                            "analysis.finalStrategicReport": result.report,
                            "analysis.interviewTranscript": conversationHistory,
                            currentStep: "final_strategic_analysis_complete",
                            updatedAt: new Date()
                        }
                    }
                );
            } catch (dbError) {
                console.error("Database Save Error (Final Report):", dbError);
            }
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("Interview Analysis API Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
