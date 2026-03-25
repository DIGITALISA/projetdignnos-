"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
    Brain,
    Compass, 
    Users, 
    GraduationCap, 
    FileText, 
    Target, 
    ArrowRight,
    Activity,
    ShieldCheck,
    Zap,
    TrendingUp,
    MapPin,
    LayoutDashboard,
    Briefcase,
    Video,
    BarChart3,
    BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface UserProfile {
    fullName?: string;
    email?: string;
    role?: string;
    plan?: string;
}

interface DiagnosisSummary {
    readinessScore?: number;
    criticalGaps?: string[];
    immediateActions?: string[];
    primaryPath?: string;
    expertSynthesis?: string;
    maturityVerdict?: string;
}

export default function ExecutiveDashboard() {
    const { language, dir } = useLanguage();
    const isRtl = dir === 'rtl';
    const lang = language as "ar" | "en" | "fr";

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [summary, setSummary] = useState<DiagnosisSummary | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const saved = localStorage.getItem('userProfile');
            if (saved) {
                const p = JSON.parse(saved);
                setProfile(p);
                const email = p.email || p.fullName;
                
                const res = await fetch(`/api/professional/sync-progress?email=${encodeURIComponent(email)}`);
                const data = await res.json();
                
                if (data.success && data.progress) {
                    const pData = data.progress;
                    const finalReport = pData.grandFinalReport || pData.finalMasterReport || pData.finalReport;
                    
                    if (finalReport) {
                        setSummary({
                            readinessScore: 
                                pData.finalMasterReport?.holisticScore || 
                                pData.grandFinalReport?.professionalIdentity?.maturityScore || 
                                pData.finalReport?.finalScore || 0,
                            criticalGaps: pData.finalReport?.level2Analysis?.criticalGaps?.slice(0, 3) || [],
                            immediateActions: pData.finalReport?.actionPlan?.immediate?.slice(0, 3) || [],
                            primaryPath: pData.strategicPaths?.paths?.[0]?.title || "Active Professional Development",
                            expertSynthesis: 
                                pData.finalMasterReport?.executiveSummary || 
                                pData.grandFinalReport?.expertSynthesis || 
                                pData.finalReport?.executiveVerdict || "",
                            maturityVerdict: pData.grandFinalReport?.professionalIdentity?.verdict || ""
                        });
                    }
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const trans = {
        ar: {
            welcome: "مرحباً بعودتك،",
            subtitle: "مركز القيادة التنفيذية الخاص بك. نظام متكامل يجمع تحليلاتك وأدواتك في منصة واحدة.",
            score: "مؤشر الجاهزية التنفيذية",
            path: "المسار الاستراتيجي המوصى به",
            gaps: "فجوات استراتيجية (أولوية قصوى)",
            actions: "خطوات التموضع السريع",
            expertSynthesis: "ملخص التدقيق التنفيذي (Confidential)",
            noDiagnosis: "التشخيص الاستراتيجي غير مكتمل - استكمل التقييم لفتح جميع الاستنتاجات",
            startDiagnosis: "إطلاق التشخيص",
            hubTitle: "مركز التحكم الشامل",
            categories: {
                strategy: "الاستراتيجية والهوية (Strategy & Identity)",
                coaching: "التوجيه والذكاء (Intelligence & Coaching)",
                execution: "التنفيذ والعمليات (Execution & Ops)"
            },
            modules: {
                perfStudio: { title: "استوديو الأداء", desc: "التشخيص والقياس المستمر" },
                resumeStudio: { title: "استوديو الهوية", desc: "بناء وثائق وقيمة سوقية" },
                analytics: { title: "تحليلات المسار", desc: "رصد التطور بدقة" },
                smartCoach: { title: "المرافق الذكي", desc: "استشارات ومحاكاة مستمرة" },
                board: { title: "مجلس الخبراء", desc: "تقييم بشري وحل أزمات" },
                workshops: { title: "ورش العمل", desc: "التدريب المتقدم" },
                academy: { title: "الأكاديمية الذكية", desc: "منهج لسد الفجوات" },
                briefings: { title: "الجلسات المباشرة", desc: "موائد مستديرة حية" },
                missions: { title: "مهمات وتدقيق", desc: "تحديات تطبيقية" }
            }
        },
        en: {
            welcome: "Welcome back,",
            subtitle: "Your Executive Command Center. An integrated hub combining your analytics and tools in one unified platform.",
            score: "Executive Readiness Score",
            path: "Recommended Strategic Path",
            gaps: "High-Priority Strategic Gaps",
            actions: "Rapid Positioning Steps",
            expertSynthesis: "Confidential Executive Audit Summary",
            noDiagnosis: "Strategic Diagnosis Incomplete - Complete assessment to unlock all insights",
            startDiagnosis: "Launch Diagnosis",
            hubTitle: "Unified Command Hub",
            categories: {
                strategy: "Strategy & Identity",
                coaching: "Intelligence & Coaching",
                execution: "Execution & Ops"
            },
            modules: {
                perfStudio: { title: "Performance Studio", desc: "Diagnostics & active measurement" },
                resumeStudio: { title: "Identity Studio", desc: "Market value & documentation" },
                analytics: { title: "Career Analytics", desc: "Precise progression tracking" },
                smartCoach: { title: "Smart Coach", desc: "Continuous AI consultation" },
                board: { title: "Advisory Board", desc: "Human expert evaluation" },
                workshops: { title: "Workshops", desc: "Advanced executive training" },
                academy: { title: "Smart Academy", desc: "Curriculum to bridge gaps" },
                briefings: { title: "Live Briefings", desc: "Live expert roundtables" },
                missions: { title: "Missions & Audits", desc: "Applied challenges" }
            }
        },
        fr: {
            welcome: "Bon retour,",
            subtitle: "Votre Centre de Commandement Exécutif. Un hub intégré réunissant vos analyses et outils en une plateforme unifiée.",
            score: "Score de Préparation Exécutive",
            path: "Chemin Stratégique Recommandé",
            gaps: "Lacunes Stratégiques (Priorité Absolue)",
            actions: "Étapes de Positionnement Rapide",
            expertSynthesis: "Synthèse d'Audit Exécutif (Confidentiel)",
            noDiagnosis: "Diagnostic Stratégique incomplet - Terminez pour débloquer les analyses",
            startDiagnosis: "Lancer le Diagnostic",
            hubTitle: "Hub de Commandement Unifié",
            categories: {
                strategy: "Stratégie & Identité",
                coaching: "Intelligence & Coaching",
                execution: "Exécution & Opérations"
            },
            modules: {
                perfStudio: { title: "Studio de Performance", desc: "Diagnostics et mesure active" },
                resumeStudio: { title: "Studio d'Identité", desc: "Valeur et documentation" },
                analytics: { title: "Analytiques Carrière", desc: "Suivi de progression précis" },
                smartCoach: { title: "Coach Intelligent", desc: "Consultation et simulation IA" },
                board: { title: "Comité d'Experts", desc: "Évaluation par experts humains" },
                workshops: { title: "Ateliers", desc: "Formation exécutive avancée" },
                academy: { title: "Académie Intelligente", desc: "Curriculum pour combler les lacunes" },
                briefings: { title: "Briefings en Direct", desc: "Tables rondes interactives" },
                missions: { title: "Missions & Audits", desc: "Défis pratiques appliqués" }
            }
        }
    }[lang];

    const firstName = profile?.fullName?.split(" ")[0] || "Executive";

    const moduleGroups = [
        {
            title: trans.categories.strategy,
            icon: Target,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20",
            items: [
                { href: "/professional/performance-studio", icon: Activity, title: trans.modules.perfStudio.title, desc: trans.modules.perfStudio.desc },
                { href: "/professional/resume-studio", icon: FileText, title: trans.modules.resumeStudio.title, desc: trans.modules.resumeStudio.desc },
                { href: "/professional/career-analytics", icon: BarChart3, title: trans.modules.analytics.title, desc: trans.modules.analytics.desc },
            ]
        },
        {
            title: trans.categories.coaching,
            icon: Brain,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20",
            items: [
                { href: "/professional/smart-coach", icon: Compass, title: trans.modules.smartCoach.title, desc: trans.modules.smartCoach.desc },
                { href: "/professional/advisory-board", icon: Users, title: trans.modules.board.title, desc: trans.modules.board.desc },
                { href: "/professional/workshops", icon: Briefcase, title: trans.modules.workshops.title, desc: trans.modules.workshops.desc },
            ]
        },
        {
            title: trans.categories.execution,
            icon: Zap,
            color: "text-rose-400",
            bg: "bg-rose-500/10",
            border: "border-rose-500/20",
            items: [
                { href: "/professional/smart-academy", icon: GraduationCap, title: trans.modules.academy.title, desc: trans.modules.academy.desc },
                { href: "/professional/live-briefings", icon: Video, title: trans.modules.briefings.title, desc: trans.modules.briefings.desc },
                { href: "/professional/missions", icon: Target, title: trans.modules.missions.title, desc: trans.modules.missions.desc },
            ]
        }
    ];

    if (loading) {
        return (
            <div className="flex-1 min-h-[80vh] flex items-center justify-center bg-slate-950">
                <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-slate-950 min-h-screen text-slate-200">
            <div className="max-w-7xl mx-auto px-6 py-10 space-y-12 pb-32">
                {/* ─── MASSIVE WELCOME HERO ─── */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                        "relative overflow-hidden bg-linear-to-b from-indigo-950/40 to-slate-900 border border-indigo-500/20 p-10 md:p-14 rounded-[3.5rem] shadow-[0_0_50px_rgba(99,102,241,0.05)]",
                        isRtl ? "text-right" : "text-left"
                    )}
                >
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none -mr-[200px] -mt-[200px]" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -ml-[150px] -mb-[150px]" />
                    
                    <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-10">
                        <div className="space-y-6">
                            <div className={cn("inline-flex items-center gap-3 px-5 py-2.5 bg-indigo-500/15 border border-indigo-500/30 rounded-2xl text-indigo-300 font-black text-xs uppercase tracking-widest backdrop-blur-md shadow-sm", isRtl && "flex-row-reverse")}>
                                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                                {profile?.role || "Professional Member"} • {profile?.plan || "Premium"}
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
                                {trans.welcome} <br className="hidden md:block" />
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-indigo-200 to-blue-400">{firstName}</span>.
                            </h1>
                            <p className="text-indigo-200/70 font-medium text-lg max-w-2xl leading-relaxed">
                                {trans.subtitle}
                            </p>
                        </div>
                        {summary && (summary.readinessScore ?? 0) > 0 && (
                            <div className="md:text-center p-8 bg-slate-950/60 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] min-w-[240px]">
                                <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.3em] mb-4">{trans.score}</p>
                                <div className="text-7xl font-black text-white flex items-baseline justify-center gap-1 leading-none">
                                    {summary.readinessScore} <span className="text-3xl text-slate-600">%</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-6 overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${summary.readinessScore}%` }} transition={{ duration: 1.5, delay: 0.5 }} className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* ─── EXECUTIVE SYNTHESIS ─── */}
                {summary?.expertSynthesis ? (
                    <div className="grid lg:grid-cols-12 gap-8">
                        {/* Summary & Verdict */}
                        <div className="lg:col-span-7 space-y-8">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                                className={cn("bg-slate-900 border border-slate-800 p-10 rounded-[3rem] shadow-xl relative overflow-hidden h-full", isRtl ? "text-right" : "text-left")}
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <Brain size={120} />
                                </div>
                                <div className={cn("flex items-center gap-4 mb-8", isRtl && "flex-row-reverse")}>
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <h3 className="text-sm font-black text-indigo-300 uppercase tracking-[0.2em] leading-none">
                                        {trans.expertSynthesis}
                                    </h3>
                                </div>
                                {summary.maturityVerdict && (
                                    <h4 className="text-3xl font-black text-white mb-6 leading-tight tracking-tight">
                                        {summary.maturityVerdict}
                                    </h4>
                                )}
                                <div className={cn("text-slate-300 font-medium leading-relaxed text-sm md:text-base border-indigo-500/30 py-3 italic bg-indigo-500/5 rounded-2xl px-6", isRtl ? "border-r-4" : "border-l-4")}>
                                    &quot;{summary.expertSynthesis}&quot;
                                </div>
                            </motion.div>
                        </div>

                        {/* Actionable Insights */}
                        <div className="lg:col-span-5 grid grid-rows-2 gap-8">
                            {/* Strategic Path */}
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                                className={cn("bg-linear-to-br from-indigo-900 to-indigo-950 border border-indigo-500/20 p-8 rounded-[2.5rem] shadow-xl flex flex-col justify-center", isRtl && "text-right")}
                            >
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-3">{trans.path}</p>
                                <div className={cn("flex items-center gap-4", isRtl && "flex-row-reverse")}>
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white backdrop-blur-md shrink-0"><MapPin size={24} /></div>
                                    <h4 className="text-xl md:text-2xl font-black text-white leading-tight">{summary.primaryPath}</h4>
                                </div>
                            </motion.div>
                            
                            {/* Critical Gaps & Actions */}
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                                className={cn("bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-xl overflow-hidden", isRtl && "text-right")}
                            >
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 mb-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /> {trans.gaps}</div>
                                <ul className="space-y-3">
                                    {summary.criticalGaps?.map((gap, i) => (
                                        <li key={i} className={cn("text-sm font-bold text-slate-300 flex items-start gap-3", isRtl && "flex-row-reverse text-right")}>
                                            <TrendingUp size={16} className="text-rose-500 shrink-0 mt-0.5" /> 
                                            <span className="leading-snug">{gap}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        </div>
                    </div>
                ) : summary?.readinessScore === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-900 border-2 border-dashed border-slate-700/50 p-16 rounded-[3rem] text-center"
                    >
                        <div className="w-24 h-24 bg-slate-950/50 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5 shadow-inner">
                            <Target size={40} className="text-slate-600" />
                        </div>
                        <p className="text-slate-400 font-bold mb-10 uppercase tracking-[0.2em] text-sm">{trans.noDiagnosis}</p>
                        <Link href="/professional/performance-studio">
                            <button className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-indigo-600/40 transition-all hover:scale-105 active:scale-95 flex items-center gap-4 mx-auto">
                                <Zap size={18} />
                                {trans.startDiagnosis}
                            </button>
                        </Link>
                    </motion.div>
                ) : null}

                {/* ─── MODULE CATEGORIES HUB ─── */}
                <div className="space-y-16">
                    <div className="text-center">
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">{trans.hubTitle}</h2>
                        <div className="w-24 h-1.5 bg-indigo-500 rounded-full mx-auto mt-6 shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                    </div>

                    <div className="space-y-16">
                        {moduleGroups.map((group, idx) => (
                            <div key={idx} className="space-y-8">
                                <div className={cn("flex items-center gap-4", isRtl && "flex-row-reverse")}>
                                    <div className={cn(`w-12 h-12 rounded-2xl flex items-center justify-center border text-white shadow-lg ${group.bg} ${group.border}`)}>
                                        <group.icon className={group.color} size={24} />
                                    </div>
                                    <h3 className="text-2xl font-black text-white tracking-tight">{group.title}</h3>
                                </div>
                                
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {group.items.map((link, linkIdx) => (
                                        <Link key={linkIdx} href={link.href}>
                                            <motion.div
                                                whileHover={{ scale: 1.03, y: -5 }}
                                                className={cn(
                                                    "p-8 rounded-[2.5rem] border border-slate-800 bg-slate-900 hover:bg-slate-800 overflow-hidden relative group transition-all h-full flex flex-col shadow-xl",
                                                    isRtl ? "text-right" : "text-left"
                                                )}
                                            >
                                                {/* Hover effect background */}
                                                <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                
                                                <div className={cn("flex items-start justify-between relative z-10 mb-8", isRtl && "flex-row-reverse")}>
                                                    <div className={cn(`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-inner ${group.bg} ${group.border}`)}>
                                                        <link.icon className={group.color} size={28} />
                                                    </div>
                                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white text-slate-500 transition-colors">
                                                        <ArrowRight size={16} className={cn(isRtl && "rotate-180")} />
                                                    </div>
                                                </div>
                                                <h4 className="text-xl font-black text-slate-100 mb-3 relative z-10 tracking-tight">{link.title}</h4>
                                                <p className="text-sm font-medium text-slate-500 leading-relaxed mb-4 flex-1 relative z-10">{link.desc}</p>
                                                
                                                <div className={cn("h-1 w-0 group-hover:w-full transition-all duration-500 bg-indigo-500 absolute bottom-0 left-0")} />
                                            </motion.div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
