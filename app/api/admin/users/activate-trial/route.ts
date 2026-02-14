import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const duration = existingUser.trialDurationHours || 1; // 1 hour default
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + duration);

        const user = await User.findByIdAndUpdate(userId, {
            status: "Active",
            role: "Trial User",
            isTrial: true
            // trialExpiry is omitted here so it gets set on first login
        }, { new: true });

        return NextResponse.json({
            success: true,
            message: `Trial activated for ${duration} hour(s)`,
            expiry: user.trialExpiry
        });
    } catch (error) {
        console.error("Trial Activation API error:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
