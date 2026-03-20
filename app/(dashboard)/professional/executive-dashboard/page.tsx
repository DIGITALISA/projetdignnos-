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
    LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface UserProfile {
    fullName?: string;
    email?: string;
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
            subtitle: "مركز القيادة التنفيذية الخاص بك. بياناتك وتحليلاتك جاهزة للتنفيذ.",
            score: "مؤشر الجاهزية",
            path: "المسار الموصى به",
            gaps: "فجوات استراتيجية حرجة",
            actions: "خطوات عاجلة",
            expertSynthesis: "ملخص الخلاصة التنفيذية",
            noDiagnosis: "التشخيص غير مكتمل - ابدأ الآن للوصول للتحليلات",
            startDiagnosis: "ابدأ التشخيص الآن",
            quickAction: "التحرك السريع",
            hub: {
                ai: "مركز الذكاء الاصطناعي",
                identity: "تطوير الهوية",
                ops: "العمليات"
            },
            cards: {
                coach: { title: "المرافق الذكي", desc: "استشارة مجانية وخريطة طريق" },
                board: { title: "مجلس الخبراء", desc: "4 دكاترة وخبراء لحل أزماتك" },
                academy: { title: "الأكاديمية الذكية", desc: "منهج مخصص لسد فجواتك" },
                resume: { title: "استوديو الهوية", desc: "بناء سيرة وقيمة سوقية" }
            }
        },
        en: {
            welcome: "Welcome back,",
            subtitle: "Your Executive Command Center. Your data and analytics are ready for action.",
            score: "Readiness Score",
            path: "Recommended Path",
            gaps: "Critical Strategic Gaps",
            actions: "Immediate Actions",
            expertSynthesis: "Executive Synthesis Summary",
            noDiagnosis: "Diagnosis Incomplete - Start now to unlock insights",
            startDiagnosis: "Start Diagnosis Now",
            quickAction: "Quick Actions",
            hub: {
                ai: "AI Intelligence Hub",
                identity: "Identity Development",
                ops: "Operations"
            },
            cards: {
                coach: { title: "Smart Coach", desc: "Free consultation & roadmap" },
                board: { title: "Advisory Board", desc: "4 Experts to solve your crises" },
                academy: { title: "Smart Academy", desc: "Custom curriculum for you" },
                resume: { title: "Identity Studio", desc: "Build market value" }
            }
        },
        fr: {
            welcome: "Bon retour,",
            subtitle: "Votre Centre de Commandement Exécutif. Vos données sont prêtes.",
            score: "Score de Préparation",
            path: "Chemin Recommandé",
            gaps: "Lacunes Stratégiques",
            actions: "Actions Immédiates",
            expertSynthesis: "Synthèse Exécutive",
            noDiagnosis: "Diagnostic incomplet - Commencez pour débloquer les analyses",
            startDiagnosis: "Démarrer le diagnostic",
            quickAction: "Actions Rapides",
            hub: {
                ai: "Centre IA",
                identity: "Développement d'Identité",
                ops: "Opérations"
            },
            cards: {
                coach: { title: "Coach Intelligent", desc: "Consultation et parcours gratuits" },
                board: { title: "Comité d'Experts", desc: "4 Experts IA pour vous" },
                academy: { title: "Académie", desc: "Combler vos lacunes" },
                resume: { title: "Studio d'Identité", desc: "Construire votre valeur" }
            }
        }
    }[lang];

    const firstName = profile?.fullName?.split(" ")[0] || "Executive";

    const quickLinks = [
        { href: "/professional/advisory-board", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", title: trans.cards.board.title, desc: trans.cards.board.desc },
        { href: "/professional/smart-coach", icon: Compass, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", title: trans.cards.coach.title, desc: trans.cards.coach.desc },
        { href: "/professional/resume-studio", icon: FileText, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", title: trans.cards.resume.title, desc: trans.cards.resume.desc },
        { href: "/professional/smart-academy", icon: GraduationCap, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20", title: trans.cards.academy.title, desc: trans.cards.academy.desc }
    ];

    if (loading) {
        return (
            <div className="flex-1 min-h-[80vh] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-12 pb-32">
            {/* Massive Welcome Banner */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                    "relative overflow-hidden bg-slate-950 p-10 md:p-14 rounded-[3rem] shadow-2xl border border-white/5",
                    isRtl ? "text-right" : "text-left"
                )}
            >
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-rose-500/10 blur-[100px] rounded-full pointer-events-none" />
                
                <div className="relative z-10">
                    <div className={cn("inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400 font-black text-[10px] uppercase tracking-widest shadow-sm mb-6", isRtl && "flex-row-reverse")}>
                        <LayoutDashboard size={14} />
                        {trans.quickAction}
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight leading-none mb-6">
                        {trans.welcome} <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-white to-indigo-100">{firstName}</span>.
                    </h1>
                    <p className="text-slate-400 font-medium text-lg max-w-2xl leading-relaxed">
                        {trans.subtitle}
                    </p>
                </div>
            </motion.div>

            {/* Expert Synthesis / Summary Section */}
            {summary?.expertSynthesis ? (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={cn(
                        "bg-linear-to-br from-slate-900 to-slate-950 border border-indigo-500/10 p-10 rounded-[3rem] shadow-2xl relative",
                        isRtl ? "text-right" : "text-left"
                    )}
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/10">
                            <Brain size={20} />
                        </div>
                        <h3 className="text-sm font-black text-indigo-100 uppercase tracking-widest leading-none">
                            {trans.expertSynthesis}
                        </h3>
                    </div>
                    {summary.maturityVerdict && (
                        <h4 className="text-xl font-black text-white mb-4 leading-tight">
                            {summary.maturityVerdict}
                        </h4>
                    )}
                    <div className="text-slate-400 font-medium leading-relaxed text-sm lg:text-base border-l-2 border-indigo-500/30 pl-6 py-2 italic bg-indigo-500/5 rounded-r-3xl">
                        &quot;{summary.expertSynthesis}&quot;
                    </div>
                </motion.div>
            ) : summary?.readinessScore === 0 && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900/50 border-2 border-dashed border-white/5 p-12 rounded-[3rem] text-center"
                >
                    <div className="w-20 h-20 bg-slate-950 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-inner">
                        <Target size={32} className="text-slate-700" />
                    </div>
                    <p className="text-slate-500 font-bold mb-8 uppercase tracking-widest text-xs">{trans.noDiagnosis}</p>
                    <Link href="/professional">
                        <button className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-indigo-600/40 transition-all hover:scale-105 active:scale-95 flex items-center gap-4 mx-auto">
                            {trans.startDiagnosis}
                            <ArrowRight size={18} className={cn(isRtl && "rotate-180")} />
                        </button>
                    </Link>
                </motion.div>
            )}

            {/* Diagnosis Summary Widget */}
            {summary && (summary.readinessScore ?? 0) > 0 && (
                <div className="grid md:grid-cols-3 gap-8">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className={cn("bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group", isRtl && "text-right")}>
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                            <Activity size={80} />
                        </div>
                        <div className={cn("flex items-center gap-4 mb-8", isRtl && "flex-row-reverse")}>
                            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20"><Activity size={24} /></div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{trans.score}</p>
                                <h3 className="text-4xl font-black text-white">{summary.readinessScore}%</h3>
                            </div>
                        </div>
                        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${summary.readinessScore}%` }} className="h-full bg-linear-to-r from-indigo-600 to-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)]" transition={{ duration: 1.5, delay: 0.5 }} />
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className={cn("bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl", isRtl && "text-right")}>
                        <div className={cn("flex items-center gap-4 mb-6", isRtl && "flex-row-reverse text-right")}>
                            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20"><ShieldCheck size={24} /></div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{trans.gaps}</p>
                        </div>
                        <ul className="space-y-4">
                            {summary.criticalGaps?.map((gap, i) => (
                                <li key={i} className={cn("text-xs font-bold text-slate-300 flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5", isRtl && "flex-row-reverse text-right")}>
                                    <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)] shrink-0" /> {gap}
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className={cn("bg-indigo-600 border border-indigo-400/20 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group", isRtl && "text-right")}>
                        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform">
                            <MapPin size={80} className="text-white" />
                        </div>
                        <div className={cn("flex items-center gap-4 mb-6", isRtl && "flex-row-reverse")}>
                            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white backdrop-blur-md"><MapPin size={24} /></div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-100 mb-1">{trans.path}</p>
                                <h4 className="text-lg font-black text-white leading-tight">{summary.primaryPath}</h4>
                            </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-white/10">
                             <p className="text-[10px] font-black uppercase tracking-widest text-indigo-100 mb-4">{trans.actions}</p>
                             <ul className="space-y-3">
                                {summary.immediateActions?.map((act, i) => (
                                    <li key={i} className={cn("text-[11px] font-bold text-white flex items-start gap-3", isRtl && "flex-row-reverse text-right")}>
                                        <TrendingUp size={14} className="text-indigo-200 shrink-0 mt-0.5" /> {act}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Quick Actions Grid */}
            <div className="space-y-10">
                <div className={cn("flex items-center gap-6", isRtl && "flex-row-reverse")}>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">{trans.quickAction}</h2>
                    <div className="flex-1 h-px bg-white/5" />
                    <Zap className="text-indigo-500 w-6 h-6 animate-pulse" />
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {quickLinks.map((link, idx) => (
                        <Link key={idx} href={link.href}>
                            <motion.div
                                whileHover={{ scale: 1.05, y: -10 }}
                                className={cn(
                                    "p-10 rounded-[3rem] border border-white/5 bg-slate-900/50 backdrop-blur-xl shadow-2xl hover:bg-slate-900 hover:border-indigo-500/30 transition-all flex flex-col h-full group",
                                    isRtl ? "text-right" : "text-left"
                                )}
                            >
                                <div className={cn(`w-16 h-16 rounded-3xl flex items-center justify-center mb-8 border transition-all ${link.bg} ${link.color} ${link.border} group-hover:scale-110 shadow-lg`, isRtl && "ml-auto")}>
                                    <link.icon size={28} />
                                </div>
                                <h3 className="text-xl font-black text-white mb-3 tracking-tight">{link.title}</h3>
                                <p className="text-sm font-medium text-slate-500 leading-relaxed mb-10 flex-1">{link.desc}</p>
                                <div className={cn("flex items-center gap-3 mt-auto text-[10px] font-black uppercase tracking-[0.2em]", link.color, isRtl && "flex-row-reverse")}>
                                    {trans.hub.ai}
                                    <ArrowRight size={16} className={cn("transition-transform group-hover:translate-x-2", isRtl && "rotate-180 group-hover:-translate-x-2")} />
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
