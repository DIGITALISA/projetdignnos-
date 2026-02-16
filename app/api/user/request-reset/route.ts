import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const query = {
            $or: [
                { email: userId },
                { email: { $regex: new RegExp(`^${userId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } },
                { fullName: userId },
                { fullName: { $regex: new RegExp(`^${userId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } }
            ]
        };

        const updatedUser = await User.findOneAndUpdate(query, { resetRequested: true }, { new: true });

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Reset request sent successfully to administration.",
            updatedEmail: updatedUser.email
        });

    } catch (error) {
        console.error("Reset Request Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
