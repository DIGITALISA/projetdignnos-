"use client";

import { useState, useEffect } from "react";
import { Loader2, Sparkles, PlayCircle, Zap, ArrowRight, Clock } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

function PendingAccountOverlay({ dir }: { dir: 'ltr' | 'rtl' }) {
    const isRtl = dir === 'rtl';
    
    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-6 sm:p-12">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl" />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative w-full max-w-2xl bg-white/90 backdrop-blur-md border border-white/20 rounded-[40px] shadow-2xl overflow-hidden p-10 md:p-16 text-center"
            >
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl" />

                <div className="relative z-10 flex flex-col items-center gap-8">
                    <div className="w-24 h-24 bg-linear-to-tr from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/20 rotate-3 transition-transform hover:rotate-0 duration-500">
                        <Clock className="w-12 h-12 text-white" />
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                            {isRtl ? 'انتهت فترة التجربة! تفعيل الحساب مطلوب' : 'Période d\'essai terminée ! Activation requise'}
                        </h2>
                        
                        <div className="space-y-6 text-slate-600 text-lg md:text-xl font-medium leading-relaxed">
                            <p className="border-b border-slate-100 pb-6 italic">
                                {isRtl 
                                    ? 'لقد استكشفت الحساب لمدة 10 دقائق. لمواصلة استخدام كافة المميزات، يرجى التواصل معنا للتفعيل النهائي.' 
                                    : 'Vous avez exploré le compte pendant 10 minutes. Pour continuer à utiliser toutes les fonctionnalités, veuillez nous contacter pour l\'activation finale.'}
                            </p>
                            
                            <p className="text-base text-slate-900 font-extrabold uppercase tracking-widest">
                                {isRtl 
                                    ? 'تواصل معنا الآن عبر الواتساب لتفعيل حسابك:' 
                                    : 'Contactez-nous maintenant sur WhatsApp pour activer votre compte :'}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
                        <a 
                            href="https://wa.me/21644172284" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/25 hover:-translate-y-1 active:translate-y-0"
                        >
                            <Zap className="w-5 h-5 fill-current" />
                            WhatsApp Activation
                        </a>
                        
                        <button 
                            onClick={() => {
                                localStorage.removeItem('userProfile');
                                window.location.href = '/login';
                            }}
                            className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold text-sm transition-all"
                        >
                            {isRtl ? 'تسجيل الخروج' : 'Se déconnecter'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

interface UserProfile {
    email?: string;
    fullName?: string;
    role?: string;
    plan?: string;
    status?: string;
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
                        profile.status !== readyData.details?.status ||
                        profile.activationType !== readyData.details?.activationType
                    ) {
                        const updatedProfile = {
                            ...profile,
                            canAccessCertificates: readyData.certReady,
                            canAccessRecommendations: readyData.recReady,
                            plan: readyData.plan,
                            role: readyData.role,
                            status: readyData.details?.status,
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

        // ADDED: Timer to check for trial expiry every minute for Pending users
        const timer = setInterval(() => {
            const savedProfile = localStorage.getItem("userProfile");
            if (savedProfile) {
                const profile: UserProfile = JSON.parse(savedProfile);
                if (profile.status === 'Pending' && profile.trialExpiry) {
                    const expiry = new Date(profile.trialExpiry).getTime();
                    if (Date.now() > expiry) {
                        // Trial expired! Show overlay or redirect
                        setProfile({ ...profile }); // Trigger re-render to show overlay
                        // Optional: Clear cookies too if middleware isn't enough
                        document.cookie = "trial_expired=true; path=/";
                    }
                }
            }
        }, 30000); // Check every 30 seconds

        return () => clearInterval(timer);
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

            {/* Pending Account Restriction Overlay - Only show if Pending AND trial expired */}
            {profile?.status === 'Pending' && 
             profile.role !== 'Admin' && 
             profile.role !== 'Moderator' && 
             profile.trialExpiry && 
             new Date(profile.trialExpiry).getTime() < new Date().getTime() && (
                <PendingAccountOverlay dir={dir} />
            )}

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
