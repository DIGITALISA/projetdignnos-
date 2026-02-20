"use client";

import { motion } from "framer-motion";
import { ArrowRight, User, Building2, CheckCircle2, ShieldCheck, Zap, Globe, Award } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";

export default function Home() {
    const { dir, language } = useLanguage();

    const stats = [
        { label: "Executive Alumni", value: "2,500+" },
        { label: "Corporate Partners", value: "120+" },
        { label: "Global Certifications", value: "15+" },
        { label: "Success Rate", value: "98%" },
    ];

    return (
        <div className={cn(
            "min-h-screen bg-slate-50 dark:bg-[#020617] selection:bg-blue-500 selection:text-white",
            language === 'ar' ? 'font-arabic' : 'font-sans'
        )} dir={dir}>

            {/* Premium Background Effects */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px]" />
                <div className="absolute top-[40%] left-[-10%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px]" />
            </div>

            <main className="relative z-10 container mx-auto px-6 pt-32 pb-20">

                {/* Hero Section */}
                <div className="max-w-5xl mx-auto text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800 mb-10 shadow-sm hover:shadow-md transition-shadow cursor-default"
                    >
                        <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300">
                            Excellence Redefined
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-6xl md:text-8xl font-serif font-medium text-slate-900 dark:text-white mb-8 tracking-tight leading-[1.1]"
                    >
                        Elevate Strategy. <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
                            Empwer Talent.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed mb-12"
                    >
                        The premier ecosystem for executive accreditation, corporate intelligence, and digital transformation.
                    </motion.p>

                    {/* Stats Row */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-slate-200 dark:border-slate-800 pt-12"
                    >
                        {stats.map((stat, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <span className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-1">{stat.value}</span>
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-500">{stat.label}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Main Navigation Cards */}
                <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-20">

                    {/* Professionals Card */}
                    <Link href="/professionals" className="group">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="relative h-full bg-white dark:bg-slate-900/60 backdrop-blur-xl rounded-[3rem] border border-slate-200 dark:border-slate-800 p-10 md:p-14 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/30 transition-all duration-500"
                        >
                            <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-700">
                                <User strokeWidth={0.5} size={300} />
                            </div>

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-8 border border-blue-100 dark:border-blue-500/20 group-hover:rotate-6 transition-transform duration-500">
                                        <User size={32} />
                                    </div>
                                    <h3 className="text-4xl font-serif font-medium text-slate-900 dark:text-white mb-4">For Professionals</h3>
                                    <p className="text-lg text-slate-500 font-medium leading-relaxed mb-8 max-w-md">
                                        Accelerate your career trajectory with accredited programs and personalized coaching.
                                    </p>
                                    <ul className="space-y-4 mb-8">
                                        <li className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                                            <div className="p-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"><CheckCircle2 className="w-3 h-3" /></div>
                                            Executive Accreditation
                                        </li>
                                        <li className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                                            <div className="p-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"><CheckCircle2 className="w-3 h-3" /></div>
                                            Career Diagnosis AI
                                        </li>
                                        <li className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                                            <div className="p-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"><CheckCircle2 className="w-3 h-3" /></div>
                                            Skill Assessment
                                        </li>
                                    </ul>
                                </div>
                                
                                <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 group-hover:gap-5 transition-all">
                                    Start Journey <ArrowRight className="w-5 h-5" />
                                </div>
                            </div>
                        </motion.div>
                    </Link>

                    {/* Enterprises Card */}
                    <Link href="/digitalization" className="group">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="relative h-full bg-slate-900 dark:bg-white rounded-[3rem] border border-slate-800 dark:border-slate-200 p-10 md:p-14 overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20 dark:hover:shadow-lg transition-all duration-500"
                        >
                            <div className="absolute top-0 right-0 p-16 opacity-[0.06] group-hover:opacity-[0.1] group-hover:scale-110 transition-all duration-700">
                                <Building2 strokeWidth={0.5} size={300} className="text-white dark:text-slate-900" />
                            </div>

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <div className="w-16 h-16 rounded-2xl bg-white/10 dark:bg-slate-100 flex items-center justify-center text-white dark:text-slate-900 mb-8 border border-white/10 dark:border-slate-200 group-hover:-rotate-6 transition-transform duration-500">
                                        <Building2 size={32} />
                                    </div>
                                    <h3 className="text-4xl font-serif font-medium text-white dark:text-slate-900 mb-4">For Enterprises</h3>
                                    <p className="text-lg text-slate-400 dark:text-slate-600 font-medium leading-relaxed mb-8 max-w-md">
                                        Scale your organization with AI-driven consulting, audits, and transformation roadmaps.
                                    </p>
                                    <ul className="space-y-4 mb-8">
                                        <li className="flex items-center gap-3 text-sm font-medium text-slate-300 dark:text-slate-600">
                                            <div className="p-1 rounded-full bg-white/10 dark:bg-slate-200 text-white dark:text-slate-900"><Zap className="w-3 h-3" /></div>
                                            Business Intelligence
                                        </li>
                                        <li className="flex items-center gap-3 text-sm font-medium text-slate-300 dark:text-slate-600">
                                            <div className="p-1 rounded-full bg-white/10 dark:bg-slate-200 text-white dark:text-slate-900"><Globe className="w-3 h-3" /></div>
                                            Digital Strategy
                                        </li>
                                        <li className="flex items-center gap-3 text-sm font-medium text-slate-300 dark:text-slate-600">
                                            <div className="p-1 rounded-full bg-white/10 dark:bg-slate-200 text-white dark:text-slate-900"><ShieldCheck className="w-3 h-3" /></div>
                                            Corporate Training
                                        </li>
                                    </ul>
                                </div>

                                <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-white dark:text-slate-900 group-hover:gap-5 transition-all">
                                    Explore Solutions <ArrowRight className="w-5 h-5" />
                                </div>
                            </div>
                        </motion.div>
                    </Link>

                </div>

                {/* Footer Minimal */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-center border-t border-slate-200 dark:border-slate-800/50 pt-12"
                >
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 opacity-60">
                        MA-TRAINING-CONSULTING © 2026. Excellence in Every Interaction.
                    </p>
                </motion.div>

            </main>
        </div>
    );
}
