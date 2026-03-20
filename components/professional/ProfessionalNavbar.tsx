"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Brain, 
    LogOut, 
    Sparkles, 
    Menu, 
    X
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";

export function ProfessionalNavbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { language } = useLanguage();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const t = {
        ar: {
            diagnosis: "التشخيص ومراجعة المسار المهني",
            dashboard: "لوحة التحكم",
            logout: "تسجيل الخروج",
            welcome: "حساب المهنيين"
        },
        en: {
            diagnosis: "Diagnosis & Career Review",
            dashboard: "Dashboard",
            logout: "Sign Out",
            welcome: "Professional Account"
        },
        fr: {
            diagnosis: "Diagnostic & Revue de Carrière",
            dashboard: "Tableau de Bord",
            logout: "Déconnexion",
            welcome: "Compte Professionnel"
        }
    }[language as 'ar' | 'en' | 'fr'] || {
        diagnosis: "Diagnosis & Career Review",
        dashboard: "Dashboard",
        logout: "Sign Out",
        welcome: "Professional Account"
    };

    const navItems = [
        { 
            label: t.diagnosis, 
            href: "/professional", 
            icon: <Brain size={18} />,
            active: pathname === "/professional" || pathname === "/professional/executive-dashboard"
        }
    ];

    const handleLogout = () => {
        localStorage.removeItem("userProfile");
        router.push("/login");
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-indigo-50/50 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
                {/* Logo & Brand */}
                <Link href="/professional" className="flex items-center gap-4 group">
                    <div className="w-11 h-11 bg-linear-to-br from-indigo-600 to-indigo-800 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200 group-hover:scale-105 transition-transform duration-300">
                        <Sparkles size={22} fill="currentColor" />
                    </div>
                    <div className="hidden md:block">
                        <h1 className="font-black text-slate-800 tracking-tighter text-2xl leading-none">MA TRAINING</h1>
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-500 mt-1 leading-none opacity-80">
                            {t.welcome}
                        </p>
                    </div>
                </Link>

                {/* Nav Items - Desktop (Centered) */}
                <div className="hidden md:flex flex-1 items-center justify-center gap-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-2.5 px-6 py-2.5 rounded-full text-sm font-black transition-all border-2 relative group",
                                item.active 
                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-2xl shadow-indigo-100" 
                                    : "bg-white text-slate-500 border-slate-100 hover:border-indigo-100 hover:text-indigo-600"
                            )}
                        >
                            <span className={cn(
                                "transition-transform group-hover:rotate-12",
                                item.active ? "text-white" : "text-indigo-500"
                            )}>
                                {item.icon}
                            </span>
                            <span>{item.label}</span>
                            {item.active && (
                                <motion.div 
                                    layoutId="nav-glow"
                                    className="absolute inset-0 bg-indigo-400/20 blur-xl rounded-full -z-10"
                                />
                            )}
                        </Link>
                    ))}
                </div>

                {/* User Actions */}
                <div className="flex items-center gap-4">
                    <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white">
                            P
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Status</span>
                            <span className="text-[11px] font-bold text-slate-900">Active Expert</span>
                        </div>
                    </div>

                    <button 
                        onClick={handleLogout}
                        className="p-3 bg-white text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all border border-slate-100 hover:border-rose-100 shadow-sm"
                        title={t.logout}
                    >
                        <LogOut size={20} />
                    </button>
                    
                    {/* Mobile Menu Toggle */}
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-3 bg-slate-900 text-white rounded-2xl shadow-xl hover:bg-indigo-600 transition-colors"
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden overflow-hidden bg-white border-t border-slate-100"
                    >
                        <div className="p-6 space-y-4 bg-slate-50/50">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "flex items-center gap-4 p-5 rounded-4xl font-black text-sm transition-all border-2",
                                        item.active 
                                            ? "bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-100" 
                                            : "bg-white text-slate-600 border-slate-100"
                                    )}
                                >
                                    <span className={item.active ? "text-white" : "text-indigo-500"}>
                                        {item.icon}
                                    </span>
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );

}
