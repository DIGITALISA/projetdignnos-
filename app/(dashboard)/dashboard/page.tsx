"use client";

import { motion } from "framer-motion";
import {
    Target,
    Zap,
    PlayCircle,
    BookOpen,
    MessageSquare,
    TrendingUp,
    Award,
    Clock,
    ArrowRight,
    CheckCircle2,
    Shield,
    RefreshCw,
    Brain,
    FileText,
    ChevronRight,
    Star,
    Calendar,
    BarChart3,
    Layers,
    Sparkles,
    Mail,
    Users
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

import { useLanguage } from "@/components/providers/LanguageProvider";

interface LiveSession {
    _id: string;
    title: string;
    date: string;
    time: string;
    expertName: string;
    meetingLink: string;
}

interface DiagnosisData {
    skills?: { technical?: string[]; soft?: string[]; gaps?: string[] };
    overallScore?: number;
    rank?: string;
    readinessLevel?: number;
    overview?: string;
    strengths?: string[];
    weaknesses?: string[];
    immediateActions?: string[];
    sciReport?: Record<string, unknown>;
}

interface InterviewEval {
    seniorityLevel?: string;
    executiveSummary?: string;
    suggestedRoles?: string[];
}

interface SimulationReport {
    overallPerformance?: { score?: number };
    overallScore?: number;
}

export default function DashboardPage() {
    const { t, dir } = useLanguage();
    const [userName, setUserName] = useState("");
    const [userRole, setUserRole] = useState("");
    const [userPlan, setUserPlan] = useState("");
    const [hasStarted, setHasStarted] = useState(false);
    const [isDiagnosisComplete, setIsDiagnosisComplete] = useState(false);
    const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);

    // Real data states
    const [cvAnalysis, setCvAnalysis] = useState<DiagnosisData | null>(null);
    const [interviewEval, setInterviewEval] = useState<InterviewEval | null>(null);
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [simulationReport, setSimulationReport] = useState<SimulationReport | null>(null);
    const [hasSCI, setHasSCI] = useState(false);
    const [joinedDate, setJoinedDate] = useState<string>("");
    const [support, setSupport] = useState<{ adminEmail: string, adminWhatsapp: string } | null>(null);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const savedProfile = localStorage.getItem("userProfile");
                const profile = savedProfile ? JSON.parse(savedProfile) : null;
                const userId = profile?.email || profile?.fullName;

                if (profile?.fullName) {
                    setUserName(profile.fullName.split(' ')[0] || profile.fullName);
                }
                if (profile?.role) setUserRole(profile.role);
                if (profile?.plan) setUserPlan(profile.plan);
                if (profile?.createdAt) {
                    setJoinedDate(new Date(profile.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }));
                }

                if (userId) {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 10000);

                    try {
                        const res = await fetch(`/api/user/progress?userId=${encodeURIComponent(userId)}`, {
                            signal: controller.signal
                        });
                        clearTimeout(timeoutId);
                        const response = await res.json();

                        if (response.hasData && response.data) {
                            const data = response.data;
                            setHasStarted(true);

                            if (data.completionStatus === 'complete' || data.currentStep === 'completed') {
                                setIsDiagnosisComplete(true);
                            }
                            if (data.cvAnalysis) {
                                setCvAnalysis(data.cvAnalysis);
                                setHasSCI(!!data.cvAnalysis.sciReport);
                                localStorage.setItem('cvAnalysis', JSON.stringify(data.cvAnalysis));
                            }
                            if (data.interviewEvaluation) {
                                setInterviewEval(data.interviewEvaluation);
                                localStorage.setItem('interviewEvaluation', JSON.stringify(data.interviewEvaluation));
                            }
                            if (data.selectedRole) {
                                setSelectedRole(typeof data.selectedRole === 'string' ? data.selectedRole : data.selectedRole?.title || '');
                                localStorage.setItem('selectedRole', JSON.stringify(data.selectedRole));
                            }
                            if (data.simulationReport) {
                                setSimulationReport(data.simulationReport);
                            }
                            if (data.liveSessions) setLiveSessions(data.liveSessions);
                            if (data.language) localStorage.setItem('selectedLanguage', data.language);

                            // Sync access flags
                            fetch(`/api/user/readiness?userId=${encodeURIComponent(userId)}`)
                                .then(r => r.json())
                                .then(readyData => {
                                    if (readyData.success) {
                                        if (profile.canAccessCertificates !== readyData.certReady ||
                                            profile.canAccessRecommendations !== readyData.recReady ||
                                            profile.plan !== readyData.plan) {
                                            const updatedProfile = {
                                                ...profile,
                                                canAccessCertificates: readyData.certReady,
                                                canAccessRecommendations: readyData.recReady,
                                                plan: readyData.plan
                                            };
                                            localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
                                            window.dispatchEvent(new Event("profileUpdated"));
                                        }
                                    }
                                })
                                .catch(err => console.error("Failed to sync access flags", err));
                        }
                    } catch (fetchError: unknown) {
                        clearTimeout(timeoutId);
                        const isAbort = fetchError instanceof Error && fetchError.name === 'AbortError';
                        if (!isAbort) console.error("Failed to fetch progress data", fetchError);
                        if (localStorage.getItem('cvAnalysis')) setHasStarted(true);
                    }
                } else {
                    if (localStorage.getItem('cvAnalysis')) setHasStarted(true);
                }
            } catch (e: unknown) {
                console.error("Failed to load dashboard data", e);
            }
        };

        const fetchSupport = async () => {
            try {
                const res = await fetch('/api/admin/config');
                const data = await res.json();
                if (data.success) {
                    const configMap = data.configs;
                    setSupport({
                        adminEmail: configMap.adminEmail || "support@careerupgrade.ai",
                        adminWhatsapp: configMap.adminWhatsapp || "+216XXXXXXXX"
                    });
                }
            } catch (error) {
                console.error("Error fetching support config:", error);
            }
        };

        loadDashboardData();
        fetchSupport();
        window.addEventListener("profileUpdated", loadDashboardData);
        return () => window.removeEventListener("profileUpdated", loadDashboardData);
    }, [t]);

    const handleRestart = async () => {
        if (confirm(t.dashboard.reboot.confirmTitle + "\n\n" + t.dashboard.reboot.confirmDesc)) {
            localStorage.removeItem('cvAnalysis');
            localStorage.removeItem('interviewEvaluation');
            localStorage.removeItem('roleSuggestions');
            localStorage.removeItem('selectedRole');
            localStorage.removeItem('selectedLanguage');
            setIsDiagnosisComplete(false);
            setHasStarted(false);
            window.location.href = '/assessment/cv-upload';
        }
    };

    // Derived real stats
    const technicalSkillsCount = cvAnalysis?.skills?.technical?.length || 0;
    const softSkillsCount = cvAnalysis?.skills?.soft?.length || 0;
    const totalSkills = technicalSkillsCount + softSkillsCount;
    const overallScore = cvAnalysis?.overallScore || cvAnalysis?.readinessLevel || 0;
    const simScore = simulationReport?.overallPerformance?.score || simulationReport?.overallScore || 0;
    const seniorityLevel = interviewEval?.seniorityLevel || t.dashboard.stats.pendingAnalysis;

    const steps = [
        {
            stage: "1",
            title: t.dashboard.journey.stages.diagnosis,
            description: t.dashboard.journey.stages.diagnosisDesc,
            objective: t.dashboard.journey.stages.diagnosisObj,
            outcome: t.dashboard.journey.stages.diagnosisOutcome,
            status: isDiagnosisComplete ? "completed" : (hasStarted ? "in-progress" : "in-progress"),
            icon: Target,
            href: "/assessment/cv-upload",
            borderColor: "border-blue-200",
            iconColor: "text-blue-600",
            bgColor: "bg-blue-50"
        },
        {
            stage: "2",
            title: t.dashboard.journey.stages.simulation,
            description: t.dashboard.journey.stages.simulationDesc,
            objective: t.dashboard.journey.stages.simulationObj,
            outcome: t.dashboard.journey.stages.simulationOutcome,
            status: (userPlan === "Free Trial" || userPlan === "None" || userRole === "Trial User") 
                ? "locked" 
                : (isDiagnosisComplete ? "completed" : (hasStarted ? "in-progress" : "locked")),
            icon: Zap,
            href: "/simulation",
            borderColor: "border-purple-200",
            iconColor: "text-purple-600",
            bgColor: "bg-purple-50"
        },
        {
            stage: "3",
            title: t.dashboard.journey.stages.training,
            description: t.dashboard.journey.stages.trainingDesc,
            objective: t.dashboard.journey.stages.trainingObj,
            outcome: t.dashboard.journey.stages.trainingOutcome,
            status: isDiagnosisComplete ? "in-progress" : "locked",
            icon: PlayCircle,
            href: "/training",
            borderColor: "border-green-200",
            iconColor: "text-green-600",
            bgColor: "bg-green-50"
        },
        {
            stage: "4",
            title: t.dashboard.journey.stages.library,
            description: t.dashboard.journey.stages.libraryDesc,
            objective: t.dashboard.journey.stages.libraryObj,
            outcome: t.dashboard.journey.stages.libraryOutcome,
            status: (isDiagnosisComplete && userPlan !== "Free Trial") ? "in-progress" : "locked",
            icon: BookOpen,
            href: "/library",
            borderColor: "border-orange-200",
            iconColor: "text-orange-600",
            bgColor: "bg-orange-50"
        },
        {
            stage: "5",
            title: t.dashboard.journey.stages.expert,
            description: t.dashboard.journey.stages.expertDesc,
            objective: t.dashboard.journey.stages.expertObj,
            outcome: t.dashboard.journey.stages.expertOutcome,
            status: (isDiagnosisComplete && userPlan !== "Free Trial") ? "in-progress" : "locked",
            icon: MessageSquare,
            href: "/expert",
            borderColor: "border-pink-200",
            iconColor: "text-pink-600",
            bgColor: "bg-pink-50"
        },
        {
            stage: "6",
            title: t.dashboard.journey.stages.strategicReport,
            description: t.dashboard.journey.stages.strategicReportDesc,
            objective: t.dashboard.journey.stages.strategicReportObj,
            outcome: t.dashboard.journey.stages.strategicReportOutcome,
            status: (isDiagnosisComplete && userPlan !== "Free Trial") ? "completed" : "locked",
            icon: Shield,
            href: "/strategic-report",
            borderColor: "border-slate-700",
            iconColor: "text-white",
            bgColor: "bg-slate-900"
        }
    ];

    return (
        <div dir={dir} className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-10 pb-24 md:pb-8">

            {/* ── Welcome Header ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col md:flex-row md:items-end justify-between gap-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
            >
                <div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-2 tracking-tight">
                        {t.dashboard.welcome}, <span className="text-blue-600">{userName}</span> 👋
                    </h1>
                    <p className="text-slate-500 text-base md:text-lg font-medium">
                        {t.dashboard.subtitle}
                        {joinedDate && <span className="ml-2 text-xs text-slate-400 font-normal">· {t.dashboard.since} {joinedDate}</span>}
                    </p>
                </div>
                {hasStarted && (
                    <div className={`flex items-center gap-2 bg-blue-600 px-6 py-2.5 rounded-2xl shadow-lg shadow-blue-200 w-fit ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        <TrendingUp className="w-5 h-5 text-white" />
                        <span className="font-bold text-sm text-white uppercase tracking-widest">{t.dashboard.topLearner}</span>
                    </div>
                )}
            </motion.div>

            {/* ── Real Stats Grid ── */}
            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6`}>
                {[
                    {
                        label: t.dashboard.stats.skillsIdentified,
                        value: hasStarted ? String(totalSkills) : '—',
                        sub: hasStarted ? `${technicalSkillsCount} tech · ${softSkillsCount} soft` : t.dashboard.stats.startDiagnosis,
                        icon: Layers,
                        bg: 'bg-blue-600/10', text: 'text-blue-600'
                    },
                    {
                        label: t.dashboard.stats.readinessScore,
                        value: hasStarted && overallScore ? `${overallScore}%` : '—',
                        sub: hasStarted ? (cvAnalysis?.rank || t.dashboard.stats.pendingAnalysis) : t.dashboard.stats.pendingAnalysis,
                        icon: BarChart3,
                        bg: 'bg-purple-600/10', text: 'text-purple-600'
                    },
                    {
                        label: t.dashboard.stats.simulationScore,
                        value: simScore ? `${simScore}/10` : '—',
                        sub: simScore ? t.dashboard.stats.simulationScore : t.dashboard.stats.notStartedYet,
                        icon: Zap,
                        bg: 'bg-amber-600/10', text: 'text-amber-600'
                    },
                    {
                        label: t.dashboard.stats.documentsReady,
                        value: hasSCI ? '1' : '0',
                        sub: hasSCI ? t.dashboard.stats.sciReportReady : t.dashboard.stats.noneYet,
                        icon: Award,
                        bg: 'bg-emerald-600/10', text: 'text-emerald-600'
                    },
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                        className={`bg-white p-5 md:p-6 rounded-4xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group ${dir === 'rtl' ? 'text-right' : ''}`}
                    >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${stat.bg} ${stat.text}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                        <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">{stat.label}</p>
                        <p className="text-[10px] text-slate-400 mt-2 font-medium">{stat.sub}</p>
                    </motion.div>
                ))}
            </div>

            {/* ── Next Steps Grid (High-Priority Actions) ── */}
            {hasStarted && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className={dir === 'rtl' ? 'text-right' : ''}
                >
                    <div className={`flex items-center justify-between mb-6 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                            {t.dashboard.nextSteps.title}
                        </h2>
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-black uppercase tracking-widest">
                            {t.dashboard.nextSteps.basedOnDiagnosis}
                        </span>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {[
                            {
                                icon: Zap,
                                bg: 'bg-purple-50',
                                iconColor: 'text-purple-600',
                                title: t.dashboard.nextSteps.expertSimulations.title,
                                desc: t.dashboard.nextSteps.expertSimulations.desc,
                                href: '/simulation',
                                cta: t.dashboard.nextSteps.expertSimulations.cta,
                                locked: !hasStarted
                            },
                            {
                                icon: PlayCircle,
                                bg: 'bg-emerald-50',
                                iconColor: 'text-emerald-600',
                                title: t.dashboard.nextSteps.executiveWorkshops.title,
                                desc: t.dashboard.nextSteps.executiveWorkshops.desc,
                                href: '/training',
                                cta: t.dashboard.nextSteps.executiveWorkshops.cta,
                                locked: !isDiagnosisComplete
                            },
                            {
                                icon: Brain,
                                bg: 'bg-indigo-50',
                                iconColor: 'text-indigo-600',
                                title: t.dashboard.nextSteps.aiAdvisor.title,
                                desc: t.dashboard.nextSteps.aiAdvisor.desc,
                                href: '/mentor',
                                cta: t.dashboard.nextSteps.aiAdvisor.cta,
                                locked: false
                            },
                            {
                                icon: BookOpen,
                                bg: 'bg-orange-50',
                                iconColor: 'text-orange-600',
                                title: t.dashboard.nextSteps.knowledgeBase.title,
                                desc: t.dashboard.nextSteps.knowledgeBase.desc,
                                href: '/academy',
                                cta: t.dashboard.nextSteps.knowledgeBase.cta,
                                locked: false
                            },
                            {
                                icon: MessageSquare,
                                bg: 'bg-pink-50',
                                iconColor: 'text-pink-600',
                                title: t.dashboard.nextSteps.expertConsultation.title,
                                desc: t.dashboard.nextSteps.expertConsultation.desc,
                                href: '/expert',
                                cta: t.dashboard.nextSteps.expertConsultation.cta,
                                locked: !isDiagnosisComplete
                            },
                            {
                                icon: Shield,
                                bg: 'bg-slate-900',
                                iconColor: 'text-white',
                                title: t.dashboard.nextSteps.diagnosticReport.title,
                                desc: t.dashboard.nextSteps.diagnosticReport.desc,
                                href: '/strategic-report',
                                cta: t.dashboard.nextSteps.diagnosticReport.cta,
                                locked: !isDiagnosisComplete,
                                dark: true
                            },
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={!item.locked ? { y: -5, transition: { duration: 0.2 } } : {}}
                                className={`rounded-3xl border p-6 flex flex-col gap-4 transition-all ${item.dark ? 'bg-slate-900 border-slate-800' : `bg-white border-slate-100 shadow-sm`} ${item.locked ? 'opacity-50' : 'hover:shadow-xl hover:border-blue-100'}`}
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.dark ? 'bg-white/10' : item.bg}`}>
                                    <item.icon className={`w-6 h-6 ${item.dark ? 'text-white' : item.iconColor}`} />
                                </div>
                                <div className="flex-1">
                                    <h4 className={`font-black text-base mb-1 ${item.dark ? 'text-white' : 'text-slate-900'}`}>{item.title}</h4>
                                    <p className={`text-xs font-medium leading-relaxed ${item.dark ? 'text-slate-400' : 'text-slate-500'}`}>{item.desc}</p>
                                </div>
                                {item.locked ? (
                                    <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${item.dark ? 'text-slate-600' : 'text-slate-300'}`}>
                                        🔒 {t.dashboard.nextSteps.locked}
                                    </span>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] ${item.dark ? 'text-blue-400 hover:text-blue-300' : `${item.iconColor} hover:opacity-70`} transition-all`}
                                    >
                                        {item.cta}
                                        <ArrowRight className={`w-3.5 h-3.5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                                    </Link>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* ── Main Grid: Current Focus + Journey ── */}
            <div className="grid lg:grid-cols-3 gap-8 md:gap-10">

                {/* Operational Mandate (Current Focus) */}
                <motion.div
                    initial={{ opacity: 0, x: dir === 'rtl' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 p-8 md:p-10 shadow-sm flex flex-col relative overflow-hidden"
                >
                    {hasStarted ? (
                        <>
                            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-100/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                            <div className={`flex items-center justify-between mb-8 relative z-10 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                <div>
                                    <h2 className={`text-2xl font-black text-slate-900 flex items-center gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                                            <Zap className="w-6 h-6 text-yellow-400" />
                                        </div>
                                        {t.dashboard.currentFocus.title}
                                    </h2>
                                    <p className="text-slate-400 text-sm mt-1 font-medium">{t.dashboard.subtitle}</p>
                                </div>
                            </div>

                            <div className={`flex-1 ${isDiagnosisComplete ? 'bg-linear-to-br from-blue-50 to-white border-blue-100' : 'bg-linear-to-br from-slate-50 to-white border-slate-100'} rounded-3xl p-6 md:p-8 flex flex-col items-stretch gap-6 border relative ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                    <div className="flex-1 space-y-3 w-full">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className={`inline-block px-4 py-1.5 ${isDiagnosisComplete ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'} text-[10px] font-black rounded-full uppercase tracking-widest shadow-sm`}>
                                                {isDiagnosisComplete ? t.dashboard.diagnosisStatus.completed : t.dashboard.diagnosisStatus.inProgress}
                                            </span>
                                            {isDiagnosisComplete && (
                                                <span className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase tracking-widest">
                                                    <CheckCircle2 size={12} /> {t.dashboard.diagnosisStatus.successfullyCompleted}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 leading-tight">
                                            {isDiagnosisComplete ? t.dashboard.diagnosisStatus.complete : t.dashboard.diagnosisStatus.pending}
                                        </h3>
                                        <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-xl">
                                            {isDiagnosisComplete
                                                ? ((userPlan === "Free Trial" || userPlan === "None" || userRole === "Trial User") 
                                                    ? t.dashboard.diagnosisStatus.teaserDesc
                                                    : t.dashboard.diagnosisStatus.readyNext)
                                                : t.dashboard.diagnosisStatus.cvAnalysisComplete}
                                        </p>

                                        <div className={`flex flex-wrap items-center gap-3 pt-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                            {selectedRole && (
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-xl shadow-xs">
                                                    <Target className="w-4 h-4 text-blue-600" />
                                                    <span className="text-[10px] font-bold text-slate-700">
                                                        {t.dashboard.sections.targetRole}: <span className="text-blue-700 font-black">{selectedRole}</span>
                                                    </span>
                                                </div>
                                            )}
                                            {seniorityLevel && interviewEval && (
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-xl shadow-xs">
                                                    <Star className="w-4 h-4 text-amber-500" />
                                                    <span className="text-[10px] font-bold text-slate-700">
                                                        {t.dashboard.sections.level}: <span className="text-amber-600 font-black">{seniorityLevel}</span>
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="shrink-0 w-full md:w-auto mt-4 md:mt-0">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-col gap-3 min-w-[200px]">
                                            {isDiagnosisComplete && (
                                                <Link
                                                    href="/strategic-report"
                                                    className="px-6 py-3.5 bg-slate-900 text-white rounded-xl font-black shadow-lg shadow-slate-900/10 hover:bg-slate-800 active:scale-95 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                                                >
                                                    <FileText className="w-4 h-4 text-blue-400" />
                                                    {t.dashboard.currentFocus.viewResults}
                                                </Link>
                                            )}
                                            <Link
                                                href="/strategic-report?tab=history"
                                                className="px-6 py-3.5 bg-white text-slate-700 border border-slate-200 rounded-xl font-black hover:bg-slate-50 active:scale-95 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                                            >
                                                <Clock className="w-4 h-4 text-indigo-500" />
                                                {t.dashboard.currentFocus.viewHistory}
                                            </Link>
                                            <button
                                                onClick={handleRestart}
                                                className="px-6 py-3.5 text-rose-500 font-black border border-transparent hover:border-rose-100 hover:bg-rose-50 rounded-xl active:scale-95 transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                                            >
                                                <RefreshCw className="w-3 h-3" />
                                                {t.dashboard.currentFocus.restart}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* ── Professional Resource Guide ── */}
                                <div className="mt-4 pt-6 border-t border-slate-100 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap">
                                            {t.dashboard.diagnosisStatus.moduleInfo.title}
                                        </span>
                                        <div className="h-px flex-1 bg-slate-100" />
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className={`p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col gap-2 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                                            <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                                                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Digital Intelligence</span>
                                                <span className="ms-auto text-[8px] font-black px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full uppercase tracking-tighter">Auto-Activated</span>
                                            </div>
                                            <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                                                {t.dashboard.diagnosisStatus.moduleInfo.aiDescription}
                                            </p>
                                        </div>

                                        <div className={`p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col gap-2 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                                            <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                                <Users className="w-3.5 h-3.5 text-white" />
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Executive Access</span>
                                                <span className="ms-auto text-[8px] font-black px-2 py-0.5 bg-amber-500 text-white rounded-full uppercase tracking-tighter">Expert Scheduled</span>
                                            </div>
                                            <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
                                                {t.dashboard.diagnosisStatus.moduleInfo.humanDescription}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {(userPlan === "Free Trial" || userPlan === "None" || userRole === "Trial User") && isDiagnosisComplete && (
                                    <div className="mt-4 p-4 bg-linear-to-br from-indigo-600 to-blue-700 rounded-2xl shadow-lg text-white relative overflow-hidden group">
                                        <Sparkles className="absolute top-2 right-2 w-8 h-8 text-white/10 -rotate-12 transition-transform group-hover:scale-125" />
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2 mb-1">
                                                    <Shield className="w-3 h-3" />
                                                    {t.dashboard.upsell.title}
                                                </p>
                                                <div className="flex gap-4">
                                                    <div className="flex items-center gap-1.5 text-[10px] font-bold">
                                                        <CheckCircle2 className="w-3 h-3 text-blue-300" /> {t.dashboard.upsell.item1}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-[10px] font-bold">
                                                        <CheckCircle2 className="w-3 h-3 text-blue-300" /> {t.dashboard.upsell.item2}
                                                    </div>
                                                </div>
                                            </div>
                                            <Link href="/subscription" className="shrink-0 px-4 py-2 bg-white text-indigo-700 rounded-xl text-[9px] font-black uppercase tracking-wider hover:bg-slate-50 transition-colors text-center">
                                                Upgrade to Pro
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* ── Real Diagnosis Summary ── */}
                            {cvAnalysis && (
                                <div className="mt-8 grid sm:grid-cols-2 gap-6">
                                    {cvAnalysis.strengths && cvAnalysis.strengths.length > 0 && (
                                        <div className="bg-emerald-50/50 rounded-3xl p-6 border border-emerald-100/50">
                                            <p className={`text-xs font-black text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                                <CheckCircle2 className="w-4 h-4" />
                                                {t.dashboard.sections.strengths}
                                            </p>
                                            <ul className={`space-y-2.5 ${dir === 'rtl' ? 'text-right' : ''}`}>
                                                {cvAnalysis.strengths.slice(0, 3).map((s, i) => (
                                                    <li key={i} className="text-sm text-emerald-900 font-bold flex items-start gap-3">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                                                        <span>{s}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {cvAnalysis.skills?.gaps && cvAnalysis.skills.gaps.length > 0 && (
                                        <div className="bg-amber-50/50 rounded-3xl p-6 border border-amber-100/50">
                                            <p className={`text-xs font-black text-amber-600 uppercase tracking-widest mb-4 flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                                <Brain className="w-4 h-4" />
                                                {t.dashboard.sections.gaps}
                                            </p>
                                            <ul className={`space-y-2.5 ${dir === 'rtl' ? 'text-right' : ''}`}>
                                                {cvAnalysis.skills.gaps.slice(0, 3).map((g, i) => (
                                                    <li key={i} className="text-sm text-amber-900 font-bold flex items-start gap-3">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                                                        <span>{g}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {/* Interview Summary */}
                                    {interviewEval?.executiveSummary && (
                                        <div className="sm:col-span-2 bg-indigo-50/50 rounded-3xl p-6 border border-indigo-100/50">
                                            <p className={`text-xs font-black text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                                <FileText className="w-4 h-4" />
                                                {t.dashboard.sections.interviewSummary}
                                            </p>
                                            <p className="text-sm text-indigo-900 font-medium leading-relaxed italic">
                                                &ldquo;{interviewEval.executiveSummary}&rdquo;
                                            </p>
                                        </div>
                                    )}
                                    {/* Immediate Actions */}
                                    {cvAnalysis.immediateActions && cvAnalysis.immediateActions.length > 0 && (
                                        <div className="sm:col-span-2 bg-slate-50/50 rounded-3xl p-6 border border-slate-100/50">
                                            <p className={`text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                                <ArrowRight className="w-4 h-4" />
                                                {t.dashboard.sections.recommendedActions}
                                            </p>
                                            <div className="flex flex-wrap gap-3">
                                                {cvAnalysis.immediateActions.slice(0, 4).map((action, i) => (
                                                    <span key={i} className="text-xs px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold shadow-sm">
                                                        {action}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center space-y-8">
                             <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center">
                                <Target className="w-12 h-12 text-blue-600 animate-pulse" />
                            </div>
                            <div className="max-w-md space-y-3">
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                                    {t.dashboard.notStarted.title}
                                </h2>
                                <p className="text-slate-500 font-medium leading-relaxed">
                                    {t.dashboard.notStarted.desc}
                                </p>
                            </div>
                            <Link href="/assessment/cv-upload" className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black shadow-2xl shadow-blue-600/30 hover:bg-blue-700 hover:scale-105 transition-all text-sm uppercase tracking-widest flex items-center gap-3">
                                {t.dashboard.notStarted.cta}
                                <ArrowRight className={`w-5 h-5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                            </Link>
                        </div>
                    )}
                </motion.div>

                {/* Vertical Success Path (Leadership Journey) */}
                <motion.div
                    initial={{ opacity: 0, x: dir === 'rtl' ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className={`bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative h-fit ${dir === 'rtl' ? 'text-right' : ''}`}
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
                    <h2 className="text-2xl font-black text-white mb-8 tracking-tight flex items-center gap-3">
                        <div className="w-2 h-8 bg-blue-600 rounded-full" />
                        {t.dashboard.journey.title}
                    </h2>
                    
                    <div className="relative space-y-8">
                        {/* Timeline line */}
                        <div className={`absolute top-0 bottom-0 w-px bg-slate-800 ${dir === 'rtl' ? 'right-6' : 'left-6'} top-6 bottom-6`} />

                        {steps.map((step, idx) => (
                            <div key={idx} className="relative group">
                                <Link 
                                    href={step.status !== 'locked' ? step.href : '#'}
                                    className={`flex items-start gap-6 ${dir === 'rtl' ? 'flex-row-reverse' : ''} ${step.status === 'locked' ? 'cursor-default' : 'cursor-pointer hover:bg-white/5 p-4 -m-4 rounded-4xl transition-all'}`}
                                >
                                    {/* Stage Indicator */}
                                    <div className={`relative z-10 w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 
                                        ${step.status === 'completed' 
                                            ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-600/40' 
                                            : step.status === 'in-progress'
                                                ? 'bg-slate-800 border-blue-500/50 text-blue-400 animate-pulse'
                                                : 'bg-slate-950 border-slate-800 text-slate-700'}`}>
                                        {step.status === 'completed' ? (
                                            <CheckCircle2 size={24} />
                                        ) : (
                                            <span className="font-black text-lg">{step.stage}</span>
                                        )}
                                    </div>

                                    {/* Stage Content */}
                                    <div className="flex-1 space-y-1">
                                        <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                            <h3 className={`font-black text-base transition-colors duration-300 ${step.status === 'locked' ? 'text-slate-600' : 'text-white group-hover:text-blue-400'}`}>
                                                {step.title}
                                            </h3>
                                            {step.status === 'in-progress' && (
                                                <span className="flex h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                                            )}
                                        </div>
                                        
                                        <p className={`text-xs leading-relaxed font-medium transition-colors ${step.status === 'locked' ? 'text-slate-700' : 'text-slate-400'}`}>
                                            {step.description}
                                        </p>

                                        {step.status !== 'locked' && (
                                            <div className="overflow-hidden pt-2 space-y-3">
                                                <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-2 group-hover:border-white/10 transition-colors">
                                                    <div className={`flex items-start gap-2 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                                                        <Sparkles size={12} className="text-blue-400 mt-0.5" />
                                                        <div className="flex-1">
                                                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">
                                                                {t.dashboard.journey.objectiveLabel}
                                                            </p>
                                                            <p className="text-[11px] text-slate-300 font-bold leading-snug">
                                                                {step.objective}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className={`flex items-start gap-2 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                                                        <Award size={12} className="text-emerald-400 mt-0.5" />
                                                        <div className="flex-1">
                                                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none mb-1">
                                                                {t.dashboard.journey.outcomeLabel}
                                                            </p>
                                                            <p className="text-[11px] text-slate-300 font-bold leading-snug">
                                                                {step.outcome}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="inline-flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] group-hover:text-blue-300 transition-colors">
                                                    {t.dashboard.currentFocus.continue} <ArrowRight size={12} className={dir === 'rtl' ? 'rotate-180' : ''} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* ── Live Sessions ── */}
            {liveSessions.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="bg-linear-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[120px] -mr-48 -mt-48" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[100px] -ml-32 -mb-32" />
                    <div className={`relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        <div className="space-y-4">
                            <div className={`flex items-center gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                <div className="px-3 py-1 bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-500/30">
                                    {t.dashboard.liveSessions.upcoming}
                                </div>
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                            </div>
                            <h2 className={`text-2xl md:text-3xl font-black text-white ${dir === 'rtl' ? 'text-right' : ''}`}>
                                {t.dashboard.liveSessions.title}
                            </h2>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 relative z-10">
                        {liveSessions.map((session, idx) => (
                            <div key={idx} className={`bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all group ${dir === 'rtl' ? 'text-right' : ''}`}>
                                <div className={`flex items-center gap-4 mb-6 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg">{session.title}</h4>
                                        <p className="text-slate-400 text-xs">{t.dashboard.liveSessions.expert}: {session.expertName}</p>
                                    </div>
                                </div>
                                <div className="space-y-3 mb-8">
                                    <div className={`flex items-center gap-3 text-slate-300 text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                        <Calendar size={16} className="text-blue-400" />
                                        <span>{new Date(session.date).toLocaleDateString(undefined, { day: 'numeric', month: 'long' })}</span>
                                    </div>
                                    <div className={`flex items-center gap-3 text-slate-300 text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                        <Clock size={16} className="text-blue-400" />
                                        <span>{session.time}</span>
                                    </div>
                                </div>
                                {session.meetingLink && (
                                    <a
                                        href={session.meetingLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-2 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-xl active:scale-95"
                                    >
                                        {t.dashboard.liveSessions.join}
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* ── Support & Help Section ── */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-12 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6"
            >
                <div>
                     <h3 className="text-xl font-bold text-slate-900 mb-1">
                        {t.dashboard.support.title}
                    </h3>
                    <p className="text-slate-500 text-sm">
                        {t.dashboard.support.subtitle}
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <motion.a 
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        href={`mailto:${support?.adminEmail || 'support@careerupgrade.ai'}`}
                        className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg hover:bg-blue-600 transition-all"
                    >
                         <Mail size={18} />
                        {t.dashboard.support.contactEmail}
                    </motion.a>
                    <motion.a 
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        href={`https://wa.me/${(support?.adminWhatsapp || '+216XXXXXXXX').replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-[#25D366] text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg hover:opacity-90 transition-all"
                    >
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        {t.dashboard.support.contactWhatsapp}
                    </motion.a>
                </div>
            </motion.div>
        </div>
    );
}
