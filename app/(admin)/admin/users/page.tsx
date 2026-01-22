"use client";

import { motion } from "framer-motion";
import { Search, UserPlus, Filter, MoreVertical, ShieldCheck, Mail, Calendar, Trash2, Edit2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const participants = [
    { id: 1, name: "Ahmed User", email: "ahmed@example.com", status: "Active", joinDate: "Jan 12, 2026", role: "Premium Member", courses: 3 },
    { id: 2, name: "Sarah Johnson", email: "sarah@example.com", status: "Active", joinDate: "Jan 15, 2026", role: "Free Tier", courses: 1 },
    { id: 3, name: "Michael Chen", email: "michael@example.com", status: "Inactive", joinDate: "Dec 28, 2025", role: "Premium Member", courses: 5 },
    { id: 4, name: "Emma Davis", email: "emma@example.com", status: "Active", joinDate: "Jan 20, 2026", role: "Beta User", courses: 0 },
    { id: 5, name: "Omar Farooq", email: "omar@example.com", status: "Pending", joinDate: "Jan 21, 2026", role: "Free Tier", courses: 2 },
];

export default function ParticipantsManagement() {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Participants</h1>
                    <p className="text-slate-500 mt-1">Manage user access and track their session progress.</p>
                </div>
                <button className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all">
                    <UserPlus size={20} />
                    Add Participant
                </button>
            </div>

            {/* Filters bar */}
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
                <div className="relative w-full lg:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/10 transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                        <Filter size={18} />
                        Filter Status
                    </button>
                    <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                        <Mail size={18} />
                        Bulk Email
                    </button>
                </div>
            </div>

            {/* Participants Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto overflow-y-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Participant</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Joined Date</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Courses</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {participants.map((user, idx) => (
                                <motion.tr
                                    key={user.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="hover:bg-slate-50/50 transition-colors group"
                                >
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center font-bold text-slate-600">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{user.name}</p>
                                                <p className="text-xs text-slate-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={cn(
                                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm",
                                            user.status === "Active" ? "bg-green-100 text-green-700 shadow-green-100/50" :
                                                user.status === "Inactive" ? "bg-red-100 text-red-700 shadow-red-100/50" :
                                                    "bg-amber-100 text-amber-700 shadow-amber-100/50"
                                        )}>
                                            <div className={cn(
                                                "w-1.5 h-1.5 rounded-full",
                                                user.status === "Active" ? "bg-green-600 animate-pulse" :
                                                    user.status === "Inactive" ? "bg-red-600" :
                                                        "bg-amber-600 animate-bounce"
                                            )} />
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-slate-700">{user.joinDate}</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{user.role}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="w-1/2 h-full bg-blue-500 rounded-full" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-900">{user.courses}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit">
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                                                <Trash2 size={16} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination Placeholder */}
                <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-xs text-slate-500 font-medium">Showing <span className="text-slate-900 font-bold">5</span> of <span className="text-slate-900 font-bold">1,280</span> participants</p>
                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-400 cursor-not-allowed">Previous</button>
                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 hover:bg-slate-50 transition-all shadow-sm">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
