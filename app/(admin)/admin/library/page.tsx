"use client";

import { motion } from "framer-motion";
import { Upload, FileText, Download, Trash2, Edit2, Search, Filter, HardDrive } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const resources = [
    { id: 1, title: "Quarterly Budget Tracker", type: "XLSX", size: "2.4 MB", totalDownloads: 1240, lastUpdated: "2 days ago" },
    { id: 2, title: "Project Proposal Template", type: "DOCX", size: "850 KB", totalDownloads: 890, lastUpdated: "5 days ago" },
    { id: 3, title: "QHSE Compliance Guide", type: "PDF", size: "4.1 MB", totalDownloads: 2100, lastUpdated: "1 week ago" },
    { id: 4, title: "Safety Protocol Briefing", type: "PDF", size: "1.2 MB", totalDownloads: 450, lastUpdated: "3 weeks ago" },
];

export default function LibraryManagement() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Resource Library Manager</h1>
                    <p className="text-slate-500 mt-1">Upload and organize templates, guides and documentation.</p>
                </div>
                <button className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all">
                    <Upload size={20} />
                    Upload Resource
                </button>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
                <div className="relative w-full lg:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search resources..."
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/10 transition-all outline-none"
                    />
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 text-slate-400 text-xs font-bold uppercase tracking-widest">
                        <HardDrive size={16} />
                        Storage: 45% used
                    </div>
                    <button className="flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                        <Filter size={18} />
                        Filter Type
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((res, idx) => (
                    <motion.div
                        key={res.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={cn(
                                "w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner",
                                res.type === "PDF" ? "bg-red-50 text-red-500 border border-red-100" :
                                    res.type === "XLSX" ? "bg-green-50 text-green-500 border border-green-100" :
                                        "bg-blue-50 text-blue-500 border border-blue-100"
                            )}>
                                <FileText size={28} />
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit2 size={16} /></button>
                                <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                            </div>
                        </div>

                        <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{res.title}</h3>
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">Size</span>
                                <span className="text-sm font-bold text-slate-700">{res.size}</span>
                            </div>
                            <div className="flex flex-col text-right">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Downloads</span>
                                <div className="flex items-center gap-1.5 justify-end">
                                    <Download size={12} className="text-slate-400" />
                                    <span className="text-sm font-bold text-slate-700">{res.totalDownloads}</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Updated {res.lastUpdated}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
