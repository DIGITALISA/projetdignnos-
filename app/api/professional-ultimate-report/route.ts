import { NextRequest, NextResponse } from "next/server";
import { generateUltimateStrategicReport } from "@/lib/deepseek";
import { connectToDatabase } from "@/lib/mongodb";
import Diagnosis from "@/models/Diagnosis";

export async function POST(req: NextRequest) {
  try {
    const { auditResult, formData, interviewTranscript, mcqResults, language, userId } = await req.json();

    if (!auditResult || !formData) {
      return NextResponse.json({ success: false, error: "Missing required data" }, { status: 400 });
    }

    const result = await generateUltimateStrategicReport(
      auditResult,
      formData,
      interviewTranscript || [],
      mcqResults || [],
      language || 'en'
    );

    if (result.success) {
      // Persist to DB if userId is provided
      if (userId) {
        try {
          await connectToDatabase();
          await Diagnosis.findOneAndUpdate(
            { userId: userId },
            { 
              $set: { 
                ultimateStrategicReport: result.report,
                lastUpdated: new Date()
              } 
            },
            { upsert: true }
          );
        } catch (dbErr) {
          console.error("DB Update Error (Ultimate Report):", dbErr);
        }
      }

      return NextResponse.json({ success: true, report: result.report });
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Ultimate Report API Error:", errorMsg);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
