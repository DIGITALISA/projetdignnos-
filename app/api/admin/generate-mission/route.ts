import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Diagnosis from "@/models/Diagnosis";
import { generateSimulationMissionAI } from "@/lib/admin-simulation-ai";

export async function POST(req: Request) {
    try {
        const { userId, missionType, language } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "UserId is required" }, { status: 400 });
        }

        await connectDB();

        // Find the latest diagnosis for this user (case-insensitive)
        const diagnosis = await Diagnosis.findOne({
            userId: { $regex: new RegExp(`^${userId}$`, 'i') }
        }).sort({ createdAt: -1 });

        if (!diagnosis) {
            return NextResponse.json({
                error: "No diagnostic data found for this user. Please ask the user to complete their CV audit first."
            }, { status: 404 });
        }

        const mission = await generateSimulationMissionAI(diagnosis, missionType || 'Executive Coaching', language || 'en');

        return NextResponse.json({ success: true, mission });

    } catch (error: any) {
        console.error("Generate Mission API Error:", error);
        return NextResponse.json({
            success: false,
            error: error.message || "Failed to generate mission",
            details: error.stack || ""
        }, { status: 500 });
    }
}

