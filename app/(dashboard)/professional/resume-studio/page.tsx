"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Brain, 
    Sparkles, 
    Send, 
    User, 
    ArrowRight, 
    FileText, 
    Download, 
    Rocket,
    CheckCircle2,
    Target,
    Zap,
    History,
    Shield,
    TrendingUp,
    ChevronLeft,
    X
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";
import Link from "next/link";
import domtoimage from "dom-to-image-more";
import { jsPDF } from "jspdf";
import { Loader2, Globe, Award, BadgeCheck, Mail, Phone, Linkedin, MessageCircle, MapPin } from "lucide-react";

interface ResumeData {
    personalInfo: { 
        fullName: string; 
        title: string; 
        summary: string;
        contactInfo?: {
            email: string;
            phone: string;
            linkedin: string;
            whatsapp: string;
            location: string;
        };
    };
    experience: { role: string; company: string; duration: string; achievements: string[] }[];
    skills: { technical: string[]; leadership: string[]; soft: string[] };
    portfolioStructure: {
        title: string;
        caseStudies: { name: string; challenge: string; solution: string; impact: string }[];
    };
    coverLetter: string;
}

interface GrandFinalReport {
    professionalIdentity: {
        verdict: string;
        maturityScore: number;
        psychologicalFootprint: string;
    };
    competencyMatrix: {
        skillRadar: { name: string; score: number }[];
        gapAnalysis: string;
        decisionQualityVerdict: string;
    };
    marketPositioning: {
        jobAlignmentScore: number;
        stabilityProfile: string;
        marketValueVerdict: string;
    };
    actionableRoadmap: {
        shortTerm: string[];
        mediumTerm: string;
        longTermVision: string;
    };
    expertSynthesis: string;
}

export default function ResumeStudioPage() {
    const { language, dir } = useLanguage();
    const isRtl = dir === 'rtl';

    const [step, setStep] = useState(1); // Start at 1 for selection. 2: Chat, 3: Generation, 4: Results
    const [pathMode, setPathMode] = useState<'ats' | 'target' | 'internal' | null>(null);
    const [targetJob, setTargetJob] = useState("");
    const [targetCompany, setTargetCompany] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [showTargetModal, setShowTargetModal] = useState(false);
    const [hasPersonalized, setHasPersonalized] = useState(false);
    
    const [diagnosisContext, setDiagnosisContext] = useState<GrandFinalReport | null>(null);
    
    // Chat States
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
    const [chatInput, setChatInput] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [activeTab, setActiveTab] = useState<'portfolio' | 'ats' | 'letter'>('portfolio');
    const [downloadingTab, setDownloadingTab] = useState<string | null>(null);

    // Refs for PDF Generation
    const portfolioRef = useRef<HTMLDivElement>(null);
    const atsResumeRef = useRef<HTMLDivElement>(null);
    const coverLetterRef = useRef<HTMLDivElement>(null);

    // Final Data
    const [finalResume, setFinalResume] = useState<ResumeData | null>(null);
    const [activationType, setActivationType] = useState("Gratuit");
    const [userRole, setUserRole] = useState("");

    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const userProfileRaw = localStorage.getItem('userProfile');
        if (userProfileRaw) {
            const profile = JSON.parse(userProfileRaw);
            if (profile.activationType) setActivationType(profile.activationType);
            if (profile.role) setUserRole(profile.role);
        }
    }, []);

    const handleDownloadPDF = async (ref: React.RefObject<HTMLDivElement | null>, filename: string) => {
        if (activationType !== 'Pro' && userRole !== 'Admin' && userRole !== 'Moderator') {
            const msg = language === 'ar' 
                ? 'تحميل الوثائق النهائية (PDF) متاح فقط للمشتركين مفعلي العضوية (Pro). يرجى التواصل مع الإدارة للتفعيل.' 
                : 'Downloading final documents (PDF) is only available for Pro members. Please contact administration for activation.';
            alert(msg);
            return;
        }

        if (!ref.current) return;
        setDownloadingTab(filename);
        try {
            const element = ref.current;
            const dataUrl = await domtoimage.toPng(element, {
                quality: 1,
                bgcolor: '#ffffff',
                width: element.scrollWidth,
                height: element.scrollHeight,
                style: {
                    transform: 'scale(1)',
                    transformOrigin: 'top left'
                }
            });

            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(dataUrl);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            let heightLeft = pdfHeight;
            let position = 0;
            const pageHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, pdfHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - pdfHeight;
                pdf.addPage();
                pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, pdfHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`${filename}.pdf`);
        } catch (error) {
            console.error("PDF generation failed:", error);
        } finally {
            setDownloadingTab(null);
        }
    };

    useEffect(() => {
        const initChat = async () => {
            const stored = localStorage.getItem('grandFinalReport');
            let ctx = null;
            if (stored) {
                ctx = JSON.parse(stored);
                setDiagnosisContext(ctx);
            }
            if (messages.length === 0 && !isThinking) {
                setIsThinking(true);
                try {
                    const res = await fetch('/api/professional/resume-studio/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            messages: [], 
                            targetJob: "", 
                            targetCompany: "", 
                            jobDescription: "", 
                            diagnosisContext: ctx, 
                            language,
                            mode: pathMode 
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
            }
        };
        initChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleTargetSubmit = async () => {
        if (!targetJob.trim()) return;
        setShowTargetModal(false);
        setHasPersonalized(true);

        const shiftMessage = language === 'ar' 
            ? `أريد تخصيص هويتي المهنية الآن لوظيفة "${targetJob}" في شركة "${targetCompany}".\n\nوصف الوظيفة والمتطلبات (GAP Analysis):\n${jobDescription}`
            : `I want to tailor my professional identity for the role of "${targetJob}" at "${targetCompany}".\n\nJob Description (GAP Analysis focus):\n${jobDescription}`;
        
        const newMessages = [...messages, { role: 'user', content: shiftMessage } as const];
        setMessages(newMessages);
        setIsThinking(true);

        try {
            const res = await fetch('/api/professional/resume-studio/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    messages: newMessages, 
                    targetJob, 
                    targetCompany, 
                    jobDescription,
                    diagnosisContext, 
                    language,
                    mode: 'target'
                })
            });
            const data = await res.json();
            if (data.success) {
                let content = data.message;
                if (content.includes('[READY_FOR_RESUME]')) {
                    content = content.replace('[READY_FOR_RESUME]', '').trim();
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

    const handleSendMessage = async () => {
        if (!chatInput.trim() || isThinking) return;

        const newMessages = [...messages, { role: 'user', content: chatInput } as const];
        setMessages(newMessages);
        setChatInput("");
        setIsThinking(true);

        try {
            const res = await fetch('/api/professional/resume-studio/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    messages: newMessages, 
                    targetJob: hasPersonalized ? targetJob : "", 
                    targetCompany: hasPersonalized ? targetCompany : "", 
                    jobDescription: hasPersonalized ? jobDescription : "",
                    diagnosisContext, 
                    language,
                    mode: pathMode
                })
            });
            const data = await res.json();
            if (data.success) {
                let content = data.message;
                if (content.includes('[READY_FOR_RESUME]')) {
                    content = content.replace('[READY_FOR_RESUME]', '').trim();
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

    const handleGenerateFinal = async () => {
        setStep(3);
        try {
            const res = await fetch('/api/professional/resume-studio/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    targetJob: hasPersonalized ? targetJob : "", 
                    targetCompany: hasPersonalized ? targetCompany : "", 
                    jobDescription: hasPersonalized ? jobDescription : "",
                    diagnosisContext, 
                    interviewMessages: messages, 
                    language,
                    mode: pathMode
                })
            });
            const data = await res.json();
            setFinalResume(data);
            setStep(4);
        } catch (err) {
            console.error(err);
        }
    };

    const t = {
        title: language === 'ar' ? 'صانع الهوية المهنية العام' : 'General Identity Architect',
        sub: language === 'ar' ? 'بناء هوية مهنية مبنية على نتائج تشخيصك' : 'Building a professional identity based on your diagnosis results',
        jobLabel: language === 'ar' ? 'الوظيفة المستهدفة' : 'Target Job Title',
        companyLabel: language === 'ar' ? 'الشركة المستهدفة (اختياري)' : 'Target Company (Optional)',
        descLabel: language === 'ar' ? 'الوصف الوظيفي (لتحليل دقيق)' : 'Job Description (For Gap Analysis)',
        startBtn: language === 'ar' ? 'تأكيد التخصيص' : 'Confirm Personalization',
        personalizeBtn: language === 'ar' ? 'تخصيص لوظيفة محددة' : 'Tailor for Specific Job',
        thinking: language === 'ar' ? 'الخبير يحلل بياناتك...' : 'Expert analyzing your data...',
        generateBtn: language === 'ar' ? 'توليد الوثائق النهائية' : 'Generate Final Documents',
        generating: language === 'ar' ? 'جاري بناء سيرتك الذاتية والبورتفوليو...' : 'Building your Resume & Portfolio...',
        back: language === 'ar' ? 'رجوع' : 'Back',
        download: language === 'ar' ? 'تحميل' : 'Download',
        portfolioTab: language === 'ar' ? 'البورتفوليو المهني' : 'Strategic Portfolio',
        resumeTab: language === 'ar' ? 'السيرة الذاتية (ATS)' : 'ATS Resume',
        letterTab: language === 'ar' ? 'رسالة التحفيز' : 'Motivation Letter',
        verifiedLabel: language === 'ar' ? 'مصادق عليه من MATC Strategic Diagnosis' : 'Verified by MATC Strategic Diagnosis',
        brandingSub: language === 'ar' ? 'هذه الهوية تم توليدها وتدقيقها بناءً على نظام تشخيص استراتيجي عالي الدقة.' : 'This identity was generated and audited based on a high-precision strategic diagnostic system.',
        
        // Path Selection Strings (Missing restored)
        pathTitle: language === 'ar' ? 'اختر مسارك الاحترافي' : 'Choose Your Strategic Path',
        pathSub: language === 'ar' ? 'سوف يقوم الخبير بتعديل منطق الذكاء الاصطناعي بناءً على اختيارك' : 'The expert will adapt the AI logic based on your specific objective',
        pathAtsTitle: language === 'ar' ? 'خبير الـ ATS (عام)' : 'ATS Master (General)',
        pathAtsDesc: language === 'ar' ? 'بناء سيرة ذاتية قيادية قوية تناسب السوق العالمية' : 'Build a powerful executive profile for the global market',
        pathTargetTitle: language === 'ar' ? 'قناص الفرص (محدد)' : 'Targeted Sniper (Specific)',
        pathTargetDesc: language === 'ar' ? 'تعديل هويتك المهنية لعرض عمل معين بدقة عالية' : 'Tailor your identity for a specific job offer with high precision',
        pathInternalTitle: language === 'ar' ? 'النمو الداخلي (ترقية)' : 'Internal Growth (Promotion)',
        pathInternalDesc: language === 'ar' ? 'الاستعداد للمطالبة بزيادة أو ترقية داخل شركتك الحالية' : 'Prepare for a salary raise or promotion within your current company',
        startPath: language === 'ar' ? 'ابدأ المسار المختار' : 'Start Selected Path',
    };

    if (step === 1) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden" dir={dir}>
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[120px] animate-pulse delay-1000" />
                </div>

                <div className="relative z-10 w-full max-w-6xl space-y-12">
                    <div className="text-center space-y-4">
                        <motion.div 
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="inline-flex items-center gap-3 px-6 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-black uppercase tracking-[0.3em]"
                        >
                            <Sparkles size={14} /> {t.title}
                        </motion.div>
                        <motion.h1 
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-black text-white tracking-tight"
                        >
                            {t.pathTitle}
                        </motion.h1>
                        <motion.p 
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium"
                        >
                            {t.pathSub}
                        </motion.p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {( [
                            { id: 'ats', title: t.pathAtsTitle, desc: t.pathAtsDesc, icon: Shield, color: 'indigo' },
                            { id: 'target', title: t.pathTargetTitle, desc: t.pathTargetDesc, icon: Target, color: 'emerald' },
                            { id: 'internal', title: t.pathInternalTitle, desc: t.pathInternalDesc, icon: TrendingUp, color: 'blue' }
                        ] as const).map((p, idx) => {
                            const Icon = p.icon;
                            const isSelected = pathMode === p.id;
                            return (
                                <motion.button
                                    key={p.id}
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 + (idx * 0.1) }}
                                    onClick={() => setPathMode(p.id)}
                                    className={cn(
                                        "group relative p-10 rounded-[3rem] border transition-all duration-500 text-right md:text-center flex flex-col items-center gap-6",
                                        isSelected 
                                            ? `bg-${p.color}-500/10 border-${p.color}-500/50 shadow-2xl shadow-${p.color}-500/20 scale-[1.02]` 
                                            : "bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/8"
                                    )}
                                >
                                    <div className={cn(
                                        "w-20 h-20 rounded-3xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110",
                                        isSelected ? `bg-${p.color}-500 text-white` : "bg-white/10 text-white/50"
                                    )}>
                                        <Icon size={40} />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className={cn("text-2xl font-black transition-colors", isSelected ? "text-white" : "text-white/70")}>{p.title}</h3>
                                        <p className="text-sm font-bold text-slate-400 leading-relaxed">{p.desc}</p>
                                    </div>
                                    {isSelected && (
                                        <motion.div 
                                            layoutId="selected-ring"
                                            className={cn("absolute inset-0 rounded-[3rem] border-2 pointer-events-none", `border-${p.color}-500`)}
                                        />
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>

                    <div className="flex justify-center pt-8">
                        <motion.button
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={!pathMode}
                            onClick={() => {
                                if (pathMode === 'target') {
                                    setShowTargetModal(true);
                                } else {
                                    setStep(2);
                                }
                            }}
                            className="bg-white text-slate-950 px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.3em] shadow-2xl disabled:opacity-20 flex items-center gap-4 transition-all"
                        >
                            {t.startPath} <ArrowRight size={20} className={isRtl ? "rotate-180" : ""} />
                        </motion.button>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 2) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col h-screen overflow-hidden relative" dir={dir}>
                {/* Target Modal */}
                <AnimatePresence>
                    {showTargetModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
                                onClick={() => setShowTargetModal(false)}
                            />
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                className="relative bg-white/5 border border-white/10 p-8 rounded-[2.5rem] w-full max-w-2xl shadow-3xl backdrop-blur-3xl overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none"><Target size={120} /></div>
                                <div className="flex justify-between items-center mb-8 relative z-10">
                                    <h3 className="text-2xl font-black text-white">{t.personalizeBtn}</h3>
                                    <button onClick={() => setShowTargetModal(false)} className="text-white/50 hover:text-white transition-colors">
                                        <X size={24} />
                                    </button>
                                </div>
                                <div className="space-y-6 relative z-10">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400 block">{t.jobLabel}</label>
                                            <input 
                                                className={cn("w-full px-5 py-4 bg-white/5 rounded-2xl border border-white/10 focus:border-indigo-500 focus:bg-white/10 outline-none font-bold text-white transition-all", isRtl ? "text-right" : "text-left")}
                                                placeholder={isRtl ? "مثال: مبرمج الواجهة الأمامية" : "e.g. Executive Director"}
                                                value={targetJob}
                                                onChange={(e) => setTargetJob(e.target.value)}
                                                dir={dir}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 block">{t.companyLabel}</label>
                                            <input 
                                                className={cn("w-full px-5 py-4 bg-white/5 rounded-2xl border border-white/10 focus:border-blue-500 focus:bg-white/10 outline-none font-bold text-white transition-all", isRtl ? "text-right" : "text-left")}
                                                placeholder={isRtl ? 'مثال: شركة تكنولوجيا عالمية' : "e.g. Global Tech Inc."}
                                                value={targetCompany}
                                                onChange={(e) => setTargetCompany(e.target.value)}
                                                dir={dir}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 block">{t.descLabel}</label>
                                        <textarea 
                                            className={cn("w-full px-5 py-4 bg-white/5 rounded-2xl border border-white/10 focus:border-emerald-500 focus:bg-white/10 outline-none font-bold text-white transition-all h-32 resize-none custom-scrollbar", isRtl ? "text-right" : "text-left")}
                                            placeholder={isRtl ? 'ضع وصف الوظيفة هنا ليقوم الذكاء الاصطناعي بتحليله...' : "Paste full job description here for GAP Analysis..."}
                                            value={jobDescription}
                                            onChange={(e) => setJobDescription(e.target.value)}
                                            dir={dir}
                                        />
                                    </div>
                                    <button 
                                        onClick={() => {
                                            handleTargetSubmit();
                                            setStep(2);
                                        }}
                                        disabled={!targetJob.trim()}
                                        className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all disabled:opacity-50 flex items-center justify-center gap-3 mt-4 disabled:grayscale"
                                    >
                                        {t.startBtn} <ArrowRight size={18} className={isRtl ? "rotate-180" : ""} />
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Header */}
                <div className="p-8 bg-black/40 backdrop-blur-3xl border-b border-white/10 flex items-center justify-between z-20">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-linear-to-br from-indigo-600 to-blue-700 rounded-2xl flex items-center justify-center text-white shadow-[0_10px_30px_-5px_rgba(79,70,229,0.4)] border border-white/20">
                            <Brain size={28} />
                        </div>
                        <div>
                             <h2 className="text-white text-xl font-black tracking-tight">{hasPersonalized ? (language === 'ar' ? 'الهوية المخصصة' : 'Targeted Identity') : t.title}</h2>
                             <div className="flex items-center gap-2 mt-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em]">{hasPersonalized ? `${targetJob} @ ${targetCompany || 'Various'}` : (language === 'ar' ? 'هوية عامة وجاهزة' : 'General Outline')}</p>
                             </div>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        {!hasPersonalized && (
                            <button onClick={() => setShowTargetModal(true)} className="px-5 py-2.5 bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 rounded-xl text-indigo-300 hover:text-white font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 relative z-50">
                                <Target size={16} />
                                <span className="hidden md:inline">{t.personalizeBtn}</span>
                            </button>
                        )}
                        <div className="hidden md:flex px-5 py-2.5 bg-white/5 rounded-xl border border-white/10 items-center gap-3">
                            <History size={16} className="text-slate-400" />
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Session Active</span>
                        </div>
                    </div>
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
                                    msg.role === 'user' ? "bg-slate-800 border-white/10 text-white" : "bg-indigo-600 border-white/20 text-white"
                                )}>
                                    {msg.role === 'user' ? <User size={20} /> : <Zap size={20} />}
                                </div>
                                <div className={cn(
                                    "p-8 rounded-[2.5rem] text-base md:text-lg leading-relaxed font-bold shadow-2xl relative group",
                                    msg.role === 'user' 
                                        ? "bg-white/5 text-white rounded-tr-none border border-white/10" 
                                        : "bg-linear-to-br from-indigo-600/20 to-blue-600/10 text-white rounded-tl-none border border-indigo-500/30 backdrop-blur-xl italic"
                                )}>
                                    {msg.content}
                                    {msg.role === 'assistant' && (
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                                            <Sparkles size={24} />
                                        </div>
                                    )}
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
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleGenerateFinal}
                                className="w-full py-8 bg-linear-to-r from-emerald-500 to-teal-600 text-white rounded-4xl font-black text-xl uppercase tracking-[0.25em] shadow-[0_20px_50px_-10px_rgba(16,185,129,0.4)] flex items-center justify-center gap-6 group border border-white/20"
                            >
                                {t.generateBtn}
                                <Rocket size={32} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                            </motion.button>
                        ) : (
                            <div className="relative group/input">
                                <div className="absolute inset-0 bg-indigo-500/10 blur-3xl opacity-0 group-focus-within/input:opacity-100 transition-opacity pointer-events-none" />
                                <div className="relative flex items-center gap-4 bg-white/5 p-3 pr-4 rounded-[2.5rem] border border-white/10 shadow-2xl focus-within:border-indigo-500/50 focus-within:bg-white/10 transition-all">
                                     <input 
                                        className="flex-1 bg-transparent py-5 pl-8 text-white text-lg font-bold outline-none placeholder:text-white/20"
                                        placeholder={language === 'ar' ? 'أجب الخبير عن مشاريعك...' : 'Answer the expert about your projects...'}
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                        disabled={isThinking}
                                     />
                                     <button 
                                        onClick={handleSendMessage}
                                        disabled={!chatInput.trim() || isThinking}
                                        className="w-16 h-16 bg-white text-slate-950 rounded-3xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl disabled:opacity-20 disabled:grayscale"
                                     >
                                        <Send size={28} />
                                     </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (step === 3) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 space-y-16 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 blur-[150px] rounded-full animate-pulse" />
                </div>
                
                <div className="relative z-10 w-full max-w-xl px-10 text-center space-y-12">
                    <div className="relative w-48 h-48 mx-auto">
                        <div className="absolute inset-0 border-[3px] border-indigo-500/20 rounded-full" />
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border-[3px] border-t-indigo-500 rounded-full"
                        />
                        <div className="absolute inset-4 border border-white/5 rounded-full flex items-center justify-center">
                            <Rocket className="text-white animate-bounce" size={48} />
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        <motion.h2 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-5xl font-black text-white leading-tight"
                        >
                            {t.generating}
                        </motion.h2>
                        <p className="text-indigo-400 font-black uppercase tracking-[0.5em] text-xs animate-pulse">
                            {language === 'ar' ? 'نظامنا الذكي يقوم ببناء هويتك المهنية' : 'AI Strategic Core is orchestrating your professional identity'}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-left">
                        {['ATS Compliance', 'Executive Tone', 'Quantified KPIs', 'Strategic Alignment'].map((tag, i) => (
                            <div key={i} className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
                                <CheckCircle2 size={16} className="text-emerald-400" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{tag}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (step === 4 && finalResume) {
        return (
            <div className="min-h-screen bg-slate-50 p-6 md:p-12 pb-32 relative text-slate-900" dir={dir}>
                {/* Header Bar */}
                <div className="max-w-6xl mx-auto space-y-8 relative z-10">
                    <header className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-4xl shadow-sm border border-slate-200 gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-xl">
                                {finalResume.personalInfo.fullName.charAt(0)}
                            </div>
                            <div className="space-y-1 text-center md:text-left">
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight">{finalResume.personalInfo.fullName}</h1>
                                <div className="flex flex-wrap justify-center md:justify-start gap-3 items-center">
                                    <span className="text-indigo-600 font-bold uppercase text-xs tracking-widest bg-indigo-50 px-4 py-1.5 rounded-xl border border-indigo-100/50">
                                        {finalResume.personalInfo.title}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/professional">
                                <button className="px-8 py-4 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-2xl font-bold uppercase text-xs tracking-widest transition-all flex items-center gap-3 shadow-sm group">
                                    <ChevronLeft size={18} className={cn("group-hover:-translate-x-1 transition-transform", isRtl ? "rotate-180 group-hover:translate-x-1" : "")} /> {t.back}
                                </button>
                            </Link>
                        </div>
                    </header>

                    {/* Tab Navigation */}
                    <div className="flex flex-wrap gap-2 p-1.5 bg-slate-200/50 backdrop-blur-md rounded-3xl self-center max-w-fit mx-auto border border-slate-200">
                        {(['portfolio', 'ats', 'letter'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3",
                                    activeTab === tab 
                                        ? "bg-white text-indigo-600 shadow-lg scale-105" 
                                        : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                                )}
                            >
                                {tab === 'portfolio' && <Globe size={16} />}
                                {tab === 'ats' && <Shield size={16} />}
                                {tab === 'letter' && <FileText size={16} />}
                                {tab === 'portfolio' ? t.portfolioTab : tab === 'ats' ? t.resumeTab : t.letterTab}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'portfolio' && (
                            <motion.div
                                key="portfolio"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex justify-center mb-4">
                                    <button 
                                        onClick={() => handleDownloadPDF(portfolioRef, `Portfolio_${finalResume.personalInfo.fullName.replace(/\s+/g, '_')}`)}
                                        disabled={downloadingTab !== null}
                                        className="px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center gap-3 transition-all shadow-xl shadow-indigo-100 hover:scale-105 disabled:opacity-50"
                                    >
                                        {downloadingTab === `Portfolio_${finalResume.personalInfo.fullName.replace(/\s+/g, '_')}` ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
                                        {t.download} {t.portfolioTab} (PDF)
                                    </button>
                                </div>

                                <div ref={portfolioRef} className="bg-white rounded-6xl shadow-2xl border border-slate-100 overflow-hidden max-w-5xl mx-auto print:shadow-none print:border-none">
                                    {/* Portfolio Header - Bold Branding */}
                                    <div className="bg-slate-950 p-16 md:p-24 text-white relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] -mr-48 -mt-48" />
                                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                                            <div className="space-y-6">
                                                <div className="px-5 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full inline-flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">
                                                    <Award size={14} /> Strategic Professional Portfolio
                                                </div>
                                                <h1 className="text-5xl md:text-7xl font-black tracking-tighter">{finalResume.personalInfo.fullName}</h1>
                                                <h2 className="text-xl md:text-2xl font-medium text-slate-400 tracking-widest uppercase">{finalResume.personalInfo.title}</h2>
                                                
                                                {/* Contact Bar for Portfolio */}
                                                <div className="flex flex-wrap gap-6 pt-6 opacity-80">
                                                    {finalResume.personalInfo.contactInfo?.email && (
                                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                                                            <Mail size={14} className="text-indigo-400" /> {finalResume.personalInfo.contactInfo.email}
                                                        </div>
                                                    )}
                                                    {finalResume.personalInfo.contactInfo?.linkedin && (
                                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                                                            <Linkedin size={14} className="text-indigo-400" /> LinkedIn
                                                        </div>
                                                    )}
                                                    {finalResume.personalInfo.contactInfo?.whatsapp && (
                                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                                                            <MessageCircle size={14} className="text-emerald-400" /> WhatsApp
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-center gap-4 bg-white/5 p-8 rounded-4xl border border-white/10 backdrop-blur-xl">
                                                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-950 shadow-2xl">
                                                    <BadgeCheck size={48} />
                                                </div>
                                                <div className="text-center space-y-1">
                                                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{t.verifiedLabel}</p>
                                                    <p className="text-[8px] text-slate-500 font-bold max-w-[150px] leading-tight opacity-70">Authentic Diagnostic Synthesis v4.0</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-16 md:p-20 space-y-20">
                                        <section className="grid md:grid-cols-3 gap-16 items-start">
                                            <div className="md:col-span-2 space-y-8">
                                                <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.4em] border-b border-indigo-100 pb-4">Executive Vision</h3>
                                                <p className="text-xl md:text-2xl text-slate-800 font-bold leading-relaxed text-justify">
                                                    {finalResume.personalInfo.summary}
                                                </p>
                                            </div>
                                            <div className="space-y-8">
                                                <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.4em] border-b border-indigo-100 pb-4">Foundational DNA</h3>
                                                <div className="flex flex-wrap gap-3">
                                                    {[...finalResume.skills.technical, ...finalResume.skills.leadership].map((s, i) => (
                                                        <span key={i} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600">
                                                            {s}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </section>

                                        <section className="space-y-12">
                                            <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.4em] border-b border-indigo-100 pb-4">Strategic Impact & Case Studies</h3>
                                            <div className="grid md:grid-cols-2 gap-10">
                                                {finalResume.portfolioStructure.caseStudies.map((cs, i) => (
                                                    <div key={i} className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 space-y-6 hover:bg-white hover:shadow-2xl transition-all duration-500 relative group overflow-hidden">
                                                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                                                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-lg font-black text-xl mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">0{i+1}</div>
                                                        <div className="space-y-4 relative z-10">
                                                            <h4 className="text-2xl font-black text-slate-900 leading-tight">{cs.name}</h4>
                                                            <div className="space-y-2">
                                                                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Challenge</p>
                                                                <p className="text-sm text-slate-600 font-bold leading-relaxed">{cs.challenge}</p>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Strategic Outcome</p>
                                                                <p className="text-sm font-black text-slate-900 leading-relaxed italic">&quot;{cs.impact}&quot;</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>

                                        {/* Portfolio Branding Footer */}
                                        <div className="pt-20 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-10 opacity-70">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                                                    <Brain size={24} />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs font-black text-slate-900 uppercase tracking-widest">MATC Strategic Hub</p>
                                                    <p className="text-[10px] text-slate-500 font-bold tracking-tight">Career Architecture & Diagnosis</p>
                                                </div>
                                            </div>
                                            <div className="text-center md:text-right space-y-1 max-w-xs">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{t.brandingSub}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'ats' && (
                            <motion.div
                                key="ats"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex justify-center mb-4">
                                    <button 
                                        onClick={() => handleDownloadPDF(atsResumeRef, `Resume_ATS_${finalResume.personalInfo.fullName.replace(/\s+/g, '_')}`)}
                                        disabled={downloadingTab !== null}
                                        className="px-10 py-5 bg-slate-900 hover:bg-black text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center gap-3 transition-all shadow-xl shadow-slate-200 hover:scale-105 disabled:opacity-50"
                                    >
                                        {downloadingTab === `Resume_ATS_${finalResume.personalInfo.fullName.replace(/\s+/g, '_')}` ? <Loader2 className="animate-spin" size={20} /> : <FileText size={20} />}
                                        {t.download} {t.resumeTab} (PDF)
                                    </button>
                                </div>

                                <div ref={atsResumeRef} className="bg-white p-20 shadow-xl max-w-4xl mx-auto space-y-12 font-serif text-slate-950 print:shadow-none border border-slate-100">
                                    <div className="text-center space-y-2 border-b-2 border-slate-950 pb-8">
                                        <h1 className="text-4xl font-black uppercase tracking-widest">{finalResume.personalInfo.fullName}</h1>
                                        <p className="text-lg font-bold tracking-widest text-slate-600 mb-4">{finalResume.personalInfo.title}</p>
                                        
                                        {/* ATS Contact Header */}
                                        <div className="flex flex-wrap justify-center gap-y-2 gap-x-6 text-[10px] font-black uppercase tracking-widest text-slate-800">
                                            {finalResume.personalInfo.contactInfo?.email && <div className="flex items-center gap-1"><Mail size={10} /> {finalResume.personalInfo.contactInfo.email}</div>}
                                            {finalResume.personalInfo.contactInfo?.phone && <div className="flex items-center gap-1"><Phone size={10} /> {finalResume.personalInfo.contactInfo.phone}</div>}
                                            {finalResume.personalInfo.contactInfo?.linkedin && <div className="flex items-center gap-1"><Linkedin size={10} /> {finalResume.personalInfo.contactInfo.linkedin}</div>}
                                            {finalResume.personalInfo.contactInfo?.location && <div className="flex items-center gap-1"><MapPin size={10} /> {finalResume.personalInfo.contactInfo.location}</div>}
                                        </div>

                                        <div className="flex justify-center gap-6 text-[8px] font-bold text-slate-400 mt-6 pt-4 border-t border-slate-100">
                                            <span>PRO EVALUATED</span>
                                            <span>•</span>
                                            <span>STRATEGIC ALIGNMENT</span>
                                            <span>•</span>
                                            <span>{new Date().getFullYear()} ARCHITECTURE</span>
                                        </div>
                                    </div>

                                    <section className="space-y-4">
                                        <h3 className="text-sm font-black uppercase tracking-widest border-b border-slate-200 pb-2">Professional Summary</h3>
                                        <p className="text-sm leading-relaxed text-justify font-medium">{finalResume.personalInfo.summary}</p>
                                    </section>

                                    <section className="space-y-8">
                                        <h3 className="text-sm font-black uppercase tracking-widest border-b border-slate-200 pb-2">Experience & Core Achievements</h3>
                                        <div className="space-y-10">
                                            {finalResume.experience.map((exp, i) => (
                                                <div key={i} className="space-y-3">
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="text-base font-black italic">{exp.role}</h4>
                                                        <span className="text-xs font-bold text-slate-500 uppercase">{exp.duration}</span>
                                                    </div>
                                                    <p className="text-sm font-bold text-indigo-700">{exp.company}</p>
                                                    <ul className={cn("space-y-2", isRtl ? "pr-4" : "pl-4")}>
                                                        {exp.achievements.map((ach, j) => (
                                                            <li key={j} className="text-xs leading-relaxed font-medium list-disc ml-4">{ach}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <section className="grid grid-cols-2 gap-10 pt-4">
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-black uppercase tracking-widest border-b border-slate-200 pb-2">Technical Core</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {finalResume.skills.technical.map((s, i) => (
                                                    <span key={i} className="text-[10px] font-black px-2 py-1 bg-slate-50 rounded border border-slate-100">{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-black uppercase tracking-widest border-b border-slate-200 pb-2">Leadership Assets</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {finalResume.skills.leadership.map((s, i) => (
                                                    <span key={i} className="text-[10px] font-black px-2 py-1 bg-slate-50 rounded border border-slate-100">{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'letter' && (
                            <motion.div
                                key="letter"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex justify-center mb-4">
                                    <button 
                                        onClick={() => handleDownloadPDF(coverLetterRef, `Motivation_Letter_${finalResume.personalInfo.fullName.replace(/\s+/g, '_')}`)}
                                        disabled={downloadingTab !== null}
                                        className="px-10 py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center gap-3 transition-all shadow-xl shadow-emerald-100 hover:scale-105 disabled:opacity-50"
                                    >
                                        {downloadingTab === `Motivation_Letter_${finalResume.personalInfo.fullName.replace(/\s+/g, '_')}` ? <Loader2 className="animate-spin" size={20} /> : <FileText size={20} />}
                                        {t.download} {t.letterTab} (PDF)
                                    </button>
                                </div>

                                <div ref={coverLetterRef} className="bg-white p-24 shadow-xl max-w-4xl mx-auto min-h-[1000px] flex flex-col print:shadow-none border border-slate-100">
                                    <div className="space-y-1 mb-20">
                                        <h2 className="text-2xl font-black text-slate-900 border-l-4 border-emerald-500 pl-6 uppercase tracking-tighter">{finalResume.personalInfo.fullName}</h2>
                                        <p className="text-sm font-bold text-slate-400 pl-6">{finalResume.personalInfo.title}</p>
                                    </div>
                                    
                                    <div className="space-y-8 flex-1">
                                        <div className="space-y-2">
                                            <p className="text-sm font-bold text-slate-900">Subject: Application for Strategic Engagement & Role Alignment</p>
                                            <p className="text-xs text-slate-400 font-bold">{new Date().toLocaleDateString()}</p>
                                        </div>

                                        <div className="text-base text-slate-700 font-medium leading-[2] whitespace-pre-wrap text-justify">
                                            {finalResume.coverLetter}
                                        </div>
                                    </div>

                                    <div className="pt-20 border-t border-slate-100 space-y-4">
                                        <p className="text-sm font-black text-slate-900 italic">Respectfully,</p>
                                        <div className="w-48 h-1 bg-slate-200 rounded-full" />
                                        <p className="text-lg font-black text-slate-900">{finalResume.personalInfo.fullName}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        );
    }

    return null;
}
