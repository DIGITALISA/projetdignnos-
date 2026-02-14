"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Search, ShieldCheck, FileCheck, ExternalLink, ShieldAlert, Loader2, Building2, ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import CorporateInquiryModal from "@/components/modals/CorporateInquiryModal";
import Link from "next/link";

interface VerificationResult {
    userName: string;
    title: string;
    date: string;
    status: string;
    referenceId: string;
    type: string;
    details?: Record<string, unknown>;
    score?: number;
}

interface VerificationTranslations {
    types?: Record<string, string>;
    [key: string]: unknown; // To allow other properties like badge, titlePre, etc. 
}

export default function VerificationPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerificationContent />
        </Suspense>
    );
}

function VerificationContent() {
    const { t, dir } = useLanguage();
    const searchParams = useSearchParams();
    const [certId, setCertId] = useState("");
    const [status, setStatus] = useState<'idle' | 'loading' | 'valid' | 'invalid'>('idle');
    const [result, setResult] = useState<VerificationResult | null>(null);
    const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);

    const triggerVerify = async (id: string) => {
        if (!id) return;
        setStatus('loading');
        setResult(null);

        try {
            const response = await fetch(`/api/verify-document?id=${id.trim().toUpperCase()}`);
            const data = await response.json();

            if (data.success) {
                setResult(data.data);
                setStatus('valid');
            } else {
                setStatus('invalid');
            }
        } catch (error) {
            console.error("Verification error:", error);
            setStatus('invalid');
        }
    };

    useEffect(() => {
        const id = searchParams.get('id');
        if (id) {
            // Use requestAnimationFrame or setTimeout to avoid synchronous setState warning if needed,
            // but setting initial state from URL is generally fine. 
            // However, to satisfy the linter:
            const timer = setTimeout(() => {
                setCertId(id);
                triggerVerify(id);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [searchParams]);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        triggerVerify(certId);
    };

    return (
        <div className="min-h-screen bg-[#fcfcfc] dark:bg-slate-950" dir={dir}>
            <Navbar />

            <main className="container mx-auto px-4 pt-40 pb-32">
                <div className="max-w-3xl mx-auto text-center mb-16 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-slate-500"
                    >
                        <ShieldCheck size={14} />
                        {t.verification.badge}
                    </motion.div>

                    <h1 className="text-5xl md:text-6xl font-serif font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
                        {t.verification.titlePre} <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-700 to-slate-900 dark:from-blue-400 dark:to-slate-200">
                            {t.verification.titleHighlight}
                        </span>
                    </h1>

                    <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-medium">
                        {t.verification.subtitle}
                    </p>
                </div>

                {/* Corporate Quick Note - MOVED TO TOP */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl mx-auto mb-12"
                >
                    <div className="p-1 px-1 rounded-3xl bg-linear-to-r from-blue-600 via-indigo-600 to-blue-600 shadow-xl shadow-blue-500/20">
                        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-[1.4rem] p-6 md:p-8 text-center md:text-start flex flex-col md:flex-row items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 shrink-0">
                                <Building2 size={32} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                                        {t.verification.corporateNoteTitle}
                                    </h4>
                                    <Link 
                                        href="/professionals#corporate" 
                                        className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-blue-600 transition-colors"
                                        title="Explore Corporate Support Details"
                                    >
                                        <ArrowUpRight size={18} />
                                    </Link>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-0">
                                    {t.verification.corporateNoteDesc}
                                </p>
                            </div>
                            <button 
                                onClick={() => setIsInquiryModalOpen(true)}
                                className="whitespace-nowrap px-6 py-3 bg-slate-900 dark:bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
                            >
                                {t.verification.corporateNoteCTA}
                            </button>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-10 md:p-12">
                        <form onSubmit={handleVerify} className="space-y-8">
                            <div className="space-y-4">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">
                                    {t.verification.label}
                                </label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        placeholder={t.verification.placeholder}
                                        value={certId}
                                        onChange={(e) => setCertId(e.target.value)}
                                        className="w-full pl-16 pr-6 py-6 rounded-4xl bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-slate-900 dark:focus:border-blue-500 outline-none font-mono text-xl transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
                                    />
                                    <Search className={`absolute ${dir === 'rtl' ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors w-6 h-6`} />
                                </div>
                            </div>

                            <button
                                disabled={status === 'loading' || !certId}
                                className="w-full py-6 bg-slate-900 dark:bg-blue-600 text-white rounded-4xl font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-700 dark:hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl flex items-center justify-center gap-3 active:scale-[0.98]"
                            >
                                {status === 'loading' ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        {t.verification.buttonLoading}
                                    </>
                                ) : (
                                    <>
                                        <FileCheck size={20} />
                                        {t.verification.buttonIdle}
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Results */}
                        <AnimatePresence mode="wait">
                            {status === 'valid' && (
                                <motion.div
                                    key="valid"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-12 pt-12 border-t border-slate-100 dark:border-slate-800"
                                >
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] p-8 space-y-8">
                                        <div className="flex items-center gap-4 text-emerald-600 dark:text-emerald-400">
                                            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-xl">
                                                <CheckCircle2 className="w-6 h-6" />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">
                                                    {t.verification.resultTitle}
                                                </h3>
                                                <p className="text-[10px] uppercase font-bold text-emerald-600/70">
                                                    {t.verification.resultSubtitle}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.verification.subject}</p>
                                                <p className="text-xl font-serif font-black text-slate-900 dark:text-white">{result?.userName}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.verification.domain}</p>
                                                <p className="text-xl font-serif font-black text-slate-900 dark:text-white">
                                                    {result?.type ? ((t.verification as VerificationTranslations).types?.[result.type] || result.title) : result?.title}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.verification.date}</p>
                                                <p className="text-lg font-bold text-slate-900 dark:text-white">
                                                    {result?.date ? new Date(result.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '---'}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.verification.status}</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                    <p className="text-lg font-black text-emerald-600 uppercase tracking-tighter">
                                                        {t.verification.statusElite}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-6">
                                            <button className="w-full py-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center gap-2">
                                                <ExternalLink size={14} />
                                                {t.verification.viewSign}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {status === 'invalid' && (
                                <motion.div
                                    key="invalid"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-12 pt-12 border-t border-slate-100 dark:border-slate-800 text-center"
                                >
                                    <div className="bg-red-50 dark:bg-red-900/10 rounded-[2.5rem] p-10 space-y-4">
                                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto text-red-600 mb-2">
                                            <ShieldAlert size={32} />
                                        </div>
                                        <h3 className="text-xl font-black text-red-900 dark:text-red-400 uppercase tracking-tighter">
                                            {t.verification.errorTitle}
                                        </h3>
                                        <p className="text-sm text-red-600/80 font-medium">
                                            {t.verification.errorDesc.replace('{id}', certId)}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.4em]">
                            Global Strategic Authentication Network • Secure v2.4
                        </p>
                    </div>
                </motion.div>
            </main>

            <CorporateInquiryModal 
                isOpen={isInquiryModalOpen}
                onClose={() => setIsInquiryModalOpen(false)}
            />
        </div>
    );
}
