"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, Bell, Globe, Cloud, Palette, HardDrive, Save, Check, Loader2, Mail, LayoutGrid, Key, Eye, EyeOff, Camera, Github, Cpu, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function AdminSettings() {
    const [activeTab, setActiveTab] = useState("General Settings");
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const [settings, setSettings] = useState({
        platformName: "CareerUpgrade AI",
        supportEmail: "support@careerupgrade.ai",
        maxCvSize: "100",
        allowedExtensions: ".pdf, .docx, .txt",
        enableTwoFactor: true,
        passwordComplexity: "high",
        sessionTimeout: "30",
        primaryColor: "#2563eb",
        logoUrl: "https://logo.com/my-logo.png",
        enableEmailNotifications: true,
        enableSlackAlerts: false,
        s3Bucket: "career-upgrade-storage",
        region: "us-east-1",
        // AI Settings
        DEEPSEEK_API_KEY: "",
        DEEPSEEK_BASE_URL: "https://api.deepseek.com/v1",
        OPENAI_API_KEY: "",
        ACTIVE_AI_PROVIDER: "deepseek"
    });

    const fetchConfig = async () => {
        try {
            const res = await fetch("/api/admin/config");
            const data = await res.json();
            if (data.success) {
                setSettings(prev => ({ ...prev, ...data.configs }));
            }
        } catch (error) {
            console.error("Failed to fetch settings:", error);
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Save to DB
            const res = await fetch("/api/admin/config", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ configs: settings })
            });

            if (res.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            }
        } catch (error) {
            console.error("Save error:", error);
            alert("Failed to save settings");
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [
        { name: "General Settings", icon: Globe },
        { name: "AI Engine", icon: Cpu },
        { name: "Security & Access", icon: Lock },
        { name: "Branding", icon: Palette },
        { name: "Notifications", icon: Bell },
        { name: "Storage & Cloud", icon: Cloud },
    ];

    const Toggle = ({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) => (
        <div className="flex items-center justify-between py-2">
            <span className="text-sm font-bold text-slate-700">{label}</span>
            <button
                onClick={onClick}
                className={cn(
                    "w-12 h-6 rounded-full transition-all relative flex items-center px-1",
                    active ? "bg-blue-600" : "bg-slate-200"
                )}
            >
                <div className={cn(
                    "w-4 h-4 bg-white rounded-full shadow-sm transition-all transform",
                    active ? "translate-x-6" : "translate-x-0"
                )} />
            </button>
        </div>
    );

    return (
        <div className="space-y-8 max-w-5xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Settings</h1>
                    <p className="text-slate-500 mt-1">Configure platform security, appearances and system integrations.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Discard</button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={18} /> :
                            saved ? <Check size={18} /> : <Save size={18} />}
                        {isSaving ? "Saving..." : saved ? "Changes Saved" : "Save Settings"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Sidebar */}
                <div className="md:col-span-1 space-y-2">
                    {tabs.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => setActiveTab(item.name)}
                            className={cn(
                                "w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all",
                                activeTab === item.name ? "bg-slate-900 text-white shadow-xl" : "text-slate-500 hover:bg-white hover:text-slate-900"
                            )}>
                            <item.icon size={18} />
                            {item.name}
                        </button>
                    ))}
                </div>

                {/* Main View */}
                <div className="md:col-span-2">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8"
                        >
                            {activeTab === "General Settings" && (
                                <div className="space-y-8">
                                    <div className="space-y-6">
                                        <SectionHeader icon={Shield} title="Platform Identity" color="blue" />
                                        <div className="grid grid-cols-1 gap-4">
                                            <InputField label="Platform Name" value={settings.platformName} onChange={(v) => setSettings({ ...settings, platformName: v })} />
                                            <InputField label="Support Email" value={settings.supportEmail} type="email" onChange={(v) => setSettings({ ...settings, supportEmail: v })} />
                                        </div>
                                    </div>
                                    <div className="space-y-6 pt-8 border-t border-slate-50">
                                        <SectionHeader icon={HardDrive} title="Upload Constraints" color="indigo" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <InputField label="Max CV Size (MB)" value={settings.maxCvSize} type="number" onChange={(v) => setSettings({ ...settings, maxCvSize: v })} />
                                            <InputField label="Allowed Extensions" value={settings.allowedExtensions} onChange={(v) => setSettings({ ...settings, allowedExtensions: v })} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "Security & Access" && (
                                <div className="space-y-8">
                                    <div className="space-y-6">
                                        <SectionHeader icon={Lock} title="Two-Factor Authentication" color="red" />
                                        <Toggle
                                            label="Require 2FA for all Administrators"
                                            active={settings.enableTwoFactor}
                                            onClick={() => setSettings({ ...settings, enableTwoFactor: !settings.enableTwoFactor })}
                                        />
                                        <p className="text-xs text-slate-400">Forces all admin accounts to setup authentication via SMS or Authenticator app.</p>
                                    </div>
                                    <div className="space-y-6 pt-8 border-t border-slate-50">
                                        <SectionHeader icon={Key} title="Password Policy" color="amber" />
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase">Minimum Complexity</label>
                                                <select
                                                    className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none"
                                                    value={settings.passwordComplexity}
                                                    onChange={(e) => setSettings({ ...settings, passwordComplexity: e.target.value })}
                                                >
                                                    <option value="low">Low (8 chars)</option>
                                                    <option value="medium">Medium (8 chars + symbols)</option>
                                                    <option value="high">High (12 chars + mixed case + symbols)</option>
                                                </select>
                                            </div>
                                            <InputField label="Session Timeout (Minutes)" value={settings.sessionTimeout} type="number" onChange={(v) => setSettings({ ...settings, sessionTimeout: v })} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "Branding" && (
                                <div className="space-y-8">
                                    <div className="space-y-6">
                                        <SectionHeader icon={Palette} title="Aesthetics" color="purple" />
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase">Primary Brand Color</label>
                                                <div className="flex gap-4">
                                                    <div className="w-12 h-12 rounded-xl border border-slate-200" style={{ backgroundColor: settings.primaryColor }} />
                                                    <input
                                                        type="text"
                                                        value={settings.primaryColor}
                                                        onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                                        className="flex-1 px-5 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-6 pt-8 border-t border-slate-50">
                                        <SectionHeader icon={Camera} title="Logo & Assets" color="blue" />
                                        <div className="space-y-4 text-center">
                                            <div className="w-full h-32 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-4">
                                                <LayoutGrid size={24} className="text-slate-300 mb-2" />
                                                <span className="text-xs font-bold text-slate-400">Drag logo here or click to upload</span>
                                            </div>
                                            <InputField label="Logo Image URL" value={settings.logoUrl} onChange={(v) => setSettings({ ...settings, logoUrl: v })} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "Notifications" && (
                                <div className="space-y-8">
                                    <div className="space-y-6">
                                        <SectionHeader icon={Mail} title="Email System" color="blue" />
                                        <Toggle
                                            label="Broadcasting Alerts"
                                            active={settings.enableEmailNotifications}
                                            onClick={() => setSettings({ ...settings, enableEmailNotifications: !settings.enableEmailNotifications })}
                                        />
                                        <p className="text-xs text-slate-400">Send system-wide announcements to all participants via email.</p>
                                    </div>
                                    <div className="space-y-6 pt-8 border-t border-slate-50">
                                        <SectionHeader icon={Github} title="Slack Integration" color="indigo" />
                                        <Toggle
                                            label="Real-time Admin Monitoring"
                                            active={settings.enableSlackAlerts}
                                            onClick={() => setSettings({ ...settings, enableSlackAlerts: !settings.enableSlackAlerts })}
                                        />
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                                            <span className="text-xs font-bold text-slate-500 italic">No Slack Webhook configured yet</span>
                                            <button className="text-xs font-bold text-blue-600 hover:underline">Connect</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "Storage & Cloud" && (
                                <div className="space-y-8">
                                    <div className="space-y-6">
                                        <SectionHeader icon={Cloud} title="S3 Storage Configuration" color="blue" />
                                        <div className="grid grid-cols-1 gap-4">
                                            <InputField label="Bucket Name" value={settings.s3Bucket} onChange={(v) => setSettings({ ...settings, s3Bucket: v })} />
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase">Region</label>
                                                <select
                                                    className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none"
                                                    value={settings.region}
                                                    onChange={(e) => setSettings({ ...settings, region: e.target.value })}
                                                >
                                                    <option value="us-east-1">US East (N. Virginia)</option>
                                                    <option value="eu-west-1">EU (Ireland)</option>
                                                    <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                                        <p className="text-xs font-medium text-amber-700">Changing cloud bucket settings will not automatically migrate existing files. Manual migration is required.</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === "AI Engine" && (
                                <div className="space-y-8">
                                    <div className="space-y-6">
                                        <SectionHeader icon={Sparkles} title="Global AI Brain" color="blue" />
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase">Active Provider</label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <button
                                                        onClick={() => setSettings({ ...settings, ACTIVE_AI_PROVIDER: 'deepseek' })}
                                                        className={cn(
                                                            "px-5 py-4 rounded-2xl text-sm font-bold border-2 transition-all text-center",
                                                            settings.ACTIVE_AI_PROVIDER === 'deepseek' ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-100 text-slate-500 hover:bg-slate-50"
                                                        )}
                                                    >
                                                        DeepSeek (Default)
                                                    </button>
                                                    <button
                                                        onClick={() => setSettings({ ...settings, ACTIVE_AI_PROVIDER: 'openai' })}
                                                        className={cn(
                                                            "px-5 py-4 rounded-2xl text-sm font-bold border-2 transition-all text-center",
                                                            settings.ACTIVE_AI_PROVIDER === 'openai' ? "border-green-600 bg-green-50 text-green-700" : "border-slate-100 text-slate-500 hover:bg-slate-50"
                                                        )}
                                                    >
                                                        OpenAI (GPT-4o)
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6 pt-8 border-t border-slate-50">
                                        <SectionHeader icon={Cpu} title="Provider Credentials" color="indigo" />
                                        <div className="space-y-6">
                                            <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-4">
                                                <h4 className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                    DeepSeek Configuration
                                                </h4>
                                                <InputField
                                                    label="DeepSeek API Key"
                                                    value={settings.DEEPSEEK_API_KEY}
                                                    type="password"
                                                    onChange={(v) => setSettings({ ...settings, DEEPSEEK_API_KEY: v })}
                                                />
                                                <InputField
                                                    label="Base URL"
                                                    value={settings.DEEPSEEK_BASE_URL}
                                                    onChange={(v) => setSettings({ ...settings, DEEPSEEK_BASE_URL: v })}
                                                />
                                            </div>

                                            <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-4">
                                                <h4 className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                                    OpenAI Configuration
                                                </h4>
                                                <InputField
                                                    label="OpenAI API Key"
                                                    value={settings.OPENAI_API_KEY}
                                                    type="password"
                                                    onChange={(v) => setSettings({ ...settings, OPENAI_API_KEY: v })}
                                                />
                                                <p className="text-[10px] text-slate-400 italic">OpenAI uses the default base URL for the chat completions API.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                                        <p className="text-xs font-semibold text-blue-800 flex items-center gap-2">
                                            <Sparkles size={14} />
                                            If keys are left empty here, the system will fallback to the keys defined in your environment variables (.env).
                                        </p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function SectionHeader({ icon: Icon, title, color }: { icon: any, title: string, color: string }) {
    const colors = {
        blue: "bg-blue-50 text-blue-600",
        indigo: "bg-indigo-50 text-indigo-600",
        red: "bg-red-50 text-red-600",
        amber: "bg-amber-50 text-amber-600",
        purple: "bg-purple-50 text-purple-600",
    };
    return (
        <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", colors[color as keyof typeof colors])}>
                <Icon size={18} />
            </div>
            {title}
        </h2>
    );
}

function InputField({ label, value, onChange, type = "text" }: { label: string, value: string, onChange: (v: string) => void, type?: string }) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
            />
        </div>
    );
}
