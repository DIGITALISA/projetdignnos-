"use client";

import { useState, useEffect, useCallback } from "react";
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
import { TrialGate } from "@/components/ui/TrialGate";
import { useLanguage } from "@/components/providers/LanguageProvider";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

interface Theme {
    id: number;
    title: string;
    description: string;
    icon: string;
    lessonCount: number;
}

interface AcademyStructure {
    themes: Theme[];
}

interface Slide {
    id: number;
    title: string;
    content: string;
    practicalTakeaway: string;
    strategicInsight: string;
}

export default function AcademyPage() {
    const { t, language, dir } = useLanguage();
    const [structure, setStructure] = useState<AcademyStructure | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
    const [currentSlides, setCurrentSlides] = useState<Slide[] | null>(null);
    const [generatingSlides, setGeneratingSlides] = useState<number | null>(null);
    const [activeSlide, setActiveSlide] = useState(0);

    const fetchStructure = useCallback(async () => {
        setLoading(true);
        try {
            const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
            const userId = userProfile.email || userProfile.fullName;
            const res = await fetch(`/api/user/academy`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, language })
            });
            const data = await res.json();
            if (data.success) {
                setStructure(data.structure);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [language]);

    const handleThemeSelect = async (theme: Theme) => {
        setGeneratingSlides(theme.id);
        setSelectedTheme(theme);
        try {
            const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
            const userId = userProfile.email || userProfile.fullName;
            const res = await fetch('/api/user/academy/slides', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, themeId: theme.id, themeTitle: theme.title, language })
            });
            const data = await res.json();
            if (data.success) {
                setCurrentSlides(data.content);
                setActiveSlide(0);

                // Mark module as used for trial users on first generation
                const profile = JSON.parse(typeof window !== 'undefined' ? (localStorage.getItem('userProfile') || '{}') : '{}');
                if (profile.activationType === "Limited") {
                    const userId = profile.email || profile.fullName;
                    if (userId) {
                        fetch('/api/user/trial-gate', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ userId, module: 'strategic-resources', moduleHref: '/academy' })
                        }).then(() => {
                             window.dispatchEvent(new Event("profileUpdated"));
                        }).catch(console.error);
                    }
                }
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
            button.innerText = t.academy.preparingPdf;
        }

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

            for (let i = 0; i < currentSlides.length; i++) {
                const slide = currentSlides[i];
                const slideEl = document.createElement('div');
                slideEl.style.width = '297mm';
                slideEl.style.height = '210mm';
                slideEl.style.backgroundColor = '#0f172a'; // slate-900
                slideEl.style.color = 'white';
                slideEl.style.padding = '40px';
                slideEl.style.display = 'flex';
                slideEl.style.flexDirection = 'column';
                slideEl.style.justifyContent = 'center';
                slideEl.innerHTML = `
                    <div style="border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 40px;">
                        <h1 style="font-size: 32px; font-weight: 900; text-transform: uppercase;">${slide.title}</h1>
                    </div>
                    <div style="font-size: 20px; line-height: 1.6; margin-bottom: 40px; color: #cbd5e1;">${slide.content}</div>
                    <div style="display: grid; grid-template-cols: 1fr 1fr; gap: 40px; margin-top: auto;">
                        <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; border-left: 4px solid #3b82f6;">
                            <h3 style="font-size: 14px; font-weight: 900; text-transform: uppercase; color: #3b82f6; margin-bottom: 10px;">Strategic Insight</h3>
                            <p style="font-size: 16px;">${slide.strategicInsight}</p>
                        </div>
                        <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; border-left: 4px solid #f59e0b;">
                            <h3 style="font-size: 14px; font-weight: 900; text-transform: uppercase; color: #f59e0b; margin-bottom: 10px;">Practical Takeaway</h3>
                            <p style="font-size: 16px;">${slide.practicalTakeaway}</p>
                        </div>
                    </div>
                `;
                container.innerHTML = '';
                container.appendChild(slideEl);

                const canvas = await html2canvas(slideEl, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#0f172a'
                });

                const imgData = canvas.toDataURL('image/png');
                if (i > 0) pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
            }

            pdf.save(`${selectedTheme?.title || 'Academy'}_Strategic_Deck.pdf`);
            document.body.removeChild(container);
        } catch (error) {
            console.error("PDF generation failed:", error);
        } finally {
            if (button) {
                button.removeAttribute('disabled');
                button.innerText = t.academy.downloadPdf;
            }
        }
    };

    useEffect(() => {
        fetchStructure();
    }, [fetchStructure]);

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{t.academy.accessingArchives}</p>
            </div>
        );
    }

    return (
        <TrialGate 
            module="strategic-resources" 
            moduleHref="/academy"
            dir={dir}
            manualMark={true}
        >
        <div className={`min-h-screen bg-white ${dir === 'rtl' ? 'font-arabic' : ''}`} dir={dir}>
            <div className="max-w-7xl mx-auto px-6 py-12 space-y-12 pb-32">
                {/* Header */}
                <header className={cn("flex flex-col md:flex-row md:items-end justify-between gap-6", dir === 'rtl' ? 'md:flex-row-reverse' : '')}>
                    <div className={cn("space-y-3", dir === 'rtl' ? 'text-right' : 'text-left')}>
                        <div className={cn("inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-600 font-black text-[10px] uppercase tracking-widest", dir === 'rtl' ? 'flex-row-reverse' : '')}>
                            <Sparkles size={14} />
                            {t.academy.badge}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none uppercase">
                            {dir === 'rtl' ? (
                                <><span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">الموارد</span> الاستراتيجية</>
                            ) : (
                                <>Strategic <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">Resources</span></>
                            )}
                        </h1>
                        <p className="text-slate-500 font-medium max-w-xl text-lg">
                            {t.academy.subtitle}
                        </p>
                    </div>

                    <button
                        onClick={fetchStructure}
                        disabled={loading}
                        className={cn("bg-slate-900 shadow-xl text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-600 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50", dir === 'rtl' ? 'flex-row-reverse' : '')}
                    >
                        <Zap size={18} />
                        {t.academy.regenerate}
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
                            {structure?.themes.map((theme) => (
                                <div
                                    key={`ai-${theme.id}`}
                                    className="group relative flex flex-col bg-slate-50 border border-slate-100 p-10 rounded-[2.5rem] hover:bg-white hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
                                >
                                    <div className="absolute top-8 right-8 w-16 h-16 bg-blue-100/50 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100">
                                        <ArrowRight className={cn("text-blue-600", dir === 'rtl' ? 'rotate-180' : '')} />
                                    </div>

                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100 mb-8 transition-transform group-hover:scale-110">
                                        <Sparkles size={24} />
                                    </div>

                                    <div className="space-y-4 flex-1">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{theme.lessonCount} Modules</div>
                                        <h3 className="text-2xl font-black text-slate-900 leading-tight uppercase tracking-tight">{theme.title}</h3>
                                        <p className="text-slate-500 font-medium leading-relaxed">{theme.description}</p>
                                    </div>

                                    <button
                                        onClick={() => handleThemeSelect(theme)}
                                        disabled={generatingSlides !== null}
                                        className="mt-10 px-6 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-blue-600 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                                    >
                                        {generatingSlides === theme.id ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : (
                                            <>Access Modules <ArrowRight size={18} className={dir === 'rtl' ? 'rotate-180' : ''} /></>
                                        )}
                                    </button>
                                </div>
                            ))}
                        </motion.div>
                    ) : !currentSlides ? (
                        <motion.div
                            key="loading-slides"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-32 space-y-6"
                        >
                            <Loader2 size={48} className="text-blue-600 animate-spin" />
                            <p className="text-slate-400 font-black uppercase tracking-widest text-xs animate-pulse">Architecting Strategic Content...</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="slides"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-12"
                        >
                            <button
                                onClick={() => setSelectedTheme(null)}
                                className={cn("inline-flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-900 transition-all", dir === 'rtl' ? 'flex-row-reverse' : '')}
                            >
                                <ArrowLeft size={14} className={dir === 'rtl' ? 'rotate-180' : ''} /> {t.academy.back}
                            </button>

                            <div className="grid lg:grid-cols-12 gap-12">
                                <div className="lg:col-span-8 space-y-8">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={activeSlide}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="bg-slate-900 text-white p-12 md:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col min-h-[500px]"
                                        >
                                            <div className="flex-1 space-y-8">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Digitalisa Academy // 0{activeSlide + 1}</span>
                                                    <Trophy className="text-blue-500/20" size={32} />
                                                </div>
                                                <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none uppercase">{currentSlides[activeSlide].title}</h2>
                                                <p className="text-xl md:text-2xl text-slate-300 font-medium leading-relaxed">{currentSlides[activeSlide].content}</p>
                                            </div>

                                            <div className="mt-12 grid md:grid-cols-2 gap-8 pt-12 border-t border-white/5">
                                                <div className="space-y-3">
                                                    <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Strategic Insight</h4>
                                                    <p className="text-slate-400 italic">&quot;{currentSlides[activeSlide].strategicInsight}&quot;</p>
                                                </div>
                                                <div className="space-y-3">
                                                    <h4 className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Practical Takeaway</h4>
                                                    <p className="text-slate-400 italic">&quot;{currentSlides[activeSlide].practicalTakeaway}&quot;</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>

                                    <div className="flex items-center justify-between px-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setActiveSlide(v => Math.max(0, v - 1))}
                                                disabled={activeSlide === 0}
                                                className="p-4 rounded-2xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 transition-all active:scale-95"
                                            >
                                                <ArrowLeft size={20} />
                                            </button>
                                            <button
                                                onClick={() => setActiveSlide(v => Math.min(currentSlides.length - 1, v + 1))}
                                                disabled={activeSlide === currentSlides.length - 1}
                                                className="p-4 rounded-2xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 transition-all active:scale-95"
                                            >
                                                <ArrowRight size={20} />
                                            </button>
                                        </div>

                                        <button
                                            id="download-pdf-btn"
                                            onClick={handleDownloadDeck}
                                            className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-3 active:scale-95"
                                        >
                                            <FileText size={18} />
                                            {t.academy.downloadPdf}
                                        </button>
                                    </div>
                                </div>

                                <div className="lg:col-span-4 space-y-6">
                                    <div className="bg-slate-50 p-8 rounded-4xl border border-slate-100 space-y-6">
                                        <h4 className="font-black uppercase tracking-widest text-slate-900">Module Progress</h4>
                                        <div className="space-y-4">
                                            {currentSlides.map((slide, i) => (
                                                <button
                                                    key={slide.id}
                                                    onClick={() => setActiveSlide(i)}
                                                    className={cn(
                                                        "w-full text-left p-4 rounded-xl transition-all border flex items-center justify-between",
                                                        activeSlide === i
                                                            ? "bg-white border-blue-200 shadow-sm"
                                                            : "border-transparent text-slate-400 hover:text-slate-600"
                                                    )}
                                                >
                                                    <span className="font-bold text-sm truncate pr-4">{i + 1}. {slide.title}</span>
                                                    {i < activeSlide ? <Award className="text-blue-500" size={16} /> : <div className="w-1 h-1 rounded-full bg-slate-200" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
        </TrialGate>
    );
}

