"use client";
import { useState, useEffect } from "react";
import { ShieldCheck, Loader2, RotateCcw, ArrowLeft, Brain, Target, FileText, Sparkles, AlertCircle, CheckCircle, MessageSquare, Zap, Award, Star, TrendingUp, Eye } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AuditResult { careerLevel?: string; currentRole?: string; sector?: string; yearsOfExperience?: number; marketPosition?: string; keyStrengths?: string[]; skillGaps?: string[]; actionPlan?: string[]; strategicAudit?: string; identity?: { field?: string; specialization?: string }; }
interface ExpertReport { executiveBrief?: string; executiveAuthorityProfile?: { authorityScore?: number; authorityLevel?: string; professionalDNA?: string; marketPerceptionGap?: string; executivePresenceRating?: string; leadershipStyleSignature?: string; }; marketAndCareerIntelligence?: { currentMarketValue?: string; potentialMarketValue?: string; topTargetRoles?: string[]; timeToNextLevel?: string; }; strategicInterventionPlan?: { phase1_Immediate?: { timeframe?: string; focus?: string; specificActions?: string[] }; phase2_ShortTerm?: { timeframe?: string; focus?: string; specificActions?: string[] }; phase3_MediumTerm?: { timeframe?: string; focus?: string; specificActions?: string[] }; }; advisorIntelligenceNotes?: { keyUnlockQuestion?: string; negotiationLeverage?: string; redFlagWarnings?: string[]; }; confidentialVerdict?: string; }
interface FinalReport { maturityLevel?: string; profileSummary?: string; finalVerdict?: string; swot?: { strengths: string[]; weaknesses: string[]; opportunities: string[]; threats: string[] }; strategicRadar?: Record<string, number>; careerAdvancement?: { role: string; shortTermProbability: number; longTermProbability: number }[]; authorityVsPotential?: { currentAuthority: number; futurePotential: number; quadrant: string }; gapAnalysis?: { hardSkillsMatch: number; softSkillsMatch: number; criticalCompetencyGaps: string[]; currentJobVsReality: string }; }
interface DiagnosisData { auditResult?: AuditResult; professionalAuditResult?: AuditResult; professionalFinalReport?: FinalReport; professionalExpertReport?: ExpertReport; professionalExpertReportGeneratedAt?: string; marketingAssets?: { cv?: string; report?: string }; negotiationHistory?: { role: string; content: string }[]; comprehensiveReport?: string; analysis?: { sciReport?: Record<string, unknown>; immediateActions?: string[]; expertAdvice?: { suggestedWorkshops: string[] } }; }
interface UserData { fullName: string; email: string; role: string; status: string; plan: string; createdAt: string; selectedRole?: string; isDiagnosisComplete?: boolean; canAccessCertificates?: boolean; canAccessRecommendations?: boolean; canAccessScorecard?: boolean; canAccessSCI?: boolean; resetRequested?: boolean; whatsapp?: string; memberId?: string; }
interface Simulation { title: string; status: string; currentDraft?: string; }
interface AggregatedData { success: boolean; user: UserData; diagnosis: DiagnosisData | null; interviewResult: { evaluation?: { seniorityLevel?: string; expertCaseSummary?: string } } | null; simulations: Simulation[]; profile: { referenceId?: string } | null; }

function RadarBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</span>
        <span className="text-xs font-black text-slate-800">{value}<span className="text-slate-400">/10</span></span>
      </div>
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${value * 10}%` }} transition={{ duration: 1.2, ease: "easeOut" }}
          className="h-full rounded-full bg-linear-to-r from-indigo-500 to-violet-600" />
      </div>
    </div>
  );
}

export default function ProfessionalReviewPage() {
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
        if (data.success) { setUserData(data); }
        else setError(data.error || "Failed to load.");
      } catch (err) { setError((err as Error).message); }
      finally { setIsLoading(false); }
    };
    if (userId) fetchData();
  }, [userId]);

  const handleSave = async () => { setIsSavingNotes(true); try { const res = await fetch(`/api/admin/users/${userId}/update-expert-notes`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ expertNotes }) }); const d = await res.json(); if (d.success) alert("Saved!"); else alert("Error: " + d.error); } catch { alert("Network error"); } finally { setIsSavingNotes(false); } };
  const handleGenerate = async (type: "assessment" | "recommendation" | "scorecard") => { setIsGenerating(true); try { const res = await fetch(`/api/admin/users/${userId}/generate-profile`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ expertNotes, language: "fr", type }) }); const d = await res.json(); if (d.success) { alert(`${type} generated!`); window.location.reload(); } else alert("Error: " + d.error); } catch { alert("System error"); } finally { setIsGenerating(false); } };
  const handleGenerateSCI = async () => { setIsGeneratingSCI(true); try { const res = await fetch(`/api/admin/users/${userId}/generate-sci`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ expertNotes, language: "fr" }) }); const d = await res.json(); if (d.success) { alert("SCI published!"); window.location.reload(); } else alert("Error: " + d.error); } catch { alert("System error"); } finally { setIsGeneratingSCI(false); } };
  const handleExpertReport = async () => { setIsGeneratingExpertReport(true); try { const res = await fetch("/api/expert/professional-report", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, language: "fr" }) }); const d = await res.json(); if (d.success) { alert("Expert Report generated!"); window.location.reload(); } else alert("Error: " + d.error); } catch { alert("System error"); } finally { setIsGeneratingExpertReport(false); } };
  const handleReset = async (action: "approve" | "reject") => { if (action === "approve" && !window.confirm("CRITICAL: Permanently delete ALL professional data?")) return; setIsHandlingReset(true); try { const res = await fetch(`/api/admin/users/${userId}/handle-reset`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) }); const d = await res.json(); if (d.success) { alert(d.message); window.location.reload(); } else alert("Error: " + d.error); } catch { alert("Network error"); } finally { setIsHandlingReset(false); } };
  const handleResetDiagnosisOnly = async () => { if (!window.confirm("Reset Diagnosis ONLY? Credentials preserved.")) return; setIsResettingDiagnosisOnly(true); try { const res = await fetch(`/api/admin/users/${userId}/reset-diagnosis-only`, { method: "POST" }); const d = await res.json(); if (d.success) { alert("✅ " + d.message); window.location.reload(); } else alert("Error: " + d.error); } catch { alert("Network error"); } finally { setIsResettingDiagnosisOnly(false); } };
  const handleNotification = async () => { if (!notificationMsg.trim()) return; setIsSendingNotification(true); try { const res = await fetch("/api/user/notifications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ recipientEmail: userData?.user?.email, title: "Message from Administrator", message: notificationMsg, type: "info" }) }); const d = await res.json(); if (d.success) { alert("Sent!"); setNotificationMsg(""); } } catch { alert("Error"); } finally { setIsSendingNotification(false); } };

  if (isLoading) return <div className="flex flex-col items-center justify-center min-h-screen gap-4"><Loader2 className="w-10 h-10 animate-spin text-indigo-600" /><p className="text-slate-500 font-medium">Loading Executive Profile...</p></div>;
  if (error) return <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8"><AlertCircle size={32} className="text-red-500" /><p className="text-slate-500">{error}</p><button onClick={() => router.back()} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold">Go Back</button></div>;
  if (!userData) return null;

  const diagnosis = userData.diagnosis;
  const auditResult = (diagnosis?.auditResult || diagnosis?.professionalAuditResult) as AuditResult | undefined;
  const grandReport = (diagnosis?.professionalFinalReport);
  const expertReport = (diagnosis?.professionalExpertReport);
  const sciReport = diagnosis?.analysis?.sciReport;

  // For professionals, the diagnosis is considered complete if the user's isDiagnosisComplete flag is true OR if the grandReport exists
  const isActuallyComplete = !!userData.user?.isDiagnosisComplete || !!grandReport;
  const canGenerate = !!diagnosis && isActuallyComplete && !!expertNotes.trim();

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 p-6 md:p-8">

      {/* Reset Alert */}
      {userData.user?.resetRequested && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-rose-50 border-2 border-rose-200 rounded-4xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-rose-600 rounded-2xl flex items-center justify-center"><RotateCcw className="text-white w-8 h-8" /></div>
            <div><h3 className="text-xl font-black text-rose-900">Progress Reset Requested</h3><p className="text-rose-700 font-medium">This professional has requested a full journey reset.</p></div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => handleReset("reject")} disabled={isHandlingReset} className="px-6 py-3 bg-white text-slate-600 rounded-xl font-black text-xs uppercase border border-slate-200">Reject</button>
            <button onClick={() => handleReset("approve")} disabled={isHandlingReset} className="px-8 py-3 bg-rose-600 text-white rounded-xl font-black text-xs uppercase flex items-center gap-2">
              {isHandlingReset ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />} Approve Reset
            </button>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors border border-transparent hover:border-slate-200"><ArrowLeft size={20} className="text-slate-600" /></button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center"><ShieldCheck className="text-indigo-600 w-4 h-4" /></div>
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Executive Review Board</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-indigo-900">{userData.user?.fullName}</h1>
            <p className="text-slate-500 font-medium">Strategic maturity, market value & executive certification review.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleSave} disabled={isSavingNotes} className="px-6 py-2.5 bg-indigo-50 text-indigo-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-100 border border-indigo-200 flex items-center gap-2">
            {isSavingNotes ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />} Save Review
          </button>
          <span className="px-4 py-2 bg-indigo-600/10 text-indigo-700 rounded-xl text-xs font-bold uppercase border border-indigo-200">Professional · {userData.user?.plan}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-8">

          {/* Executive Snapshot Banner */}
          <div className="relative bg-slate-950 rounded-4xl p-14 overflow-hidden shadow-2xl border border-indigo-900/30">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.15)_0%,transparent_60%)]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col md:flex-row items-start gap-10 justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/15 border border-indigo-500/30 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  <span className="text-indigo-300 text-[10px] font-black uppercase tracking-[0.4em]">Professional Audit Report</span>
                </div>
                <h2 className="text-4xl font-black text-white tracking-tighter">{userData.user?.fullName}</h2>
                <div className="flex flex-wrap gap-3">
                  {auditResult?.currentRole && <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-300">📌 {auditResult.currentRole}</span>}
                  {auditResult?.sector && <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-300">🏢 {auditResult.sector}</span>}
                  {auditResult?.yearsOfExperience && <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-300">⏱ {auditResult.yearsOfExperience} Years</span>}
                </div>
              </div>
              {auditResult?.careerLevel && (
                <div className="shrink-0 text-right">
                  <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1">Career Level</div>
                  <div className="text-5xl font-black text-white">{auditResult.careerLevel}</div>
                </div>
              )}
            </div>
          </div>

          {/* Audit Grid: Strengths / Gaps / Action Plan */}
          {auditResult && (
            <div className="grid md:grid-cols-3 gap-6">
              {auditResult.strategicAudit && (
                <div className="md:col-span-3 bg-white rounded-4xl border border-slate-100 shadow-xl p-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200"><Brain className="text-white w-6 h-6" /></div>
                    <h3 className="text-xl font-black text-slate-900">Strategic Career Analysis</h3>
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed">{auditResult.strategicAudit}</p>
                </div>
              )}
              {auditResult.keyStrengths && auditResult.keyStrengths.length > 0 && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-4xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center"><CheckCircle className="text-white w-5 h-5" /></div>
                    <h4 className="font-black text-emerald-900 text-sm uppercase tracking-widest">Key Strengths</h4>
                  </div>
                  <div className="space-y-3">
                    {auditResult.keyStrengths.map((s, i) => (
                      <div key={i} className="flex items-start gap-3 text-emerald-800 font-medium text-sm"><div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />{s}</div>
                    ))}
                  </div>
                </div>
              )}
              {auditResult.skillGaps && auditResult.skillGaps.length > 0 && (
                <div className="bg-rose-50 border border-rose-100 rounded-4xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-rose-600 rounded-2xl flex items-center justify-center"><AlertCircle className="text-white w-5 h-5" /></div>
                    <h4 className="font-black text-rose-900 text-sm uppercase tracking-widest">Critical Gaps</h4>
                  </div>
                  <div className="space-y-3">
                    {auditResult.skillGaps.map((g, i) => (
                      <div key={i} className="flex items-start gap-3 text-rose-800 font-medium text-sm"><div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />{g}</div>
                    ))}
                  </div>
                </div>
              )}
              {auditResult.actionPlan && auditResult.actionPlan.length > 0 && (
                <div className="bg-slate-900 rounded-4xl p-8 text-white">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30"><Target className="text-indigo-400 w-5 h-5" /></div>
                    <h4 className="font-black text-indigo-300 text-sm uppercase tracking-widest">Action Plan</h4>
                  </div>
                  <div className="space-y-3">
                    {auditResult.actionPlan.map((a, i) => (
                      <div key={i} className="flex items-start gap-3 text-slate-300 font-medium text-sm">
                        <span className="text-indigo-400 font-black shrink-0">{(i+1).toString().padStart(2,'0')}</span>{a}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Grand Final Report */}
          {grandReport && (
            <div className="space-y-6">
              <div className="flex items-center gap-4"><div className="h-px flex-1 bg-slate-100" /><h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">Grand Final Diagnosis Report</h3><div className="h-px flex-1 bg-slate-100" /></div>
              <div className="bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-4xl p-14 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full -mr-32 -mt-32" />
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 justify-between">
                  <div className="space-y-4">
                    <div className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.4em]">Professional Identity</div>
                    <div className="text-6xl font-black tracking-tight">{grandReport.maturityLevel || '—'}</div>
                    <p className="text-slate-400 font-medium text-sm max-w-xl leading-relaxed italic">&ldquo;{grandReport.profileSummary}&rdquo;</p>
                  </div>
                  {grandReport.authorityVsPotential && (
                    <div className="shrink-0 space-y-4 text-center">
                      <div className="w-32 h-32 rounded-full bg-indigo-500/10 border-4 border-indigo-500/30 flex flex-col items-center justify-center shadow-2xl">
                        <span className="text-4xl font-black text-white">{grandReport.authorityVsPotential.futurePotential}</span>
                        <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Potential</span>
                      </div>
                      <div className="text-[10px] text-indigo-300 font-black uppercase tracking-widest">{grandReport.authorityVsPotential.quadrant}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* SWOT Grid */}
              {grandReport.swot && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { title: "Strengths", items: grandReport.swot.strengths, color: "emerald" },
                    { title: "Weaknesses", items: grandReport.swot.weaknesses, color: "rose" },
                    { title: "Opportunities", items: grandReport.swot.opportunities, color: "blue" },
                    { title: "Threats", items: grandReport.swot.threats, color: "amber" },
                  ].map((s, idx) => (
                    <div key={idx} className={cn("p-6 rounded-3xl border-2 bg-white", s.color === "emerald" ? "border-emerald-100" : s.color === "rose" ? "border-rose-100" : s.color === "blue" ? "border-blue-100" : "border-amber-100")}>
                      <h5 className={cn("text-[10px] font-black uppercase tracking-widest mb-3", s.color === "emerald" ? "text-emerald-600" : s.color === "rose" ? "text-rose-600" : s.color === "blue" ? "text-blue-600" : "text-amber-600")}>{s.title}</h5>
                      <div className="space-y-1.5">
                        {s.items?.slice(0, 3).map((it, i) => (<div key={i} className="text-[10px] font-medium text-slate-600">• {it}</div>))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Strategic Radar */}
              {grandReport.strategicRadar && (
                <div className="bg-white rounded-4xl border border-slate-100 shadow-xl p-10 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center"><Brain className="text-indigo-600 w-5 h-5" /></div>
                    <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest">Strategic Radar</h4>
                  </div>
                  <div className="space-y-5">
                    {Object.entries(grandReport.strategicRadar).map(([key, val]) => (<RadarBar key={key} label={key} value={val as number} />))}
                  </div>
                </div>
              )}

              {/* Final Verdict */}
              {grandReport.finalVerdict && (
                <div className="bg-indigo-600 rounded-4xl p-12 text-white shadow-2xl text-center space-y-6">
                  <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center mx-auto"><ShieldCheck className="text-white w-8 h-8" /></div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-200">Expert Final Verdict</h4>
                  <p className="text-2xl font-bold leading-relaxed opacity-95 max-w-4xl mx-auto italic">&ldquo;{grandReport.finalVerdict}&rdquo;</p>
                </div>
              )}
            </div>
          )}

          {/* Professional Expert Report */}
          {expertReport && (
            <div className="space-y-6">
              <div className="flex items-center gap-4"><div className="h-px flex-1 bg-slate-100" /><h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-600">Confidential Executive Intelligence Brief</h3><div className="h-px flex-1 bg-slate-100" /></div>
              <div className="bg-linear-to-br from-slate-950 to-slate-900 rounded-4xl p-12 text-white shadow-2xl space-y-10 border border-slate-800">
                {expertReport.executiveAuthorityProfile && (
                  <div className="space-y-6">
                    <div className="text-[10px] font-black text-rose-400 uppercase tracking-[0.4em]">Executive Authority Profile</div>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-center">
                        <div className="text-5xl font-black text-white mb-1">{expertReport.executiveAuthorityProfile.authorityScore}</div>
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Authority Score</div>
                        <div className="mt-2 text-xs font-bold text-rose-400">{expertReport.executiveAuthorityProfile.authorityLevel}</div>
                      </div>
                      <div className="md:col-span-2 space-y-4">
                        <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Professional DNA</div>
                          <p className="text-sm font-medium text-slate-200">{expertReport.executiveAuthorityProfile.professionalDNA}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Leadership Style</div>
                            <p className="text-xs font-bold text-indigo-300">{expertReport.executiveAuthorityProfile.leadershipStyleSignature}</p>
                          </div>
                          <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Executive Presence</div>
                            <p className="text-xs font-bold text-emerald-300">{expertReport.executiveAuthorityProfile.executivePresenceRating}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {expertReport.marketAndCareerIntelligence && (
                  <div className="space-y-4">
                    <div className="text-[10px] font-black text-amber-400 uppercase tracking-[0.4em]">Market & Career Intelligence</div>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="bg-emerald-500/10 p-5 rounded-2xl border border-emerald-500/20 text-center">
                        <div className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">Current Value</div>
                        <div className="text-lg font-black text-emerald-300">{expertReport.marketAndCareerIntelligence.currentMarketValue}</div>
                      </div>
                      <div className="bg-indigo-500/10 p-5 rounded-2xl border border-indigo-500/20 text-center">
                        <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Potential Value</div>
                        <div className="text-lg font-black text-indigo-300">{expertReport.marketAndCareerIntelligence.potentialMarketValue}</div>
                      </div>
                      <div className="md:col-span-2 bg-amber-500/10 p-5 rounded-2xl border border-amber-500/20">
                        <div className="text-[9px] font-black text-amber-400 uppercase tracking-widest mb-2">Top Target Roles</div>
                        <div className="flex flex-wrap gap-2">
                          {expertReport.marketAndCareerIntelligence.topTargetRoles?.map((role, i) => (
                            <span key={i} className="text-[10px] font-bold text-amber-200 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">{role}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {expertReport.strategicInterventionPlan && (
                  <div className="space-y-4">
                    <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">Strategic Intervention Roadmap</div>
                    <div className="grid md:grid-cols-3 gap-4">
                      {[
                        { phase: "Phase 1 — Immediate", data: expertReport.strategicInterventionPlan.phase1_Immediate },
                        { phase: "Phase 2 — Short Term", data: expertReport.strategicInterventionPlan.phase2_ShortTerm },
                        { phase: "Phase 3 — Medium Term", data: expertReport.strategicInterventionPlan.phase3_MediumTerm },
                      ].filter(p => p.data).map((p, idx) => (
                        <div key={idx} className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
                          <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest">{p.phase}</div>
                          <div className="text-sm font-black text-white">{p.data?.focus}</div>
                          <div className="text-[10px] text-slate-400 font-bold">{p.data?.timeframe}</div>
                          <div className="space-y-1.5">
                            {p.data?.specificActions?.slice(0, 3).map((a, i) => (
                              <div key={i} className="flex items-center gap-2 text-[10px] text-slate-300"><div className="w-1 h-1 rounded-full bg-blue-500 shrink-0" />{a}</div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {expertReport.advisorIntelligenceNotes && (
                  <div className="space-y-4">
                    <div className="text-[10px] font-black text-rose-400 uppercase tracking-[0.4em]">⚠ Advisor Intelligence Notes (Confidential)</div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-rose-500/10 p-6 rounded-2xl border border-rose-500/20 space-y-2">
                        <div className="text-[9px] font-black text-rose-400 uppercase tracking-widest">Red Flag Warnings</div>
                        {expertReport.advisorIntelligenceNotes.redFlagWarnings?.map((w, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-rose-200"><AlertCircle size={12} className="text-rose-500 mt-0.5 shrink-0" />{w}</div>
                        ))}
                      </div>
                      <div className="bg-amber-500/10 p-6 rounded-2xl border border-amber-500/20 space-y-2">
                        <div className="text-[9px] font-black text-amber-400 uppercase tracking-widest">Negotiation Leverage</div>
                        <p className="text-xs text-amber-200 font-medium leading-relaxed">{expertReport.advisorIntelligenceNotes.negotiationLeverage}</p>
                      </div>
                      <div className="bg-indigo-500/10 p-6 rounded-2xl border border-indigo-500/20 space-y-2">
                        <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Key Unlock Question</div>
                        <p className="text-xs text-indigo-200 italic font-medium">&ldquo;{expertReport.advisorIntelligenceNotes.keyUnlockQuestion}&rdquo;</p>
                      </div>
                    </div>
                  </div>
                )}

                {expertReport.confidentialVerdict && (
                  <div className="bg-rose-600/20 border border-rose-500/30 rounded-3xl p-8 text-center space-y-3">
                    <div className="text-[10px] font-black text-rose-400 uppercase tracking-[0.4em]">🔒 Confidential Verdict</div>
                    <p className="text-white font-bold text-lg leading-relaxed italic max-w-3xl mx-auto">&ldquo;{expertReport.confidentialVerdict}&rdquo;</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Executive Command Center */}
          <div className="bg-slate-900 rounded-4xl p-10 text-white shadow-2xl relative overflow-hidden border border-slate-800">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px]" />
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-600/20 rounded-2xl flex items-center justify-center border border-indigo-500/20"><ShieldCheck className="text-indigo-400 w-7 h-7" /></div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight">Executive Command Center</h2>
                  <p className="text-indigo-400/60 text-xs font-bold uppercase tracking-widest">Confidential Case Review</p>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Candidate Benchmark</p>
                  <h4 className="text-xl font-bold flex items-center gap-2">
                    {userData.interviewResult?.evaluation?.seniorityLevel || auditResult?.careerLevel || "Pending Analysis"}
                    <div className={cn("w-2 h-2 rounded-full animate-pulse", (userData.interviewResult || auditResult) ? "bg-emerald-500" : "bg-blue-500")} />
                  </h4>
                  <p className="text-xs text-slate-400 mt-2 font-medium">{(userData.interviewResult || auditResult) ? "Verified professional level." : "Awaiting diagnostic completion."}</p>
                </div>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Strategic Fit</p>
                  <h4 className="text-xl font-bold truncate">{userData.user?.selectedRole || "General Interest"}</h4>
                  <p className="text-xs text-slate-400 mt-2 font-medium">Current role path selected by the professional.</p>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="p-8 border rounded-4xl text-sm leading-relaxed font-medium italic bg-indigo-500/10 border-indigo-500/10 text-indigo-200">
                {userData.interviewResult?.evaluation?.expertCaseSummary || auditResult?.strategicAudit || "Executive synthesis unavailable. Awaiting diagnostic completion."}
              </div>

              {/* Expert Notes */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Confidential Expert Verdict</label>
                  <button onClick={handleSave} disabled={isSavingNotes} className="text-[10px] font-black text-indigo-500 uppercase hover:underline disabled:opacity-50">
                    {isSavingNotes ? "Saving..." : "Quick Save"}
                  </button>
                </div>
                <textarea value={expertNotes} onChange={(e) => setExpertNotes(e.target.value)}
                  placeholder="Record final professional verdict for the executive roadmap and certification..."
                  className="w-full h-40 p-6 bg-white/5 border border-white/10 rounded-3xl text-sm focus:ring-2 focus:ring-indigo-500/30 outline-none resize-none font-medium text-slate-100 placeholder:text-slate-600 transition-all" />
              </div>

              {/* Generation Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Strategic Capability Assessment", icon: <ShieldCheck size={18} className={userData.user?.canAccessCertificates ? "text-emerald-600" : "text-blue-600"} />, action: () => handleGenerate("assessment"), isActive: !!userData.user?.canAccessCertificates },
                  { label: "Recommendation Letter", icon: <Sparkles size={18} className={userData.user?.canAccessRecommendations ? "text-emerald-600" : "text-indigo-600"} />, action: () => handleGenerate("recommendation"), isActive: !!userData.user?.canAccessRecommendations },
                  { label: "Executive Scorecard", icon: <Target size={18} className={userData.user?.canAccessScorecard ? "text-emerald-600" : "text-amber-600"} />, action: () => handleGenerate("scorecard"), isActive: !!userData.user?.canAccessScorecard },
                  { label: "Strategic Intelligence (SCI)", icon: sciReport ? <CheckCircle size={18} className="text-white" /> : <Brain size={18} className="text-white" />, action: handleGenerateSCI, isActive: false, dark: true, generated: !!sciReport },
                ].map((btn, i) => (
                  <button key={i} onClick={btn.action} disabled={!canGenerate || isGenerating || isGeneratingSCI}
                    className={cn("py-6 px-4 rounded-3xl font-black text-[9px] uppercase tracking-widest shadow-xl active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-3 disabled:opacity-30 border",
                      btn.dark
                        ? btn.generated ? "bg-emerald-600 text-white border-transparent" : "bg-indigo-600 text-white border-transparent hover:bg-indigo-500"
                        : btn.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-white text-slate-900 border-slate-100 hover:bg-slate-50"
                    )}>
                    {(isGenerating || isGeneratingSCI) ? <Loader2 size={16} className="animate-spin text-indigo-400" /> : btn.icon}
                    <span className="text-center">{btn.label}</span>
                  </button>
                ))}
              </div>

              {/* Expert Report Generation */}
              <div className="border-t border-white/10 pt-6">
                <button onClick={handleExpertReport} disabled={isGeneratingExpertReport || !expertNotes.trim()}
                  className="w-full py-5 bg-linear-to-r from-rose-600 to-indigo-700 text-white rounded-3xl font-black text-sm uppercase tracking-widest hover:opacity-90 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-40">
                  {isGeneratingExpertReport ? <Loader2 size={18} className="animate-spin" /> : <Star size={18} />}
                  Generate Professional Executive Intelligence Brief
                </button>
                <p className="text-[9px] text-slate-500 text-center mt-2 uppercase tracking-widest">
                  {diagnosis?.professionalExpertReportGeneratedAt
                    ? `Last generated: ${new Date(diagnosis.professionalExpertReportGeneratedAt).toLocaleDateString()}`
                    : "Not yet generated"}
                </p>
              </div>
            </div>
          </div>

          {/* Marketing Assets */}
          {(diagnosis?.marketingAssets?.cv || diagnosis?.negotiationHistory?.length) && (
            <div className="bg-white rounded-4xl p-10 border border-slate-100 shadow-xl space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100"><Target className="text-amber-600 w-6 h-6" /></div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Market Infiltration Audit</h3>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Self-Marketing Studio Results</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Executive Assets</h4>
                  <div className="space-y-3">
                    {diagnosis?.marketingAssets?.cv && (
                      <div className="p-5 border border-slate-100 rounded-3xl bg-slate-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-3"><FileText className="text-blue-500" size={20} /><span className="text-sm font-bold text-slate-700">Optimized Executive CV</span></div>
                        <span className="text-[10px] font-black text-blue-600 uppercase">Generated ✓</span>
                      </div>
                    )}
                    {diagnosis?.marketingAssets?.report && (
                      <div className="p-5 border border-slate-100 rounded-3xl bg-slate-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-3"><Eye className="text-rose-500" size={20} /><span className="text-sm font-bold text-slate-700">Strategic Positioning Thesis</span></div>
                        <span className="text-[10px] font-black text-blue-600 uppercase">Generated ✓</span>
                      </div>
                    )}
                  </div>
                </div>
                {diagnosis?.negotiationHistory && diagnosis.negotiationHistory.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Negotiation Psychology</h4>
                    <div className="p-6 bg-slate-900 rounded-3xl text-white space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Headhunter Simulation</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed italic border-l-2 border-indigo-500 pl-3">
                        &quot;{diagnosis.negotiationHistory[diagnosis.negotiationHistory.length - 1].content.substring(0, 150)}...&quot;
                      </p>
                      <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-500">
                        <span>Total Turns: {diagnosis.negotiationHistory.length}</span>
                        <span>Session: Active</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-8">

          {/* Identity Card */}
          <div className="bg-white rounded-4xl p-8 border border-slate-100 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-indigo-50 to-transparent -mr-16 -mt-16 rounded-full" />
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-linear-to-br from-indigo-100 to-violet-200 rounded-[2.5rem] flex items-center justify-center text-4xl font-black text-indigo-700 shadow-xl border-4 border-white mb-6">
                {userData.user?.fullName?.charAt(0) || "P"}
              </div>
              <h3 className="text-2xl font-black text-slate-900 leading-tight mb-2">{userData.user?.fullName}</h3>
              <p className="text-sm text-slate-500 font-medium mb-1">{userData.user?.email}</p>
              {userData.user?.whatsapp && <p className="text-xs text-slate-400 font-mono mb-4">{userData.user.whatsapp}</p>}
              {userData.user?.memberId && (
                <div className="px-4 py-1.5 bg-slate-900 text-white text-[10px] rounded-xl font-black tracking-widest mb-4">{userData.user.memberId}</div>
              )}
              <div className="px-4 py-1.5 bg-indigo-50 text-indigo-700 text-[10px] rounded-full font-black uppercase tracking-widest border border-indigo-100 mb-8">{userData.user?.role}</div>
              <div className="w-full grid grid-cols-2 gap-3">
                {[
                  { label: "Plan", value: userData.user?.plan, color: "indigo" },
                  { label: "Status", value: userData.user?.status, color: userData.user?.status === "Active" ? "emerald" : "amber" },
                  { label: "Diagnostic", value: userData.user?.isDiagnosisComplete ? "Complete" : "Pending", color: userData.user?.isDiagnosisComplete ? "emerald" : "rose" },
                  { label: "Simulations", value: String(userData.simulations?.length || 0), color: "blue" },
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                    <p className={cn("text-xs font-bold", `text-${item.color}-600`)}>{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-slate-100 flex flex-col gap-3 w-full">
                <button onClick={handleResetDiagnosisOnly} disabled={isResettingDiagnosisOnly}
                  className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-amber-500 text-white hover:bg-amber-600 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-amber-200 active:scale-95">
                  {isResettingDiagnosisOnly ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />} 🔄 Reset Diagnosis Only
                </button>
                <p className="text-[9px] text-center text-amber-600 font-bold uppercase tracking-widest -mt-1">Keeps credentials ✔️</p>
                <button onClick={() => { if (window.confirm(`Full reset ALL data for ${userData.user?.fullName}?`)) handleReset("approve"); }}
                  disabled={isHandlingReset}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-rose-600 text-white hover:bg-rose-700 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-rose-200 active:scale-95">
                  {isHandlingReset ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />} 🗑️ Full Reset
                </button>
                <p className="text-[9px] text-center text-rose-500 font-bold uppercase tracking-widest -mt-1">Deletes ALL data ⚠️</p>
              </div>
            </div>
          </div>

          {/* Credentials Access */}
          <div className="bg-white rounded-4xl p-8 border border-slate-100 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center"><Award className="text-indigo-600 w-5 h-5" /></div>
              <h4 className="font-black text-slate-900">Credentials Access</h4>
            </div>
            <div className="space-y-3">
              {[
                { label: "Performance Profile", value: userData.user?.canAccessCertificates },
                { label: "Recommendation Letter", value: userData.user?.canAccessRecommendations },
                { label: "Executive Scorecard", value: userData.user?.canAccessScorecard },
                { label: "Strategic Intelligence (SCI)", value: userData.user?.canAccessSCI },
              ].map((item, i) => (
                <div key={i} className={cn("flex items-center justify-between p-3 rounded-2xl border", item.value ? "bg-indigo-50 border-indigo-100" : "bg-slate-50 border-slate-100")}>
                  <span className="text-xs font-bold text-slate-700">{item.label}</span>
                  <div className={cn("w-2.5 h-2.5 rounded-full", item.value ? "bg-indigo-500" : "bg-slate-300")} />
                </div>
              ))}
            </div>
          </div>

          {/* SCI Badge */}
          {sciReport && (
            <div className="bg-indigo-50 p-8 rounded-4xl border border-indigo-100 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20"><TrendingUp size={28} className="text-white" /></div>
                <div>
                  <h4 className="font-black text-indigo-900 tracking-tight text-lg leading-tight">SCI Report Published</h4>
                  <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.2em] mt-1">Strategic Intelligence Active</p>
                </div>
              </div>
            </div>
          )}

          {/* Certification Badge */}
          {userData.profile && (
            <div className="bg-slate-900 p-8 rounded-4xl shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30"><ShieldCheck size={28} className="text-indigo-400" /></div>
                <div>
                  <h4 className="font-black text-white tracking-tight text-lg leading-tight">Certification Locked</h4>
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] mt-1">REF: {userData.profile.referenceId?.substring(0, 8) || "ADM-XX"}</p>
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
              placeholder="Write a message to the professional..."
              className="w-full h-24 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none resize-none font-medium text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/10" />
            <button onClick={handleNotification} disabled={isSendingNotification || !notificationMsg.trim()}
              className="w-full py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-40">
              {isSendingNotification ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />} Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
