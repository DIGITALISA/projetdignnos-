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
    Mail
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
        const confirmMsg = dir === 'rtl'
            ? '⚠️ إعادة التشخيص — هل أنت متأكد؟\n\nسيتم مسح جميع بيانات التشخيص الحالية (السيرة الذاتية، المقابلة، المحاكاة) وستبدأ من الصفر.\n\nاضغط "موافق" للمتابعة.'
            : '⚠️ Restart Diagnosis — Are you sure?\n\nAll current diagnosis data (CV, interview, simulation) will be permanently cleared and you will start from scratch.\n\nClick OK to continue.';

        if (confirm(confirmMsg)) {
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
    const seniorityLevel = interviewEval?.seniorityLevel || (dir === 'rtl' ? 'في انتظار التقييم' : 'Pending Assessment');

    const steps = [
        {
            title: t.dashboard.journey.stages.diagnosis,
            description: t.dashboard.journey.stages.diagnosisDesc,
            status: isDiagnosisComplete ? "completed" : (hasStarted ? "in-progress" : "in-progress"),
            icon: Target,
            href: "/assessment/cv-upload",
            borderColor: "border-blue-200",
            iconColor: "text-blue-600",
            bgColor: "bg-blue-50"
        },
        {
            title: t.dashboard.journey.stages.simulation,
            description: t.dashboard.journey.stages.simulationDesc,
            // Lock for free tier even if diagnosis is complete
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
            title: t.dashboard.journey.stages.training,
            description: t.dashboard.journey.stages.trainingDesc,
            status: isDiagnosisComplete ? "in-progress" : "locked",
            icon: PlayCircle,
            href: "/training",
            borderColor: "border-green-200",
            iconColor: "text-green-600",
            bgColor: "bg-green-50"
        },
        {
            title: t.dashboard.journey.stages.library,
            description: t.dashboard.journey.stages.libraryDesc,
            status: (isDiagnosisComplete && userPlan !== "Free Trial") ? "in-progress" : "locked",
            icon: BookOpen,
            href: "/library",
            borderColor: "border-orange-200",
            iconColor: "text-orange-600",
            bgColor: "bg-orange-50"
        },
        {
            title: t.dashboard.journey.stages.expert,
            description: t.dashboard.journey.stages.expertDesc,
            status: (isDiagnosisComplete && userPlan !== "Free Trial") ? "in-progress" : "locked",
            icon: MessageSquare,
            href: "/expert",
            borderColor: "border-pink-200",
            iconColor: "text-pink-600",
            bgColor: "bg-pink-50"
        },
        {
            title: t.dashboard.journey.stages.strategicReport,
            description: t.dashboard.journey.stages.strategicReportDesc,
            status: (isDiagnosisComplete && userPlan !== "Free Trial") ? "completed" : "locked",
            icon: Shield,
            href: "/strategic-report",
            borderColor: "border-slate-700",
            iconColor: "text-white",
            bgColor: "bg-slate-900"
        }
    ];

    return (
        <div dir={dir} className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 pb-24 md:pb-8">

            {/* ── Welcome Header ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col md:flex-row md:items-end justify-between gap-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
            >
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-1">
                        {t.dashboard.welcome}, {userName} 👋
                    </h1>
                    <p className="text-slate-500 text-sm md:text-base">
                        {t.dashboard.subtitle}
                        {joinedDate && <span className="ml-2 text-xs text-slate-400">· {dir === 'rtl' ? 'منذ' : 'Since'} {joinedDate}</span>}
                    </p>
                </div>
                {hasStarted && (
                    <div className={`flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200 w-fit ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                        <span className="font-semibold text-sm text-emerald-700">{t.dashboard.topLearner}</span>
                    </div>
                )}
            </motion.div>

            {/* ── Real Stats Grid ── */}
            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4`}>
                {[
                    {
                        label: dir === 'rtl' ? 'المهارات المُحددة' : 'Skills Identified',
                        value: hasStarted ? String(totalSkills) : '—',
                        sub: hasStarted ? `${technicalSkillsCount} tech · ${softSkillsCount} soft` : (dir === 'rtl' ? 'ابدأ التشخيص' : 'Start diagnosis'),
                        icon: Layers,
                        bg: 'bg-blue-50', text: 'text-blue-600'
                    },
                    {
                        label: dir === 'rtl' ? 'درجة الجاهزية' : 'Readiness Score',
                        value: hasStarted && overallScore ? `${overallScore}%` : '—',
                        sub: hasStarted ? (cvAnalysis?.rank || (dir === 'rtl' ? 'من التقييم' : 'From CV audit')) : (dir === 'rtl' ? 'في انتظار التحليل' : 'Pending analysis'),
                        icon: BarChart3,
                        bg: 'bg-purple-50', text: 'text-purple-600'
                    },
                    {
                        label: dir === 'rtl' ? 'درجة المحاكاة' : 'Simulation Score',
                        value: simScore ? `${simScore}/10` : '—',
                        sub: simScore ? (dir === 'rtl' ? 'من المحاكاة الواقعية' : 'From live simulation') : (dir === 'rtl' ? 'لم تبدأ بعد' : 'Not started yet'),
                        icon: Zap,
                        bg: 'bg-amber-50', text: 'text-amber-600'
                    },
                    {
                        label: dir === 'rtl' ? 'الوثائق المُنجزة' : 'Documents Ready',
                        value: hasSCI ? '1' : '0',
                        sub: hasSCI ? (dir === 'rtl' ? 'تقرير SCI جاهز' : 'SCI Report ready') : (dir === 'rtl' ? 'لا يوجد بعد' : 'None yet'),
                        icon: Award,
                        bg: 'bg-emerald-50', text: 'text-emerald-600'
                    },
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                        className={`bg-white p-4 md:p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow ${dir === 'rtl' ? 'text-right' : ''}`}
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.bg} ${stat.text}`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                        <p className="text-xs font-semibold text-slate-500 mt-0.5">{stat.label}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{stat.sub}</p>
                    </motion.div>
                ))}
            </div>

            {/* ── Main Grid: Current Focus + Journey ── */}
            <div className="grid lg:grid-cols-3 gap-6 md:gap-8">

                {/* Current Focus */}
                <motion.div
                    initial={{ opacity: 0, x: dir === 'rtl' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm flex flex-col relative overflow-hidden"
                >
                    {hasStarted ? (
                        <>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100/40 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                            <div className={`flex items-center justify-between mb-6 relative z-10 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                <h2 className={`text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                    <Zap className="w-5 h-5 text-purple-600" />
                                    {t.dashboard.currentFocus.title}
                                </h2>
                            </div>

                            <div className={`flex-1 ${isDiagnosisComplete ? 'bg-linear-to-br from-green-50 to-emerald-50 border-green-100' : 'bg-linear-to-br from-purple-50 to-white border-purple-100/50'} rounded-2xl p-5 md:p-8 flex flex-col sm:flex-row items-center gap-6 border relative ${dir === 'rtl' ? 'sm:flex-row-reverse text-center sm:text-right' : 'text-center sm:text-left'}`}>
                                <div className="relative z-10 flex-1 space-y-3 w-full">
                                    <span className={`inline-block px-3 py-1 ${isDiagnosisComplete ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'} text-[10px] font-bold rounded-full uppercase tracking-wider`}>
                                        {isDiagnosisComplete ? (dir === 'rtl' ? 'مكتمل' : 'Completed') : (dir === 'rtl' ? 'قيد التنفيذ' : 'In Progress')}
                                    </span>
                                    <h3 className="text-xl md:text-2xl font-bold text-slate-900">
                                        {isDiagnosisComplete
                                            ? (dir === 'rtl' ? 'التشخيص المهني مكتمل' : 'Career Diagnosis Complete')
                                            : (dir === 'rtl' ? 'التشخيص المهني' : 'Career Diagnosis')}
                                    </h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {isDiagnosisComplete
                                            ? ((userPlan === "Free Trial" || userPlan === "None" || userRole === "Trial User") 
                                                ? (dir === 'rtl' 
                                                    ? '⚠️ التشخيص الأولي مكتمل بنجاح! لقد كشفنا عن ثغرات حرجة. ملاحظة: هذا مجرد "تشويق"، التشخيص الحقيقي العيق (التقرير الاستراتيجي، تحليل التنافسية) يتطلب الترقية.' 
                                                    : '⚠️ Initial Audit Complete! Critical gaps detected. Note: This is a "Teaser". The real deep diagnosis (Strategic Report, Competitive Analysis) requires an upgrade.')
                                                : (dir === 'rtl' ? 'لقد أكملت التشخيص بالكامل. أنت الآن مستعد للمرحلة التالية من رحلتك!' : 'You have effectively completed the full diagnosis. You are now ready for the next stage of your journey!'))
                                            : (dir === 'rtl' ? 'تم تحليل سيرتك الذاتية بنجاح. الخطوة التالية: ابدأ المحاكاة!' : 'Your CV analysis is complete. Next step: Start the simulation!')}
                                    </p>
                                    {(userPlan === "Free Trial" || userPlan === "None" || userRole === "Trial User") && isDiagnosisComplete && (
                                        <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                                            <p className="text-[11px] font-bold text-indigo-700 flex items-center gap-2">
                                                <Sparkles className="w-4 h-4" />
                                                {dir === 'rtl' ? 'ماذا ينتظرك في النسخة الكاملة؟' : 'What awaits you in the Full Version?'}
                                            </p>
                                            <ul className="mt-2 space-y-1">
                                                <li className="text-[10px] text-indigo-600 flex items-center gap-1">
                                                    <CheckCircle2 className="w-3 h-3" /> {dir === 'rtl' ? 'خارطة طريق استراتيجية لـ 18 شهر' : '18-Month Strategic Roadmap'}
                                                </li>
                                                <li className="text-[10px] text-indigo-600 flex items-center gap-1">
                                                    <CheckCircle2 className="w-3 h-3" /> {dir === 'rtl' ? 'محاكاة واقعية للمواقف القيادية' : 'Real-world Leadership Simulations'}
                                                </li>
                                                <li className="text-[10px] text-indigo-600 flex items-center gap-1">
                                                    <CheckCircle2 className="w-3 h-3" /> {dir === 'rtl' ? 'تقرير الذكاء المهني الشامل (SCI)' : 'Comprehensive Career Intelligence (SCI)'}
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                    {selectedRole && (
                                        <div className={`flex items-center gap-2 mt-2 ${dir === 'rtl' ? 'flex-row-reverse justify-end' : ''}`}>
                                            <Target className="w-4 h-4 text-slate-400" />
                                            <span className="text-xs font-semibold text-slate-500">
                                                {dir === 'rtl' ? 'الدور المستهدف:' : 'Target Role:'} <span className="text-slate-800">{selectedRole}</span>
                                            </span>
                                        </div>
                                    )}
                                    {seniorityLevel && interviewEval && (
                                        <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse justify-end' : ''}`}>
                                            <Star className="w-4 h-4 text-amber-400" />
                                            <span className="text-xs font-semibold text-slate-500">
                                                {dir === 'rtl' ? 'المستوى:' : 'Level:'} <span className="text-slate-800">{seniorityLevel}</span>
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="relative z-10 w-full sm:w-auto shrink-0">
                                    {isDiagnosisComplete ? (
                                        <div className="flex flex-col gap-3 min-w-[200px]">
                                            <div className={`flex items-center gap-2 mb-1 justify-center sm:justify-start ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                                </div>
                                                <span className="text-xs font-bold text-green-700 uppercase tracking-wider">
                                                    {dir === 'rtl' ? 'مكتمل بنجاح' : 'Successfully Completed'}
                                                </span>
                                            </div>
                                            <Link
                                                href="/strategic-report"
                                                className="w-full px-6 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 active:scale-95 transition-all text-sm text-center flex items-center justify-center gap-2"
                                            >
                                                <TrendingUp className="w-4 h-4" />
                                                {t.dashboard.currentFocus.viewResults}
                                            </Link>
                                            <Link
                                                href="/strategic-report?tab=history"
                                                className="w-full px-6 py-3 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 active:scale-95 transition-all text-sm text-center flex items-center justify-center gap-2"
                                            >
                                                <Clock className="w-4 h-4 text-indigo-600" />
                                                {t.dashboard.currentFocus.viewHistory}
                                            </Link>
                                            <button
                                                onClick={handleRestart}
                                                className="w-full px-6 py-3 bg-white text-rose-600 border border-rose-200 rounded-xl font-black hover:bg-rose-50 active:scale-95 transition-all text-xs text-center flex items-center justify-center gap-2"
                                            >
                                                <RefreshCw className="w-4 h-4" />
                                                {t.dashboard.currentFocus.restart}
                                            </button>
                                        </div>
                                    ) : (
                                        <Link href="/simulation" className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 active:scale-95 transition-all text-sm inline-block text-center">
                                            {t.dashboard.currentFocus.continue}
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {/* ── Real Diagnosis Summary ── */}
                            {cvAnalysis && (
                                <div className="mt-6 grid sm:grid-cols-2 gap-4">
                                    {/* Strengths */}
                                    {cvAnalysis.strengths && cvAnalysis.strengths.length > 0 && (
                                        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                                            <p className={`text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3 flex items-center gap-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                                <CheckCircle2 className="w-3 h-3" />
                                                {dir === 'rtl' ? 'نقاط القوة' : 'Key Strengths'}
                                            </p>
                                            <ul className={`space-y-1.5 ${dir === 'rtl' ? 'text-right' : ''}`}>
                                                {cvAnalysis.strengths.slice(0, 3).map((s, i) => (
                                                    <li key={i} className="text-xs text-emerald-800 font-medium flex items-start gap-1.5">
                                                        <span className="text-emerald-400 mt-0.5">▸</span>
                                                        <span>{s}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {/* Gaps */}
                                    {cvAnalysis.skills?.gaps && cvAnalysis.skills.gaps.length > 0 && (
                                        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
                                            <p className={`text-[10px] font-black text-amber-600 uppercase tracking-widest mb-3 flex items-center gap-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                                <Brain className="w-3 h-3" />
                                                {dir === 'rtl' ? 'الفجوات المُحددة' : 'Identified Gaps'}
                                            </p>
                                            <ul className={`space-y-1.5 ${dir === 'rtl' ? 'text-right' : ''}`}>
                                                {cvAnalysis.skills.gaps.slice(0, 3).map((g, i) => (
                                                    <li key={i} className="text-xs text-amber-800 font-medium flex items-start gap-1.5">
                                                        <span className="text-amber-400 mt-0.5">▸</span>
                                                        <span>{g}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {/* Interview Summary */}
                                    {interviewEval?.executiveSummary && (
                                        <div className="sm:col-span-2 bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
                                            <p className={`text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 flex items-center gap-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                                <FileText className="w-3 h-3" />
                                                {dir === 'rtl' ? 'ملخص المقابلة' : 'Interview Summary'}
                                            </p>
                                            <p className="text-xs text-indigo-800 font-medium leading-relaxed line-clamp-3">
                                                {interviewEval.executiveSummary}
                                            </p>
                                        </div>
                                    )}
                                    {/* Immediate Actions */}
                                    {cvAnalysis.immediateActions && cvAnalysis.immediateActions.length > 0 && (
                                        <div className="sm:col-span-2 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                            <p className={`text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                                <ArrowRight className="w-3 h-3" />
                                                {dir === 'rtl' ? 'الخطوات الفورية الموصى بها' : 'Recommended Immediate Actions'}
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {cvAnalysis.immediateActions.slice(0, 4).map((action, i) => (
                                                    <span key={i} className="text-[11px] px-3 py-1 bg-white border border-slate-200 rounded-full text-slate-700 font-semibold shadow-sm">
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
                        <>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 relative z-10 py-12">
                                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                                    <Target className="w-10 h-10 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                        {dir === 'rtl' ? 'لنبدأ رحلتك المهنية' : "Let's Start Your Career Journey"}
                                    </h2>
                                    <p className="text-slate-500 max-w-md mx-auto">
                                        {dir === 'rtl'
                                            ? 'الخطوة الأولى هي فهم مهاراتك. قم برفع سيرتك الذاتية ليقوم الذكاء الاصطناعي ببناء مسار مخصص لك.'
                                            : 'The first step is understanding your skills. Upload your CV to let our AI build a personalized path for you.'}
                                    </p>
                                </div>
                                <Link href="/assessment/cv-upload" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 hover:scale-105 transition-all flex items-center gap-2">
                                    {dir === 'rtl' ? 'ابدأ التشخيص الآن' : 'Start Diagnosis Now'}
                                    <ArrowRight className={`w-5 h-5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                                </Link>
                            </div>
                        </>
                    )}
                </motion.div>

                {/* Journey Timeline */}
                <motion.div
                    initial={{ opacity: 0, x: dir === 'rtl' ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className={`bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-hidden h-fit ${dir === 'rtl' ? 'text-right' : ''}`}
                >
                    <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-6">{t.dashboard.journey.title}</h2>
                    <div className="relative space-y-0">
                        <div className={`absolute top-4 bottom-4 w-[2px] bg-slate-100 ${dir === 'rtl' ? 'right-[23px] md:right-[27px]' : 'left-[23px] md:left-[27px]'}`} />
                        {steps.map((step, idx) => (
                            <Link key={idx} href={step.status !== 'locked' ? step.href : '#'}>
                                <div className={`relative flex items-start gap-3 md:gap-4 pb-5 last:pb-0 group ${dir === 'rtl' ? 'flex-row-reverse' : ''} ${step.status !== 'locked' ? 'cursor-pointer' : 'cursor-default'}`}>
                                    <div className={`relative z-10 w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-2xl flex items-center justify-center border-2 transition-all ${step.status === 'completed' ? 'bg-emerald-50 border-emerald-200' : step.status === 'in-progress' ? `${step.bgColor} ${step.borderColor}` : 'bg-slate-50 border-transparent'}`}>
                                        {step.status === 'completed' ? (
                                            <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-emerald-500" />
                                        ) : (
                                            <step.icon className={`w-5 h-5 md:w-6 md:h-6 ${step.status === 'locked' ? 'text-slate-300' : step.iconColor}`} />
                                        )}
                                    </div>
                                    <div className="pt-1.5 md:pt-2 flex-1">
                                        <h3 className={`font-bold text-sm md:text-base ${step.status === 'locked' ? 'text-slate-400' : 'text-slate-900 group-hover:text-blue-600 transition-colors'}`}>
                                            {step.title}
                                        </h3>
                                        <p className="text-xs md:text-sm text-slate-400 leading-snug mt-0.5">
                                            {step.description}
                                        </p>
                                    </div>
                                    {step.status !== 'locked' && (
                                        <ChevronRight className={`w-4 h-4 text-slate-300 group-hover:text-blue-400 transition-colors mt-3 shrink-0 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                                    )}
                                </div>
                            </Link>
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

            {/* ── Next Steps Panel (replaces fake "Prioritized for You") ── */}
            {hasStarted && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className={dir === 'rtl' ? 'text-right' : ''}
                >
                    <div className={`flex items-center justify-between mb-4 md:mb-6 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                            {dir === 'rtl' ? '🎯 خطواتك التالية' : '🎯 Your Next Steps'}
                        </h2>
                        <span className="text-xs text-slate-400 font-medium">
                            {dir === 'rtl' ? 'بناءً على تشخيصك' : 'Based on your diagnosis'}
                        </span>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            {
                                icon: Zap,
                                color: 'purple',
                                bg: 'bg-purple-50',
                                border: 'border-purple-100',
                                iconColor: 'text-purple-600',
                                title: dir === 'rtl' ? '2. محاكاة الخبراء' : '2. Expert Simulations',
                                desc: dir === 'rtl' ? 'محاكاة واقعية 100% مع خبير بشري لتقييم أدائك تحت الضغط.' : '100% personalized simulations with a human expert to evaluate your performance under pressure.',
                                href: '/simulation',
                                cta: dir === 'rtl' ? 'ابدأ المحاكاة' : 'Start Simulation',
                                locked: !hasStarted
                            },
                            {
                                icon: PlayCircle,
                                color: 'green',
                                bg: 'bg-green-50',
                                border: 'border-green-100',
                                iconColor: 'text-green-600',
                                title: dir === 'rtl' ? '3. ورش العمل التنفيذية' : '3. Executive Workshops',
                                desc: dir === 'rtl' ? 'جلسات مباشرة مع خبراء مخصصة بناءً على نتائج تشخيصك.' : 'Live sessions with experts, personalized based on your audit results.',
                                href: '/training',
                                cta: dir === 'rtl' ? 'استكشف الورش' : 'Explore Workshops',
                                locked: !isDiagnosisComplete
                            },
                            {
                                icon: Brain,
                                color: 'indigo',
                                bg: 'bg-indigo-50',
                                border: 'border-indigo-100',
                                iconColor: 'text-indigo-600',
                                title: dir === 'rtl' ? '4. المستشار الاستراتيجي AI' : '4. AI Strategic Advisor',
                                desc: dir === 'rtl' ? 'دعم مهني 24/7 مع مساعد ذكاء اصطناعي + خطة تعلم مخصصة.' : '24/7 professional support with an AI advisor + personalized learning plan.',
                                href: '/mentor',
                                cta: dir === 'rtl' ? 'تحدث مع المستشار' : 'Talk to Advisor',
                                locked: false
                            },
                            {
                                icon: BookOpen,
                                color: 'orange',
                                bg: 'bg-orange-50',
                                border: 'border-orange-100',
                                iconColor: 'text-orange-600',
                                title: dir === 'rtl' ? '5. قاعدة المعرفة' : '5. Knowledge Base',
                                desc: dir === 'rtl' ? 'أهم منهجيات الإدارة وحالات دراسية واقعية لتعزيز فهمك.' : 'Key management methodologies and real case studies to strengthen your understanding.',
                                href: '/academy',
                                cta: dir === 'rtl' ? 'استكشف المعرفة' : 'Explore Knowledge',
                                locked: false
                            },
                            {
                                icon: MessageSquare,
                                color: 'pink',
                                bg: 'bg-pink-50',
                                border: 'border-pink-100',
                                iconColor: 'text-pink-600',
                                title: dir === 'rtl' ? '7. استشارة الخبراء' : '7. Expert Consultation',
                                desc: dir === 'rtl' ? 'مراجعة قراراتك ومشاريعك الهامة عبر خبير متخصص.' : 'Review your key decisions and projects with a specialized expert.',
                                href: '/expert',
                                cta: dir === 'rtl' ? 'احجز استشارة' : 'Book Consultation',
                                locked: !isDiagnosisComplete
                            },
                            {
                                icon: Shield,
                                color: 'slate',
                                bg: 'bg-slate-900',
                                border: 'border-slate-800',
                                iconColor: 'text-white',
                                title: dir === 'rtl' ? 'التقرير التشخيصي الشامل' : 'Full Diagnostic Report',
                                desc: dir === 'rtl' ? 'وثيقة ذكاء مهني شاملة مع خارطة طريق 18 شهراً.' : 'Comprehensive career intelligence document with an 18-month strategic roadmap.',
                                href: '/strategic-report',
                                cta: dir === 'rtl' ? 'عرض التقرير' : 'View Report',
                                locked: !isDiagnosisComplete,
                                dark: true
                            },
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + idx * 0.06 }}
                                className={`rounded-2xl border p-5 flex flex-col gap-3 ${item.dark ? 'bg-slate-900 border-slate-800' : `bg-white ${item.border}`} ${item.locked ? 'opacity-50' : 'hover:shadow-lg transition-shadow'}`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.dark ? 'bg-white/10' : item.bg}`}>
                                    <item.icon className={`w-5 h-5 ${item.dark ? 'text-white' : item.iconColor}`} />
                                </div>
                                <div className="flex-1">
                                    <h4 className={`font-bold text-sm mb-1 ${item.dark ? 'text-white' : 'text-slate-900'}`}>{item.title}</h4>
                                    <p className={`text-xs leading-relaxed ${item.dark ? 'text-slate-400' : 'text-slate-500'}`}>{item.desc}</p>
                                </div>
                                {item.locked ? (
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${item.dark ? 'text-slate-600' : 'text-slate-300'}`}>
                                        {dir === 'rtl' ? '🔒 يتطلب إكمال التشخيص' : '🔒 Requires diagnosis completion'}
                                    </span>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className={`flex items-center gap-1 text-xs font-black uppercase tracking-widest ${item.dark ? 'text-blue-400 hover:text-blue-300' : `${item.iconColor} hover:opacity-70`} transition-opacity`}
                                    >
                                        {item.cta}
                                        <ArrowRight className={`w-3 h-3 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                                    </Link>
                                )}
                            </motion.div>
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
                        {dir === 'rtl' ? 'مركز الدعم والمساندة' : 'Support & Help Center'}
                    </h3>
                    <p className="text-slate-500 text-sm">
                        {dir === 'rtl' 
                            ? 'هل لديك استفسار أو واجهت مشكلة؟ نحن هنا لمساعدتك في رحلتك المهنية.' 
                            : 'Have a question or encountered an issue? We are here to help you in your career journey.'}
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
                        {dir === 'rtl' ? 'تواصل معنا بالإيميل' : 'Contact via Email'}
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
                        WhatsApp
                    </motion.a>
                </div>
            </motion.div>
        </div>
    );
}
