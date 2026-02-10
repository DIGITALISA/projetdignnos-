"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Download, ShieldCheck, CheckCircle2, QrCode, Loader2, Award, Sparkles, Target, Zap } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { AssetLocked } from "@/components/layout/AssetLocked";

interface Competency {
    label: string;
    status: string;
    score: number;
}

interface ReadinessStatus {
    isReady: boolean;
    hasDiagnosis: boolean;
    hasSimulation: boolean;
    certReady: boolean;
    recReady: boolean;
}

interface PerformanceProfile {
    referenceId: string;
    userName: string;
    summary: string;
    verdict: string;
    competencies: Competency[];
    createdAt: string;
}

export default function CertificatePage() {
    const certificateRef = useRef<HTMLDivElement>(null);
    const [profile, setProfile] = useState<PerformanceProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [readiness, setReadiness] = useState<ReadinessStatus>({ isReady: false, hasDiagnosis: false, hasSimulation: false, certReady: false, recReady: false });

    const checkReadiness = async (userId: string) => {
        try {
            const res = await fetch(`/api/user/readiness?userId=${encodeURIComponent(userId)}`);
            const data = await res.json();
            if (data.success) {
                setReadiness(data);
                return data.certReady;
            }
        } catch (err) {
            console.error("Readiness check error:", err);
        }
        return false;
    };

    const fetchProfile = async (identifier: string) => {
        setIsLoading(true);
        try {
            const ready = await checkReadiness(identifier);
            if (!ready) {
                setIsLoading(false);
                return;
            }

            const res = await fetch(`/api/user/performance-profile?userId=${encodeURIComponent(identifier)}`);
            const data = await res.json();
            if (data.success) {
                setProfile(data.profile);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const savedProfile = localStorage.getItem("userProfile");
            const { fullName, email } = JSON.parse(savedProfile || '{}');
            const identifier = email || fullName;
            const language = localStorage.getItem('selectedLanguage') || 'en';

            const res = await fetch('/api/user/performance-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: identifier, userName: fullName, language })
            });
            const data = await res.json();
            if (data.success) {
                setProfile(data.profile);
            } else {
                alert(data.error || "Generation failed");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    useEffect(() => {
        const loadProfile = () => {
            try {
                const savedProfile = localStorage.getItem("userProfile");
                if (savedProfile) {
                    const { fullName, email } = JSON.parse(savedProfile);
                    const identifier = email || fullName;
                    if (identifier) {
                        fetchProfile(identifier);
                    }
                } else {
                    setIsLoading(false);
                }
            } catch (e) {
                console.error("Failed to load profile", e);
                setIsLoading(false);
            }
        };

        loadProfile();
        window.addEventListener("profileUpdated", loadProfile);
        return () => window.removeEventListener("profileUpdated", loadProfile);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDownload = async () => {
        if (!certificateRef.current || !profile) return;

        setIsDownloading(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        try {
            const canvas = await html2canvas(certificateRef.current, {
                scale: 3,
                useCORS: true,
                allowTaint: true,
                logging: false,
                backgroundColor: "#ffffff"
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const margin = 10;
            const contentWidth = pdfWidth - (margin * 2);
            const contentHeight = pdfHeight - (margin * 2);
            const imgProps = pdf.getImageProperties(imgData);
            const ratio = imgProps.width / imgProps.height;

            let w = contentWidth;
            let h = contentWidth / ratio;

            if (h > contentHeight) {
                h = contentHeight;
                w = contentHeight * ratio;
            }

            const x = margin + (contentWidth - w) / 2;
            const y = margin + (contentHeight - h) / 2;

            pdf.addImage(imgData, 'PNG', x, y, w, h);
            pdf.save(`Executive-Performance-Profile-${profile.referenceId}.pdf`);
        } catch (error: unknown) {
            console.error("PDF generation failed:", error);
            const err = error as Error;
            alert(`Failed to generate PDF: ${err.message || "Unknown error"}`);
        } finally {
            setIsDownloading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="py-20 text-center flex flex-col items-center">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-6" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Retrieving Validated Credentials...</p>
            </div>
        );
    }

    if (!readiness.certReady) {
        return (
            <AssetLocked
                title="Executive Performance Profile"
                description="Your Official Capability Profile is synthesized from your entire platform journey."
                readiness={readiness}
            />
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12 pb-20">
            {/* Header & Generation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-blue-600" />
                <div className="flex-1">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Executive Performance Profile</h2>
                    <p className="text-slate-500 font-medium max-w-lg mt-1 font-arabic" dir="rtl">
                        ملفك التنفيذي يتم إنشاؤه بناءً على كامل مسارك: التشخيص، الورشات، والمحاكاة مع الخبير.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50"
                    >
                        {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                        {profile ? "Regenerate Profile" : "Generate Profile"}
                    </button>
                    {profile && (
                        <button
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className="flex items-center gap-3 px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl disabled:opacity-50"
                        >
                            {isDownloading ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
                            Export PDF
                        </button>
                    )}
                </div>
            </div>

            {isGenerating && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-12 text-center space-y-4 bg-blue-50/50 rounded-[3rem] border border-blue-100 border-dashed"
                >
                    <div className="relative inline-block">
                        <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                        <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600 w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-black text-blue-900 font-arabic" dir="rtl">
                        الذكاء الاصطناعي يقوم الآن بتحليل كامل مسارك...
                    </h3>
                    <p className="text-blue-600 text-sm font-bold uppercase tracking-[0.2em] animate-pulse">
                        Synthesizing Diagnosis + Training + Simulation Data
                    </p>
                </motion.div>
            )}

            {/* Empty State */}
            {!profile && !isGenerating && (
                <div className="py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-100">
                    <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                        <Target size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 font-arabic" dir="rtl">لم يتم إنشاء ملف الأداء بعد</h3>
                    <p className="text-slate-500 mt-2 max-w-sm mx-auto font-medium font-arabic" dir="rtl">
                        اضغط على الزر أعلاه لتحليل بياناتك وإنتاج وثيقة الاعتماد التنفيذية الخاصة بك.
                    </p>
                </div>
            )}

            {/* Profile Display */}
            {profile && !isGenerating && (
                <div className="flex flex-col items-center">
                    <div className="w-full max-w-6xl">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={profile.referenceId}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative p-1 bg-slate-200 rounded-[3.5rem] shadow-2xl"
                            >
                                <div
                                    ref={certificateRef}
                                    className="relative w-full aspect-[1.414/1] bg-white rounded-[3.4rem] flex flex-col p-16 md:p-20 overflow-hidden"
                                    style={{
                                        backgroundImage: "radial-gradient(circle at center, #ffffff 40%, #fcfcfc 100%)"
                                    }}
                                >
                                    {/* Security & Design Elements */}
                                    <div className="absolute inset-8 border-[0.5px] border-slate-200 pointer-events-none" />
                                    <div className="absolute inset-10 border-[3px] border-double border-slate-900/10 pointer-events-none" />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none">
                                        <ShieldCheck size={600} />
                                    </div>

                                    <div className="relative z-10 h-full flex flex-col justify-between">
                                        {/* Header */}
                                        <div className="flex justify-between items-start border-b-[0.5px] border-slate-200 pb-12">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 text-slate-900/40 font-black text-[9px] uppercase tracking-[0.6em]">
                                                    Executive Certification Board
                                                </div>
                                                <h2 className="text-5xl font-serif font-black tracking-tighter text-slate-900 uppercase leading-none">
                                                    Performance Dossier
                                                </h2>
                                                <div className="flex items-center gap-3">
                                                    <div className="px-3 py-1 bg-slate-100 rounded text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                                                        Ref: {profile.referenceId}
                                                    </div>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                                    <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Verification Active</div>
                                                </div>
                                            </div>
                                            <div className="w-24 h-24 bg-slate-900 flex items-center justify-center text-white rounded-[2.5rem] shadow-2xl">
                                                <Award size={48} />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="grid grid-cols-12 gap-16 py-12">
                                            <div className="col-span-8 space-y-10">
                                                <div className="space-y-4">
                                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Institutional Capability Analysis for</p>
                                                    <h1 className="text-7xl font-serif font-black text-slate-900 tracking-tight leading-none italic">
                                                        {profile.userName}
                                                    </h1>
                                                </div>

                                                <p className="text-xl font-serif text-slate-700 leading-relaxed max-w-2xl font-medium border-l-4 border-blue-600 pl-8">
                                                    {profile.summary}
                                                </p>

                                                <div className="flex gap-4">
                                                    <div className="px-8 py-3.5 bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.25em] rounded-xl">
                                                        Classification: {profile.verdict}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-span-4 bg-slate-50/80 border border-slate-100 rounded-[3rem] p-10 space-y-10">
                                                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 border-b border-slate-200 pb-5">Core Competencies</h4>
                                                <div className="space-y-8">
                                                    {profile.competencies?.map((item: Competency, i: number) => (
                                                        <div key={i} className="space-y-3">
                                                            <div className="flex justify-between items-end">
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                                                                <span className="text-xs font-black text-blue-700 uppercase tracking-tighter">{item.status}</span>
                                                            </div>
                                                            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                                <div className="h-full bg-slate-900 transition-all duration-1000" style={{ width: `${item.score}%` }} />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="pt-8 border-t border-slate-200">
                                                    <div className="flex items-center gap-3 text-emerald-700">
                                                        <CheckCircle2 size={18} />
                                                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">Verified Readiness</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-end justify-between border-t-[0.5px] border-slate-200 pt-12">
                                            <div className="flex gap-20">
                                                <div className="space-y-2">
                                                    <p className="text-2xl font-serif font-black text-slate-900 border-b-2 border-slate-900 pb-2 mb-2 w-48">
                                                        {new Date(profile.createdAt).toLocaleDateString()}
                                                    </p>
                                                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Date of Attestation</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="w-24 h-12 bg-slate-50 rounded-lg flex items-center justify-center mb-2 border border-slate-100">
                                                        <QrCode size={32} className="opacity-20" />
                                                    </div>
                                                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Digital Seal</p>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.35em] leading-relaxed">
                                                    THIS DOCUMENT IS GENERATED BY AI<br />
                                                    BASED ON MULTI-STAGE SIMULATION DATA<br />
                                                    AND VERIFIED TRAINING PERFORMANCE.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    );
}
