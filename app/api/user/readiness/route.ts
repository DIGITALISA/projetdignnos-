import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Diagnosis from "@/models/Diagnosis";
import Simulation from "@/models/Simulation";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    // Check User specific overrides
    const user = await User.findOne({
      $or: [
        { email: { $regex: new RegExp(`^${userId}$`, "i") } },
        { fullName: { $regex: new RegExp(`^${userId}$`, "i") } },
      ],
    }).lean();

    // Check Diagnosis
    const diagnosis = await Diagnosis.findOne({
      $or: [
        { userId: { $regex: new RegExp(`^${userId}$`, "i") } },
        { userId: userId.toString() },
      ],
    }).sort({ updatedAt: -1 }).lean();

    // Check simulations (completed missions)
    const simulations = await Simulation.find({
      $or: [
        { userId: { $regex: new RegExp(`^${userId}$`, "i") } },
        { userId: userId.toString() },
      ],
      status: "completed",
    }).lean();

    const hasDiagnosis = !!diagnosis && (diagnosis as { currentStep: string }).currentStep === "completed";
    const hasSCI = !!((diagnosis?.analysis as Record<string, unknown>)?.sciReport);
    const hasCompletedSimulation = simulations.length > 0;
    
    // PROGRESSIVE LOGIC (The "Hierarchy")
    // 1. Diagnosis must be done to see SCI
    // 2. SCI must be done to unlock Simulation (Strategic context)
    // 3. Simulation must be done to unlock Performance Scorecard
    // 4. Scorecard/Profile must be validated by Expert for Recommendations/Certificates

    // LEGACY & OVERRIDES SUPPORT
    // Priority: Manual Admin Flag > Auto-detection
    const sciReady = user?.canAccessSCI || hasSCI;
    const certReady = user?.canAccessCertificates;
    const recReady = user?.canAccessRecommendations;
    const scorecardReady = user?.canAccessScorecard;

    const steps = [
        { id: 'diagnosis', label: 'Initial Diagnosis', isComplete: hasDiagnosis, isLocked: false },
        { id: 'sci', label: 'Strategic Intelligence', isComplete: sciReady, isLocked: !hasDiagnosis },
        { id: 'simulation', label: 'Executive simulation', isComplete: hasCompletedSimulation, isLocked: (!sciReady && !hasDiagnosis) },
        { id: 'scorecard', label: 'Performance Analytics', isComplete: scorecardReady, isLocked: (!hasCompletedSimulation) },
        { id: 'certification', label: 'Strategic Certification', isComplete: certReady, isLocked: (!scorecardReady) }
    ];

    return NextResponse.json({
      success: true,
      currentStep: steps.find(s => !s.isComplete)?.id || 'completed',
      steps,
      isReady: certReady && recReady, // Overall ready for core assets
      certReady,
      recReady,
      scorecardReady,
      sciReady,
      isDiagnosticComplete: hasDiagnosis,
      plan: user?.plan || "Free Trial",
      role: user?.role || "Trial User",
      details: {
        hasDiagnosis,
        hasSCI: sciReady,
        hasCompletedSimulation,
        hasScorecard: scorecardReady
      },
    });
  } catch (error) {
    console.error("Readiness API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
