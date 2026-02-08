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
                const userPlan = profile.plan;
                const isPro = userPlan === "Pro Essential" || userPlan === "Elite Full Pack";
                const isAdmin = profile.role === "Admin" || profile.role === "Moderator";

                if (!isAdmin) {
                    const assessmentPaths = [
                        "/assessment/cv-upload",
                        "/assessment/interview",
                        "/assessment/results",
                        "/assessment/role-discovery",
                        "/assessment/role-suggestions",
                        "/assessment/role-matching"
                    ];
                    
                    const alwaysOpen = ["/dashboard", "/subscription", "/settings"];
                    
                    const isAlwaysOpen = alwaysOpen.some(p => pathname.startsWith(p));
                    const isAssessmentPath = assessmentPaths.some(p => pathname.startsWith(p));
                    const isSimulationPath = pathname.startsWith("/simulation");
                    const isTrainingPath = pathname.startsWith("/training");

                    // Check Time Limit (3 Hours from account creation)
                    let isTimeUp = false;
                    if (!isPro && profile.createdAt) {
                        const created = new Date(profile.createdAt).getTime();
                        const now = new Date().getTime();
                        // 3 hours in milliseconds
                        if (now - created > (3 * 60 * 60 * 1000)) {
                            isTimeUp = true;
                        }
                    }

                    // Logic for Free Users (Non-Pro)
                    if (!isPro) {
                        // CASE 1: Diagnosis Complete OR Time is Up
                        // Result: Diagnosis Locked, Simulations & Workshops Open
                        if (isDiagnosisComplete || isTimeUp) {
                            // 1. Assessment: LOCKED
                            if (isAssessmentPath) {
                                console.log("🔒 Access Denied (Complete/Expired) - Redirecting to Simulation");
                                router.replace("/simulation");
                                return;
                            }

                            // 2. Simulations & Workshops: OPEN
                            if (isSimulationPath || isTrainingPath) {
                                return;
                            }

                            // 3. Others: LOCKED (Redirect to Simulation)
                            if (!isAlwaysOpen) {
                                console.log("🔒 Feature Locked - Redirecting to Simulation");
                                router.replace("/simulation");
                                return;
                            }
                        }
                        
                        // CASE 2: Diagnosis Incomplete AND Time Remaining
                        // Result: Only Assessment Open
                        else {
                            if (!isAlwaysOpen && !isAssessmentPath) {
                                console.log("🔒 Diagnosis Incomplete - Redirecting to CV Upload");
                                router.replace("/assessment/cv-upload");
                                return;
                            }
                        }
                    }
                    // Logic for Pro Users
                    else {
                        // Pro: Access everything
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
