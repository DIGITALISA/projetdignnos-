"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
    CheckCircle2,
    Zap,
    Shield,
    Globe,
    Scan,
    Crown,
    Star,
    ArrowRight,
    Play,
    Briefcase,
    Check,
    FileText,
    Download,
    ShieldCheck,
    Building2,
    Scale,
    Target,
    LineChart
} from "lucide-react";
import Link from "next/link";
import { useRef, useState, ReactNode } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";
import ContractModal from "@/components/legal/ContractModal";
import { useRouter } from "next/navigation";

// Interfaces
interface PricingTier {
    name: string;
    badge: string;
    price: string;
    duration: string;
    features: string[];
}

interface CorporateTranslation {
    feature1_title: string;
    feature1_desc: string;
    feature2_title: string;
    feature2_desc: string;
    feature3_title: string;
    feature3_desc: string;
}

interface PricingCardProps {
    tier: PricingTier;
    icon: ReactNode;
    type: string;
    featured?: boolean;
    onSelect: (plan: { type: string } & PricingTier) => void;
}

export default function ProfessionalsPage() {
    const { t, dir, language } = useLanguage();
    const router = useRouter();
    const containerRef = useRef(null);
    const [selectedPlan, setSelectedPlan] = useState<(PricingTier & { type: string }) | null>(null);
    const { scrollYProgress } = useScroll({ target: containerRef });

    const handlePlanSelect = (plan: PricingTier & { type: string }) => {
        if (plan.type === "trial") {
            router.push("/auth/register");
        } else {
            setSelectedPlan(plan);
        }
    };

    // Smooth scroll physics
    const springScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
    
    // Parallax effect for background elements
    const y1 = useTransform(springScroll, [0, 1], [0, -300]);
    const y2 = useTransform(springScroll, [0, 1], [0, -150]);
    const rotate1 = useTransform(springScroll, [0, 1], [0, 45]);

    return (
        <div className={cn(
            "min-h-screen bg-[#FDFDFD] dark:bg-[#050505] selection:bg-blue-600 selection:text-white overflow-x-hidden",
            language === 'ar' ? 'font-arabic' : 'font-sans'
        )} dir={dir} ref={containerRef}>
            
            {/* 1. ATMOSPHERE & BRANDING */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-100 mix-blend-overlay" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
            
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <motion.div style={{ y: y1, rotate: rotate1 }} className="absolute top-[-20%] left-[-10%] w-[1200px] h-[1200px] bg-linear-to-br from-indigo-50/50 to-blue-50/0 dark:from-indigo-900/10 dark:to-transparent rounded-full blur-[150px]" />
                <motion.div style={{ y: y2 }} className="absolute -bottom-[20%] right-[-10%] w-[1000px] h-[1000px] bg-linear-to-tl from-slate-100/80 to-transparent dark:from-slate-900/20 dark:to-transparent rounded-full blur-[120px]" />
            </div>

            {/* SECTION 1: IDENTITY & AMBITION */}
            <div className="relative">
                {/* 2. CINEMATIC HERO */}
                <section className="relative min-h-[90vh] flex flex-col justify-center pt-32 pb-20 px-6 container mx-auto">
                    <div className="max-w-[1400px] mx-auto text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl mb-12 shadow-sm hover:scale-105 transition-transform cursor-default"
                        >
                            <Shield className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
                            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-600 dark:text-slate-300">
                                {t.hero.badge}
                            </span>
                        </motion.div>

                        <h1 className="text-7xl md:text-[7rem] lg:text-[8.5rem] font-serif font-medium tracking-tighter text-slate-950 dark:text-white mb-10 leading-[0.9] lg:leading-[0.85] relative">
                            {t.hero.titlePre} <br className="hidden md:block" />
                            <span className="relative inline-block z-10">
                                <span className="text-transparent bg-clip-text bg-linear-to-b from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-200 dark:to-slate-500">
                                    {t.hero.titleHighlight}
                                </span>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ delay: 1, duration: 1.2, ease: "circOut" }}
                                    className="absolute bottom-4 left-0 h-6 bg-blue-600/10 dark:bg-blue-500/10 -z-10 -rotate-1 rounded-full blur-sm"
                                />
                            </span>
                        </h1>

                        <p className="text-xl md:text-3xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto mb-16 leading-relaxed font-light tracking-wide">
                            {t.hero.subtitle}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link href="/auth/register" className="group relative w-full sm:w-auto px-12 py-6 bg-slate-950 dark:bg-white text-white dark:text-black rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all hover:scale-105 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.3)] active:scale-95 overflow-hidden">
                                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                                <span className="flex items-center justify-center gap-4 relative z-10">
                                    {t.hero.ctaDashboard}
                                    <ArrowRight className={cn("w-4 h-4 transition-transform duration-300", dir === 'rtl' ? 'group-hover:-translate-x-1 rotate-180' : 'group-hover:translate-x-1')} />
                                </span>
                            </Link>
                            <a href="#protocol" className="w-full sm:w-auto px-12 py-6 bg-transparent border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-slate-50 dark:hover:bg-slate-900 active:scale-95 flex items-center justify-center gap-3">
                                <Play className="w-3 h-3 fill-current" />
                                {t.hero.ctaTour}
                            </a>
                        </div>
                    </div>
                </section>

                {/* TARGET AUDIENCE SECTION */}
                <section className="py-24 px-6 bg-slate-50 dark:bg-slate-900/50 relative overflow-hidden">
                    <div className="container mx-auto relative z-10">
                        <div className="text-center mb-16">
                            <motion.h2 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-3xl md:text-5xl font-serif font-medium text-slate-900 dark:text-white mb-6"
                            >
                                {t.targetAudience.title}
                            </motion.h2>
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-light"
                            >
                                {t.targetAudience.subtitle}
                            </motion.p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {t.targetAudience.cards.map((card: { title: string, desc: string }, index: number) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{card.title}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                                        {card.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>

            {/* SECTION 2: THE DIGNNOS PROTOCOL (OPERATING SYSTEM) */}
            <div id="protocol" className="relative bg-white dark:bg-[#080808]">
                {/* 2.1 SMART MODULES SEARCH/GRID */}
                <section className="py-32 px-6 container mx-auto">
                    <div className="text-center mb-24">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest mb-6"
                        >
                            <Zap className="w-3 h-3 fill-current" />
                            {t.features.title}
                        </motion.div>
                        <motion.h2 className="text-5xl md:text-8xl font-serif font-medium text-slate-950 dark:text-white mb-8 tracking-tighter">
                            {t.system.title}
                        </motion.h2>
                        <motion.p className="text-xl text-slate-500 max-w-3xl mx-auto font-light leading-relaxed">
                            {t.system.subtitle}
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
                        {Object.entries(t.features.cards).map(([key, card]: [string, { title: string, desc: string, tags: string[] }], index: number) => (
                            <motion.div
                                key={key}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="group p-8 rounded-4xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-blue-500/30 dark:hover:border-blue-500/30 hover:shadow-2xl transition-all duration-500 flex flex-col items-start relative overflow-hidden"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-8 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                    {key === 'diagnosis' && <Scan className="w-7 h-7" />}
                                    {key === 'simulation' && <Play className="w-7 h-7" />}
                                    {key === 'training' && <Briefcase className="w-7 h-7" />}
                                    {key === 'mentor' && <Zap className="w-7 h-7" />}
                                    {key === 'academy' && <Globe className="w-7 h-7" />}
                                    {key === 'library' && <Shield className="w-7 h-7" />}
                                    {key === 'expert' && <Crown className="w-7 h-7" />}
                                    {key === 'roadmap' && <Star className="w-7 h-7" />}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{card.title}</h3>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-3 mb-8">
                                    {card.desc.split('\n').map((line: string, i: number) => {
                                        if (line.includes('**')) {
                                            const parts = line.split('**');
                                            return (parts[1] && parts[2]) ? (
                                                <p key={i} className="leading-relaxed">
                                                    <span className="font-bold text-slate-900 dark:text-white italic">{parts[1]}</span>
                                                    {parts[2]}
                                                </p>
                                            ) : <p key={i}>{line}</p>;
                                        }
                                        return <p key={i} className="leading-relaxed">{line}</p>;
                                    })}
                                </div>
                                <div className="mt-auto flex flex-wrap gap-2">
                                    {card.tags.map((tag: string) => (
                                        <span key={tag} className="text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* 2.2 THE 3-PHASE JOURNEY VISUAL */}
                    <div className="bg-slate-950 rounded-[4rem] p-10 md:p-24 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
                        <div className="relative z-10 grid lg:grid-cols-3 gap-12">
                            {t.system.stages.map((stage: { id: string, title: string, desc: string }, i: number) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.2 }}
                                    className="relative"
                                >
                                    <div className="text-[5rem] font-serif font-black text-white/5 leading-none mb-4 absolute -top-8 -left-4">{stage.id}</div>
                                    <div className="relative z-10 pl-4 border-l-2 border-blue-600/30">
                                        <h4 className="text-2xl font-serif font-medium mb-4">{stage.title}</h4>
                                        <p className="text-slate-400 font-light leading-relaxed">{stage.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 2.3 DEEP DIVE INTEGRATION (DIAGNOSIS & SIMS) */}
                <section className="py-24 px-6 container mx-auto grid lg:grid-cols-2 gap-12">
                    {/* Diagnosis Card */}
                    <div className="bg-slate-50 dark:bg-slate-900/40 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800 flex flex-col justify-between group">
                         <div>
                            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-8 shadow-lg shadow-blue-600/20 group-hover:rotate-12 transition-transform">
                                <Scan size={24} />
                            </div>
                            <h3 className="text-3xl font-serif font-medium text-slate-900 dark:text-white mb-6 italic">{t.audit.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-10 leading-relaxed font-light">{t.audit.desc}</p>
                         </div>
                         <Link href="/auth/register" className="flex items-center gap-4 text-blue-600 font-black text-[10px] uppercase tracking-widest group">
                            Explore Forensic Audit
                            <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                         </Link>
                    </div>

                    {/* Simulation Card */}
                    <div className="bg-slate-900 rounded-[3rem] p-10 text-white flex flex-col justify-between group overflow-hidden relative">
                         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                         <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-8 shadow-lg shadow-indigo-600/20 group-hover:rotate-12 transition-transform">
                                <Zap size={24} />
                            </div>
                            <h3 className="text-3xl font-serif font-medium mb-6 italic">{t.missions.title}</h3>
                            <p className="text-slate-400 mb-10 leading-relaxed font-light">{t.missions.desc}</p>
                         </div>
                         <Link href="/auth/register" className="relative z-10 flex items-center gap-4 text-indigo-400 font-black text-[10px] uppercase tracking-widest group">
                            Join Simulations
                            <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                         </Link>
                    </div>
                </section>
                
                {/* 2.4 STRATEGIC ASSETS & DOCUMENTATION */}
                <section className="py-32 bg-slate-50 dark:bg-slate-900/20 border-y border-slate-100 dark:border-slate-800 px-6">
                    <div className="container mx-auto">
                        <div className="text-center mb-24">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-widest mb-6"
                            >
                                <FileText className="w-3 h-3" />
                                {t.assets.badge}
                            </motion.div>
                            <h2 className="text-4xl md:text-6xl font-serif font-medium text-slate-950 dark:text-white mb-8 tracking-tighter">
                                {t.assets.title}
                            </h2>
                            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
                                {t.assets.desc}
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-16 mb-32">
                            {/* Executive Reports */}
                            <div className="space-y-12">
                                <h3 className="text-2xl font-serif italic text-slate-900 dark:text-white flex items-center gap-4">
                                    <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
                                    {t.assets.reportsTitle}
                                </h3>
                                <div className="grid gap-6">
                                    {t.assets.reports.map((item: { title: string, desc: string }, i: number) => (
                                        <div key={i} className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex items-start gap-6 group">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                <Download size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-950 dark:text-white mb-2">{item.title}</h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Official Certs */}
                            <div className="space-y-12">
                                <h3 className="text-2xl font-serif italic text-slate-900 dark:text-white flex items-center gap-4">
                                    <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
                                    {t.assets.officialTitle}
                                </h3>
                                <div className="grid gap-6">
                                    {t.assets.official.map((item: { title: string, desc: string }, i: number) => (
                                        <div key={i} className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex items-start gap-6 group">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                <ShieldCheck size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-950 dark:text-white mb-2">{item.title}</h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* FINAL WARRANT VISUAL */}
                        <div className="max-w-4xl mx-auto">
                            <div className="relative p-1 bg-linear-to-br from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-[3rem] shadow-2xl">
                                <div className="bg-white dark:bg-slate-950 rounded-[2.8rem] p-12 md:p-20 relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
                                    
                                    <div className="flex flex-col items-center text-center relative z-10">
                                        <div className="w-24 h-24 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center mb-10 shadow-inner">
                                            <Shield className="w-10 h-10 text-blue-600 dark:text-blue-500" strokeWidth={1.5} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-6">{t.cert.badge}</span>
                                        <h3 className="text-3xl md:text-5xl font-serif font-medium text-slate-950 dark:text-white mb-10 tracking-tighter italic">
                                            {t.cert.title}
                                        </h3>
                                        <div className="h-px w-24 bg-blue-600/30 mb-10"></div>
                                        <p className="text-sm font-light text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed mb-12">
                                            {t.cert.warrant_text}
                                        </p>
                                        <div className="flex flex-wrap justify-center gap-12 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                            <div className="flex items-center gap-3">
                                                <Check className="text-blue-600 w-4 h-4" />
                                                {t.cert.check1}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Check className="text-blue-600 w-4 h-4" />
                                                {t.cert.check2}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Check className="text-blue-600 w-4 h-4" />
                                                {t.cert.check3}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* SECTION 3: INVESTMENT & AUTHENTICATION */}
            <div className="relative bg-[#FDFDFD] dark:bg-[#050505] border-t border-slate-100 dark:border-slate-900">
                {/* 3.1 CORPORATE & PRICING COMBINED FLOW */}
                <section id="pricing" className="py-32 px-6 container mx-auto">
                    <div className="grid lg:grid-cols-3 gap-16 items-start mb-32">
                        {/* Summary Column */}
                        <div className="lg:col-span-1 border-r border-slate-100 dark:border-slate-800 pr-12 h-full">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-6 block">{t.pricing.badge}</span>
                            <h2 className="text-5xl md:text-7xl font-serif font-medium text-slate-950 dark:text-white mb-10 leading-[0.9] tracking-tighter">
                                Investment <br /> Strategies
                            </h2>
                            <p className="text-lg text-slate-500 font-light leading-relaxed mb-12">
                                {t.pricing.subtitle}
                            </p>
                            
                            {/* Corporate Inquiry Quick Link */}
                            <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-colors"></div>
                                <h4 className="text-lg font-bold mb-4 relative z-10">{t.corporate.badge}</h4>
                                <p className="text-[11px] text-slate-400 font-light mb-8 relative z-10">{t.corporate.desc}</p>
                                <a href="#corporate" className="px-6 py-3 bg-white text-slate-950 rounded-xl font-black text-[9px] uppercase tracking-widest relative z-10 hover:bg-slate-100 transition-colors inline-block">
                                    Contact Specialist
                                </a>
                            </div>
                        </div>

                        {/* Pricing Cards Grid (2 cols) */}
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                             {/* Trial - Discovery */}
                            <PricingCard 
                                tier={t.pricing.tiers.trial} 
                                icon={<Zap className="w-8 h-8" />} 
                                type="trial" 
                                onSelect={handlePlanSelect} 
                            />

                             {/* Complete - Full Mandate */}
                            <PricingCard 
                                tier={t.pricing.tiers.complete} 
                                icon={<ShieldCheck className="w-8 h-8" />} 
                                type="complete" 
                                featured
                                onSelect={handlePlanSelect} 
                            />
                        </div>
                    </div>
                </section>

                {/* 3.2 CORPORATE FULL DETAILS */}
                <section id="corporate" className="py-24 px-6 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800">
                    <div className="container mx-auto">
                        <div className="max-w-[1400px] mx-auto bg-slate-900 rounded-[4rem] p-10 md:p-20 text-white relative overflow-hidden">
                            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                            <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
                                <div>
                                    <h2 className="text-5xl md:text-7xl font-serif mb-10 leading-tight italic tracking-tighter">
                                        Executive Talent <br /> Strategy
                                    </h2>
                                    <div className="space-y-8">
                                        {[1, 2, 3].map((num) => (
                                            <div key={num} className="flex gap-6 group">
                                                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                                    {num === 1 ? <Scale size={24} /> : num === 2 ? <Target size={24} /> : <LineChart size={24} />}
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-bold mb-2">{(t.corporate as unknown as CorporateTranslation)[`feature${num as 1|2|3}_title` as keyof CorporateTranslation]}</h4>
                                                    <p className="text-slate-400 text-sm font-light leading-relaxed">{(t.corporate as unknown as CorporateTranslation)[`feature${num as 1|2|3}_desc` as keyof CorporateTranslation]}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-[3rem] text-center">
                                     <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-blue-500/20">
                                        <Building2 className="w-10 h-10 text-blue-500" />
                                     </div>
                                     <h3 className="text-2xl font-bold mb-4">{t.corporate.title}</h3>
                                     <p className="text-slate-400 font-light mb-10 text-sm leading-relaxed">{t.corporate.desc}</p>
                                     <button className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20 outline-none">
                                        Inquire For Organization
                                     </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

             {/* Contract Modal */}
             {selectedPlan && (
                <ContractModal 
                    isOpen={!!selectedPlan}
                    onClose={() => setSelectedPlan(null)}
                    planType={selectedPlan.type}
                    planName={selectedPlan.name}
                    planPrice={selectedPlan.price}
                    features={selectedPlan.features}
                />
            )}

        </div>
    );
}

// Helper Components
function PricingCard({ tier, icon, type, featured, onSelect }: PricingCardProps) {
    const { t } = useLanguage();
    
    return (
        <motion.div 
            whileHover={{ y: -8 }}
            className={cn(
                "p-8 rounded-4xl flex flex-col transition-all duration-500 relative overflow-hidden h-full",
                featured ? "bg-indigo-900 text-white shadow-2xl scale-105 z-10" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700"
            )}
        >
            {featured && (
                <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-indigo-400 via-purple-400 to-indigo-400"></div>
            )}
            
            <div className="mb-8 relative z-10">
                <div className={cn("inline-flex p-3 rounded-xl mb-6", featured ? "bg-white/10 text-white" : "bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white")}>
                    {icon}
                </div>
                <h3 className={cn("text-xl font-bold mb-1", featured ? "text-white" : "text-slate-900 dark:text-white")}>{tier.name}</h3>
                <p className={cn("text-[10px] font-black uppercase tracking-widest", featured ? "text-indigo-200" : "text-slate-400")}>{tier.badge}</p>
            </div>

            <div className={cn(
                "font-serif font-medium mb-8 leading-tight",
                tier.price.length > 10 ? "text-2xl" : "text-4xl",
                featured ? "text-white" : "text-slate-900 dark:text-white"
            )}>
                {tier.price} <span className={cn("text-xs font-sans font-bold", featured ? "text-indigo-200" : "text-slate-400")}>{tier.duration}</span>
            </div>

            <div className="space-y-4 mb-10 flex-1 relative z-10">
                {tier.features.map((f: string, i: number) => (
                    <div key={i} className={cn("flex items-start gap-3 text-xs font-bold leading-relaxed", featured ? "text-indigo-100" : "text-slate-500 dark:text-slate-400")}>
                        <Check className={cn("w-4 h-4 shrink-0", featured ? "text-indigo-300" : "text-blue-600")} strokeWidth={3} /> 
                        {f}
                    </div>
                ))}
            </div>

            <button 
                onClick={() => onSelect({ type, ...tier })}
                className={cn(
                    "w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all relative overflow-hidden group",
                    featured 
                        ? "bg-white text-indigo-900 hover:bg-slate-100" 
                        : "bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-blue-600 dark:hover:bg-slate-200"
                )}
            >
                <span className="relative z-10 flex cursor-pointer items-center justify-center gap-2">
                    {t.pricing.cta}
                </span>
            </button>
        </motion.div>
    );
}

