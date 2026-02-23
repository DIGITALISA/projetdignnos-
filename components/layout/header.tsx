"use client";

import { Bell, User, Sparkles, ChevronRight, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface HeaderProps {
    onOpenSidebar?: () => void;
}

export function Header({ onOpenSidebar }: HeaderProps) {
    const { t, dir } = useLanguage();
    const pathname = usePathname();
    const [user, setUser] = useState({ name: "User", plan: "Free" });

    useEffect(() => {
        // Wrap in macrotask to avoid synchronous setState in effect warnings
        const timeout = setTimeout(() => {
            const savedProfile = localStorage.getItem("userProfile");
            if (savedProfile) {
                try {
                    const profile = JSON.parse(savedProfile);
                    setUser({
                        name: profile.fullName || "Executive",
                        plan: profile.plan || "Free"
                    });
                } catch (e) {
                    console.error("Error parsing user profile:", e);
                }
            }
        }, 0);
        return () => clearTimeout(timeout);
    }, []);

    // Simple breadcrumb logic
    const getBreadcrumb = () => {
        const parts = pathname.split('/').filter(p => p && p !== 'dashboard');
        if (parts.length === 0) return t.sidebar.items.overview;
        
        // Map common paths to readable names
        const pathMap: Record<string, string> = {
            'assessment': t.sidebar.categories.diagnostic,
            'cv-upload': t.sidebar.items.diagnosis,
            'mentor': t.sidebar.items.mentor,
            'expert': t.sidebar.items.expert,
            'roadmap': t.sidebar.items.roadmap,
            'training': t.sidebar.items.training,
            'simulation': t.sidebar.items.tools,
            'library': t.sidebar.items.library,
            'strategic-report': t.sidebar.items.strategicReport,
            'certificate': t.sidebar.items.certificates,
            'recommendation': t.sidebar.items.recommendation,
            'attestations': t.sidebar.items.attestations,
        };

        return pathMap[parts[parts.length - 1]] || parts[parts.length - 1];
    };

    return (
        <header className="h-20 border-b border-slate-200 bg-white/70 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-4 md:px-8">
            {/* Left Section: Mobile Menu & Context */}
            <div className={cn("flex items-center gap-4", dir === 'rtl' ? 'flex-row-reverse' : '')}>
                <button
                    onClick={onOpenSidebar}
                    className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>

                <div className={cn("hidden sm:flex flex-col", dir === 'rtl' ? 'text-right' : 'text-left')}>
                    <div className={cn("flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5", dir === 'rtl' ? 'flex-row-reverse' : '')}>
                        <span>Success Workspace</span>
                        <ChevronRight className={cn("w-3 h-3", dir === 'rtl' ? 'rotate-180' : '')} />
                        <span className="text-blue-600">{getBreadcrumb()}</span>
                    </div>
                </div>
            </div>

            {/* Middle Section: AI Search / Interrogation */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
                <div className="relative w-full group">
                    <div className="absolute inset-0 bg-blue-600/5 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                    <form 
                        onSubmit={(e) => {
                            e.preventDefault();
                            const query = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value;
                            if (query.trim()) window.location.href = `/mentor?q=${encodeURIComponent(query)}`;
                        }}
                        className="relative flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 w-full text-sm text-slate-600 focus-within:bg-white focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-600/5 transition-all"
                    >
                        <Sparkles className="w-4 h-4 text-blue-500" />
                        <input
                            name="search"
                            type="text"
                            placeholder={dir === 'rtl' ? 'اسأل الذكاء الاصطناعي عن مسارك...' : 'Ask AI about your journey...'}
                            className="bg-transparent border-none outline-none w-full placeholder:text-slate-400 font-medium text-slate-900"
                        />
                        <button type="submit" className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[9px] font-black text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-colors uppercase tracking-tight">
                            {dir === 'rtl' ? 'دخول' : 'Entrée'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Right Section: Actions & Profile */}
            <div className={cn("flex items-center gap-3 md:gap-6", dir === 'rtl' ? 'flex-row-reverse' : '')}>
                <div className="flex items-center gap-2">
                    <button className="relative p-2.5 text-slate-500 hover:text-blue-600 transition-all bg-slate-50 hover:bg-white border border-transparent hover:border-blue-100 rounded-xl">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 border-2 border-white animate-pulse" />
                    </button>
                </div>

                <div className="h-10 w-px bg-slate-200 hidden sm:block" />

                <div className={cn("flex items-center gap-3 group cursor-pointer", dir === 'rtl' ? 'flex-row-reverse' : '')}>
                    <div className={cn("hidden md:flex flex-col items-end", dir === 'rtl' ? 'items-start' : 'items-end')}>
                        <span className="text-sm font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tight">{user.name}</span>
                        <div className={cn("flex items-center gap-1.5", dir === 'rtl' ? 'flex-row-reverse' : '')}>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{user.plan} Plan</span>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity" />
                        <div className="relative w-11 h-11 rounded-2xl bg-linear-to-br from-slate-800 to-slate-900 flex items-center justify-center border border-white/10 shadow-lg text-white group-hover:scale-105 transition-transform">
                            <User className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
