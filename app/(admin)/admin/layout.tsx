"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Users,
    PlayCircle,
    Library,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Search,
    Bell,
    Wrench
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const adminSidebarItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { name: "Participants", icon: Users, href: "/admin/users" },
    { name: "Tools AI", icon: Wrench, href: "/admin/tools" },
    { name: "Training Hub", icon: PlayCircle, href: "/admin/training" },
    { name: "Library", icon: Library, href: "/admin/library" },
    { name: "System Settings", icon: Settings, href: "/admin/settings" },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Admin Sidebar */}
            <aside className={cn(
                "fixed left-0 top-0 h-screen bg-slate-900 text-slate-300 z-50 transition-all duration-300 md:translate-x-0 w-72",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Brand */}
                <div className="h-20 flex items-center justify-between px-8 border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl">
                    <Link href="/admin" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <span className="font-black text-white text-xl">A</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-white tracking-tight">Admin Panel</span>
                            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Management</span>
                        </div>
                    </Link>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-500">
                        <X size={20} />
                    </button>
                </div>

                {/* Sidebar Nav */}
                <nav className="p-6 space-y-2">
                    {adminSidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all group relative",
                                    isActive
                                        ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20"
                                        : "hover:bg-slate-800 hover:text-white"
                                )}
                            >
                                <item.icon size={20} className={cn(
                                    "transition-colors",
                                    isActive ? "text-white" : "text-slate-500 group-hover:text-blue-400"
                                )} />
                                <span className="flex-1">{item.name}</span>
                                {isActive && <ChevronRight size={16} className="text-white/50" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Logout */}
                <div className="absolute bottom-0 w-full p-6 border-t border-slate-800">
                    <button className="flex items-center gap-4 px-4 py-3.5 w-full rounded-xl text-sm font-semibold text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all group">
                        <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen md:pl-72">
                {/* Admin Header */}
                <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg md:hidden"
                        >
                            <Menu size={24} />
                        </button>
                        <div className="relative hidden md:block group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search everything..."
                                className="pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm w-80 focus:ring-2 focus:ring-blue-500/10 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all relative">
                            < Bell size={20} />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                        </button>
                        <div className="h-8 w-px bg-slate-200 mx-2" />
                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-900">Ahmed Admin</p>
                                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">Super Admin</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-200 to-slate-300 border border-slate-300" />
                        </div>
                    </div>
                </header>

                {/* Workspace area */}
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
