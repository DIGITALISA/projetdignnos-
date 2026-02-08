"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
    ArrowRight,
    Play,
    CheckCircle2,
    Target,
    Zap,
    Cpu,
    Brain,
    Library,
    Lock,
    Users,
    TrendingUp,
    Shield,
    Check,
    BarChart3,
    Sparkles,
    Clock,
    Crown
} from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";

export default function ProfessionalsPage() {
    const { t, dir, language } = useLanguage();
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef });

    // Parallax effect for background elements
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);

    const protocolSteps = [
        { id: "01", icon: Target, title: t.features.cards.diagnosis.title, desc: t.features.cards.diagnosis.desc, tags: t.features.cards.diagnosis.tags },
        { id: "02", icon: Zap, title: t.features.cards.simulation.title, desc: t.features.cards.simulation.desc, tags: t.features.cards.simulation.tags },
        { id: "03", icon: Cpu, title: t.features.cards.training.title, desc: t.features.cards.training.desc, tags: t.features.cards.training.tags },
        { id: "04", icon: Brain, title: t.features.cards.mentor.title, desc: t.features.cards.mentor.desc, tags: t.features.cards.mentor.tags },
        { id: "05", icon: Library, title: t.features.cards.academy.title, desc: t.features.cards.academy.desc, tags: t.features.cards.academy.tags },
        { id: "06", icon: Lock, title: t.features.cards.library.title, desc: t.features.cards.library.desc, tags: t.features.cards.library.tags },
        { id: "07", icon: Users, title: t.features.cards.expert.title, desc: t.features.cards.expert.desc, tags: t.features.cards.expert.tags }
    ];

    return (
        <div className={cn(
            "min-h-screen bg-[#FDFDFD] dark:bg-[#050505] selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black overflow-x-hidden scroll-smooth",
            language === 'ar' ? 'font-arabic' : 'font-sans'
        )} dir={dir} ref={containerRef}>
            {/* Premium Noise Overlay */}
            <div className="fixed inset-0 opacity-[0.015] pointer-events-none z-100" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>

            {/* Sophisticated Background Gradients */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <motion.div style={{ y: y1 }} className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-linear-to-br from-blue-50/80 to-indigo-50/0 dark:from-blue-900/10 dark:to-transparent rounded-full blur-[120px]" />
                <motion.div style={{ y: y2 }} className="absolute -bottom-[20%] right-[-10%] w-[800px] h-[800px] bg-linear-to-tl from-slate-100/80 to-transparent dark:from-slate-900/20 dark:to-transparent rounded-full blur-[100px]" />
            </div>

            {/* Hero Section */}
            <section id="home" className="relative pt-40 pb-32 lg:pt-52 lg:pb-40 px-6 container mx-auto">
                <div className="max-w-[1200px] mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm mb-12 shadow-sm"
                    >
                        <Shield className="w-4 h-4 text-slate-900 dark:text-white" strokeWidth={2} />
                        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-600 dark:text-slate-300">
                            {t.hero.badge}
                        </span>
                    </motion.div>

                    <h1 className="text-6xl md:text-[6rem] lg:text-[7.5rem] font-serif font-medium tracking-tight text-slate-950 dark:text-white mb-10 leading-[0.95] lg:leading-[0.9]">
                        {t.hero.titlePre} <br className="hidden md:block" />
                        <span className="relative inline-block">
                            <span className="relative z-10 text-transparent bg-clip-text bg-linear-to-b from-slate-800 to-slate-500 dark:from-white dark:to-slate-400">
                                {t.hero.titleHighlight}
                            </span>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ delay: 0.8, duration: 1, ease: "circOut" }}
                                className="absolute bottom-2 left-0 h-4 bg-blue-100/50 dark:bg-blue-900/30 -z-10 -rotate-1"
                            />
                        </span>
                    </h1>

                    <p className="text-lg md:text-2xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-16 leading-relaxed font-light tracking-wide">
                        {t.hero.subtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link href="/auth/register" className="group relative w-full sm:w-auto px-10 py-5 bg-slate-950 dark:bg-white text-white dark:text-black rounded-full font-bold text-xs uppercase tracking-[0.2em] transition-all hover:scale-105 hover:shadow-2xl hover:shadow-slate-900/20 active:scale-95">
                            <span className="flex items-center justify-center gap-4">
                                {t.hero.ctaDashboard}
                                <ArrowRight className={cn("w-4 h-4 transition-transform duration-300", dir === 'rtl' ? 'group-hover:-translate-x-1 rotate-180' : 'group-hover:translate-x-1')} />
                            </span>
                        </Link>
                        <a href="#framework" className="w-full sm:w-auto px-10 py-5 bg-transparent border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-full font-bold text-xs uppercase tracking-[0.2em] transition-all hover:bg-slate-50 dark:hover:bg-slate-900 hover:border-slate-300 active:scale-95 flex items-center justify-center gap-3">
                            <Play className="w-3 h-3 fill-current" />
                            {t.hero.ctaTour}
                        </a>
                    </div>
                </div>
            </section>

            {/* Executive Overview - Minimalist Layout */}
            <section className="py-32 px-6 container mx-auto border-t border-slate-100 dark:border-slate-900/50">
                <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
                    <div className="lg:col-span-4 sticky top-32">
                        <div className="inline-flex items-center gap-2 mb-6">
                            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">System Status</span>
                        </div>
                        <h2 className="text-4xl font-serif font-medium text-slate-900 dark:text-white leading-tight mb-6">
                            Strategic <br /> Intelligence.
                        </h2>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">
                            Success Strategy operates as your personal career advisory board. We don't just train; we analyze, verify, and endorse your professional capabilities.
                        </p>
                    </div>

                    <div className="lg:col-span-8 grid md:grid-cols-2 gap-4">
                        {/* Stat Card 1 */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="p-10 bg-slate-50 dark:bg-slate-900/50 rounded-4xl border border-slate-100 dark:border-slate-800"
                        >
                            <TrendingUp className="w-8 h-8 text-slate-900 dark:text-white mb-12" strokeWidth={1.5} />
                            <div className="space-y-2">
                                <h3 className="text-5xl font-light text-slate-900 dark:text-white tracking-tighter">98<span className="text-2xl text-slate-400">%</span></h3>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Readiness Score</p>
                            </div>
                        </motion.div>

                        {/* Stat Card 2 */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="p-10 bg-slate-950 dark:bg-white text-white dark:text-black rounded-4xl"
                        >
                            <BarChart3 className="w-8 h-8 mb-12 opacity-80" strokeWidth={1.5} />
                            <div className="space-y-2">
                                <h3 className="text-5xl font-light tracking-tighter">2.4<span className="text-2xl opacity-50">x</span></h3>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Velocity Multiplier</p>
                            </div>
                        </motion.div>

                        {/* Visual Asset */}
                        <div className="md:col-span-2 p-10 bg-white dark:bg-black rounded-4xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative group">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                            <div className="relative z-10 flex items-center justify-between mb-8">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Active Project</span>
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: '70%' }}
                                        transition={{ duration: 1.5, ease: "circOut" }}
                                        className="h-full bg-slate-900 dark:bg-white"
                                    />
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-lg font-serif text-slate-900 dark:text-white mb-1">Analysis in Progress</p>
                                        <p className="text-xs text-slate-400">Evaluating professional leadership patterns...</p>
                                    </div>
                                    <span className="text-xs font-mono bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded">ETH-0x84...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Framework - Architectural Grid */}
            <section id="framework" className="py-32 px-6 container mx-auto scroll-mt-20">
                <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
                    <div>
                        <span className="block text-[10px] font-bold uppercase tracking-[0.25em] text-blue-600 mb-4">The Framework</span>
                        <h2 className="text-5xl md:text-7xl font-serif font-medium text-slate-900 dark:text-white tracking-tighter leading-none">
                            Our Methodology.
                        </h2>
                    </div>
                    <p className="text-sm md:text-base text-slate-500 max-w-sm leading-relaxed font-medium">
                        {t.features.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {protocolSteps.map((step, i) => (
                        <div
                            key={i}
                            className="group relative p-8 h-[320px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl hover:border-slate-300 dark:hover:border-slate-600 transition-colors duration-500 flex flex-col justify-between"
                        >
                            <div className="flex justify-between items-start">
                                <span className="text-xs font-mono text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">/{step.id}</span>
                                <step.icon className="w-6 h-6 text-slate-400 group-hover:text-blue-600 transition-colors duration-300" strokeWidth={1.5} />
                            </div>

                            <div>
                                <h3 className="text-xl font-serif text-slate-900 dark:text-white mb-3 group-hover:translate-x-1 transition-transform duration-300">{step.title}</h3>
                                <p className="text-xs text-slate-500 leading-relaxed max-w-[90%] mb-6">{step.desc}</p>
                                <div className="flex flex-wrap gap-2">
                                    {step.tags.map(tag => (
                                        <span key={tag} className="text-[9px] uppercase tracking-wider text-slate-400 border border-slate-100 dark:border-slate-800 px-2 py-1 rounded-md">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Access Card */}
                    <Link href="/auth/register" className="h-[320px] bg-slate-950 dark:bg-white rounded-3xl p-8 flex flex-col justify-center items-center text-center group cursor-pointer hover:scale-[0.98] transition-transform duration-300">
                        <div className="w-12 h-12 rounded-full border border-white/20 dark:border-black/20 flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-black dark:group-hover:bg-black dark:group-hover:text-white transition-all duration-300 text-white dark:text-black">
                            <ArrowRight className="w-5 h-5" />
                        </div>
                        <h3 className="text-2xl font-serif text-white dark:text-black mb-2">Start Assessment</h3>
                        <p className="text-xs text-slate-400 dark:text-slate-600 uppercase tracking-widest">Join Program</p>
                    </Link>
                </div>
            </section>

            {/* Pricing Section - Strategic Selection */}
            <section id="pricing" className="py-32 px-6 container mx-auto border-t border-slate-100 dark:border-slate-900/50">
                <div className="text-center mb-20">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.25em] text-blue-600 mb-4">{t.pricing.badge}</span>
                    <h2 className="text-5xl md:text-7xl font-serif font-medium text-slate-900 dark:text-white tracking-tighter leading-none mb-8">
                        {t.pricing.title}
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto font-medium">
                        {t.pricing.subtitle}
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Initial Pack */}
                    <motion.div whileHover={{ y: -10 }} className="p-10 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex flex-col shadow-sm hover:shadow-2xl transition-all duration-500">
                        <div className="mb-10">
                            <Clock className="w-12 h-12 text-slate-400 mb-6" />
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t.pricing.tiers.initial.name}</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.pricing.tiers.initial.badge}</p>
                        </div>
                        <div className="text-4xl font-black text-slate-950 dark:text-white mb-8">{t.pricing.tiers.initial.price} <span className="text-sm font-bold text-slate-400">{t.pricing.tiers.initial.duration}</span></div>
                        <div className="space-y-4 mb-12 flex-1">
                            {t.pricing.tiers.initial.features.map((f: string, i: number) => (
                                <div key={i} className="flex items-center gap-3 text-xs font-bold text-slate-500">
                                    <Check className="w-4 h-4 text-slate-900 dark:text-white" /> {f}
                                </div>
                            ))}
                        </div>
                        <Link href="/auth/register" className="w-full py-4 bg-slate-950 dark:bg-white text-white dark:text-black rounded-2xl font-black text-[10px] uppercase tracking-widest text-center">{t.pricing.cta}</Link>
                    </motion.div>

                    {/* Pro Essential */}
                    <motion.div whileHover={{ y: -10 }} className="p-10 bg-slate-950 dark:bg-white text-white dark:text-black rounded-[2.5rem] flex flex-col shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                            <Sparkles className="text-blue-400 w-6 h-6 animate-pulse" />
                        </div>
                        <div className="mb-10">
                            <Zap className="w-12 h-12 text-blue-400 mb-6" />
                            <h3 className="text-2xl font-bold mb-2">{t.pricing.tiers.pro.name}</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{t.pricing.tiers.pro.badge}</p>
                        </div>
                        <div className="text-4xl font-black mb-8">{t.pricing.tiers.pro.price} <span className="text-sm font-bold opacity-60">{t.pricing.tiers.pro.duration}</span></div>
                        <div className="space-y-4 mb-12 flex-1">
                            {t.pricing.tiers.pro.features.map((f: string, i: number) => (
                                <div key={i} className="flex items-center gap-3 text-xs font-bold">
                                    <Check className="w-4 h-4 text-blue-400" /> {f}
                                </div>
                            ))}
                        </div>
                        <Link href="/auth/register" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest text-center shadow-lg shadow-blue-600/20">{t.pricing.cta}</Link>
                    </motion.div>

                    {/* Elite Full Pack */}
                    <motion.div whileHover={{ y: -10 }} className="p-10 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex flex-col shadow-sm hover:shadow-2xl transition-all duration-500">
                        <div className="mb-10">
                            <Crown className="w-12 h-12 text-amber-400 mb-6" />
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t.pricing.tiers.elite.name}</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.pricing.tiers.elite.badge}</p>
                        </div>
                        <div className="text-4xl font-black text-slate-950 dark:text-white mb-8">{t.pricing.tiers.elite.price} <span className="text-sm font-bold text-slate-400">{t.pricing.tiers.elite.duration}</span></div>
                        <div className="space-y-4 mb-12 flex-1">
                            {t.pricing.tiers.elite.features.map((f: string, i: number) => (
                                <div key={i} className="flex items-center gap-3 text-xs font-bold text-slate-500">
                                    <Check className="w-4 h-4 text-amber-400" /> {f}
                                </div>
                            ))}
                        </div>
                        <Link href="/auth/register" className="w-full py-4 bg-slate-950 dark:bg-white text-white dark:text-black rounded-2xl font-black text-[10px] uppercase tracking-widest text-center">{t.pricing.cta}</Link>
                    </motion.div>
                </div>
            </section>

            {/* Strategic Warrant - Document Style */}
            <section className="py-32 px-6 container mx-auto border-t border-slate-100 dark:border-slate-900/50">
                <div className="bg-[#F8F9FA] dark:bg-[#0A0A0A] rounded-[3rem] p-6 lg:p-20 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-12 opacity-5">
                        <Shield size={400} />
                    </div>

                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 relative z-10 items-center">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-600 mb-6 block">{t.cert.badge}</span>
                            <h2 className="text-4xl md:text-6xl font-serif font-medium text-slate-900 dark:text-white mb-8 leading-[1.1]">
                                {t.cert.title}
                            </h2>
                            <p className="text-slate-500 leading-relaxed text-lg mb-12 font-light">
                                {t.cert.desc}
                            </p>

                            <div className="space-y-4 mb-12">
                                {[t.cert.check1, t.cert.check2, t.cert.check3].map((check, i) => (
                                    <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-200 dark:border-slate-800">
                                        <CheckCircle2 className="w-5 h-5 text-slate-900 dark:text-white" strokeWidth={1.5} />
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{check}</span>
                                    </div>
                                ))}
                            </div>

                            <Link href="/auth/register" className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                {t.cert.cta} <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* The Warrant Card Visual */}
                        <div className="relative group perspective-1000">
                            <div className="bg-white dark:bg-slate-900 aspect-3/4 md:aspect-4/3 rounded-4xl shadow-2xl p-8 md:p-12 relative flex flex-col justify-between border border-slate-200 dark:border-slate-700 transform transition-transform duration-700 group-hover:rotate-y-6 group-hover:rotate-x-6">
                                <div className="flex justify-between items-start">
                                    <div className="border border-slate-200 dark:border-slate-700 w-16 h-16 rounded-full flex items-center justify-center">
                                        <Shield className="w-8 h-8 text-slate-900 dark:text-white" strokeWidth={1} />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-mono text-slate-400">ID: W-2026-X8</p>
                                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-900 dark:text-white">MA-TRAINING-CONSULTING.</p>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <h3 className="font-serif text-3xl md:text-4xl text-slate-900 dark:text-white mb-2">{t.cert.cardTitle}</h3>
                                    <p className="text-xs text-blue-600 uppercase tracking-[0.3em] font-bold">Verified Professional</p>
                                </div>

                                <div className="flex justify-between items-end border-t border-slate-100 dark:border-slate-800 pt-8">
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Holder</p>
                                        <div className="h-2 w-24 bg-slate-900 dark:bg-white rounded-full opacity-20" />
                                    </div>
                                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                                        <Sparkles className="w-8 h-8 text-slate-300" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
