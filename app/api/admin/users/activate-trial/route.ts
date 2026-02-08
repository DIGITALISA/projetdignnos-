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

        const expiry = new Date();
        expiry.setHours(expiry.getHours() + 3);

        const user = await User.findByIdAndUpdate(userId, {
            status: "Active",
            role: "Trial User",
            isTrial: true,
            trialExpiry: expiry
        }, { new: true });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Here you would normally trigger a WhatsApp or Email notification
        // For now, we simulate success

        return NextResponse.json({
            success: true,
            message: "Trial activated for 3 hours",
            expiry: user.trialExpiry
        });
    } catch (error: any) {
        console.error("Trial Activation API error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
