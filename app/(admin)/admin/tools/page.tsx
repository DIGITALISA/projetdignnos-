"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, ExternalLink, Edit2, Trash2, Grid, List, Globe, Lock, X, Check, Loader2, Link as LinkIcon, Activity } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const initialTools = [
    { id: 1, title: "ChatGPT", category: "General", url: "https://chat.openai.com", visibility: "Public", users: 1200 },
    { id: 2, title: "Perplexity", category: "Research", url: "https://www.perplexity.ai", visibility: "Public", users: 850 },
    { id: 3, title: "Grammarly", category: "Writing", url: "https://www.grammarly.com", visibility: "Premium Only", users: 420 },
    { id: 4, title: "Canva Studio", category: "Design", url: "https://www.canva.com", visibility: "Public", users: 2100 },
    { id: 5, title: "Interview Warmup", category: "Interview", url: "https://grow.google/...", visibility: "Public", users: 640 },
];

export default function ToolsManagement() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("list");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        category: "General",
        url: "",
        visibility: "Public"
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setIsAddModalOpen(false);
        setFormData({ title: "", category: "General", url: "", visibility: "Public" });
        alert("AI Tool added successfully!");
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">AI Tools Manager</h1>
                    <p className="text-slate-500 mt-1">Add, edit or remove external AI tools available to participants.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
                >
                    <Plus size={20} />
                    Add New Tool
                </button>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                <div className="relative w-full lg:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search tools..."
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                    />
                </div>
                <div className="flex bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm">
                    <button
                        onClick={() => setViewMode("list")}
                        className={cn("p-2 rounded-xl transition-all", viewMode === "list" ? "bg-slate-900 text-white shadow-md" : "text-slate-400 hover:text-slate-600")}
                    >
                        <List size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode("grid")}
                        className={cn("p-2 rounded-xl transition-all", viewMode === "grid" ? "bg-slate-900 text-white shadow-md" : "text-slate-400 hover:text-slate-600")}
                    >
                        <Grid size={20} />
                    </button>
                </div>
            </div>

            {/* Content Rendering based on ViewMode */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 font-bold text-[11px] text-slate-500 uppercase tracking-widest">
                            <th className="px-8 py-5">Tool Name</th>
                            <th className="px-8 py-5">Category</th>
                            <th className="px-8 py-5">Visibility</th>
                            <th className="px-8 py-5">Usage</th>
                            <th className="px-8 py-5 text-right">Settings</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {initialTools.map((tool, idx) => (
                            <motion.tr
                                key={tool.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group hover:bg-slate-50/50 transition-colors"
                            >
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                                            <Globe size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{tool.title}</p>
                                            <div className="flex items-center gap-1.5 text-xs text-blue-500 hover:underline cursor-pointer">
                                                <ExternalLink size={10} />
                                                <span className="truncate max-w-[150px]">{tool.url}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-sm font-medium text-slate-600">{tool.category}</td>
                                <td className="px-8 py-5">
                                    <span className={cn(
                                        "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold",
                                        tool.visibility === "Public" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                                    )}>
                                        {tool.visibility === "Public" ? <Globe size={12} /> : <Lock size={12} />}
                                        {tool.visibility}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-sm font-bold text-slate-900">{tool.users} users</td>
                                <td className="px-8 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit2 size={16} /></button>
                                        <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Tool Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddModalOpen(false)}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl z-[70] overflow-hidden border border-slate-200"
                        >
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                            <Plus size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-900">Add AI Tool</h2>
                                            <p className="text-sm text-slate-500">Register a new external AI resource</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Tool Title</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="e.g. Midjourney AI"
                                                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none transition-all font-medium text-slate-900"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Category</label>
                                            <select
                                                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none transition-all font-medium text-slate-900 appearance-none cursor-pointer"
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            >
                                                <option>General</option>
                                                <option>Research</option>
                                                <option>Writing</option>
                                                <option>Design</option>
                                                <option>Interview</option>
                                                <option>CV & Resume</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Tool URL</label>
                                            <div className="relative">
                                                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input
                                                    required
                                                    type="url"
                                                    placeholder="https://example.com"
                                                    className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none transition-all font-medium text-slate-900"
                                                    value={formData.url}
                                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Access Visibility</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, visibility: "Public" })}
                                                    className={cn(
                                                        "px-4 py-3 rounded-2xl border-2 transition-all flex items-center justify-center gap-2 font-bold text-sm",
                                                        formData.visibility === "Public"
                                                            ? "bg-green-50 border-green-500 text-green-700"
                                                            : "bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100"
                                                    )}
                                                >
                                                    <Globe size={16} /> Public
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, visibility: "Premium Only" })}
                                                    className={cn(
                                                        "px-4 py-3 rounded-2xl border-2 transition-all flex items-center justify-center gap-2 font-bold text-sm",
                                                        formData.visibility === "Premium Only"
                                                            ? "bg-amber-50 border-amber-500 text-amber-700"
                                                            : "bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100"
                                                    )}
                                                >
                                                    <Lock size={16} /> Premium
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsAddModalOpen(false)}
                                            className="flex-1 px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-[2] px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold shadow-lg shadow-slate-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 size={20} className="animate-spin" />
                                                    Registering...
                                                </>
                                            ) : (
                                                <>
                                                    <Check size={20} />
                                                    Save Tool
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
