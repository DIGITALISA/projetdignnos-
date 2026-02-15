import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CorporateInquiry from '@/models/CorporateInquiry';

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const body = await req.json();
        const { id } = await params;

        const inquiry = await CorporateInquiry.findByIdAndUpdate(
            id,
            { status: body.status },
            { new: true }
        );

        if (!inquiry) {
            return NextResponse.json({ success: false, error: "Inquiry not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: inquiry });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const inquiry = await CorporateInquiry.findByIdAndDelete(id);

        if (!inquiry) {
            return NextResponse.json({ success: false, error: "Inquiry not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Deleted successfully" });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}
