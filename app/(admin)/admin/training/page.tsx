"use client";

import { motion } from "framer-motion";
import { Plus, Play, BookOpen, Clock, Users, Edit3, Trash2, ChevronRight, LayoutGrid, List } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const courses = [
    {
        id: 1,
        title: "Advanced React Patterns",
        instructor: "Sarah Johnson",
        sessions: 12,
        enrolled: 450,
        status: "Published",
        thumbnail: "React"
    },
    {
        id: 2,
        title: "System Design for Scale",
        instructor: "Michael Chen",
        enrolled: 280,
        sessions: 8,
        status: "Draft",
        thumbnail: "System"
    },
    {
        id: 3,
        title: "Leadership & Strategy",
        instructor: "Emma Davis",
        enrolled: 120,
        sessions: 15,
        status: "Published",
        thumbnail: "Leadership"
    },
];

export default function TrainingManagement() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Training Hub Manager</h1>
                    <p className="text-slate-500 mt-1">Organize courses, upload videos, and manage support materials.</p>
                </div>
                <button className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all">
                    <Plus size={20} />
                    New Course
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {courses.map((course, idx) => (
                    <motion.div
                        key={course.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden"
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center">
                            {/* Thumbnail placeholder */}
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
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <BookOpen size={16} />
                                            <span className="text-xs font-bold">{course.sessions} sessions</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Users size={16} />
                                            <span className="text-xs font-bold">{course.enrolled} participants</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all">
                                        Manage Sessions
                                        <ChevronRight size={16} />
                                    </button>
                                    <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit3 size={18} /></button>
                                    <button className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
