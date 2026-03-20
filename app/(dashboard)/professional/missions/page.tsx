"use client";

import { motion } from "framer-motion";
import { Briefcase, CheckCircle2, Clock, FileText, AlertCircle, Send, Target, PlayCircle, Loader2, Lock, ShieldCheck, Calendar } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";

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
    support?: {
        adminEmail: string;
        adminWhatsapp: string;
    }
}

export default function ProfessionalMissionsPage() {
    const { language } = useLanguage();
    const [isLoading, setIsLoading] = useState(true);
    const [missionState, setMissionState] = useState<MissionState>({
        hasActiveMission: false,
        hasPendingRequest: false,
        mission: null,
        proposals: []
    });

    const [activeTab, setActiveTab] = useState("intelligence"); 
    const [draft, setDraft] = useState("");

    const fetchMission = useCallback(async () => {
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
                proposals: data.proposals || [],
                support: data.support
            });

            if (data.mission?.currentDraft) {
                setDraft(data.mission.currentDraft);
            }
        } catch (error) {
            console.error("Failed to load mission:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

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
        window.addEventListener("profileUpdated", fetchMission);
        return () => window.removeEventListener("profileUpdated", fetchMission);
    }, [fetchMission]);

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">Initialisation du Mandat...</h2>
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-2">Vérification des accès exécutifs</p>
            </div>
        );
    }

    const t_local = {
        ar: {
            title: "الميسيونات الإحترافية (Missions)",
            noMission: "لا توجد ميسيونات نشطة حالياً",
            waiting: "في انتظار تعيين ميسيون من قبل الخبراء",
            features: [
                "محاكاة واقعية للضغوط",
                "أهداف استراتيجية واضحة",
                "تواصل مباشر مع المشرف",
                "تقرير أداء نهائي"
            ],
            btnAccept: "بدء الميسيون الآن",
            tabs: {
                intel: "استخبارات الميسيون",
                execute: "التنفيذ والتعاون"
            },
            briefing: "الإيجاز التنفيذي",
            roadmap: "خارطة المحاكاة",
            draftPlaceholder: "ابدأ كتابة استراتيجيتك هنا...",
            submit: "إرسال الخطة النهائية",
            success: "تم إرسال الميسيون بنجاح"
        },
        fr: {
            title: "Missions Stratégiques",
            noMission: "Aucune mission active pour le moment",
            waiting: "En attente de l'attribution d'une mission par nos experts",
            features: [
                "Simulation de pression réelle",
                "Objectifs stratégiques clairs",
                "Communication directe Expert",
                "Rapport de performance final"
            ],
            btnAccept: "Démarrer la Mission",
            tabs: {
                intel: "Intelligence Mission",
                execute: "Exécution & Collaboration"
            },
            briefing: "Briefing Exécutif",
            roadmap: "Feuille de Route Simulation",
            draftPlaceholder: "Commencez à rédiger votre stratégie ici...",
            submit: "Soumettre le Plan Final",
            success: "Mission soumise avec succès"
        },
        en: {
            title: "Strategic Missions",
            noMission: "No active missions found",
            waiting: "Waiting for expert mission assignment",
            features: [
                "Real-world pressure simulation",
                "Clear strategic objectives",
                "Direct expert communication",
                "Final performance report"
            ],
            btnAccept: "Start Mission Now",
            tabs: {
                intel: "Mission Intelligence",
                execute: "Execute & Collaborate"
            },
            briefing: "Executive Briefing",
            roadmap: "Simulation Roadmap",
            draftPlaceholder: "Start drafting your strategy here...",
            submit: "Submit Final Plan",
            success: "Mission submitted successfully"
        }
    }[language as 'ar' | 'en' | 'fr'] || {
        title: "Strategic Missions",
        noMission: "No active missions found",
        waiting: "Waiting for expert mission assignment",
        features: ["Pressure Simulation", "Clear Objectives", "Expert Comms", "Final Report"],
        btnAccept: "Start Mission",
        tabs: {
            intel: "Intelligence",
            execute: "Execute"
        },
        briefing: "Briefing",
        roadmap: "Roadmap",
        draftPlaceholder: "Draft here...",
        submit: "Submit",
        success: "Success"
    };

    // STATE 1: No Mission yet
    if (!missionState.hasActiveMission && !missionState.proposals.length) {
        return (
            <div className="max-w-6xl mx-auto py-12 px-4 relative space-y-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 text-center border border-slate-200 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-indigo-600 to-blue-600" />
                    
                    <div className="relative z-20">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner rotate-3">
                            <Target className="w-10 h-10 text-indigo-600" />
                        </div>
                        
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                            {t_local.title}
                        </h1>
                        
                        <p className="text-lg text-slate-600 mb-12 leading-relaxed max-w-3xl mx-auto font-medium">
                            {t_local.noMission}. {t_local.waiting}.
                        </p>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {t_local.features.map((feature, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-indigo-200 hover:bg-white hover:shadow-lg transition-all"
                                >
                                    <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center mb-4 mx-auto md:mx-0">
                                        {idx === 0 ? <AlertCircle size={20} /> : 
                                         idx === 1 ? <Target size={20} /> : 
                                         idx === 2 ? <Briefcase size={20} /> : 
                                         <ShieldCheck size={20} />}
                                    </div>
                                    <h3 className="text-sm font-black text-slate-900 leading-tight">{feature}</h3>
                                </motion.div>
                            ))}
                        </div>

                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">
                            <Clock size={18} className="text-indigo-400" /> MISSION EN ATTENTE DE CONFIGURATION
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // STATE 2: Pending Request
    if (missionState.hasPendingRequest && !missionState.proposals.length && !missionState.hasActiveMission) {
        return (
            <div className="max-w-3xl mx-auto py-20 px-4 text-center">
                <div className="w-24 h-24 bg-indigo-100 rounded-4xl flex items-center justify-center mx-auto mb-8 animate-pulse">
                    <Clock className="w-10 h-10 text-indigo-600" />
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Configuration en Cours</h2>
                <p className="text-lg text-slate-600 max-w-lg mx-auto font-medium">
                    Nos experts finalisent les détails de votre mandat. Vous recevrez une notification dès que les objectifs seront validés.
                </p>
            </div>
        );
    }

    // STATE 3: Proposals
    if (!missionState.hasActiveMission && missionState.proposals.length > 0) {
        return (
            <div className="max-w-6xl mx-auto py-12 px-4 shadow-2xl" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight uppercase">Mandats Disponibles</h1>
                    <p className="text-slate-500 text-lg max-w-xl mx-auto font-medium">
                        Sélectionnez la mission stratégique sur laquelle vous souhaitez être évalué.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 ">
                    {missionState.proposals.map((prop, idx) => (
                        <motion.div
                            key={prop._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl hover:shadow-2xl hover:border-indigo-400 transition-all flex flex-col group relative overflow-hidden h-full"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-50" />
                            <div className="mb-6 relative z-10">
                                <span className="text-[10px] font-black bg-indigo-600 text-white px-3 py-1 rounded-full uppercase tracking-widest">Niveau Exécutif</span>
                                <h3 className="text-2xl font-black text-slate-900 mt-4 leading-[1.1]">{prop.title}</h3>
                            </div>

                            <div className="flex-1 space-y-4 mb-8 relative z-10">
                                <div className="flex items-center gap-3 text-slate-500 font-bold">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                                        <Briefcase className="w-4 h-4 text-indigo-600" />
                                    </div>
                                    <span className="text-sm">{prop.role}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-500 font-bold">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                                        <Clock className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <span className="text-sm">{prop.objectives?.length || 0} Objectifs Fixés</span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleAcceptProposal(prop._id)}
                                className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95 group-hover:bg-indigo-600 uppercase tracking-widest text-xs"
                            >
                                {t_local.btnAccept}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        );
    }

    // STATE 4: Active Mission
    const { mission } = missionState;
    if (!mission) return null;

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Header Content */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32" />
                
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="space-y-6 flex-1">
                        <div className="flex items-center gap-3">
                            <span className="bg-indigo-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Mandat Actif</span>
                            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">ID: {mission._id.slice(-8).toUpperCase()}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[0.9]">
                            {mission.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                                <Briefcase size={16} className="text-indigo-400" />
                                <span className="text-sm font-bold">{mission.role}</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                                <Clock size={16} className="text-emerald-400" />
                                <span className="text-sm font-bold">{mission.objectives?.length || 0} Étapes</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                        <button
                            onClick={() => setActiveTab("intelligence")}
                            className={cn(
                                "px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg",
                                activeTab === 'intelligence' ? "bg-white text-slate-900" : "bg-white/5 text-white hover:bg-white/10"
                            )}
                        >
                            <Target size={18} /> {t_local.tabs.intel}
                        </button>
                        <button
                            onClick={() => setActiveTab("workspace")}
                            className={cn(
                                "px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20",
                                activeTab === 'workspace' ? "bg-indigo-600 text-white" : "bg-white/5 text-white hover:bg-white/10"
                            )}
                        >
                            <PlayCircle size={18} /> {t_local.tabs.execute}
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {activeTab === 'intelligence' ? (
                        <>
                            {/* Briefing Card */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                        <FileText size={24} />
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{t_local.briefing}</h2>
                                </div>
                                <div className="text-slate-600 leading-relaxed font-medium text-lg whitespace-pre-line">
                                    {mission.briefing}
                                </div>
                            </motion.div>

                            {/* Roadmap Card */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                            <Target size={24} />
                                        </div>
                                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">{t_local.roadmap}</h2>
                                    </div>
                                    <span className="px-3 py-1 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
                                        {mission.objectives?.length || 0} Tasks
                                    </span>
                                </div>

                                <div className="space-y-6">
                                    {mission.objectives?.map((obj, idx) => (
                                        <div 
                                            key={idx}
                                            className={cn(
                                                "p-6 rounded-3xl border-2 flex flex-col md:flex-row md:items-center gap-6 transition-all",
                                                obj.status === 'current' ? "border-indigo-500 bg-indigo-50/30" :
                                                obj.status === 'completed' ? "border-emerald-500 bg-emerald-50/30" :
                                                "border-slate-100 bg-slate-50 grayscale opacity-50"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 shadow-lg",
                                                obj.status === 'current' ? "bg-indigo-600 text-white" :
                                                obj.status === 'completed' ? "bg-emerald-600 text-white" :
                                                "bg-slate-200 text-slate-400Shadow-none"
                                            )}>
                                                {obj.status === 'completed' ? <CheckCircle2 size={24} /> : idx + 1}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Objectif 0{idx + 1}</span>
                                                    {obj.status === 'current' && <span className="text-[10px] font-black text-indigo-600 uppercase animate-pulse">En Cours</span>}
                                                </div>
                                                <h3 className="text-xl font-black text-slate-900 leading-tight">{obj.title}</h3>
                                                <div className="flex flex-wrap items-center gap-4 mt-2">
                                                    {obj.date && (
                                                        <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                                                            <Calendar size={12} className="text-indigo-600" /> {obj.date}
                                                        </span>
                                                    )}
                                                    {obj.time && (
                                                        <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1 border-l border-slate-200 pl-4">
                                                            <Clock size={12} className="text-indigo-600" /> {obj.time}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {obj.status === 'current' && obj.meetingLink && (
                                                <button
                                                    onClick={() => window.open(obj.meetingLink, '_blank')}
                                                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
                                                >
                                                    Rejoindre la Session
                                                </button>
                                            )}
                                            {obj.status === 'locked' && (
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <Lock size={16} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Verrouillé</span>
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
                            className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl min-h-[600px] flex flex-col overflow-hidden"
                        >
                            <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-600 rounded-xl text-white">
                                        <FileText size={18} />
                                    </div>
                                    <h3 className="font-black text-slate-900 uppercase text-sm tracking-tight">Espace d&apos;Exécution Stratégique</h3>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Sauvegarde active
                                </span>
                            </div>
                            <textarea
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                placeholder={t_local.draftPlaceholder}
                                className="flex-1 p-8 text-xl text-slate-700 bg-transparent outline-none resize-none leading-relaxed font-medium"
                            />
                            <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Le CEO attend votre rapport stratégique.</p>
                                <div className="text-[10px] font-black bg-slate-900 text-white px-4 py-1 rounded-full">{draft.trim().split(/\s+/).filter(Boolean).length} MOTS</div>
                            </div>
                        </motion.div>
                    )}
                </div>

                <div className="space-y-8">
                    {/* Communications Feed */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 p-6 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full -mr-12 -mt-12 opacity-50" />
                        <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 relative z-10">
                            <Send className="w-5 h-5 text-indigo-600" />
                            Comms Internes
                        </h3>
                        
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar relative z-10">
                            {mission.messages?.length ? (
                                mission.messages.map((msg, idx) => (
                                    <div key={idx} className={cn(
                                        "p-4 rounded-2xl border transition-all",
                                        msg.sender === 'admin' ? "bg-indigo-50 border-indigo-100" : "bg-slate-50 border-slate-100"
                                    )}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={cn(
                                                "w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black text-white",
                                                msg.sender === 'admin' ? "bg-indigo-600" : "bg-slate-900"
                                            )}>
                                                {msg.sender === 'admin' ? 'EXP' : 'MOI'}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium text-slate-700">{msg.text}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-slate-400 italic text-sm font-medium">Aucun échange pour le moment.</div>
                            )}
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-100 relative z-10">
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
                                    placeholder="Répondre à l'expert..."
                                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/5 resize-none h-24 pr-12 font-medium"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-3 bottom-3 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-indigo-600 transition-all shadow-xl active:scale-95"
                                >
                                    <Send size={16} />
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Resources */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl">
                        <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                            <Lock className="w-5 h-5 text-indigo-400" />
                            Ressources Stratégiques
                        </h3>
                        <div className="space-y-4">
                            {mission.resources?.map((res, i) => (
                                <div
                                    key={i}
                                    onClick={() => res.url && window.open(res.url, '_blank')}
                                    className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 hover:border-indigo-500/50 transition-all cursor-pointer group flex items-center gap-4"
                                >
                                    <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        <FileText size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-black truncate">{res.title}</h4>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{res.type}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Final Action */}
                    <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-200">
                        <h3 className="text-xl font-black mb-2 uppercase tracking-tight leading-none">Soumission Finale</h3>
                        <p className="text-indigo-100 text-sm font-medium mb-8 opacity-80">Prêt à soumettre votre stratégie pour validation par nos experts ?</p>
                        
                        {mission.status === 'completed' ? (
                            <div className="space-y-4">
                                <div className="bg-white/10 p-4 rounded-2xl border border-white/10 flex items-center gap-3">
                                    <ShieldCheck className="text-indigo-200" />
                                    <span className="text-xs font-black uppercase tracking-widest">Simulation Terminée</span>
                                </div>
                                <Link href="/performance-scorecard" className="block w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest text-center shadow-lg hover:scale-[1.02] transition-all">
                                    Voir mon Scorecard
                                </Link>
                            </div>
                        ) : (
                            <button
                                onClick={async () => {
                                    const link = prompt("Veuillez fournir un lien vers votre stratégie finale (Google Doc, PDF, etc.) pour examen.");
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
                                        alert("Félicitations ! Votre stratégie a été soumise pour révision par nos experts.");
                                        fetchMission();
                                    } else {
                                        alert("Échec de la soumission. Veuillez réessayer.");
                                        setIsLoading(false);
                                    }
                                }}
                                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <Send size={16} /> Envoyer pour Révision
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
