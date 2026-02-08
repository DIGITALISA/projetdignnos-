import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const { email, userId, updates } = await request.json();

        if (!email && !userId) {
            return NextResponse.json({ error: "User identifier required" }, { status: 400 });
        }

        const user = await User.findOneAndUpdate(
            { $or: [{ email }, { _id: userId }] },
            { $set: updates },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            user
        });

    } catch (error: any) {
        console.error("Profile Update Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
