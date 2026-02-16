"use client";

import { useState, useEffect } from "react";
import {
    CheckCircle, Brain,
    MessageSquare, ArrowLeft, Loader2,
    Sparkles, ShieldCheck, AlertCircle, ChevronRight, Target, RotateCcw
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

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
            const res = await fetch(`/api/admin/users/${userId}/update-expert-notes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ expertNotes })
            });
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

    const handleGenerateType = async (type: 'assessment' | 'recommendation' | 'scorecard') => {
        setIsGenerating(true);
        try {
            const res = await fetch(`/api/admin/users/${userId}/generate-profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    expertNotes,
                    language: 'fr',
                    type
                })
            });
            const data = await res.json();

            if (data.success) {
                const labels = {
                    assessment: "Strategic Capability Assessment",
                    recommendation: "Recommendation Letter",
                    scorecard: "Executive Scorecard"
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
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    expertNotes,
                    language: 'fr'
                })
            });
            const data = await res.json();

            if (data.success) {
                alert("Strategic Career Intelligence (SCI) Report published! The student can now access the full report in their Strategic Intelligence section.");
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
    const handleResetAction = async (action: 'approve' | 'reject') => {
        if (action === 'approve' && !window.confirm("CRITICAL ACTION: This will PERMANENTLY delete all diagnostic and simulation data for this user. Are you absolutely sure?")) {
            return;
        }

        setIsHandlingReset(true);
        try {
            const res = await fetch(`/api/admin/users/${userId}/handle-reset`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action })
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

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                <p className="text-slate-500 font-medium">Loading Candidate Profile...</p>
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
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Data Unavailable</h2>
                    <p className="text-slate-500 mb-6">{error}</p>
                    <p className="text-xs text-slate-400 font-mono bg-slate-100 p-2 rounded mb-6">User ID: {userId}</p>
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


    // Helper to normalize diagnosis data from either collection or user profile
    const diagnosis: DiagnosisInterface | null = userData.diagnosis || (userData.user?.diagnosisData ? ({
        analysis: {
            overview: userData.user.diagnosisData.report?.overview || "",
            strengths: userData.user.diagnosisData.report?.keyStrengths || [],
            weaknesses: userData.user.diagnosisData.report?.areasToImprove || [],
            skills: userData.user.diagnosisData.report?.skills || { technical: [], soft: [], gaps: [] },
            experience: userData.user.diagnosisData.report?.experience || {},
            education: userData.user.diagnosisData.report?.education || {},
            immediateActions: userData.user.diagnosisData.report?.nextSteps || [],
            sciReport: (userData.user.diagnosisData.report?.sciReport as Record<string, unknown>) || undefined
        },
        report: userData.user.diagnosisData.report,
        simulationResults: userData.user.diagnosisData.simulationResults || []
    } as DiagnosisInterface) : null);

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
                            <h3 className="text-xl font-black text-rose-900 tracking-tight">Progress Reset Requested</h3>
                            <p className="text-rose-700 font-medium max-w-md">This participant has requested to archive their current progress and restart the journey from the beginning.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => handleResetAction('reject')}
                            disabled={isHandlingReset}
                            className="px-6 py-3 bg-white text-slate-600 rounded-xl font-black text-xs uppercase tracking-widest border border-slate-200 hover:bg-slate-50 transition-all"
                        >
                            Reject Request
                        </button>
                        <button
                            onClick={() => handleResetAction('approve')}
                            disabled={isHandlingReset}
                            className="px-8 py-3 bg-rose-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all flex items-center gap-2"
                        >
                            {isHandlingReset ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
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
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Executive Review Board</h1>
                        <p className="text-slate-500 font-medium">Validate simulation performance and authorize certification.</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleSaveExpertNotes}
                        disabled={isSavingNotes}
                        className="px-6 py-2.5 bg-slate-100 text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-200 flex items-center gap-2"
                    >
                        {isSavingNotes ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
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
                                        <h2 className="text-2xl font-black tracking-tight">Expert Command Center</h2>
                                        <p className="text-blue-400/60 text-xs font-bold uppercase tracking-widest">Confidential Case Review</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <span className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest">ID: {userId.substring(0, 8)}</span>
                                </div>
                            </div>

                            {/* Dossier Info Grid */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Candidate Benchmark</p>
                                    <h4 className="text-xl font-bold flex items-center gap-2">
                                        {userData.interviewResult?.evaluation?.seniorityLevel || "Pending Analysis"}
                                        <div className={`w-2 h-2 rounded-full animate-pulse ${userData.interviewResult ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                                    </h4>
                                    <p className="text-xs text-slate-400 mt-2 font-medium">
                                        {userData.interviewResult ? "Verified seniority level based on technical verification rounds." : "Waiting for candidate to complete diagnostic process."}
                                    </p>
                                </div>
                                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Strategic Fit</p>
                                    <h4 className="text-xl font-bold truncate">{userData.user?.selectedRole || "General Interest"}</h4>
                                    <p className="text-xs text-slate-400 mt-2 font-medium">Current role path selected by the participant.</p>
                                </div>
                            </div>

                            {/* Executive Summary Area */}
                            <div>
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Brain size={14} className="text-indigo-400" />
                                    AI-Driven Case Synthesis
                                </h4>
                                <div className="p-8 bg-linear-to-br from-indigo-500/10 to-blue-500/10 border border-white/5 rounded-4xl text-sm leading-relaxed text-slate-300 font-medium italic">
                                    {userData.interviewResult?.evaluation?.expertCaseSummary || userData.interviewResult?.evaluation?.executiveSummary || "Case synthesis unavailable. Awaiting diagnostic completion and expert synchronization."}
                                </div>
                            </div>

                            {/* Validation Actions */}
                            <div className="pt-4 space-y-6">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest block">Confidential Expert Verdict</label>
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
                                        onClick={() => handleGenerateType('assessment')}
                                        disabled={isGenerating || !diagnosis || !userData.user?.isDiagnosisComplete || !expertNotes.trim()}
                                        className={`py-6 px-4 rounded-3xl font-black text-[9px] uppercase tracking-widest shadow-xl active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-3 disabled:opacity-30 border ${
                                            userData.user?.canAccessCertificates 
                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                                            : "bg-white text-slate-900 border-slate-100 hover:bg-slate-50"
                                        }`}
                                    >
                                        {isGenerating ? <Loader2 size={16} className="animate-spin text-blue-600" /> : <ShieldCheck size={18} className={userData.user?.canAccessCertificates ? "text-emerald-600" : "text-blue-600"} />}
                                        <span className="text-center">Strategic Capability Assessment</span>
                                    </button>

                                    <button
                                        onClick={() => handleGenerateType('recommendation')}
                                        disabled={isGenerating || !diagnosis || !userData.user?.isDiagnosisComplete || !expertNotes.trim()}
                                        className={`py-6 px-4 rounded-3xl font-black text-[9px] uppercase tracking-widest shadow-xl active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-3 disabled:opacity-30 border ${
                                            userData.user?.canAccessRecommendations 
                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                                            : "bg-white text-slate-900 border-slate-100 hover:bg-slate-50"
                                        }`}
                                    >
                                        {isGenerating ? <Loader2 size={16} className="animate-spin text-blue-600" /> : <Sparkles size={18} className={userData.user?.canAccessRecommendations ? "text-emerald-600" : "text-indigo-600"} />}
                                        <span className="text-center">Recommendation Letter</span>
                                    </button>

                                    <button
                                        onClick={() => handleGenerateType('scorecard')}
                                        disabled={isGenerating || !diagnosis || !userData.user?.isDiagnosisComplete || !expertNotes.trim()}
                                        className={`py-6 px-4 rounded-3xl font-black text-[9px] uppercase tracking-widest shadow-xl active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-3 disabled:opacity-30 border ${
                                            userData.user?.canAccessScorecard 
                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                                            : "bg-white text-slate-900 border-slate-100 hover:bg-slate-50"
                                        }`}
                                    >
                                        {isGenerating ? <Loader2 size={16} className="animate-spin text-blue-600" /> : <Target size={18} className={userData.user?.canAccessScorecard ? "text-emerald-600" : "text-amber-600"} />}
                                        <span className="text-center">Executive Scorecard</span>
                                    </button>

                                    <button
                                        onClick={handleGenerateSCI}
                                        disabled={isGeneratingSCI || !diagnosis || !userData.user?.isDiagnosisComplete || !expertNotes.trim()}
                                        className={`py-6 px-4 rounded-3xl font-black text-[9px] uppercase tracking-widest shadow-xl active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-3 disabled:opacity-30 border ${
                                            diagnosis?.analysis?.sciReport 
                                            ? "bg-emerald-600 text-white border-transparent" 
                                            : "bg-indigo-600 text-white border-transparent hover:bg-indigo-500"
                                        }`}
                                    >
                                        {isGeneratingSCI ? <Loader2 size={16} className="animate-spin" /> : <Brain size={18} />}
                                        <span className="text-center text-white">Strategic Intelligence (SCI)</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Simulation Deep-Dive Integration */}
                    <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm">
                                    <Target className="text-blue-600 w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Mission Operations</h3>
                            </div>
                            <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Live Simulation Record
                            </div>
                        </div>

                        {(!userData.simulations || userData.simulations.length === 0) ? (
                            <div className="py-16 text-center bg-slate-50/50 rounded-4xl border-2 border-dashed border-slate-100">
                                <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">No active simulation data points</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-6">
                                {userData.simulations.map((sim: Simulation, i: number) => (
                                    <div key={i} className="group p-6 bg-white rounded-3xl border border-slate-100 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-200/40 transition-all duration-500">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-black border border-blue-100">{i+1}</div>
                                                <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{sim.title}</h4>
                                            </div>
                                            <span className={`text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-wider shadow-sm ${sim.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                                                {sim.status}
                                            </span>
                                        </div>
                                        <div className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-2 italic opacity-80 group-hover:opacity-100">
                                            &quot;{sim.currentDraft || "No qualitative data submitted yet for this phase."}&quot;
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
                            <h3 className="text-2xl font-black text-slate-900 leading-tight mb-2">{userData.user?.fullName}</h3>
                            <p className="text-sm text-slate-500 font-medium mb-4">{userData.user?.email}</p>
                            <div className="px-4 py-1.5 bg-blue-50 text-blue-700 text-[10px] rounded-full font-black uppercase tracking-widest border border-blue-100 mb-8 mt-2">
                                {userData.user?.role || "Global Participant"}
                            </div>

                            <div className="w-full grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Loyalty</p>
                                    <p className="text-xs font-bold text-slate-800">{new Date(userData.user?.createdAt).getFullYear()}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100 flex items-center">
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                        <p className="text-sm font-bold text-slate-900">{userData.user?.status || "Active"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions for Admin */}
                            <div className="pt-6 border-t border-slate-100 flex flex-col gap-3 w-full">
                                {(userData?.user?.plan === "Pro Essential") && !userData?.user?.resetRequested && (
                                    <button
                                        onClick={() => handleResetAction('approve')}
                                        disabled={isHandlingReset}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 text-slate-600 hover:bg-rose-50 hover:text-rose-600 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border border-slate-200 hover:border-rose-200 shadow-sm"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        Force Progress Reset
                                    </button>
                                )}
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
                            <h4 className="font-black text-slate-900 tracking-tight">Live Assessment</h4>
                        </div>

                        <div className="space-y-6">
                            <div className="p-5 bg-linear-to-br from-indigo-50 to-blue-50 rounded-3xl border border-blue-100 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Brain size={48} className="text-indigo-900" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex justify-between items-end mb-3">
                                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Global Rank</p>
                                        <span className="text-3xl font-black text-indigo-900">{diagnosis?.report?.rank || "—"}</span>
                                    </div>
                                    <div className="w-full h-2 bg-indigo-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: diagnosis?.report?.rank ? '85%' : '0%' }} />
                                    </div>
                                    <p className="text-[9px] font-bold text-indigo-500 mt-3 uppercase">
                                        {diagnosis?.report ? `Readiness: ${diagnosis.report.readinessLevel}%` : "Diagnostic Incomplete"}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <span className="text-xs font-bold text-slate-600">Technical Score</span>
                                    <span className="text-sm font-black text-slate-900">{diagnosis?.report?.overallScore !== undefined ? `${diagnosis.report.overallScore}/10` : "—"}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <span className="text-xs font-bold text-slate-600">Behavioral Fit</span>
                                    <span className={`text-sm font-black ${diagnosis ? 'text-blue-600' : 'text-slate-400'}`}>
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
                                    <h4 className="font-black text-emerald-900 tracking-tight text-lg leading-tight text-nowrap">Certification Locked</h4>
                                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em] mt-1">REF: {userData.profile.referenceId?.substring(0, 8) || "ADM-XX"}</p>
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
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Expert Career Development Strategy</h2>
                            <p className="text-slate-500 font-medium">Internal roadmap and training architecture for our experts.</p>
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
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Phase 1: Immediate Skill Integration</h4>
                                    <div className="flex flex-wrap gap-3">
                                        {(userData.interviewResult?.evaluation?.skillDevelopmentPriorities || diagnosis?.analysis?.immediateActions)?.map((skill, i) => (
                                            <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm text-sm font-bold text-slate-700">
                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                                {skill}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100">
                                        <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-4">Internal Expert Context</h4>
                                        <p className="text-sm italic text-amber-900 leading-relaxed font-medium">
                                            {diagnosis ? (
                                                `Candidate shows high potential in ${userData.user?.selectedRole || 'their domain'}, but needs to bridge the gap between theoretical knowledge and operational execution found in simulations.`
                                            ) : (
                                                "Contextual analysis pending completion of diagnostic assessment modules."
                                            )}
                                        </p>
                                    </div>
                                    <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                                        <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">Market Potential</h4>
                                        <div className="space-y-2">
                                            {userData.interviewResult?.evaluation?.suggestedRoles?.slice(0, 3).map((role, i) => (
                                                <div key={i} className="text-xs font-bold text-blue-800 flex items-center gap-2">
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
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recommended Workshops</p>
                                    <div className="space-y-3">
                                        {(userData.interviewResult?.evaluation?.expertAdvice?.suggestedWorkshops || diagnosis?.analysis?.expertAdvice?.suggestedWorkshops || (diagnosis ? [
                                            "Advanced Case Resolution Simulation",
                                            "Stakeholder Management in High-Stakes Environments",
                                            "Technical Gap-Bridge Masterclass"
                                        ] : [])).map((workshop, i) => (
                                            <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
                                                <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center text-amber-400 font-bold text-xs">{i+1}</div>
                                                <span className="text-sm font-medium">{workshop}</span>
                                            </div>
                                        ))}
                                        {!diagnosis && (
                                            <p className="text-xs text-slate-500 italic">Awaiting diagnostic results to generate workshop roadmap...</p>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Training Modules</p>
                                    <div className="space-y-3">
                                        {(userData.interviewResult?.evaluation?.expertAdvice?.suggestedTrainings || diagnosis?.analysis?.expertAdvice?.suggestedTrainings || (diagnosis ? [
                                            "Senior-Level Strategic Alignment",
                                            "Operational Excellence Frameworks",
                                            "Leadership & Crisis Communication"
                                        ] : [])).map((module, i) => (
                                            <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
                                                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 font-bold text-xs">{String.fromCharCode(65+i)}</div>
                                                <span className="text-sm font-medium">{module}</span>
                                            </div>
                                        ))}
                                        {!diagnosis && (
                                            <p className="text-xs text-slate-500 italic">Awaiting diagnostic results to define training architecture...</p>
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
                                    <span className="text-xs font-bold text-indigo-700">Evolution Rating</span>
                                    <span className="text-xl font-black text-indigo-800">{diagnosis ? "+12%" : "—"}</span>
                                </div>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                                    {diagnosis ? (
                                        `Analysis dynamically updates based on the latest simulation outcomes and diagnostic retakes. Currently showing optimal path for ${userData.user?.selectedRole || 'selected role'}.`
                                    ) : (
                                        "Evolution tracking will begin once the first diagnostic assessment is completed."
                                    )}
                                </p>
                                <div className="pt-4 border-t border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Last Diagnostic Analysis</p>
                                    <p className="text-xs font-bold text-slate-700">
                                        {diagnosis?.report ? `${new Date().toLocaleDateString()} - Active Baseline` : "Not yet analyzed"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-emerald-900 p-8 rounded-4xl text-white shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl" />
                            <h3 className="font-black text-lg mb-4">Expert Verdict Summary</h3>
                            <p className="text-sm text-emerald-100 leading-relaxed font-medium">
                                {userData.interviewResult?.evaluation?.expertCaseSummary ? 
                                    userData.interviewResult.evaluation.expertCaseSummary.substring(0, 200) + "..." : 
                                    "Provide the final expert notes and roadmap to unlock certification."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed AI Audit Report Section */}
            {diagnosis && (
                <div className="space-y-8 mt-12 pt-12 border-t border-slate-200">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <Brain className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Comprehensive AI Audit Report</h2>
                            <p className="text-slate-500 font-medium">In-depth behavioral and technical validation data.</p>
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
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Technical Proficiency</p>
                                    <div className="flex flex-wrap gap-2">
                                        {diagnosis.analysis?.skills?.technical?.map((s: string, i: number) => (
                                            <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-[10px] rounded-lg font-bold border border-blue-100">{s}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Soft Skills & Leadership</p>
                                    <div className="flex flex-wrap gap-2">
                                        {diagnosis.analysis?.skills?.soft?.map((s: string, i: number) => (
                                            <span key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-[10px] rounded-lg font-bold border border-indigo-100">{s}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 pt-8 border-t border-slate-100">
                                <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-4">Urgent Capability Gaps</p>
                                <div className="flex flex-wrap gap-2">
                                    {diagnosis.analysis?.skills?.gaps?.map((s: string, i: number) => (
                                        <span key={i} className="px-3 py-1.5 bg-orange-50 text-orange-700 text-[10px] rounded-lg font-bold border border-orange-100">{s}</span>
                                    ))}
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
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Experience Progression</p>
                                    <p className="text-sm font-bold text-slate-700">{diagnosis.analysis?.experience?.progression || "N/A"}</p>
                                    <p className="text-xs text-slate-500 mt-1">Quality Score: <span className="text-blue-600 font-bold">{diagnosis.analysis?.experience?.quality || "Standard"}</span></p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Academic Validation</p>
                                    <p className="text-sm font-bold text-slate-700">{diagnosis.analysis?.education?.level || "N/A"} - {diagnosis.analysis?.education?.relevance || ""}</p>
                                    <p className="text-xs text-slate-500 mt-1 italic">&quot;{diagnosis.analysis?.education?.notes || ""}&quot;</p>
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

                        {diagnosis.simulationResults && diagnosis.simulationResults.length > 0 ? (
                            <div className="space-y-6 relative z-10">
                                {diagnosis.simulationResults.map((result: SimulationAuditResult, i: number) => (
                                    <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-400 font-black">
                                                    0{result.scenarioNumber || i + 1}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-lg">{result.title}</h4>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scenario Audit</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-600/20">
                                                <span className="text-xs font-black uppercase tracking-widest">Score:</span>
                                                <span className="text-xl font-black">{result.aiEvaluation?.score}/10</span>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-white/10">
                                            <div className="space-y-4">
                                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Demonstrated Strengths</p>
                                                <div className="space-y-2">
                                                    {result.aiEvaluation?.strengths?.map((s: string, idx: number) => (
                                                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                                                            <CheckCircle size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                                                            <span>{s}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Improvement Points</p>
                                                <div className="space-y-2">
                                                    {result.aiEvaluation?.improvements?.map((s: string, idx: number) => (
                                                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                                                            <AlertCircle size={14} className="text-orange-500 mt-0.5 shrink-0" />
                                                            <span>{s}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center bg-white/5 rounded-3xl border border-white/5 border-dashed relative z-10">
                                <p className="text-slate-500 font-medium">In-depth simulation results not yet generated.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
}
