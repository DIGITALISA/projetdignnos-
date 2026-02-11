import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const { userId, workshopTitle } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const updates: { workshopAttestationStatus: string; grantedWorkshopTitle?: string } = { 
            workshopAttestationStatus: "Granted"
        };
        
        if (workshopTitle) {
            updates.grantedWorkshopTitle = workshopTitle;
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Attestation granted successfully",
            status: user.workshopAttestationStatus
        });

    } catch (error: unknown) {
        console.error("Attestation Grant Error:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
