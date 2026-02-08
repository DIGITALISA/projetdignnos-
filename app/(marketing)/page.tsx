"use client";

import { motion } from "framer-motion";
import { ArrowRight, User, Building2, ShieldCheck, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";

export default function Home() {
    const { dir, language } = useLanguage();

    return (
        <div className={cn(
            "min-h-screen bg-[#FDFDFD] dark:bg-[#050505] selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black",
            language === 'ar' ? 'font-arabic' : 'font-sans'
        )} dir={dir}>

            {/* Background Effects */}
            {/* Background Effects */}
            <div className="fixed inset-0 opacity-[0.015] pointer-events-none z-100" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-linear-to-br from-blue-50/80 to-indigo-50/0 dark:from-blue-900/10 dark:to-transparent rounded-full blur-[120px]" />
                <div className="absolute -bottom-[20%] right-[-10%] w-[800px] h-[800px] bg-linear-to-tl from-slate-100/80 to-transparent dark:from-slate-900/20 dark:to-transparent rounded-full blur-[100px]" />
            </div>

            <main className="container mx-auto px-6 py-32 flex flex-col justify-center min-h-screen">

                {/* Hero Header */}
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-900 mb-8"
                    >
                        <ShieldCheck className="w-4 h-4 text-slate-900 dark:text-white" />
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">MA-TRAINING-CONSULTING</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-serif font-medium text-slate-900 dark:text-white mb-6 tracking-tight"
                    >
                        Global Consulting & <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">Training Excellence</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed"
                    >
                        We provide world-class strategic consulting and executive development programs for ambitious professionals and forward-thinking enterprises.
                    </motion.p>
                </div>

                {/* Selection Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full">

                    {/* Professionals Card */}
                    <Link href="/professionals" className="group relative">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="h-full bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-10 md:p-14 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-2xl transition-all duration-500 flex flex-col justify-between overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500 transform group-hover:scale-110">
                                <User size={200} />
                            </div>

                            <div className="relative z-10 space-y-6">
                                <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-500">
                                    <User size={32} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-serif font-medium text-slate-900 dark:text-white mb-3">For Professionals</h3>
                                    <p className="text-slate-500 font-medium leading-relaxed mb-6">
                                        Accelerate your career with accredited executive programs, personalized skills assessment, and strategic coaching.
                                    </p>
                                    <ul className="space-y-3 mb-8">
                                        <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                            <CheckCircle2 className="w-4 h-4 text-blue-500" /> Executive Accreditation
                                        </li>
                                        <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                            <CheckCircle2 className="w-4 h-4 text-blue-500" /> Career Diagnosis
                                        </li>
                                        <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                            <CheckCircle2 className="w-4 h-4 text-blue-500" /> Skills Development
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="relative z-10 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                                Enter Space <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                            </div>
                        </motion.div>
                    </Link>

                    {/* Enterprises Card */}
                    <Link href="/digitalization" className="group relative">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="h-full bg-slate-950 dark:bg-white rounded-[2.5rem] border border-slate-900 dark:border-slate-200 p-10 md:p-14 hover:shadow-2xl transition-all duration-500 flex flex-col justify-between overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-500 transform group-hover:scale-110">
                                <Building2 size={200} className="text-white dark:text-black" />
                            </div>

                            <div className="relative z-10 space-y-6">
                                <div className="w-16 h-16 rounded-2xl bg-white/10 dark:bg-slate-100 flex items-center justify-center text-white dark:text-black mb-4 group-hover:scale-110 transition-transform duration-500">
                                    <Building2 size={32} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-serif font-medium text-white dark:text-black mb-3">For Enterprises</h3>
                                    <p className="text-slate-400 dark:text-slate-600 font-medium leading-relaxed mb-6">
                                        Scale your business with AI-driven consulting, operational audits, and custom digital transformation roadmaps.
                                    </p>
                                    <ul className="space-y-3 mb-8">
                                        <li className="flex items-center gap-3 text-sm text-slate-300 dark:text-slate-500">
                                            <CheckCircle2 className="w-4 h-4 text-white dark:text-black" /> Business Intelligence
                                        </li>
                                        <li className="flex items-center gap-3 text-sm text-slate-300 dark:text-slate-500">
                                            <CheckCircle2 className="w-4 h-4 text-white dark:text-black" /> Corporate Training
                                        </li>
                                        <li className="flex items-center gap-3 text-sm text-slate-300 dark:text-slate-500">
                                            <CheckCircle2 className="w-4 h-4 text-white dark:text-black" /> Digital Strategy
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="relative z-10 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-white dark:text-black">
                                Business Solutions <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                            </div>
                        </motion.div>
                    </Link>

                </div>

                <div className="mt-20 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 opacity-60">MA-TRAINING-CONSULTING © 2026. All Rights Reserved.</p>
                </div>
            </main>
        </div>
    );
}
