"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { 
    Brain, 
    Target, 
    Zap, 
    ShieldCheck, 
    Sparkles, 
    ClipboardCheck, 
    Award, 
    TrendingUp, 
    CheckCircle2, 
    Users2, 
    MonitorPlay,
    ChevronRight,
    CheckCircle,
    Send,
    LayoutDashboard,
    Calendar,
    ArrowUpRight,
    Star,
    Sparkle,
    LucideIcon
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils";

// Background Graphics Components
const BackgroundDecoration = () => (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-100/30 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-100/20 rounded-full blur-[150px] translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[40px_40px] opacity-[0.2]" />
    </div>
);

const FloatingIcon = ({ icon: Icon, delay = 0, className = "" }: { icon: LucideIcon, delay?: number, className?: string }) => (
    <motion.div
        animate={{
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0],
        }}
        transition={{
            duration: 4,
            repeat: Infinity,
            delay,
            ease: "easeInOut"
        }}
        className={cn("absolute hidden lg:flex items-center justify-center p-4 bg-white rounded-2xl shadow-xl border border-slate-100 text-indigo-600", className)}
    >
        <Icon size={24} />
    </motion.div>
);

const fadeIn = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

const stagger = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function ExpertCallPage() {
    const { language, dir } = useLanguage();
    const t = translations[language as keyof typeof translations].expertCall;
    const ti = t.interview;

    // Interview state
    const [step, setStep] = useState<'intro' | 'questions' | 'form' | 'done'>('intro');
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', paymentMode: '', amount: '', paymentOther: '' });
    const [submitting, setSubmitting] = useState(false);
    const [otherText, setOtherText] = useState<Record<number, string>>({});
    const [multiSelectAnswers, setMultiSelectAnswers] = useState<Record<number, string[]>>({}); 
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const questions = ti.questions as Array<{ q: string; opts: string[]; multiSelect?: boolean; hasOther?: boolean }>;

    const handleAnswer = (answer: string) => {
        const updated = { ...answers, [currentQ]: answer };
        setAnswers(updated);
        // Don't auto-advance for "Other" — let user fill the text first
        if (answer.toLowerCase().includes('autre') || answer.toLowerCase().includes('other')) return;
        if (currentQ < questions.length - 1) {
            setTimeout(() => setCurrentQ(q => q + 1), 300);
        } else {
            setTimeout(() => setStep('form'), 300);
        }
    };

    const toggleMultiSelect = (qIndex: number, opt: string) => {
        setMultiSelectAnswers(prev => {
            const current = prev[qIndex] || [];
            const isExclusiveOpt = opt.includes("uniquement") || opt.includes("only");
            if (isExclusiveOpt) {
                return { ...prev, [qIndex]: current.includes(opt) ? [] : [opt] };
            }
            const withoutExclusive = current.filter(o => !o.includes("uniquement") && !o.includes("only"));
            if (withoutExclusive.includes(opt)) {
                return { ...prev, [qIndex]: withoutExclusive.filter(o => o !== opt) };
            }
            return { ...prev, [qIndex]: [...withoutExclusive, opt] };
        });
    };

    const handleMultiSelectConfirm = () => {
        const selected = multiSelectAnswers[currentQ] || [];
        if (selected.length === 0) return;
        setAnswers(a => ({ ...a, [currentQ]: selected.join(' | ') }));
        if (currentQ < questions.length - 1) {
            setTimeout(() => setCurrentQ(q => q + 1), 300);
        } else {
            setTimeout(() => setStep('form'), 300);
        }
    };

    const handleOtherConfirm = () => {
        const text = otherText[currentQ]?.trim();
        if (!text) return;
        setAnswers(a => ({ ...a, [currentQ]: `${ti.otherLabel}: ${text}` }));
        if (currentQ < questions.length - 1) {
            setTimeout(() => setCurrentQ(q => q + 1), 300);
        } else {
            setTimeout(() => setStep('form'), 300);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch("/api/expert-interview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    answers,
                    submittedAt: new Date().toISOString()
                })
            });
            if (res.ok) {
                setStep('done');
            }
        } catch (error) {
            console.error("Error submitting expert interview:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={cn(
            "min-h-screen bg-white pb-20 pt-10 relative",
            language === 'ar' ? 'font-arabic' : 'font-sans'
        )} dir={dir}>
            <BackgroundDecoration />
            
            <div className="max-w-7xl mx-auto px-6 space-y-32">
                {/* Hero Section */}
                <motion.section 
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    variants={stagger}
                    className="relative text-center space-y-12 pt-16"
                >
                    <FloatingIcon icon={Sparkle} delay={0.2} className="top-10 left-10 lg:left-20 text-blue-500" />
                    <FloatingIcon icon={Star} delay={0.5} className="top-40 right-10 lg:right-20 text-amber-500" />
                    <FloatingIcon icon={Brain} delay={0.8} className="bottom-0 left-0 text-indigo-500" />

                    <motion.div variants={fadeIn} className="inline-flex items-center gap-3 px-6 py-2.5 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-[0.25em] border border-indigo-100 shadow-sm">
                        <Sparkles size={14} className="animate-pulse" />
                        {t.badge}
                    </motion.div>
                    
                    <motion.h1 variants={fadeIn} className="text-6xl md:text-9xl font-black text-slate-900 tracking-tighter leading-[0.95] max-w-5xl mx-auto">
                        {t.heroTitle.split(' ').map((word, i) => (
                            word === 'Complet' || word === 'متكامل' || word === 'Complete' || word === 'Professional' || word === 'Parcours' || word === 'Experts' || word === 'Elite' ? 
                            <span key={i} className="text-transparent bg-clip-text bg-linear-to-b from-indigo-600 to-indigo-800 drop-shadow-sm"> {word} </span> : word + ' '
                        ))}
                    </motion.h1>
                    
                    <motion.p variants={fadeIn} className="text-xl md:text-2xl text-slate-500 max-w-4xl mx-auto leading-relaxed font-medium opacity-80 italic">
                        {t.heroSubtitle}
                    </motion.p>

                    <motion.div variants={fadeIn} className="pt-8">
                        <button 
                            onClick={() => document.getElementById('candidature')?.scrollIntoView({ behavior: 'smooth' })}
                            className="group relative px-10 py-5 bg-slate-900 text-white rounded-full font-black uppercase tracking-widest text-xs flex items-center gap-4 mx-auto hover:bg-indigo-600 transition-all active:scale-95 shadow-2xl shadow-slate-900/30 overflow-hidden"
                        >
                            <span className="relative z-10">{t.cta}</span>
                            <ArrowUpRight size={18} className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            <div className="absolute inset-0 bg-linear-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </motion.div>
                </motion.section>

                {/* Main Visual & Concept */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-12"
                    >
                        <div className="space-y-6">
                            <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">{t.conceptTitle}</h2>
                            <p className="text-slate-600 leading-relaxed text-xl font-medium">
                                {t.conceptDesc}
                            </p>
                        </div>
                        
                        <div className="space-y-8">
                            <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.4em] border-b-2 border-indigo-100 pb-2 inline-block">{t.pillarsTitle}</h3>
                            <div className="space-y-6">
                                {[
                                    { icon: Brain, key: 'ai', color: "blue" },
                                    { icon: Users2, key: 'sup', color: "indigo" },
                                    { icon: Award, key: 'exp', color: "amber" }
                                ].map((pillar, i) => {
                                    const pillarData = t.pillars[pillar.key as keyof typeof t.pillars];
                                    return (
                                        <motion.div 
                                            key={i} 
                                            whileHover={{ x: 10 }}
                                            className="flex gap-8 p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 backdrop-blur-sm hover:bg-white hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all group"
                                        >
                                            <div className={cn(
                                                "shrink-0 w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center transition-all",
                                                `text-${pillar.color}-600 group-hover:bg-indigo-600 group-hover:text-white`
                                            )}>
                                                <pillar.icon size={30} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-slate-900 mb-2">{pillarData.title}</h3>
                                                <p className="text-base text-slate-500 font-medium leading-relaxed">{pillarData.desc}</p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative group"
                    >
                        <div className="absolute -inset-10 bg-indigo-600/10 rounded-[5rem] blur-3xl animate-pulse" />
                        <div className="relative bg-white p-4 rounded-[4rem] shadow-3xl border border-slate-100 overflow-hidden transform group-hover:rotate-1 transition-transform duration-700">
                            {/* Decorative Background Image Overlay */}
                            <div className="absolute inset-0 opacity-20 grayscale scale-110 group-hover:scale-100 transition-transform duration-1000">
                                <Image 
                                    src="/images/ai_path_supervisor_system.png" 
                                    alt="System Background" 
                                    fill 
                                    className="object-cover"
                                />
                            </div>
                            
                            <div className="relative bg-slate-900 p-16 rounded-[3.5rem] text-white space-y-12 overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/30 blur-[80px] -mr-32 -mt-32" />
                                
                                <div className="flex items-center gap-5 relative z-10">
                                    <div className="w-14 h-14 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                        <Target size={28} />
                                    </div>
                                    <span className="font-black tracking-[0.3em] uppercase text-xs text-indigo-300">{t.target.badge}</span>
                                </div>
                                <h3 className="text-4xl font-black leading-tight relative z-10">{t.target.title}</h3>
                                <ul className="space-y-8 text-slate-300 font-bold text-lg relative z-10">
                                    {t.target.list.map((item, i) => (
                                        <motion.li 
                                            key={i} 
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex items-start gap-5 group/item"
                                        >
                                            <CheckCircle2 size={28} className="text-indigo-500 mt-0.5 shrink-0 group-hover/item:scale-125 transition-transform" />
                                            <span className="group-hover/item:text-white transition-colors">{item}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Intelligence & Workshops Phases */}
                <section className="space-y-24">
                    <div className="text-center space-y-8 max-w-4xl mx-auto">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100"
                        >
                            <Sparkles size={12} />
                            Cycle Opérationnel
                        </motion.div>
                        <h2 className="text-6xl font-black text-slate-900 tracking-tighter leading-tight">{t.phases.title}</h2>
                        <p className="text-slate-500 text-2xl font-medium leading-relaxed italic">{t.phases.subtitle}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {[
                            { 
                                key: 'diag',
                                icon: ClipboardCheck, 
                                badge: "Phase 01",
                                color: "blue",
                                bg: "from-blue-500/5 to-transparent"
                            },
                            { 
                                key: 'ws',
                                icon: Zap, 
                                badge: "Phase 02",
                                color: "indigo",
                                bg: "from-indigo-500/5 to-transparent"
                            }
                        ].map((phase, i) => {
                            const phaseData = t.phases[phase.key as 'diag' | 'ws'] as { title: string; desc: string };
                            return (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.2 }}
                                    className={cn(
                                        "relative bg-white p-16 rounded-[4rem] border border-slate-100 shadow-3xl shadow-slate-200/50 hover:border-indigo-100 transition-all group overflow-hidden bg-linear-to-b",
                                        phase.bg
                                    )}
                                >
                                    <div className={cn(
                                        "absolute top-0 right-0 px-6 py-2 rounded-bl-3xl text-[10px] font-black uppercase tracking-[0.3em] border-b border-l",
                                        `bg-${phase.color}-50 text-${phase.color}-600 border-${phase.color}-100`
                                    )}>
                                        {phase.badge}
                                    </div>
                                    <div className={cn(
                                        "w-20 h-20 rounded-3xl flex items-center justify-center mb-10 transition-all duration-500 shadow-lg group-hover:-rotate-12 group-hover:scale-110",
                                        `bg-${phase.color}-50 text-${phase.color}-600`
                                    )}>
                                        <phase.icon size={40} />
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-900 mb-6 group-hover:text-indigo-600 transition-colors">{phaseData.title}</h3>
                                    <p className="text-slate-600 leading-relaxed text-xl font-medium opacity-90">{phaseData.desc}</p>
                                    
                                    <div className="absolute bottom-0 right-0 p-12 opacity-5 translate-y-1/2 translate-x-1/2 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-700">
                                        <phase.icon size={120} />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* Role of Expert & Stimulation */}
                <section className="bg-slate-900 rounded-[5rem] p-12 lg:p-32 text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 mix-blend-overlay">
                        <Image src="/images/expert_collaboration_hero.png" alt="Overlay" fill className="object-cover" />
                    </div>
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/20 blur-[180px] -mr-96 -mt-96 animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-blue-600/10 blur-[180px] -ml-96 -mb-96" />
                    
                    <div className="relative z-10 space-y-32">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
                            <div className="space-y-12">
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    className="inline-flex items-center gap-3 px-6 py-2.5 bg-white/10 rounded-full text-[11px] font-black uppercase tracking-[0.4em] text-indigo-300 backdrop-blur-xl border border-white/10 shadow-2xl"
                                >
                                    <Award size={16} />
                                    {t.role.badge}
                                </motion.div>
                                <h2 className="text-6xl md:text-7xl font-black tracking-tighter leading-tight drop-shadow-2xl">{t.role.title}</h2>
                                <p className="text-slate-400 text-2xl leading-relaxed font-medium max-w-2xl italic">
                                    {t.role.desc}
                                </p>
                                
                                <div className="space-y-10 pt-8">
                                    <h4 className="text-sm font-black uppercase tracking-[0.5em] text-indigo-400 border-l-4 border-indigo-600 pl-6">{t.role.tasksTitle}</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                        {t.role.tasks.map((task: { title: string; text: string }, i: number) => (
                                            <motion.div 
                                                key={i} 
                                                whileHover={{ y: -5 }}
                                                className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-all hover:border-indigo-500/50 group backdrop-blur-sm"
                                            >
                                                <h5 className="font-black text-indigo-300 mb-3 text-xl group-hover:text-white transition-colors">{task.title}</h5>
                                                <p className="text-base text-slate-400 leading-relaxed font-bold">{task.text}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-16">
                                <motion.div 
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-indigo-600 rounded-[3.5rem] p-16 space-y-10 shadow-4xl shadow-indigo-600/40 border-2 border-indigo-500/50 relative overflow-hidden group"
                                >
                                    <div className="absolute top-0 right-0 p-12 opacity-15 grayscale invert group-hover:scale-110 transition-transform duration-1000">
                                        <MonitorPlay size={180} />
                                    </div>
                                    <h3 className="text-4xl font-black flex items-center gap-6 relative z-10">
                                        <MonitorPlay size={40} className="animate-pulse" />
                                        {t.stim.title}
                                    </h3>
                                    <div className="space-y-8 text-indigo-50 font-bold text-xl relative z-10">
                                        <p className="border-b-2 border-indigo-400/50 pb-6 opacity-90 leading-relaxed italic">{t.stim.intro}</p>
                                        <ul className="space-y-8">
                                            {t.stim.list.map((item, i) => (
                                                <li key={i} className="flex gap-6 items-center group/item hover:translate-x-2 transition-transform">
                                                    <div className="w-3 h-3 rounded-full bg-white shadow-xl group-hover/item:scale-150 transition-transform"/> 
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>

                                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3.5rem] p-16 space-y-8 hover:bg-white/10 transition-all shadow-inner">
                                    <h3 className="text-3xl font-black flex items-center gap-6">
                                        <ShieldCheck size={36} className="text-indigo-400" />
                                        {t.binome.title}
                                    </h3>
                                    <p className="text-xl text-slate-400 leading-relaxed font-bold italic">
                                        {t.binome.desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Platform Highlights */}
                <section className="relative py-20 px-12 bg-slate-50/50 rounded-[4rem] border border-slate-100 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-indigo-200 to-transparent" />
                    <div className="space-y-20">
                        <div className="text-center space-y-6">
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest"
                            >
                                <LayoutDashboard size={14} />
                                Digital Cockpit
                            </motion.div>
                            <h2 className="text-6xl font-black text-slate-900 tracking-tighter">{t.platform.title}</h2>
                            <p className="text-slate-500 text-2xl max-w-4xl mx-auto font-medium leading-relaxed italic">{t.platform.desc}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                            {t.platform.features.map((feature: string, i: number) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ y: -10 }}
                                    className="p-10 bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 hover:border-indigo-200 hover:shadow-indigo-500/10 transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-150 transition-transform duration-700">
                                        {i === 0 && <LayoutDashboard size={100} />}
                                        {i === 1 && <Users2 size={100} />}
                                        {i === 2 && <Calendar size={100} />}
                                        {i === 3 && <TrendingUp size={100} />}
                                    </div>
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600 mb-10 group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-12 group-hover:scale-110 transition-all shadow-sm">
                                        {i === 0 && <LayoutDashboard size={32} />}
                                        {i === 1 && <Users2 size={32} />}
                                        {i === 2 && <Calendar size={32} />}
                                        {i === 3 && <TrendingUp size={32} />}
                                    </div>
                                    <p className="font-black text-slate-900 text-xl leading-tight relative z-10">{feature}</p>
                                </motion.div>
                            ))}
                        </div>

                        {t.communityNote && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                className="bg-white border-2 border-indigo-100 rounded-[3rem] p-12 flex flex-col md:flex-row items-center gap-10 max-w-6xl mx-auto shadow-sm relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600" />
                                <div className="w-24 h-24 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 shadow-xl shadow-indigo-500/10 shrink-0 transform group-hover:rotate-6 transition-transform">
                                    <Users2 size={48} />
                                </div>
                                <p className="text-slate-800 font-bold text-2xl leading-relaxed italic text-center md:text-left tracking-tight">
                                    &ldquo; {t.communityNote} &rdquo;
                                </p>
                            </motion.div>
                        )}
                    </div>
                </section>

                {/* Conditions & Benefits */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 pb-20">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="bg-white p-16 rounded-[4.5rem] border border-slate-100 shadow-3xl space-y-12 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50 rounded-bl-[4.5rem] -mr-24 -mt-24 transition-transform duration-700 group-hover:scale-125" />
                        <h3 className="text-4xl font-black text-slate-900 relative z-10">{t.conditions.title}</h3>
                        <div className="space-y-8 relative z-10">
                            {t.conditions.list.map((text: string, i: number) => (
                                <div key={i} className="flex gap-6 items-center group/item hover:translate-x-2 transition-transform">
                                    <div className="shrink-0 w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover/item:bg-indigo-600 group-hover/item:text-white transition-all shadow-sm">
                                        <TrendingUp size={24} />
                                    </div>
                                    <p className="text-slate-700 font-black text-base tracking-tight leading-tight">{text}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="bg-amber-50/50 p-16 rounded-[4.5rem] border border-amber-100/50 space-y-12 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-100/30 rounded-bl-[4.5rem] -mr-24 -mt-24 group-hover:scale-125 transition-transform duration-700" />
                        <div className="space-y-8 relative z-10">
                            <div className="flex items-center gap-6 text-amber-700">
                                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-lg shadow-amber-500/10">
                                    <ShieldCheck size={36} />
                                </div>
                                <h3 className="text-4xl font-black leading-tight">{t.pedag.title}</h3>
                            </div>
                            <p className="text-amber-900/80 font-black text-2xl leading-relaxed italic max-w-2xl px-2">
                                &ldquo;{t.pedag.desc}&rdquo;
                            </p>
                        </div>

                        <div className="pt-12 border-t-2 border-amber-200/30 relative z-10">
                            <h4 className="text-xs font-black text-amber-900 uppercase tracking-[0.4em] mb-10 opacity-70">{t.benefits.title}</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                {t.benefits.list.map((item: string, i: number) => (
                                    <motion.div 
                                        key={i} 
                                        whileHover={{ scale: 1.05 }}
                                        className="flex items-center gap-4 bg-white/50 p-4 rounded-2xl border border-amber-100 shadow-sm"
                                    >
                                        <div className="w-3 h-3 rounded-full bg-amber-500 shrink-0 shadow-lg shadow-amber-500/30" />
                                        <span className="text-base font-black text-amber-900/90 leading-tight">{item}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Expert Interview Section */}
                <section id="candidature" className="pb-32 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-linear-to-b from-indigo-500/50 to-transparent -mt-32" />
                    
                    <div className="text-center space-y-8 mb-20">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-3 px-6 py-2.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-xl"
                        >
                            <Send size={14} className="group-hover:translate-x-1 transition-transform" />
                            {ti.badge}
                        </motion.div>
                        <h2 className="text-7xl font-black text-slate-900 tracking-tighter leading-tight">{ti.title}</h2>
                        <p className="text-slate-500 text-2xl font-medium max-w-3xl mx-auto italic leading-relaxed">
                            {ti.subtitle(questions.length)}
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <AnimatePresence mode="wait">

                            {/* INTRO */}
                            {step === 'intro' && (
                                <motion.div key="intro"
                                    initial={{ opacity: 0, scale: 0.95, y: 50 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 1.05, y: -50 }}
                                    className="bg-slate-900 rounded-[4.5rem] p-16 lg:p-24 text-white text-center space-y-12 relative overflow-hidden shadow-4xl shadow-slate-900/30"
                                >
                                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/30 blur-[150px] -mr-32 -mt-32" />
                                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] -ml-32 -mb-32" />
                                    
                                    <div className="relative z-10 space-y-12">
                                        <motion.div 
                                            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                                            transition={{ duration: 4, repeat: Infinity }}
                                            className="w-24 h-24 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-3xl shadow-indigo-600/40 border-2 border-indigo-400/50"
                                        >
                                            <Award size={48} />
                                        </motion.div>
                                        <div className="space-y-6">
                                            <h3 className="text-5xl font-black tracking-tight leading-tight">{ti.ready}</h3>
                                            <p className="text-slate-400 text-2xl font-medium leading-relaxed max-w-2xl mx-auto italic">
                                                {ti.readyDesc}
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap items-center justify-center gap-12 text-sm text-indigo-300/80 font-black tracking-widest uppercase">
                                            <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/5"><CheckCircle size={18} /> {ti.stats.questions(questions.length)}</div>
                                            <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/5"><Calendar size={18} /> {ti.stats.time}</div>
                                            <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/5"><ShieldCheck size={18} /> {ti.stats.confidential}</div>
                                        </div>
                                        <button
                                            onClick={() => setStep('questions')}
                                            className="group relative px-12 py-7 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-black uppercase tracking-[0.3em] text-sm transition-all hover:scale-105 active:scale-95 shadow-3xl shadow-indigo-600/50 flex items-center gap-4 mx-auto overflow-hidden"
                                        >
                                            <span className="relative z-10">{ti.start}</span>
                                            <ChevronRight size={22} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                                            <div className="absolute inset-0 bg-linear-to-r from-indigo-400 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* QUESTIONS */}
                            {step === 'questions' && (
                                <motion.div key={`q-${currentQ}`}
                                    initial={{ opacity: 0, x: 100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    className="space-y-10"
                                >
                                    {/* Progress bar */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end text-sm font-black uppercase tracking-widest text-slate-400">
                                            <span className="text-indigo-600">{ti.progress(currentQ + 1, questions.length)}</span>
                                            <span className="text-xs">{ti.completed(Math.round(((currentQ) / questions.length) * 100))}</span>
                                        </div>
                                        <div className="h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner border-2 border-slate-50">
                                            <motion.div
                                                className="h-full bg-linear-to-r from-indigo-500 to-blue-600 rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${((currentQ) / questions.length) * 100}%` }}
                                                transition={{ duration: 0.6, ease: "easeOut" }}
                                            />
                                        </div>
                                    </div>

                                    {/* Question card */}
                                    <div className="bg-white border-2 border-slate-100 rounded-[4rem] p-16 shadow-4xl shadow-slate-200/60 space-y-12 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-16 -mt-16" />
                                        
                                        <h3 className="text-4xl font-black text-slate-900 leading-[1.15] relative z-10 tracking-tight">
                                            {questions[currentQ].q}
                                        </h3>
                                        
                                        <div className="space-y-5 relative z-10">
                                            {questions[currentQ].multiSelect ? (
                                                <div className="space-y-4">
                                                    {questions[currentQ].opts.map((opt, i) => {
                                                        const isSelected = (multiSelectAnswers[currentQ] || []).includes(opt);
                                                        return (
                                                            <motion.button
                                                                key={i}
                                                                type="button"
                                                                whileHover={{ x: 8 }}
                                                                onClick={() => toggleMultiSelect(currentQ, opt)}
                                                                className={cn(
                                                                    "w-full text-left px-8 py-6 rounded-3xl border-2 font-black text-lg transition-all flex items-center gap-5 shadow-sm",
                                                                    isSelected
                                                                        ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-indigo-100"
                                                                        : "border-slate-100 bg-slate-50 text-slate-700 hover:border-indigo-200 hover:bg-white"
                                                                )}
                                                            >
                                                                <span className={cn(
                                                                    "w-8 h-8 rounded-xl border-2 flex items-center justify-center shrink-0 transition-all shadow-inner",
                                                                    isSelected ? "bg-indigo-600 border-indigo-600" : "bg-white border-slate-300"
                                                                )}>
                                                                    {isSelected && <CheckCircle size={18} className="text-white" />}
                                                                </span>
                                                                {opt}
                                                            </motion.button>
                                                        );
                                                    })}
                                                    <p className="text-xs font-black text-indigo-400 text-center pt-4 tracking-widest uppercase">{ti.multiSelectHint}</p>
                                                    
                                                    <button
                                                        onClick={handleMultiSelectConfirm}
                                                        disabled={(multiSelectAnswers[currentQ] || []).length === 0}
                                                        className="w-full mt-10 py-6 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase tracking-[0.25em] text-sm hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-40 shadow-2xl shadow-slate-900/20 flex items-center justify-center gap-4 group"
                                                    >
                                                        <CheckCircle size={20} className="group-hover:scale-125 transition-transform" />
                                                        {ti.confirmSelection((multiSelectAnswers[currentQ] || []).length)}
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    {questions[currentQ].opts.map((opt, i) => (
                                                        <motion.button
                                                            key={i}
                                                            whileHover={{ x: 8 }}
                                                            onClick={() => handleAnswer(opt)}
                                                            className={cn(
                                                                "w-full text-left px-8 py-6 rounded-3xl border-2 font-black text-lg transition-all flex items-center gap-5 shadow-sm",
                                                                answers[currentQ] === opt
                                                                    ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-indigo-100"
                                                                    : "border-slate-100 bg-slate-50 text-slate-700 hover:border-indigo-200 hover:bg-white"
                                                            )}
                                                        >
                                                            <span className={cn(
                                                                "w-10 h-10 rounded-2xl bg-white border-2 flex items-center justify-center text-sm font-black shrink-0 shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all",
                                                                answers[currentQ] === opt ? "border-indigo-600 text-indigo-600 bg-indigo-100" : "border-slate-200 text-slate-400"
                                                            )}>
                                                                {String.fromCharCode(65 + i)}
                                                            </span>
                                                            {opt}
                                                        </motion.button>
                                                    ))}

                                                    {questions[currentQ].hasOther && (
                                                        <div className="space-y-4 pt-4">
                                                            <button
                                                                onClick={() => handleAnswer(ti.otherLabel)}
                                                                className={cn(
                                                                    "w-full text-left px-8 py-6 rounded-3xl border-2 border-dashed font-black text-lg transition-all flex items-center gap-5",
                                                                    answers[currentQ] === ti.otherLabel || answers[currentQ]?.startsWith(`${ti.otherLabel}:`)
                                                                        ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                                                                        : "border-slate-300 bg-slate-50/50 text-slate-500 hover:border-indigo-300 hover:bg-white"
                                                                )}
                                                            >
                                                                <span className="w-10 h-10 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center text-xl shrink-0">
                                                                    ✏️
                                                                </span>
                                                                {ti.otherLabel}
                                                            </button>

                                                            {(answers[currentQ] === ti.otherLabel || answers[currentQ]?.startsWith(`${ti.otherLabel}:`)) && (
                                                                 <motion.div
                                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    className="flex gap-4 p-2 bg-indigo-50 rounded-[2.5rem]"
                                                                >
                                                                    <input
                                                                        autoFocus
                                                                        type="text"
                                                                        placeholder={ti.otherPlaceholder}
                                                                        value={otherText[currentQ] || ''}
                                                                        onChange={e => setOtherText(o => ({...o, [currentQ]: e.target.value}))}
                                                                        onKeyDown={e => e.key === 'Enter' && handleOtherConfirm()}
                                                                        className="flex-1 px-8 py-5 bg-white border-2 border-indigo-200 rounded-4xl font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 transition-all text-lg shadow-inner"
                                                                    />
                                                                    <button
                                                                        onClick={handleOtherConfirm}
                                                                        disabled={!otherText[currentQ]?.trim()}
                                                                        className="w-20 bg-indigo-600 text-white rounded-4xl flex items-center justify-center hover:bg-indigo-700 transition-all disabled:opacity-40 shadow-xl shadow-indigo-600/20"
                                                                    >
                                                                        <ChevronRight size={32} />
                                                                    </button>
                                                                </motion.div>
                                                            )}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {currentQ > 0 && (
                                        <button
                                            onClick={() => setCurrentQ(q => q - 1)}
                                            className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-3 px-6 py-3 rounded-full hover:bg-slate-100 mx-auto"
                                        >
                                            <ChevronRight size={16} className="rotate-180" />
                                            {ti.back}
                                        </button>
                                    )}
                                </motion.div>
                            )}

                            {/* FORM */}
                            {step === 'form' && (
                                <motion.div key="form"
                                    initial={{ opacity: 0, scale: 0.95, y: 50 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -50 }}
                                    className="space-y-12"
                                >
                                    <div className="text-center space-y-4">
                                        <motion.div 
                                            animate={{ scale: [1, 1.2, 1] }}
                                            className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-green-100 border border-green-100"
                                        >
                                            <CheckCircle size={40} className="text-green-500" />
                                        </motion.div>
                                        <h3 className="text-5xl font-black text-slate-900 tracking-tight">{ti.formTitle}</h3>
                                        <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto italic">{ti.formSubtitle}</p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="bg-white border-2 border-slate-100 rounded-[4.5rem] p-16 shadow-4xl shadow-slate-200/60 lg:p-24 space-y-10 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-bl-full -mr-32 -mt-32 opacity-50" />
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                            <div className="space-y-4">
                                                <label className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 ml-2">{ti.firstName}</label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={formData.firstName}
                                                    onChange={e => setFormData(f => ({...f, firstName: e.target.value}))}
                                                    placeholder={ti.firstName || "First Name"}
                                                    className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-bold text-lg text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all shadow-inner"
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 ml-2">{ti.lastName}</label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={formData.lastName}
                                                    onChange={e => setFormData(f => ({...f, lastName: e.target.value}))}
                                                    placeholder={ti.lastName || "Last Name"}
                                                    className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-bold text-lg text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all shadow-inner"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                            <div className="space-y-4">
                                                <label className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 ml-2">{ti.email}</label>
                                                <input
                                                    required
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={e => setFormData(f => ({...f, email: e.target.value}))}
                                                    placeholder="expert@consulting.com"
                                                    className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-bold text-lg text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all shadow-inner"
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 ml-2">{ti.phone}</label>
                                                <input
                                                    required
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={e => setFormData(f => ({...f, phone: e.target.value}))}
                                                    placeholder="+213 XX XX XX XX"
                                                    className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-bold text-lg text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all shadow-inner"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-8 pt-6">
                                            <label className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 ml-2">{ti.paymentPref}</label>
                                            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                                                {Object.entries(ti.paymentModes).map(([val, label]) => (
                                                    <button
                                                        key={val}
                                                        type="button"
                                                        onClick={() => setFormData(f => ({...f, paymentMode: val, amount: ''}) )}
                                                        className={cn(
                                                            "flex flex-col items-center gap-3 px-6 py-6 rounded-3xl border-2 font-black text-xs transition-all shadow-sm",
                                                            formData.paymentMode === val
                                                                ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-indigo-100"
                                                                : "border-slate-100 bg-slate-50 text-slate-500 hover:border-indigo-200 hover:bg-white"
                                                        )}
                                                    >
                                                        <span className="text-3xl">
                                                            {val === 'projet' ? '📦' : val === 'jour' ? '📅' : val === 'heure' ? '⏱️' : val === 'flexible' ? '🤝' : '✏️'}
                                                        </span>
                                                        <span className="uppercase tracking-widest leading-tight">{label as string}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {formData.paymentMode && formData.paymentMode !== 'flexible' && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="space-y-6 pt-6"
                                            >
                                                {formData.paymentMode === 'autre' && (
                                                    <div className="space-y-4">
                                                        <label className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 ml-2">{ti.paymentOtherLabel}</label>
                                                        <input
                                                            required
                                                            type="text"
                                                            value={formData.paymentOther}
                                                            onChange={e => setFormData(f => ({...f, paymentOther: e.target.value}))}
                                                            placeholder={ti.paymentOtherPlaceholder}
                                                            className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-bold text-lg text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all shadow-inner"
                                                        />
                                                    </div>
                                                )}
                                                <div className="space-y-4">
                                                    <label className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 ml-2">
                                                        {ti.amountLabel(ti.paymentModes[formData.paymentMode as keyof typeof ti.paymentModes] as string)}
                                                    </label>
                                                    <div className="relative group/input">
                                                        <input
                                                            required
                                                            type="number"
                                                            min="0"
                                                            value={formData.amount}
                                                            onChange={e => setFormData(f => ({...f, amount: e.target.value}))}
                                                            placeholder={ti.paymentAmountPlaceholder}
                                                            className="w-full pl-8 pr-24 py-6 bg-slate-50 border-2 border-slate-100 rounded-3xl font-black text-2xl text-slate-900 placeholder:text-slate-200 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all shadow-inner"
                                                        />
                                                        <span className="absolute right-8 top-1/2 -translate-y-1/2 text-lg font-black text-indigo-300 group-focus-within/input:text-indigo-600 transition-colors uppercase tracking-widest">{language === 'en' ? 'USD' : language === 'fr' ? 'EUR' : 'DZD'}</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {formData.paymentMode === 'flexible' && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="px-8 py-6 bg-green-50 border-2 border-green-100 rounded-[2.5rem] text-green-700 font-black text-lg flex items-center gap-6 shadow-sm italic"
                                            >
                                                <span className="text-4xl">🤝</span>
                                                {ti.flexibleSuccess}
                                            </motion.div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={submitting || !formData.paymentMode}
                                            className="group relative w-full py-8 bg-slate-900 text-white rounded-[3rem] font-black uppercase tracking-[0.32em] text-sm hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-5 shadow-4xl shadow-slate-900/30 overflow-hidden mt-16"
                                        >
                                            <div className="absolute inset-0 bg-linear-to-r from-indigo-700 via-indigo-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            {submitting ? (
                                                <div className="relative z-10 flex items-center gap-4">
                                                    <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" /> 
                                                    {ti.submitting}
                                                </div>
                                            ) : (
                                                <div className="relative z-10 flex items-center gap-4">
                                                    {ti.submit}
                                                    <ArrowUpRight size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                </div>
                                            )}
                                        </button>
                                    </form>
                                </motion.div>
                            )}

                            {/* DONE */}
                            {step === 'done' && (
                                <motion.div key="done"
                                    initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    className="bg-slate-900 rounded-[5rem] p-24 text-white text-center space-y-12 relative overflow-hidden shadow-4xl shadow-slate-900/40"
                                >
                                    <div className="absolute top-0 left-0 w-full h-3 bg-linear-to-r from-indigo-500 via-blue-400 to-indigo-500" />
                                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white/20 to-transparent" />
                                    
                                    <motion.div 
                                        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                                        className="w-32 h-32 bg-green-500 rounded-[3rem] flex items-center justify-center mx-auto shadow-3xl shadow-green-500/40 relative z-10"
                                    >
                                        <CheckCircle size={64} className="text-white drop-shadow-lg" />
                                    </motion.div>
                                    
                                    <div className="space-y-6 relative z-10">
                                        <h3 className="text-6xl font-black tracking-tight leading-tight">{ti.doneTitle}</h3>
                                        <p className="text-slate-400 text-2xl font-medium leading-relaxed max-w-3xl mx-auto italic" dangerouslySetInnerHTML={{ __html: ti.doneDesc(formData.firstName) }} />
                                    </div>
                                    
                                    <div className="relative z-10 pt-10">
                                        <div className="inline-block px-10 py-5 bg-white/5 rounded-3xl border border-white/10 text-indigo-400 text-sm font-black tracking-[0.5em] uppercase hover:bg-white/10 transition-all cursor-default shadow-sm">
                                            {ti.doneFooter}
                                        </div>
                                    </div>
                                    
                                    <Sparkles className="absolute top-10 right-10 text-indigo-500/30 animate-pulse" size={40} />
                                    <Sparkles className="absolute bottom-10 left-10 text-blue-500/30 animate-bounce" size={30} />
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </section>

            </div>
        </div>
    );
}
