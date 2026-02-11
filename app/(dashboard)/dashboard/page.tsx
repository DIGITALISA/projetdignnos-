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
    ChevronRight,
    Shield,
    Calendar
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

export default function DashboardPage() {
    const { t, dir } = useLanguage();
    const [userName, setUserName] = useState("");
    const [stats, setStats] = useState([
        { label: t.dashboard.stats.skillsGained, value: "0", icon: Target, color: "blue", bg: "bg-blue-50", text: "text-blue-600" },
        { label: t.dashboard.stats.hoursLearned, value: "0", icon: Clock, color: "purple", bg: "bg-purple-50", text: "text-purple-600" },
        { label: t.dashboard.stats.certificates, value: "0", icon: Award, color: "yellow", bg: "bg-yellow-50", text: "text-yellow-600" },
    ]);
    const [hasStarted, setHasStarted] = useState(false);
    const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const savedProfile = localStorage.getItem("userProfile");
                const profile = savedProfile ? JSON.parse(savedProfile) : null;
                const userId = profile?.email || profile?.fullName;

                if (profile?.fullName) {
                    setUserName(profile.fullName.split(' ')[0] || profile.fullName);
                }

                if (userId) {
                    // Add timeout protection to prevent infinite loading
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

                    try {
                        const res = await fetch(`/api/user/progress?userId=${encodeURIComponent(userId)}`, {
                            signal: controller.signal
                        });
                        clearTimeout(timeoutId);
                        
                        const response = await res.json();

                        if (response.hasData && response.data) {
                            const data = response.data;
                            setHasStarted(true);
                            if (data.liveSessions) setLiveSessions(data.liveSessions);

                            // Calculate stats or other info if needed
                            if (data.cvAnalysis) {
                                const hasSCI = !!data.cvAnalysis.sciReport;
                                setStats([
                                    { label: t.dashboard.stats.skillsGained, value: String(data.cvAnalysis.skills?.technical?.length || 0), icon: Target, color: "blue", bg: "bg-blue-50", text: "text-blue-600" },
                                    { label: t.dashboard.stats.hoursLearned, value: "0.5", icon: Clock, color: "purple", bg: "bg-purple-50", text: "text-purple-600" },
                                    { label: t.dashboard.stats.certificates, value: hasSCI ? "1" : "0", icon: Award, color: "yellow", bg: "bg-yellow-50", text: "text-yellow-600" },
                                ]);

                                // Sync back to localStorage for other pages
                                localStorage.setItem('cvAnalysis', JSON.stringify(data.cvAnalysis));
                                if (data.interviewEvaluation) localStorage.setItem('interviewEvaluation', JSON.stringify(data.interviewEvaluation));
                                if (data.roleSuggestions) localStorage.setItem('roleSuggestions', JSON.stringify(data.roleSuggestions));
                                if (data.selectedRole) localStorage.setItem('selectedRole', JSON.stringify(data.selectedRole));
                                if (data.language) localStorage.setItem('selectedLanguage', data.language);

                                // ALSO SYNC ACCESS FLAGS (non-blocking)
                                fetch(`/api/user/readiness?userId=${encodeURIComponent(userId)}`)
                                    .then(readyRes => readyRes.json())
                                    .then(readyData => {
                                        if (readyData.success) {
                                            // Only update and trigger event if there's an actual change to prevent infinite loops
                                            if (profile.canAccessCertificates !== readyData.certReady || 
                                                profile.canAccessRecommendations !== readyData.recReady) {
                                                
                                                const updatedProfile = {
                                                    ...profile,
                                                    canAccessCertificates: readyData.certReady,
                                                    canAccessRecommendations: readyData.recReady
                                                };
                                                localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
                                                // Trigger event for Sidebar and other components to refresh
                                                window.dispatchEvent(new Event("profileUpdated"));
                                            }
                                        }
                                    })
                                    .catch(err => {
                                        console.error("Failed to sync access flags in dashboard", err);
                                    });
                            }
                        }
                    } catch (fetchError: unknown) {
                        clearTimeout(timeoutId);
                        const isAbort = fetchError instanceof Error && fetchError.name === 'AbortError';
                        if (isAbort) {
                            console.warn('Dashboard data fetch timed out');
                        } else {
                            console.error("Failed to fetch progress data", fetchError);
                        }
                        // Fallback to localStorage even on error
                        const cvAnalysis = localStorage.getItem('cvAnalysis');
                        if (cvAnalysis) {
                            setHasStarted(true);
                        }
                    }
                } else {
                    // Fallback to localStorage if no userId (not logged in or first visit)
                    const cvAnalysis = localStorage.getItem('cvAnalysis');
                    if (cvAnalysis) {
                        setHasStarted(true);
                    }
                }

            } catch (e: unknown) {
                console.error("Failed to load dashboard data", e);
            }
        };

        loadDashboardData();
        window.addEventListener("profileUpdated", loadDashboardData);
        return () => window.removeEventListener("profileUpdated", loadDashboardData);
    }, [t]);

    const steps = [
        {
            title: t.dashboard.journey.stages.diagnosis,
            description: t.dashboard.journey.stages.diagnosisDesc,
            status: hasStarted ? "completed" : "in-progress",
            icon: Target,
            href: "/assessment/cv-upload",
            color: "bg-blue-50 text-blue-600",
            borderColor: "border-blue-200"
        },
        {
            title: t.dashboard.journey.stages.simulation,
            description: t.dashboard.journey.stages.simulationDesc,
            status: hasStarted ? "in-progress" : "locked",
            icon: Zap,
            href: "/simulation",
            color: "bg-purple-50 text-purple-600",
            borderColor: "border-purple-200"
        },
        {
            title: t.dashboard.journey.stages.training,
            description: t.dashboard.journey.stages.trainingDesc,
            status: "locked",
            icon: PlayCircle,
            href: "/training",
            color: "bg-green-50 text-green-600",
            borderColor: "border-slate-100"
        },
        {
            title: t.dashboard.journey.stages.library,
            description: t.dashboard.journey.stages.libraryDesc,
            status: "locked",
            icon: BookOpen,
            href: "/library",
            color: "bg-orange-50 text-orange-600",
            borderColor: "border-slate-100"
        },
        {
            title: t.dashboard.journey.stages.expert,
            description: t.dashboard.journey.stages.expertDesc,
            status: "locked",
            icon: MessageSquare,
            href: "/expert",
            color: "bg-pink-50 text-pink-600",
            borderColor: "border-slate-100"
        },
        {
            title: t.dashboard.journey.stages.strategicReport,
            description: t.dashboard.journey.stages.strategicReportDesc,
            status: hasStarted 
                ? (stats[2].value === "1" ? "completed" : "in-progress") 
                : "locked",
            icon: Shield,
            href: "/strategic-report",
            color: "bg-slate-900 text-white",
            borderColor: "border-slate-800"
        }
    ];

    const resources = [
        { id: 1, title: "Advanced Leadership", type: "Video Course", duration: "45m", icon: PlayCircle, color: "blue" },
        { id: 2, title: "Strategic Thinking", type: "Guide", duration: "15m read", icon: BookOpen, color: "purple" },
        { id: 3, title: "Mock Interview", type: "Interactive", duration: "30m", icon: MessageSquare, color: "green" },
    ];

    return (
        <div dir={dir} className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 pb-24 md:pb-8">
            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col md:flex-row md:items-end justify-between gap-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
            >
                <div className={dir === 'rtl' ? 'flex-1' : ''}>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                        {t.dashboard.welcome}, {userName} {dir === 'rtl' ? '👋' : '👋'}
                    </h1>
                    <p className="text-slate-500 text-sm sm:text-base md:text-lg max-w-2xl">
                        {t.dashboard.subtitle}
                    </p>
                </div>
                {/* Only show "Top Learner" badge if they have actually done something */}
                {hasStarted && (
                    <div className={`flex items-center gap-2 bg-white px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-slate-200 shadow-sm w-fit ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                        <span className="font-semibold text-xs md:text-sm text-slate-700">{t.dashboard.topLearner}</span>
                    </div>
                )}
            </motion.div>

            {/* Stats Grid - Mobile Optimized */}
            <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex sm:flex-col lg:flex-row items-center sm:items-start sm:text-left text-center gap-4 ${dir === 'rtl' ? 'sm:text-right flex-row-reverse' : ''}`}
                    >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.text}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-2xl font-bold text-slate-900 truncate">{stat.value}</p>
                            <p className="text-xs md:text-sm text-slate-500 font-medium leading-tight truncate">{stat.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Progress Section - Bento Style */}
            <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
                {/* Left Col: Current Focus */}
                <motion.div
                    initial={{ opacity: 0, x: dir === 'rtl' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm flex flex-col relative overflow-hidden group"
                >
                    {hasStarted ? (
                        <>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100/50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                            <div className={`flex items-center justify-between mb-6 md:mb-8 relative z-10 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                <h2 className={`text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                    <Zap className="w-5 h-5 text-purple-600" />
                                    {t.dashboard.currentFocus.title}
                                </h2>
                                <Link href="/simulation" className={`text-xs md:text-sm font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 group-hover:gap-2 transition-all ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                    {t.dashboard.currentFocus.continue}
                                    <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                                </Link>
                            </div>

                            <div className={`flex-1 bg-linear-to-br from-purple-50 to-white rounded-2xl p-5 md:p-8 flex flex-col sm:flex-row items-center gap-6 md:gap-8 border border-purple-100/50 relative ${dir === 'rtl' ? 'sm:flex-row-reverse text-center sm:text-right' : 'text-center sm:text-left'}`}>
                                <div className="relative z-10 flex-1 space-y-3 md:space-y-4 w-full">
                                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-[10px] md:text-xs font-bold rounded-full uppercase tracking-wider">
                                        {dir === 'rtl' ? 'قيد التنفيذ' : 'In Progress'}
                                    </span>
                                    <h3 className="text-xl md:text-2xl font-bold text-slate-900">Career Diagnosis</h3>
                                    <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                                        {dir === 'rtl' ? 'تم تحليل سيرتك الذاتية بنجاح. الخطوة التالية: ابدأ المحاكاة!' : 'Your CV analysis is complete. Next step: Start the simulation!'}
                                    </p>
                                </div>
                                <div className="relative z-10 w-full sm:w-auto mt-2 sm:mt-0 shrink-0">
                                    <Link href="/simulation" className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 active:scale-95 transition-all text-sm md:text-base inline-block text-center whitespace-nowrap">
                                        {t.dashboard.currentFocus.continue}
                                    </Link>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Empty State / Call to Action */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                            <div className={`flex flex-col items-center justify-center h-full text-center space-y-6 relative z-10 py-8`}>
                                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                                    <Target className="w-10 h-10 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                        {dir === 'rtl' ? 'لنبدأ رحلتك المهنية' : 'Let\'s Start Your Career Journey'}
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

                {/* Right Col: Timeline */}
                <motion.div
                    initial={{ opacity: 0, x: dir === 'rtl' ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className={`bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-hidden h-fit ${dir === 'rtl' ? 'text-right' : ''}`}
                >
                    <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-6">{t.dashboard.journey.title}</h2>
                    <div className="relative space-y-0">
                        {/* Vertical Line */}
                        <div className={`absolute top-4 bottom-4 w-[2px] bg-slate-100 ${dir === 'rtl' ? 'right-[23px] md:right-[27px]' : 'left-[23px] md:left-[27px]'}`} />

                        {steps.map((step, idx) => (
                            <div key={idx} className={`relative flex items-start gap-3 md:gap-4 pb-6 last:pb-0 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                {/* Status Indicator */}
                                <div className={`relative z-10 w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-2xl flex items-center justify-center border-2 transition-all ${step.status === 'completed' || step.status === 'in-progress' ? 'bg-white ' + step.borderColor : 'bg-slate-50 border-transparent text-slate-300'}`}>
                                    {step.status === 'completed' ? (
                                        <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
                                    ) : (
                                        <step.icon className={`w-5 h-5 md:w-6 md:h-6`} />
                                    )}
                                </div>

                                <div className="pt-1.5 md:pt-2">
                                    <h3 className={`font-bold text-sm md:text-base ${step.status === 'locked' ? 'text-slate-400' : 'text-slate-900'}`}>
                                        {step.title}
                                    </h3>
                                    <p className="text-xs md:text-sm text-slate-400 leading-snug mt-0.5">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Live Sessions Section - New */}
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
                                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg">{session.title}</h4>
                                        <p className="text-slate-400 text-xs font-medium">{t.dashboard.liveSessions.expert}: {session.expertName}</p>
                                    </div>
                                </div>
                                <div className="space-y-3 mb-8">
                                    <div className={`flex items-center gap-3 text-slate-300 text-sm font-medium ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                        <Calendar size={16} className="text-blue-400" />
                                        <span>{new Date(session.date).toLocaleDateString(undefined, { day: 'numeric', month: 'long' })}</span>
                                    </div>
                                    <div className={`flex items-center gap-3 text-slate-300 text-sm font-medium ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
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

            {/* Recommended Section - Horizontal Scroll on Mobile */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className={dir === 'rtl' ? 'text-right' : ''}
            >
                <div className={`flex items-center justify-between mb-4 md:mb-6 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900">{t.dashboard.recommended.title}</h2>
                    <Link href="/library" className={`text-xs md:text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        {t.dashboard.recommended.seeAll}
                        <ChevronRight className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                    </Link>
                </div>

                {/* Scroll Container */}
                <div className={`flex overflow-x-auto pb-4 gap-4 -mx-4 px-4 md:grid md:grid-cols-3 md:gap-6 md:mx-0 md:px-0 scrollbar-none snap-x ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    {resources.map((item) => (
                        <div
                            key={item.id}
                            className={`min-w-[280px] md:min-w-0 bg-white p-5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all cursor-pointer group snap-center ${dir === 'rtl' ? 'text-right' : ''}`}
                        >
                            <div className={`flex items-start gap-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${item.color}-50 text-${item.color}-600 group-hover:bg-${item.color}-600 group-hover:text-white transition-colors`}>
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h4 className={`font-bold text-slate-900 group-hover:text-${item.color}-700 transition-colors`}>{item.title}</h4>
                                    <div className={`flex items-center gap-2 mt-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                        <span className="text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-500">{item.type}</span>
                                        <span className="text-xs text-slate-400">• {item.duration}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
