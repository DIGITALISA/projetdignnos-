import { NextRequest, NextResponse } from "next/server";
import { analyzePortfolioInterview } from "@/lib/deepseek";
import connectDB from "@/lib/mongodb";
import Diagnosis from "@/models/Diagnosis";

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try {
        const { auditResult, formData, interview1Transcript, mcqResults, portfolioTranscript, language, userId } = await req.json();

        if (!auditResult || !formData) {
            return NextResponse.json({ error: "Missing data" }, { status: 400 });
        }

        const result = await analyzePortfolioInterview(
            auditResult,
            formData,
            interview1Transcript || [],
            mcqResults || { hardScore: 0, softScore: 0, totalQuestions: 0 },
            portfolioTranscript || [],
            language || "en"
        );

        if (result.success && userId) {
            try {
                await connectDB();
                // Ensure the report is saved as an object if possible, or stringified
                await Diagnosis.findOneAndUpdate(
                    { userId: userId },
                    { 
                        $set: { 
                            ultimateStrategicReport: result.report,
                            "completionStatus.strategicReportComplete": true,
                            lastUpdated: new Date()
                        } 
                    },
                    { upsert: true }
                );
            } catch (dbErr) {
                console.error("DB Save Error (Ultimate Report):", dbErr);
            }
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("Portfolio Analyze API Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
