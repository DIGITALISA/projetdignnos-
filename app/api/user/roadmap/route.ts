// Force refresh - Strategic Career Roadmap API
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { generateCareerRoadmap } from "@/lib/deepseek";

export async function POST(req: Request) {
    try {
        const { userId, language } = await req.json();

        if (!userId) {
            return NextResponse.json({ success: false, error: "Missing user ID" }, { status: 400 });
        }

        await connectDB();
        const user = await User.findById(userId);

        if (!user || (!user.diagnosisData && !user.diagnosis)) {
            return NextResponse.json({ success: false, error: "Diagnosis data not found" }, { status: 404 });
        }

        const diagnosis = user.diagnosisData?.report || user.diagnosis?.analysis || user.diagnosis;

        const roadmapData = await generateCareerRoadmap(
            { fullName: user.fullName, email: user.email },
            diagnosis,
            language || 'fr'
        );

        return NextResponse.json(roadmapData);
    } catch (error) {
        console.error("Roadmap API error:", error);
        return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
    }
}
