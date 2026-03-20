"use client";

import { motion } from "framer-motion";
import { Award, Calendar, Download, FileText, Search, ShieldCheck, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { AssetLocked } from "@/components/layout/AssetLocked";

interface Attestation {
    workshopTitle: string;
    issueDate: string;
    referenceId: string;
    instructor?: string;
}

interface ReadinessStatus {
    isReady: boolean;
    hasDiagnosis: boolean;
    hasSimulation: boolean;
    certReady: boolean;
    recReady: boolean;
    scorecardReady: boolean;
    sciReady: boolean;
}

export default function ProfessionalAttestationsPage() {
    const { dir, language } = useLanguage();
    const isRtl = dir === 'rtl';

    const [attestations, setAttestations] = useState<Attestation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [readiness, setReadiness] = useState<ReadinessStatus | null>(null);

    const t = {
        ar: {
            title: "سجل الشهادات المعتمدة",
            subtitle: "استعرض وحمل شواهيدك الرسمية المسجلة في بروتوكول MATC للتطوير التنفيذي.",
            search: "البحث عن شهادة...",
            loading: "الوصول إلى سجل الاعتمادات...",
            noResults: "لم يتم العثور على شهادات تطابق بحثك.",
            empty: "لا توجد شهادات صادرة حالياً",
            emptyDesc: "بمجرد إتمام ورش العمل بنجاح واعتمادها من الخبراء، ستظهر شهاداتك هنا.",
            download: "عرض وتحميل",
            issueDate: "تاريخ الإصدار",
            ref: "المرجع الرسمي",
            verified: "شهادة معتمدة",
            premium: "اعتماد تنفيذي"
        },
        en: {
            title: "Certified Accreditation Registry",
            subtitle: "View and download your official certificates registered in the MATC Executive Development Protocol.",
            search: "Search certificates...",
            loading: "Accessing accreditation registry...",
            noResults: "No certificates found matching your criteria.",
            empty: "No certificates issued yet",
            emptyDesc: "Once you successfully complete workshops and they are approved by experts, your certificates will appear here.",
            download: "View & Download",
            issueDate: "Issue Date",
            ref: "Official Ref",
            verified: "Certified Asset",
            premium: "Executive Accreditation"
        },
        fr: {
            title: "Registre des Accréditations Certifiées",
            subtitle: "Consultez et téléchargez vos attestations officielles enregistrées dans le protocole de développement MATC.",
            search: "Rechercher une attestation...",
            loading: "Accès au registre des accréditations...",
            noResults: "Aucune attestation trouvée selon vos critères.",
            empty: "Aucune attestation délivrée",
            emptyDesc: "Une fois vos workshops terminés et validés par nos experts, vos attestations apparaîtront ici.",
            download: "Voir & Télécharger",
            issueDate: "Date d'émission",
            ref: "Réf. Officielle",
            verified: "Asset Certifié",
            premium: "Accréditation Exécutive"
        }
    }[language as 'ar' | 'en' | 'fr'] || {
        title: "Accreditation Registry",
        subtitle: "View and download your official certificates.",
        search: "Search...",
        loading: "Loading...",
        noResults: "None found.",
        empty: "No certificates",
        emptyDesc: "Check back later.",
        download: "Download",
        issueDate: "Date",
        ref: "Ref",
        verified: "Certified",
        premium: "Executive"
    };

    const fetchAttestations = async () => {
        setIsLoading(true);
        try {
            const savedProfile = localStorage.getItem("userProfile");
            if (!savedProfile) return;
            const profile = JSON.parse(savedProfile);
            const userEmail = profile.email || profile.fullName;

            if (userEmail) {
                // Fetch readiness
                const readRes = await fetch(`/api/user/readiness?userId=${encodeURIComponent(userEmail)}`);
                const readData = await readRes.json();
                if (readData.success) {
                    setReadiness(readData);
                }

                // Fetch attestations
                const res = await fetch(`/api/user/profile?userId=${encodeURIComponent(userEmail)}`);
                const data = await res.json();
                
                if (data.success && data.profile.attestations) {
                    setAttestations(data.profile.attestations);
                }
            }
        } catch (error) {
            console.error("Failed to fetch attestations:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAttestations();
    }, []);

    const filtered = attestations.filter(a => 
        a.workshopTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.referenceId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50/50 min-h-screen">
                <div className="relative">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="w-24 h-24 rounded-full border-t-2 border-r-2 border-indigo-600 opacity-20"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Award className="w-8 h-8 text-indigo-600 animate-pulse" />
                    </div>
                </div>
                <p className="mt-6 text-slate-500 font-medium tracking-widest uppercase text-xs animate-pulse">
                    {language === 'ar' ? 'جاري التحقق من الوصول...' : 'Verifying access...'}
                </p>
            </div>
        );
    }

    const isLocked = !readiness?.certReady;

    if (isLocked) {
        return (
            <AssetLocked
                title={t.title}
                description={t.subtitle}
                readiness={readiness || { hasDiagnosis: false, hasSimulation: false }}
                isPremiumRequired={false}
            />
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50" dir={dir}>
            <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-10 pb-32">
                
                {/* Executive Header */}
                <div className={cn(
                    "flex flex-col md:flex-row justify-between items-start md:items-end gap-8",
                    isRtl && "md:flex-row-reverse"
                )}>
                    <div className={cn("space-y-4", isRtl && "text-right")}>
                        <div className={cn("flex items-center gap-3", isRtl && "flex-row-reverse")}>
                            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
                                <Award size={24} />
                            </div>
                            <span className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] flex items-center gap-2">
                                <ShieldCheck size={14} />
                                {t.premium}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none uppercase">
                            {t.title}
                        </h1>
                        <p className="text-slate-500 text-lg max-w-2xl font-medium leading-relaxed">
                            {t.subtitle}
                        </p>
                    </div>

                    {/* Elite Search */}
                    <div className="relative group w-full md:w-80">
                        <input
                            type="text"
                            placeholder={t.search}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={cn(
                                "w-full py-4 rounded-2xl bg-white border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm hover:shadow-md text-slate-900 font-bold placeholder:text-slate-400",
                                isRtl ? "pr-12 pl-4 text-right" : "pl-12 pr-4"
                            )}
                        />
                        <Search className={cn(
                            "absolute top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-hover:text-indigo-600 transition-colors",
                            isRtl ? "right-4" : "left-4"
                        )} />
                    </div>
                </div>

                <div className="h-px bg-slate-200 w-full" />

                {/* Content Area */}
                {isLoading ? (
                    <div className="py-32 text-center flex flex-col items-center justify-center">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Award className="w-6 h-6 text-indigo-600 animate-pulse" />
                            </div>
                        </div>
                        <p className="mt-8 text-slate-500 font-black uppercase tracking-[0.2em] text-xs leading-none">{t.loading}</p>
                    </div>
                ) : attestations.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto py-24 px-10 bg-white rounded-[3rem] border border-slate-200 shadow-2xl text-center space-y-8 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-[100px] -mr-32 -mt-32 opacity-50" />
                        <div className="w-24 h-24 bg-indigo-600 rounded-4xl flex items-center justify-center mx-auto shadow-2xl shadow-indigo-100 rotate-12 relative z-10 transition-transform hover:rotate-0 duration-500">
                            <Sparkles className="w-12 h-12 text-white" fill="white" />
                        </div>
                        <div className="relative z-10 space-y-4">
                            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{t.empty}</h2>
                            <p className="text-slate-500 font-bold text-lg max-w-xl mx-auto leading-relaxed">{t.emptyDesc}</p>
                        </div>
                    </motion.div>
                ) : filtered.length === 0 ? (
                    <div className="py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                        <Search size={48} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-500 font-bold">{t.noResults}</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filtered.map((attest, index) => (
                            <motion.div
                                key={attest.referenceId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-2xl hover:shadow-indigo-900/5 hover:-translate-y-2 transition-all group relative overflow-hidden"
                            >
                                <div className={cn("flex justify-between items-start mb-8", isRtl && "flex-row-reverse")}>
                                    <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg group-hover:bg-indigo-600 transition-colors duration-500">
                                        <FileText size={24} />
                                    </div>
                                    <div className={cn(
                                        "flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                                        "bg-emerald-50 text-emerald-700 border border-emerald-100",
                                        isRtl && "flex-row-reverse"
                                    )}>
                                        <ShieldCheck size={12} />
                                        {t.verified}
                                    </div>
                                </div>

                                <div className={cn("mb-8 h-20", isRtl && "text-right")}>
                                    <h3 className="text-lg font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors leading-tight line-clamp-2">
                                        {attest.workshopTitle}
                                    </h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                        MATC EXECUTIVE ACADEMY
                                    </p>
                                </div>

                                <div className={cn("grid grid-cols-2 gap-4 mb-8 pt-6 border-t border-slate-50", isRtl && "text-right")}>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.issueDate}</p>
                                        <div className={cn("flex items-center gap-2 font-bold text-slate-700 text-xs", isRtl && "flex-row-reverse")}>
                                            <Calendar size={14} className="text-indigo-600" />
                                            {new Date(attest.issueDate).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.ref}</p>
                                        <div className={cn("flex items-center gap-2 font-mono font-bold text-slate-900 text-[10px]", isRtl && "flex-row-reverse")}>
                                            <ShieldCheck size={14} className="text-indigo-600" />
                                            {attest.referenceId}
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    href={`/professional/attestations/certificate?ref=${attest.referenceId}&activeWorkshop=${encodeURIComponent(attest.workshopTitle)}&date=${new Date(attest.issueDate).getTime()}`}
                                    className="w-full flex items-center justify-center gap-3 py-4 bg-slate-100 text-slate-900 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-slate-900 hover:text-white transition-all active:scale-[0.98] shadow-sm"
                                >
                                    <Download size={16} />
                                    {t.download}
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Secure Footer */}
                <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden group">
                    <div className="absolute inset-0 bg-linear-to-br from-indigo-600/20 to-transparent pointer-events-none" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className={cn("space-y-4", isRtl && "text-right")}>
                            <h2 className="text-3xl font-black uppercase tracking-tight">Institutional Credibility</h2>
                            <p className="text-slate-400 font-medium max-w-2xl leading-relaxed">
                                Every certificate issued is cryptographically unique and registered in our central audit registry to ensure maximum professional credibility for your executive profile.
                            </p>
                        </div>
                        <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center text-indigo-400 border border-white/20 transform group-hover:rotate-12 transition-transform duration-500 shrink-0">
                            <ShieldCheck size={40} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
