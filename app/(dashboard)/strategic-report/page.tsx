"use client";

import { useState, useEffect } from "react";
import { 
    FileText, Download, Shield,  
    Target, LineChart, AlertTriangle, 
    CheckCircle2, ArrowRight, Loader2,
    Calendar, Fingerprint, Award
} from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface SCIReport {
    header: { title: string; subtitle: string; referenceId: string };
    executiveSummary: { objective: string; currentPositioning: string; riskLevel: string; priorityFocus: string; strategicRecommendation: string };
    careerDiagnosis: { industry: string; experienceLevel: string; roleScope: string; competencies: { dimension: string; score: string; interpretation: string }[]; riskIndicators: Record<string, string> };
    simulationInsights: { decisionProfile: Record<string, string>; behavioralObservations: { strengths: string[]; blindSpots: string[] } };
    humanInsights: { included: boolean; style: string; engagement: string; developmentAreas: string[] };
    positioningAnalysis: { internalGrowth: string; externalMobility: string; scenarios: { label: string; description: string }[] };
    roadmap: { 
        shortTerm: { objective: string; actions: string[]; kpis: string[] }; 
        midTerm: { objective: string; actions: string[]; kpis: string[] }; 
        longTerm: { objective: string; actions: string[]; kpis: string[] }; 
    };
    advisoryNotes: string;
    disclaimer: string;
}

export default function StrategicReportPage() {
    const { t, dir } = useLanguage();
    const [report, setReport] = useState<SCIReport | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // Access localized strings
    const sciT = t.sidebar.sciReport;

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const savedProfile = localStorage.getItem("userProfile");
                const profile = savedProfile ? JSON.parse(savedProfile) : null;
                const userId = profile?.email || profile?.fullName;

                if (!userId) return;

                const res = await fetch(`/api/user/strategic-report?userId=${encodeURIComponent(userId)}`);
                const data = await res.json();
                if (data.success && data.report) {
                    setReport(data.report);
                }
            } catch (error) {
                console.error("Failed to fetch report", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReport();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                <p className="text-slate-500 font-medium">{sciT.loading}</p>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="max-w-4xl mx-auto mt-20 p-12 text-center bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
                    <Shield className="text-slate-300 w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-4">{sciT.pendingTitle}</h2>
                <p className="text-slate-500 mb-8 max-w-md mx-auto">
                    {sciT.pendingDesc}
                </p>
            </div>
        );
    }

    return (
        <div className={`max-w-5xl mx-auto space-y-12 pb-32 ${dir === 'rtl' ? 'font-arabic' : ''}`} dir={dir}>
            {/* 0. COVER PAGE / HEADER */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 rounded-[3.5rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl border border-slate-800"
            >
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
                <div className="relative z-10 space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center border border-blue-500/20">
                            <Shield className="text-blue-400 w-8 h-8" />
                        </div>
                        <div>
                            <h4 className="text-blue-400 text-xs font-black uppercase tracking-[0.3em]">Expert Advisory Document</h4>
                            <h1 className="text-3xl md:text-5xl font-black tracking-tight mt-1">{report.header.title}</h1>
                        </div>
                    </div>

                    <p className="text-xl text-slate-400 font-medium max-w-2xl">{report.header.subtitle}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-white/10">
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Reference ID</p>
                            <p className="text-sm font-bold flex items-center gap-2"><Fingerprint size={14} className="text-blue-500" /> {report.header.referenceId}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Prepared Date</p>
                            <p className="text-sm font-bold flex items-center gap-2"><Calendar size={14} className="text-blue-500" /> {new Date().toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Status</p>
                            <p className="text-sm font-bold flex items-center gap-2 text-emerald-400"><CheckCircle2 size={14} /> Finalized</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* 1. EXECUTIVE SUMMARY */}
            <div className="grid md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-8 space-y-8">
                    <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100">
                                <FileText className="text-indigo-600 w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Executive Summary</h3>
                        </div>
                        <div className="space-y-8">
                            <div className="p-8 bg-slate-50 rounded-4xl border border-slate-200 leading-relaxed font-medium italic text-slate-700">
                                &quot;{report.executiveSummary.strategicRecommendation}&quot;
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Risk Level</p>
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                        report.executiveSummary.riskLevel === 'Low' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                                        report.executiveSummary.riskLevel === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                                        'bg-red-50 text-red-700 border-red-100'
                                    }`}>
                                        {report.executiveSummary.riskLevel}
                                    </span>
                                </div>
                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Priority Focus</p>
                                    <p className="text-sm font-bold text-slate-900">{report.executiveSummary.priorityFocus}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 2. CAREER DIAGNOSIS */}
                    <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
                                <Award className="text-blue-600 w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Professional Audit</h3>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6 mb-12">
                            {report.careerDiagnosis.competencies.map((comp, i: number) => (
                                <div key={i} className="p-6 bg-slate-50 rounded-4xl border border-slate-100 border-t-4 border-t-blue-500">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{comp.dimension}</p>
                                    <p className="text-3xl font-black text-slate-900 mb-2">{comp.score}</p>
                                    <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase">{comp.interpretation}</p>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <AlertTriangle size={12} className="text-amber-500" />
                                Strategic Risk Indicators
                            </p>
                            <div className="grid md:grid-cols-3 gap-4">
                                {Object.entries(report.careerDiagnosis.riskIndicators).map(([key, val]) => (
                                    <div key={key} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <span className="text-xs font-bold text-slate-500 uppercase">{key}</span>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                                            val === 'Low' ? 'text-emerald-600' : val === 'Moderate' ? 'text-amber-600' : 'text-red-600'
                                        }`}>{val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* 3. SIMULATION INSIGHTS */}
                    <section className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden border border-slate-800">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                                    <Target className="text-blue-400 w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-black tracking-tight">Behavioral Simulation Records</h3>
                            </div>
                            <div className="grid md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                                        <CheckCircle2 size={14} /> Verified Decision Strengths
                                    </h4>
                                    <ul className="space-y-4">
                                        {report.simulationInsights.behavioralObservations.strengths.map((s: string, i: number) => (
                                            <li key={i} className="flex gap-4 items-start p-4 bg-white/5 rounded-3xl border border-white/5 text-sm font-medium text-slate-300">
                                                <span className="text-blue-500 font-black">0{i+1}</span>
                                                {s}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="space-y-6">
                                    <h4 className="text-[10px] font-black text-rose-400 uppercase tracking-widest flex items-center gap-2">
                                        <AlertTriangle size={14} /> Strategic blind spots
                                    </h4>
                                    <ul className="space-y-4">
                                        {report.simulationInsights.behavioralObservations.blindSpots.map((s: string, i: number) => (
                                            <li key={i} className="flex gap-4 items-start p-4 bg-white/5 rounded-3xl border border-white/5 text-sm font-medium text-slate-300">
                                                <span className="text-rose-500 font-black">0{i+1}</span>
                                                {s}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* SIDEBAR DASHBOARD */}
                <div className="md:col-span-4 space-y-8 md:sticky md:top-8">
                     {/* DOWNLOAD ACTION */}
                    <div className="bg-blue-600 p-8 rounded-[3rem] text-white shadow-xl shadow-blue-200 relative overflow-hidden group hover:shadow-2xl transition-all cursor-pointer" onClick={() => window.print()}>
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
                            <Download size={120} />
                        </div>
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20 group-hover:bg-white group-hover:text-blue-600 transition-colors">
                                <Download size={28} />
                            </div>
                            <h4 className="text-xl font-black tracking-tight mb-2">{sciT.export}</h4>
                            <p className="text-blue-100 text-xs font-medium">{sciT.exportDesc}</p>
                        </div>
                    </div>

                    {/* ROADMAP PREVIEW */}
                    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                         <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center border border-orange-100">
                                <LineChart className="text-orange-600 w-5 h-5" />
                            </div>
                            <h4 className="font-black text-slate-900 tracking-tight">Next Phase Focus</h4>
                        </div>
                        <div className="space-y-6">
                            <div className="p-6 bg-orange-50 rounded-4xl border border-orange-100">
                                <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-2">3-Month Objective</p>
                                <p className="text-sm font-black text-orange-950 leading-tight">{report.roadmap.shortTerm.objective}</p>
                            </div>
                            <div className="space-y-3">
                                {report.roadmap.shortTerm.actions.slice(0, 2).map((action: string, i: number) => (
                                    <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <ArrowRight size={14} className="text-blue-500 mt-0.5" />
                                        <span className="text-xs font-bold text-slate-600 leading-relaxed">{action}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Advisory Disclaimer</p>
                         <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                             {report.disclaimer}
                         </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
