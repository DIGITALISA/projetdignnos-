"use client";

import { useState, useEffect } from "react";
import { 
    Plus, Trash2, Edit2, Save, X, Globe, Zap, 
    Image as ImageIcon, Loader2, Search,
    AlertCircle, CheckCircle2, Library
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface MultiLang {
    en: string;
    fr: string;
    ar: string;
}

interface ProjectForm {
    _id?: string;
    title: MultiLang;
    idea: MultiLang;
    strategy: MultiLang;
    extraServices: {
        en: string[];
        fr: string[];
        ar: string[];
    };
    price: number;
    demoUrl: string;
    image: string;
    category: string;
    tier: "basic" | "pro";
    status: "active" | "sold" | "archived";
}

const INITIAL_FORM: ProjectForm = {
    title: { en: "", fr: "", ar: "" },
    idea: { en: "", fr: "", ar: "" },
    strategy: { en: "", fr: "", ar: "" },
    extraServices: { en: [], fr: [], ar: [] },
    price: 0,
    demoUrl: "",
    image: "",
    category: "",
    tier: "basic",
    status: "active"
};

export default function DigitalizationAdmin() {
    const [projects, setProjects] = useState<ProjectForm[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<ProjectForm>(INITIAL_FORM);
    const [searchQuery, setSearchQuery] = useState("");

    // Feedback states
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/digitalization");
            const data = await res.json();
            if (data.success) setProjects(data.projects);
        } catch {
            setError("Failed to load projects");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSuccess(null);
        setError(null);

        try {
            const method = editingId ? "PUT" : "POST";
            const body = editingId ? { ...form, id: editingId } : form;

            const res = await fetch("/api/admin/digitalization", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const data = await res.json();
            if (data.success) {
                setSuccess(editingId ? "Project updated!" : "Project created!");
                setShowForm(false);
                setEditingId(null);
                setForm(INITIAL_FORM);
                fetchProjects();
            } else {
                setError(data.message || "Something went wrong");
            }
        } catch {
            setError("Communication error with server");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This action cannot be undone.")) return;
        
        try {
            const res = await fetch(`/api/admin/digitalization?id=${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                setSuccess("Project deleted");
                fetchProjects();
            }
        } catch {
            setError("Failed to delete");
        }
    };

    const handleEdit = (project: ProjectForm) => {
        setForm(project);
        setEditingId(project._id!);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const filteredProjects = projects.filter(p => 
        p.title.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                        <Zap className="text-blue-600" size={32} />
                        Marketplace Manager
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Create and manage strategic frameworks for the Digitalization hub.</p>
                </div>
                <button 
                    onClick={() => {
                        setShowForm(!showForm);
                        if (!showForm) {
                            setEditingId(null);
                            setForm(INITIAL_FORM);
                        }
                    }}
                    className={cn(
                        "flex items-center gap-2 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl",
                        showForm 
                            ? "bg-slate-200 text-slate-600 hover:bg-slate-300" 
                            : "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-600/20"
                    )}
                >
                    {showForm ? <X size={20} /> : <Plus size={20} />}
                    {showForm ? "Cancel Entry" : "Add New Framework"}
                </button>
            </div>

            {/* Notifications */}
            <AnimatePresence>
                {success && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 bg-green-50 border border-green-100 rounded-2xl text-green-700 flex items-center gap-3 font-bold text-sm">
                        <CheckCircle2 size={20} /> {success}
                    </motion.div>
                )}
                {error && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 flex items-center gap-3 font-bold text-sm">
                        <AlertCircle size={20} /> {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Form Section */}
            <AnimatePresence>
                {showForm && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <form onSubmit={handleSave} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl p-10 space-y-12">
                            <div className="grid lg:grid-cols-2 gap-12">
                                {/* Left Side: Basic Info */}
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <Globe size={16} /> Language Adaptation
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {(['en', 'fr', 'ar'] as const).map(lang => (
                                                <div key={lang} className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-slate-500 px-1">{lang.toUpperCase()} Title</label>
                                                    <input 
                                                        required
                                                        value={form.title[lang]}
                                                        onChange={e => setForm({...form, title: {...form.title, [lang]: e.target.value}})}
                                                        className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-600/10 rounded-xl outline-none text-sm font-bold transition-all"
                                                        placeholder={`Project Name (${lang})`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-500">Category Tag</label>
                                            <input 
                                                required
                                                value={form.category}
                                                onChange={e => setForm({...form, category: e.target.value})}
                                                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent rounded-xl outline-none text-sm font-bold"
                                                placeholder="e.g. EdTech, SaaS"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-500">Base Price ($)</label>
                                            <input 
                                                required
                                                type="number"
                                                value={form.price}
                                                onChange={e => setForm({...form, price: Number(e.target.value)})}
                                                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent rounded-xl outline-none text-sm font-bold text-blue-600"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-500">Service Tier</label>
                                            <div className="flex p-1 bg-slate-100 rounded-xl">
                                                {(['basic', 'pro'] as const).map(t => (
                                                    <button 
                                                        key={t}
                                                        type="button"
                                                        onClick={() => setForm({...form, tier: t})}
                                                        className={cn(
                                                            "flex-1 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                                                            form.tier === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                                                        )}
                                                    >
                                                        {t}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-500">Inventory Status</label>
                                            <select 
                                                value={form.status}
                                                onChange={e => setForm({...form, status: e.target.value as "active" | "sold" | "archived"})}
                                                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent rounded-xl outline-none text-xs font-black uppercase tracking-widest"
                                            >
                                                <option value="active">Active Hub</option>
                                                <option value="sold">Sold Out</option>
                                                <option value="archived">Archived</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Visuals & Links */}
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <ImageIcon size={16} /> Asset Visualization
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex-1 space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-slate-500 px-1">Image Endpoint (URL)</label>
                                                    <input 
                                                        required
                                                        value={form.image}
                                                        onChange={e => setForm({...form, image: e.target.value})}
                                                        className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent rounded-xl outline-none text-xs font-medium"
                                                        placeholder="https://.../preview.png"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-500 px-1">Live Demo Environment</label>
                                                <input 
                                                    required
                                                    value={form.demoUrl}
                                                    onChange={e => setForm({...form, demoUrl: e.target.value})}
                                                    className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent rounded-xl outline-none text-xs font-medium text-blue-500 underline"
                                                    placeholder="https://demo.example.com"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Preview Card Mini */}
                                    <div className="p-6 rounded-3xl border-2 border-dashed border-slate-100 bg-slate-50/50 flex items-center gap-6">
                                        <div className="w-24 h-24 rounded-2xl bg-slate-200 overflow-hidden relative shadow-inner">
                                            {form.image && <Image src={form.image} alt="preview" fill className="object-cover" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Preview Logic</p>
                                            <h4 className="font-bold text-slate-900">{form.title.en || "Untitled Project"}</h4>
                                            <p className="text-xs text-slate-500 mt-1">{form.tier.toUpperCase()} • ${form.price}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Text Area Section */}
                            <div className="space-y-8 border-t border-slate-50 pt-12">
                                <div className="grid md:grid-cols-3 gap-8">
                                    {(['en', 'fr', 'ar'] as const).map(lang => (
                                        <div key={lang} className="space-y-6 p-6 rounded-3xl bg-slate-50/50 border border-slate-100">
                                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">{lang.toUpperCase()} Concept & Strategy</h4>
                                            
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-500">The Idea</label>
                                                <textarea 
                                                    required
                                                    rows={3}
                                                    value={form.idea[lang]}
                                                    onChange={e => setForm({...form, idea: {...form.idea, [lang]: e.target.value}})}
                                                    className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl outline-none text-xs leading-relaxed font-medium"
                                                    placeholder="Foundational concept..."
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-500">The Strategy</label>
                                                <textarea 
                                                    required
                                                    rows={3}
                                                    value={form.strategy[lang]}
                                                    onChange={e => setForm({...form, strategy: {...form.strategy, [lang]: e.target.value}})}
                                                    className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl outline-none text-xs leading-relaxed font-medium"
                                                    placeholder="Strategic roadmap..."
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-4 pt-8 border-t border-slate-50">
                                <button 
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs text-slate-400 hover:text-slate-900 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-slate-900/20 flex items-center gap-3 active:scale-95 transition-all"
                                >
                                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    {editingId ? "Update Framework" : "Deploy Framework"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* List Section */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                        <Library size={22} className="text-blue-600" />
                        Framework Catalog
                    </h2>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text"
                            placeholder="Search frameworks..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pl-12 pr-6 py-3.5 bg-slate-50 border-transparent rounded-2xl text-sm font-bold w-full md:w-80 outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/10 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Details</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing Structure</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Language Readiness</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Lifecycle</th>
                                <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
                                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Synchronizing catalog...</p>
                                    </td>
                                </tr>
                            ) : filteredProjects.length > 0 ? (
                                filteredProjects.map((project) => (
                                    <tr key={project._id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden relative shrink-0">
                                                    {project.image && <Image src={project.image} alt="p" fill className="object-cover" />}
                                                </div>
                                                <div>
                                                    <div className="font-black text-slate-900 text-sm">{project.title.en}</div>
                                                    <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">{project.category}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-black text-slate-900">${project.price}</div>
                                            <div className={cn(
                                                "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border inline-block mt-1",
                                                project.tier === 'pro' ? "text-purple-600 border-purple-100 bg-purple-50" : "text-blue-600 border-blue-100 bg-blue-50"
                                            )}>
                                                {project.tier}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex gap-1.5">
                                                {['en', 'fr', 'ar'].map(l => (
                                                    <span key={l} className={cn(
                                                        "w-6 h-6 rounded-md text-[8px] font-black flex items-center justify-center border uppercase",
                                                        (project.title as MultiLang)[l as keyof MultiLang] ? "bg-green-50 text-green-600 border-green-100" : "bg-slate-100 text-slate-400 border-slate-200"
                                                    )}>
                                                        {l}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em]",
                                                project.status === 'active' ? "bg-emerald-100 text-emerald-700" :
                                                project.status === 'sold' ? "bg-amber-100 text-amber-700" :
                                                "bg-slate-200 text-slate-600"
                                            )}>
                                                {project.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => handleEdit(project)}
                                                    className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(project._id!)}
                                                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <p className="text-slate-400 font-medium">No projects found matching your search.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
