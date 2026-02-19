import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Course from "@/models/Course";
import Session from "@/models/Session";

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const userEmail = searchParams.get("email")?.toLowerCase().trim();

        if (!userEmail) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // STRICT LOGIC: Only show courses where the user is EXPLICITLY invited
        // No more public fallback. Every workshop must have its assigned accounts.
        const courses = await Course.find({
            status: "Published",
            allowedUsers: userEmail
        }).sort({ createdAt: -1 });

        const coursesWithSessionCount = await Promise.all(courses.map(async (course) => {
            const sessionsCount = await Session.countDocuments({ courseId: course._id });
            return {
                ...course.toObject(),
                sessions: sessionsCount
            };
        }));

        return NextResponse.json(coursesWithSessionCount);
    } catch (error) {
        console.error("User Courses API Error:", error);
        return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
    }
}
