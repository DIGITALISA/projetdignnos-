import { NextResponse } from "next/server";
import mongodb from "@/lib/mongodb";
import DigitalProject from "@/models/DigitalProject";

export async function GET() {
    try {
        await mongodb();
        const projects = await DigitalProject.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, projects });
    } catch (error) {
        console.error("Digitalization API Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await mongodb();
        const body = await req.json();
        
        const project = await DigitalProject.create(body);
        
        return NextResponse.json({ success: true, project });
    } catch (error) {
        console.error("Digitalization API Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        await mongodb();
        const body = await req.json();
        const { id, ...updateData } = body;
        
        if (!id) {
            return NextResponse.json({ success: false, message: "Project ID is required" }, { status: 400 });
        }
        
        const project = await DigitalProject.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!project) {
            return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, project });
    } catch (error) {
        console.error("Digitalization API Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await mongodb();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        
        if (!id) {
            return NextResponse.json({ success: false, message: "Project ID is required" }, { status: 400 });
        }
        
        await DigitalProject.findByIdAndDelete(id);
        
        return NextResponse.json({ success: true, message: "Project deleted successfully" });
    } catch (error) {
        console.error("Digitalization API Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
