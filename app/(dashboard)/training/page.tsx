"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, Clock, CheckCircle, Lock, ArrowLeft, Video, FileText } from "lucide-react";
import { useState } from "react";

interface Session {
    id: number;
    title: string;
    videoUrl: string;
    supportUrl: string;
}

interface Course {
    id: number;
    title: string;
    instructor: string;
    duration: string;
    progress: number;
    thumbnail: string;
    locked: boolean;
    sessions?: Session[];
}

export default function TrainingPage() {
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    const courses: Course[] = [
        {
            id: 1,
            title: "Advanced React Patterns",
            instructor: "Sarah Johnson",
            duration: "4h 30m",
            progress: 0,
            thumbnail: "https://via.placeholder.com/300x180/3B82F6/FFFFFF?text=React",
            locked: false,
            sessions: [
                { id: 1, title: "Introduction to Advanced Patterns", videoUrl: "#", supportUrl: "#" },
                { id: 2, title: "The Provider Pattern", videoUrl: "#", supportUrl: "#" },
                { id: 3, title: "HOCs vs Render Props", videoUrl: "#", supportUrl: "#" },
                { id: 4, title: "Compound Components", videoUrl: "#", supportUrl: "#" },
                { id: 5, title: "Custom Hooks for Pattern Logic", videoUrl: "#", supportUrl: "#" },
            ]
        },
        {
            id: 2,
            title: "System Design Fundamentals",
            instructor: "Michael Chen",
            duration: "6h 15m",
            progress: 0,
            thumbnail: "https://via.placeholder.com/300x180/8B5CF6/FFFFFF?text=System+Design",
            locked: true,
            sessions: []
        },
        {
            id: 3,
            title: "Leadership & Communication",
            instructor: "Emma Davis",
            duration: "3h 45m",
            progress: 0,
            thumbnail: "https://via.placeholder.com/300x180/10B981/FFFFFF?text=Leadership",
            locked: true,
            sessions: []
        },
    ];

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
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-4 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Training Hub
                    </button>
                    <h1 className="text-3xl font-bold text-slate-900">{selectedCourse.title}</h1>
                    <p className="text-slate-500">Instructor: {selectedCourse.instructor} • {selectedCourse.duration}</p>
                </motion.div>

                <div className="space-y-4">
                    {selectedCourse.sessions?.map((session, index) => (
                        <motion.div
                            key={session.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-green-200 transition-all shadow-sm"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center font-bold text-sm">
                                    {index + 1}
                                </div>
                                <h3 className="font-semibold text-slate-800">{session.title}</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium">
                                    <Video className="w-4 h-4" />
                                    Vidéo
                                </button>
                                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors text-sm font-medium">
                                    <FileText className="w-4 h-4" />
                                    Support
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1">
            <div className="mb-12">
                <h1 className="text-3xl font-bold mb-2 text-slate-900">Training Hub</h1>
                <p className="text-slate-500">
                    Personalized courses based on your skills gap analysis.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {courses.map((course, index) => (
                    <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-white rounded-2xl border overflow-hidden ${course.locked ? 'opacity-60' : 'hover:shadow-lg hover:border-green-300'
                            } transition-all`}
                    >
                        <div className="relative">
                            <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-full h-48 object-cover"
                            />
                            {course.locked && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <Lock className="w-8 h-8 text-white" />
                                </div>
                            )}
                        </div>

                        <div className="p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-2">{course.title}</h3>
                            <p className="text-sm text-slate-500 mb-4">by {course.instructor}</p>

                            <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                                <Clock className="w-4 h-4" />
                                <span>{course.duration}</span>
                            </div>

                            {!course.locked && (
                                <button
                                    onClick={() => setSelectedCourse(course)}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                                >
                                    <PlayCircle className="w-5 h-5" />
                                    Start Course
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
