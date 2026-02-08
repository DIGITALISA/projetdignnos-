"use client";

import { motion } from "framer-motion";
import {
    FileText,
    Check,
    PenTool,
    Shield,
    ChevronRight,
    Loader2,
    Download,
    Printer
} from "lucide-react";
import { useState, useRef } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Navbar } from "@/components/ui/navbar";
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';
import { useRouter } from "next/navigation";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function ContractPage() {
    const { t, dir, language } = useLanguage();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSigned, setIsSigned] = useState(false);
    const contractRef = useRef<HTMLDivElement>(null);

    // Form State
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        signature: "",
        agreed: false
    });

    const isRtl = dir === 'rtl';

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.agreed || !formData.signature) return;

        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsLoading(false);
        setIsSigned(true);
    };

    const generatePDF = async () => {
        if (!contractRef.current) return;

        const canvas = await html2canvas(contractRef.current, {
            scale: 2,
            backgroundColor: "#ffffff"
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Success_Mandate_${formData.lastName}.pdf`);
    };

    if (isSigned) {
        return (
            <div className={cn("min-h-screen bg-[#FDFDFD] dark:bg-[#050505] selection:bg-slate-900 selection:text-white dark:selection:bg-white dark:selection:text-black", language === 'ar' ? 'font-arabic' : 'font-sans')} dir={dir}>
                <Navbar />
                <div className="container mx-auto px-4 pt-32 h-screen flex flex-col items-center justify-center text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center mb-8 shadow-xl shadow-green-500/20"
                    >
                        <Check className="w-10 h-10 text-white" strokeWidth={3} />
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-4">
                        {t.contract.successTitle}
                    </h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400 max-w-lg mx-auto mb-12">
                        {t.contract.successDesc}
                    </p>

                    <button
                        onClick={generatePDF}
                        className="mb-12 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl font-bold uppercase tracking-[0.2em] text-xs transition-all hover:scale-105 flex items-center gap-3 shadow-xl"
                    >
                        <Download className="w-4 h-4" />
                        {t.contract.download}
                    </button>

                    <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg max-w-md w-full">
                        <div className="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                            <span className="text-xs text-slate-400 uppercase tracking-widest">Signatory</span>
                            <span className="font-bold text-slate-900 dark:text-white">{formData.firstName} {formData.lastName}</span>
                        </div>
                        <div className="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                            <span className="text-xs text-slate-400 uppercase tracking-widest">Mandate ID</span>
                            <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">MND-{Math.floor(Math.random() * 10000)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-400 uppercase tracking-widest">Status</span>
                            <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full uppercase tracking-wider">Active</span>
                        </div>
                    </div>

                    {/* Hidden Contract for PDF Generation */}
                    <div className="fixed left-[-9999px] top-0">
                        <div ref={contractRef} className="w-[800px] p-20" style={{ backgroundColor: '#ffffff', color: '#0f172a' }}>
                            <div className="text-center mb-12 pb-8" style={{ borderBottom: '2px solid #0f172a' }}>
                                <Shield className="w-16 h-16 mx-auto mb-4" style={{ color: '#0f172a' }} />
                                <h1 className="text-4xl font-serif font-bold uppercase tracking-widest mb-2" style={{ color: '#0f172a' }}>Success Mandate</h1>
                                <p className="text-sm font-bold uppercase tracking-[0.3em]" style={{ color: '#64748b' }}>Official Strategic Protocol</p>
                            </div>

                            <div className="mb-8 flex justify-between text-sm font-mono pb-4" style={{ borderBottom: '1px solid #e2e8f0', color: '#0f172a' }}>
                                <span>DATE: {new Date().toLocaleDateString()}</span>
                                <span>ID: MND-{Math.floor(Math.random() * 10000)}</span>
                            </div>

                            <div className="prose max-w-none mb-16 text-justify leading-relaxed font-serif">
                                <ReactMarkdown
                                    components={{
                                        p: ({ node, ...props }) => <p className="mb-4 text-sm leading-loose" style={{ color: '#1e293b' }} {...props} />,
                                        strong: ({ node, ...props }) => <strong className="font-bold uppercase text-xs tracking-wide" style={{ color: '#000000' }} {...props} />,
                                        ol: ({ node, ...props }) => <ol className="list-decimal pl-4 space-y-4 mb-4 marker:font-bold" style={{ color: '#0f172a' }} {...props} />,
                                        li: ({ node, ...props }) => <li className="pl-2" {...props} />
                                    }}
                                >
                                    {t.contract.terms}
                                </ReactMarkdown>
                            </div>

                            <div className="grid grid-cols-2 gap-12 pt-8" style={{ borderTop: '2px solid #0f172a' }}>
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest mb-4 font-bold" style={{ color: '#0f172a' }}>The Asset (Signatory)</p>
                                    <p className="text-lg font-bold mb-2" style={{ color: '#0f172a' }}>{formData.firstName} {formData.lastName}</p>
                                    <p className="text-sm mb-6" style={{ color: '#475569' }}>{formData.phone}</p>
                                    <div className="h-20 flex items-end">
                                        <p className="font-dancing text-3xl" style={{ fontFamily: 'Times New Roman, serif', fontStyle: 'italic', color: '#1e3a8a' }}>
                                            {formData.signature}
                                        </p>
                                    </div>
                                    <div className="h-px w-full mt-2" style={{ backgroundColor: '#94a3b8' }} />
                                    <p className="text-[9px] uppercase mt-1" style={{ color: '#94a3b8' }}>Digital Signature Verified</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] uppercase tracking-widest mb-4 font-bold" style={{ color: '#0f172a' }}>The Architecture</p>
                                    <p className="text-lg font-bold mb-2" style={{ color: '#0f172a' }}>Success Strategy Inc.</p>
                                    <div className="h-20 flex items-end justify-end">
                                        <div className="w-24 h-24 border-4 rounded-full flex items-center justify-center transform -rotate-12" style={{ borderColor: '#0f172a', opacity: 0.2 }}>
                                            <span className="font-black text-xs uppercase" style={{ color: '#0f172a' }}>Official Seal</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-20 text-center text-[10px] font-mono uppercase" style={{ color: '#94a3b8' }}>
                                Generated by Success Strategy Protocol • Secure Hash {Math.random().toString(36).substring(7)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={cn("min-h-screen bg-[#FDFDFD] dark:bg-[#050505] selection:bg-slate-900 selection:text-white dark:selection:bg-white dark:selection:text-black", language === 'ar' ? 'font-arabic' : 'font-sans')} dir={dir}>
            <Navbar />

            <div className="fixed inset-0 opacity-[0.02] pointer-events-none z-[100]" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>

            <main className="pt-32 pb-20 container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm mb-6 shadow-sm">
                        <PenTool className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                            {t.contract.subtitle}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-base text-slate-900 dark:text-white tracking-tight mb-4">
                        {t.contract.title}
                    </h1>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    {/* Contract Preview - Left Side */}
                    <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
                        <div className="p-8 md:p-12 h-[600px] overflow-y-auto custom-scrollbar">
                            <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed font-serif">
                                <ReactMarkdown
                                    components={{
                                        p: ({ node, ...props }) => <p className="mb-4 text-slate-600 dark:text-slate-300 leading-relaxed" {...props} />,
                                        strong: ({ node, ...props }) => <strong className="font-bold text-slate-900 dark:text-white" {...props} />,
                                        ol: ({ node, ...props }) => <ol className="list-decimal pl-4 space-y-2 mb-4 marker:text-slate-900 dark:marker:text-white" {...props} />,
                                        li: ({ node, ...props }) => <li className="pl-1" {...props} />
                                    }}
                                >
                                    {t.contract.terms}
                                </ReactMarkdown>
                            </div>
                            <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-between items-end">
                                <div>
                                    <div className="w-32 h-16 border-b-2 border-slate-900 dark:border-slate-400 mb-2 flex items-end">
                                        <p className="font-dancing text-2xl text-blue-800 dark:text-blue-300 transform -rotate-3 pl-2" style={{ fontFamily: 'Times New Roman, serif', fontStyle: 'italic' }}>
                                            {formData.signature}
                                        </p>
                                    </div>
                                    <p className="text-[10px] uppercase tracking-widest text-slate-400">Authenticated Signature</p>
                                </div>
                                <Shield className="w-12 h-12 text-slate-100 dark:text-slate-800" />
                            </div>
                        </div>
                    </div>

                    {/* Input Form - Right Side */}
                    <div className="lg:col-span-5 space-y-6">
                        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-lg relative">
                            <h3 className="text-xl font-serif font-medium mb-6 flex items-center gap-3">
                                <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">1</span>
                                {t.contract.step1}
                            </h3>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="col-span-2 md:col-span-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">{t.contract.firstName}</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        required
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        placeholder={t.contract.firstName}
                                    />
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">{t.contract.lastName}</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        required
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        placeholder={t.contract.lastName}
                                    />
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">{t.contract.phone}</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="+216 00 000 000"
                                />
                            </div>

                            <h3 className="text-xl font-serif font-medium mb-6 flex items-center gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">2</span>
                                {t.contract.step3}
                            </h3>

                            <div className="mb-6">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">{t.contract.signLabel}</label>
                                <input
                                    type="text"
                                    name="signature"
                                    required
                                    value={formData.signature}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-4 text-lg font-dancing text-blue-700 dark:text-blue-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder={t.contract.signPlaceholder}
                                    style={{ fontFamily: 'Times New Roman, serif', fontStyle: 'italic' }}
                                />
                            </div>

                            <div className="flex items-start gap-3 mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                <input
                                    type="checkbox"
                                    name="agreed"
                                    id="agreed"
                                    checked={formData.agreed}
                                    onChange={handleInputChange}
                                    className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <label htmlFor="agreed" className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed cursor-pointer select-none">
                                    {t.contract.readTerms}
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !formData.agreed || !formData.signature || !formData.firstName || !formData.lastName || !formData.phone}
                                className="w-full bg-slate-900 dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-xs transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        {t.contract.submit}
                                        {isRtl ? <ChevronRight className="rotate-180 w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
