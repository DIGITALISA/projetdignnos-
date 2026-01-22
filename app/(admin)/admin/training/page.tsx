"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Play, BookOpen, Clock, Users, Edit3, Trash2, ChevronRight, X, Check, Loader2, Video, FileText, ArrowLeft, Save } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Course {
    id: number | null;
    title: string;
    instructor: string;
    sessions: number;
    enrolled: number;
    status: string;
    thumbnail: string;
    description: string;
}

interface Session {
    id: number | null;
    courseId: number | null;
    title: string;
    duration: string;
    videoUrl: string;
    supportLink: string;
}

const initialCourses: Course[] = [
    { id: 1, title: "Advanced React Patterns", instructor: "Sarah Johnson", sessions: 12, enrolled: 450, status: "Published", thumbnail: "React", description: "Deep dive into advanced React patterns and best practices." },
    { id: 2, title: "System Design for Scale", instructor: "Michael Chen", enrolled: 280, sessions: 8, status: "Draft", thumbnail: "System", description: "Learn how to build systems that scale to millions of users." },
    { id: 3, title: "Leadership & Strategy", instructor: "Emma Davis", enrolled: 120, sessions: 15, status: "Published", thumbnail: "Leadership", description: "Essential skills for leading engineering teams and projects." },
];

const initialSessions: Session[] = [
    { id: 1, courseId: 1, title: "Introduction to Patterns", duration: "45m", videoUrl: "https://...", supportLink: "https://..." },
    { id: 2, courseId: 1, title: "HOCs vs Hooks", duration: "1h 10m", videoUrl: "https://...", supportLink: "https://..." },
];

export default function TrainingManagement() {
    const [courses, setCourses] = useState<Course[]>(initialCourses);
    const [sessions, setSessions] = useState<Session[]>(initialSessions);
    const [view, setView] = useState<"list" | "sessions">("list");
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
    const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form States
    const [courseForm, setCourseForm] = useState<Course>({ id: null, title: "", instructor: "", status: "Published", description: "", thumbnail: "", sessions: 0, enrolled: 0 });
    const [sessionForm, setSessionForm] = useState<Session>({ id: null, courseId: null, title: "", duration: "", videoUrl: "", supportLink: "" });

    // Course Actions
    const handleAddCourse = () => {
        setCourseForm({ id: null, title: "", instructor: "", status: "Published", description: "", thumbnail: "New Course", sessions: 0, enrolled: 0 });
        setIsCourseModalOpen(true);
    };

    const handleEditCourse = (course: Course) => {
        setCourseForm(course);
        setIsCourseModalOpen(true);
    };

    const handleDeleteCourse = (id: number | null) => {
        if (id && confirm("Are you sure you want to delete this course?")) {
            setCourses(courses.filter(c => c.id !== id));
        }
    };

    const handleCourseSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise(r => setTimeout(r, 1000));

        if (courseForm.id) {
            setCourses(courses.map(c => c.id === courseForm.id ? courseForm : c));
        } else {
            const newCourse: Course = { ...courseForm, id: Date.now() };
            setCourses([...courses, newCourse]);
        }

        setIsSubmitting(false);
        setIsCourseModalOpen(false);
    };

    // Session Actions
    const openSessions = (course: Course) => {
        setSelectedCourse(course);
        setView("sessions");
    };

    const handleAddSession = () => {
        setSessionForm({ id: null, courseId: selectedCourse?.id || null, title: "", duration: "", videoUrl: "", supportLink: "" });
        setIsSessionModalOpen(true);
    };

    const handleSessionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCourse?.id) return;
        setIsSubmitting(true);
        await new Promise(r => setTimeout(r, 800));

        if (sessionForm.id) {
            setSessions(sessions.map(s => s.id === sessionForm.id ? sessionForm : s));
        } else {
            if (selectedCourse.id !== null) {
                const newSession: Session = { ...sessionForm, id: Date.now(), courseId: selectedCourse.id };
                setSessions([...sessions, newSession]);
                // Update session count in course list
                setCourses(courses.map(c => c.id === selectedCourse.id ? { ...c, sessions: c.sessions + 1 } : c));
            }
        }

        setIsSubmitting(false);
        setIsSessionModalOpen(false);
    };

    const handleDeleteSession = (id: number | null) => {
        if (id && selectedCourse?.id && confirm("Delete this session?")) {
            setSessions(sessions.filter(s => s.id !== id));
            setCourses(courses.map(c => c.id === selectedCourse.id ? { ...c, sessions: c.sessions - 1 } : c));
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
                                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Training Hub Manager</h1>
                                <p className="text-slate-500 mt-1">Organize courses, upload videos, and manage support materials.</p>
                            </div>
                            <button
                                onClick={handleAddCourse}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
                            >
                                <Plus size={20} />
                                New Course
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {courses.map((course, idx) => (
                                <motion.div
                                    key={course.id || idx}
                                    layoutId={`course-${course.id}`}
                                    className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center">
                                        <div className="lg:w-48 h-32 lg:h-40 bg-slate-100 flex items-center justify-center relative bg-gradient-to-br from-blue-500 to-indigo-600">
                                            <span className="text-white font-black text-xs uppercase tracking-widest opacity-30">{course.thumbnail}</span>
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
                                                        <span className="text-xs uppercase tracking-wider">{course.sessions} sessions</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-slate-400 font-bold">
                                                        <Users size={16} />
                                                        <span className="text-xs uppercase tracking-wider">{course.enrolled} participants</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openSessions(course)}
                                                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
                                                >
                                                    Manage Sessions
                                                    <ChevronRight size={16} />
                                                </button>
                                                <button onClick={() => handleEditCourse(course)} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit3 size={18} /></button>
                                                <button onClick={() => handleDeleteCourse(course.id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
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
                                <p className="text-slate-500 font-medium capitalize">Course Instructor: {selectedCourse?.instructor}</p>
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
                                {sessions.filter(s => s.courseId === selectedCourse?.id).map((session, idx) => (
                                    <div key={session.id || idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group border border-transparent hover:border-slate-200 hover:bg-white transition-all">
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
                                            <button onClick={() => handleDeleteSession(session.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition-all shadow-sm"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                ))}
                                {sessions.filter(s => s.courseId === selectedCourse?.id).length === 0 && (
                                    <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-3xl">
                                        <p className="text-slate-400 font-medium">No sessions added yet for this course.</p>
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
                                    <h2 className="text-2xl font-bold text-slate-900">{courseForm.id ? "Edit Course" : "New Course"}</h2>
                                    <button onClick={() => setIsCourseModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X size={20} /></button>
                                </div>
                                <form onSubmit={handleCourseSubmit} className="space-y-5">
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Course Title</label>
                                            <input required type="text" className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold" value={courseForm.title} onChange={e => setCourseForm({ ...courseForm, title: e.target.value })} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Instructor</label>
                                                <input required type="text" className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold" value={courseForm.instructor} onChange={e => setCourseForm({ ...courseForm, instructor: e.target.value })} />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
                                                <select className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold appearance-none cursor-pointer" value={courseForm.status} onChange={e => setCourseForm({ ...courseForm, status: e.target.value })}>
                                                    <option>Published</option>
                                                    <option>Draft</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                                            <textarea rows={3} className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-medium text-slate-600" value={courseForm.description} onChange={e => setCourseForm({ ...courseForm, description: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <button type="button" onClick={() => setIsCourseModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold">Cancel</button>
                                        <button type="submit" disabled={isSubmitting} className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
                                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> {courseForm.id ? "Update Course" : "Create Course"}</>}
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
                                    <h2 className="text-2xl font-bold text-slate-900">{sessionForm.id ? "Edit Session" : "New Session"}</h2>
                                    <button onClick={() => setIsSessionModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X size={20} /></button>
                                </div>
                                <form onSubmit={handleSessionSubmit} className="space-y-5">
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Session Title</label>
                                            <input required type="text" className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold" value={sessionForm.title} onChange={e => setSessionForm({ ...sessionForm, title: e.target.value })} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Duration (e.g. 45m)</label>
                                            <input required type="text" className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold" value={sessionForm.duration} onChange={e => setSessionForm({ ...sessionForm, duration: e.target.value })} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Video URL (Vimeo/YouTube)</label>
                                            <input required type="url" className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold" value={sessionForm.videoUrl} onChange={e => setSessionForm({ ...sessionForm, videoUrl: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <button type="button" onClick={() => setIsSessionModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold">Cancel</button>
                                        <button type="submit" disabled={isSubmitting} className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2">
                                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><Check size={20} /> {sessionForm.id ? "Save Changes" : "Add Session"}</>}
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
