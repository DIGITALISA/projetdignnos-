import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Certificate from "@/models/Certificate";
import Recommendation from "@/models/Recommendation";

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Certificate ID is required" }, { status: 400 });
        }

        // Try to find in Certificates
        let document = await Certificate.findOne({ certificateId: id });
        let type = 'certificate';

        // If not found, try Recommendations
        if (!document) {
            document = await Recommendation.findOne({ referenceId: id });
            type = 'recommendation';
        }

        if (!document) {
            return NextResponse.json({ error: "Document not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            type,
            data: {
                userName: document.userName,
                title: type === 'certificate' ? document.courseTitle : document.subject,
                date: document.createdAt,
                status: 'Verified',
                referenceId: id
            }
        });
    } catch (error: any) {
        console.error("Verification Error:", error);
        return NextResponse.json({ error: "Verification failed" }, { status: 500 });
    }
}
