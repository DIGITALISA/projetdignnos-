"use client";

import { motion } from "framer-motion";
import { 
    Video, 
    Calendar, 
    Clock, 
    Users, 
    Search,
    Presentation,
    ArrowRight,
    Star,
    Sparkles,
    ShieldCheck
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";

interface Session {
    _id: string;
    title: string;
    date: string;
    time: string;
    expertName: string;
    meetingLink: string;
}

export default function ProfessionalLiveBriefingsPage() {
    const { dir, language } = useLanguage();
    const isRtl = dir === 'rtl';

    const [sessions, setSessions] = useState<Session[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const t = {
        ar: {
            title: "الجلسات المباشرة",
            subtitle: "جلسات استراتيجية مباشرة مع خبراء دوليين لمناقشة مسارك المهني وتطوير مهاراتك القيادية.",
            search: "البحث في الجلسات...",
            loading: "الوصول إلى سجل الجلسات الاستراتيجية...",
            noSessions: "لا توجد جلسات مجدولة حالياً",
            noSessionsDesc: "سيقوم فريق الخبراء بجدولة جلستك القادمة بناءً على تقدمك في التشخيص.",
            joinSession: "انضم للجلسة الآن",
            expert: "الخبير الاستراتيجي",
            statusActive: "رابط نشط",
            upcoming: "الجلسات القادمة",
            premiumLabel: "بروتوكول تنفيذي",
            mandatory: "حضور إلزامي"
        },
        en: {
            title: "Live Strategic Briefings",
            subtitle: "Direct strategic sessions with international experts to discuss your career path and develop your leadership skills.",
            search: "Search briefings...",
            loading: "Accessing strategic briefing registry...",
            noSessions: "No briefings currently scheduled",
            noSessionsDesc: "The expert team will schedule your next session based on your diagnostic progress.",
            joinSession: "Join Session Now",
            expert: "Strategic Expert",
            statusActive: "Link Active",
            upcoming: "Upcoming Sessions",
            premiumLabel: "Executive Protocol",
            mandatory: "Mandatory Attendance"
        },
        fr: {
            title: "Briefings Stratégiques en Direct",
            subtitle: "Sessions stratégiques directes avec des experts internationaux pour discuter de votre parcours et développer vos compétences de leadership.",
            search: "Rechercher des briefings...",
            loading: "Accès au registre des briefings stratégiques...",
            noSessions: "Aucun briefing prévu actuellement",
            noSessionsDesc: "L'équipe d'experts planifiera votre prochaine session en fonction de votre progression diagnostique.",
            joinSession: "Rejoindre la Session",
            expert: "Expert Stratégique",
            statusActive: "Lien Actif",
            upcoming: "Sessions à Venir",
            premiumLabel: "Protocole Exécutif",
            mandatory: "Présence Obligatoire"
        }
    }[language as 'ar' | 'en' | 'fr'] || {
        title: "Live Strategic Briefings",
        subtitle: "Direct strategic sessions with international experts to discuss your career path.",
        search: "Search briefings...",
        loading: "Loading briefings...",
        noSessions: "No briefings scheduled",
        noSessionsDesc: "Check back later for updates.",
        joinSession: "Join Now",
        expert: "Expert",
        statusActive: "Active",
        upcoming: "Upcoming",
        premiumLabel: "Premium",
        mandatory: "Mandatory"
    };

    const fetchSessions = async () => {
        setIsLoading(true);
        try {
            const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
            const userEmail = profile.email || profile.fullName;
            if (!userEmail) return;

            const res = await fetch(`/api/admin/sessions?userId=${encodeURIComponent(userEmail)}`);
            const data = await res.json();
            if (data.success) {
                setSessions(data.sessions);
            }
        } catch (error) {
            console.error("Failed to fetch sessions", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const filteredSessions = sessions.filter(session =>
        session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.expertName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50/50" dir={dir}>
            <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-10 pb-32">
                
                {/* Executive Header */}
                <div className={cn(
                    "flex flex-col md:flex-row justify-between items-start md:items-end gap-8",
                    isRtl && "md:flex-row-reverse"
                )}>
                    <div className={cn("space-y-4", isRtl && "text-right")}>
                        <div className={cn("flex items-center gap-3", isRtl && "flex-row-reverse")}>
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
                                <Presentation size={24} />
                            </div>
                            <span className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] flex items-center gap-2">
                                <ShieldCheck size={14} />
                                {t.premiumLabel}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none uppercase">
                            {t.title}
                        </h1>
                        <p className="text-slate-500 text-lg max-w-2xl font-medium leading-relaxed">
                            {t.subtitle}
                        </p>
                    </div>

                    {/* Elite Search */}
                    <div className="relative group w-full md:w-80">
                        <input
                            type="text"
                            placeholder={t.search}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={cn(
                                "w-full py-4 rounded-2xl bg-white border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm hover:shadow-md text-slate-900 font-bold placeholder:text-slate-400",
                                isRtl ? "pr-12 pl-4 text-right" : "pl-12 pr-4"
                            )}
                        />
                        <Search className={cn(
                            "absolute top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-hover:text-blue-600 transition-colors",
                            isRtl ? "right-4" : "left-4"
                        )} />
                    </div>
                </div>

                <div className="h-px bg-slate-200 w-full" />

                {/* Content Area */}
                {isLoading ? (
                    <div className="py-32 text-center flex flex-col items-center justify-center">
                        <div className="relative">
                            <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Video className="w-8 h-8 text-blue-600 animate-pulse" />
                            </div>
                        </div>
                        <p className="mt-8 text-slate-500 font-black uppercase tracking-[0.2em] text-xs">{t.loading}</p>
                    </div>
                ) : filteredSessions.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto py-24 px-10 bg-white rounded-[3rem] border border-slate-200 shadow-2xl text-center space-y-8 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-[100px] -mr-32 -mt-32 opacity-50" />
                        <div className="w-24 h-24 bg-blue-600 rounded-4xl flex items-center justify-center mx-auto shadow-2xl shadow-blue-200 rotate-12 relative z-10 transition-transform hover:rotate-0 duration-500">
                            <Star className="w-12 h-12 text-white" fill="white" />
                        </div>
                        <div className="relative z-10 space-y-4">
                            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{t.noSessions}</h2>
                            <p className="text-slate-500 font-bold text-lg max-w-xl mx-auto leading-relaxed">{t.noSessionsDesc}</p>
                        </div>
                    </motion.div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8">
                        {filteredSessions.map((session, index) => (
                            <motion.div
                                key={session._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-2 transition-all group relative overflow-hidden"
                            >
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                <div className={cn("flex justify-between items-start mb-10", isRtl && "flex-row-reverse")}>
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 rounded-3xl bg-slate-900 text-white flex items-center justify-center shadow-xl group-hover:bg-blue-600 transition-colors duration-500">
                                            <Presentation size={30} />
                                        </div>
                                        <div className={cn(isRtl && "text-right")}>
                                            <div className={cn("flex items-center gap-2 mb-1", isRtl && "flex-row-reverse")}>
                                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{t.upcoming}</span>
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-900 leading-none">{session.title}</h3>
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                                        {t.mandatory}
                                    </div>
                                </div>

                                <div className={cn("grid grid-cols-2 gap-6 mb-10", isRtl && "text-right")}>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Calendar size={12} className="text-blue-500" />
                                            DATE
                                        </p>
                                        <p className="text-lg font-black text-slate-800 tracking-tight">
                                            {new Date(session.date).toLocaleDateString(language === 'ar' ? 'ar-EG' : (language === 'fr' ? 'fr-FR' : 'en-US'), {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Clock size={12} className="text-blue-500" />
                                            TIME
                                        </p>
                                        <p className="text-lg font-black text-slate-800 tracking-tight">{session.time}</p>
                                    </div>
                                    <div className="col-span-2 space-y-2 pt-2">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Users size={12} className="text-blue-500" />
                                            {t.expert.toUpperCase()}
                                        </p>
                                        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-black text-xs">
                                                {session.expertName.charAt(0)}
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">{session.expertName}</span>
                                        </div>
                                    </div>
                                </div>

                                <a 
                                    href={session.meetingLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-4 py-5 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all active:scale-[0.98] group/btn"
                                >
                                    <Video size={18} />
                                    {t.joinSession}
                                    <ArrowRight size={18} className={cn("transition-transform group-hover/btn:translate-x-2", isRtl && "rotate-180")} />
                                </a>
                                
                                <div className={cn(
                                    "mt-4 flex items-center justify-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest opacity-60",
                                    isRtl && "flex-row-reverse"
                                )}>
                                    <Sparkles size={12} />
                                    {t.statusActive}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Guidance Footer */}
                <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden group">
                    <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 to-transparent pointer-events-none" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className={cn("space-y-4", isRtl && "text-right")}>
                            <h2 className="text-3xl font-black uppercase tracking-tight">Direct Executive Dialogue</h2>
                            <p className="text-slate-400 font-medium max-w-2xl leading-relaxed">
                                Our live briefings are designed for direct consultation. Ensure you have your latest strategic report ready for review during the session.
                            </p>
                        </div>
                        <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center text-blue-400 border border-white/20 transform group-hover:rotate-12 transition-transform duration-500 shrink-0">
                            <ShieldCheck size={40} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
