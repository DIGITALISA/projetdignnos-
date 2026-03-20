"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PlayCircle, Clock, CheckCircle, Lock, ArrowLeft, Video, Loader2, Calendar, User, ArrowRight, Plus, Minus, Users, Sparkles, Mail, Award } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";

interface Session {
    _id: string;
    title: string;
    videoUrl: string;
    duration: string;
}

interface Course {
    _id: string;
    title: string;
    instructor: string;
    sessions?: number;
    status: string;
    location: string;
    maxParticipants?: number;
    enrolled?: number;
    price?: number;
    date?: string;
    isAccessOpen?: boolean;
    allowedUsers?: string[];
    description?: string;
}

export default function ProfessionalWorkshopsPage() {
    const { t, language, dir } = useLanguage();
    const [courses, setCourses] = useState<Course[]>([]);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingSessions, setIsLoadingSessions] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [numParticipants, setNumParticipants] = useState<Record<string, number>>({});
    const [lockedParticipants, setLockedParticipants] = useState<Record<string, boolean>>({});
    const [pendingRequests, setPendingRequests] = useState<string[]>([]);
    const [diagnosisGaps, setDiagnosisGaps] = useState<string[]>([]);
    const [support, setSupport] = useState<{ adminEmail: string, adminWhatsapp: string } | null>(null);

    const fetchUserRequests = async () => {
        const savedDiagnosis = localStorage.getItem("cvAnalysis");
        if (savedDiagnosis) {
            try {
                const diag = JSON.parse(savedDiagnosis);
                setDiagnosisGaps(diag.skills?.gaps || []);
            } catch (e) { console.log(e); }
        }

        const profile = JSON.parse(localStorage.getItem("userProfile") || "{}");
        const identifier = profile.email || profile.fullName;
        if (!identifier) return;

        try {
            const res = await fetch(`/api/user/profile?userId=${encodeURIComponent(identifier)}`);
            const data = await res.json();
            if (data.success && data.profile.workshopAccessRequests) {
                setPendingRequests(data.profile.workshopAccessRequests);
            }
        } catch (error) {
            console.error("Error fetching user requests:", error);
        }
    };

    const fetchCourses = async () => {
        setIsLoading(true);
        try {
            const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
            const userEmail = profile.email || profile.fullName;

            if (!userEmail) return;

            const res = await fetch(`/api/user/courses?email=${encodeURIComponent(userEmail)}`, { cache: 'no-store' });
            const data = await res.json();
            
            if (Array.isArray(data)) {
                setCourses(data);
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSessions = async (courseId: string) => {
        setIsLoadingSessions(true);
        try {
            const res = await fetch(`/api/admin/sessions?courseId=${courseId}`);
            const data = await res.json();
            if (Array.isArray(data)) setSessions(data);
        } catch (error) {
            console.error("Error fetching sessions:", error);
        } finally {
            setIsLoadingSessions(false);
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

    useEffect(() => {
        fetchCourses();
        fetchUserRequests();
        fetchSupport();
    }, []);

    const handleSelectCourse = (course: Course) => {
        setSelectedCourse(course);
        fetchSessions(course._id);
    };

    const t_local = {
        ar: {
            title: "ورش العمل الإحترافية",
            subtitle: "رفع الكفاءة والمهارات التقنية والقيادية",
            expertBadge: "توصية الخبراء",
            seats: "مقاعد متبقية",
            investment: "الاستثمار المطلوب",
            confirm: "تأكيد المقعد",
            access: "دخول الورشة",
            pending: "قيد المراجعة",
            locked: "مغلق حالياً",
            noWorkshops: "لا توجد ورش عمل متاحة حالياً",
            waitingDesc: "سيقوم فريقنا بإدراج الورش المناسبة لمسارك المهني قريباً.",
            myCertificates: "شواهدي المعتمدة"
        },
        fr: {
            title: "Ateliers Professionnels",
            subtitle: "Développement des compétences stratégiques et techniques",
            expertBadge: "Recommandé par l'expert",
            seats: "sièges restants",
            investment: "Investissement",
            confirm: "Confirmer mon siège",
            access: "Accéder à l'Atelier",
            pending: "En attente",
            locked: "Accès verrouillé",
            noWorkshops: "Aucun atelier disponible",
            waitingDesc: "L'équipe publiera bientôt les ateliers adaptés à votre parcours.",
            myCertificates: "Mes Attestations"
        },
        en: {
            title: "Professional Workshops",
            subtitle: "Strategic and technical skill development",
            expertBadge: "Expert's choice",
            seats: "seats left",
            investment: "Investment",
            confirm: "Confirm My Seat",
            access: "Access Workshop",
            pending: "Pending",
            locked: "Access Locked",
            noWorkshops: "No workshops available",
            waitingDesc: "Our team will list relevant workshops soon.",
            myCertificates: "My Certificates"
        }
    }[language as 'ar' | 'en' | 'fr'] || {
        title: "Professional Workshops",
        subtitle: "Skill development center",
        expertBadge: "Recommended",
        seats: "seats left",
        investment: "Investment",
        confirm: "Confirm Seat",
        access: "Access",
        pending: "Pending",
        locked: "Locked",
        noWorkshops: "None available",
        waitingDesc: "Check back later.",
        myCertificates: "My Certificates"
    };

    if (selectedCourse) {
        return (
            <div className="flex-1 max-w-7xl mx-auto p-4 md:p-8" dir={dir}>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => setSelectedCourse(null)}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-4 group font-black text-xs uppercase tracking-widest"
                    >
                        <ArrowLeft className={cn("w-4 h-4 transition-transform", dir === 'rtl' ? "group-hover:translate-x-1 rotate-180" : "group-hover:-translate-x-1")} />
                        {t.workshops?.backToSchedule || "Retour"}
                    </button>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-2 tracking-tight uppercase">{selectedCourse.title}</h1>
                    <div className="flex flex-wrap items-center gap-6 text-slate-500 font-bold text-xs uppercase tracking-widest">
                        <span className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg"><User size={14} className="text-indigo-600" /> {t.workshops?.leadConsultant || "Consultant"}: {selectedCourse.instructor}</span>
                        <span className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg"><Video size={14} className="text-indigo-600" /> {selectedCourse.sessions || 0} Modules Vidéo</span>
                    </div>
                </motion.div>

                <div className="space-y-4">
                    {isLoadingSessions ? (
                        <div className="py-20 text-center">
                            <Loader2 className="w-12 h-12 animate-spin mx-auto text-indigo-600 mb-4" />
                            <p className="text-slate-500 font-black text-xs uppercase tracking-widest">Chargement des modules...</p>
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className="py-12 text-center bg-white rounded-4xl border border-dashed border-slate-200">
                            <p className="text-slate-400 font-bold uppercase text-sm tracking-widest">Aucun enregistrement disponible pour le moment.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid gap-4">
                                {sessions.map((session, index) => (
                                    <motion.div
                                        key={session._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white p-6 rounded-4xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-indigo-200 hover:shadow-xl transition-all shadow-sm"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg shadow-inner">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <h3 className="font-black text-slate-900 text-lg">{session.title}</h3>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">{t.workshops?.replayDesc || "Module de Formation Professionnelle"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-[10px] text-indigo-600 font-black px-4 py-2 bg-indigo-50 rounded-xl border border-indigo-100 uppercase tracking-widest">{session.duration}</span>
                                            <a
                                                href={session.videoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-2xl hover:bg-indigo-600 transition-all text-xs font-black uppercase tracking-widest shadow-xl active:scale-95"
                                            >
                                                <PlayCircle className="w-5 h-5 ml-1" />
                                                Visionner
                                            </a>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-12 p-10 bg-slate-900 rounded-[3rem] text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32" />
                                <div className="relative z-10 text-center lg:text-start">
                                    <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
                                        <Award size={24} className="text-indigo-400" />
                                        <h2 className="text-2xl font-black uppercase tracking-tight">{t.workshops?.accreditationTitle || "Certification de Maîtrise"}</h2>
                                    </div>
                                    <p className="text-slate-400 font-medium max-w-xl">{t.workshops?.accreditationDesc || "Obtenez votre attestation de participation et de réussite une fois le cursus terminé."}</p>
                                </div>
                                <button
                                    onClick={async () => {
                                        const profile = JSON.parse(localStorage.getItem("userProfile") || "{}");
                                        const userId = profile.email || profile.fullName;
                                        
                                        const res = await fetch('/api/user/workshop-attestation/request', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                                userId: userId,
                                                workshopTitle: selectedCourse.title
                                            })
                                        });
                                        const data = await res.json();
                                        if (data.success) {
                                            alert("Demande envoyée ! Un consultant validera votre attestation prochainement.");
                                        } else {
                                            alert(data.error || "Une erreur est survenue.");
                                        }
                                    }}
                                    className="relative z-10 px-10 py-5 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-indigo-600 hover:text-white transition-all active:scale-95"
                                >
                                    {t.workshops?.claimCertificate || "Réclamer mon Attestation"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 max-w-7xl mx-auto p-4 md:p-8" dir={dir}>
            <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
                            <Video size={20} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Executive Academy</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-4 text-slate-900 tracking-tighter uppercase">
                        {t_local.title}
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl font-medium leading-relaxed">
                        {t_local.subtitle}
                    </p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <Link
                        href="/professional/attestations"
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-900 hover:text-white transition-all shadow-sm hover:shadow-xl group"
                    >
                        <Award size={18} className="text-indigo-600 group-hover:text-white transition-colors" />
                        {t_local.myCertificates}
                    </Link>
                </div>
            </div>

            {isLoading ? (
                <div className="py-20 text-center">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto text-indigo-600 mb-4" />
                    <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Initialisation des ateliers...</p>
                </div>
            ) : courses.length === 0 ? (
                <div className="max-w-4xl mx-auto py-16 px-10 bg-white rounded-[3rem] border border-slate-200 shadow-2xl text-center space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-[100px] -mr-32 -mt-32 opacity-50" />
                    <div className="w-20 h-20 bg-indigo-600 rounded-4xl flex items-center justify-center mx-auto shadow-xl shadow-indigo-100 rotate-12 relative z-10 transition-transform hover:rotate-0 duration-500">
                        <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <div className="relative z-10 space-y-4">
                        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{t_local.noWorkshops}</h2>
                        <p className="text-slate-500 font-bold text-lg max-w-xl mx-auto">{t_local.waitingDesc}</p>
                    </div>
                    <div className="pt-8 flex flex-wrap justify-center gap-6 relative z-10">
                        <a href={`mailto:${support?.adminEmail || "support@careerupgrade.ai"}`} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-xl hover:bg-indigo-600 transition-all">
                            <Mail size={18} /> Support Email
                        </a>
                        <a href={`https://wa.me/${(support?.adminWhatsapp || "").replace(/\D/g, "")}`} className="px-8 py-4 bg-[#25D366] text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-xl transition-all">
                            WhatsApp Expert
                        </a>
                    </div>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course, index) => {
                        const isRecommended = diagnosisGaps.length > 0 && diagnosisGaps.some(gap => 
                            course.title.toLowerCase().includes(gap.toLowerCase()) || 
                            (course.description?.toLowerCase().includes(gap.toLowerCase()))
                        );

                        return (
                            <motion.div
                                key={course._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:border-indigo-300 transition-all group flex flex-col relative"
                            >
                                {/* Thumbnail-like Area */}
                                <div className="h-48 bg-slate-900 flex items-center justify-center relative group-hover:bg-indigo-950 transition-colors">
                                    <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 to-transparent pointer-events-none" />
                                    <Video size={48} className="text-indigo-400 opacity-20 group-hover:scale-110 transition-transform" />
                                    
                                    {isRecommended && (
                                        <div className="absolute top-4 left-4 z-20">
                                            <div className="bg-white/90 backdrop-blur-md text-indigo-600 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-white/50 shadow-lg flex items-center gap-1.5 animate-bounce">
                                                <Sparkles size={12} />
                                                <span>{t_local.expertBadge}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="absolute top-4 right-4 z-20">
                                        <div className="bg-slate-900/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-white/10 shadow-lg flex items-center gap-1.5">
                                            <Users size={12} className="text-indigo-400" />
                                            <span>{(course.maxParticipants || 10) - (course.enrolled || 0)} {t_local.seats}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 flex-1 flex flex-col">
                                    <h3 className="text-xl font-black text-slate-900 mb-6 group-hover:text-indigo-600 transition-colors leading-tight h-14 line-clamp-2">
                                        {course.title}
                                    </h3>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                                                <User size={14} />
                                            </div>
                                            <span className="text-xs font-bold text-slate-500 uppercase">{course.instructor}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                                                <Calendar size={14} />
                                            </div>
                                            <span className="text-xs font-bold text-slate-500 uppercase">{course.date || "Scheduled Soon"}</span>
                                        </div>
                                    </div>

                                    {/* Enrollment Area */}
                                    <div className="mb-8 p-6 bg-slate-50 rounded-4xl border border-slate-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inscriptions</span>
                                            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-1 shadow-inner">
                                                <button
                                                    disabled={lockedParticipants[course._id] || (numParticipants[course._id] || 1) <= 1}
                                                    onClick={() => setNumParticipants(prev => ({ ...prev, [course._id]: (prev[course._id] || 1) - 1 }))}
                                                    className="w-8 h-8 rounded-lg hover:bg-slate-50 flex items-center justify-center disabled:opacity-30 transition-all text-slate-400 hover:text-indigo-600"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-8 text-center font-black text-slate-900 text-sm">{numParticipants[course._id] || 1}</span>
                                                <button
                                                    disabled={lockedParticipants[course._id]}
                                                    onClick={() => setNumParticipants(prev => ({ ...prev, [course._id]: (prev[course._id] || 1) + 1 }))}
                                                    className="w-8 h-8 rounded-lg hover:bg-slate-50 flex items-center justify-center disabled:opacity-30 transition-all text-slate-400 hover:text-indigo-600"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t_local.investment}</span>
                                                <span className="text-xl font-black text-indigo-600">
                                                    {Math.round((course.price || 0) / (numParticipants[course._id] || 1))}€
                                                </span>
                                            </div>
                                            
                                            {!lockedParticipants[course._id] && !pendingRequests.includes(course._id) ? (
                                                <button
                                                    onClick={async () => {
                                                        const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
                                                        const userEmail = profile.email || profile.fullName;
                                                        try {
                                                            const res = await fetch('/api/user/workshop-access/request', {
                                                                method: 'POST',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify({ userId: userEmail, courseId: course._id })
                                                            });
                                                            const data = await res.json();
                                                            if (data.success) {
                                                                setPendingRequests(prev => [...prev, course._id]);
                                                                setLockedParticipants(prev => ({ ...prev, [course._id]: true }));
                                                            }
                                                        } catch (err) { console.error(err); }
                                                    }}
                                                    className="px-6 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
                                                >
                                                    {t_local.confirm}
                                                </button>
                                            ) : (
                                                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
                                                    <CheckCircle size={14} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{t_local.pending}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
                                            const userEmail = (profile.email || "").toLowerCase().trim();
                                            const allowedList = (course.allowedUsers || []).map((u: string) => u.toLowerCase().trim());
                                            const isRestricted = allowedList.length > 0;
                                            const isAllowed = !isRestricted || allowedList.includes(userEmail);
                                            const isOpen = course.isAccessOpen;

                                            if (isAllowed && isOpen) {
                                                handleSelectCourse(course);
                                            } else if (pendingRequests.includes(course._id)) {
                                                alert(t.workshops?.alerts?.pending || "Accès en cours de validation.");
                                            } else if (!isAllowed) {
                                                alert(t.workshops?.alerts?.denied || "Accès restreint.");
                                            } else if (!isOpen) {
                                                alert(t.workshops?.alerts?.notStarted || "L'accès à cette session n'est pas encore ouvert.");
                                            }
                                        }}
                                        className={cn(
                                            "w-full py-4 rounded-2xl font-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 uppercase text-xs tracking-widest",
                                            (() => {
                                                const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
                                                const userEmail = (profile.email || "").toLowerCase().trim();
                                                const allowedList = (course.allowedUsers || []).map((u: string) => u.toLowerCase().trim());
                                                const isAllowed = allowedList.length === 0 || allowedList.includes(userEmail);
                                                return isAllowed && course.isAccessOpen;
                                            })() ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20" : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                        )}
                                    >
                                        {(() => {
                                            const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
                                            const userEmail = (profile.email || "").toLowerCase().trim();
                                            const allowedList = (course.allowedUsers || []).map((u: string) => u.toLowerCase().trim());
                                            const isAllowed = allowedList.length === 0 || allowedList.includes(userEmail);

                                            if (isAllowed) {
                                                return course.isAccessOpen ? (
                                                    <>{t_local.access} <ArrowRight size={16} className={dir === 'rtl' ? "rotate-180" : ""} /></>
                                                ) : (
                                                    <>Session Fermée <Clock size={16} /></>
                                                )
                                            } else if (pendingRequests.includes(course._id)) {
                                                return <>En cours <Clock size={16} /></>
                                            } else {
                                                return <>{t_local.locked} <Lock size={16} /></>
                                            }
                                        })()}
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
