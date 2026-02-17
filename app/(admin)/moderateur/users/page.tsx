"use client";

import { motion } from "framer-motion";
import { Search, X, Check, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Participant {
    _id: string;
    fullName: string;
    email: string;
    role: string;
    status: string;
}

export default function ModeratorUsers() {
    const [searchTerm, setSearchTerm] = useState("");
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchParticipants = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/users");
            const data = await res.json();
            if (Array.isArray(data)) {
                setParticipants(data);
            }
        } catch (error) {
            console.error("Error fetching participants:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchParticipants();
    }, []);

    const handleUpdateRole = async (userId: string, newRole: string) => {
        try {
            const res = await fetch("/api/admin/users/update", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, role: newRole })
            });
            if (res.ok) {
                fetchParticipants();
                alert(`User role updated to ${newRole}`);
            }
        } catch (error) {
            console.error("Failed to update role:", error);
        }
    };

    const handleUpdateStatus = async (userId: string, newStatus: string) => {
        try {
            const res = await fetch("/api/admin/users/update", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, status: newStatus })
            });
            if (res.ok) {
                fetchParticipants();
            }
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestion des Admissions</h1>
                    <p className="text-slate-500 mt-1">Validez les nouveaux participants et gérez leurs accès.</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
                <div className="relative w-full lg:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher un participant..."
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-4xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Participant</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Rôle actuel</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions de Moderation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center">
                                        <Loader2 className="w-10 h-10 animate-spin mx-auto text-indigo-600" />
                                    </td>
                                </tr>
                            ) : participants.filter(p =>
                                p.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                p.email?.toLowerCase().includes(searchTerm.toLowerCase())
                            ).map((user, idx) => (
                                <motion.tr
                                    key={user._id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="hover:bg-indigo-50/30 transition-colors group"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black uppercase text-sm border border-indigo-100">
                                                {user.fullName?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{user.fullName}</p>
                                                <p className="text-xs text-slate-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={cn(
                                            "text-xs font-bold px-3 py-1 rounded-full",
                                            user.role === 'Admin' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'
                                        )}>{user.role}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={cn(
                                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                                            user.status === "Active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                                        )}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            {user.role !== 'Admin' && (
                                                <button
                                                    onClick={() => handleUpdateRole(user._id, "Admin")}
                                                    className="px-4 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                                                >
                                                    Grant Admin Access
                                                </button>
                                            )}
                                            {user.status === 'Pending' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(user._id, "Active")}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-all" title="Approve">
                                                    <Check size={18} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleUpdateStatus(user._id, user.status === 'Active' ? 'Inactive' : 'Active')}
                                                className={cn(
                                                    "p-2 rounded-xl transition-all",
                                                    user.status === 'Active' ? "text-amber-600 hover:bg-amber-50" : "text-green-600 hover:bg-green-50"
                                                )}
                                                title={user.status === 'Active' ? "Suspend" : "Activate"}
                                            >
                                                {user.status === 'Active' ? <X size={18} /> : <Check size={18} />}
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
