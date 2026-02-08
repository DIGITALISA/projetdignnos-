"use client";

import { useState, useEffect } from "react";
import {
    User, FileText, CheckCircle, Brain,
    MessageSquare, Award, ArrowLeft, Loader2,
    Sparkles, ShieldCheck, AlertCircle, X, ChevronRight, Target
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function UserProfileReview() {
    const params = useParams();
    const router = useRouter();
    const userId = params.userId as string;

    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [expertNotes, setExpertNotes] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [showDiagModal, setShowDiagModal] = useState(false);

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
            } catch (error: any) {
                console.error("Failed to load user data", error);
                setError(error.message || "Network error occurred.");
            } finally {
                setIsLoading(false);
            }
        };

        if (userId) fetchData();
    }, [userId]);

    const handleGenerateProfile = async () => {
        setIsGenerating(true);
        try {
            const res = await fetch(`/api/admin/users/${userId}/generate-profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    expertNotes,
                    language: 'fr'
                })
            });
            const data = await res.json();

            if (data.success) {
                alert("Executive Profile Generated Successfully! The user can now see their recommendation letter.");
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

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20 p-6 md:p-8">
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
                    <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold uppercase tracking-wider border border-blue-100">
                        {userData.user?.role || "Member"}
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Identity & Status */}
                <div className="space-y-6">
                    {/* User Profile Card */}
                    <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-xl shadow-slate-200/50">
                        <div className="flex items-center gap-5 mb-8">
                            <div className="w-20 h-20 bg-linear-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center text-3xl font-black text-slate-400 shadow-inner">
                                {userData.user?.fullName?.charAt(0) || "U"}
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 leading-tight">{userData.user?.fullName}</h3>
                                <p className="text-sm text-slate-500 font-medium">{userData.user?.email}</p>
                                <div className="mt-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Joined: {new Date(userData.user?.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div
                                onClick={() => userData.diagnosis && setShowDiagModal(true)}
                                className={cn(
                                    "flex items-center justify-between p-4 bg-slate-50 rounded-2xl transition-all",
                                    userData.diagnosis ? "cursor-pointer hover:bg-blue-50 hover:border-blue-200 border border-transparent" : "opacity-60"
                                )}
                            >
                                <span className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                    <FileText size={18} className="text-blue-500" />
                                    Diagnosis
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className={userData.diagnosis ? "text-green-600 font-black text-xs uppercase tracking-wider" : "text-slate-400 font-black text-xs uppercase tracking-wider"}>
                                        {userData.diagnosis ? "Completed" : "Pending"}
                                    </span>
                                    {userData.diagnosis && <ChevronRight size={14} className="text-slate-400" />}
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                <span className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                    <Target size={18} className="text-red-500" />
                                    Chosen Role
                                </span>
                                <span className="text-slate-900 font-bold text-sm text-right max-w-[120px] truncate">
                                    {userData.user?.selectedRole || "Not Chosen"}
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                <span className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                    <Sparkles size={18} className="text-indigo-500" />
                                    AI Status
                                </span>
                                <span className={userData.interviewResult ? "text-blue-600 font-bold text-xs" : "text-slate-400 font-bold text-xs"}>
                                    {userData.interviewResult ? "EVALUATED" : "IN PROGRESS"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Quick AI Behavioral Summary */}
                    {userData.diagnosis && (
                        <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-lg shadow-slate-200/50">
                            <h3 className="font-black text-slate-900 mb-6 flex items-center gap-3 text-lg">
                                <Sparkles size={20} className="text-purple-600" />
                                AI Behavioral Analysis
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Core Strengths</p>
                                    <div className="flex flex-wrap gap-2">
                                        {(userData.interviewResult?.evaluation?.cvVsReality?.confirmedStrengths || userData.diagnosis.analysis?.strengths)?.slice(0, 3).map((s: string, i: number) => (
                                            <span key={i} className="px-3 py-1.5 bg-green-50 text-green-700 text-[10px] rounded-lg font-bold border border-green-100">{s}</span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Critical Gaps</p>
                                    <div className="flex flex-wrap gap-2">
                                        {(userData.interviewResult?.evaluation?.cvVsReality?.exaggerations || userData.diagnosis.analysis?.weaknesses)?.slice(0, 3).map((s: string, i: number) => (
                                            <span key={i} className="px-3 py-1.5 bg-red-50 text-red-700 text-[10px] rounded-lg font-bold border border-red-100">{s}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Middle Column: Expert Case & Performance */}
                <div className="space-y-6">
                    {/* Executive Case Dossier */}
                    {userData.interviewResult && (
                        <div className="bg-slate-900 p-8 rounded-4xl text-white shadow-2xl relative overflow-hidden border border-slate-800">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl" />
                            <h3 className="font-black text-xl mb-6 flex items-center gap-3 tracking-tight">
                                <ShieldCheck size={24} className="text-blue-400" />
                                Executive Case Dossier
                            </h3>

                            <div className="space-y-6 relative z-10">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Candidate Level</p>
                                        <p className="text-lg font-bold">{userData.interviewResult.evaluation?.seniorityLevel || "N/A"}</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <p className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-1">Target Role</p>
                                        <p className="text-lg font-bold truncate" title={userData.user?.selectedRole}>
                                            {userData.user?.selectedRole || "None"}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Expert Case Summary (Human Focused)</p>
                                    <div className="p-6 bg-white/5 border border-white/10 rounded-3xl text-sm leading-relaxed text-slate-300 font-medium italic">
                                        {userData.interviewResult.evaluation?.expertCaseSummary || userData.interviewResult.evaluation?.executiveSummary || userData.interviewResult.evaluation?.summary}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Market-Fit Suggestions</p>
                                    <div className="flex flex-wrap gap-2">
                                        {userData.interviewResult.evaluation?.suggestedRoles?.map((role: string, i: number) => (
                                            <span key={i} className="px-3 py-1 bg-white/10 text-white text-[10px] rounded-lg font-bold border border-white/10">{role}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Simulation & Assessment Detail */}
                    <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-xl shadow-slate-200/50">
                        <h3 className="font-black text-slate-900 mb-6 flex items-center gap-3 text-lg">
                            <MessageSquare size={20} className="text-blue-600" />
                            Active Missions & Simulations
                        </h3>
                        {(!userData.simulations || userData.simulations.length === 0) ? (
                            <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                                <p className="text-sm text-slate-400 font-medium">No simulation data available yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {userData.simulations.map((sim: any, i: number) => (
                                    <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-blue-300 transition-colors">
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="font-bold text-sm text-slate-900 uppercase tracking-tight">{sim.title}</h4>
                                            <span className={`text-[10px] px-2 py-1 rounded-lg font-black uppercase tracking-wider ${sim.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {sim.status}
                                            </span>
                                        </div>
                                        <div className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-100 italic">
                                            "{sim.currentDraft ? sim.currentDraft.substring(0, 150) + '...' : 'No draft submitted'}"
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Expert Action */}
                <div className="space-y-6">
                    <div className="bg-slate-900 text-white p-8 rounded-4xl shadow-2xl relative overflow-hidden border border-slate-800">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full -mr-32 -mt-32 blur-[100px] opacity-30" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                                    <ShieldCheck className="text-blue-400 w-5 h-5" />
                                </div>
                                <h3 className="font-black text-xl tracking-tight">Expert Validation</h3>
                            </div>

                            <p className="text-slate-400 text-sm mb-8 leading-relaxed font-medium">
                                Provide your final professional verdict based on the AI case summary and simulation performance.
                            </p>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3 block">Expert Assessment Notes</label>
                                    <textarea
                                        value={expertNotes}
                                        onChange={(e) => setExpertNotes(e.target.value)}
                                        placeholder="Enter the final verdict and coaching advice..."
                                        className="w-full h-64 p-5 bg-white/5 border border-white/10 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none font-medium text-slate-100 placeholder:text-slate-600 transition-all"
                                    />
                                </div>

                                <button
                                    onClick={handleGenerateProfile}
                                    disabled={isGenerating || !userData.diagnosis}
                                    className="w-full py-5 bg-white hover:bg-blue-50 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
                                >
                                    {isGenerating ? (
                                        <Loader2 size={18} className="animate-spin text-blue-600" />
                                    ) : (
                                        <>
                                            <Sparkles size={18} className="text-blue-600 group-hover:scale-110 transition-transform" />
                                            Issue Recommendations
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {userData.profile && (
                        <div className="bg-emerald-50 p-8 rounded-4xl border border-emerald-100 shadow-lg flex items-center gap-4">
                            <CheckCircle size={28} className="text-emerald-600" />
                            <div>
                                <h4 className="font-black text-emerald-900 tracking-tight">Profile Certified</h4>
                                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Reference: {userData.profile.referenceId?.substring(0, 8)}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Diagnosis Summary Modal */}
            <AnimatePresence>
                {showDiagModal && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDiagModal(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden border border-slate-100"
                        >
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                                        <Brain className="text-white w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900">Diagnostic Synthesis</h3>
                                        <p className="text-blue-600 text-xs font-bold uppercase tracking-wider">AI Generated Report</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowDiagModal(false)}
                                    className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors shadow-sm"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div className="space-y-8">
                                    <section>
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Executive Summary</h4>
                                        <p className="text-slate-700 leading-relaxed font-medium bg-blue-50/30 p-6 rounded-3xl border border-blue-100/50 italic">
                                            {userData.interviewResult?.evaluation?.executiveSummary || userData.interviewResult?.evaluation?.summary || "No detailed summary available."}
                                        </p>
                                    </section>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <section className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                            <h4 className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                                <CheckCircle size={14} />
                                                Verified Strengths
                                            </h4>
                                            <ul className="space-y-2">
                                                {(userData.interviewResult?.evaluation?.cvVsReality?.confirmedStrengths || userData.diagnosis.analysis?.strengths)?.slice(0, 5).map((s: string, i: number) => (
                                                    <li key={i} className="text-xs font-bold text-slate-600 flex items-start gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                                                        {s}
                                                    </li>
                                                ))}
                                            </ul>
                                        </section>

                                        <section className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                            <h4 className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                                <AlertCircle size={14} />
                                                Gaps & Exaggerations
                                            </h4>
                                            <ul className="space-y-2">
                                                {(userData.interviewResult?.evaluation?.cvVsReality?.exaggerations || userData.diagnosis.analysis?.weaknesses)?.slice(0, 5).map((s: string, i: number) => (
                                                    <li key={i} className="text-xs font-bold text-slate-600 flex items-start gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                                                        {s}
                                                    </li>
                                                ))}
                                            </ul>
                                        </section>
                                    </div>

                                    <section className="bg-indigo-900 p-8 rounded-4xl text-white">
                                        <h4 className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-4">Strategic Transformation Steps</h4>
                                        <div className="space-y-3">
                                            {(userData.interviewResult?.evaluation?.cvImprovements || userData.diagnosis.analysis?.immediateActions)?.map((rec: string, i: number) => (
                                                <div key={i} className="flex gap-4 p-3 bg-white/5 rounded-xl border border-white/5">
                                                    <span className="text-indigo-400 font-black">0{i + 1}</span>
                                                    <p className="text-sm font-medium">{rec}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
