import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Notification from "@/models/Notification";

// Simple in-memory cache
interface NotificationDocument {
    _id: string;
    title: string;
    message: string;
    type?: string;
    read: boolean;
    createdAt: string;
    updatedAt: string;
}

interface CachedNotifications {
    notifications: NotificationDocument[];
    unreadCount: number;
}

let cachedNotifications: CachedNotifications | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 15000; // 15 seconds (shorter than stats since notifications are more time-sensitive)

export async function GET() {
    try {
        // Check cache first
        const now = Date.now();
        if (cachedNotifications && (now - cacheTimestamp) < CACHE_DURATION) {
            return NextResponse.json({
                ...cachedNotifications,
                cached: true
            });
        }

        await connectDB();
        const notifications = await Notification.find({}).sort({ createdAt: -1 }).limit(20);
        const unreadCount = await Notification.countDocuments({ read: false });
        
        const result = { notifications, unreadCount };
        
        // Update cache
        cachedNotifications = result;
        cacheTimestamp = now;
        
        return NextResponse.json(result);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : undefined;
        console.error("❌ Error fetching notifications:", error);
        return NextResponse.json({ 
            error: "Failed to fetch notifications",
            details: errorMessage,
            stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
        }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const notification = await Notification.create(body);
        
        // Invalidate cache when new notification is created
        cachedNotifications = null;
        
        return NextResponse.json(notification, { status: 201 });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { id } = body;
        // Mark as read
        const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
        
        // Invalidate cache when notification is updated
        cachedNotifications = null;
        
        return NextResponse.json(notification);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
}
