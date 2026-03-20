"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
    Loader2,
    Compass,
    Brain,
    Target,
    Zap,
    ShieldAlert,
    Rocket,
    Key,
    TrendingUp,
    Milestone,
    Lightbulb
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";

const IconMap: Record<string, React.ElementType> = {
    Brain, Target, Compass, Zap, ShieldAlert, Rocket, Key, Lightbulb
};

interface RoadmapPhase {
    phase: string;
    focus: string;
    actions: string[];
    mindsetShift: string;
}

interface CoachAdvice {
    topic: string;
    advice: string;
    icon: string;
}

interface Consultation {
    expertVerdict: string;
    roadmap: RoadmapPhase[];
    coachAdvice: CoachAdvice[];
}

export default function SmartCoachPage() {
    const { language, dir } = useLanguage();
    const isRtl = dir === 'rtl';

    const trans = {
        ar: {
            title: "المرافق الذكي",
            subtitle: "استشارة مجانية وخريطة طريق مهنية مصممة لك خصيصاً كخبير اعتماداً على تحليل بصمتك المهنية.",
            badge: "المستشار الذكي",
            accessing: "استدعاء خبير الموارد البشرية...",
            regenerate: "توليد استشارة جديدة",
            emptyMsg: "لم يكتمل التشخيص بعد لاستخراج خريطة الطريق.",
            retry: "إعادة المحاولة",
            verdictTitle: "حكم الخبير",
            roadmapTitle: "خريطة التحول المهني",
            adviceTitle: "التوصيات الإستراتيجية",
            phaseTag: "المرحلة"
        },
        en: {
            title: "Smart Coach",
            subtitle: "A free consultation and professional roadmap explicitly tailored for you based on your career DNA analysis.",
            badge: "Intelligent Advisor",
            accessing: "Summoning Executive Assessor...",
            regenerate: "Regenerate Consultation",
            emptyMsg: "Diagnosis incomplete. Cannot construct the roadmap.",
            retry: "Retry",
            verdictTitle: "Executive Verdict",
            roadmapTitle: "Professional Transition Roadmap",
            adviceTitle: "Strategic Recommendations",
            phaseTag: "Phase"
        },
        fr: {
            title: "Compagnon Intelligent",
            subtitle: "Une consultation gratuite et une feuille de route professionnelle conçue pour vous selon l'analyse de votre ADN.",
            badge: "Conseiller Intelligent",
            accessing: "Appel de l'Assesseur Exécutif...",
            regenerate: "Régénérer la Consultation",
            emptyMsg: "Diagnostic incomplet. Impossible de construire la feuille de route.",
            retry: "Réessayer",
            verdictTitle: "Verdict Exécutif",
            roadmapTitle: "Feuille de Route de Transition",
            adviceTitle: "Recommandations Stratégiques",
            phaseTag: "Phase"
        }
    }[language as 'ar' | 'en' | 'fr'] || {
        title: "Smart Coach",
        subtitle: "A free consultation and professional roadmap explicitly tailored for you based on your career DNA analysis.",
        badge: "Intelligent Advisor",
        accessing: "Summoning Executive Assessor...",
        regenerate: "Regenerate Consultation",
        emptyMsg: "Diagnosis incomplete. Cannot construct the roadmap.",
        retry: "Retry",
        verdictTitle: "Executive Verdict",
        roadmapTitle: "Professional Transition Roadmap",
        adviceTitle: "Strategic Recommendations",
        phaseTag: "Phase"
    };

    const [consultation, setConsultation] = useState<Consultation | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchConsultation = useCallback(async () => {
        setLoading(true);
        try {
            const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
            const email = userProfile.email || userProfile.fullName;

            const res = await fetch(`/api/professional/smart-coach`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, language })
            });
            const data = await res.json();
            if (data.success) {
                setConsultation(data.consultation);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [language]);

    useEffect(() => {
        fetchConsultation();
    }, [fetchConsultation]);

    if (loading) {
        return (
            <div className="flex-1 min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-6" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">
                    {trans.accessing}
                </p>
            </div>
        );
    }

    if (!consultation) {
        return (
            <div className="flex-1 min-h-[80vh] flex flex-col items-center justify-center p-8 bg-slate-50">
                <Compass className="w-24 h-24 text-indigo-200 mb-6" />
                <p className="text-slate-400 font-black uppercase tracking-widest text-sm max-w-sm text-center mb-8">
                    {trans.emptyMsg}
                </p>
                <button
                    onClick={fetchConsultation}
                    className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-wide text-xs hover:bg-indigo-600 transition-all active:scale-95 shadow-xl"
                >
                    {trans.retry}
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-12 space-y-16 pb-32">
            {/* Header Section */}
            <header className={cn("flex flex-col md:flex-row md:items-end justify-between gap-6", isRtl ? 'md:flex-row-reverse' : '')}>
                <div className={cn("space-y-4", isRtl ? 'text-right' : 'text-left')}>
                    <div className={cn("inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-600 font-black text-[10px] uppercase tracking-widest shadow-sm", isRtl ? 'flex-row-reverse' : '')}>
                        <Lightbulb size={14} />
                        {trans.badge}
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none uppercase">
                        {trans.title}
                    </h1>
                    <p className="text-slate-500 font-medium max-w-xl text-sm md:text-base leading-relaxed">
                        {trans.subtitle}
                    </p>
                </div>

                <button
                    onClick={fetchConsultation}
                    disabled={loading}
                    className={cn(
                        "bg-slate-900 shadow-xl shadow-slate-200 text-white px-6 py-3.5 rounded-2xl font-black hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 active:scale-95 text-xs tracking-widest uppercase disabled:opacity-50",
                        isRtl ? 'flex-row-reverse' : ''
                    )}
                >
                    <Zap size={16} />
                    {trans.regenerate}
                </button>
            </header>

            {/* Verdict Section */}
            <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("bg-slate-950 p-10 md:p-14 rounded-[3rem] shadow-2xl relative overflow-hidden text-white border border-slate-800", isRtl ? "text-right" : "text-left")}
            >
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                    <Brain size={300} />
                </div>
                <div className="relative z-10 space-y-6">
                    <div className={cn("flex items-center gap-3", isRtl ? 'flex-row-reverse' : '')}>
                        <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center">
                            <TrendingUp size={24} />
                        </div>
                        <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">{trans.verdictTitle}</h2>
                    </div>
                    <p className="text-lg md:text-2xl text-slate-300 font-medium leading-relaxed max-w-4xl border-l-4 border-indigo-500 pl-6 rtl:border-l-0 rtl:border-r-4 rtl:pr-6 rtl:pl-0">
                        &quot;{consultation.expertVerdict}&quot;
                    </p>
                </div>
            </motion.section>

            {/* Roadmap Section */}
            <section className="space-y-10">
                <div className={cn("flex items-center gap-4", isRtl ? 'flex-row-reverse' : '')}>
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-900">{trans.roadmapTitle}</h2>
                    <div className="flex-1 h-px bg-slate-200" />
                    <Milestone className="text-indigo-400 w-8 h-8" />
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {consultation.roadmap.map((phase, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className={cn("bg-white border text-left border-slate-100 p-8 rounded-[2.5rem] shadow-lg shadow-slate-200/50 flex flex-col hover:border-indigo-200 hover:shadow-indigo-500/10 transition-all", isRtl && "text-right")}
                        >
                            <div className="space-y-6 flex-1">
                                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 font-black text-[10px] uppercase tracking-widest rounded-xl">
                                    0{idx + 1} {`//`} {trans.phaseTag}
                                </span>
                                <div>
                                    <h3 className="text-lg font-black text-indigo-600 uppercase mb-2">{phase.phase}</h3>
                                    <p className="text-slate-900 font-bold leading-tight">{phase.focus}</p>
                                </div>
                                
                                <ul className="space-y-3 pt-6 border-t border-slate-100">
                                    {phase.actions.map((act, i) => (
                                        <li key={i} className={cn("flex items-start gap-3", isRtl && "flex-row-reverse")}>
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-1.5" />
                                            <span className="text-sm text-slate-600 font-medium leading-relaxed">{act}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Mindset Shift</h4>
                                <p className="text-xs text-slate-500 font-medium italic">&quot;{phase.mindsetShift}&quot;</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Strategic Advice */}
            <section className="space-y-10">
                <div className={cn("flex items-center gap-4", isRtl ? 'flex-row-reverse' : '')}>
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-900">{trans.adviceTitle}</h2>
                    <div className="flex-1 h-px bg-slate-200" />
                    <Target className="text-emerald-400 w-8 h-8" />
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {consultation.coachAdvice.map((adv, idx) => {
                        const AIcon = IconMap[adv.icon] || Lightbulb;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + (idx * 0.1) }}
                                className={cn("bg-slate-900 p-8 rounded-4xl text-left hover:bg-slate-950 transition-all shadow-xl shadow-slate-200/50 group border border-slate-800", isRtl && "text-right")}
                            >
                                <div className={cn("w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors", isRtl && "ml-auto")}>
                                    <AIcon size={24} />
                                </div>
                                <h3 className="text-lg font-black text-white uppercase tracking-tight mb-4">{adv.topic}</h3>
                                <p className="text-slate-400 font-medium leading-relaxed text-sm">
                                    {adv.advice}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
