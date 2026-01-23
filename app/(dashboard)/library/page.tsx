"use client";

import { motion } from "framer-motion";
import { Download, Eye, FileText, FileSpreadsheet, File, Search, Filter, Loader2, Link as LinkIcon } from "lucide-react";
import { useState, useEffect } from "react";

export default function LibraryPage() {
    const [resources, setResources] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    const fetchResources = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/library');
            const data = await res.json();
            if (Array.isArray(data)) setResources(data);
        } catch (error) {
            console.error("Error fetching resources:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    const categories = ["All", ...new Set(resources.map(r => r.category))];

    const filteredResources = resources.filter(r => {
        const matchesCategory = activeCategory === "All" || r.category === activeCategory;
        const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.description?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const getIcon = (type: string) => {
        const t = type.toLowerCase();
        if (t.includes('excel') || t.includes('spreadsheet')) return <FileSpreadsheet className="w-6 h-6" />;
        if (t.includes('word') || t.includes('doc')) return <FileText className="w-6 h-6" />;
        if (t.includes('pdf')) return <File className="w-6 h-6" />;
        return <LinkIcon className="w-6 h-6" />;
    };

    const getColor = (type: string) => {
        const t = type.toLowerCase();
        if (t.includes('excel') || t.includes('spreadsheet')) return "emerald";
        if (t.includes('word') || t.includes('doc')) return "blue";
        if (t.includes('pdf')) return "red";
        return "indigo";
    };

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

                {/* Search */}
                <div className="relative group w-full md:w-72">
                    <input
                        type="text"
                        placeholder="Search resources..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm group-hover:shadow-md text-slate-900"
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
            {isLoading ? (
                <div className="py-20 text-center">
                    <Loader2 className="w-10 h-10 animate-spin mx-auto text-blue-600 mb-4" />
                    <p className="text-slate-500 font-medium">Loading premium resources...</p>
                </div>
            ) : filteredResources.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                    <p className="text-slate-400">No resources matches your criteria.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResources.map((resource, index) => {
                        const color = getColor(resource.type);
                        return (
                            <motion.div
                                key={resource._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden`}
                            >
                                {/* Top Type Badge */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`w-14 h-14 rounded-2xl bg-${color}-50 text-${color}-600 flex items-center justify-center shadow-inner`}>
                                        {getIcon(resource.type)}
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-${color}-50 text-${color}-600`}>
                                        {resource.type}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors line-clamp-1">
                                        {resource.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                                        {resource.description || "Premium professional resource for career growth."}
                                    </p>
                                </div>

                                {/* Footer Info */}
                                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mb-4">
                                    <div className="text-xs font-medium text-slate-400">
                                        Category: <span className="text-slate-600">{resource.category}</span>
                                    </div>
                                    <div className="text-xs font-medium text-slate-400">
                                        Size: <span className="text-slate-600">{resource.size || "Unknown"}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <a
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white font-medium transition-all shadow-md active:scale-95 bg-blue-600 hover:bg-blue-700`}
                                    >
                                        <Download className="w-4 h-4" />
                                        Access Resource
                                    </a>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
