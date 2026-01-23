"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, UserPlus, Filter, MoreVertical, ShieldCheck, Mail, Calendar, Trash2, Edit2, X, Check, Loader2, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const participantsData = [
    { id: 1, name: "Ahmed User", email: "ahmed@example.com", status: "Active", joinDate: "Jan 12, 2026", role: "Premium Member", courses: 3 },
    { id: 2, name: "Sarah Johnson", email: "sarah@example.com", status: "Active", joinDate: "Jan 15, 2026", role: "Free Tier", courses: 1 },
    { id: 3, name: "Michael Chen", email: "michael@example.com", status: "Inactive", joinDate: "Dec 28, 2025", role: "Premium Member", courses: 5 },
    { id: 4, name: "Emma Davis", email: "emma@example.com", status: "Active", joinDate: "Jan 20, 2026", role: "Beta User", courses: 0 },
    { id: 5, name: "Omar Farooq", email: "omar@example.com", status: "Pending", joinDate: "Jan 21, 2026", role: "Free Tier", courses: 2 },
];

export default function ParticipantsManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [participants, setParticipants] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingUserId, setEditingUserId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "", // Default empty
        role: "Premium Member",
        status: "Active"
    });

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

    const handleDelete = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        try {
            const res = await fetch(`/api/admin/users?id=${userId}`, {
                method: "DELETE"
            });

            if (res.ok) {
                setParticipants(prev => prev.filter(p => p._id !== userId));
                alert("User deleted successfully");
            } else {
                alert("Failed to delete user");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleEdit = (user: any) => {
        setEditingUserId(user._id);
        setFormData({
            name: user.fullName,
            email: user.email,
            password: "", // Keep empty to indicate no change unless user types
            role: user.role,
            status: user.status
        });
        setIsAddModalOpen(true);
    };

    const openAddModal = () => {
        setEditingUserId(null);
        setFormData({ name: "", email: "", password: "", role: "Premium Member", status: "Active" });
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
                password: formData.password
            };

            const res = await fetch("/api/admin/users", {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                await fetchParticipants();
                setIsAddModalOpen(false);
                setFormData({ name: "", email: "", password: "", role: "Premium Member", status: "Active" });
                setEditingUserId(null);
                alert(editingUserId ? "User updated successfully!" : "User created successfully!");
            } else {
                const error = await res.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            console.error("Error saving user:", error);
            alert("Failed to save user");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Participants</h1>
                    <p className="text-slate-500 mt-1">Manage user access and track their session progress.</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
                >
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
                            {participants.filter(p => {
                                const isParticipant = p.role !== 'Admin' && p.role !== 'Moderator';
                                const matchesSearch = p.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    p.email?.toLowerCase().includes(searchTerm.toLowerCase());
                                return isParticipant && matchesSearch;
                            }).map((user, idx) => (
                                <motion.tr
                                    key={user._id || user.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="hover:bg-slate-50/50 transition-colors group"
                                >
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center font-bold text-slate-600 uppercase">
                                                {user.fullName?.charAt(0) || user.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{user.fullName || user.name}</p>
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
                                            <span className="text-sm font-medium text-slate-700">
                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : user.joinDate}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{user.role}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="w-1/2 h-full bg-blue-500 rounded-full" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-900">{user.courses || 0}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                title="Delete"
                                            >
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
                    <p className="text-xs text-slate-500 font-medium">Showing <span className="text-slate-900 font-bold">{participants.length}</span> participants</p>
                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-400 cursor-not-allowed">Previous</button>
                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 hover:bg-slate-50 transition-all shadow-sm">Next</button>
                    </div>
                </div>
            </div>

            {/* Add/Edit Participant Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddModalOpen(false)}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl z-[70] overflow-hidden border border-slate-200"
                        >
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                            <UserPlus size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-900">{editingUserId ? "Edit User" : "Create New User"}</h2>
                                            <p className="text-sm text-slate-500">{editingUserId ? "Update user details" : "Create a new user profile"}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="e.g. Jean Dupont"
                                                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-medium text-slate-900"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                                            <input
                                                required
                                                type="email"
                                                placeholder="email@example.com"
                                                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-medium text-slate-900"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-1">
                                                <Lock size={12} />
                                                {editingUserId ? "Reset Password (Optional)" : "Assign Password"}
                                            </label>
                                            <input
                                                required={!editingUserId}
                                                type="text"
                                                placeholder={editingUserId ? "Leave empty to keep current" : "Set user password"}
                                                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-medium text-slate-900"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Role</label>
                                                <select
                                                    className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-medium text-slate-900 appearance-none cursor-pointer"
                                                    value={formData.role}
                                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                >
                                                    <option>Premium Member</option>
                                                    <option>Free Tier</option>
                                                    <option>Beta User</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Status</label>
                                                <select
                                                    className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-medium text-slate-900 appearance-none cursor-pointer"
                                                    value={formData.status}
                                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                >
                                                    <option>Active</option>
                                                    <option>Pending</option>
                                                    <option>Inactive</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsAddModalOpen(false)}
                                            className="flex-1 px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-[2] px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 size={20} className="animate-spin" />
                                                    {editingUserId ? "Updating..." : "Adding..."}
                                                </>
                                            ) : (
                                                <>
                                                    <Check size={20} />
                                                    {editingUserId ? "Update User" : "Create Account"}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
