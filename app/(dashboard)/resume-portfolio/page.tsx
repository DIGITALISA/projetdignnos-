"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Briefcase, Loader2, Sparkles, Download, FileText, Globe, CheckCircle2, Star, Mail, MapPin, Phone, Linkedin, ArrowLeft, Award } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import Link from "next/link";

interface ATSData {
    resume: {
        header: { fullName: string; professionalTitle: string; summary: string; contact: { email: string; phone: string; linkedin: string; location: string; }; };
        experience: { title: string; company: string; date: string; achievements: string[]; }[];
        skills: { technical: string[]; soft: string[]; };
        education: { degree: string; institution: string; year: string; }[];
    };
    portfolio: {
        introduction: string;
        keyProjects: { title: string; description: string; impact: string; tags: string[]; }[];
        leadershipPhilosophy: string;
        recommendedLayout: string;
    }
}

export default function ResumePortfolioPage() {
    const { dir, language: currentLang } = useLanguage();
    const isRTL = dir === 'rtl';

    const [isGenerating, setIsGenerating] = useState(false);
    const [data, setData] = useState<ATSData | null>(null);
    const [activeTab, setActiveTab] = useState<'resume' | 'portfolio'>('resume');

    useEffect(() => {
        const saved = localStorage.getItem("prof_atsData");
        if (saved) {
            try { setData(JSON.parse(saved)); } catch {}
        }
    }, []);

    const generateAssets = async () => {
        setIsGenerating(true);
        try {
            const savedProfile = localStorage.getItem("userProfile");
            const profile = savedProfile ? JSON.parse(savedProfile) : {};
            let report = null;
            let readiness = null;
            if (profile.email || profile.fullName) {
                const res = await fetch(`/api/user/readiness?userId=${encodeURIComponent(profile.email || profile.fullName)}`);
                const d = await res.json();
                if (d.success) {
                    readiness = d;
                    report = d.details?.finalReport || null;
                }
            }

            const req = await fetch("/api/resume-portfolio/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ profile, readiness, report, language: currentLang })
            });
            const resData = await req.json();
            if (resData.success) {
                setData(resData.result);
                localStorage.setItem("prof_atsData", JSON.stringify(resData.result));
            } else {
                alert("Generation failed: " + resData.error);
            }
        } catch (err) {
            console.error(err);
            alert("Analysis failed.");
        } finally {
            setIsGenerating(false);
        }
    };

    if (!data) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900" dir={dir}>
                <div className="max-w-xl text-center space-y-8 relative">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-10 blur-3xl rounded-full w-96 h-96 bg-rose-500/50 pointer-events-none" />
                    <div className="w-24 h-24 bg-rose-600/10 rounded-4xl flex items-center justify-center mx-auto shadow-2xl relative z-10 border border-rose-500/20">
                        <Briefcase size={40} className="text-rose-600 drop-shadow-lg" />
                    </div>
                    <div className="space-y-4 relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-500/10 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-rose-500/20">
                            <CheckCircle2 size={12} /> ATS OPTIMIZED
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter text-slate-900 dark:text-white leading-tight">
                            {isRTL ? "مُنشئ الهوية المهنية" : "Professional Identity Builder"}
                        </h1>
                        <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-md mx-auto">
                            {isRTL ? "سنقوم بتحليل تقريرك الاستراتيجي ومعطياتك لإنشاء سيرة ذاتية (CV) متوافقة تماماً مع أنظمة ATS ومعايير دولية، بالإضافة إلى بورتفوليو مهني متميز." : "We will analyze your strategic report and data to create a fully ATS-compatible CV meeting international standards, along with an outstanding professional portfolio."}
                        </p>
                    </div>
                    <button 
                        onClick={generateAssets}
                        disabled={isGenerating}
                        className="group relative px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:bg-rose-600 dark:hover:bg-rose-600 dark:hover:text-white transition-all overflow-hidden flex items-center justify-center gap-3 mx-auto disabled:opacity-70 disabled:cursor-not-allowed z-10"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 size={18} className="animate-spin text-rose-500" />
                                {isRTL ? "جاري التحليل والتوليد الذكي..." : "Generating Smart Assets..."}
                            </>
                        ) : (
                            <>
                                <Sparkles size={18} className="text-amber-400 group-hover:scale-110 transition-transform" />
                                {isRTL ? "إنشاء السيرة والبورتفوليو (AI)" : "Generate Resume & Portfolio (AI)"}
                            </>
                        )}
                        {!isGenerating && <div className="absolute inset-0 bg-rose-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left opacity-10" />}
                    </button>
                    {!isGenerating && (
                        <div className="pt-6 relative z-10">
                            <Link href="/professional/performance-studio" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 flex items-center justify-center gap-2">
                                <ArrowLeft size={12} className={cn(isRTL ? "rotate-180" : "")} />
                                {isRTL ? "الرجوع" : "Go Back"}
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20" dir={dir}>
            <div className="max-w-5xl mx-auto px-4 pt-12 space-y-10">
                {/* Header Section */}
                <div className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-10 md:p-12 text-white shadow-2xl">
                    <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="space-y-4 text-center sm:text-start">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-500/20 text-rose-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-500/30">
                                <CheckCircle2 size={14} /> Global Standard Structure
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase">
                                {isRTL ? "هويتك" : "Your"} <span className="text-rose-500">{isRTL ? "المهنية" : "Identity"}</span> {isRTL ? "الجديدة" : "Arsenal"}
                            </h1>
                            <p className="text-slate-400 font-medium max-w-lg text-sm">
                                {isRTL ? "هذه المستندات مصممة ومحسنة بواسطة الذكاء الاصطناعي لتخطي أنظمة فلترة السير الذاتية وإبهار صناع القرار." : "These assets are AI-engineered and optimized to bypass applicant tracking systems and dazzle decision-makers."}
                            </p>
                        </div>
                        <div className="hidden sm:flex w-24 h-24 bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 items-center justify-center shrink-0">
                            <Briefcase size={40} className="text-white/40" />
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex gap-2 w-full max-w-md relative z-10">
                        <button
                            onClick={() => setActiveTab('resume')}
                            className={cn("flex-1 px-4 py-3 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2", activeTab === 'resume' ? "bg-slate-900 text-rose-500 shadow-md" : "text-slate-500 hover:bg-slate-50")}
                        >
                            <FileText size={16} className={activeTab === 'resume' ? "text-rose-500" : ""} /> {isRTL ? "السيرة الذاتية" : "ATS Resume"}
                        </button>
                        <button
                            onClick={() => setActiveTab('portfolio')}
                            className={cn("flex-1 px-4 py-3 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2", activeTab === 'portfolio' ? "bg-slate-900 text-rose-500 shadow-md" : "text-slate-500 hover:bg-slate-50")}
                        >
                            <Globe size={16} className={activeTab === 'portfolio' ? "text-rose-500" : ""} /> {isRTL ? "البورتفوليو" : "Portfolio"}
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'resume' && (
                        <motion.div key="resume" initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -10 }} transition={{ duration: 0.3 }} className="bg-white rounded-4xl shadow-xl border border-slate-200 overflow-hidden font-sans">
                            {/* Resume Header */}
                            <div className="bg-slate-900 px-8 py-16 text-center space-y-6 border-t-8 border-rose-500 relative overflow-hidden">
                                <div className="absolute inset-0 bg-linear-to-b from-rose-900/10 to-transparent pointer-events-none" />
                                <div className="relative z-10 space-y-2">
                                    <h1 className="text-4xl md:text-5xl text-white font-black uppercase tracking-tight leading-none">{data.resume.header.fullName || "EXECUTIVE NAME"}</h1>
                                    <h2 className="text-lg md:text-xl text-rose-400 font-bold uppercase tracking-[0.3em]">{data.resume.header.professionalTitle}</h2>
                                </div>
                                <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 md:gap-8 text-[11px] font-black tracking-widest uppercase text-slate-300 pt-6">
                                    {data.resume.header.contact.email && <span className="flex items-center gap-2 border border-slate-700 px-3 py-1.5 rounded-full"><Mail size={12} className="text-rose-500"/> {data.resume.header.contact.email}</span>}
                                    {data.resume.header.contact.phone && <span className="flex items-center gap-2 border border-slate-700 px-3 py-1.5 rounded-full"><Phone size={12} className="text-rose-500"/> {data.resume.header.contact.phone}</span>}
                                    {data.resume.header.contact.location && <span className="flex items-center gap-2 border border-slate-700 px-3 py-1.5 rounded-full"><MapPin size={12} className="text-rose-500"/> {data.resume.header.contact.location}</span>}
                                    {data.resume.header.contact.linkedin && <span className="flex items-center gap-2 border border-slate-700 px-3 py-1.5 rounded-full"><Linkedin size={12} className="text-rose-500"/> {data.resume.header.contact.linkedin}</span>}
                                </div>
                            </div>
                            
                            <div className="p-10 md:p-14 space-y-12">
                                {/* Summary */}
                                <div className="space-y-6">
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] pb-3 border-b border-slate-200 flex items-center gap-3"><Sparkles className="text-rose-500" size={18} /> {isRTL ? "الملخص المهني" : "Professional Summary"}</h3>
                                    <p className="text-[13px] text-slate-700 leading-loose font-medium">{data.resume.header.summary}</p>
                                </div>

                                {/* Experience */}
                                <div className="space-y-8">
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] pb-3 border-b border-slate-200 flex items-center gap-3"><Briefcase className="text-rose-500" size={18} /> {isRTL ? "الخبرة المهنية" : "Professional Experience"}</h3>
                                    <div className="space-y-10">
                                        {data.resume.experience.map((exp, i) => (
                                            <div key={i} className="space-y-4">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                    <div>
                                                        <h4 className="text-lg font-black text-slate-900 leading-tight">{exp.title}</h4>
                                                        <div className="text-xs font-black text-rose-500 uppercase tracking-widest mt-1">{exp.company}</div>
                                                    </div>
                                                    <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full uppercase tracking-widest mt-2 sm:mt-0 self-start sm:self-auto">{exp.date}</span>
                                                </div>
                                                <ul className="space-y-3 pt-2">
                                                    {exp.achievements.map((ach, j) => (
                                                        <li key={j} className="text-[13px] text-slate-700 leading-relaxed font-medium flex items-start gap-3">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 shrink-0" />
                                                            {ach}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Skills Grid */}
                                <div className="space-y-8">
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] pb-3 border-b border-slate-200 flex items-center gap-3"><Star className="text-rose-500" size={18} /> {isRTL ? "المهارات (ATS Kws)" : "Core Competencies"}</h3>
                                    <div className="grid md:grid-cols-2 gap-10">
                                        <div className="space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                            <div className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4">{isRTL ? "مهارات صلبة/تقنية" : "Technical & Hard Skills"}</div>
                                            <div className="flex flex-wrap gap-2">
                                                {data.resume.skills.technical.map((s, i) => (
                                                    <span key={i} className="px-3 py-1.5 bg-white shadow-sm text-slate-800 text-[11px] font-bold rounded-lg border border-slate-200">{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-4 bg-rose-50/50 p-6 rounded-3xl border border-rose-100/50">
                                            <div className="text-[10px] font-black uppercase text-rose-400 tracking-[0.2em] mb-4">{isRTL ? "مهارات القياس/ناعمة" : "Leadership & Soft Skills"}</div>
                                            <div className="flex flex-wrap gap-2">
                                                {data.resume.skills.soft.map((s, i) => (
                                                    <span key={i} className="px-3 py-1.5 bg-rose-100/50 text-rose-800 text-[11px] font-bold rounded-lg border border-rose-200">{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Education (Optional if provided) */}
                                {data.resume.education && data.resume.education.length > 0 && (
                                     <div className="space-y-6">
                                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] pb-3 border-b border-slate-200 flex items-center gap-3"><Award className="text-rose-500" size={18} /> {isRTL ? "التعليم" : "Education"}</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {data.resume.education.map((edu, i) => (
                                                <div key={i} className="border border-slate-100 rounded-2xl p-5 space-y-2">
                                                    <div className="text-sm font-black text-slate-900">{edu.degree}</div>
                                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{edu.institution}</div>
                                                    <div className="text-[10px] font-black text-rose-500">{edu.year}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'portfolio' && (
                        <motion.div key="portfolio" initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -10 }} transition={{ duration: 0.3 }} className="space-y-8">
                            {/* Hero */}
                            <div className="bg-slate-900 rounded-[3rem] p-10 md:p-20 text-center space-y-8 shadow-2xl relative overflow-hidden text-white border border-slate-800">
                                <div className="absolute top-0 left-0 w-96 h-96 bg-rose-600/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                                <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none" />
                                
                                <div className="relative z-10 space-y-10 max-w-4xl mx-auto">
                                    <div className="inline-flex items-center justify-center px-4 py-1.5 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-white/70 text-[10px] font-black uppercase tracking-[0.3em]">
                                        <Sparkles size={12} className="text-rose-400 mr-2" />
                                        Layout: {data.portfolio.recommendedLayout}
                                    </div>
                                    
                                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-tight drop-shadow-2xl">
                                        &ldquo;{data.portfolio.introduction}&rdquo;
                                    </h2>
                                    
                                    <div className="flex items-center justify-center gap-4">
                                        <div className="w-16 h-1 bg-white/10 max-w-full rounded-full" />
                                        <div className="w-1 h-1 bg-rose-500 rounded-full" />
                                        <div className="w-16 h-1 bg-white/10 max-w-full rounded-full" />
                                    </div>
                                    
                                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                                        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-400 mb-4">{isRTL ? "فلسفة القيادة" : "Leadership Philosophy"}</div>
                                        <p className="text-base md:text-lg font-medium text-slate-300 italic leading-relaxed">
                                            &ldquo;{data.portfolio.leadershipPhilosophy}&rdquo;
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Projects Showcase */}
                            <div className="space-y-6 pt-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg"><Globe size={20}/></div>
                                        <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900">{isRTL ? "المشاريع المحورية" : "Signature Projects Segment"}</h3>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-200 px-3 py-1 rounded-full">{data.portfolio.keyProjects.length} Modules</span>
                                </div>
                                
                                <div className="grid md:grid-cols-2 gap-8">
                                    {data.portfolio.keyProjects.map((proj, i) => (
                                        <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-6 group hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden">
                                            <div className="space-y-4 relative z-10">
                                                <h4 className="text-2xl font-black text-slate-900 group-hover:text-rose-600 transition-colors uppercase tracking-tight">{proj.title}</h4>
                                                <p className="text-sm font-medium text-slate-600 leading-relaxed min-h-[60px]">{proj.description}</p>
                                                
                                                <div className="p-5 rounded-2xl bg-amber-500/5 text-amber-900 border border-amber-500/20">
                                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 mb-2 flex items-center gap-2"><Star size={12}/> {isRTL ? "الأثر التجاري (Metrics)" : "Business Impact (Metrics)"}</div>
                                                    <div className="text-sm font-black leading-snug">{proj.impact}</div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-wrap gap-2 pt-4 relative z-10 border-t border-slate-50 mt-2">
                                                {proj.tags.map((tag, j) => (
                                                    <span key={j} className="text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 px-3 py-1.5 rounded-lg border border-slate-200">{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex justify-center pt-8">
                    <div 
                        title={isRTL ? 'التصدير متاح للمشتركين فقط' : 'Export available for paid plans only'} 
                        className="flex items-center gap-3 px-10 py-5 bg-slate-100 text-slate-400 rounded-4xl font-black uppercase tracking-[0.3em] text-[10px] md:text-xs border border-slate-200 cursor-not-allowed select-none"
                    >
                        <Download size={18} />
                        {isRTL ? "تصدير البيانات لبناء الموقع/ملف" : "Export Source Code & PDF"}
                        <span className="text-[9px] bg-amber-100 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ml-2">
                            {isRTL ? 'برو' : 'PRO'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
