"use client";

import { motion } from "framer-motion";
import { Download, Eye, FileText, FileSpreadsheet, File, Search, Filter } from "lucide-react";
import { useState } from "react";

export default function LibraryPage() {
    const [activeCategory, setActiveCategory] = useState("All");

    const resources = [
        {
            id: 1,
            title: "Quarterly Budget Tracker",
            description: "Automated excel sheet with dashboard and charts for financial tracking.",
            type: "Excel",
            fileType: "XLSX",
            size: "2.4 MB",
            category: "Finance",
            icon: <FileSpreadsheet className="w-6 h-6" />,
            color: "bg-emerald-50 text-emerald-600",
            borderColor: "border-emerald-100",
            buttonColor: "bg-emerald-600 hover:bg-emerald-700",
        },
        {
            id: 2,
            title: "Project Proposal Template",
            description: "Professional Word template for submitting high-value project bids.",
            type: "Word",
            fileType: "DOCX",
            size: "850 KB",
            category: "Management",
            icon: <FileText className="w-6 h-6" />,
            color: "bg-blue-50 text-blue-600",
            borderColor: "border-blue-100",
            buttonColor: "bg-blue-600 hover:bg-blue-700",
        },
        {
            id: 3,
            title: "QHSE Compliance Guide",
            description: "Comprehensive PDF guide for Quality, Health, Safety, and Environment standards.",
            type: "PDF",
            fileType: "PDF",
            size: "4.1 MB",
            category: "Guides",
            icon: <File className="w-6 h-6" />,
            color: "bg-red-50 text-red-600",
            borderColor: "border-red-100",
            buttonColor: "bg-red-600 hover:bg-red-700",
        },
    ];

    const categories = ["All", "Finance", "Management", "Guides"];

    const filteredResources = activeCategory === "All"
        ? resources
        : resources.filter(r => r.category === activeCategory);

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Resource Library</h1>
                    <p className="text-slate-500 text-lg max-w-2xl">
                        Download premium templates, worksheets, and guides to accelerate your career.
                        Professional mock documents ready for use.
                    </p>
                </div>

                {/* Search - Visual Only */}
                <div className="relative group w-full md:w-72">
                    <input
                        type="text"
                        placeholder="Search resources..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm group-hover:shadow-md"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-hover:text-blue-500 transition-colors" />
                </div>
            </div>

            {/* Categories Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-5 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${activeCategory === category
                                ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10"
                                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Resources Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource, index) => (
                    <motion.div
                        key={resource.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-white rounded-2xl border ${resource.borderColor} p-6 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden`}
                    >
                        {/* Top Type Badge */}
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-14 h-14 rounded-2xl ${resource.color} flex items-center justify-center shadow-inner`}>
                                {resource.icon}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${resource.color}`}>
                                {resource.fileType}
                            </span>
                        </div>

                        {/* Content */}
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors line-clamp-1">
                                {resource.title}
                            </h3>
                            <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                                {resource.description}
                            </p>
                        </div>

                        {/* Footer Info */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mb-4">
                            <div className="text-xs font-medium text-slate-400">
                                Category: <span className="text-slate-600">{resource.category}</span>
                            </div>
                            <div className="text-xs font-medium text-slate-400">
                                Size: <span className="text-slate-600">{resource.size}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white font-medium transition-all shadow-md active:scale-95 ${resource.buttonColor}`}>
                                <Download className="w-4 h-4" />
                                Download
                            </button>
                            <button className="px-3 py-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 border border-slate-200 transition-all" title="Preview">
                                <Eye className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
