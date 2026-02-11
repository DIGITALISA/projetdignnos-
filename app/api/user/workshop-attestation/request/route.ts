import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const { userId, workshopTitle } = await request.json();

        if (!userId || !workshopTitle) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Search by ID if it's a valid ObjectId, otherwise search by email
        const isObjectId = userId.length === 24 && /^[0-9a-fA-F]{24}$/.test(userId);
        const user = await User.findOneAndUpdate(
            isObjectId ? { $or: [{ email: userId }, { _id: userId }] } : { email: userId },
            { 
                $set: { 
                    workshopAttestationRequested: true,
                    workshopAttestationStatus: "Requested",
                    grantedWorkshopTitle: workshopTitle // Current request workshop
                } 
            },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Attestation requested successfully",
            status: user.workshopAttestationStatus
        });

    } catch (error: unknown) {
        console.error("Attestation Request Error:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
