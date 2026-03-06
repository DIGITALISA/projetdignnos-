"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Loader2,
  RotateCcw,
  ArrowLeft,
  Brain,
  Target,
  MessageSquare,
  Award,
  FileText,
  Sparkles,
  Shield,
  User,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  TrendingUp,
  BarChart3,
  Mic,
  ClipboardList,
  GraduationCap,
  CheckCircle2,
  X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Simulation {
  title: string;
  status: string;
  currentDraft?: string;
}

interface UserProfile {
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
  selectedRole: string;
  status?: string;
  plan?: string;
  resetRequested?: boolean;
  isDiagnosisComplete?: boolean;
  canAccessCertificates?: boolean;
  canAccessRecommendations?: boolean;
  canAccessScorecard?: boolean;
  diagnosisData?: {
    report?: {
      overview?: string;
      keyStrengths: string[];
      areasToImprove: string[];
      skills?: {
        technical: string[];
        soft: string[];
        gaps: string[];
      };
      experience?: {
        years: number;
        quality: string;
        progression: string;
      };
      education?: {
        level: string;
        relevance: string;
        notes: string;
      };
      nextSteps: string[];
      overallScore: number;
      readinessLevel: number;
      rank: string;
      recommendations: string;
      sciReport?: Record<string, unknown>;
    };
    simulationResults?: SimulationAuditResult[];
    ultimateStrategicReport?: StrategicReport;
    negotiationHistory?: {
      role: string;
      content: string;
      timestamp: string | Date;
    }[];
    comprehensiveReport?: string;
    comprehensiveReportGeneratedAt?: string | Date;
    marketingAssets?: {
      cv: string;
      report: string;
      generatedAt: string | Date;
    };
  };
}

interface SimulationAuditResult {
  scenarioNumber?: number;
  title: string;
  aiEvaluation: {
    score: number;
    strengths: string[];
    improvements: string[];
  };
}

interface DiagnosisReport {
  overallScore: number;
  readinessLevel: number;
  rank: string;
  recommendations: string;
  keyStrengths: string[];
  areasToImprove: string[];
  nextSteps: string[];
}

interface StrategicReport {
  profileSummary: string;
  maturityLevel: string;
  leadershipFingerprint?: {
    archetype: string;
    description: string;
    riskContext: string;
  };
  selfAwarenessScore?: {
    score: number;
    verdict: string;
    evidence: string;
  };
  trajectoryVelocity?: {
    assessment: string;
    rationale: string;
  };
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
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
  actionPlan90Days?: {
    week: string;
    action: string;
    rationale: string;
  }[];
  careerAdvancement: {
    role: string;
    shortTermProbability: number;
    longTermProbability: number;
    requirements: string[];
  }[];
  expertInterviewNotes?: string[];
  authorityVsPotential?: {
    currentAuthority: number;
    futurePotential: number;
    quadrant: string;
  };
  strategicRadar?: Record<string, number>;
}

interface DiagnosisInterface {
  analysis?: {
    overview?: string;
    strengths: string[];
    weaknesses: string[];
    skills?: {
      technical: string[];
      soft: string[];
      gaps: string[];
    };
    experience?: {
      years?: number;
      quality?: string;
      progression?: string;
    };
    education?: {
      level?: string;
      relevance?: string;
      notes?: string;
    };
    immediateActions: string[];
    expertAdvice?: {
      suggestedWorkshops: string[];
      suggestedTrainings: string[];
      strategicBrief: string;
      evolutionNote: string;
    };
    overallScore?: number;
    sciReport?: Record<string, unknown>;
  };
  report?: DiagnosisReport;
  simulationResults?: SimulationAuditResult[];
  ultimateStrategicReport?: StrategicReport;
  negotiationHistory?: {
    role: string;
    content: string;
    timestamp: string | Date;
  }[];
  comprehensiveReport?: string;
  comprehensiveReportGeneratedAt?: string | Date;
  marketingAssets?: {
    cv: string;
    report: string;
    generatedAt: string | Date;
  };
}

interface AggregatedData {
  success: boolean;
  user: UserProfile;
  diagnosis: DiagnosisInterface | null;
  interviewResult: {
    evaluation?: {
      seniorityLevel?: string;
      expertCaseSummary?: string;
      executiveSummary?: string;
      summary?: string;
      suggestedRoles?: string[];
      cvVsReality?: {
        confirmedStrengths: string[];
        exaggerations: string[];
        hiddenStrengths: string[];
      };
      cvImprovements: string[];
      skillDevelopmentPriorities?: string[];
      expertAdvice?: {
        suggestedWorkshops: string[];
        suggestedTrainings: string[];
        strategicBrief: string;
      };
    };
  } | null;
  simulations: Simulation[];
  profile: {
    expertNotes?: string;
    referenceId?: string;
  } | null;
  error?: string;
}

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
    technical: "indigo",
    leadership: "emerald",
    strategy: "blue",
    execution: "amber",
    influence: "rose",
  };
  const c = labelColors[label.toLowerCase()] || "indigo";
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
          {label}
        </span>
        <span className="text-xs font-black text-slate-800 dark:text-white">
          {value}
          <span className="text-slate-400">/10</span>
        </span>
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

// ─── PROFESSIONAL REVIEW BOARD ──────────────────────────────────────────────────
function ProfessionalReviewBoard({ report, diagnosis }: { report: StrategicReport; diagnosis: DiagnosisInterface | null }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'radar' | 'swot' | 'gaps' | 'plan' | 'interview' | 'dossier'>('overview');

  const tabs = [
    { id: 'overview', label: 'Synthèse', icon: Brain },
    { id: 'dossier', label: 'Dossier', icon: FileText },
    { id: 'radar', label: 'Radar', icon: BarChart3 },
    { id: 'swot', label: 'SWOT', icon: ClipboardList },
    { id: 'gaps', label: 'Écarts', icon: Target },
    { id: 'plan', label: 'Plan 90J', icon: TrendingUp },
    { id: 'interview', label: 'Interview', icon: Mic },
  ] as const;

  return (
    <div className="mt-10 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 p-6 bg-linear-to-r from-indigo-900 via-indigo-800 to-black rounded-4xl border border-indigo-700/30 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
          <Shield className="text-indigo-300 w-7 h-7" />
        </div>
        <div className="flex-1">
          <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-1">Compte Professionnel · Audit Exécutif Complet</div>
          <h2 className="text-2xl font-black text-white tracking-tight">Rapport de Review Stratégique</h2>
          <p className="text-indigo-300 text-xs font-medium mt-1">{report.maturityLevel} · {report.marketValue}</p>
        </div>
        <div className="text-right">
          <div className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Statut</div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 text-[10px] font-black mt-1">
            <CheckCircle2 size={10} /> Complété
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                "flex items-center gap-2 px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest whitespace-nowrap transition-all",
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "bg-white border border-slate-100 text-slate-500 hover:border-indigo-200 hover:text-indigo-600"
              )}
            >
              <Icon size={13} />{tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-slate-900 to-black rounded-4xl p-8 text-white shadow-2xl space-y-6">
                <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Verdict Final</div>
                <p className="text-lg font-bold leading-relaxed text-slate-200">&ldquo;{report.finalVerdict}&rdquo;</p>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  {report.selfAwarenessScore && (
                    <div>
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Self-Awareness</div>
                      <div className="text-3xl font-black text-amber-400">{report.selfAwarenessScore.score}<span className="text-slate-500 text-sm">/100</span></div>
                      <div className="text-[9px] text-amber-400 font-bold mt-1">{report.selfAwarenessScore.verdict}</div>
                    </div>
                  )}
                  {report.authorityVsPotential && (
                    <div>
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Archétype</div>
                      <div className="text-sm font-black text-emerald-400 uppercase leading-tight">{report.authorityVsPotential.quadrant}</div>
                      <div className="text-[9px] text-slate-500 mt-1">Auth: {report.authorityVsPotential.currentAuthority}% → {report.authorityVsPotential.futurePotential}%</div>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                {report.trajectoryVelocity && (
                  <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-xl">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Career Velocity</div>
                    <div className={cn("text-2xl font-black uppercase",
                      report.trajectoryVelocity.assessment === 'Accelerating' ? 'text-emerald-500' :
                      report.trajectoryVelocity.assessment === 'On-track' ? 'text-blue-500' :
                      report.trajectoryVelocity.assessment === 'Plateauing' ? 'text-amber-500' : 'text-rose-500'
                    )}>{report.trajectoryVelocity.assessment}</div>
                    <p className="text-xs text-slate-500 font-medium mt-2">{report.trajectoryVelocity.rationale}</p>
                  </div>
                )}
                {report.leadershipFingerprint && (
                  <div className="p-6 bg-linear-to-br from-violet-600 to-indigo-700 rounded-3xl text-white shadow-xl">
                    <div className="text-[9px] font-black text-violet-200 uppercase tracking-widest mb-2">Leadership Fingerprint</div>
                    <div className="text-xl font-black uppercase">{report.leadershipFingerprint.archetype}</div>
                    <p className="text-xs text-violet-100 mt-2 leading-relaxed">{report.leadershipFingerprint.description}</p>
                  </div>
                )}
                <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-xl">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Rôles Recommandés</div>
                  <div className="flex flex-wrap gap-2">
                    {report.recommendedRoles?.map((role, i) => (
                      <div key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-[10px] font-bold">
                        {role}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DOSSIER TAB (AUDIT INITIAL) */}
          {activeTab === 'dossier' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-100 rounded-4xl p-8 shadow-xl space-y-6">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-indigo-600" size={20} />
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Audit Initial du Candidat</h3>
                  </div>
                  
                  {/* @ts-ignore */}
                  {diagnosis?.analysis?.originalData ? (
                    <div className="space-y-6">
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Secteurs & Domaines</p>
                        {/* @ts-ignore */}
                        <p className="text-sm font-bold text-slate-700">{diagnosis.analysis.originalData.sectors || "N/A"}</p>
                      </div>
                      
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Postes Occupés / Durée</p>
                        <div className="space-y-2">
                          {/* @ts-ignore */}
                          {diagnosis.analysis.originalData.positions?.map((pos: any, i: number) => (
                            <div key={i} className="text-xs font-bold text-slate-600 flex justify-between">
                              <span>{pos.title}</span>
                              <span className="text-indigo-600">{pos.duration}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Vision à 3-5 ans</p>
                        {/* @ts-ignore */}
                        <p className="text-xs font-medium text-slate-700 leading-relaxed italic">&ldquo;{diagnosis.analysis.originalData.vision}&rdquo;</p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-10 text-center text-slate-400 italic">Données d&apos;audit initial non disponibles.</div>
                  )}
                </div>

                <div className="bg-slate-900 rounded-4xl p-8 text-white shadow-xl space-y-6">
                  <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-3">
                    <FileText className="text-amber-400" size={20} /> Career Story / Narrative
                  </h3>
                  {/* @ts-ignore */}
                  {diagnosis?.analysis?.originalData?.careerStory ? (
                    <div className="relative">
                      <div className="absolute top-0 left-0 w-1 h-full bg-amber-400/30 rounded-full" />
                      <p className="pl-6 text-sm text-slate-300 leading-relaxed font-medium italic">
                        {/* @ts-ignore */}
                        &ldquo;{diagnosis.analysis.originalData.careerStory}&rdquo;
                      </p>
                    </div>
                  ) : (
                    <div className="py-20 text-center text-slate-600 font-bold uppercase tracking-widest text-[10px]">Aucun récit de carrière fourni.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* RADAR TAB */}
          {activeTab === 'radar' && report.strategicRadar && (
            <div className="bg-white border border-slate-100 rounded-4xl p-10 shadow-xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <BarChart3 className="text-indigo-600" size={20} />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Strategic Competency Radar</h3>
              </div>
              <div className="space-y-6">
                {Object.entries(report.strategicRadar).map(([key, val]) => {
                  const colors: Record<string, string> = { technical: 'bg-indigo-500', leadership: 'bg-emerald-500', strategy: 'bg-blue-500', execution: 'bg-amber-500', influence: 'bg-rose-500' };
                  const pct = ((val as number) / 10) * 100;
                  return (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 capitalize">{key}</span>
                        <span className="text-sm font-black text-slate-900">{val as number}<span className="text-slate-400">/10</span></span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.2, ease: 'easeOut' }}
                          className={cn('h-full rounded-full', colors[key] || 'bg-indigo-500')} />
                      </div>
                    </div>
                  );
                })}
              </div>
              {report.selfAwarenessScore && (
                <div className="mt-8 p-6 bg-amber-50 border border-amber-100 rounded-2xl">
                  <div className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-2">Self-Awareness Score</div>
                  <div className="text-4xl font-black text-amber-500">{report.selfAwarenessScore.score}<span className="text-amber-300 text-lg">/100</span></div>
                  <p className="text-xs text-amber-700 mt-2 italic">{report.selfAwarenessScore.evidence}</p>
                </div>
              )}
            </div>
          )}

          {/* SWOT TAB */}
          {activeTab === 'swot' && report.swot && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {([
                  { title: 'Forces', items: report.swot.strengths, bg: 'bg-emerald-50', border: 'border-emerald-200', color: 'text-emerald-700', badge: 'bg-emerald-500' },
                  { title: 'Faiblesses', items: report.swot.weaknesses, bg: 'bg-rose-50', border: 'border-rose-200', color: 'text-rose-700', badge: 'bg-rose-500' },
                  { title: 'Opportunités', items: report.swot.opportunities, bg: 'bg-blue-50', border: 'border-blue-200', color: 'text-blue-700', badge: 'bg-blue-500' },
                  { title: 'Menaces', items: report.swot.threats, bg: 'bg-amber-50', border: 'border-amber-200', color: 'text-amber-700', badge: 'bg-amber-500' },
                ] as const).map((s, i) => (
                  <div key={i} className={cn('p-6 rounded-3xl border-2', s.bg, s.border)}>
                    <div className={cn('flex items-center gap-2 mb-4')}>
                      <div className={cn('w-2 h-2 rounded-full', s.badge)} />
                      <h4 className={cn('text-[10px] font-black uppercase tracking-widest', s.color)}>{s.title}</h4>
                    </div>
                    <div className="space-y-2">
                      {s.items?.map((item, j) => (
                        <div key={j} className="text-xs font-medium text-slate-700 leading-snug">• {item}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {report.deepInsights && report.deepInsights.length > 0 && (
                <div className="p-8 bg-slate-900 rounded-4xl text-white">
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="text-amber-400" size={18} />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-400">Deep Insights Stratégiques</h4>
                  </div>
                  <div className="space-y-3">
                    {report.deepInsights.map((insight, i) => (
                      <div key={i} className="flex gap-3 text-xs font-medium text-slate-300 leading-relaxed">
                        <span className="text-amber-400 mt-0.5 shrink-0">/</span>{insight}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* GAPS TAB */}
          {activeTab === 'gaps' && report.gapAnalysis && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-100 rounded-4xl p-8 shadow-xl space-y-6">
                  <h4 className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Alignement des Compétences</h4>
                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between text-xs font-black mb-2">
                        <span className="text-slate-600">Hard Skills</span>
                        <span className="text-blue-600">{report.gapAnalysis.hardSkillsMatch}%</span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${report.gapAnalysis.hardSkillsMatch}%` }} transition={{ duration: 1.2 }}
                          className="h-full bg-blue-500 rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-black mb-2">
                        <span className="text-slate-600">Soft Skills</span>
                        <span className="text-emerald-600">{report.gapAnalysis.softSkillsMatch}%</span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${report.gapAnalysis.softSkillsMatch}%` }} transition={{ duration: 1.2 }}
                          className="h-full bg-emerald-500 rounded-full" />
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Réalité vs Poste</div>
                    <p className="text-xs text-slate-600 font-medium italic leading-relaxed">&ldquo;{report.gapAnalysis.currentJobVsReality}&rdquo;</p>
                  </div>
                </div>
                <div className="bg-rose-50 border-2 border-rose-100 rounded-4xl p-8 space-y-4">
                  <h4 className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Lacunes Critiques</h4>
                  <div className="space-y-3">
                    {report.gapAnalysis.criticalCompetencyGaps?.map((gap, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-rose-100">
                        <X size={14} className="text-rose-500 shrink-0" />
                        <span className="text-xs font-bold text-rose-700">{gap}</span>
                      </div>
                    ))}
                  </div>
                  {report.gapAnalysis.comparisonPositionReality && (
                    <div className="pt-4 border-t border-rose-200">
                      <p className="text-xs text-rose-700 italic font-medium leading-relaxed">{report.gapAnalysis.comparisonPositionReality}</p>
                    </div>
                  )}
                </div>
              </div>
              {report.careerAdvancement && report.careerAdvancement.length > 0 && (
                <div className="bg-white border border-slate-100 rounded-4xl p-8 shadow-xl">
                  <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-6">Progression de Carrière</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {report.careerAdvancement.map((path, i) => (
                      <div key={i} className="p-5 border border-slate-100 rounded-2xl space-y-3">
                        <div className="font-black text-sm text-slate-900">{path.role}</div>
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <div className="text-[8px] font-black text-slate-400 uppercase">Court terme</div>
                            <div className="text-lg font-black text-blue-600">{path.shortTermProbability}%</div>
                          </div>
                          <div className="flex-1">
                            <div className="text-[8px] font-black text-slate-400 uppercase">Long terme</div>
                            <div className="text-lg font-black text-indigo-600">{path.longTermProbability}%</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PLAN 90J TAB */}
          {activeTab === 'plan' && (
            <div className="space-y-6">
              {report.actionPlan90Days && report.actionPlan90Days.length > 0 ? (
                <div className="grid md:grid-cols-3 gap-4">
                  {report.actionPlan90Days.map((step, i) => (
                    <div key={i} className="bg-white border border-slate-100 rounded-4xl p-6 shadow-xl relative">
                      <div className="absolute -top-3 left-6 px-4 py-1 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full">
                        {step.week}
                      </div>
                      <div className="pt-4 space-y-3">
                        <div className="text-sm font-black text-slate-900 uppercase tracking-tight">{step.action}</div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">{step.rationale}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center bg-slate-50 rounded-4xl border-2 border-dashed border-slate-200">
                  <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-400 font-bold">Plan d&apos;action non disponible</p>
                </div>
              )}
            </div>
          )}

          {/* INTERVIEW NOTES TAB */}
          {activeTab === 'interview' && (
            <div className="space-y-6">
              {report.expertInterviewNotes && report.expertInterviewNotes.length > 0 ? (
                <div className="bg-slate-900 rounded-4xl p-8 text-white shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <Mic className="text-amber-400" size={20} />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-400">Observations de l&apos;Entretien Expert</h4>
                  </div>
                  <div className="space-y-4">
                    {report.expertInterviewNotes.map((note, i) => (
                      <div key={i} className="flex gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 text-[10px] font-black shrink-0">{i + 1}</div>
                        <p className="text-xs text-slate-300 font-medium leading-relaxed italic">{note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center bg-slate-50 rounded-4xl border-2 border-dashed border-slate-200">
                  <Mic className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-400 font-bold">Notes d&apos;entretien non disponibles</p>
                </div>
              )}
              {diagnosis?.negotiationHistory && diagnosis.negotiationHistory.length > 0 && (
                <div className="bg-white border border-slate-100 rounded-4xl p-8 shadow-xl">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Historique de Négociation ({diagnosis.negotiationHistory.length} échanges)</h4>
                  <div className="space-y-3 max-h-72 overflow-y-auto">
                    {diagnosis.negotiationHistory.slice(-6).map((msg, i) => (
                      <div key={i} className={cn('p-4 rounded-2xl text-xs font-medium leading-relaxed', msg.role === 'assistant' ? 'bg-slate-50 border border-slate-100 text-slate-700' : 'bg-indigo-50 border border-indigo-100 text-indigo-800')}>
                        <span className="font-black text-[9px] uppercase tracking-widest block mb-1">{msg.role === 'assistant' ? 'AI Mentor' : 'Participant'}</span>
                        {String(msg.content).substring(0, 200)}{String(msg.content).length > 200 ? '...' : ''}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── STUDENT REVIEW BOARD ────────────────────────────────────────────────────────
function StudentReviewBoard({ diagnosis }: { diagnosis: DiagnosisInterface | null }) {
  if (!diagnosis) return (
    <div className="mt-10 py-20 text-center bg-slate-50 rounded-4xl border-2 border-dashed border-slate-200">
      <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-4" />
      <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Aucun diagnostic complété</p>
      <p className="text-slate-400 text-xs mt-2">Le participant n&apos;a pas encore finalisé son assessment.</p>
    </div>
  );

  const report = diagnosis.report;
  const simResults = diagnosis.simulationResults;

  return (
    <div className="mt-10 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 p-6 bg-linear-to-r from-emerald-900 via-teal-800 to-slate-900 rounded-4xl border border-emerald-700/30 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
          <GraduationCap className="text-emerald-300 w-7 h-7" />
        </div>
        <div className="flex-1">
          <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-1">Compte Étudiant · Simulation de Performance</div>
          <h2 className="text-2xl font-black text-white tracking-tight">Rapport de Simulation</h2>
          {report && <p className="text-emerald-300 text-xs font-medium mt-1">Score global: {report.overallScore}/10 · Rang: {report.rank} · Readiness: {report.readinessLevel}%</p>}
        </div>
        {report && (
          <div className="text-right space-y-1">
            <div className="text-3xl font-black text-white">{report.overallScore}<span className="text-slate-400 text-lg">/10</span></div>
            <div className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">{report.rank}</div>
          </div>
        )}
      </div>

      {/* Score Cards */}
      {report && (
        <div className="grid grid-cols-3 gap-4">
          <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-xl text-center">
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Score Global</div>
            <div className="text-4xl font-black text-indigo-600">{report.overallScore}<span className="text-slate-300 text-xl">/10</span></div>
          </div>
          <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-xl text-center">
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Readiness</div>
            <div className="text-4xl font-black text-emerald-600">{report.readinessLevel}<span className="text-slate-300 text-xl">%</span></div>
          </div>
          <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-xl text-center">
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Rang</div>
            <div className="text-3xl font-black text-amber-600">{report.rank || '—'}</div>
          </div>
        </div>
      )}

      {/* Simulation Scenarios */}
      {simResults && simResults.length > 0 && (
        <div className="bg-slate-900 rounded-4xl p-8 text-white shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <ClipboardList className="text-blue-400" size={22} />
            <h3 className="text-lg font-black uppercase tracking-tight">Scénarios de Simulation</h3>
            <span className="ml-auto text-[10px] font-black text-slate-400 uppercase">{simResults.length} scénarios</span>
          </div>
          <div className="space-y-5">
            {simResults.map((result, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-400 font-black text-sm">{i + 1}</div>
                    <h4 className="font-bold text-base">{result.title}</h4>
                  </div>
                  <div className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-600/20 text-sm font-black">
                    {result.aiEvaluation?.score}/10
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div>
                    <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-2">Points Forts</p>
                    <div className="space-y-1">
                      {result.aiEvaluation?.strengths?.map((s, j) => (
                        <div key={j} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle size={12} className="text-emerald-500 mt-0.5 shrink-0" />{s}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest mb-2">À Améliorer</p>
                    <div className="space-y-1">
                      {result.aiEvaluation?.improvements?.map((s, j) => (
                        <div key={j} className="flex items-start gap-2 text-xs text-slate-300">
                          <AlertCircle size={12} className="text-orange-500 mt-0.5 shrink-0" />{s}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Strengths & Areas */}
      {report && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-emerald-50 border border-emerald-100 rounded-4xl p-8">
            <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">Points Forts Clés</h4>
            <div className="space-y-2">
              {report.keyStrengths?.map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-xs font-medium text-emerald-800">
                  <CheckCircle2 size={13} className="text-emerald-500 mt-0.5 shrink-0" />{s}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-orange-50 border border-orange-100 rounded-4xl p-8">
            <h4 className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-4">Axes d&apos;Amélioration</h4>
            <div className="space-y-2">
              {report.areasToImprove?.map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-xs font-medium text-orange-800">
                  <AlertCircle size={13} className="text-orange-500 mt-0.5 shrink-0" />{s}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {report?.recommendations && (
        <div className="bg-white border border-slate-100 rounded-4xl p-8 shadow-xl">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Recommandations Stratégiques</h4>
          <p className="text-sm text-slate-600 font-medium leading-relaxed">{report.recommendations}</p>
        </div>
      )}
    </div>
  );
}

// ─── AI X-RAY REPORT COMPONENT ─────────────────────────────────────────────────
function AIStrategicXRay({ report }: { report: StrategicReport }) {
  if (!report) return null;

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
        <h3 className="font-black text-xl uppercase tracking-[0.3em] text-indigo-600">
          AI Strategic X-Ray Report
        </h3>
        <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
      </div>

      {/* Hero Profile */}
      <div className="relative rounded-[3rem] overflow-hidden bg-linear-to-br from-slate-900 via-indigo-950 to-black p-12 shadow-2xl text-white">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl -mr-32 -mt-32" />
        <div className="relative z-10 flex flex-col md:flex-row gap-10 items-start md:items-center justify-between">
          <div className="space-y-4 flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[9px] font-black uppercase tracking-[0.4em]">
              <ShieldCheck size={12} /> AI Certified Audit
            </div>
            <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">
              {report.maturityLevel}
            </h2>
            <p className="text-slate-300 text-sm font-medium leading-relaxed max-w-xl">
              &ldquo;{report.profileSummary}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Dimensions & Archetype */}
      <div className="grid md:grid-cols-2 gap-8">
        {report.strategicRadar && (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-10 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                <Brain size={20} />
              </div>
              <h3 className="font-black text-sm uppercase tracking-widest text-slate-900">
                Dimension Analysis
              </h3>
            </div>
            <div className="space-y-5">
              {Object.entries(report.strategicRadar).map(([key, val]) => (
                <RadarBar key={key} label={key} value={val as number} />
              ))}
            </div>
          </div>
        )}

        {report.leadershipFingerprint && (
          <div className="bg-linear-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-10 text-white shadow-xl space-y-6">
            <div className="flex items-center gap-2 text-indigo-200 text-[10px] font-black uppercase tracking-[0.4em]">
              <User size={16} /> Leadership Fingerprint
            </div>
            <div className="text-3xl font-black uppercase">
              {report.leadershipFingerprint.archetype}
            </div>
            <p className="text-sm text-indigo-100 font-medium leading-relaxed">
              {report.leadershipFingerprint.description}
            </p>
            <div className="pt-4 border-t border-white/20">
              <div className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-1">
                Risk Context
              </div>
              <p className="text-xs text-indigo-100 italic">
                {report.leadershipFingerprint.riskContext}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Velocity & Gaps */}
      <div className="grid md:grid-cols-3 gap-6">
        {report.trajectoryVelocity && (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8 space-y-4">
            <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
              Career Velocity
            </div>
            <div className="text-3xl font-black text-emerald-600 uppercase">
              {report.trajectoryVelocity.assessment}
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              {report.trajectoryVelocity.rationale}
            </p>
          </div>
        )}

        {report.gapAnalysis && (
          <div className="md:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-black uppercase tracking-widest text-rose-600">
                Cognitive Gap Analysis
              </div>
              <div className="flex gap-4">
                <span className="text-[10px] font-black bg-rose-50 text-rose-600 px-3 py-1 rounded-full border border-rose-100">
                  Hard: {report.gapAnalysis.hardSkillsMatch}%
                </span>
                <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full border border-emerald-100">
                  Soft: {report.gapAnalysis.softSkillsMatch}%
                </span>
              </div>
            </div>
            <p className="text-xs font-bold text-slate-700 leading-relaxed italic">
              &ldquo;{report.gapAnalysis.currentJobVsReality}&rdquo;
            </p>
            <div className="flex flex-wrap gap-2">
              {report.gapAnalysis.criticalCompetencyGaps?.map(
                (gap: string, i: number) => (
                  <span
                    key={i}
                    className="text-[9px] font-black bg-rose-50 text-rose-600 px-3 py-1.5 rounded-xl border border-rose-100 uppercase tracking-tighter"
                  >
                    ✕ {gap}
                  </span>
                ),
              )}
            </div>
          </div>
        )}
      </div>

      {/* SWOT Summary */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          {
            title: "Strengths",
            items: report.swot?.strengths,
            color: "emerald",
          },
          {
            title: "Weaknesses",
            items: report.swot?.weaknesses,
            color: "rose",
          },
          {
            title: "Opportunities",
            items: report.swot?.opportunities,
            color: "blue",
          },
          { title: "Threats", items: report.swot?.threats, color: "amber" },
        ].map((s, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-4xl border-2 bg-white ${s.color === "emerald" ? "border-emerald-50" : s.color === "rose" ? "border-rose-50" : s.color === "blue" ? "border-blue-50" : "border-amber-50"}`}
          >
            <h4
              className={`text-[10px] font-black uppercase tracking-widest mb-4 ${s.color === "emerald" ? "text-emerald-600" : s.color === "rose" ? "text-rose-600" : s.color === "blue" ? "text-blue-600" : "text-amber-600"}`}
            >
              {s.title}
            </h4>
            <div className="space-y-2">
              {s.items?.slice(0, 3).map((it: string, i: number) => (
                <div
                  key={i}
                  className="text-[10px] font-bold text-slate-600 leading-tight"
                >
                  • {it}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function UserProfileReview() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<AggregatedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expertNotes, setExpertNotes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/admin/users/${userId}/aggregated-data`);
        const data = await res.json();

        if (data.success) {
          setUserData(data);
          if (data.profile?.expertNotes) {
            setExpertNotes(data.profile.expertNotes);
          }
        } else {
          setError(data.error || "Failed to load user data.");
        }
      } catch (error) {
        console.error("Failed to load user data", error);
        setError((error as Error).message || "Network error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const handleSaveExpertNotes = async () => {
    setIsSavingNotes(true);
    try {
      const res = await fetch(
        `/api/admin/users/${userId}/update-expert-notes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ expertNotes }),
        },
      );
      const data = await res.json();
      if (data.success) {
        alert("Expert verdict saved successfully!");
      } else {
        alert("Failed to save notes: " + data.error);
      }
    } catch (e) {
      console.error(e);
      alert("Network error while saving notes");
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleGenerateType = async (
    type: "assessment" | "recommendation" | "scorecard",
  ) => {
    setIsGenerating(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/generate-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expertNotes,
          language: "fr",
          type,
        }),
      });
      const data = await res.json();

      if (data.success) {
        const labels = {
          assessment: "Strategic Capability Assessment",
          recommendation: "Recommendation Letter",
          scorecard: "Executive Scorecard",
        };
        alert(`${labels[type]} generated and published successfully!`);
        window.location.reload();
      } else {
        alert("Generation failed: " + data.error);
      }
    } catch (e) {
      console.error(e);
      alert("System error during generation");
    } finally {
      setIsGenerating(false);
    }
  };

  const [isGeneratingSCI, setIsGeneratingSCI] = useState(false);
  const handleGenerateSCI = async () => {
    setIsGeneratingSCI(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/generate-sci`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expertNotes,
          language: "fr",
        }),
      });
      const data = await res.json();

      if (data.success) {
        alert(
          "Strategic Career Intelligence (SCI) Report published! The student can now access the full report in their Strategic Intelligence section.",
        );
        window.location.reload();
      } else {
        alert("Generation failed: " + data.error);
      }
    } catch (e) {
      console.error(e);
      alert("System error during generation");
    } finally {
      setIsGeneratingSCI(false);
    }
  };

  const [isHandlingReset, setIsHandlingReset] = useState(false);
  const handleResetAction = async (action: "approve" | "reject") => {
    if (
      action === "approve" &&
      !window.confirm(
        "CRITICAL ACTION: This will PERMANENTLY delete all diagnostic and simulation data for this user. Are you absolutely sure?",
      )
    ) {
      return;
    }

    setIsHandlingReset(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/handle-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        window.location.reload();
      } else {
        alert("Error: " + data.error);
      }
    } catch (e) {
      console.error(e);
      alert("Network error occurred");
    } finally {
      setIsHandlingReset(false);
    }
  };

  // Reset ONLY diagnosis data — keeps certificates, recommendations, scorecard
  const [isResettingDiagnosisOnly, setIsResettingDiagnosisOnly] =
    useState(false);
  const handleResetDiagnosisOnly = async () => {
    const confirmed = window.confirm(
      `⚠️ RESET DIAGNOSIS ONLY\n\nThis will delete ONLY the diagnosis data for ${userData?.user?.fullName}:\n- CV Analysis\n- Interview Results\n- Simulation Data\n\n✅ Certificates, Recommendations & Scorecard will be PRESERVED.\n\nThe user can re-upload their CV and redo the diagnosis.\n\nContinue?`,
    );
    if (!confirmed) return;

    setIsResettingDiagnosisOnly(true);
    try {
      const res = await fetch(
        `/api/admin/users/${userId}/reset-diagnosis-only`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
      );
      const data = await res.json();
      if (data.success) {
        alert("✅ " + data.message);
        window.location.reload();
      } else {
        alert("Error: " + data.error);
      }
    } catch (e) {
      console.error(e);
      alert("Network error occurred");
    } finally {
      setIsResettingDiagnosisOnly(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-slate-500 font-medium">
          Loading Candidate Profile...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500">
          <AlertCircle size={32} />
        </div>
        <div className="text-center max-w-md">
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Data Unavailable
          </h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <p className="text-xs text-slate-400 font-mono bg-slate-100 p-2 rounded mb-6">
            User ID: {userId}
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
          >
            Return to Participants
          </button>
        </div>
      </div>
    );
  }

  if (!userData) return null;

  const isProfessionalPlan = userData.user?.plan !== "Student";

  // Helper to normalize diagnosis data from either collection or user profile
  const diagnosis: DiagnosisInterface | null = userData.diagnosis
    ? {
        ...userData.diagnosis,
      }
    : userData.user?.diagnosisData
      ? ({
          analysis: {
            overview: userData.user.diagnosisData.report?.overview || "",
            strengths: userData.user.diagnosisData.report?.keyStrengths || [],
            weaknesses:
              userData.user.diagnosisData.report?.areasToImprove || [],
            skills: userData.user.diagnosisData.report?.skills || {
              technical: [],
              soft: [],
              gaps: [],
            },
            experience: userData.user.diagnosisData.report?.experience || {},
            education: userData.user.diagnosisData.report?.education || {},
            immediateActions:
              userData.user.diagnosisData.report?.nextSteps || [],
            sciReport:
              (userData.user.diagnosisData.report?.sciReport as Record<
                string,
                unknown
              >) || undefined,
          },
          report: userData.user.diagnosisData.report,
          simulationResults:
            userData.user.diagnosisData.simulationResults || [],
          ultimateStrategicReport:
            userData.user.diagnosisData.ultimateStrategicReport,
          negotiationHistory: userData.user.diagnosisData.negotiationHistory,
          marketingAssets: userData.user.diagnosisData.marketingAssets,
          comprehensiveReport: userData.user.diagnosisData.comprehensiveReport,
          comprehensiveReportGeneratedAt:
            userData.user.diagnosisData.comprehensiveReportGeneratedAt,
        } as DiagnosisInterface)
      : null;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 p-6 md:p-8">
      {/* Reset Request Alert */}
      {userData?.user?.resetRequested && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-rose-50 border-2 border-rose-200 rounded-4xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-rose-100"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200">
              <RotateCcw className="text-white w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-black text-rose-900 tracking-tight">
                Progress Reset Requested
              </h3>
              <p className="text-rose-700 font-medium max-w-md">
                This participant has requested to archive their current progress
                and restart the journey from the beginning.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleResetAction("reject")}
              disabled={isHandlingReset}
              className="px-6 py-3 bg-white text-slate-600 rounded-xl font-black text-xs uppercase tracking-widest border border-slate-200 hover:bg-slate-50 transition-all"
            >
              Reject Request
            </button>
            <button
              onClick={() => handleResetAction("approve")}
              disabled={isHandlingReset}
              className="px-8 py-3 bg-rose-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all flex items-center gap-2"
            >
              {isHandlingReset ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RotateCcw className="w-4 h-4" />
              )}
              Approve & Reset Progress
            </button>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-3 hover:bg-slate-100 rounded-2xl transition-colors border border-transparent hover:border-slate-200"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <h1
              className={cn(
                "text-3xl font-black tracking-tight",
                isProfessionalPlan
                  ? "text-indigo-900"
                  : "text-emerald-900",
              )}
            >
              {isProfessionalPlan
                ? "Executive Review Board"
                : "Student Assessment Panel"}
            </h1>
            <p className="text-slate-500 font-medium">
              {isProfessionalPlan
                ? "Validate strategic maturity, market value, and executive certification."
                : "Review academic progress, behavioral alignment, and skill development."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveExpertNotes}
            disabled={isSavingNotes}
            className="px-6 py-2.5 bg-slate-100 text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-200 flex items-center gap-2"
          >
            {isSavingNotes ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <ShieldCheck size={14} />
            )}
            Save Review Progress
          </button>
          <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold uppercase tracking-wider border border-blue-100">
            {userData.user?.role || "Member"}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Column 1: Identity & Expert Action (Major Focus) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Executive Command Center */}
          <div className="bg-slate-900 rounded-4xl p-10 text-white shadow-2xl relative overflow-hidden border border-slate-800">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-[80px]" />

            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-600/20 rounded-2xl flex items-center justify-center border border-blue-500/20">
                    <ShieldCheck className="text-blue-400 w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight">
                      Expert Command Center
                    </h2>
                    <p className="text-blue-400/60 text-xs font-bold uppercase tracking-widest">
                      Confidential Case Review
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest">
                    ID: {userId.substring(0, 8)}
                  </span>
                </div>
              </div>

              {/* Dossier Info Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">
                    Candidate Benchmark
                  </p>
                  <h4 className="text-xl font-bold flex items-center gap-2">
                    {userData.interviewResult?.evaluation?.seniorityLevel ||
                      "Pending Analysis"}
                    <div
                      className={`w-2 h-2 rounded-full animate-pulse ${userData.interviewResult ? "bg-emerald-500" : "bg-blue-500"}`}
                    />
                  </h4>
                  <p className="text-xs text-slate-400 mt-2 font-medium">
                    {userData.interviewResult
                      ? "Verified seniority level based on technical verification rounds."
                      : "Waiting for candidate to complete diagnostic process."}
                  </p>
                </div>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">
                    Strategic Fit
                  </p>
                  <h4 className="text-xl font-bold truncate">
                    {userData.user?.selectedRole || "General Interest"}
                  </h4>
                  <p className="text-xs text-slate-400 mt-2 font-medium">
                    Current role path selected by the participant.
                  </p>
                </div>
              </div>

              {/* Executive Summary Area */}
              <div>
                <div
                  className={cn(
                    "p-8 border rounded-4xl text-sm leading-relaxed font-medium italic",
                    isProfessionalPlan
                      ? "bg-linear-to-br from-indigo-500/10 to-blue-500/10 border-white/5 text-slate-300"
                      : "bg-emerald-500/10 border-emerald-500/10 text-emerald-200",
                  )}
                >
                  {userData.interviewResult?.evaluation?.expertCaseSummary ||
                    userData.interviewResult?.evaluation?.executiveSummary ||
                    (isProfessionalPlan
                      ? "Executive case synthesis unavailable. Awaiting strategic synchronization."
                      : "Student assessment synthesis pending completion.")}
                </div>
              </div>

              {/* Validation Actions */}
              <div className="pt-4 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest block">
                      Confidential Expert Verdict
                    </label>
                    <button
                      onClick={handleSaveExpertNotes}
                      disabled={isSavingNotes}
                      className="text-[10px] font-black text-blue-500 uppercase hover:underline disabled:opacity-50"
                    >
                      {isSavingNotes ? "Saving..." : "Quick Save Notes"}
                    </button>
                  </div>
                  <textarea
                    value={expertNotes}
                    onChange={(e) => setExpertNotes(e.target.value)}
                    placeholder="Record final professional verdict for the executive roadmap and scorecard..."
                    className="w-full h-40 p-6 bg-white/5 border border-white/10 rounded-3xl text-sm focus:ring-2 focus:ring-blue-500/30 outline-none resize-none font-medium text-slate-100 placeholder:text-slate-600 transition-all shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => handleGenerateType("assessment")}
                    disabled={
                      isGenerating ||
                      !diagnosis ||
                      !userData.user?.isDiagnosisComplete ||
                      !expertNotes.trim()
                    }
                    className={`py-6 px-4 rounded-3xl font-black text-[9px] uppercase tracking-widest shadow-xl active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-3 disabled:opacity-30 border ${
                      userData.user?.canAccessCertificates
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-white text-slate-900 border-slate-100 hover:bg-slate-50"
                    }`}
                  >
                    {isGenerating ? (
                      <Loader2
                        size={16}
                        className="animate-spin text-blue-600"
                      />
                    ) : (
                      <ShieldCheck
                        size={18}
                        className={
                          userData.user?.canAccessCertificates
                            ? "text-emerald-600"
                            : "text-blue-600"
                        }
                      />
                    )}
                    <span className="text-center">
                      Strategic Capability Assessment
                    </span>
                  </button>

                  <button
                    onClick={() => handleGenerateType("recommendation")}
                    disabled={
                      isGenerating ||
                      !diagnosis ||
                      !userData.user?.isDiagnosisComplete ||
                      !expertNotes.trim()
                    }
                    className={`py-6 px-4 rounded-3xl font-black text-[9px] uppercase tracking-widest shadow-xl active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-3 disabled:opacity-30 border ${
                      userData.user?.canAccessRecommendations
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-white text-slate-900 border-slate-100 hover:bg-slate-50"
                    }`}
                  >
                    {isGenerating ? (
                      <Loader2
                        size={16}
                        className="animate-spin text-blue-600"
                      />
                    ) : (
                      <Sparkles
                        size={18}
                        className={
                          userData.user?.canAccessRecommendations
                            ? "text-emerald-600"
                            : "text-indigo-600"
                        }
                      />
                    )}
                    <span className="text-center">Recommendation Letter</span>
                  </button>

                  <button
                    onClick={() => handleGenerateType("scorecard")}
                    disabled={
                      isGenerating ||
                      !diagnosis ||
                      !userData.user?.isDiagnosisComplete ||
                      !expertNotes.trim()
                    }
                    className={`py-6 px-4 rounded-3xl font-black text-[9px] uppercase tracking-widest shadow-xl active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-3 disabled:opacity-30 border ${
                      userData.user?.canAccessScorecard
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-white text-slate-900 border-slate-100 hover:bg-slate-50"
                    }`}
                  >
                    {isGenerating ? (
                      <Loader2
                        size={16}
                        className="animate-spin text-blue-600"
                      />
                    ) : (
                      <Target
                        size={18}
                        className={
                          userData.user?.canAccessScorecard
                            ? "text-emerald-600"
                            : "text-amber-600"
                        }
                      />
                    )}
                    <span className="text-center">Executive Scorecard</span>
                  </button>

                  <button
                    onClick={handleGenerateSCI}
                    disabled={
                      isGeneratingSCI ||
                      !diagnosis ||
                      !userData.user?.isDiagnosisComplete ||
                      !expertNotes.trim()
                    }
                    className={`py-6 px-4 rounded-3xl font-black text-[9px] uppercase tracking-widest shadow-xl active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-3 disabled:opacity-30 border ${
                      diagnosis?.analysis?.sciReport
                        ? "bg-emerald-600 text-white border-transparent"
                        : "bg-indigo-600 text-white border-transparent hover:bg-indigo-500"
                    }`}
                  >
                    {isGeneratingSCI ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Brain size={18} />
                    )}
                    <span className="text-center text-white">
                      Strategic Intelligence (SCI)
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* NEW: PROFESSIONAL ONLY SECTIONS */}
            {isProfessionalPlan && (
              <div className="space-y-8">
                {/* Self-Marketing & Negotiation Audit */}
                <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100">
                        <Target className="text-amber-600 w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                          Market Infiltration Audit
                        </h3>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                          Self-Marketing Studio Results
                        </p>
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
                      ATS Ready
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Executive Assets
                      </h4>
                      <div className="space-y-3">
                        {diagnosis?.marketingAssets?.cv ? (
                          <div className="p-5 border border-slate-100 rounded-3xl bg-slate-50/50 flex items-center justify-between group hover:bg-white hover:shadow-lg transition-all">
                            <div className="flex items-center gap-3">
                              <FileText className="text-blue-500" size={20} />
                              <span className="text-sm font-bold text-slate-700">
                                Optimized Executive CV
                              </span>
                            </div>
                            <button className="text-[10px] font-black text-blue-600 uppercase hover:underline">
                              Review Markdown
                            </button>
                          </div>
                        ) : (
                          <p className="text-[10px] text-slate-400 italic">
                            No CV generated yet
                          </p>
                        )}
                        {diagnosis?.marketingAssets?.report ? (
                          <div className="p-5 border border-slate-100 rounded-3xl bg-slate-50/50 flex items-center justify-between group hover:bg-white hover:shadow-lg transition-all">
                            <div className="flex items-center gap-3">
                              <Shield className="text-rose-500" size={20} />
                              <span className="text-sm font-bold text-slate-700">
                                Strategic Positioning Thesis
                              </span>
                            </div>
                            <button className="text-[10px] font-black text-blue-600 uppercase hover:underline">
                              Review Strategy
                            </button>
                          </div>
                        ) : (
                          <p className="text-[10px] text-slate-400 italic">
                            No strategy thesis generated yet
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Negotiation Psychology
                      </h4>
                      <div className="p-6 bg-slate-900 rounded-3xl text-white space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Headhunter Simulation
                          </span>
                        </div>
                        {diagnosis?.negotiationHistory &&
                        diagnosis.negotiationHistory.length > 0 ? (
                          <div className="space-y-3">
                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                              Recent Dialogue Snippet:
                            </p>
                            <p className="text-xs text-slate-300 leading-relaxed italic border-l-2 border-indigo-500 pl-3">
                              &quot;
                              {diagnosis.negotiationHistory[
                                diagnosis.negotiationHistory.length - 1
                              ].content.substring(0, 150)}
                              ...&quot;
                            </p>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500 italic">
                            No negotiation history recorded for this executive.
                          </p>
                        )}
                        <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-500">
                          <span>
                            Total Turns:{" "}
                            {diagnosis?.negotiationHistory?.length || 0}
                          </span>
                          <span>Session: High Friction</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Studio / Strategic Academy */}
                <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden border border-slate-800">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -mr-32 -mt-32" />
                  <div className="relative z-10 flex flex-col md:flex-row gap-10">
                    <div className="flex-1 space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                          <Award size={22} />
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-tight">
                          Performance Studio Insights
                        </h3>
                      </div>
                      <p className="text-slate-400 text-sm font-medium leading-relaxed">
                        Suggested Academy Roadmap based on the Final Strategic
                        Verdict and simulation performance gaps.
                      </p>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                          <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">
                            Maturity Goal
                          </p>
                          <p className="text-xs font-bold">
                            {diagnosis?.ultimateStrategicReport
                              ?.maturityLevel || "Elite Suite"}
                          </p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                          <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">
                            Next Milestone
                          </p>
                          <p className="text-xs font-bold text-nowrap">
                            {diagnosis?.ultimateStrategicReport?.careerAdvancement?.[0]?.role.substring(
                              0,
                              15,
                            ) || "Leadership Transition"}
                          </p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                          <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-1">
                            Critical Workshop
                          </p>
                          <p className="text-xs font-bold">
                            Strategic Presence
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AI Strategic X-Ray Report (Added) */}
          {diagnosis?.ultimateStrategicReport && (
            <AIStrategicXRay report={diagnosis.ultimateStrategicReport} />
          )}

          {/* Simulation Deep-Dive Integration */}
          <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm">
                  <Target className="text-blue-600 w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  Mission Operations
                </h3>
              </div>
              <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Live Simulation Record
              </div>
            </div>

            {!userData.simulations || userData.simulations.length === 0 ? (
              <div className="py-16 text-center bg-slate-50/50 rounded-4xl border-2 border-dashed border-slate-100">
                <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">
                  No active simulation data points
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {userData.simulations.map((sim: Simulation, i: number) => (
                  <div
                    key={i}
                    className="group p-6 bg-white rounded-3xl border border-slate-100 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-200/40 transition-all duration-500"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-black border border-blue-100">
                          {i + 1}
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                          {sim.title}
                        </h4>
                      </div>
                      <span
                        className={`text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-wider shadow-sm ${sim.status === "completed" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"}`}
                      >
                        {sim.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-2 italic opacity-80 group-hover:opacity-100">
                      &quot;
                      {sim.currentDraft ||
                        "No qualitative data submitted yet for this phase."}
                      &quot;
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Dashboard Metrics & Identity (Sidebar Focus) */}
        <div className="lg:col-span-4 space-y-8">
          {/* User Identity Snapshot */}
          <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-slate-50 to-transparent -mr-16 -mt-16 rounded-full" />

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-linear-to-br from-slate-50 to-slate-200 rounded-[2.5rem] flex items-center justify-center text-4xl font-black text-slate-400 shadow-xl border-4 border-white mb-6">
                {userData.user?.fullName?.charAt(0) || "U"}
              </div>
              <h3 className="text-2xl font-black text-slate-900 leading-tight mb-2">
                {userData.user?.fullName}
              </h3>
              <p className="text-sm text-slate-500 font-medium mb-4">
                {userData.user?.email}
              </p>
              <div className="px-4 py-1.5 bg-blue-50 text-blue-700 text-[10px] rounded-full font-black uppercase tracking-widest border border-blue-100 mb-8 mt-2">
                {userData.user?.role || "Global Participant"}
              </div>

              <div className="w-full grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Loyalty
                  </p>
                  <p className="text-xs font-bold text-slate-800">
                    {new Date(userData.user?.createdAt).getFullYear()}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100 flex items-center">
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Status
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {userData.user?.status || "Active"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions for Admin */}
              <div className="pt-6 border-t border-slate-100 flex flex-col gap-3 w-full">
                {/* Button 1: Reset Diagnosis Only — keeps certificates */}
                <button
                  onClick={handleResetDiagnosisOnly}
                  disabled={isResettingDiagnosisOnly}
                  className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-amber-500 text-white hover:bg-amber-600 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-amber-200 active:scale-95"
                >
                  {isResettingDiagnosisOnly ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RotateCcw className="w-4 h-4" />
                  )}
                  🔄 Reset Diagnosis Only
                </button>
                <p className="text-[9px] text-center text-amber-600 font-bold uppercase tracking-widest -mt-1">
                  Keeps certificates &amp; documents ✔️
                </p>

                {/* Button 2: Full Reset — deletes everything */}
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        `⚠️ FULL RESET\n\nThis will permanently delete ALL data for ${userData.user?.fullName}:\n- CV Analysis\n- Interview Results\n- Simulation Data\n- Certificates\n- Recommendations\n\nAre you absolutely sure?`,
                      )
                    ) {
                      handleResetAction("approve");
                    }
                  }}
                  disabled={isHandlingReset}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-rose-600 text-white hover:bg-rose-700 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-rose-200 active:scale-95"
                >
                  {isHandlingReset ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RotateCcw className="w-4 h-4" />
                  )}
                  🗑️ Full Reset (Delete Everything)
                </button>
                <p className="text-[9px] text-center text-rose-500 font-bold uppercase tracking-widest -mt-1">
                  Deletes ALL data including certificates ⚠️
                </p>

                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-200">
                  Send Notification
                </button>
              </div>
            </div>
          </div>

          {/* Operational Performance Bar */}
          <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center">
                <Sparkles className="text-indigo-600 w-5 h-5" />
              </div>
              <h4 className="font-black text-slate-900 tracking-tight">
                Live Assessment
              </h4>
            </div>

            <div className="space-y-6">
              <div className="p-5 bg-linear-to-br from-indigo-50 to-blue-50 rounded-3xl border border-blue-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Brain size={48} className="text-indigo-900" />
                </div>
                <div className="relative z-10">
                  <div className="flex justify-between items-end mb-3">
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                      Global Rank
                    </p>
                    <span className="text-3xl font-black text-indigo-900">
                      {diagnosis?.report?.rank || "—"}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-indigo-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: diagnosis?.report?.rank ? "85%" : "0%" }}
                    />
                  </div>
                  <p className="text-[9px] font-bold text-indigo-500 mt-3 uppercase">
                    {diagnosis?.report
                      ? `Readiness: ${diagnosis.report.readinessLevel}%`
                      : "Diagnostic Incomplete"}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-600">
                    Technical Score
                  </span>
                  <span className="text-sm font-black text-slate-900">
                    {diagnosis?.report?.overallScore !== undefined
                      ? `${diagnosis.report.overallScore}/10`
                      : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-600">
                    Behavioral Fit
                  </span>
                  <span
                    className={`text-sm font-black ${diagnosis ? "text-blue-600" : "text-slate-400"}`}
                  >
                    {diagnosis ? "Optimized" : "Pending"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access Documents */}
          {userData.profile && (
            <div className="bg-emerald-50 p-8 rounded-[3rem] border border-emerald-100 shadow-lg group hover:bg-emerald-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20 group-hover:scale-110 transition-transform">
                  <CheckCircle size={28} className="text-white" />
                </div>
                <div>
                  <h4 className="font-black text-emerald-900 tracking-tight text-lg leading-tight text-nowrap">
                    Certification Locked
                  </h4>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em] mt-1">
                    REF:{" "}
                    {userData.profile.referenceId?.substring(0, 8) || "ADM-XX"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* NEW: Expert Career Development Strategy */}
      <div className="mt-12 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-linear-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Expert Career Development Strategy
              </h2>
              <p className="text-slate-500 font-medium">
                Internal roadmap and training architecture for our experts.
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Career Transformation Roadmap */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-xl shadow-slate-200/50">
              <h3 className="font-black text-slate-900 mb-6 flex items-center gap-3 text-lg">
                <Target size={20} className="text-orange-600" />
                Strategic Career Roadmap
              </h3>
              <div className="space-y-6">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                    Phase 1: Immediate Skill Integration
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {(
                      userData.interviewResult?.evaluation
                        ?.skillDevelopmentPriorities ||
                      diagnosis?.analysis?.immediateActions
                    )?.map((skill, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm text-sm font-bold text-slate-700"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100">
                    <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-4">
                      Internal Expert Context
                    </h4>
                    <p className="text-sm italic text-amber-900 leading-relaxed font-medium">
                      {diagnosis
                        ? `Candidate shows high potential in ${userData.user?.selectedRole || "their domain"}, but needs to bridge the gap between theoretical knowledge and operational execution found in simulations.`
                        : "Contextual analysis pending completion of diagnostic assessment modules."}
                    </p>
                  </div>
                  <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                    <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">
                      Market Potential
                    </h4>
                    <div className="space-y-2">
                      {userData.interviewResult?.evaluation?.suggestedRoles
                        ?.slice(0, 3)
                        .map((role, i) => (
                          <div
                            key={i}
                            className="text-xs font-bold text-blue-800 flex items-center gap-2"
                          >
                            <ChevronRight size={12} />
                            {role}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Suggested Training & Workshops */}
            <div className="bg-slate-900 p-8 rounded-4xl text-white shadow-2xl border border-slate-800">
              <h3 className="font-black text-xl mb-6 flex items-center gap-3 tracking-tight">
                <Brain size={24} className="text-amber-400" />
                Custom Training Architecture
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Recommended Workshops
                  </p>
                  <div className="space-y-3">
                    {(
                      userData.interviewResult?.evaluation?.expertAdvice
                        ?.suggestedWorkshops ||
                      diagnosis?.analysis?.expertAdvice?.suggestedWorkshops ||
                      (diagnosis
                        ? [
                            "Advanced Case Resolution Simulation",
                            "Stakeholder Management in High-Stakes Environments",
                            "Technical Gap-Bridge Masterclass",
                          ]
                        : [])
                    ).map((workshop, i) => (
                      <div
                        key={i}
                        className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3"
                      >
                        <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center text-amber-400 font-bold text-xs">
                          {i + 1}
                        </div>
                        <span className="text-sm font-medium">{workshop}</span>
                      </div>
                    ))}
                    {!diagnosis && (
                      <p className="text-xs text-slate-500 italic">
                        Awaiting diagnostic results to generate workshop
                        roadmap...
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Training Modules
                  </p>
                  <div className="space-y-3">
                    {(
                      userData.interviewResult?.evaluation?.expertAdvice
                        ?.suggestedTrainings ||
                      diagnosis?.analysis?.expertAdvice?.suggestedTrainings ||
                      (diagnosis
                        ? [
                            "Senior-Level Strategic Alignment",
                            "Operational Excellence Frameworks",
                            "Leadership & Crisis Communication",
                          ]
                        : [])
                    ).map((module, i) => (
                      <div
                        key={i}
                        className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3"
                      >
                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 font-bold text-xs">
                          {String.fromCharCode(65 + i)}
                        </div>
                        <span className="text-sm font-medium">{module}</span>
                      </div>
                    ))}
                    {!diagnosis && (
                      <p className="text-xs text-slate-500 italic">
                        Awaiting diagnostic results to define training
                        architecture...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: Dynamic Evolution & Notes */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-xl shadow-slate-200/50">
              <h3 className="font-black text-slate-900 mb-6 flex items-center gap-3 text-lg">
                <Sparkles size={20} className="text-indigo-600" />
                Profile Evolution
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <span className="text-xs font-bold text-indigo-700">
                    Evolution Rating
                  </span>
                  <span className="text-xl font-black text-indigo-800">
                    {diagnosis ? "+12%" : "—"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                  {diagnosis
                    ? `Analysis dynamically updates based on the latest simulation outcomes and diagnostic retakes. Currently showing optimal path for ${userData.user?.selectedRole || "selected role"}.`
                    : "Evolution tracking will begin once the first diagnostic assessment is completed."}
                </p>
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    Last Diagnostic Analysis
                  </p>
                  <p className="text-xs font-bold text-slate-700">
                    {diagnosis?.report
                      ? `${new Date().toLocaleDateString()} - Active Baseline`
                      : "Not yet analyzed"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-emerald-900 p-8 rounded-4xl text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl" />
              <h3 className="font-black text-lg mb-4">
                Expert Verdict Summary
              </h3>
              <p className="text-sm text-emerald-100 leading-relaxed font-medium">
                {userData.interviewResult?.evaluation?.expertCaseSummary
                  ? userData.interviewResult.evaluation.expertCaseSummary.substring(
                      0,
                      200,
                    ) + "..."
                  : "Provide the final expert notes and roadmap to unlock certification."}
              </p>
          </div>
        </div>
      </div>
    </div>

      {/* AI Comprehensive Full Text Report (If exists) */}
      {diagnosis?.comprehensiveReport && (
        <div className="mt-12 p-10 bg-white border border-slate-100 rounded-[3rem] shadow-2xl space-y-8">
          <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <FileText className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Rapport d&apos;Analyse Globale (Texte Complet)</h3>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">
                Generated by Strategy AI ·{" "}
                {diagnosis?.comprehensiveReportGeneratedAt
                  ? new Date(
                      diagnosis.comprehensiveReportGeneratedAt,
                    ).toLocaleDateString()
                  : "Original Audit"}
              </p>
            </div>
          </div>
          <div className="prose prose-slate max-w-none text-slate-600 leading-loose font-medium whitespace-pre-wrap text-sm">
            {diagnosis?.comprehensiveReport}
          </div>
        </div>
      )}

      {/* Detailed AI Audit Report Section */}
      {diagnosis && (
        <div className="space-y-8 mt-12 pt-12 border-t border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Brain className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Comprehensive AI Audit Report
              </h2>
              <p className="text-slate-500 font-medium">
                In-depth behavioral and technical validation data.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* 1. Skills Spectrum */}
            <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-xl shadow-slate-200/50">
              <h3 className="font-black text-slate-900 mb-6 flex items-center gap-3 text-lg">
                <Target size={20} className="text-blue-600" />
                Professional Skills Spectrum
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Technical Proficiency
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {diagnosis.analysis?.skills?.technical?.map(
                      (s: string, i: number) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 text-[10px] rounded-lg font-bold border border-blue-100"
                        >
                          {s}
                        </span>
                      ),
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Soft Skills & Leadership
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {diagnosis.analysis?.skills?.soft?.map(
                      (s: string, i: number) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-[10px] rounded-lg font-bold border border-indigo-100"
                        >
                          {s}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-slate-100">
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-4">
                  Urgent Capability Gaps
                </p>
                <div className="flex flex-wrap gap-2">
                  {diagnosis.analysis?.skills?.gaps?.map(
                    (s: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-orange-50 text-orange-700 text-[10px] rounded-lg font-bold border border-orange-100"
                      >
                        {s}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>

            {/* 2. Background Quality Audit */}
            <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-xl shadow-slate-200/50">
              <h3 className="font-black text-slate-900 mb-6 flex items-center gap-3 text-lg">
                <ShieldCheck size={20} className="text-emerald-600" />
                Background & Education Audit
              </h3>
              <div className="space-y-6">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    Experience Progression
                  </p>
                  <p className="text-sm font-bold text-slate-700">
                    {diagnosis.analysis?.experience?.progression || "N/A"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Quality Score:{" "}
                    <span className="text-blue-600 font-bold">
                      {diagnosis.analysis?.experience?.quality || "Standard"}
                    </span>
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    Academic Validation
                  </p>
                  <p className="text-sm font-bold text-slate-700">
                    {diagnosis.analysis?.education?.level || "N/A"} -{" "}
                    {diagnosis.analysis?.education?.relevance || ""}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 italic">
                    &quot;{diagnosis.analysis?.education?.notes || ""}&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Full Simulation Performance Deep-Dive */}
          <div className="bg-slate-900 p-8 rounded-4xl text-white shadow-2xl relative overflow-hidden border border-slate-800">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px]" />
            <h3 className="font-black text-xl mb-8 flex items-center gap-3 tracking-tight relative z-10">
              <Sparkles size={24} className="text-blue-400" />
              Simulation Performance Audit (Full Scenarios)
            </h3>

            {diagnosis.simulationResults &&
            diagnosis.simulationResults.length > 0 ? (
              <div className="space-y-6 relative z-10">
                {diagnosis.simulationResults.map(
                  (result: SimulationAuditResult, i: number) => (
                    <div
                      key={i}
                      className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-400 font-black">
                            0{result.scenarioNumber || i + 1}
                          </div>
                          <div>
                            <h4 className="font-bold text-lg">
                              {result.title}
                            </h4>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              Scenario Audit
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-600/20">
                          <span className="text-xs font-black uppercase tracking-widest">
                            Score:
                          </span>
                          <span className="text-xl font-black">
                            {result.aiEvaluation?.score}/10
                          </span>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-white/10">
                        <div className="space-y-4">
                          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                            Demonstrated Strengths
                          </p>
                          <div className="space-y-2">
                            {result.aiEvaluation?.strengths?.map(
                              (s: string, idx: number) => (
                                <div
                                  key={idx}
                                  className="flex items-start gap-2 text-xs text-slate-300"
                                >
                                  <CheckCircle
                                    size={14}
                                    className="text-emerald-500 mt-0.5 shrink-0"
                                  />
                                  <span>{s}</span>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest">
                            Improvement Points
                          </p>
                          <div className="space-y-2">
                            {result.aiEvaluation?.improvements?.map(
                              (s: string, idx: number) => (
                                <div
                                  key={idx}
                                  className="flex items-start gap-2 text-xs text-slate-300"
                                >
                                  <AlertCircle
                                    size={14}
                                    className="text-orange-500 mt-0.5 shrink-0"
                                  />
                                  <span>{s}</span>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <div className="py-20 text-center bg-white/5 rounded-3xl border border-white/5 border-dashed relative z-10">
                <p className="text-slate-500 font-medium">
                  In-depth simulation results not yet generated.
                </p>
              </div>
            )}
        </div>
      </div>
    )}


      {/* ═══════════════════════════════════════════════════════════════
           REVIEW BOARD — SECTION PRINCIPALE SELON TYPE DE COMPTE
      ═══════════════════════════════════════════════════════════════ */}
      <div className="mt-12 pt-12 border-t-2 border-slate-100">
        <div className="flex items-center gap-4 mb-8">
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg",
            isProfessionalPlan
              ? "bg-linear-to-br from-indigo-600 to-violet-700"
              : "bg-linear-to-br from-emerald-500 to-teal-600"
          )}>
            {isProfessionalPlan
              ? <Shield className="text-white w-7 h-7" />
              : <GraduationCap className="text-white w-7 h-7" />}
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {isProfessionalPlan ? "Review Board — Professionnel" : "Review Board — Étudiant"}
            </h2>
            <p className="text-slate-500 font-medium text-sm">
              {isProfessionalPlan
                ? "Rapport exécutif complet issu du processus d'audit stratégique."
                : "Résultats détaillés des scénarios de simulation professionnelle."}
            </p>
          </div>
          <div className={cn(
            "ml-auto px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border",
            isProfessionalPlan
              ? "bg-indigo-50 text-indigo-700 border-indigo-200"
              : "bg-emerald-50 text-emerald-700 border-emerald-200"
          )}>
            {userData.user?.plan || "Plan"}
          </div>
        </div>

        {isProfessionalPlan ? (
          diagnosis?.ultimateStrategicReport ? (
            <ProfessionalReviewBoard
              report={diagnosis.ultimateStrategicReport}
              diagnosis={diagnosis}
            />
          ) : (
            <div className="py-24 text-center bg-linear-to-br from-indigo-50 to-slate-50 rounded-4xl border-2 border-dashed border-indigo-200">
              <Shield className="w-14 h-14 text-indigo-200 mx-auto mb-4" />
              <h3 className="text-slate-600 font-black text-lg">Audit en cours ou non complété</h3>
              <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
                Le participant n&apos;a pas encore finalisé les 3 phases du processus d&apos;audit professionnel (Interview · MCQ · Portfolio).
              </p>
            </div>
          )
        ) : (
          <StudentReviewBoard diagnosis={diagnosis} />
        )}
      </div>
    </div>
  );
}
