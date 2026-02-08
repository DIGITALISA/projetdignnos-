"use client";

import { motion } from "framer-motion";
import { ShieldAlert, Lock, CheckCircle2, ChevronRight, PlayCircle, FileText, Sparkles } from "lucide-react";
import Link from "next/link";

interface AssetLockedProps {
    title: string;
    description: string;
    readiness: {
        hasDiagnosis: boolean;
        hasSimulation: boolean;
    };
}

export function AssetLocked({ title, description, readiness }: AssetLockedProps) {
    return (
        <div className="flex-1 p-4 md:p-10 max-w-5xl mx-auto space-y-12 bg-slate-50/30 min-h-screen flex flex-col items-center justify-center text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative overflow-hidden bg-white rounded-[3rem] border border-slate-200 p-8 md:p-16 shadow-2xl w-full"
            >
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-100/30 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-indigo-100/20 rounded-full blur-[80px]" />

                <div className="relative space-y-8">
                    <div className="w-24 h-24 bg-slate-950 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-slate-900/20 transform -rotate-6">
                        <Lock className="w-10 h-10 text-blue-400" />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none uppercase">
                            {title}
                        </h1>
                        <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed italic">
                            {description}
                        </p>
                    </div>

                    <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 max-w-xl mx-auto text-left space-y-6">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest text-center">Unlock Requirement Status</h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white shadow-sm border border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${readiness.hasDiagnosis ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
                                        <FileText size={20} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-900">Career Diagnosis & Audit</span>
                                        <span className="text-[10px] text-slate-500 font-medium">Initial Strategic Baseline</span>
                                    </div>
                                </div>
                                {readiness.hasDiagnosis ? (
                                    <CheckCircle2 size={24} className="text-emerald-500" />
                                ) : (
                                    <Link href="/assessment/cv-upload" className="text-[10px] font-black uppercase text-blue-600 hover:underline">Execute Now</Link>
                                )}
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white shadow-sm border border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${readiness.hasSimulation ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
                                        <PlayCircle size={20} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-900">Strategic Simulations</span>
                                        <span className="text-[10px] text-slate-500 font-medium">Active Capability Verification</span>
                                    </div>
                                </div>
                                {readiness.hasSimulation ? (
                                    <CheckCircle2 size={24} className="text-emerald-500" />
                                ) : (
                                    <Link href="/simulation" className="text-[10px] font-black uppercase text-blue-600 hover:underline">Execute Now</Link>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex flex-col items-center gap-4">
                        <div className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-700/70 rounded-full font-bold text-[10px] uppercase tracking-tighter">
                            <Sparkles size={14} className="text-blue-500" />
                            Official Assets are generated based on your entire platform performance.
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium italic">
                            * Once locked, your Executive Portfolio is built using AI analysis of your Audit results and Simulation scores.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
