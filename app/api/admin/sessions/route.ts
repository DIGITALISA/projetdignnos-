import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Diagnosis from "@/models/Diagnosis";

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Search in Diagnosis first as it's the primary dashboard source
        const diagnosis = await Diagnosis.findOne({ 
            $or: [
                { userId: { $regex: new RegExp(`^${userId}$`, 'i') } },
                { userId: userId.toString() }
            ]
        }).sort({ updatedAt: -1 });

        return NextResponse.json({ 
            success: true, 
            sessions: diagnosis?.liveSessions || [] 
        });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { userId, session } = body;

        if (!userId || !session) {
            return NextResponse.json({ error: "User ID and session data are required" }, { status: 400 });
        }

        // Update in Diagnosis
        const updatedDiagnosis = await Diagnosis.findOneAndUpdate(
            { 
                $or: [
                    { userId: { $regex: new RegExp(`^${userId}$`, 'i') } },
                    { userId: userId.toString() }
                ]
            },
            { $push: { liveSessions: session } },
            { new: true, sort: { updatedAt: -1 } }
        );

        // Also sync to User model for backup/other uses
        await User.findOneAndUpdate(
            { email: userId },
            { $push: { liveSessions: session } }
        );

        return NextResponse.json({ success: true, diagnosis: updatedDiagnosis });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const sessionId = searchParams.get("sessionId");

        if (!userId || !sessionId) {
            return NextResponse.json({ error: "User ID and Session ID are required" }, { status: 400 });
        }

        await Diagnosis.findOneAndUpdate(
            { 
                $or: [
                    { userId: { $regex: new RegExp(`^${userId}$`, 'i') } },
                    { userId: userId.toString() }
                ]
            },
            { $pull: { liveSessions: { _id: sessionId } } },
            { sort: { updatedAt: -1 } }
        );

        await User.findOneAndUpdate(
            { email: userId },
            { $pull: { liveSessions: { _id: sessionId } } }
        );

        return NextResponse.json({ success: true, message: "Session removed" });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
