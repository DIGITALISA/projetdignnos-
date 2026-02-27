"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Calendar, Download, Printer, ArrowLeft, Award, Sparkles, UserCheck } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import domtoimage from "dom-to-image-more";
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
    const [workshop, setWorkshop] = useState<WorkshopData | null>(null);
    const searchParams = useSearchParams();
    const userId = searchParams.get("userId");
    const dateParam = searchParams.get("date");

    useEffect(() => {
        const loadInfo = async () => {
            const activeWorkshopParam = searchParams.get("activeWorkshop");
            const refParam = searchParams.get("ref");
            
            let name = "M. Participant";
            if (userId) {
                try {
                    const res = await fetch(`/api/user/profile?userId=${userId}`);
                    const data = await res.json();
                    if (data.success) name = data.profile.fullName;
                } catch (err) { console.error(err); }
            } else {
                const saved = localStorage.getItem("userProfile");
                if (saved) name = JSON.parse(saved).fullName || "M. Participant";
            }

            setWorkshop({
                title: activeWorkshopParam || "Leadership Stratégique",
                participantName: name,
                date: dateParam 
                    ? new Date(Number(dateParam)).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
                    : new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
                referenceId: refParam || `WKS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
            });
        };
        
        loadInfo();
    }, [userId, searchParams, dateParam]);

    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        if (!attestationRef.current || !workshop) return;
        setIsDownloading(true);
        try {
            await document.fonts.ready;

            const original = attestationRef.current;

            // ── 1. Deep-clone the certificate element ──────────────────────────────
            const clone = original.cloneNode(true) as HTMLElement;

            // Position it off-screen so it renders but isn't visible
            clone.style.position  = "fixed";
            clone.style.top       = "-9999px";
            clone.style.left      = "-9999px";
            clone.style.width     = `${original.offsetWidth}px`;
            clone.style.height    = `${original.offsetHeight}px`;
            clone.style.overflow  = "visible";
            document.body.appendChild(clone);

            // ── 2. Walk every element in the clone + fix problematic styles ─────────
            const unsupported = /oklch|oklab|lab\(|lch\(|hwb\(|color-mix/i;

            const resolveColor = (raw: string): string => {
                const tmp = document.createElement("span");
                tmp.style.color = raw;
                document.body.appendChild(tmp);
                const resolved = getComputedStyle(tmp).color;
                document.body.removeChild(tmp);
                return resolved || "rgb(0,0,0)";
            };

            [clone, ...Array.from(clone.querySelectorAll("*"))].forEach(node => {
                const el = node as HTMLElement;
                const computed = getComputedStyle(el);

                // Kill animations & backdrop blur (source of black rectangles)
                el.style.setProperty("transition",          "none",  "important");
                el.style.setProperty("animation",           "none",  "important");
                el.style.setProperty("backdrop-filter",     "none",  "important");
                el.style.setProperty("-webkit-backdrop-filter", "none", "important");

                // Fix text & background colors
                (["color", "backgroundColor", "outlineColor", "textDecorationColor"] as const).forEach(key => {
                    const val = computed[key] as string;
                    if (val && unsupported.test(val)) {
                        const kebab = key.replace(/([A-Z])/g, "-$1").toLowerCase();
                        el.style.setProperty(kebab, resolveColor(val), "important");
                    }
                });

                // KEY FIX: For borders, only fix sides with actual width > 0
                // Tailwind v4 sets border-style:solid on ALL elements (preflight)
                // so if we set a border-color, it will appear even on 0-width sides!
                (["Top", "Right", "Bottom", "Left"] as const).forEach(side => {
                    const widthVal = computed[`border${side}Width` as keyof CSSStyleDeclaration] as string;
                    if (!widthVal || widthVal === "0px") {
                        // Explicitly hide this border side so it doesn't bleed
                        el.style.setProperty(`border-${side.toLowerCase()}-width`, "0px", "important");
                    } else {
                        // There IS a real border here — resolve its color if needed
                        const colorVal = computed[`border${side}Color` as keyof CSSStyleDeclaration] as string;
                        if (colorVal && unsupported.test(colorVal)) {
                            el.style.setProperty(
                                `border-${side.toLowerCase()}-color`,
                                resolveColor(colorVal),
                                "important"
                            );
                        }
                    }
                });

                // Outline — only keep if it has non-zero width
                const outlineWidth = computed.outlineWidth;
                if (!outlineWidth || outlineWidth === "0px") {
                    el.style.setProperty("outline", "none", "important");
                }

                // Remove external background images (CORS taint)
                const bg = computed.backgroundImage;
                if (bg && bg !== "none" && (bg.includes("http://") || bg.includes("https://"))) {
                    el.style.setProperty("background-image", "none", "important");
                }
            });

            // ── 3. Capture with dom-to-image-more ─────────────────────────────────
            const dataUrl = await domtoimage.toPng(clone, {
                scale: 2,
                bgcolor: "#ffffff",
                width:   original.offsetWidth,
                height:  original.offsetHeight,
            });

            document.body.removeChild(clone);

            // ── 4. Build A4 landscape PDF ──────────────────────────────────────────
            const img = new Image();
            img.src   = dataUrl;
            await new Promise<void>(resolve => { img.onload = () => resolve(); });

            const pdf   = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
            const pdfW  = pdf.internal.pageSize.getWidth();
            const pdfH  = pdf.internal.pageSize.getHeight();
            pdf.setFillColor(255, 255, 255);
            pdf.rect(0, 0, pdfW, pdfH, "F");

            const ratio    = img.width  / img.height;
            const pdfRatio = pdfW / pdfH;
            let imgW = pdfW, imgH = pdfH;
            if (ratio > pdfRatio) { imgH = pdfW / ratio; } else { imgW = pdfH * ratio; }

            pdf.addImage(dataUrl, "PNG", (pdfW - imgW) / 2, (pdfH - imgH) / 2, imgW, imgH);
            pdf.save(`Attestation-Workshop-${workshop.referenceId}.pdf`);

        } catch (err) {
            console.error("Download failed:", err);
            alert("Échec de la génération du PDF. Veuillez réessayer.");
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
                        className="flex items-center gap-2 px-6 py-3 bg-slate-950 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl disabled:opacity-60"
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
                        className="relative w-[297mm] h-[210mm] bg-white text-slate-900 overflow-hidden flex flex-col p-20"
                        style={{
                            backgroundImage: "radial-gradient(circle at center, #ffffff 0%, #fcfdfe 100%)",
                            fontFamily: "'Playfair Display', serif"
                        }}
                    >
                        {/* Mesh Texture Overlay */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                             style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')" }} />
                        
                        {/* Ornamental Borders */}
                        <div className="absolute inset-10 border-[0.5px] border-slate-200" />
                        <div className="absolute inset-12 border-2 border-double border-slate-950/5" />
                        
                        {/* Corner Accents */}
                        <div className="absolute top-4 left-4 w-48 h-48 border-t-[6px] border-l-[6px] border-slate-900/5 rounded-tl-[5rem]" />
                        <div className="absolute bottom-4 right-4 w-48 h-48 border-b-[6px] border-r-[6px] border-slate-900/5 rounded-br-[5rem]" />

                        <div className="relative z-10 flex flex-col h-full items-center justify-between text-center">
                            {/* Header */}
                            <div className="w-full flex flex-col items-center">
                                <div className="relative group">
                                    <div className="absolute -inset-4 bg-blue-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative mb-6">
                                        <img src="/logo-matc.png" alt="MATC Logo" className="h-24 w-auto object-contain drop-shadow-sm" />
                                    </div>
                                </div>
                                <div className="space-y-1 text-center">
                                    <h4 className="text-slate-900 font-black text-xs uppercase tracking-[0.6em] ml-2">MA-TRAINING-CONSULTING</h4>
                                    <p className="text-blue-600/50 font-bold text-[9px] uppercase tracking-[0.4em]">Cabinet de Conseil Stratégique</p>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="flex-1 flex flex-col justify-center items-center py-8">
                                <div className="space-y-4 text-center">
                                    <span className="text-[11px] font-black uppercase tracking-[0.8em] text-slate-300">Attestation de Participation</span>
                                    <h1 className="text-7xl font-black text-slate-950 italic tracking-tight">Workshop Stratégique</h1>
                                </div>

                                <div className="mt-12 space-y-10 text-center">
                                    <div className="space-y-4">
                                        <p className="text-lg font-serif text-slate-400 italic">
                                            Le Cabinet MA-TRAINING-CONSULTING certifie par la présente la participation active de
                                        </p>
                                        <h2 className="text-6xl font-black text-slate-900 border-b-4 border-slate-950/10 inline-block pb-4 px-12 uppercase tracking-tighter">
                                            {workshop.participantName}
                                        </h2>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-lg font-serif text-slate-500 italic">
                                            À la Session Complète de Workshop intitulée :
                                        </p>
                                        <span className="font-black uppercase tracking-[0.15em] text-3xl block text-blue-700">
                                            « {workshop.title} »
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer (Metadata Only) */}
                            <div className="w-full flex justify-between items-end pt-12 border-t border-slate-100">
                                <div className="flex gap-16">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
                                            <Calendar className="text-slate-400" size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Délivré le</p>
                                            <p className="text-base font-black text-slate-900">{workshop.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
                                            <ShieldCheck className="text-blue-500" size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Réf. Validation</p>
                                            <p className="text-sm font-mono font-black text-slate-900 tracking-tight">{workshop.referenceId}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="text-right">
                                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-300 max-w-xs leading-relaxed">
                                        Propriété exclusive de MA-TRAINING-CONSULTING.
                                    </p>
                                </div>
                            </div>

                            {/* Absolutely Positioned Stamp & Signature (Final precision alignment) */}
                            <div className="absolute bottom-[0.5%] right-[1%] flex flex-col items-center gap-2 pointer-events-none group">
                                <div className="relative flex items-center justify-center w-64 h-32">
                                    {/* Company Stamp */}
                                    <div className="opacity-80 transform -rotate-12 transition-transform group-hover:rotate-0 duration-700">
                                        <div className="w-48 h-24 border-[3.5px] rounded-2xl flex flex-col items-center justify-center bg-white/40 backdrop-blur-[0.5px] shadow-sm relative overflow-hidden" 
                                             style={{ borderColor: '#1e3a8a', color: '#1e3a8a', fontFamily: 'serif' }}>
                                            <div className="absolute inset-0 opacity-[0.03] bg-slate-900 pointer-events-none" />
                                            <p className="text-lg font-black uppercase tracking-tighter leading-none mb-0.5">Sté MA</p>
                                            <p className="text-[10px] font-bold uppercase tracking-widest leading-none mb-1.5">Training Consulting</p>
                                            <div className="w-4/5 h-[1.5px] bg-blue-900/30 my-1" />
                                            <p className="text-[8px] font-bold leading-none mb-1">Tel: 44 172 264</p>
                                            <p className="text-[8px] font-bold leading-none">MF: 1805031P/A/M/000</p>
                                        </div>
                                    </div>

                                    {/* Consultant Signature */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] opacity-95 pointer-events-none transform -rotate-6 z-20">
                                        <svg width="240" height="100" viewBox="0 0 150 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: '#1e3a8a' }}>
                                            <path d="M10 45C25 42 45 12 65 22C85 32 105 5 130 15M15 52C35 48 55 42 95 45" 
                                                  stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" 
                                                  className="drop-shadow-[0_2px_3px_rgba(30,58,138,0.25)]"/>
                                            <path d="M35 28C40 22 50 18 55 32C60 46 45 52 40 42C35 32 50 22 65 27" 
                                                  stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-[10px] font-serif italic text-slate-500 -mt-2">Le Consultant en Stratégie</p>
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
