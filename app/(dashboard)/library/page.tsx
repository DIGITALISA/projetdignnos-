"use client";

import { motion } from "framer-motion";
import { Download, Eye, FileText, FileSpreadsheet, File, Search, Filter, Loader2, Link as LinkIcon, Sparkles, Globe, ExternalLink, Lock, Zap } from "lucide-react";
import { useState, useEffect } from "react";

export default function LibraryPage() {
    const [resources, setResources] = useState<any[]>([]);
    const [tools, setTools] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"documents" | "ai_tools">("documents");
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [libRes, toolsRes] = await Promise.all([
                fetch('/api/admin/library'),
                fetch('/api/admin/tools')
            ]);

            const libData = await libRes.json();
            const toolsData = await toolsRes.json();

            if (Array.isArray(libData)) setResources(libData);
            if (Array.isArray(toolsData)) setTools(toolsData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Filter Logic
    const currentItems = activeTab === "documents" ? resources : tools;

    // Extract unique categories for the current active tab
    const categories = ["All", ...new Set(currentItems.map(item => item.category))];

    const filteredItems = currentItems.filter(item => {
        const matchesCategory = activeCategory === "All" || item.category === activeCategory;
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.description || "").toLowerCase().includes(searchTerm.toLowerCase());

        // For tools, we might want to respect visibility if we had user roles, 
        // but assuming the API returns what the user is allowed to see.
        return matchesCategory && matchesSearch;
    });

    const getIcon = (type: string) => {
        const t = (type || "").toLowerCase();
        if (t.includes('excel') || t.includes('spreadsheet')) return <FileSpreadsheet className="w-6 h-6" />;
        if (t.includes('word') || t.includes('doc')) return <FileText className="w-6 h-6" />;
        if (t.includes('pdf')) return <File className="w-6 h-6" />;
        return <LinkIcon className="w-6 h-6" />;
    };

    const getColor = (type: string) => {
        const t = (type || "").toLowerCase();
        if (t.includes('excel') || t.includes('spreadsheet')) return "emerald";
        if (t.includes('word') || t.includes('doc')) return "blue";
        if (t.includes('pdf')) return "red";
        return "indigo";
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-2">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Resource Library</h1>
                    <p className="text-slate-500 text-lg max-w-2xl font-medium">
                        Access premium templates and AI-powered tools to accelerate your executive career.
                    </p>
                </div>

                {/* Search */}
                <div className="relative group w-full md:w-72">
                    <input
                        type="text"
                        placeholder={activeTab === 'documents' ? "Search documents..." : "Search AI tools..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm group-hover:shadow-md text-slate-900 font-medium"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-hover:text-blue-500 transition-colors" />
                </div>
            </div>

            {/* Main Tabs */}
            <div className="flex p-1 bg-slate-100 rounded-2xl w-fit">
                <button
                    onClick={() => { setActiveTab("documents"); setActiveCategory("All"); }}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "documents"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                        }`}
                >
                    <FileText size={16} /> Documents & Templates
                </button>
                <button
                    onClick={() => { setActiveTab("ai_tools"); setActiveCategory("All"); }}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "ai_tools"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                        }`}
                >
                    <Sparkles size={16} /> AI Command Center
                </button>
            </div>

            {/* Categories Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wide whitespace-nowrap transition-all ${activeCategory === category
                            ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10"
                            : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Content Grid */}
            {isLoading ? (
                <div className="py-20 text-center">
                    <Loader2 className="w-10 h-10 animate-spin mx-auto text-blue-600 mb-4" />
                    <p className="text-slate-500 font-medium">Loading premium resources...</p>
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                        <Filter size={32} />
                    </div>
                    <p className="text-slate-500 font-medium">No {activeTab === "documents" ? "documents" : "tools"} found matching your criteria.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item, index) => {
                        if (activeTab === "documents") {
                            // Document Card
                            const color = getColor(item.type || 'file');
                            return (
                                <motion.div
                                    key={item._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden`}
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`w-14 h-14 rounded-2xl bg-${color}-50 text-${color}-600 flex items-center justify-center shadow-inner`}>
                                            {getIcon(item.type || 'file')}
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-${color}-50 text-${color}-600`}>
                                            {item.type || 'DOC'}
                                        </span>
                                    </div>
                                    <div className="mb-6 h-28">
                                        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors line-clamp-2 leading-tight">
                                            {item.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 font-medium">
                                            {item.description || "Premium professional resource for career growth."}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mb-4">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                            {item.category}
                                        </div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                            {item.size || "1.2 MB"}
                                        </div>
                                    </div>
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-bold transition-all shadow-md active:scale-95 bg-slate-900 hover:bg-blue-600`}
                                    >
                                        <Download className="w-4 h-4" />
                                        Download Asset
                                    </a>
                                </motion.div>
                            );
                        } else {
                            // AI Tool Card
                            return (
                                <motion.div
                                    key={item._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-[2rem] border border-blue-100 p-1 shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-1 transition-all group relative"
                                >
                                    <div className="bg-gradient-to-br from-indigo-50/50 to-white rounded-[1.8rem] p-6 h-full flex flex-col">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-blue-600 shadow-md transform group-hover:rotate-6 transition-transform">
                                                <Globe size={24} />
                                            </div>
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1",
                                                item.visibility === "Public" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                                            )}>
                                                {item.visibility === "Public" ? <Globe size={10} /> : <Lock size={10} />}
                                                {item.visibility || "Public"}
                                            </span>
                                        </div>

                                        <div className="mb-6 flex-1">
                                            <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-3">
                                                {item.description || "Advanced AI tool for executive productivity and analysis."}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mb-5">
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                                <Zap size={12} className="text-amber-400" />
                                                {item.category}
                                            </div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                {item.users || 0} Users
                                            </div>
                                        </div>

                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                                        >
                                            <Sparkles size={16} />
                                            Launch AI Tool
                                            <ExternalLink size={14} className="opacity-70" />
                                        </a>
                                    </div>
                                </motion.div>
                            );
                        }
                    })}
                </div>
            )}

            <style jsx global>{`
                .scrollbar-none::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-none {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}

function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}
