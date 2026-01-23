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
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch certificates" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { userId, userName, courseId, courseTitle } = body;

        // Generate a unique certificate ID
        const certificateId = `CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

        // Check if already issued
        const existing = await Certificate.findOne({ userId, courseId });
        if (existing) {
            return NextResponse.json({ message: "Certificate already issued", certificate: existing });
        }

        const certificate = await Certificate.create({
            userId,
            userName,
            courseId,
            courseTitle,
            certificateId
        });

        return NextResponse.json(certificate, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
