"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import domtoimage from "dom-to-image-more";
import jsPDF from "jspdf";
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

export default function RecommendationPage() {
    const [recommendation, setRecommendation] = useState<RecommendationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [readiness, setReadiness] = useState<ReadinessStatus>({ isReady: false, hasDiagnosis: false, hasSimulation: false, certReady: false, recReady: false });

    const checkReadiness = async (userId: string) => {
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
    };

    const [userPlan, setUserPlan] = useState("None");

    const fetchRecommendation = async () => {
        setLoading(true);
        try {
            const savedProfile = localStorage.getItem('userProfile');
            const userProfile = JSON.parse(savedProfile || '{}');
            setUserPlan(userProfile.plan || "None");
            const userId = userProfile.email || userProfile.fullName;

            if (!userId) {
                setError("User profile not found. Please log in again.");
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
            } else {
                if (response.status !== 404) {
                    setError(data.error || "Failed to fetch recommendation");
                }
            }
        } catch (err) {
            console.error("Error:", err);
            setError("An error occurred while fetching your recommendation.");
        } finally {
            setLoading(false);
        }
    };

    const generateRecommendation = async () => {
        setGenerating(true);
        setError(null);
        try {
            const savedProfile = localStorage.getItem('userProfile');
            const userProfile = JSON.parse(savedProfile || '{}');
            const userId = userProfile.email || userProfile.fullName;
            const userName = userProfile.fullName;
            const language = localStorage.getItem('career-upgrade-lang') || 'fr';

            const response = await fetch('/api/user/recommendation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, userName, language })
            });

            const data = await response.json();

            if (data.success) {
                setRecommendation(data.recommendation);
            } else {
                setError(data.error || "Failed to generate recommendation letter");
            }
        } catch (err) {
            console.error("Error:", err);
            setError("Failed to generate recommendation letter. Please ensure you have completed the assessment.");
        } finally {
            setGenerating(false);
        }
    };

    useEffect(() => {
        fetchRecommendation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const downloadRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        if (!downloadRef.current || !recommendation) return;
        setIsDownloading(true);
        try {
            await document.fonts.ready;
            const original = downloadRef.current;
            const clone = original.cloneNode(true) as HTMLElement;
            clone.style.position  = "fixed";
            clone.style.top       = "-9999px";
            clone.style.left      = "-9999px";
            clone.style.width     = `${original.offsetWidth}px`;
            clone.style.height    = `${original.offsetHeight}px`;
            clone.style.overflow  = "visible";
            document.body.appendChild(clone);

            const unsupported = /oklch|oklab|lab\(|lch\(|hwb\(|color-mix/i;
            const resolveColor = (raw: string): string => {
                const tmp = document.createElement("span");
                tmp.style.color = raw;
                document.body.appendChild(tmp);
                const resolved = getComputedStyle(tmp).color;
                document.body.removeChild(tmp);
                return resolved || "rgb(0,0,0)";
            };
            [clone, ...Array.from(clone.querySelectorAll("*"))].forEach(node => {
                const el = node as HTMLElement;
                const computed = getComputedStyle(el);
                el.style.setProperty("transition", "none", "important");
                el.style.setProperty("animation", "none", "important");
                el.style.setProperty("backdrop-filter", "none", "important");
                el.style.setProperty("-webkit-backdrop-filter", "none", "important");
                (["color", "backgroundColor", "outlineColor"] as const).forEach(key => {
                    const val = computed[key] as string;
                    if (val && unsupported.test(val)) {
                        el.style.setProperty(key.replace(/([A-Z])/g, "-$1").toLowerCase(), resolveColor(val), "important");
                    }
                });
                (["Top", "Right", "Bottom", "Left"] as const).forEach(side => {
                    const w = computed[`border${side}Width` as keyof CSSStyleDeclaration] as string;
                    if (!w || w === "0px") {
                        el.style.setProperty(`border-${side.toLowerCase()}-width`, "0px", "important");
                    } else {
                        const c = computed[`border${side}Color` as keyof CSSStyleDeclaration] as string;
                        if (c && unsupported.test(c)) el.style.setProperty(`border-${side.toLowerCase()}-color`, resolveColor(c), "important");
                    }
                });
                const bg = computed.backgroundImage;
                if (bg && bg !== "none" && (bg.includes("http://") || bg.includes("https://"))) {
                    el.style.setProperty("background-image", "none", "important");
                }
            });

            const dataUrl = await domtoimage.toPng(clone, {
                scale: 2,
                bgcolor: "#ffffff",
                width:  original.offsetWidth,
                height: original.offsetHeight,
            });
            document.body.removeChild(clone);

            const img = new window.Image();
            img.src = dataUrl;
            await new Promise<void>(resolve => { img.onload = () => resolve(); });

            const pdf  = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
            const pdfW = pdf.internal.pageSize.getWidth();
            const pdfH = pdf.internal.pageSize.getHeight();
            pdf.setFillColor(255, 255, 255);
            pdf.rect(0, 0, pdfW, pdfH, "F");
            const ratio    = img.width / img.height;
            const pdfRatio = pdfW / pdfH;
            let imgW = pdfW, imgH = pdfH;
            if (ratio > pdfRatio) { imgH = pdfW / ratio; } else { imgW = pdfH * ratio; }
            pdf.addImage(dataUrl, "PNG", (pdfW - imgW) / 2, (pdfH - imgH) / 2, imgW, imgH);
            pdf.save(`Lettre-Recommandation-${recommendation.referenceId || "OFFICIAL"}.pdf`);
        } catch (err) {
            console.error("Download failed:", err);
            alert("Échec de la génération du PDF.");
        } finally {
            setIsDownloading(false);
        }
    };

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
                <p className="mt-6 text-slate-500 font-medium tracking-widest uppercase text-xs animate-pulse">Récupération de vos données...</p>
            </div>
        );
    }

    if (!readiness.recReady || userPlan === "Free Trial" || userPlan === "None") {
        return (
            <AssetLocked
                title="Letter of Recommendation"
                description="Your Official Executive Endorsement is currently locked. This asset is synthesized based on your full platform history."
                readiness={readiness}
                isPremiumRequired={userPlan === "Free Trial" || userPlan === "None"}
            />
        );
    }

    return (
        <div className="flex-1 p-4 md:p-10 max-w-7xl mx-auto space-y-10 bg-slate-50/30 min-h-screen">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
                <div className="space-y-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-blue-600 font-black tracking-tighter uppercase text-xs"
                    >
                        <ShieldCheck className="w-4 h-4" />
                        Certification de Carrière Officielle
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                        Lettre de <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-700 via-indigo-600 to-blue-600">Recommandation</span>
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl font-medium leading-relaxed font-arabic" dir="rtl">
                        يتم إنشاء هذه الرسالة بناءً على كامل مسارك (التشخيص، التدريب، والمحاكاة).
                    </p>
                </div>

                {!loading && recommendation && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-3"
                    >
                        <button
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold hover:bg-slate-50 hover:border-blue-300 transition-all shadow-sm hover:shadow-md active:scale-95 disabled:opacity-60"
                        >
                            <Download className="w-4 h-4" />
                            {isDownloading ? "Génération..." : "Télécharger PDF"}
                        </button>
                        <button
                            onClick={generateRecommendation}
                            disabled={generating}
                            className="group flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95 disabled:opacity-50"
                        >
                            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />}
                            Régénérer
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
                        <h3 className="text-xl font-black text-blue-900 font-arabic" dir="rtl">
                            الذكاء الاصطناعي يقوم الآن بتحليل كامل مسارك لإنشاء توصية حصرية...
                        </h3>
                        <p className="text-blue-600 text-sm font-bold uppercase tracking-[0.2em] animate-pulse">
                            Processing Dashboard Data + Expert Feedback
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
                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-100/50 rounded-full blur-[100px]" />
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-100/50 rounded-full blur-[100px]" />

                        <div className="relative max-w-3xl mx-auto space-y-8">
                            <div className="w-28 h-28 bg-linear-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/30 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                                <Sparkles className="w-14 h-14 text-white" />
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                                    Prêt à transformer vos efforts en opportunités ?
                                </h2>
                                <p className="text-slate-600 text-xl leading-relaxed font-medium">
                                    سيقوم الذكاء الاصطناعي بتحليل المعطيات الموجودة في الداشبورد الخاصة بك (التشخيص، الورشات، والمحاكاة) لإنتاج رسالة توصية احترافية.
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
                                        Générer ma Recommandation
                                        <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
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
                        className="grid lg:grid-cols-4 gap-10"
                    >
                        {/* Letter Preview - Optimized for Prestige */}
                        <div className="lg:col-span-3 space-y-6">
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="relative bg-white rounded-4xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden p-[2px] bg-linear-to-b from-slate-200 to-white"
                            >
                                <div ref={downloadRef} className="bg-white rounded-[1.95rem] p-10 md:p-20 relative overflow-hidden">
                                    {/* Subtle Paper Texture/Pattern */}
                                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                                        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                                    {/* Official Watermark */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none">
                                        <Sparkles className="w-[500px] h-[500px]" />
                                    </div>

                                    <div className="relative space-y-16">
                                        {/* Elegant Header */}
                                        <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b border-slate-100 pb-12">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-20 h-20 md:w-24 md:h-24 relative bg-white rounded-2xl shadow-sm border border-slate-100 p-2 overflow-hidden shrink-0">
                                                        <Image 
                                                            src="/logo-matc.png" 
                                                            alt="MATC Logo" 
                                                            fill
                                                            className="object-contain p-2"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <h4 className="font-black text-2xl text-slate-900 tracking-tighter leading-none uppercase">MA-TRAINING-CONSULTING</h4>
                                                        <p className="text-xs font-bold text-blue-600 tracking-[0.25em] uppercase">Cabinet de Conseil Stratégique</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Date d&apos;émission</div>
                                                <div className="text-slate-900 font-bold text-lg">
                                                    {new Date(recommendation.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                                </div>
                                                <div className="mt-4 flex flex-col items-end">
                                                    <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center p-2 mb-1 shadow-inner">
                                                        {/* QR Code representation */}
                                                        <div className="w-full h-full grid grid-cols-4 gap-[2px]">
                                                            {[...Array(16)].map((_, i) => (
                                                                <div key={i} className={`bg-slate-200 ${i % 3 === 0 ? 'bg-slate-900' : ''}`} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <Link
                                                        href={`/verification?id=${recommendation.referenceId || recommendation._id?.substring(0, 10).toUpperCase()}`}
                                                        target="_blank"
                                                        className="text-[9px] font-mono text-slate-400 font-bold tracking-widest uppercase hover:text-blue-600 transition-colors"
                                                    >
                                                        Verify: {recommendation.referenceId || recommendation._id?.substring(0, 10).toUpperCase()}
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Subject Area */}
                                        <div className="space-y-4">
                                            <div className="h-1 w-12 bg-blue-600 rounded-full" />
                                            <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight max-w-3xl leading-[1.1]">
                                                {recommendation.subject}
                                            </h3>
                                        </div>

                                        {/* Content - Serif for elegance */}
                                        <div className="prose prose-slate max-w-none text-slate-800 leading-[1.8] whitespace-pre-wrap font-serif text-xl md:text-2xl opacity-90 first-letter:text-5xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-blue-600">
                                            {recommendation.content}
                                        </div>

                                        {/* Footer Area - Signature */}
                                        <div className="pt-16 mt-20 border-t border-slate-100 flex flex-col md:flex-row justify-between items-end gap-10">
                                            <div className="flex items-center gap-5 translate-y-2 text-left">
                                                <div className="w-16 h-16 bg-blue-50/50 rounded-2xl flex items-center justify-center border border-blue-100/50 shadow-inner">
                                                    <ShieldCheck className="w-8 h-8 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 text-lg uppercase tracking-tight">MA-TRAINING-CONSULTING Executive Board</p>
                                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Expertisé & Approuvé par notre Comité de Consultants Senior</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-center gap-4 relative group min-w-[220px]">
                                                {/* Unified Validation Group (Signature over Stamp) */}
                                                <div className="relative flex items-center justify-center py-6">
                                                    {/* Company Stamp - The Base */}
                                                    <div className="opacity-80 transform -rotate-12">
                                                        <div className="w-44 h-22 border-[3px] rounded-xl flex flex-col items-center justify-center bg-white shadow-sm" style={{ borderColor: '#3b82f6', color: '#3b82f6', fontFamily: 'serif' }}>
                                                            <p className="text-[11px] font-black uppercase tracking-tighter leading-none mb-0.5">Sté MA</p>
                                                            <p className="text-[8px] font-bold uppercase tracking-widest leading-none mb-1">Training Consulting</p>
                                                            <p className="text-[6px] font-bold leading-none mb-0.5">Tel: 44 172 264</p>
                                                            <p className="text-[6px] font-bold leading-none">MF: 1805031P/A/M/000</p>
                                                        </div>
                                                    </div>

                                                    {/* Consultant Signature - Scrolled OVER the stamp */}
                                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-95 pointer-events-none transform -rotate-3 z-20">
                                                        <svg width="240" height="100" viewBox="0 0 150 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: '#1e3a8a' }}>
                                                            <path d="M10 45C30 40 50 15 70 25C90 35 110 5 140 15M20 50C40 45 60 40 100 42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                            <path d="M40 30C45 25 55 20 60 35C65 50 50 55 45 45C40 35 55 25 70 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div className="text-center group-hover:scale-105 transition-transform duration-300">
                                                    <p className="font-serif italic text-slate-500 text-sm">Le Consultant en Stratégie de Carrière</p>
                                                    <span className="text-[8px] font-mono tracking-widest uppercase font-black text-slate-300">Verified Blockchain Reference ID: {recommendation.referenceId || "OFFICIAL-AI-CERT"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Sidebar Info */}
                        <div className="lg:col-span-1 space-y-6">
                            <motion.div
                                initial={{ x: 30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="bg-slate-950 rounded-4xl p-8 text-white shadow-2xl relative overflow-hidden group border border-white/5"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full -mr-32 -mt-32 blur-[100px]" />
                                <div className="relative space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 shadow-lg">
                                            <Award className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <h3 className="text-xl font-black tracking-tight">Points de Prestige</h3>
                                    </div>

                                    <div className="space-y-4">
                                        {recommendation.keyEndorsements?.map((item: string, i: number) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: i * 0.15 + 0.5 }}
                                                className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group/item"
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
                                <div className="relative group-hover:text-white transition-colors duration-500">
                                    <h4 className="font-black text-2xl mb-3 tracking-tight">Exporter le Prestige</h4>
                                    <p className="text-sm text-slate-500 group-hover:text-blue-100 mb-8 font-medium leading-relaxed">
                                        Prenez possession de votre recommandation officielle.
                                    </p>
                                    <button
                                        onClick={handleDownload}
                                        disabled={isDownloading}
                                        className="w-full py-5 bg-slate-900 text-white group-hover:bg-white group-hover:text-blue-900 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95 disabled:opacity-60"
                                    >
                                        <Download className="w-6 h-6" />
                                        {isDownloading ? "Génération..." : "Télécharger PDF"}
                                    </button>
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
