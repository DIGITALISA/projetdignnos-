import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Check password using bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Block login for Pending users (if not admin/moderator)
        if (user.status === "Pending" && user.role !== "Admin" && user.role !== "Moderator") {
            return NextResponse.json({
                error: "Désolé, votre compte est en cours de vérification. سنتثبت من معطياتك إن كانت صحيحة لنرسل لك رسالة على الواتساب والبريد الإلكتروني. يجب عليك تأكيدهما للبدء.",
                status: "Pending"
            }, { status: 403 });
        }

        // Initialize trial period on FIRST LOGIN if it's a Trial User and expiry isn't set
        if (user.role === "Trial User" && !user.trialExpiry) {
            const duration = user.trialDurationHours || 1;
            const expiry = new Date();
            expiry.setHours(expiry.getHours() + duration);
            
            user.trialExpiry = expiry;
            await user.save();
        }

        // Return user data (excluding password)
        const userData = {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            status: user.status,
            plan: user.plan || "Free Trial",
            trialExpiry: user.trialExpiry,
            canAccessCertificates: user.canAccessCertificates,
            canAccessRecommendations: user.canAccessRecommendations,
            isDiagnosisComplete: user.isDiagnosisComplete || false,
            diagnosisData: user.diagnosisData,
            purchasedItems: user.purchasedItems || []
        };

        return NextResponse.json({ success: true, user: userData });
    } catch (error: unknown) {
        console.error("Login Error:", error);
        const message = error instanceof Error ? error.message : "An unknown login error occurred";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
