"use client";

import { motion } from "framer-motion";
import { 
    Download, 
    FileText, 
    FileSpreadsheet, 
    File, 
    Search, 
    Filter, 
    Loader2, 
    Link as LinkIcon, 
    Sparkles, 
    Globe, 
    ExternalLink, 
    Lock, 
    Zap,
    Library,
    Compass
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";

interface Resource {
    _id: string;
    title: string;
    description?: string;
    url: string;
    type?: string;
    category: string;
    size?: string;
    visibility?: string;
}

interface Tool {
    _id: string;
    title: string;
    description?: string;
    url: string;
    category: string;
    visibility?: string;
    users?: number;
}

export default function ProfessionalResourcesPage() {
    const { dir, language } = useLanguage();
    const isRtl = dir === 'rtl';

    const [resources, setResources] = useState<Resource[]>([]);
    const [tools, setTools] = useState<Tool[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"documents" | "ai_tools">("documents");
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    const t = {
        ar: {
            title: "مركز الموارد والأدوات",
            subtitle: "استعرض النماذج المتميزة والأدوات المدعومة بالذكاء الاصطناعي لتسريع مسارك المهني التنفيذي.",
            searchDocs: "البحث في الوثائق...",
            searchTools: "البحث في أدوات الذكاء الاصطناعي...",
            tabs: {
                documents: "النماذج والوثائق",
                aiTools: "مركز أدوات الذكاء الاصطناعي"
            },
            loading: "جاري تحميل الموارد المتميزة...",
            noResults: "لم يتم العثور على نتائج تطابق بحثك.",
            download: "تحميل المورد",
            launch: "تشغيل الأداة",
            users: "مستخدم",
            premium: "مورد متميز"
        },
        en: {
            title: "Resource & Tool Center",
            subtitle: "Access premium templates and AI-powered tools to accelerate your executive career.",
            searchDocs: "Search documents...",
            searchTools: "Search AI tools...",
            tabs: {
                documents: "Templates & Documents",
                aiTools: "AI Tool Center"
            },
            loading: "Loading premium resources...",
            noResults: "No resources found matching your criteria.",
            download: "Download Asset",
            launch: "Launch AI Tool",
            users: "Users",
            premium: "Premium Asset"
        },
        fr: {
            title: "Centre de Ressources et d'Outils",
            subtitle: "Accédez à des modèles premium et à des outils propulsés par l'IA pour accélérer votre carrière exécutive.",
            searchDocs: "Rechercher des documents...",
            searchTools: "Rechercher des outils IA...",
            tabs: {
                documents: "Modèles & Documents",
                aiTools: "Centre d'Outils IA"
            },
            loading: "Chargement des ressources premium...",
            noResults: "Aucune ressource trouvée selon vos critères.",
            download: "Télécharger l'Asset",
            launch: "Lancer l'Outil IA",
            users: "Utilisateurs",
            premium: "Asset Premium"
        }
    }[language as 'ar' | 'en' | 'fr'] || {
        title: "Resource & Tool Center",
        subtitle: "Access premium templates and AI-powered tools to accelerate your executive career.",
        searchDocs: "Search documents...",
        searchTools: "Search AI tools...",
        tabs: {
            documents: "Templates & Documents",
            aiTools: "AI Tool Center"
        },
        loading: "Loading premium resources...",
        noResults: "No resources found matching your criteria.",
        download: "Download Asset",
        launch: "Launch AI Tool",
        users: "Users",
        premium: "Premium Asset"
    };

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

    const currentItems = activeTab === "documents" ? resources : tools;
    const categories = ["All", ...new Set(currentItems.map(item => item.category))];

    const filteredItems = currentItems.filter(item => {
        const matchesCategory = activeCategory === "All" || item.category === activeCategory;
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.description || "").toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const getIcon = (type: string) => {
        const typeLower = (type || "").toLowerCase();
        if (typeLower.includes('excel') || typeLower.includes('spreadsheet')) return <FileSpreadsheet className="w-6 h-6" />;
        if (typeLower.includes('word') || typeLower.includes('doc')) return <FileText className="w-6 h-6" />;
        if (typeLower.includes('pdf')) return <File className="w-6 h-6" />;
        return <LinkIcon className="w-6 h-6" />;
    };

    const getColor = (type: string) => {
        const typeLower = (type || "").toLowerCase();
        if (typeLower.includes('excel') || typeLower.includes('spreadsheet')) return "emerald";
        if (typeLower.includes('word') || typeLower.includes('doc')) return "blue";
        if (typeLower.includes('pdf')) return "rose";
        return "indigo";
    };

    return (
        <div className="min-h-screen bg-slate-50/50" dir={dir}>
            <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-10 pb-32">
                
                {/* Executive Header */}
                <div className={cn(
                    "flex flex-col md:flex-row justify-between items-start md:items-end gap-8",
                    isRtl && "md:flex-row-reverse"
                )}>
                    <div className={cn("space-y-4", isRtl && "text-right")}>
                        <div className={cn("flex items-center gap-3", isRtl && "flex-row-reverse")}>
                            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200">
                                <Library size={24} />
                            </div>
                            <span className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em]">{t.premium}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
                            {t.title}
                        </h1>
                        <p className="text-slate-500 text-lg max-w-2xl font-medium leading-relaxed">
                            {t.subtitle}
                        </p>
                    </div>

                    {/* Elite Search */}
                    <div className="relative group w-full md:w-80">
                        <input
                            type="text"
                            placeholder={activeTab === 'documents' ? t.searchDocs : t.searchTools}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={cn(
                                "w-full py-4 rounded-2xl bg-white border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm hover:shadow-md text-slate-900 font-bold placeholder:text-slate-400",
                                isRtl ? "pr-12 pl-4 text-right" : "pl-12 pr-4"
                            )}
                        />
                        <Search className={cn(
                            "absolute top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-hover:text-indigo-600 transition-colors",
                            isRtl ? "right-4" : "left-4"
                        )} />
                    </div>
                </div>

                {/* Navigation & Controls */}
                <div className={cn(
                    "flex flex-col lg:flex-row justify-between items-center gap-6 bg-white p-2 rounded-3xl border border-slate-100 shadow-sm",
                    isRtl && "lg:flex-row-reverse"
                )}>
                    {/* Primary Tabs */}
                    <div className="flex p-1.5 bg-slate-50 rounded-2xl w-full lg:w-fit">
                        <button
                            onClick={() => { setActiveTab("documents"); setActiveCategory("All"); }}
                            className={cn(
                                "flex-1 lg:flex-none px-8 py-3 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-3",
                                activeTab === "documents"
                                    ? "bg-slate-900 text-white shadow-xl"
                                    : "text-slate-500 hover:text-slate-900"
                            )}
                        >
                            <FileText size={18} /> 
                            {t.tabs.documents}
                        </button>
                        <button
                            onClick={() => { setActiveTab("ai_tools"); setActiveCategory("All"); }}
                            className={cn(
                                "flex-1 lg:flex-none px-8 py-3 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-3",
                                activeTab === "ai_tools"
                                    ? "bg-white text-indigo-600 shadow-sm border border-slate-200"
                                    : "text-slate-500 hover:text-slate-900"
                            )}
                        >
                            <Sparkles size={18} /> 
                            {t.tabs.aiTools}
                        </button>
                    </div>

                    {/* Category Filter */}
                    <div className={cn(
                        "flex gap-2 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 no-scrollbar px-2",
                        isRtl && "flex-row-reverse"
                    )}>
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={cn(
                                    "px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest whitespace-nowrap transition-all border",
                                    activeCategory === category
                                        ? "bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm shadow-indigo-100"
                                        : "bg-white text-slate-400 border-slate-100 hover:border-slate-300 hover:text-slate-600"
                                )}
                            >
                                {category === "All" ? (isRtl ? "الكل" : "ALL") : category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Grid */}
                {isLoading ? (
                    <div className="py-32 text-center flex flex-col items-center justify-center">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Compass className="w-6 h-6 text-indigo-600 animate-pulse" />
                            </div>
                        </div>
                        <p className="mt-6 text-slate-500 font-bold tracking-tight">{t.loading}</p>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-200"
                    >
                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                            <Search size={40} />
                        </div>
                        <p className="text-slate-500 font-bold text-lg">{t.noResults}</p>
                    </motion.div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredItems.map((item, index) => {
                            if (activeTab === "documents") {
                                const resource = item as Resource;
                                const color = getColor(resource.type || 'file');
                                return (
                                    <motion.div
                                        key={resource._id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-2xl hover:shadow-indigo-900/5 hover:-translate-y-2 transition-all group relative overflow-hidden"
                                    >
                                        <div className={cn("flex justify-between items-start mb-8", isRtl && "flex-row-reverse")}>
                                            <div className={cn(
                                                "w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 duration-500",
                                                color === "emerald" ? "bg-emerald-50 text-emerald-600" :
                                                color === "blue" ? "bg-blue-50 text-blue-600" :
                                                color === "rose" ? "bg-rose-50 text-rose-600" :
                                                "bg-indigo-50 text-indigo-600"
                                            )}>
                                                {getIcon(resource.type || 'file')}
                                            </div>
                                            <span className={cn(
                                                "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]",
                                                color === "emerald" ? "bg-emerald-50 text-emerald-700" :
                                                color === "blue" ? "bg-blue-50 text-blue-700" :
                                                color === "rose" ? "bg-rose-50 text-rose-700" :
                                                "bg-indigo-50 text-indigo-700"
                                            )}>
                                                {resource.type || 'DOC'}
                                            </span>
                                        </div>
                                        
                                        <div className={cn("h-32 mb-8", isRtl && "text-right")}>
                                            <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight">
                                                {resource.title}
                                            </h3>
                                            <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 font-medium">
                                                {resource.description || (isRtl ? "مورد مهني متميز لتطوير حياتك المهنية." : "Premium professional resource for career growth.")}
                                            </p>
                                        </div>

                                        <div className={cn(
                                            "flex items-center justify-between pt-6 border-t border-slate-100 mb-6",
                                            isRtl && "flex-row-reverse"
                                        )}>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{resource.category}</span>
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{resource.size || "1.2 MB"}</span>
                                        </div>

                                        <a
                                            href={resource.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white font-black text-sm transition-all shadow-lg shadow-slate-200 active:scale-[0.98]"
                                        >
                                            <Download className="w-5 h-5" />
                                            {t.download}
                                        </a>
                                    </motion.div>
                                );
                            } else {
                                const tool = item as Tool;
                                return (
                                    <motion.div
                                        key={tool._id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white rounded-[2.5rem] border border-indigo-100 p-1.5 shadow-sm hover:shadow-2xl hover:shadow-indigo-900/10 hover:-translate-y-2 transition-all group relative overflow-hidden"
                                    >
                                        <div className="bg-linear-to-br from-indigo-50/30 to-white rounded-[2.2rem] p-8 h-full flex flex-col">
                                            <div className={cn("flex justify-between items-start mb-8", isRtl && "flex-row-reverse")}>
                                                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-indigo-600 shadow-lg transform group-hover:rotate-6 transition-transform duration-500">
                                                    <Globe size={28} />
                                                </div>
                                                <div className={cn(
                                                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-2",
                                                    tool.visibility === "Public" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700",
                                                    isRtl && "flex-row-reverse"
                                                )}>
                                                    {tool.visibility === "Public" ? <Globe size={12} /> : <Lock size={12} />}
                                                    {tool.visibility || "Public"}
                                                </div>
                                            </div>

                                            <div className={cn("flex-1 mb-8", isRtl && "text-right")}>
                                                <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                                                    {tool.title}
                                                </h3>
                                                <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-3">
                                                    {tool.description || (isRtl ? "أداة ذكاء اصطناعي متقدمة لزيادة الإنتاجية والتحليل التنفيذي." : "Advanced AI tool for executive productivity and analysis.")}
                                                </p>
                                            </div>

                                            <div className={cn(
                                                "flex items-center justify-between pt-6 border-t border-slate-100 mb-8",
                                                isRtl && "flex-row-reverse"
                                            )}>
                                                <div className={cn("flex items-center gap-2", isRtl && "flex-row-reverse")}>
                                                    <Zap size={14} className="text-amber-500" />
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{tool.category}</span>
                                                </div>
                                                <div className={cn("flex items-center gap-1", isRtl && "flex-row-reverse")}>
                                                    <span className="text-[10px] font-black text-indigo-600">{tool.users || 0}</span>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.users}</span>
                                                </div>
                                            </div>

                                            <a
                                                href={tool.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-3 w-full py-4.5 bg-indigo-600 hover:bg-slate-900 text-white rounded-[1.25rem] font-black shadow-xl shadow-indigo-200 active:scale-[0.98] transition-all"
                                            >
                                                <Sparkles size={18} />
                                                {t.launch}
                                                <ExternalLink size={14} className="opacity-70 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            </a>
                                        </div>
                                    </motion.div>
                                );
                            }
                        })}
                    </div>
                )}
            </div>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
