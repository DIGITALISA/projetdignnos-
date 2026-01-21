"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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
    Award
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
        // Function to load profile
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

        // Initial load
        loadProfile();

        // Listen for updates
        window.addEventListener("profileUpdated", loadProfile);
        return () => window.removeEventListener("profileUpdated", loadProfile);
    }, []);

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={cn(
                "fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 z-50 transition-transform duration-300 ease-in-out md:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Brand */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-slate-900">
                            CareerUpgrade
                        </span>
                    </Link>
                    <button onClick={onClose} className="md:hidden text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar h-[calc(100vh-8rem)]">
                    {sidebarItems.map((group, idx) => (
                        <div key={idx} className="mb-8">
                            <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                {group.category}
                            </h3>
                            <div className="space-y-1">
                                {group.items.map((item) => {
                                    const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => onClose()} // Close on navigation (mobile)
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                                                isActive
                                                    ? "bg-blue-50 text-blue-700"
                                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                            )}
                                        >
                                            <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600")} />
                                            <span>{item.name}</span>

                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeSidebar"
                                                    className="absolute right-2 w-1.5 h-1.5 rounded-full bg-blue-600"
                                                />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* User Profile Footer */}
                <div className="absolute bottom-0 w-full p-4 border-t border-slate-100 bg-white">
                    <div className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex-shrink-0 flex items-center justify-center text-slate-500 font-bold">
                            {userName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{userName}</p>
                            <p className="text-xs text-slate-500 truncate">Premium Plan</p>
                        </div>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="p-2 rounded-lg hover:bg-red-50 transition-colors group"
                            title="Déconnexion"
                        >
                            <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-500 transition-colors" />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
