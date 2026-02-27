"use client";

import { motion } from "framer-motion";
import { 
    Brain, 
    Target, 
    Sparkles, 
    ClipboardCheck, 
    Award, 
    TrendingUp, 
    CheckCircle2, 
    Users2, 
    MonitorPlay, 
    Lock, 
    UsersRound 
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils";

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
};

const stagger = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function ExpertCallAdminPage() {
    const { language, dir } = useLanguage();
    const t = translations[language as keyof typeof translations].expertCall;

    return (
        <div className={cn(
            "max-w-6xl mx-auto space-y-24 pb-20 pt-10",
            language === 'ar' ? 'font-arabic' : 'font-sans'
        )} dir={dir}>
            {/* Hero Section */}
            <motion.section 
                initial="initial"
                animate="animate"
                variants={stagger}
                className="text-center space-y-8 pt-10"
            >
                <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-widest border border-indigo-100">
                    <Sparkles size={14} className="animate-pulse" />
                    {t.badge}
                </motion.div>
                
                <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight">
                    {t.heroTitle.split(' ').map((word, i) => (
                        word === 'Complet' || word === 'متكامل' || word === 'Complete' || word === 'Professional' || word === 'Parcours' ? 
                        <span key={i} className="text-indigo-600"> {word} </span> : word + ' '
                    ))}
                </motion.h1>
                
                <motion.p variants={fadeIn} className="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-medium italic">
                    {t.heroSubtitle}
                </motion.p>
            </motion.section>

            {/* Concept Section */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-8"
                >
                    <div className="space-y-4">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t.conceptTitle}</h2>
                        <p className="text-slate-600 leading-relaxed text-lg font-medium">
                            {t.conceptDesc}
                        </p>
                    </div>
                    
                    <div className="space-y-4">
                        <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest">{t.pillarsTitle}</h3>
                        {[
                            { icon: Brain, key: 'ai', color: "blue" },
                            { icon: Users2, key: 'sup', color: "indigo" },
                            { icon: Award, key: 'exp', color: "amber" }
                        ].map((pillar, i) => {
                            const pillarData = t.pillars[pillar.key as keyof typeof t.pillars];
                            return (
                                <div key={i} className="flex gap-4 p-5 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                                    <div className={`shrink-0 w-12 h-12 rounded-2xl bg-${pillar.color}-50 text-${pillar.color}-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors`}>
                                        <pillar.icon size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">{pillarData.title}</h3>
                                        <p className="text-sm text-slate-500">{pillarData.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    <div className="absolute -inset-4 bg-indigo-600/5 rounded-5xl blur-3xl" />
                    <div className="relative bg-white p-2 rounded-5xl shadow-2xl border border-slate-100 overflow-hidden">
                        <div className="bg-slate-900 p-10 rounded-4xl text-white space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center">
                                    <Target size={20} />
                                </div>
                                <span className="font-bold tracking-tight uppercase text-xs">{t.target.badge}</span>
                            </div>
                            <h3 className="text-2xl font-bold">{t.target.title}</h3>
                            <ul className="space-y-4 text-slate-400 font-medium">
                                {t.target.list.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle2 size={18} className="text-indigo-400 mt-1 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Phases Section */}
            <section className="space-y-12">
                <div className="text-center space-y-3">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t.phases.title}</h2>
                    <p className="text-slate-500 font-medium">{t.phases.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                        { key: 'diag', icon: ClipboardCheck, badge: "Phase 01", color: "blue" },
                        { key: 'ws', icon: Sparkles, badge: "Phase 02", color: "indigo" }
                    ].map((phase, i) => {
                        const phaseData = t.phases[phase.key as 'diag' | 'ws'] as { title: string; desc: string };
                        return (
                            <div key={i} className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 hover:border-indigo-100 transition-all relative overflow-hidden group">
                                <div className="absolute top-0 right-0 px-3 py-1 bg-white border-b border-l border-slate-100 rounded-bl-xl text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    {phase.badge}
                                </div>
                                <div className={`w-14 h-14 rounded-2xl bg-${phase.color}-50 text-${phase.color}-600 flex items-center justify-center mb-6`}>
                                    <phase.icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{phaseData.title}</h3>
                                <p className="text-slate-600 leading-relaxed text-sm">{phaseData.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Expert Role & Simulation Section */}
            <section className="bg-slate-900 rounded-5xl p-12 lg:p-20 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] -mr-64 -mt-64" />
                
                <div className="relative z-10 space-y-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-indigo-400">
                                <Award size={14} />
                                {t.role.badge}
                            </div>
                            <h2 className="text-4xl font-black tracking-tight">{t.role.title}</h2>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                {t.role.desc}
                            </p>
                            
                            <div className="space-y-6">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-indigo-500 flex items-center gap-2">
                                    <div className="w-8 h-px bg-indigo-500" />
                                    {t.role.tasksTitle}
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {t.role.tasks.map((task: { title: string; text: string }, i: number) => (
                                        <div key={i} className="space-y-2">
                                            <h5 className="font-bold text-indigo-300">{task.title}</h5>
                                            <p className="text-xs text-slate-400 leading-relaxed font-medium">{task.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-10">
                            <div className="bg-indigo-600 rounded-4xl p-10 space-y-6 shadow-2xl shadow-indigo-600/20">
                                <h3 className="text-2xl font-bold flex items-center gap-3">
                                    <MonitorPlay />
                                    {t.stim.title}
                                </h3>
                                <div className="space-y-4 text-indigo-100 text-sm">
                                    <p className="border-b border-indigo-400 pb-3">{t.stim.intro}</p>
                                    <ul className="space-y-3">
                                        {t.stim.list.map((item, i) => <li key={i} className="flex gap-3 items-center">
                                            <div className="w-1.5 h-1.5 rounded-full bg-white opacity-50"/> {item}
                                        </li>)}
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-4xl p-10 space-y-6">
                                <h3 className="text-xl font-bold flex items-center gap-3">
                                    <UsersRound className="text-indigo-400" />
                                    {t.binome.title}
                                </h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    {t.binome.desc}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Conditions Section */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="bg-white p-12 rounded-5xl border border-slate-100 shadow-xl space-y-8">
                    <h3 className="text-2xl font-black text-slate-900">{t.conditions.title}</h3>
                    <div className="space-y-4">
                        {t.conditions.list.map((text, i) => (
                            <div key={i} className="flex gap-4 items-center group">
                                <div className="shrink-0 w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <TrendingUp size={16} />
                                </div>
                                <p className="text-slate-600 font-bold text-sm">{text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-amber-50 p-12 rounded-5xl border border-amber-100 space-y-6">
                    <div className="flex items-center gap-4 text-amber-700">
                        <Lock size={24} />
                        <h3 className="text-xl font-black">{t.pedag.title}</h3>
                    </div>
                    <p className="text-amber-900/70 font-bold leading-relaxed italic">
                        &ldquo;{t.pedag.desc}&rdquo;
                    </p>
                    <div className="pt-6 border-t border-amber-200">
                        <h4 className="text-xs font-bold text-amber-900 uppercase tracking-widest mb-4">{t.benefits.title}</h4>
                        <div className="grid grid-cols-2 gap-3">
                            {t.benefits.list.map((item, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                    <span className="text-[11px] font-bold text-amber-900/70">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
