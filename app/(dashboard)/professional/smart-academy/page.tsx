"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowRight,
    Award,
    Zap,
    Brain,
    Target,
    ShieldCheck,
    Flame,
    Rocket,
    GraduationCap,
    Loader2,
    ArrowLeft,
    FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const IconMap: Record<string, React.ElementType> = {
    Brain, Target, Zap, ShieldCheck, Flame, Rocket, GraduationCap, Award
};

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

export default function ProfessionalSmartAcademyPage() {
    const { language, dir } = useLanguage();
    const isRtl = dir === 'rtl';

    // Minimal translation object for this page
    const trans = {
        ar: {
            title: "الاكاديمية الذكية",
            subtitle: "مناهج تدريبية استراتيجية مصممة خصيصاً لسد الفجوات في تشخيصك المهني.",
            badge: "حصري للمهنيين",
            regenerate: "توليد مناهج جديدة",
            accessModules: "الوصول للوحدات",
            accessing: "تهيئة المناهج...",
            building: "بناء المحتوى الأكاديمي...",
            back: "العودة للمناهج",
            downloadPdf: "تحميل التقرير",
            preparingPdf: "جاري التحضير...",
            emptyMsg: "لم يكتمل التشخيص بعد. لا توجد نقاط ضعف لتحليلها.",
            retry: "إعادة المحاولة"
        },
        en: {
            title: "Smart Academy",
            subtitle: "Strategic training modules curated specifically to bridge the gaps in your professional diagnosis.",
            badge: "Professional Exclusive",
            regenerate: "Regenerate Curriculum",
            accessModules: "Access Modules",
            accessing: "Initializing Curriculum...",
            building: "Architecting Academic Content...",
            back: "Back to Curriculum",
            downloadPdf: "Download PDF",
            preparingPdf: "Preparing...",
            emptyMsg: "Diagnosis incomplete. No critical gaps found to analyze.",
            retry: "Retry"
        },
        fr: {
            title: "Académie Intelligente",
            subtitle: "Modules de formation stratégiques conçus spécifiquement pour combler les lacunes de votre diagnostic.",
            badge: "Exclusif Professionnel",
            regenerate: "Régénérer le programme",
            accessModules: "Accéder aux Modules",
            accessing: "Initialisation du programme...",
            building: "Création du contenu...",
            back: "Retour aux modules",
            downloadPdf: "Télécharger le PDF",
            preparingPdf: "Préparation...",
            emptyMsg: "Diagnostic incomplet. Aucune lacune trouvée pour l'analyse.",
            retry: "Réessayer"
        }
    }[language as 'ar' | 'en' | 'fr'] || {
        title: "Smart Academy",
        subtitle: "Strategic training modules curated specifically to bridge the gaps in your professional diagnosis.",
        badge: "Professional Exclusive",
        regenerate: "Regenerate Curriculum",
        accessModules: "Access Modules",
        accessing: "Initializing Curriculum...",
        building: "Architecting Academic Content...",
        back: "Back to Curriculum",
        downloadPdf: "Download PDF",
        preparingPdf: "Preparing...",
        emptyMsg: "Diagnosis incomplete. No critical gaps found to analyze.",
        retry: "Retry"
    };

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
            const email = userProfile.email || userProfile.fullName;

            const res = await fetch(`/api/professional/smart-academy`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, language })
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
            const email = userProfile.email || userProfile.fullName;
            const res = await fetch('/api/professional/smart-academy/module', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, themeTitle: theme.title, language })
            });
            const data = await res.json();
            if (data.success) {
                setCurrentSlides(data.slides);
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
            button.innerText = trans.preparingPdf;
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
                slideEl.style.backgroundColor = '#020617'; // slate-950
                slideEl.style.color = 'white';
                slideEl.style.padding = '40px';
                slideEl.style.display = 'flex';
                slideEl.style.flexDirection = 'column';
                slideEl.style.justifyContent = 'center';
                slideEl.innerHTML = `
                    <div style="border-bottom: 2px solid #6366f1; padding-bottom: 20px; margin-bottom: 40px;">
                        <span style="display:block; font-size: 14px; font-weight: 900; color: #818cf8; letter-spacing: 2px; text-transform: uppercase;">MA TRAINING // ${trans.title}</span>
                        <h1 style="font-size: 32px; font-weight: 900; text-transform: uppercase;">${slide.title}</h1>
                    </div>
                    <div style="font-size: 20px; line-height: 1.6; margin-bottom: 40px; color: #cbd5e1;">${slide.content}</div>
                    <div style="display: grid; grid-template-cols: 1fr 1fr; gap: 40px; margin-top: auto;">
                        <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; border-left: 4px solid #6366f1;">
                            <h3 style="font-size: 14px; font-weight: 900; text-transform: uppercase; color: #818cf8; margin-bottom: 10px;">Strategic Insight</h3>
                            <p style="font-size: 16px;">${slide.strategicInsight}</p>
                        </div>
                        <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; border-left: 4px solid #10b981;">
                            <h3 style="font-size: 14px; font-weight: 900; text-transform: uppercase; color: #34d399; margin-bottom: 10px;">Practical Takeaway</h3>
                            <p style="font-size: 16px;">${slide.practicalTakeaway}</p>
                        </div>
                    </div>
                `;
                container.innerHTML = '';
                container.appendChild(slideEl);

                const canvas = await html2canvas(slideEl, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#020617'
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
                button.innerText = trans.downloadPdf;
            }
        }
    };

    useEffect(() => {
        fetchStructure();
    }, [fetchStructure]);

    if (loading) {
        return (
            <div className="flex-1 min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">{trans.accessing}</p>
            </div>
        );
    }

    if (!structure || structure.themes.length === 0) {
        return (
            <div className="flex-1 min-h-[80vh] flex flex-col items-center justify-center p-8 bg-slate-50">
                <Brain className="w-20 h-20 text-indigo-200 mb-6" />
                <p className="text-slate-400 font-black uppercase tracking-widest text-sm max-w-sm text-center">
                    {trans.emptyMsg}
                </p>
                <button
                    onClick={fetchStructure}
                    className="mt-6 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-wide text-xs hover:bg-indigo-600 transition-all"
                >
                    {trans.retry}
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-12 pb-32">
            {/* Header */}
            <header className={cn("flex flex-col md:flex-row md:items-end justify-between gap-6", isRtl ? 'md:flex-row-reverse' : '')}>
                <div className={cn("space-y-3", isRtl ? 'text-right' : 'text-left')}>
                    <div className={cn("inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 font-black text-[10px] uppercase tracking-widest", isRtl ? 'flex-row-reverse' : '')}>
                        <GraduationCap size={14} />
                        {trans.badge}
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none uppercase">
                        {trans.title}
                    </h1>
                    <p className="text-slate-500 font-medium max-w-xl text-sm md:text-base leading-relaxed">
                        {trans.subtitle}
                    </p>
                </div>

                <button
                    onClick={fetchStructure}
                    disabled={loading}
                    className={cn(
                        "bg-slate-900 shadow-xl shadow-slate-200 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-600 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50",
                        isRtl ? 'flex-row-reverse' : ''
                    )}
                >
                    <Zap size={18} />
                    {trans.regenerate}
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
                        {structure.themes.map((theme) => {
                            const TIcon = IconMap[theme.icon] || Brain;
                            return (
                                <div
                                    key={theme.id}
                                    className={cn(
                                        "group relative flex flex-col bg-white border border-slate-100 p-10 rounded-[2.5rem] hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500",
                                        isRtl && "text-right"
                                    )}
                                >
                                    <div className={cn("absolute top-8 w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100", isRtl ? "left-8" : "right-8")}>
                                        <ArrowRight className={cn("text-indigo-600", isRtl && "rotate-180")} />
                                    </div>

                                    <div className={cn("w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 mb-8 transition-transform group-hover:scale-110", isRtl && "ml-auto")}>
                                        <TIcon size={24} />
                                    </div>

                                    <div className="space-y-4 flex-1">
                                        <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{theme.lessonCount} Modules</div>
                                        <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-tight tracking-tight uppercase">{theme.title}</h3>
                                        <p className="text-slate-500 font-medium leading-relaxed text-sm">{theme.description}</p>
                                    </div>

                                    <button
                                        onClick={() => handleThemeSelect(theme)}
                                        disabled={generatingSlides !== null}
                                        className={cn("mt-10 px-6 py-4 bg-slate-50 border border-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-white rounded-2xl font-black transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50", isRtl && "flex-row-reverse")}
                                    >
                                        {generatingSlides === theme.id ? (
                                            <Loader2 size={18} className="animate-spin text-indigo-500" />
                                        ) : (
                                            <>
                                                {trans.accessModules} 
                                                <ArrowRight size={18} className={cn("group-hover:translate-x-1 transition-transform", isRtl && "rotate-180 group-hover:-translate-x-1")} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </motion.div>
                ) : !currentSlides ? (
                    <motion.div
                        key="loading-slides"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-32 space-y-6"
                    >
                        <Loader2 size={48} className="text-indigo-600 animate-spin" />
                        <p className="text-slate-400 font-black uppercase tracking-widest text-xs animate-pulse">
                            {trans.building}
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="slides"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <button
                            onClick={() => setSelectedTheme(null)}
                            className={cn("inline-flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-900 transition-all bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm", isRtl && "flex-row-reverse")}
                        >
                            <ArrowLeft size={14} className={isRtl ? 'rotate-180' : ''} /> {trans.back}
                        </button>

                        <div className={cn("grid lg:grid-cols-12 gap-8", isRtl && "rtl")}>
                            <div className="lg:col-span-8 space-y-8">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeSlide}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className={cn("bg-slate-950 text-white p-10 md:p-14 rounded-5xl shadow-2xl relative overflow-hidden flex flex-col min-h-[500px] border border-white/5", isRtl && "text-right")}
                                    >
                                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                                            <GraduationCap size={200} />
                                        </div>
                                        <div className="relative z-10 flex-1 space-y-8">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                                                    Module // 0{activeSlide + 1}
                                                </span>
                                            </div>
                                            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none uppercase">
                                                {currentSlides[activeSlide]?.title}
                                            </h2>
                                            <p className="text-lg md:text-xl text-slate-300 font-medium leading-relaxed">
                                                {currentSlides[activeSlide]?.content}
                                            </p>
                                        </div>

                                        <div className="relative z-10 mt-12 grid md:grid-cols-2 gap-8 pt-10 border-t border-white/10">
                                            <div className="space-y-3 bg-white/5 p-6 rounded-3xl border border-white/5 backdrop-blur-sm">
                                                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Strategic Insight</h4>
                                                <p className="text-slate-300 text-sm leading-relaxed">&quot;{currentSlides[activeSlide]?.strategicInsight}&quot;</p>
                                            </div>
                                            <div className="space-y-3 bg-emerald-500/10 p-6 rounded-3xl border border-emerald-500/20 backdrop-blur-sm">
                                                <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Practical Takeaway</h4>
                                                <p className="text-emerald-100 text-sm leading-relaxed">&quot;{currentSlides[activeSlide]?.practicalTakeaway}&quot;</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>

                                <div className={cn("flex items-center justify-between px-2", isRtl && "flex-row-reverse")}>
                                    <div className={cn("flex gap-2", isRtl && "flex-row-reverse")}>
                                        <button
                                            onClick={() => setActiveSlide(v => Math.max(0, v - 1))}
                                            disabled={activeSlide === 0}
                                            className="p-4 rounded-2xl bg-white border border-slate-100 text-slate-700 hover:bg-slate-50 disabled:opacity-30 transition-all active:scale-95 shadow-sm"
                                        >
                                            <ArrowLeft size={20} className={isRtl ? "rotate-180" : ""} />
                                        </button>
                                        <button
                                            onClick={() => setActiveSlide(v => Math.min(currentSlides.length - 1, v + 1))}
                                            disabled={activeSlide === currentSlides.length - 1}
                                            className="p-4 rounded-2xl bg-white border border-slate-100 text-slate-700 hover:bg-slate-50 disabled:opacity-30 transition-all active:scale-95 shadow-sm"
                                        >
                                            <ArrowRight size={20} className={isRtl ? "rotate-180" : ""} />
                                        </button>
                                    </div>

                                    <button
                                        id="download-pdf-btn"
                                        onClick={handleDownloadDeck}
                                        className={cn("px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-3 active:scale-95 shadow-xl shadow-indigo-200", isRtl && "flex-row-reverse")}
                                    >
                                        <FileText size={18} />
                                        {trans.downloadPdf}
                                    </button>
                                </div>
                            </div>

                            <div className="lg:col-span-4 space-y-6">
                                <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm space-y-6">
                                    <h4 className={cn("font-black uppercase tracking-widest text-slate-900 text-sm", isRtl && "text-right")}>
                                        Curriculum Flow
                                    </h4>
                                    <div className="space-y-3">
                                        {currentSlides.map((slide, i) => (
                                            <button
                                                key={slide.id || i}
                                                onClick={() => setActiveSlide(i)}
                                                className={cn(
                                                    "w-full text-left p-4 rounded-2xl transition-all border flex items-center justify-between gap-4",
                                                    activeSlide === i
                                                        ? "bg-slate-900 border-slate-800 shadow-lg text-white"
                                                        : "bg-slate-50 border-slate-100 text-slate-500 hover:text-slate-900 hover:border-slate-200",
                                                    isRtl && "flex-row-reverse text-right"
                                                )}
                                            >
                                                <span className="font-bold text-xs truncate flex-1">
                                                    {i + 1}. {slide.title}
                                                </span>
                                                {i < activeSlide ? (
                                                    <Award className={cn(activeSlide === i ? "text-indigo-400" : "text-emerald-500")} size={16} />
                                                ) : (
                                                    <div className={cn("w-1.5 h-1.5 rounded-full", activeSlide === i ? "bg-indigo-400" : "bg-slate-300")} />
                                                )}
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
    );
}
