"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { X, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SaleBanner() {
    const { t, dir } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);

    // Show after a short delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`fixed bottom-6 ${dir === 'rtl' ? 'left-6' : 'right-6'} z-50 w-full max-w-sm`}
            >
                <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl p-6 overflow-hidden">
                    {/* Decorative gradient background opacity */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />

                    <button
                        onClick={() => setIsVisible(false)}
                        className={`absolute top-4 ${dir === 'rtl' ? 'left-4' : 'right-4'} text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors bg-slate-100 dark:bg-slate-800 rounded-full p-1`}
                        aria-label={t.saleBanner?.close || "Close"}
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="flex flex-col gap-3">
                        <div className="inline-flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                                {t.saleBanner?.title}
                            </h3>
                        </div>

                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                            {t.saleBanner?.desc}
                        </p>

                        <button className="mt-2 w-full py-2.5 px-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 group">
                            {t.saleBanner?.cta}
                            <ExternalLink className={`w-3 h-3 ${dir === 'rtl' ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'} transition-transform`} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
