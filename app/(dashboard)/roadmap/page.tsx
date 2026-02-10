"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    TrendingUp,
    CheckCircle2,
    Loader2,
    Target,
    Zap,
    BrainCircuit,
    Trophy,
    Award,
    Rocket,
    ShieldCheck,
    Sparkles,
    ChevronRight,
    Play,
    Clock,
    Users,
    Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface Milestone {
    id: number;
    label: string;
    title: string;
    description: string;
    tasks: string[];
    expectedOutcome: string;
    icon: string;
}

interface PersonalizedWorkshop {
    title: string;
    description: string;
    durationHours: number;
    focusAreas: string[];
}

interface RoadmapData {
    roadmapTitle: string;
    milestones: Milestone[];
    personalizedWorkshop?: PersonalizedWorkshop;
}

const IconMap: Record<string, typeof TrendingUp> = {
    Target,
    Zap,
    BrainCircuit,
    Trophy,
    Award,
    Rocket,
    ShieldCheck,
    TrendingUp
};

export default function RoadmapPage() {
    useLanguage();
    const [loading, setLoading] = useState(true);
    const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [activeMilestone, setActiveMilestone] = useState<number>(0);

    const fetchRoadmap = async () => {
        setLoading(true);
        try {
            const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
            const userId = userProfile._id || userProfile.id || userProfile.email;
            const language = localStorage.getItem('selectedLanguage') || 'fr';

            const response = await fetch('/api/user/roadmap', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, language })
            });

            const data = await response.json();
            if (data.success) {
                setRoadmap(data.roadmap);
                // Load completed steps from localStorage
                const savedProgress = localStorage.getItem(`roadmap_progress_${userId}`);
                if (savedProgress) {
                    setCompletedSteps(JSON.parse(savedProgress));
                }
            }
        } catch (error) {
            console.error("Failed to fetch roadmap", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoadmap();
    }, []);

    const toggleStep = (id: number) => {
        const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
        const userId = userProfile._id || userProfile.id || userProfile.email;
        
        let newCompleted;
        if (completedSteps.includes(id)) {
            newCompleted = completedSteps.filter(s => s !== id);
        } else {
            newCompleted = [...completedSteps, id].sort((a, b) => a - b);
        }
        
        setCompletedSteps(newCompleted);
        localStorage.setItem(`roadmap_progress_${userId}`, JSON.stringify(newCompleted));
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
                <div className="relative">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <TrendingUp size={16} className="text-blue-600" />
                    </div>
                </div>
                <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-[10px]">Architecting your career path...</p>
            </div>
        );
    }

    if (!roadmap) return null;

    return (
        <div className="min-h-screen bg-slate-50/50">
            <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-16 pb-32">
            {/* Header */}
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pt-8 relative">
                <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -ml-32 -mt-32 pointer-events-none" />
                
                <div className="space-y-4 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
                        <Sparkles size={12} className="animate-pulse" /> AI Strategic Deployment
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-950 tracking-tight leading-[0.9] uppercase">
                        Career <span className="text-transparent bg-clip-text bg-linear-to-b from-blue-600 to-indigo-700">Roadmap</span>
                    </h1>
                    <p className="text-slate-500 font-medium max-w-xl text-xl leading-relaxed">
                        Architecture of your professional evolution, engineered from your diagnostic DNA.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <button 
                        onClick={fetchRoadmap}
                        className="group relative px-8 py-4 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] active:scale-95 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        <span className="relative z-10 flex items-center gap-3">
                            <Zap size={16} className="fill-current group-hover:animate-bounce" /> Regenerate Strategy
                        </span>
                    </button>
                </div>
            </header>

            {/* Progress Summary */}
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] flex flex-col gap-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 opacity-[0.05] rounded-full -mr-16 -mt-16 blur-2xl group-hover:opacity-10 transition-opacity" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Global Progress Status</p>
                    <div className="flex items-baseline gap-3">
                        <span className="text-7xl font-black text-slate-950 tracking-tighter tabular-nums leading-none">
                            {Math.round((completedSteps.length / roadmap.milestones.length) * 100)}%
                        </span>
                        <span className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Deployed</span>
                    </div>
                    <div className="space-y-2">
                        <div className="h-3 w-full bg-slate-100/80 rounded-full overflow-hidden p-0.5">
                            <motion.div 
                                className="h-full bg-linear-to-r from-blue-600 to-indigo-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${(completedSteps.length / roadmap.milestones.length) * 100}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            />
                        </div>
                        <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">
                            <span>Diagnostic DNA</span>
                            <span>Executive Mastery</span>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-slate-950 p-10 rounded-[3rem] text-white flex flex-col justify-between relative overflow-hidden shadow-2xl group">
                    {/* Background effects */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -mr-48 -mt-48 group-hover:bg-blue-600/20 transition-colors duration-700" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
                    
                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-0">Active Strategy Mandate</p>
                        </div>
                        <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-tight max-w-2xl" dir="rtl">
                            {roadmap.roadmapTitle}
                        </h3>
                    </div>
                    <div className="relative z-10 flex items-center justify-between mt-10 pt-10 border-t border-white/10">
                        <div className="flex items-center gap-5">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-xs font-black hover:translate-y-[-4px] transition-transform">
                                        {i}
                                    </div>
                                ))}
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hidden sm:block">Structural Lifecycle</p>
                        </div>
                        <div className="flex gap-2">
                             <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-blue-400">
                                AI Verified
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Personalized Workshop Suggestion */}
            {roadmap.personalizedWorkshop && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group relative"
                >
                    {/* Background Glow */}
                    <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-indigo-600 rounded-[3rem] blur opacity-10 group-hover:opacity-20 transition duration-1000" />
                    
                    <div className="relative bg-white border border-blue-100 rounded-[2.5rem] p-8 md:p-14 overflow-hidden shadow-2xl shadow-blue-900/5">
                        {/* Decorative Background Icon */}
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                            <Users size={240} className="text-blue-900" />
                        </div>
                        
                        <div className="relative z-10 flex flex-col xl:flex-row gap-12 xl:gap-20 items-center">
                            <div className="flex-1 space-y-8 text-center xl:text-left">
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-[0.2em] border border-blue-100">
                                        <Sparkles size={14} className="animate-pulse" /> Recommandation Individuelle
                                    </div>
                                    <h3 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tight leading-tight">
                                        {roadmap.personalizedWorkshop.title}
                                    </h3>
                                    <p className="text-xl text-slate-600 font-medium leading-[1.8]" dir="rtl">
                                        {roadmap.personalizedWorkshop.description}
                                    </p>
                                </div>

                                <div className="flex flex-wrap justify-center xl:justify-start gap-5">
                                    <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm transition-transform hover:-translate-y-1">
                                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                                            <Clock size={20} />
                                        </div>
                                        <span className="text-sm font-black text-slate-800 uppercase tracking-tight">{roadmap.personalizedWorkshop.durationHours} Heures Intensives</span>
                                    </div>
                                    <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm transition-transform hover:-translate-y-1">
                                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600">
                                            <Users size={20} />
                                        </div>
                                        <span className="text-sm font-black text-slate-800 uppercase tracking-tight">Session 100% Individuelle</span>
                                    </div>
                                </div>

                                <div className="pt-6 flex flex-col sm:flex-row items-center gap-6">
                                    <button className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-[1.25rem] font-black uppercase tracking-widest shadow-2xl shadow-slate-900/20 hover:bg-blue-600 transition-all duration-300 flex items-center justify-center gap-4 active:scale-95 group/btn">
                                        <Zap size={20} className="fill-current group-hover:scale-110 transition-transform" /> طلب ورشة عمل فردية
                                    </button>
                                    <div className="flex flex-col items-center sm:items-start">
                                        <p className="text-xs font-black text-blue-600 uppercase tracking-widest animate-pulse" dir="rtl">
                                            * مخصص كلياً بناءً على التشخيص
                                        </p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Architecturé Sur-Mesure</p>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full xl:w-80 space-y-6">
                                <div className="p-8 rounded-4xl bg-slate-50 border border-slate-100 shadow-inner relative overflow-hidden group/list">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                                    
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] text-center mb-6">Axes du Workshop</p>
                                    <div className="space-y-3">
                                        {roadmap.personalizedWorkshop.focusAreas.map((area, aid) => (
                                            <motion.div 
                                                key={aid}
                                                whileHover={{ x: 5 }}
                                                className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-100 text-[11px] font-black text-slate-800 uppercase tracking-tight shadow-sm"
                                            >
                                                <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                                                {area}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Visual Roadmap / Diagram */}
            <div className="relative mt-8">
                {/* Connection Line */}
                <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-1 bg-slate-100 md:-translate-x-1/2 z-0" />

                <div className="space-y-12 relative z-10">
                    {roadmap.milestones.map((milestone, index) => {
                        const isCompleted = completedSteps.includes(milestone.id);
                        const Icon = IconMap[milestone.icon] || Target;
                        const isEven = index % 2 === 0;

                        return (
                            <div key={milestone.id} className="relative">
                                {/* The Milestone Node */}
                                <div className="flex md:justify-center items-center">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => toggleStep(milestone.id)}
                                        className={cn(
                                            "w-20 h-20 rounded-3xl z-20 flex items-center justify-center shadow-2xl transition-all duration-500 border-4",
                                            isCompleted 
                                                ? "bg-blue-600 border-blue-400 text-white scale-110 shadow-blue-500/40" 
                                                : "bg-white border-slate-100 text-slate-400 grayscale hover:grayscale-0 hover:border-blue-200"
                                        )}
                                    >
                                        {isCompleted ? <CheckCircle2 size={32} /> : <Icon size={32} />}
                                    </motion.button>
                                </div>

                                {/* Content Card */}
                                <div className={cn(
                                    "flex flex-col mt-6 md:mt-0 md:absolute md:top-1/2 md:-translate-y-1/2 w-full md:w-[calc(50%-60px)]",
                                    isEven ? "md:right-[calc(50%+60px)]" : "md:left-[calc(50%+60px)] ml-20 md:ml-0"
                                )}>
                                    <motion.div 
                                        initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        onClick={() => setActiveMilestone(index)}
                                        className={cn(
                                            "p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl cursor-pointer hover:border-blue-300 transition-all group",
                                            activeMilestone === index && "ring-2 ring-blue-500 ring-offset-4 shadow-2xl"
                                        )}
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{milestone.label}</span>
                                            <div className="h-px flex-1 bg-slate-100" />
                                            {isCompleted && <CheckCircle2 size={16} className="text-green-500" />}
                                        </div>
                                        <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2 group-hover:text-blue-600 transition-colors">
                                            {milestone.title}
                                        </h4>
                                        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
                                            {milestone.description}
                                        </p>

                                        {activeMilestone === index && (
                                            <motion.div 
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                className="space-y-6 overflow-hidden"
                                            >
                                                <div className="space-y-3">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                        <Play size={10} className="text-blue-600" /> Action Items
                                                    </p>
                                                    <div className="grid gap-2">
                                                        {milestone.tasks.map((task, tid) => (
                                                            <div key={tid} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                                {task}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                                                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Expected Outcome</p>
                                                    <p className="text-xs font-bold text-slate-700 italic">&quot;{milestone.expectedOutcome}&quot;</p>
                                                </div>
                                            </motion.div>
                                        )}
                                        
                                        {activeMilestone !== index && (
                                            <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest">
                                                Explore Phase <ChevronRight size={12} />
                                            </div>
                                        )}
                                    </motion.div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Final Goal / Expert Support CTA */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="mt-24 p-12 md:p-20 rounded-[4rem] bg-slate-950 text-white relative overflow-hidden border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] group"
            >
                {/* Advanced Mesh Background */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -mr-64 -mt-64 group-hover:bg-blue-600/30 transition-colors duration-700" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] -ml-64 -mb-64 group-hover:bg-indigo-600/30 transition-colors duration-700" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
                
                <Trophy className="absolute top-[-40px] left-[-40px] w-96 h-96 opacity-5 -rotate-12 pointer-events-none group-hover:opacity-10 transition-opacity duration-700" />
                
                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
                    <div className="shrink-0 relative">
                        <div className="w-32 h-32 md:w-44 md:h-44 rounded-[2.5rem] bg-linear-to-tr from-blue-600 to-indigo-700 flex items-center justify-center shadow-[0_20px_40px_-5px_rgba(37,99,235,0.4)] border border-white/30 rotate-6 group-hover:rotate-0 transition-transform duration-500">
                            <Award size={64} className="text-white drop-shadow-2xl" />
                        </div>
                        <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-xl border border-slate-100 -rotate-12 group-hover:rotate-0 transition-transform duration-500">
                            <ShieldCheck size={28} className="text-blue-600" />
                        </div>
                    </div>

                    <div className="flex-1 space-y-8 text-center lg:text-left">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                Accompagnement de Haut Niveau
                            </div>
                            <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-none bg-linear-to-b from-white to-white/60 bg-clip-text text-transparent">
                                THE ULTIMATE VERTEX
                            </h3>
                            <p className="text-blue-300/80 font-bold uppercase tracking-[0.3em] text-xs md:text-sm">Architecting Your Global Excellence</p>
                        </div>
                        
                        <div className="space-y-6 max-w-3xl">
                            <div className="p-8 md:p-10 rounded-[2.5rem] bg-white/3 border border-white/10 backdrop-blur-xl relative group/card">
                                <div className="absolute inset-0 bg-linear-to-br from-blue-600/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity rounded-[2.5rem]" />
                                <p className="text-xl md:text-2xl text-slate-100 font-medium leading-[1.8] relative z-10" dir="rtl">
                                    نحن نضع نخبة خبرائنا تحت تصرفك لمساعدتك في تنفيذ خطة العمل وتطوير مسارك المهني بناءً على تشخيصك الخاص. استشاراتنا فردية ومخصصة لضمان أقصى درجات النجاح.
                                </p>
                            </div>
                            
                            <div className="flex flex-col md:flex-row items-center gap-6 pt-4">
                                <button className="w-full md:w-auto px-12 py-6 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest shadow-[0_20px_40px_-10px_rgba(255,255,255,0.3)] hover:bg-blue-600 hover:text-white transition-all duration-500 flex items-center justify-center gap-4 group/btn overflow-hidden relative active:scale-95">
                                    <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-indigo-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                                    <span className="relative z-10 flex items-center gap-3">
                                        <Zap size={20} className="fill-current" /> تواصل مع المسؤول الآن
                                    </span>
                                </button>
                                
                                <div className="flex items-center gap-4 px-8 py-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 transition-colors">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-800 shadow-lg" />
                                        ))}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Status Du Mandat</span>
                                        <span className="text-sm font-bold text-white uppercase tracking-tight">
                                            {completedSteps.length === roadmap.milestones.length 
                                                ? "Roadmap Mastered" 
                                                : `${roadmap.milestones.length - completedSteps.length} Phases à Franchir`}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/5 flex items-center justify-center lg:justify-start gap-8 opacity-40">
                            <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all cursor-default">
                                <Globe size={16} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Global Standards</span>
                            </div>
                            <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all cursor-default">
                                <ShieldCheck size={16} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Secured Privacy</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    </div>
    );
}
