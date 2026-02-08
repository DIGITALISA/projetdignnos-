import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { firstName, lastName, email, whatsapp, password } = await req.json();

        if (!firstName || !lastName || !email || !whatsapp || !password) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with status PENDING and Trial flag
        const newUser = await User.create({
            fullName: `${firstName} ${lastName}`,
            email,
            password: hashedPassword,
            whatsapp,
            role: "Trial User",
            status: "Pending",
            isTrial: true,
            rawPassword: password // Store the plain text code for admin visibility
        });

        return NextResponse.json({ success: true, message: "Registration request submitted" });
    } catch (error: any) {
        console.error("Registration API error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
