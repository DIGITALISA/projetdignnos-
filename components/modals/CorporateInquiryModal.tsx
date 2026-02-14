"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
    X, 
    Building2, 
    Send, 
    CheckCircle2, 
    Loader2, 
    Calendar, 
    User, 
    Target 
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";

interface CorporateInquiryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CorporateInquiryModal({ isOpen, onClose }: CorporateInquiryModalProps) {
    const { t, dir } = useLanguage();
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        companyName: '',
        companyEmail: '',
        companyPhone: '',
        targetPosition: '',
        jobDescription: '',
        candidateRefId: '',
        candidateFirstName: '',
        candidateLastName: '',
        desiredReportDate: '',
        interviewDate: '',
        additionalInfo: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const response = await fetch('/api/corporate-inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setStatus('success');
                setTimeout(() => {
                    onClose();
                    setStatus('idle');
                    setFormData({
                        companyName: '',
                        companyEmail: '',
                        companyPhone: '',
                        targetPosition: '',
                        jobDescription: '',
                        candidateRefId: '',
                        candidateFirstName: '',
                        candidateLastName: '',
                        desiredReportDate: '',
                        interviewDate: '',
                        additionalInfo: ''
                    });
                }, 3000);
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    const isRTL = dir === 'rtl';

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 overflow-hidden" dir={dir}>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 30 }}
                        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl z-20 overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                    <Building2 size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                                        {t.corporate.inquiryForm.title}
                                    </h3>
                                    <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-[0.2em] mt-1">
                                        {t.corporate.badge}
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-8 md:p-10 custom-scrollbar">
                            {status === 'success' ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center py-20 text-center"
                                >
                                    <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-8">
                                        <CheckCircle2 size={48} />
                                    </div>
                                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 italic">
                                        {t.corporate.inquiryForm.success}
                                    </h4>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-10">
                                    {/* Section 1: Company */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                                            <Building2 size={14} />
                                            <span className="text-[10px] font-black uppercase tracking-[0.25em]">Company Profile</span>
                                            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800 ml-2" />
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ps-1 block">
                                                    {t.corporate.inquiryForm.companyName}
                                                </label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={formData.companyName}
                                                    onChange={e => setFormData({...formData, companyName: e.target.value})}
                                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all text-sm font-medium text-start"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ps-1 block">
                                                    {t.corporate.inquiryForm.companyEmail}
                                                </label>
                                                <input
                                                    required
                                                    type="email"
                                                    value={formData.companyEmail}
                                                    onChange={e => setFormData({...formData, companyEmail: e.target.value})}
                                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all text-sm font-medium text-start"
                                                />
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ps-1 block">
                                                    {t.corporate.inquiryForm.companyPhone}
                                                </label>
                                                <input
                                                    required
                                                    type="tel"
                                                    value={formData.companyPhone}
                                                    onChange={e => setFormData({...formData, companyPhone: e.target.value})}
                                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all text-sm font-medium text-start"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 2: Position */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                                            <Target size={14} />
                                            <span className="text-[10px] font-black uppercase tracking-[0.25em]">Position Details</span>
                                            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800 ml-2" />
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ps-1 block">
                                                    {t.corporate.inquiryForm.targetPosition}
                                                </label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={formData.targetPosition}
                                                    onChange={e => setFormData({...formData, targetPosition: e.target.value})}
                                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all text-sm font-medium text-start"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ps-1 block">
                                                    {t.corporate.inquiryForm.jobDesc}
                                                </label>
                                                <textarea
                                                    required
                                                    rows={3}
                                                    value={formData.jobDescription}
                                                    onChange={e => setFormData({...formData, jobDescription: e.target.value})}
                                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all resize-none text-sm font-medium text-start"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 3: Candidate */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                                            <User size={14} />
                                            <span className="text-[10px] font-black uppercase tracking-[0.25em]">Candidate Data</span>
                                            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800 ml-2" />
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ps-1 block">
                                                    {t.corporate.inquiryForm.candidateId}
                                                </label>
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="EXP-XXXX"
                                                    value={formData.candidateRefId}
                                                    onChange={e => setFormData({...formData, candidateRefId: e.target.value.toUpperCase()})}
                                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all font-mono text-sm font-medium text-start"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ps-1 block">
                                                    {t.corporate.inquiryForm.candidateFirstName}
                                                </label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={formData.candidateFirstName}
                                                    onChange={e => setFormData({...formData, candidateFirstName: e.target.value})}
                                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all text-sm font-medium text-start"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ps-1 block">
                                                    {t.corporate.inquiryForm.candidateLastName}
                                                </label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={formData.candidateLastName}
                                                    onChange={e => setFormData({...formData, candidateLastName: e.target.value})}
                                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all text-sm font-medium text-start"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 4: Logistics */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                                            <Calendar size={14} />
                                            <span className="text-[10px] font-black uppercase tracking-[0.25em]">Workflow & Dates</span>
                                            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800 ml-2" />
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ps-1 block">
                                                    {t.corporate.inquiryForm.reportDate}
                                                </label>
                                                <input
                                                    required
                                                    type="date"
                                                    value={formData.desiredReportDate}
                                                    onChange={e => setFormData({...formData, desiredReportDate: e.target.value})}
                                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all text-sm font-medium text-start"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ps-1 block">
                                                    {t.corporate.inquiryForm.interviewDate}
                                                </label>
                                                <input
                                                    required
                                                    type="date"
                                                    value={formData.interviewDate}
                                                    onChange={e => setFormData({...formData, interviewDate: e.target.value})}
                                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all text-sm font-medium text-start"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ps-1 block">
                                                {t.corporate.inquiryForm.otherInfo}
                                            </label>
                                            <textarea
                                                rows={2}
                                                value={formData.additionalInfo}
                                                onChange={e => setFormData({...formData, additionalInfo: e.target.value})}
                                                className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all resize-none text-sm font-medium text-start"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 sticky bottom-0 bg-white dark:bg-slate-900 pb-2">
                                        <button
                                            type="submit"
                                            disabled={status === 'loading'}
                                            className="w-full py-6 bg-slate-900 dark:bg-blue-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-800 dark:hover:bg-blue-500 disabled:opacity-50 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 group"
                                        >
                                            {status === 'loading' ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <>
                                                    <Send size={18} className={cn("transition-transform group-hover:scale-110", isRTL ? "group-hover:-translate-x-1" : "group-hover:translate-x-1")} />
                                                    {t.corporate.inquiryForm.submit}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
