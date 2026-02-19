import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Diagnosis from "@/models/Diagnosis";
import Simulation from "@/models/Simulation";
import InterviewResult from "@/models/InterviewResult";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        await connectDB();
        const { userId } = await params;

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const user = await User.findById(userId) || await User.findOne({
            $or: [{ email: userId }, { fullName: userId }]
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const identifier = user.email || user.fullName;
        const query = {
            $or: [
                { userId: { $regex: new RegExp(`^${identifier}$`, 'i') } },
                { userId: identifier.toString() }
            ]
        };

        // Delete ONLY diagnosis-related data — keep certificates, scorecard, recommendations
        await Promise.all([
            Diagnosis.deleteMany(query),
            Simulation.deleteMany(query),
            InterviewResult.deleteMany(query),
        ]);

        // Reset ONLY diagnosis flags — keep canAccessCertificates, canAccessRecommendations, canAccessScorecard
        user.isDiagnosisComplete = false;
        user.resetRequested = false;
        user.diagnosisData = undefined;
        user.selectedRole = undefined;

        await user.save();

        return NextResponse.json({
            success: true,
            message: `Diagnosis data reset for ${user.fullName}. Certificates and other documents are preserved.`
        });

    } catch (error) {
        console.error("Admin Diagnosis Reset Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
