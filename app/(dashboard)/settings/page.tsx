"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Bell, User, Save, CheckCircle2, RotateCcw, Loader2, AlertTriangle } from "lucide-react";

export default function SettingsPage() {
    const [profile, setProfile] = useState({
        fullName: "Ahmed User",
        email: "ahmed@example.com",
        notifications: true,
        plan: "Free Trial"
    });
    const [saved, setSaved] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [resetRequested, setResetRequested] = useState(false);

    useEffect(() => {
        // Load saved profile on mount
        const savedProfile = localStorage.getItem("userProfile");
        if (savedProfile) {
            const parsed = JSON.parse(savedProfile);
            setProfile(parsed);
            if (parsed.resetRequested) setResetRequested(true);
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem("userProfile", JSON.stringify(profile));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);

        // Dispatch custom event to update other components immediately
        window.dispatchEvent(new Event("profileUpdated"));
    };

    const handleResetRequest = async () => {
        if (!window.confirm("Are you sure you want to request a full reset of your journey? This will delete all your diagnostic and simulation data once approved by an admin.")) {
            return;
        }

        setIsResetting(true);
        try {
            const res = await fetch('/api/user/request-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: profile.email || profile.fullName })
            });
            const data = await res.json();
            if (data.success) {
                setResetRequested(true);
                // Update local storage
                const updatedProfile = { ...profile, resetRequested: true };
                localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
                alert("Your request has been sent to the administration. Your profile will be reset shortly.");
            } else {
                alert(data.error || "Failed to send reset request.");
            }
        } catch (error) {
            console.error("Reset error:", error);
            alert("An error occurred. Please try again later.");
        } finally {
            setIsResetting(false);
        }
    };

    return (
        <div className="flex-1 max-w-4xl p-4 md:p-8 mx-auto">
            <div className="mb-12">
                <h1 className="text-3xl font-bold mb-2 text-slate-900 tracking-tight">Settings</h1>
                <p className="text-slate-500 font-medium">Manage your account and professional preferences.</p>
            </div>

            <div className="space-y-8">
                {/* Profile Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-4xl border border-slate-100 shadow-sm p-8"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Profile Information</h2>
                            <p className="text-sm text-slate-500 font-medium">Update your account details and public profile.</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                            <input
                                type="text"
                                value={profile.fullName}
                                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                                className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-900"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                            <input
                                type="email"
                                value={profile.email}
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-900"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Notifications Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-4xl border border-slate-100 shadow-sm p-8"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                            <Bell className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Notifications</h2>
                            <p className="text-sm text-slate-500 font-medium">Manage how you receive updates and alerts.</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <div>
                            <p className="font-bold text-slate-900">Email Notifications</p>
                            <p className="text-xs font-medium text-slate-500 mt-1">Receive weekly digests and important course updates.</p>
                        </div>
                        <button
                            onClick={() => setProfile({ ...profile, notifications: !profile.notifications })}
                            className={`w-14 h-7 rounded-full transition-all relative ${profile.notifications ? 'bg-blue-600' : 'bg-slate-300'}`}
                        >
                            <motion.div 
                                animate={{ x: profile.notifications ? 28 : 4 }}
                                className="w-5 h-5 bg-white rounded-full absolute top-1 shadow-sm" 
                            />
                        </button>
                    </div>
                </motion.div>

                {/* Danger Zone - Only for Paid Plans */}
                {(profile.plan === "Pro Essential") && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-rose-50/50 rounded-4xl border border-rose-100 p-8"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl">
                                <RotateCcw className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Journey Control</h2>
                                <p className="text-sm text-slate-500 font-medium">Request a full restart of your professional diagnostic path.</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-white rounded-2xl border border-rose-200/50 shadow-sm">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 text-rose-600 mb-1">
                                    <AlertTriangle size={16} />
                                    <span className="text-xs font-black uppercase tracking-widest">Progress Reset</span>
                                </div>
                                <p className="text-sm font-medium text-slate-600 max-w-md">
                                    This will archive your current progress and allow you to start from the beginning once approved by an expert.
                                </p>
                            </div>
                            <button
                                onClick={handleResetRequest}
                                disabled={isResetting || resetRequested}
                                className={cn(
                                    "flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all",
                                    resetRequested 
                                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-not-allowed" 
                                        : "bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-200"
                                )}
                            >
                                {isResetting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : resetRequested ? (
                                    <CheckCircle2 className="w-4 h-4" />
                                ) : (
                                    <RotateCcw className="w-4 h-4" />
                                )}
                                {resetRequested ? "Reset Request Pending" : "Request Full Reset"}
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
                    >
                        {saved ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
                        {saved ? "Profile Updated" : "Save Settings"}
                    </button>
                </div>
            </div>
        </div>
    );
}
