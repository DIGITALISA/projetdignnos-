import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Simulation from "@/models/Simulation";
import Diagnosis from "@/models/Diagnosis";
import CorporateInquiry from "@/models/CorporateInquiry";

// Simple in-memory cache
interface CachedStats {
  totalUsers: number;
  pendingUsers: number;
  activeTrials: number;
  completedDiagnoses: number;
  totalSimulations: number;
  corporateReady: number;
  totalInquiries: number;
}

let cachedStats: CachedStats | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 30000; // 30 seconds

export async function GET() {
  try {
    // Check cache first
    const now = Date.now();
    if (cachedStats && now - cacheTimestamp < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        stats: cachedStats,
        cached: true,
      });
    }

    await connectDB();

    const [
      totalUsers,
      pendingUsers,
      activeTrials,
      completedDiagnoses,
      totalSimulations,
      corporateReady,
      totalInquiries,
      resetRequests, 
      attestationRequests,
      scorecardRequests,
      workshopAccessRequests,
    ] = await Promise.all([
      User.countDocuments({ 
        role: { $nin: ["Admin", "Moderator"] }, 
        status: "Active" 
      }),
      User.countDocuments({ status: "Pending" }),
      User.countDocuments({ role: "Trial User", status: "Active" }),
      Diagnosis.countDocuments({ currentStep: "completed" }),
      Simulation.countDocuments({}),
      Diagnosis.countDocuments({
        "completionStatus.strategicReportComplete": true,
      }),
      CorporateInquiry.countDocuments({}),
      User.countDocuments({ resetRequested: true }),
      User.countDocuments({ workshopAttestationStatus: "Requested" }),
      User.countDocuments({ scorecardRequested: true }),
      User.countDocuments({ "workshopAccessRequests.0": { $exists: true } })
    ]);

    const stats = {
      totalUsers,
      pendingUsers:
        pendingUsers + resetRequests + attestationRequests + scorecardRequests + workshopAccessRequests,
      activeTrials,
      completedDiagnoses,
      totalSimulations,
      corporateReady,
      totalInquiries,
    };

    // Update cache
    cachedStats = stats;
    cacheTimestamp = now;

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
