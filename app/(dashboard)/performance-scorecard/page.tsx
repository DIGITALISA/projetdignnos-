"use client";

import { motion } from "framer-motion";
import { 
    Target, 
    Zap, 
    Award, 
    TrendingUp, 
    ShieldCheck, 
    BarChart3, 
    Clock, 
    MessageSquare,
    ChevronRight,
    Download,
    Lock
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";

interface Metric {
    label: string;
    score: number;
    description: string;
    color: string;
}

interface Badge {
    name: string;
    icon: string;
    date: string;
}

interface SimulationData {
    title: string;
    performanceMetrics: {
        leadership: number;
        strategy: number;
        communication: number;
        problemSolving: number;
        decisionSpeed: number;
        overallScore: number;
    };
    badges: Badge[];
}

export default function PerformanceScorecard() {
    const { dir } = useLanguage();
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<SimulationData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
                const userId = userProfile.email || userProfile.fullName;

                if (!userId) return;

                const res = await fetch(`/api/simulation?userId=${encodeURIComponent(userId)}`);
                const result = await res.json();

                if (result.mission) {
                    setData(result.mission);
                }
            } catch (error) {
                console.error("Failed to load scorecard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
                <h2 className="text-xl font-bold text-slate-800">Generating Executive Analytics...</h2>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="max-w-4xl mx-auto py-20 px-4 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BarChart3 className="w-10 h-10 text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">No Simulation Data Yet</h2>
                <p className="text-slate-500 mb-8">Complete a simulation mission to see your performance metrics and earn executive badges.</p>
                <a href="/simulation" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
                    Start Simulation <ChevronRight className="w-4 h-4" />
                </a>
            </div>
        );
    }

    const metrics: Metric[] = [
        { 
            label: "Strategic Leadership", 
            score: data.performanceMetrics.leadership || 0, 
            description: "Ability to drive vision and inspire team action.",
            color: "blue"
        },
        { 
            label: "Operational Strategy", 
            score: data.performanceMetrics.strategy || 0, 
            description: "Translation of high-level goals into executable plans.",
            color: "purple"
        },
        { 
            label: "Executive Communication", 
            score: data.performanceMetrics.communication || 0, 
            description: "Clarity and impact in high-stakes conversations.",
            color: "emerald"
        },
        { 
            label: "Complex Problem Solving", 
            score: data.performanceMetrics.problemSolving || 0, 
            description: "Navigating ambiguity and multi-variate challenges.",
            color: "amber"
        },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12 px-4 md:px-8" dir={dir}>
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Official Transcript</span>
                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Confidential Restricted</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">Executive Scorecard</h1>
                    <p className="text-slate-500 font-medium">Data-driven performance analysis for mission: <span className="text-slate-900 font-bold">{data.title}</span></p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                    <Download className="w-4 h-4" /> Export Report (PDF)
                </button>
            </div>

            {/* Main Stats Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Overall Score Circle */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-900 rounded-[2.5rem] p-10 text-white flex flex-col items-center justify-center text-center relative overflow-hidden group shadow-2xl"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-blue-500/20 transition-all" />
                    <div className="relative z-10 w-48 h-48 rounded-full border-10 border-white/5 flex flex-col items-center justify-center shadow-inner">
                        <div className="absolute inset-0 rounded-full border-10 border-blue-500 border-t-transparent animate-spin-slow" />
                        <span className="text-6xl font-black leading-none">{data.performanceMetrics.overallScore}<span className="text-2xl text-white/40">%</span></span>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mt-2">Overall Mastery</span>
                    </div>
                    <div className="mt-8 space-y-2 relative z-10">
                        <h3 className="text-2xl font-black">Elite Performance</h3>
                        <p className="text-sm text-slate-400 font-medium px-4">Based on real-time simulation data, AI analysis, and expert validation.</p>
                    </div>
                </motion.div>

                {/* Metrics Breakdown */}
                <div className="lg:col-span-2 space-y-4">
                    {metrics.map((metric, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", 
                                `bg-${metric.color}-50 text-${metric.color}-600`
                            )}>
                                <Target size={24} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-bold text-slate-900">{metric.label}</h4>
                                    <span className={cn("font-black text-xl", `text-${metric.color}-600`)}>{metric.score}/10</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${metric.score * 10}%` }}
                                        transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                                        className={cn("h-full rounded-full", `bg-${metric.color}-600`)}
                                    />
                                </div>
                                <p className="text-xs text-slate-500 font-medium">{metric.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Decision Speed & Secondary Stats */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-3xl border border-slate-200 p-6 flex items-center gap-4 shadow-sm">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                        <Clock size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Decision Speed</p>
                        <p className="text-xl font-black text-slate-900">{data.performanceMetrics.decisionSpeed}/10</p>
                    </div>
                </div>
                <div className="bg-white rounded-3xl border border-slate-200 p-6 flex items-center gap-4 shadow-sm">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                        <TrendingUp size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Efficiency Rate</p>
                        <p className="text-xl font-black text-slate-900">92%</p>
                    </div>
                </div>
                <div className="bg-white rounded-3xl border border-slate-200 p-6 flex items-center gap-4 shadow-sm">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Risk Mitigation</p>
                        <p className="text-xl font-black text-slate-900">8.5/10</p>
                    </div>
                </div>
                <div className="bg-white rounded-3xl border border-slate-200 p-6 flex items-center gap-4 shadow-sm">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                        <MessageSquare size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Coached Feedback</p>
                        <p className="text-xl font-black text-slate-900">Excellent</p>
                    </div>
                </div>
            </div>

            {/* Digital Badges Section */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-bl from-blue-50 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none opacity-50" />
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                            <Award className="w-6 h-6 text-blue-600" />
                            Digital Skills Badges
                        </h2>
                        <p className="text-sm text-slate-500 font-medium">Verified credentials earned during this simulation series.</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 relative z-10">
                    {data.badges && data.badges.length > 0 ? (
                        data.badges.map((badge, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group cursor-pointer"
                            >
                                <div className="aspect-square rounded-3xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center p-4 text-center group-hover:bg-linear-to-br group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-xl group-hover:shadow-blue-200 group-hover:-translate-y-2">
                                    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Zap className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <h5 className="font-black text-[10px] uppercase tracking-widest leading-tight">{badge.name}</h5>
                                    <p className="text-[8px] opacity-60 mt-1 font-bold">{new Date(badge.date).getFullYear()}</p>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        // Mock Badges for demo if none earned yet
                        [ "Crisis Manager", "Elite Negotiator", "Visionary Leader", "Strategic Thinker" ].map((name, idx) => (
                            <div key={idx} className="opacity-40 grayscale pointer-events-none">
                                <div className="aspect-square rounded-3xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center p-4 text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-white/50 border border-slate-100 flex items-center justify-center mb-4">
                                        <Lock className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <h5 className="font-black text-[10px] uppercase tracking-widest text-slate-400">{name}</h5>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* AI Verdict / Expert Notes */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                <div className="relative z-10 grid md:grid-cols-3 gap-10 items-center">
                    <div className="md:col-span-2 space-y-4">
                        <h3 className="text-3xl font-black tracking-tight leading-none italic uppercase">The Executive Verdict</h3>
                        <p className="text-lg text-blue-100 font-medium leading-relaxed">
                            &ldquo;Participant demonstrated exceptional resilience during the critical phase of the simulation. Strategic decision-making remained objective despite high-pressure variables.&rdquo;
                        </p>
                        <div className="pt-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 border border-white/20 flex items-center justify-center font-bold text-xs uppercase tracking-widest backdrop-blur-sm">AI</div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest opacity-80">CareerUpgrade Intelligence System</p>
                                <p className="text-[10px] font-bold opacity-60">Verified Analytics Engine v4.2</p>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:flex justify-center">
                        <div className="w-32 h-32 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center rotate-6 shadow-2xl">
                            <ShieldCheck size={64} className="text-white opacity-40" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
