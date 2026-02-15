"use client";

import { motion, useScroll, useTransform, useSpring, useMotionTemplate, useMotionValue } from "framer-motion";
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
    FileText,
    ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { useRef, ReactNode, MouseEvent } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";

// --- Types & Interfaces ---
// --- Types & Interfaces ---

interface Item {
    title: string;
    desc: string;
}

interface FeatureCard {
    title: string;
    desc: string;
    tags: string[];
}


// --- Helper Components ---

// 1. Spotlight Card Effect
function SpotlightCard({ children, className = "" }: { children: ReactNode, className?: string }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <div
            className={cn(
                "group relative border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden",
                className
            )}
            onMouseMove={handleMouseMove}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(59, 130, 246, 0.1),
              transparent 80%
            )
          `,
                }}
            />
            <div className="relative h-full">{children}</div>
        </div>
    );
}

// --- Main Page Component ---
export default function ProfessionalsPage() {
    const { t, dir, language } = useLanguage();
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef });
    const springScroll = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });
    const opacityHero = useTransform(springScroll, [0, 0.2], [1, 0]);

    // Text Gradient for Headlines
    const textGradient = "bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-slate-400";

    return (
        <div 
            className={cn(
                "min-h-screen bg-[#FAFAFA] dark:bg-[#020202] selection:bg-amber-500/30 selection:text-amber-500 overflow-x-hidden",
                language === 'ar' ? 'font-arabic' : 'font-sans'
            )} 
            dir={dir} 
            ref={containerRef}
        >
            
            {/* AMBIENT BACKGROUND - GRID PATTERN */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 h-full w-full bg-white dark:bg-[#020202] bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[24px_24px]"></div>
                <div className="absolute left-0 right-0 top-[-10%] z-[-1] m-auto h-[500px] w-[500px] rounded-full bg-blue-500/20 dark:bg-blue-900/20 opacity-50 blur-[100px]"></div>
                <div className="absolute right-[-10%] bottom-[-10%] z-[-1] h-[400px] w-[400px] rounded-full bg-amber-500/10 dark:bg-amber-900/10 opacity-40 blur-[80px]"></div>
            </div>

            {/* --- HERO SECTION --- */}
            <section className="relative min-h-screen flex flex-col justify-center px-6 pt-32 pb-20 overflow-hidden">
                <div className="container mx-auto max-w-[1400px] relative z-10 text-center">
                    
                    {/* Badge */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md mb-12 shadow-sm hover:border-amber-500/50 transition-colors cursor-default"
                    >
                        <Crown className="w-4 h-4 text-amber-500" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300">
                            {t.hero.badge}
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1 
                        style={{ opacity: opacityHero }}
                        className="text-6xl md:text-[7rem] lg:text-[8rem] font-serif font-medium leading-[0.9] tracking-tight mb-10 text-slate-900 dark:text-white"
                    >
                        {t.hero.titlePre} <br className="hidden md:block" />
                        <span className="relative inline-block">
                            <span className={cn(textGradient, "relative z-10")}>
                                {t.hero.titleHighlight}
                            </span>
                            <motion.div 
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 0.8, duration: 1, ease: "circOut" }}
                                className="absolute bottom-2 left-0 w-full h-[0.2em] bg-blue-500/10 -z-10 rounded-full origin-left"
                            />
                        </span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 1 }}
                        className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto mb-16 font-light leading-relaxed"
                    >
                        {t.hero.subtitle}
                    </motion.p>

                    {/* CTAs */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6"
                    >
                        <Link href="/register" className="group relative w-full sm:w-auto px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full overflow-hidden transition-all hover:shadow-2xl hover:shadow-blue-900/20 active:scale-95">
                            <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <span className="relative z-10 flex items-center justify-center gap-3 font-bold text-xs uppercase tracking-[0.2em]">
                                {t.hero.ctaDashboard}
                                <ArrowRight className={cn("w-4 h-4 transition-transform", dir === 'rtl' ? 'group-hover:-translate-x-1 rotate-180' : 'group-hover:translate-x-1')} />
                            </span>
                        </Link>
                        
                        <a href="#protocol" className="w-full sm:w-auto px-10 py-5 bg-transparent border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-slate-50 dark:hover:bg-slate-900 transition-all flex items-center justify-center gap-3 active:scale-95">
                            <Play className="w-3 h-3 fill-current" />
                            {t.hero.ctaTour}
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* --- AUDIENCE TICKER / CARDS --- */}
            <section className="py-20 bg-white dark:bg-[#080808] border-y border-slate-100 dark:border-slate-900/50">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {t.targetAudience.cards.map((card: Item, idx: number) => (
                            <SpotlightCard key={idx} className="rounded-3xl p-8 hover:shadow-2xl hover:shadow-blue-900/5 dark:hover:shadow-blue-900/20 border-slate-200 dark:border-slate-800 transition-all duration-500 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 shadow-sm">
                                    <CheckCircle2 size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{card.title}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                    {card.desc}
                                </p>
                            </SpotlightCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- PROTOCOL SECTION (BENTO GRID) --- */}
            <section id="protocol" className="py-32 px-6 bg-slate-50 dark:bg-black/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
                
                <div className="container mx-auto max-w-[1400px] relative z-10">
                    <div className="mb-24 text-center max-w-4xl mx-auto">
                        <span className="text-blue-600 dark:text-blue-400 font-black text-[10px] uppercase tracking-[0.3em] block mb-6">
                            The Operating System
                        </span>
                        <h2 className="text-5xl md:text-7xl font-serif text-slate-900 dark:text-white mb-8">
                            {t.system.title}
                        </h2>
                        <p className="text-lg text-slate-500 font-light leading-relaxed">
                            {t.system.subtitle}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.entries(t.features.cards).map(([key, card]: [string, FeatureCard]) => (
                            <SpotlightCard key={key} className="rounded-3xl p-8 min-h-[320px] flex flex-col justify-between hover:border-blue-500/30 transition-colors">
                                <div>
                                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white mb-8">
                                        {key === 'diagnosis' && <Scan size={20} />}
                                        {key === 'simulation' && <Play size={20} />}
                                        {key === 'training' && <Briefcase size={20} />}
                                        {key === 'mentor' && <Zap size={20} />}
                                        {key === 'academy' && <Globe size={20} />}
                                        {key === 'library' && <Shield size={20} />}
                                        {key === 'expert' && <Crown size={20} />}
                                        {key === 'roadmap' && <Star size={20} />}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{card.title}</h3>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed line-clamp-4">
                                        {card.desc.split('\n').map((line: string, idx: number) => {
                                             if (line.includes('**')) {
                                                const parts = line.split('**');
                                                return <span key={idx}>{parts[1]} {parts[2]} </span>
                                            }
                                            return <span key={idx}>{line} </span>
                                        })}
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-6">
                                    {card.tags.map((tag: string) => (
                                        <span key={tag} className="px-2 py-1 rounded-md bg-slate-50 dark:bg-slate-800 text-[9px] uppercase tracking-wider font-bold text-slate-400">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </SpotlightCard>
                        ))}
                    </div>
                </div>
            </section>

             {/* --- FEATURE HIGHLIGHT (LARGE CARDS) --- */}
             <section className="py-24 px-6 bg-linear-to-b from-white to-slate-50 dark:from-[#050505] dark:to-slate-950">
                <div className="container mx-auto max-w-[1400px]">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Audit Card */}
                        <div className="group relative rounded-[3rem] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 overflow-hidden hover:border-blue-500/50 hover:shadow-2xl transition-all duration-500">
                             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32 transition-all group-hover:bg-blue-500/20"></div>
                             <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <div className="mb-10 w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <Scan size={40} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-4xl font-serif font-medium text-slate-900 dark:text-white mb-6">
                                        {t.audit.title}
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-10 max-w-md text-lg">
                                        {t.audit.desc}
                                    </p>
                                </div>
                                <Link href="/register" className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    Start Diagnosis <ArrowRight size={16} />
                                </Link>
                             </div>
                        </div>

                         {/* Simulation Card */}
                         <div className="group relative rounded-[3rem] bg-slate-900 dark:bg-black border border-slate-700 dark:border-slate-800 p-12 overflow-hidden hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-900/20 transition-all duration-500">
                             <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-32 -mt-32 transition-all group-hover:bg-amber-500/20"></div>
                             <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <div className="mb-10 w-20 h-20 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
                                        <Zap size={40} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-4xl font-serif font-medium text-white mb-6">
                                        {t.missions.title}
                                    </h3>
                                    <p className="text-slate-400 font-medium leading-relaxed mb-10 max-w-md text-lg">
                                        {t.missions.desc}
                                    </p>
                                </div>
                                <Link href="/register" className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-white hover:text-amber-500 transition-colors">
                                    Enter Simulation <ArrowRight size={16} />
                                </Link>
                             </div>
                        </div>
                    </div>
                </div>
             </section>


            <section className="py-24 px-6 bg-slate-50 dark:bg-black/50 relative overflow-hidden">
                <div className="container mx-auto max-w-5xl relative z-10">
                    <div className="bg-white dark:bg-[#0A0A0A] rounded-[2.5rem] p-12 md:p-16 shadow-2xl border border-slate-200 dark:border-slate-800 border-t-[6px] border-t-blue-600 dark:border-t-blue-500 relative overflow-visible">
                        
                        {/* Floating Badge */}
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] py-2 px-6 rounded-full shadow-lg shadow-blue-600/20">
                            Verified Documentation
                        </div>

                        {/* Background Pattern */}
                        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none opacity-50"></div>
                        
                        <div className="grid md:grid-cols-2 gap-16 relative z-10">
                            {/* Column 1 */}
                            <div>
                                <h3 className="flex items-center gap-4 text-2xl font-serif text-slate-900 dark:text-white mb-10">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                                        <FileText size={20} />
                                    </div>
                                    {t.assets.reportsTitle}
                                </h3>
                                <ul className="space-y-8">
                                    {t.assets.reports.map((item: Item, idx: number) => (
                                        <li key={idx} className="flex gap-4 group">
                                            <div className="mt-1 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <CheckCircle2 size={12} />
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{item.title}</h5>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Column 2 */}
                            <div>
                                <h3 className="flex items-center gap-4 text-2xl font-serif text-slate-900 dark:text-white mb-10">
                                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-500">
                                        <ShieldCheck size={20} />
                                    </div>
                                    {t.assets.officialTitle}
                                </h3>
                                <ul className="space-y-8">
                                    {t.assets.official.map((item: Item, idx: number) => (
                                        <li key={idx} className="flex gap-4 group">
                                            <div className="mt-1 w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                                                <CheckCircle2 size={12} />
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{item.title}</h5>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Footer / Seal */}
                        <div className="mt-20 pt-10 border-t border-dashed border-slate-200 dark:border-slate-800 text-center relative">
                            <div className="absolute left-1/2 -top-6 -translate-x-1/2 bg-white dark:bg-[#0A0A0A] px-4 text-slate-300 dark:text-slate-700">
                                <Crown size={32} className="opacity-20" />
                            </div>
                            <h4 className="font-serif text-3xl text-slate-900 dark:text-white mb-2 italic">Your Strategic Profile</h4>
                            <p className="text-xs text-slate-400 uppercase tracking-widest font-medium max-w-lg mx-auto leading-relaxed">
                                {t.assets.verifiable}
                            </p>
                            <div className="flex justify-center gap-8 mt-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                                <div className="text-[10px] font-bold uppercase tracking-[0.2em] border border-slate-300 px-3 py-1 rounded">ISO 27001</div>
                                <div className="text-[10px] font-bold uppercase tracking-[0.2em] border border-slate-300 px-3 py-1 rounded">GDPR Compliant</div>
                                <div className="text-[10px] font-bold uppercase tracking-[0.2em] border border-slate-300 px-3 py-1 rounded">SSL Secure</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-32 px-6 bg-slate-900 dark:bg-black text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h2 className="text-5xl md:text-7xl font-serif text-white mb-8">
                        {language === 'ar' ? 'ابدأ تحولك اليوم' : 'Start Your Transformation Today'}
                    </h2>
                    <p className="text-xl text-slate-400 mb-12 font-light">
                        {language === 'ar' 
                            ? 'انضم إلى نخبة المحترفين الذين أعادوا رسم مسارهم المهني.' 
                            : 'Join the elite professionals who have redefined their career trajectory.'}
                    </p>
                    <Link href="/register" className="inline-flex px-12 py-6 bg-blue-600 text-white rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-blue-700 transition-all">
                        {t.hero.ctaDashboard}
                    </Link>
                </div>
            </section>
        </div>
    );
}

