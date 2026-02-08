import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Notification from "@/models/Notification";

export async function GET() {
    try {
        await connectDB();
        const notifications = await Notification.find({}).sort({ createdAt: -1 }).limit(20);
        const unreadCount = await Notification.countDocuments({ read: false });
        return NextResponse.json({ notifications, unreadCount });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const notification = await Notification.create(body);
        return NextResponse.json(notification, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { id } = body;
        // Mark as read
        const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
        return NextResponse.json(notification);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
