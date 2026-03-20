import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Notification from '@/models/Notification';

export const runtime = 'nodejs';

/**
 * GET: Fetch notifications for a specific user
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    await connectDB();

    // Find notifications targeted at this email OR at all "User" role components
    const notifications = await Notification.find({
      $or: [
        { recipientEmail: email },
        { recipientRole: 'User' }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

    const unreadCount = await Notification.countDocuments({
      $or: [
        { recipientEmail: email },
        { recipientRole: 'User' }
      ],
      read: false
    });

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount
    });

  } catch (error) {
    console.error('User notifications fetch error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH: Mark a notification as read
 */
export async function PATCH(req: NextRequest) {
  try {
    const { notificationId } = await req.json();

    if (!notificationId) {
      return NextResponse.json({ success: false, error: 'Notification ID is required' }, { status: 400 });
    }

    await connectDB();
    await Notification.findByIdAndUpdate(notificationId, { read: true });

    return NextResponse.json({ success: true, message: 'Notification marked as read' });

  } catch (error) {
    console.error('Update notification error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST: Create a new notification
 */
export async function POST(req: NextRequest) {
    try {
        const { recipientEmail, title, message, type = "info", metadata } = await req.json();

        if (!recipientEmail || !title || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await connectDB();

        const notification = await Notification.create({
            recipientEmail,
            title,
            message,
            type,
            metadata,
            read: false,
        });

        return NextResponse.json({ success: true, notification }, { status: 201 });
    } catch (error) {
        console.error("Error creating notification:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
