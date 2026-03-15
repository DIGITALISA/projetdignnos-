"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  BarChart3, Target, Brain, MessageSquare, Sparkles, Shield,
  TrendingUp, User, Globe, ArrowRight, CheckCircle2, X, Zap, Lock,
  FileText, Award, ChevronRight, AlertCircle, Mic, Loader2,
  Compass, Send, RefreshCw, Rocket, Download, LogOut, Clock, ShieldCheck, Dna
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface FinalReport {
  profileSummary: string;
  maturityLevel: string;
  leadershipFingerprint?: { archetype: string; description: string; riskContext: string };
  careerTypology?: "Specialist" | "Generalist" | "T-Shaped";
  aiReadiness?: { score: number; riskLevel: "Low" | "Medium" | "High"; advice: string };
  selfAwarenessScore?: { score: number; verdict: string; evidence: string };
  blindSpots?: string[];
  trajectoryVelocity?: { score: number; status: string; assessment: string; rationale: string };
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

interface Phase1Position {
  title: string;
  years: string;
}

interface Phase1Data {
  sectors: string;
  positions: Phase1Position[];
  vision: string;
  careerStory?: string;
  experienceMode?: "upload" | "story";
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface Module {
  id: ModuleId;
  label: string;
  labelAr: string;
  labelFr: string;
  icon: React.ReactNode;
  locked: boolean;
  color: string;
  badge?: string;
}

const MODULES: Module[] = [
  { id: "diagnostic", label: "Advanced Diagnostic", labelAr: "التشخيص المتقدم", labelFr: "Diagnostic Avancé", icon: <Brain size={18} />, locked: false, color: "indigo", badge: "NEW" },
  { id: "roadmap", label: "Strategic Roadmap", labelAr: "خارطة الطريق", labelFr: "Feuille de Route Stratégique", icon: <Target size={18} />, locked: false, color: "emerald" },
  { id: "coaching", label: "Executive Coaching", labelAr: "التدريب التنفيذي", labelFr: "Coaching Exécutif", icon: <MessageSquare size={18} />, locked: false, color: "violet" },
  { id: "blueprint", label: "Skills Development Blueprint", labelAr: "خارطة تطوير المهارات", labelFr: "Plan de Développement des Compétences", icon: <Zap size={18} />, locked: false, color: "blue", badge: "NEW" },
  { id: "network", label: "Market Value & Positioning Audit", labelAr: "تدقيق القيمة السوقية والتموضع", labelFr: "Audit de Valeur Marchande & Positionnement", icon: <Rocket size={18} />, locked: false, color: "amber" },
  { id: "verdict", label: "Final Strategic Verdict", labelAr: "التقرير النهائي الشامل", labelFr: "Verdict Stratégique Final", icon: <Award size={18} />, locked: false, color: "rose" },
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
          <strong>{currentLang === 'ar' ? module.labelAr : currentLang === 'fr' ? module.labelFr : module.label}</strong> {({ en: "is coming soon. Complete your diagnostic first to unlock the strategic roadmap.", ar: "ستتوفر قريباً. أكمل التشخيص أولاً لفتح بقية المسار.", fr: "sera bientot disponible. Completez d'abord votre diagnostic pour debloquer le reste." }[currentLang as "en" | "ar" | "fr"] || "is coming soon. Complete your diagnostic first to unlock the strategic roadmap.")}
        </p>
      </div>
      <div className="px-8 py-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 text-[10px] font-black uppercase tracking-widest">
        {({ en: "Available in Phase 2 →", ar: "متاح في المرحلة الثانية ←", fr: "Disponible en Phase 2 →" }[currentLang as "en" | "ar" | "fr"] || "Available in Phase 2 →")}
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

type ModuleId = "diagnostic" | "roadmap" | "coaching" | "blueprint" | "network" | "verdict";

interface ModuleExtraData {
    assessment?: StrategicAssessment;
    academy?: ProfessionalAcademy;
    roadmapResult?: RoadmapResult;
    marketingAssets?: { cv: string; report: string };
    skillsBlueprint?: SkillsBlueprint;
    [key: string]: unknown;
}

// ─── SKILLS BLUEPRINT TYPES ───────────────────────────────────────────────────
interface SkillsBlueprintGap {
    name: string;
    category: "Technical" | "Soft Skills" | "Leadership" | "Industry Knowledge";
    priority: "Critical" | "High" | "Moderate" | "Low";
    impact: string;
    timeToClose: string;
    currentScore: number;
    targetScore: number;
    recommendedWorkshop: {
        title: string;
        duration: string;
        format: string;
        provider: string;
        priority: string;
        expectedROI: string;
    };
    recommendedSimulation: {
        title: string;
        duration: string;
        difficulty: string;
        tests: string[];
    };
    quickAction: string;
}

interface SkillsBlueprintSimulation {
    title: string;
    contextSector: string;
    duration: string;
    difficulty: string;
    tests: string[];
    whyRecommended: string;
    priority: number;
}

interface SkillsBlueprint {
    overallDevelopmentScore: number;
    timeToOptimalReadiness: string;
    immediateAlert: string;
    gaps: SkillsBlueprintGap[];
    simulationCatalog: SkillsBlueprintSimulation[];
    developmentTimeline: {
        phase: string;
        duration: string;
        focus: string;
        actions: string[];
        expectedOutcome: string;
    }[];
    workshopRecommendations: {
        technical: string[];
        softSkills: string[];
        leadership: string[];
        industryKnowledge: string[];
    };
}

interface MarketAuditEvaluation {
    verdict: string;
    marketAlignmentScore: number;
    leveragePoints: string[];
    redFlags: string[];
    readyForAssets: boolean;
}

interface StrategicAssessment {
    assessmentTitle: string;
    technicalInsight: string;
    questions: {
        id: number;
        question: string;
        options: Record<string, string>;
        correctAnswer: string;
        strategicLogic: string;
    }[];
    archetypeTarget: string;
    score?: number;
}


function StrategicRoadmap({ report, currentLang, phase1Data, onModuleComplete, initialData }: { report: FinalReport, currentLang: string, phase1Data?: Phase1Data | null, onModuleComplete?: (id: ModuleId, completed?: boolean, extraData?: ModuleExtraData) => void, initialData?: RoadmapResult | null }) {
    const [history] = useState<CareerHistoryItem[]>(() => {
        if (phase1Data?.positions && phase1Data.positions.length > 0) {
            return phase1Data.positions.map((p: Phase1Position) => ({
                id: Math.random().toString(),
                title: p.title,
                duration: `${p.years} ${parseInt(p.years) === 1 ? 'year' : 'years'}`,
                from: "",
                to: ""
            }));
        }
        return [{ id: Math.random().toString(), title: "", duration: "", from: "", to: "" }];
    });
    const [roadmapMode, setRoadmapMode] = useState<'interview' | 'results'>('interview');
    const [chat, setChat] = useState<ChatMessage[]>([]);
    const [ambition, setAmbition] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [roadmapResult, setRoadmapResult] = useState<RoadmapResult | null>(initialData || null);

    useEffect(() => {
        if (initialData) {
            setRoadmapResult(initialData);
            setRoadmapMode('results');
        } else {
            const saved = localStorage.getItem("prof_roadmapResult");
            if (saved) {
                try {
                    setRoadmapResult(JSON.parse(saved));
                    setRoadmapMode('results');
                } catch { /* ignore */ }
            }
        }
    }, [initialData]);

    const renderFormattedText = (text: string) => {
        return text.split('\n').map((paragraph, i) => {
            if (!paragraph.trim()) return null;
            return (
                <p key={i} className="mb-4 last:mb-0">
                    {paragraph.split(/(\*\*.*?\*\*)/).map((part, j) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={j} className="text-indigo-600 dark:text-indigo-400 font-black">{part.slice(2, -2)}</strong>;
                        }
                        return <span key={j}>{part}</span>;
                    })}
                </p>
            );
        });
    };

    const resetRoadmap = React.useCallback(() => {
        localStorage.removeItem("prof_roadmapResult");
        localStorage.removeItem("mod_complete_roadmap");
        setRoadmapResult(null);
        setRoadmapMode('interview');
        onModuleComplete?.("roadmap", false);
        window.dispatchEvent(new Event('storage'));
        // The useEffect will trigger startInterview because roadmapResult becomes null
    }, [onModuleComplete]);

    const runAnalysis = React.useCallback(async (customAmbition?: string) => {
        const finalAmbition = customAmbition || ambition;
        if (!finalAmbition.trim()) return alert(({ en: "Please state your career ambition", ar: "يرجى كتابة طموحك المهني", fr: "Veuillez indiquer vos ambitions de carrière" }[currentLang as "en" | "ar" | "fr"] || "Please state your career ambition"));
        setIsAnalyzing(true);
        try {
            const res = await fetch("/api/strategic-roadmap/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ history, ambition: finalAmbition, report, language: currentLang })
            });
            const data = await res.json();
            if (data.success) {
                setRoadmapResult(data.result);
                localStorage.setItem("prof_roadmapResult", JSON.stringify(data.result));
                localStorage.setItem("mod_complete_roadmap", "true");
                onModuleComplete?.("roadmap");
                setRoadmapMode('results');
                window.dispatchEvent(new Event('storage'));
            } else {
                alert("Generation failed: " + data.error);
            }
        } catch (err) {
            console.error(err);
            alert("Analysis failed.");
        } finally {
            setIsAnalyzing(false);
        }
    }, [ambition, currentLang, history, report, onModuleComplete]);

    const handleInterviewStep = async (userMessage: string) => {
        const newChat: ChatMessage[] = [...chat, { role: 'user', content: userMessage }];
        setChat(newChat);
        setIsAnalyzing(true);

        try {
            const res = await fetch("/api/strategic-roadmap/interview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: newChat, history, report, language: currentLang, captureAmbition: true })
            });
            const data = await res.json();
            if (data.content) {
                if (data.content.includes("[VERIFICATION_COMPLETE]")) {
                    setChat([...newChat, { role: 'assistant', content: data.content.replace("[VERIFICATION_COMPLETE]", "") }]);
                    
                    if (data.capturedAmbition) {
                        setAmbition(data.capturedAmbition);
                        setTimeout(() => runAnalysis(data.capturedAmbition), 2000);
                    }
                } else {
                    setChat([...newChat, { role: 'assistant', content: data.content }]);
                }
            }
        } catch (err) { console.error(err); }
        finally { setIsAnalyzing(false); }
    };

    const startInterview = React.useCallback(async () => {
        setRoadmapMode('interview');
        setIsAnalyzing(true);
        try {
            const res = await fetch("/api/strategic-roadmap/interview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    messages: [{ role: 'user', content: "Start the verification interview. I am ready." }], 
                    history, 
                    report, 
                    language: currentLang 
                })
            });
            const data = await res.json();
            if (data.content) {
                setChat([{ role: 'assistant', content: data.content }]);
            }
        } catch (err) { console.error(err); }
        finally { setIsAnalyzing(false); }
    }, [currentLang, history, report]);

    useEffect(() => {
        const saved = localStorage.getItem("prof_roadmapResult");
        if (saved) {
            try { 
                setRoadmapResult(JSON.parse(saved));
                setRoadmapMode('results');
            } catch { /* ignore */ }
        } else {
            startInterview();
        }
    }, [startInterview]);




    if (roadmapMode === 'results' && roadmapResult) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 pb-20">
                <div className="flex justify-between items-center">
                    <button 
                        onClick={resetRoadmap}
                        className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-600 flex items-center gap-2 transition-colors"
                    >
                        <RefreshCw size={10} /> {({ en: "Reset & Re-Interview", ar: "إعادة المقابلة من جديد", fr: "Réinitialiser & Re-Entretien" }[currentLang as "en" | "ar" | "fr"] || "Reset & Re-Interview")}
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
                            <h3 className="font-black text-sm uppercase tracking-widest">{({ en: "Honest Mirror: Current Reality", ar: "المرآة الحقيقية: الواقع الحالي", fr: "Miroir Honnête : Réalité Actuelle" }[currentLang as "en" | "ar" | "fr"] || "Honest Mirror: Current Reality")}</h3>
                        </div>
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="text-[8px] font-black uppercase tracking-widest text-emerald-500">{({ en: "Actual Strengths", ar: "نقاط القوة الفعلية", fr: "Forces Réelles" }[currentLang as "en" | "ar" | "fr"] || "Actual Strengths")}</div>
                                    <div className="space-y-2">
                                        {roadmapResult.currentRoleAnalysis.strengths.map((s, i) => (
                                            <div key={i} className="text-[10px] font-bold text-slate-600">• {s}</div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="text-[8px] font-black uppercase tracking-widest text-rose-500">{({ en: "Core Weaknesses", ar: "نقاط الضعف الجوهرية", fr: "Faiblesses Fondamentales" }[currentLang as "en" | "ar" | "fr"] || "Core Weaknesses")}</div>
                                    <div className="space-y-2">
                                        {roadmapResult.currentRoleAnalysis.weaknesses.map((w, i) => (
                                            <div key={i} className="text-[10px] font-bold text-slate-600">• {w}</div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6 border-t border-slate-50 space-y-4">
                                <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">{({ en: "Missing Mastery Skills", ar: "المهارات المفقودة للتمكن", fr: "Compétences Manquantes" }[currentLang as "en" | "ar" | "fr"] || "Missing Mastery Skills")}</div>
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
                            <div className="text-emerald-400 font-black text-[9px] uppercase tracking-[0.4em]">{({ en: "Ambition Viability", ar: "تحليل طموحك", fr: "Viabilité de l'Ambition" }[currentLang as "en" | "ar" | "fr"] || "Ambition Viability")}</div>
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
                            <h3 className="font-black text-xl uppercase tracking-tighter">{({ en: "Ultimate Career Roadmap", ar: "خارطة طريق المسيرة المهنية", fr: "Feuille de Route Ultime" }[currentLang as "en" | "ar" | "fr"] || "Ultimate Career Roadmap")}</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{roadmapResult.ultimateRoadmap.strategicFocus}</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <div className="text-[10px] font-black uppercase tracking-widest text-indigo-600">{({ en: "Next 30 Days Actions", ar: "إجراءات الـ 30 يوماً القادمة", fr: "Actions des 30 Prochains Jours" }[currentLang as "en" | "ar" | "fr"] || "Next 30 Days Actions")}</div>
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
                            <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{({ en: "Success Milestones", ar: "محطات النجاح (Milestones)", fr: "Jalons de Réussite" }[currentLang as "en" | "ar" | "fr"] || "Success Milestones")}</div>
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

    if (roadmapMode === 'interview') {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto space-y-8 pb-20">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8 px-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[10px] font-black uppercase tracking-widest">
                            <Shield size={12} /> Board Protocol 41-B Active
                        </div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">
                            {({ en: "Strategic Verification", ar: "التحقق الاستراتيجي", fr: "Vérification Stratégique" }[currentLang as "en" | "ar" | "fr"] || "Verification")}
                        </h2>
                    </div>
                    <div className="text-right hidden md:block">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Consultant Identity</p>
                        <p className="text-sm font-bold text-slate-900">Elite Strategic AI Agent</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-950 rounded-[3rem] shadow-2xl flex flex-col h-[700px] overflow-hidden border border-slate-100 dark:border-slate-800 relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-indigo-500 via-purple-500 to-indigo-500" />
                    
                    <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20 text-white">
                                <Mic size={20} />
                            </div>
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Live Probe Session</h3>
                                <p className="text-[9px] text-indigo-600 font-bold uppercase tracking-tighter">Status: Analysis Active</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800" />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar bg-slate-50/50 dark:bg-slate-900/50">
                        {chat.map((m, i) => (
                            <div key={i} className={cn("flex", m.role === 'assistant' ? "justify-start" : "justify-end")}>
                                <div className={cn(
                                    "max-w-[80%] p-8 rounded-3xl text-sm font-medium leading-relaxed shadow-sm relative",
                                    m.role === 'assistant' 
                                        ? "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none" 
                                        : "bg-indigo-600 text-white rounded-tr-none shadow-indigo-200 dark:shadow-none"
                                )}>
                                    {m.role === 'assistant' && (
                                        <div className="absolute -top-3 left-6 px-2 py-0.5 bg-indigo-600 text-white text-[8px] font-black uppercase tracking-widest rounded-md">AI STRATEGIST</div>
                                    )}
                                    <div className="space-y-1">
                                        {renderFormattedText(m.content)}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isAnalyzing && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl rounded-tl-none border border-slate-100 dark:border-slate-700">
                                    <div className="flex gap-3">
                                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-bounce" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-8 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 space-y-4">
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => runAnalysis("User skipped the verification and provided no specific ambition")}
                                disabled={isAnalyzing}
                                className="px-6 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-black uppercase tracking-widest text-[10px] transition-all border border-slate-200 dark:border-slate-700 hover:border-slate-300"
                            >
                                {currentLang === "ar" ? "تخطي المرحلة" : currentLang === "fr" ? "Passer l'étape" : "Skip Phase"}
                            </button>
                        </div>
                        <form className="flex gap-4 relative" onSubmit={(e) => {
                            e.preventDefault();
                            const form = e.currentTarget;
                            const input = (form.elements.namedItem("message") as HTMLInputElement)?.value;
                            if (!input || !input.trim() || isAnalyzing) return;
                            handleInterviewStep(input);
                            form.reset();
                        }}>
                            <input 
                                name="message"
                                placeholder={({ 
                                    en: "Confirm or clarify your profile details...", 
                                    ar: "أكد أو وضح تفاصيل ملفك المهني...", 
                                    fr: "Confirmez ou clarifiez les détails de votre profil..." 
                                }[currentLang as "en" | "ar" | "fr"] || "Type your response...")}
                                className="flex-1 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-2xl px-8 py-5 text-sm font-bold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-slate-400"
                                disabled={isAnalyzing}
                                autoComplete="off"
                            />
                            <button 
                                type="submit" 
                                disabled={isAnalyzing}
                                className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                            >
                                <Send size={28} />
                            </button>
                        </form>
                    </div>
                </div>
            </motion.div>
        );
    }

    return null;
}

// ─── STRATEGIC CAREER INTERVIEW (EXECUTIVE COACHING REFACTORED) ───────────────
function ExecutiveCoaching({ report, currentLang, onModuleComplete, phase1Data }: { report: FinalReport, currentLang: string, onModuleComplete?: (id: ModuleId, completed?: boolean, extraData?: ModuleExtraData) => void, phase1Data?: Phase1Data | null }) {
    const [mode, setMode] = useState<'interview' | 'evaluation'>('interview');
    const [isBusy, setIsBusy] = useState(false);
    const [chat, setChat] = useState<{ role: 'assistant' | 'user', content: string }[]>([]);
    const [evaluation, setEvaluation] = useState<PerformanceEvaluation & { archetype?: string } | null>(null);

    const startInterview = React.useCallback(async () => {
        setIsBusy(true);
        try {
            const res = await fetch("/api/executive-coaching/simulation", {
                method: "POST",
                body: JSON.stringify({ phase: 'interview', history: [], report, language: currentLang, phase1Data })
            });
            const data = await res.json();
            if (data.success) {
                setChat([{ role: 'assistant', content: data.nextQuestion }]);
            }
        } catch (err) { console.error(err); } finally { setIsBusy(false); }
    }, [currentLang, phase1Data, report]);

    useEffect(() => {
        startInterview();
    }, [startInterview]);

    const handleSimulationStep = async (message: string) => {
        const newChat = [...chat, { role: 'user' as const, content: message }];
        setChat(newChat);
        setIsBusy(true);
        try {
            const res = await fetch("/api/executive-coaching/simulation", {
                method: "POST",
                body: JSON.stringify({ phase: 'interview', history: newChat, report, language: currentLang, phase1Data })
            });
            const data = await res.json();
            if (data.success) {
                if (data.evaluation) {
                    setEvaluation(data.evaluation);
                    setMode('evaluation');
                    localStorage.setItem("mod_complete_coaching", "true");
                    onModuleComplete?.("coaching");
                    window.dispatchEvent(new Event('storage'));
                } else {
                    setChat([...newChat, { role: 'assistant', content: data.nextQuestion }]);
                }
            }
        } catch (err) { console.error(err); } finally { setIsBusy(false); }
    };

    if (mode === 'interview') {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-8 pb-20">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-4 px-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-500 text-[10px] font-black uppercase tracking-widest">
                            <Shield size={12} /> HR STRATEGIC AUDIT ACTIVE
                        </div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">
                            {({ en: "Decision Logic Probe", ar: "تدقيق منطق القرارات", fr: "Audit Logique des Décisions" }[currentLang as "en" | "ar" | "fr"] || "Decision Logic Probe")}
                        </h2>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-950 rounded-[3rem] border border-slate-100 shadow-2xl flex flex-col h-[650px] overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-violet-600" />
                    
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white dark:bg-slate-950">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-lg">
                                <Mic size={20} />
                            </div>
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Career Logic Simulation</h3>
                                <p className="text-[9px] text-violet-600 font-bold uppercase">Persona: Master HR Strategist</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Live Stress Test</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/30">
                        {chat.map((m, i) => (
                            <div key={i} className={cn("flex", m.role === 'assistant' ? "justify-start" : "justify-end")}>
                                <div className={cn(
                                    "max-w-[85%] p-7 rounded-3xl text-sm font-medium leading-relaxed shadow-sm relative",
                                    m.role === 'assistant' 
                                        ? "bg-white text-slate-700 border border-slate-100 rounded-tl-none" 
                                        : "bg-violet-600 text-white rounded-tr-none"
                                )}>
                                    {m.role === 'assistant' && (
                                        <div className="absolute -top-3 left-6 px-2 py-0.5 bg-violet-600 text-white text-[8px] font-black uppercase rounded-md shadow-sm">HR AUDITOR</div>
                                    )}
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {isBusy && (
                            <div className="flex justify-start">
                                <div className="bg-white p-6 rounded-3xl rounded-tl-none border border-slate-100">
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" />
                                        <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce [animation-delay:0.2s]" />
                                        <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-8 border-t border-slate-100 bg-white">
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
                                placeholder={({ en: "Defend your professional logic...", ar: "دافع عن منطقك المهني...", fr: "Défendez votre logique professionnelle..." }[currentLang as "en" | "ar" | "fr"] || "Defend your professional logic...")}
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-violet-500 transition-all"
                                disabled={isBusy}
                                autoComplete="off"
                            />
                            <button 
                                type="submit" 
                                disabled={isBusy}
                                className="w-14 h-14 rounded-2xl bg-violet-600 text-white flex items-center justify-center hover:bg-violet-700 transition-all shadow-lg shadow-violet-200 disabled:opacity-50"
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto space-y-12 pb-20">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 text-violet-600 text-[10px] font-black uppercase tracking-widest border border-violet-100">
                        <Award size={14} /> Audit Synthesis Complete
                    </div>
                    <h3 className="text-4xl font-black uppercase tracking-tight">{({ en: "Professional Character Verdict", ar: "حكم الشخصية المهنية", fr: "Verdict du Caractère Professionnel" }[currentLang as "en" | "ar" | "fr"] || "Professional Character Verdict")}</h3>
                </div>

                <div className="bg-white dark:bg-slate-950 rounded-[3.5rem] border border-slate-100 shadow-2xl p-12 space-y-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none rotate-12"><Brain size={300} /></div>
                    
                    <div className="grid md:grid-cols-12 gap-10 items-center">
                        <div className="md:col-span-4 flex flex-col items-center gap-6 p-10 bg-slate-900 rounded-[3rem] text-white text-center">
                            <div className="text-[10px] font-black uppercase tracking-widest text-violet-400">Identified Archetype</div>
                            <div className="text-3xl font-black uppercase text-white leading-tight">{evaluation.archetype || "N/A"}</div>
                            <div className="w-full h-px bg-white/10" />
                            <div className="space-y-1">
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Maturity Score</div>
                                <div className="text-6xl font-black text-violet-400">{evaluation.score}%</div>
                            </div>
                        </div>
                        <div className="md:col-span-8 space-y-8">
                            <div className="p-8 rounded-4xl bg-violet-50 border border-violet-100 italic text-lg font-bold text-violet-900 leading-relaxed shadow-sm">
                                &ldquo;{evaluation.summary}&rdquo;
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-rose-500 flex items-center gap-2"><AlertCircle size={14} /> Logic Gaps</div>
                                    <div className="space-y-2">
                                        {evaluation.alignmentNotes.map((n, i) => (
                                            <div key={i} className="text-[11px] font-bold text-slate-600 border-l-2 border-rose-200 pl-3">{n}</div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2"><CheckCircle2 size={14} /> Strategic Shifts</div>
                                    <div className="space-y-2">
                                        {evaluation.corrections.map((c, i) => (
                                            <div key={i} className="text-[11px] font-bold text-slate-600 border-l-2 border-emerald-200 pl-3">{c}</div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-10 rounded-[2.5rem] bg-indigo-950 text-white space-y-6">
                        <div className="flex items-center gap-3">
                            <Target className="text-amber-400" />
                            <div className="text-[10px] font-black uppercase tracking-widest">3-Step Corrective Action Plan</div>
                        </div>
                        <p className="text-sm font-medium text-indigo-200 leading-relaxed whitespace-pre-wrap">{evaluation.actionPlan}</p>
                    </div>

                    <button 
                        onClick={() => { setMode('interview'); setEvaluation(null); setChat([]); startInterview(); }}
                        className="w-full py-5 rounded-3xl border-2 border-slate-900 font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-3"
                    >
                        <RefreshCw size={18} /> {({ en: "Reset & Retest Decision Logic", ar: "إعادة اختبار منطق القرارات", fr: "Réinitialiser l'Audit" }[currentLang as "en" | "ar" | "fr"] || "Reset & Retest Decision Logic")}
                    </button>
                </div>
            </motion.div>
        );
    }

    return null;
}


// ─── MARKET VALUE & EXECUTIVE POSITIONING AUDIT ───────────────────────────────
function MarketValueAudit({ report, currentLang, onModuleComplete, initialData }: { report: FinalReport, currentLang: string, onModuleComplete?: (id: ModuleId, completed?: boolean, extraData?: ModuleExtraData) => void, initialData?: { cv: string, report: string } | null }) {
    const [phase, setPhase] = useState<'intro' | 'form' | 'stress-test' | 'audit_result'>(initialData ? 'audit_result' : 'intro');
    const [preferences, setPreferences] = useState({ job: "", salary: "", benefits: "", motivation: "" });
    const [chat, setChat] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [auditEvaluation, setAuditEvaluation] = useState<MarketAuditEvaluation | null>(null);
    const [generatedAssets, setGeneratedAssets] = useState<{ cv: string, report: string } | null>(initialData || null);

    useEffect(() => {
        if (initialData) {
            setGeneratedAssets(initialData);
            setPhase('audit_result');
        } else {
             const saved = localStorage.getItem("prof_marketingAssets"); // Keeping same key for compatibility
             if (saved) try { setGeneratedAssets(JSON.parse(saved)); setPhase('audit_result'); } catch { }
        }
    }, [initialData]);

    const startForm = () => setPhase('form');

    const startStressTest = async () => {
        if (!preferences.job || !preferences.salary) return alert("Please fill in details to begin the audit.");
        setIsLoading(true);
        try {
            const userProfileRaw = localStorage.getItem("userProfile");
            const userId = userProfileRaw ? JSON.parse(userProfileRaw).email : null;

            const firstMsg = currentLang === 'ar' 
                ? `أريد تدقيق تموضعي لمنصب ${preferences.job} براتب ${preferences.salary}. دوافعي: ${preferences.motivation}.` 
                : `Auditing my positioning for a ${preferences.job} role at ${preferences.salary}. Motivation: ${preferences.motivation}.`;
            
            const res = await fetch("/api/self-marketing/negotiate", {
                method: "POST",
                body: JSON.stringify({ message: firstMsg, preferences, report, language: currentLang, history: [], userId })
            });
            const data = await res.json();
            setChat([{ role: 'user', content: firstMsg }, { role: 'assistant', content: data.reply }]);
            setPhase('stress-test');
        } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };

    const sendMessage = async (msg: string) => {
        const newChat = [...chat, { role: 'user' as const, content: msg }];
        setChat(newChat);
        setIsLoading(true);
        try {
            const userProfileRaw = localStorage.getItem("userProfile");
            const userId = userProfileRaw ? JSON.parse(userProfileRaw).email : null;

            const res = await fetch("/api/self-marketing/negotiate", {
                method: "POST",
                body: JSON.stringify({ message: msg, preferences, report, language: currentLang, history: newChat, userId })
            });
            const data = await res.json();
            
            const aiMsg = { role: 'assistant' as const, content: data.reply };
            setChat([...newChat, aiMsg]);
            
            if (data.evaluation) {
                setAuditEvaluation(data.evaluation);
            }
        } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };

    const finalizeAudit = async () => {
        setIsLoading(true);
        try {
            const userProfileRaw = localStorage.getItem("userProfile");
            const userId = userProfileRaw ? JSON.parse(userProfileRaw).email : null;

            // Generate the final strategic assets (CV/Report) based on the audit findings
            const res = await fetch("/api/self-marketing/assets", {
                method: "POST",
                body: JSON.stringify({ chat, preferences, report, language: currentLang, userId, evaluation: auditEvaluation })
            });
            const data = await res.json();
            setGeneratedAssets(data.assets);
            setPhase('audit_result');
            localStorage.setItem("mod_complete_network", "true");
            localStorage.setItem("prof_marketingAssets", JSON.stringify(data.assets));
            onModuleComplete?.("network", true, { marketingAssets: data.assets });
            window.dispatchEvent(new Event('storage'));
        } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };

    if (phase === 'intro') {
        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-20 flex flex-col items-center text-center space-y-10">
                <div className="w-24 h-24 rounded-4xl bg-slate-900 border border-amber-500/50 text-amber-500 flex items-center justify-center shadow-2xl relative">
                    <Shield size={44} />
                    <div className="absolute -top-2 -right-2 bg-amber-600 text-white text-[8px] px-2 py-1 rounded-full font-black uppercase">Audit Phase</div>
                </div>
                <div className="space-y-4 max-w-2xl">
                    <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">
                        {({ en: "Market Value & Positioning Audit", ar: "تدقيق القيمة السوقية والتموضع", fr: "Audit de Valeur Marchande" }[currentLang as "en" | "ar" | "fr"] || "Market Value & Positioning Audit")}
                    </h2>
                    <p className="text-slate-500 font-medium italic">
                        {({ en: "Stress-test your career ambitions against hard market reality. We audit your value proposition, ROI logic, and executive branding.", ar: "اختبر طموحاتك المهنية مقابل واقع السوق الصعب. نقوم بتدقيق عرض القيمة الخاص بك، ومنطق العائد على الاستثمار، والعلامة التجارية التنفيذية.", fr: "Testez vos ambitions de carrière face à la réalité du marché. Nous auditons votre proposition de valeur, votre logique de ROI et votre branding exécutif." }[currentLang as "en" | "ar" | "fr"])}
                    </p>
                </div>
                <button 
                    onClick={startForm}
                    className="px-12 py-6 bg-amber-600 text-white rounded-4xl font-black uppercase text-xs tracking-[0.3em] flex items-center gap-4 hover:bg-amber-700 transition-all shadow-2xl hover:scale-105"
                >
                    <Target size={20} className="text-black" />
                    {({ en: "Start Positioning Audit", ar: "بدء التدقيق المهني", fr: "Démarrer l'Audit de Positionnement" }[currentLang as "en" | "ar" | "fr"])}
                </button>
            </motion.div>
        );
    }

    if (phase === 'form') {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-10 pb-20">
                <div className="bg-white dark:bg-slate-950 rounded-[3rem] border border-slate-100 p-12 shadow-2xl space-y-10">
                    <div className="space-y-2 text-center">
                        <h3 className="text-3xl font-black uppercase tracking-tighter">Define Target Compensation & ROI</h3>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest italic">Brutal honesty is required for clinical results</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Role / Board Seat</label>
                            <input 
                                value={preferences.job}
                                onChange={(e) => setPreferences({...preferences, job: e.target.value})}
                                placeholder="CEO / Strategic Partner / ..."
                                className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-bold outline-none border border-slate-100 focus:border-amber-500 transition-all shadow-inner"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Annual Package</label>
                            <input 
                                value={preferences.salary}
                                onChange={(e) => setPreferences({...preferences, salary: e.target.value})}
                                placeholder="$300k+ / Base + Bonus ..."
                                className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-bold outline-none border border-slate-100 focus:border-amber-500 transition-all shadow-inner"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Specific Motivation / Logical Trigger</label>
                            <textarea 
                                value={preferences.motivation}
                                onChange={(e) => setPreferences({...preferences, motivation: e.target.value})}
                                placeholder="Explain why this transition makes sense NOW..."
                                className="w-full h-32 bg-slate-100/50 rounded-3xl px-6 py-4 font-bold outline-none border border-slate-100 focus:border-amber-500 transition-all resize-none shadow-inner"
                            />
                        </div>
                    </div>

                    <button 
                        onClick={startStressTest}
                        className="w-full py-6 rounded-4xl bg-slate-900 text-white font-black uppercase text-xs tracking-[0.3em] hover:bg-black transition-all shadow-xl"
                    >
                        {isLoading ? <Loader2 className="animate-spin mx-auto" /> : "Initiate Positioning Stress Test"}
                    </button>
                </div>
            </motion.div>
        );
    }

    if (phase === 'stress-test') {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto pb-20 space-y-6">
                <div className="bg-slate-900 rounded-[3rem] border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[650px]">
                    <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-amber-600 flex items-center justify-center text-white"><Rocket size={16} /></div>
                            <div>
                                <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest italic leading-none">Global Comp Auditor</div>
                                <div className="text-white text-xs font-bold">Positioning Stress Test: {preferences.job}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                             <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Auditing Value Gap</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 space-y-6 font-medium">
                        {chat.map((msg, i) => (
                            <div key={i} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                                <div className={cn(
                                    "max-w-[85%] p-6 rounded-3xl text-sm leading-relaxed",
                                    msg.role === 'user' ? "bg-amber-600 text-white rounded-tr-none shadow-lg" : "bg-white/5 text-slate-300 border border-white/10 rounded-tl-none italic"
                                )}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 border-t border-white/5 bg-slate-900/50 backdrop-blur-xl">
                        {!auditEvaluation ? (
                            <div className="flex gap-4">
                                <input 
                                    onKeyDown={(e) => { if (e.key === 'Enter') { sendMessage(e.currentTarget.value); e.currentTarget.value = ""; } }}
                                    placeholder="Defend your position..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-amber-500/50 transition-all font-bold"
                                />
                                <button 
                                    disabled={isLoading}
                                    className="px-8 bg-amber-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-amber-700 transition-all flex items-center gap-2"
                                >
                                    {isLoading ? <Loader2 size={14} className="animate-spin" /> : "PROBE"}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-center">
                                    <p className="text-[10px] font-black uppercase tracking-widest">Audit Conclusion Ready</p>
                                </div>
                                <button 
                                    onClick={finalizeAudit}
                                    className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 shadow-2xl"
                                >
                                    <ShieldCheck size={18} /> Generate Final Positioning Audit Report
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    }

    if (phase === 'audit_result') {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 pb-20">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-slate-950 rounded-[3rem] border border-slate-100 shadow-xl p-10 space-y-8 flex flex-col">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-500 flex items-center justify-center shadow-lg"><FileText size={24} /></div>
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-tighter">Strategic Positioning Asset</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Positioning-Aligned Expert Profile</p>
                            </div>
                        </div>
                        <div className="flex-1 p-6 bg-slate-50 rounded-4xl border border-dashed border-slate-200 overflow-y-auto max-h-[400px]">
                            <div className="prose prose-sm font-bold whitespace-pre-wrap text-slate-700">
                                {generatedAssets?.cv}
                            </div>
                        </div>
                        <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3">
                            <Download size={16} /> DOWNLOAD POSITIONING ASSET
                        </button>
                    </div>

                    <div className="bg-slate-900 rounded-[3rem] p-10 text-white space-y-8 flex flex-col border border-white/5 shadow-2xl">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-lg"><Award size={24} /></div>
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-tighter">Positioning Audit Verdict</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-amber-500/70 italic">Market Alignment & Growth Leverage</p>
                            </div>
                        </div>
                        <div className="flex-1 p-8 bg-white/5 rounded-4xl border border-white/10 leading-relaxed text-slate-300 text-sm overflow-y-auto max-h-[400px] prose prose-invert prose-sm">
                            <div className="whitespace-pre-wrap font-medium">
                                {generatedAssets?.report}
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-emerald-500 text-slate-900 text-center font-black uppercase text-[10px] tracking-widest">
                            Audit Synthesized Successfully
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    return null;
}


// ─── FINAL STRATEGIC VERDICT ───────────────────────────────────────────────
function FinalStrategicVerdict({ 
  report, currentLang, onModuleComplete, roadmapResult, skillsBlueprint, mcqResults 
}: { 
  report: FinalReport; 
  currentLang: string; 
  onModuleComplete?: (id: ModuleId, completed?: boolean, extraData?: ModuleExtraData) => void;
  roadmapResult?: RoadmapResult | null;
  skillsBlueprint?: SkillsBlueprint | null;
  mcqResults?: { hardScore: number; softScore: number } | null;
}) {
    useEffect(() => {
        const markComplete = async () => {
             localStorage.setItem("mod_complete_verdict", "true");
             onModuleComplete?.("verdict");
             window.dispatchEvent(new Event('storage'));
        };
        markComplete();
    }, [onModuleComplete]);
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 pb-20">
            <div className="bg-slate-900 rounded-[3rem] p-12 text-white overflow-hidden relative border border-white/5 shadow-2xl">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-[120px] -mr-64 -mt-64" />
                <div className="relative z-10 space-y-8">
                    <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-400 text-[9px] font-black uppercase tracking-[0.4em]">
                                <Sparkles size={12} /> {({ en: "Consolidated Clinical Synthesis", ar: "التوليد السريري الشامل", fr: "Synthèse Clinique Consolidée" }[currentLang as "en" | "ar" | "fr"] || "Consolidated Clinical Synthesis")}
                            </div>
                            <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">
                                {({ en: "Expert Strategic Audit Verdict", ar: "الحكم الاستراتيجي المدقق", fr: "Verdict de l'Audit Stratégique Expert" }[currentLang as "en" | "ar" | "fr"] || "Expert Strategic Audit Verdict")}
                            </h2>
                            <p className="text-rose-100/60 max-w-2xl text-lg font-medium leading-relaxed italic">
                                &ldquo;{report.finalVerdict}&rdquo;
                            </p>
                        </div>
                        <div className="shrink-0 min-w-40 max-w-[18rem] p-6 md:p-8 rounded-4xl bg-white/5 border border-white/10 flex flex-col items-center justify-center backdrop-blur-xl text-center space-y-2">
                            <div className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2">{({ en: "Market Weight", ar: "الوزن السوقي", fr: "Poids sur le Marché" }[currentLang as "en" | "ar" | "fr"] || "Market Weight")}</div>
                            <div className={cn("font-black leading-tight", report.marketValue && report.marketValue.length > 15 ? "text-xl md:text-2xl" : "text-4xl md:text-5xl")}>
                                {report.marketValue}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-10">
                        {/* Card 1 */}
                        <div className="p-8 rounded-4xl bg-white/5 border border-white/10 space-y-4 min-w-0 w-full shadow-lg">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{({ en: "The Core Element", ar: "العنصر الجوهري", fr: "L'Élément Central" }[currentLang as "en" | "ar" | "fr"] || "The Core Element")}</h4>
                            <div className="text-sm font-bold leading-relaxed text-slate-200">
                                {report.profileSummary}
                            </div>
                        </div>
                        
                        {/* Card 2 */}
                        <div className="p-8 rounded-4xl bg-white/5 border border-white/10 space-y-4 min-w-0 w-full shadow-lg">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{({ en: "Leadership Impact", ar: "بصمة القيادة", fr: "Impact du Leadership" }[currentLang as "en" | "ar" | "fr"] || "Leadership Impact")}</h4>
                            <div className="text-sm font-bold leading-relaxed text-slate-200">
                                {report.leadershipFingerprint?.description || (({ en: "High Impact Strategist", ar: "قائد استراتيجي ذو أثر عالٍ", fr: "Stratège à Fort Impact" }[currentLang as "en" | "ar" | "fr"] || "High Impact Strategist"))}
                            </div>
                        </div>

                        {/* Card 3 - Red Focus */}
                        <div className="p-8 rounded-4xl bg-rose-600 text-white space-y-6 min-w-0 w-full shadow-2xl flex flex-col justify-between">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest opacity-70 text-white">{({ en: "Mission Priority", ar: "الأولوية الكبرى", fr: "Priorité de la Mission" }[currentLang as "en" | "ar" | "fr"] || "Mission Priority")}</h4>
                                <div className="text-lg font-black leading-tight">
                                    {report.gapAnalysis.criticalCompetencyGaps[0] || (({ en: "Strategic Transformation", ar: "التحول الاستراتيجي", fr: "Transformation Stratégique" }[currentLang as "en" | "ar" | "fr"] || "Strategic Transformation"))}
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
                        {({ en: "Recommended Career Ascension", ar: "التوسع المهني الموصى به", fr: "Ascension de Carrière Recommandée" }[currentLang as "en" | "ar" | "fr"] || "Recommended Career Ascension")}
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

                {/* Consolidated Roadmap Section */}
                <div className="bg-emerald-600 rounded-[3.5rem] p-12 text-white space-y-8 border border-emerald-500 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                    <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                        <Target className="text-white" />
                        {({ en: "Strategic Pathway Recap", ar: "ملخص المسار الاستراتيجي", fr: "Résumé du Parcours Stratégique" }[currentLang as "en" | "ar" | "fr"] || "Strategic Pathway Recap")}
                    </h3>
                    <div className="space-y-4">
                        {roadmapResult?.ultimateRoadmap?.milestones?.slice(0, 3).map((ms, i) => (
                            <div key={i} className="flex gap-4 items-center bg-white/10 p-4 rounded-2xl">
                                <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black text-xs text-white shrink-0">{i+1}</span>
                                <p className="text-xs font-bold leading-snug">{ms}</p>
                            </div>
                        ))}
                        {!roadmapResult && <p className="text-white/60 italic text-sm">{currentLang === 'ar' ? 'أكمل خارطة الطريق لعرض المسار هنا.' : 'Complete the roadmap to see your pathway here.'}</p>}
                    </div>
                </div>
            </div>

            {/* Consolidated Skills Section */}
            <div className="bg-white dark:bg-slate-950 rounded-[4rem] p-12 border border-slate-100 shadow-2xl space-y-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2">
                        <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">
                            {({ en: "Consolidated Skill Closure", ar: "خطة سد الفجوات المهاراتية", fr: "Plan de Clôture des Lacunes" }[currentLang as "en" | "ar" | "fr"] || "Consolidated Skill Closure")}
                        </h3>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest italic">{currentLang === 'ar' ? 'أهم الورشات المقترحة بناءً على تشخيصك' : 'Priority workshops based on your diagnostic results'}</p>
                    </div>
                    {mcqResults && (
                        <div className="flex gap-4">
                            <div className="px-5 py-3 rounded-2xl bg-indigo-50 border border-indigo-100 dark:bg-indigo-500/10 text-center">
                                <div className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Hard Skills</div>
                                <div className="text-xl font-black text-indigo-600">{mcqResults.hardScore}%</div>
                            </div>
                            <div className="px-5 py-3 rounded-2xl bg-rose-50 border border-rose-100 dark:bg-rose-500/10 text-center">
                                <div className="text-[8px] font-black text-rose-400 uppercase tracking-widest">Soft Skills</div>
                                <div className="text-xl font-black text-rose-600">{mcqResults.softScore}%</div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {skillsBlueprint?.gaps.slice(0, 3).map((gap, i) => (
                        <div key={i} className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-black uppercase px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-500">{gap.priority}</span>
                                <Zap size={14} className="text-amber-500" />
                            </div>
                            <h4 className="font-black text-sm uppercase text-slate-900 dark:text-white">{gap.name}</h4>
                            <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                                <div className="text-[8px] font-black text-blue-500 uppercase tracking-widest mb-1">Recommended Workshop</div>
                                <div className="text-[10px] font-bold text-slate-600 dark:text-slate-300 leading-snug">{gap.recommendedWorkshop.title}</div>
                            </div>
                        </div>
                    ))}
                    {!skillsBlueprint && <div className="col-span-full py-10 text-center text-slate-400 italic text-sm">{currentLang === 'ar' ? 'أكمل خارطة المهارات لعرض التفاصيل هنا.' : 'Complete the skills blueprint to see closure plans here.'}</div>}
                </div>
            </div>

            <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white space-y-8 border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
                <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                    <Zap className="text-amber-400" />
                    {({ en: "Expert Deep Insight", ar: "رؤية الخبير العميقة", fr: "Vision Approfondie de l'Expert" }[currentLang as "en" | "ar" | "fr"] || "Expert Deep Insight")}
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
            
            <div className="text-center py-20 bg-linear-to-b from-transparent to-slate-100/50 dark:to-slate-900/20 rounded-[4rem] space-y-8">
                <div className="space-y-4">
                    <h3 className="text-3xl font-black uppercase tracking-tighter">
                        {({ en: "Ready for Execution?", ar: "هل أنت مستعد للتنفيذ؟", fr: "Prêt pour l'Exécution ?" }[currentLang as "en" | "ar" | "fr"] || "Ready for Execution?")}
                    </h3>
                    <p className="text-slate-500 font-medium max-w-xl mx-auto">
                        {({
                            en: "Proceed to your Executive Performance Studio to begin workshops and activate your growth strategy.",
                            ar: "انتقل الآن إلى استوديو الأداء التنفيذي لبدء ورش العمل وتفعيل استراتيجية نموك.",
                            fr: "Rendez-vous dans votre Performance Studio Exécutif pour commencer les ateliers et activer votre stratégie de croissance."
                        }[currentLang as "en" | "ar" | "fr"] || "Proceed to your Executive Performance Studio to begin workshops and activate your growth strategy.")}
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button className="px-10 py-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-3xl font-bold uppercase text-[10px] tracking-widest shadow-xl hover:bg-slate-50 transition-all flex items-center gap-2">
                        <FileText size={16} className="text-rose-500" />
                        {({ en: "Download Full Thesis (PDF)", ar: "تحميل التقرير النهائي (PDF)", fr: "Télécharger la Thèse Complète (PDF)" }[currentLang as "en" | "ar" | "fr"] || "Download Full Thesis (PDF)")}
                    </button>
                    <a href="/professional/performance-studio" className="px-10 py-5 bg-slate-900 text-white rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-2xl hover:bg-black hover:scale-105 transition-all flex items-center gap-2 group">
                        {({ en: "Enter Performance Studio", ar: "دخول استوديو الأداء", fr: "Entrer dans le Studio de Performance" }[currentLang as "en" | "ar" | "fr"] || "Enter Performance Studio")}
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
    en: { 
      identity: "Audit Certified · X-Ray Standard", 
      radar: "Strategic Radar", 
      dimensions: "5 Executive Dimensions", 
      archetype: "Strategic Archetype", 
      authority: "Current Authority", 
      potential: "Future Potential", 
      fingerprint: "Leadership Fingerprint", 
      awareness: "Professional Integrity Index", 
      velocity: "Career Acceleration", 
      verdict: "Expert Final Verdict", 
      headhunter: "Market Perception (Headhunter View)", 
      swot: "Strategic SWOT Analysis", 
      gaps: "Clinical Gap Analysis", 
      gapsSub: "Reality Check · Functional Discrepancies", 
      plan: "90-Day Execution Plan", 
      truth: "Strategic Blind Spots", 
      observe: "Expert Observations Feed", 
      raw: "Raw behavioral signals captured from transcript analysis.", 
      linkedin: "LinkedIn Authority Strategy", 
      roles: "Recommended Roles for Immediate Pursuit",
      typology: "Professional DNA Typology",
      ai: "AI Displacement & Growth Index",
      riskContext: "Risk Context",
      selfClaims: "Self-Claims Accuracy",
      currentStatus: "Current Status",
      riskLevel: "Risk Level",
      readyForExec: "Ready for Execution?",
      downloadThesis: "Download Full Thesis (PDF)",
      enterStudio: "Enter Performance Studio",
      executionPrompt: "Proceed to your Executive Performance Studio to begin workshops and activate your growth strategy.",
      marketValueAss: "Market Value Assessment",
      linkedInHeadline: "Recommended Headline",
      linkedInFocus: "Profile Focus",
      linkedInNetwork: "Networking Advice",
      careerPaths: "Career Advancement Paths"
    },
    ar: { 
      identity: "تدقيق معتمد · معيار X-Ray", 
      radar: "الرادار الاستراتيجي", 
      dimensions: "5 أبعاد تنفيذية", 
      archetype: "النمط الاستراتيجي", 
      authority: "السلطة الحالية", 
      potential: "الإمكانات المستقبلية", 
      fingerprint: "بصمة القيادة", 
      awareness: "مؤشر النزاهة المهنية", 
      velocity: "تسارع المسار المهني", 
      verdict: "الحكم النهائي للخبير", 
      headhunter: "منظور السوق (رؤية Headhunter)", 
      swot: "تحليل SWOT الاستراتيجي", 
      gaps: "تحليل الفجوات السريري", 
      gapsSub: "مواجهة الواقع · الفجوات الوظيفية", 
      plan: "خطة التنفيذ (90 يوماً)", 
      truth: "النقاط الاستراتيجية العمياء", 
      observe: "ملاحظات الخبراء السلوكية", 
      raw: "إشارات سلوكية خام مستخلصة من تحليل المقابلات.", 
      linkedin: "استراتيجية الظهور على LinkedIn", 
      roles: "الأدوار الموصى بها للمتابعة الفورية",
      typology: "تصنيف المادة الوراثية المهنية",
      ai: "مؤشر الاستعداد والنزوح للذكاء الاصطناعي",
      riskContext: "سياق المخاطر",
      selfClaims: "دقة الادعاءات الذاتية",
      currentStatus: "الوضع الحالي",
      riskLevel: "مستوى المخاطر",
      readyForExec: "هل أنت مستعد للتنفيذ؟",
      downloadThesis: "تحميل التقرير النهائي (PDF)",
      enterStudio: "دخول استوديو الأداء",
      executionPrompt: "انتقل الآن إلى استوديو الأداء التنفيذي لبدء ورش العمل وتفعيل استراتيجية نموك."
    },
    fr: { 
      identity: "Audit Certifié · Standard X-Ray", 
      radar: "Radar Stratégique", 
      dimensions: "5 Dimensions Exécutives", 
      archetype: "Archétype Stratégique", 
      authority: "Autorité Actuelle", 
      potential: "Potentiel Futur", 
      fingerprint: "Empreinte Leadership", 
      awareness: "Indice d'Intégrité Professionnelle", 
      velocity: "Accélération de Carrière", 
      verdict: "Verdict Final Expert", 
      headhunter: "Perception Marché (Vision Headhunter)", 
      swot: "Analyse SWOT Stratégique", 
      gaps: "Analyse Clinique des Écarts", 
      gapsSub: "Réalité · Discrépances Fonctionnelles", 
      plan: "Plan d'Exécution (90 Jours)", 
      truth: "Points Morts Stratégiques", 
      observe: "Flux d'Observations Experts", 
      raw: "Signaux comportementaux bruts capturés lors de l'analyse.", 
      linkedin: "Stratégie d'Autorité LinkedIn", 
      roles: "Rôles recommandés pour poursuite immédiate",
      typology: "Typologie de l'ADN Professionnel",
      ai: "Indice de Déplacement & Croissance IA",
      riskContext: "Contexte de Risque",
      selfClaims: "Précision des Auto-Déclarations",
      currentStatus: "Statut Actuel",
      riskLevel: "Niveau de Risque",
      readyForExec: "Prêt pour l'Exécution ?",
      downloadThesis: "Télécharger la Thèse Complète (PDF)",
      enterStudio: "Entrer dans le Studio de Performance",
      executionPrompt: "Rendez-vous dans votre Performance Studio Exécutif pour commencer les ateliers et activer votre stratégie de croissance.",
      marketValueAss: "Évaluation de la Valeur Marchande",
      linkedInHeadline: "Titre Recommandé",
      linkedInFocus: "Focus du Profil",
      linkedInNetwork: "Conseils Réseautage",
      careerPaths: "Parcours d'Avancement de Carrière"
    }
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
            {report.aiReadiness && (
              <ScoreRing value={report.aiReadiness.score} label="AI Readiness" color="blue" />
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
                <div className="text-[8px] font-black uppercase tracking-widest text-violet-300">⚠ {t_sections.riskContext}</div>
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
              <div className="text-[10px] font-black uppercase tracking-widest text-amber-600 italic">{t_sections.selfClaims}: {report.selfAwarenessScore.verdict}</div>
              <p className="text-[10px] text-slate-500 font-bold leading-relaxed">{report.selfAwarenessScore.evidence}</p>
            </div>
          )}

          {report.trajectoryVelocity && (
            <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl p-8 space-y-5">
              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] text-emerald-500">
                <TrendingUp size={14} /> {t_sections.velocity}
              </div>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-black text-emerald-500">{report.trajectoryVelocity.score || 0}</span>
                <span className="text-slate-400 text-lg font-black mb-1">/100</span>
              </div>
              <div className={cn("text-xs font-black uppercase tracking-widest",
                report.trajectoryVelocity.status === "Accelerated" ? "text-emerald-500"
                : report.trajectoryVelocity.status === "On-track" ? "text-blue-500"
                : report.trajectoryVelocity.status === "Plateauing" ? "text-amber-500" : "text-rose-500"
              )}>
                {t_sections.currentStatus}: {report.trajectoryVelocity.status || report.trajectoryVelocity.assessment}
              </div>
              <p className="text-[10px] text-slate-500 font-bold leading-relaxed">{report.trajectoryVelocity.rationale || report.trajectoryVelocity.assessment}</p>
            </div>
          )}

          {report.aiReadiness && (
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl space-y-4 border border-blue-500/20">
               <div className="flex items-center gap-2 text-blue-400 text-[9px] font-black uppercase tracking-[0.4em]">
                <Zap size={14} /> {t_sections.ai}
              </div>
              <div className="text-4xl font-black">{report.aiReadiness.score}%</div>
              <div className={cn("text-[9px] font-black uppercase tracking-widest",
                report.aiReadiness.riskLevel === "Low" ? "text-emerald-400" : report.aiReadiness.riskLevel === "Medium" ? "text-amber-400" : "text-rose-400"
              )}>
                 {t_sections.riskLevel}: {report.aiReadiness.riskLevel}
              </div>
              <p className="text-[10px] text-blue-100/70 font-medium leading-relaxed italic">{report.aiReadiness.advice}</p>
            </div>
          )}
        </div>
      )}

      {/* ── Career Typology & Blind Spots ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {report.careerTypology && (
            <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl p-10 space-y-6">
              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] text-indigo-500">
                <Dna size={14} /> {t_sections.typology}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                  {report.careerTypology}
                </div>
                <div className="flex-1 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 text-[10px] font-bold text-slate-500 italic">
                  {report.careerTypology === "T-Shaped" 
                    ? "Deep technical expertise combined with broad strategic leadership capabilities."
                    : report.careerTypology === "Specialist" 
                    ? "Vertical expertise focus. High technical authority, potentially limited strategic breadth."
                    : "Broad horizontal knowledge. Versatile but may lack 'Hard Authority' in specific domains."}
                </div>
              </div>
            </div>
         )}

         {report.blindSpots && (
            <div className="bg-rose-500/5 border border-rose-500/20 rounded-[2.5rem] shadow-xl p-10 space-y-6">
              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] text-rose-500">
                <AlertCircle size={14} /> {t_sections.truth}
              </div>
              <div className="space-y-4">
                {report.blindSpots.map((spot, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                    <p className="text-xs font-bold text-rose-900 dark:text-rose-400 leading-relaxed italic">&ldquo;{spot}&rdquo;</p>
                  </div>
                ))}
              </div>
            </div>
         )}
      </div>

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
              <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">{t_sections.marketValueAss || "Market Value Assessment"}</div>
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
            { key: "strengths" as const, label: ({ en: "Strengths", ar: "نقاط القوة", fr: "Forces" }[currentLang as "en" | "ar" | "fr"] || "Strengths"), color: "emerald", icon: <TrendingUp size={16} /> },
            { key: "weaknesses" as const, label: ({ en: "Weaknesses", ar: "نقاط الضعف", fr: "Faiblesses" }[currentLang as "en" | "ar" | "fr"] || "Weaknesses"), color: "rose", icon: <X size={16} /> },
            { key: "opportunities" as const, label: ({ en: "Opportunities", ar: "الفرص", fr: "Opportunités" }[currentLang as "en" | "ar" | "fr"] || "Opportunities"), color: "blue", icon: <Zap size={16} /> },
            { key: "threats" as const, label: ({ en: "Threats", ar: "المخاطر", fr: "Menaces" }[currentLang as "en" | "ar" | "fr"] || "Threats"), color: "amber", icon: <Shield size={16} /> },
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
                <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">{t_sections.linkedInHeadline || "Recommended Headline"}</div>
                <p className="text-sm font-black text-slate-800 dark:text-white">{report.linkedInStrategy.headline}</p>
              </div>
              <div className="space-y-1">
                <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">{t_sections.linkedInFocus || "Profile Focus"}</div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">{report.linkedInStrategy.summaryFocus}</p>
              </div>
              <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/10 space-y-1">
                <div className="text-[8px] font-black uppercase tracking-widest text-blue-500">{t_sections.linkedInNetwork || "Networking Advice"}</div>
                <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400">{report.linkedInStrategy.networkingAdvice}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl p-10 space-y-6">
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] text-indigo-600">
            <Target size={14} /> {t_sections.careerPaths || ({ en: "Career Advancement Paths", ar: "مسارات التقدم المهني", fr: "Parcours d'Avancement de Carrière" }[currentLang as "en" | "ar" | "fr"] || "Career Advancement Paths")}
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

// ─── SKILLS DEVELOPMENT BLUEPRINT ─────────────────────────────────────────────
function SkillsDevelopmentBlueprint({
  report, currentLang, phase1Data, mcqResults, onModuleComplete, initialData
}: {
  report: FinalReport;
  currentLang: string;
  phase1Data?: Phase1Data | null;
  mcqResults?: { hardScore: number; softScore: number; totalQuestions: number } | null;
  onModuleComplete?: (id: ModuleId, completed?: boolean, extraData?: ModuleExtraData) => void;
  initialData?: SkillsBlueprint | null;
}) {
  const [blueprint, setBlueprint] = useState<SkillsBlueprint | null>(initialData || null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeGap, setActiveGap] = useState(0);
  const [activeTab, setActiveTab] = useState<"gaps" | "simulations" | "timeline">("gaps");

  const generateBlueprint = React.useCallback(async () => {
    setIsGenerating(true);
    try {
      const localMcq = mcqResults || (() => {
        try { return JSON.parse(localStorage.getItem("prof_mcqResults") || "null"); } catch { return null; }
      })();
      const res = await fetch("/api/skills-blueprint/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ finalReport: report, formData: phase1Data, mcqResults: localMcq, language: currentLang }),
      });
      const data = await res.json();
      if (data.success) {
        setBlueprint(data.blueprint);
        localStorage.setItem("prof_skillsBlueprint", JSON.stringify(data.blueprint));
        localStorage.setItem("mod_complete_blueprint", "true");
        onModuleComplete?.("blueprint", true, { skillsBlueprint: data.blueprint });
        window.dispatchEvent(new Event("storage"));
      }
    } catch (err) { console.error(err); }
    finally { setIsGenerating(false); }
  }, [report, phase1Data, mcqResults, currentLang, onModuleComplete]);

  useEffect(() => {
    if (!initialData) {
      const saved = localStorage.getItem("prof_skillsBlueprint");
      if (saved) { try { setBlueprint(JSON.parse(saved)); return; } catch { /* ignore */ } }
      generateBlueprint();
    }
  }, [initialData, generateBlueprint]);

  const priorityConfig = {
    Critical: { bg: "bg-rose-500/10", border: "border-rose-500/30", text: "text-rose-600", dot: "bg-rose-500" },
    High: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-600", dot: "bg-orange-500" },
    Moderate: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-600", dot: "bg-amber-500" },
    Low: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-600", dot: "bg-emerald-500" },
  } as const;
  const difficultyColor = {
    Beginner: "text-emerald-600 bg-emerald-500/10",
    Intermediate: "text-amber-600 bg-amber-500/10",
    Advanced: "text-rose-600 bg-rose-500/10",
  } as const;

  const T = ({
    en: { tabs: ["Gap Action Plans", "Simulation Catalog", "Development Timeline"], alert: "Immediate Alert", score: "Current Readiness Score", time: "Time to Optimal Readiness", workshop: "Recommended Workshop", simulation: "Recommended Simulation", action: "This Week's Action", impact: "Career Impact", roi: "Expected ROI", tests: "Tests", why: "Why Recommended", outcome: "Expected Outcome", regen: "Regenerate Blueprint" },
    ar: { tabs: ["خطط سد الثغرات", "كتالوج المحاكاة", "الجدول الزمني"], alert: "التنبيه الفوري", score: "مستوى الاستعداد", time: "الوقت اللازم للوصول الأمثل", workshop: "الورشة الموصى بها", simulation: "المحاكاة الموصى بها", action: "إجراء هذا الأسبوع", impact: "أثر على المسار", roi: "العائد المتوقع", tests: "يختبر", why: "سبب التوصية", outcome: "النتيجة المتوقعة", regen: "إعادة التوليد" },
    fr: { tabs: ["Plans d'Action", "Catalogue de Simulation", "Calendrier"], alert: "Alerte Immédiate", score: "Score de Préparation", time: "Délai vers Optimum", workshop: "Atelier Recommandé", simulation: "Simulation Recommandée", action: "Action cette Semaine", impact: "Impact Carrière", roi: "ROI Attendu", tests: "Teste", why: "Pourquoi", outcome: "Résultat Attendu", regen: "Régénérer" },
  } as const)[(currentLang as "en" | "ar" | "fr") || "en"];

  if (isGenerating) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[500px] space-y-10">
        <div className="relative">
          <div className="w-28 h-28 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin" />
          <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600 animate-pulse" size={36} />
        </div>
        <div className="text-center space-y-3">
          <p className="text-2xl font-black uppercase tracking-tighter">Skills Development Blueprint</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI mapping your gaps to precise solutions...</p>
        </div>
      </motion.div>
    );
  }
  if (!blueprint) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-20">
      {/* Header Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 p-6 rounded-3xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/30">
            <AlertCircle size={20} className="text-white" />
          </div>
          <div>
            <div className="text-[9px] font-black uppercase tracking-widest text-rose-500 mb-1">{T.alert}</div>
            <p className="text-sm font-bold text-rose-900 dark:text-rose-200 leading-relaxed">{blueprint.immediateAlert}</p>
          </div>
        </div>
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm text-center space-y-3">
          <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">{T.score}</div>
          <div className="relative w-20 h-20 mx-auto">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="3" />
              <circle cx="18" cy="18" r="14" fill="none" stroke="#3b82f6" strokeWidth="3"
                strokeDasharray={`${(blueprint.overallDevelopmentScore / 100) * 88} 88`} strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-lg font-black text-blue-600">{blueprint.overallDevelopmentScore}%</span>
          </div>
          <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">{T.time}: <span className="text-blue-600">{blueprint.timeToOptimalReadiness}</span></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl">
        {(["gaps", "simulations", "timeline"] as const).map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn("flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              activeTab === tab ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}>
            {T.tabs[i]}
          </button>
        ))}
      </div>

      {/* Gap Action Plans */}
      {activeTab === "gaps" && (
        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          <div className="space-y-2">
            {blueprint.gaps.map((gap, i) => {
              const cfg = priorityConfig[gap.priority as keyof typeof priorityConfig] || priorityConfig.Moderate;
              return (
                <button key={i} onClick={() => setActiveGap(i)}
                  className={cn("w-full text-left p-4 rounded-2xl border transition-all",
                    activeGap === i ? `${cfg.bg} ${cfg.border} shadow-sm` : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-200"
                  )}>
                  <div className="flex items-center gap-3">
                    <div className={cn("w-2 h-2 rounded-full shrink-0", cfg.dot)} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black uppercase tracking-tight truncate text-slate-800 dark:text-white">{gap.name}</p>
                      <p className="text-[9px] font-bold text-slate-400 mt-0.5">{gap.category} · {gap.timeToClose}</p>
                    </div>
                    <span className={cn("text-[8px] font-black uppercase px-2 py-0.5 rounded-full shrink-0", cfg.bg, cfg.text)}>{gap.priority}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {blueprint.gaps[activeGap] && (() => {
            const gap = blueprint.gaps[activeGap];
            const cfg = priorityConfig[gap.priority as keyof typeof priorityConfig] || priorityConfig.Moderate;
            return (
              <div className="space-y-5">
                <div className={cn("p-6 rounded-3xl border", cfg.bg, cfg.border)}>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">{gap.name}</h3>
                    <span className={cn("text-[9px] font-black uppercase px-3 py-1.5 rounded-full whitespace-nowrap border", cfg.bg, cfg.text, cfg.border)}>{gap.priority}</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">{T.impact}</div>
                      <p className="font-bold text-slate-700 dark:text-slate-300 text-xs leading-relaxed">{gap.impact}</p></div>
                    <div><div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">{T.action}</div>
                      <p className="font-bold text-slate-700 dark:text-slate-300 text-xs leading-relaxed">{gap.quickAction}</p></div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-[9px] font-black uppercase text-slate-400">
                      <span>Current: {gap.currentScore}%</span><span>Target: {gap.targetScore}%</span>
                    </div>
                    <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-blue-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${gap.currentScore}%` }} transition={{ duration: 1 }} />
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/30">
                        <FileText size={14} className="text-white" />
                      </div>
                      <div><div className="text-[8px] font-black uppercase tracking-widest text-blue-600">{T.workshop}</div>
                        <div className="text-[8px] font-bold text-slate-400">{gap.recommendedWorkshop.provider}</div></div>
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-slate-900 dark:text-white leading-tight mb-2">{gap.recommendedWorkshop.title}</h4>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-[8px] font-black px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">{gap.recommendedWorkshop.duration}</span>
                        <span className="text-[8px] font-black px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">{gap.recommendedWorkshop.format}</span>
                        <span className={cn("text-[8px] font-black px-2 py-0.5 rounded-full", gap.recommendedWorkshop.priority === "Urgent" ? "bg-rose-500/10 text-rose-600" : "bg-amber-500/10 text-amber-600")}>{gap.recommendedWorkshop.priority}</span>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">{T.roi}</div>
                      <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 leading-relaxed">{gap.recommendedWorkshop.expectedROI}</p>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-sm space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center shadow-md shadow-amber-500/30">
                        <Sparkles size={14} className="text-white" />
                      </div>
                      <div><div className="text-[8px] font-black uppercase tracking-widest text-amber-400">{T.simulation}</div>
                        <div className="text-[8px] font-bold text-slate-500">{gap.recommendedSimulation.duration}</div></div>
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-white leading-tight mb-2">{gap.recommendedSimulation.title}</h4>
                      <span className={cn("text-[8px] font-black px-2 py-0.5 rounded-full", difficultyColor[gap.recommendedSimulation.difficulty as keyof typeof difficultyColor] || "text-slate-400 bg-slate-800")}>{gap.recommendedSimulation.difficulty}</span>
                    </div>
                    <div className="pt-3 border-t border-white/10">
                      <div className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-2">{T.tests}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {gap.recommendedSimulation.tests.map((t, ti) => (
                          <span key={ti} className="text-[8px] font-black px-2 py-0.5 rounded-full bg-white/10 text-slate-300">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Simulation Catalog */}
      {activeTab === "simulations" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...(blueprint.simulationCatalog || [])].sort((a, b) => a.priority - b.priority).map((sim, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-4 hover:border-blue-200 dark:hover:border-blue-900 transition-all group">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 dark:bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <span className="text-xs font-black text-white dark:text-slate-900">0{sim.priority}</span>
                </div>
                <span className={cn("text-[8px] font-black px-2 py-0.5 rounded-full", difficultyColor[sim.difficulty as keyof typeof difficultyColor] || "text-slate-400 bg-slate-100")}>{sim.difficulty}</span>
              </div>
              <div>
                <h4 className="font-black text-sm uppercase tracking-tight text-slate-900 dark:text-white leading-snug mb-1">{sim.title}</h4>
                <p className="text-[10px] font-bold text-slate-500 leading-relaxed">{sim.contextSector}</p>
              </div>
              <div><div className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">{T.why}</div>
                <p className="text-[10px] font-bold text-blue-600 leading-relaxed">{sim.whyRecommended}</p></div>
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                {sim.tests.map((t, ti) => (
                  <span key={ti} className="text-[8px] font-black px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">{t}</span>
                ))}
              </div>
              <div className="text-[9px] font-bold text-slate-400">{sim.duration}</div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Development Timeline */}
      {activeTab === "timeline" && (
        <div className="space-y-4">
          {blueprint.developmentTimeline.map((phase, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-blue-600/30 shrink-0">{i + 1}</div>
                {i < blueprint.developmentTimeline.length - 1 && <div className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-800 mt-2" />}
              </div>
              <div className="pb-6 flex-1">
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                  <div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-blue-600 mb-1">{phase.duration}</div>
                    <h4 className="font-black text-sm uppercase tracking-tight text-slate-900 dark:text-white">{phase.phase}</h4>
                    <p className="text-[10px] font-bold text-slate-500 mt-1">{phase.focus}</p>
                  </div>
                  <div className="space-y-2">{phase.actions.map((action, ai) => (
                    <div key={ai} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{action}</span>
                    </div>
                  ))}</div>
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-start gap-2">
                    <Zap size={12} className="text-amber-500 mt-0.5 shrink-0" />
                    <div><div className="text-[9px] font-black uppercase tracking-widest text-slate-400">{T.outcome}</div>
                      <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 mt-0.5">{phase.expectedOutcome}</p></div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="flex justify-center pt-2">
        <button onClick={generateBlueprint} disabled={isGenerating}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all disabled:opacity-50">
          <RefreshCw size={12} className={isGenerating ? "animate-spin" : ""} />
          {T.regen}
        </button>
      </div>
    </motion.div>
  );
}

// ─── MAIN EXECUTIVE DASHBOARD ─────────────────────────────────────────────────
export default function ExecutiveDashboard() {
  const [activeModule, setActiveModule] = useState<ModuleId>("diagnostic");
  const [report, setReport] = useState<FinalReport | null>(null);
  const [phase1Data, setPhase1Data] = useState<Phase1Data | null>(null);
  const [unlockedModules, setUnlockedModules] = useState<Set<ModuleId>>(new Set(["diagnostic"]));
  const [loading, setLoading] = useState(true);
  const [reviewStatus, setReviewStatus] = useState<string>("not_started");
  const [expertNotes, setExpertNotes] = useState<string | null>(null);
  const [roadmapResult, setRoadmapResult] = useState<RoadmapResult | null>(null);
  const [marketingAssets, setMarketingAssets] = useState<{ cv: string, report: string } | null>(null);
  const [skillsBlueprint, setSkillsBlueprint] = useState<SkillsBlueprint | null>(null);
  const [mcqResults, setMcqResults] = useState<{ hardScore: number; softScore: number; totalQuestions: number } | null>(null);

  const { language: currentLang } = useLanguage();
  const t_ui = {
    en: { back: "← Back to Audit", command: "Executive Command Center", subtitle: "Full Professional X-Ray · McKinsey Standard", soon: "Module Available Soon", auditTitle: "No Audit Data Found", auditSub: "Complete the Professional Audit first to access your Executive Dashboard.", startAudit: "Start Audit" },
    ar: { back: "← العودة للتدقيق", command: "مركز القيادة التنفيذية", subtitle: "تقرير X-Ray المهني · معيار ماكينزي", soon: "الوحدة متوفرة قريباً", auditTitle: "لم يتم العثور على بيانات", auditSub: "يرجى إكمال التدقيق المهني أولاً للوصول إلى لوحة التحكم.", startAudit: "ابدأ التدقيق" },
    fr: { back: "← Retour à l'Audit", command: "Centre de Commandement", subtitle: "Diagnostic Professionnel · Standard McKinsey", soon: "Module bientôt disponible", auditTitle: "Aucune donnée trouvée", auditSub: "Veuillez compléter l'audit professionnel pour accéder à votre tableau de bord.", startAudit: "Démarrer l'Audit" }
  }[(currentLang as "en" | "ar" | "fr") || "en"];

  useEffect(() => {
    const hydrate = async () => {
      try {
        const userProfileRaw = localStorage.getItem('userProfile');
        if (!userProfileRaw) {
          setLoading(false);
          return;
        }
        const email = JSON.parse(userProfileRaw).email;

        // 1. Fetch Professional Progress from DB
        const resProgress = await fetch(`/api/user/professional-progress?email=${encodeURIComponent(email)}`);
        const jsonProgress = await resProgress.json();

        if (jsonProgress.success && jsonProgress.data) {
          const data = jsonProgress.data;
          
          if (data.finalReport) setReport(data.finalReport);
          if (data.formData) setPhase1Data(data.formData);
          if (data.roadmapResult) setRoadmapResult(data.roadmapResult);
          if (data.marketingAssets) setMarketingAssets(data.marketingAssets);
          if (data.skillsBlueprint) setSkillsBlueprint(data.skillsBlueprint as SkillsBlueprint);
          if (data.mcqResults) setMcqResults(data.mcqResults);
          
          // Diagnostic is complete if we have a report
          if (data.finalReport) {
             localStorage.setItem("mod_complete_diagnostic", "true");
          }

          // Sync extra results to localStorage for quick access
          if (data.academy) localStorage.setItem("prof_academy", JSON.stringify(data.academy));
          if (data.roadmapResult) localStorage.setItem("prof_roadmapResult", JSON.stringify(data.roadmapResult));
          if (data.marketingAssets) localStorage.setItem("prof_marketingAssets", JSON.stringify(data.marketingAssets));
          if (data.skillsBlueprint) localStorage.setItem("prof_skillsBlueprint", JSON.stringify(data.skillsBlueprint));
          if (data.mcqResults) localStorage.setItem("prof_mcqResults", JSON.stringify(data.mcqResults));

          // Merge any DB-saved module completions
          if (data.moduleProgress) {
            Object.keys(data.moduleProgress).forEach(key => {
               if (data.moduleProgress[key]) localStorage.setItem(key, "true");
            });
          }
        }

        // 2. Fetch Review Status
        const resReview = await fetch(`/api/professional/submit-for-review?email=${email}`);
        const dataReview = await resReview.json();
        if (dataReview.success) {
          setReviewStatus(dataReview.status);
          setExpertNotes(dataReview.expertNotes);
        }

        // 3. Refresh Gating - Sequential Unlocking
        const refreshGating = () => {
          const unlocked = new Set<ModuleId>(["diagnostic"]);
          // We iterate through modules in order. If mod N is complete, mod N+1 is unlocked.
          for (let i = 0; i < MODULES.length - 1; i++) {
            const currentMod = MODULES[i];
            const nextMod = MODULES[i+1];
            const isCompleted = localStorage.getItem(`mod_complete_${currentMod.id}`) === "true";
            
            if (isCompleted) {
              unlocked.add(nextMod.id);
            } else {
              // If a module is not complete, we stop unlocking subsequent ones
              break;
            }
          }
          setUnlockedModules(unlocked);
        };
        refreshGating();

      } catch (err) {
        console.error("Hydration error", err);
      } finally {
        setLoading(false);
      }
    };
    
    hydrate();
    
    // Listen for storage events for local gating updates
    const handleStorage = () => {
       const unlocked = new Set<ModuleId>(["diagnostic"]);
       for (let i = 0; i < MODULES.length - 1; i++) {
         const currentMod = MODULES[i];
         const nextMod = MODULES[i+1];
         if (localStorage.getItem(`mod_complete_${currentMod.id}`) === "true") {
           unlocked.add(nextMod.id);
         } else {
           break;
         }
       }
       setUnlockedModules(unlocked);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const saveAtlasData = (moduleId: ModuleId, completed: boolean = true, extraData?: ModuleExtraData) => {
    const triggerSave = async () => {
        try {
          const userProfileRaw = localStorage.getItem('userProfile');
          if (!userProfileRaw) return;
          const email = JSON.parse(userProfileRaw).email;
          
          const payload: Record<string, unknown> = { email };
          if (moduleId) {
              payload.moduleProgress = { [`mod_complete_${moduleId}`]: completed };
          }
          if (extraData) {
              Object.assign(payload, extraData);
              // Sync local state immediately
              const { roadmapResult, marketingAssets, skillsBlueprint } = (extraData || {}) as ModuleExtraData;
              if (roadmapResult) setRoadmapResult(roadmapResult);
              if (marketingAssets) setMarketingAssets(marketingAssets);
              if (skillsBlueprint) setSkillsBlueprint(skillsBlueprint);
          }

          localStorage.setItem(`mod_complete_${moduleId}`, "true");
          
          // Trigger next module unlock logic locally
          const updatedUnlocked = new Set(unlockedModules);
          const currentIndex = MODULES.findIndex(m => m.id === moduleId);
          if (currentIndex !== -1 && currentIndex < MODULES.length - 1) {
              updatedUnlocked.add(MODULES[currentIndex+1].id);
              setUnlockedModules(updatedUnlocked);
          }

          await fetch("/api/user/professional-progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          
          if (moduleId) {
              localStorage.setItem(`mod_complete_${moduleId}`, completed ? "true" : "false");
              window.dispatchEvent(new Event('storage'));
          }
        } catch (err) {
          console.error("Failed to save module data to Atlas", err);
        }
    };
    triggerSave();
  };

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>

      {/* ── TOP HEADER BAR ── */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="w-full mx-auto px-6 py-4 flex items-center justify-between gap-8">
          
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
              <Shield size={18} className="text-white" />
            </div>
            <div className="flex flex-col">
              <div className="text-[14px] font-black tracking-tight text-slate-800 dark:text-white uppercase leading-none mb-1">MATC Professional</div>
              <div className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Executive Engine</div>
            </div>
          </div>

          {/* Review Status Banner (Desktop) */}
          <div className="hidden lg:flex flex-1 justify-center px-10">
            {reviewStatus === "pending_review" && (
              <div className="w-full max-w-xl px-6 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3 animate-pulse">
                <Clock size={16} className="text-amber-600" />
                <div className="text-[10px] font-black uppercase tracking-widest text-amber-700">
                  {currentLang === 'ar' ? 'التقرير قيد المراجعة من قبل خبير استراتيجي' : currentLang === 'fr' ? 'Rapport en cours de révision par un expert' : 'Strategic Review Pending by Expert'}
                </div>
              </div>
            )}
            {reviewStatus === "reviewed" && (
              <div className="w-full max-w-xl px-6 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <div className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
                    {currentLang === 'ar' ? 'تم مراجعة تقريرك من قبل الخبير' : currentLang === 'fr' ? 'Rapport révisé' : 'Report Reviewed'}
                  </div>
                </div>
                {expertNotes && (
                  <p className="text-[9px] font-bold text-emerald-800 dark:text-emerald-400 italic">
                     &ldquo;{expertNotes}&rdquo;
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-black uppercase tracking-tight text-slate-800 dark:text-white leading-none">{t_ui.command}</div>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{t_ui.subtitle}</div>
            </div>
            <div className="h-8 w-px bg-slate-100 dark:bg-slate-800 hidden sm:block" />
            <button
              onClick={() => {
                if (confirm(currentLang === 'ar' ? 'هل أنت متأكد من تسجيل الخروج؟' : currentLang === 'fr' ? 'Se déconnecter ?' : 'Log out?')) {
                  localStorage.clear();
                  sessionStorage.clear();
                  window.location.href = '/login';
                }
              }}
              className="p-2.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all group"
              title={currentLang === 'ar' ? 'تسجيل الخروج' : currentLang === 'fr' ? 'Déconnexion' : 'Log Out'}
            >
              <LogOut size={18} className={currentLang === 'ar' ? 'rotate-180' : ''} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden h-[calc(100vh-73px)]">
        {/* ── VERTICAL SIDEBAR ── */}
        <aside className="w-72 shrink-0 bg-white dark:bg-slate-950 border-inline-end dark:border-slate-800 h-full overflow-y-auto hidden md:block shadow-sm">
          <div className="p-6 space-y-8">
            <div className="space-y-4">
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-4 px-2">
                {currentLang === 'ar' ? 'المسار الاستراتيجي' : currentLang === 'fr' ? 'FLUX STRATÉGIQUE' : 'STRATEGIC FLOW'}
              </div>
              <nav className="flex flex-col gap-2">
                {MODULES.map((mod) => {
                  const isUnlocked = unlockedModules.has(mod.id);
                  const isActive = activeModule === mod.id;
                  return (
                    <button
                      key={mod.id}
                      disabled={!isUnlocked}
                      onClick={() => isUnlocked && setActiveModule(mod.id)}
                      className={cn(
                        "group w-full flex items-center justify-between p-4 rounded-2xl transition-all relative overflow-hidden",
                        isActive
                          ? "bg-slate-900 text-white shadow-xl scale-[1.02]"
                          : !isUnlocked
                          ? "text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-40 text-left ltr:text-left rtl:text-right"
                          : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900 text-left ltr:text-left rtl:text-right"
                      )}
                    >
                      <div className="flex items-center gap-3 relative z-10 font-bold uppercase text-[9px] tracking-widest whitespace-nowrap">
                        <div className={cn(
                          "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500",
                          isActive ? "bg-white text-slate-900 shadow-md scale-110" : "bg-slate-50 dark:bg-slate-900 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"
                        )}>
                          {mod.icon}
                        </div>
                        <div className="flex flex-col gap-0.5">
                           <span>{currentLang === 'ar' ? mod.labelAr : currentLang === 'fr' ? mod.labelFr : mod.label}</span>
                           {isActive && <motion.div layoutId="activeUnderline" className="w-6 h-0.5 bg-amber-500 rounded-full" />}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 relative z-10">
                        {mod.badge && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                        {!isUnlocked && <Lock size={12} className="text-slate-400" />}
                      </div>

                      {isActive && (
                         <div className="absolute top-0 bottom-0 w-1 bg-amber-500 ltr:right-0 rtl:left-0" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Support/Links Section */}
            <div className="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-4">
               <a href="/professional" className="flex items-center gap-3 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
                  <ArrowRight size={14} className={currentLang === 'ar' ? 'rotate-180' : ''} />
                  {t_ui.back}
               </a>
               <button className="w-full flex items-center gap-3 p-4 rounded-2xl bg-indigo-600/5 text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600/10 transition-all">
                  <FileText size={14} />
                  {currentLang === 'ar' ? 'تحميل التقرير الكامل' : 'FULL REPORT'}
               </button>
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT AREA ── */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-6 sm:p-10">
          <div className="max-w-6xl mx-auto space-y-10">
            
            {/* ─── SYSTEMIC COHESION MAP: The Unified Diagnostic View ─── */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-linear-to-br from-indigo-950/80 to-slate-900 rounded-[3rem] p-10 border border-indigo-500/20 shadow-3xl relative overflow-hidden group mb-10"
            >
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
               
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative z-10">
                 <div className="space-y-2">
                   <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase tracking-[0.4em] border border-indigo-500/20">
                      <Dna size={12} className="animate-pulse" /> Unified Integrity Map
                   </div>
                   <h3 className="text-3xl font-black uppercase tracking-tighter text-white">Systemic Strategic Integration</h3>
                 </div>
                 <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-center backdrop-blur-md">
                    <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Cohesion Index</div>
                    <div className="text-xl font-black text-indigo-400">98.4%</div>
                 </div>
               </div>

               {/* Visual Connection Map */}
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
                  {[
                    { label: "Phase 1: Evidence", val: "Audit Verified", icon: <FileText size={16} />, color: "text-blue-400" },
                    { label: "Phase 2: Behavioral", val: "DNA Synthesized", icon: <Brain size={16} />, color: "text-purple-400" },
                    { label: "Phase 3: Capability", val: "Verified QCM", icon: <Shield size={16} />, color: "text-emerald-400" },
                    { label: "Phase 4: Tactical", val: "Simulation Pass", icon: <Target size={16} />, color: "text-amber-400" }
                  ].map((node, i) => (
                    <div key={i} className="relative p-6 rounded-[2.5rem] bg-white/5 border border-white/5 flex flex-col items-center gap-3 text-center hover:bg-white/10 transition-all group/node border-b-4 border-b-transparent hover:border-b-indigo-500">
                       <div className={cn("w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover/node:scale-110 transition-transform", node.color)}>
                          {node.icon}
                       </div>
                       <div className="space-y-1">
                          <div className="text-[8px] font-black uppercase text-slate-500 tracking-widest leading-none mb-1">{node.label}</div>
                          <div className="text-[10px] font-bold text-white uppercase tracking-tight">{node.val}</div>
                       </div>
                       {i < 3 && (
                         <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-20">
                            <ChevronRight className="text-white/20" size={16} />
                         </div>
                       )}
                    </div>
                  ))}
               </div>

               <div className="mt-10 p-6 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-between backdrop-blur-3xl relative z-10 group/status">
                   <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-500 border border-orange-500/30 group-hover/status:rotate-12 transition-transform">
                         <Sparkles size={24} />
                      </div>
                      <p className="text-[12px] font-semibold text-slate-400 max-w-xl leading-relaxed">
                         {currentLang === 'ar' 
                           ? "جميع الوحدات الآن مترابطة من خلال 'محرك الاستدلال الاستراتيجي'. أي تغيير في مهارة معينة سينعكس فوراً على التوليد النهائي لقرارك."
                           : "Your diagnostic units are multi-threaded via our proprietary Strategic Reasoning Engine. Every response has been unified into your executive profile."}
                      </p>
                   </div>
                   <div className="hidden lg:flex items-center gap-4 border-l border-white/10 pl-8 ml-8">
                       <div className="flex flex-col items-end">
                          <div className="text-[8px] font-black uppercase text-slate-500 tracking-widest mb-1">Global Synchronization</div>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> 
                             Unified
                          </div>
                       </div>
                   </div>
               </div>
            </motion.div>

            {/* Module Active Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div className={cn("w-14 h-14 rounded-3xl flex items-center justify-center border shadow-sm bg-white dark:bg-slate-900", colorMap[activeModuleData.color])}>
                   {activeModuleData.icon}
                </div>
                <div>
                  <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900 dark:text-white leading-none mb-2">
                    {currentLang === 'ar' ? activeModuleData.labelAr : currentLang === 'fr' ? activeModuleData.labelFr : activeModuleData.label}
                  </h1>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                    {activeModule === "diagnostic" ? t_ui.subtitle : (currentLang === 'ar' ? 'المرحلة الثانية من التشخيص · المسار الاستراتيجي' : currentLang === 'fr' ? 'Phase 2 du Diagnostic · Flux Stratégique' : 'Diagnosis Phase 2 · Strategic Flow')}
                  </p>
                </div>
              </div>
            </div>

            {/* Render Active Module */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeModule}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                {activeModule === "diagnostic" && <DiagnosticAvance report={report} currentLang={currentLang || 'en'} />}
                {activeModule === "roadmap" && <StrategicRoadmap report={report} currentLang={currentLang || 'en'} phase1Data={phase1Data} onModuleComplete={saveAtlasData} initialData={roadmapResult} />}
                {activeModule === "coaching" && report && <ExecutiveCoaching report={report} currentLang={currentLang || 'en'} onModuleComplete={saveAtlasData} phase1Data={phase1Data} />}
                {activeModule === "blueprint" && report && <SkillsDevelopmentBlueprint report={report} currentLang={currentLang || 'en'} phase1Data={phase1Data} mcqResults={mcqResults} onModuleComplete={saveAtlasData} initialData={skillsBlueprint} />}
                {activeModule === "network" && report && <MarketValueAudit report={report} currentLang={currentLang || 'en'} onModuleComplete={saveAtlasData} initialData={marketingAssets} />}
                {activeModule === "verdict" && report && <FinalStrategicVerdict report={report} currentLang={currentLang || 'en'} onModuleComplete={saveAtlasData} roadmapResult={roadmapResult} skillsBlueprint={skillsBlueprint} mcqResults={mcqResults} />}
                {activeModuleData.locked && <LockedModule module={activeModuleData} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
