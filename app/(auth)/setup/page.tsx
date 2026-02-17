"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, UserPlus, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SetupPage() {
    const [status, setStatus] = useState<"checking" | "ready" | "done" | "already_done">("checking");
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const res = await fetch("/api/setup");
                const data = await res.json();
                if (data.setupRequired) {
                    setStatus("ready");
                } else {
                    setStatus("already_done");
                }
            } catch {
                setError("Failed to check system status");
            }
        };
        checkStatus();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/setup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (res.ok) {
                setStatus("done");
                setTimeout(() => router.push("/login"), 2000);
            } else {
                setError(data.error || "An error occurred");
            }
        } catch {
            setError("Connection failed");
        } finally {
            setIsLoading(false);
        }
    };

    if (status === "checking") return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
    );

    if (status === "already_done") return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full bg-white p-10 rounded-[3rem] shadow-xl text-center space-y-6">
                <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto text-green-600">
                    <Check size={36} />
                </div>
                <h1 className="text-2xl font-black text-slate-900">System Ready</h1>
                <p className="text-slate-500">The Admin account has already been created. You can now log in.</p>
                <button onClick={() => router.push("/login")} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-blue-600 transition-all">Go to Login</button>
            </motion.div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-indigo-50 via-white to-slate-50 flex items-center justify-center p-6 bg-fixed">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-blue-500/5 space-y-10 border border-white">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-xl shadow-blue-600/20">
                        <ShieldAlert size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Setup</h1>
                    <p className="text-slate-500 font-medium">Create the initial Super Admin account to begin managing your platform.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Full Name</label>
                        <input
                            required
                            type="text"
                            placeholder="e.g. Administrator"
                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500/20 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-900"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Admin Email</label>
                        <input
                            required
                            type="email"
                            placeholder="admin@platform.com"
                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500/20 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-900"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Secure Password</label>
                        <input
                            required
                            type="password"
                            placeholder="••••••••••••"
                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500/20 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-900"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    {error && (
                        <p className="text-xs font-bold text-red-500 text-center uppercase tracking-widest">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-indigo-600 hover:bg-slate-900 text-white rounded-4xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-70 active:scale-[0.98]"
                    >
                        {status === "done" ? <Check size={20} /> : isLoading ? <Loader2 className="animate-spin" size={20} /> : <UserPlus size={20} />}
                        {status === "done" ? "System Initialized!" : isLoading ? "Creating..." : "Initialize System"}
                    </button>
                </form>

                <div className="pt-4 border-t border-slate-50 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
                        Security Notice: This page will be disabled automatically after the first administrator is created.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
