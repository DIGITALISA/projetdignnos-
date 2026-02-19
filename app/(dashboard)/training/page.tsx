"use client";

import { motion } from "framer-motion";
import { PlayCircle, Clock, CheckCircle, Lock, ArrowLeft, Video, Loader2, Calendar, User, ArrowRight, Plus, Minus, Users, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";

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

export default function TrainingPage() {
    const { dir } = useLanguage();
    const [courses, setCourses] = useState<Course[]>([]);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingSessions, setIsLoadingSessions] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [numParticipants, setNumParticipants] = useState<Record<string, number>>({});
    const [lockedParticipants, setLockedParticipants] = useState<Record<string, boolean>>({});
    const [pendingRequests, setPendingRequests] = useState<string[]>([]);
    const [diagnosisGaps, setDiagnosisGaps] = useState<string[]>([]);

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

    useEffect(() => {
        fetchCourses();
        fetchUserRequests();
    }, []);

    const handleSelectCourse = (course: Course) => {
        setSelectedCourse(course);
        fetchSessions(course._id);
    };

    if (selectedCourse) {
        return (
            <div className="flex-1">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => setSelectedCourse(null)}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-4 group font-medium"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Schedule
                    </button>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">{selectedCourse.title}</h1>
                    <div className="flex items-center gap-4 text-slate-500 font-medium">
                        <span className="flex items-center gap-1"><User size={16} /> Lead Consultant: {selectedCourse.instructor}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Video size={16} /> {selectedCourse.sessions || 0} Recorded Sessions</span>
                    </div>
                </motion.div>

                <div className="space-y-4">
                    {isLoadingSessions ? (
                        <div className="py-20 text-center">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
                            <p className="text-slate-500">Retrieving session archives...</p>
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className="py-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                            <p className="text-slate-400">No session recordings available for this workshop yet.</p>
                        </div>
                    ) : (
                        <>
                            {sessions.map((session, index) => (
                                <motion.div
                                    key={session._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-200 transition-all shadow-sm"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900">{session.title}</h3>
                                            <p className="text-xs text-slate-500">Recorded Session Replay</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <a
                                            href={session.videoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-700 rounded-lg transition-all text-sm font-medium border border-slate-200 hover:border-blue-600"
                                        >
                                            <PlayCircle className="w-4 h-4" />
                                            Watch Replay
                                        </a>
                                        <span className="text-xs text-slate-400 font-bold px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">{session.duration}</span>
                                    </div>
                                </motion.div>
                            ))}

                            <div className="mt-12 p-8 bg-slate-900 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-slate-900/20">
                                <div>
                                    <h2 className="text-2xl font-bold mb-2 text-white">Workshop Accreditation</h2>
                                    <p className="text-slate-400">Completed all session replays? Claim your workshop participation certificate. Our consultant will review and grant access.</p>
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
                                            alert("Request sent! Our consultant will grant your attestation shortly.");
                                        } else {
                                            alert(data.error || "Failed to send request.");
                                        }
                                    }}
                                    className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg hover:bg-blue-500 transition-all"
                                >
                                    Claim Certificate
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1">
            <div className="mb-12">
                <h1 className="text-4xl font-black mb-2 text-slate-900 tracking-tight uppercase">Executive <span className="text-blue-600">Workshops</span></h1>
                <p className="text-slate-500 text-lg font-medium">
                    Join live interactive sessions with industry experts. Recordings available after the event.
                </p>
            </div>

            {isLoading ? (
                <div className="py-20 text-center">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-600 mb-4" />
                    <p className="text-slate-500 font-medium">Loading workshop schedule...</p>
                </div>
            ) : courses.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto py-12 px-8 bg-white rounded-[3rem] border border-slate-200 shadow-2xl relative overflow-hidden"
                >
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl pointer-events-none" />
                    
                    <div className="relative z-10 text-center space-y-8">
                        <div className="w-20 h-20 bg-blue-600 rounded-4xl flex items-center justify-center mx-auto shadow-xl shadow-blue-200 rotate-6">
                            <Sparkles className="w-10 h-10 text-white" />
                        </div>
                        
                        <div className="space-y-4 max-w-2xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                                {dir === 'rtl' ? 'بروتوكول تخصيص الورشات التنفيذية' : 'Executive Workshop Customization Protocol'}
                            </h2>
                            <p className="text-slate-500 font-medium text-lg leading-relaxed">
                                {dir === 'rtl' 
                                    ? 'يتم الآن تحليل نتائج تشخيصك الشامل من قبل خبرائنا لتصميم ورشة عمل مطابقة تماماً لاحتياجاتك المهنية. نعتمد نهجاً دقيقاً لضمان أقصى استفادة.' 
                                    : 'Our experts are currently analyzing your comprehensive diagnostic results to design a workshop that perfectly matches your professional needs.'}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 pt-6">
                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 transition-all hover:shadow-lg text-start flex gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-slate-200 shrink-0 text-blue-600 shadow-sm">
                                    <Clock size={24} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">
                                        {dir === 'rtl' ? 'مراجعة خبير بشري (24-72 ساعة)' : 'Human Expert Review (24-72h)'}
                                    </h3>
                                    <p className="text-xs text-slate-500 font-bold leading-relaxed">
                                        {dir === 'rtl' 
                                            ? 'بعد قراءة التشخيص، يحدد الخبير الموديولات، الساعات، والأهداف التدريبية المخصصة لك بدقة.'
                                            : 'After reviewing your diagnosis, an expert defines your modules, hours, and personalized training objectives.'}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-4xl border border-slate-100 transition-all hover:shadow-lg text-start flex gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-slate-200 shrink-0 text-amber-600 shadow-sm">
                                    <Users size={24} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">
                                        {dir === 'rtl' ? 'فلترة المجموعات المصغرة' : 'Micro-Group Filtering'}
                                    </h3>
                                    <p className="text-xs text-slate-500 font-bold leading-relaxed">
                                        {dir === 'rtl' 
                                            ? 'نجمعك مع مشاركين (بحد أقصى 5) لديهم نفس المستوى والاحتياجات لضمان جودة التفاعل.'
                                            : 'We match you with participants (max 5) sharing the same professional level and needs for high-quality interaction.'}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-4xl border border-slate-100 transition-all hover:shadow-lg text-start flex gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-slate-200 shrink-0 text-emerald-600 shadow-sm">
                                    <CheckCircle size={24} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">
                                        {dir === 'rtl' ? 'تحكم مرن بالعدد والتكلفة' : 'Flexible Enrollment & Cost'}
                                    </h3>
                                    <p className="text-xs text-slate-500 font-bold leading-relaxed">
                                        {dir === 'rtl' 
                                            ? 'يمكنك الاختيار بين جلسة فردية أو مجموعة (2-3 أشخاص). كلما زاد عدد المجموعة، قلت التكلفة الفردية.'
                                            : 'Choose between individual sessions or groups (2-3). Individual costs decrease as group size increases.'}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-4xl border border-slate-100 transition-all hover:shadow-lg text-start flex gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-slate-200 shrink-0 text-indigo-600 shadow-sm">
                                    <Calendar size={24} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">
                                        {dir === 'rtl' ? 'تأكيد الموعد النهائي (7 أيام)' : 'Final Scheduling (7 Days)'}
                                    </h3>
                                    <p className="text-xs text-slate-500 font-bold leading-relaxed">
                                        {dir === 'rtl' 
                                            ? 'بمجرد اكتمال المجموعة المطلوبة، يتم تثبيت مواعيد الجلسات بحد أقصى 7 أيام من تاريخ التأكيد.'
                                            : 'Once the requested group is formed, session dates are finalized within a maximum of 7 days.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-700 rounded-2xl font-black text-xs uppercase tracking-widest">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {dir === 'rtl' ? 'بانتظام اكتمال التشخيص وتخصيص الجلسات' : 'Waiting for diagnosis completion and session customization'}
                            </div>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course, index) => (
                        <motion.div
                            key={course._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:border-blue-300 transition-all group flex flex-col relative`}
                        >
                            {/* Recommendation Badge */}
                            {(() => {
                                const isRecommended = diagnosisGaps.length > 0 && diagnosisGaps.some(gap => 
                                    course.title.toLowerCase().includes(gap.toLowerCase()) || 
                                    (course.description?.toLowerCase().includes(gap.toLowerCase()))
                                );

                                return isRecommended && (
                                    <div className="absolute top-4 left-4 z-20">
                                        <div className="bg-white/90 backdrop-blur-md text-amber-600 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-white/50 shadow-lg flex items-center gap-1.5">
                                            <Sparkles size={12} />
                                            <span>Gap Fix Recommended</span>
                                        </div>
                                    </div>
                                );
                            })()}

                            <div className="relative h-56 bg-linear-to-br from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden">
                                <div className="w-20 h-20 bg-linear-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-6 shadow-iner border border-slate-200">
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                                    <span className="text-white font-black text-xl uppercase tracking-widest opacity-10 relative z-0 text-center px-6 leading-tight">
                                        Executive Workshop Series
                                    </span>
                                </div>

                                <div className="absolute top-4 right-4 group-hover:scale-110 transition-transform z-20">
                                    <div className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-white/10 shadow-lg flex items-center gap-1.5">
                                        <Users size={12} />
                                        <span>{(course.maxParticipants || 10) - (course.enrolled || 0)} Seats Left</span>
                                    </div>
                                </div>
                                </div>

                            <div className="p-8 flex-1 flex flex-col">
                                <h3 className="text-2xl font-black text-slate-900 mb-6 group-hover:text-blue-600 transition-colors leading-tight">
                                    {course.title}
                                </h3>

                                <div className="space-y-4 mb-8 flex-1">
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                            <User size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Expert Consultant</p>
                                            <p className="text-sm font-bold">{course.instructor}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-slate-600">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                            <Calendar size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Session Date</p>
                                            <p className="text-sm font-bold">{course.date || "To be arranged"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-slate-600">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                            <Video size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Format</p>
                                            <p className="text-sm font-bold">{course.location || "Online"}</p>
                                        </div>
                                    </div>

                                    {/* Participant Selector & Dynamic Price */}
                                    <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <Users size={16} className="text-blue-600" />
                                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Coming Soon</h3>
                                            </div>

                                            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-1">
                                                <button
                                                    disabled={lockedParticipants[course._id] || (numParticipants[course._id] || 1) <= 1}
                                                    onClick={() => setNumParticipants(prev => ({ ...prev, [course._id]: (prev[course._id] || 1) - 1 }))}
                                                    className="w-8 h-8 rounded-lg hover:bg-slate-50 flex items-center justify-center disabled:opacity-30 transition-all"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-8 text-center font-black text-slate-900">{numParticipants[course._id] || 1}</span>
                                                <button
                                                    disabled={lockedParticipants[course._id]}
                                                    onClick={() => setNumParticipants(prev => ({ ...prev, [course._id]: (prev[course._id] || 1) + 1 }))}
                                                    className="w-8 h-8 rounded-lg hover:bg-slate-50 flex items-center justify-center disabled:opacity-30 transition-all"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Investment</p>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-2xl font-black text-blue-600">
                                                        {Math.round((course.price || 0) / (numParticipants[course._id] || 1))}€
                                                    </span>
                                                    {(numParticipants[course._id] || 1) > 1 && (
                                                        <span className="text-[10px] text-slate-400 line-through font-bold">{course.price}€</span>
                                                    )}
                                                </div>
                                            </div>

                                            {!lockedParticipants[course._id] && !pendingRequests.includes(course._id) ? (
                                                <button
                                                    onClick={async () => {
                                                        const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
                                                        const userEmail = profile.email || profile.fullName;
                                                        
                                                        // 1. Send Request to DB
                                                        try {
                                                            const res = await fetch('/api/user/workshop-access/request', {
                                                                method: 'POST',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify({
                                                                    userId: userEmail,
                                                                    courseId: course._id
                                                                })
                                                            });
                                                            const data = await res.json();
                                                            if (data.success) {
                                                                setPendingRequests(prev => [...prev, course._id]);
                                                                setLockedParticipants(prev => ({ ...prev, [course._id]: true }));
                                                            }
                                                        } catch (err) { console.error(err); }

                                                        // 2. Send Notification
                                                        try {
                                                            const userName = profile.fullName || "Guest User";
                                                            const userEmailRaw = profile.email || "No Email";
                                                            const seats = numParticipants[course._id] || 1;

                                                            await fetch('/api/admin/notifications', {
                                                                method: 'POST',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify({
                                                                    title: "New Workshop Access Request",
                                                                    message: `${userName} (${userEmailRaw}) requested access for: ${course.title} (${seats} seats)`,
                                                                    type: "booking"
                                                                })
                                                            });
                                                        } catch (err) {
                                                            console.error("Failed to send notification", err);
                                                        }
                                                    }}
                                                    className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-md"
                                                >
                                                    Confirm Seats
                                                </button>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                                                    <CheckCircle size={12} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                                        {pendingRequests.includes(course._id) ? "Requested" : "Reserved"}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
                                        const userEmail = (profile.email || "").toLowerCase().trim();

                                        // Specific allowed list calculation
                                        const allowedList = (course.allowedUsers || []).map((u: string) => u.toLowerCase().trim());
                                        const isRestricted = allowedList.length > 0;

                                        // User is allowed if:
                                        // 1. The list is empty (Public Workshop)
                                        // 2. OR the user's email is in the restricted list
                                        const isAllowed = !isRestricted || allowedList.includes(userEmail);
                                        const isOpen = course.isAccessOpen;

                                        if (isAllowed && isOpen) {
                                            handleSelectCourse(course);
                                        } else if (pendingRequests.includes(course._id)) {
                                            alert("Your access request is pending. Please wait for the consultant to approve.");
                                        } else if (!isAllowed) {
                                            alert("Access Denied. You are not enrolled. Please confirm your seats first.");
                                        } else if (!isOpen) {
                                            alert("This workshop session hasn't started yet. Please wait for the admin to open access.");
                                        }
                                    }}
                                    className={`w-full py-4 rounded-2xl font-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 group/btn ${(() => {
                                        const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
                                        const userEmail = (profile.email || "").toLowerCase().trim();
                                        const allowedList = (course.allowedUsers || []).map((u: string) => u.toLowerCase().trim());
                                        const isRestricted = allowedList.length > 0;
                                        const isAllowed = !isRestricted || allowedList.includes(userEmail);

                                        return isAllowed && course.isAccessOpen;
                                    })()
                                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20"
                                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                        }`}
                                >
                                    {(() => {
                                        const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
                                        const userEmail = (profile.email || "").toLowerCase().trim();
                                        const allowedList = (course.allowedUsers || []).map((u: string) => u.toLowerCase().trim());
                                        const isRestricted = allowedList.length > 0;
                                        const isAllowed = !isRestricted || allowedList.includes(userEmail);

                                        if (isAllowed) {
                                            return course.isAccessOpen ? (
                                                <>Access Workshop Area <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" /></>
                                            ) : (
                                                <>Session Closed / Not Started <Clock className="w-4 h-4 ml-2" /></>
                                            )
                                        } else if (pendingRequests.includes(course._id)) {
                                            return <>Pending Approval <Clock className="w-4 h-4 ml-2" /></>
                                        } else {
                                            return <>Access Locked <Lock className="w-4 h-4 ml-2" /></>
                                        }
                                    })()}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
