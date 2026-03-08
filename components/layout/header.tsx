"use client";

import { Bell, User, Sparkles, ChevronRight, Menu, Award, FileText, CheckCircle2, ArrowLeft, Briefcase } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
            'attestations/certificate': t.sidebar.items.attestations,
        };

        const cleanPath = pathname.replace(/^\/(dashboard\/?)?/, '');
        if (pathMap[cleanPath]) return pathMap[cleanPath];

        const parts = pathname.split('/').filter(p => p && p !== 'dashboard');
        if (parts.length === 0) return t.sidebar.items.overview;
        
        return pathMap[parts[parts.length - 1]] || parts[parts.length - 1];
    };

    const isProRoute = ["/attestations", "/recommendation", "/strategic-report", "/certificate", "/resume-portfolio"].some(p => pathname.startsWith(p));
    const isProContext = user.plan === "Professional" || user.plan === "Pro Essential" || user.plan === "Unlimited" || 
                         (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get("layout") === "pro");

    if (isProRoute && isProContext) {
        return (
            <header className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-white/5 z-50 shadow-sm h-20 flex items-center justify-between px-6">
                <div className={cn("flex items-center gap-4 md:gap-8", dir === 'rtl' ? 'flex-row-reverse' : '')}>
                    <Link 
                        href="/professional/performance-studio"
                        className="p-2 text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors group"
                        title={dir === 'rtl' ? 'رجوع' : 'Back to Studio'}
                    >
                        <ArrowLeft className={cn("w-5 h-5 transition-transform", dir === 'rtl' ? 'rotate-180 group-hover:translate-x-0.5' : 'group-hover:-translate-x-0.5')} />
                    </Link>
                    <div className={cn("flex items-center gap-3", dir === 'rtl' ? 'flex-row-reverse' : '')}>
                        <div className="w-10 h-10 rounded-2xl bg-rose-600 flex items-center justify-center shadow-lg shadow-rose-600/20">
                            <Award className="text-white" size={24} />
                        </div>
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">Executive</div>
                            <div className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Studio</div>
                        </div>
                    </div>
                </div>

                <nav className="hidden lg:flex items-center gap-1 bg-slate-50 dark:bg-white/5 p-1 rounded-2xl">
                    <Link href={`/attestations?layout=pro`} className={cn("flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-black text-[10px] uppercase tracking-wider", pathname.startsWith('/attestations') || pathname.startsWith('/certificate') ? "bg-slate-900 text-white shadow-md" : "text-slate-400 hover:text-slate-900 hover:bg-white/50")}>
                        <Award size={14} className={pathname.startsWith('/attestations') ? "text-rose-500" : ""} />
                        {dir === 'rtl' ? 'الوثائق الرسمية' : 'Official Documents'}
                    </Link>
                    <Link href={`/recommendation?layout=pro`} className={cn("flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-black text-[10px] uppercase tracking-wider", pathname.startsWith('/recommendation') ? "bg-slate-900 text-white shadow-md" : "text-slate-400 hover:text-slate-900 hover:bg-white/50")}>
                        <FileText size={14} className={pathname.startsWith('/recommendation') ? "text-rose-500" : ""} />
                        {dir === 'rtl' ? 'خطاب توصية' : 'Recommendations'}
                    </Link>
                    <Link href={`/strategic-report?layout=pro`} className={cn("flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-black text-[10px] uppercase tracking-wider", pathname.startsWith('/strategic-report') ? "bg-slate-900 text-white shadow-md" : "text-slate-400 hover:text-slate-900 hover:bg-white/50")}>
                        <CheckCircle2 size={14} className={pathname.startsWith('/strategic-report') ? "text-rose-500" : ""} />
                        {dir === 'rtl' ? 'تقرير استراتيجي' : 'Strategic Reports'}
                    </Link>
                    <Link href={`/resume-portfolio?layout=pro`} className={cn("flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-black text-[10px] uppercase tracking-wider", pathname.startsWith('/resume-portfolio') ? "bg-slate-900 text-white shadow-md" : "text-slate-400 hover:text-slate-900 hover:bg-white/50")}>
                        <Briefcase size={14} className={pathname.startsWith('/resume-portfolio') ? "text-rose-500" : ""} />
                        {dir === 'rtl' ? 'السيرة الذاتية (ATS)' : 'ATS Resume'}
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end mr-2">
                        <span className="text-[10px] font-black uppercase text-slate-400">{user.plan}</span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white group flex items-center gap-1">
                            {user.name.split(' ')[0]}
                            <User className="text-rose-500" size={12} />
                        </span>
                    </div>
                    {/* Mobile menu trigger for pro header if needed, but horizontal usually scrolls. Added horizontal scroll nav for mobile */}
                </div>
            </header>
        );
    }

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
