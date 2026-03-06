"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, Target, FileText, 
  ChevronRight, ArrowLeft, Shield, Sparkles, TrendingUp,
  Zap, Award, Briefcase, Globe,
  Download, PlayCircle, LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- TYPES & INTERFACES ---
interface FinalReport {
    profileSummary: string;
    maturityLevel: string;
    leadershipFingerprint?: { archetype: string; description: string; riskContext: string };
    selfAwarenessScore?: { score: number; verdict: string; evidence: string };
    trajectoryVelocity?: { assessment: string; rationale: string };
    deepInsights: string[];
    marketValue: string;
    finalVerdict: string;
    recommendedRoles: string[];
    gapAnalysis: { hardSkillsMatch: number; softSkillsMatch: number; criticalCompetencyGaps: string[] };
}

type TabId = "overview" | "workshops" | "roads" | "resources";

interface NavItem {
    id: TabId;
    label: string;
    labelAr: string;
    icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
    { id: "overview", label: "Executive Synthesis", labelAr: "التلخيص التنفيذي", icon: <Shield size={18} /> },
    { id: "workshops", label: "Strategic Workshops", labelAr: "ورش العمل الاستراتيجية", icon: <BookOpen size={18} /> },
    { id: "roads", label: "Career Ascension", labelAr: "المسار المهني", icon: <Target size={18} /> },
    { id: "resources", label: "Strategic Assets", labelAr: "الموارد الاستراتيجية", icon: <Briefcase size={18} /> },
];

export default function PerformanceStudio() {
    const [activeTab, setActiveTab] = useState<TabId>("overview");
    const [report, setReport] = useState<FinalReport | null>(null);
    const [currentLang, setCurrentLang] = useState('ar');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Hydrate language & report
        const hydrate = () => {
            const lang = localStorage.getItem("language") || "ar";
            setCurrentLang(lang);

            const saved = localStorage.getItem("prof_finalReport");
            if (saved) {
                try { setReport(JSON.parse(saved) as FinalReport); } catch { /* ignore */ }
            }
            setLoading(false);
        };
        
        // Defer to avoid cascading render warning during hydration
        const timeout = setTimeout(hydrate, 0);
        return () => clearTimeout(timeout);
    }, []);

    // RTL handling
    const isRTL = currentLang === 'ar';

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-4 border-rose-500/20 border-t-rose-500 animate-spin" />
            </div>
        );
    }

    if (!report) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center border border-white/5">
                    <Shield size={40} className="text-slate-500" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Diagnostic Required</h1>
                    <p className="text-slate-500 text-sm max-w-sm">Please complete the executive diagnostic to unlock your Performance Studio.</p>
                </div>
                <a href="/professional" className="px-12 py-4 bg-rose-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all">
                    Start Diagnosis
                </a>
            </div>
        );
    }

    return (
        <div className={cn("min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans", isRTL && "flex-row-reverse")} dir={isRTL ? 'rtl' : 'ltr'}>
            
            {/* ── VERTICAL SIDEBAR ── */}
            <aside className={cn(
                "w-80 h-screen sticky top-0 bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 flex flex-col shadow-2xl z-50",
                isRTL ? "border-l" : "border-r"
            )}>
                {/* Logo Section */}
                <div className="p-8 space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-rose-600 flex items-center justify-center shadow-lg shadow-rose-600/20">
                            <Award className="text-white" size={24} />
                        </div>
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">Executive</div>
                            <div className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Studio</div>
                        </div>
                    </div>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={cn(
                                "w-full flex items-center gap-4 px-6 py-4 rounded-3xl transition-all group relative overflow-hidden",
                                activeTab === item.id 
                                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl" 
                                    : "text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
                            )}
                        >
                            <span className={cn(
                                "transition-transform group-hover:scale-110",
                                activeTab === item.id ? "text-rose-500" : "text-slate-400 group-hover:text-rose-500"
                            )}>
                                {item.icon}
                            </span>
                            <span className="text-[11px] font-black uppercase tracking-widest">
                                {isRTL ? item.labelAr : item.label}
                            </span>
                            {activeTab === item.id && (
                                <motion.div 
                                    layoutId="activeTabGlow"
                                    className="absolute inset-0 bg-rose-500/5 dark:bg-rose-500/10"
                                />
                            )}
                        </button>
                    ))}
                </nav>

                {/* Bottom Footer */}
                <div className="p-8 border-t border-slate-100 dark:border-white/5 space-y-4">
                    <a href="/professional/executive-dashboard" className="flex items-center gap-4 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors group">
                        <ArrowLeft size={18} className={cn("transition-transform", isRTL ? "group-hover:translate-x-2 rotate-180" : "group-hover:-translate-x-2")} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{isRTL ? "لوحة المعلومات" : "Executive Dashboard"}</span>
                    </a>
                    <button
                        onClick={async () => {
                            try {
                                await fetch('/api/auth/logout', { method: 'POST' });
                            } catch (e) {
                                console.error("Logout API failed", e);
                            } finally {
                                localStorage.clear();
                                sessionStorage.clear();
                                document.cookie.split(";").forEach((c) => {
                                    document.cookie = c
                                        .replace(/^ +/, "")
                                        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                                });
                                window.location.href = '/login';
                            }
                        }}
                        className="w-full flex items-center gap-4 text-slate-400 hover:text-rose-500 transition-colors group"
                    >
                        <LogOut size={18} className={cn("text-slate-300 group-hover:text-rose-500 transition-colors", isRTL && "rotate-180")} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{isRTL ? "تسجيل الخروج" : "Log Out"}</span>
                    </button>
                </div>
            </aside>

            {/* ── MAIN CONTENT AREA ── */}
            <main className="flex-1 min-w-0">
                {/* Header Sub-bar */}
                <header className="sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-white/5 px-12 py-6 flex items-center justify-between z-40">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                            {NAV_ITEMS.find(n => n.id === activeTab)?.icon}
                        </div>
                        <div>
                            <h1 className="text-xl font-black uppercase tracking-tighter">
                                {isRTL ? NAV_ITEMS.find(n => n.id === activeTab)?.labelAr : NAV_ITEMS.find(n => n.id === activeTab)?.label}
                            </h1>
                            <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                <Sparkles size={10} className="text-rose-500" />
                                {isRTL ? "مؤسسة على تشخيصك الأخير" : "Based on your latest diagnosis"}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="px-5 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{report.maturityLevel}</span>
                        </div>
                    </div>
                </header>

                <div className="p-12 max-w-7xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                            {activeTab === "overview" && <Overview report={report} isRTL={isRTL} />}
                            {activeTab === "workshops" && <Workshops isRTL={isRTL} />}
                            {activeTab === "roads" && <CareerAscension report={report} isRTL={isRTL} />}
                            {activeTab === "resources" && <Resources isRTL={isRTL} />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

// ─── SUB-COMPONENTS ────────────────────────────────────────────────────────

function Overview({ report, isRTL }: { report: FinalReport, isRTL: boolean }) {
    return (
        <div className="space-y-12">
            <div className="bg-slate-900 rounded-[3.5rem] p-16 text-white relative overflow-hidden shadow-2xl border border-white/5">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[100px] -mr-64 -mt-64" />
                <div className="relative z-10 grid xl:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-500/20">
                            <Briefcase size={14} /> {isRTL ? "ملخص الحالة الإستراتيجية" : "Strategic Status Summary"}
                        </div>
                        <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none">
                            {isRTL ? "التشخيص النهائي" : "The Core Verdict"}
                        </h2>
                        <p className="text-xl text-rose-100/60 font-medium leading-relaxed italic">
                            &ldquo;{report.finalVerdict}&rdquo;
                        </p>
                        <div className="grid sm:grid-cols-2 gap-6 pt-8">
                            <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                                <div className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2">{isRTL ? "الوزن السوقي" : "Market Weight"}</div>
                                <div className="text-4xl font-black">{report.marketValue}</div>
                            </div>
                            <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                                <div className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2">{isRTL ? "نظام النضج" : "Maturity Level"}</div>
                                <div className="text-2xl font-black uppercase">{report.maturityLevel}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-linear-to-br from-slate-800 to-slate-950 p-10 rounded-[3rem] border border-white/10 shadow-3xl space-y-8">
                        <div className="space-y-2">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">{isRTL ? "المنظور الاستراتيجي" : "The Strategic Lens"}</h4>
                            <p className="text-slate-300 text-sm font-medium leading-relaxed">{report.profileSummary}</p>
                        </div>
                        <div className="h-px bg-white/5" />
                        <div className="space-y-4">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-rose-500">{isRTL ? "الأولويات المكتشفة" : "Deep Insights"}</h4>
                            <ul className="space-y-3">
                                {report.deepInsights.slice(0, 3).map((insight, i) => (
                                    <li key={i} className="flex gap-3 items-start text-[11px] font-bold text-slate-200">
                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                                        {insight}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 pb-12">
                {[
                    { label: isRTL ? "التأثير القيادي" : "Leadership Impact", val: report.gapAnalysis.softSkillsMatch, color: "rose" },
                    { label: isRTL ? "القدرة التقنية" : "Technical Depth", val: report.gapAnalysis.hardSkillsMatch, color: "blue" },
                    { label: isRTL ? "الوعي الذاتي" : "Self-Awareness", val: report.selfAwarenessScore?.score || 85, color: "emerald" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-xl space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</span>
                            <span className={cn("text-xs font-black", `text-${stat.color}-500`)}>{stat.val}%</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${stat.val}%` }}
                                className={cn("h-full rounded-full", stat.color === 'rose' ? "bg-rose-500" : stat.color === 'blue' ? "bg-blue-500" : "bg-emerald-500")}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Workshops({ isRTL }: { isRTL: boolean }) {
    const workshops = [
        { id: 1, title: isRTL ? "هيكلة القيادة الاستراتيجية" : "Strategic Leadership Architecture", time: "4.5h", level: "Expert", type: "Role Play", color: "rose" },
        { id: 2, title: isRTL ? "التواصل التنفيذي المؤثر" : "Impactful Executive Presence", time: "3h", level: "Senior", type: "Communication", color: "indigo" },
        { id: 3, title: isRTL ? "إدارة الأزمات في مجالاتك" : "Sector-Specific Crisis Management", time: "6h", level: "Expert", type: "Simulation", color: "emerald" },
        { id: 4, title: isRTL ? "التسلل العالي للسوق" : "Elite Market Infiltration", time: "5h", level: "High-level", type: "Marketing", color: "amber" },
    ];

    return (
        <div className="space-y-12 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black uppercase tracking-tighter">{isRTL ? "ورش العمل المحاكية" : "Executive Workshops"}</h2>
                    <p className="text-slate-500 text-sm font-medium">{isRTL ? "جلسات مكثفة لمعالجة الثغرات المكتشفة في تشخيصك." : "Intensive sessions designed to close the gaps identified in your diagnosis."}</p>
                </div>
                <div className="px-6 py-3 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
                    <PlayCircle size={14} className="text-rose-500" />
                    {isRTL ? "4 ورش عمل قيد الانتظار" : "4 Workshops Pending"}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {workshops.map((w) => (
                    <div key={w.id} className="group bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-100 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] relative overflow-hidden">
                        <div className={cn("absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-3xl -mr-16 -mt-16 bg-current", `text-${w.color}-500`)} />
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-start justify-between">
                                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl", `bg-${w.color}-500 shadow-${w.color}-500/20`)}>
                                    <Zap size={24} />
                                </div>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full text-[8px] font-black uppercase tracking-widest">{w.time}</span>
                                    <span className="px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full text-[8px] font-black uppercase tracking-widest text-rose-500">{w.level}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black uppercase tracking-tight group-hover:text-rose-500 transition-colors">{w.title}</h3>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{w.type}</p>
                            </div>
                            <button className="w-full py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all hover:gap-5">
                                {isRTL ? "ابدأ الجلسة الآن" : "Start Workshop"}
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function CareerAscension({ report, isRTL }: { report: FinalReport, isRTL: boolean }) {
    return (
        <div className="space-y-12 pb-12">
            <div className="space-y-2">
                <h2 className="text-3xl font-black uppercase tracking-tighter">{isRTL ? "خارطة الصعود المهني" : "The Ascension Roadmap"}</h2>
                <p className="text-slate-500 text-sm font-medium">{isRTL ? "تحليل الأدوار والمسارات الأكثر تطابقاً مع قيمتك السوقية الحالية." : "Analysis of roles and paths most aligned with your current market value."}</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
                {/* Proposed Roles */}
                <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-12 border border-slate-100 dark:border-white/5 shadow-xl space-y-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                            <TrendingUp size={24} />
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter">{isRTL ? "الأدوار المقترحة فوراً" : "Immediate Target Roles"}</h3>
                    </div>
                    <div className="space-y-4">
                        {report.recommendedRoles.map((role, i) => (
                            <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 group hover:border-indigo-500 transition-all cursor-default">
                                <div className="space-y-1">
                                    <div className="font-black text-slate-800 dark:text-white uppercase tracking-tight">{role}</div>
                                    <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{isRTL ? "مطابقة عالية" : "High Strategic Match"}</div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border dark:border-white/10 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                    <ArrowLeft size={16} className={cn("transition-transform", isRTL ? "rotate-180 group-hover:translate-x-1" : "group-hover:translate-x-1")} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Growth Strategy */}
                <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white border border-white/5 shadow-2xl space-y-10 relative overflow-hidden">
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] -mb-32 -mr-32" />
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                            <Award size={24} />
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter">{isRTL ? "استراتيجية التوسع" : "Expansion Strategy"}</h3>
                    </div>
                    <div className="space-y-8">
                        {report.gapAnalysis.criticalCompetencyGaps.map((gap, i) => (
                            <div key={i} className="flex gap-6 group">
                                <div className="w-1 bg-emerald-500/30 rounded-full group-hover:bg-emerald-500 transition-all shrink-0" />
                                <div className="space-y-2 pb-2">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{isRTL ? "فجوة حرجة" : "CRITICAL GAP"}</div>
                                    <p className="text-slate-300 text-sm font-bold leading-relaxed">{gap}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="pt-10 border-t border-white/5 flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">McKinsey Standard Alignment</div>
                            <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{isRTL ? "تحقق الأداء: نشط" : "Performance Validated: ACTIVE"}</div>
                        </div>
                        <Shield className="text-slate-700" size={32} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function Resources({ isRTL }: { isRTL: boolean }) {
    const assets = [
        { title: isRTL ? "ملف السيرة الذاتية الأمثل (ATS)" : "Optimized Executive CV (ATS-Ready)", desc: isRTL ? "سيرة ذاتية مهيكلة للأنظمة الرقمية." : "CV structured for AI-driven recruitment systems.", icon: <FileText className="text-blue-500" /> },
        { title: isRTL ? "التقرير الاستراتيجي الكامل" : "Comprehensive Strategic Thesis", desc: isRTL ? "تحليل شامل لكل مخرجات البرنامج." : "Complete analytical report of all program outputs.", icon: <Shield className="text-rose-500" /> },
        { title: isRTL ? "استراتيجية الظهور الرقمي" : "LinkedIn Authority Blueprint", desc: isRTL ? "كيف تسوق لنفسك كخبير قيادي." : "How to position yourself as an authority online.", icon: <Globe className="text-indigo-500" /> },
        { title: isRTL ? "رسالة التوصية الرسمية" : "Official Recommendation Letter", desc: isRTL ? "مصادقة على قدراتك الاستراتيجية." : "Official endorsement of your strategic capabilities.", icon: <Award className="text-emerald-500" /> },
    ];

    return (
        <div className="space-y-12 pb-12">
            <div className="space-y-2 text-center max-w-2xl mx-auto">
                <h2 className="text-3xl font-black uppercase tracking-tighter">{isRTL ? "الأصول الاستراتيجية" : "The Vault: Strategic Assets"}</h2>
                <p className="text-slate-500 text-sm font-medium">{isRTL ? "جميع الأدوات والوثائق التي تم توليدها بناءً على أدائك." : "All tools and documents generated based on your performance."}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {assets.map((asset, i) => (
                    <div key={i} className="group bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-lg flex items-center gap-8 transition-all hover:bg-slate-50 dark:hover:bg-white/10">
                        <div className="w-20 h-20 rounded-3xl bg-slate-50 dark:bg-white/5 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                            {asset.icon}
                        </div>
                        <div className="flex-1 space-y-2">
                            <h3 className="font-black uppercase tracking-tight text-slate-800 dark:text-white leading-none">{asset.title}</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">{asset.desc}</p>
                        </div>
                        <button className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center hover:bg-rose-500 hover:dark:bg-rose-500 hover:text-white transition-all shadow-xl group-hover:translate-x-2">
                            <Download size={18} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Certification Badge */}
            <div className="bg-linear-to-r from-rose-600 to-indigo-700 rounded-[3rem] p-12 text-white relative overflow-hidden flex flex-col items-center text-center space-y-6">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                <Award size={64} className="text-white animate-bounce" />
                <div className="space-y-2 relative z-10">
                    <h3 className="text-3xl font-black uppercase tracking-tighter">{isRTL ? "شهادة الأداء التنفيذي" : "Executive Performance Certification"}</h3>
                    <p className="text-rose-100/60 text-sm font-medium tracking-widest uppercase">{isRTL ? "معتمدة من المركز الوطني للذكاء المهني" : "Validated by National Career Intelligence Standards"}</p>
                </div>
                <button className="px-10 py-4 bg-white text-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl hover:scale-105 transition-all">
                    {isRTL ? "عرض وتحميل الشهادة" : "View & Download Certificate"}
                </button>
            </div>
        </div>
    );
}
