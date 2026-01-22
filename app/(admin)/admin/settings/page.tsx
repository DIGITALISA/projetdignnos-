"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Bell, Globe, Cloud, Palette, HardDrive, Save } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminSettings() {
    return (
        <div className="space-y-8 max-w-5xl">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight text-center lg:text-left">System Settings</h1>
                <p className="text-slate-500 mt-1 text-center lg:text-left">Configure platform security, appearances and system integrations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Sidebar for Settings Sections (Visual only) */}
                <div className="md:col-span-1 space-y-2">
                    {[
                        { name: "General Settings", icon: Globe, active: true },
                        { name: "Security & Access", icon: Lock, active: false },
                        { name: "Branding", icon: Palette, active: false },
                        { name: "Notifications", icon: Bell, active: false },
                        { name: "Storage & Cloud", icon: Cloud, active: false },
                    ].map((item, i) => (
                        <button
                            key={i}
                            className={cn(
                                "w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all",
                                item.active ? "bg-slate-900 text-white shadow-xl" : "text-slate-500 hover:bg-white hover:text-slate-900"
                            )}>
                            <item.icon size={18} />
                            {item.name}
                        </button>
                    ))}
                </div>

                {/* Main Settings Form */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-8">
                        {/* Section: Platform Identity */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <Shield size={18} />
                                </div>
                                Platform Identity
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Platform Name</label>
                                    <input type="text" defaultValue="CareerUpgrade AI" className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/10 outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Support Email</label>
                                    <input type="email" defaultValue="support@careerupgrade.ai" className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/10 outline-none" />
                                </div>
                            </div>
                        </div>

                        {/* Section: File Limits */}
                        <div className="space-y-6 pt-8 border-t border-slate-50">
                            <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                    <HardDrive size={18} />
                                </div>
                                Upload Constraints
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Max CV Size (MB)</label>
                                    <input type="number" defaultValue="100" className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/10 outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Allowed Extensions</label>
                                    <input type="text" defaultValue=".pdf, .docx, .txt" className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/10 outline-none" />
                                </div>
                            </div>
                        </div>

                        {/* Save Action */}
                        <div className="pt-8 flex items-center justify-end gap-3">
                            <button className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Discard Changes</button>
                            <button className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all">
                                <Save size={18} />
                                Save Settings
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
