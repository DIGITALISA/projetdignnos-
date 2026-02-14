"use client";

import { motion } from "framer-motion";
import { Download, Award, ShieldCheck, Printer, ArrowLeft, Sparkles, Building2, UserCheck, Calendar } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Link from "next/link";

import { useSearchParams } from "next/navigation";

interface WorkshopData {
    title: string;
    participantName: string;
    date: string;
    referenceId: string;
}

export default function WorkshopAttestationPage() {
    const attestationRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [workshop, setWorkshop] = useState<WorkshopData | null>(null);
    const searchParams = useSearchParams();
    const userId = searchParams.get("userId");

    useEffect(() => {
        const loadInfo = async () => {
            const activeWorkshopParam = searchParams.get("activeWorkshop");
            
            if (userId) {
                // Fetch specific user info for Admin view
                try {
                    const res = await fetch(`/api/user/profile?userId=${userId}`);
                    const data = await res.json();
                    if (data.success) {
                        setWorkshop({
                            title: activeWorkshopParam || data.profile.grantedWorkshopTitle || "Leadership Stratégique & Management de Crise",
                            participantName: data.profile.fullName,
                            date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
                            referenceId: `WKS-${userId.substring(userId.length - 6).toUpperCase()}`
                        });
                    }
                } catch (error) {
                    console.error("Error fetching user for attestation:", error);
                }
            } else {
                // Load from localStorage for the participant's own view
                const savedProfile = localStorage.getItem("userProfile");
                if (savedProfile) {
                    const parsed = JSON.parse(savedProfile);
                    
                    // First try to fetch official data from API for participant
                    const identifier = parsed.email || parsed.fullName;
                    if (identifier) {
                        try {
                            const res = await fetch(`/api/user/profile?userId=${encodeURIComponent(identifier)}`);
                            const data = await res.json();
                            if (data.success) {
                                setWorkshop({
                                    title: activeWorkshopParam || data.profile.grantedWorkshopTitle || "Leadership Stratégique",
                                    participantName: data.profile.fullName,
                                    date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
                                    referenceId: `WKS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
                                });
                                return;
                            }
                        } catch (err) { console.error(err); }
                    }

                    // Fallback to local
                    setWorkshop({
                        title: activeWorkshopParam || "Leadership Stratégique & Management de Crise",
                        participantName: parsed.fullName || "M. Participant",
                        date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
                        referenceId: `WKS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
                    });
                }
            }
        };
        
        loadInfo();
    }, [userId, searchParams]);

    const handleDownload = async () => {
        if (!attestationRef.current || !workshop) return;
        setIsDownloading(true);

        try {
            const canvas = await html2canvas(attestationRef.current, {
                scale: 3,
                useCORS: true,
                backgroundColor: "#ffffff",
                logging: false,
                onclone: (clonedDoc) => {
                    // 1. Remove stubborn link tags
                    const links = clonedDoc.getElementsByTagName('link');
                    while (links.length > 0) {
                        links[0].parentNode?.removeChild(links[0]);
                    }

                    // 2. Inject Safe Styles & Font
                    const safeStyle = clonedDoc.createElement('style');
                    safeStyle.innerHTML = `
                        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
                        * { font-family: 'Playfair Display', serif !important; }
                        .bg-white { background-color: #ffffff !important; }
                        .text-slate-900 { color: #0f172a !important; }
                        .text-slate-950 { color: #020617 !important; }
                        .text-blue-600 { color: #2563eb !important; }
                        .text-blue-700 { color: #1d4ed8 !important; }
                        .font-black { font-weight: 900 !important; }
                        .italic { font-style: italic !important; }
                        .uppercase { text-transform: uppercase !important; }
                    `;
                    clonedDoc.head.appendChild(safeStyle);
                }
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Attestation-Workshop-${workshop.referenceId}.pdf`);
        } catch (error) {
            console.error("Download failed:", error);
            alert("Failed to generate PDF attestation.");
        } finally {
            setIsDownloading(false);
        }
    };

    if (!workshop) return null;

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 space-y-8 pb-20">
            {/* Action Bar */}
            <div className="max-w-5xl mx-auto flex items-center justify-between bg-white p-6 rounded-4xl border border-slate-200 shadow-sm">
                <Link href="/training" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-xs uppercase tracking-widest">
                    <ArrowLeft size={16} />
                    Retour aux Workshops
                </Link>
                <div className="flex items-center gap-3">
                    <button onClick={() => window.print()} className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all">
                        <Printer size={20} />
                    </button>
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-950 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl disabled:opacity-50"
                    >
                        {isDownloading ? "Génération..." : "Exporter l'Attestation"}
                        <Download size={16} />
                    </button>
                </div>
            </div>

            {/* Attestation Preview */}
            <div className="max-w-5xl mx-auto flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative p-1 bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
                >
                    <div
                        ref={attestationRef}
                        className="relative w-[297mm] h-[210mm] bg-white text-slate-900 overflow-hidden flex flex-col p-16"
                        style={{
                            backgroundImage: "radial-gradient(circle at center, #ffffff 40%, #f9fafb 100%)",
                            fontFamily: "'Playfair Display', serif"
                        }}
                    >
                        {/* Ornamental Borders */}
                        <div className="absolute inset-8 border-[0.5px] border-slate-300" />
                        <div className="absolute inset-10 border-2 border-double border-slate-900/5" />
                        
                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-40 h-40 border-t-4 border-l-4 border-slate-900/10 rounded-tl-[4rem] -ml-4 -mt-4" />
                        <div className="absolute bottom-0 right-0 w-40 h-40 border-b-4 border-r-4 border-slate-900/10 rounded-br-[4rem] -mr-4 -mb-4" />

                        <div className="relative z-10 flex flex-col h-full items-center justify-between text-center">
                            {/* Header */}
                            <div className="space-y-4">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center text-white rotate-3 shadow-xl mb-4">
                                        <Building2 size={32} />
                                    </div>
                                    <h4 className="text-slate-900 font-extrabold text-sm uppercase tracking-[0.5em]">MA-TRAINING-CONSULTING</h4>
                                    <p className="text-blue-600/60 font-black text-[10px] uppercase tracking-[0.3em]">Cabinet de Conseil Stratégique</p>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-400">Attestation de Participation</span>
                                    <h1 className="text-6xl font-black text-slate-950 italic tracking-tight">Workshop Stratégique</h1>
                                </div>

                                <div className="max-w-2xl mx-auto space-y-6">
                                    <p className="text-xl font-serif text-slate-500 leading-relaxed italic">
                                        Le Cabinet MA-TRAINING-CONSULTING certifie par la présente la participation active de
                                    </p>
                                    <h2 className="text-5xl font-black text-slate-900 border-b-2 border-slate-900 inline-block pb-2 px-8">
                                        {workshop.participantName}
                                    </h2>
                                    <p className="text-xl font-serif text-slate-600 leading-relaxed max-w-xl mx-auto italic mt-6">
                                        À la séance intensive de Workshop intitulée :
                                        <br />
                                        <span className="font-black uppercase tracking-wider text-2xl not-italic block mt-2 text-blue-700">
                                            « {workshop.title} »
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="w-full flex justify-between items-end border-t border-slate-100 pt-12 text-left">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                                            <Calendar className="text-slate-400" size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Délivré le</p>
                                            <p className="text-lg font-bold text-slate-900">{workshop.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                                            <ShieldCheck className="text-blue-500" size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Réf. Validation</p>
                                            <p className="text-sm font-mono font-bold text-slate-900">{workshop.referenceId}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right space-y-4">
                                    <div className="w-56 h-20 border-b border-slate-200 flex items-center justify-center italic text-slate-300 font-serif text-2xl">
                                        Signature du Consultant
                                    </div>
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 max-w-xs leading-relaxed">
                                        Propriété intellectuelle exclusive de MA-TRAINING-CONSULTING.<br />
                                        Vérification autorisée via le code de référence unique.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Official Seal Overlay */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.015] pointer-events-none">
                            <Award size={600} />
                        </div>
                    </div>
                </motion.div>

                {/* Additional Info Cards */}
                <div className="grid md:grid-cols-3 gap-6 w-full mt-12 mb-20 text-center">
                    <div className="bg-white p-8 rounded-3xl border border-slate-200">
                        <Sparkles className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                        <h3 className="text-sm font-black uppercase mb-2 tracking-widest">Valeur Stratégique</h3>
                        <p className="text-[10px] text-slate-500 font-medium">Cette attestation valide vos heures de réflexion stratégique pour votre prochaine promotion.</p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl border border-slate-200">
                        <UserCheck className="w-8 h-8 text-emerald-600 mx-auto mb-4" />
                        <h3 className="text-sm font-black uppercase mb-2 tracking-widest">Profil Validé</h3>
                        <p className="text-[10px] text-slate-500 font-medium">Vos scores pendant ce Workshop sont automatiquement intégrés à votre diagnostic final.</p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl border border-slate-200">
                        <Award className="w-8 h-8 text-amber-600 mx-auto mb-4" />
                        <h3 className="text-sm font-black uppercase mb-2 tracking-widest">Official Audit</h3>
                        <p className="text-[10px] text-slate-500 font-medium">Reconnu par notre Cabinet de Conseil comme une étape clé de votre transformation.</p>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
                
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    div[ref="attestationRef"], div[ref="attestationRef"] * {
                        visibility: visible;
                    }
                    div[ref="attestationRef"] {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
}
