import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

/**
 * GATING RULES FOR FREE/STUDENT TRIAL USERS:
 * 
 * ✅ ALWAYS FREE (no gating):
 *   - Full Diagnostic: CV Audit, Interview, Role Discovery, Results, Strategic Report
 *   - Assessment steps (cv-upload, cv-generation, interview, role-discovery, role-suggestions, results, simulation)
 * 
 * 🔒 ALWAYS PAID (gated with 'paid_only'):
 *   - AI Modules: ai-path (mentor), strategic-resources (academy), ai-experts (expert), strategic-roadmap (roadmap)
 *   - Tools: resources (library), performance-scorecard, job-alignment
 * 
 * ❌ REMOVED: 3-hour timer, one-time visit per module
 */
const PAID_ONLY_MODULES = [
    'ai-path',              // ⚡ AI Path (mentor)
    'strategic-resources',  // 📚 Academy / Strategic Resources
    'ai-experts',           // 🔥 AI Expert Chat
    'strategic-roadmap',    // 🚀 Roadmap
    'resources',            // 📂 Library
    'performance-scorecard',// 📈 Performance Scorecard
    'job-alignment',        // 🌍 Job Alignment
];

// Diagnostic modules are always free for everyone
const FREE_DIAGNOSTIC_MODULES = [
    'strategic-report',     // Full diagnostic report — FREE
    'assessment-results',   // Interview results — FREE
];

/**
 * GET - Check if a module is accessible for a Student Free Trial user
 * Query params: userId, module
 */
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const moduleName = searchParams.get('module');

        if (!userId || !moduleName) {
            return NextResponse.json({ error: "userId and module required" }, { status: 400 });
        }

        const isObjectId = userId.length === 24 && /^[0-9a-fA-F]{24}$/.test(userId);
        const user = await User.findOne(
            isObjectId ? { $or: [{ _id: userId }, { email: userId }] } : { email: userId }
        );

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Identify if this is a trial/free user
        const isStudentFreeTrial = user.activationType !== 'Unlimited' && (
            (user.plan === 'Student' && (user.role === 'Free Tier' || user.role === 'Trial User')) ||
            (user.activationType === 'Limited') ||
            (user.plan === 'None')
        );

        // Non-trial users (paid/admin): full access everywhere
        if (!isStudentFreeTrial) {
            return NextResponse.json({
                allowed: true,
                reason: 'not_trial',
                trialInfo: null
            });
        }

        // ── FREE DIAGNOSTIC MODULE CHECK ──
        // strategic-report and assessment results are always free
        if (FREE_DIAGNOSTIC_MODULES.includes(moduleName) || moduleName === 'strategic-report') {
            return NextResponse.json({
                allowed: true,
                reason: 'diagnostic_free',
                trialInfo: null
            });
        }

        // ── PAID-ONLY MODULE CHECK ──
        // These modules require a paid plan - no free access
        if (PAID_ONLY_MODULES.includes(moduleName)) {
            return NextResponse.json({
                allowed: false,
                reason: 'paid_only',
                trialInfo: {
                    startedAt: user.firstLoginAt ? new Date(user.firstLoginAt).toISOString() : new Date().toISOString(),
                    expiresAt: null,
                    durationHours: null,
                    isExpired: false,
                    moduleUsed: false,
                    isPaidOnly: true
                }
            });
        }

        // ── UNKNOWN MODULE: fail open (allow access) ──
        return NextResponse.json({
            allowed: true,
            reason: 'module_not_gated',
            trialInfo: null
        });

    } catch (error: unknown) {
        console.error("Trial Gate GET Error:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

/**
 * POST - Legacy: used to mark modules as visited. Now a no-op for free users.
 * Kept for backwards compatibility with sidebar trackVisit calls.
 */
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const { userId, module: moduleName } = await request.json();

        if (!userId || !moduleName) {
            return NextResponse.json({ error: "userId and module required" }, { status: 400 });
        }

        // No longer tracking visited modules — one-time rule removed
        return NextResponse.json({
            success: true,
            message: `Module tracking disabled — no restrictions apply`,
            visitedModules: []
        });

    } catch (error: unknown) {
        console.error("Trial Gate POST Error:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
