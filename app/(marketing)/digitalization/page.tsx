"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowRight, Sparkles, Lightbulb,
    BarChart3, Globe, Users, CheckCircle, DollarSign,
    Zap, TrendingUp, ShieldCheck, Target
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";
import DiagnosisModal from "./DiagnosisModal";

// Define interfaces for the data structures
interface MetricItem {
    value: string;
    label: string;
    icon: string;
}

interface BlueprintItem {
    id: string;
    title: string;
    strategy: string;
    desc: string;
    demoTitle: string;
}

interface ToolItem {
    title: string;
    desc: string;
}

interface PillarItem {
    title: string;
    desc: string;
}

export default function DigitalizationPage() {
    const { t } = useLanguage();
    const [activeBlueprint, setActiveBlueprint] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 overflow-x-hidden">
            <DiagnosisModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            
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
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-indigo-500 to-purple-600 italic">
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
                            onClick={() => setIsModalOpen(true)}
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
                        {t.digitalization.metrics.items.map((item: MetricItem, idx: number) => (
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

            {/* Blueprints Section */}
            <section className="container mx-auto px-4 mb-24 mt-24">
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
                    {t.digitalization.blueprints.items.map((item: BlueprintItem) => (
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
                            {t.digitalization.tools.items.map((tool: ToolItem, index: number) => (
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
                            {t.digitalization.methodology.pillars.map((pillar: PillarItem, idx: number) => (
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
                                <div className="aspect-4/3 rounded-3xl overflow-hidden relative border border-slate-100 dark:border-white/5">
                                    <Image src={`/images/digitalization/${item.img}`} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Final CTA */}
            <section className="container mx-auto px-4 py-24">
                <div className="relative rounded-[3rem] overflow-hidden bg-linear-to-br from-blue-600 to-indigo-900 p-12 md:p-24 text-center">
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
