"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, FileCheck, CheckCircle2, ChevronRight, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface ContractModalProps {
    isOpen: boolean;
    onClose: () => void;
    planType: string;
    planName: string;
    planPrice: string;
    features: string[];
}

export default function ContractModal({
    isOpen,
    onClose,
    planType,
    planName,
    planPrice,
    features
}: ContractModalProps) {
    const { t } = useLanguage();
    const [scrolledToBottom, setScrolledToBottom] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        const reachedBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 50;
        if (reachedBottom) setScrolledToBottom(true);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-6 bg-slate-950/40 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800"
                >
                    {/* Header */}
                    <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                                <Shield size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                                    {t.mandate.title} : {planName.toUpperCase()}
                                </h2>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    {t.mandate.ref}: MATC-2026-{planType.toUpperCase()}
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div 
                        onScroll={handleScroll}
                        className="flex-1 overflow-y-auto p-8 md:p-12 font-serif text-slate-700 dark:text-slate-300 leading-relaxed space-y-8 scroll-smooth"
                    >
                        <div className="border-l-4 border-blue-600 pl-6 py-2 mb-10">
                            <p className="text-sm font-medium italic opacity-70">
                                {t.mandate.intro.replace('{plan}', planName)}
                            </p>
                        </div>

                        <section>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 font-sans">{t.mandate.section1_title}</h3>
                            <p>{t.mandate.section1_desc.replace('{plan}', planName)}</p>
                            <ul className="list-none space-y-3 mt-6">
                                {features.map((f, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm font-sans font-medium">
                                        <CheckCircle2 size={16} className="text-blue-600 mt-0.5 shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 font-sans">{t.mandate.section2_title}</h3>
                            <p>{t.mandate.section2_desc.replace('{price}', planPrice)}</p>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 font-sans">{t.mandate.section3_title}</h3>
                            <p>{t.mandate.section3_desc}</p>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 font-sans">{t.mandate.section4_title}</h3>
                            <p>{t.mandate.section4_desc}</p>
                        </section>

                        <section className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 font-sans">{t.mandate.signature_clause_title}</h3>
                            <p className="text-xs font-sans opacity-70 mb-4">{t.mandate.signature_clause_desc}</p>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                                <FileCheck size={14} />
                                {t.mandate.ready_for_auth}
                            </div>
                        </section>

                        {!scrolledToBottom && (
                            <div className="sticky bottom-0 left-0 right-0 py-4 bg-linear-to-t from-white dark:from-slate-900 to-transparent flex justify-center pointer-events-none">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 animate-bounce bg-white/80 dark:bg-slate-900/80 px-4 py-1 rounded-full border border-slate-100 dark:border-slate-800">
                                    {t.mandate.scroll_to_sign}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer / CTA */}
                    <div className="p-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center gap-6 bg-white dark:bg-slate-900">
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1 uppercase tracking-tight">{t.mandate.footer_title}</h4>
                            <p className="text-xs text-slate-500">{t.mandate.footer_desc}</p>
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <Button 
                                variant="outline" 
                                onClick={() => window.print()} 
                                className="hidden md:flex gap-2 rounded-xl h-12"
                            >
                                <Printer size={16} />
                                {t.mandate.print}
                            </Button>
                            <Link 
                                href="/auth/register" 
                                className={`flex-1 md:flex-none h-12 px-8 flex items-center justify-center gap-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all shadow-xl
                                    ${scrolledToBottom 
                                        ? "bg-blue-600 text-white shadow-blue-500/30 hover:bg-blue-700" 
                                        : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
                                onClick={(e) => !scrolledToBottom && e.preventDefault()}
                            >
                                {t.mandate.accept}
                                <ChevronRight size={16} />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
