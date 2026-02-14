"use client";


import { Users, Clock, ShieldCheck, AlertCircle, Brain, Building2, User as UserIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface Activity {
    id: string;
    type: string;
    title: string;
    description: string;
    timestamp: string;
    icon: 'user' | 'brain' | 'building';
}

interface AdminStats {
    totalUsers: number;
    pendingUsers: number;
    activeTrials: number;
    completedDiagnoses: number;
    totalSimulations: number;
    totalInquiries: number;
    corporateReady: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<AdminStats>({
        totalUsers: 0,
        pendingUsers: 0,
        activeTrials: 0,
        completedDiagnoses: 0,
        totalSimulations: 0,
        totalInquiries: 0,
        corporateReady: 0
    });
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, activityRes] = await Promise.all([
                    fetch("/api/admin/stats"),
                    fetch("/api/admin/activities")
                ]);
                
                const statsData = await statsRes.json();
                const activityData = await activityRes.json();

                if (statsData.success) setStats(statsData.stats);
                if (activityData.success) setActivities(activityData.activities);
            } catch (e) {
                console.error("Failed to fetch admin dashboard data", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
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
            name: "Corporate Mandates",
            value: stats?.totalInquiries || "0",
            change: "B2B Activity",
            icon: Building2,
            color: "indigo",
            link: "/admin/inquiries"
        },
        {
            name: "AI Diagnoses",
            value: stats?.completedDiagnoses || "0",
            change: "Profiles Ready",
            icon: Brain,
            color: "purple",
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
                                                    stat.color === "indigo" ? "bg-indigo-50 text-indigo-600" :
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
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                                <p className="text-sm font-medium text-slate-400">Synchronizing global logs...</p>
                            </div>
                        ) : activities.length > 0 ? (
                            <div className="space-y-4">
                                {activities.map((activity) => (
                                    <div key={activity.id} className="flex items-center gap-4 p-4 rounded-3xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                                            activity.type === 'user_registration' ? "bg-blue-50 text-blue-600" :
                                            activity.type === 'diagnosis_complete' ? "bg-purple-50 text-purple-600" :
                                            "bg-indigo-50 text-indigo-600"
                                        )}>
                                            {activity.icon === 'user' && <UserIcon size={20} />}
                                            {activity.icon === 'brain' && <Brain size={20} />}
                                            {activity.icon === 'building' && <Building2 size={20} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="text-sm font-black text-slate-900">{activity.title}</h4>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true, locale: fr })}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 font-medium">{activity.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-4xl">
                                <p className="text-slate-400 font-medium">No recent activities found.</p>
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
                                { label: "Corporate Candidates", value: stats?.corporateReady || "0", color: "bg-green-500" },
                                { label: "AI Response Time", value: "Sub 2s", color: "bg-indigo-500" },
                            ].map((s, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between text-xs tracking-widest font-black uppercase">
                                        <span className="text-slate-400">{s.label}</span>
                                        <span className="text-white">{s.value}</span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            style={{ width: '85%' }}
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
