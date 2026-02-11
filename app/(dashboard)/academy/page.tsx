"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles,
    Loader2,
    ArrowLeft,
    PlayCircle,
    FileText,
    Eye,
    Monitor,
    ArrowRight,
    Trophy,
    Award,
    Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface Session {
    id: number;
    title: string;
    level: string;
}

interface Theme {
    id: number;
    title: string;
    description: string;
    sessions: Session[];
}

interface Slide {
    slideNumber: number;
    heading: string;
    bullets: string[];
    expertInsight: string;
    visualKey: string;
}

interface SlideDeck {
    title: string;
    slides: Slide[];
    summary: string;
}

interface ManualSession {
    _id: string;
    title: string;
    videoUrl: string;
}

interface ManualTheme {
    _id: string;
    title: string;
    instructor: string;
    status: string;
}

type SelectedTheme = (Theme | ManualTheme) & { isManual: boolean; sessions?: Session[] };

export default function AcademyPage() {
    const { dir } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [structure, setStructure] = useState<{ themes: Theme[] } | null>(null);
    const [manualThemes, setManualThemes] = useState<ManualTheme[]>([]);
    const [selectedTheme, setSelectedTheme] = useState<SelectedTheme | null>(null);
    const [manualSessions, setManualSessions] = useState<ManualSession[]>([]);
    const [isLoadingManualSessions, setIsLoadingManualSessions] = useState(false);
    const [currentSlides, setCurrentSlides] = useState<SlideDeck | null>(null);
    const [generatingSlides, setGeneratingSlides] = useState<string | null>(null);
    const [activeSlide, setActiveSlide] = useState(0);

    const fetchStructure = async () => {
        setLoading(true);
        try {
            const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
            const userId = userProfile.email || userProfile.fullName;
            const language = localStorage.getItem('selectedLanguage') || 'fr';

            // Fetch AI Structure
            const response = await fetch('/api/user/academy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, language })
            });
            const data = await response.json();
            if (data.success) {
                setStructure(data.structure);
            }

            // Fetch Manual Courses
            const manualRes = await fetch('/api/admin/courses');
            const manualData = await manualRes.json();
            if (Array.isArray(manualData)) {
                setManualThemes(manualData.filter((c: ManualTheme) => c.status === "Published"));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchManualSessions = async (courseId: string) => {
        setIsLoadingManualSessions(true);
        try {
            const res = await fetch(`/api/admin/sessions?courseId=${courseId}`);
            const data = await res.json();
            if (Array.isArray(data)) setManualSessions(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingManualSessions(false);
        }
    };

    const handleSelectTheme = (theme: Theme | ManualTheme, isManual: boolean) => {
        setSelectedTheme({ ...theme, isManual });
        if (isManual) {
            fetchManualSessions((theme as ManualTheme)._id);
        }
    };

    const generateSlides = async (topic: string) => {
        setGeneratingSlides(topic);
        try {
            const language = localStorage.getItem('selectedLanguage') || 'fr';
            const response = await fetch('/api/user/academy/slides', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, language })
            });
            const data = await response.json();
            if (data.success) {
                setCurrentSlides(data.content);
                setActiveSlide(0);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setGeneratingSlides(null);
        }
    };

    useEffect(() => {
        fetchStructure();
    }, []);

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Accessing Knowledge Archives...</p>
            </div>
        );
    }

    // Slide Viewer Modal
    return (
        <div className="flex-1 min-h-screen bg-slate-50/50 pb-20" dir={dir}>
            <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-600 font-black text-[10px] uppercase tracking-widest">
                            <Monitor size={14} />
                            Consulting Support
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none uppercase">
                            Strategic <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">Resources</span>
                        </h1>
                        <p className="text-slate-500 font-medium max-w-xl text-lg">
                            Structured consulting frameworks generated specifically to bridge your diagnostic gaps.
                        </p>
                    </div>

                    <button
                        onClick={fetchStructure}
                        disabled={loading}
                        className="bg-slate-900 shadow-xl text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-600 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
                    >
                        <Zap size={18} />
                        Regenerate Resources
                    </button>
                </header>

                <AnimatePresence mode="wait">
                    {!selectedTheme ? (
                        <motion.div
                            key="themes"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {/* AI Generated Themes */}
                            {structure?.themes.map((theme) => (
                                <div
                                    key={`ai-${theme.id}`}
                                    className="group bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl hover:shadow-2xl hover:border-blue-300 transition-all cursor-pointer relative overflow-hidden"
                                    onClick={() => handleSelectTheme(theme, false)}
                                >
                                    <div className="relative z-10 space-y-6">
                                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                                            <Sparkles size={28} />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">AI Personalized</div>
                                            <h3 className="text-2xl font-black text-slate-900 leading-tight">{theme.title}</h3>
                                            <p className="text-slate-500 font-medium text-sm leading-relaxed line-clamp-2">{theme.description}</p>
                                        </div>
                                        <div className="pt-4 flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest">
                                            View {theme.sessions.length} modules <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 p-8 opacity-5 scale-150 rotate-12 transition-transform group-hover:rotate-0 duration-700">
                                        <FileText size={100} />
                                    </div>
                                </div>
                            ))}

                            {/* Manual Admin Themes */}
                            {manualThemes.map((theme) => (
                                <div
                                    key={`manual-${theme._id}`}
                                    className="group bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl hover:shadow-2xl hover:border-indigo-300 transition-all cursor-pointer relative overflow-hidden"
                                    onClick={() => handleSelectTheme(theme, true)}
                                >
                                    <div className="relative z-10 space-y-6">
                                        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500">
                                            <Monitor size={28} />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Expert Curated</div>
                                            <h3 className="text-2xl font-black text-slate-900 leading-tight">{theme.title}</h3>
                                            <p className="text-slate-500 font-medium text-sm leading-relaxed line-clamp-2">{theme.instructor}</p>
                                        </div>
                                        <div className="pt-4 flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest">
                                            View Framework <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 p-8 opacity-5 scale-150 rotate-12 transition-transform group-hover:rotate-0 duration-700">
                                        <PlayCircle size={100} />
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="sessions"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <button
                                onClick={() => setSelectedTheme(null)}
                                className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest transition-colors mb-4"
                            >
                                <ArrowLeft size={14} /> Back to Knowledge Center
                            </button>

                            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-10 md:p-16 space-y-12">
                                <header className="space-y-4">
                                    <div className={cn(
                                        "inline-block px-4 py-1.5 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl",
                                        selectedTheme.isManual ? "bg-indigo-50 text-indigo-600" : "bg-blue-50 text-blue-600"
                                    )}>
                                        {selectedTheme.isManual ? "Curated Framework" : "AI Generated"}
                                    </div>
                                    <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none uppercase">{selectedTheme.title}</h2>
                                </header>

                                <div className="grid gap-4">
                                    {selectedTheme.isManual ? (
                                        isLoadingManualSessions ? (
                                            <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-indigo-600" /></div>
                                        ) : manualSessions.map((session: ManualSession, idx: number) => (
                                            <div
                                                key={session._id}
                                                className="group flex flex-col md:flex-row md:items-center justify-between p-8 rounded-4xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-indigo-200 hover:shadow-xl transition-all"
                                            >
                                                <div className="flex items-center gap-6">
                                                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center font-black text-sm shadow-sm">
                                                        {idx + 1}
                                                    </div>
                                                    <h4 className="text-xl font-black text-slate-900 tracking-tight">{session.title}</h4>
                                                </div>
                                                <div className="flex gap-4 mt-6 md:mt-0">
                                                    <a
                                                        href={session.videoUrl}
                                                        target="_blank"
                                                        title="Watch Session"
                                                        className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                                    >
                                                        <Eye size={24} />
                                                    </a>
                                                    <button
                                                        title="Download Support"
                                                        className="w-14 h-14 bg-white border border-slate-200 text-slate-400 rounded-2xl flex items-center justify-center hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm"
                                                    >
                                                        <Eye size={24} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        selectedTheme.sessions && (selectedTheme as Theme).sessions.map((session: Session, idx: number) => (
                                            <div
                                                key={session.id}
                                                className="group flex flex-col md:flex-row md:items-center justify-between p-8 rounded-4xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-blue-200 hover:shadow-xl transition-all"
                                            >
                                                <div className="flex items-center gap-6">
                                                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center font-black text-sm shadow-sm">
                                                        0{idx + 1}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <h4 className="text-xl font-black text-slate-900 tracking-tight">{session.title}</h4>
                                                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                            <Trophy size={14} /> Level: {session.level}
                                                        </div>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => generateSlides(session.title)}
                                                    disabled={generatingSlides === session.title}
                                                    className={cn(
                                                        "mt-6 md:mt-0 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all",
                                                        generatingSlides === session.title
                                                            ? "bg-slate-200 text-slate-400 animate-pulse"
                                                            : "bg-slate-900 text-white hover:bg-blue-600 shadow-xl"
                                                    )}
                                                >
                                                    {generatingSlides === session.title ? (
                                                        <>
                                                            <Loader2 className="animate-spin" size={16} /> Generating...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Sparkles size={16} /> Generate Framework
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Slide Viewer Overlay */}
            <AnimatePresence>
                {currentSlides && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-100 bg-slate-950 flex flex-col items-center justify-center overflow-hidden"
                    >
                        <button
                            onClick={() => setCurrentSlides(null)}
                            className="absolute top-10 right-10 text-white/50 hover:text-white transition-colors p-4 hover:bg-white/10 rounded-full"
                        >
                            <ArrowLeft size={32} />
                        </button>

                        <div className="w-full max-w-6xl px-6 h-full flex flex-col justify-center py-20">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeSlide}
                                    initial={{ opacity: 0, x: 50, scale: 0.98 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: -50, scale: 0.98 }}
                                    className="bg-white w-full min-h-[60vh] md:aspect-video rounded-4xl md:rounded-[4rem] shadow-2xl overflow-hidden flex flex-col"
                                >
                                    {/* Slide Content */}
                                    <div className="p-6 md:p-16 flex-1 flex flex-col justify-center space-y-8 md:space-y-12">
                                        <header className="space-y-4">
                                            <div className="text-blue-600 font-black text-xs uppercase tracking-[0.3em]">
                                                Slide {currentSlides.slides[activeSlide].slideNumber} / {currentSlides.slides.length}
                                            </div>
                                            <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none">
                                                {currentSlides.slides[activeSlide].heading}
                                            </h2>
                                        </header>

                                        <div className="grid md:grid-cols-2 gap-8 md:gap-16">
                                            <div className="space-y-4 md:space-y-6">
                                                {currentSlides.slides[activeSlide].bullets.map((bullet, i) => (
                                                    <div key={i} className="flex gap-4">
                                                        <div className="w-2 h-2 rounded-full bg-blue-600 mt-2.5 shrink-0" />
                                                        <p className="text-lg md:text-2xl text-slate-700 font-medium leading-relaxed">{bullet}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="space-y-8">
                                                <div className="p-6 md:p-10 bg-blue-50 rounded-4xl md:rounded-[3rem] border border-blue-100 flex flex-col justify-between h-full relative group">
                                                    <div className="space-y-4">
                                                        <h4 className="flex items-center gap-2 font-black text-blue-900 text-xs uppercase tracking-widest">
                                                            <Sparkles size={16} className="text-blue-600" />
                                                            Expert Interpretation
                                                        </h4>
                                                        <p className="text-blue-800 text-base md:text-lg font-bold leading-relaxed italic">
                                                            &quot;{currentSlides.slides[activeSlide].expertInsight}&quot;
                                                        </p>
                                                    </div>
                                                    <div className="absolute bottom-10 right-10 opacity-10 group-hover:scale-110 transition-transform">
                                                        <Award size={60} className="md:w-20 md:h-20" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Visual Representation Bar */}
                                    <div className="h-24 bg-slate-900 flex items-center px-12 justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest truncate max-w-md">
                                                Visual Concept: {currentSlides.slides[activeSlide].visualKey}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <button
                                                disabled={activeSlide === 0}
                                                onClick={() => setActiveSlide(v => v - 1)}
                                                className="w-12 h-12 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all disabled:opacity-20"
                                            >
                                                <ArrowLeft size={18} />
                                            </button>
                                            <button
                                                disabled={activeSlide === currentSlides.slides.length - 1}
                                                onClick={() => setActiveSlide(v => v + 1)}
                                                className="w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-all disabled:opacity-20"
                                            >
                                                <ArrowRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Viewer Controls Footer */}
                            <div className="mt-12 flex items-center justify-between px-4">
                                <div className="space-y-1">
                                    <h5 className="text-white font-black text-2xl tracking-tighter uppercase">{currentSlides.title}</h5>
                                    <p className="text-white/40 text-xs font-bold tracking-widest uppercase">Official AI-Generated Support v1.0</p>
                                </div>
                                <div className="flex gap-4">
                                    <button className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                                        Download PDF
                                    </button>
                                    <button
                                        onClick={() => setCurrentSlides(null)}
                                        className="px-8 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        Close Viewer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
