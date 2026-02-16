import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PerformanceProfile from '@/models/PerformanceProfile';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        await connectDB();
        const { userId } = await params;
        const { expertNotes } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: "No User ID provided" }, { status: 400 });
        }

        let user = null;
        if (mongoose.Types.ObjectId.isValid(userId)) {
            user = await User.findById(userId);
        }
        if (!user) {
            user = await User.findOne({ email: userId });
        }
        if (!user) {
            user = await User.findOne({ fullName: userId });
        }

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const identifier = user.email || user.fullName;

        // Save expert notes in PerformanceProfile (creating it if it doesn't exist)
        await PerformanceProfile.findOneAndUpdate(
            { userId: identifier },
            { 
                expertNotes,
                userName: user.fullName 
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true, message: "Expert notes saved successfully" });

    } catch (error: unknown) {
        console.error("Update Expert Notes API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
