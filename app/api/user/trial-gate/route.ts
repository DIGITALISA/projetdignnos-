import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// Configuration for the student free trial
const TRIAL_DURATION_HOURS = 3; // 3 hours trial period
const TRIAL_MODULES = [
    'ai-path',          // ⚡ مسار الذكاء الاصطناعي التلقائي
    'strategic-resources', // الموارد الاستراتيجية
    'ai-experts',       // 🔥 خبراء الذكاء الاصطناعي
    'strategic-roadmap', // 🚀 خارطة الطريق الاستراتيجية
    'resources',         // الموارد
    'performance-scorecard', // بطاقة الأداء
    'job-alignment'     // 🌍 مواءمة المهنة
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

        // Identify users subject to trial gating: Student plan + (Free Tier/Trial User) OR plan 'None' (Registered but no plan)
        // Identify users subject to trial gating
        // A user is NOT a trial user if they have activationType === 'Unlimited'
        const isStudentFreeTrial = user.activationType !== 'Unlimited' && (
            (user.plan === 'Student' && (user.role === 'Free Tier' || user.role === 'Trial User')) || 
            (user.activationType === 'Limited') || 
            (user.plan === 'None')
        );

        if (!isStudentFreeTrial) {
            // Paid plan or admin: full access
            return NextResponse.json({ 
                allowed: true, 
                reason: 'not_trial',
                trialInfo: null 
            });
        }

        const now = new Date();

        // Check if module is in trial-gated (one-time access) list
        if (!TRIAL_MODULES.includes(moduleName)) {
            // If it's not in the trial list but we are here (TrialGate component used), 
            // it means it's a PAID ONLY module for this user.
            return NextResponse.json({ 
                allowed: false, 
                reason: 'paid_only',
                trialInfo: {
                    startedAt: user.firstLoginAt ? new Date(user.firstLoginAt).toISOString() : now.toISOString(),
                    expiresAt: user.firstLoginAt ? new Date(new Date(user.firstLoginAt).getTime() + TRIAL_DURATION_HOURS * 60 * 60 * 1000).toISOString() : now.toISOString(),
                    durationHours: TRIAL_DURATION_HOURS,
                    isExpired: false,
                    moduleUsed: false,
                    isPaidOnly: true
                } 
            });
        }

        const firstLogin = user.firstLoginAt ? new Date(user.firstLoginAt) : now;

        // Set firstLoginAt if not set
        if (!user.firstLoginAt) {
            await User.findByIdAndUpdate(user._id, { 
                $set: { firstLoginAt: now } 
            });
        }

        // Check if 3-hour trial window has expired
        const trialExpiryTime = new Date(firstLogin.getTime() + TRIAL_DURATION_HOURS * 60 * 60 * 1000);
        const isTrialExpired = now > trialExpiryTime;

        if (isTrialExpired) {
            return NextResponse.json({
                allowed: false,
                reason: 'trial_expired',
                trialInfo: {
                    startedAt: firstLogin.toISOString(),
                    expiresAt: trialExpiryTime.toISOString(),
                    durationHours: TRIAL_DURATION_HOURS,
                    isExpired: true,
                    moduleUsed: (user.visitedModules || []).includes(moduleName)
                }
            });
        }

        // Check if this specific module was already used
        const visitedModules: string[] = user.visitedModules || [];
        const moduleAlreadyUsed = visitedModules.includes(moduleName);

        if (moduleAlreadyUsed) {
            return NextResponse.json({
                allowed: false,
                reason: 'module_used',
                trialInfo: {
                    startedAt: firstLogin.toISOString(),
                    expiresAt: trialExpiryTime.toISOString(),
                    durationHours: TRIAL_DURATION_HOURS,
                    isExpired: false,
                    moduleUsed: true,
                    minutesRemaining: Math.max(0, Math.floor((trialExpiryTime.getTime() - now.getTime()) / 60000))
                }
            });
        }

        // Module is accessible - return allowed
        return NextResponse.json({
            allowed: true,
            reason: 'trial_active',
            trialInfo: {
                startedAt: firstLogin.toISOString(),
                expiresAt: trialExpiryTime.toISOString(),
                durationHours: TRIAL_DURATION_HOURS,
                isExpired: false,
                moduleUsed: false,
                minutesRemaining: Math.max(0, Math.floor((trialExpiryTime.getTime() - now.getTime()) / 60000)),
                visitedModules
            }
        });

    } catch (error: unknown) {
        console.error("Trial Gate GET Error:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

/**
 * POST - Mark a module as used for a Student Free Trial user
 * Body: { userId, module }
 */
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const { userId, module: moduleName, moduleHref } = await request.json();

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

        interface MongoUpdate {
            $set?: Record<string, unknown>;
            $addToSet?: {
                visitedModules?: { $each: string[] };
            };
        }

        const mongoUpdate: MongoUpdate = {};

        // Set firstLoginAt if not already set
        if (!user.firstLoginAt) {
            mongoUpdate.$set = { firstLoginAt: new Date() };
        }

        // Add modules to visitedModules
        const modulesToAdd: string[] = [];
        if (!user.visitedModules?.includes(moduleName)) {
            modulesToAdd.push(moduleName);
        }
        if (moduleHref && !user.visitedModules?.includes(moduleHref)) {
            modulesToAdd.push(moduleHref);
        }

        if (modulesToAdd.length > 0) {
            mongoUpdate.$addToSet = { visitedModules: { $each: modulesToAdd } };
        }

        if (Object.keys(mongoUpdate).length > 0) {
            await User.findByIdAndUpdate(user._id, mongoUpdate);
        }

        return NextResponse.json({ 
            success: true, 
            message: `Module '${moduleName}' marked as used`,
            visitedModules: [...(user.visitedModules || []), moduleName, ...(moduleHref ? [moduleHref] : [])]
        });

    } catch (error: unknown) {
        console.error("Trial Gate POST Error:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
