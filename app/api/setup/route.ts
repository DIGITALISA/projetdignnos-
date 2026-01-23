import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        // Check if any admin already exists
        const adminExists = await User.findOne({ role: "Admin" });

        if (adminExists) {
            return NextResponse.json({
                error: "Setup already completed. At least one Admin exists."
            }, { status: 403 });
        }

        const { fullName, email, password } = await req.json();

        if (!fullName || !email || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await User.create({
            fullName,
            email,
            password: hashedPassword,
            role: "Admin",
            status: "Active"
        });

        return NextResponse.json({
            success: true,
            message: "Admin account created successfully!",
            admin: {
                fullName: admin.fullName,
                email: admin.email,
                role: admin.role
            }
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectDB();
        const adminExists = await User.findOne({ role: "Admin" });
        return NextResponse.json({
            setupRequired: !adminExists,
            message: adminExists ? "Admin already exists" : "No Admin found, setup required"
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
