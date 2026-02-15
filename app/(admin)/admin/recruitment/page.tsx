"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
    Search, 
    Trash2, 
    X, 
    Loader2, 
    ExternalLink, 
    Mail, 
    Phone, 
    Video, 
    FileText, 
    Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Application {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    cvLink: string;
    videoLink: string;
    role: "expert" | "employee" | "partner" | "animator";
    status: string;
    domain?: string;
    experience?: string;
    projects?: string;
    tools?: string;
    position?: string;
    availability?: string;
    salary?: string;
    education?: string;
    company?: string;
    partnerType?: string;
    contribution?: string;
    network?: string;
    specialty?: string;
    portfolio?: string;
    languages?: string;
    motivation?: string;
    createdAt: string;
}

export default function RecruitmentManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [filterRole, setFilterRole] = useState<string>("All");
    const [filterStatus, setFilterStatus] = useState<string>("All");

    const fetchApplications = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/recruitment");
            const data = await res.json();
            if (data.success) {
                setApplications(data.data);
            }
        } catch (error) {
            console.error("Error fetching applications:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this application?")) return;

        try {
            const res = await fetch(`/api/recruitment?id=${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                setApplications(prev => prev.filter(app => app._id !== id));
                if (selectedApp?._id === id) setSelectedApp(null);
            }
        } catch (error) {
            console.error("Error deleting application:", error);
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch("/api/recruitment", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: newStatus })
            });
            if (res.ok) {
                setApplications(prev => prev.map(app => 
                    app._id === id ? { ...app, status: newStatus } : app
                ));
                if (selectedApp?._id === id) setSelectedApp({ ...selectedApp, status: newStatus });
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const filteredApps = applications.filter(app => {
        const matchesSearch = app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            app.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === "All" || app.role === filterRole;
        const matchesStatus = filterStatus === "All" || app.status === filterStatus;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Pending": return "bg-amber-100 text-amber-700 border-amber-200";
            case "Reviewed": return "bg-blue-100 text-blue-700 border-blue-200";
            case "Interviewing": return "bg-purple-100 text-purple-700 border-purple-200";
            case "Accepted": return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "Rejected": return "bg-rose-100 text-rose-700 border-rose-200";
            default: return "bg-slate-100 text-slate-700 border-slate-200";
        }
    };

    return (
        <div className="space-y-8 p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Recruitment Dashboard</h1>
                    <p className="text-slate-500 mt-1">Review and manage elite applications for the global network.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={fetchApplications} className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                        <Loader2 size={20} className={cn(isLoading && "animate-spin")} />
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex flex-col lg:flex-row items-center gap-4">
                    <div className="relative flex-1 group w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/10 transition-all outline-none font-bold"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
                        <select 
                            value={filterRole} 
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="px-4 py-3 bg-slate-50 border-none rounded-2xl text-xs font-bold uppercase tracking-widest outline-none appearance-none"
                        >
                            <option value="All">All Roles</option>
                            <option value="expert">Experts</option>
                            <option value="employee">Employees</option>
                            <option value="partner">Partners</option>
                            <option value="animator">Animators</option>
                        </select>
                        <select 
                            value={filterStatus} 
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-3 bg-slate-50 border-none rounded-2xl text-xs font-bold uppercase tracking-widest outline-none appearance-none"
                        >
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Reviewed">Reviewed</option>
                            <option value="Interviewing">Interviewing</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* List */}
                <div className="lg:col-span-12 xl:col-span-8 space-y-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100">
                            <Loader2 size={40} className="animate-spin text-blue-600 mb-4" />
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Applications Assets...</p>
                        </div>
                    ) : filteredApps.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100">
                            <Clock size={40} className="text-slate-200 mb-4" />
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No assets matching criteria.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredApps.map((app) => (
                                <motion.div
                                    key={app._id}
                                    layoutId={app._id}
                                    onClick={() => setSelectedApp(app)}
                                    className={cn(
                                        "p-6 rounded-3xl border-2 transition-all cursor-pointer group relative overflow-hidden",
                                        selectedApp?._id === app._id 
                                            ? "bg-blue-50/50 border-blue-200 shadow-xl shadow-blue-500/5" 
                                            : "bg-white border-slate-100 hover:border-slate-200"
                                    )}
                                >
                                    <div className="flex items-start justify-between gap-4 relative z-10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xl overflow-hidden">
                                                {app.fullName.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{app.fullName}</h3>
                                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">{app.role}</p>
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border",
                                            getStatusColor(app.status)
                                        )}>
                                            {app.status}
                                        </div>
                                    </div>

                                    <div className="mt-6 flex flex-wrap gap-2">
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-bold">
                                            <Mail size={12} />
                                            {app.email.substring(0, 20)}...
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-bold">
                                            <Clock size={12} />
                                            {new Date(app.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    
                                    <div className="absolute bottom-0 right-0 w-24 h-24 bg-linear-to-tl from-blue-500/5 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Detail Panel */}
                <AnimatePresence>
                    {selectedApp && (
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="lg:col-span-12 xl:col-span-4"
                        >
                            <div className="bg-white rounded-4xl border border-slate-100 shadow-2xl p-8 sticky top-8 space-y-8 overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-bl-full -mr-8 -mt-8" />
                                
                                <div className="flex items-start justify-between relative z-10">
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-bold text-slate-900">{selectedApp.fullName}</h2>
                                        <p className="text-sm text-blue-600 font-black uppercase tracking-[0.2em]">{selectedApp.role}</p>
                                    </div>
                                    <button onClick={() => setSelectedApp(null)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                                        <X size={20} className="text-slate-400" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status Action</p>
                                        <select 
                                            value={selectedApp.status}
                                            onChange={(e) => updateStatus(selectedApp._id, e.target.value)}
                                            className="w-full bg-transparent border-none p-0 text-sm font-bold text-slate-900 focus:ring-0 cursor-pointer"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Reviewed">Reviewed</option>
                                            <option value="Interviewing">Interviewing</option>
                                            <option value="Accepted">Accepted</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Contact</p>
                                        <div className="flex items-center gap-2">
                                            <Phone size={14} className="text-emerald-500" />
                                            <span className="text-sm font-bold">{selectedApp.phone}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest pb-2 border-b border-slate-100">Core Assets</p>
                                    <div className="space-y-3">
                                        <a href={selectedApp.cvLink} target="_blank" className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50/30 transition-all group/link">
                                            <div className="flex items-center gap-3">
                                                <FileText size={20} className="text-blue-500" />
                                                <span className="text-sm font-bold text-slate-700">Curriculum Vitae</span>
                                            </div>
                                            <ExternalLink size={16} className="text-slate-300 group-hover/link:text-blue-500 transition-colors" />
                                        </a>
                                        <a href={selectedApp.videoLink} target="_blank" className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-red-200 hover:bg-red-50/30 transition-all group/link">
                                            <div className="flex items-center gap-3">
                                                <Video size={20} className="text-red-500" />
                                                <span className="text-sm font-bold text-slate-700">Video Presentation</span>
                                            </div>
                                            <ExternalLink size={16} className="text-slate-300 group-hover/link:text-red-500 transition-colors" />
                                        </a>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest pb-2 border-b border-slate-100">Role Specific Data</p>
                                    <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                                        {Object.entries(selectedApp).map(([key, value]) => {
                                            const skipKeys = ['_id', 'fullName', 'email', 'phone', 'cvLink', 'videoLink', 'role', 'status', 'createdAt', 'updatedAt', '__v'];
                                            if (skipKeys.includes(key) || !value) return null;
                                            
                                            return (
                                                <div key={key} className="space-y-1">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{key.replace(/([A-Z])/g, ' $1')}</p>
                                                    <p className="text-sm font-medium text-slate-700 leading-relaxed bg-slate-50/80 p-3 rounded-xl border border-slate-100/50">
                                                        {value}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100">
                                    <button 
                                        onClick={() => handleDelete(selectedApp._id)}
                                        className="w-full py-4 border-2 border-rose-100 text-rose-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Trash2 size={16} />
                                        Eliminate Application Asset
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
