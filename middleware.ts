import { NextRequest, NextResponse } from 'next/server';

// Routes that require NO authentication
const PUBLIC_ROUTES = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/verify-document',
    '/api/corporate-inquiry',
    '/api/recruitment',
    '/api/setup',
];



export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    const sessionToken = request.cookies.get('session_token')?.value;
    const userRole = request.cookies.get('user_role')?.value;
    const userStatus = request.cookies.get('user_status')?.value;

    console.log(`[Middleware] Path: ${pathname}, Role: ${userRole}, Token: ${!!sessionToken}`);

    // ── 1. API Protection Strategy ──
    if (pathname.startsWith('/api/')) {
        // Skip public API routes
        if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
            return NextResponse.next();
        }

        // Block unauthenticated API access
        if (!sessionToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Block suspended users
        if (userStatus === 'Suspended' || userStatus === 'Inactive') {
            return NextResponse.json({ error: 'Account suspended' }, { status: 403 });
        }

        // Start checking specific API permissions
        // Admin API routes
        if (pathname.startsWith('/api/admin')) {
            if (userRole !== 'Admin' && userRole !== 'Moderator') {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
        }
        
        return NextResponse.next();
    }

    // ── 2. Frontend Page Protection Strategy ──
    
    // Public Pages that don't need auth
    const publicPages = ['/', '/login', '/register', '/about', '/contact', '/pricing', '/professionals', '/verify-document'];
    if (publicPages.includes(pathname) || pathname.startsWith('/_next') || pathname.startsWith('/static') || pathname.startsWith('/public')) {
        return NextResponse.next();
    }

    // PROTECTED PAGES CHECK
    // If trying to access protected pages without token -> Redirect to Login
    const protectedPrefixes = ['/dashboard', '/admin', '/simulation', '/assessment', '/training', '/academy', '/library', '/expert', '/certificate', '/recommendation'];
    
    if (protectedPrefixes.some(prefix => pathname.startsWith(prefix))) {
        if (!sessionToken) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }

        // Admin Page Protection
        if (pathname.startsWith('/admin')) {
             // TEMPORARY: Allow access for debugging if user says page is gone
             console.log(`[Middleware] Admin Access check: Role=${userRole}`);
             /* 
             if (userRole !== 'Admin' && userRole !== 'Moderator') {
                 return NextResponse.redirect(new URL('/dashboard', request.url));
             }
             */
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/api/:path*',
        '/dashboard/:path*',
        '/admin/:path*',
        '/simulation/:path*',
        '/assessment/:path*',
        '/training/:path*',
        '/academy/:path*',
        '/library/:path*',
        '/expert/:path*',
        '/certificate/:path*',
        '/recommendation/:path*',
    ],
};
