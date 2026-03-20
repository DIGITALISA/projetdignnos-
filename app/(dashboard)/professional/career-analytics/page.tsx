"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Sparkles, 
    Send, 
    User, 
    ArrowRight, 
    Briefcase, 
    Star,
    Trophy,
    TrendingUp,
    ShieldCheck,
    Rocket,
    Target,
    Zap,
    Shield,
    FileText
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";
import Link from "next/link";

import { AssetLocked } from "@/components/layout/AssetLocked";

interface GrandFinalReport {
    professionalIdentity: {
        verdict: string;
        maturityScore: number;
    };
    marketPositioning: {
        marketValueVerdict: string;
    };
    expertSynthesis: string;
}

interface ReadinessStatus {
    isReady: boolean;
    hasDiagnosis: boolean;
    hasSimulation: boolean;
    certReady: boolean;
    recReady: boolean;
    scorecardReady: boolean;
    sciReady: boolean;
}

export default function MarketingBeastPage() {
    const { language, dir } = useLanguage();
    const isRtl = dir === 'rtl';

    const [step, setStep] = useState(1); // 1: Select Scenario, 2: Simulation Chat, 3: Verdict
    const [targetScenario, setTargetScenario] = useState("");
    const [diagnosisContext, setDiagnosisContext] = useState<GrandFinalReport | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [readiness, setReadiness] = useState<ReadinessStatus | null>(null);
    
    // Chat States
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
    const [chatInput, setChatInput] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [finalVerdict, setFinalVerdict] = useState("");
    const [finalReport, setFinalReport] = useState<{
        verdict: string;
        pitch: string;
        pillars: string[];
        objections: string;
    } | null>(null);

    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            try {
                const stored = localStorage.getItem('grandFinalReport');
                if (stored) {
                    setDiagnosisContext(JSON.parse(stored));
                }

                const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
                const userId = profile.email || profile.fullName;
                if (userId) {
                    const res = await fetch(`/api/user/readiness?userId=${encodeURIComponent(userId)}`);
                    const data = await res.json();
                    if (data.success) {
                        setReadiness(data);
                    }
                }
            } catch (err) {
                console.error("Failed to load initial data:", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadInitialData();
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    const startSimulation = async (scenario: string) => {
        setTargetScenario(scenario);
        setStep(2);
        setIsThinking(true);
        
        // We don't send the user message to the UI yet, just start the chat
        try {
            const res = await fetch('/api/professional/marketing-beast/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    messages: [], 
                    diagnosisContext, 
                    targetScenario: scenario,
                    language 
                })
            });
            const data = await res.json();
            if (data.success) {
                setMessages([{ role: 'assistant', content: data.message }]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsThinking(false);
        }
    };

    const handleSendMessage = async () => {
        if (!chatInput.trim() || isThinking) return;

        const newMessages = [...messages, { role: 'user', content: chatInput } as const];
        setMessages(newMessages);
        setChatInput("");
        setIsThinking(true);

        try {
            const res = await fetch('/api/professional/marketing-beast/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    messages: newMessages, 
                    diagnosisContext,
                    targetScenario,
                    language 
                })
            });
            const data = await res.json();
            if (data.success) {
                let content = data.message;
                if (content.includes('[SIMULATION_COMPLETE]')) {
                    const parts = content.split('[SIMULATION_COMPLETE]');
                    content = parts[0].trim();
                    const rawReport = parts[1]?.trim() || "";
                    setFinalVerdict(rawReport);
                    
                    // Simple parser for the structured report
                    const sections = rawReport.split(/\d\.\s/);
                    setFinalReport({
                        verdict: sections[1]?.replace('EXECUTIVE VERDICT:', '').trim() || "",
                        pitch: sections[2]?.replace('PITCH STRATEGY:', '').trim() || "",
                        pillars: sections[3]?.replace('KEY VALUE PILLARS:', '').trim().split('\n').map((s: string) => s.replace(/[-*•]\s?/, '').trim()).filter(Boolean) || [],
                        objections: sections[4]?.replace('OBJECTION HANDLING:', '').trim() || ""
                    });
                    
                    setIsComplete(true);
                }
                setMessages([...newMessages, { role: 'assistant', content }]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsThinking(false);
        }
    };

    const t = {
        title: language === 'ar' ? 'وحش التسويق (Marketing Beast)' : 'Marketing Beast',
        sub: language === 'ar' ? 'أثبت قيمتك في تفاوض حقيقي مع الإدارة العليا' : 'Prove your value in a high-stakes negotiation with senior management',
        selectScenario: language === 'ar' ? 'اختر هدف التفاوض' : 'Select Negotiation Goal',
        scenarios: [
            { id: "Promotion", label: language === 'ar' ? 'ترقية لمنصب أعلى' : 'Higher Position Promotion', icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10" },
            { id: "Salary", label: language === 'ar' ? 'زيادة في الراتب' : 'Salary Increase', icon: Trophy, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { id: "Perks", label: language === 'ar' ? 'امتيازات إضافية' : 'New Perks & Privileges', icon: Star, color: "text-indigo-500", bg: "bg-indigo-500/10" }
        ],
        thinking: language === 'ar' ? 'المدير يراجع أداءك...' : 'Director reviewing your performance...',
        completeBtn: language === 'ar' ? 'عرض التقييم النهائي' : 'View Final Verdict',
        back: language === 'ar' ? 'رجوع' : 'Back',
        negotiation: language === 'ar' ? 'مفاوضات نشطة' : 'Active Negotiation'
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-950 min-h-screen">
                <div className="relative">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="w-24 h-24 rounded-full border-t-2 border-r-2 border-indigo-600 opacity-20"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-indigo-600 animate-pulse" />
                    </div>
                </div>
                <p className="mt-6 text-slate-500 font-medium tracking-widest uppercase text-xs animate-pulse">
                    {language === 'ar' ? 'جاري التحقق من الوصول...' : 'Verifying access...'}
                </p>
            </div>
        );
    }

    const isLocked = !readiness?.scorecardReady;

    if (isLocked) {
        return (
            <div className="min-h-screen bg-slate-950">
                <AssetLocked
                    title={t.title}
                    description={t.sub}
                    readiness={readiness || { hasDiagnosis: false, hasSimulation: false }}
                    isPremiumRequired={false}
                />
            </div>
        );
    }

    if (step === 1) {
        return (
            <div className="min-h-screen bg-slate-950 p-8 md:p-16 flex flex-col items-center justify-center relative overflow-hidden" dir={dir}>
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-600/10 blur-[120px] rounded-full animate-pulse delay-700" />
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl w-full text-center space-y-12 relative z-10"
                >
                    <div className="space-y-4">
                        <div className="w-24 h-24 bg-linear-to-br from-indigo-500 to-purple-700 rounded-3xl mx-auto flex items-center justify-center text-white shadow-2xl border border-white/20 rotate-12">
                            <Sparkles size={48} />
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
                            {t.title}
                        </h1>
                        <p className="text-slate-400 text-xl font-bold max-w-2xl mx-auto">
                            {t.sub}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {t.scenarios.map((s) => (
                            <motion.button
                                key={s.id}
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => startSimulation(s.label)}
                                className="bg-white/5 border border-white/10 p-10 rounded-4xl hover:bg-white/10 transition-all group relative overflow-hidden"
                            >
                                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110", s.bg, s.color)}>
                                    <s.icon size={32} />
                                </div>
                                <h3 className="text-white font-black text-lg">{s.label}</h3>
                                <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-500/30 rounded-4xl transition-all" />
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            </div>
        );
    }

    if (step === 2) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col h-screen overflow-hidden relative" dir={dir}>
                {/* Header */}
                <div className="p-8 bg-black/40 backdrop-blur-3xl border-b border-white/10 flex items-center justify-between z-20">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-linear-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl border border-white/10">
                            <ShieldCheck size={28} className="text-indigo-400" />
                        </div>
                        <div>
                             <h2 className="text-white text-xl font-black tracking-tight">{language === 'ar' ? 'المدير التنفيذي' : 'Executive Director'}</h2>
                             <div className="flex items-center gap-2 mt-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em]">{t.negotiation}: {targetScenario}</p>
                             </div>
                        </div>
                    </div>
                    <Link href="/professional/career-analytics" onClick={() => setStep(1)}>
                        <button className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2">
                             {t.back}
                        </button>
                    </Link>
                </div>

                {/* Chat Container */}
                <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-10 custom-scrollbar relative z-10" ref={chatContainerRef}>
                    <AnimatePresence>
                        {messages.map((msg, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className={cn(
                                    "flex w-full max-w-[85%] md:max-w-[70%] gap-4",
                                    msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                                )}
                            >
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl border",
                                    msg.role === 'user' ? "bg-slate-800 border-white/10 text-white" : "bg-white text-slate-950"
                                )}>
                                    {msg.role === 'user' ? <User size={20} /> : <Briefcase size={20} />}
                                </div>
                                <div className={cn(
                                    "p-8 rounded-3xl text-base md:text-lg leading-relaxed font-bold shadow-2xl relative",
                                    msg.role === 'user' 
                                        ? "bg-white/5 text-white rounded-tr-none border border-white/10" 
                                        : "bg-white text-slate-900 rounded-tl-none"
                                )}>
                                    {msg.content}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {isThinking && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex gap-4 items-center text-indigo-400 ml-16"
                        >
                             <div className="flex gap-1">
                                <motion.span animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                                <motion.span animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                                <motion.span animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                             </div>
                             <span className="text-[10px] font-black uppercase tracking-[0.3em] ml-2">{t.thinking}</span>
                        </motion.div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-10 bg-black/40 backdrop-blur-3xl border-t border-white/10 relative z-20">
                    <div className="max-w-5xl mx-auto">
                        {isComplete ? (
                            <motion.button 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={() => setStep(3)}
                                className="w-full py-8 bg-indigo-600 text-white rounded-3xl font-black text-xl uppercase tracking-widest shadow-2xl flex items-center justify-center gap-6"
                            >
                                {t.completeBtn} <ArrowRight size={32} className={isRtl ? "rotate-180" : ""} />
                            </motion.button>
                        ) : (
                            <div className="relative flex items-center gap-4 bg-white/5 p-3 pr-4 rounded-4xl border border-white/10 focus-within:border-indigo-500/50 transition-all">
                                 <input 
                                    className="flex-1 bg-transparent py-5 px-8 text-white text-lg font-bold outline-none placeholder:text-white/20"
                                    placeholder={language === 'ar' ? 'أقنع المدير بقيمتك...' : 'Convince the director of your value...'}
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    disabled={isThinking}
                                 />
                                 <button 
                                    onClick={handleSendMessage}
                                    disabled={!chatInput.trim() || isThinking}
                                    className="w-16 h-16 bg-white text-slate-950 rounded-3xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl disabled:opacity-20"
                                 >
                                    <Send size={28} />
                                 </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (step === 3) {
        return (
            <div className="min-h-screen bg-slate-100 p-6 md:p-12 pb-32" dir={dir}>
                <div className="max-w-4xl mx-auto space-y-10">
                    {/* Header Section */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-900 rounded-4xl p-12 text-center text-white shadow-3xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5"><Trophy size={160} /></div>
                        <div className="relative z-10 space-y-6">
                            <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                                <ShieldCheck size={40} />
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-4xl font-black uppercase tracking-tight">{language === 'ar' ? 'تقرير تسويق الذات' : 'Self-Marketing Strategy'}</h1>
                                <p className="text-emerald-400 font-bold uppercase text-[10px] tracking-[0.4em]">{t.negotiation}: {targetScenario}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Executive Verdict */}
                    <motion.section 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-4xl p-10 border border-slate-200 shadow-xl space-y-6"
                    >
                        <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest flex items-center gap-3">
                            <Zap size={18} /> {language === 'ar' ? 'التقييم التنفيذي للقدرات' : 'Executive Value Appraisal'}
                        </h3>
                        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 italic text-xl font-bold text-slate-800 leading-relaxed">
                            &quot;{finalReport?.verdict || finalVerdict}&quot;
                        </div>
                    </motion.section>

                    <div className="grid md:grid-cols-2 gap-10">
                        {/* Pitch Strategy */}
                        <motion.section 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-indigo-600 rounded-4xl p-10 text-white shadow-2xl space-y-6 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform"><Rocket size={80} /></div>
                            <h3 className="text-xs font-black uppercase tracking-widest relative z-10">{language === 'ar' ? 'خطة البداية (The Pitch)' : 'The Opening Pitch'}</h3>
                            <p className="text-lg font-bold leading-relaxed relative z-10 opacity-90">
                                {finalReport?.pitch}
                            </p>
                        </motion.section>

                        {/* Objections Handling */}
                        <motion.section 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-4xl p-10 border border-slate-200 shadow-xl space-y-6 group"
                        >
                             <h3 className="text-xs font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
                                <Shield size={16} /> {language === 'ar' ? 'التعامل مع الاعتراضات' : 'Objection Handling'}
                            </h3>
                            <p className="text-slate-600 font-bold leading-relaxed">
                                {finalReport?.objections}
                            </p>
                        </motion.section>
                    </div>

                    {/* Value Pillars */}
                    <motion.section 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-4xl p-12 border border-slate-200 shadow-xl space-y-8"
                    >
                        <h3 className="text-sm font-black text-emerald-600 uppercase tracking-widest flex items-center gap-3">
                            <Target size={20} /> {language === 'ar' ? 'ركائز القيمة الأساسية' : 'Core Value Pillars'}
                        </h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            {finalReport?.pillars.map((pillar, i) => (
                                <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center text-center space-y-4 group hover:bg-emerald-50 transition-colors">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-100 shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                        <Trophy size={18} />
                                    </div>
                                    <p className="text-sm font-black text-slate-700 leading-snug">{pillar}</p>
                                </div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Footer Actions */}
                    <div className="flex flex-col md:flex-row gap-6">
                        <Link href="/professional" className="flex-1">
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-6 bg-slate-900 text-white rounded-4xl font-black text-sm uppercase tracking-widest shadow-2xl flex items-center justify-center gap-4"
                            >
                                <ArrowRight size={20} className={isRtl ? "rotate-180" : ""} /> {language === 'ar' ? 'العودة للرئيسية' : 'Return to Home'}
                            </motion.button>
                        </Link>
                        <button 
                            onClick={() => window.print()} 
                            className="px-10 py-6 bg-white border border-slate-200 text-slate-900 rounded-4xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-4 shadow-xl"
                        >
                            <FileText size={20} /> {language === 'ar' ? 'حفظ التقرير' : 'Save Report'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
