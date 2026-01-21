"use client";

import { Bell, Search } from "lucide-react";

export function Header() {
    return (
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6 shadow-sm">
            {/* Search Bar */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-100 border border-slate-200 w-64 text-sm text-slate-600 focus-within:bg-white focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search resources..."
                    className="bg-transparent border-none outline-none w-full placeholder:text-slate-400 font-medium text-slate-900"
                />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                <button className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors bg-slate-50 rounded-full hover:bg-blue-50">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
                </button>
            </div>
        </header>
    );
}
