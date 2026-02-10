"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Menu, Loader2 } from "lucide-react";

import { usePathname, useRouter } from "next/navigation";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkAuth = () => {
            const savedProfile = localStorage.getItem("userProfile");
            if (!savedProfile) {
                // Ensure we don't loop on login redirect
                if (!pathname.startsWith("/login")) {
                    router.push("/login?callback=" + encodeURIComponent(pathname));
                }
                return;
            }

            try {
                const profile = JSON.parse(savedProfile);
                
                // 1. Diagnosis & Plan Access Control
                const isDiagnosisComplete = profile.isDiagnosisComplete === true;
                const isAdmin = profile.role === "Admin" || profile.role === "Moderator";

                if (!isAdmin) {
                     const restrictedPaths = [
                        "/simulation",
                        "/training",
                        "/mentor",
                        "/academy",
                        "/library",
                        "/expert",
                        "/roadmap"
                    ];

                    const isRestrictedPath = restrictedPaths.some(p => pathname.startsWith(p));

                    // STRICT FLOW: If Diagnosis is NOT complete, LOCK sections 2-7
                    if (!isDiagnosisComplete && isRestrictedPath) {
                        console.log("🔒 Restricted Area - Diagnosis Incomplete. Redirecting to Assessment.");
                        router.replace("/assessment/cv-upload");
                        return;
                    }
                }

            } catch (e) {
                console.error("Auth redirect error", e);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [pathname, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                    <p className="text-slate-500 font-medium">Chargement de votre espace...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex">

            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 md:pl-80">

                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-30">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="font-bold text-lg text-slate-900">CareerUpgrade</span>
                    <div className="w-8 h-8 rounded-full bg-slate-200" /> {/* Placeholder for profile */}
                </div>

                {/* Main Content */}
                <main className="flex-1 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
