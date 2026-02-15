"use client";

import { motion } from "framer-motion";
import {
    PlayCircle,
    Library,
    MessageSquare,
    CheckCircle,
    AlertTriangle,
    Cpu,
    Target,
    Zap,
    TrendingUp,
    ShieldCheck,
    Globe,
    Sparkles
} from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function MethodologyPage() {
    const { t, language, dir } = useLanguage();
    const m = t.methodology;

    const transformationStages = [
        {
            id: "01",
            title: m.cycle.stage1.title,
            subtitle: m.cycle.stage1.sub,
            icon: Cpu,
            description: m.cycle.stage1.desc,
            color: "blue",
            features: [m.cycle.stage1.f1, m.cycle.stage1.f2, m.cycle.stage1.f3]
        },
        {
            id: "02",
            title: m.cycle.stage2.title,
            subtitle: m.cycle.stage2.sub,
            icon: AlertTriangle,
            description: m.cycle.stage2.desc,
            color: "red",
            features: [m.cycle.stage2.f1, m.cycle.stage2.f2, m.cycle.stage2.f3]
        },
        {
            id: "03",
            title: m.cycle.stage3.title,
            subtitle: m.cycle.stage3.sub,
            icon: PlayCircle,
            description: m.cycle.stage3.desc,
            color: "green",
            features: [m.cycle.stage3.f1, m.cycle.stage3.f2, m.cycle.stage3.f3]
        },
        {
            id: "04",
            title: m.cycle.stage4.title,
            subtitle: m.cycle.stage4.sub,
            icon: Library,
            description: m.cycle.stage4.desc,
            color: "amber",
            features: [m.cycle.stage4.f1, m.cycle.stage4.f2, m.cycle.stage4.f3]
        },
        {
            id: "05",
            title: m.cycle.stage5.title,
            subtitle: m.cycle.stage5.sub,
            icon: MessageSquare,
            description: m.cycle.stage5.desc,
            color: "purple",
            features: [m.cycle.stage5.f1, m.cycle.stage5.f2, m.cycle.stage5.f3]
        }
    ];

    const valueProps = [
        { title: t.features.cards.diagnosis.title, desc: m.essence.precision, icon: Target },
        { title: t.cert.title, desc: m.essence.recognition, icon: ShieldCheck },
        { title: t.sidebar.items.certificates, desc: m.essence.speed, icon: Zap },
        { title: m.essence.network.split(' ')[0], desc: m.essence.network, icon: Globe }
    ];

    const isRtl = dir === 'rtl';

    return (
        <div className={cn("min-h-screen bg-[#fcfcfc] dark:bg-slate-950 selection:bg-blue-100 italic-none", language === 'ar' ? 'font-arabic' : 'font-sans')} dir={dir}>
            <Navbar />

            <main className="pt-20">
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-24">
                    <div className="container mx-auto px-4 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-4xl mx-auto text-center space-y-8"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] mb-8 shadow-xl shadow-slate-200 dark:shadow-none">
                                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                                {m.badge}
                            </div>
                            <h1 className="text-5xl lg:text-[7rem] font-serif font-black text-slate-900 dark:text-white tracking-tighter mb-8 leading-[0.85] uppercase">
                                {m.titlePre} <br />
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-700 to-slate-900 dark:from-blue-400 dark:to-white">
                                    {m.titleHighlight}
                                </span>
                            </h1>
                            <p className="text-lg lg:text-xl text-slate-500 dark:text-slate-400 leading-relaxed mb-10 max-w-2xl mx-auto font-medium">
                                {m.subtitle}
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-6">
                                <Link
                                    href="/auth/register"
                                    className="px-10 py-5 bg-slate-900 dark:bg-blue-600 text-white rounded-4xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-300 dark:shadow-none hover:scale-105 transition-all"
                                >
                                    {m.ctaStart}
                                </Link>
                                <button className="px-10 py-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-800 rounded-4xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-3">
                                    <PlayCircle size={20} className="text-blue-600" />
                                    {m.ctaVideo}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Core Essence Section */}
                <section className="py-24 bg-white dark:bg-slate-900/30 border-y border-slate-100 dark:border-slate-900">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-2 gap-20 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="space-y-8"
                            >
                                <h2 className="text-5xl font-serif font-black text-slate-900 dark:text-white uppercase leading-none tracking-tighter">{m.essence.title}</h2>
                                <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-line font-medium max-w-xl">
                                    {m.essence.desc}
                                </p>
                                <div className="grid grid-cols-2 gap-8 pt-6">
                                    {valueProps.map((prop, i) => (
                                        <div key={i} className="space-y-3 p-6 bg-slate-50 dark:bg-slate-800 rounded-4xl border border-slate-100 dark:border-slate-700">
                                            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 text-blue-600 flex items-center justify-center shadow-sm">
                                                <prop.icon size={24} />
                                            </div>
                                            <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{prop.title}</h4>
                                            <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed font-bold">{prop.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="relative rounded-[3rem] overflow-hidden shadow-2xl bg-slate-900 dark:bg-slate-950 aspect-square flex items-center justify-center group border-12 border-slate-800 dark:border-slate-800/50"
                            >
                                <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 to-transparent" />
                                <div className="relative z-10 flex flex-col items-center gap-6">
                                    <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center text-white border border-white/20 group-hover:scale-110 transition-transform cursor-pointer shadow-2xl">
                                        <PlayCircle size={48} fill="currentColor" className={isRtl ? "mr-1" : "ml-1"} />
                                    </div>
                                    <span className="text-white font-black tracking-[0.3em] uppercase text-[10px]">{m.ctaVideo}</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* The Cycle */}
                <section className="py-32 bg-[#fcfcfc] dark:bg-slate-950">
                    <div className="container mx-auto px-4 text-center mb-32 space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">
                            <TrendingUp size={14} />
                            Strategic Transformation
                        </div>
                        <h2 className="text-5xl md:text-7xl font-serif font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">{m.cycle.title}</h2>
                        <p className="text-lg text-slate-400 dark:text-slate-500 max-w-xl mx-auto font-medium">{m.cycle.subtitle}</p>
                    </div>

                    <div className="container mx-auto px-4 space-y-32">
                        {transformationStages.map((stage, idx) => (
                            <motion.div
                                key={stage.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                className={cn(
                                    "flex flex-col items-center gap-12 lg:gap-24",
                                    idx % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                                )}
                            >
                                <div className="flex-1 space-y-8">
                                    <div className="flex items-center gap-6">
                                        <div className="text-8xl font-serif font-black text-slate-100 dark:text-slate-900 uppercase italic leading-none">{stage.id}</div>
                                        <div className="h-px flex-1 bg-slate-100 dark:bg-slate-900" />
                                    </div>
                                    <h3 className="text-4xl font-serif font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{stage.title}</h3>
                                    <p className="text-blue-600 dark:text-blue-400 font-black text-[10px] tracking-[0.2em] uppercase">{stage.subtitle}</p>
                                    <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed font-medium">{stage.description}</p>
                                    <div className="grid sm:grid-cols-2 gap-4 pt-6">
                                        {stage.features.map((f, i) => (
                                            <div key={i} className="flex items-center gap-3 px-6 py-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-50 dark:border-slate-800 shadow-sm">
                                                <CheckCircle size={18} className="text-blue-500" />
                                                <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{f}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex-1 w-full max-w-xl">
                                    <div className={cn(
                                        "aspect-square rounded-[4rem] p-16 flex items-center justify-center relative bg-white dark:bg-slate-900/50 border border-slate-50 dark:border-slate-800 shadow-2xl"
                                    )}>
                                        <div className={cn(
                                            "w-full h-full rounded-[3rem] flex items-center justify-center bg-slate-50 dark:bg-slate-800 transition-all duration-500 group-hover:scale-95"
                                        )}>
                                            <stage.icon size={120} strokeWidth={1} className={cn(
                                                stage.color === "blue" ? "text-blue-600" :
                                                    stage.color === "red" ? "text-red-600" :
                                                        stage.color === "green" ? "text-green-600" :
                                                            stage.color === "amber" ? "text-amber-600" :
                                                                "text-purple-600"
                                            )} />
                                        </div>
                                        <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-[2.5rem] bg-slate-900 dark:bg-blue-600 text-white flex items-center justify-center shadow-2xl">
                                            <TrendingUp size={48} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-32 container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="bg-slate-900 dark:bg-blue-600 rounded-[4rem] p-16 lg:p-32 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-900/20"
                    >
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                        <h2 className="text-4xl lg:text-7xl font-serif font-black mb-8 uppercase tracking-tighter leading-none">{m.ctaFinal.title}</h2>
                        <p className="text-xl lg:text-2xl text-slate-400 dark:text-blue-100 mb-16 max-w-2xl mx-auto font-medium">
                            {m.ctaFinal.desc}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Link
                                href="/auth/register"
                                className="px-12 py-6 bg-white text-slate-900 rounded-4xl font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all"
                            >
                                {m.ctaFinal.btnStart}
                            </Link>
                        </div>
                    </motion.div>
                </section>
            </main>
        </div>
    );
}
