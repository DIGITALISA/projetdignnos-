"use client";

import { 
    Search, Trash2, CheckCircle2, XCircle, 
    Clock, Mail, Phone, Settings as SettingsIcon,
    FileText, User, 
    Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ConsultingInquiry {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    createdAt: string;
    status: 'Pending' | 'Contacted' | 'Completed' | 'Rejected';
    notes?: string;
}

export default function ConsultingManagementPage() {
    const [inquiries, setInquiries] = useState<ConsultingInquiry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [selectedInquiry, setSelectedInquiry] = useState<ConsultingInquiry | null>(null);

    // Config State
    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [isSavingConfig, setIsSavingConfig] = useState(false);
    const [contactConfig, setContactConfig] = useState({ whatsapp: "", email: "" });

    const fetchInquiries = async () => {
        try {
            const res = await fetch('/api/consulting-inquiry');
            const data = await res.json();
            if (data.success) {
                setInquiries(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch inquiries:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchConfig = async () => {
        try {
            const res = await fetch('/api/config/contact');
            const data = await res.json();
            if (data.whatsapp || data.email) {
                setContactConfig({
                    whatsapp: data.whatsapp || "",
                    email: data.email || ""
                });
            }
        } catch (error) {
            console.error("Failed to fetch config:", error);
        }
    };

    const handleSaveConfig = async () => {
        setIsSavingConfig(true);
        try {
            await fetch('/api/config/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contactConfig)
            });
            // Show success toast or feedback if needed, currently button icon changes
            setTimeout(() => setIsSavingConfig(false), 1000);
        } catch (error) {
            console.error("Failed to save config:", error);
            setIsSavingConfig(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
        fetchConfig();
    }, []);

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/consulting-inquiry`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            });
            
            if (res.ok) {
                setInquiries(inquiries.map(inq => 
                    inq._id === id ? { ...inq, status: newStatus as ConsultingInquiry['status'] } : inq
                ));
                if (selectedInquiry?._id === id) {
                    setSelectedInquiry({ ...selectedInquiry, status: newStatus as ConsultingInquiry['status'] });
                }
            }
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this inquiry?")) return;

        try {
            const res = await fetch(`/api/consulting-inquiry?id=${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setInquiries(inquiries.filter(inq => inq._id !== id));
                if (selectedInquiry?._id === id) setSelectedInquiry(null);
            }
        } catch (error) {
            console.error("Failed to delete inquiry:", error);
        }
    };

    const filteredInquiries = inquiries.filter(inq => {
        const matchesSearch = 
            inq.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inq.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = statusFilter === "all" || inq.status === statusFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="p-8 max-w-[1600px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                        Strategic Mandates
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Manage and track strategic consulting requests
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsConfigOpen(!isConfigOpen)}
                        className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                    >
                        <SettingsIcon size={20} />
                    </button>
                    <div className="bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center shadow-sm">
                        <Search className="w-5 h-5 text-slate-400 ml-3" />
                        <input 
                            type="text"
                            placeholder="Search mandates..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm px-3 py-2 w-64 text-slate-900 dark:text-white placeholder:text-slate-400 font-medium"
                        />
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isConfigOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mb-8"
                    >
                        <div className="bg-slate-900 text-white rounded-4xl p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
                                <SettingsIcon size={200} />
                            </div>
                            
                            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                                <div className="md:w-1/3">
                                    <h3 className="text-xl font-bold mb-2">Connectivité Contact</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                        Configurez les coordonnées qui apparaissent dans la modale de contact pour les clients (WhatsApp & Email).
                                    </p>
                                    <button 
                                        onClick={handleSaveConfig}
                                        disabled={isSavingConfig}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-70 flex items-center gap-2"
                                    >
                                        {isSavingConfig ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                                        Sauvegarder
                                    </button>
                                </div>

                                <div className="md:w-2/3 grid md:grid-cols-2 gap-6 w-full">
                                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 flex items-center gap-2">
                                            <Phone size={14} /> Numéro WhatsApp
                                        </label>
                                        <input 
                                            type="text" 
                                            value={contactConfig.whatsapp}
                                            onChange={(e) => setContactConfig({...contactConfig, whatsapp: e.target.value})}
                                            className="w-full bg-slate-950 border-none rounded-xl px-4 py-3 text-white font-medium focus:ring-2 focus:ring-blue-500/50 outline-none"
                                            placeholder="+216 23 351 048"
                                        />
                                    </div>
                                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 flex items-center gap-2">
                                            <Mail size={14} /> Email Contact
                                        </label>
                                        <input 
                                            type="text" 
                                            value={contactConfig.email}
                                            onChange={(e) => setContactConfig({...contactConfig, email: e.target.value})}
                                            className="w-full bg-slate-950 border-none rounded-xl px-4 py-3 text-white font-medium focus:ring-2 focus:ring-blue-500/50 outline-none"
                                            placeholder="contact@example.com"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Status Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                {['all', 'Pending', 'Contacted', 'Completed', 'Rejected'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                            statusFilter === status 
                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' 
                                : 'bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                        }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-300px)]">
                {/* List View */}
                <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-4xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                        <span className="text-xs font-black uppercase text-slate-400 tracking-widest">
                            Inquiries ({filteredInquiries.length})
                        </span>
                        <div className="flex gap-2">
                            <button onClick={fetchInquiries} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                <Loader2 className={`w-4 h-4 text-slate-500 ${isLoading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-40">
                                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                            </div>
                        ) : filteredInquiries.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 font-medium">No inquiries found</p>
                            </div>
                        ) : (
                            filteredInquiries.map((inquiry) => (
                                <motion.div
                                    layoutId={inquiry._id}
                                    key={inquiry._id}
                                    onClick={() => setSelectedInquiry(inquiry)}
                                    className={`p-5 rounded-2xl cursor-pointer border transition-all hover:scale-[1.02] active:scale-[0.98] ${
                                        selectedInquiry?._id === inquiry._id
                                            ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 shadow-md'
                                            : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800'
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex flex-col">
                                            <h3 className="font-bold text-slate-900 dark:text-white truncate max-w-[180px]">
                                                {inquiry.fullName}
                                            </h3>
                                            <span className="text-xs text-slate-500 font-medium mt-1">
                                                {format(new Date(inquiry.createdAt), 'MMM dd, yyyy')}
                                            </span>
                                        </div>
                                        <StatusBadge status={inquiry.status} />
                                    </div>
                                    <p className="text-xs text-slate-400 truncate flex items-center gap-1.5">
                                        <Mail size={12} />
                                        {inquiry.email}
                                    </p>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                {/* Detail View */}
                <div className="lg:col-span-2">
                    <AnimatePresence mode="wait">
                        {selectedInquiry ? (
                            <motion.div
                                key={selectedInquiry._id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden h-full flex flex-col"
                            >
                                {/* Header */}
                                <div className="p-8 md:p-10 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                                                <User size={32} />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2">
                                                    {selectedInquiry.fullName}
                                                </h2>
                                                <div className="flex items-center gap-3">
                                                    <StatusBadge status={selectedInquiry.status} size="lg" />
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                                        <Clock size={12} />
                                                        {format(new Date(selectedInquiry.createdAt), 'PPP p', { locale: fr })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleDelete(selectedInquiry._id)}
                                                className="p-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                                                title="Delete Inquiry"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 mt-6">
                                        <button 
                                            onClick={() => handleUpdateStatus(selectedInquiry._id, 'Contacted')}
                                            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-blue-200 transition-colors"
                                        >
                                            Mark Contacted
                                        </button>
                                        <button 
                                            onClick={() => handleUpdateStatus(selectedInquiry._id, 'Completed')}
                                            className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-green-200 transition-colors"
                                        >
                                            Mark Completed
                                        </button>
                                        <button 
                                            onClick={() => handleUpdateStatus(selectedInquiry._id, 'Rejected')}
                                            className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-slate-200 transition-colors"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 md:p-10 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <Mail size={14} /> Contact Details
                                            </h3>
                                            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email</label>
                                                    <a href={`mailto:${selectedInquiry.email}`} className="text-lg font-medium text-blue-600 hover:underline break-all">
                                                        {selectedInquiry.email}
                                                    </a>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Phone</label>
                                                    <a href={`tel:${selectedInquiry.phone}`} className="text-lg font-medium text-slate-900 dark:text-white">
                                                        {selectedInquiry.phone || 'N/A'}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full bg-slate-50 dark:bg-slate-800/20 rounded-[2.5rem] border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-center p-12">
                                <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-sm">
                                    <FileText className="w-10 h-10 text-slate-300" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                    No Inquiry Selected
                                </h3>
                                <p className="text-slate-500 max-w-xs mx-auto">
                                    Select an inquiry from the list to view full details and manage its status.
                                </p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status, size = "sm" }: { status: string, size?: "sm" | "lg" }) {
    const styles: Record<string, string> = {
        Pending: "bg-amber-100 text-amber-700 border-amber-200",
        Contacted: "bg-blue-100 text-blue-700 border-blue-200",
        Completed: "bg-green-100 text-green-700 border-green-200",
        Rejected: "bg-red-50 text-red-600 border-red-100",
    };

    const style = styles[status] || "bg-slate-100 text-slate-600 border-slate-200";
    
    return (
        <span className={`
            ${style} border font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5
            ${size === "sm" ? "text-[10px] px-2.5 py-1" : "text-xs px-4 py-1.5"}
        `}>
            {status === 'Pending' && <Clock size={size === 'sm' ? 10 : 12} />}
            {status === 'Contacted' && <Mail size={size === 'sm' ? 10 : 12} />}
            {status === 'Completed' && <CheckCircle2 size={size === 'sm' ? 10 : 12} />}
            {status === 'Rejected' && <XCircle size={size === 'sm' ? 10 : 12} />}
            {status}
        </span>
    );
}
