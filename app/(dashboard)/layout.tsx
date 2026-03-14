"use client";

import { useState, useEffect } from "react";
import { Loader2, Sparkles, PlayCircle, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

interface UserProfile {
    email?: string;
    fullName?: string;
    role?: string;
    plan?: string;
    canAccessCertificates?: boolean;
    canAccessRecommendations?: boolean;
    canAccessScorecard?: boolean;
    trialExpiry?: string;
    activationType?: string;
    firstLoginAt?: string;
    visitedModules?: string[];
    isDiagnosisComplete?: boolean;
}

/**
 * Banner shown to free/limited Student plan users.
 * - Before diagnosis complete: nudges to complete the free diagnostic
 * - After diagnosis complete: suggests paid Workshops + Role Simulations
 */
function StudentFreeBanner({ profile, dir, language }: { profile: UserProfile, dir: 'ltr' | 'rtl', language: string }) {
    const isRtl = dir === 'rtl';
    const lang = isRtl ? 'ar' : (language === 'fr' ? 'fr' : 'en');
    const isDiagnosisComplete = !!profile.isDiagnosisComplete;

    const texts = {
        ar: {
            // Pre-diagnosis
            preTitle: '🎯 الديغنوستيك كامل مجاني',
            preDesc: 'أكمل تحليل CV + المقابلة + التقرير الاستراتيجي مجاناً',
            preBtn: 'ابدأ الآن',
            // Post-diagnosis
            postTitle: '🎉 تهانينا! الديغنوستيك مكتمل',
            postDesc: 'الخطوة التالية: ورشات عمل + محاكاة دور (مدفوعة)',
            workshopsBtn: 'الورشات',
            simBtn: 'محاكاة الدور',
            upgradeBtn: 'اشترك الآن',
        },
        fr: {
            preTitle: '🎯 Diagnostic 100% Gratuit',
            preDesc: 'Complétez votre CV Audit + Interview + Rapport Stratégique gratuitement',
            preBtn: 'Commencer',
            postTitle: '🎉 Diagnostic Complété !',
            postDesc: 'Prochaine étape : Workshops & Role Simulations (payants)',
            workshopsBtn: 'Workshops',
            simBtn: 'Simulations',
            upgradeBtn: 'S\'abonner',
        },
        en: {
            preTitle: '🎯 Diagnostic 100% Free',
            preDesc: 'Complete your CV Audit + Interview + Strategic Report at no cost',
            preBtn: 'Start Now',
            postTitle: '🎉 Diagnostic Complete!',
            postDesc: 'Next: Workshops & Role Simulations unlock with a paid plan',
            workshopsBtn: 'Workshops',
            simBtn: 'Simulations',
            upgradeBtn: 'Subscribe',
        },
    };
    const tt = texts[lang as keyof typeof texts];

    if (!isDiagnosisComplete) {
        // Pre-diagnosis: simple nudge bar
        return (
            <div className={`w-full px-4 py-2 bg-linear-to-r from-blue-50 to-indigo-50 border-b border-blue-100`}>
                <div className={`max-w-7xl mx-auto flex items-center gap-3 flex-wrap ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-700">{tt.preTitle}</span>
                    <span className="text-[10px] text-blue-500 font-medium hidden sm:inline">{tt.preDesc}</span>
                    <Link
                        href="/assessment/cv-upload"
                        className={`${isRtl ? 'mr-auto ml-0' : 'ml-auto'} flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-full text-[9px] font-black hover:bg-blue-700 transition-all`}
                    >
                        {tt.preBtn} <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
            </div>
        );
    }

    // Post-diagnosis: suggest paid features
    return (
        <div className={`w-full px-4 py-2.5 bg-linear-to-r from-emerald-50 to-blue-50 border-b border-emerald-100`}>
            <div className={`max-w-7xl mx-auto flex items-center gap-3 flex-wrap ${isRtl ? 'flex-row-reverse' : ''}`}>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">{tt.postTitle}</span>
                <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">{tt.postDesc}</span>
                <div className={`flex items-center gap-2 ${isRtl ? 'mr-auto ml-0' : 'ml-auto'}`}>
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 text-slate-400 rounded-full text-[9px] font-black cursor-not-allowed">
                        <PlayCircle className="w-3 h-3" /> {tt.workshopsBtn} 🔒
                    </div>
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 text-slate-400 rounded-full text-[9px] font-black cursor-not-allowed">
                        <Zap className="w-3 h-3" /> {tt.simBtn} 🔒
                    </div>
                    <Link
                        href="/subscription"
                        className="flex items-center gap-1 px-3 py-1 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-full text-[9px] font-black hover:opacity-90 transition-all shadow-sm"
                    >
                        {tt.upgradeBtn} →
                    </Link>
                </div>
            </div>
        </div>
    );
}


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { dir } = useLanguage();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const syncProfile = async (profile: UserProfile) => {
            const userId = profile?.email || profile?.fullName;
            if (!userId) return;

            try {
                const readyRes = await fetch(`/api/user/readiness?userId=${encodeURIComponent(userId)}`);
                const readyData = await readyRes.json();
                
                if (readyRes.status === 404 || readyData.error === "User not found") {
                    console.warn("User deleted or invalid. Logging out.");
                    localStorage.removeItem("userProfile");
                    window.location.href = "/login";
                    return;
                }

                if (readyData.success) {
                    if (
                        profile.canAccessCertificates !== readyData.certReady ||
                        profile.canAccessRecommendations !== readyData.recReady ||
                        profile.plan !== readyData.plan ||
                        profile.role !== readyData.role ||
                        profile.activationType !== readyData.details?.activationType
                    ) {
                        const updatedProfile = {
                            ...profile,
                            canAccessCertificates: readyData.certReady,
                            canAccessRecommendations: readyData.recReady,
                            plan: readyData.plan,
                            role: readyData.role,
                            activationType: readyData.details?.activationType,
                            firstLoginAt: readyData.details?.firstLoginAt,
                            visitedModules: readyData.details?.visitedModules || []
                        };
                        localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
                        window.dispatchEvent(new Event("profileUpdated"));
                    }
                }
            } catch (err) {
                console.error("Layout Profile Sync Error:", err);
            }
        };

        const checkAuth = () => {
            const savedProfile = localStorage.getItem("userProfile");
            if (!savedProfile) {
                if (!pathname.startsWith("/login")) {
                    router.push("/login?callback=" + encodeURIComponent(pathname));
                }
                return;
            }

            try {
                const profile: UserProfile = JSON.parse(savedProfile);
                setProfile(profile);
                syncProfile(profile); // Start background sync
                
                const isAdmin = profile.role === "admin" || profile.role === "moderator";
                
                // --- Redirect Professional Plan users ---
                const isProfessionalPlan = profile.plan === "Professional";
                const allowedProPaths = [
                    "/professional",
                    "/recommendation",
                    "/attestations",
                    "/certificate",
                    "/strategic-report",
                    "/performance-scorecard",
                    "/resume-portfolio"
                ];
                const isAllowedPath = allowedProPaths.some(p => pathname.startsWith(p));
    
                if (isProfessionalPlan && !isAllowedPath && !isAdmin) {
                    router.replace("/professional");
                    return;
                }

                // --- Prevent Professional users from accessing other dashboard parts ---
                if (isProfessionalPlan && pathname === "/dashboard" && !isAdmin) {
                    router.replace("/professional");
                    return;
                }

                // --- Redirect Expert Plan users ---
                const isExpertPlan = profile.plan === "Expert";
                const allowedExpertPaths = ["/expert-dashboard"];
                const isAllowedExpertPath = allowedExpertPaths.some(p => pathname.startsWith(p));

                if (isExpertPlan && !isAllowedExpertPath && !isAdmin) {
                    router.replace("/expert-dashboard");
                    return;
                }

                if (!isAdmin) {
                    const planStr = (profile.plan as string) || "None";
                    const roleStr = profile.role || "Trial User";
                    const isPremiumPlan = ["Student", "Professional", "Pro", "Executive", "Premium"].includes(planStr);
                    
                    const isFreePlan = planStr === "None" || (!isPremiumPlan && (roleStr === "Trial User" || roleStr === "Free Tier"));
                    const isTrialExpired = !isPremiumPlan && (roleStr === "Trial User" || roleStr === "Free Tier") && 
                                           profile.trialExpiry && 
                                           new Date(profile.trialExpiry).getTime() < new Date().getTime();

                    const limitedTrialPaths = ["/assessment", "/mentor", "/academy", "/expert", "/roadmap"];
                    const isLimitedPath = limitedTrialPaths.some(p => pathname.startsWith(p));

                    if (isFreePlan && isTrialExpired && isLimitedPath) {
                        router.replace("/subscription");
                        return;
                    }
                }
            } catch (e) {
                console.error("Auth redirect error", e);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [pathname, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                    <p className="text-slate-500 font-medium">Chargement de votre espace...</p>
                </div>
            </div>
        );
    }

    const isProfessionalLayoutRoute = pathname?.startsWith("/professional");
    const isExpertLayoutRoute = pathname?.startsWith("/expert-dashboard");
    const isAuthRoute = pathname === "/login" || pathname === "/register";
    
    // Hide standard sidebar/header on specific routes or for specific plans
    const hideSidebar = isProfessionalLayoutRoute || isExpertLayoutRoute || isAuthRoute;


    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex" dir={dir}>

            {/* Sidebar */}
            {!hideSidebar && <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />}

            {/* Main Content Area */}
            <div className={cn(
                "flex-1 flex flex-col min-h-screen transition-all duration-300",
                !hideSidebar && (dir === 'rtl' ? 'md:pr-72' : 'md:pl-72')
            )}>
                
                {/* Header */}
                {!hideSidebar && <Header onOpenSidebar={() => setIsSidebarOpen(true)} />}

                {/* Student Free Banner: pre/post diagnostic */}
                {profile &&
                 profile.plan === 'Student' &&
                 (profile.role === 'Free Tier' || profile.role === 'Trial User') &&
                 profile.activationType !== 'Unlimited' &&
                 !isProfessionalLayoutRoute && (
                    <StudentFreeBanner profile={profile} dir={dir} language={dir === 'rtl' ? 'ar' : 'fr'} />
                )}

                {/* Main Content */}
                <main className="flex-1 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
