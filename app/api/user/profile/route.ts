import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: "User ID required" }, { status: 400 });
        }

        // Search by ID if it's a valid ObjectId, otherwise search by email
        const isObjectId = userId.length === 24 && /^[0-9a-fA-F]{24}$/.test(userId);
        const user = await User.findOne(
            isObjectId ? { $or: [{ _id: userId }, { email: userId }] } : { email: userId }
        ).select('-password -rawPassword').lean();

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            profile: user
        });

    } catch (error: unknown) {
        console.error("Fetch Profile Error:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
