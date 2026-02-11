"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, User, Save, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
    const [profile, setProfile] = useState({
        fullName: "Ahmed User",
        email: "ahmed@example.com",
        notifications: true
    });
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        // Load saved profile on mount
        const savedProfile = localStorage.getItem("userProfile");
        if (savedProfile) {
            Promise.resolve().then(() => {
                setProfile(JSON.parse(savedProfile));
            });
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem("userProfile", JSON.stringify(profile));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);

        // Dispatch custom event to update other components immediately
        window.dispatchEvent(new Event("profileUpdated"));
    };

    return (
        <div className="flex-1 max-w-4xl p-4 md:p-8 mx-auto">
            <div className="mb-12">
                <h1 className="text-3xl font-bold mb-2 text-slate-900">Settings</h1>
                <p className="text-slate-500">Manage your account and preferences.</p>
            </div>

            <div className="space-y-6">
                {/* Profile Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Profile Information</h2>
                            <p className="text-sm text-slate-500">Update your account details and public profile.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Full Name (Used for Certificates)</label>
                            <input
                                type="text"
                                value={profile.fullName}
                                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={profile.email}
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Notifications Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl border p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                            <Bell className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Notifications</h2>
                            <p className="text-sm text-slate-500">Manage how you receive updates.</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div>
                            <p className="font-medium text-slate-900">Email Notifications</p>
                            <p className="text-sm text-slate-500">Receive weekly digests and course updates.</p>
                        </div>
                        <button
                            onClick={() => setProfile({ ...profile, notifications: !profile.notifications })}
                            className={`w-12 h-6 rounded-full transition-colors relative ${profile.notifications ? 'bg-blue-600' : 'bg-slate-300'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${profile.notifications ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>
                </motion.div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
                    >
                        {saved ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Save className="w-5 h-5" />}
                        {saved ? "Changes Saved!" : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}
