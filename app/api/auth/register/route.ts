import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { 
            firstName, 
            lastName, 
            email, 
            whatsapp, 
            password,
            mandateDuration,
            mandateCurrency,
            mandateAmount,
            plannedPaymentDate,
            mandateAgreed
        } = await req.json();

        if (!firstName || !lastName || !email || !whatsapp || !password) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate Member ID (High entropy for professional tracking)
        const memberId = `EXP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

        // Create user with status PENDING and Free Tier settings
        await User.create({
            fullName: `${firstName} ${lastName}`,
            email,
            password: hashedPassword,
            whatsapp,
            role: "Free Tier",
            status: "Pending",
            accountType: "Free",
            isTrial: true,
            trialDurationHours: 0.25,
            plan: "Free Trial",
            mandateDuration,
            mandateCurrency,
            mandateAmount,
            plannedPaymentDate,
            mandateAgreed,
            memberId
        });

        return NextResponse.json({ success: true, message: "Registration request submitted" });
    } catch (error) {
        console.error("Registration API error:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
