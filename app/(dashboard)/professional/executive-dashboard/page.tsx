"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  BarChart3, Target, Brain, MessageSquare, Sparkles, Shield,
  TrendingUp, User, Globe, ArrowRight, CheckCircle2, X, Zap, Lock,
  FileText, Award, ChevronRight, AlertCircle, Mic, Plus, Trash2, Loader2,
  Briefcase, Compass, Send, RefreshCw, Rocket, Download, LogOut
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface FinalReport {
  profileSummary: string;
  maturityLevel: string;
  leadershipFingerprint?: { archetype: string; description: string; riskContext: string };
  selfAwarenessScore?: { score: number; verdict: string; evidence: string };
  trajectoryVelocity?: { assessment: string; rationale: string };
  swot: { strengths: string[]; weaknesses: string[]; opportunities: string[]; threats: string[] };
  deepInsights: string[];
  marketValue: string;
  finalVerdict: string;
  recommendedRoles: string[];
  gapAnalysis: {
    currentJobVsReality: string;
    hardSkillsMatch: number;
    softSkillsMatch: number;
    criticalCompetencyGaps: string[];
    comparisonPositionReality?: string;
  };
  actionPlan90Days?: { week: string; action: string; rationale: string }[];
  careerAdvancement: { role: string; shortTermProbability: number; longTermProbability: number; requirements: string[] }[];
  expertInterviewNotes?: string[];
  authorityVsPotential?: { currentAuthority: number; futurePotential: number; quadrant: string };
  strategicRadar?: { technical: number; leadership: number; strategy: number; execution: number; influence: number };
  marketPerceptionVerdict?: string;
  linkedInStrategy?: { headline: string; summaryFocus: string; networkingAdvice: string };
}

// ─── NAV MODULE CONFIG ────────────────────────────────────────────────────────
type ModuleId = "diagnostic" | "roadmap" | "coaching" | "positioning" | "network" | "verdict";

interface Module {
  id: ModuleId;
  label: string;
  labelAr: string;
  icon: React.ReactNode;
  locked: boolean;
  color: string;
  badge?: string;
}

const MODULES: Module[] = [
  { id: "diagnostic", label: "Advanced Diagnostic", labelAr: "التشخيص المتقدم", icon: <Brain size={18} />, locked: false, color: "indigo", badge: "NEW" },
  { id: "roadmap", label: "Strategic Roadmap", labelAr: "خارطة الطريق", icon: <Target size={18} />, locked: false, color: "emerald" },
  { id: "coaching", label: "Executive Coaching", labelAr: "التدريب التنفيذي", icon: <MessageSquare size={18} />, locked: false, color: "violet" },
  { id: "positioning", label: "Elite Strategic Academy", labelAr: "أكاديمية النخبة الاستراتيجية", icon: <Globe size={18} />, locked: false, color: "blue" },
  { id: "network", label: "Self-Marketing Studio", labelAr: "ستوديو التسويق الذاتي", icon: <Rocket size={18} />, locked: false, color: "amber" },
  { id: "verdict", label: "Final Strategic Verdict", labelAr: "التقرير النهائي الشامل", icon: <Award size={18} />, locked: false, color: "rose" },
];

// ─── RADAR BAR ────────────────────────────────────────────────────────────────
function RadarBar({ label, value }: { label: string; value: number }) {
  const colorClasses: Record<string, string> = {
    indigo: "from-indigo-500 to-violet-600",
    emerald: "from-emerald-500 to-teal-500",
    amber: "from-amber-500 to-orange-500",
    rose: "from-rose-500 to-red-600",
    blue: "from-blue-500 to-cyan-500",
  };
  const labelColors: Record<string, string> = {
    technical: "indigo", leadership: "emerald", strategy: "blue", execution: "amber", influence: "rose"
  };
  const c = labelColors[label.toLowerCase()] || "indigo";
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</span>
        <span className="text-xs font-black text-slate-800 dark:text-white">{value}<span className="text-slate-400">/10</span></span>
      </div>
      <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value * 10}%` }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          className={cn("h-full rounded-full bg-linear-to-r", colorClasses[c])}
        />
      </div>
    </div>
  );
}

// ─── SCORE RING ───────────────────────────────────────────────────────────────
function ScoreRing({ value, label, color }: { value: number; label: string; color: string }) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const colorMap: Record<string, string> = { emerald: "#10b981", amber: "#f59e0b", rose: "#f43f5e", blue: "#3b82f6", indigo: "#6366f1" };
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-28 h-28">
        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-800" />
          <motion.circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke={colorMap[color] || "#6366f1"}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-black text-slate-800 dark:text-white">{value}</span>
        </div>
      </div>
      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 text-center">{label}</span>
    </div>
  );
}

// ─── LOCKED MODULE PLACEHOLDER ────────────────────────────────────────────────
function LockedModule({ module }: { module: Module }) {
  const { language: currentLang } = useLanguage();
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center gap-8 py-32 text-center">
      <div className="w-24 h-24 rounded-4xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
        <Lock size={36} className="text-slate-300 dark:text-slate-700" />
      </div>
      <div className="space-y-3 max-w-sm">
        <h3 className="text-2xl font-black uppercase tracking-tight text-slate-400">
          {currentLang === 'ar' ? "الوحدة مغلقة" : currentLang === 'fr' ? "Module Verrouillé" : "Module Locked"}
        </h3>
        <p className="text-slate-500 text-sm font-medium">
          <strong>{currentLang === 'ar' ? module.labelAr : module.label}</strong> {currentLang === 'ar' ? "ستتوفر قريباً. أكمل التشخيص أولاً لفتح بقية المسار." : "is coming soon. Complete your diagnostic first to unlock the strategic roadmap."}
        </p>
      </div>
      <div className="px-8 py-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 text-[10px] font-black uppercase tracking-widest">
        {currentLang === 'ar' ? "متاح في المرحلة الثانية ←" : "Available in Phase 2 →"}
      </div>
    </motion.div>
  );
}

// ─── STRATEGIC ROADMAP ────────────────────────────────────────────────────────
interface CareerHistoryItem {
    id: string;
    title: string;
    duration: string;
    from: string;
    to: string;
}

interface RoadmapResult {
    currentRoleAnalysis: {
        strengths: string[];
        weaknesses: string[];
        missingHardSkills: string[];
        missingSoftSkills: string[];
    };
    ambitionPathway: {
        viability: string;
        steps: { phase: string; actions: string[] }[];
    };
    ultimateRoadmap: {
        immediateActions: string[];
        strategicFocus: string;
        milestones: string[];
    };
}
 
interface PerformanceEvaluation {
    score: number;
    summary: string;
    corrections: string[];
    alignmentNotes: string[];
    actionPlan: string;
}

interface ProfessionalAcademy {
    curriculum: {
        title: string;
        description: string;
        modules: { title: string; duration: string; topics: string[] }[];
        assignments: { title: string; task: string; objective: string }[];
    };
    strategicAdvice: string[];
    premiumConsultancy: string;
}

function StrategicAcademy({ report, currentLang }: { report: FinalReport, currentLang: string }) {
    const [academy, setAcademy] = useState<ProfessionalAcademy | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'academy' | 'consultancy' | 'advice'>('academy');
    const [selectedModule, setSelectedModule] = useState<number | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem("prof_academy");
        if (saved) try { setAcademy(JSON.parse(saved)); } catch { /* ignore */ }
    }, []);

    const generateAcademy = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/executive-academy/generate", {
                method: "POST",
                body: JSON.stringify({ report, language: currentLang })
            });
            const data = await res.json();
            if (data.success) {
                setAcademy(data.academy);
                localStorage.setItem("prof_academy", JSON.stringify(data.academy));
            }
        } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };

    if (!academy) {
        return (
            <div className="py-20 flex flex-col items-center text-center space-y-8">
                <div className="w-20 h-20 rounded-3xl bg-blue-600 text-white flex items-center justify-center shadow-2xl animate-pulse">
                    <Globe size={40} />
                </div>
                <div className="space-y-4 max-w-xl">
                    <h2 className="text-3xl font-black uppercase tracking-tight">
                        {currentLang === 'ar' ? "أكاديمية القادة الاستراتيجية" : "Elite Strategic Academy"}
                    </h2>
                    <p className="text-slate-500 font-medium">
                        {currentLang === 'ar' ? "سنقوم بناءً على تقريرك ببناء أكاديمية متكاملة تشمل تدريباً عملياً، استشارات، ونصائح مخصصة لك." : "Based on your X-Ray, we will build a complete academy including practical training, consultancies, and custom advice."}
                    </p>
                </div>
                <button 
                    onClick={generateAcademy} 
                    disabled={isLoading}
                    className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:bg-black transition-all flex items-center gap-3 disabled:opacity-50"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Zap className="text-amber-400" size={20} />}
                    {currentLang === 'ar' ? "توليد الأكاديمية المخصصة (مدعوم بـ AI)" : "Generate Personalized Academy (AI Power)"}
                </button>
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 pb-20">
            {/* Navigation Tabs */}
            <div className="flex justify-center">
                <div className="bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl flex gap-1">
                    {[
                        { id: 'academy', label: currentLang === 'ar' ? 'التدريب العملي' : 'Practical Academy' },
                        { id: 'consultancy', label: currentLang === 'ar' ? 'خدمات استشارية' : 'Consultancy Hub' },
                        { id: 'advice', label: currentLang === 'ar' ? 'نصائح الخبراء' : 'Expert Advice' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id as 'academy' | 'consultancy' | 'advice'); setSelectedModule(null); }}
                            className={cn(
                                "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                activeTab === tab.id ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === 'academy' && (
                <div className="grid md:grid-cols-12 gap-8">
                    {/* Curriculum Sidebar */}
                    <div className="md:col-span-4 space-y-6">
                        <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 p-8 shadow-xl space-y-6">
                            <div className="text-[10px] font-black uppercase tracking-widest text-blue-600">Learning Path</div>
                            <h4 className="text-xl font-black">{academy.curriculum.title}</h4>
                            <div className="space-y-4">
                                {academy.curriculum.modules.map((m, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => setSelectedModule(i)}
                                        className={cn(
                                            "w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group",
                                            selectedModule === i ? "bg-blue-600 border-blue-600 text-white" : "bg-slate-50 border-slate-100 hover:border-blue-200"
                                        )}
                                    >
                                        <div className="space-y-1">
                                            <div className={cn("text-[8px] font-black uppercase", selectedModule === i ? "text-blue-100" : "text-slate-400")}>Module {i+1}</div>
                                            <div className="text-[11px] font-bold">{m.title}</div>
                                        </div>
                                        <ChevronRight size={14} className={selectedModule === i ? "text-white" : "text-slate-300 group-hover:text-blue-500"} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="md:col-span-8">
                        {selectedModule !== null ? (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 p-10 shadow-xl space-y-10">
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-black uppercase tracking-tight text-blue-600">{academy.curriculum.modules[selectedModule].title}</h3>
                                    <div className="flex items-center gap-4">
                                        <span className="text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 px-3 py-1 rounded-full">{academy.curriculum.modules[selectedModule].duration} Duration</span>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Tactical Topics Covered</div>
                                    <div className="grid grid-cols-2 gap-4">
                                        {academy.curriculum.modules[selectedModule].topics.map((t, i) => (
                                            <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-xs text-slate-600">
                                                <div className="w-2 h-2 rounded-full bg-blue-600" /> {t}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                 <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white space-y-6">
                                    <div className="flex items-center gap-3">
                                        <Award className="text-amber-400" />
                                        <div className="text-[10px] font-black uppercase tracking-widest">Active Strategic Assignment</div>
                                    </div>
                                    {academy.curriculum.assignments[selectedModule] ? (
                                        <div className="space-y-4">
                                            <h5 className="text-lg font-black text-amber-50">{academy.curriculum.assignments[selectedModule].title}</h5>
                                            <p className="text-sm font-medium text-slate-400 leading-relaxed">{academy.curriculum.assignments[selectedModule].task}</p>
                                            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                                                <div className="text-[9px] font-black uppercase text-emerald-400">Goal: {academy.curriculum.assignments[selectedModule].objective}</div>
                                                <button className="px-6 py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform">Submit Answer</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                                            <p className="text-xs font-bold text-slate-400 italic">No specific assignment for this module</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-100 rounded-[3rem] p-20 text-center">
                                <div className="space-y-4">
                                    <Globe className="mx-auto text-slate-200" size={60} />
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Select a strategic module to begin training</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'consultancy' && (
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-slate-950 rounded-[3rem] border border-slate-100 p-12 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none rotate-12"><Globe size={400} /></div>
                        <div className="relative z-10 space-y-10">
                            <div className="space-y-4">
                                <div className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-600">Strategic Premium Report</div>
                                <h3 className="text-4xl font-black uppercase tracking-tighter">Elite Consultancy Brief</h3>
                            </div>
                            <div className="p-10 rounded-4xl bg-blue-50 border border-blue-100 italic text-xl font-bold text-blue-900 leading-relaxed">
                                &ldquo;{academy.premiumConsultancy}&rdquo;
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                {["Audit Compliance", "Market Penetration", "Digital Authority"].map(w => (
                                    <div key={w} className="p-6 rounded-2xl bg-white border border-slate-100 text-center space-y-3">
                                        <Shield size={20} className="mx-auto text-blue-500" />
                                        <div className="text-[9px] font-black uppercase tracking-widest">{w}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'advice' && (
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {academy.strategicAdvice.map((advice, i) => (
                        <div key={i} className="p-10 rounded-[2.5rem] bg-slate-900 text-white space-y-6 relative overflow-hidden group hover:scale-[1.02] transition-all">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -mr-10 -mt-10 group-hover:bg-blue-500/20 transition-colors" />
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-blue-400 font-black">0{i+1}</div>
                            <p className="text-sm font-bold leading-relaxed text-slate-300">{advice}</p>
                            <div className="pt-4 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-blue-400">
                                <Sparkles size={12} /> Strategic Insight
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
function StrategicRoadmap({ report, currentLang }: { report: FinalReport, currentLang: string }) {
    const [history, setHistory] = useState<CareerHistoryItem[]>([
        { id: Math.random().toString(), title: "", duration: "", from: "", to: "" }
    ]);
    const [ambition, setAmbition] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [roadmapResult, setRoadmapResult] = useState<RoadmapResult | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem("prof_roadmapResult");
        if (saved) {
            try { setRoadmapResult(JSON.parse(saved)); } catch { /* ignore */ }
        }
    }, []);

    const addHistory = () => {
        setHistory([...history, { id: Math.random().toString(), title: "", duration: "", from: "", to: "" }]);
    };

    const removeHistory = (id: string) => {
        setHistory(history.filter(i => i.id !== id));
    };

    const updateHistory = (id: string, field: keyof CareerHistoryItem, val: string) => {
        setHistory(history.map(h => h.id === id ? { ...h, [field]: val } : h));
    };

    const runAnalysis = async () => {
        if (!ambition.trim()) return alert(currentLang === 'ar' ? "يرجى كتابة طموحك المهني" : "Please state your career ambition");
        setIsAnalyzing(true);
        try {
            const res = await fetch("/api/strategic-roadmap/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ history, ambition, report, language: currentLang })
            });
            const data = await res.json();
            if (data.success) {
                setRoadmapResult(data.result);
                localStorage.setItem("prof_roadmapResult", JSON.stringify(data.result));
            } else {
                alert("Generation failed: " + data.error);
            }
        } catch (err) {
            console.error(err);
            alert("Analysis failed.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (roadmapResult) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 pb-20">
                <div className="flex justify-between items-center">
                    <button 
                        onClick={() => setRoadmapResult(null)}
                        className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 flex items-center gap-2"
                    >
                        <ArrowRight className="rotate-180" size={10} /> {currentLang === 'ar' ? "تعديل المداخلات" : "Edit Inputs"}
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="h-px w-32 bg-slate-100" />
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-600">The Mirror of Truth</span>
                        <div className="h-px w-32 bg-slate-100" />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl p-10 space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                                <AlertCircle size={20} />
                            </div>
                            <h3 className="font-black text-sm uppercase tracking-widest">{currentLang === 'ar' ? "المرآة الحقيقية: الواقع الحالي" : "Honest Mirror: Current Reality"}</h3>
                        </div>
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="text-[8px] font-black uppercase tracking-widest text-emerald-500">{currentLang === 'ar' ? "نقاط القوة الفعلية" : "Actual Strengths"}</div>
                                    <div className="space-y-2">
                                        {roadmapResult.currentRoleAnalysis.strengths.map((s, i) => (
                                            <div key={i} className="text-[10px] font-bold text-slate-600">• {s}</div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="text-[8px] font-black uppercase tracking-widest text-rose-500">{currentLang === 'ar' ? "نقاط الضعف الجوهرية" : "Core Weaknesses"}</div>
                                    <div className="space-y-2">
                                        {roadmapResult.currentRoleAnalysis.weaknesses.map((w, i) => (
                                            <div key={i} className="text-[10px] font-bold text-slate-600">• {w}</div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6 border-t border-slate-50 space-y-4">
                                <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">{currentLang === 'ar' ? "المهارات المفقودة للتمكن" : "Missing Mastery Skills"}</div>
                                <div className="flex flex-wrap gap-2">
                                    {roadmapResult.currentRoleAnalysis.missingHardSkills.map((s, i) => (
                                        <span key={i} className="px-3 py-1 bg-slate-50 dark:bg-slate-900 rounded-lg text-[9px] font-black text-slate-500 border border-slate-200 uppercase">{s}</span>
                                    ))}
                                    {roadmapResult.currentRoleAnalysis.missingSoftSkills.map((s, i) => (
                                        <span key={i} className="px-3 py-1 bg-indigo-50 dark:bg-slate-900 rounded-lg text-[9px] font-black text-indigo-500 border border-indigo-100 uppercase">{s}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 opacity-5 -mr-10 -mt-10"><Target size={200} /></div>
                        <div className="relative z-10 space-y-4">
                            <div className="text-emerald-400 font-black text-[9px] uppercase tracking-[0.4em]">{currentLang === 'ar' ? "تحليل طموحك" : "Ambition Viability"}</div>
                            <p className="text-lg font-bold leading-relaxed text-indigo-100 italic">&ldquo;{roadmapResult.ambitionPathway.viability}&rdquo;</p>
                        </div>
                        <div className="relative z-10 space-y-4 pt-4 border-t border-white/10">
                            {roadmapResult.ambitionPathway.steps.map((step, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="text-[10px] font-black uppercase text-indigo-400">{step.phase}</div>
                                    <div className="space-y-1">
                                        {step.actions.map((act, j) => (
                                            <div key={j} className="text-[10px] font-medium text-slate-400">• {act}</div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-950 rounded-[3rem] border border-slate-100 shadow-xl p-12 space-y-10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg">
                            <Compass size={24} />
                        </div>
                        <div>
                            <h3 className="font-black text-xl uppercase tracking-tighter">{currentLang === 'ar' ? "خارطة طريق المسيرة المهنية" : "Ultimate Career Roadmap"}</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{roadmapResult.ultimateRoadmap.strategicFocus}</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <div className="text-[10px] font-black uppercase tracking-widest text-indigo-600">{currentLang === 'ar' ? "إجراءات الـ 30 يوماً القادمة" : "Next 30 Days Actions"}</div>
                            <div className="space-y-3">
                                {roadmapResult.ultimateRoadmap.immediateActions.map((act, i) => (
                                    <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 flex items-center gap-4 group hover:border-indigo-500 transition-colors">
                                        <div className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:text-indigo-600">{i+1}</div>
                                        <span className="text-[11px] font-bold text-slate-700">{act}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{currentLang === 'ar' ? "محطات النجاح (Milestones)" : "Success Milestones"}</div>
                            <div className="space-y-3">
                                {roadmapResult.ultimateRoadmap.milestones.map((m, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-dashed border-slate-200">
                                        <CheckCircle2 className="text-emerald-500" size={16} />
                                        <span className="text-[11px] font-bold text-slate-500">{m}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 pb-20 max-w-4xl mx-auto">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest">
                    <Sparkles size={12} /> {currentLang === 'ar' ? "التخطيط الاستراتيجي للمسار" : "Strategic Career Pathing"}
                </div>
                <h2 className="text-4xl font-black uppercase tracking-tighter">{currentLang === 'ar' ? "ابنِ خارطة طريقك المهنية" : "Build Your Career Roadmap"}</h2>
                <p className="text-slate-500 text-sm font-medium">{currentLang === 'ar' ? "أدخل تاريخك المهني وطموحاتك وسنقوم بتحليل الواقع بدقة." : "Input your career history and ambitions, and we'll analyze the reality with precision."}</p>
            </div>

            <div className="bg-white dark:bg-slate-950 rounded-[3rem] border border-slate-100 shadow-xl p-10 space-y-10">
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600"><Briefcase size={20} /></div>
                            <h3 className="font-black text-sm uppercase tracking-widest">{currentLang === 'ar' ? "المسيرة المهنية" : "Work History"}</h3>
                        </div>
                        <button onClick={addHistory} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-colors">
                            <Plus size={14} /> {currentLang === 'ar' ? "إضافة منصب" : "Add Position"}
                        </button>
                    </div>

                    <div className="space-y-4">
                        {history.map((h) => (
                            <div key={h.id} className="relative group grid md:grid-cols-12 gap-4 p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-indigo-300 transition-all">
                                <button onClick={() => removeHistory(h.id)} className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white shadow-md border border-slate-100 items-center justify-center text-rose-500 hidden group-hover:flex">
                                    <Trash2 size={14} />
                                </button>
                                <div className="md:col-span-5 space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">{currentLang === 'ar' ? "المنصب" : "Position Title"}</label>
                                    <input 
                                        value={h.title} 
                                        onChange={(e) => updateHistory(h.id, 'title', e.target.value)}
                                        placeholder={currentLang === 'ar' ? "مثال: مدير تسويق" : "e.g. Marketing Director"}
                                        className="w-full bg-white rounded-xl px-4 py-2 text-sm font-bold border border-slate-100 focus:border-indigo-500 outline-none" 
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">{currentLang === 'ar' ? "مدة العمل" : "Duration"}</label>
                                    <input 
                                        value={h.duration} 
                                        onChange={(e) => updateHistory(h.id, 'duration', e.target.value)}
                                        placeholder="2 yrs"
                                        className="w-full bg-white rounded-xl px-4 py-2 text-sm font-bold border border-slate-100 focus:border-indigo-500 outline-none" 
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">{currentLang === 'ar' ? "من" : "From"}</label>
                                    <input 
                                        value={h.from} 
                                        onChange={(e) => updateHistory(h.id, 'from', e.target.value)}
                                        placeholder="2013"
                                        className="w-full bg-white rounded-xl px-4 py-2 text-sm font-bold border border-slate-100 focus:border-indigo-500 outline-none" 
                                    />
                                </div>
                                <div className="md:col-span-3 space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">{currentLang === 'ar' ? "إلى" : "To"}</label>
                                    <input 
                                        value={h.to} 
                                        onChange={(e) => updateHistory(h.id, 'to', e.target.value)}
                                        placeholder="2015 / Present"
                                        className="w-full bg-white rounded-xl px-4 py-2 text-sm font-bold border border-slate-100 focus:border-indigo-500 outline-none" 
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600"><Target size={20} /></div>
                        <h3 className="font-black text-sm uppercase tracking-widest">{currentLang === 'ar' ? "الطموح المهني" : "Career Ambition"}</h3>
                    </div>
                    <textarea 
                        value={ambition}
                        onChange={(e) => setAmbition(e.target.value)}
                        placeholder={currentLang === 'ar' ? "صف ما تحلم بالوصول إليه (مثال: خبير مدرب دولي، مدير استراتيجي...)" : "Describe what you want to achieve..."}
                        className="w-full h-32 bg-slate-50 rounded-4xl p-6 text-sm font-bold border border-slate-100 focus:border-indigo-500 outline-none resize-none"
                    />
                </div>

                <button 
                    onClick={runAnalysis}
                    disabled={isAnalyzing}
                    className="w-full py-6 rounded-3xl bg-slate-900 text-white font-black uppercase text-sm tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-black hover:scale-[1.02] transition-all disabled:opacity-50 shadow-2xl"
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 size={24} className="animate-spin" />
                            {currentLang === 'ar' ? "جاري التحليل الاستراتيجي..." : "Strategic Analysis in Progress..."}
                        </>
                    ) : (
                        <>
                            <Shield className="text-indigo-400" size={24} />
                            {currentLang === 'ar' ? "بدء التحليل الاستراتيجي الشامل" : "Start Comprehensive AI Analysis"}
                        </>
                    )}
                </button>
            </div>
        </motion.div>
    );
}

// ─── ROLE PERFORMANCE SIMULATOR (EXECUTIVE COACHING) ──────────────────────────
function ExecutiveCoaching({ report, currentLang }: { report: FinalReport, currentLang: string }) {
    const [mode, setMode] = useState<'setup' | 'audit' | 'scenario' | 'probing' | 'evaluation'>('setup');
    const [formData, setFormData] = useState({ sector: "", tasks: "", goals: "" });
    const [isBusy, setIsBusy] = useState(false);
    const [chat, setChat] = useState<{ role: 'assistant' | 'user', content: string }[]>([]);
    const [auditFeedback, setAuditFeedback] = useState("");
    const [evaluation, setEvaluation] = useState<PerformanceEvaluation | null>(null);

    const startAudit = async () => {
        if (!formData.sector || !formData.tasks || !formData.goals) {
            return alert(currentLang === 'ar' ? "يرجى إكمال جميع الحقول" : "Please fill all fields");
        }
        setIsBusy(true);
        try {
            const res = await fetch("/api/executive-coaching/simulation", {
                method: "POST",
                body: JSON.stringify({ phase: 'init', formData, report, language: currentLang })
            });
            const data = await res.json();
            if (data.success) {
                setAuditFeedback(data.feedback);
                setMode('audit');
            }
        } catch (err) { console.error(err); } finally { setIsBusy(false); }
    };

    const startScenario = async () => {
        setIsBusy(true);
        try {
            const res = await fetch("/api/executive-coaching/simulation", {
                method: "POST",
                body: JSON.stringify({ phase: 'scenario', formData, report, language: currentLang })
            });
            const data = await res.json();
            if (data.success) {
                setChat([{ role: 'assistant', content: data.scenario }]);
                setMode('scenario');
            }
        } catch (err) { console.error(err); } finally { setIsBusy(false); }
    };

    const handleSimulationStep = async (message: string) => {
        const newChat = [...chat, { role: 'user' as const, content: message }];
        setChat(newChat);
        setIsBusy(true);
        try {
            const res = await fetch("/api/executive-coaching/simulation", {
                method: "POST",
                body: JSON.stringify({ phase: 'probe', history: newChat, formData, report, language: currentLang })
            });
            const data = await res.json();
            if (data.success) {
                if (data.evaluation) {
                    setEvaluation(data.evaluation);
                    setMode('evaluation');
                } else {
                    setChat([...newChat, { role: 'assistant', content: data.nextQuestion }]);
                    if (mode === 'scenario') setMode('probing');
                }
            }
        } catch (err) { console.error(err); } finally { setIsBusy(false); }
    };

    if (mode === 'setup') {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 max-w-4xl mx-auto pb-20">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 text-violet-600 text-[10px] font-black uppercase tracking-widest border border-violet-100 italic">
                        <Zap size={12} /> Real-Role Performance Lab
                    </div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter">
                        {currentLang === 'ar' ? "التدريب التنفيذي الاستراتيجي" : "Executive Strategic Coaching"}
                    </h2>
                    <p className="text-slate-500 font-medium text-sm">
                        {currentLang === 'ar' ? "سنقوم باختبار قدراتك في منصبك الحالي وقياس مدى توافق استراتيجيتك مع الأهداف." : "We will test your performance in your current role and measure your strategic alignment."}
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-950 rounded-[3rem] border border-slate-100 shadow-2xl p-10 space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><MessageSquare size={200} /></div>
                    
                    <div className="grid md:grid-cols-2 gap-8 relative z-10">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{currentLang === 'ar' ? "قطاع الشركة" : "Company Sector"}</label>
                                <input 
                                    className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-bold border border-slate-100 focus:border-violet-500 outline-none"
                                    placeholder={currentLang === 'ar' ? "مثال: التكنولوجيا، الصناعة..." : "e.g. Fintech, Manufacturing..."}
                                    value={formData.sector}
                                    onChange={e => setFormData({ ...formData, sector: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{currentLang === 'ar' ? "الأهداف الاستراتيجية" : "Strategic Goals"}</label>
                                <textarea 
                                    className="w-full h-32 bg-slate-50 rounded-2xl p-4 text-sm font-bold border border-slate-100 focus:border-violet-500 outline-none resize-none"
                                    placeholder={currentLang === 'ar' ? "ما هي الأهداف التي تعمل على تحقيقها حالياً؟" : "What are your current key objectives?"}
                                    value={formData.goals}
                                    onChange={e => setFormData({ ...formData, goals: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{currentLang === 'ar' ? "المهام اليومية الأساسية" : "Core Daily Tasks"}</label>
                            <textarea 
                                className="w-full h-58 bg-slate-50 rounded-2xl p-4 text-sm font-bold border border-slate-100 focus:border-violet-500 outline-none resize-none"
                                placeholder={currentLang === 'ar' ? "اذكر المهام التي تقوم بها فعلياً في منصبك..." : "List your actual daily responsibilities..."}
                                value={formData.tasks}
                                onChange={e => setFormData({ ...formData, tasks: e.target.value })}
                            />
                        </div>
                    </div>

                    <button 
                        onClick={startAudit}
                        disabled={isBusy}
                        className="w-full py-6 rounded-3xl bg-violet-600 text-white font-black uppercase tracking-[0.3em] text-sm shadow-xl hover:bg-violet-700 transition-all flex items-center justify-center gap-4 hover:scale-[1.01]"
                    >
                        {isBusy ? <Loader2 className="animate-spin" size={24} /> : <Compass size={24} />}
                        {currentLang === 'ar' ? "بدء التدقيق في المنصب" : "Start Role Audit"}
                    </button>
                </div>
            </motion.div>
        );
    }

    if (mode === 'audit') {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-10 pb-20">
                <div className="bg-slate-900 rounded-[3rem] p-12 text-white space-y-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 opacity-10 -mr-16 -mt-16"><Brain size={300} /></div>
                    <div className="relative z-10 space-y-6">
                        <div className="text-violet-400 font-black text-[9px] uppercase tracking-[0.5em]">{currentLang === 'ar' ? "تحليل الكفاءة في المنصب" : "Role Competency Audit"}</div>
                        <div className="text-xl font-bold leading-relaxed text-indigo-50 italic">
                            &ldquo;{auditFeedback}&rdquo;
                        </div>
                        <div className="pt-8 flex gap-4">
                            <button 
                                onClick={startScenario}
                                disabled={isBusy}
                                className="flex-1 py-5 rounded-2xl bg-white text-slate-900 font-black uppercase text-xs tracking-widest hover:bg-violet-50 transition-colors flex items-center justify-center gap-3"
                            >
                                {isBusy ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} className="text-violet-600" />}
                                {currentLang === 'ar' ? "الانتقال للمحاكاة الواقعية" : "Enter Life Simulation"}
                            </button>
                            <button onClick={() => setMode('setup')} className="px-8 py-5 rounded-2xl border border-white/20 text-white font-black uppercase text-xs tracking-widest hover:bg-white/10">
                                {currentLang === 'ar' ? "تعديل البيانات" : "Adjust Data"}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    if (mode === 'scenario' || mode === 'probing') {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-8 pb-20">
                <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 shadow-2xl flex flex-col h-[600px] overflow-hidden">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-violet-600 text-white">
                        <div className="flex items-center gap-3">
                            <Mic size={20} />
                            <h3 className="text-[10px] font-black uppercase tracking-widest">Live Performance Lab</h3>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                                <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-widest bg-black/20 px-2 py-1 rounded">Simulation Active</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 space-y-6">
                        {chat.map((m, i) => (
                            <div key={i} className={cn("flex", m.role === 'assistant' ? "justify-start" : "justify-end")}>
                                <div className={cn(
                                    "max-w-[85%] p-6 rounded-3xl text-sm font-medium leading-relaxed shadow-sm",
                                    m.role === 'assistant' 
                                        ? "bg-slate-50 text-slate-700 border border-slate-100 rounded-tl-none" 
                                        : "bg-violet-600 text-white rounded-tr-none"
                                )}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {isBusy && (
                            <div className="flex justify-start">
                                <div className="bg-slate-50 p-6 rounded-3xl rounded-tl-none animate-pulse">
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" />
                                        <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce [animation-delay:0.2s]" />
                                        <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                        <form className="flex gap-4" onSubmit={(e) => {
                            e.preventDefault();
                            const form = e.currentTarget;
                            const input = (form.elements.namedItem("message") as HTMLInputElement)?.value;
                            if (!input || !input.trim() || isBusy) return;
                            handleSimulationStep(input);
                            form.reset();
                        }}>
                            <input 
                                name="message"
                                placeholder={currentLang === 'ar' ? "صف المهام التي ستقوم بها أو أجب على السؤال..." : "List your actions or answer the question..."}
                                className="flex-1 bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-violet-500 shadow-sm"
                                disabled={isBusy}
                            />
                            <button 
                                type="submit" 
                                disabled={isBusy}
                                className="w-14 h-14 rounded-2xl bg-violet-600 text-white flex items-center justify-center hover:bg-violet-700 transition-colors shadow-lg disabled:opacity-50"
                            >
                                <Send size={24} />
                            </button>
                        </form>
                    </div>
                </div>
            </motion.div>
        );
    }

    if (mode === 'evaluation' && evaluation) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-12 pb-20">
                <div className="text-center space-y-4">
                    <h3 className="text-3xl font-black uppercase tracking-tight">{currentLang === 'ar' ? "النتيجة والتقييم الاستراتيجي" : "Strategic Performance Verdict"}</h3>
                    <p className="text-slate-500 font-medium">{currentLang === 'ar' ? "تصحيح مطلق وشامل للأداء المهني والاستراتيجية المتبعة." : "Brutal and absolute correction of professional performance and strategy."}</p>
                </div>

                <div className="bg-white dark:bg-slate-950 rounded-[3rem] border border-slate-100 shadow-2xl p-12 space-y-10">
                    <div className="grid md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <div className="text-[10px] font-black uppercase tracking-widest text-violet-600 italic">Strategic Maturity</div>
                            <div className="text-5xl font-black">{evaluation.score}%</div>
                            <p className="text-sm font-bold text-slate-600 leading-relaxed">&ldquo;{evaluation.summary}&rdquo;</p>
                        </div>
                        <div className="bg-slate-900 rounded-4xl p-8 text-white space-y-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 opacity-10"><Shield size={100} /></div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-rose-400">Critical Corrections</div>
                            <div className="space-y-3">
                                {evaluation.corrections.map((c: string, i: number) => (
                                    <div key={i} className="flex gap-3 text-[11px] font-medium text-slate-300">
                                        <AlertCircle size={16} className="text-rose-400 shrink-0" /> {c}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-10 border-t border-slate-50 grid md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Strategic Alignment</div>
                            <div className="space-y-3">
                                {evaluation.alignmentNotes.map((n: string, i: number) => (
                                    <div key={i} className="flex gap-3 text-[11px] font-bold text-slate-600">
                                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> {n}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Expert Action Plan</div>
                            <div className="p-6 rounded-3xl bg-indigo-50 border border-indigo-100 italic text-[11px] font-bold text-indigo-800 leading-relaxed">
                                {evaluation.actionPlan}
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => { setMode('setup'); setEvaluation(null); setChat([]); }}
                        className="w-full py-5 rounded-3xl border-2 border-slate-900 font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-3"
                    >
                        <RefreshCw size={18} /> {currentLang === 'ar' ? "إعادة الاختبار من البداية" : "Reset & Test Again"}
                    </button>
                </div>
            </motion.div>
        );
    }

    return null;
}


// ─── SELF-MARKETING STUDIO (STAY/GROW/CHASE) ───────────────────────────────
function SelfMarketingStudio({ report, currentLang }: { report: FinalReport, currentLang: string }) {
    const [phase, setPhase] = useState<'intro' | 'discovery' | 'negotiation' | 'assets'>('intro');
    const [preferences, setPreferences] = useState({ job: "", salary: "", benefits: "", motivation: "" });
    const [chat, setChat] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [generatedAssets, setGeneratedAssets] = useState<{ cv: string, report: string } | null>(null);

    const startDiscovery = () => setPhase('discovery');

    const startNegotiation = async () => {
        if (!preferences.job || !preferences.salary) return alert(currentLang === 'ar' ? "يرجى ملء البيانات لتحديد البوصلة" : "Please fill in details to set the compass");
        setIsLoading(true);
        try {
            const userProfile = localStorage.getItem("userProfile");
            const userId = userProfile ? JSON.parse(userProfile).email : null;

            const firstMsg = currentLang === 'ar' 
                ? `بناءً على ملفي، أريد منصب ${preferences.job} براتب ${preferences.salary}. دوافعي هي: ${preferences.motivation}. جادلني بواقعية وبدون تمجيد.` 
                : `Based on my profile, I want a ${preferences.job} role with ${preferences.salary} salary. My motives: ${preferences.motivation}. Challenge me realistically.`;
            
            const res = await fetch("/api/self-marketing/negotiate", {
                method: "POST",
                body: JSON.stringify({ message: firstMsg, preferences, report, language: currentLang, history: [], userId })
            });
            const data = await res.json();
            setChat([{ role: 'user', content: firstMsg }, { role: 'assistant', content: data.reply }]);
            setPhase('negotiation');
        } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };

    const sendMessage = async (msg: string) => {
        const newChat = [...chat, { role: 'user' as const, content: msg }];
        setChat(newChat);
        setIsLoading(true);
        try {
            const userProfile = localStorage.getItem("userProfile");
            const userId = userProfile ? JSON.parse(userProfile).email : null;

            const res = await fetch("/api/self-marketing/negotiate", {
                method: "POST",
                body: JSON.stringify({ message: msg, preferences, report, language: currentLang, history: newChat, userId })
            });
            const data = await res.json();
            setChat([...newChat, { role: 'assistant', content: data.reply }]);
            if (data.readyForAssets) {
                // Potential hook for auto-transition
            }
        } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };

    const generateFinalAssets = async () => {
        setIsLoading(true);
        try {
            const userProfile = localStorage.getItem("userProfile");
            const userId = userProfile ? JSON.parse(userProfile).email : null;

            const res = await fetch("/api/self-marketing/assets", {
                method: "POST",
                body: JSON.stringify({ chat, preferences, report, language: currentLang, userId })
            });
            const data = await res.json();
            setGeneratedAssets(data.assets);
            setPhase('assets');
        } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };

    if (phase === 'intro') {
        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-20 flex flex-col items-center text-center space-y-10">
                <div className="w-24 h-24 rounded-4xl bg-amber-500 text-white flex items-center justify-center shadow-2xl relative">
                    <Rocket size={44} />
                    <div className="absolute -top-2 -right-2 bg-slate-900 text-white text-[8px] px-2 py-1 rounded-full font-black">ATS READY</div>
                </div>
                <div className="space-y-4 max-w-2xl">
                    <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">
                        {currentLang === 'ar' ? "ستوديو التسويق الذاتي" : "Self-Marketing Studio"}
                    </h2>
                    <p className="text-slate-500 font-medium italic">
                        {currentLang === 'ar' ? "ليس مجرد CV، بل استراتيجية كاملة لاقتناص الفرص الكبرى. سنقوم بمفاوضة طموحاتك وبناء أسلحتك التسويقية." : "Not just a CV, but a full strategy to capture major opportunities. We'll negotiate your ambitions and build your marketing arsenal."}
                    </p>
                </div>
                <button 
                    onClick={startDiscovery}
                    className="px-12 py-6 bg-slate-900 text-white rounded-4xl font-black uppercase text-xs tracking-[0.3em] flex items-center gap-4 hover:bg-black transition-all shadow-2xl hover:scale-105"
                >
                    <Target size={20} className="text-amber-400" />
                    {currentLang === 'ar' ? "ابدأ هندسة مستقبلك" : "Start Engineering Your Future"}
                </button>
            </motion.div>
        );
    }

    if (phase === 'discovery') {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-10 pb-20">
                <div className="bg-white dark:bg-slate-950 rounded-[3rem] border border-slate-100 p-12 shadow-2xl space-y-10">
                    <div className="space-y-2">
                        <h3 className="text-3xl font-black uppercase tracking-tighter">{currentLang === 'ar' ? "أين ترى نفسك غداً؟" : "Where do you see yourself?"}</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{currentLang === 'ar' ? "الصدق مع النفس هو أول خطوة للتسويق الناجح" : "Self-honesty is the first step to successful marketing"}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{currentLang === 'ar' ? "المنصب المستهدف" : "Target Role"}</label>
                            <input 
                                value={preferences.job}
                                onChange={(e) => setPreferences({...preferences, job: e.target.value})}
                                placeholder="CEO / Strategic Partner / ..."
                                className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-bold outline-none border border-slate-100 focus:border-amber-500 transition-all shadow-inner"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{currentLang === 'ar' ? "الراتب المتوقع" : "Expected Salary"}</label>
                            <input 
                                value={preferences.salary}
                                onChange={(e) => setPreferences({...preferences, salary: e.target.value})}
                                placeholder="$200k+ / Monthly ..."
                                className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-bold outline-none border border-slate-100 focus:border-amber-500 transition-all shadow-inner"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{currentLang === 'ar' ? "الامتيازات المطلوبة" : "Required Benefits"}</label>
                            <input 
                                value={preferences.benefits}
                                onChange={(e) => setPreferences({...preferences, benefits: e.target.value})}
                                placeholder="Equity, Remote work, Car allowance..."
                                className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-bold outline-none border border-slate-100 focus:border-amber-500 transition-all shadow-inner"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{currentLang === 'ar' ? "لماذا تريد التغيير / الترقية؟" : "Why change / promotion?"}</label>
                            <textarea 
                                value={preferences.motivation}
                                onChange={(e) => setPreferences({...preferences, motivation: e.target.value})}
                                className="w-full h-32 bg-slate-100/50 rounded-3xl px-6 py-4 font-bold outline-none border border-slate-100 focus:border-amber-500 transition-all resize-none shadow-inner"
                            />
                        </div>
                    </div>

                    <button 
                        onClick={startNegotiation}
                        className="w-full py-6 rounded-4xl bg-amber-600 text-white font-black uppercase text-xs tracking-[0.3em] hover:bg-amber-700 transition-all shadow-xl"
                    >
                        {isLoading ? <Loader2 className="animate-spin mx-auto" /> : (currentLang === 'ar' ? "دخول جلسة المفاوضة الصادقة" : "Enter Brutal Negotiation Table")}
                    </button>
                </div>
            </motion.div>
        );
    }

    if (phase === 'negotiation') {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto pb-20 space-y-6">
                <div className="bg-slate-900 rounded-[3rem] border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[600px]">
                    <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-white"><Shield size={16} /></div>
                            <div>
                                <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest italic leading-none">AI Market Negotiator</div>
                                <div className="text-white text-xs font-bold">{preferences.job} Inquiry</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                             <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Live Analysis</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 space-y-6 font-medium">
                        {chat.map((msg, i) => (
                            <div key={i} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                                <div className={cn(
                                    "max-w-[80%] p-5 rounded-3xl text-sm leading-relaxed",
                                    msg.role === 'user' ? "bg-amber-600 text-white rounded-tr-none" : "bg-white/5 text-slate-300 border border-white/10 rounded-tl-none italic"
                                )}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 border-t border-white/5 bg-slate-900/50 backdrop-blur-xl">
                        <div className="flex gap-4">
                            <input 
                                onKeyDown={(e) => { if (e.key === 'Enter') { sendMessage(e.currentTarget.value); e.currentTarget.value = ""; } }}
                                placeholder={currentLang === 'ar' ? "أجب بصدق، أو واجه الحقيقة..." : "Speak the truth, or face it..."}
                                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-amber-500/50 transition-all"
                            />
                            <button 
                                onClick={generateFinalAssets}
                                className="px-8 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-700 transition-all flex items-center gap-2"
                            >
                                <Sparkles size={14} /> Finalize
                            </button>
                        </div>
                    </div>
                </div>
                <div className="text-center">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-relaxed">
                        The objective is to understand your real value vs. market friction. <br/> No sugar-coating. Just strategy.
                    </p>
                </div>
            </motion.div>
        );
    }

    if (phase === 'assets') {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 pb-20">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-slate-950 rounded-[3rem] border border-slate-100 shadow-xl p-10 space-y-8 flex flex-col">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg"><FileText size={24} /></div>
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-tighter">ATS-Propelled CV</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Optimized for algorithms & elite perception</p>
                            </div>
                        </div>
                        <div className="flex-1 p-6 bg-slate-50 rounded-4xl border border-dashed border-slate-200 overflow-y-auto max-h-[400px]">
                            <div className="prose prose-sm font-bold whitespace-pre-wrap text-slate-700">
                                {generatedAssets?.cv}
                            </div>
                        </div>
                        <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3">
                            <Download size={16} /> Export as PDF Document
                        </button>
                    </div>

                    <div className="bg-slate-900 rounded-[3rem] p-10 text-white space-y-8 flex flex-col border border-white/5 shadow-2xl">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg"><Award size={24} /></div>
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-tighter">
                                    {currentLang === 'ar' ? "التقرير الاستراتيجي التنفيذي" : "Executive Strategic Report"}
                                </h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-amber-500/70 italic">Board-ready synthesis & value proposition</p>
                            </div>
                        </div>
                        <div className="flex-1 p-8 bg-white/5 rounded-4xl border border-white/10 leading-relaxed text-slate-300 text-sm overflow-y-auto max-h-[400px] prose prose-invert prose-sm">
                            <div className="whitespace-pre-wrap font-medium">
                                {generatedAssets?.report}
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-emerald-500 text-slate-900 text-center font-black uppercase text-[10px] tracking-widest">
                            {currentLang === 'ar' ? "تم تحديث بوصلتك المهنية بنجاح" : "Strategic Compass Updated Successfully"}
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    return null;
}


// ─── FINAL STRATEGIC VERDICT ───────────────────────────────────────────────
function FinalStrategicVerdict({ report, currentLang }: { report: FinalReport, currentLang: string }) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 pb-20">
            <div className="bg-slate-900 rounded-[3rem] p-12 text-white overflow-hidden relative border border-white/5 shadow-2xl">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-[120px] -mr-64 -mt-64" />
                <div className="relative z-10 space-y-8">
                    <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-400 text-[9px] font-black uppercase tracking-[0.4em]">
                                <Sparkles size={12} /> {currentLang === 'ar' ? "التوليد الاستراتيجي النهائي" : "Final Strategic Synthesis"}
                            </div>
                            <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">
                                {currentLang === 'ar' ? "حكم الخبير الاستراتيجي" : "The Ultimate Strategic Verdict"}
                            </h2>
                            <p className="text-rose-100/60 max-w-2xl text-lg font-medium leading-relaxed italic">
                                &ldquo;{report.finalVerdict}&rdquo;
                            </p>
                        </div>
                        <div className="w-40 h-40 rounded-4xl bg-white/5 border border-white/10 flex flex-col items-center justify-center backdrop-blur-xl">
                            <div className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">{currentLang === 'ar' ? "الوزن السوقي" : "Market Weight"}</div>
                            <div className="text-5xl font-black">{report.marketValue}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-10">
                        {/* Card 1 */}
                        <div className="p-8 rounded-4xl bg-white/5 border border-white/10 space-y-4 min-w-0 w-full shadow-lg">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{currentLang === 'ar' ? "العنصر الجوهري" : "The Core Element"}</h4>
                            <div className="text-sm font-bold leading-relaxed text-slate-200">
                                {report.profileSummary}
                            </div>
                        </div>
                        
                        {/* Card 2 */}
                        <div className="p-8 rounded-4xl bg-white/5 border border-white/10 space-y-4 min-w-0 w-full shadow-lg">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{currentLang === 'ar' ? "بصمة القيادة" : "Leadership Impact"}</h4>
                            <div className="text-sm font-bold leading-relaxed text-slate-200">
                                {report.leadershipFingerprint?.description || (currentLang === 'ar' ? "قائد استراتيجي ذو أثر عالٍ" : "High Impact Strategist")}
                            </div>
                        </div>

                        {/* Card 3 - Red Focus */}
                        <div className="p-8 rounded-4xl bg-rose-600 text-white space-y-6 min-w-0 w-full shadow-2xl flex flex-col justify-between">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest opacity-70 text-white">{currentLang === 'ar' ? "الأولوية الكبرى" : "Mission Priority"}</h4>
                                <div className="text-lg font-black leading-tight">
                                    {report.gapAnalysis.criticalCompetencyGaps[0] || (currentLang === 'ar' ? "التحول الاستراتيجي" : "Strategic Transformation")}
                                </div>
                            </div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/20 text-[8px] font-black uppercase tracking-tighter w-fit">
                                <Shield size={10} /> CRITICAL FOCUS
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-950 rounded-[3.5rem] p-12 border border-slate-100 shadow-xl space-y-8">
                    <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                        <TrendingUp className="text-rose-500" />
                        {currentLang === 'ar' ? "التوسع المهني الموصى به" : "Recommended Career Ascension"}
                    </h3>
                    <div className="space-y-4">
                        {report.recommendedRoles.map((role, i) => (
                            <div key={i} className="flex items-center justify-between p-5 rounded-3xl bg-slate-50 border border-slate-100 group hover:border-rose-500 hover:bg-rose-50 transition-all cursor-default">
                                <span className="font-bold text-slate-700">{role}</span>
                                <ArrowRight size={16} className="text-slate-300 group-hover:text-rose-500 group-hover:translate-x-2 transition-all" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white space-y-8 border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
                    <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                        <Zap className="text-amber-400" />
                        {currentLang === 'ar' ? "رؤية الخبير العميقة" : "Expert Deep Insight"}
                    </h3>
                    <div className="space-y-6">
                        {report.deepInsights.map((insight, i) => (
                            <div key={i} className="flex gap-4 group">
                                <div className="w-1 h-auto bg-rose-500/30 rounded-full group-hover:bg-rose-500 transition-colors shrink-0" />
                                <p className="text-slate-300 text-sm font-medium italic leading-relaxed">{insight}</p>
                            </div>
                        ))}
                    </div>
                    <div className="pt-6 border-t border-white/5">
                         <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                             <CheckCircle2 size={12} /> Path Validated by McKinsey Standard Engine
                         </div>
                    </div>
                </div>
            </div>
            
            <div className="text-center py-20 bg-linear-to-b from-transparent to-slate-100/50 dark:to-slate-900/20 rounded-[4rem] space-y-8">
                <div className="space-y-4">
                    <h3 className="text-3xl font-black uppercase tracking-tighter">
                        {currentLang === 'ar' ? "هل أنت مستعد للتنفيذ؟" : "Ready for Execution?"}
                    </h3>
                    <p className="text-slate-500 font-medium max-w-xl mx-auto">
                        {currentLang === 'ar' 
                            ? "انتقل الآن إلى استوديو الأداء التنفيذي لبدء ورش العمل وتفعيل استراتيجية نموك." 
                            : "Proceed to your Executive Performance Studio to begin workshops and activate your growth strategy."}
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button className="px-10 py-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-3xl font-bold uppercase text-[10px] tracking-widest shadow-xl hover:bg-slate-50 transition-all flex items-center gap-2">
                        <FileText size={16} className="text-rose-500" />
                        {currentLang === 'ar' ? "تحميل التقرير النهائي (PDF)" : "Download Full Thesis (PDF)"}
                    </button>
                    <a href="/professional/performance-studio" className="px-10 py-5 bg-slate-900 text-white rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-2xl hover:bg-black hover:scale-105 transition-all flex items-center gap-2 group">
                        {currentLang === 'ar' ? "دخول استوديو الأداء" : "Enter Performance Studio"}
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
            </div>
        </motion.div>
    );
}


// ─── DIAGNOSTIC MODULE ────────────────────────────────────────────────────────
function DiagnosticAvance({ report, currentLang }: { report: FinalReport, currentLang: string }) {
  const t_sections = {
    en: { identity: "Audit Certified · X-Ray Standard", radar: "Strategic Radar", dimensions: "5 Executive Dimensions", archetype: "Strategic Archetype", authority: "Current Authority", potential: "Future Potential", fingerprint: "Leadership Fingerprint", awareness: "Self-Awareness Index", velocity: "Career Velocity", verdict: "Expert Final Verdict", headhunter: "Market Perception (Headhunter View)", swot: "Strategic SWOT Analysis", gaps: "Gap Analysis", gapsSub: "Reality Check · Critical Competency Gaps", plan: "90-Day Execution Plan", truth: "Hidden Truths & Deep Insights", observe: "Expert Observations Feed", raw: "Raw behavioral signals captured from transcript analysis.", linkedin: "LinkedIn Authority Strategy", roles: "Recommended Roles for Immediate Pursuit" },
    ar: { identity: "تدقيق معتمد · معيار X-Ray", radar: "الرادار الاستراتيجي", dimensions: "5 أبعاد تنفيذية", archetype: "النمط الاستراتيجي", authority: "السلطة الحالية", potential: "الإمكانات المستقبلية", fingerprint: "بصمة القيادة", awareness: "مؤشر الوعي الذاتي", velocity: "سرعة المسار المهني", verdict: "الحكم النهائي للخبير", headhunter: "منظور السوق (رؤية Headhunter)", swot: "تحليل SWOT الاستراتيجي", gaps: "تحليل الفجوات", gapsSub: "مواجهة الواقع · الفجوات المهارية الحرجة", plan: "خطة التنفيذ (90 يوماً)", truth: "الحقائق الخفية والرؤى العميقة", observe: "ملاحظات الخبراء السلوكية", raw: "إشارات سلوكية خام مستخلصة من تحليل المقابلات.", linkedin: "استراتيجية الظهور على LinkedIn", roles: "الأدوار الموصى بها للمتابعة الفورية" },
    fr: { identity: "Audit Certifié · Standard X-Ray", radar: "Radar Stratégique", dimensions: "5 Dimensions Exécutives", archetype: "Archétype Stratégique", authority: "Autorité Actuelle", potential: "Potentiel Futur", fingerprint: "Empreinte Leadership", awareness: "Indice de Conscience de Soi", velocity: "Vitesse de Carrière", verdict: "Verdict Final Expert", headhunter: "Perception Marché (Vision Headhunter)", swot: "Analyse SWOT Stratégique", gaps: "Analyse des Écarts", gapsSub: "Réalité · Écarts de Compétences Critiques", plan: "Plan d'Exécution (90 Jours)", truth: "Vérités Cachées & Insights Profonds", observe: "Flux d'Observations Experts", raw: "Signaux comportementaux bruts capturés lors de l'analyse.", linkedin: "Stratégie d'Autorité LinkedIn", roles: "Rôles recommandés pour poursuite immédiate" }
  }[(currentLang as "en" | "ar" | "fr") || "en"];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 pb-20">

      {/* ── HERO: Profile Identity Card ── */}
      <div className="relative rounded-[3rem] overflow-hidden bg-linear-to-br from-slate-900 via-indigo-950 to-black p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-violet-500/10 blur-3xl -ml-20 -mb-20" />
        <div className="relative z-10 flex flex-col md:flex-row gap-10 items-start md:items-center justify-between">
          <div className="space-y-4 flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[9px] font-black uppercase tracking-[0.4em]">
              <CheckCircle2 size={12} /> {t_sections.identity}
            </div>
            <h2 className="text-4xl font-black uppercase tracking-tighter text-white leading-none">
              {report.maturityLevel}
            </h2>
            <p className="text-slate-300 text-sm font-medium leading-relaxed max-w-xl">
              &ldquo;{report.profileSummary}&rdquo;
            </p>
          </div>
          <div className="flex gap-6 shrink-0">
            <ScoreRing value={report.gapAnalysis.hardSkillsMatch} label="Hard Skills" color="indigo" />
            <ScoreRing value={report.gapAnalysis.softSkillsMatch} label="Soft Skills" color="emerald" />
            {report.selfAwarenessScore && (
              <ScoreRing value={report.selfAwarenessScore.score} label="Self-Aware" color="amber" />
            )}
          </div>
        </div>
      </div>

      {/* ── ROW 1: Radar + Authority Matrix ── */}
      {(report.strategicRadar || report.authorityVsPotential) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {report.strategicRadar && (
            <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl p-10 space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-widest">{t_sections.radar}</h3>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{t_sections.dimensions}</p>
                </div>
              </div>
              <div className="space-y-5">
                {Object.entries(report.strategicRadar).map(([key, val]) => (
                  <RadarBar key={key} label={key} value={val as number} />
                ))}
              </div>
            </div>
          )}

          {report.authorityVsPotential && (
            <div className="bg-linear-to-br from-slate-900 to-black rounded-[2.5rem] shadow-2xl p-10 space-y-8 relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 opacity-[0.04]"><Target size={200} /></div>
              <div className="relative z-10 space-y-2">
                <div className="text-emerald-400 font-black text-[9px] uppercase tracking-[0.4em]">{t_sections.archetype}</div>
                <h3 className="text-3xl font-black uppercase leading-tight">{report.authorityVsPotential.quadrant}</h3>
              </div>
              <div className="grid grid-cols-2 gap-8 relative z-10">
                {[
                  { label: t_sections.authority, value: report.authorityVsPotential.currentAuthority, color: "bg-emerald-500" },
                  { label: t_sections.potential, value: report.authorityVsPotential.futurePotential, color: "bg-indigo-500" }
                ].map(({ label, value, color }) => (
                  <div key={label} className="space-y-3">
                    <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</div>
                    <div className="text-5xl font-black">{value}<span className="text-slate-600 text-xl">%</span></div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1.2 }} className={cn("h-full rounded-full", color)} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="relative z-10 p-4 rounded-2xl bg-white/5 border border-white/10 text-[9px] font-medium italic text-slate-400">
                High-precision mapping of current market weight vs. native cognitive adaptability.
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── ROW 2: Leadership Fingerprint + Trajectory + Self-Awareness ── */}
      {(report.leadershipFingerprint || report.trajectoryVelocity || report.selfAwarenessScore) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {report.leadershipFingerprint && (
            <div className="bg-linear-to-br from-violet-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-violet-200 text-[9px] font-black uppercase tracking-[0.4em]">
                <User size={14} /> {t_sections.fingerprint}
              </div>
              <div className="text-3xl font-black uppercase">{report.leadershipFingerprint.archetype}</div>
              <p className="text-xs text-violet-100 font-medium leading-relaxed">{report.leadershipFingerprint.description}</p>
              <div className="border-t border-violet-400/30 pt-4 space-y-1">
                <div className="text-[8px] font-black uppercase tracking-widest text-violet-300">⚠ Risk Context</div>
                <p className="text-[10px] text-violet-100">{report.leadershipFingerprint.riskContext}</p>
              </div>
            </div>
          )}

          {report.selfAwarenessScore && (
            <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl p-8 space-y-5">
              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] text-amber-500">
                <Sparkles size={14} /> {t_sections.awareness}
              </div>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-black text-amber-500">{report.selfAwarenessScore.score}</span>
                <span className="text-slate-400 text-lg font-black mb-1">/100</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${report.selfAwarenessScore.score}%` }} transition={{ duration: 1.2 }}
                  className={cn("h-full rounded-full", report.selfAwarenessScore.score >= 70 ? "bg-emerald-500" : report.selfAwarenessScore.score >= 40 ? "bg-amber-500" : "bg-rose-500")} />
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-amber-600">{report.selfAwarenessScore.verdict}</div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{report.selfAwarenessScore.evidence}</p>
            </div>
          )}

          {report.trajectoryVelocity && (
            <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl p-8 space-y-5">
              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] text-emerald-500">
                <TrendingUp size={14} /> {t_sections.velocity}
              </div>
              <div className={cn("text-4xl font-black uppercase",
                report.trajectoryVelocity.assessment === "Accelerating" ? "text-emerald-500"
                : report.trajectoryVelocity.assessment === "On-track" ? "text-blue-500"
                : report.trajectoryVelocity.assessment === "Plateauing" ? "text-amber-500" : "text-rose-500"
              )}>
                {report.trajectoryVelocity.assessment}
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{report.trajectoryVelocity.rationale}</p>
            </div>
          )}
        </div>
      )}

      {/* ── ROW 3: Final Verdict + Market Perception ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative rounded-[2.5rem] bg-linear-to-br from-indigo-600 to-blue-700 p-10 text-white shadow-2xl overflow-hidden">
          <Shield className="absolute -top-8 -right-8 w-48 h-48 text-white/5 rotate-12" />
          <div className="relative z-10 space-y-6">
            <div className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-200">{t_sections.verdict}</div>
            <p className="text-lg font-bold leading-relaxed text-blue-50">&ldquo;{report.finalVerdict}&rdquo;</p>
          </div>
        </div>

        {report.marketPerceptionVerdict ? (
          <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl p-10 space-y-5">
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] text-indigo-500">
              <Globe size={14} /> {t_sections.headhunter}
            </div>
            <p className="text-sm font-bold text-slate-600 dark:text-slate-400 leading-relaxed italic">
              &ldquo;{report.marketPerceptionVerdict}&rdquo;
            </p>
            <div className="pt-4 space-y-3 border-t border-slate-100 dark:border-slate-800">
              <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Market Value Assessment</div>
              <div className="text-base font-black text-emerald-600 uppercase">{report.marketValue}</div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl p-10 space-y-5">
            <div className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Market Value</div>
            <div className="text-2xl font-black text-emerald-600 uppercase">{report.marketValue}</div>
          </div>
        )}
      </div>

      {/* ── ROW 4: SWOT ── */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
          <h3 className="font-black text-sm uppercase tracking-[0.3em] text-slate-400">{t_sections.swot}</h3>
          <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { key: "strengths" as const, label: currentLang === 'ar' ? "نقاط القوة" : "Strengths", color: "emerald", icon: <TrendingUp size={16} /> },
            { key: "weaknesses" as const, label: currentLang === 'ar' ? "نقاط الضعف" : "Weaknesses", color: "rose", icon: <X size={16} /> },
            { key: "opportunities" as const, label: currentLang === 'ar' ? "الفرص" : "Opportunities", color: "blue", icon: <Zap size={16} /> },
            { key: "threats" as const, label: currentLang === 'ar' ? "المخاطر" : "Threats", color: "amber", icon: <Shield size={16} /> },
          ].map(({ key, label, color, icon }) => {
            const colorMap: Record<string, string> = {
              emerald: "bg-emerald-500/5 border-emerald-500/20 text-emerald-600",
              rose: "bg-rose-500/5 border-rose-500/20 text-rose-500",
              blue: "bg-blue-500/5 border-blue-500/20 text-blue-600",
              amber: "bg-amber-500/5 border-amber-500/20 text-amber-600"
            };
            const dotMap: Record<string, string> = {
              emerald: "bg-emerald-500", rose: "bg-rose-500", blue: "bg-blue-500", amber: "bg-amber-500"
            };
            return (
              <div key={key} className={cn("rounded-4xl border-2 p-7 space-y-5", colorMap[color])}>
                <div className="flex items-center gap-2">
                  <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center bg-white dark:bg-slate-950 shadow-sm")}>{icon}</div>
                  <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
                </div>
                <div className="space-y-2">
                  {report.swot[key].map((item: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-[10px] font-medium leading-relaxed text-slate-700 dark:text-slate-300">
                      <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5 shrink-0", dotMap[color])} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── ROW 5: Gap Analysis ── */}
      <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl p-10 space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500"><AlertCircle size={20} /></div>
          <div>
            <h3 className="font-black text-sm uppercase tracking-widest">{t_sections.gaps}</h3>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{t_sections.gapsSub}</p>
          </div>
        </div>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">{report.gapAnalysis.currentJobVsReality}</p>
        {report.gapAnalysis.comparisonPositionReality && (
          <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20">
            <p className="text-xs font-bold text-amber-700 dark:text-amber-400 italic">{report.gapAnalysis.comparisonPositionReality}</p>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {report.gapAnalysis.criticalCompetencyGaps.map((gap, i) => (
            <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-rose-600 text-[10px] font-black uppercase tracking-tight">
              <X size={12} /> {gap}
            </div>
          ))}
        </div>
      </div>

      {/* ── ROW 6: 90-Day Action Plan ── */}
      {report.actionPlan90Days && report.actionPlan90Days.length > 0 && (
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
            <h3 className="font-black text-sm uppercase tracking-[0.3em] text-slate-400">{t_sections.plan}</h3>
            <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {report.actionPlan90Days.map((step, i) => (
              <div key={i} className="relative bg-white dark:bg-slate-950 rounded-4xl border border-slate-100 dark:border-slate-800 shadow-lg p-8 space-y-3">
                <div className="absolute -top-3 left-6 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest px-4 py-1 rounded-full">
                  {step.week}
                </div>
                <div className="pt-2 text-xs font-black uppercase tracking-tight text-slate-800 dark:text-white">{step.action}</div>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{step.rationale}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ROW 7: Deep Insights + Expert Notes ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl p-10 space-y-6">
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] text-orange-500">
            <Sparkles size={14} /> {t_sections.truth}
          </div>
          <div className="space-y-4">
            {report.deepInsights.map((insight, i) => (
              <div key={i} className="flex items-start gap-3 text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="text-orange-500 font-black text-sm mt-0.5">/</span> {insight}
              </div>
            ))}
          </div>
        </div>

        {report.expertInterviewNotes && report.expertInterviewNotes.length > 0 && (
          <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl p-10 space-y-6">
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] text-amber-400">
              <Mic size={14} /> {t_sections.observe}
            </div>
            <div className="space-y-4">
              {report.expertInterviewNotes.map((note, i) => (
                <div key={i} className="border-l-2 border-amber-500/30 pl-4 text-[10px] font-medium text-slate-400 leading-relaxed italic">
                  {note}
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-slate-800 text-[8px] font-black uppercase tracking-widest text-slate-700">
              {t_sections.raw}
            </div>
          </div>
        )}
      </div>

      {/* ── ROW 8: LinkedIn Strategy + Career Paths ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {report.linkedInStrategy && (
          <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl p-10 space-y-6">
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] text-blue-600">
              <Globe size={14} /> {t_sections.linkedin}
            </div>
            <div className="space-y-5">
              <div className="space-y-1">
                <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">Recommended Headline</div>
                <p className="text-sm font-black text-slate-800 dark:text-white">{report.linkedInStrategy.headline}</p>
              </div>
              <div className="space-y-1">
                <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">Profile Focus</div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">{report.linkedInStrategy.summaryFocus}</p>
              </div>
              <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/10 space-y-1">
                <div className="text-[8px] font-black uppercase tracking-widest text-blue-500">Networking Advice</div>
                <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400">{report.linkedInStrategy.networkingAdvice}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl p-10 space-y-6">
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] text-indigo-600">
            <Target size={14} /> {currentLang === 'ar' ? "مسارات التقدم المهني" : "Career Advancement Paths"}
          </div>
          <div className="space-y-4">
            {report.careerAdvancement.slice(0, 3).map((path, i) => (
              <div key={i} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-tight text-slate-800 dark:text-white">{path.role}</span>
                  <div className="flex gap-2">
                    <span className="text-[8px] font-black px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600">{path.shortTermProbability}%</span>
                    <span className="text-[8px] font-black px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600">{path.longTermProbability}%</span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${path.longTermProbability}%` }} transition={{ duration: 1 }} className="h-full bg-indigo-500 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recommended Roles ── */}
      <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl p-10 space-y-6">
        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] text-blue-600">
          <FileText size={14} /> {t_sections.roles}
        </div>
        <div className="flex flex-wrap gap-3">
          {report.recommendedRoles.map((role, i) => (
            <div key={i} className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-xs font-black">
              <ChevronRight size={12} /> {role}
            </div>
          ))}
        </div>
      </div>

      {/* ── Certifier Signature ── */}
      <div className="pt-10 flex flex-col items-center gap-6 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
        <div className="w-px h-20 bg-linear-to-b from-transparent via-slate-400 to-transparent" />
        <div className="text-center space-y-4">
           <div className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-500">Board Certification Standard</div>
           <div className="font-serif italic text-2xl text-slate-800 dark:text-white">Expert Audit Commission</div>
           <div className="flex items-center justify-center gap-4 text-[8px] font-black uppercase tracking-widest text-slate-400">
             <span>REF: STRAT-XRAY-2024</span>
             <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
             <span>DIGITALISA APPROVED</span>
           </div>
        </div>
      </div>

    </motion.div>
  );
}

// ─── MAIN EXECUTIVE DASHBOARD ─────────────────────────────────────────────────
export default function ExecutiveDashboard() {
  const [activeModule, setActiveModule] = useState<ModuleId>("diagnostic");
  const [report, setReport] = useState<FinalReport | null>(null);
  const [loading, setLoading] = useState(true);

  const { language: currentLang } = useLanguage();
  const t_ui = {
    en: { back: "← Back to Audit", command: "Executive Command Center", subtitle: "Full Professional X-Ray · McKinsey Standard", soon: "Module Available Soon", auditTitle: "No Audit Data Found", auditSub: "Complete the Professional Audit first to access your Executive Dashboard.", startAudit: "Start Audit" },
    ar: { back: "← العودة للتدقيق", command: "مركز القيادة التنفيذية", subtitle: "تقرير X-Ray المهني · معيار ماكينزي", soon: "الوحدة متوفرة قريباً", auditTitle: "لم يتم العثور على بيانات", auditSub: "يرجى إكمال التدقيق المهني أولاً للوصول إلى لوحة التحكم.", startAudit: "ابدأ التدقيق" },
    fr: { back: "← Retour à l'Audit", command: "Centre de Commandement", subtitle: "Diagnostic Professionnel · Standard McKinsey", soon: "Module bientôt disponible", auditTitle: "Aucune donnée trouvée", auditSub: "Veuillez compléter l'audit professionnel pour accéder à votre tableau de bord.", startAudit: "Démarrer l'Audit" }
  }[(currentLang as "en" | "ar" | "fr") || "en"];

  useEffect(() => {
    const hydrate = () => {
      const saved = localStorage.getItem("prof_finalReport");
      let parsedReport: FinalReport | null = null;
      if (saved) {
        try { parsedReport = JSON.parse(saved) as FinalReport; } catch { /* ignore */ }
      }
      setReport(parsedReport);
      setLoading(false);
    };
    
    // Defer state update to next tick to avoid cascading render warning
    const timeout = setTimeout(hydrate, 0);
    return () => clearTimeout(timeout);
  }, []);

  const activeModuleData = MODULES.find(m => m.id === activeModule)!;

  const colorMap: Record<string, string> = {
    indigo: "text-indigo-500 border-indigo-500 bg-indigo-500/10",
    emerald: "text-emerald-500 border-emerald-500 bg-emerald-500/10",
    violet: "text-violet-500 border-violet-500 bg-violet-500/10",
    blue: "text-blue-500 border-blue-500 bg-blue-500/10",
    amber: "text-amber-500 border-amber-500 bg-amber-500/10",
    rose: "text-rose-500 border-rose-500 bg-rose-500/10",
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 text-center" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="w-20 h-20 rounded-4xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
          <AlertCircle className="text-slate-400" size={36} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black uppercase tracking-tight">{t_ui.auditTitle}</h2>
          <p className="text-slate-500 text-sm font-medium">{t_ui.auditSub}</p>
        </div>
        <a href="/professional" className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all">
          <ArrowRight size={16} /> {t_ui.startAudit}
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

      {/* ── TOP HEADER BAR ── */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">

          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <div className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Executive</div>
              <div className="text-sm font-black uppercase tracking-tight text-slate-800 dark:text-white leading-none">{t_ui.command}</div>
            </div>
          </div>

          {/* Module Tabs */}
          <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1 justify-center">
            {MODULES.map((mod) => (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod.id)}
                disabled={mod.locked}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest whitespace-nowrap",
                  activeModule === mod.id
                    ? cn("border", colorMap[mod.color])
                    : mod.locked
                    ? "text-slate-300 dark:text-slate-700 cursor-not-allowed"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900"
                )}
              >
                {mod.icon}
                <span className="hidden sm:inline">{currentLang === 'ar' ? mod.labelAr : mod.label}</span>
                {mod.badge && (
                  <span className="ml-1 px-1.5 py-0.5 text-[7px] font-black bg-emerald-500 text-white rounded-full">{mod.badge}</span>
                )}
                {mod.locked && <Lock size={10} className="opacity-40" />}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all">
              <Sparkles size={12} className="text-amber-400" /> {currentLang === 'ar' ? "تحميل التقرير" : "Download PDF"}
            </button>
            <a href="/professional" className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900">
              {t_ui.back}
            </a>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1" />
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
              className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all group"
              title={currentLang === 'ar' ? 'تسجيل الخروج' : 'Log Out'}
            >
              <LogOut size={16} className={currentLang === 'ar' ? 'rotate-180' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* ── MODULE CONTENT AREA ── */}
      <div className="max-w-7xl mx-auto px-6 py-10" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>

        {/* Module Header */}
        <div className="mb-10 flex items-center gap-4">
          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border", colorMap[activeModuleData.color])}>
            {activeModuleData.icon}
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight">
              {currentLang === 'ar' ? activeModuleData.labelAr : activeModuleData.label}
            </h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {activeModule === "diagnostic" ? t_ui.subtitle : t_ui.soon}
            </p>
          </div>
        </div>

        {/* Render Active Module */}
        <AnimatePresence mode="wait">
          <div key={activeModule}>
            {activeModule === "diagnostic" && <DiagnosticAvance report={report} currentLang={currentLang || 'en'} />}
            {activeModule === "roadmap" && <StrategicRoadmap report={report} currentLang={currentLang || 'en'} />}
            {activeModule === "coaching" && <ExecutiveCoaching report={report} currentLang={currentLang || 'en'} />}
            {activeModule === "positioning" && <StrategicAcademy report={report} currentLang={currentLang || 'en'} />}
            {activeModule === "network" && <SelfMarketingStudio report={report} currentLang={currentLang || 'en'} />}
            {activeModule === "verdict" && <FinalStrategicVerdict report={report} currentLang={currentLang || 'en'} />}
            {activeModuleData.locked && <LockedModule module={activeModuleData} />}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
}
