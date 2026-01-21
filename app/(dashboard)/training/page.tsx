"use client";

import { motion } from "framer-motion";
import { PlayCircle, Clock, CheckCircle, Lock } from "lucide-react";

export default function TrainingPage() {
    const courses = [
        {
            id: 1,
            title: "Advanced React Patterns",
            instructor: "Sarah Johnson",
            duration: "4h 30m",
            progress: 0,
            thumbnail: "https://via.placeholder.com/300x180/3B82F6/FFFFFF?text=React",
            locked: false,
        },
        {
            id: 2,
            title: "System Design Fundamentals",
            instructor: "Michael Chen",
            duration: "6h 15m",
            progress: 0,
            thumbnail: "https://via.placeholder.com/300x180/8B5CF6/FFFFFF?text=System+Design",
            locked: true,
        },
        {
            id: 3,
            title: "Leadership & Communication",
            instructor: "Emma Davis",
            duration: "3h 45m",
            progress: 0,
            thumbnail: "https://via.placeholder.com/300x180/10B981/FFFFFF?text=Leadership",
            locked: true,
        },
    ];

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
                                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2">
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
