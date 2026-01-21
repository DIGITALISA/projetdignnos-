"use client";

import { Navbar } from "@/components/ui/navbar";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* We render Navbar inside the pages now or here globaly */}
            {children}
        </div>
    );
}
