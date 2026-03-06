"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Loader2, Timer, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";

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
}

const TRIAL_MODULES = [
    { key: 'ai-path', emoji: '⚡', label: { ar: 'مسار الذكاء', fr: 'Parcours IA', en: 'AI Path' } },
    { key: 'strategic-resources', emoji: '📚', label: { ar: 'الموارد', fr: 'Ressources', en: 'Resources' } },
    { key: 'ai-experts', emoji: '🔥', label: { ar: 'الخبراء', fr: 'Experts', en: 'Experts' } },
    { key: 'strategic-roadmap', emoji: '🚀', label: { ar: 'خارطة الطريق', fr: 'Feuille de Route', en: 'Roadmap' } },
];

const TRIAL_HOURS = 3;

function StudentTrialBanner({ profile, dir, language }: { profile: UserProfile, dir: 'ltr' | 'rtl', language: string }) {
    const [minutesLeft, setMinutesLeft] = useState<number | null>(null);
    const [expired, setExpired] = useState(false);

    useEffect(() => {
        if (!profile.firstLoginAt) {
            // Start the clock from now if no firstLoginAt
            return;
        }
        const update = () => {
            const start = new Date(profile.firstLoginAt!).getTime();
            const expiry = start + TRIAL_HOURS * 60 * 60 * 1000;
            const now = Date.now();
            const diff = Math.floor((expiry - now) / 60000);
            if (diff <= 0) {
                setExpired(true);
                setMinutesLeft(0);
            } else {
                setMinutesLeft(diff);
            }
        };
        update();
        const interval = setInterval(update, 60000);
        return () => clearInterval(interval);
    }, [profile.firstLoginAt]);

    const isRtl = dir === 'rtl';
    const lang = isRtl ? 'ar' : (language === 'fr' ? 'fr' : 'en');
    const visitedModules = profile.visitedModules || [];

    const texts = {
        ar: { trial: 'التجربة المجانية', remaining: 'دقيقة متبقية', expired: 'انتهت التجربة', upgrade: 'ترقية الحساب' },
        fr: { trial: 'Essai Gratuit', remaining: 'min restantes', expired: 'Essai expiré', upgrade: 'Passer Pro' },
        en: { trial: 'Free Trial', remaining: 'min left', expired: 'Trial expired', upgrade: 'Upgrade' },
    };
    const tt = texts[lang as keyof typeof texts];

    return (
        <div className={`w-full px-4 py-2 ${expired ? 'bg-red-50 border-b border-red-100' : 'bg-linear-to-r from-blue-50 to-indigo-50 border-b border-blue-100'}`}>
            <div className={`max-w-7xl mx-auto flex items-center gap-3 flex-wrap ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <Sparkles className={`w-3.5 h-3.5 ${expired ? 'text-red-500' : 'text-blue-600'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${expired ? 'text-red-600' : 'text-blue-700'}`}>
                        {tt.trial}
                    </span>
                </div>

                {minutesLeft !== null && (
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black ${expired ? 'bg-red-100 text-red-700' : 'bg-white text-blue-700 border border-blue-200'}`}>
                        <Timer className="w-3 h-3" />
                        {expired ? tt.expired : `${minutesLeft} ${tt.remaining}`}
                    </div>
                )}

                <div className={`flex items-center gap-1.5 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    {TRIAL_MODULES.map((m) => {
                        const isUsed = visitedModules.includes(m.key);
                        return (
                            <div key={m.key} className={`flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-black border ${isUsed ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-200 text-slate-500'}`}>
                                <span>{m.emoji}</span>
                                <span className="hidden sm:inline">{m.label[lang as keyof typeof m.label]}</span>
                                {isUsed && <CheckCircle2 className="w-2.5 h-2.5" />}
                                {!isUsed && <div className="w-2.5 h-2.5 rounded-full border border-slate-300" />}
                            </div>
                        );
                    })}
                </div>

                <Link
                    href="/subscription"
                    className={`ml-auto flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-full text-[9px] font-black hover:bg-blue-700 transition-all ${isRtl ? 'mr-auto ml-0 flex-row-reverse' : ''}`}
                >
                    {tt.upgrade} →
                </Link>
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
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
    
                if (isProfessionalPlan && !pathname.startsWith("/professional") && !isAdmin) {
                    router.replace("/professional");
                    return;
                }

                // --- Prevent Professional users from accessing other dashboard parts ---
                if (isProfessionalPlan && pathname === "/dashboard" && !isAdmin) {
                    router.replace("/professional");
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

    const isProfessionalRoute = pathname?.startsWith("/professional");

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex" dir={dir}>

            {/* Sidebar */}
            {!isProfessionalRoute && <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />}

            {/* Main Content Area */}
            <div className={cn(
                "flex-1 flex flex-col min-h-screen transition-all duration-300",
                !isProfessionalRoute && (dir === 'rtl' ? 'md:pr-72' : 'md:pl-72')
            )}>
                
                {/* Student Trial Banner */}
                {profile && 
                 profile.plan === 'Student' && 
                 (profile.role === 'Free Tier' || profile.role === 'Trial User') && 
                 profile.activationType !== 'Unlimited' &&
                 !isProfessionalRoute && (
                    <StudentTrialBanner profile={profile} dir={dir} language={dir === 'rtl' ? 'ar' : 'fr'} />
                )}

                {/* Unified Header */}
                {!isProfessionalRoute && <Header onOpenSidebar={() => setIsSidebarOpen(true)} />}

                {/* Main Content */}
                <main className="flex-1 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
