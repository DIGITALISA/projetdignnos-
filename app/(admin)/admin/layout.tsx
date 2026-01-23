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
    Wrench,
    Lock,
    ShieldAlert,
    Loader2,
    ArrowRight
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

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
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isSectionUnlocked, setIsSectionUnlocked] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState("");

    const [userName, setUserName] = useState("Admin");
    const [userRole, setUserRole] = useState("Super Admin");

    const pathname = usePathname();
    const router = useRouter();

    const protectedPaths = ["/admin/tools", "/admin/training", "/admin/library", "/admin/settings"];
    const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

    useEffect(() => {
        const unlocked = sessionStorage.getItem("admin_section_unlocked") === "true";
        setIsSectionUnlocked(unlocked);
    }, []);

    useEffect(() => {
        const checkAuth = () => {
            const savedProfile = localStorage.getItem("userProfile");
            if (!savedProfile) {
                router.push("/login?callback=/admin");
                return;
            }
            const user = JSON.parse(savedProfile);
            if (user.role !== "Admin" && user.role !== "Moderator") {
                router.push("/dashboard");
                return;
            }
            setUserName(user.fullName);
            setUserRole(user.role === "Admin" ? "Super Admin" : "Moderator Access");
            setIsAuthorized(true);
        };
        checkAuth();
    }, [router]);

    const handleVerifyPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsVerifying(true);
        setError("");

        try {
            const res = await fetch("/api/admin/verify-protection", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: passwordInput })
            });

            const data = await res.json();

            if (data.success) {
                setIsSectionUnlocked(true);
                sessionStorage.setItem("admin_section_unlocked", "true");
            } else {
                setError(data.message || "Mot de passe incorrect");
            }
        } catch (err) {
            setError("Une erreur est survenue");
        } finally {
            setIsVerifying(false);
        }
    };

    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

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
                    <button
                        onClick={() => {
                            localStorage.removeItem("userProfile");
                            sessionStorage.removeItem("admin_section_unlocked");
                            window.location.href = '/';
                        }}
                        className="flex items-center gap-4 px-4 py-3.5 w-full rounded-xl text-sm font-semibold text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all group"
                    >
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
                                <p className="text-sm font-bold text-slate-900">{userName}</p>
                                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">{userRole}</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-200 to-slate-300 border border-slate-300 flex items-center justify-center font-bold text-slate-600">
                                {userName.charAt(0)}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Workspace area */}
                <main className="flex-1 p-8">
                    {isProtectedPath && !isSectionUnlocked ? (
                        <div className="h-full flex items-center justify-center min-h-[60vh]">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200 border border-slate-100 text-center space-y-8"
                            >
                                <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto text-amber-500 shadow-inner">
                                    <Lock size={36} />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Zone Protégée</h2>
                                    <p className="text-sm text-slate-500 font-medium">Un mot de passe administrateur est requis pour accéder à cette section.</p>
                                </div>

                                <form onSubmit={handleVerifyPassword} className="space-y-4">
                                    <div className="relative group">
                                        <input
                                            type="password"
                                            value={passwordInput}
                                            onChange={(e) => setPasswordInput(e.target.value)}
                                            placeholder="••••••••"
                                            className={cn(
                                                "w-full px-6 py-4 bg-slate-50 border-2 rounded-2xl text-center text-lg font-bold tracking-widest focus:bg-white transition-all outline-none",
                                                error ? "border-red-100 focus:border-red-500/20 text-red-600" : "border-transparent focus:border-blue-500/20"
                                            )}
                                            autoFocus
                                        />
                                        {error && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-[10px] font-black uppercase tracking-widest text-red-500 mt-2 flex items-center justify-center gap-1"
                                            >
                                                <ShieldAlert size={12} /> {error}
                                            </motion.p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isVerifying}
                                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 hover:bg-blue-600 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                                    >
                                        {isVerifying ? (
                                            <Loader2 className="animate-spin" size={20} />
                                        ) : (
                                            <>Débloquer <ArrowRight size={18} /></>
                                        )}
                                    </button>
                                </form>

                                <div className="pt-4 border-t border-slate-50">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
                                        Si vous avez oublié le mot de passe, contactez un modérateur pour le réinitialiser.
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    ) : (
                        children
                    )}
                </main>
            </div>
        </div>
    );
}
