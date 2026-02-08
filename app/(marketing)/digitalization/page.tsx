"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowRight, Sparkles, Building2, Lightbulb, Search,
    BarChart3, Globe, Users, CheckCircle, DollarSign,
    Zap, TrendingUp, ShieldCheck, Target, Shield
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";

export default function DigitalizationPage() {
    const { t, dir } = useLanguage();
    const [diagnosticStep, setDiagnosticStep] = useState<'selection' | 'questions' | 'analyzing' | 'result'>('selection');
    const [selection, setSelection] = useState<'existing' | 'idea' | 'none' | null>(null);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [activeBlueprint, setActiveBlueprint] = useState<string | null>(null);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const handleSelection = (type: 'existing' | 'idea' | 'none') => {
        setSelection(type);
        setDiagnosticStep('questions');
    };

    const handleAnalysis = (e: React.FormEvent) => {
        e.preventDefault();
        setDiagnosticStep('analyzing');
        setTimeout(() => setDiagnosticStep('result'), 3000);
    };

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative pt-32 pb-24 px-4 overflow-hidden bg-slate-50 dark:bg-slate-950">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-indigo-600/10 rounded-full blur-[100px]" />
                </div>

                <div className="container mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 text-blue-700 dark:text-blue-400 text-sm font-bold mb-8 shadow-sm"
                    >
                        <Sparkles className="w-4 h-4" />
                        {t.digitalization.hero.badge}
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-6xl md:text-8xl font-serif font-medium text-slate-900 dark:text-white mb-8 tracking-tight leading-[0.95]"
                    >
                        {t.digitalization.hero.title} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 italic">
                            {t.digitalization.hero.titleHighlight}
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed font-sans font-light tracking-wide"
                    >
                        {t.digitalization.hero.subtitle}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <button
                            onClick={() => scrollToSection('diagnostic-section')}
                            className="px-8 py-4 bg-slate-950 dark:bg-white dark:text-slate-900 text-white rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:scale-105 transition-transform shadow-xl shadow-blue-500/10"
                        >
                            {t.digitalization.hero.ctaStart}
                        </button>
                        <button
                            onClick={() => scrollToSection('portfolio-section')}
                            className="px-8 py-4 bg-white dark:bg-white/5 dark:text-white text-slate-900 border border-slate-200 dark:border-white/10 rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
                        >
                            {t.digitalization.hero.ctaPortfolio}
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Trusted By Section */}
            <section className="py-20 bg-white dark:bg-slate-950 border-y border-slate-100 dark:border-white/5">
                <div className="container mx-auto px-4">
                    <p className="text-center text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-12">
                        {t.digitalization.trustedBy.title}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-2 font-black text-2xl tracking-tighter text-slate-900 dark:text-white">
                            <div className="w-8 h-8 rounded-lg bg-blue-600" /> NEXUS
                        </div>
                        <div className="flex items-center gap-2 font-black text-2xl tracking-tighter text-slate-900 dark:text-white">
                            <div className="w-8 h-8 rounded-full border-4 border-slate-900 dark:border-white" /> ORBIT
                        </div>
                        <div className="flex items-center gap-2 font-black text-2xl tracking-tighter text-slate-900 dark:text-white italic">
                            QUANTUM_
                        </div>
                        <div className="flex items-center gap-2 font-black text-2xl tracking-tighter text-slate-900 dark:text-white">
                            <Globe className="w-8 h-8" /> ATLAS
                        </div>
                        <div className="flex items-center gap-2 font-black text-2xl tracking-tighter text-slate-900 dark:text-white underline decoration-blue-600">
                            PRIME
                        </div>
                    </div>
                </div>
            </section>

            {/* Strategic Impact Metrics */}
            <section className="py-24 bg-slate-900 overflow-hidden relative">
                <div className="absolute inset-0 bg-blue-600/5 mix-blend-overlay pointer-events-none" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-white font-serif font-medium text-4xl italic opacity-80 mb-4">{t.digitalization.metrics.title}</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                        {t.digitalization.metrics.items.map((item: any, idx: number) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
                                className="text-center group"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 text-blue-400 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                    {item.icon === 'DollarSign' && <DollarSign className="w-8 h-8" />}
                                    {item.icon === 'TrendingUp' && <TrendingUp className="w-8 h-8" />}
                                    {item.icon === 'Zap' && <Zap className="w-8 h-8" />}
                                    {item.icon === 'ShieldCheck' && <ShieldCheck className="w-8 h-8" />}
                                </div>
                                <div className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter">
                                    {item.value}
                                </div>
                                <div className="text-slate-500 font-bold uppercase text-xs tracking-widest">{item.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Diagnostic Interactive Interface */}
            <section id="diagnostic-section" className="container mx-auto px-4 py-24">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-6xl mx-auto bg-white dark:bg-slate-900 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)] border border-slate-100 dark:border-white/5 overflow-hidden relative"
                >
                    <div className="bg-slate-900 dark:bg-black/40 p-10 flex items-center justify-between border-b border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Sparkles className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-serif font-medium text-3xl tracking-tight">{t.digitalization.diagnostic.title}</h3>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{t.digitalization.diagnostic.subtitle}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 p-8 md:p-12 relative">
                        <AnimatePresence mode="wait">
                            {diagnosticStep === 'selection' && (
                                <motion.div
                                    key="selection"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="h-full flex flex-col justify-center"
                                >
                                    <h2 className="text-4xl font-serif font-medium text-slate-900 dark:text-white mb-2">{t.digitalization.process.title}</h2>
                                    <p className="text-slate-600 dark:text-slate-400 font-sans font-light tracking-wide mb-10">{t.digitalization.process.subtitle}</p>

                                    <div className="grid md:grid-cols-3 gap-6">
                                        {(['existing', 'idea', 'none'] as const).map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => handleSelection(type)}
                                                className="group p-6 rounded-2xl border-2 border-slate-100 dark:border-white/5 hover:border-blue-600 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-500/5 transition-all text-left"
                                            >
                                                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                    {type === 'existing' && <Building2 className="w-6 h-6" />}
                                                    {type === 'idea' && <Lightbulb className="w-6 h-6" />}
                                                    {type === 'none' && <Search className="w-6 h-6" />}
                                                </div>
                                                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{t.digitalization.process.options[type].title}</h3>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">{t.digitalization.process.options[type].desc}</p>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {diagnosticStep === 'questions' && selection && (
                                <motion.div
                                    key="questions"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="h-full flex flex-col justify-center max-w-2xl mx-auto w-full"
                                >
                                    <div className="text-center mb-8">
                                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 mb-4">
                                            <Sparkles className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{t.digitalization.diagnostic.title}</h3>
                                        <p className="text-slate-600 dark:text-slate-400">Please provide details for the AI to analyze.</p>
                                    </div>

                                    <form onSubmit={handleAnalysis} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {t.digitalization.questions[selection].map((q: any) => (
                                                <div key={q.id}>
                                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                                        {q.label}
                                                    </label>
                                                    <input
                                                        required
                                                        type="text"
                                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm dark:text-white"
                                                        placeholder={q.placeholder}
                                                        onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                                {t.digitalization.questions.freeTextLabel}
                                            </label>
                                            <textarea
                                                required
                                                rows={4}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm resize-none dark:text-white"
                                                placeholder={t.digitalization.questions.freeTextPlaceholder}
                                                onChange={(e) => setAnswers(prev => ({ ...prev, description: e.target.value }))}
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold rounded-xl shadow-lg hover:shadow-slate-900/30 dark:hover:shadow-white/20 transition-all flex items-center justify-center gap-2 text-lg"
                                        >
                                            <Sparkles className="w-5 h-5 text-blue-400 dark:text-blue-600" />
                                            {t.digitalization.questions.submit}
                                        </button>
                                    </form>
                                </motion.div>
                            )}

                            {diagnosticStep === 'analyzing' && (
                                <motion.div
                                    key="analyzing"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="h-full flex flex-col items-center justify-center text-center py-10"
                                >
                                    <div className="relative w-20 h-20 mb-6">
                                        <div className="absolute inset-0 border-4 border-slate-200 dark:border-white/10 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t.digitalization.diagnostic.analyzing}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                                        Scanning market trends, competitor analysis, and strategic opportunities...
                                    </p>
                                </motion.div>
                            )}

                            {diagnosticStep === 'result' && (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full overflow-y-auto"
                                >
                                    {/* SWOT Analysis Card */}
                                    <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10">
                                        <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                            <BarChart3 className="w-5 h-5 text-blue-600" />
                                            SWOT Analysis
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            {[
                                                { label: t.digitalization.diagnostic.swot.strengths, color: 'green', items: ['High Market Potential', 'Scalable Tech Stack'] },
                                                { label: t.digitalization.diagnostic.swot.weaknesses, color: 'red', items: ['Initial Brand Awareness', 'Resource Allocation'] },
                                                { label: t.digitalization.diagnostic.swot.opportunities, color: 'blue', items: ['Digital Expansion', 'B2B Partnerships'] },
                                                { label: t.digitalization.diagnostic.swot.threats, color: 'orange', items: ['Market Saturation', 'Rapid Tech Changes'] }
                                            ].map((s) => (
                                                <div key={s.label} className="p-3 bg-white dark:bg-white/5 rounded-lg border-l-4 border-blue-500 shadow-sm" style={{ borderLeftColor: s.color }}>
                                                    <div className="font-bold mb-1" style={{ color: s.color }}>{s.label}</div>
                                                    <ul className="text-slate-600 dark:text-slate-400 space-y-1 text-xs">
                                                        {s.items.map(i => <li key={i}>• {i}</li>)}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Plan Card (Consultant Roadmap) */}
                                    <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg flex flex-col justify-between h-full border border-slate-700">
                                        <div>
                                            <h3 className="font-bold text-xl mb-6 flex items-center gap-2 text-white">
                                                <Sparkles className="w-5 h-5 text-blue-400" />
                                                {t.digitalization.diagnostic.plan}
                                            </h3>

                                            <div className="space-y-6 relative">
                                                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-700 z-0"></div>
                                                {[
                                                    { q: 'Q1', title: 'Foundation & Audit', desc: 'Deep architectural review, KPI definition, and "Quick Win" implementation.' },
                                                    { q: 'Q2', title: 'Digital Expansion', desc: 'Deploying the new tech stack and launching automated marketing.' },
                                                    { q: 'Q3', title: 'Scale & Automate', desc: 'Staff training on CRM systems and full operational handover.' }
                                                ].map((step, idx) => (
                                                    <div key={idx} className="relative z-10 flex gap-4">
                                                        <div className="w-9 h-9 rounded-full bg-blue-600 border-4 border-slate-900 flex items-center justify-center font-bold text-xs shrink-0">{step.q}</div>
                                                        <div>
                                                            <div className="font-bold text-blue-200 text-lg">{step.title}</div>
                                                            <div className="text-sm text-slate-400 mt-1">{step.desc}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <button className="w-full mt-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2">
                                            <span>Download Executive Report (PDF)</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </section>

            {/* Blueprints Section */}
            <section className="container mx-auto px-4 mb-24">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-sm font-semibold mb-6"
                    >
                        <Lightbulb className="w-4 h-4" />
                        {t.digitalization.blueprints.title}
                    </motion.div>
                    <h2 className="text-4xl md:text-6xl font-serif font-medium text-slate-900 dark:text-white mb-4 tracking-tighter italic">
                        {t.digitalization.blueprints.subtitle}
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {t.digitalization.blueprints.items.map((item: any) => (
                        <motion.div
                            key={item.id}
                            layout
                            onClick={() => setActiveBlueprint(activeBlueprint === item.id ? null : item.id)}
                            className={cn(
                                "cursor-pointer rounded-3xl border transition-all duration-300 overflow-hidden relative",
                                activeBlueprint === item.id
                                    ? "md:col-span-3 bg-slate-900 border-slate-700 shadow-2xl ring-2 ring-blue-500 ring-offset-4 ring-offset-slate-50 dark:ring-offset-slate-950"
                                    : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:shadow-xl hover:-translate-y-1 block"
                            )}
                        >
                            <div className="p-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                                        activeBlueprint === item.id ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white/60"
                                    )}>
                                        {item.id === 'edtech' && <Sparkles className="w-6 h-6" />}
                                        {item.id === 'retail' && <Globe className="w-6 h-6" />}
                                        {item.id === 'services' && <Users className="w-6 h-6" />}
                                    </div>
                                    {activeBlueprint === item.id && (
                                        <div className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30">
                                            ACTIVE BLUEPRINT
                                        </div>
                                    )}
                                </div>

                                <h3 className={cn("text-2xl font-bold mb-2", activeBlueprint === item.id ? "text-white" : "text-slate-900 dark:text-white")}>
                                    {item.title}
                                </h3>
                                <p className={cn("text-lg font-medium mb-4", activeBlueprint === item.id ? "text-blue-200" : "text-blue-600 dark:text-blue-400")}>
                                    {item.strategy}
                                </p>
                                <p className={cn("leading-relaxed", activeBlueprint === item.id ? "text-slate-400 max-w-2xl" : "text-slate-600 dark:text-slate-400")}>
                                    {item.desc}
                                </p>

                                <AnimatePresence>
                                    {activeBlueprint === item.id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mt-8 border-t border-slate-700 pt-8"
                                        >
                                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                                <div>
                                                    <div className="flex items-center gap-2 text-green-400 font-bold mb-4">
                                                        <CheckCircle className="w-5 h-5" />
                                                        {t.digitalization.blueprints.accompaniment}
                                                    </div>
                                                    <h4 className="text-white font-bold text-lg mb-4">{t.digitalization.blueprints.demoLabel}:</h4>
                                                    <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-600 shadow-2xl group">
                                                        <Image
                                                            src={`/images/digitalization/${item.id}-demo.png`}
                                                            alt={item.demoTitle}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-4">
                                                    {['Build', 'Funnel', 'Scale'].map((phase, i) => (
                                                        <div key={phase} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                                                            <div className="text-blue-400 font-bold text-sm mb-1">Phase {i + 1}: {phase}</div>
                                                            <div className="text-slate-300 text-sm">Deployment and optimization of the {item.strategy} framework.</div>
                                                        </div>
                                                    ))}
                                                    <button className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors">
                                                        Start This Transformation
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Proprietary Tools Section */}
            <section className="container mx-auto px-4 mb-24">
                <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/20 blur-[100px] -ml-32 -mb-32" />

                    <div className="relative z-10">
                        <div className="text-center mb-12">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-sm font-semibold mb-6 border border-blue-500/20"
                            >
                                <Sparkles className="w-4 h-4" />
                                {t.digitalization.tools.title}
                            </motion.div>
                            <h2 className="text-3xl md:text-5xl font-serif font-medium text-white mb-4 italic leading-tight">{t.digitalization.tools.subtitle}</h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {t.digitalization.tools.items.map((tool: any, index: number) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        {index === 0 && <Users className="w-7 h-7" />}
                                        {index === 1 && <BarChart3 className="w-7 h-7" />}
                                        {index === 2 && <ArrowRight className="w-7 h-7" />}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">{tool.title}</h3>
                                    <p className="text-slate-400">{tool.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Methodology Pillars Section */}
            <section className="container mx-auto px-4 py-32 bg-slate-50 dark:bg-slate-950/50 rounded-[4rem] my-24 border border-slate-100 dark:border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/5 blur-[120px] -mr-64 pointer-events-none" />
                <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10 p-8 md:p-16">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 text-blue-600 text-sm font-bold mb-8">
                            <Target className="w-4 h-4" />
                            EXECUTIVE FRAMEWORK
                        </div>
                        <h2 className="text-5xl md:text-7xl font-serif font-medium text-slate-900 dark:text-white mb-8 tracking-tighter leading-tight italic">
                            {t.digitalization.methodology.title}
                        </h2>
                        <p className="text-2xl text-slate-600 dark:text-slate-400 mb-12">
                            {t.digitalization.methodology.subtitle}
                        </p>
                        <div className="space-y-4">
                            {t.digitalization.methodology.pillars.map((pillar: any, idx: number) => (
                                <motion.div key={idx} className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-start gap-4 hover:shadow-xl transition-all">
                                    <div className="w-10 h-10 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-black shrink-0">0{idx + 1}</div>
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{pillar.title}</h4>
                                        <p className="text-slate-500 dark:text-slate-400">{pillar.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-600 rounded-[3rem] blur-3xl opacity-20" />
                        <div className="relative aspect-square bg-slate-900 rounded-[3rem] overflow-hidden">
                            <Image src="/images/digitalization/product.png" alt="Methodology" fill className="object-cover opacity-50" />
                            <div className="absolute bottom-10 left-10 right-10">
                                <div className="text-white font-black text-3xl mb-2 italic">PRECISION_CORE</div>
                                <div className="w-full h-1 bg-white/20 rounded-full"><motion.div whileInView={{ width: '85%' }} transition={{ duration: 2 }} className="h-full bg-blue-500" /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Portfolio Section */}
            <section id="portfolio-section" className="container mx-auto px-4 py-32 border-t border-slate-100 dark:border-white/5">
                <div className="text-center mb-24">
                    <h2 className="text-5xl md:text-7xl font-serif font-medium text-slate-900 dark:text-white mb-6 tracking-tight">
                        {t.digitalization.portfolio.title}
                    </h2>
                    <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-sans font-light tracking-wide">{t.digitalization.portfolio.subtitle}</p>
                </div>
                <motion.div variants={containerVariants} initial="hidden" whileInView="visible" className="grid md:grid-cols-3 gap-12">
                    {[
                        { title: t.digitalization.portfolio.strategy, icon: BarChart3, desc: 'Complete strategic overhaul.', img: 'strategy.png', color: 'slate' },
                        { title: t.digitalization.portfolio.website, icon: Globe, desc: 'High-performance web apps.', img: 'product.png', color: 'blue' },
                        { title: t.digitalization.portfolio.training, icon: Users, desc: 'Staff training & handover.', img: 'training.png', color: 'emerald' }
                    ].map((item, id) => (
                        <motion.div key={id} variants={itemVariants} className="group relative">
                            <div className="relative h-full bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all">
                                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-xl", item.color === 'slate' ? "bg-slate-900 text-white" : item.color === 'blue' ? "bg-blue-600 text-white" : "bg-emerald-500 text-white")}>
                                    <item.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">{item.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">{item.desc}</p>
                                <div className="aspect-[4/3] rounded-3xl overflow-hidden relative border border-slate-100 dark:border-white/5">
                                    <Image src={`/images/digitalization/${item.img}`} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Final CTA */}
            <section className="container mx-auto px-4 py-24">
                <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-900 p-12 md:p-24 text-center">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="relative z-10">
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter uppercase font-outline">READY TO DOMINATE?</h2>
                        <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">Build the digital infrastructure your company deserves.</p>
                        <button className="px-12 py-5 bg-white text-blue-600 rounded-full font-black text-xl hover:scale-105 transition-transform shadow-2xl">
                            BOOK EXECUTIVE CONSULTATION
                        </button>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
