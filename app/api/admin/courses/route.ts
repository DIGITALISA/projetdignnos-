import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Course from "@/models/Course";
import Session from "@/models/Session";

export async function GET() {
    try {
        await connectDB();
        const courses = await Course.find({}).sort({ createdAt: -1 });
        // We'll calculate the number of sessions for each course
        const coursesWithSessionCount = await Promise.all(courses.map(async (course) => {
            const sessionsCount = await Session.countDocuments({ courseId: course._id });
            return {
                ...course.toObject(),
                sessions: sessionsCount
            };
        }));
        return NextResponse.json(coursesWithSessionCount);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const course = await Course.create(body);
        return NextResponse.json(course, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { id, ...updateData } = body;
        const course = await Course.findByIdAndUpdate(id, updateData, { new: true });
        return NextResponse.json(course);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        // Delete course and all its sessions
        await Course.findByIdAndDelete(id);
        await Session.deleteMany({ courseId: id });

        return NextResponse.json({ message: "Course and sessions deleted" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
