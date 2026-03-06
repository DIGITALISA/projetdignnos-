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

        const user = await User.findOne({ 
            $or: [
                { email: email },
                { memberId: email }
            ]
        });

        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Check password: it can be either the hashed password OR the memberId itself (Access Code)
        const isMatch = (await bcrypt.compare(password, user.password)) || (password === user.memberId);
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Block login for Pending users (if not admin/moderator)
        if (user.status === "Pending" && user.role !== "Admin" && user.role !== "Moderator") {
            // Get contact config for the WhatsApp number
            const Config = (await import("@/models/Config")).default;
            const contactConfig = await Config.findOne({ key: 'contact_whatsapp' });
            const whatsapp = contactConfig?.value || '+216 44 172 284';

            return NextResponse.json({
                error: `Désolé, votre compte est en cours de vérification. سيتم تفعيل الحساب بعد التثبت من المعطيات مابين 24 ساعة و 72 ساعة. إذا تأخرنا أو كنت ترغب في تفعيل الحساب فوراً، تواصل معنا عبر الواتساب: ${whatsapp}`,
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


        // Initialize firstLoginAt if not set (for tracking student activation)
        if (!user.firstLoginAt) {
            user.firstLoginAt = new Date();
            await user.save();
        }

        // Generate a secure session token
        const sessionToken = crypto.randomBytes(32).toString('hex');

        // Return user data (excluding password)
        const userData = {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            status: user.status,
            plan: user.plan || "Professional",
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
