"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Users,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Search,
    Bell,
    ShieldCheck,
    Settings
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const modSidebarItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/moderateur" },
    { name: "Manage Admissions", icon: Users, href: "/moderateur/users" },
    { name: "Admin Panel", icon: Settings, href: "/admin" },
];

export default function ModeratorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const checkAuth = () => {
            const savedProfile = localStorage.getItem("userProfile");
            if (!savedProfile) {
                router.push("/login?callback=/moderateur");
                return;
            }
            const user = JSON.parse(savedProfile);
            if (user.role !== "Moderator" && user.role !== "Admin") {
                router.push("/dashboard");
                return;
            }
            setIsAuthorized(true);
        };
        checkAuth();
    }, [router]);

    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className={cn(
                "fixed left-0 top-0 h-screen bg-indigo-900 text-slate-300 z-50 transition-all duration-300 md:translate-x-0 w-72",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="h-20 flex items-center justify-between px-8 border-b border-indigo-800 bg-indigo-900/50 backdrop-blur-xl">
                    <Link href="/moderateur" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <ShieldCheck className="text-white" size={24} />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-white tracking-tight">Mod Panel</span>
                            <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">Moderation</span>
                        </div>
                    </Link>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-500">
                        <X size={20} />
                    </button>
                </div>

                <nav className="p-6 space-y-2">
                    {modSidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all group relative",
                                    isActive
                                        ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20"
                                        : "hover:bg-indigo-800 hover:text-white"
                                )}
                            >
                                <item.icon size={20} className={cn(
                                    "transition-colors",
                                    isActive ? "text-white" : "text-indigo-400 group-hover:text-white"
                                )} />
                                <span className="flex-1">{item.name}</span>
                                {isActive && <ChevronRight size={16} className="text-white/50" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 w-full p-6 border-t border-indigo-800">
                    <button
                        onClick={() => {
                            localStorage.removeItem("userProfile");
                            router.push("/login");
                        }}
                        className="flex items-center gap-4 px-4 py-3.5 w-full rounded-xl text-sm font-semibold text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all group"
                    >
                        <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-h-screen md:pl-72">
                <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg md:hidden">
                            <Menu size={24} />
                        </button>
                        <h2 className="text-lg font-bold text-slate-800">Moderator Dashboard</h2>
                    </div>
                </header>

                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
