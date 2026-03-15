import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email }).select("professionalProgress").lean();

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: user.professionalProgress || null,
    });
  } catch (error) {
    console.error("Error fetching professional progress:", error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

import Diagnosis from "@/models/Diagnosis";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, ...progressData } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    await connectDB();
    
    // Construct the update object to set nested fields inside professionalProgress
    const updateObj: Record<string, unknown> = {};
    Object.keys(progressData).forEach(key => {
      updateObj[`professionalProgress.${key}`] = progressData[key];
    });

    const user = await User.findOneAndUpdate(
      { email },
      { $set: updateObj },
      { new: true }
    ).select("professionalProgress");

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // ─── Dual-Sync: Also update the Diagnosis record for expert review visibility ───
    // Map progressData keys to Diagnosis fields if they match
    const diagnosisUpdate: Record<string, unknown> = {};
    if (progressData.finalReport) diagnosisUpdate.professionalFinalReport = progressData.finalReport;
    if (progressData.auditResult) diagnosisUpdate.professionalAuditResult = progressData.auditResult;
    if (progressData.interviewTranscript) diagnosisUpdate.professionalInterviewTranscript = progressData.interviewTranscript;
    if (progressData.mcqResults) diagnosisUpdate.professionalMCQResults = progressData.mcqResults;
    if (progressData.simulationResult) diagnosisUpdate.professionalSimulationResult = progressData.simulationResult;
    if (progressData.step) diagnosisUpdate.currentStep = progressData.step;

    if (Object.keys(diagnosisUpdate).length > 0) {
       await Diagnosis.findOneAndUpdate(
         { userId: email },
         { $set: diagnosisUpdate },
         { upsert: true }
       );
    }

    return NextResponse.json({
      success: true,
      message: "Progress saved successfully and synced with Diagnosis",
    });
  } catch (error) {
    console.error("Error saving professional progress:", error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
