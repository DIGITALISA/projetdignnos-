"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, Clock, CheckCircle, Lock, ArrowLeft, Video, FileText, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function TrainingPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [sessions, setSessions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingSessions, setIsLoadingSessions] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<any | null>(null);

    const fetchCourses = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/courses');
            const data = await res.json();
            if (Array.isArray(data)) {
                // Filter only published courses for student view
                setCourses(data.filter(c => c.status === "Published"));
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
    }, []);

    const handleSelectCourse = (course: any) => {
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
                        Back to Training Hub
                    </button>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">{selectedCourse.title}</h1>
                    <p className="text-slate-500 font-medium">Instructor: {selectedCourse.instructor} • {selectedCourse.sessions || 0} sessions</p>
                </motion.div>

                <div className="space-y-4">
                    {isLoadingSessions ? (
                        <div className="py-20 text-center">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
                            <p className="text-slate-500">Loading module curriculum...</p>
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className="py-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                            <p className="text-slate-400">This course has no sessions yet.</p>
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
                                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                                            {index + 1}
                                        </div>
                                        <h3 className="font-semibold text-slate-800">{session.title}</h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <a
                                            href={session.videoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium"
                                        >
                                            <Video className="w-4 h-4" />
                                            Watch Video
                                        </a>
                                        <span className="text-xs text-slate-400 font-bold px-3">{session.duration}</span>
                                    </div>
                                </motion.div>
                            ))}

                            <div className="mt-12 p-8 bg-blue-600 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-600/20">
                                <div>
                                    <h2 className="text-2xl font-bold mb-2 text-white">Course Completion</h2>
                                    <p className="text-blue-100">Once you finish all modules, click the button below to generate your official certificate.</p>
                                </div>
                                <button
                                    onClick={async () => {
                                        const profile = JSON.parse(localStorage.getItem("userProfile") || "{}");
                                        const name = profile.fullName || "Ahmed User";
                                        const res = await fetch('/api/user/certificates', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                                userId: name, // Using name as ID for demo
                                                userName: name,
                                                courseId: selectedCourse._id,
                                                courseTitle: selectedCourse.title
                                            })
                                        });
                                        if (res.ok) {
                                            alert("Certificate generated successfully! Visit 'My Certificates' to view it.");
                                        }
                                    }}
                                    className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-black shadow-lg hover:scale-105 active:scale-95 transition-all"
                                >
                                    Finish & Get Certificate
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
                <h1 className="text-3xl font-bold mb-2 text-slate-900">Training Hub</h1>
                <p className="text-slate-500 text-lg">
                    Personalized professional courses to bridge your skills gap.
                </p>
            </div>

            {isLoading ? (
                <div className="py-20 text-center">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-600 mb-4" />
                    <p className="text-slate-500 font-medium">Fetching specialized modules...</p>
                </div>
            ) : courses.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                    <p className="text-slate-400">No courses available at the moment.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course, index) => (
                        <motion.div
                            key={course._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:border-blue-300 transition-all group`}
                        >
                            <div className="relative h-48 bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center">
                                <span className="text-white font-black text-xl uppercase tracking-widest opacity-20">{course.thumbnail || "QHSE"}</span>
                                <PlayCircle className="w-16 h-16 text-white absolute transition-transform group-hover:scale-110" />
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                                <p className="text-sm text-slate-500 mb-4 font-medium">by {course.instructor}</p>

                                <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-6">
                                    <div className="flex items-center gap-1.5 uppercase tracking-wider">
                                        <Clock className="w-4 h-4" />
                                        <span>{course.sessions || 0} Modules</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 uppercase tracking-wider">
                                        <CheckCircle className="w-4 h-4" />
                                        <span>Certification</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleSelectCourse(course)}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2"
                                >
                                    Access Training
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
