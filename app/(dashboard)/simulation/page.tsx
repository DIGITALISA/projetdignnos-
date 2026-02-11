"use client";

import { motion } from "framer-motion";
import { Briefcase, CheckCircle2, Clock, FileText, AlertCircle, Send, Target, PlayCircle, Loader2, Lock, ShieldCheck, Calendar, BarChart3 } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MissionObjective {
    title: string;
    date?: string;
    time?: string;
    meetingLink?: string;
    status: 'locked' | 'current' | 'completed';
}

interface Mission {
    _id: string;
    title: string;
    role: string;
    company?: string;
    briefing: string;
    objectives?: MissionObjective[];
    price?: number;
    status: string;
    resources?: Array<{ title: string; type: string; url: string }>;
    messages?: Array<{ sender: string; text: string; timestamp: Date }>;
    currentDraft?: string;
    submittedLink?: string;
}

interface MissionState {
    hasActiveMission: boolean;
    hasPendingRequest: boolean;
    mission: Mission | null;
    proposals: Mission[];
}

export default function SimulationPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [missionState, setMissionState] = useState<MissionState>({
        hasActiveMission: false,
        hasPendingRequest: false,
        mission: null,
        proposals: []
    });

    // Add local state for the dashboard interaction
    const [activeTab, setActiveTab] = useState("intelligence"); // intelligence vs workspace
    const [draft, setDraft] = useState("");


    const fetchMission = async () => {
        setIsLoading(true);
        try {
            const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
            const userId = userProfile.email || userProfile.fullName || 'demo-user';

            const res = await fetch(`/api/simulation?userId=${encodeURIComponent(userId)}`);
            const data = await res.json();

            setMissionState({
                hasActiveMission: !!data.hasActiveMission,
                hasPendingRequest: !!data.hasPendingRequest,
                mission: data.mission,
                proposals: data.proposals || []
            });

            if (data.mission?.currentDraft) {
                setDraft(data.mission.currentDraft);
            }
        } catch (error) {
            console.error("Failed to load mission:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-save effect
    useEffect(() => {
        if (!missionState.hasActiveMission || !draft) return;

        const timer = setTimeout(async () => {
            const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
            const userId = userProfile.email || userProfile.fullName || 'demo-user';

            await fetch('/api/simulation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, type: 'save_draft', draft })
            });
        }, 2000);

        return () => clearTimeout(timer);
    }, [draft, missionState.hasActiveMission]);



    const handlePurchase = (missionId: string, price: number = 149) => {
        if (window.confirm(`Confirm purchase of Executive Mission for ${price} TND?`)) {
            setIsLoading(true);
            setTimeout(() => {
                const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
                const purchased = profile.purchasedItems || [];
                if (!purchased.includes(missionId)) {
                    purchased.push(missionId);
                    profile.purchasedItems = purchased;
                    localStorage.setItem('userProfile', JSON.stringify(profile));
                    window.dispatchEvent(new Event("profileUpdated"));
                    window.location.reload();
                } else {
                    setIsLoading(false);
                }
            }, 1000);
        }
    };

    const handleAcceptProposal = async (missionId: string) => {
        setIsLoading(true);
        try {
            const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
            const userId = userProfile.email || userProfile.fullName || 'demo-user';

            const res = await fetch('/api/simulation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, type: 'accept_mission', missionId })
            });

            if (res.ok) {
                await fetchMission();
            } else {
                alert("Failed to activate mission.");
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Accept Proposal Error:", error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMission();
    }, []);

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <h2 className="text-xl font-bold text-slate-800">Processing Secure Transaction...</h2>
                <p className="text-slate-500">Verifying executive clearance level.</p>
            </div>
        );
    }

    // Check for Pro Essential Plan restrictions
    const userPool = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('userProfile') || '{}') : {};
    const isProEssential = userPool.plan === "Pro Essential";
    const hasPaidForMission = (missionState.mission && userPool.purchasedItems?.includes(missionState.mission._id)) ||
        (missionState.proposals?.some(p => userPool.purchasedItems?.includes(p._id)));

    // STATE 1: No Mission yet -> Choice / Request Flow
    if (!missionState.hasActiveMission && !missionState.proposals.length) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-4 relative">
                <div className="bg-white rounded-[2.5rem] p-6 md:p-16 text-center border border-slate-200 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-blue-600 to-purple-600" />
                    <div className="absolute inset-0 bg-linear-to-r from-slate-900/90 to-slate-900/50 z-10" />
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8">
                        <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
                    </div>
                    <h1 className="text-2xl md:text-4xl font-black text-slate-900 mb-4 md:mb-6 tracking-tight font-arabic" dir="rtl">لا توجد محاكاة نشطة حالياً</h1>
                    <p className="text-base md:text-xl text-slate-600 mb-8 md:mb-10 leading-relaxed max-w-2xl mx-auto font-bold font-arabic" dir="rtl">
                        ليس لديك أي محاكاة أو مهمة تدريبية مفعلة في الوقت الحالي. يرجى الاتصال بالمنظم (Administrator) إذا كنت ترغب في بدء حصص المحاكاة والتدريب المباشرة.
                    </p>

                    {isProEssential && !hasPaidForMission && (
                        <div className="p-6 md:p-8 bg-amber-50 rounded-[2.5rem] border-2 border-amber-100 mb-8 max-w-lg mx-auto">
                            <Lock className="w-8 h-8 text-amber-600 mx-auto mb-4" />
                            <h3 className="text-lg font-black text-amber-900 mb-2 uppercase tracking-tight">Investissement Stratégique Requis</h3>
                            <p className="text-amber-700 text-sm font-bold mb-6">
                                En tant que membre <span className="underline">Pro Essential</span>, vous devez débloquer chaque session de simulation individuellement.
                            </p>
                            <button 
                                onClick={() => alert("Redirecting to secure payment gateway...")}
                                className="w-full py-4 bg-amber-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-amber-600/20 active:scale-95 transition-transform"
                            >
                                Débloquer ma Simulation (Tarif Exécutif)
                            </button>
                        </div>
                    )}

                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-700 font-black text-sm uppercase tracking-widest mb-4">
                        <AlertCircle size={18} /> Premium Paid Service
                    </div>
                    <p className="text-sm text-slate-400 font-medium font-arabic">
                        * ملاحظة: محاكاة CareerUpgrade.AI هي خدمة مدفوعة تتضمن حصصاً تدريبية مباشرة مع خبراء دوليين.
                    </p>
                </div>
            </div>
        );
    }

    // STATE 2: Pending Request (Waiting for expert)
    if (missionState.hasPendingRequest && !missionState.proposals.length && !missionState.hasActiveMission) {
        return (
            <div className="max-w-3xl mx-auto py-20 px-4 text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-4xl flex items-center justify-center mx-auto mb-8 animate-bounce">
                    <Clock className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Mission Generation In Progress</h2>
                <p className="text-lg text-slate-600 max-w-lg mx-auto font-medium">
                    Our industry experts are currently designing your custom simulation scenarios. You will receive <strong>multiple tailored options</strong> shortly.
                </p>
            </div>
        );
    }

    // STATE 3: Expert Response (When proposals are available)
    if (!missionState.hasActiveMission && missionState.proposals.length > 0) {
        return (
            <div className="max-w-6xl mx-auto py-12 px-4">
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-blue-600 rounded-4xl flex items-center justify-center text-white mx-auto shadow-2xl shadow-blue-200 mb-6 rotate-3">
                        <Send size={32} />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Expert Proposals Ready</h1>
                    <p className="text-slate-500 text-lg max-w-xl mx-auto font-medium">
                        Our experts have designed several high-impact scenarios based on your profile. Choose your path to begin the coaching.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {missionState.proposals.map((prop, idx) => (
                        <motion.div
                            key={prop._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-slate-50 p-6 rounded-3xl border border-slate-200 mb-6 shadow-sm hover:shadow-2xl hover:border-blue-400 transition-all flex flex-col group overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-50" />
                            <div className="mb-6 relative z-10">
                                <span className="text-[10px] font-black bg-blue-600 text-white px-3 py-1 rounded-full uppercase tracking-widest">Coached Path</span>
                                <h3 className="text-2xl font-black text-slate-900 mt-4 leading-[1.1]">{prop.title}</h3>
                            </div>

                            <div className="flex-1 space-y-4 mb-8 relative z-10">
                                <div className="flex items-center gap-3 text-slate-500 font-bold">
                                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
                                        <Briefcase className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <span className="text-sm">{prop.role} @ {prop.company}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-500 font-bold">
                                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                        <Clock className="w-4 h-4 text-emerald-400" />
                                    </div>
                                    <span className="text-sm">{prop.objectives?.length || 0} Expert Sessions</span>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-50 flex items-center justify-between mb-8 relative z-10">
                                <div className="text-3xl font-black text-slate-900">
                                    {prop.price} <span className="text-xs text-slate-400 uppercase">TND</span>
                                </div>
                                {isProEssential && !userPool.purchasedItems?.includes(prop._id) && (
                                    <div className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-[10px] font-black uppercase tracking-wide flex items-center gap-1">
                                        <Lock size={12} /> Premium Lock
                                    </div>
                                )}
                            </div>

                            {(!isProEssential || userPool.purchasedItems?.includes(prop._id)) ? (
                                <button
                                    onClick={() => handleAcceptProposal(prop._id)}
                                    className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95 group-hover:bg-blue-600"
                                >
                                    START THIS MISSION
                                </button>
                            ) : (
                                <button
                                    onClick={() => handlePurchase(prop._id, prop.price)}
                                    className="w-full py-5 bg-amber-600 text-white font-black rounded-2xl hover:bg-amber-700 transition-all shadow-xl shadow-amber-600/20 active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <Lock size={16} />
                                    UNLOCK MISSION
                                </button>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        );
    }

    // STATE 4: Active Mission
    const { mission } = missionState;
    if (!mission) return (
        <div className="text-center py-20 text-slate-400">
            <AlertCircle className="w-16 h-16 mx-auto mb-4" />
            <p>Wait, we couldn&apos;t find your mission details. Please refresh the page.</p>
        </div>
    );

    return (
        <div className="flex-1 max-w-6xl mx-auto space-y-8">
            {/* Mission Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl h-full relative overflow-hidden group"
            >
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-blue-500/20 text-blue-400 border border-blue-500/50 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest animate-pulse flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full" />
                            Coached Execution
                        </div>
                        <span className="text-slate-400 font-medium tracking-[0.2em] uppercase text-[10px]">Verified Expert Mentorship</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight leading-[0.9] max-w-3xl">
                                {mission.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-8 text-sm font-bold text-slate-400">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
                                        <Briefcase className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <span className="text-white">{mission.role}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-600/20 flex items-center justify-center">
                                        <Clock className="w-4 h-4 text-emerald-400" />
                                    </div>
                                    <span className="text-white">{mission.objectives?.length || 4} Live Sessions</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-amber-600/20 flex items-center justify-center">
                                        <span className="text-xs font-black text-amber-400">TND</span>
                                    </div>
                                    <span className="text-white font-black">{mission.price || 199} <span className="text-xs text-slate-400">Fee</span></span>
                                </div>
                            </div>
                        </div>

                        {/* VIEW SWITCHER */}
                        <div className="bg-white p-8 rounded-4xl shadow-xl shadow-slate-200/50 border border-slate-100 h-full">
                            <button
                                onClick={() => setActiveTab("intelligence")}
                                className={`px-8 py-3.5 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${activeTab === 'intelligence' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-white'}`}
                            >
                                <Target size={18} /> Mission Intelligence
                            </button>
                            <button
                                onClick={() => setActiveTab("workspace")}
                                className={`px-8 py-3.5 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${activeTab === 'workspace' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-400 hover:text-white'}`}
                            >
                                <PlayCircle size={18} /> Execute & Collaborate
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Briefing & Objectives OR Workspace */}
                <div className="lg:col-span-2 space-y-8">
                    {activeTab === 'intelligence' ? (
                        <>
                            {/* Mission Briefing */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm"
                            >
                                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                    <FileText className="w-6 h-6 text-blue-600" />
                                    Executive Briefing
                                </h2>
                                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                                    <p className="whitespace-pre-line">{mission.briefing}</p>
                                </div>
                            </motion.div>

                            {/* Coached Roadmap (Objectives) */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 pointer-events-none" />
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                        <Target className="w-6 h-6 text-blue-600" />
                                        Expert-Led Roadmap
                                    </h2>
                                    <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-3 py-1 rounded-full uppercase tracking-tighter">{mission.objectives?.length || 0} Expert Sessions</span>
                                </div>
                                <div className="space-y-6 relative">
                                    {mission.objectives?.map((obj: MissionObjective, idx: number) => (
                                        <div
                                            key={idx}
                                            className={`p-6 rounded-4xl border-2 flex flex-col md:flex-row md:items-center gap-6 transition-all ${obj.status === 'current'
                                                ? 'border-blue-500 bg-blue-50/30'
                                                : obj.status === 'completed'
                                                    ? 'border-green-200 bg-green-50/30'
                                                    : 'border-slate-100 bg-slate-50 grayscale'
                                                }`}
                                        >
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${obj.status === 'current' ? 'bg-blue-600 text-white shadow-blue-200' :
                                                obj.status === 'completed' ? 'bg-green-600 text-white shadow-green-100' : 'bg-slate-200 text-slate-400'
                                                }`}>
                                                {obj.status === 'completed' ? <CheckCircle2 size={24} /> : <span className="text-xl font-black">{idx + 1}</span>}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${obj.status === 'locked' ? 'bg-slate-200 text-slate-500' : 'bg-blue-600 text-white'}`}>
                                                        Session 0{idx + 1}
                                                    </span>
                                                    {obj.status === 'current' && <span className="text-[9px] font-black text-blue-600 uppercase animate-pulse">Waiting for Debrief</span>}
                                                </div>
                                                <h3 className={`text-lg font-bold leading-tight ${obj.status === 'current' ? 'text-blue-900' : 'text-slate-900'}`}>{obj.title}</h3>
                                                <div className="flex flex-wrap items-center gap-4 mt-2">
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight flex items-center gap-1.5">
                                                        Status: <span className={cn("font-black", obj.status === 'current' ? "text-blue-600" : obj.status === 'completed' ? "text-emerald-600" : "text-slate-400")}>{obj.status === 'current' ? 'In Review' : obj.status === 'completed' ? 'Mastered' : 'Locked'}</span>
                                                    </p>
                                                    {obj.date && (
                                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight flex items-center gap-1.5 border-l border-slate-200 pl-4">
                                                            <Calendar size={12} className="text-blue-500" /> {obj.date}
                                                        </p>
                                                    )}
                                                    {obj.time && (
                                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight flex items-center gap-1.5 border-l border-slate-200 pl-4">
                                                            <Clock size={12} className="text-blue-500" /> {obj.time}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            {obj.status === 'current' ? (
                                                <button
                                                    onClick={() => {
                                                        if (obj.meetingLink) {
                                                            window.open(obj.meetingLink, '_blank');
                                                        } else {
                                                            alert("Your expert hasn't set the meeting link for this specific session yet.");
                                                        }
                                                    }}
                                                    className="bg-blue-600 text-white text-xs font-black px-6 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
                                                >
                                                    <PlayCircle size={16} /> Join Session
                                                </button>
                                            ) : obj.status === 'locked' ? (
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <Lock size={16} />
                                                    <span className="text-[10px] font-black uppercase">Pending</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-green-600 font-black text-xs">
                                                    <ShieldCheck size={18} /> Validated
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-[2.5rem] border-2 border-blue-100 p-1 bg-linear-to-br from-blue-50 to-white shadow-xl min-h-[600px] flex flex-col"
                        >
                            <div className="p-6 border-b border-blue-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900">Executive Response Editor</h3>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Drafting Strategic Memo</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full flex items-center gap-1">
                                        <Clock size={12} /> Auto-saving...
                                    </span>
                                </div>
                            </div>
                            <textarea
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                placeholder="Start drafting your executive summary and action plan here... (The CEO is waiting for this)"
                                className="flex-1 p-8 text-lg text-slate-700 bg-transparent outline-none resize-none leading-relaxed placeholder:text-slate-300 font-medium"
                            />
                            <div className="p-6 bg-slate-50/50 border-t border-slate-100 rounded-b-[2.5rem] flex items-center justify-between">
                                <p className="text-xs text-slate-400 font-medium italic">Your draft is confidential and only visible to you until submission.</p>
                                <div className="text-[10px] font-bold text-slate-400 uppercase">Words: {draft.trim().split(/\s+/).filter(Boolean).length}</div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Right Column: Resources & Actions */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-8"
                >
                    {/* Internal Communications Feed */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-hidden relative">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <Send className="w-4 h-4 text-blue-600" />
                                Internal Comms
                            </h3>
                            <span className="bg-red-100 text-red-600 text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">2 NEW</span>
                        </div>
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {mission.messages && mission.messages.length > 0 ? (
                                mission.messages.map((msg, idx: number) => (
                                    <div key={idx} className={cn(
                                        "flex gap-3 p-3 rounded-2xl border transition-all",
                                        msg.sender === 'admin' ? "bg-blue-50 border-blue-100" : "bg-white border-slate-100"
                                    )}>
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white",
                                            msg.sender === 'admin' ? "bg-blue-600" : "bg-slate-900"
                                        )}>
                                            {msg.sender === 'admin' ? 'EXP' : 'YOU'}
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-slate-700 font-medium">{msg.text}</p>
                                            <span className="text-[9px] text-slate-400 font-bold mt-1 inline-block">
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 text-slate-400 italic text-xs">
                                    No internal comms yet.
                                </div>
                            )}
                        </div>
                        {/* Message Input for Participant */}
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                const input = e.currentTarget.elements.namedItem('message') as HTMLTextAreaElement;
                                const text = input.value.trim();
                                if (!text) return;

                                const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
                                const userId = userProfile.email || userProfile.fullName || 'demo-user';

                                const res = await fetch('/api/simulation', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ userId, type: 'send_message', text })
                                });

                                if (res.ok) {
                                    input.value = '';
                                    fetchMission();
                                }
                            }} className="relative">
                                <textarea
                                    name="message"
                                    placeholder="Send message to expert..."
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] outline-none focus:ring-2 focus:ring-blue-500/10 resize-none h-16 pr-10 font-medium"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 bottom-3 w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg"
                                >
                                    <Send size={14} />
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Intelligence Assets */}
                    <div className="bg-slate-900 rounded-3xl p-6 text-white text-sm">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Lock className="w-4 h-4 text-amber-400" />
                            Confidential Assets
                        </h3>
                        <div className="space-y-3">
                            {mission.resources?.map((res, i: number) => (
                                <div
                                    key={i}
                                    onClick={() => res.url && window.open(res.url, '_blank')}
                                    className="flex items-center justify-between p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors cursor-pointer group"
                                >
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-4 h-4 text-blue-400" />
                                        <span className="font-medium group-hover:text-blue-300 transition-colors">{res.title}</span>
                                    </div>
                                    <span className="text-[10px] bg-black/30 px-2 py-1 rounded text-slate-400">{res.type}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Panel */}
                    <div className="bg-linear-to-b from-blue-50 to-white rounded-3xl border border-blue-100 p-6">
                        <h3 className="font-bold text-slate-900 text-lg mb-2">Execute Strategy</h3>
                        <p className="text-slate-500 text-sm mb-6">Ready to submit your plan for Expert Review?</p>

                        <div className="space-y-3">
                            {mission.status === 'completed' ? (
                                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl space-y-2">
                                    <div className="flex items-center gap-2 text-emerald-700 font-black text-xs uppercase mb-2">
                                        <CheckCircle2 size={14} /> Mission Submitted
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-medium">Your strategy has been sent for expert review.</p>
                                    <div className="pt-2 flex flex-col gap-2">
                                        {mission.submittedLink && (
                                            <a href={mission.submittedLink} target="_blank" className="block p-2 bg-white border border-emerald-100 rounded-lg text-blue-600 truncate text-[10px] font-bold hover:bg-blue-50 transition-colors">
                                                {mission.submittedLink}
                                            </a>
                                        )}
                                        <Link href="/performance-scorecard" className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
                                            <BarChart3 size={14} /> View Executive Scorecard
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={async () => {
                                        const link = prompt("Please provide a link to your final strategy (e.g. Google Doc, PDF link, etc.)");
                                        if (!link) return;

                                        const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
                                        const userId = userProfile.email || userProfile.fullName || 'demo-user';
                                        setIsLoading(true);
                                        const res = await fetch('/api/simulation', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ userId, type: 'submit_plan', submittedLink: link })
                                        });
                                        if (res.ok) {
                                            alert("Success! Your strategy has been submitted for Expert Review.");
                                            fetchMission();
                                        } else {
                                            alert("Submission failed. Please try again.");
                                            setIsLoading(false);
                                        }
                                    }}
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    <Send className="w-4 h-4" />
                                    Submit Strategy & Link
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
