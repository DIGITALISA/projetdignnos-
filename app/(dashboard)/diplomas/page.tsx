"use client";

import { motion } from "framer-motion";
import { Award, Calendar, ChevronRight, FileText, Sparkles, Building2, Download } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Attestation {
    _id: string;
    workshopTitle: string;
    issueDate: string;
    referenceId: string;
    instructor?: string;
}

function DiplomasContent() {
    const [attestations, setAttestations] = useState<Attestation[]>([]);
    const [userName, setUserName] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const searchParams = useSearchParams();
    const userId = searchParams.get("userId");

    useEffect(() => {
        const fetchDiplomas = async () => {
            try {
                // If viewing as admin for a specific user
                const targetId = userId || "";
                let profile;
                
                if (targetId) {
                    const res = await fetch(`/api/user/profile?userId=${targetId}`, { cache: 'no-store' });
                    const data = await res.json();
                    if (data.success) {
                        profile = data.profile;
                    }
                } else {
                    const saved = localStorage.getItem("userProfile");
                    if (saved) {
                        const parsed = JSON.parse(saved);
                        const identifier = parsed.email || parsed.fullName;
                        const res = await fetch(`/api/user/profile?userId=${encodeURIComponent(identifier)}`, { cache: 'no-store' });
                        const data = await res.json();
                        if (data.success) {
                            profile = data.profile;
                        }
                    }
                }

                if (profile) {
                    setAttestations(profile.attestations || []);
                    setUserName(profile.fullName);
                }
            } catch (err) {
                console.error("Failed to fetch diplomas", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDiplomas();
    }, [userId]);

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            <div className="max-w-6xl mx-auto px-4 pt-12 space-y-10">
                {/* Header Section */}
                <div className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white shadow-2xl">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/30">
                                <Award size={12} />
                                Workshop Recognition
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight italic">
                                Workshop <span className="text-blue-400">Attestation</span>
                            </h1>
                            <p className="text-slate-400 font-medium max-w-xl text-lg">
                                {userName}, discover and manage your validated workshop attestations. These documents certify your commitment to elite executive performance.
                            </p>
                        </div>
                        <div className="hidden lg:block">
                            <div className="w-32 h-32 bg-white/5 rounded-3xl backdrop-blur-3xl border border-white/10 flex items-center justify-center rotate-6">
                                <Building2 size={64} className="text-white/20" />
                            </div>
                        </div>
                    </div>
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* List Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between px-4">
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                <FileText size={20} className="text-blue-600" />
                                Validated Certificates
                            </h2>
                            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{attestations.length} Issued</span>
                        </div>

                        <div className="space-y-4">
                            {isLoading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <div key={i} className="h-24 bg-slate-200 animate-pulse rounded-3xl" />
                                ))
                            ) : attestations.length === 0 ? (
                                <div className="bg-white rounded-4xl p-20 text-center border border-dashed border-slate-200">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Award size={40} className="text-slate-200" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-400">No Certificates Found</h3>
                                    <p className="text-slate-400 text-sm mt-2 font-medium">Your awards will appearing here once issued by our strategic experts.</p>
                                </div>
                            ) : (
                                attestations.map((att, index) => (
                                    <motion.div
                                        key={att._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="group relative bg-white rounded-4xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all cursor-pointer overflow-hidden"
                                    >
                                        <div className="flex items-center justify-between relative z-10">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                                    <Award size={32} />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                                                        {att.workshopTitle}
                                                    </h3>
                                                    <div className="flex items-center gap-4 mt-1 text-slate-400 font-bold text-xs uppercase tracking-widest">
                                                        <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(att.issueDate).toLocaleDateString('fr-FR')}</span>
                                                        <span className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 rounded italic text-[10px]">Ref: {att.referenceId}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Link 
                                                href={`/workshop-attestation?userId=${userId || ''}&activeWorkshop=${encodeURIComponent(att.workshopTitle)}&ref=${att.referenceId}&date=${new Date(att.issueDate).getTime()}`}
                                                className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all"
                                            >
                                                <ChevronRight size={24} />
                                            </Link>
                                        </div>
                                        {/* Background Decor */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full translate-x-16 -translate-y-16 group-hover:bg-blue-50 transition-colors" />
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Sidebar / Info */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-4xl p-8 border border-slate-100 shadow-sm space-y-8">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Credential Authority</h3>
                            <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                                    <Building2 size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-900">MA-TRAINING-CONSULTING</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase italic">Conseil Stratégique</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                        <Sparkles size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-slate-900 uppercase">Tamper Proof</h4>
                                        <p className="text-xs text-slate-500 mt-1 font-medium">Each document carries a unique reference ID linked to our internal audit system.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                                        <Download size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-slate-900 uppercase">Instant Export</h4>
                                        <p className="text-xs text-slate-500 mt-1 font-medium">Download high-definition PDF certificates ready for professional display or social sharing.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link href="/training" className="block p-8 bg-blue-600 rounded-4xl text-white hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 group">
                            <h3 className="text-lg font-black uppercase tracking-tight italic">Enroll in more Workshops</h3>
                            <p className="text-blue-200/80 text-xs font-bold mt-2 uppercase tracking-widest">Grow your strategic collection <ChevronRight size={14} className="inline group-hover:translate-x-1 transition-transform" /></p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function DiplomasPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DiplomasContent />
        </Suspense>
    );
}
