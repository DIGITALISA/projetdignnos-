"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
    ArrowRight,
    Play,
    CheckCircle2,
    Zap,
    Shield,
    Check,
    Crown,
    Globe,
    Star,
    Scan,
    Fingerprint,
    FileCheck,
    Briefcase
} from "lucide-react";
import Link from "next/link";
import { useRef, useState, ReactNode } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";
import ContractModal from "@/components/legal/ContractModal";
import Image from "next/image";

// Interfaces
interface PricingTier {
    name: string;
    badge: string;
    price: string;
    duration: string;
    features: string[];
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
    const containerRef = useRef(null);
    const [selectedPlan, setSelectedPlan] = useState<(PricingTier & { type: string }) | null>(null);
    const { scrollYProgress } = useScroll({ target: containerRef });

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

            {/* 2. CINEMATIC HERO */}
            <section className="relative min-h-screen flex flex-col justify-center pt-32 pb-20 px-6 container mx-auto">
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
                        <a href="#system" className="w-full sm:w-auto px-12 py-6 bg-transparent border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-slate-50 dark:hover:bg-slate-900 active:scale-95 flex items-center justify-center gap-3">
                            <Play className="w-3 h-3 fill-current" />
                            {t.hero.ctaTour}
                        </a>
                    </div>
                </div>
            </section>

            {/* 4. DEEP DIVE: DIAGNOSIS (The Foundation) */}
            <section className="py-32 px-6 bg-slate-950 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <Image 
                        src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070" 
                        alt="Cybersecurity Audit Background" 
                        fill 
                        className="object-cover object-center grayscale mix-blend-overlay"
                    />
                </div>
                <div className="container mx-auto relative z-10 grid lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 mb-6 text-blue-400">
                            <Scan className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase tracking-[0.25em]">{t.audit?.badge || "Phase 1: Diagnosis"}</span>
                        </div>
                        <h2 className="text-5xl lg:text-7xl font-serif font-medium mb-8 leading-tight">
                            {t.audit?.title || "The Forensic Career Audit"}
                        </h2>
                        <p className="text-xl text-slate-400 leading-relaxed mb-8 max-w-lg font-light">
                            {t.audit?.desc || "Stop guessing. Our AI deep-scans your profile against 50+ executive parameters to identify exactly where you stand."}
                        </p>
                         <ul className="space-y-4 mb-10 text-slate-300">
                            {t.audit.features.map((f: string, i: number) => (
                                <li key={i} className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500 mt-1 shrink-0" />
                                    <span>{f}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="relative">
                         <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
                            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent z-10"></div>
                            <Image 
                                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070" 
                                alt="AI Analysis Interface" 
                                width={800} 
                                height={600}
                                className="object-cover transform transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute bottom-8 left-8 right-8 z-20">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                                        <Fingerprint className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-white font-bold">{t.audit.forensicsLabel}</div>
                                        <div className="text-blue-400 text-xs uppercase tracking-wider">{t.audit.scanningLabel}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

             {/* 5. DEEP DIVE: SIMULATIONS (The Practice) */}
             <section className="py-32 px-6 bg-white dark:bg-slate-900 relative">
                <div className="container mx-auto grid lg:grid-cols-2 gap-20 items-center">
                    <div className="order-2 lg:order-1 relative">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 group">
                             <Image 
                                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=2070" 
                                alt="Executive Board Meeting Simulation" 
                                width={800} 
                                height={600}
                                className="object-cover transform transition-transform duration-700 group-hover:scale-105"
                            />
                             <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply transition-opacity group-hover:opacity-0"></div>
                             
                              {/* Floating UI Card */}
                             <div className="absolute top-6 right-6 bg-white dark:bg-slate-950 p-4 rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 flex items-center gap-3 animate-bounce-slow">
                                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="text-xs font-bold uppercase tracking-wider">{t.missions.crisisLabel}</span>
                             </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2">
                        <div className="inline-flex items-center gap-2 mb-6 text-indigo-600">
                            <Zap className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase tracking-[0.25em]">{t.missions.badge}</span>
                        </div>
                        <h2 className="text-5xl lg:text-7xl font-serif font-medium text-slate-900 dark:text-white mb-8 leading-tight">
                            {t.missions.title}
                        </h2>
                        <p className="text-xl text-slate-500 leading-relaxed mb-8 max-w-lg font-light">
                            {t.missions.desc}
                        </p>
                        <ul className="space-y-4 mb-10 text-slate-600 dark:text-slate-400">
                            {t.missions.features.map((f: string, i: number) => (
                                <li key={i} className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-1 shrink-0" />
                                    <span>{f}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* 6. DEEP DIVE: AUTHORITY/WARRANT (The Result) */}
            <section className="py-32 px-6 bg-[#F5F5F7] dark:bg-[#080808] border-y border-slate-200 dark:border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-200/50 dark:bg-slate-900/20 -skew-x-12"></div>
                <div className="container mx-auto relative z-10">
                    <div className="max-w-4xl mx-auto text-center mb-20">
                        <Crown className="w-12 h-12 mx-auto text-amber-500 mb-6" />
                        <h2 className="text-5xl md:text-7xl font-serif font-medium text-slate-900 dark:text-white mb-6">
                            {t.assets?.title || "Bankable Career Proof"}
                        </h2>
                        <p className="text-xl text-slate-500 leading-relaxed">
                            {t.assets?.desc || "Don't just say you're good. Prove it. Graduate with a 'Strategic Performance Profile' that validates your capability."}
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                             <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex gap-6 items-start hover:border-amber-500/30 transition-colors">
                                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center shrink-0">
                                    <FileCheck className="w-6 h-6 text-amber-600 dark:text-amber-500" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t.assets.p1_title}</h4>
                                    <p className="text-slate-500">{t.assets.p1_desc}</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex gap-6 items-start hover:border-amber-500/30 transition-colors">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center shrink-0">
                                    <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-500" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t.assets.p2_title}</h4>
                                    <p className="text-slate-500">{t.assets.p2_desc}</p>
                                </div>
                            </div>
                        </div>

                        {/* The Warrant Card Visual - Redesigned */}
                        <div className="relative group perspective-1000">
                             <div className="absolute inset-0 bg-amber-500 blur-[80px] opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity"></div>
                             <div className="bg-white dark:bg-slate-900 aspect-[1.4/1] rounded-4xl shadow-2xl p-10 relative flex flex-col justify-between border border-slate-200 dark:border-slate-700 transform transition-transform duration-700 group-hover:rotate-x-2 group-hover:rotate-y-2">
                                 {/* Watermark */}
                                 <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                                    <Shield size={300} />
                                 </div>
                                 
                                 <div className="relative z-10 flex justify-between items-start">
                                     <div className="flex items-center gap-4">
                                        <div className="border border-slate-200 dark:border-slate-700 w-16 h-16 rounded-full flex items-center justify-center bg-slate-50 dark:bg-slate-800">
                                            <Shield className="w-8 h-8 text-slate-900 dark:text-white" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Official Warrant</div>
                                            <div className="text-2xl font-serif text-slate-900 dark:text-white">{t.cert?.cardTitle || "EXECUTIVE WARRANT"}</div>
                                        </div>
                                     </div>
                                     <div className="text-right hidden sm:block">
                                         <div className="w-20 h-20 bg-amber-400/10 border border-amber-400/50 rounded-lg flex items-center justify-center">
                                            <Crown className="w-10 h-10 text-amber-500" />
                                         </div>
                                     </div>
                                 </div>
    
                                 <div className="relative z-10 py-8 border-y border-slate-100 dark:border-slate-800 my-6">
                                    <p className="text-xl font-serif leading-relaxed text-slate-800 dark:text-slate-200 italic">
                                        &quot;{t.cert.warrant_text}&quot;
                                    </p>
                                 </div>
    
                                 <div className="relative z-10 flex justify-between items-center text-xs text-slate-400 uppercase tracking-widest font-bold">
                                    <span>{t.cert.authorized}</span>
                                    <span>{t.cert.ledger}: 8493X</span>
                                 </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. PRICING (Kept clean but premium) */}
            <section id="pricing" className="py-32 px-6 container mx-auto">
                <div className="text-center mb-24">
                     <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600 mb-4 block">{t.pricing.badge}</span>
                     <h2 className="text-4xl md:text-6xl font-serif text-slate-900 dark:text-white mb-6">{t.pricing.title}</h2>
                     <p className="text-slate-500 max-w-2xl mx-auto">{t.pricing.subtitle}</p>
                </div>

                <div className="grid lg:grid-cols-4 gap-6 max-w-7xl mx-auto align-stretch">
                   {/* Explorer */}
                   <PricingCard 
                        tier={t.pricing.tiers.explorer} 
                        icon={<Globe className="w-8 h-8" />} 
                        type="explorer" 
                        onSelect={(p) => setSelectedPlan(p)} 
                    />
                    
                    {/* Professional */}
                   <PricingCard 
                        tier={t.pricing.tiers.professional} 
                        icon={<Zap className="w-8 h-8" />} 
                        type="professional" 
                        onSelect={(p) => setSelectedPlan(p)} 
                    />

                    {/* Executive - Featured */}
                   <PricingCard 
                        tier={t.pricing.tiers.executive} 
                        icon={<Star className="w-8 h-8" />} 
                        type="executive" 
                        featured
                        onSelect={(p) => setSelectedPlan(p)} 
                    />

                    {/* Elite */}
                   <PricingCard 
                        tier={t.pricing.tiers.elite} 
                        icon={<Crown className="w-8 h-8" />} 
                        type="elite" 
                        onSelect={(p) => setSelectedPlan(p)} 
                    />
                </div>
            </section>

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

            <div className={cn("text-4xl font-serif font-medium mb-8", featured ? "text-white" : "text-slate-900 dark:text-white")}>
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

