import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Simulation from "@/models/Simulation";
import Diagnosis from "@/models/Diagnosis";

export async function GET() {
    try {
        await connectDB();

        const [
            totalUsers,
            pendingUsers,
            activeTrials,
            completedDiagnoses,
            totalSimulations
        ] = await Promise.all([
            User.countDocuments({ role: { $ne: 'Admin' } }),
            User.countDocuments({ status: 'Pending' }),
            User.countDocuments({ role: 'Trial User', status: 'Active' }),
            Diagnosis.countDocuments({ currentStep: 'completed' }),
            Simulation.countDocuments({})
        ]);

        return NextResponse.json({
            success: true,
            stats: {
                totalUsers,
                pendingUsers,
                activeTrials,
                completedDiagnoses,
                totalSimulations
            }
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
