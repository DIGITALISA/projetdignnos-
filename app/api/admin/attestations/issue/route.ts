import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const { userId, workshopTitle, instructor } = await request.json();

        if (!userId || !workshopTitle) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        const referenceId = `CERT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
        const newAttestation = {
            workshopTitle,
            instructor: instructor || "Executive Expert",
            issueDate: new Date(),
            referenceId
        };

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { 
                $push: { attestations: newAttestation },
                $set: { workshopAttestationRequested: false }
            },
            { new: true, runValidators: false }
        ).lean();

        if (!updatedUser) {
            return NextResponse.json({ success: false, error: "Failed to update participant" }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: "Attestation issued successfully",
            attestation: newAttestation
        });

    } catch (error) {
        console.error("Issue Attestation Error:", error);
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
}
