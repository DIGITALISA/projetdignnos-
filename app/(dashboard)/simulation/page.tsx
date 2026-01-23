"use client";

import { motion } from "framer-motion";
import { Bot, Search, PenTool, Layout, Video, Calendar, ExternalLink, FileText, Briefcase, Loader2, Globe, Lock } from "lucide-react";
import { useState, useEffect } from "react";

export default function AIToolsPage() {
    const [tools, setTools] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchTools = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/tools');
            const data = await res.json();
            if (Array.isArray(data)) {
                setTools(data);
            }
        } catch (error) {
            console.error("Error fetching tools:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTools();
    }, []);

    const getIcon = (category: string) => {
        const cat = category.toLowerCase();
        if (cat.includes('research')) return <Search className="w-6 h-6" />;
        if (cat.includes('writing')) return <PenTool className="w-6 h-6" />;
        if (cat.includes('design')) return <Layout className="w-6 h-6" />;
        if (cat.includes('interview')) return <Briefcase className="w-6 h-6" />;
        if (cat.includes('cv') || cat.includes('resume')) return <FileText className="w-6 h-6" />;
        return <Bot className="w-6 h-6" />;
    };

    const getColorClass = (category: string) => {
        const cat = category.toLowerCase();
        if (cat.includes('research')) return "text-blue-600 bg-blue-50";
        if (cat.includes('writing')) return "text-emerald-600 bg-emerald-50";
        if (cat.includes('design')) return "text-purple-600 bg-purple-50";
        if (cat.includes('interview')) return "text-orange-600 bg-orange-50";
        if (cat.includes('cv')) return "text-indigo-600 bg-indigo-50";
        return "text-green-600 bg-green-50";
    };

    const filteredTools = tools.filter(tool =>
        tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex-1">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-slate-900">AI Productivity Tools</h1>
                    <p className="text-slate-500 text-lg max-w-2xl">
                        A curated collection of AI tools to help you streamline your tasks and accelerate your career growth.
                    </p>
                </div>

                <div className="relative group w-full md:w-72">
                    <input
                        type="text"
                        placeholder="Search AI tools..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm group-hover:shadow-md text-slate-900"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-hover:text-blue-500 transition-colors" />
                </div>
            </div>

            {isLoading ? (
                <div className="py-20 text-center">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-600 mb-4" />
                    <p className="text-slate-500 font-medium text-lg text-slate-600">Loading intelligent workspace...</p>
                </div>
            ) : filteredTools.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                    <Bot className="w-16 h-16 mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-400 text-lg">No AI tools found matching your search.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTools.map((tool, index) => (
                        <motion.div
                            key={tool._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl border p-6 hover:shadow-xl hover:border-blue-300 transition-all group relative overflow-hidden"
                        >
                            {tool.visibility === "Premium Only" && (
                                <div className="absolute top-0 right-0 p-2">
                                    <div className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-bl-xl rounded-tr-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                        <Lock size={10} /> Premium
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col h-full">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getColorClass(tool.category)}`}>
                                        {getIcon(tool.category)}
                                    </div>
                                    <span className="px-3 py-1 rounded-full bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                        {tool.category}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    {tool.title}
                                </h3>
                                <p className="text-sm text-slate-500 mb-6 flex-1 leading-relaxed">
                                    {tool.description || "Powerful AI tool to help with your daily professional tasks."}
                                </p>

                                <a
                                    href={tool.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full bg-slate-50 border border-slate-100 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-slate-700 py-3 rounded-xl font-bold transition-all shadow-sm active:scale-95 group-hover:shadow-md"
                                >
                                    Open Tool <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
