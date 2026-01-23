"use client";

import { motion } from "framer-motion";
import { ArrowRight, Lock, Mail, Github, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useLanguage } from "@/components/providers/LanguageProvider";

function LoginContent() {
    const { t, dir } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
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

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-slate-500">{t.auth.orContinueWith}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                            <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                            <span className="font-medium text-slate-700">Google</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                            <Github className="w-5 h-5 text-slate-900" />
                            <span className="font-medium text-slate-700">GitHub</span>
                        </button>
                    </div>
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
