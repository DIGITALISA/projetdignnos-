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
            plan: planId, // New field from form
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

        // Generate Member ID
        const memberId = `EXP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

        // Map planId to actual roles/types
        let role = "Free Tier";
        let accountType = "Free";
        let plan = "Student";
        let activationType = "Gratuit";

        const now = new Date();
        const trialExpiry = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes trial

        if (planId?.startsWith("p-")) {
            role = "Premium Member";
            accountType = "Premium";
            plan = "Professional";
            activationType = "Gratuit";
        } else if (planId?.startsWith("e-") || planId?.startsWith("x-")) {
            role = "Free Tier";
            accountType = "Free";
            plan = "Expert";
            const expertInterviewStatus = "Pending";
            
            // Create user for expert/trainer
            await User.create({
                fullName: `${firstName} ${lastName}`,
                email,
                password: hashedPassword,
                whatsapp,
                role,
                status: "Pending",
                accountType,
                plan,
                memberId,
                expertInterviewStatus,
                isTrial: true,
                trialExpiry,
                trialDurationHours: 1/6
            });
            return NextResponse.json({ success: true, message: "Registration request submitted" });
        }

        // Create user
        await User.create({
            fullName: `${firstName} ${lastName}`,
            email,
            password: hashedPassword,
            whatsapp,
            role,
            status: "Pending",
            accountType,
            isTrial: true,
            trialDurationHours: 1/6,
            trialExpiry,
            activationType,
            plan,
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
