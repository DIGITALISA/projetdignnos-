import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Simulation from "@/models/Simulation";

// Force dynamic to ensure we get fresh data
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (id) {
            // If fetching by ID, we assume admin is looking at it, so we could mark it viewed here 
            // but let's do it via a separate POST action for better control.
            const simulation = await Simulation.findById(id);
            return NextResponse.json({ simulation });
        }

        const pending = await Simulation.find({ status: 'requested' }).sort({ createdAt: -1 });
        const proposed = await Simulation.find({ status: 'proposed' }).sort({ createdAt: -1 });
        const active = await Simulation.find({ status: 'active' }).sort({ createdAt: -1 });
        const completed = await Simulation.find({ status: 'completed' }).sort({ createdAt: -1 });

        return NextResponse.json({
            pending,
            proposed,
            active,
            completed,
            stats: {
                pending: pending.length + proposed.length,
                active: active.length,
                completed: completed.length
            }
        });

    } catch (error) {
        console.error("Admin Simulation API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const { id, type, data } = await req.json();

        if (type === 'update_progress') {
            const updated = await Simulation.findByIdAndUpdate(
                id,
                { $set: data },
                { new: true }
            );
            return NextResponse.json({ success: true, mission: updated });
        }

        if (type === 'mark_draft_viewed') {
            await Simulation.findByIdAndUpdate(id, { draftViewedByAdmin: true });
            return NextResponse.json({ success: true });
        }

        if (type === 'set_meeting_link') {
            // This is old global link, let's keep it for compatibility or remove it
            const updated = await Simulation.findByIdAndUpdate(
                id,
                { $set: { meetingLink: data.link } },
                { new: true }
            );
            return NextResponse.json({ success: true, mission: updated });
        }

        if (type === 'send_message') {
            const updated = await Simulation.findByIdAndUpdate(
                id,
                { $push: { messages: { text: data.text, sender: data.sender || 'admin' } } },
                { new: true }
            );
            return NextResponse.json({ success: true, mission: updated });
        }

        if (type === 'update_resources') {
            const updated = await Simulation.findByIdAndUpdate(
                id,
                { $set: { resources: data.resources } },
                { new: true }
            );
            return NextResponse.json({ success: true, mission: updated });
        }

        return NextResponse.json({ error: "Invalid type" }, { status: 400 });

    } catch (error) {
        console.error("Admin Simulation Update Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "ID required" }, { status: 400 });
        }

        await connectDB();
        await Simulation.findByIdAndDelete(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Admin Simulation DELETE Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

