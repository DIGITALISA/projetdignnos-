import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Tool from "@/models/Tool";

export async function GET() {
    try {
        await connectDB();
        const tools = await Tool.find({}).sort({ createdAt: -1 });
        return NextResponse.json(tools);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch tools" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const tool = await Tool.create(body);
        return NextResponse.json(tool, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { id, ...updateData } = body;
        const tool = await Tool.findByIdAndUpdate(id, updateData, { new: true });
        return NextResponse.json(tool);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        await Tool.findByIdAndDelete(id);
        return NextResponse.json({ message: "Tool deleted" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
