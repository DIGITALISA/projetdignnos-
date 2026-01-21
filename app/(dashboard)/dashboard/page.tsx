"use client";

import { motion } from "framer-motion";
import {
    Target,
    Zap,
    PlayCircle,
    BookOpen,
    MessageSquare,
    TrendingUp,
    Award,
    Clock,
    ArrowRight,
    CheckCircle2,
    ChevronRight
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function DashboardPage() {
    const [userName, setUserName] = useState("Ahmed");
    const progress = 35; // Example progress

    useEffect(() => {
        // Function to load profile
        const loadProfile = () => {
            try {
                const savedProfile = localStorage.getItem("userProfile");
                if (savedProfile) {
                    const { fullName } = JSON.parse(savedProfile);
                    if (fullName) {
                        setUserName(fullName.split(' ')[0] || fullName);
                    }
                }
            } catch (e) {
                console.error("Failed to load profile", e);
            }
        };

        // Initial load
        loadProfile();

        // Listen for updates
        window.addEventListener("profileUpdated", loadProfile);
        return () => window.removeEventListener("profileUpdated", loadProfile);
    }, []);

    const stats = [
        { label: "Skills Gained", value: "12", icon: Target, color: "blue", bg: "bg-blue-50", text: "text-blue-600" },
        { label: "Hours Learned", value: "8.5", icon: Clock, color: "purple", bg: "bg-purple-50", text: "text-purple-600" },
        { label: "Certificates", value: "2", icon: Award, color: "yellow", bg: "bg-yellow-50", text: "text-yellow-600" },
    ];

    const steps = [
        {
            title: "Diagnosis & Profiling",
            description: "AI-powered analysis of your CV & skills.",
            status: "completed",
            icon: Target,
            href: "/assessment/cv-upload",
            color: "bg-blue-50 text-blue-600",
            borderColor: "border-blue-200"
        },
        {
            title: "Role Simulation",
            description: "Practice real-world scenarios.",
            status: "in-progress",
            icon: Zap,
            href: "/simulation",
            color: "bg-purple-50 text-purple-600",
            borderColor: "border-purple-200"
        },
        {
            title: "Training Hub",
            description: "Curated courses for your gaps.",
            status: "locked",
            icon: PlayCircle,
            href: "/training",
            color: "bg-green-50 text-green-600",
            borderColor: "border-slate-100"
        },
        {
            title: "Digital Library",
            description: "Access premium resources.",
            status: "locked",
            icon: BookOpen,
            href: "/library",
            color: "bg-orange-50 text-orange-600",
            borderColor: "border-slate-100"
        },
        {
            title: "Expert Consultation",
            description: "1-on-1 strategy session.",
            status: "locked",
            icon: MessageSquare,
            href: "/expert",
            color: "bg-pink-50 text-pink-600",
            borderColor: "border-slate-100"
        }
    ];

    const resources = [
        { id: 1, title: "Advanced Leadership", type: "Video Course", duration: "45m", icon: PlayCircle, color: "blue" },
        { id: 2, title: "Strategic Thinking", type: "Guide", duration: "15m read", icon: BookOpen, color: "purple" },
        { id: 3, title: "Mock Interview", type: "Interactive", duration: "30m", icon: MessageSquare, color: "green" },
    ];

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 pb-24 md:pb-8">
            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-1 md:mb-2">
                        Welcome back, {userName} 👋
                    </h1>
                    <p className="text-slate-500 text-sm md:text-lg">
                        You're on track! Continue your journey to mastery.
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-slate-200 shadow-sm w-fit">
                    <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                    <span className="font-semibold text-xs md:text-sm text-slate-700">Top 5% of learners</span>
                </div>
            </motion.div>

            {/* Stats Grid - Mobile Optimized */}
            <div className="grid grid-cols-3 gap-3 md:gap-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-3 md:p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-2 md:gap-4"
                    >
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.text}`}>
                            <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div>
                            <p className="text-lg md:text-2xl font-bold text-slate-900">{stat.value}</p>
                            <p className="text-[10px] md:text-sm text-slate-500 font-medium leading-tight">{stat.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Progress Section - Bento Style */}
            <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
                {/* Left Col: Current Focus */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm flex flex-col relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100/50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <div className="flex items-center justify-between mb-6 md:mb-8 relative z-10">
                        <h2 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-purple-600" />
                            Current Focus
                        </h2>
                        <Link href="/simulation" className="text-xs md:text-sm font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 group-hover:gap-2 transition-all">
                            Continue
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="flex-1 bg-gradient-to-br from-purple-50 to-white rounded-2xl p-5 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 border border-purple-100/50 relative">
                        <div className="relative z-10 flex-1 space-y-3 md:space-y-4 w-full">
                            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-[10px] md:text-xs font-bold rounded-full uppercase tracking-wider">
                                In Progress
                            </span>
                            <h3 className="text-xl md:text-2xl font-bold text-slate-900">Role Simulation: Product Manager</h3>
                            <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                                You have completed 2 out of 5 scenarios. Your conflict resolution score is improving!
                            </p>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-semibold text-slate-500">
                                    <span>Progress</span>
                                    <span>40%</span>
                                </div>
                                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "40%" }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className="bg-purple-600 h-full rounded-full relative"
                                    >
                                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                    </motion.div>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 w-full md:w-auto mt-2 md:mt-0">
                            <button className="w-full md:w-auto px-6 py-3.5 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 active:scale-95 transition-all text-sm md:text-base">
                                Resume Simulation
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Right Col: Timeline */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-hidden h-fit"
                >
                    <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-6">Your Journey</h2>
                    <div className="relative space-y-0">
                        {/* Vertical Line */}
                        <div className="absolute left-[23px] md:left-[27px] top-4 bottom-4 w-[2px] bg-slate-100" />

                        {steps.map((step, idx) => (
                            <div key={idx} className="relative flex items-start gap-3 md:gap-4 pb-6 last:pb-0">
                                {/* Status Indicator */}
                                <div className={`relative z-10 w-12 h-12 md:w-14 md:h-14 flex-shrink-0 rounded-2xl flex items-center justify-center border-2 transition-all ${step.status === 'completed' || step.status === 'in-progress' ? 'bg-white ' + step.borderColor : 'bg-slate-50 border-transparent text-slate-300'}`}>
                                    {step.status === 'completed' ? (
                                        <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
                                    ) : (
                                        <step.icon className={`w-5 h-5 md:w-6 md:h-6`} />
                                    )}
                                </div>

                                <div className="pt-1.5 md:pt-2">
                                    <h3 className={`font-bold text-sm md:text-base ${step.status === 'locked' ? 'text-slate-400' : 'text-slate-900'}`}>
                                        {step.title}
                                    </h3>
                                    <p className="text-xs md:text-sm text-slate-400 leading-snug mt-0.5">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Recommended Section - Horizontal Scroll on Mobile */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <div className="flex items-center justify-between mb-4 md:mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900">Recommended for You</h2>
                    <Link href="/library" className="text-xs md:text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                        See all
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Scroll Container */}
                <div className="flex overflow-x-auto pb-4 gap-4 -mx-4 px-4 md:grid md:grid-cols-3 md:gap-6 md:mx-0 md:px-0 scrollbar-none snap-x">
                    {resources.map((item, i) => (
                        <div
                            key={item.id}
                            className="min-w-[280px] md:min-w-0 bg-white p-5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all cursor-pointer group snap-center"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${item.color}-50 text-${item.color}-600 group-hover:bg-${item.color}-600 group-hover:text-white transition-colors`}>
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className={`font-bold text-slate-900 group-hover:text-${item.color}-700 transition-colors`}>{item.title}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-500">{item.type}</span>
                                        <span className="text-xs text-slate-400">• {item.duration}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
