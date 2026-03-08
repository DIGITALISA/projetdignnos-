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
    Globe,
    Mail,
    Lock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { TrialGate } from "@/components/ui/TrialGate";

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
    support?: {
        adminEmail: string;
        adminWhatsapp: string;
    }
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
    const { t, dir, language } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [activeMilestone, setActiveMilestone] = useState<number>(0);
    const [isUsed, setIsUsed] = useState(false);
    const [isStudentFreeTrial, setIsStudentFreeTrial] = useState(false);
    
    // New Form States
    const [shouldShowForm, setShouldShowForm] = useState(true);
    const [currentJob, setCurrentJob] = useState("");
    const [tasksDone, setTasksDone] = useState("");
    const [futureJob, setFutureJob] = useState("");

    // Check if user is Student Free Trial and if ai-path was already used
    useEffect(() => {
        const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
        const isTrial = profile.plan === 'Student' && 
                        (profile.role === 'Free Tier' || profile.role === 'Trial User');
        setIsStudentFreeTrial(isTrial);
        if (isTrial) {
            const visited = profile.visitedModules || [];
            setIsUsed(visited.includes('/roadmap'));
        }
    }, []);

    const fetchRoadmap = async () => {
        // If Student Free Trial and already used, block the fetch
        if (isStudentFreeTrial && isUsed) {
            return; // Don't allow regeneration
        }
        setLoading(true);
        try {
            const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
            const userId = userProfile._id || userProfile.id || userProfile.email;
            const language = localStorage.getItem('selectedLanguage') || 'fr';

            const response = await fetch('/api/user/roadmap', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, language, currentJob, tasksDone, futureJob })
            });

            const data = await response.json();
            if (data.success) {
                setRoadmap({
                    ...data.roadmap,
                    support: data.support
                });
                setShouldShowForm(false);
                // Load completed steps from localStorage
                const savedProgress = localStorage.getItem(`roadmap_progress_${userId}`);
                if (savedProgress) {
                    setCompletedSteps(JSON.parse(savedProgress));
                }

                // Track visit for limited students only after successful roadmap generation
                const userProfileLocal = JSON.parse(localStorage.getItem('userProfile') || '{}');
                if (userProfileLocal.plan === "Student" && userProfileLocal.activationType === "Limited") {
                    fetch('/api/user/trial-gate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId, module: 'strategic-roadmap', moduleHref: '/roadmap' })
                    }).then(() => {
                        window.dispatchEvent(new Event("profileUpdated"));
                    }).catch(err => console.error("Track visit error:", err));
                }
            }
        } catch (error) {
            console.error("Failed to fetch roadmap", error);
        } finally {
            setLoading(false);
        }
    };

    // Do not auto-fetch on mount, let user fill the form
    useEffect(() => { 
        // We can check if a roadmap already exists in localStorage or similar, but for now we'll require the form
        setLoading(false); 
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
            <TrialGate module="strategic-roadmap" moduleHref="/roadmap" dir={dir}>
                <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
                    <div className="relative">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <TrendingUp size={16} className="text-blue-600" />
                        </div>
                    </div>
                    <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-[10px]">{t.roadmap.architecting}</p>
                </div>
            </TrialGate>
        );
    }

    if (!roadmap || shouldShowForm) {
        return (
            <TrialGate module="strategic-roadmap" moduleHref="/roadmap" dir={dir}>
                <div className={`min-h-[80vh] flex items-center justify-center p-6 ${dir === 'rtl' ? 'font-arabic' : ''}`} dir={dir}>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white max-w-2xl w-full p-10 rounded-[2.5rem] shadow-2xl border border-blue-100"
                    >
                        <div className="text-center mb-10 space-y-4">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <Target size={32} />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                                {dir === 'rtl' ? 'تحليل مسارك المهني التفصيلي' : 'Detailed Career Analysis'}
                            </h2>
                            <p className="text-slate-500 font-medium">
                                {dir === 'rtl' 
                                    ? 'لتقديم خارطة طريق احترافية وواقعية لك، يرجى تزويدنا بالتفاصيل الدقيقة لمهنتك ومهامك وأهدافك المستقبلية.'
                                    : 'To provide a highly professional and realistic roadmap, please provide detailed information about your current state and future goals.'}
                            </p>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); fetchRoadmap(); }} className="space-y-6">
                            <div className="space-y-2">
                                <label className={cn("block text-sm font-bold text-slate-700 uppercase tracking-wide", dir === 'rtl' ? 'text-right' : 'text-left')}>
                                    {dir === 'rtl' ? 'منصبك الحالي (أو طالب / باحث عن عمل)' : 'Current Position (or Student/Jobseeker)'}
                                </label>
                                <input
                                    required
                                    type="text"
                                    value={currentJob}
                                    onChange={e => setCurrentJob(e.target.value)}
                                    className={cn("w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all", dir === 'rtl' ? 'text-right' : 'text-left')}
                                    placeholder={dir === 'rtl' ? 'مثال: مهندس برمجيات، طالب جامعي...' : 'e.g., Software Engineer, University Student...'}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className={cn("block text-sm font-bold text-slate-700 uppercase tracking-wide", dir === 'rtl' ? 'text-right' : 'text-left')}>
                                    {dir === 'rtl' ? 'تفاصيل مهامك أو دراساتك (ماذا تفعل بالضبط؟)' : 'Details of your tasks or studies (What do you actually do?)'}
                                </label>
                                <textarea
                                    required
                                    value={tasksDone}
                                    onChange={e => setTasksDone(e.target.value)}
                                    rows={4}
                                    className={cn("w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-none", dir === 'rtl' ? 'text-right' : 'text-left')}
                                    placeholder={dir === 'rtl' ? 'اذكر المهام التي تقوم بها يومياً أو المشاريع التي عملت عليها...' : 'Mention the daily tasks or projects you worked on...'}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className={cn("block text-sm font-bold text-slate-700 uppercase tracking-wide", dir === 'rtl' ? 'text-right' : 'text-left')}>
                                    {dir === 'rtl' ? 'المنصب الذي تتوقع وتحلم بالوصول إليه بعد 3 سنوات' : 'The position you expect and dream to reach in 3 years'}
                                </label>
                                <input
                                    required
                                    type="text"
                                    value={futureJob}
                                    onChange={e => setFutureJob(e.target.value)}
                                    className={cn("w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all", dir === 'rtl' ? 'text-right' : 'text-left')}
                                    placeholder={dir === 'rtl' ? 'مثال: مدير تقني، رائد أعمال...' : 'e.g., Technical Director, Entrepreneur...'}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !currentJob || !tasksDone || !futureJob || (isStudentFreeTrial && isUsed)}
                                className="w-full mt-6 px-8 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all hover:bg-blue-600 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl"
                            >
                                {loading && <Loader2 size={18} className="animate-spin" />}
                                {dir === 'rtl' ? 'توليد خارطة الطريق الاحترافية' : 'Generate Professional Roadmap'} <Zap size={18} className={dir === 'rtl' ? 'rotate-180': ''}/>
                            </button>
                            
                            {isStudentFreeTrial && isUsed && (
                                <p className="text-red-500 text-xs font-bold text-center italic mt-2">
                                    {dir === 'rtl' ? 'لقد استنفدت المحاولة المجانية لهذا القسم.' : 'You have exhausted the free trial for this module.'}
                                </p>
                            )}
                        </form>
                    </motion.div>
                </div>
            </TrialGate>
        );
    }

    return (
        <TrialGate 
            module="strategic-roadmap" 
            moduleHref="/roadmap"
            dir={dir}
        >
        <div className={`min-h-screen bg-slate-50/30 ${dir === 'rtl' ? 'font-arabic' : ''}`} dir={dir}>
            <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-16 pb-32">
            {/* Header */}
            <header className={cn("flex flex-col lg:flex-row lg:items-center justify-between gap-8 pt-8 relative", dir === 'rtl' ? 'lg:flex-row-reverse' : '')}>
                <div className={cn("absolute top-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -mt-32 pointer-events-none", dir === 'rtl' ? 'right-0 -mr-32' : 'left-0 -ml-32')} />
                
                <div className={cn("space-y-4 relative z-10", dir === 'rtl' ? 'text-right' : 'text-left')}>
                    <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-500/20", dir === 'rtl' ? 'flex-row-reverse' : '')}>
                        <Sparkles size={12} className="animate-pulse" /> {t.roadmap.badge}
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-950 tracking-tight leading-[0.9] uppercase">
                        {dir === 'rtl' ? (
                            <><span className="text-transparent bg-clip-text bg-linear-to-b from-blue-600 to-indigo-700">خارطة</span> الطريق</>
                        ) : (
                            <>Career <span className="text-transparent bg-clip-text bg-linear-to-b from-blue-600 to-indigo-700">Roadmap</span></>
                        )}
                    </h1>
                    <p className="text-slate-500 font-medium max-w-xl text-xl leading-relaxed">
                        {t.roadmap.subtitle}
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    {isStudentFreeTrial && isUsed ? (
                        <div className={cn(
                            "group relative px-8 py-4 bg-slate-200 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-xs cursor-not-allowed flex items-center gap-3"
                        )}>
                            <Lock size={16} />
                            <span>{dir === 'rtl' ? 'تم الاستخدام مرة واحدة' : language === 'fr' ? 'Utilisé (1 fois)' : 'Used Once'}</span>
                        </div>
                    ) : (
                    <button 
                        onClick={fetchRoadmap}
                        className="group relative px-8 py-4 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] active:scale-95 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        <span className={cn("relative z-10 flex items-center gap-3", dir === 'rtl' ? 'flex-row-reverse' : '')}>
                            <Zap size={16} className="fill-current group-hover:animate-bounce" /> {t.roadmap.regenerate}
                        </span>
                    </button>
                    )}
                </div>
            </header>

            {/* Progress Summary */}
            <div className="grid lg:grid-cols-3 gap-8">
                <div className={cn("bg-white p-10 rounded-[3rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] flex flex-col gap-6 relative overflow-hidden group", dir === 'rtl' ? 'text-right' : 'text-left')}>
                    <div className={cn("absolute top-0 w-32 h-32 bg-blue-50 opacity-[0.05] rounded-full blur-2xl group-hover:opacity-10 transition-opacity", dir === 'rtl' ? 'left-0 -ml-16' : 'right-0 -mr-16')} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t.roadmap.progressStatus}</p>
                    <div className={cn("flex items-baseline gap-3", dir === 'rtl' ? 'flex-row-reverse' : '')}>
                        <span className="text-7xl font-black text-slate-950 tracking-tighter tabular-nums leading-none">
                            {Math.round((completedSteps.length / roadmap.milestones.length) * 100)}%
                        </span>
                        <span className="text-slate-400 font-black uppercase tracking-widest text-[10px]">{t.roadmap.deployed}</span>
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
                        <div className={cn("flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest px-1", dir === 'rtl' ? 'flex-row-reverse' : '')}>
                            <span>{t.roadmap.diagnosticDna}</span>
                            <span>{t.roadmap.executiveMastery}</span>
                        </div>
                    </div>
                </div>

                <div className={cn("lg:col-span-2 bg-slate-950 p-10 rounded-[3rem] text-white flex flex-col justify-between relative overflow-hidden shadow-2xl group", dir === 'rtl' ? 'text-right' : 'text-left')}>
                    {/* Background effects */}
                    <div className={cn("absolute top-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -mt-48 group-hover:bg-blue-600/20 transition-colors duration-700", dir === 'rtl' ? 'left-0 -ml-48' : 'right-0 -mr-48')} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
                    
                    <div className="relative z-10 space-y-4">
                        <div className={cn("flex items-center gap-3", dir === 'rtl' ? 'flex-row-reverse' : '')}>
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-0">{t.roadmap.activeMandate}</p>
                        </div>
                        <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-tight max-w-2xl">
                            {roadmap.roadmapTitle}
                        </h3>
                    </div>
                    <div className={cn("relative z-10 flex items-center justify-between mt-10 pt-10 border-t border-white/10", dir === 'rtl' ? 'flex-row-reverse' : '')}>
                        <div className={cn("flex items-center gap-5", dir === 'rtl' ? 'flex-row-reverse' : '')}>
                            <div className={cn("flex", dir === 'rtl' ? 'space-x-reverse -space-x-3' : '-space-x-3')}>
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-xs font-black hover:translate-y-[-4px] transition-transform">
                                        {i}
                                    </div>
                                ))}
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hidden sm:block">{t.roadmap.structuralLifecycle}</p>
                        </div>
                        <div className="flex gap-2">
                             <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-blue-400">
                                {t.roadmap.aiVerified}
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
                        <div className={cn("absolute top-0 p-12 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity", dir === 'rtl' ? 'left-0' : 'right-0')}>
                            <Users size={240} className="text-blue-900" />
                        </div>
                        
                        <div className={cn("relative z-10 flex flex-col xl:flex-row gap-12 xl:gap-20 items-center", dir === 'rtl' ? 'xl:flex-row-reverse' : '')}>
                            <div className={cn("flex-1 space-y-8 text-center", dir === 'rtl' ? 'xl:text-right' : 'xl:text-left')}>
                                <div className="space-y-4">
                                    <div className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-[0.2em] border border-blue-100", dir === 'rtl' ? 'flex-row-reverse' : '')}>
                                        <Sparkles size={14} className="animate-pulse" /> {t.roadmap.workshopRecommendation}
                                    </div>
                                    <h3 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tight leading-tight">
                                        {roadmap.personalizedWorkshop.title}
                                    </h3>
                                    <p className="text-xl text-slate-600 font-medium leading-[1.8]">
                                        {roadmap.personalizedWorkshop.description}
                                    </p>
                                </div>

                                <div className={cn("flex flex-wrap justify-center gap-5", dir === 'rtl' ? 'xl:justify-end' : 'xl:justify-start')}>
                                    <div className={cn("flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm transition-transform hover:-translate-y-1", dir === 'rtl' ? 'flex-row-reverse' : '')}>
                                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                                            <Clock size={20} />
                                        </div>
                                        <span className="text-sm font-black text-slate-800 uppercase tracking-tight">{roadmap.personalizedWorkshop.durationHours} {t.roadmap.hoursIntensive}</span>
                                    </div>
                                    <div className={cn("flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm transition-transform hover:-translate-y-1", dir === 'rtl' ? 'flex-row-reverse' : '')}>
                                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600">
                                            <Users size={20} />
                                        </div>
                                        <span className="text-sm font-black text-slate-800 uppercase tracking-tight">{t.roadmap.individualSession}</span>
                                    </div>
                                </div>

                                <div className={cn("pt-6 flex flex-col sm:flex-row items-center gap-6", dir === 'rtl' ? 'sm:flex-row-reverse' : '')}>
                                    <div className={cn("flex flex-wrap gap-4", dir === 'rtl' ? 'flex-row-reverse' : '')}>
                                        <motion.a 
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            href={`mailto:${roadmap.support?.adminEmail || 'support@careerupgrade.ai'}`}
                                            className={cn("px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-blue-600 transition-all shadow-[0_20px_40px_-10px_rgba(15,23,42,0.3)] hover:shadow-blue-500/40", dir === 'rtl' ? 'flex-row-reverse' : '')}
                                        >
                                            <Mail size={18} className="text-blue-400" /> {t.roadmap.requestEmail}
                                        </motion.a>
                                        
                                        <motion.a 
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            href={`https://wa.me/${(roadmap.support?.adminWhatsapp || '+216XXXXXXXX').replace(/\D/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={cn("px-8 py-4 bg-[#25D366] text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:opacity-90 transition-all shadow-[0_20px_40px_-10px_rgba(37,211,102,0.3)]", dir === 'rtl' ? 'flex-row-reverse' : '')}
                                        >
                                            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 0 5.414 0 12.05c0 2.123.552 4.197 1.6 6.037L0 24l6.105-1.602a11.834 11.834 0 005.943 1.603h.005c6.634 0 12.048-5.414 12.048-12.05a11.78 11.78 0 00-3.588-8.517z"/></svg>
                                            <span className="font-bold">{t.roadmap.whatsapp}</span>
                                        </motion.a>
                                    </div>
                                    <div className={cn("flex flex-col items-center", dir === 'rtl' ? 'sm:items-end' : 'sm:items-start')}>
                                        <p className="text-xs font-black text-blue-600 uppercase tracking-widest animate-pulse">
                                            {t.roadmap.customizedNote}
                                        </p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.roadmap.surMesure}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full xl:w-80 space-y-6">
                                <div className="p-8 rounded-4xl bg-slate-50 border border-slate-100 shadow-inner relative overflow-hidden group/list">
                                    <div className={cn("absolute top-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl", dir === 'rtl' ? 'left-0 -ml-16' : 'right-0 -mr-16')} />
                                    
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] text-center mb-6">{t.roadmap.workshopAxes}</p>
                                    <div className="space-y-3">
                                        {roadmap.personalizedWorkshop.focusAreas.map((area, aid) => (
                                            <motion.div 
                                                key={aid}
                                                whileHover={{ x: dir === 'rtl' ? -5 : 5 }}
                                                className={cn("flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-100 text-[11px] font-black text-slate-800 uppercase tracking-tight shadow-sm", dir === 'rtl' ? 'flex-row-reverse' : '')}
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
                <div className={cn("absolute top-0 bottom-0 w-1 bg-slate-100 md:-translate-x-1/2 z-0", dir === 'rtl' ? 'right-[39px] md:right-1/2' : 'left-[39px] md:left-1/2')} />

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
                                    isEven 
                                        ? (dir === 'rtl' ? "md:left-[calc(50%+60px)] ml-20 md:ml-0" : "md:right-[calc(50%+60px)]") 
                                        : (dir === 'rtl' ? "md:right-[calc(50%+60px)]" : "md:left-[calc(50%+60px)] ml-20 md:ml-0")
                                )}>
                                    <motion.div 
                                        initial={{ opacity: 0, x: isEven ? (dir === 'rtl' ? 20 : -20) : (dir === 'rtl' ? -20 : 20) }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        onClick={() => setActiveMilestone(index)}
                                        className={cn(
                                            "p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl cursor-pointer hover:border-blue-300 transition-all group",
                                            dir === 'rtl' ? 'text-right' : 'text-left',
                                            activeMilestone === index && "ring-2 ring-blue-500 ring-offset-4 shadow-2xl"
                                        )}
                                    >
                                        <div className={cn("flex items-center gap-3 mb-4", dir === 'rtl' ? 'flex-row-reverse' : '')}>
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
                                                    <p className={cn("text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2", dir === 'rtl' ? 'flex-row-reverse' : '')}>
                                                        <Play size={10} className={cn("text-blue-600", dir === 'rtl' ? 'rotate-180' : '')} /> {t.roadmap.actionItems}
                                                    </p>
                                                    <div className="grid gap-2">
                                                        {milestone.tasks.map((task, tid) => (
                                                            <div key={tid} className={cn("flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700", dir === 'rtl' ? 'flex-row-reverse' : '')}>
                                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                                {task}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                                                    <p className={cn("text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1", dir === 'rtl' ? 'text-right' : 'text-left')}>{t.roadmap.expectedOutcome}</p>
                                                    <p className={cn("text-xs font-bold text-slate-700 italic", dir === 'rtl' ? 'text-right' : 'text-left')}>&quot;{milestone.expectedOutcome}&quot;</p>
                                                </div>
                                            </motion.div>
                                        )}
                                        
                                        {activeMilestone !== index && (
                                            <div className={cn("flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest", dir === 'rtl' ? 'flex-row-reverse' : '')}>
                                                {t.roadmap.explorePhase} <ChevronRight size={12} className={dir === 'rtl' ? 'rotate-180' : ''} />
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
                <div className={cn("absolute top-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -mt-64 group-hover:bg-blue-600/30 transition-colors duration-700", dir === 'rtl' ? 'left-0 -ml-64' : 'right-0 -mr-64')} />
                <div className={cn("absolute bottom-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] -mb-64 group-hover:bg-indigo-600/30 transition-colors duration-700", dir === 'rtl' ? 'right-0 -mr-64' : 'left-0 -ml-64')} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
                
                <Trophy className={cn("absolute top-[-40px] w-96 h-96 opacity-5 -rotate-12 pointer-events-none group-hover:opacity-10 transition-opacity duration-700", dir === 'rtl' ? 'right-[-40px]' : 'left-[-40px]')} />
                
                <div className={cn("relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-24", dir === 'rtl' ? 'lg:flex-row-reverse' : '')}>
                    <div className="shrink-0 relative">
                        <div className="w-32 h-32 md:w-44 md:h-44 rounded-[2.5rem] bg-linear-to-tr from-blue-600 to-indigo-700 flex items-center justify-center shadow-[0_20px_40px_-5px_rgba(37,99,235,0.4)] border border-white/30 rotate-6 group-hover:rotate-0 transition-transform duration-500">
                            <Award size={64} className="text-white drop-shadow-2xl" />
                        </div>
                        <div className={cn("absolute -bottom-4 w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-xl border border-slate-100 group-hover:rotate-0 transition-transform duration-500", dir === 'rtl' ? '-left-4 rotate-12' : '-right-4 -rotate-12')}>
                            <ShieldCheck size={28} className="text-blue-600" />
                        </div>
                    </div>

                    <div className={cn("flex-1 space-y-8 text-center", dir === 'rtl' ? 'lg:text-right' : 'lg:text-left')}>
                        <div className="space-y-3">
                            <div className={cn("inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]", dir === 'rtl' ? 'flex-row-reverse' : '')}>
                                {t.roadmap.accompagnement}
                            </div>
                            <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-none bg-linear-to-b from-white to-white/60 bg-clip-text text-transparent">
                                {t.roadmap.ultimateVertex}
                            </h3>
                            <p className="text-blue-300/80 font-bold uppercase tracking-[0.3em] text-xs md:text-sm">{t.roadmap.globalExcellence}</p>
                        </div>
                        
                        <div className="space-y-6 max-w-3xl">
                            <div className="p-8 md:p-10 rounded-[2.5rem] bg-white/3 border border-white/10 backdrop-blur-xl relative group/card">
                                <div className="absolute inset-0 bg-linear-to-br from-blue-600/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity rounded-[2.5rem]" />
                                <p className={cn("text-xl md:text-2xl text-slate-100 font-medium leading-[1.8] relative z-10", dir === 'rtl' ? 'text-right' : 'text-left')} dir={dir}>
                                    {t.roadmap.supportMessage}
                                </p>
                            </div>
                            <div className={cn("flex flex-col md:flex-row items-center gap-6 pt-4", dir === 'rtl' ? 'md:flex-row-reverse' : '')}>
                                <div className={cn("flex flex-wrap gap-4", dir === 'rtl' ? 'flex-row-reverse' : '')}>
                                    <motion.a 
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        href={`mailto:${roadmap.support?.adminEmail || 'support@careerupgrade.ai'}`}
                                        className={cn("px-10 py-5 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] hover:bg-blue-600 hover:text-white transition-all active:scale-95 border border-white/10", dir === 'rtl' ? 'flex-row-reverse' : '')}
                                    >
                                        <Mail size={20} className="text-blue-600 group-hover:text-white" />
                                        {t.roadmap.requestEmail}
                                    </motion.a>
                                    
                                    <motion.a 
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        href={`https://wa.me/${(roadmap.support?.adminWhatsapp || '+216XXXXXXXX').replace(/\D/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={cn("px-10 py-5 bg-[#25D366] text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-4 shadow-[0_20px_40px_-10px_rgba(37,211,102,0.4)] hover:opacity-90 transition-all active:scale-95", dir === 'rtl' ? 'flex-row-reverse' : '')}
                                    >
                                        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 0 5.414 0 12.05c0 2.123.552 4.197 1.6 6.037L0 24l6.105-1.602a11.834 11.834 0 005.943 1.603h.005c6.634 0 12.048-5.414 12.048-12.05a11.78 11.78 0 00-3.588-8.517z"/></svg>
                                        <span className="font-bold text-lg">{t.roadmap.whatsapp}</span>
                                    </motion.a>
                                </div>
                                    
                                <div className={cn("flex items-center gap-4 px-8 py-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 transition-colors", dir === 'rtl' ? 'flex-row-reverse' : '')}>
                                <div className={cn("flex", dir === 'rtl' ? 'space-x-reverse -space-x-3' : '-space-x-3')}>
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-800 shadow-lg" />
                                    ))}
                                </div>
                                <div className={cn("flex flex-col", dir === 'rtl' ? 'items-end' : 'items-start')}>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">{t.roadmap.mandateStatus}</span>
                                    <span className="text-sm font-bold text-white uppercase tracking-tight">
                                        {completedSteps.length === roadmap.milestones.length 
                                            ? t.roadmap.roadmapMastered 
                                            : `${roadmap.milestones.length - completedSteps.length} ${t.roadmap.phasesToCross}`}
                                    </span>
                                </div>
                            </div>
                            </div>
                        </div>

                        <div className={cn("pt-8 border-t border-white/5 flex items-center justify-center lg:justify-start gap-8 opacity-40", dir === 'rtl' ? 'flex-row-reverse' : '')}>
                            <div className={cn("flex items-center gap-2 grayscale hover:grayscale-0 transition-all cursor-default", dir === 'rtl' ? 'flex-row-reverse' : '')}>
                                <Globe size={16} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">{t.roadmap.globalStandards}</span>
                            </div>
                            <div className={cn("flex items-center gap-2 grayscale hover:grayscale-0 transition-all cursor-default", dir === 'rtl' ? 'flex-row-reverse' : '')}>
                                <ShieldCheck size={16} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">{t.roadmap.securedPrivacy}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    </div>
    </TrialGate>
    );
}
