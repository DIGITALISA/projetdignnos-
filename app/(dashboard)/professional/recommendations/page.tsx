"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldCheck,
    Download,
    Loader2,
    Sparkles,
    Award,
    CheckCircle2,
    ArrowRight,
    RefreshCw,
    AlertCircle,
    Zap
} from "lucide-react";
import Image from "next/image";
import { AssetLocked } from "@/components/layout/AssetLocked";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface RecommendationData {
    referenceId?: string;
    _id?: string;
    createdAt: string;
    subject: string;
    content: string;
    keyEndorsements?: string[];
}

interface ReadinessStatus {
    isReady: boolean;
    hasDiagnosis: boolean;
    hasSimulation: boolean;
    certReady: boolean;
    recReady: boolean;
}

export default function ProfessionalRecommendationPage() {
    const { language, dir } = useLanguage();
    const isRtl = dir === 'rtl';
    const [recommendation, setRecommendation] = useState<RecommendationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [readiness, setReadiness] = useState<ReadinessStatus>({ isReady: false, hasDiagnosis: false, hasSimulation: false, certReady: false, recReady: false });

    const t_local = {
        ar: {
            title: "رسالة التوصية",
            subtitle: "شهادة مهنية رسمية",
            desc: "يتم إنشاء هذه الرسالة بناءً على كامل مسارك ونتائج التشخيص والمحاكاة التنفيذية.",
            regenerate: "إعادة إنشاء",
            download: "تحميل PDF",
            pro_badge: "برو",
            generating: "الذكاء الاصطناعي يقوم الآن بتحليل مسارك لإنشاء توصية حصرية...",
            processing: "تحليل بيانات لوحة القيادة + تقييم الخبراء",
            prestige_title: "جاهز لتحويل خبراتك إلى فرص مستهدفة؟",
            prestige_desc: "سيقوم النظام بتحليل المعطيات المهنية الخاصة بك لإنتاج رسالة توصية استراتيجية.",
            generate_btn: "إنشاء رسالة التوصية الخاصة بي",
            points_prestige: "نقاط التميز",
            export_prestige: "تصدير التميز",
            export_desc: "احصل على النسخة الرسمية المعتمدة من توصيتك.",
            verified_id: "معرف التحقق:",
            issue_date: "تاريخ الإصدار",
            cabinet: "مكتب استشارات استراتيجية",
            executive_board: "مجلس إدارة MA Training Consulting التنفيذي",
            expertise_approved: "تمت المراجعة والاعتماد من قبل لجنة الخبراء"
        },
        en: {
            title: "Recommendation Letter",
            subtitle: "Official Professional Endorsement",
            desc: "This letter is synthesized based on your full career path, diagnosis results, and executive simulations.",
            regenerate: "Regenerate",
            download: "Download PDF",
            pro_badge: "PRO",
            generating: "AI is analyzing your professional trajectory to synthesize an exclusive endorsement...",
            processing: "Analyzing Dashboard Data + Expert Feedback",
            prestige_title: "Ready to turn your excellence into strategic opportunities?",
            prestige_desc: "The system will analyze your professional data to produce a strategic recommendation letter.",
            generate_btn: "Generate My Recommendation Letter",
            points_prestige: "Prestige Points",
            export_prestige: "Export Prestige",
            export_desc: "Acquire your officially endorsed recommendation document.",
            verified_id: "Verified ID:",
            issue_date: "Issue Date",
            cabinet: "Strategic Consulting Firm",
            executive_board: "MA Training Consulting Executive Board",
            expertise_approved: "Reviewed & Approved by Senior Consultants Committee"
        },
        fr: {
            title: "Lettre de Recommandation",
            subtitle: "Certification de Carrière Officielle",
            desc: "Cette lettre est générée à partir de l'analyse de votre parcours complet, diagnostics et simulations.",
            regenerate: "Régénérer",
            download: "Télécharger PDF",
            pro_badge: "PRO",
            generating: "L'IA analyse votre trajectoire pour synthétiser une recommandation exclusive...",
            processing: "Analyse des données du tableau de bord + Retours experts",
            prestige_title: "Prêt à transformer vos efforts en opportunités ?",
            prestige_desc: "Le système analysera vos données professionnelles pour produire une lettre de recommandation stratégique.",
            generate_btn: "Générer ma Recommandation",
            points_prestige: "Points de Prestige",
            export_prestige: "Exporter le Prestige",
            export_desc: "Prenez possession de votre recommandation officielle.",
            verified_id: "ID de Vérification :",
            issue_date: "Date d'émission",
            cabinet: "Cabinet de Conseil Stratégique",
            executive_board: "Conseil d'Administration de MA Training Consulting",
            expertise_approved: "Expertisée & Approuvée par notre Comité de Consultants"
        }
    }[language as 'ar' | 'en' | 'fr'] || {
        title: "Recommendation Letter",
        subtitle: "Official Endorsement",
        desc: "This letter is synthesized based on your full platform history.",
        regenerate: "Regenerate",
        download: "Download PDF",
        pro_badge: "PRO",
        generating: "AI is analyzing your career path...",
        processing: "Processing data...",
        prestige_title: "Ready for your professional recommendation?",
        prestige_desc: "Generate a strategic letter based on your performance.",
        generate_btn: "Generate Letter",
        points_prestige: "Prestige Points",
        export_prestige: "Export Prestige",
        export_desc: "Download your official document.",
        verified_id: "Verify ID:",
        issue_date: "Issue Date",
        cabinet: "Consulting",
        executive_board: "Executive Board",
        expertise_approved: "Approved"
    };

    const checkReadiness = useCallback(async (userId: string) => {
        try {
            const res = await fetch(`/api/user/readiness?userId=${encodeURIComponent(userId)}`);
            const data = await res.json();
            if (data.success) {
                setReadiness(data);
                return data.recReady;
            }
        } catch (err) {
            console.error("Readiness check error:", err);
        }
        return false;
    }, []);

    const fetchRecommendation = useCallback(async () => {
        setLoading(true);
        try {
            const savedProfile = localStorage.getItem('userProfile');
            const userProfile = JSON.parse(savedProfile || '{}');
            const userId = userProfile.email || userProfile.fullName;

            if (!userId) {
                setError("User profile not found.");
                setLoading(false);
                return;
            }

            const ready = await checkReadiness(userId);
            if (!ready) {
                setLoading(false);
                return;
            }

            const response = await fetch(`/api/user/recommendation?userId=${encodeURIComponent(userId)}`);
            const data = await response.json();

            if (data.success) {
                setRecommendation(data.recommendation);
            } else if (response.status !== 404) {
                setError(data.error || "Failed to fetch recommendation");
            }
        } catch (err) {
            console.error("Error:", err);
            setError("An error occurred while fetching your recommendation.");
        } finally {
            setLoading(false);
        }
    }, [checkReadiness]);

    const generateRecommendation = async () => {
        setGenerating(true);
        setError(null);
        try {
            const savedProfile = localStorage.getItem('userProfile');
            const userProfile = JSON.parse(savedProfile || '{}');
            const userId = userProfile.email || userProfile.fullName;
            const userName = userProfile.fullName;
            const lang = language || 'fr';

            const response = await fetch('/api/user/recommendation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, userName, language: lang })
            });

            const data = await response.json();

            if (data.success) {
                setRecommendation(data.recommendation);
            } else {
                setError(data.error || "Failed to generate recommendation letter");
            }
        } catch (err) {
            console.error("Error:", err);
            setError("Failed to generate recommendation letter.");
        } finally {
            setGenerating(false);
        }
    };

    useEffect(() => {
        fetchRecommendation();
    }, [fetchRecommendation]);

    const downloadRef = useRef<HTMLDivElement>(null);

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50/50">
                <div className="relative">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="w-24 h-24 rounded-full border-t-2 border-r-2 border-blue-600 opacity-20"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-blue-600 animate-pulse" />
                    </div>
                </div>
                <p className="mt-6 text-slate-500 font-medium tracking-widest uppercase text-xs animate-pulse">
                    {language === 'ar' ? 'جاري استيراد البيانات...' : 'Fetching your data...'}
                </p>
            </div>
        );
    }

    const isLocked = !readiness.recReady;

    if (isLocked) {
        return (
            <AssetLocked
                title={t_local.title}
                description={t_local.desc}
                readiness={readiness}
                isPremiumRequired={false}
            />
        );
    }

    return (
        <div className="flex-1 p-4 md:p-10 max-w-5xl mx-auto space-y-10 bg-slate-50/30 min-h-screen" dir={dir}>
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
                <div className="space-y-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-blue-600 font-black tracking-tighter uppercase text-xs"
                    >
                        <ShieldCheck className="w-4 h-4" />
                        {t_local.subtitle}
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                        {language === 'ar' ? (
                            <>رسالة <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-700 via-indigo-600 to-blue-600">التوصية</span></>
                        ) : language === 'fr' ? (
                            <>Lettre de <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-700 via-indigo-600 to-blue-600">Recommandation</span></>
                        ) : (
                            <>Recommendation <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-700 via-indigo-600 to-blue-600">Letter</span></>
                        )}
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl font-medium leading-relaxed">
                        {t_local.desc}
                    </p>
                </div>

                {!loading && recommendation && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-3"
                    >
                        <div
                            className="flex items-center gap-2 px-5 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-slate-400 font-bold cursor-not-allowed select-none shadow-sm"
                        >
                            <Download className="w-4 h-4" />
                            {t_local.download}
                            <span className="text-[9px] bg-amber-100 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">
                                {t_local.pro_badge}
                            </span>
                        </div>
                        <button
                            onClick={generateRecommendation}
                            disabled={generating}
                            className="group flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95 disabled:opacity-50"
                        >
                            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />}
                            {t_local.regenerate}
                        </button>
                    </motion.div>
                )}
            </header>

            <AnimatePresence mode="wait">
                {generating && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-12 text-center space-y-4 bg-blue-50/50 rounded-[3rem] border border-blue-100 border-dashed"
                    >
                        <div className="relative inline-block">
                            <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                            <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600 w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black text-blue-900">
                            {t_local.generating}
                        </h3>
                        <p className="text-blue-600 text-sm font-bold uppercase tracking-[0.2em] animate-pulse">
                            {t_local.processing}
                        </p>
                    </motion.div>
                )}

                {!recommendation && !generating ? (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative overflow-hidden bg-white rounded-4xl border border-slate-200 p-10 md:p-20 text-center shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-100/50 rounded-full blur-[100px]" />
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-100/50 rounded-full blur-[100px]" />

                        <div className="relative max-w-3xl mx-auto space-y-8">
                            <div className="w-28 h-28 bg-linear-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/30 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                                <Sparkles className="w-14 h-14 text-white" />
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                                    {t_local.prestige_title}
                                </h2>
                                <p className="text-slate-600 text-xl leading-relaxed font-medium">
                                    {t_local.prestige_desc}
                                </p>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-5 bg-red-50 border-2 border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-4 justify-center"
                                >
                                    <AlertCircle className="w-6 h-6 shrink-0" />
                                    {error}
                                </motion.div>
                            )}

                            <div className="pt-4">
                                <button
                                    onClick={generateRecommendation}
                                    className="group relative px-12 py-6 bg-slate-900 text-white rounded-3xl font-black text-2xl shadow-2xl shadow-slate-900/30 hover:shadow-slate-900/50 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span className="relative flex items-center gap-4">
                                        {t_local.generate_btn}
                                        <ArrowRight className={cn("w-8 h-8 group-hover:translate-x-2 transition-transform", isRtl && "rotate-180 group-hover:-translate-x-2")} />
                                    </span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ) : (recommendation && !generating && (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-10"
                    >
                        <div className="space-y-6">
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="relative bg-white rounded-4xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden p-[2px] bg-linear-to-b from-slate-200 to-white"
                            >
                                <div ref={downloadRef} className="bg-white rounded-[1.95rem] p-10 md:p-20 relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                                        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none">
                                        <Sparkles className="w-[500px] h-[500px]" />
                                    </div>

                                    <div className="relative space-y-16">
                                        <div className={cn("flex flex-col md:flex-row justify-between items-start gap-8 border-b border-slate-100 pb-12", isRtl && "md:flex-row-reverse")}>
                                            <div className="space-y-4">
                                                <div className={cn("flex items-center gap-5", isRtl && "flex-row-reverse")}>
                                                    <div className="w-20 h-20 md:w-24 md:h-24 relative bg-white rounded-2xl shadow-sm border border-slate-100 p-2 overflow-hidden shrink-0">
                                                        <Image 
                                                            src="/logo-matc.png" 
                                                            alt="MATC Logo" 
                                                            fill
                                                            className="object-contain p-2"
                                                        />
                                                    </div>
                                                    <div className={cn("space-y-1", isRtl && "text-right")}>
                                                        <h4 className="font-black text-2xl text-slate-900 tracking-tighter leading-none uppercase">MA-TRAINING-CONSULTING</h4>
                                                        <p className="text-xs font-bold text-blue-600 tracking-[0.25em] uppercase">{t_local.cabinet}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={cn("text-right", isRtl && "text-left")}>
                                                <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{t_local.issue_date}</div>
                                                <div className="text-slate-900 font-bold text-lg">
                                                    {new Date(recommendation.createdAt).toLocaleDateString(language === 'ar' ? 'ar-TN' : 'fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                                </div>
                                                <div className={cn("mt-4 flex flex-col items-end", isRtl && "items-start")}>
                                                    <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center p-2 mb-1 shadow-inner">
                                                        <div className="w-full h-full grid grid-cols-4 gap-[2px]">
                                                            {[...Array(16)].map((_, i) => (
                                                                <div key={i} className={cn("bg-slate-200", i % 3 === 0 ? 'bg-slate-900' : '')} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <span className="text-[9px] font-mono text-slate-400 font-bold tracking-widest uppercase">
                                                        {t_local.verified_id} {recommendation.referenceId || recommendation._id?.substring(0, 10).toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={cn("space-y-4", isRtl && "text-right")}>
                                            <div className={cn("h-1 w-12 bg-blue-600 rounded-full", isRtl && "ml-auto")} />
                                            <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight max-w-3xl leading-[1.1]">
                                                {recommendation.subject}
                                            </h3>
                                        </div>

                                        <div className={cn("prose prose-slate max-w-none text-slate-800 leading-[1.8] whitespace-pre-wrap font-serif text-xl md:text-2xl opacity-90", isRtl && "text-right first-letter:float-right first-letter:ml-3 first-letter:mr-0")}>
                                            {recommendation.content}
                                        </div>

                                        <div className={cn("pt-16 mt-20 border-t border-slate-100 flex flex-col md:flex-row justify-between items-end gap-10", isRtl && "md:flex-row-reverse")}>
                                            <div className={cn("flex items-center gap-5 translate-y-2", isRtl ? "text-right flex-row-reverse" : "text-left")}>
                                                <div className="w-16 h-16 bg-blue-50/50 rounded-2xl flex items-center justify-center border border-blue-100/50 shadow-inner">
                                                    <ShieldCheck className="w-8 h-8 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 text-lg uppercase tracking-tight">{t_local.executive_board}</p>
                                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{t_local.expertise_approved}</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-center gap-4 relative group min-w-[220px]">
                                                <div className="relative flex items-center justify-center py-6">
                                                    <div className="opacity-80 transform -rotate-12">
                                                        <div className="w-44 h-22 border-[3px] rounded-xl flex flex-col items-center justify-center bg-white shadow-sm" style={{ borderColor: '#3b82f6', color: '#3b82f6', fontFamily: 'serif' }}>
                                                            <p className="text-[11px] font-black uppercase tracking-tighter leading-none mb-0.5">Sté MA</p>
                                                            <p className="text-[8px] font-bold uppercase tracking-widest leading-none mb-1">Training Consulting</p>
                                                            <p className="text-[6px] font-bold leading-none mb-0.5">Tel: 44 172 264</p>
                                                            <p className="text-[6px] font-bold leading-none">MF: 1805031P/A/M/000</p>
                                                        </div>
                                                    </div>

                                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-95 pointer-events-none transform -rotate-3 z-20">
                                                        <svg width="240" height="100" viewBox="0 0 150 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: '#1e3a8a' }}>
                                                            <path d="M10 45C30 40 50 15 70 25C90 35 110 5 140 15M20 50C40 45 60 40 100 42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                            <path d="M40 30C45 25 55 20 60 35C65 50 50 55 45 45C40 35 55 25 70 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div className="text-center group-hover:scale-105 transition-transform duration-300">
                                                    <p className="font-serif italic text-slate-500 text-sm">Le Consultant en Stratégie de Carrière</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <motion.div
                                initial={{ x: 30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="bg-slate-950 rounded-4xl p-8 text-white shadow-2xl relative overflow-hidden group border border-white/5"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full -mr-32 -mt-32 blur-[100px]" />
                                <div className="relative space-y-8">
                                    <div className={cn("flex items-center gap-4", isRtl && "flex-row-reverse text-right")}>
                                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 shadow-lg">
                                            <Award className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <h3 className="text-xl font-black tracking-tight">{t_local.points_prestige}</h3>
                                    </div>

                                    <div className="space-y-4">
                                        {recommendation.keyEndorsements?.map((item: string, i: number) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: i * 0.15 + 0.5 }}
                                                className={cn("flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group/item", isRtl && "flex-row-reverse text-right")}
                                            >
                                                <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-blue-500/40 transition-colors">
                                                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                                                </div>
                                                <span className="text-slate-300 text-sm font-bold leading-relaxed">{item}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="bg-white rounded-4xl p-8 border border-slate-200 shadow-xl overflow-hidden relative group"
                            >
                                <div className="absolute inset-0 bg-linear-to-br from-blue-600 to-indigo-700 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out" />
                                <div className={cn("relative group-hover:text-white transition-colors duration-500", isRtl && "text-right")}>
                                    <h4 className="font-black text-2xl mb-3 tracking-tight">{t_local.export_prestige}</h4>
                                    <p className="text-sm text-slate-500 group-hover:text-blue-100 mb-8 font-medium leading-relaxed">
                                        {t_local.export_desc}
                                    </p>
                                    <div
                                        className="w-full py-5 bg-slate-100 text-slate-400 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-sm border border-slate-200 cursor-not-allowed select-none"
                                    >
                                        <Download className="w-6 h-6" />
                                        {t_local.download}
                                        <span className="text-[10px] bg-amber-100 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">
                                            {t_local.pro_badge}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
                .font-serif { font-family: 'Playfair Display', serif; }
            `}</style>
        </div>
    );
}
