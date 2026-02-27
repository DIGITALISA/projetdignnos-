import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ExpertInterview from '@/models/ExpertInterview';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        const application = await ExpertInterview.create({
            ...body,
            status: 'Pending'
        });

        // Add admin notification
        try {
            const baseUrl = req.url ? new URL(req.url).origin : '';
            await fetch(`${baseUrl}/api/admin/notifications`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: "New Expert Interview",
                    message: `A new expert application has been received from ${body.firstName} ${body.lastName}.`,
                    type: "recruitment",
                    read: false
                })
            });
        } catch (notifierr) {
            console.error("Failed to send admin notification:", notifierr);
        }

        return NextResponse.json({ success: true, data: application }, { status: 201 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("Expert interview submission error:", error);
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}

export async function GET() {
    try {
        await dbConnect();
        const applications = await ExpertInterview.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: applications });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });
        }

        await ExpertInterview.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: "Interview deleted" });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json({ success: false, error: "ID and status required" }, { status: 400 });
        }

        const updated = await ExpertInterview.findByIdAndUpdate(id, { status }, { new: true });
        return NextResponse.json({ success: true, data: updated });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}
