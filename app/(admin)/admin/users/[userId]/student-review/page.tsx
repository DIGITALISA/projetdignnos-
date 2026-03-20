"use client";

import { useState, useEffect } from "react";
import {
    ShieldCheck, Loader2, RotateCcw, ArrowLeft, Brain,
    Target, MessageSquare, FileText, Sparkles, AlertCircle,
    CheckCircle, GraduationCap, CheckCircle2, ClipboardList,
    ChevronRight, Award, BookOpen, Zap, Star,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── INTERFACES ────────────────────────────────────────────────────────────────
interface SimulationResult {
    title: string;
    aiEvaluation: { score: number; strengths: string[]; improvements: string[] };
}
interface DiagnosisReport {
    overallScore: number; readinessLevel: number; rank: string;
    recommendations: string; keyStrengths: string[]; areasToImprove: string[]; nextSteps: string[];
}
interface StudentExpertReport {
    reportTitle?: string; executiveSummary?: string;
    currentLevelAssessment?: { overallLevel?: string; motivationLevel?: string; levelJustification?: string };
    trainerActionPlan?: { session1Focus?: string; keyQuestionToExplore?: string };
    competencyMap?: { technicalSkillsScore?: number; softSkillsScore?: number; criticalGaps?: string[] };
    finalVerdict?: string;
}
interface DiagnosisData {
    report?: DiagnosisReport;
    simulationResults?: SimulationResult[];
    studentExpertReport?: StudentExpertReport;
    studentExpertReportGeneratedAt?: string;
    analysis?: {
        overview?: string; strengths?: string[]; weaknesses?: string[];
        skills?: { technical: string[]; soft: string[]; gaps: string[] };
        immediateActions?: string[];
        expertAdvice?: { suggestedWorkshops: string[]; suggestedTrainings: string[]; strategicBrief: string };
        sciReport?: Record<string, unknown>;
    };
    comprehensiveReport?: string;
    comprehensiveReportGeneratedAt?: string;
    negotiationHistory?: { role: string; content: string }[];
    marketingAssets?: { cv?: string; report?: string };
}
interface UserData {
    fullName: string; email: string; role: string; status: string;
    plan: string; createdAt: string; selectedRole?: string;
    isDiagnosisComplete?: boolean; canAccessCertificates?: boolean;
    canAccessRecommendations?: boolean; canAccessScorecard?: boolean;
    canAccessSCI?: boolean; resetRequested?: boolean; whatsapp?: string;
    memberId?: string;
}
interface Simulation { title: string; status: string; currentDraft?: string; }
interface InterviewResult { evaluation?: { seniorityLevel?: string; expertCaseSummary?: string; suggestedRoles?: string[]; skillDevelopmentPriorities?: string[]; expertAdvice?: { suggestedWorkshops: string[]; suggestedTrainings: string[] }; cvVsReality?: { confirmedStrengths: string[]; exaggerations: string[]; hiddenStrengths: string[] } } }
interface AggregatedData {
    success: boolean; user: UserData; diagnosis: DiagnosisData | null;
    interviewResult: InterviewResult | null; simulations: Simulation[];
    profile: { referenceId?: string } | null;
}

// ─── RADAR BAR ────────────────────────────────────────────────────────────────
function RadarBar({ label, value, color = "emerald" }: { label: string; value: number; color?: string }) {
    const colors: Record<string, string> = {
        emerald: "from-emerald-400 to-teal-500",
        blue: "from-blue-400 to-indigo-500",
        amber: "from-amber-400 to-orange-500",
        rose: "from-rose-400 to-red-500",
    };
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</span>
                <span className="text-xs font-black text-slate-800">{value}<span className="text-slate-400">/10</span></span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value * 10}%` }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                    className={cn("h-full rounded-full bg-linear-to-r", colors[color])}
                />
            </div>
        </div>
    );
}

export default function StudentReviewPage() {
    const params = useParams();
    const router = useRouter();
    const userId = params.userId as string;

    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState<AggregatedData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [expertNotes, setExpertNotes] = useState("");
    const [isSavingNotes, setIsSavingNotes] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isGeneratingSCI, setIsGeneratingSCI] = useState(false);
    const [isGeneratingExpertReport, setIsGeneratingExpertReport] = useState(false);
    const [isHandlingReset, setIsHandlingReset] = useState(false);
    const [isResettingDiagnosisOnly, setIsResettingDiagnosisOnly] = useState(false);
    const [notificationMsg, setNotificationMsg] = useState("");
    const [isSendingNotification, setIsSendingNotification] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/admin/users/${userId}/aggregated-data`);
                const data = await res.json();
                if (data.success) {
                    setUserData(data);
                    if (data.profile?.expertNotes) setExpertNotes(data.profile.expertNotes);
                } else {
                    setError(data.error || "Failed to load user data.");
                }
            } catch (err) {
                setError((err as Error).message || "Network error occurred.");
            } finally {
                setIsLoading(false);
            }
        };
        if (userId) fetchData();
    }, [userId]);

    const handleSaveExpertNotes = async () => {
        setIsSavingNotes(true);
        try {
            const res = await fetch(`/api/admin/users/${userId}/update-expert-notes`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ expertNotes }),
            });
            const data = await res.json();
            if (data.success) alert("Expert verdict saved!");
            else alert("Failed: " + data.error);
        } catch { alert("Network error"); }
        finally { setIsSavingNotes(false); }
    };

    const handleGenerateType = async (type: "assessment" | "recommendation" | "scorecard") => {
        setIsGenerating(true);
        try {
            const res = await fetch(`/api/admin/users/${userId}/generate-profile`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ expertNotes, language: "fr", type }),
            });
            const data = await res.json();
            if (data.success) { alert(`${type} generated successfully!`); window.location.reload(); }
            else alert("Failed: " + data.error);
        } catch { alert("System error"); }
        finally { setIsGenerating(false); }
    };

    const handleGenerateSCI = async () => {
        setIsGeneratingSCI(true);
        try {
            const res = await fetch(`/api/admin/users/${userId}/generate-sci`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ expertNotes, language: "fr" }),
            });
            const data = await res.json();
            if (data.success) { alert("SCI Report published!"); window.location.reload(); }
            else alert("Failed: " + data.error);
        } catch { alert("System error"); }
        finally { setIsGeneratingSCI(false); }
    };

    const handleGenerateExpertReport = async () => {
        setIsGeneratingExpertReport(true);
        try {
            const res = await fetch("/api/expert/student-report", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, language: "fr" }),
            });
            const data = await res.json();
            if (data.success) { alert("Student Expert Report generated!"); window.location.reload(); }
            else alert("Failed: " + data.error);
        } catch { alert("System error"); }
        finally { setIsGeneratingExpertReport(false); }
    };

    const handleResetAction = async (action: "approve" | "reject") => {
        if (action === "approve" && !window.confirm("CRITICAL: This will permanently delete ALL student data. Continue?")) return;
        setIsHandlingReset(true);
        try {
            const res = await fetch(`/api/admin/users/${userId}/handle-reset`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action }),
            });
            const data = await res.json();
            if (data.success) { alert(data.message); window.location.reload(); }
            else alert("Error: " + data.error);
        } catch { alert("Network error"); }
        finally { setIsHandlingReset(false); }
    };

    const handleResetDiagnosisOnly = async () => {
        if (!window.confirm(`Reset Diagnosis ONLY for ${userData?.user?.fullName}?\n\nCertificates and documents will be PRESERVED.`)) return;
        setIsResettingDiagnosisOnly(true);
        try {
            const res = await fetch(`/api/admin/users/${userId}/reset-diagnosis-only`, {
                method: "POST", headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            if (data.success) { alert("✅ " + data.message); window.location.reload(); }
            else alert("Error: " + data.error);
        } catch { alert("Network error"); }
        finally { setIsResettingDiagnosisOnly(false); }
    };

    const handleSendNotification = async () => {
        if (!notificationMsg.trim()) return;
        setIsSendingNotification(true);
        try {
            const res = await fetch("/api/user/notifications", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ recipientEmail: userData?.user?.email, title: "Message from Administrator", message: notificationMsg, type: "info" }),
            });
            const data = await res.json();
            if (data.success) { alert("Notification sent!"); setNotificationMsg(""); }
            else alert("Failed: " + data.error);
        } catch { alert("Error"); }
        finally { setIsSendingNotification(false); }
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
            <p className="text-slate-500 font-medium">Loading Student Profile...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                <AlertCircle size={32} />
            </div>
            <div className="text-center max-w-md">
                <h2 className="text-xl font-bold text-slate-900 mb-2">Data Unavailable</h2>
                <p className="text-slate-500 mb-6">{error}</p>
                <button onClick={() => router.back()} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-colors">
                    Return to Participants
                </button>
            </div>
        </div>
    );

    if (!userData) return null;

    const diagnosis = userData.diagnosis;
    const report = diagnosis?.report;
    const simResults = diagnosis?.simulationResults || [];
    const expertReport = diagnosis?.studentExpertReport;
    const sciReport = diagnosis?.analysis?.sciReport;
    const canGenerate = !!diagnosis && !!userData.user?.isDiagnosisComplete && !!expertNotes.trim();

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20 p-6 md:p-8">

            {/* ── RESET ALERT ── */}
            {userData.user?.resetRequested && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="bg-rose-50 border-2 border-rose-200 rounded-4xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-rose-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <RotateCcw className="text-white w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-rose-900">Progress Reset Requested</h3>
                            <p className="text-rose-700 font-medium max-w-md">This student has requested to restart their journey.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => handleResetAction("reject")} disabled={isHandlingReset}
                            className="px-6 py-3 bg-white text-slate-600 rounded-xl font-black text-xs uppercase tracking-widest border border-slate-200 hover:bg-slate-50">
                            Reject
                        </button>
                        <button onClick={() => handleResetAction("approve")} disabled={isHandlingReset}
                            className="px-8 py-3 bg-rose-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-rose-700 shadow-lg flex items-center gap-2">
                            {isHandlingReset ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                            Approve Reset
                        </button>
                    </div>
                </motion.div>
            )}

            {/* ── HEADER ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors border border-transparent hover:border-slate-200">
                        <ArrowLeft size={20} className="text-slate-600" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
                                <GraduationCap className="text-emerald-600 w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Student Review Board</span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-emerald-900">
                            {userData.user?.fullName}
                        </h1>
                        <p className="text-slate-500 font-medium">Academic progress, skill assessment & behavioral alignment review.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={handleSaveExpertNotes} disabled={isSavingNotes}
                        className="px-6 py-2.5 bg-emerald-50 text-emerald-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-100 border border-emerald-200 flex items-center gap-2">
                        {isSavingNotes ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                        Save Review
                    </button>
                    <span className="px-4 py-2 bg-emerald-600/10 text-emerald-700 rounded-xl text-xs font-bold uppercase tracking-wider border border-emerald-200">
                        Student ·  {userData.user?.plan}
                    </span>
                </div>
            </div>

            {/* ── MAIN GRID ── */}
            <div className="grid lg:grid-cols-12 gap-8 items-start">

                {/* ─── LEFT COLUMN ─── */}
                <div className="lg:col-span-8 space-y-8">

                    {/* ── PERFORMANCE SNAPSHOT ── */}
                    <div className="bg-linear-to-br from-emerald-900 via-teal-800 to-slate-900 rounded-4xl p-10 text-white shadow-2xl relative overflow-hidden border border-emerald-800/30">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] -mr-40 -mt-40" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em]">Performance Diagnostic</span>
                            </div>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-white/10 rounded-3xl p-6 text-center border border-white/10">
                                    <div className="text-4xl font-black text-white">{report?.overallScore ?? "—"}<span className="text-emerald-400 text-xl">/10</span></div>
                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Global Score</div>
                                </div>
                                <div className="bg-white/10 rounded-3xl p-6 text-center border border-white/10">
                                    <div className="text-4xl font-black text-white">{report?.readinessLevel ?? "—"}<span className="text-teal-400 text-xl">%</span></div>
                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Readiness</div>
                                </div>
                                <div className="bg-white/10 rounded-3xl p-6 text-center border border-white/10">
                                    <div className="text-3xl font-black text-amber-400">{report?.rank ?? "—"}</div>
                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Rank</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── SIMULATION SCENARIOS ── */}
                    {simResults.length > 0 && (
                        <div className="bg-slate-900 rounded-4xl p-8 text-white shadow-2xl">
                            <div className="flex items-center gap-3 mb-8">
                                <ClipboardList className="text-blue-400" size={22} />
                                <h3 className="text-lg font-black uppercase tracking-tight">Simulation Scenarios</h3>
                                <span className="ml-auto text-[10px] font-black text-slate-400 uppercase">{simResults.length} scenarios</span>
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
                                                <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-2">Strengths</p>
                                                <div className="space-y-1">
                                                    {result.aiEvaluation?.strengths?.map((s, j) => (
                                                        <div key={j} className="flex items-start gap-2 text-xs text-slate-300">
                                                            <CheckCircle size={12} className="text-emerald-500 mt-0.5 shrink-0" />{s}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest mb-2">To Improve</p>
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

                    {/* ── KEY STRENGTHS & AREAS ── */}
                    {report && (
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-emerald-50 border border-emerald-100 rounded-4xl p-8">
                                <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">Key Strengths</h4>
                                <div className="space-y-2">
                                    {report.keyStrengths?.map((s, i) => (
                                        <div key={i} className="flex items-start gap-2 text-xs font-medium text-emerald-800">
                                            <CheckCircle2 size={13} className="text-emerald-500 mt-0.5 shrink-0" />{s}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-orange-50 border border-orange-100 rounded-4xl p-8">
                                <h4 className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-4">Areas to Improve</h4>
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

                    {/* ── STUDENT EXPERT REPORT ── */}
                    {expertReport && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-px flex-1 bg-slate-100" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Student Expert Intelligence Brief</h3>
                                <div className="h-px flex-1 bg-slate-100" />
                            </div>

                            <div className="bg-linear-to-br from-emerald-950 to-slate-900 rounded-4xl p-10 text-white border border-emerald-900/30 space-y-8">
                                {expertReport.currentLevelAssessment && (
                                    <div className="space-y-4">
                                        <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em]">Current Level Assessment</div>
                                        <div className="grid md:grid-cols-3 gap-4">
                                            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center">
                                                <div className="text-2xl font-black text-emerald-300">{expertReport.currentLevelAssessment.overallLevel}</div>
                                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Overall Level</div>
                                            </div>
                                            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center">
                                                <div className="text-2xl font-black text-amber-300">{expertReport.currentLevelAssessment.motivationLevel}</div>
                                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Motivation</div>
                                            </div>
                                            <div className="md:col-span-1 bg-white/5 p-5 rounded-2xl border border-white/10">
                                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Justification</div>
                                                <p className="text-xs text-slate-200 font-medium leading-relaxed">{expertReport.currentLevelAssessment.levelJustification}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {expertReport.competencyMap && (
                                    <div className="space-y-4">
                                        <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">Competency Map</div>
                                        <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10">
                                            <RadarBar label="Technical Skills" value={expertReport.competencyMap.technicalSkillsScore || 0} color="blue" />
                                            <RadarBar label="Soft Skills" value={expertReport.competencyMap.softSkillsScore || 0} color="emerald" />
                                        </div>
                                        {expertReport.competencyMap.criticalGaps && expertReport.competencyMap.criticalGaps.length > 0 && (
                                            <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-5">
                                                <div className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-3">Critical Gaps</div>
                                                <div className="flex flex-wrap gap-2">
                                                    {expertReport.competencyMap.criticalGaps.map((gap, i) => (
                                                        <span key={i} className="text-[10px] font-black bg-rose-500/10 text-rose-300 px-3 py-1 rounded-lg border border-rose-500/20">✕ {gap}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {expertReport.trainerActionPlan && (
                                    <div className="space-y-4">
                                        <div className="text-[10px] font-black text-amber-400 uppercase tracking-[0.4em]">Trainer Action Plan</div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="bg-amber-500/10 p-5 rounded-2xl border border-amber-500/20">
                                                <div className="text-[9px] font-black text-amber-400 uppercase tracking-widest mb-2">Session 1 Focus</div>
                                                <p className="text-xs text-amber-200 font-medium">{expertReport.trainerActionPlan.session1Focus}</p>
                                            </div>
                                            <div className="bg-indigo-500/10 p-5 rounded-2xl border border-indigo-500/20">
                                                <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2">Key Question to Explore</div>
                                                <p className="text-xs text-indigo-200 italic font-medium">&ldquo;{expertReport.trainerActionPlan.keyQuestionToExplore}&rdquo;</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {expertReport.finalVerdict && (
                                    <div className="bg-emerald-600/20 border border-emerald-500/30 rounded-3xl p-8 text-center">
                                        <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-3">Expert Final Verdict</div>
                                        <p className="text-white font-bold text-lg leading-relaxed italic max-w-3xl mx-auto">
                                            &ldquo;{expertReport.finalVerdict}&rdquo;
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── COACH COMMAND CENTER ── */}
                    <div className="bg-slate-900 rounded-4xl p-10 text-white shadow-2xl relative overflow-hidden border border-slate-800">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px]" />
                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-emerald-600/20 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                                    <ShieldCheck className="text-emerald-400 w-7 h-7" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight">Coach Command Center</h2>
                                    <p className="text-emerald-400/60 text-xs font-bold uppercase tracking-widest">Student Profile Review Console</p>
                                </div>
                            </div>

                            {/* Dossier Grid */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Student Level</p>
                                    <h4 className="text-xl font-bold flex items-center gap-2">
                                        {userData.interviewResult?.evaluation?.seniorityLevel || "Pending Analysis"}
                                        <div className={`w-2 h-2 rounded-full animate-pulse ${userData.interviewResult ? "bg-emerald-500" : "bg-blue-500"}`} />
                                    </h4>
                                    <p className="text-xs text-slate-400 mt-2 font-medium">
                                        {userData.interviewResult ? "Verified via diagnostic interview rounds." : "Awaiting completion of assessment modules."}
                                    </p>
                                </div>
                                <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Career Path Interest</p>
                                    <h4 className="text-xl font-bold truncate">{userData.user?.selectedRole || "General Interest"}</h4>
                                    <p className="text-xs text-slate-400 mt-2 font-medium">Selected role path by the student.</p>
                                </div>
                            </div>

                            {/* Executive Summary */}
                            <div className={cn("p-8 border rounded-4xl text-sm leading-relaxed font-medium italic",
                                "bg-emerald-500/10 border-emerald-500/10 text-emerald-200")}>
                                {userData.interviewResult?.evaluation?.expertCaseSummary ||
                                    "Student assessment synthesis pending completion."}
                            </div>

                            {/* Expert Notes */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Coach Notes & Verdict</label>
                                    <button onClick={handleSaveExpertNotes} disabled={isSavingNotes}
                                        className="text-[10px] font-black text-emerald-500 uppercase hover:underline disabled:opacity-50">
                                        {isSavingNotes ? "Saving..." : "Quick Save"}
                                    </button>
                                </div>
                                <textarea value={expertNotes} onChange={(e) => setExpertNotes(e.target.value)}
                                    placeholder="Record your coaching verdict, key observations, and recommended development path for this student..."
                                    className="w-full h-36 p-6 bg-white/5 border border-white/10 rounded-3xl text-sm focus:ring-2 focus:ring-emerald-500/30 outline-none resize-none font-medium text-slate-100 placeholder:text-slate-600 transition-all"
                                />
                            </div>

                            {/* Generation Buttons */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    {
                                        label: "Performance Profile",
                                        icon: <ShieldCheck size={18} className={userData.user?.canAccessCertificates ? "text-emerald-600" : "text-blue-600"} />,
                                        action: () => handleGenerateType("assessment"),
                                        isLoading: isGenerating,
                                        isActive: !!userData.user?.canAccessCertificates,
                                    },
                                    {
                                        label: "Recommendation Letter",
                                        icon: <Sparkles size={18} className={userData.user?.canAccessRecommendations ? "text-emerald-600" : "text-indigo-600"} />,
                                        action: () => handleGenerateType("recommendation"),
                                        isLoading: isGenerating,
                                        isActive: !!userData.user?.canAccessRecommendations,
                                    },
                                    {
                                        label: "Executive Scorecard",
                                        icon: <Target size={18} className={userData.user?.canAccessScorecard ? "text-emerald-600" : "text-amber-600"} />,
                                        action: () => handleGenerateType("scorecard"),
                                        isLoading: isGenerating,
                                        isActive: !!userData.user?.canAccessScorecard,
                                    },
                                    {
                                        label: "SCI Report",
                                        icon: sciReport ? <CheckCircle size={18} className="text-white" /> : <Brain size={18} className="text-white" />,
                                        action: handleGenerateSCI,
                                        isLoading: isGeneratingSCI,
                                        isActive: false,
                                        dark: true,
                                        generated: !!sciReport,
                                    },
                                ].map((btn, i) => (
                                    <button key={i} onClick={btn.action}
                                        disabled={isGenerating || isGeneratingSCI || !canGenerate}
                                        className={cn("py-6 px-4 rounded-3xl font-black text-[9px] uppercase tracking-widest shadow-xl active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-3 disabled:opacity-30 border",
                                            btn.dark
                                                ? btn.generated ? "bg-emerald-600 text-white border-transparent" : "bg-indigo-600 text-white border-transparent hover:bg-indigo-500"
                                                : btn.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-white text-slate-900 border-slate-100 hover:bg-slate-50"
                                        )}>
                                        {btn.isLoading ? <Loader2 size={16} className="animate-spin text-blue-600" /> : btn.icon}
                                        <span className="text-center">{btn.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Expert Report Generation */}
                            <div className="border-t border-white/10 pt-6">
                                <button onClick={handleGenerateExpertReport} disabled={isGeneratingExpertReport || !expertNotes.trim()}
                                    className="w-full py-5 bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-3xl font-black text-sm uppercase tracking-widest hover:opacity-90 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-40">
                                    {isGeneratingExpertReport ? <Loader2 size={18} className="animate-spin" /> : <Star size={18} />}
                                    Generate Student Expert Intelligence Brief
                                </button>
                                <p className="text-[9px] text-slate-500 text-center mt-2 uppercase tracking-widest">
                                    {diagnosis?.studentExpertReportGeneratedAt
                                        ? `Last generated: ${new Date(diagnosis.studentExpertReportGeneratedAt).toLocaleDateString()}`
                                        : "Not yet generated"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ── TRAINING ARCHITECTURE ── */}
                    <div className="bg-slate-900 p-8 rounded-4xl text-white shadow-2xl border border-slate-800">
                        <h3 className="font-black text-xl mb-6 flex items-center gap-3 tracking-tight">
                            <Brain size={24} className="text-emerald-400" />
                            Custom Training Architecture
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recommended Workshops</p>
                                <div className="space-y-3">
                                    {(userData.interviewResult?.evaluation?.expertAdvice?.suggestedWorkshops ||
                                        diagnosis?.analysis?.expertAdvice?.suggestedWorkshops ||
                                        (diagnosis ? ["Case Resolution Simulation", "Stakeholder Management", "Technical Gap-Bridge Masterclass"] : [])
                                    ).map((w, i) => (
                                        <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
                                            <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 font-bold text-xs">{i + 1}</div>
                                            <span className="text-sm font-medium">{w}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Training Modules</p>
                                <div className="space-y-3">
                                    {(userData.interviewResult?.evaluation?.expertAdvice?.suggestedTrainings ||
                                        diagnosis?.analysis?.expertAdvice?.suggestedTrainings ||
                                        (diagnosis ? ["Strategic Alignment Module", "Operational Excellence", "Leadership Fundamentals"] : [])
                                    ).map((m, i) => (
                                        <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 font-bold text-xs">{String.fromCharCode(65 + i)}</div>
                                            <span className="text-sm font-medium">{m}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── MARKET POTENTIAL ── */}
                    {userData.interviewResult?.evaluation?.suggestedRoles && (
                        <div className="bg-white rounded-4xl p-8 border border-slate-100 shadow-xl">
                            <h3 className="font-black text-lg mb-6 flex items-center gap-3">
                                <BookOpen size={20} className="text-blue-600" /> Market Potential & Career Paths
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {userData.interviewResult.evaluation.suggestedRoles.map((role, i) => (
                                    <div key={i} className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-2xl text-sm font-bold text-blue-800">
                                        <ChevronRight size={14} className="text-blue-500" />{role}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── SIMULATIONS LIST ── */}
                    {userData.simulations && userData.simulations.length > 0 && (
                        <div className="bg-white rounded-4xl p-10 border border-slate-100 shadow-xl">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
                                        <Target className="text-blue-600 w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Session Operations</h3>
                                </div>
                                <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    Live Record
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                {userData.simulations.map((sim, i) => (
                                    <div key={i} className="group p-6 bg-white rounded-3xl border border-slate-100 hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-200/40 transition-all">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px] font-black border border-emerald-100">{i + 1}</div>
                                                <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{sim.title}</h4>
                                            </div>
                                            <span className={cn("text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-wider shadow-sm",
                                                sim.status === "completed" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100")}>
                                                {sim.status}
                                            </span>
                                        </div>
                                        <div className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-2 italic opacity-80">
                                            &quot;{sim.currentDraft || "No submission yet."}&quot;
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── COMPREHENSIVE REPORT ── */}
                    {diagnosis?.comprehensiveReport && (
                        <div className="p-10 bg-white border border-slate-100 rounded-4xl shadow-2xl space-y-8">
                            <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                                    <FileText className="text-white" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">AI Comprehensive Analysis Report</h3>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">
                                        Generated · {diagnosis.comprehensiveReportGeneratedAt ? new Date(diagnosis.comprehensiveReportGeneratedAt).toLocaleDateString() : "Original Audit"}
                                    </p>
                                </div>
                            </div>
                            <div className="prose prose-slate max-w-none text-slate-600 leading-loose font-medium whitespace-pre-wrap text-sm">
                                {diagnosis.comprehensiveReport}
                            </div>
                        </div>
                    )}
                </div>

                {/* ─── RIGHT COLUMN ─── */}
                <div className="lg:col-span-4 space-y-8">

                    {/* User Identity */}
                    <div className="bg-white rounded-4xl p-8 border border-slate-100 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-emerald-50 to-transparent -mr-16 -mt-16 rounded-full" />
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-linear-to-br from-emerald-100 to-teal-200 rounded-[2.5rem] flex items-center justify-center text-4xl font-black text-emerald-700 shadow-xl border-4 border-white mb-6">
                                {userData.user?.fullName?.charAt(0) || "S"}
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 leading-tight mb-2">{userData.user?.fullName}</h3>
                            <p className="text-sm text-slate-500 font-medium mb-1">{userData.user?.email}</p>
                            {userData.user?.whatsapp && <p className="text-xs text-slate-400 font-mono mb-4">{userData.user.whatsapp}</p>}
                            {userData.user?.memberId && (
                                <div className="px-4 py-1.5 bg-slate-900 text-white text-[10px] rounded-xl font-black tracking-widest mb-4">{userData.user.memberId}</div>
                            )}
                            <div className="px-4 py-1.5 bg-emerald-50 text-emerald-700 text-[10px] rounded-full font-black uppercase tracking-widest border border-emerald-100 mb-8">
                                {userData.user?.role}
                            </div>
                            <div className="w-full grid grid-cols-2 gap-3">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Plan</p>
                                    <p className="text-xs font-bold text-emerald-700">{userData.user?.plan}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                    <p className={cn("text-xs font-bold", userData.user?.status === "Active" ? "text-emerald-600" : "text-amber-600")}>
                                        {userData.user?.status}
                                    </p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Diagnostic</p>
                                    <p className={cn("text-xs font-bold", userData.user?.isDiagnosisComplete ? "text-emerald-600" : "text-rose-500")}>
                                        {userData.user?.isDiagnosisComplete ? "Complete" : "Pending"}
                                    </p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Simulations</p>
                                    <p className="text-xs font-bold text-blue-700">{userData.simulations?.length || 0}</p>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="pt-6 border-t border-slate-100 flex flex-col gap-3 w-full">
                                <button onClick={handleResetDiagnosisOnly} disabled={isResettingDiagnosisOnly}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-amber-500 text-white hover:bg-amber-600 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-amber-200 active:scale-95">
                                    {isResettingDiagnosisOnly ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                                    🔄 Reset Diagnosis Only
                                </button>
                                <p className="text-[9px] text-center text-amber-600 font-bold uppercase tracking-widest -mt-1">Keeps certificates ✔️</p>
                                <button onClick={() => { if (window.confirm(`Full reset ALL data for ${userData.user?.fullName}?`)) handleResetAction("approve"); }}
                                    disabled={isHandlingReset}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-rose-600 text-white hover:bg-rose-700 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-rose-200 active:scale-95">
                                    {isHandlingReset ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                                    🗑️ Full Reset
                                </button>
                                <p className="text-[9px] text-center text-rose-500 font-bold uppercase tracking-widest -mt-1">Deletes ALL data ⚠️</p>
                            </div>
                        </div>
                    </div>

                    {/* Credentials Access Status */}
                    <div className="bg-white rounded-4xl p-8 border border-slate-100 shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center"><Award className="text-emerald-600 w-5 h-5" /></div>
                            <h4 className="font-black text-slate-900">Credentials Access</h4>
                        </div>
                        <div className="space-y-3">
                            {[
                                { label: "Performance Profile", key: "canAccessCertificates", value: userData.user?.canAccessCertificates },
                                { label: "Recommendation Letter", key: "canAccessRecommendations", value: userData.user?.canAccessRecommendations },
                                { label: "Executive Scorecard", key: "canAccessScorecard", value: userData.user?.canAccessScorecard },
                                { label: "Strategic Intelligence (SCI)", key: "canAccessSCI", value: userData.user?.canAccessSCI },
                            ].map((item) => (
                                <div key={item.key} className={cn("flex items-center justify-between p-3 rounded-2xl border",
                                    item.value ? "bg-emerald-50 border-emerald-100" : "bg-slate-50 border-slate-100")}>
                                    <span className="text-xs font-bold text-slate-700">{item.label}</span>
                                    <div className={cn("w-2.5 h-2.5 rounded-full", item.value ? "bg-emerald-500" : "bg-slate-300")} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SCI Status */}
                    {sciReport && (
                        <div className="bg-emerald-50 p-8 rounded-4xl border border-emerald-100 shadow-lg">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
                                    <CheckCircle size={28} className="text-white" />
                                </div>
                                <div>
                                    <h4 className="font-black text-emerald-900 tracking-tight text-lg leading-tight">SCI Report Published</h4>
                                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em] mt-1">Strategic Intelligence Active</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Send Notification */}
                    <div className="bg-white rounded-4xl p-8 border border-slate-100 shadow-xl space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center"><MessageSquare className="text-blue-600 w-5 h-5" /></div>
                            <h4 className="font-black text-slate-900">Send Notification</h4>
                        </div>
                        <textarea value={notificationMsg} onChange={(e) => setNotificationMsg(e.target.value)}
                            placeholder="Write a message to the student..."
                            className="w-full h-24 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none resize-none font-medium text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/10"
                        />
                        <button onClick={handleSendNotification} disabled={isSendingNotification || !notificationMsg.trim()}
                            className="w-full py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-40">
                            {isSendingNotification ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                            Send Message
                        </button>
                    </div>

                    {/* Certification Badge */}
                    {userData.profile && (
                        <div className="bg-emerald-50 p-8 rounded-4xl border border-emerald-100 shadow-lg">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
                                    <CheckCircle size={28} className="text-white" />
                                </div>
                                <div>
                                    <h4 className="font-black text-emerald-900 tracking-tight text-lg leading-tight">Certification Locked</h4>
                                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em] mt-1">
                                        REF: {userData.profile.referenceId?.substring(0, 8) || "ADM-XX"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
