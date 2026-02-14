import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CorporateInquiry from '@/models/CorporateInquiry';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        const inquiry = await CorporateInquiry.create({
            ...body,
            createdAt: new Date(),
            status: 'pending'
        });

        return NextResponse.json({ success: true, data: inquiry }, { status: 201 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("Corporate inquiry error:", error);
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}

export async function GET() {
    try {
        await dbConnect();
        const inquiries = await CorporateInquiry.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: inquiries });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}
