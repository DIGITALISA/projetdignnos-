"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles,
    Loader2,
    ArrowLeft,
    FileText,
    ArrowRight,
    Trophy,
    Award,
    Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

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

type SelectedTheme = Theme & { sessions: Session[] };

export default function AcademyPage() {
    const { dir } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [structure, setStructure] = useState<{ themes: Theme[] } | null>(null);
    const [selectedTheme, setSelectedTheme] = useState<SelectedTheme | null>(null);
    const [currentSlides, setCurrentSlides] = useState<SlideDeck | null>(null);
    const [generatingSlides, setGeneratingSlides] = useState<string | null>(null);
    const [activeSlide, setActiveSlide] = useState(0);

    const fetchStructure = async () => {
        setLoading(true);
        try {
            const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
            const userId = userProfile.email || userProfile.fullName;
            const language = localStorage.getItem('selectedLanguage') || 'fr';

            // Fetch AI Structure only
            const response = await fetch('/api/user/academy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, language })
            });
            const data = await response.json();
            if (data.success) {
                setStructure(data.structure);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectTheme = (theme: Theme) => {
        setSelectedTheme(theme);
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

    const handleDownloadDeck = async () => {
        if (!currentSlides) return;
        const button = document.getElementById('download-pdf-btn');
        if (button) {
            button.setAttribute('disabled', 'true');
            button.innerText = 'Preparing PDF...';
        }

        const language = localStorage.getItem('selectedLanguage') || 'fr';

        try {
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            // Create a temporary container for rendering slides
            const container = document.createElement('div');
            container.style.position = 'fixed';
            container.style.top = '-9999px';
            container.style.left = '-9999px';
            container.style.width = '297mm'; // A4 Landscape width
            container.style.height = '210mm'; // A4 Landscape height
            document.body.appendChild(container);

            for (let i = 0; i < currentSlides.slides.length; i++) {
                const slide = currentSlides.slides[i];
                
                // Render slide HTML
                const isRTL = language === 'ar';
                container.innerHTML = `
                    <div style="width: 297mm; height: 210mm; background-color: #ffffff; padding: 20mm; font-family: 'Arial', sans-serif; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box; direction: ${isRTL ? 'rtl' : 'ltr'}; text-align: ${isRTL ? 'right' : 'left'};">
                        
                        <!-- Header -->
                        <div style="margin-bottom: 10mm;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5mm; color: #2563eb; font-size: 10px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; direction: ltr;">
                                <span>SLIDE ${slide.slideNumber} / ${currentSlides.slides.length}</span>
                                <span>MA-TRAINING CONSULTING</span>
                            </div>
                            <h1 style="font-size: 32px; font-weight: 900; line-height: 1.2; color: #0f172a; margin: 0;">${slide.heading}</h1>
                        </div>

                        <!-- Content Grid -->
                        <div style="display: flex; gap: 15mm; flex: 1; flex-direction: ${isRTL ? 'row-reverse' : 'row'};">
                            
                            <!-- Bullets -->
                            <div style="flex: 1;">
                                ${slide.bullets.map(b => `
                                    <div style="display: flex; gap: 4mm; margin-bottom: 6mm; flex-direction: ${isRTL ? 'row' : 'row'};">
                                        <div style="width: 8px; height: 8px; background-color: #2563eb; border-radius: 50%; margin-top: 8px; flex-shrink: 0;"></div>
                                        <p style="font-size: 16px; line-height: 1.6; color: #334155; margin: 0; font-weight: 500;">${b}</p>
                                    </div>
                                `).join('')}
                            </div>

                            <!-- Insight -->
                            <div style="flex: 1;">
                                <div style="background-color: #eff6ff; border: 1px solid #dbeafe; border-radius: 20px; padding: 10mm; height: 100%; box-sizing: border-box;">
                                    <h4 style="color: #1e3a8a; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 5mm 0;">Expert Interpretation</h4>
                                    <p style="color: #1e40af; font-size: 16px; font-weight: 700; line-height: 1.6; font-style: italic; margin: 0;">"${slide.expertInsight}"</p>
                                </div>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div style="background-color: #0f172a; color: white; padding: 8mm 20mm; margin: 0 -20mm -20mm -20mm; display: flex; justify-content: space-between; align-items: center; direction: ltr;">
                             <div style="display: flex; align-items: center; gap: 3mm;">
                                <div style="width: 8px; height: 8px; background-color: #10b981; border-radius: 50%;"></div>
                                <span style="font-size: 10px; font-weight: bold; uppercase; letter-spacing: 2px; opacity: 0.8;">VISUAL: ${slide.visualKey}</span>
                             </div>
                             <span style="font-size: 10px; opacity: 0.5; letter-spacing: 1px;">© MA-TRAINING CONSULTING</span>
                        </div>
                    </div>
                `;

                // Capture
                const canvas = await html2canvas(container, {
                    scale: 2,
                    useCORS: true,
                    logging: false
                });

                const imgData = canvas.toDataURL('image/png');
                if (i > 0) pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
            }

            document.body.removeChild(container);
            pdf.save(`${currentSlides.title.replace(/\s+/g, '_')}_Deck.pdf`);

        } catch (error) {
            console.error("PDF Generation failed", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            if (button) {
                button.removeAttribute('disabled');
                button.innerText = 'Download PDF';
            }
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
                            <Sparkles size={14} />
                            AI-Powered Learning
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
                            {/* AI Generated Themes Only */}
                            {structure?.themes.map((theme) => (
                                <div
                                    key={`ai-${theme.id}`}
                                    className="group bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl hover:shadow-2xl hover:border-blue-300 transition-all cursor-pointer relative overflow-hidden"
                                    onClick={() => handleSelectTheme(theme)}
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
                                        <div className="flex items-center justify-between text-blue-600 font-black text-[10px] uppercase tracking-widest border-t border-slate-50 mt-4 pt-6">
                                            <span>{theme.sessions.length} Modules</span>
                                            <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 p-8 opacity-5 scale-150 rotate-12 transition-transform group-hover:rotate-0 duration-700">
                                        <FileText size={100} />
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
                                    <div className="inline-block px-4 py-1.5 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl bg-blue-50 text-blue-600">
                                        AI Generated
                                    </div>
                                    <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none uppercase">{selectedTheme.title}</h2>
                                </header>

                                <div className="grid gap-4">
                                    {
                                    selectedTheme.sessions.map((session: Session, idx: number) => (
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
                                }
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
                                    <div className="p-6 md:p-12 h-full overflow-y-auto custom-scrollbar flex flex-col space-y-8">
                                        <header className="space-y-4 shrink-0">
                                            <div className="text-blue-600 font-black text-xs uppercase tracking-[0.3em] flex items-center justify-between">
                                                <span>Slide {currentSlides.slides[activeSlide].slideNumber} / {currentSlides.slides.length}</span>
                                                <span className="opacity-50 hidden md:inline-block">MA-TRAINING CONSULTING</span>
                                            </div>
                                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-tight">
                                                {currentSlides.slides[activeSlide].heading}
                                            </h2>
                                        </header>

                                        <div className="grid md:grid-cols-2 gap-8 md:gap-12 pb-8">
                                            <div className="space-y-4 md:space-y-6">
                                                {currentSlides.slides[activeSlide].bullets.map((bullet, i) => (
                                                    <div key={i} className="flex gap-4">
                                                        <div className="w-2 h-2 rounded-full bg-blue-600 mt-2.5 shrink-0" />
                                                        <p className="text-lg md:text-xl text-slate-700 font-medium leading-relaxed">{bullet}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="space-y-8">
                                                <div className="p-6 md:p-8 bg-blue-50/80 rounded-3xl border border-blue-100 flex flex-col gap-4 relative group">
                                                    <div className="space-y-3">
                                                        <h4 className="flex items-center gap-2 font-black text-blue-900 text-xs uppercase tracking-widest">
                                                            <Sparkles size={16} className="text-blue-600" />
                                                            Expert Interpretation
                                                        </h4>
                                                        <p className="text-blue-900 text-base md:text-lg font-bold leading-relaxed italic">
                                                            &quot;{currentSlides.slides[activeSlide].expertInsight}&quot;
                                                        </p>
                                                    </div>
                                                    <div className="absolute bottom-4 right-4 opacity-5">
                                                        <Award size={80} />
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
                                    <button
                                        id="download-pdf-btn"
                                        onClick={handleDownloadDeck}
                                        className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
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
