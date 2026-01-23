import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Config from "@/models/Config";

export async function POST(req: Request) {
    try {
        const { password } = await req.json();

        if (!password) {
            return NextResponse.json({ success: false, message: "Password is required" }, { status: 400 });
        }

        await connectDB();
        const config = await Config.findOne({ key: "ADMIN_PROTECTION_PASSWORD" });

        if (!config) {
            // If no password is set, we might want to allow access or require setting it.
            // For now, let's assume it's protected if not set (or set a default)
            return NextResponse.json({ success: false, message: "Protection password not set in system" }, { status: 404 });
        }

        if (config.value === password) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false, message: "Incorrect password" }, { status: 401 });
        }

    } catch (error) {
        console.error("Protection verification error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
