"use client";

import { motion } from "framer-motion";
import { Users, PlayCircle, Library, Wrench, TrendingUp, ArrowUpRight, Clock, ShieldCheck } from "lucide-react";

const stats = [
    { name: "Total Participants", value: "1,280", change: "+12%", icon: Users, color: "blue" },
    { name: "Courses Active", value: "24", change: "+3", icon: PlayCircle, color: "green" },
    { name: "Total Resources", value: "145", change: "+8", icon: Library, color: "purple" },
    { name: "AI Tools", value: "18", change: "+2", icon: Wrench, color: "orange" },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Overview</h1>
                    <p className="text-slate-500 mt-1 text-lg">Manage your platform content and participant access.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm" />
                        ))}
                    </div>
                    <p className="text-sm font-medium text-slate-600">
                        <span className="text-slate-900 font-bold">12 Users</span> online now
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={cn(
                                "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6",
                                stat.color === "blue" ? "bg-blue-50 text-blue-600" :
                                    stat.color === "green" ? "bg-green-50 text-green-600" :
                                        stat.color === "purple" ? "bg-purple-50 text-purple-600" :
                                            "bg-orange-50 text-orange-600"
                            )}>
                                <stat.icon size={28} />
                            </div>
                            <span className={cn(
                                "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold",
                                stat.color === "blue" ? "bg-blue-50 text-blue-700" :
                                    stat.color === "green" ? "bg-green-50 text-green-700" :
                                        stat.color === "purple" ? "bg-purple-50 text-purple-700" :
                                            "bg-orange-50 text-orange-700"
                            )}>
                                {stat.change} <TrendingUp size={12} />
                            </span>
                        </div>
                        <h3 className="text-slate-500 font-medium text-sm">{stat.name}</h3>
                        <p className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                {/* Recent Activities */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                            <Clock size={22} className="text-blue-600" />
                            Recent Activities
                        </h2>
                        <button className="text-blue-600 text-sm font-bold hover:underline flex items-center gap-1">
                            View all logs <ArrowUpRight size={14} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {[
                            { user: "Sarah J.", action: "completed 'React Patterns' course", time: "2 mins ago", icon: ShieldCheck, color: "text-green-500" },
                            { user: "Michael C.", action: "added new AI tool: 'Perplexity'", time: "45 mins ago", icon: Wrench, color: "text-orange-500" },
                            { user: "Admin", action: "granted access to 5 new participants", time: "2 hours ago", icon: Users, color: "text-blue-500" },
                            { user: "Library", action: "new file uploaded: 'QHSE Guide'", time: "5 hours ago", icon: Library, color: "text-purple-500" },
                        ].map((log, i) => (
                            <div key={i} className="flex items-center gap-4 group p-3 hover:bg-slate-50 rounded-2xl transition-all">
                                <div className={cn("w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-white group-hover:shadow-sm transition-all", log.color)}>
                                    <log.icon size={18} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-slate-900">
                                        <span className="font-bold">{log.user}</span> {log.action}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-0.5">{log.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Platform Status */}
                <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                    <div className="relative z-10">
                        <h2 className="text-xl font-bold mb-6">Platform Status</h2>
                        <div className="space-y-6">
                            {[
                                { label: "Server Load", value: "15%", progress: 15, color: "bg-blue-500" },
                                { label: "Database Health", value: "99.9%", progress: 99, color: "bg-green-500" },
                                { label: "API Latency", value: "48ms", progress: 85, color: "bg-indigo-500" },
                                { label: "Storage", value: "4.2TB / 10TB", progress: 42, color: "bg-purple-500" },
                            ].map((s, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400 font-medium">{s.label}</span>
                                        <span className="font-bold">{s.value}</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${s.progress}%` }}
                                            className={cn("h-full rounded-full", s.color)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                </div>
            </div>
        </div>
    );
}

// Helper function to handle conditional classes (mimicking cn)
function cn(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}
