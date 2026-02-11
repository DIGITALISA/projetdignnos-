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
    BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { t, dir } = useLanguage();
    const [userName, setUserName] = useState("User");
    const [userRole, setUserRole] = useState("");
    const [trialTimeLeft, setTrialTimeLeft] = useState<string | null>(null);
    const [isTrialExpired, setIsTrialExpired] = useState(false);
    const [canAccessCerts, setCanAccessCerts] = useState(false);
    const [canAccessRecs, setCanAccessRecs] = useState(false);
    const [canAccessScorecard, setCanAccessScorecard] = useState(false);
    const [userPlan, setUserPlan] = useState("None");
    const [isDiagnosisComplete, setIsDiagnosisComplete] = useState(false);
    const [attestationStatus, setAttestationStatus] = useState("None");
    const [grantedWorkshop, setGrantedWorkshop] = useState("");

    const sidebarItems = [
        {
            category: t.sidebar.categories.main,
            items: [
                { name: t.sidebar.items.overview, icon: LayoutDashboard, href: "/dashboard" },
            ]
        },
        {
            category: "Strategic Career Management",
            items: [
                { name: "1. Diagnosis & Audit", icon: FileText, href: "/assessment/cv-upload" },
                { name: "2. Real-world Simulations", icon: Users, href: "/simulation" },
                { name: "3. Executive Workshops", icon: PlayCircle, href: "/training" },
                { name: "4. AI Advisor", icon: Sparkles, href: "/mentor" },
                { name: "5. Knowledge Base", icon: BookOpen, href: "/academy" },
                { name: "6. Resource Center", icon: Library, href: "/library" },
                { name: "7. Expert Consultation", icon: MessageSquare, href: "/expert" },
                { name: "8. Career Roadmap", icon: TrendingUp, href: "/roadmap" },
            ]
        },
        {
            category: t.sidebar.categories.achievements,
            items: [
                { name: t.sidebar.items.certificates, icon: Award, href: "/certificate" },
                { name: t.sidebar.items.recommendation, icon: ShieldCheck, href: "/recommendation" },
                { name: "Executive Scorecard", icon: BarChart3, href: "/performance-scorecard" },
                { name: t.sidebar.items.jobAlignment, icon: Sparkles, href: "/job-alignment" },
                { name: t.sidebar.items.strategicReport, icon: Sparkles, href: "/strategic-report" },
            ]
        },
        {
            category: t.sidebar.categories.system,
            items: [
                { name: "My Subscription", icon: CreditCard, href: "/subscription" },
                { name: t.sidebar.items.settings, icon: Settings, href: "/settings" },
            ]
        }
    ];

    // DYNAMICALLY Add Workshop Attestation if Granted
    if (attestationStatus === "Granted") {
        const achievementGroup = sidebarItems.find(g => g.category === t.sidebar.categories.achievements);
        if (achievementGroup) {
            achievementGroup.items.push({
                name: "Workshop Attestation",
                icon: Award,
                href: `/workshop-attestation?activeWorkshop=${encodeURIComponent(grantedWorkshop)}`
            });
        }
    }

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
                    setCanAccessCerts(!!profile.canAccessCertificates);
                    setCanAccessRecs(!!profile.canAccessRecommendations);
                    setCanAccessScorecard(!!profile.canAccessScorecard);
                    setIsDiagnosisComplete(!!profile.isDiagnosisComplete);

                    // FETCH LATEST FROM API to sync if admin changed something
                    const userId = profile.email || profile.fullName;
                    if (userId) {
                        try {
                            const res = await fetch(`/api/user/readiness?userId=${encodeURIComponent(userId)}`);
                            const data = await res.json();
                            if (data.success) {
                                setCanAccessCerts(data.certReady);
                                setCanAccessRecs(data.recReady);
                                setCanAccessScorecard(data.scorecardReady);
                                
                                // Update localStorage to stay in sync
                                const updatedProfile = { 
                                    ...profile, 
                                    canAccessCertificates: data.certReady, 
                                    canAccessRecommendations: data.recReady,
                                    canAccessScorecard: data.scorecardReady
                                };
                                localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
                            }
                        } catch (err) {
                            console.error("Failed to sync access flags", err);
                        }

                        // SYNC ATTESTATION STATUS
                        try {
                            const res = await fetch(`/api/user/profile?userId=${encodeURIComponent(userId)}`);
                            const data = await res.json();
                            if (data.success) {
                                setAttestationStatus(data.profile.workshopAttestationStatus || "None");
                                setGrantedWorkshop(data.profile.grantedWorkshopTitle || "");
                            }
                        } catch (err) {
                            console.error("Failed to sync attestation status", err);
                        }
                    }

                    if (profile.role === "Trial User" && profile.trialExpiry) {
                        const expiry = new Date(profile.trialExpiry).getTime();
                        const updateTimer = () => {
                            const now = new Date().getTime();
                            const diff = expiry - now;
                            if (diff <= 0) {
                                setTrialTimeLeft("Expired");
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
    }, []);

    // Check if an item should be locked based on diagnosis status and plan
    const isLocked = (href: string) => {
        const isFreePlan = userPlan === "Free Trial" || userPlan === "None" || userRole === "Trial User";

        // ALWAYS LOCK Achievements/Official Assets for Free Trial users
        const achievementPaths = ["/certificate", "/recommendation", "/performance-scorecard", "/job-alignment", "/strategic-report"];
        if (achievementPaths.includes(href) && isFreePlan) {
            return true;
        }

        // High security paths: certificates and recommendations (for non-free users who haven't been approved yet)
        if (href === "/certificate") return !canAccessCerts;
        if (href === "/recommendation") return !canAccessRecs;
        if (href === "/performance-scorecard") return !canAccessScorecard;

        const alwaysOpen = ["/dashboard", "/subscription", "/settings"];
        if (alwaysOpen.includes(href)) return false;

        // PERMANENT FREE ASSETS (after diagnosis): 2, 3, 6 (Simulation, Training, Library)
        const permanentFreePaths = ["/simulation", "/training", "/library"];
        
        // LIMITED TRIAL ASSETS (1h only): 1 (Diagnosis), 4, 5, 7, 8
        const limitedTrialPaths = ["/assessment", "/mentor", "/academy", "/expert", "/roadmap"];

        // 1. If Trial is Expired, LOCK the limited assets (1, 4, 5, 7, 8)
        if (limitedTrialPaths.some(p => href.startsWith(p)) && isTrialExpired && isFreePlan) {
            return true;
        }

        // 2. If Diagnosis is NOT complete, LOCK EVERYTHING ELSE (2-8)
        const restrictedPaths = [...permanentFreePaths, "/mentor", "/academy", "/expert", "/roadmap"];
        if (restrictedPaths.some(p => href.startsWith(p)) && !isDiagnosisComplete) {
            return true;
        }
        
        // Diagnosis starts unlocked but ends locked after 1h
        if (href.startsWith("/assessment")) return false;
        
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
                "fixed top-0 h-screen w-72 bg-white/80 backdrop-blur-xl border-slate-200/60 z-50 transition-all duration-500 ease-in-out md:translate-x-0 shadow-2xl md:shadow-none",
                dir === 'rtl' ? "right-0 border-l" : "left-0 border-r",
                isOpen ? "translate-x-0" : (dir === 'rtl' ? "translate-x-full" : "-translate-x-full")
            )}>
                <div className="h-20 flex items-center justify-between px-7 border-b border-slate-100/80 bg-white/50">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:rotate-6 transition-transform duration-300">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-xl tracking-tight text-slate-900 leading-none">CareerUpgrade</span>
                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-blue-600 mt-1">AI Platform</span>
                        </div>
                    </Link>
                    <button onClick={onClose} className="md:hidden p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-slate-600 outline-none">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pt-8 pb-32 px-4 space-y-8 custom-scrollbar h-full">
                    {sidebarItems.map((group, idx) => (
                        <div key={idx} className="space-y-2">
                            <div className={cn("px-4 flex items-center justify-between mb-2", dir === 'rtl' && "flex-row-reverse")}>
                                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">{group.category}</h3>
                                <div className={cn("h-px flex-1 bg-slate-100 opacity-50", dir === 'rtl' ? "mr-3" : "ml-3")} />
                            </div>

                            <div className="space-y-1">
                                {group.items.map((item) => {
                                    const locked = isLocked(item.href);
                                    const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");

                                    return (
                                        <div key={item.href} className="relative group">
                                            {locked ? (
                                                <div
                                                    className={cn(
                                                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 cursor-not-allowed opacity-60 text-slate-400 bg-slate-50/50",
                                                        dir === 'rtl' && "flex-row-reverse"
                                                    )}
                                                >
                                                    <div className="w-5 h-5 flex items-center justify-center">
                                                        <Lock size={16} className="text-slate-300" />
                                                    </div>
                                                    <span className="flex-1">{item.name}</span>
                                                </div>
                                            ) : (
                                                    <Link
                                                    href={item.href}
                                                    onClick={() => onClose()}
                                                    prefetch={false} // Disable prefetch to stop log spam
                                                    className={cn(
                                                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group relative overflow-hidden",
                                                        isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-600 hover:text-blue-600 hover:bg-blue-50/50",
                                                        dir === 'rtl' && "flex-row-reverse"
                                                    )}
                                                >
                                                    <div className={cn("relative z-10 w-5 h-5 flex items-center justify-center", isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600")}>
                                                        <item.icon className="w-full h-full" />
                                                    </div>
                                                    <span className="relative z-10 flex-1">{item.name}</span>
                                                    {isActive && (
                                                        <motion.div layoutId="activeHighlight" className="absolute inset-0 bg-linear-to-r from-blue-600 to-indigo-600" initial={false} transition={{ type: "spring", stiffness: 300, damping: 30 }} />
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

                <div className="absolute bottom-0 w-full p-6 bg-linear-to-t from-white via-white to-transparent">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
                        <div className={cn("flex items-center gap-3", dir === 'rtl' && "flex-row-reverse")}>
                            <div className="relative">
                                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold border border-white shadow-sm overflow-hidden">
                                    {userName.charAt(0)}
                                </div>
                                <div className={cn("absolute -bottom-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full", dir === 'rtl' ? "-left-1" : "-right-1")} />
                            </div>
                            <div className={cn("flex-1 min-w-0", dir === 'rtl' ? "text-right" : "text-left")}>
                                <div className="flex items-center gap-1.5 justify-between">
                                    <p className="text-sm font-bold text-slate-900 truncate tracking-tight">{userName}</p>
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border",
                                        userPlan === "Elite Full Pack" ? "bg-amber-100 text-amber-700 border-amber-200" :
                                            userPlan === "Pro Essential" ? "bg-blue-100 text-blue-700 border-blue-200" :
                                                "bg-slate-100 text-slate-600 border-slate-200"
                                    )}>
                                        {userPlan === "Elite Full Pack" ? "élite" :
                                            userPlan === "Pro Essential" ? "pro" : "essai"}
                                    </span>
                                </div>
                                <div className={cn("flex items-center gap-1.5 mt-0.5", dir === 'rtl' && "flex-row-reverse")}>
                                    <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse",
                                        userRole === "Trial User" ? "bg-amber-500" : "bg-blue-500"
                                    )} />
                                    <p className={cn(
                                        "text-[10px] font-bold uppercase tracking-wider",
                                        userRole === "Trial User" && !isTrialExpired ? "text-amber-600" :
                                            userRole === "Trial User" && isTrialExpired ? "text-red-500" : "text-blue-600"
                                    )}>
                                        {userRole === "Trial User" ? `${isTrialExpired ? "Accès Limité" : "Essai : " + trialTimeLeft}` : t.sidebar.premium}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    // Clear everything
                                    localStorage.clear();
                                    sessionStorage.clear();
                                    // Clear common cookies
                                    document.cookie.split(";").forEach((c) => {
                                        document.cookie = c
                                            .replace(/^ +/, "")
                                            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                                    });
                                    window.location.replace('/login');
                                }}
                                className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300 group"
                                title={t.sidebar.items.signOut}
                            >
                                <LogOut className={cn("w-4 h-4 transition-transform", dir === 'rtl' ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1")} />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
}
