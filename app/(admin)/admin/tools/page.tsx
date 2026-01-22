"use client";

import { motion } from "framer-motion";
import { Plus, Search, ExternalLink, Edit2, Trash2, Grid, List, Globe, Lock } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const tools = [
    { id: 1, title: "ChatGPT", category: "General", url: "https://chat.openai.com", visibility: "Public", users: 1200 },
    { id: 2, title: "Perplexity", category: "Research", url: "https://www.perplexity.ai", visibility: "Public", users: 850 },
    { id: 3, title: "Grammarly", category: "Writing", url: "https://www.grammarly.com", visibility: "Premium Only", users: 420 },
    { id: 4, title: "Canva Studio", category: "Design", url: "https://www.canva.com", visibility: "Public", users: 2100 },
    { id: 5, title: "Interview Warmup", category: "Interview", url: "https://grow.google/...", visibility: "Public", users: 640 },
];

export default function ToolsManagement() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("list");

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">AI Tools Manager</h1>
                    <p className="text-slate-500 mt-1">Add, edit or remove external AI tools available to participants.</p>
                </div>
                <button className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all">
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
                        {tools.map((tool, idx) => (
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
        </div>
    );
}
