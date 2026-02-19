import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const response = NextResponse.json({ success: true, message: "Logged out successfully" });
    
    // Clear secure cookies by setting expiry to past
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax' as const,
        path: '/',
        expires: new Date(0), // Set to epoch time to expire immediately
    };

    response.cookies.set('session_token', '', cookieOptions);
    response.cookies.set('user_role', '', { ...cookieOptions, httpOnly: false });
    response.cookies.set('user_status', '', { ...cookieOptions, httpOnly: false });

    return response;
}
