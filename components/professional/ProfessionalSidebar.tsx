"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Brain,
    LogOut,
    Sparkles,
    X,
    Settings,
    LayoutDashboard,
    ChevronRight,
    FileText,
    Target,
    Video,
    Library,
    Presentation,
    Award,
    Lock,
    BarChart3,
    ShieldCheck,
    Globe,
    GraduationCap,
    Compass,
    Users,
    Rocket,
    Bot,
    Crown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useState, useEffect } from "react";

interface ProfessionalSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ProfessionalSidebar({ isOpen, onClose }: ProfessionalSidebarProps) {
    const pathname = usePathname();
    const { language, dir } = useLanguage();
    const isRtl = dir === 'rtl';

    const t = {
        ar: {
            brand: "MA TRAINING",
            subtitle: "حساب المهنيين",
            executiveDashboard: "لوحة القيادة التنفيذية",
            diagnosis: "التشخيص ومراجعة المسار",
            analytics: "وحش التسويق (Marketing Beast)",
            missions: "الميسيونات الإحترافية",
            workshops: "ورش العمل (Workshops)",
            resources: "مركز الموارد والأدوات",
            liveBriefings: "الجلسات المباشرة (Live Briefings)",
            attestations: "الاعتمادات والشهادات",
            identityStudio: "استوديو الهوية المهنية",
            credentialsGroup: "الوصول للصلاحيات (Credentials)",
            recommendations: "التوصيات الإستراتيجية",
            performanceAnalytics: "تحليلات الأداء التنفيذي",
            strategicReport: "تقرير الذكاء الاستراتيجي (SCI)",
            settings: "الإعدادات",
            logout: "تسجيل الخروج",
            status: "خبير نشط",
            smartAcademy: "الاكاديمية الذكية",
            smartCoach: "المرافق الذكي",
            advisoryBoard: "مجلس الخبراء",
            subscriptions: "الاشتراكات والترقيات"
        },
        en: {
            brand: "MA TRAINING",
            subtitle: "Professional Account",
            executiveDashboard: "Executive Dashboard",
            diagnosis: "Diagnosis & Career Review",
            analytics: "Marketing Beast",
            missions: "Strategic Missions",
            workshops: "Workshops",
            resources: "Resource Center",
            liveBriefings: "Live Briefings",
            attestations: "Certified Accreditations",
            identityStudio: "Identity Studio",
            credentialsGroup: "Credentials Access",
            recommendations: "Strategic Recommendations",
            performanceAnalytics: "Performance Analytics",
            strategicReport: "Strategic Intelligence (SCI)",
            settings: "Settings",
            logout: "Sign Out",
            status: "Active Expert",
            smartAcademy: "Smart Academy",
            smartCoach: "Smart Coach",
            advisoryBoard: "Advisory Board",
            subscriptions: "Premium Subscriptions"
        },
        fr: {
            brand: "MA TRAINING",
            subtitle: "Compte Professionnel",
            executiveDashboard: "Tableau de Bord Exécutif",
            diagnosis: "Diagnostic & Revue",
            analytics: "Marketing Beast",
            missions: "Missions Stratégiques",
            workshops: "Ateliers (Workshops)",
            resources: "Centre de Ressources",
            liveBriefings: "Briefings en Direct",
            attestations: "Accréditations Certifiées",
            identityStudio: "Studio d'Identité",
            credentialsGroup: "Accès aux Crédidentiels",
            recommendations: "Recommandations Stratégiques",
            performanceAnalytics: "Analyses de Performance",
            strategicReport: "Intelligence Stratégique (SCI)",
            settings: "Paramètres",
            logout: "Déconnexion",
            status: "Expert Actif",
            smartAcademy: "Académie Intelligente",
            smartCoach: "Compagnon Intelligent",
            advisoryBoard: "Comité d'Experts",
            subscriptions: "Abonnements Premium"
        }
    }[language as 'ar' | 'en' | 'fr'] || {
        brand: "MA TRAINING",
        subtitle: "Professional Account",
        executiveDashboard: "Executive Dashboard",
        diagnosis: "Diagnosis & Career Review",
        analytics: "Career Analytics",
        missions: "Strategic Missions",
        workshops: "Workshops",
        resources: "Resource Center",
        liveBriefings: "Live Briefings",
        attestations: "Certificates",
        identityStudio: "Identity Studio",
        settings: "Settings",
        logout: "Sign Out",
        status: "Active Expert",
        smartAcademy: "Smart Academy",
        smartCoach: "Smart Coach",
        advisoryBoard: "Advisory Board",
        subscriptions: "Subscriptions"
    };

    const menuGroups = [
        {
            groupId: "core",
            title: language === 'ar' ? 'المركز الاستراتيجي' : (language === 'fr' ? 'Centre Stratégique' : 'Core Identity'),
            icon: Target,
            items: [
                {
                    name: t.executiveDashboard,
                    icon: LayoutDashboard,
                    href: "/professional/executive-dashboard",
                    active: pathname === "/professional/executive-dashboard"
                },
                {
                    name: t.diagnosis,
                    icon: Brain,
                    href: "/professional",
                    active: pathname === "/professional"
                },
                {
                    name: t.identityStudio,
                    icon: FileText,
                    href: "/professional/resume-studio",
                    active: pathname === "/professional/resume-studio"
                }
            ]
        },
        {
            groupId: "ai",
            title: language === 'ar' ? 'الذكاء والمرافقة' : (language === 'fr' ? 'Intelligence & Conseil' : 'AI Advisory'),
            icon: Bot,
            items: [
                {
                    name: t.smartCoach,
                    icon: Compass,
                    href: "/professional/smart-coach",
                    active: pathname === "/professional/smart-coach"
                },
                {
                    name: t.advisoryBoard,
                    icon: Users,
                    href: "/professional/advisory-board",
                    active: pathname.startsWith("/professional/advisory-board")
                },
                {
                    name: t.smartAcademy,
                    icon: GraduationCap,
                    href: "/professional/smart-academy",
                    active: pathname === "/professional/smart-academy"
                }
            ]
        },
        {
            groupId: "ops",
            title: language === 'ar' ? 'العمليات والموارد' : (language === 'fr' ? 'Opérations' : 'Ops & Growth'),
            icon: Rocket,
            items: [
                {
                    name: t.missions,
                    icon: Target,
                    href: "/professional/missions",
                    active: pathname === "/professional/missions"
                },
                {
                    name: t.resources,
                    icon: Library,
                    href: "/professional/resources",
                    active: pathname === "/professional/resources"
                },
                {
                    name: t.workshops,
                    icon: Video,
                    href: "/professional/workshops",
                    active: pathname === "/professional/workshops"
                },
                {
                    name: t.liveBriefings,
                    icon: Presentation,
                    href: "/professional/live-briefings",
                    active: pathname === "/professional/live-briefings"
                },
                {
                    name: t.subscriptions,
                    icon: Crown,
                    href: "/professional/subscription",
                    active: pathname === "/professional/subscription"
                }
            ]
        }
    ];

    const [accessFlags, setAccessFlags] = useState({
        certificates: false,
        recommendations: false,
        scorecard: false,
        sci: false
    });

    const [userProfile, setUserProfile] = useState<{ fullName?: string; email?: string; plan?: string; role?: string; [key: string]: unknown } | null>(null);
    const isPaidPlan = userProfile?.plan && ['Pro Activation', 'Pro', 'Executive Coaching', 'Executive', 'Board Member Tier', 'Board Member'].includes(userProfile.plan as string);

    useEffect(() => {
        const loadAccess = async () => {
            const saved = localStorage.getItem("userProfile");
            if (saved) {
                const profile = JSON.parse(saved);
                setUserProfile(profile);
                
                // Fetch latest from API to ensure sync with admin
                const userId = profile.email || profile.fullName;
                if (userId) {
                    try {
                        const res = await fetch(`/api/user/readiness?userId=${encodeURIComponent(userId)}`);
                        const data = await res.json();
                        if (data.success) {
                            setAccessFlags({
                                certificates: !!data.certReady,
                                recommendations: !!data.recReady,
                                scorecard: !!data.scorecardReady,
                                sci: !!data.sciReady
                            });
                        }
                    } catch (err) {
                        console.error("Access check failed", err);
                        // Fallback to local if API fails
                        setAccessFlags({
                            certificates: !!profile.canAccessCertificates,
                            recommendations: !!profile.canAccessRecommendations,
                            scorecard: !!profile.canAccessScorecard,
                            sci: !!profile.canAccessSCI
                        });
                    }
                }
            }
        };
        loadAccess();
    }, [pathname]);

    const credentialItems = [
        {
            name: t.attestations,
            icon: Award,
            href: "/professional/attestations",
            locked: !accessFlags.certificates,
            active: pathname === "/professional/attestations"
        },
        {
            name: t.recommendations,
            icon: ShieldCheck,
            href: "/professional/recommendations",
            locked: !accessFlags.recommendations,
            active: pathname === "/professional/recommendations"
        },
        {
            name: t.performanceAnalytics,
            icon: BarChart3,
            href: "/professional/career-analytics",
            locked: !accessFlags.scorecard,
            active: pathname === "/professional/career-analytics"
        },
        {
            name: t.strategicReport,
            icon: Globe,
            href: "/professional/strategic-report",
            locked: !accessFlags.sci,
            active: pathname === "/professional/strategic-report"
        }
    ];

    const handleLogout = () => {
        localStorage.removeItem("userProfile");
        window.location.href = "/login";
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
                "fixed top-0 h-screen w-72 bg-white/40 backdrop-blur-3xl border-slate-100 z-50 transition-all duration-500 ease-in-out md:translate-x-0 shadow-[0_0_50px_rgba(0,0,0,0.03)] md:shadow-none flex flex-col",
                isRtl ? "right-0 border-l" : "left-0 border-r",
                isOpen ? "translate-x-0" : (isRtl ? "translate-x-full" : "-translate-x-full")
            )}>
                {/* Brand Header */}
                <div className="h-24 shrink-0 flex items-center justify-between px-8 border-b border-slate-100 bg-white/20">
                    <Link href="/professional" className="flex flex-col group">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-[0_10px_20px_rgba(79,70,229,0.2)] group-hover:scale-105 transition-transform">
                                <Sparkles size={18} fill="currentColor" />
                            </div>
                            <h1 className="font-black text-2xl tracking-tighter text-slate-900 leading-none">MATC</h1>
                        </div>
                        <span className="text-[9px] font-black text-indigo-600 tracking-[0.2em] mt-1.5 uppercase opacity-80">
                            {t.subtitle}
                        </span>
                    </Link>
                    <button onClick={onClose} className="md:hidden p-2 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-8 px-4 space-y-8">
                    <div className="space-y-6">
                        {/* Hub Groups */}
                        {menuGroups.map((group) => (
                            <div key={group.groupId} className="space-y-2 mb-6">
                                <div className={cn("px-4 mb-3 flex items-center gap-2 opacity-60", isRtl && "flex-row-reverse")}>
                                    <group.icon size={12} className="text-indigo-600" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{group.title}</span>
                                </div>
                                {group.items.map((item) => {
                                    const isDiagnosis = item.href === "/professional";
                                    const isLocked = !isPaidPlan && !isDiagnosis;

                                    return isLocked ? (
                                        <div
                                            key={item.href}
                                            className={cn(
                                                "flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all cursor-not-allowed opacity-30 grayscale text-slate-400",
                                                isRtl && "flex-row-reverse text-right"
                                            )}
                                        >
                                            <item.icon className="w-5 h-5 text-slate-400" />
                                            <span className="flex-1">{item.name}</span>
                                            <Lock size={14} className="text-slate-400" />
                                        </div>
                                    ) : (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group relative",
                                                item.active 
                                                    ? "bg-indigo-600 text-white shadow-[0_10px_20px_rgba(79,70,229,0.15)] scale-[1.02]" 
                                                    : "text-slate-500 hover:text-slate-900 hover:bg-white/60 hover:shadow-sm",
                                                isRtl && "flex-row-reverse text-right"
                                            )}
                                        >
                                            <item.icon className={cn("w-5 h-5", item.active ? "text-white" : "text-slate-400 group-hover:text-indigo-500")} />
                                            <span className="flex-1">{item.name}</span>
                                            {item.active && <ChevronRight size={14} className={cn("opacity-50", isRtl && "rotate-180")} />}
                                        </Link>
                                    );
                                })}
                            </div>
                        ))}

                        {/* CREDENTIALS Group */}
                        <div className="space-y-2">
                            <div className={cn("px-4 mb-4 flex items-center gap-2 opacity-50", isRtl && "flex-row-reverse")}>
                                <ShieldCheck size={10} className="text-indigo-600" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{t.credentialsGroup}</span>
                            </div>
                            {credentialItems.map((item) => {
                                const isLocked = item.locked || !isPaidPlan;
                                return (
                                    <div key={item.href} className="relative">
                                        {isLocked ? (
                                            <div
                                                className={cn(
                                                    "flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all cursor-not-allowed opacity-30 grayscale text-slate-400",
                                                    isRtl && "flex-row-reverse text-right"
                                                )}
                                            >
                                                <item.icon className="w-5 h-5 text-slate-400" />
                                                <span className="flex-1">{item.name}</span>
                                                <Lock size={14} className="text-slate-400" />
                                            </div>
                                        ) : (
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    "flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group relative",
                                                    item.active 
                                                        ? "bg-indigo-600 text-white shadow-[0_10px_20px_rgba(79,70,229,0.15)] scale-[1.02]" 
                                                        : "text-slate-500 hover:text-slate-900 hover:bg-white/60 hover:shadow-sm",
                                                    isRtl && "flex-row-reverse text-right"
                                                )}
                                            >
                                                <item.icon className={cn("w-5 h-5", item.active ? "text-white" : "text-slate-400 group-hover:text-indigo-500")} />
                                                <span className="flex-1">{item.name}</span>
                                                {item.active && <ChevronRight size={14} className={cn("opacity-50", isRtl && "rotate-180")} />}
                                            </Link>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="p-6 border-t border-slate-100 bg-white/10 space-y-4">
                    <Link 
                        href="/settings"
                        className={cn(
                            "flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-white transition-all",
                            isRtl && "flex-row-reverse text-right"
                        )}
                    >
                        <Settings size={18} />
                        <span className="flex-1">{t.settings}</span>
                    </Link>
                    
                    <div className={cn(
                        "p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3",
                        isRtl && "flex-row-reverse text-right"
                    )}>
                        <div className="w-10 h-10 rounded-full bg-indigo-600 border border-indigo-200 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-100">
                            {userProfile?.fullName?.charAt(0) || 'P'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-slate-900 truncate uppercase">{userProfile?.fullName || 'Expert User'}</p>
                            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-tighter leading-none mt-0.5">{t.status}</p>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </aside>
        </div>
    );
}
