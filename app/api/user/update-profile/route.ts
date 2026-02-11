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

        // Create a safe search query
        const searchQuery: Record<string, string | [{ email: string }, { _id: string }] | unknown> = {};
        if (email) {
            searchQuery.email = email;
        } else if (userId) {
            const isObjectId = userId.length === 24 && /^[0-9a-fA-F]{24}$/.test(userId);
            if (isObjectId) {
                searchQuery.$or = [{ email: userId }, { _id: userId }];
            } else {
                searchQuery.email = userId;
            }
        }

        const user = await User.findOneAndUpdate(
            searchQuery,
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

    } catch (error: unknown) {
        console.error("Profile Update Error:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
