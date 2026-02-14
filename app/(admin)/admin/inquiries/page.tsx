"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
    Search, 
    Building2, 
    Mail, 
    Phone, 
    Calendar, 
    Target, 
    X,
    Trash2,
    Eye,
    Sparkles,
    Brain,
    Loader2,
    CheckCircle,
    AlertCircle,
    Edit3
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/providers/ToastProvider";

interface CorporateInquiry {
    _id: string;
    companyName: string;
    companyEmail: string;
    companyPhone: string;
    targetPosition: string;
    jobDescription: string;
    candidateRefId: string;
    candidateFirstName: string;
    candidateLastName: string;
    desiredReportDate: string;
    interviewDate: string;
    additionalInfo?: string;
    status: 'pending' | 'reviewed' | 'completed';
    corporateReport?: {
        summary: string;
        strengths: string[];
        risks: string[];
        expertVerdict: string;
        generatedAt: string;
    };
    createdAt: string;
}

export default function CorporateInquiriesManagement() {
    const [inquiries, setInquiries] = useState<CorporateInquiry[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [selectedInquiry, setSelectedInquiry] = useState<CorporateInquiry | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingReport, setIsLoadingReport] = useState(false);
    const [isEditingReport, setIsEditingReport] = useState(false);
    const { showToast } = useToast();

    const fetchInquiries = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/corporate-inquiry");
            const data = await res.json();
            if (data.success) {
                setInquiries(data.data);
            }
        } catch (error) {
            console.error("Error fetching inquiries:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this inquiry?")) return;
        try {
            const res = await fetch(`/api/corporate-inquiry/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setInquiries(prev => prev.filter(i => i._id !== id));
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/corporate-inquiry/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                fetchInquiries();
            }
        } catch (error) {
            console.error("Update error:", error);
        }
    };

    const filteredInquiries = inquiries.filter(inquiry => {
        const matchesSearch = 
            inquiry.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inquiry.candidateFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inquiry.candidateLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inquiry.candidateRefId.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = filterStatus === "All" || inquiry.status === filterStatus.toLowerCase();
        
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Corporate Inquiries</h1>
                    <p className="text-slate-500 mt-1">Manage strategic evaluation requests from companies and HR departments.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
                    {["All", "Pending", "Reviewed", "Completed"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={cn(
                                "px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                                filterStatus === status 
                                    ? "bg-slate-900 dark:bg-blue-600 text-white shadow-lg" 
                                    : "bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                            )}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                <div className="relative w-full lg:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search by company or candidate..."
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/10 transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Company</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Candidate</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Target Position</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Dates</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Status</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center text-slate-400">Loading inquiries...</td>
                                </tr>
                            ) : filteredInquiries.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center text-slate-400">No inquiries found.</td>
                                </tr>
                            ) : filteredInquiries.map((inquiry) => (
                                <tr key={inquiry._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                                                <Building2 size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white">{inquiry.companyName}</p>
                                                <p className="text-xs text-slate-500">{inquiry.companyEmail}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold text-xs">
                                                {inquiry.candidateFirstName[0]}{inquiry.candidateLastName[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white text-sm">{inquiry.candidateFirstName} {inquiry.candidateLastName}</p>
                                                <p className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold">{inquiry.candidateRefId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                            <Target size={14} className="text-indigo-500" />
                                            <span className="text-sm font-medium">{inquiry.targetPosition}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                                                <Calendar size={12} className="text-green-500" />
                                                REP: {new Date(inquiry.desiredReportDate).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                                                <Calendar size={12} className="text-amber-500" />
                                                INT: {new Date(inquiry.interviewDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className={cn(
                                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                                            inquiry.status === 'pending' ? "bg-amber-100 text-amber-700" :
                                            inquiry.status === 'reviewed' ? "bg-blue-100 text-blue-700" :
                                            "bg-green-100 text-green-700"
                                        )}>
                                            <div className={cn("w-1.5 h-1.5 rounded-full", 
                                                inquiry.status === 'pending' ? "bg-amber-500 animate-pulse" :
                                                inquiry.status === 'reviewed' ? "bg-blue-500" : "bg-green-500"
                                            )} />
                                            {inquiry.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => setSelectedInquiry(inquiry)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(inquiry._id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Details Modal */}
            <AnimatePresence>
                {selectedInquiry && (
                    <>
                        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 px-4" onClick={() => setSelectedInquiry(null)} />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl z-60 overflow-hidden border border-slate-100 dark:border-slate-800"
                        >
                            <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
                                        <Building2 size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Inquiry Details</h2>
                                        <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Inquiry ID: {selectedInquiry._id.slice(-8)}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedInquiry(null)} className="w-10 h-10 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh]">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Company Information</h3>
                                        <div className="space-y-2">
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedInquiry.companyName}</p>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <Mail size={12} /> {selectedInquiry.companyEmail}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <Phone size={12} /> {selectedInquiry.companyPhone}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Position Details</h3>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-bold text-indigo-600">
                                                <Target size={14} /> {selectedInquiry.targetPosition}
                                            </div>
                                            <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                                                {selectedInquiry.jobDescription}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-slate-100 dark:border-slate-800 grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Candidate Information</h3>
                                        <div className="space-y-2">
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedInquiry.candidateFirstName} {selectedInquiry.candidateLastName}</p>
                                            <p className="text-xs font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded inline-block">
                                                REF: {selectedInquiry.candidateRefId}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dates & Status</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-slate-500">Desired Report:</span>
                                                <span className="font-bold">{new Date(selectedInquiry.desiredReportDate).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-slate-500">Interview Date:</span>
                                                <span className="font-bold">{new Date(selectedInquiry.interviewDate).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs pt-2">
                                                <span className="text-slate-500">Current Status:</span>
                                                <select 
                                                    className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-xs font-bold p-1 outline-none"
                                                    value={selectedInquiry.status}
                                                    onChange={(e) => handleUpdateStatus(selectedInquiry._id, e.target.value)}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="reviewed">Reviewed</option>
                                                    <option value="completed">Completed</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {selectedInquiry.additionalInfo && (
                                    <div className="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-4">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Additional Information</h3>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                                            &quot;{selectedInquiry.additionalInfo}&quot;
                                        </p>
                                    </div>
                                )}

                                {/* AI Report Section */}
                                <div className="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 flex items-center gap-2">
                                            <Sparkles size={14} /> Strategic AI Evaluation
                                        </h3>
                                        <button
                                            onClick={async () => {
                                                setIsLoadingReport(true);
                                                try {
                                                    const res = await fetch(`/api/corporate-inquiry/${selectedInquiry._id}/generate-report`, {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({ language: 'fr' }) 
                                                    });
                                                    const data = await res.json();
                                                    if (data.success) {
                                                        setSelectedInquiry({ ...selectedInquiry, corporateReport: data.report, status: 'reviewed' });
                                                        showToast("Strategic report generated successfully", "success");
                                                        fetchInquiries();
                                                    } else {
                                                        showToast(`Documentation Incomplete: ${data.error}`, "error");
                                                    }
                                                } catch (error) {
                                                    console.error("AI Generation Error:", error);
                                                    showToast("Could not connect to the intelligence engine", "error");
                                                } finally {
                                                    setIsLoadingReport(false);
                                                }
                                            }}
                                            disabled={isLoadingReport}
                                            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg ${
                                                selectedInquiry.corporateReport 
                                                ? "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 shadow-slate-200/20" 
                                                : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
                                            }`}
                                        >
                                            {isLoadingReport ? <Loader2 size={12} className="animate-spin" /> : <Brain size={12} />}
                                            {selectedInquiry.corporateReport ? "Update Strategic Report" : "Generate Strategic Report"}
                                        </button>
                                    </div>

                                    {selectedInquiry.corporateReport ? (
                                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                            <div className="flex items-center justify-between">
                                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Executive Summary</p>
                                                <button 
                                                    onClick={() => setIsEditingReport(!isEditingReport)}
                                                    className="text-[10px] font-bold text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1"
                                                >
                                                    <Edit3 size={10} /> {isEditingReport ? "View Mode" : "Edit Report"}
                                                </button>
                                            </div>

                                            {isEditingReport ? (
                                                <textarea 
                                                    className="w-full p-6 bg-slate-50 dark:bg-slate-800/50 border-2 border-blue-100 dark:border-blue-900/30 rounded-3xl text-sm text-slate-700 dark:text-slate-300 min-h-[120px] focus:border-blue-500 outline-none transition-all"
                                                    value={selectedInquiry.corporateReport.summary}
                                                    onChange={(e) => {
                                                        const updated = { ...selectedInquiry, corporateReport: { ...selectedInquiry.corporateReport, summary: e.target.value } };
                                                        setSelectedInquiry(updated as CorporateInquiry);
                                                    }}
                                                />
                                            ) : (
                                                <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-3xl">
                                                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic font-medium">
                                                        &quot;{selectedInquiry.corporateReport.summary}&quot;
                                                    </p>
                                                </div>
                                            )}

                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Candidate Strengths</p>
                                                    <div className="space-y-2">
                                                        {selectedInquiry.corporateReport.strengths.map((s, i) => (
                                                            <div key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                                                                <CheckCircle size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                                                                {isEditingReport ? (
                                                                    <input 
                                                                        className="flex-1 bg-transparent border-b border-emerald-100 focus:border-emerald-500 outline-none"
                                                                        value={s}
                                                                        onChange={(e) => {
                                                                            const newStrengths = [...selectedInquiry.corporateReport!.strengths];
                                                                            newStrengths[i] = e.target.value;
                                                                            setSelectedInquiry({ ...selectedInquiry, corporateReport: { ...selectedInquiry.corporateReport!, strengths: newStrengths } });
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <span>{s}</span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Operational Risks</p>
                                                    <div className="space-y-2">
                                                        {selectedInquiry.corporateReport.risks.map((r, i) => (
                                                            <div key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                                                                <AlertCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                                                                {isEditingReport ? (
                                                                    <input 
                                                                        className="flex-1 bg-transparent border-b border-amber-100 focus:border-amber-500 outline-none"
                                                                        value={r}
                                                                        onChange={(e) => {
                                                                            const newRisks = [...selectedInquiry.corporateReport!.risks];
                                                                            newRisks[i] = e.target.value;
                                                                            setSelectedInquiry({ ...selectedInquiry, corporateReport: { ...selectedInquiry.corporateReport!, risks: newRisks } });
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <span>{r}</span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {isEditingReport && (
                                                <button 
                                                    onClick={async () => {
                                                        try {
                                                            const res = await fetch(`/api/corporate-inquiry/${selectedInquiry._id}`, {
                                                                method: 'PATCH',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify({ corporateReport: selectedInquiry.corporateReport })
                                                            });
                                                            if (res.ok) {
                                                                showToast("Report changes saved locally", "success");
                                                                setIsEditingReport(false);
                                                            }
                                                        } catch {
                                                            showToast("Failed to save changes", "error");
                                                        }
                                                    }}
                                                    className="w-full py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all"
                                                >
                                                    Save Manual Changes
                                                </button>
                                            )}

                                            <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800">
                                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Final Expert Verdict</p>
                                                {isEditingReport ? (
                                                    <input 
                                                        className="w-full bg-transparent border-b border-blue-400/20 text-sm font-bold text-white leading-relaxed focus:border-blue-400 outline-none"
                                                        value={selectedInquiry.corporateReport.expertVerdict}
                                                        onChange={(e) => {
                                                            setSelectedInquiry({ ...selectedInquiry, corporateReport: { ...selectedInquiry.corporateReport!, expertVerdict: e.target.value } });
                                                        }}
                                                    />
                                                ) : (
                                                    <p className="text-sm font-bold text-white leading-relaxed">
                                                        {selectedInquiry.corporateReport.expertVerdict}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ) : !isLoadingReport && (
                                        <div className="py-10 text-center bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-100 dark:border-slate-800">
                                            <Brain size={32} className="mx-auto text-slate-300 mb-3" />
                                            <p className="text-xs text-slate-500 font-medium">No strategic report generated yet.<br/>Click the button above to synthesize data.</p>
                                        </div>
                                    )}

                                    {isLoadingReport && (
                                        <div className="py-20 flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                                            <Loader2 size={32} className="animate-spin text-blue-600" />
                                            <div className="text-center">
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">Synthesizing Candidate Data...</p>
                                                <p className="text-xs text-slate-500">Connecting CV, Interview, and Simulation performance logs.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}



