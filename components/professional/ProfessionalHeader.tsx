"use client";

import React, { useEffect, useState } from "react";
import { Menu, Bell, Search, X, RefreshCw, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";

interface ProfessionalHeaderProps {
    onOpenSidebar: () => void;
}

interface NotificationType {
    _id: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
}

export function ProfessionalHeader({ onOpenSidebar }: ProfessionalHeaderProps) {
    const { language, setLanguage, dir } = useLanguage();
    const isRtl = dir === 'rtl';

    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const userProfileRaw = localStorage.getItem('userProfile');
                if (!userProfileRaw) return;
                const email = JSON.parse(userProfileRaw).email;
                
                const res = await fetch(`/api/user/notifications?email=${email}`);
                const data = await res.json();
                if (data.success) {
                    setNotifications(data.notifications);
                    setUnreadCount(data.unreadCount);
                }
            } catch (err) {
                console.error("Failed to fetch notifications", err);
            }
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000); 
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await fetch('/api/user/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notificationId: id })
            });
            setUnreadCount(prev => Math.max(0, prev - 1));
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
        } catch (err) {
            console.error("Mark read error", err);
        }
    };

    return (
        <header className="sticky top-0 z-30 h-24 bg-slate-950/90 backdrop-blur-xl border-b border-white/5 px-8 flex items-center justify-between transition-all duration-300">
            {/* Left side: Mobile Toggle & Contextual Info */}
            <div className="flex items-center gap-6">
                <button 
                    onClick={onOpenSidebar}
                    className="md:hidden p-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white rounded-2xl shadow-xl transition-all active:scale-95"
                >
                    <Menu size={22} />
                </button>
                
                <div className="hidden md:flex flex-col text-left">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">
                        <span className="opacity-50">Enterprise</span>
                        <ChevronRight size={10} />
                        <span className="text-indigo-400">Professional Hub</span>
                    </div>
                    <h2 className="text-sm font-black text-white uppercase tracking-tight">
                        {language === 'ar' ? 'نظام التحكم القيادي' : language === 'fr' ? 'Système de Contrôle' : 'Executive Control System'}
                    </h2>
                </div>

                <div className="hidden lg:flex items-center gap-3 px-5 py-2.5 bg-slate-900 border border-white/5 rounded-2xl shadow-inner focus-within:border-indigo-500/50 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all group min-w-[300px]">
                    <Search size={16} className="text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input 
                        type="text" 
                        placeholder={language === 'ar' ? 'بحث عن موارد، خبراء، أو تقارير...' : 'Search resources, experts, reports...'} 
                        className="bg-transparent border-none text-xs font-bold text-slate-300 outline-none w-full placeholder:text-slate-700"
                    />
                </div>
            </div>

            {/* Right side: Global Actions */}
            <div className={cn("flex items-center gap-4", isRtl && "flex-row-reverse")}>
                {/* Status Indicator (Desktop) */}
                <div className="hidden xl:flex items-center gap-3 px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none">
                        {language === 'ar' ? 'النظام متصل' : 'System Online'}
                    </span>
                </div>

                <div className="h-8 w-px bg-white/5 mx-2" />

                <div className="relative">
                    <button 
                        onClick={() => setShowDropdown(!showDropdown)}
                        className={cn(
                            "p-3 bg-slate-900 border border-white/10 rounded-2xl transition-all shadow-lg active:scale-95 relative group",
                            unreadCount > 0 
                                ? "text-indigo-400 border-indigo-500/30 bg-indigo-500/10" 
                                : "text-slate-400 hover:text-white hover:border-white/20 hover:bg-white/5"
                        )}
                    >
                        <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-slate-950 animate-bounce shadow-[0_0_15px_rgba(244,63,94,0.4)]">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    <AnimatePresence>
                        {showDropdown && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className={cn(
                                    "absolute top-full mt-4 w-80 bg-slate-900/90 border border-white/10 rounded-4xl shadow-2xl overflow-hidden z-50 backdrop-blur-2xl ring-1 ring-white/5",
                                    isRtl ? "left-0" : "right-0"
                                )}
                            >
                                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-950/50 text-left">
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white">Notifications</h4>
                                    <button onClick={() => setShowDropdown(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-colors">
                                        <X size={16} />
                                    </button>
                                </div>
                                <div className="max-h-[400px] overflow-y-auto custom-scrollbar text-left">
                                    {notifications.length > 0 ? (
                                        notifications.map((n) => (
                                            <div 
                                                key={n._id} 
                                                onClick={() => !n.read && markAsRead(n._id)}
                                                className={cn(
                                                    "p-6 hover:bg-white/5 transition-all cursor-pointer border-b border-white/5 group",
                                                    !n.read && "bg-indigo-500/5 border-l-4 border-l-indigo-500"
                                                )}
                                            >
                                                <div className="flex justify-between items-start gap-3 mb-2">
                                                    <h5 className="text-[11px] font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{n.title}</h5>
                                                    <span className="text-[8px] text-slate-500 font-bold whitespace-nowrap">{new Date(n.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-[10px] text-slate-400 leading-relaxed font-medium">{n.message}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-12 text-center space-y-4">
                                            <div className="w-16 h-16 bg-slate-950 rounded-3xl flex items-center justify-center mx-auto border border-white/5">
                                                <Bell size={32} className="text-slate-800" />
                                            </div>
                                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">No signals received</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Desktop Global Switchers */}
                <div className="hidden sm:flex items-center gap-2 p-1.5 bg-slate-900 border border-white/10 rounded-2xl shadow-inner">
                    {[
                        { id: 'ar', label: 'عربي' },
                        { id: 'en', label: 'ENG' },
                        { id: 'fr', label: 'FRA' }
                    ].map((l) => (
                        <button
                            key={l.id}
                            onClick={() => setLanguage(l.id as "ar" | "en" | "fr")}
                            className={cn(
                                "px-4 py-2 rounded-xl text-[9px] font-black transition-all uppercase tracking-tighter",
                                language === l.id 
                                    ? "bg-indigo-600 text-white shadow-[0_4px_15px_rgba(79,70,229,0.4)]" 
                                    : "text-slate-500 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {l.label}
                        </button>
                    ))}
                </div>

                <button 
                    onClick={() => window.location.reload()}
                    className="p-3 bg-slate-900 border border-white/10 rounded-2xl text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30 hover:bg-white/5 transition-all shadow-lg flex items-center gap-2 group active:scale-95"
                    title={language === 'ar' ? 'مزامنة البيانات' : 'Sync Intelligence'}
                >
                    <RefreshCw size={18} className="group-active:rotate-180 transition-transform duration-700 ease-in-out" />
                </button>
            </div>
        </header>
    );
}
