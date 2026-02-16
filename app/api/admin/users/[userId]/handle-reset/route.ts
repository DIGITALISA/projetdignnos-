import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Diagnosis from "@/models/Diagnosis";
import Simulation from "@/models/Simulation";
import PerformanceProfile from "@/models/PerformanceProfile";
import InterviewResult from "@/models/InterviewResult";
import Certificate from "@/models/Certificate";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        await connectDB();
        const { userId } = await params;
        const { action } = await request.json(); // "approve" or "reject"

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const user = await User.findById(userId) || await User.findOne({ 
            $or: [{ email: userId }, { fullName: userId }] 
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (action === "reject") {
            user.resetRequested = false;
            await user.save();
            return NextResponse.json({ success: true, message: "Reset request rejected." });
        }

        if (action === "approve") {
            const identifier = user.email || user.fullName;
            const query = { 
                $or: [
                    { userId: { $regex: new RegExp(`^${identifier}$`, 'i') } },
                    { userId: identifier.toString() }
                ]
            };

            // 1. Delete all progress data
            await Promise.all([
                Diagnosis.deleteMany(query),
                Simulation.deleteMany(query),
                PerformanceProfile.deleteMany(query),
                InterviewResult.deleteMany(query),
                Certificate.deleteMany(query),
                // Add any other progress models here
            ]);

            // 2. Reset user flags
            user.isDiagnosisComplete = false;
            user.resetRequested = false;
            user.canAccessCertificates = false;
            user.canAccessRecommendations = false;
            user.canAccessScorecard = false;
            user.scorecardRequested = false;
            user.diagnosisData = undefined;
            user.selectedRole = undefined;
            
            await user.save();

            return NextResponse.json({ 
                success: true, 
                message: "User progress has been fully reset. They can now start from the beginning." 
            });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    } catch (error) {
        console.error("Admin Reset Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
