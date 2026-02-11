"use client";


import { Users, Clock, ShieldCheck, AlertCircle, Zap, Brain } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface AdminStats {
    totalUsers: number | string;
    pendingUsers: number;
    activeTrials: number | string;
    completedDiagnoses: number | string;
    totalSimulations: number | string;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<AdminStats>({
        totalUsers: 0,
        pendingUsers: 0,
        activeTrials: 0,
        completedDiagnoses: 0,
        totalSimulations: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/admin/stats");
                const data = await res.json();
                if (data.success) {
                    setStats(data.stats);
                }
            } catch (e) {
                console.error("Failed to fetch admin stats", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        {
            name: "Total Participants",
            value: stats?.totalUsers || "0",
            change: "Live",
            icon: Users,
            color: "blue",
            link: "/admin/users"
        },
        {
            name: "Pending Requests",
            value: stats?.pendingUsers || "0",
            change: (stats?.pendingUsers || 0) > 0 ? "Action Required" : "Clean",
            icon: AlertCircle,
            color: (stats?.pendingUsers || 0) > 0 ? "red" : "green",
            link: "/admin/users"
        },
        {
            name: "Active Trials",
            value: stats?.activeTrials || "0",
            change: "1h Limit",
            icon: Zap,
            color: "orange",
            link: "/admin/users"
        },
        {
            name: "AI Diagnoses",
            value: stats?.completedDiagnoses || "0",
            change: "Completed",
            icon: Brain,
            color: "purple",
            link: "/admin/users"
        },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Overview</h1>
                    <p className="text-slate-500 mt-1 font-medium">Manage your platform content and participant access.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => (
                    <Link href={stat.link} key={stat.name}>
                        <div
                            className="bg-white p-6 rounded-4xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all group cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={cn(
                                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6 shadow-inner",
                                    stat.color === "blue" ? "bg-blue-50 text-blue-600" :
                                        stat.color === "red" ? "bg-red-50 text-red-600" :
                                            stat.color === "green" ? "bg-green-50 text-green-600" :
                                                stat.color === "purple" ? "bg-purple-50 text-purple-600" :
                                                    "bg-orange-50 text-orange-600"
                                )}>
                                    <stat.icon size={28} />
                                </div>
                                <span className={cn(
                                    "flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                    stat.color === "red" && (stats?.pendingUsers || 0) > 0 ? "bg-red-100 text-red-700 animate-pulse" : "bg-slate-100 text-slate-600"
                                )}>
                                    {stat.change}
                                </span>
                            </div>
                            <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest">{stat.name}</h3>
                            <p className="text-4xl font-black text-slate-900 mt-2 tracking-tight">
                                {isLoading ? "..." : stat.value}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                {/* Recent Activities Placeholder */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                            <Clock size={22} className="text-blue-600" />
                            Global Activity Stream
                        </h2>
                    </div>

                    <div className="space-y-6">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-slate-200" />
                            </div>
                        ) : (
                            <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-4xl">
                                <p className="text-slate-400 font-medium">Activity logs will appear here as users interact with the platform.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Platform Insights */}
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                    <div className="relative z-10">
                        <h2 className="text-xl font-black mb-8 flex items-center gap-3">
                            <ShieldCheck className="text-blue-400" />
                            Platform Health
                        </h2>
                        <div className="space-y-8">
                            {[
                                { label: "Total Simulations", value: stats?.totalSimulations || "0", color: "bg-blue-500" },
                                { label: "Database Objects", value: "Optimized", color: "bg-green-500" },
                                { label: "AI Response Time", value: "Sub 2s", color: "bg-indigo-500" },
                            ].map((s, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between text-xs tracking-widest font-black uppercase">
                                        <span className="text-slate-400">{s.label}</span>
                                        <span className="text-white">{s.value}</span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            style={{ width: '70%' }}
                                            className={cn("h-full rounded-full transition-all duration-1000", s.color)}
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

function Loader2(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    )
}
