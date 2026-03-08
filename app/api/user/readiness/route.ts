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

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Auto-set firstLoginAt for Student Free Trial users (starts their 3-hour trial clock)
    const isStudentFreeTrial = user.plan === "Student" && 
                               (user.role === "Free Tier" || user.role === "Trial User");
    if (isStudentFreeTrial && !user.firstLoginAt) {
      await User.updateOne(
        { _id: user._id },
        { $set: { firstLoginAt: new Date() } }
      );
      (user as Record<string, unknown>).firstLoginAt = new Date();
    }


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

    const hasStartedDiagnosis = !!diagnosis;
    const hasDiagnosis = !!diagnosis && (
        diagnosis.currentStep === "completed" || 
        diagnosis.currentStep === "interview_complete" ||
        diagnosis.completionStatus?.interviewComplete ||
        diagnosis.completionStatus?.strategicReportComplete || 
        !!diagnosis.analysis?.sciReport
    );
    const hasSCI = !!((diagnosis?.analysis as Record<string, unknown>)?.sciReport) || !!diagnosis?.simulationReport;
    const hasCompletedSimulation = simulations.length > 0 || !!diagnosis?.completionStatus?.simulationComplete;
    
    // --- STUDENT PLAN LOGIC ---
    let studentCertReady = false;
    let studentScorecardReady = false;
    let studentSciReady = false;

    if (user?.plan === "Student") {
        const isUnlimited = user.activationType === "Unlimited";
        
        // 1. AI & SCI are always free for Students once diagnosis is done
        if (hasDiagnosis) {
            studentSciReady = true;
        }

        // 2. 3-Month Rule for Certificates/Documents (Bypassed if Unlimited)
        const creationDate = user.createdAt ? new Date(user.createdAt) : new Date();
        const now = new Date();
        const diffInMonths = (now.getFullYear() - creationDate.getFullYear()) * 12 + (now.getMonth() - creationDate.getMonth());
        
        if (diffInMonths >= 3 || isUnlimited) {
            studentCertReady = true;
        }

        // 3. Scorecard unlocks only if Simulation is complete (Bypassed if Unlimited)
        if (hasCompletedSimulation || isUnlimited) {
            studentScorecardReady = true;
        }
    }

    // --- PROFESSIONAL PLAN LOGIC ---
    let proReady = false;
    if (user?.plan === "Professional") {
        const proProg = user.professionalProgress as { phase?: number };
        // If they reached phase 9 or have it marked as current/completed
        if (proProg?.phase && proProg.phase >= 9) {
            proReady = true;
        }
    }

    // PROGRESSIVE LOGIC (The "Hierarchy")
    // ... (rest of the steps logic below)

    // LEGACY & OVERRIDES SUPPORT
    const sciReady = user?.canAccessSCI || hasSCI || studentSciReady || proReady;
    const certReady = user?.canAccessCertificates || studentCertReady || proReady;
    const recReady = user?.canAccessRecommendations || studentCertReady || proReady;
    const scorecardReady = user?.canAccessScorecard || studentScorecardReady || proReady;

    const steps = [
        { id: 'diagnosis', label: 'Initial Diagnosis', isComplete: hasDiagnosis, isLocked: false },
        { id: 'sci', label: 'Strategic Intelligence', isComplete: sciReady, isLocked: !hasDiagnosis },
        { id: 'simulation', label: 'Executive simulation', isComplete: hasCompletedSimulation, isLocked: (!sciReady && !hasDiagnosis) },
        { id: 'scorecard', label: 'Performance Analytics', isComplete: scorecardReady, isLocked: (!hasCompletedSimulation) },
        { id: 'certification', label: 'Strategic Certification', isComplete: certReady, isLocked: (!scorecardReady && user?.plan !== "Student") }
    ];

    return NextResponse.json({
      success: true,
      currentStep: steps.find(s => !s.isComplete)?.id || 'completed',
      steps,
      isReady: certReady && recReady,
      certReady,
      recReady,
      scorecardReady,
      sciReady,
      isDiagnosticComplete: hasDiagnosis,
      plan: user?.plan || "Free Trial",
      role: user?.role || "Trial User",
      details: {
        hasDiagnosis,
        hasStartedDiagnosis,
        hasSCI: sciReady,
        hasCompletedSimulation,
        hasScorecard: scorecardReady,
        activationType: user?.activationType,
        firstLoginAt: user?.firstLoginAt,
        visitedModules: user?.visitedModules || []
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

export async function POST(req: Request) {
    try {
        await connectDB();
        const { userId, moduleHref } = await req.json();

        if (!userId || !moduleHref) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        const user = await User.findOne({
            $or: [
                { email: { $regex: new RegExp(`^${userId}$`, "i") } },
                { fullName: { $regex: new RegExp(`^${userId}$`, "i") } },
            ],
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Only track for Limited Students
        if (user.plan === "Student" && user.activationType === "Limited") {
            if (!user.visitedModules.includes(moduleHref)) {
                user.visitedModules.push(moduleHref);
                await user.save();
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Visit Track Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
