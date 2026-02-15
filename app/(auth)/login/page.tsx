"use client";

import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { useLanguage } from "@/components/providers/LanguageProvider";

function LoginContent() {
    const { t, dir } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();
    const callback = searchParams.get("callback");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (data.success) {
                // Clear any existing diagnostic data to prevent leakage from previous users
                localStorage.removeItem("cvAnalysis");
                localStorage.removeItem("interviewEvaluation");
                localStorage.removeItem("roleSuggestions");
                localStorage.removeItem("selectedLanguage");
                localStorage.removeItem("selectedRole");
                localStorage.removeItem("interviewProgress");

                // Save user profile to local storage for persistence across the app
                localStorage.setItem("userProfile", JSON.stringify(data.user));

                // Track update for components like Sidebar
                window.dispatchEvent(new Event("profileUpdated"));

                if (callback) {
                    window.location.href = callback;
                } else if (data.user.role === "Admin") {
                    window.location.href = "/admin";
                } else if (data.user.role === "Moderator") {
                    window.location.href = "/moderateur";
                } else {
                    window.location.href = "/dashboard";
                }
            } else {
                setError(data.error || t.auth.errorInvalid);
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(t.auth.errorGeneric);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div dir={dir} className="min-h-screen bg-slate-50 flex items-center justify-center relative overflow-hidden">
            {/* Background Shapes */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-200/50 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-200/50 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md p-8 relative z-10"
            >
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">{t.auth.welcomeBack}</h1>
                        <p className="text-slate-500">{t.auth.signInSubtitle}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">{t.auth.emailLabel}</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">{t.auth.passwordLabel}</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin w-5 h-5" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    {t.auth.signInButton}
                                    <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                                </span>
                            )}
                        </button>
                    </form>


                </div>

                <p className="text-center mt-6 text-sm text-slate-500">
                    {t.auth.noAccount} <Link href="/register" className="text-blue-600 font-semibold hover:underline">{t.auth.createOne}</Link>
                </p>
            </motion.div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<LoginFallback />}>
            <LoginContent />
        </Suspense>
    );
}

function LoginFallback() {
    const { t } = useLanguage();
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-center p-8">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <p className="font-bold text-slate-900 uppercase tracking-widest text-xs">{t.sidebar.loading || "Loading portal..."}</p>
            </div>
        </div>
    );
}
