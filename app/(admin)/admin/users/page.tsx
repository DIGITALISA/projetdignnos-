"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, UserPlus, ShieldCheck, Trash2, Edit2, X, Check, Loader2, Lock, Zap, Phone, Star, Crown, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function ParticipantsManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>("All");

    interface Participant {
        _id: string;
        id?: string;
        fullName?: string;
        email?: string;
        role?: string;
        status?: string;
        whatsapp?: string;
        plan?: string;
        canAccessCertificates?: boolean;
        canAccessRecommendations?: boolean;
        rawPassword?: string;
        isDiagnosisComplete?: boolean;
    }

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "Premium Member",
        status: "Active",
        whatsapp: "",
        plan: "Free Trial",
        canAccessCertificates: false,
        canAccessRecommendations: false,
        rawPassword: ""
    });

    const fetchParticipants = async () => {
        try {
            const res = await fetch("/api/admin/users", { cache: "no-store" });
            const data = await res.json();
            if (Array.isArray(data)) {
                setParticipants(data);
            }
        } catch (error) {
            console.error("Error fetching participants:", error);
        } finally {
        }
    };

    useEffect(() => {
        fetchParticipants();
    }, []);

    const handleDelete = async (userId: string) => {
        if (!confirm("Are you sure you want to eliminate this asset?")) return;

        try {
            const res = await fetch(`/api/admin/users?id=${userId}`, {
                method: "DELETE"
            });

            if (res.ok) {
                setParticipants(prev => prev.filter(p => p._id !== userId));
                alert("Asset eliminated successfully");
            } else {
                alert("Failed to delete asset");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleEdit = (user: Participant) => {
        setEditingUserId(user._id);
        setFormData({
            name: user.fullName || "",
            email: user.email || "",
            password: "",
            role: user.role || "Premium Member",
            status: user.status || "Active",
            whatsapp: user.whatsapp || "",
            plan: user.plan || "Free Trial",
            canAccessCertificates: !!user.canAccessCertificates,
            canAccessRecommendations: !!user.canAccessRecommendations,
            rawPassword: user.rawPassword || ""
        });
        setIsAddModalOpen(true);
    };

    const handleActivateTrial = async (user: Participant) => {
        if (!confirm(`Activate 3h Trial Mandate for ${user.fullName}?`)) return;

        try {
            const res = await fetch("/api/admin/users/activate-trial", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user._id })
            });

            if (res.ok) {
                alert("Trial activated for 3 hours!");
                fetchParticipants();
            } else {
                alert("Failed to activate trial");
            }
        } catch (error) {
            console.error("Error activating trial:", error);
        }
    };

    const openAddModal = () => {
        setEditingUserId(null);
        setFormData({
            name: "",
            email: "",
            password: "",
            role: "Premium Member",
            status: "Active",
            whatsapp: "",
            plan: "Free Trial",
            canAccessCertificates: false,
            canAccessRecommendations: false,
            rawPassword: ""
        });
        setIsAddModalOpen(true);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const method = editingUserId ? "PUT" : "POST";
            const body = {
                id: editingUserId,
                fullName: formData.name,
                email: formData.email,
                role: formData.role,
                status: formData.status,
                password: formData.password,
                whatsapp: formData.whatsapp,
                plan: formData.plan,
                canAccessCertificates: formData.canAccessCertificates,
                canAccessRecommendations: formData.canAccessRecommendations,
                rawPassword: formData.password || formData.rawPassword
            };

            const res = await fetch("/api/admin/users", {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                await fetchParticipants();
                setIsAddModalOpen(false);
                setEditingUserId(null);
                alert(editingUserId ? "Protocol updated!" : "Executive registered!");
            } else {
                const error = await res.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            console.error("Error saving user:", error);
            alert("Failed to save protocol");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Executive Management</h1>
                    <p className="text-slate-500 mt-1">Manage executive assets, verify credentials, and approve strategic access.</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
                >
                    <UserPlus size={20} />
                    Add Executive
                </button>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
                    <button
                        onClick={() => setFilterStatus("All")}
                        className={cn(
                            "px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                            filterStatus === "All" ? "bg-slate-900 text-white shadow-lg" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                        )}
                    >
                        All Assets
                    </button>
                    <button
                        onClick={() => setFilterStatus("Pending")}
                        className={cn(
                            "px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2",
                            filterStatus === "Pending" ? "bg-amber-600/10 text-amber-700 border-2 border-amber-600/20 shadow-lg" : "bg-slate-50 text-slate-500 hover:bg-slate-100 border-2 border-transparent"
                        )}
                    >
                        <div className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
                        Pending Requests
                    </button>
                    <button
                        onClick={() => setFilterStatus("Active")}
                        className={cn(
                            "px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2",
                            filterStatus === "Active" ? "bg-green-600/10 text-green-700 border-2 border-green-600/20 shadow-lg" : "bg-slate-50 text-slate-500 hover:bg-slate-100 border-2 border-transparent"
                        )}
                    >
                        <div className="w-2 h-2 rounded-full bg-green-600" />
                        Active Members
                    </button>
                </div>

                <div className="relative w-full lg:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search assets..."
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/10 transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden text-sm">
                <div className="overflow-x-auto overflow-y-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Asset Name</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Mandate Plan</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">WhatsApp</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Access Code</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Mandates</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {participants.filter(p => {
                                const isParticipant = p.role !== 'Admin' && p.role !== 'Moderator';
                                const matchesSearch = p.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    p.email?.toLowerCase().includes(searchTerm.toLowerCase());
                                const matchesStatus = filterStatus === "All" || p.status === filterStatus;
                                return isParticipant && matchesSearch && matchesStatus;
                            }).map((user, idx) => (
                                <motion.tr
                                    key={user._id || user.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="hover:bg-slate-50/50 transition-colors group"
                                >
                                    <td className="px-8 py-5 text-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center font-bold text-slate-600 uppercase">
                                                {user.fullName?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{user.fullName}</p>
                                                <p className="text-xs text-slate-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className={cn(
                                            "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest",
                                            user.plan === "Elite Full Pack" ? "bg-amber-50 text-amber-700 border-amber-200" :
                                                user.plan === "Pro Essential" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                                    "bg-slate-50 text-slate-500 border-slate-200"
                                        )}>
                                            {user.plan === "Elite Full Pack" ? <Crown size={12} /> :
                                                user.plan === "Pro Essential" ? <Star size={12} /> : <Clock size={12} />}
                                            {user.plan || "No Plan"}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <Phone size={14} className="text-emerald-500" />
                                            <span className="text-sm font-bold font-mono">{user.whatsapp || "No data"}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <Lock size={14} className="text-blue-500" />
                                            <span className="text-sm font-bold font-mono bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">{user.rawPassword || "N/A"}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col gap-2">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm",
                                                user.status === "Active" ? "bg-green-100 text-green-700 shadow-green-100/50" :
                                                    user.status === "Pending" ? "bg-amber-100 text-amber-700 shadow-amber-100/50" :
                                                        "bg-red-100 text-red-700 shadow-red-100/50"
                                            )}>
                                                <div className={cn(
                                                    "w-1.5 h-1.5 rounded-full",
                                                    user.status === "Active" ? "bg-green-600 animate-pulse" :
                                                        user.status === "Pending" ? "bg-amber-600 animate-bounce" :
                                                            "bg-red-600"
                                                )} />
                                                {user.status}
                                            </span>
                                            {user.isDiagnosisComplete && (
                                                <span className="inline-flex items-center gap-1 text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-tighter">
                                                    <Check size={10} />
                                                    Diagnosis Done
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {user.status === "Pending" && (
                                                <button
                                                    onClick={() => handleActivateTrial(user)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20"
                                                >
                                                    <Zap size={14} className="fill-current" />
                                                    Activate 3h
                                                </button>
                                            )}
                                            <button onClick={() => handleEdit(user)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit Asset">
                                                <Edit2 size={16} />
                                            </button>
                                            <a href={`/admin/users/${user._id}/profile`} className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border border-purple-200" title="Review Performance">
                                                <ShieldCheck size={14} />
                                                Review
                                            </a>
                                            <button onClick={() => handleDelete(user._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Eliminate Asset">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {isAddModalOpen && (
                    <>
                        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-60" onClick={() => setIsAddModalOpen(false)} />
                        <motion.div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl z-70 overflow-hidden border border-slate-200" initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}>
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-xl font-bold text-slate-900">{editingUserId ? "Edit Protocol" : "Register Executive"}</h2>
                                    <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                                            <input required type="text" className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-bold text-slate-900" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email</label>
                                            <input required type="email" className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-bold text-slate-900" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Password {editingUserId && "(Leave blank to keep)"}</label>
                                            <input required={!editingUserId} type="password" className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-bold text-slate-900" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">WhatsApp</label>
                                                <input type="text" className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-bold text-slate-900" value={formData.whatsapp} onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Status</label>
                                                <select className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-bold text-slate-900 appearance-none" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                                                    <option>Active</option>
                                                    <option>Pending</option>
                                                    <option>Inactive</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Mandate Plan</label>
                                            <select className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-bold text-slate-900 appearance-none" value={formData.plan} onChange={(e) => setFormData({ ...formData, plan: e.target.value })}>
                                                <option>Free Trial</option>
                                                <option>Pro Essential</option>
                                                <option>Elite Full Pack</option>
                                            </select>
                                        </div>

                                        <div className="space-y-4 pt-4 border-t border-slate-100">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Credentials Access</label>
                                            <div className="grid grid-cols-1 gap-3">
                                                <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                                                    <input type="checkbox" className="w-5 h-5 rounded border-slate-200 text-blue-600" checked={formData.canAccessCertificates} onChange={(e) => setFormData({ ...formData, canAccessCertificates: e.target.checked })} />
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-slate-700">Allow Performance Profile</span>
                                                        <span className="text-[10px] text-slate-500 italic">Unlocks Certificates</span>
                                                    </div>
                                                </label>
                                                <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                                                    <input type="checkbox" className="w-5 h-5 rounded border-slate-200 text-blue-600" checked={formData.canAccessRecommendations} onChange={(e) => setFormData({ ...formData, canAccessRecommendations: e.target.checked })} />
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-slate-700">Allow Recommendation Letter</span>
                                                        <span className="text-[10px] text-slate-500 italic">Unlocks Strategic Recs</span>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <button type="submit" disabled={isSubmitting} className="w-full px-6 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:opacity-70">
                                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                                        {editingUserId ? "Confirm Mandate Update" : "Register Executive"}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
