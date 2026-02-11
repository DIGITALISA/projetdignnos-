"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Zap, 
    Target, 
    CheckCircle2, 
    Sparkles, 
    Send, 
    Briefcase, 
    TrendingUp,
    ChevronRight,
    Search,
    Download,
    Printer,
    ArrowLeft,
    X,
    ShieldCheck
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";

interface Question {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

interface AlignmentReport {
    verdict: string;
    analysis: string;
    strengths: string[];
    gaps: string[];
    roadmap: string[];
}

interface AlignmentData {
    _id: string;
    userId: string;
    userName: string;
    type: string;
    jobDescription: string;
    questions: Question[];
    answers: number[];
    score: number;
    report: AlignmentReport;
    status: string;
    referenceId: string;
    createdAt: string;
}

export default function JobAlignmentPage() {
    const { t } = useLanguage();
    const [step, setStep] = useState<"input" | "loading" | "questions" | "result">("input");
    const [type, setType] = useState<"New Job" | "Promotion">("New Job");
    const [jobDescription, setJobDescription] = useState("");
    const [alignment, setAlignment] = useState<AlignmentData | null>(null);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [userAnswers, setUserAnswers] = useState<number[]>([]);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [error, setError] = useState<string | null>(null);

    const startAudit = async () => {
        if (!jobDescription.trim()) return;
        
        setStep("loading");
        setLoadingMessage(t.jobAlignment.analysis.loading);
        setError(null);

        try {
            const savedProfile = localStorage.getItem("userProfile");
            const profile = savedProfile ? JSON.parse(savedProfile) : {};
            const userId = profile.email || profile.fullName;
            const language = localStorage.getItem('career-upgrade-lang') || 'fr';

            const response = await fetch('/api/user/job-alignment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    userName: profile.fullName,
                    type,
                    jobDescription,
                    language
                })
            });

            const data = await response.json();
            if (data.success) {
                setAlignment(data.alignment);
                setStep("questions");
            } else {
                setError(data.error || "Failed to start audit");
                setStep("input");
            }
        } catch (err) {
            console.error(err);
            setError("Connection error. Please try again.");
            setStep("input");
        }
    };

    const handleAnswer = (optionIdx: number) => {
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestionIdx] = optionIdx;
        setUserAnswers(newAnswers);

        if (currentQuestionIdx < (alignment?.questions.length || 0) - 1) {
            setCurrentQuestionIdx(currentQuestionIdx + 1);
        }
    };

    const submitAudit = async () => {
        if (!alignment) return;
        
        setStep("loading");
        setLoadingMessage(t.jobAlignment.questions.submit);

        try {
            const language = localStorage.getItem('career-upgrade-lang') || 'fr';
            const response = await fetch('/api/user/job-alignment', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    alignmentId: alignment._id,
                    answers: userAnswers,
                    language
                })
            });

            const data = await response.json();
            if (data.success) {
                setAlignment(data.alignment);
                setStep("result");
            } else {
                setError(data.error || "Failed to calculate alignment");
                setStep("questions");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to generate final report.");
            setStep("questions");
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 pb-32">
            {/* Header */}
            <header className="space-y-2">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-widest">
                    <Target size={16} />
                    {t.jobAlignment.title}
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
                    Strategic <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">Role Audit</span>
                </h1>
                <p className="text-slate-500 text-lg max-w-2xl leading-relaxed italic">
                    {t.jobAlignment.subtitle}
                </p>
            </header>

            <AnimatePresence mode="wait">
                {step === "input" && (
                    <motion.div
                        key="input"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-3xl border border-slate-200 p-6 md:p-10 shadow-xl overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-60" />
                        
                        <div className="relative z-10 space-y-8">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider block">
                                        1. {t.jobAlignment.form.type}
                                    </label>
                                    <div className="flex gap-4">
                                        {[
                                            { id: "New Job", label: t.jobAlignment.form.newJob, icon: Briefcase },
                                            { id: "Promotion", label: t.jobAlignment.form.promotion, icon: TrendingUp }
                                        ].map((opt) => (
                                            <button
                                                key={opt.id}
                                                onClick={() => setType(opt.id as "New Job" | "Promotion")}
                                                className={cn(
                                                    "flex-1 flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all group",
                                                    type === opt.id 
                                                        ? "border-blue-600 bg-blue-50/50 text-blue-700" 
                                                        : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
                                                )}
                                            >
                                                <opt.icon className={cn("w-6 h-6", type === opt.id ? "text-blue-600" : "text-slate-400 group-hover:text-blue-400")} />
                                                <span className="font-bold text-sm tracking-tight">{opt.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="hidden md:flex flex-col justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-2 text-indigo-600 font-bold mb-2">
                                        <Sparkles size={18} />
                                        <span className="text-xs uppercase tracking-widest">AI Intelligence</span>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed italic">
                                        Our AI will simulate a high-stakes board interview based on this specific text. Be as detailed as possible to get a more accurate alignment score.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider block">
                                    2. {t.jobAlignment.form.descriptionLabel}
                                </label>
                                <div className="relative group">
                                    <textarea
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        placeholder={t.jobAlignment.form.placeholder}
                                        className="w-full h-64 p-6 rounded-2xl border-2 border-slate-100 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-slate-800 leading-relaxed custom-scrollbar bg-slate-50 group-hover:bg-white"
                                    />
                                    <div className="absolute bottom-4 right-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest pointer-events-none">
                                        Direct Copy/Paste Supported
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <p className="text-red-500 font-bold text-sm flex items-center gap-2 bg-red-50 p-4 rounded-xl border border-red-100">
                                    <X size={16} /> {error}
                                </p>
                            )}

                            <div className="pt-4">
                                <button
                                    onClick={startAudit}
                                    disabled={!jobDescription.trim()}
                                    className="w-full md:w-auto px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-2xl shadow-blue-900/40 hover:bg-slate-800 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3 group"
                                >
                                    {t.jobAlignment.form.submit}
                                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === "loading" && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-24 space-y-8"
                    >
                        <div className="relative">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                className="w-32 h-32 rounded-full border-2 border-dashed border-blue-600/30 p-2"
                            >
                                <div className="w-full h-full rounded-full border-2 border-blue-600" />
                            </motion.div>
                            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-blue-600 animate-pulse" />
                        </div>
                        <div className="text-center space-y-3">
                            <h3 className="text-2xl font-bold text-slate-800 animate-pulse">{loadingMessage}</h3>
                            <p className="text-slate-500 italic">{t.jobAlignment.analysis.subtitle}</p>
                        </div>
                    </motion.div>
                )}

                {step === "questions" && alignment && (
                    <motion.div
                        key="questions"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="max-w-3xl mx-auto space-y-8"
                    >
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold text-slate-900">{t.jobAlignment.questions.title}</h2>
                                <p className="text-slate-500 font-medium">{t.jobAlignment.questions.subtitle}</p>
                            </div>
                            <div className="bg-slate-100 px-4 py-2 rounded-full font-bold text-slate-600 border border-slate-200">
                                {currentQuestionIdx + 1} / {alignment.questions.length}
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                                className="h-full bg-blue-600"
                                initial={{ width: 0 }}
                                animate={{ width: `${((currentQuestionIdx + 1) / alignment.questions.length) * 100}%` }}
                            />
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentQuestionIdx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-white rounded-3xl border border-slate-200 p-8 shadow-lg space-y-8"
                            >
                                <h3 className="text-xl font-bold text-slate-800 leading-relaxed italic">
                                    &ldquo;{alignment.questions[currentQuestionIdx].question}&rdquo;
                                </h3>

                                <div className="grid gap-3">
                                    {alignment.questions[currentQuestionIdx].options.map((opt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleAnswer(i)}
                                            className={cn(
                                                "w-full text-left p-5 rounded-2xl border-2 transition-all font-semibold",
                                                userAnswers[currentQuestionIdx] === i
                                                    ? "border-blue-600 bg-blue-50 text-blue-700"
                                                    : "border-slate-50 bg-slate-50/50 text-slate-600 hover:border-slate-200 hover:bg-white"
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black",
                                                    userAnswers[currentQuestionIdx] === i ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"
                                                )}>
                                                    {String.fromCharCode(65 + i)}
                                                </div>
                                                {opt}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        <div className="flex justify-between items-center bg-slate-900 p-4 px-6 rounded-2xl">
                            <p className="text-slate-400 text-sm font-medium">Be thoughtful. These questions verify high-stakes decision alignment.</p>
                            {userAnswers.length === alignment.questions.length && (
                                <button
                                    onClick={submitAudit}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-sm hover:bg-blue-700 transition-all flex items-center gap-2 active:scale-95"
                                >
                                    {t.jobAlignment.questions.submit}
                                    <Send size={16} />
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}

                {step === "result" && alignment && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <button 
                                onClick={() => setStep("input")}
                                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors"
                            >
                                <ArrowLeft size={18} />
                                New Audit
                            </button>
                            <div className="flex items-center gap-3">
                                <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                                    <Printer size={18} />
                                </button>
                                <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                                    <Download size={18} />
                                    {t.jobAlignment.result.download}
                                </button>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-12 gap-8">
                            {/* Certificate Side */}
                            <div className="lg:col-span-8">
                                <div className="bg-white rounded-4xl border-8 border-slate-50 p-4 sm:p-8 md:p-16 shadow-2xl relative overflow-hidden min-h-[600px] md:min-h-[800px]">
                                    {/* Security Watermark */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] rotate-[-25deg]">
                                        <Target size={600} />
                                    </div>

                                    <div className="relative z-10 space-y-16">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white mb-4">
                                                    <Sparkles size={24} />
                                                </div>
                                                <h4 className="font-black text-slate-900 transition-tight uppercase tracking-[0.2em] text-xs">CareerUpgrade AI Academy</h4>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Global Executive Verification Node</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Audit Reference</p>
                                                <p className="font-mono text-sm text-slate-900 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">{alignment.referenceId}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-8 text-center">
                                            <div className="space-y-2">
                                                <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 text-[10px] font-black rounded-full uppercase tracking-widest border border-blue-200">
                                                    Strategic Alignment Certificate
                                                </span>
                                                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Executive Role Report</h2>
                                            </div>
                                            
                                            <div className="max-w-xl mx-auto space-y-4">
                                                <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">Subject Endorsement</p>
                                                <p className="text-2xl font-black text-slate-900 border-b-2 border-slate-100 pb-2 italic capitalize">{alignment.userName}</p>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-12 gap-10 items-center">
                                            <div className="md:col-span-8 space-y-6">
                                                <div className="space-y-2">
                                                    <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs flex items-center gap-2">
                                                        <ShieldCheck className="text-blue-600" size={14} /> 
                                                        {t.jobAlignment.result.verdict}
                                                    </h3>
                                                    <p className="text-xl font-bold text-slate-700 leading-relaxed italic border-l-4 border-blue-600 pl-4 py-1">
                                                        &ldquo;{alignment.report.verdict}&rdquo;
                                                    </p>
                                                </div>

                                                <div className="space-y-2">
                                                    <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Detailed Role Analysis</h3>
                                                    <div className="text-slate-500 text-sm leading-relaxed space-y-4 font-medium italic">
                                                        {alignment.report.analysis.split('\n\n').map((p, i) => (
                                                            <p key={i}>{p}</p>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="md:col-span-4 flex flex-col items-center justify-center p-8 bg-linear-to-br from-slate-900 to-slate-800 rounded-3xl text-white shadow-xl">
                                                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">{t.jobAlignment.result.scoreLabel}</p>
                                                <div className="relative mb-6">
                                                    <div className="text-6xl font-black tracking-tighter">{alignment.score}%</div>
                                                    <div className="h-2 w-full bg-white/10 rounded-full mt-2 overflow-hidden">
                                                        <div className="h-full bg-blue-500" style={{ width: `${alignment.score}%` }} />
                                                    </div>
                                                </div>
                                                <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-[0.2em]">Verified by AI Logic v4.0</p>
                                            </div>
                                        </div>

                                        <div className="pt-12 border-t border-slate-100 flex justify-between items-end">
                                            <div className="space-y-1">
                                                <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center mb-2">
                                                    <Target size={24} className="text-slate-200" />
                                                </div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Issuance Node: EMEA Central</p>
                                                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{new Date().toLocaleDateString()}</p>
                                            </div>
                                            <div className="space-y-2 text-right">
                                                <div className="h-12 w-32 border-b-2 border-slate-900 ml-auto opacity-10" />
                                                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Executive Rector Signature</p>
                                                <p className="text-[9px] text-blue-600 font-black uppercase tracking-widest">Digitally Encrypted & Verified</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Advisory Sidebar */}
                            <div className="lg:col-span-4 space-y-6">
                                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                            <Zap size={20} />
                                        </div>
                                        <h3 className="font-bold text-slate-900 uppercase tracking-wider text-sm">{t.jobAlignment.result.strength}</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {alignment.report.strengths.map((str, i) => (
                                            <div key={i} className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                                                <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                                                <span className="text-xs font-bold text-slate-600 leading-tight tracking-tight italic">{str}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                            <Search size={20} />
                                        </div>
                                        <h3 className="font-bold text-slate-900 uppercase tracking-wider text-sm">{t.jobAlignment.result.gap}</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {alignment.report.gaps.map((gap, i) => (
                                            <div key={i} className="flex gap-3 p-3 bg-amber-50/30 rounded-xl border border-amber-100/50">
                                                <div className="w-4 h-4 rounded bg-amber-200 flex items-center justify-center text-[10px] font-black shrink-0">!</div>
                                                <span className="text-xs font-bold text-amber-700 leading-tight tracking-tight italic">{gap}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-slate-900 rounded-3xl p-8 space-y-6 shadow-xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full blur-[60px] opacity-20" />
                                    <div className="relative z-10 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center">
                                            <TrendingUp size={20} />
                                        </div>
                                        <h3 className="font-bold text-white uppercase tracking-wider text-sm">{t.jobAlignment.result.recommendation}</h3>
                                    </div>
                                    <div className="relative z-10 space-y-4">
                                        {alignment.report.roadmap.map((task, i) => (
                                            <div key={i} className="flex gap-4">
                                                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow-lg shadow-blue-600/40">
                                                    {i + 1}
                                                </div>
                                                <p className="text-xs font-bold text-slate-300 leading-relaxed italic border-b border-slate-800 pb-2 flex-1 tracking-tight">{task}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
