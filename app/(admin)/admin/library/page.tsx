"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Filter, X, Check, Loader2, Link as LinkIcon, Globe, ArrowUpRight, Edit2, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Resource {
    _id?: string;
    title: string;
    url: string;
    type: string;
    totalDownloads: number;
    allowedUsers?: string[];
}

export default function LibraryManagement() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Resource>({
        title: "",
        url: "",
        type: "Google Doc",
        totalDownloads: 0,
        allowedUsers: []
    });

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

    const handleAdd = () => {
        setEditingId(null);
        setFormData({ title: "", url: "", type: "Google Doc", totalDownloads: 0, allowedUsers: [] });
        setIsAddModalOpen(true);
    };

    const handleEdit = (res: Resource) => {
        setEditingId(res._id!);
        setFormData({
            title: res.title,
            url: res.url,
            type: res.type,
            totalDownloads: res.totalDownloads,
            allowedUsers: res.allowedUsers || []
        });
        setIsAddModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this resource?")) return;
        try {
            const res = await fetch(`/api/admin/library?id=${id}`, { method: 'DELETE' });
            if (res.ok) fetchResources();
        } catch (error) {
            console.error("Error deleting resource:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const url = '/api/admin/library';
            const method = editingId ? 'PUT' : 'POST';
            const body = editingId ? { id: editingId, ...formData } : formData;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                setIsAddModalOpen(false);
                fetchResources();
            }
        } catch (error) {
            console.error("Error saving resource:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredResources = resources.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Resource Library Manager</h1>
                    <p className="text-slate-500 mt-1">Add and organize external templates, guides and documentation links.</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
                >
                    <Plus size={20} />
                    Add Resource
                </button>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
                <div className="relative w-full lg:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search resources..."
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/10 transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                        <Filter size={18} />
                        Filter Category
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="py-20 text-center">
                    <Loader2 className="w-10 h-10 animate-spin mx-auto text-blue-600 mb-4" />
                    <p className="text-slate-500 font-medium">Loading resources...</p>
                </div>
            ) : filteredResources.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                    <p className="text-slate-400">No resources found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResources.map((res, idx) => (
                        <motion.div
                            key={res._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-inner">
                                    <LinkIcon size={28} />
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(res)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(res._id!)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                                </div>
                            </div>

                            <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{res.title}</h3>
                            <a
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-500 font-medium flex items-center gap-1 mt-1 hover:underline truncate"
                            >
                                <ArrowUpRight size={12} />
                                {res.url}
                            </a>

                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase">Source</span>
                                    <span className="text-sm font-bold text-slate-700">{res.type}</span>
                                </div>
                                <div className="flex flex-col text-right">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Total Clicks</span>
                                    <div className="flex items-center gap-1.5 justify-end">
                                        <Globe size={12} className="text-slate-400" />
                                        <span className="text-sm font-bold text-slate-700">{res.totalDownloads}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal for adding/editing resource */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddModalOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl z-[70] overflow-hidden">
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                            <Plus size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-900">{editingId ? "Edit Resource" : "Add Resource Link"}</h2>
                                            <p className="text-sm text-slate-500">Provide a title and external URL</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600">
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Resource Title</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="e.g. 2026 Strategy Guide"
                                                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-medium text-slate-900"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">External Link (URL)</label>
                                            <div className="relative">
                                                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input
                                                    required
                                                    type="url"
                                                    placeholder="https://docs.google.com/..."
                                                    className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-medium text-slate-900"
                                                    value={formData.url}
                                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Link Category / Type</label>
                                            <select
                                                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-medium text-slate-900 appearance-none cursor-pointer"
                                                value={formData.type}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            >
                                                <option>Google Doc</option>
                                                <option>PDF Link</option>
                                                <option>Online Tool</option>
                                                <option>Documentation</option>
                                                <option>Other Link</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Allowed Participants (Emails, comma separated)</label>
                                            <textarea
                                                rows={2}
                                                placeholder="e.g. user1@example.com, user2@example.com"
                                                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-medium text-slate-900"
                                                value={Array.isArray(formData.allowedUsers) ? formData.allowedUsers.join(", ") : (formData.allowedUsers || "")}
                                                onChange={(e) => setFormData({ ...formData, allowedUsers: e.target.value.split(',').map((email: string) => email.trim()) })}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 pt-4">
                                        <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-all">Cancel</button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-[2] px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <><Loader2 size={20} className="animate-spin" /> Saving...</>
                                            ) : (
                                                <><Check size={20} /> {editingId ? "Update Link" : "Add Link"}</>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )
                }
            </AnimatePresence >
        </div >
    );
}
