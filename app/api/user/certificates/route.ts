import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Certificate from "@/models/Certificate";

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "userId is required" }, { status: 400 });
        }

        const certificates = await Certificate.find({ userId }).populate('courseId').sort({ createdAt: -1 });
        return NextResponse.json(certificates);
    } catch (error: unknown) {
        console.error("Fetch Certificates Error:", error);
        return NextResponse.json({ error: "Failed to fetch certificates" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { userId, userName, courseId, courseTitle } = body;

        // Fetch user's domain from Diagnosis
        const Diagnosis = (await import("@/models/Diagnosis")).default;
        const diagnosis = await Diagnosis.findOne({ userId }).sort({ createdAt: -1 });
        const domain = diagnosis?.analysis?.careerPaths?.[0] || "Strategic Management";

        // Generate a unique professional certificate ID
        let certificateId = `WARRANT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
        if (diagnosis && (diagnosis as { referenceId?: string }).referenceId) {
            const baseId = (diagnosis as { referenceId: string }).referenceId.split('-').pop();
            certificateId = `WARRANT-${new Date().getFullYear()}-${baseId}`;
        }

        // Check if already issued
        const existing = await Certificate.findOne({ userId, courseId });
        if (existing) {
            return NextResponse.json({ message: "Warrant already issued", certificate: existing });
        }

        const certificate = await Certificate.create({
            userId,
            userName,
            courseId,
            courseTitle: courseTitle || domain,
            certificateId,
            metadata: {
                domain: domain,
                auditLevel: "Elite",
                overallScore: diagnosis?.analysis?.overallScore || 0
            }
        });

        return NextResponse.json(certificate, { status: 201 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ error: message }, { status: 400 });
    }
}
