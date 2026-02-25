import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import crypto from "crypto";

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Generate a secure session token
        const sessionToken = crypto.randomBytes(32).toString('hex');

        const response = NextResponse.json({ 
            success: true, 
            message: `Impersonating ${user.fullName}`,
            redirectUrl: "/dashboard"
        });

        // Set secure cookies for the target user
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
        console.error("Impersonation Error:", error);
        return NextResponse.json({ error: "Failed to impersonate user" }, { status: 500 });
    }
}
