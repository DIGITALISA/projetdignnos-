"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { X, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function SaleBanner() {
    const { t, dir } = useLanguage();
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);

    // Show after a short delay and hide after 6 minutes
    useEffect(() => {
        const showTimer = setTimeout(() => {
            setIsVisible(true);
        }, 1000);

        // Auto-hide after 6 minutes (360,000ms)
        const hideTimer = setTimeout(() => {
            setIsVisible(false);
        }, 360000);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
    }, []);

    // ONLY show on landing/marketing pages
    // Hide on all dashboard and administrative routes
    const isRestricted = !pathname || 
                        pathname.startsWith('/dashboard') || 
                        pathname.startsWith('/admin') || 
                        pathname.startsWith('/assessment') ||
                        pathname.startsWith('/simulation') ||
                        pathname.startsWith('/training') ||
                        pathname.startsWith('/mentor') ||
                        pathname.startsWith('/academy') ||
                        pathname.startsWith('/expert') ||
                        pathname.startsWith('/diplomas') ||
                        pathname.startsWith('/strategic-report') ||
                        pathname.startsWith('/recommendation') ||
                        pathname.startsWith('/job-alignment');
    
    if (isRestricted || !isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`fixed bottom-6 ${dir === 'rtl' ? 'left-6' : 'right-6'} z-50 w-full max-w-sm`}
            >
                <div 
                    onClick={() => setIsVisible(false)}
                    className="relative cursor-pointer bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800 shadow-2xl rounded-3xl p-6 overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600" />
                    <div className="absolute -right-20 -top-20 w-40 h-40 bg-blue-500/10 blur-[50px] rounded-full" />

                    <button
                        onClick={() => setIsVisible(false)}
                        className={`absolute top-4 ${dir === 'rtl' ? 'left-4' : 'right-4'} text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all hover:rotate-90 bg-slate-50 dark:bg-slate-800 rounded-full p-1.5 border border-slate-100 dark:border-slate-700`}
                        aria-label={t.saleBanner?.close || "Close"}
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex flex-col gap-4 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <span className="absolute inset-0 bg-green-500 blur-sm rounded-full animate-pulse opacity-50" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500 relative ring-4 ring-green-500/10" />
                            </div>
                            <h3 className="font-black text-slate-900 dark:text-white text-base uppercase tracking-tight">
                                {t.saleBanner?.title}
                            </h3>
                        </div>

                        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold leading-relaxed">
                            {t.saleBanner?.desc}
                        </p>

                        <Link href="/experts" className="w-full pt-2">
                            <button 
                                onClick={() => setIsVisible(false)}
                                className="w-full py-3.5 px-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 dark:hover:bg-slate-100 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-slate-900/10"
                            >
                                {t.saleBanner?.cta}
                                <ArrowRight className={`w-3.5 h-3.5 ${dir === 'rtl' ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'} transition-transform`} />
                            </button>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
