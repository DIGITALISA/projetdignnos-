"use client";

import React, { useState } from "react";
import { ProfessionalSidebar } from "@/components/professional/ProfessionalSidebar";
import { ProfessionalHeader } from "@/components/professional/ProfessionalHeader";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";

export default function ProfessionalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { dir } = useLanguage();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const isRtl = dir === 'rtl';

    return (
        <div className="min-h-screen bg-slate-50 flex" dir={dir}>
            {/* Vertical Sidebar */}
            <ProfessionalSidebar 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
            />

            {/* Main Content Area */}
            <div className={cn(
                "flex-1 flex flex-col min-h-screen transition-all duration-300",
                isRtl ? "md:pr-72" : "md:pl-72"
            )}>
                {/* Header */}
                <ProfessionalHeader 
                    onOpenSidebar={() => setIsSidebarOpen(true)} 
                />

                {/* Main Content */}
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
