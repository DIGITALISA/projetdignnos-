"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    FileText,
    Users,
    PlayCircle,
    Library,
    MessageSquare,
    Settings,
    LogOut,
    Sparkles,
    X,
    Award,
    ChevronRight,
    ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const sidebarItems = [
    {
        category: "Main",
        items: [
            { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
        ]
    },
    {
        category: "Career Journey",
        items: [
            { name: "1. Diagnosis", icon: FileText, href: "/assessment/cv-upload" },
            { name: "2. Tools AI", icon: Users, href: "/simulation" },
            { name: "3. Training Hub", icon: PlayCircle, href: "/training" },
            { name: "4. Library", icon: Library, href: "/library" },
            { name: "5. Expert Chat", icon: MessageSquare, href: "/expert" },
        ]
    },
    {
        category: "Achievements",
        items: [
            { name: "My Certificates", icon: Award, href: "/certificate" },
        ]
    },
    {
        category: "System",
        items: [
            { name: "Settings", icon: Settings, href: "/settings" },
        ]
    }
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const [userName, setUserName] = useState("Ahmed User");

    useEffect(() => {
        const loadProfile = () => {
            try {
                const savedProfile = localStorage.getItem("userProfile");
                if (savedProfile) {
                    const { fullName } = JSON.parse(savedProfile);
                    if (fullName) setUserName(fullName);
                }
            } catch (e) {
                console.error("Failed to load profile", e);
            }
        };

        loadProfile();
        window.addEventListener("profileUpdated", loadProfile);
        return () => window.removeEventListener("profileUpdated", loadProfile);
    }, []);

    return (
        <>
            {/* Mobile Overlay with Blur */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
                        onClick={onClose}
                    />
                )}
            </AnimatePresence>

            <aside className={cn(
                "fixed left-0 top-0 h-screen w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 z-50 transition-all duration-500 ease-in-out md:translate-x-0 shadow-2xl md:shadow-none",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Brand Header */}
                <div className="h-20 flex items-center justify-between px-7 border-b border-slate-100/80 bg-white/50">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:rotate-6 transition-transform duration-300">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-xl tracking-tight text-slate-900 leading-none">
                                CareerUpgrade
                            </span>
                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-blue-600 mt-1">
                                AI Platform
                            </span>
                        </div>
                    </Link>
                    <button
                        onClick={onClose}
                        className="md:hidden p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation Scroll Area */}
                <div className="flex-1 overflow-y-auto pt-8 pb-32 px-4 space-y-8 custom-scrollbar h-full">
                    {sidebarItems.map((group, idx) => (
                        <div key={idx} className="space-y-2">
                            <div className="px-4 flex items-center justify-between mb-2">
                                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">
                                    {group.category}
                                </h3>
                                <div className="h-px flex-1 bg-slate-100 ml-3 opacity-50" />
                            </div>

                            <div className="space-y-1">
                                {group.items.map((item) => {
                                    const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => onClose()}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group relative overflow-hidden",
                                                isActive
                                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                                    : "text-slate-600 hover:text-blue-600 hover:bg-blue-50/50"
                                            )}
                                        >
                                            <div className={cn(
                                                "relative z-10 w-5 h-5 flex items-center justify-center",
                                                isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600"
                                            )}>
                                                <item.icon className="w-full h-full" />
                                            </div>

                                            <span className="relative z-10 flex-1">{item.name}</span>

                                            {isActive ? (
                                                <motion.div
                                                    layoutId="activeChevron"
                                                    className="relative z-10"
                                                >
                                                    <ChevronRight className="w-4 h-4 text-white/70" />
                                                </motion.div>
                                            ) : (
                                                <ChevronRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                            )}

                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeHighlight"
                                                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600"
                                                    initial={false}
                                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Premium User Profile Footer */}
                <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-white via-white to-transparent">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold border border-white shadow-sm overflow-hidden">
                                    {userName.charAt(0)}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 truncate tracking-tight">{userName}</p>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Premium Member</p>
                                </div>
                            </div>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300 group"
                                title="Déconnexion"
                            >
                                <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
