"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    FileText,
    Users,
    PlayCircle,
    Library,
    MessageSquare,
    Settings,
    LogOut,
    Sparkles,
    X,
    Award,
    ShieldCheck,
    BookOpen,
    Lock,
    CreditCard,
    TrendingUp,
    BarChart3,
    Globe,
    Zap,
    Crown,
    Activity,
    Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

interface SidebarItem {
    name: string;
    icon: React.ElementType;
    href: string;
    isAI?: boolean;
    isLive?: boolean;
}

interface SidebarGroup {
    category: string;
    icon: React.ElementType;
    items: SidebarItem[];
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { t, dir, language, setLanguage } = useLanguage();
    const [userName, setUserName] = useState("User");
    const [userRole, setUserRole] = useState("");
    const [trialTimeLeft, setTrialTimeLeft] = useState<string | null>(null);
    const [isTrialExpired, setIsTrialExpired] = useState(false);
    const [userPlan, setUserPlan] = useState("None");
    const [isDiagnosisComplete, setIsDiagnosisComplete] = useState(false);
    const [hasStartedDiagnosis, setHasStartedDiagnosis] = useState(false);
    const [hasSCI, setHasSCI] = useState(false);
    const [hasCompletedSimulation, setHasCompletedSimulation] = useState(false);
    const [hasScorecard, setHasScorecard] = useState(false);

    const sidebarItems: SidebarGroup[] = [
        {
            category: t.sidebar.categories.main,
            icon: Zap,
            items: [
                { name: t.sidebar.items.overview, icon: LayoutDashboard, href: "/dashboard" },
            ]
        },
        {
            category: t.sidebar.categories.diagnostic,
            icon: Activity,
            items: [
                { name: t.sidebar.items.diagnosis, icon: FileText, href: "/assessment/cv-upload" },
            ]
        },
        {
            category: t.sidebar.categories.aiModules,
            icon: Sparkles,
            items: [
                { name: t.sidebar.items.mentor, icon: Sparkles, href: "/mentor", isAI: true },
                { name: t.sidebar.items.academy, icon: BookOpen, href: "/academy", isAI: true },
                { name: t.sidebar.items.expert, icon: MessageSquare, href: "/expert", isAI: true },
                { name: t.sidebar.items.roadmap, icon: TrendingUp, href: "/roadmap", isAI: true },
            ]
        },
        {
            category: t.sidebar.categories.humanLed,
            icon: Users,
            items: [
                { name: t.sidebar.items.training, icon: PlayCircle, href: "/training", isLive: true },
                { name: t.sidebar.items.tools, icon: Target, href: "/simulation", isLive: true },
                { name: t.sidebar.items.library, icon: Library, href: "/library" },
            ]
        },
        {
            category: t.sidebar.categories.strategicTools,
            icon: BarChart3,
            items: [
                { name: t.sidebar.items.strategicReport, icon: BarChart3, href: "/strategic-report", isAI: true },
                { name: t.sidebar.items.performanceScorecard, icon: TrendingUp, href: "/performance-scorecard", isAI: true },
                { name: t.sidebar.items.jobAlignment, icon: Globe, href: "/job-alignment", isAI: true },
            ]
        },
        {
            category: t.sidebar.categories.officialDocuments,
            icon: Crown,
            items: [
                { name: t.sidebar.items.attestations, icon: Award, href: "/attestations" },
                { name: t.sidebar.items.recommendation, icon: ShieldCheck, href: "/recommendation" },
                { name: t.sidebar.items.certificates, icon: Award, href: "/certificate" },
            ]
        },
        {
            category: t.sidebar.categories.system,
            icon: Settings,
            items: [
                { name: t.sidebar.items.subscription, icon: CreditCard, href: "/subscription" },
                { name: t.sidebar.items.settings, icon: Settings, href: "/settings" },
                // Admin/Moderator Link
                ...(userRole === "Admin" || userRole === "Moderator" ? [
                    { name: t.sidebar.items.moderator, icon: ShieldCheck, href: "/moderateur" }
                ] : [])
            ]
        }
    ];


    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;

        const loadProfile = async () => {
            if (intervalId) clearInterval(intervalId);
            try {
                const savedProfile = localStorage.getItem("userProfile");
                if (savedProfile) {
                    const profile = JSON.parse(savedProfile);
                    if (profile.fullName) setUserName(profile.fullName);
                    if (profile.role) setUserRole(profile.role);
                    if (profile.plan) setUserPlan(profile.plan);
                    
                    // Initial load from localStorage
                    setIsDiagnosisComplete(!!profile.isDiagnosisComplete);
                    setHasStartedDiagnosis(!!profile.hasStartedDiagnosis);
                    setHasSCI(!!profile.hasSCI);
                    setHasCompletedSimulation(!!profile.hasCompletedSimulation);
                    setHasScorecard(!!profile.hasScorecard);

                    // FETCH LATEST FROM API to sync if admin changed something
                    const userId = profile.email || profile.fullName;
                    if (userId) {
                        try {
                            const res = await fetch(`/api/user/readiness?userId=${encodeURIComponent(userId)}`);
                            const data = await res.json();
                            if (data.success) {
                                if (data.plan) setUserPlan(data.plan);
                                if (data.role) setUserRole(data.role);
                                
                                setIsDiagnosisComplete(data.isDiagnosticComplete);
                                setHasStartedDiagnosis(data.details?.hasStartedDiagnosis || false);
                                setHasSCI(data.details?.hasSCI || false);
                                setHasCompletedSimulation(data.details?.hasCompletedSimulation || false);
                                setHasScorecard(data.details?.hasScorecard || false);
                                
                                // Update localStorage to stay in sync
                                const updatedProfile = { 
                                    ...profile, 
                                    canAccessCertificates: data.certReady, 
                                    canAccessRecommendations: data.recReady,
                                    canAccessScorecard: data.scorecardReady,
                                    canAccessSCI: data.sciReady,
                                    isDiagnosisComplete: data.isDiagnosticComplete,
                                    hasStartedDiagnosis: data.details?.hasStartedDiagnosis || false,
                                    hasSCI: data.details?.hasSCI || false,
                                    hasCompletedSimulation: data.details?.hasCompletedSimulation || false,
                                    hasScorecard: data.details?.hasScorecard || false,
                                    plan: data.plan || profile.plan,
                                    role: data.role || profile.role
                                };
                                localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
                            }
                        } catch (err) {
                            console.error("Failed to sync access flags", err);
                        }

                    }

                    if ((profile.role === "Trial User" || profile.role === "Free Tier") && profile.trialExpiry) {
                        const expiry = new Date(profile.trialExpiry).getTime();
                        const updateTimer = () => {
                            const now = new Date().getTime();
                            const diff = expiry - now;
                            if (diff <= 0) {
                                setTrialTimeLeft(t.sidebar.expired);
                                setIsTrialExpired(true);
                            } else {
                                const h = Math.floor(diff / (1000 * 60 * 60));
                                const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                                const s = Math.floor((diff % (1000 * 60)) / 1000);
                                
                                // Show seconds only if less than 1 hour for high urgency
                                if (h === 0) {
                                    setTrialTimeLeft(`${m}m ${s}s`);
                                } else {
                                    setTrialTimeLeft(`${h}h ${m}m`);
                                }
                                setIsTrialExpired(false);
                            }
                        };
                        updateTimer();
                        intervalId = setInterval(updateTimer, 1000); // Update every second for premium feel
                    }
                }
            } catch (e) {
                console.error("Failed to load profile", e);
            }
        };

        loadProfile();
        window.addEventListener("profileUpdated", loadProfile);
        return () => {
            window.removeEventListener("profileUpdated", loadProfile);
            if (intervalId) clearInterval(intervalId);
        };
    }, [t.sidebar.expired]);

    // Check if an item should be locked based on a progressive hierarchy
    const isLocked = (href: string) => {
        // 0. ADMIN BYPASS
        if (userRole === "Admin" || userRole === "Moderator") return false;
        

        // 1. ALWAYS OPEN: Essential pages
        const alwaysOpen = ["/dashboard", "/subscription", "/settings", "/assessment/cv-upload", "/assessment/cv-generation"];
        if (alwaysOpen.includes(href)) return false;

        // 2. PRO BYPASS: Unlock everything for paid users (Pro, Executive, etc.)
        const isFreePlan = userPlan === "Free Trial" || userPlan === "None" || userRole === "Trial User";
        if (!isFreePlan) return false;

        // 3. STAGE 1 LOCK: Everything requires starting diagnosis (CV Upload done)
        if (!hasStartedDiagnosis) {
             return true; 
        }

        // 3. STAGE 2 LOCK: SCI Logic (Strategic Report)
        // Needs Diagnosis Complete (Interview done)
        if (href.startsWith("/strategic-report") || href.startsWith("/assessment/results")) {
            return !isDiagnosisComplete;
        }

        // 4. STAGE 3 LOCK: Simulation & Job Alignment & Roadmap
        // Needs SCI to be generated (Strategic Intelligence)
        const strategicTools = ["/simulation", "/job-alignment", "/roadmap", "/mentor", "/academy", "/library", "/expert"];
        
        if (strategicTools.some((p: string) => href.startsWith(p))) {
            // Even if diagnostic is complete, if it's a FREE plan, we keep these locked to encourage upgrade
            if (isFreePlan) return true;
            
            // Unlock for PRO if either SCI is ready OR core diagnosis is complete
            if (!hasSCI && !isDiagnosisComplete) return true;
        }

        // Training (Workshops) - Unlock only after diagnosis completion
        if (href.startsWith("/training")) {
             return !isDiagnosisComplete;
        }

        // 5. STAGE 4 LOCK: Executive Scorecard
        // Needs at least one simulation mission completed
        if (href.startsWith("/performance-scorecard")) {
            if (isFreePlan) return true;
            return !hasCompletedSimulation;
        }

        // 6. STAGE 5 LOCK: Official Assets (Certificates, Recommendations, Attestations)
        // Needs Performance Scorecard / Expert Validation (Profile created)
        if (href.startsWith("/certificate") || href.startsWith("/recommendation") || href.startsWith("/attestations")) {
            if (isFreePlan) return true;
            return !hasScorecard;
        }

        // 7. SUBSCRIPTION FALLBACK: For Free Trial users after trial expiry
        const limitedTrialPaths = ["/mentor", "/academy", "/expert", "/roadmap"];
        if (limitedTrialPaths.some(p => href.startsWith(p)) && isTrialExpired && isFreePlan) {
            return true;
        }

        return false;
    };

    return (
        <div dir={dir}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
                        onClick={onClose}
                    />
                )}
            </AnimatePresence>

            <aside className={cn(
                "fixed top-0 h-screen w-72 bg-white/90 backdrop-blur-2xl border-slate-200/60 z-50 transition-all duration-500 ease-in-out md:translate-x-0 shadow-[0_0_50px_-12px_rgba(0,0,0,0.1)] md:shadow-none flex flex-col select-none",
                dir === 'rtl' ? "right-0 border-l" : "left-0 border-r",
                isOpen ? "translate-x-0" : (dir === 'rtl' ? "translate-x-full" : "-translate-x-full")
            )}>
                <div className="h-24 shrink-0 flex items-center justify-between px-8 border-b border-slate-100/80 bg-linear-to-b from-white to-slate-50/30">
                    <Link href="/" className="flex flex-col justify-center group py-2">
                        <div className="flex items-center gap-2">
                            <h1 className="font-black text-3xl tracking-tighter leading-none bg-linear-to-br from-slate-900 via-blue-900 to-slate-800 bg-clip-text text-transparent select-none group-hover:scale-[1.02] transition-transform origin-left">
                                MATC
                            </h1>
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse mt-1" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 tracking-[0.2em] mt-1.5 uppercase opacity-80">
                            {dir === 'rtl' ? 'للاستشارات والتدريب' : 'Consulting & Training'}
                        </span>
                    </Link>
                    <button onClick={onClose} className="md:hidden p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-600 outline-none transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pt-8 pb-10 px-5 space-y-10 custom-scrollbar">
                    {sidebarItems.map((group, idx) => (
                        <div key={idx} className="space-y-3">
                            <div className={cn("px-3 flex items-center gap-2.5 opacity-40", dir === 'rtl' && "flex-row-reverse")}>
                                <group.icon className="w-3 h-3 text-slate-500" />
                                <h3 className="text-[9px] font-black text-slate-900 uppercase tracking-[0.25em] whitespace-nowrap">{group.category}</h3>
                                <div className={cn("h-px flex-1 bg-slate-200", dir === 'rtl' ? "mr-1" : "ml-1")} />
                            </div>

                            <div className="space-y-1">
                                {group.items.map((item) => {
                                    const locked = isLocked(item.href);
                                    const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");

                                    return (
                                        <div key={item.href} className="relative">
                                            {locked ? (
                                                <div
                                                    className={cn(
                                                        "flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[13px] font-bold transition-all duration-300 cursor-not-allowed opacity-40 grayscale text-slate-500",
                                                        dir === 'rtl' && "flex-row-reverse"
                                                    )}
                                                >
                                                    <Lock size={14} strokeWidth={2.5} className="text-slate-400 shrink-0" />
                                                    <span className="flex-1">{item.name}</span>
                                                </div>
                                            ) : (
                                                    <Link
                                                    href={item.href}
                                                    onClick={() => onClose()}
                                                    prefetch={false}
                                                    className={cn(
                                                        "flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[13px] font-bold transition-all duration-300 group relative overflow-hidden",
                                                        isActive 
                                                            ? "bg-slate-900 text-white shadow-[0_10px_20px_-10px_rgba(15,23,42,0.3)]" 
                                                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/80",
                                                        dir === 'rtl' && "flex-row-reverse"
                                                    )}
                                                >
                                                    <div className={cn("relative z-10 shrink-0 transition-colors duration-300", isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-900")}>
                                                        <item.icon className="w-[18px] h-[18px]" strokeWidth={2.5} />
                                                    </div>
                                                    <span className="relative z-10 flex-1 truncate">{item.name}</span>
                                                    
                                                    {item.isAI && (
                                                        <span className={cn(
                                                            "relative z-10 text-[8px] font-black px-1.5 py-0.5 rounded-md border tracking-tighter",
                                                            isActive 
                                                                ? "bg-white/10 border-white/20 text-blue-300" 
                                                                : "bg-blue-50 border-blue-100 text-blue-600"
                                                        )}>
                                                            {language === 'en' ? 'AI' : 'IA'}
                                                        </span>
                                                    )}
                                                    
                                                    {item.isLive && (
                                                        <span className={cn(
                                                            "relative z-10 text-[8px] font-black px-1.5 py-0.5 rounded-md border tracking-tighter flex items-center gap-1",
                                                            isActive 
                                                                ? "bg-white/10 border-white/20 text-emerald-400" 
                                                                : "bg-emerald-50 border-emerald-100 text-emerald-600"
                                                        )}>
                                                            <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
                                                            LIVE
                                                        </span>
                                                    )}

                                                    {isActive && (
                                                        <motion.div 
                                                            layoutId="sidebarActive"
                                                            className="absolute inset-px rounded-[15px] bg-slate-900 z-0" 
                                                            initial={false} 
                                                            transition={{ type: "spring", stiffness: 400, damping: 35 }} 
                                                        />
                                                    )}
                                                </Link>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="shrink-0 bg-white border-t border-slate-100 z-20">
                    {/* Compact Language Selection */}
                    <div className="px-6 py-3 border-b border-slate-50/50">
                        <div className="flex p-0.5 bg-slate-50 rounded-lg border border-slate-100/60 items-center">
                            {[
                                { id: 'en', label: 'ENG' },
                                { id: 'fr', label: 'FRA' },
                                { id: 'ar', label: 'العربية' }
                            ].map((lang) => (
                                <button
                                    key={lang.id}
                                    onClick={() => setLanguage(lang.id as "en" | "fr" | "ar")}
                                    className={cn(
                                        "flex-1 py-1 text-[8px] font-black rounded-md transition-all uppercase tracking-tighter",
                                        language === lang.id 
                                            ? "text-blue-600 font-black" 
                                            : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
                                    )}
                                >
                                    {lang.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 px-6">
                        <div className={cn("flex items-center gap-3", dir === 'rtl' && "flex-row-reverse")}>
                            <div className="relative shrink-0">
                                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white text-[10px] font-black border border-white/10 shadow-sm overflow-hidden">
                                    {userName.charAt(0)}
                                </div>
                                <div className={cn("absolute -bottom-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full", dir === 'rtl' ? "-left-0.5" : "-right-0.5")} />
                            </div>
                            <div className={cn("flex-1 min-w-0", dir === 'rtl' ? "text-right" : "text-left")}>
                                <div className="flex items-center gap-1.5 justify-between">
                                    <p className="text-[11px] font-black text-slate-900 truncate tracking-tight uppercase">{userName}</p>
                                    <span className={cn(
                                        "px-1.5 py-1 rounded text-[7px] font-black uppercase tracking-tighter border leading-none",
                                        userPlan === "Pro Essential" ? "bg-blue-600 text-white border-blue-700" :
                                                "bg-slate-100 text-slate-500 border-slate-200"
                                    )}>
                                        {userPlan === "Pro Essential" ? "PRO" : "TRIAL"}
                                    </span>
                                </div>
                                {trialTimeLeft && userPlan !== "Pro Essential" && (
                                    <div className={cn("flex items-center gap-1 mt-1", dir === 'rtl' ? "flex-row-reverse" : "")}>
                                        <div className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
                                        <p className="text-[8px] font-black text-slate-500 tracking-tighter uppercase">{trialTimeLeft}</p>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={async () => {
                                    try {
                                        await fetch('/api/auth/logout', { method: 'POST' });
                                    } catch (e) {
                                        console.error("Logout API failed", e);
                                    } finally {
                                        localStorage.clear();
                                        sessionStorage.clear();
                                        document.cookie.split(";").forEach((c) => {
                                            document.cookie = c
                                                .replace(/^ +/, "")
                                                .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                                        });
                                        window.location.href = '/login';
                                    }
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all duration-300 group"
                            >
                                <LogOut className={cn("w-3.5 h-3.5", dir === 'rtl' ? "rotate-180" : "")} />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
}
