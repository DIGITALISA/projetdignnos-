"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Target, 
    CheckCircle2, 
    Sparkles, 
    Send, 
    Briefcase, 
    ChevronRight,
    Search,
    Download,
    ArrowLeft,
    X,
    Globe,
    Building2,
    FileText,
    MessageSquare,
    Loader2,
    Check,
    ShieldCheck
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";
import { TrialGate } from "@/components/ui/TrialGate";
import ReactMarkdown from "react-markdown";

type Stage = "form" | "research" | "mcq" | "interview" | "cv-prep" | "final-audit" | "completed";

interface ResearchReport {
    summary: string;
    insights: string[];
    culture: string;
    competitors: string[];
}

interface McqQuestion {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    category: "Technical" | "Psychological";
}

interface InterviewMessage {
    role: "assistant" | "user";
    content: string;
    timestamp?: string;
}

interface InterviewAnalysis {
    strengths: string[];
    weaknesses: string[];
    advice: string;
    score: number;
}

interface AlignmentData {
    _id: string;
    companyName: string;
    referenceId: string;
    researchReport: ResearchReport;
    mcqQuestions: McqQuestion[];
    interviewChat: InterviewMessage[];
    interviewAnalysis: InterviewAnalysis;
    generatedCV: string;
    generatedCoverLetter: string;
    finalAudit?: {
        verdict: string;
        suitabilityScore: number;
        evidence: string[];
        detailedAnalysis: string;
    };
    mcqScore: number;
    currentStage: Stage;
}

export default function JobAlignmentPage() {
    const { dir, language } = useLanguage();
    const [stage, setStage] = useState<Stage>("form");
    const [loading, setLoading] = useState(false);
    const [alignmentId, setAlignmentId] = useState<string | null>(null);
    const [alignment, setAlignment] = useState<AlignmentData | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Form Stats
    const [formData, setFormData] = useState({
        jobTitle: "",
        jobDescription: "",
        companyName: "",
        companySector: "",
        companyAddress: "",
        companyWebsite: "",
        additionalCompanyInfo: "",
        type: "New Job"
    });

    // MCQ State
    const [currentMcqIdx, setCurrentMcqIdx] = useState(0);
    const [mcqAnswers, setMcqAnswers] = useState<number[]>([]);

    // Interview State
    const [interviewInput, setInterviewInput] = useState("");
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [alignment?.interviewChat]);

    const startPrep = async () => {
        setLoading(true);
        setError(null);
        try {
            const savedProfile = localStorage.getItem("userProfile");
            const profile = savedProfile ? JSON.parse(savedProfile) : {};
            const userId = profile.email || profile.fullName;

            const response = await fetch('/api/user/job-alignment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    userName: profile.fullName,
                    ...formData,
                    language
                })
            });

            const data = await response.json();
            if (data.success) {
                setAlignment(data.alignment);
                setAlignmentId(data.alignment._id);
                setStage("research");
            } else {
                setError(data.error);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to initialize session.");
        } finally {
            setLoading(false);
        }
    };

    const submitMCQ = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/user/job-alignment', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    alignmentId,
                    action: 'submit_mcq',
                    data: { answers: mcqAnswers },
                    language
                })
            });
            const data = await response.json();
            if (data.success) {
                setAlignment(data.alignment);
                setStage("interview");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to submit MCQs.");
        } finally {
            setLoading(false);
        }
    };

    const sendInterviewAnswer = async () => {
        if (!interviewInput.trim() || loading) return;
        setLoading(true);
        const userMsg = interviewInput;
        setInterviewInput("");

        try {
            const response = await fetch('/api/user/job-alignment', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    alignmentId,
                    action: 'interview_answer',
                    data: { answer: userMsg },
                    language
                })
            });
            const data = await response.json();
            if (data.success) {
                setAlignment(data.alignment);
                if (data.alignment.currentStage === 'cv-prep') {
                    setStage("cv-prep");
                }
            }
        } catch (err) {
            console.error(err);
            setError("Failed to send response.");
        } finally {
            setLoading(false);
        }
    };

    const finalizeDocs = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/user/job-alignment', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    alignmentId,
                    action: 'generate_documents',
                    language
                })
            });
            const data = await response.json();
            if (data.success) {
                setAlignment(data.alignment);
                setStage("final-audit"); // Automatically move to final audit start or ask user
            }
        } catch (err) {
            console.error(err);
            setError("Failed to generate documents.");
        } finally {
            setLoading(false);
        }
    };

    const runFinalAudit = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/user/job-alignment', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    alignmentId,
                    action: 'generate_final_audit',
                    language
                })
            });
            const data = await response.json();
            if (data.success) {
                setAlignment(data.alignment);
                setStage("completed");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to generate final report.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <TrialGate 
            module="job-alignment" 
            dir={dir}
            language={language}
        >
            <div className={`p-4 md:p-8 max-w-6xl mx-auto space-y-8 pb-32 ${dir === 'rtl' ? 'font-arabic text-right' : ''}`} dir={dir}>
                {/* Header Section */}
                <header className="space-y-4">
                    <div className="flex items-center gap-2 text-blue-600 font-black text-sm uppercase tracking-[0.2em]">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                            <Target size={20} />
                        </div>
                        {language === 'ar' ? 'رحلة التوافق الوظيفي الذكية' : 'Smart Job Alignment Journey'}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
                        Strategic <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">Interview Mastery</span>
                    </h1>
                    <p className="text-slate-500 text-lg max-w-3xl leading-relaxed italic">
                        {language === 'ar' 
                          ? 'استعد بأقوى أداة ذكاء اصطناعي: تحليل الشركة، اختبارات تخصصية، مقابلة تجريبية، وإنتاج ملفات ترشح فتاكة.' 
                          : 'Prepare with the ultimate AI tool: Company research, technical tests, mock interviews, and personalized high-impact application documents.'}
                    </p>
                </header>

                {error && (
                    <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex items-center justify-between text-red-600 font-bold">
                        <div className="flex items-center gap-3">
                            <X className="shrink-0" />
                            {error}
                        </div>
                        <button onClick={() => setError(null)} className="p-2 hover:bg-red-100 rounded-lg transition-all">
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Main Content Area */}
                <AnimatePresence mode="wait">
                    {/* STAGE: FORM INPUT */}
                    {stage === "form" && (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-[2.5rem] border border-slate-200 p-6 md:p-12 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-70" />
                            
                            <div className="relative z-10 grid md:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                                            <Briefcase className="text-blue-600" />
                                            {language === 'ar' ? 'بيانات الوظيفة' : 'Job Details'}
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">{language === 'ar' ? 'عنوان الوظيفة' : 'Job Title'}</label>
                                                <input 
                                                    type="text" 
                                                    className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white outline-none transition-all font-bold"
                                                    placeholder="E.g. Senior Project Manager"
                                                    value={formData.jobTitle}
                                                    onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">{language === 'ar' ? 'الوصف الوظيفي' : 'Job Description'}</label>
                                                <textarea 
                                                    className="w-full h-48 px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white outline-none transition-all font-bold resize-none"
                                                    placeholder="Paste the job offer here..."
                                                    value={formData.jobDescription}
                                                    onChange={(e) => setFormData({...formData, jobDescription: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        {[
                                            { id: "New Job", label: language === 'ar' ? 'وظيفة جديدة' : 'New Job' },
                                            { id: "Promotion", label: language === 'ar' ? 'ترقية داخلية' : 'Promotion' }
                                        ].map((opt) => (
                                            <button
                                                key={opt.id}
                                                onClick={() => setFormData({...formData, type: opt.id})}
                                                className={cn(
                                                    "flex-1 py-4 rounded-xl font-black text-sm transition-all border-2",
                                                    formData.type === opt.id ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-slate-100 hover:border-slate-300"
                                                )}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                                            <Building2 className="text-blue-600" />
                                            {language === 'ar' ? 'بيانات الشركة' : 'Company Details'}
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-2">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">{language === 'ar' ? 'اسم الشركة' : 'Company Name'}</label>
                                                <input 
                                                    type="text" 
                                                    className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white outline-none transition-all font-bold"
                                                    value={formData.companyName}
                                                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">{language === 'ar' ? 'القطاع' : 'Sector'}</label>
                                                <input 
                                                    type="text" 
                                                    className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white outline-none transition-all font-bold"
                                                    value={formData.companySector}
                                                    onChange={(e) => setFormData({...formData, companySector: e.target.value})}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">{language === 'ar' ? 'رابط الموقع' : 'Website'}</label>
                                                <input 
                                                    type="url" 
                                                    className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white outline-none transition-all font-bold"
                                                    value={formData.companyWebsite}
                                                    onChange={(e) => setFormData({...formData, companyWebsite: e.target.value})}
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">{language === 'ar' ? 'معلومات إضافية' : 'Extra Info'}</label>
                                                <textarea 
                                                    className="w-full h-24 px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white outline-none transition-all font-bold resize-none"
                                                    placeholder="Anything you know about the company..."
                                                    value={formData.additionalCompanyInfo}
                                                    onChange={(e) => setFormData({...formData, additionalCompanyInfo: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={startPrep}
                                        disabled={loading || !formData.jobTitle || !formData.jobDescription || !formData.companyName}
                                        className="w-full py-6 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-500/30 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                                        {language === 'ar' ? 'بدء تحليل المسار والبحث' : 'Start Research & Analysis'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STAGE: RESEARCH REPORT */}
                    {stage === "research" && alignment && (
                        <motion.div
                            key="research"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-slate-900 rounded-[2.5rem] p-8 md:p-16 text-white shadow-2xl space-y-12 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500" />
                            
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-black uppercase tracking-widest border border-blue-500/20">
                                        <Search size={14} /> {language === 'ar' ? 'تقرير الذكاء الاصطناعي الاستراتيجي' : 'Strategic AI Research Report'}
                                    </div>
                                    <h2 className="text-4xl font-black">{alignment.companyName} <span className="text-slate-500">Insights</span></h2>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden md:block">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Alignment Ref</p>
                                        <p className="font-mono text-blue-400">{alignment.referenceId}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="md:col-span-2 space-y-8">
                                    <section className="bg-white/5 rounded-3xl p-8 border border-white/10 space-y-4">
                                        <h4 className="text-xs font-black text-blue-400 uppercase tracking-[0.2em]">{language === 'ar' ? 'الملخص التنفيذي' : 'Executive Summary'}</h4>
                                        <p className="text-lg text-slate-200 leading-relaxed font-medium italic">
                                            {alignment.researchReport?.summary}
                                        </p>
                                    </section>

                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h4 className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em]">{language === 'ar' ? 'الرؤية العميقة' : 'Key Strategic Insights'}</h4>
                                            <div className="space-y-3">
                                                {alignment.researchReport?.insights?.map((insight, i) => (
                                                    <div key={i} className="flex gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                                                        <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                                                        <span className="text-sm font-bold text-slate-300 leading-tight">{insight}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="text-xs font-black text-purple-400 uppercase tracking-[0.2em]">{language === 'ar' ? 'المنافسين في السوق' : 'Market Competitors'}</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {alignment.researchReport?.competitors?.map((comp, i) => (
                                                    <span key={i} className="px-4 py-2 bg-slate-800 rounded-xl text-xs font-black text-slate-400 border border-white/5 uppercase">
                                                        {comp}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
                                        <Globe className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10 rotate-12 group-hover:scale-110 transition-transform" />
                                        <h4 className="text-xs font-black text-white/60 uppercase tracking-widest mb-4">{language === 'ar' ? 'تحليل الثقافة' : 'Culture Analysis'}</h4>
                                        <p className="text-sm font-bold leading-relaxed">
                                            {alignment.researchReport?.culture}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => setStage("mcq")}
                                        className="w-full py-6 bg-white text-slate-900 rounded-2xl font-black text-lg transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        {language === 'ar' ? 'الانتقال للاختبار التقني' : 'Proceed to Technical Audit'}
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STAGE: MCQ ASSESSMENT */}
                    {stage === "mcq" && alignment && (
                        <motion.div
                            key="mcq"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="max-w-3xl mx-auto space-y-8"
                        >
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black text-slate-900">{language === 'ar' ? 'التقييم التخصصي' : 'Specialized Assessment'}</h2>
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                                        {alignment.mcqQuestions[currentMcqIdx].category} Stage
                                    </p>
                                </div>
                                <div className="bg-slate-900 text-white px-5 py-2 rounded-full font-black text-sm">
                                    {currentMcqIdx + 1} / {alignment.mcqQuestions.length}
                                </div>
                            </div>

                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-blue-600"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((currentMcqIdx + 1) / alignment.mcqQuestions.length) * 100}%` }}
                                />
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentMcqIdx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-white rounded-3xl border border-slate-200 p-8 shadow-2xl space-y-8"
                                >
                                    <h3 className="text-2xl font-black text-slate-800 leading-tight italic">
                                        &ldquo;{alignment.mcqQuestions[currentMcqIdx].question}&rdquo;
                                    </h3>

                                    <div className="grid gap-4">
                                        {alignment.mcqQuestions[currentMcqIdx].options.map((opt, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    const newAnswers = [...mcqAnswers];
                                                    newAnswers[currentMcqIdx] = i;
                                                    setMcqAnswers(newAnswers);
                                                    if (currentMcqIdx < alignment.mcqQuestions.length - 1) {
                                                        setCurrentMcqIdx(currentMcqIdx + 1);
                                                    }
                                                }}
                                                className={cn(
                                                    "w-full text-left p-6 rounded-2xl border-2 transition-all font-bold text-lg",
                                                    mcqAnswers[currentMcqIdx] === i
                                                        ? "border-blue-600 bg-blue-50 text-blue-700"
                                                        : "border-slate-50 bg-slate-50/50 text-slate-600 hover:border-slate-200 hover:bg-white"
                                                )}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black",
                                                        mcqAnswers[currentMcqIdx] === i ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"
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

                            <div className="flex justify-between items-center bg-slate-100/50 p-6 rounded-3xl border border-slate-200">
                                <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em]">{language === 'ar' ? 'فكر جيدا قبل الاختيار' : 'Focus and Strategy are Key'}</p>
                                {mcqAnswers.length === alignment.mcqQuestions.length && (
                                    <button
                                        onClick={submitMCQ}
                                        disabled={loading}
                                        className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all flex items-center gap-3 active:scale-95"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                                        {language === 'ar' ? 'تسليم الاختبار وبدء المقابلة' : 'Submit & Start Interview'}
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* STAGE: MOCK INTERVIEW CHAT */}
                    {stage === "interview" && alignment && (
                        <motion.div
                            key="interview"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-4xl mx-auto h-[700px] flex flex-col bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden"
                        >
                            {/* Chat Header */}
                            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                                            <Send size={24} className="rotate-45" />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-slate-900 rounded-full" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-sm uppercase tracking-widest">{language === 'ar' ? 'خبير موارد بشرية افتراضي' : 'AI HR Recruiter'}</h4>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">{alignment.companyName} Recruitment Office</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Interview Progress</p>
                                    <p className="font-mono text-blue-400">{alignment.interviewChat.filter((m) => m.role === 'user').length} / 20</p>
                                </div>
                            </div>

                            {/* Chat Window */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50 custom-scrollbar">
                                {alignment.interviewChat.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            "flex w-full mb-4",
                                            msg.role === 'assistant' ? "justify-start" : "justify-end"
                                        )}
                                    >
                                        <div className={cn(
                                            "max-w-[80%] p-6 rounded-4xl text-sm md:text-base font-bold shadow-sm",
                                            msg.role === 'assistant' 
                                              ? "bg-white text-slate-800 rounded-tl-none border border-slate-100" 
                                              : "bg-blue-600 text-white rounded-tr-none shadow-blue-500/20"
                                        )}>
                                            {msg.content}
                                        </div>
                                    </motion.div>
                                ))}
                                {loading && (
                                    <div className="flex justify-start">
                                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-2">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Chat Input */}
                            <div className="p-6 bg-white border-t border-slate-100">
                                <div className="relative group">
                                    <input 
                                        type="text"
                                        className="w-full pl-6 pr-20 py-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold"
                                        placeholder={language === 'ar' ? 'اكتب إجابتك هنا...' : 'Type your answer here...'}
                                        value={interviewInput}
                                        onChange={(e) => setInterviewInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && sendInterviewAnswer()}
                                    />
                                    <button 
                                        onClick={sendInterviewAnswer}
                                        disabled={loading || !interviewInput.trim()}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-5 py-3 rounded-xl font-black text-sm hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-500/20"
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STAGE: CV PREP & FINAL FEEDBACK */}
                    {stage === "cv-prep" && alignment && (
                        <motion.div
                            key="cv-prep"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-2xl space-y-0"
                        >
                            <div className="p-12 bg-slate-900 text-white space-y-12">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-2">
                                        <h2 className="text-4xl font-black">{language === 'ar' ? 'نتائج التدقيق النهائي' : 'Final Audit Results'}</h2>
                                        <p className="text-blue-400 font-bold uppercase tracking-widest text-xs">{language === 'ar' ? 'تم تحليل الأداء بالكامل' : 'Performance Analysis Complete'}</p>
                                    </div>
                                    <div className="text-center p-8 bg-white/5 rounded-3xl border border-white/10">
                                        <p className="text-[10px] text-slate-500 font-black uppercase mb-1">{language === 'ar' ? 'نقاط المقابلة' : 'Interview Score'}</p>
                                        <p className="text-5xl font-black tabular-nums">{alignment.interviewAnalysis?.score}%</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8 text-left">
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-black text-green-400 uppercase tracking-widest">{language === 'ar' ? 'نقاط قوتك في المقابلة' : 'Interview Strengths'}</h4>
                                        <div className="space-y-3">
                                            {alignment.interviewAnalysis?.strengths?.map((str, i) => (
                                                <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500"><Check size={14} /></div>
                                                    <p className="text-sm font-bold text-slate-300 leading-tight">{str}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest">{language === 'ar' ? 'نقاط الضعف والمخاطر' : 'Weaknesses & Risks'}</h4>
                                        <div className="space-y-3">
                                            {alignment.interviewAnalysis?.weaknesses?.map((weak, i) => (
                                                <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                                    <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500"><X size={14} /></div>
                                                    <p className="text-sm font-bold text-slate-300 leading-tight">{weak}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-12 space-y-12 bg-slate-50">
                                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
                                    <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest">{language === 'ar' ? 'نصيحة الخبير التنفيذية' : 'Executive Expert Advice'}</h4>
                                    <p className="text-lg font-bold text-slate-700 leading-relaxed italic border-l-4 border-blue-600 pl-6">
                                        &ldquo;{alignment.interviewAnalysis?.advice}&rdquo;
                                    </p>
                                </div>

                                <div className="flex flex-col md:flex-row items-center gap-8 justify-between p-8 bg-blue-600 rounded-4xl text-white shadow-2xl shadow-blue-600/30">
                                    <div className="space-y-2 text-center md:text-left">
                                        <h3 className="text-2xl font-black">{language === 'ar' ? 'هندسة ملفات الترشح' : 'Document Engineering'}</h3>
                                        <p className="text-blue-100 font-medium">{language === 'ar' ? 'جاهز لإنتاج السيرة الذاتية وخطاب التغطية المثالي؟' : 'Ready to generate the perfect CV and Cover Letter for this specific role?'}</p>
                                    </div>
                                    <button
                                        onClick={finalizeDocs}
                                        disabled={loading}
                                        className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg transition-all hover:bg-slate-800 active:scale-95 flex items-center gap-3 shadow-2xl whitespace-nowrap"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : <FileText />}
                                        {language === 'ar' ? 'توليد الملفات الاحترافية' : 'Generate Pro Documents'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STAGE: FINAL AUDIT PREVIEW */}
                    {stage === "final-audit" && alignment && (
                        <motion.div
                            key="final-audit"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-4xl mx-auto text-center space-y-12 py-20"
                        >
                            <div className="relative inline-block">
                                <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse" />
                                <div className="w-24 h-24 bg-slate-900 text-white rounded-4xl flex items-center justify-center mx-auto relative z-10 shadow-2xl">
                                    <Sparkles size={48} className="text-blue-400" />
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                                    {language === 'ar' ? 'المرحلة الأخيرة: التدقيق الاستراتيجي النهائي' : 'Final Step: Strategic Executive Audit'}
                                </h2>
                                <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                                    {language === 'ar' 
                                      ? 'بعد إكمال المقابلة والاختبارات، سيقوم الذكاء الاصطناعي الآن بربط كل بياناتك بـ تشخيصك الأولي ليعطيك الحكم النهائي ودرجة الملاءمة بالدليل القاطع.' 
                                      : 'After completing the interview and tests, the AI will now synthesize all your data with your initial diagnosis to provide the final verdict and suitability score with concrete evidence.'}
                                </p>
                            </div>

                            <button
                                onClick={runFinalAudit}
                                disabled={loading}
                                className="px-16 py-6 bg-blue-600 text-white rounded-4xl font-black text-xl shadow-2xl shadow-blue-500/30 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-4 mx-auto disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck size={24} />}
                                {language === 'ar' ? 'بدء التحليل النهائي العميق' : 'Start Deep Final Analysis'}
                            </button>
                        </motion.div>
                    )}

                    {/* STAGE: COMPLETED (RESULTS) */}
                    {stage === "completed" && alignment && (
                        <motion.div
                            key="completed"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-12"
                        >
                            {/* Final Executive Audit Result */}
                            {alignment.finalAudit && (
                                <section className="bg-slate-900 rounded-[3rem] p-8 md:p-16 text-white shadow-2xl relative overflow-hidden border-8 border-slate-800">
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
                                    
                                    <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                                        <div className="space-y-8 flex-1">
                                            <div className="space-y-2">
                                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-[0.2em]">
                                                    <Target size={14} /> {language === 'ar' ? 'الحكم النهائي للخبراء' : 'Final Executive Verdict'}
                                                </div>
                                                <h2 className="text-4xl md:text-5xl font-black">{alignment.finalAudit.verdict}</h2>
                                            </div>

                                            <div className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                                                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">{language === 'ar' ? 'التحليل المعمق للملاءمة' : 'Deep Suitability Analysis'}</h4>
                                                <p className="text-lg font-medium text-slate-300 leading-relaxed italic">
                                                    &ldquo;{alignment.finalAudit.detailedAnalysis}&rdquo;
                                                </p>
                                            </div>

                                            <div className="space-y-4">
                                                <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest">{language === 'ar' ? 'الأدلة والحجج (Dalail)' : 'Strategic Evidence (Dalail)'}</h4>
                                                <div className="grid gap-3">
                                                    {alignment.finalAudit.evidence.map((ev, i) => (
                                                        <div key={i} className="flex gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 items-start">
                                                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                                                                <Check size={18} className="text-blue-400" />
                                                            </div>
                                                            <p className="text-sm font-bold text-slate-200 leading-snug">{ev}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="shrink-0 w-full md:w-80 space-y-6">
                                            <div className="aspect-square rounded-[3rem] bg-linear-to-br from-blue-600 to-indigo-700 p-1 flex flex-col items-center justify-center shadow-2xl relative group">
                                                <div className="absolute inset-4 rounded-[2.5rem] border-2 border-white/20 border-dashed border-spacing-4" />
                                                <div className="relative z-10 text-center">
                                                    <p className="text-[10px] text-white/60 font-black uppercase tracking-[0.3em] mb-2">{language === 'ar' ? 'نسبة القبول' : 'Probability'}</p>
                                                    <p className="text-8xl font-black tracking-tighter tabular-nums drop-shadow-2xl">
                                                        {alignment.finalAudit.suitabilityScore}<span className="text-3xl opacity-50">%</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-center">
                                                <p className="text-xs font-bold text-slate-500 mb-2">{language === 'ar' ? 'مستوى الثقة في التقرير' : 'Analysis Confidence'}</p>
                                                <div className="flex justify-center gap-1">
                                                    {[1,2,3,4,5].map(s => <div key={s} className="w-6 h-1 bg-green-500 rounded-full" />)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}

                            <div className="text-center space-y-4">
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/20">
                                    <CheckCircle2 size={40} />
                                </div>
                                <h2 className="text-4xl font-black text-slate-900 tracking-tight">{language === 'ar' ? 'ملفاتك جاهزة للاكتساح' : 'Your Application is Ready'}</h2>
                                <p className="text-slate-500 font-bold leading-relaxed max-w-2xl mx-auto">
                                    {language === 'ar' 
                                      ? 'لقد قمنا بتصميم سيرتك الذاتية وخطاب التغطية ليكونا متوافقين بنسبة 100% مع احتياجات الشركة وخوارزميات التوظيف.' 
                                      : 'We have engineered your CV and Cover Letter to be 100% aligned with the company needs and recruitment algorithms.'}
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                                            <FileText className="text-blue-600" />
                                            {language === 'ar' ? 'السيرة الذاتية المهنية' : 'Professional CV'}
                                        </h3>
                                        <button className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-600 shadow-sm">
                                            <Download size={18} />
                                        </button>
                                    </div>
                                    <div className="bg-white border-2 border-slate-100 rounded-4xl p-8 shadow-xl min-h-[600px] overflow-hidden">
                                        <div className="prose prose-slate max-w-none text-sm font-medium leading-relaxed">
                                            <ReactMarkdown>{alignment.generatedCV}</ReactMarkdown>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                                            <MessageSquare className="text-indigo-600" />
                                            {language === 'ar' ? 'خطاب التغطية الاستراتيجي' : 'Strategic Cover Letter'}
                                        </h3>
                                        <button className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-600 shadow-sm">
                                            <Download size={18} />
                                        </button>
                                    </div>
                                    <div className="bg-slate-900 text-slate-200 rounded-4xl p-8 shadow-2xl min-h-[600px] overflow-hidden border-8 border-slate-800">
                                        <div className="prose prose-invert max-w-none text-sm font-medium leading-relaxed">
                                            <ReactMarkdown>{alignment.generatedCoverLetter}</ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center pt-12">
                                <button 
                                    onClick={() => window.location.reload()}
                                    className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-2xl hover:bg-slate-800 active:scale-95 transition-all flex items-center gap-3"
                                >
                                    <ArrowLeft />
                                    {language === 'ar' ? 'بدء تحليل لوظيفة أخرى' : 'Start New Job Audit'}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </TrialGate>
    );
}
