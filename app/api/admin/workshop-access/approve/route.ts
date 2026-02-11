import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Course from '@/models/Course';

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const { userId, courseId } = await request.json();

        if (!userId || !courseId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Find User to get their email
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // 2. Find Course and add user email to allowedUsers
        const course = await Course.findById(courseId);
        if (!course) {
            return NextResponse.json({ error: "Workshop not found" }, { status: 404 });
        }

        // Add email to allowedUsers if not already there
        if (!course.allowedUsers.includes(user.email)) {
            course.allowedUsers.push(user.email);
            // Also set isAccessOpen to true for this course if it's the gatekeeper
            // course.isAccessOpen = true; // Optional: depends if admin wants global open
            await course.save();
        }

        // 3. Remove from pending requests
        await User.findByIdAndUpdate(userId, {
            $pull: { workshopAccessRequests: courseId }
        });

        return NextResponse.json({
            success: true,
            message: "Access granted successfully"
        });

    } catch (error: unknown) {
        console.error("Workshop Approval Error:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
