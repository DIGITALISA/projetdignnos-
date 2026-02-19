import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";

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

        // Block login for Suspended/Inactive users
        if (user.status === "Suspended" || user.status === "Inactive") {
            return NextResponse.json({
                error: "Your account has been suspended or deactivated. Please contact support.",
                status: user.status
            }, { status: 403 });
        }

        // Trial period will be initialized on CV upload instead of login


        // Generate a secure session token
        const sessionToken = crypto.randomBytes(32).toString('hex');

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

        const response = NextResponse.json({ success: true, user: userData });

        // Set secure HTTP-only cookies for middleware auth
        const isProduction = process.env.NODE_ENV === 'production';
        const isLocalhost = req.nextUrl.hostname === 'localhost' || req.nextUrl.hostname === '127.0.0.1';
        
        const cookieOptions = {
            httpOnly: true,
            secure: isProduction && !isLocalhost,
            sameSite: 'lax' as const,
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        };

        response.cookies.set('session_token', sessionToken, cookieOptions);
        response.cookies.set('user_role', user.role, { ...cookieOptions, httpOnly: false });
        response.cookies.set('user_status', user.status, { ...cookieOptions, httpOnly: false });

        return response;
    } catch (error: unknown) {
        console.error("Login Error:", error);
        const message = error instanceof Error ? error.message : "An unknown login error occurred";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
