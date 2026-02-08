import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Resource from "@/models/Resource";

export async function GET() {
    try {
        await connectDB();
        const resources = await Resource.find({}).sort({ createdAt: -1 });
        return NextResponse.json(resources);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const resource = await Resource.create(body);
        return NextResponse.json(resource, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { id, ...updateData } = body;
        const resource = await Resource.findByIdAndUpdate(id, updateData, { new: true, strict: false });
        return NextResponse.json(resource);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        await Resource.findByIdAndDelete(id);
        return NextResponse.json({ message: "Resource deleted" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
