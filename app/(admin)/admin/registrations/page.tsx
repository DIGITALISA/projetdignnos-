"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
    Search, 
    ShieldCheck, 
    Trash2, 
    Check, 
    Loader2, 
    Clock, 
    DollarSign, 
    Calendar, 
    MessageCircle,
    FileText,
    ExternalLink,
    ChevronRight,
    Filter,
    Mail,
    Send
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface MandateRequest {
    _id: string;
    fullName: string;
    email: string;
    whatsapp: string;
    mandateDuration: number;
    mandateCurrency: string;
    mandateAmount: number;
    plannedPaymentDate: string;
    status: string;
    createdAt: string;
}

export default function MandateRequestsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [requests, setRequests] = useState<MandateRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("All");
    const [isReminding, setIsReminding] = useState<string | null>(null);

    const fetchRequests = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/users", { cache: "no-store" });
            const data = await res.json();
            
            // Mock data for demonstration if DB is empty
            const mockRequests: MandateRequest[] = [
                {
                    _id: "demo1",
                    fullName: "Ahmed Ben Ali",
                    email: "ahmed.ali@example.com",
                    whatsapp: "+216 99 123 456",
                    mandateDuration: 6,
                    mandateCurrency: "EUR",
                    mandateAmount: 402,
                    plannedPaymentDate: new Date(Date.now() + 86400000 * 2).toISOString(),
                    status: "Pending",
                    createdAt: new Date().toISOString()
                },
                {
                    _id: "demo2",
                    fullName: "Sarah Dupont",
                    email: "sarah.d@corporate.fr",
                    whatsapp: "+33 6 12 34 56 78",
                    mandateDuration: 12,
                    mandateCurrency: "USD",
                    mandateAmount: 711,
                    plannedPaymentDate: new Date(Date.now() - 86400000).toISOString(),
                    status: "Active",
                    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
                }
            ];

            if (Array.isArray(data)) {
                const filtered = data.filter(u => 
                    u.mandateDuration || 
                    u.plan === "Executive" || 
                    u.plan === "Elite Full Pack" || 
                    u.plan === "Pro Essential"
                );
                setRequests(filtered.length > 0 ? filtered : mockRequests);
            } else {
                setRequests(mockRequests);
            }
        } catch (error) {
            console.error("Error fetching mandate requests:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleCancel = async (requestId: string) => {
        if (!confirm("Voulez-vous vraiment annuler et supprimer cette inscription ?")) return;
        
        try {
            const res = await fetch(`/api/admin/users?id=${requestId}`, {
                method: "DELETE"
            });

            if (res.ok) {
                setRequests(prev => prev.filter(r => r._id !== requestId));
            }
        } catch (error) {
            console.error("Error canceling registration:", error);
        }
    };

    const handleConfirmPayment = async (requestId: string) => {
        try {
            const res = await fetch("/api/admin/users", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: requestId, status: "Active" })
            });

            if (res.ok) {
                setRequests(prev => prev.map(r => r._id === requestId ? { ...r, status: "Active" } : r));
            }
        } catch (error) {
            console.error("Error confirming payment:", error);
        }
    };

    const handleEmailReminder = async (requestId: string) => {
        setIsReminding(requestId);
        try {
            const res = await fetch("/api/admin/remind", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: requestId, type: "email" })
            });

            const data = await res.json();
            if (res.ok) {
                alert("Rappel envoyé par email avec succès !");
            } else {
                alert(data.error || "Erreur lors de l'envoi de l'email. Vérifiez les paramètres SMTP.");
            }
        } catch (error) {
            console.error("Error sending reminder:", error);
            alert("Erreur de connexion au serveur.");
        } finally {
            setIsReminding(null);
        }
    };

    const handleWhatsAppReminder = (req: MandateRequest) => {
        const amountDisplay = `${req.mandateAmount?.toLocaleString()} ${req.mandateCurrency}`;
        const dateDisplay = req.plannedPaymentDate ? new Date(req.plannedPaymentDate).toLocaleDateString('fr-FR') : "non précisée";
        
        const message = `Bonjour ${req.fullName}, %0A%0AC'est MA Training Consulting. Nous vous rappelons votre inscription au mandat de ${req.mandateDuration} mois (${amountDisplay}).%0ADate de paiement prévue: ${dateDisplay}.%0A%0AMerci de nous confirmer le règlement pour activer vos services.`;
        
        const cleanPhone = req.whatsapp.replace(/[^0-9+]/g, '');
        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;
        window.open(whatsappUrl, '_blank');
    };

    const filteredRequests = requests.filter(r => {
        const matchesSearch = r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             r.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === "All" || r.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Suivi des Inscriptions & Paiements</h1>
                    <p className="text-slate-500 mt-1">Consultez les nouvelles inscriptions et suivez l&apos;état des règlements financiers.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 text-xs font-bold flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        {requests.filter(r => r.status === 'Pending').length} Demandes en attente
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
                    {["All", "Pending", "Active"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={cn(
                                "px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                                filterStatus === status ? "bg-slate-900 text-white shadow-lg" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                            )}
                        >
                            {status === "All" ? "Tous" : status === "Pending" ? "En Attente" : "Confirmés"}
                        </button>
                    ))}
                </div>

                <div className="relative w-full lg:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher un candidat..."
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/10 transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Requests Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidat</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Offre Choisie</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Montant Prévu</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date de Paiement</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">État du Règlement</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center text-slate-400">
                                        <Loader2 className="animate-spin mx-auto mb-4" size={32} />
                                        Chargement des demandes...
                                    </td>
                                </tr>
                            ) : filteredRequests.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center text-slate-400">
                                        Aucune demande de mandat trouvée.
                                    </td>
                                </tr>
                            ) : (
                                filteredRequests.map((req, idx) => (
                                    <motion.tr
                                        key={req._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="hover:bg-slate-50 transition-colors group"
                                    >
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                                    {req.fullName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{req.fullName}</p>
                                                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                                                        <MessageCircle size={10} className="text-emerald-500" />
                                                        {req.whatsapp}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
                                                    <FileText size={12} className="text-blue-500" />
                                                    Mandat {req.mandateDuration} Mois
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-medium italic">
                                                    Inscrit le {new Date(req.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-900">
                                                    {req.mandateAmount?.toLocaleString()} {req.mandateCurrency}
                                                </span>
                                                <span className="text-[10px] font-black uppercase text-emerald-600 tracking-tighter">
                                                    Total TTC
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Calendar size={14} className="text-amber-500" />
                                                <span className="text-xs font-bold underline decoration-amber-500/30">
                                                    {req.plannedPaymentDate ? new Date(req.plannedPaymentDate).toLocaleDateString() : 'Non précisée'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                req.status === 'Active' ? "bg-green-100 text-green-700" : 
                                                req.status === 'Pending' ? "bg-amber-100 text-amber-700 animate-pulse" : 
                                                "bg-slate-100 text-slate-500"
                                            )}>
                                                {req.status === 'Active' ? 'Paiement Reçu' : 'En Attente'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {req.status === 'Pending' && (
                                                    <div className="flex items-center gap-1.5 mr-2 pr-2 border-r border-slate-100">
                                                        <button 
                                                            onClick={() => handleEmailReminder(req._id)}
                                                            disabled={isReminding === req._id}
                                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                            title="Rappel par Email"
                                                        >
                                                            {isReminding === req._id ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                                                        </button>
                                                        <button 
                                                            onClick={() => handleWhatsAppReminder(req)}
                                                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                                            title="Rappel par WhatsApp"
                                                        >
                                                            <MessageCircle size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                                
                                                {req.status === 'Pending' && (
                                                    <button 
                                                        onClick={() => handleConfirmPayment(req._id)}
                                                        className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center gap-2"
                                                    >
                                                        <Check size={14} />
                                                        Confirmer
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => handleCancel(req._id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Annuler l'inscription"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
