"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Play, BookOpen, Clock, Users, Edit3, Trash2, ChevronRight, X, Check, Loader2, Video, ArrowLeft, Save, Lock, Award, User, Calendar, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Course {
    _id: string;
    title: string;
    instructor: string;
    status: string;
    description: string;
    thumbnail: string;
    date: string;
    location: string;
    price: number;
    maxParticipants: number;
    sessions?: number;
    enrolled?: number;
    isAccessOpen?: boolean;
    allowedUsers?: string[];
}

interface Session {
    _id: string;
    courseId: string;
    title: string;
    duration: string;
    videoUrl: string;
    supportLink?: string;
}

export default function TrainingManagement() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState<"list" | "sessions">("list");
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
    const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAttestationModalOpen, setIsAttestationModalOpen] = useState(false);
    const [participants, setParticipants] = useState<{ _id: string, fullName: string, email: string }[]>([]);
    const [attestationForm, setAttestationForm] = useState({ userId: "", workshopTitle: "", instructor: "" });

    // Form States
    const [courseForm, setCourseForm] = useState<Partial<Course & { id?: string }>>({ title: "", instructor: "", status: "Published", description: "", thumbnail: "", date: "", location: "", price: 0, maxParticipants: 10 });
    const [sessionForm, setSessionForm] = useState<Partial<Session & { _id?: string }>>({ title: "", duration: "", videoUrl: "", supportLink: "" });

    const fetchCourses = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/courses', { cache: 'no-store' });
            const data = await res.json();
            if (Array.isArray(data)) setCourses(data);
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSessions = async (courseId: string) => {
        try {
            const res = await fetch(`/api/admin/sessions?courseId=${courseId}`);
            const data = await res.json();
            if (Array.isArray(data)) setSessions(data);
        } catch (error) {
            console.error("Error fetching sessions:", error);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    // Course Actions
    const handleAddCourse = () => {
        setCourseForm({ title: "", instructor: "", status: "Published", description: "", thumbnail: "General", date: "", location: "", price: 0, maxParticipants: 10, isAccessOpen: false, allowedUsers: [] });
        setIsCourseModalOpen(true);
    };

    const handleEditCourse = (course: Course) => {
        setCourseForm({
            id: course._id,
            title: course.title,
            instructor: course.instructor,
            status: course.status,
            description: course.description,
            thumbnail: course.thumbnail,
            date: course.date || "",
            location: course.location || "",
            price: course.price || 0,
            maxParticipants: course.maxParticipants || 10,
            allowedUsers: course.allowedUsers || [],
            isAccessOpen: course.isAccessOpen || false
        });
        setIsCourseModalOpen(true);
    };

    const handleDeleteCourse = async (id: string) => {
        if (confirm("Are you sure you want to delete this course and all its sessions?")) {
            try {
                await fetch(`/api/admin/courses?id=${id}`, { method: 'DELETE' });
                fetchCourses();
            } catch (error) {
                console.error("Error deleting course:", error);
            }
        }
    };

    const handleCourseSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const url = '/api/admin/courses';
            const method = courseForm.id ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(courseForm),
            });
            if (res.ok) {
                setIsCourseModalOpen(false);
                fetchCourses();
            }
        } catch (error) {
            console.error("Error saving course:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Session Actions
    const openSessions = (course: Course) => {
        setSelectedCourse(course);
        fetchSessions(course._id);
        setView("sessions");
    };

    const handleAddSession = () => {
        setSessionForm({ courseId: selectedCourse?._id, title: "", duration: "", videoUrl: "", supportLink: "" });
        setIsSessionModalOpen(true);
    };

    const handleSessionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCourse?._id) return;
        setIsSubmitting(true);
        try {
            const url = '/api/admin/sessions';
            const method = sessionForm._id ? 'PUT' : 'POST';
            const body = sessionForm._id ? { id: sessionForm._id, ...sessionForm } : sessionForm;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (res.ok) {
                setIsSessionModalOpen(false);
                fetchSessions(selectedCourse._id);
                fetchCourses(); // refresh session count
            }
        } catch (error) {
            console.error("Error saving session:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteSession = async (id: string) => {
        if (confirm("Delete this session?")) {
                if (!selectedCourse?._id) return;
                try {
                    await fetch(`/api/admin/sessions?id=${id}`, { method: 'DELETE' });
                    fetchSessions(selectedCourse._id);
                    fetchCourses(); // refresh session count
                } catch (error) {
                    console.error("Error deleting session:", error);
                }
        }
    };

    const fetchParticipants = async () => {
        try {
            const res = await fetch("/api/admin/users", { cache: "no-store" });
            const data = await res.json();
            if (Array.isArray(data)) {
                setParticipants(data.filter((u: { role: string }) => u.role !== 'Admin' && u.role !== 'Moderator'));
            }
        } catch (error) {
            console.error("Error fetching participants:", error);
        }
    };

    const handleOpenAttestationModal = (course: Course) => {
        setAttestationForm({ userId: "", workshopTitle: course.title, instructor: course.instructor });
        fetchParticipants();
        setIsAttestationModalOpen(true);
    };

    const handleAttestationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!attestationForm.userId) {
            alert("Please select a participant");
            return;
        }
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/admin/attestations/issue', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(attestationForm),
            });
            const data = await res.json();
            if (data.success) {
                alert("Attestation issued successfully!");
                setIsAttestationModalOpen(false);
            } else {
                alert(data.error || "Failed to issue attestation");
            }
        } catch (error) {
            console.error("Error issuing attestation:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <AnimatePresence mode="wait">
                {view === "list" ? (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-12"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div>
                                <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Workshop <span className="text-blue-600">Master</span></h1>
                                <p className="text-slate-500 font-medium text-sm mt-1 uppercase tracking-widest leading-relaxed">Strategic Asset Management & Curriculum Deployment</p>
                            </div>
                            <button
                                onClick={handleAddCourse}
                                className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-4xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-slate-900/40 hover:bg-blue-600 hover:-translate-y-1 transition-all"
                            >
                                <Plus size={20} strokeWidth={3} />
                                New Workshop
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="py-32 text-center">
                                <Loader2 className="w-16 h-16 animate-spin mx-auto text-blue-600 mb-6 drop-shadow-lg" />
                                <p className="text-slate-400 font-black uppercase tracking-tighter text-xl">Synchronizing Protocols...</p>
                            </div>
                        ) : courses.length === 0 ? (
                            <div className="py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center gap-6">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                                    <BookOpen size={48} />
                                </div>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No strategic workshops deployed yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                                {courses.map((course) => (
                                    <motion.div
                                        key={course._id}
                                        layoutId={`course-${course._id}`}
                                        className="group bg-white rounded-[3rem] border border-slate-100 shadow-xl hover:shadow-2xl hover:border-blue-200 transition-all flex flex-col relative overflow-hidden"
                                    >
                                        {/* Premium Badge */}
                                        <div className="absolute top-4 left-4 z-20">
                                            <span className={cn(
                                                "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg backdrop-blur-md",
                                                course.status === "Published" ? "bg-emerald-500/90 text-white" : "bg-slate-500/90 text-white"
                                            )}>
                                                {course.status}
                                            </span>
                                        </div>

                                        <div className="absolute top-4 right-4 z-20">
                                            <div className="bg-white/90 backdrop-blur-md text-blue-600 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-white/50 shadow-lg flex items-center gap-1.5">
                                                <Users size={12} strokeWidth={3} />
                                                <span>{(course.maxParticipants || 10) - (course.enrolled || 0)} LEFT</span>
                                            </div>
                                        </div>

                                        {/* Thumbnail Area */}
                                        <div className="h-52 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 relative flex items-center justify-center">
                                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                                            <div className="relative z-10 w-16 h-16 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center justify-center text-white/20">
                                                <Play size={32} strokeWidth={1} fill="currentColor" />
                                            </div>
                                            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white/50 font-black text-[9px] uppercase tracking-[0.2em]">
                                                <span>Ref: {course._id.substring(0, 8)}</span>
                                                <div className="flex items-center gap-1.5 text-blue-400">
                                                    <Clock size={10} strokeWidth={3} />
                                                    {course.sessions || 0} Modules
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content Area */}
                                        <div className="p-8 flex-1 flex flex-col">
                                            <h3 className="text-2xl font-black text-slate-900 mb-6 group-hover:text-blue-600 transition-colors leading-tight uppercase tracking-tighter">
                                                {course.title}
                                            </h3>

                                            <div className="space-y-4 mb-10 flex-1">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                                                        <User size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lead Consultant</p>
                                                        <p className="text-sm font-bold text-slate-800">{course.instructor}</p>
                                                    </div>
                                                </div>

                                                {(course.date || course.location) && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                                                            <Calendar size={18} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Session Logic</p>
                                                            <p className="text-sm font-bold text-slate-800 capitalize">{course.date} • {course.location}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                                                        <Shield size={18} />
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Investment</p>
                                                            <p className="text-sm font-bold text-slate-800">{course.price || 0} € <span className="text-[10px] text-slate-400 font-medium">TTC</span></p>
                                                        </div>
                                                        <div className="w-px h-6 bg-slate-100" />
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enrollment</p>
                                                            <p className="text-sm font-bold text-slate-800">{course.enrolled || 0} Assets</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Matrix */}
                                            <div className="space-y-3">
                                                <button
                                                    onClick={() => openSessions(course)}
                                                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-600 shadow-xl transition-all flex items-center justify-center gap-3"
                                                >
                                                    Manage Modules
                                                    <ChevronRight size={16} strokeWidth={3} />
                                                </button>

                                                <div className="grid grid-cols-2 gap-3">
                                                    <button
                                                        onClick={async (e) => {
                                                            e.stopPropagation();
                                                            const newStatus = !course.isAccessOpen;
                                                            setCourses(prev => prev.map(c => c._id === course._id ? { ...c, isAccessOpen: newStatus } : c));
                                                            try {
                                                                await fetch('/api/admin/courses', {
                                                                    method: 'PUT',
                                                                    headers: { 'Content-Type': 'application/json' },
                                                                    body: JSON.stringify({ id: course._id, isAccessOpen: newStatus })
                                                                });
                                                            } catch (err) { console.error(err); fetchCourses(); }
                                                        }}
                                                        className={cn(
                                                            "py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all border-2 flex items-center justify-center gap-2",
                                                            course.isAccessOpen
                                                                ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100 shadow-sm"
                                                                : "bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100 shadow-sm"
                                                        )}
                                                    >
                                                        {course.isAccessOpen ? <><Check size={14} strokeWidth={3} /> Access Open</> : <><Lock size={14} strokeWidth={3} /> Access Closed</>}
                                                    </button>

                                                    <button
                                                        onClick={() => handleOpenAttestationModal(course)}
                                                        className="py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all bg-amber-50 text-amber-700 border-2 border-amber-100 hover:bg-amber-100 shadow-sm flex items-center justify-center gap-2"
                                                    >
                                                        <Award size={14} strokeWidth={3} />
                                                        Award Cert
                                                    </button>
                                                </div>

                                                <div className="flex items-center gap-2 pt-2">
                                                    <button onClick={() => handleEditCourse(course)} className="flex-1 py-3 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                                                        <Edit3 size={14} /> Edit
                                                    </button>
                                                    <button onClick={() => handleDeleteCourse(course._id)} className="flex-1 py-3 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                                                        <Trash2 size={14} /> Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="sessions"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-12"
                    >
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => setView("list")}
                                className="w-14 h-14 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center shadow-sm"
                            >
                                <ArrowLeft size={24} />
                            </button>
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">{selectedCourse?.title} <span className="text-blue-600">Modules</span></h1>
                                <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mt-1">Strategic Curriculum Management • {selectedCourse?.instructor}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden p-10">
                            <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Strategic Curriculum</h2>
                                    <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Knowledge blocks for this executive session</p>
                                </div>
                                <button
                                    onClick={handleAddSession}
                                    className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-600/30 hover:bg-blue-700 transition-all"
                                >
                                    <Plus size={18} strokeWidth={3} />
                                    Add Module
                                </button>
                            </div>

                            <div className="space-y-4">
                                {sessions.map((session, idx) => (
                                    <div key={session._id} className="flex items-center justify-between p-6 bg-slate-50 rounded-4xl group border-2 border-transparent hover:border-blue-100 hover:bg-white transition-all shadow-sm">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm font-black group-hover:text-blue-600 transition-colors">
                                                <span className="text-xs uppercase tracking-tighter">M<span className="text-lg">{idx + 1}</span></span>
                                            </div>
                                            <div>
                                                <h4 className="font-black text-lg text-slate-900 uppercase tracking-tight">{session.title}</h4>
                                                <div className="flex items-center gap-6 mt-1">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Clock size={12} strokeWidth={3} /> {session.duration}</span>
                                                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100"><Video size={12} strokeWidth={3} /> Strategic Asset Linked</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => { setSessionForm(session); setIsSessionModalOpen(true); }} className="p-3 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100"><Edit3 size={18} /></button>
                                            <button onClick={() => handleDeleteSession(session._id)} className="p-3 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100"><Trash2 size={18} /></button>
                                        </div>
                                    </div>
                                ))}
                                {sessions.length === 0 && (
                                    <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/50">
                                        <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No curriculum modules deployed yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── ATTESTATION MANAGEMENT BLOCK ── */}
                        <div className="bg-slate-900 rounded-[3rem] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl shadow-slate-900/30 relative overflow-hidden mt-12 border border-white/5">
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                            
                            <div className="relative z-10 space-y-4 max-w-xl">
                                <div className="flex items-center gap-3 text-amber-400">
                                    <Award size={24} strokeWidth={3} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Strategic Accreditation Protocol</span>
                                </div>
                                <h3 className="text-3xl lg:text-4xl font-black italic uppercase tracking-tighter leading-tight">Issue Executive <span className="text-amber-500">Attestation</span></h3>
                                <p className="text-slate-400 text-sm font-medium leading-relaxed">Validate participant performance and certify the completion of this strategic learning mandate.</p>
                            </div>
                            <div className="relative z-10">
                                <button
                                    onClick={() => handleOpenAttestationModal(selectedCourse!)}
                                    className="px-12 py-5 bg-amber-500 text-slate-900 rounded-4xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:bg-amber-400 hover:-translate-y-1 transition-all flex items-center gap-4 group"
                                >
                                    <Award size={20} strokeWidth={3} className="group-hover:rotate-12 transition-transform" />
                                    Award Certificate
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Course Modal */}
            <AnimatePresence>
                {isCourseModalOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCourseModalOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-60" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white rounded-3xl shadow-2xl z-70 overflow-hidden">
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-bold text-slate-900">{courseForm.id ? "Edit Workshop" : "New Workshop"}</h2>
                                    <button onClick={() => setIsCourseModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X size={20} /></button>
                                </div>
                                <form onSubmit={handleCourseSubmit} className="space-y-5">
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Workshop Title</label>
                                            <input required type="text" className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-slate-900" value={courseForm.title} onChange={e => setCourseForm({ ...courseForm, title: e.target.value })} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Instructor</label>
                                                <input required type="text" className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-slate-900" value={courseForm.instructor} onChange={e => setCourseForm({ ...courseForm, instructor: e.target.value })} />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
                                                <select className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold appearance-none cursor-pointer text-slate-900" value={courseForm.status} onChange={e => setCourseForm({ ...courseForm, status: e.target.value })}>
                                                    <option>Published</option>
                                                    <option>Draft</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Date (e.g. 25 Jan, 10:00)</label>
                                                <input type="text" className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-slate-900" value={courseForm.date} onChange={e => setCourseForm({ ...courseForm, date: e.target.value })} />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Format (Online/Address)</label>
                                                <input type="text" className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-slate-900" value={courseForm.location} onChange={e => setCourseForm({ ...courseForm, location: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Price (€)</label>
                                                <input type="number" className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-slate-900" value={courseForm.price} onChange={e => setCourseForm({ ...courseForm, price: Number(e.target.value) })} />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Max Participants</label>
                                                <input type="number" className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-slate-900" value={courseForm.maxParticipants} onChange={e => setCourseForm({ ...courseForm, maxParticipants: Number(e.target.value) })} />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Allowed Participants (Emails, comma separated)</label>
                                            <textarea
                                                rows={2}
                                                placeholder="e.g. user1@example.com, user2@example.com"
                                                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-medium text-slate-600"
                                                value={Array.isArray(courseForm.allowedUsers) ? courseForm.allowedUsers.join(", ") : (courseForm.allowedUsers || "")}
                                                onChange={e => setCourseForm({ ...courseForm, allowedUsers: e.target.value.split(',').map((email: string) => email.trim()) })}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                                            <textarea rows={3} className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-medium text-slate-600" value={courseForm.description} onChange={e => setCourseForm({ ...courseForm, description: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <button type="button" onClick={() => setIsCourseModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold">Cancel</button>
                                        <button type="submit" disabled={isSubmitting} className="flex-2 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
                                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> {courseForm.id ? "Update Workshop" : "Create Workshop"}</>}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Session Modal */}
            <AnimatePresence>
                {isSessionModalOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSessionModalOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-60" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl z-70 overflow-hidden">
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-bold text-slate-900">{sessionForm._id ? "Edit Session" : "New Session"}</h2>
                                    <button onClick={() => setIsSessionModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X size={20} /></button>
                                </div>
                                <form onSubmit={handleSessionSubmit} className="space-y-5">
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Session Title</label>
                                            <input required type="text" className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-slate-900" value={sessionForm.title} onChange={e => setSessionForm({ ...sessionForm, title: e.target.value })} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Duration (e.g. 45m)</label>
                                            <input required type="text" className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-slate-900" value={sessionForm.duration} onChange={e => setSessionForm({ ...sessionForm, duration: e.target.value })} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Video URL (Vimeo/YouTube)</label>
                                            <input required type="url" className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-slate-900" value={sessionForm.videoUrl} onChange={e => setSessionForm({ ...sessionForm, videoUrl: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <button type="button" onClick={() => setIsSessionModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold">Cancel</button>
                                        <button type="submit" disabled={isSubmitting} className="flex-2 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2">
                                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><Check size={20} /> {sessionForm._id ? "Save Changes" : "Add Session"}</>}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            {/* Attestation Modal */}
            <AnimatePresence>
                {isAttestationModalOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAttestationModalOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-60" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl z-70 overflow-hidden">
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                                            <Award size={20} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-900">Issue Attestation</h2>
                                            <p className="text-xs text-slate-500 font-medium">Award certificate for {attestationForm.workshopTitle}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setIsAttestationModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X size={20} /></button>
                                </div>
                                <form onSubmit={handleAttestationSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Select Participant</label>
                                            <select 
                                                required 
                                                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-slate-900 appearance-none cursor-pointer"
                                                value={attestationForm.userId}
                                                onChange={e => setAttestationForm({ ...attestationForm, userId: e.target.value })}
                                            >
                                                <option value="">-- Choose Participant --</option>
                                                {participants.map(p => (
                                                    <option key={p._id} value={p._id}>{p.fullName} ({p.email})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Workshop Theme</label>
                                            <input readOnly type="text" className="w-full px-5 py-3.5 bg-slate-100 border-2 border-transparent rounded-2xl outline-none font-bold text-slate-500 cursor-not-allowed" value={attestationForm.workshopTitle} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Instructor</label>
                                            <input readOnly type="text" className="w-full px-5 py-3.5 bg-slate-100 border-2 border-transparent rounded-2xl outline-none font-bold text-slate-500 cursor-not-allowed" value={attestationForm.instructor} />
                                        </div>
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <button type="button" onClick={() => setIsAttestationModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold">Cancel</button>
                                        <button type="submit" disabled={isSubmitting} className="flex-2 py-4 bg-amber-600 text-white rounded-2xl font-bold shadow-lg shadow-amber-600/20 flex items-center justify-center gap-2">
                                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><Check size={20} /> Generate Attestation</>}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
