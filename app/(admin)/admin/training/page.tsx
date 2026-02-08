"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Play, BookOpen, Clock, Users, Edit3, Trash2, ChevronRight, X, Check, Loader2, Video, FileText, ArrowLeft, Save, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function TrainingManagement() {
    const [courses, setCourses] = useState<any[]>([]);
    const [sessions, setSessions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState<"list" | "sessions">("list");
    const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
    const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form States
    const [courseForm, setCourseForm] = useState<any>({ title: "", instructor: "", status: "Published", description: "", thumbnail: "", date: "", location: "", price: 0, maxParticipants: 10 });
    const [sessionForm, setSessionForm] = useState<any>({ title: "", duration: "", videoUrl: "", supportLink: "" });

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

    const handleEditCourse = (course: any) => {
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
    const openSessions = (course: any) => {
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
            try {
                await fetch(`/api/admin/sessions?id=${id}`, { method: 'DELETE' });
                fetchSessions(selectedCourse._id);
                fetchCourses(); // refresh session count
            } catch (error) {
                console.error("Error deleting session:", error);
            }
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
                        className="space-y-8"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Workshop Manager</h1>
                                <p className="text-slate-500 mt-1">Organize workshops, upload videos, and manage support materials.</p>
                            </div>
                            <button
                                onClick={handleAddCourse}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
                            >
                                <Plus size={20} />
                                New Workshop
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="py-20 text-center">
                                <Loader2 className="w-10 h-10 animate-spin mx-auto text-blue-600 mb-4" />
                                <p className="text-slate-500 font-medium">Loading workshops...</p>
                            </div>
                        ) : courses.length === 0 ? (
                            <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                                <p className="text-slate-400">No workshops created yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6">
                                {courses.map((course, idx) => (
                                    <motion.div
                                        key={course._id}
                                        layoutId={`course-${course._id}`}
                                        className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden"
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-center">
                                            <div className="lg:w-48 h-32 lg:h-40 bg-slate-100 flex items-center justify-center relative bg-gradient-to-br from-blue-500 to-indigo-600">
                                                <span className="text-white font-black text-xs uppercase tracking-widest opacity-30">{course.thumbnail || "QHSE"}</span>
                                                <Play className="text-white fill-white/20" size={32} />
                                            </div>

                                            <div className="flex-1 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="text-xl font-bold text-slate-900">{course.title}</h3>
                                                        <span className={cn(
                                                            "px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider",
                                                            course.status === "Published" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                                                        )}>
                                                            {course.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-slate-500 font-medium">Instructor: {course.instructor}</p>
                                                    <div className="flex items-center gap-6 mt-4">
                                                        <div className="flex items-center gap-2 text-slate-400 font-bold">
                                                            <BookOpen size={16} />
                                                            <span className="text-xs uppercase tracking-wider">{course.sessions || 0} sessions</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-indigo-500 font-bold">
                                                            <span className="text-xs uppercase tracking-wider">{course.price || 0} €</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-slate-400 font-bold">
                                                            <Users size={16} />
                                                            <span className="text-xs uppercase tracking-wider">{course.enrolled || 0} / {course.maxParticipants || 10} participants</span>
                                                        </div>
                                                        {(course.date || course.location) && (
                                                            <div className="flex items-center gap-4">
                                                                <div className="flex items-center gap-2 text-blue-500 font-bold">
                                                                    <Clock size={16} />
                                                                    <span className="text-xs uppercase tracking-wider">{course.date}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-emerald-500 font-bold">
                                                                    <Check size={16} />
                                                                    <span className="text-xs uppercase tracking-wider">{course.location}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={async (e) => {
                                                            e.stopPropagation();
                                                            const newStatus = !course.isAccessOpen;
                                                            // Optimistic Update
                                                            setCourses(prev => prev.map(c => c._id === course._id ? { ...c, isAccessOpen: newStatus } : c));

                                                            try {
                                                                const res = await fetch('/api/admin/courses', {
                                                                    method: 'PUT',
                                                                    headers: { 'Content-Type': 'application/json' },
                                                                    body: JSON.stringify({ id: course._id, isAccessOpen: newStatus })
                                                                });
                                                                if (!res.ok) {
                                                                    // Revert if failed
                                                                    setCourses(prev => prev.map(c => c._id === course._id ? { ...c, isAccessOpen: !newStatus } : c));
                                                                    alert("Failed to update status");
                                                                }
                                                            } catch (err) {
                                                                console.error("Failed to toggle access", err);
                                                                // Revert if error
                                                                setCourses(prev => prev.map(c => c._id === course._id ? { ...c, isAccessOpen: !newStatus } : c));
                                                            }
                                                        }}
                                                        className={cn(
                                                            "px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2",
                                                            course.isAccessOpen
                                                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                                                : "bg-rose-100 text-rose-700 hover:bg-rose-200"
                                                        )}
                                                        title={course.isAccessOpen ? "Close Access" : "Open Access"}
                                                    >
                                                        {course.isAccessOpen ? <><Check size={14} /> Open</> : <><Lock size={14} /> Closed</>}
                                                    </button>

                                                    <button
                                                        onClick={() => openSessions(course)}
                                                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
                                                    >
                                                        Manage Sessions
                                                        <ChevronRight size={16} />
                                                    </button>
                                                    <button onClick={() => handleEditCourse(course)} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit3 size={18} /></button>
                                                    <button onClick={() => handleDeleteCourse(course._id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
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
                        className="space-y-8"
                    >
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setView("list")}
                                className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{selectedCourse?.title} Sessions</h1>
                                <p className="text-slate-500 font-medium capitalize">Workshop Instructor: {selectedCourse?.instructor}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold text-slate-900">Curriculum</h2>
                                <button
                                    onClick={handleAddSession}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-all"
                                >
                                    <Plus size={18} />
                                    Add Session
                                </button>
                            </div>

                            <div className="space-y-4">
                                {sessions.map((session, idx) => (
                                    <div key={session._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group border border-transparent hover:border-slate-200 hover:bg-white transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm">
                                                <span className="text-xs font-black">{idx + 1}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900">{session.title}</h4>
                                                <div className="flex items-center gap-4 mt-1">
                                                    <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={12} /> {session.duration}</span>
                                                    <span className="text-xs text-blue-500 flex items-center gap-1 font-bold"><Video size={12} /> Video Linked</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => { setSessionForm(session); setIsSessionModalOpen(true); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all shadow-sm"><Edit3 size={16} /></button>
                                            <button onClick={() => handleDeleteSession(session._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition-all shadow-sm"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                ))}
                                {sessions.length === 0 && (
                                    <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-3xl">
                                        <p className="text-slate-400 font-medium">No sessions added yet for this workshop.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Course Modal */}
            <AnimatePresence>
                {isCourseModalOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCourseModalOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white rounded-3xl shadow-2xl z-[70] overflow-hidden">
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
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Location (Online/Address)</label>
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
                                        <button type="submit" disabled={isSubmitting} className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
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
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSessionModalOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl z-[70] overflow-hidden">
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
                                        <button type="submit" disabled={isSubmitting} className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2">
                                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><Check size={20} /> {sessionForm._id ? "Save Changes" : "Add Session"}</>}
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
