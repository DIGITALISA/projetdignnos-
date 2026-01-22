"use client";

import { motion } from "framer-motion";
import {
    PlayCircle,
    Library,
    MessageSquare,
    CheckCircle,
    Award,
    AlertTriangle,
    Cpu,
    Target,
    Zap,
    TrendingUp,
    ShieldCheck,
    Globe
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
        { title: t.features.cards.aiTools.title, desc: m.essence.precision, icon: Target },
        { title: t.features.cards.certificates.title, desc: m.essence.recognition, icon: ShieldCheck },
        { title: t.features.cards.achievements.title, desc: m.essence.speed, icon: Zap },
        { title: m.essence.network.split(' ')[0], desc: m.essence.network, icon: Globe }
    ];

    const isRtl = dir === 'rtl';

    return (
        <div className={cn("min-h-screen bg-slate-50 selection:bg-blue-100 italic-none", language === 'ar' ? 'font-arabic' : 'font-sans')} dir={dir}>
            <Navbar />

            <main className="pt-20">
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-24">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-20">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-[120px]" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400 rounded-full blur-[120px]" />
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-4xl mx-auto text-center"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-black uppercase tracking-[0.2em] mb-8">
                                <Zap className="w-3 h-3 text-blue-400" />
                                {m.badge}
                            </div>
                            <h1 className="text-4xl lg:text-7xl font-bold text-slate-900 tracking-tight mb-8">
                                {m.titlePre} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{m.titleHighlight}</span>
                            </h1>
                            <p className="text-lg lg:text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto">
                                {m.subtitle}
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-4">
                                <Link
                                    href="/auth/register"
                                    className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-1 transition-all"
                                >
                                    {m.ctaStart}
                                </Link>
                                <button className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all">
                                    {m.ctaVideo}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Core Essence Section */}
                <section className="py-24 bg-white border-y border-slate-100">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="space-y-6"
                            >
                                <h2 className="text-4xl font-bold text-slate-900">{m.essence.title}</h2>
                                <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-line">
                                    {m.essence.desc}
                                </p>
                                <div className="grid grid-cols-2 gap-6 pt-6">
                                    {valueProps.map((prop, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                                <prop.icon size={20} />
                                            </div>
                                            <h4 className="font-bold text-slate-900">{prop.title}</h4>
                                            <p className="text-xs text-slate-500 leading-relaxed">{prop.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-900 aspect-video flex items-center justify-center group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent" />
                                <div className="relative z-10 flex flex-col items-center gap-4">
                                    <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 group-hover:scale-110 transition-transform cursor-pointer">
                                        <PlayCircle size={40} fill="currentColor" className={isRtl ? "mr-1" : "ml-1"} />
                                    </div>
                                    <span className="text-white font-bold tracking-widest uppercase text-xs">{m.ctaVideo}</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* The 5-Stage Cycle */}
                <section className="py-24 bg-slate-50">
                    <div className="container mx-auto px-4 text-center mb-20">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">{m.cycle.title}</h2>
                        <p className="text-slate-500 max-w-xl mx-auto">{m.cycle.subtitle}</p>
                    </div>

                    <div className="container mx-auto px-4 space-y-24">
                        {transformationStages.map((stage, idx) => (
                            <motion.div
                                key={stage.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                className={cn(
                                    "flex flex-col items-center gap-8 lg:gap-20",
                                    idx % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                                )}
                            >
                                <div className="flex-1 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="text-6xl font-black text-slate-200">{stage.id}</div>
                                        <div className="h-px flex-1 bg-slate-200" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-slate-900">{stage.title}</h3>
                                    <p className="text-blue-600 font-bold text-sm tracking-wide uppercase italic-none">{stage.subtitle}</p>
                                    <p className="text-slate-600 text-lg leading-relaxed">{stage.description}</p>
                                    <div className="grid sm:grid-cols-2 gap-3 pt-4">
                                        {stage.features.map((f, i) => (
                                            <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm">
                                                <CheckCircle className="w-4 h-4 text-blue-500" />
                                                <span className="text-[10px] font-black text-slate-700 uppercase tracking-tighter">{f}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex-1 w-full max-w-md">
                                    <div className={cn(
                                        "aspect-square rounded-[3rem] p-12 flex items-center justify-center relative bg-white border border-slate-100 shadow-xl"
                                    )}>
                                        <div className={cn(
                                            "w-full h-full rounded-[2.5rem] flex items-center justify-center bg-slate-50 text-slate-600 transition-colors group-hover:bg-opacity-80"
                                        )}>
                                            <stage.icon size={80} strokeWidth={1.5} className={cn(
                                                stage.color === "blue" ? "text-blue-600" :
                                                    stage.color === "red" ? "text-red-600" :
                                                        stage.color === "green" ? "text-green-600" :
                                                            stage.color === "amber" ? "text-amber-600" :
                                                                "text-purple-600"
                                            )} />
                                        </div>
                                        <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-3xl bg-slate-900 text-white flex items-center justify-center shadow-2xl">
                                            <TrendingUp size={32} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-24 container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="bg-slate-900 rounded-[3rem] p-12 lg:p-24 text-center text-white relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                        <h2 className="text-3xl lg:text-5xl font-bold mb-6">{m.ctaFinal.title}</h2>
                        <p className="text-lg lg:text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
                            {m.ctaFinal.desc}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/auth/register"
                                className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all"
                            >
                                {m.ctaFinal.btnStart}
                            </Link>
                            <Link
                                href="/pricing"
                                className="px-10 py-5 bg-white/5 border border-white/10 backdrop-blur-md text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all"
                            >
                                {m.ctaFinal.btnPlans}
                            </Link>
                        </div>
                    </motion.div>
                </section>
            </main>
        </div>
    );
}
