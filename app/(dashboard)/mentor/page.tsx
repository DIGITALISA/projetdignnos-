"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles,
    Target,
    Zap,
    CheckCircle2,
    Loader2,
    BrainCircuit,
    ArrowRight,
    ScrollText,
    Play
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface MentorContent {
    academyTitle: string;
    strategicFocus: string[];
    modules: {
        id: number;
        theme: string;
        title: string;
        content: string;
        practicalExercise: string;
        moduleQuiz: {
            question: string;
            options: string[];
            correctAnswer: number;
            explanation: string;
        }[];
    }[];
    globalCaseStudy: {
        title: string;
        scenario: string;
        dilemma: string;
        expertSolution: string;
    };
    gamifiedSimulation: {
        title: string;
        mission: string;
        challenges: {
            situation: string;
            choices: string[];
            correctChoice: number;
            consequence: string;
        }[];
    };
    actionPlan: {
        milestone: string;
        tasks: string[];
        timeframe: string;
    }[];
    advice: string[];
}

export default function MentorPage() {
    const { dir } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [content, setContent] = useState<MentorContent | null>(null);
    const [activeSection, setActiveSection] = useState<string>("modules");
    const [activeModule, setActiveModule] = useState(0);
    const [quizAnswers, setQuizAnswers] = useState<Record<number, number[]>>({});
    const [showQuizResults, setShowQuizResults] = useState<Record<number, boolean>>({});
    const [error, setError] = useState<string | null>(null);

    // Simulation/Game state
    const [currentChallenge, setCurrentChallenge] = useState(0);
    const [simChoices, setSimChoices] = useState<number[]>([]);
    const [showCons, setShowCons] = useState(false);

    const generateMentorContent = async () => {
        setGenerating(true);
        setError(null);
        try {
            const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
            const userId = userProfile.email || userProfile.fullName;
            const language = localStorage.getItem('selectedLanguage') || 'fr';

            if (!userId) {
                setError("User profile not found.");
                setGenerating(false);
                return;
            }

            const response = await fetch('/api/user/mentor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, userName: userProfile.fullName, language })
            });

            const data = await response.json();

            if (data.success) {
                setContent(data.guidance);
                // Reset interactive states for the new content
                setCurrentChallenge(0);
                setSimChoices([]);
                setShowCons(false);
                setActiveModule(0);
                setQuizAnswers({});
                setShowQuizResults({});
                setActiveSection("modules");
            } else {
                setError(data.error || "Failed to generate guidance.");
            }
        } catch {
            setError("An error occurred.");
        } finally {
            setGenerating(false);
        }
    };

    useEffect(() => {
        setTimeout(() => setLoading(false), 800);
    }, []);

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white">
                <Loader2 className="w-8 h-8 text-slate-400 animate-spin mb-4" />
                <p className="text-slate-400 text-xs font-bold tracking-widest uppercase">Preparing Space...</p>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-white min-h-screen text-slate-800" dir={dir}>
            {/* Minimal Header */}
            <div className="max-w-6xl mx-auto px-6 pt-16 pb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] tracking-widest uppercase">
                            <BrainCircuit size={16} />
                            Academy
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 uppercase">
                            {content?.academyTitle || "Smart Mentor"}
                        </h1>
                        <p className="text-slate-500 font-medium max-w-xl">
                            A focused career path based on your diagnostic results. Simple, direct, and effective.
                        </p>
                    </div>

                    {!generating && (
                        <button
                            onClick={generateMentorContent}
                            className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-blue-600 transition-all flex items-center gap-3 shadow-lg active:scale-95"
                        >
                            {content ? <Zap size={18} /> : <Play size={18} fill="white" />}
                            {content ? "Regenerate Path" : "Start Path"}
                        </button>
                    )}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {generating ? (
                    <motion.div
                        key="gen"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="max-w-6xl mx-auto px-6 py-24 flex flex-col items-center justify-center"
                    >
                        <div className="w-16 h-16 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin mb-6" />
                        <h2 className="text-xl font-bold text-slate-900">Building your custom modules...</h2>
                    </motion.div>
                ) : !content ? (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="max-w-6xl mx-auto px-6"
                    >
                        <div className="p-12 border border-slate-100 rounded-[2.5rem] bg-slate-50 flex flex-col items-center text-center space-y-6">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                                <ScrollText size={32} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-slate-900">Your Personalized Learning Path</h3>
                                <p className="text-slate-500 max-w-md mx-auto">Click the button above to analyze your diagnostic results and generate your custom mentorship academy.</p>
                            </div>
                            {error && (
                                <div className="text-red-500 font-bold text-sm bg-red-50 px-6 py-3 rounded-xl border border-red-100 italic">
                                    {error}
                                </div>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-6xl mx-auto px-6 pb-32 space-y-24"
                    >
                        {/* Clean Navigation */}
                        <div className="flex overflow-x-auto gap-4 py-2 no-scrollbar border-b border-slate-100">
                            {["modules", "simulation", "roadmap", "advice"].map((sec) => (
                                <button
                                    key={sec}
                                    onClick={() => setActiveSection(sec)}
                                    className={cn(
                                        "pb-4 px-2 text-sm font-black uppercase tracking-widest transition-all relative",
                                        activeSection === sec ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
                                    )}
                                >
                                    {sec}
                                    {activeSection === sec && (
                                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Modules Section */}
                        {activeSection === "modules" && (
                            <div className="grid lg:grid-cols-4 gap-12">
                                <div className="lg:col-span-1 space-y-4">
                                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Pillars</h5>
                                    {content.modules.map((mod, i) => (
                                        <button
                                            key={mod.id}
                                            onClick={() => setActiveModule(i)}
                                            className={cn(
                                                "w-full text-left p-6 rounded-2xl transition-all border",
                                                activeModule === i
                                                    ? "bg-slate-900 text-white border-slate-900 shadow-xl"
                                                    : "bg-white text-slate-500 border-slate-100 hover:border-slate-300"
                                            )}
                                        >
                                            <div className="text-[10px] font-black opacity-50 mb-1">MODULE 0{i + 1}</div>
                                            <div className="font-bold leading-tight">{mod.title}</div>
                                        </button>
                                    ))}
                                </div>

                                <div className="lg:col-span-3 space-y-12">
                                    <div className="space-y-8">
                                        <div className="inline-block px-4 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                                            {content.modules[activeModule].theme}
                                        </div>
                                        <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none">
                                            {content.modules[activeModule].title}
                                        </h3>
                                        <div className="prose prose-slate max-w-none text-slate-600 text-lg md:text-xl leading-relaxed font-medium">
                                            {content.modules[activeModule].content}
                                        </div>

                                        {/* Practical Drill - Simplified */}
                                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 space-y-3">
                                            <h4 className="flex items-center gap-2 font-black text-slate-900 text-sm uppercase tracking-widest">
                                                <Target size={16} className="text-blue-600" />
                                                Practical Drill
                                            </h4>
                                            <p className="text-slate-600 font-bold italic">
                                                &quot;{content.modules[activeModule].practicalExercise}&quot;
                                            </p>
                                        </div>

                                        {/* Quiz - Simple list */}
                                        <div className="pt-12 border-t border-slate-100 space-y-10">
                                            <h4 className="font-black text-xl text-slate-900 uppercase tracking-tight">Knowledge Audit</h4>
                                            {content.modules[activeModule].moduleQuiz.map((q, qIdx) => (
                                                <div key={qIdx} className="space-y-6">
                                                    <p className="font-bold text-slate-900 text-lg">{qIdx + 1}. {q.question}</p>
                                                    <div className="grid md:grid-cols-2 gap-3">
                                                        {q.options.map((opt, oIdx) => (
                                                            <button
                                                                key={oIdx}
                                                                onClick={() => {
                                                                    const cur = quizAnswers[activeModule] || [];
                                                                    const n = [...cur];
                                                                    n[qIdx] = oIdx;
                                                                    setQuizAnswers({ ...quizAnswers, [activeModule]: n });
                                                                }}
                                                                className={cn(
                                                                    "p-4 rounded-xl text-left text-sm font-bold border-2 transition-all",
                                                                    quizAnswers[activeModule]?.[qIdx] === oIdx
                                                                        ? "bg-slate-900 border-slate-900 text-white"
                                                                        : "bg-white border-slate-100 hover:border-slate-300 text-slate-600"
                                                                )}
                                                            >
                                                                {opt}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    {showQuizResults[activeModule] && (
                                                        <div className={cn(
                                                            "p-6 rounded-2xl text-sm font-bold border",
                                                            quizAnswers[activeModule]?.[qIdx] === q.correctAnswer ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-700 border-red-100"
                                                        )}>
                                                            {q.explanation}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => setShowQuizResults({ ...showQuizResults, [activeModule]: true })}
                                                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all"
                                            >
                                                Verify Answers
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Simulation Section - Cleaned */}
                        {activeSection === "simulation" && (
                            <div className="max-w-4xl mx-auto space-y-16">
                                <div className="text-center space-y-4">
                                    <div className="inline-block px-4 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-lg">Operational Game</div>
                                    <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">{content.gamifiedSimulation.title}</h3>
                                    <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.2em]">{content.gamifiedSimulation.mission}</p>
                                </div>

                                <div className="space-y-8">
                                    <div className="p-10 rounded-4xl bg-slate-900 text-white shadow-2xl relative overflow-hidden">
                                        <div className="relative z-10 space-y-8">
                                            <p className="text-2xl font-bold leading-tight">{content.gamifiedSimulation.challenges[currentChallenge].situation}</p>
                                            <div className="grid gap-3">
                                                {content.gamifiedSimulation.challenges[currentChallenge].choices.map((choice, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => {
                                                            const nc = [...simChoices];
                                                            nc[currentChallenge] = i;
                                                            setSimChoices(nc);
                                                            setShowCons(true);
                                                        }}
                                                        className={cn(
                                                            "p-5 rounded-xl text-left text-sm font-bold border-2 transition-all",
                                                            simChoices[currentChallenge] === i
                                                                ? "bg-white text-slate-900 border-white shadow-lg"
                                                                : "bg-white/5 border-white/10 hover:bg-white/10 text-white/70"
                                                        )}
                                                    >
                                                        {choice}
                                                    </button>
                                                ))}
                                            </div>
                                            {showCons && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className={cn(
                                                        "p-8 rounded-2xl text-base font-bold leading-relaxed border",
                                                        simChoices[currentChallenge] === content.gamifiedSimulation.challenges[currentChallenge].correctChoice
                                                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/20"
                                                            : "bg-red-500/20 text-red-100 border-red-500/20"
                                                    )}
                                                >
                                                    <p className="italic">&quot;{content.gamifiedSimulation.challenges[currentChallenge].consequence}&quot;</p>
                                                    <button
                                                        onClick={() => {
                                                            if (currentChallenge < content.gamifiedSimulation.challenges.length - 1) {
                                                                setCurrentChallenge(v => v + 1);
                                                                setShowCons(false);
                                                            } else {
                                                                alert("Simulation Completed.");
                                                            }
                                                        }}
                                                        className="mt-6 flex items-center gap-2 text-white border-b border-white/20 pb-1 text-xs font-black uppercase tracking-widest hover:border-white transition-all"
                                                    >
                                                        {currentChallenge < content.gamifiedSimulation.challenges.length - 1 ? "Next Step" : "End Simulation"} <ArrowRight size={14} />
                                                    </button>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Global Case Study - Simplified */}
                                <div className="p-12 border border-slate-100 rounded-[2.5rem] bg-white space-y-8">
                                    <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{content.globalCaseStudy.title}</h4>
                                    <div className="p-8 bg-blue-50/50 rounded-2xl border-l-4 border-blue-600 text-slate-700 font-medium italic">
                                        &quot;{content.globalCaseStudy.scenario}&quot;
                                    </div>
                                    <div className="space-y-4">
                                        <p className="font-bold text-slate-900 uppercase text-xs tracking-widest">The Dilemma</p>
                                        <p className="text-slate-600 font-medium">{content.globalCaseStudy.dilemma}</p>
                                    </div>
                                    <button
                                        onClick={() => alert(content.globalCaseStudy.expertSolution)}
                                        className="text-blue-600 font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all"
                                    >
                                        Reveal Expert Solution <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Roadmap Section - Minimal */}
                        {activeSection === "roadmap" && (
                            <div className="max-w-4xl mx-auto space-y-12">
                                <div className="space-y-4 text-center">
                                    <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">The Evolution Roadmap</h3>
                                    <p className="text-slate-500">Step-by-step milestones to clear your identified gaps.</p>
                                </div>
                                <div className="space-y-6">
                                    {content.actionPlan.map((plan, i) => (
                                        <div key={i} className="flex gap-8 group">
                                            <div className="flex flex-col items-center">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black shadow-lg">
                                                    {i + 1}
                                                </div>
                                                {i < content.actionPlan.length - 1 && <div className="w-0.5 flex-1 bg-slate-100 my-4" />}
                                            </div>
                                            <div className="pb-12 pt-1 flex-1">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">{plan.milestone}</h4>
                                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-lg">{plan.timeframe}</span>
                                                </div>
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    {plan.tasks.map((t, ti) => (
                                                        <div key={ti} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm font-bold text-slate-600">
                                                            <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
                                                            {t}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Advice Section - Clean Grid */}
                        {activeSection === "advice" && (
                            <div className="space-y-12">
                                <div className="text-center space-y-4">
                                    <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">The Expert Council</h3>
                                    <p className="text-slate-500 font-medium">Non-public industry insights tailored to your profile.</p>
                                </div>
                                <div className="grid md:grid-cols-3 gap-8">
                                    {content.advice.map((adv, i) => (
                                        <div key={i} className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 space-y-4 hover:border-blue-200 transition-colors">
                                            <Sparkles className="text-blue-600" size={24} />
                                            <p className="text-xl font-black text-slate-900 leading-tight">&quot;{adv}&quot;</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
