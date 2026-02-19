"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
    FileText, Download, Shield,  
    Target, LineChart, 
    CheckCircle2, ArrowRight, Loader2,
    Calendar, Fingerprint, Award, Zap, Clock, PlayCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useSearchParams } from "next/navigation";

interface SCIReport {
    header: { title: string; subtitle: string; referenceId: string };
    executiveSummary: { strategicRecommendation: string; overallAssessment: string };
    roadmap: { shortTerm: { objective: string; actions: string[] } };
    disclaimer: string;
}

interface DiagnosisData {
    selectedRole?: { title: string; category: string; matchPercentage: number };
    cvAnalysis?: { strengths: string[]; overview: string };
    completionStatus: {
        cvAnalysisComplete: boolean;
        roleDiscoveryComplete: boolean;
        interviewComplete: boolean;
        simulationComplete: boolean;
    };
    interviewEvaluation?: { summary: string };
    simulationConversation?: Array<Record<string, unknown>>;
    simulationResults?: Array<Record<string, unknown>>;
    simulationReport?: Record<string, unknown>;
    updatedAt: string;
}

export default function StrategicReportPage() {
    const { t, dir } = useLanguage();
    const searchParams = useSearchParams();
    const [report, setReport] = useState<SCIReport | null>(null);
    const [diagnosis, setDiagnosis] = useState<DiagnosisData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'report' | 'history'>('report');
    
    // Access localized strings
    const sciT = t.sidebar.sciReport;

    // Set initial tab from query param if available
    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab === 'history') {
            setActiveTab('history');
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
                const userId = profile.email || profile.fullName;

                if (userId) {
                    const res = await fetch(`/api/user/progress?userId=${encodeURIComponent(userId)}`);
                    const response = await res.json();
                    
                    if (response.hasData && response.data) {
                        setDiagnosis(response.data);
                        
                        // Use actual report data if available, or fallback to mock
                        if (response.data.generatedDocuments?.scientificReport) {
                            setReport(response.data.generatedDocuments.scientificReport);
                        } else {
                            // Professional Mock for Demo/Fallback
                            setReport({
                                header: {
                                    title: dir === 'rtl' ? 'التقرير الاستراتيجي للقيادة' : 'Strategic Leadership Assessment',
                                    subtitle: dir === 'rtl' ? 'تحليل شامل للجدارة والملاءمة المهنية' : 'Comprehensive Merit & Professional Alignment Analysis',
                                    referenceId: `SCI-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
                                },
                                executiveSummary: {
                                    strategicRecommendation: dir === 'rtl' 
                                        ? 'بناءً على التقييم، يُوصى بالتركيز على تطوير المهارات القيادية الإستراتيجية لتعزيز الفعالية التنظيمية.'
                                        : 'Based on the assessment, it is recommended to focus on developing strategic leadership skills to enhance organizational effectiveness.',
                                    overallAssessment: dir === 'rtl'
                                        ? 'يُظهر المرشح إمكانات قوية في التحليل، مع فرص للتحسين في إدارة الفرق المعقدة.'
                                        : 'The candidate shows strong potential in analysis, with opportunities for improvement in managing complex teams.'
                                },
                                roadmap: {
                                    shortTerm: {
                                        objective: dir === 'rtl' ? 'تعزيز الرؤية الاستراتيجية' : 'Enhance Strategic Vision',
                                        actions: dir === 'rtl' 
                                            ? ['حضور ورش عمل القيادة العليا', 'المشاركة في مشاريع التخطيط لعام 2026']
                                            : ['Attend senior leadership workshops', 'Participate in 2026 planning projects']
                                    }
                                },
                                disclaimer: dir === 'rtl'
                                    ? 'هذا التقرير مخصص لإرشاد التطوير المهني فقط ولا يحل محل التقييمات النفسية أو الفنية الرسمية.'
                                    : 'This report is intended for professional development guidance only and does not replace formal psychological or technical assessments.'
                            });
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to fetch report data", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReportData();
    }, [dir]);

    const journeyStages = [
        { 
            id: 'cv', 
            title: dir === 'rtl' ? 'تدقيق السيرة الذاتية' : 'CV Audit', 
            complete: diagnosis?.completionStatus.cvAnalysisComplete,
            data: diagnosis?.cvAnalysis,
            icon: FileText,
            color: 'blue' as const,
            href: '/assessment/cv-upload'
        },
        { 
            id: 'interview', 
            title: dir === 'rtl' ? 'المقابلة الاستراتيجية' : 'Strategic Interview', 
            complete: diagnosis?.completionStatus.interviewComplete,
            data: diagnosis?.interviewEvaluation,
            icon: Target,
            color: 'purple' as const,
            href: '/assessment/interview'
        },
        { 
            id: 'role', 
            title: dir === 'rtl' ? 'مواءمة الرأي المهني' : 'Role Alignment', 
            complete: diagnosis?.completionStatus.roleDiscoveryComplete,
            data: diagnosis?.selectedRole,
            icon: Award,
            color: 'emerald' as const,
            href: '/assessment/role-discovery'
        },
        { 
            id: 'simulation', 
            title: dir === 'rtl' ? 'محاكاة القيادة' : 'Leadership Simulation', 
            complete: diagnosis?.completionStatus.simulationComplete,
            data: diagnosis?.simulationResults,
            icon: Zap,
            color: 'amber' as const,
            href: '/assessment/simulation'
        }
    ];

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
                    <p className="text-slate-500 font-bold animate-pulse">
                        {dir === 'rtl' ? 'جاري إعداد التقرير الاستراتيجي...' : 'Generating Strategic Report...'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`max-w-5xl mx-auto space-y-8 pb-32 ${dir === 'rtl' ? 'font-arabic' : ''}`} dir={dir}>
            {/* Tabs Navigation */}
            <div className="flex p-1 bg-slate-100 rounded-2xl w-fit mx-auto mb-8 border border-slate-200 shadow-sm relative z-20">
                {report && (
                    <button
                        onClick={() => setActiveTab('report')}
                        className={`px-8 py-3 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${
                            activeTab === 'report' 
                            ? 'bg-white text-slate-900 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <FileText size={16} />
                        {dir === 'rtl' ? 'التقرير العلمي' : 'Scientific Report'}
                    </button>
                )}
                <button
                    onClick={() => setActiveTab('history')}
                    className={`px-8 py-3 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${
                        activeTab === 'history' 
                        ? 'bg-white text-slate-900 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <Clock size={16} />
                    {dir === 'rtl' ? 'سجل بروتوكول التشخيص' : 'Diagnostic History'}
                </button>
            </div>

            {activeTab === 'report' && report ? (
                <>
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

            {/* 1. EXECUTIVE SUMMARY & SIDEBAR */}
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
                            <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed">
                                {report.executiveSummary.overallAssessment}
                            </div>
                        </div>
                    </section>

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
                </div>

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

                    <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Advisory Disclaimer</p>
                         <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                             {report.disclaimer}
                         </p>
                    </div>
                </div>
            </div>
            </>
            ) : (
                /* JOURNEY HISTORY VIEW */
                <div className="space-y-12">
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center space-y-4"
                    >
                        <h2 className="text-4xl font-black text-slate-900">
                            {dir === 'rtl' ? 'سجل الأنشطة والمقابلات' : 'Activity & Interview History'}
                        </h2>
                        <p className="text-slate-500 max-w-2xl mx-auto font-medium">
                            {dir === 'rtl' 
                                ? 'استعراض كافة المقابلات، التقييمات، والمحاكات التي تمت خلال رحلتك التشخيصية.'
                                : 'A detailed log of all interviews, assessments, and simulations conducted during your diagnostic protocol.'}
                        </p>
                        <div className="pt-4">
                            <Link 
                                href="/assessment/cv-upload?view=history"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                            >
                                <PlayCircle size={18} className="text-blue-400" />
                                {dir === 'rtl' ? 'مراجعة السجل التشخيصي الكامل' : 'Review Full Diagnostic Record'}
                            </Link>
                        </div>
                    </motion.div>

                    <div className="relative">
                        {/* Vertical line for the timeline */}
                        <div className={`absolute top-0 bottom-0 w-1 bg-slate-100 hidden md:block ${dir === 'rtl' ? 'right-1/2 -mr-0.5' : 'left-1/2 -ml-0.5'}`} />

                        <div className="space-y-16 relative z-10">
                            {journeyStages.map((stage, idx) => (
                                <motion.div 
                                    key={stage.id}
                                    initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className={`flex flex-col md:flex-row items-center gap-8 ${
                                        idx % 2 !== 0 && dir !== 'rtl' ? 'md:flex-row-reverse' : ''
                                    } ${idx % 2 === 0 && dir === 'rtl' ? 'md:flex-row-reverse' : ''}`}
                                >
                                    {/* Content side */}
                                    <div className="flex-1 w-full">
                                        <div className={`bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl transition-all ${
                                            dir === 'rtl' ? 'text-right' : 'text-left'
                                        }`}>
                                            <div className={`flex items-center gap-4 mb-6 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                                                    stage.color === 'blue' ? 'bg-blue-50 border-blue-100' :
                                                    stage.color === 'purple' ? 'bg-purple-50 border-purple-100' :
                                                    stage.color === 'emerald' ? 'bg-emerald-50 border-emerald-100' :
                                                    'bg-amber-50 border-amber-100'
                                                }`}>
                                                    <stage.icon className={`w-6 h-6 ${
                                                        stage.complete 
                                                        ? (stage.color === 'blue' ? 'text-blue-600' : stage.color === 'purple' ? 'text-purple-600' : stage.color === 'emerald' ? 'text-emerald-600' : 'text-amber-600')
                                                        : 'text-slate-300'
                                                    }`} />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black text-slate-900">{stage.title}</h3>
                                                    <div className={`flex items-center gap-2 mt-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                                        <span className={`w-2 h-2 rounded-full ${stage.complete ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                            {stage.complete ? (dir === 'rtl' ? 'مكتمل' : 'Completed') : (dir === 'rtl' ? 'قيد الانتظار' : 'Pending')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {stage.complete ? (
                                                <div className="space-y-4">
                                                    {stage.id === 'cv' && (
                                                        <div className="space-y-3">
                                                            <div className="flex flex-wrap gap-2">
                                                                {(stage.data as DiagnosisData['cvAnalysis'])?.strengths?.slice(0, 3).map((s: string, i: number) => (
                                                                    <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full border border-blue-100">{s}</span>
                                                                ))}
                                                            </div>
                                                            <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">{(stage.data as DiagnosisData['cvAnalysis'])?.overview}</p>
                                                        </div>
                                                    )}
                                                    {stage.id === 'interview' && (
                                                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                            <span className="text-xs font-bold text-slate-500">{dir === 'rtl' ? 'إجمالي الرسائل' : 'Total Messages'}</span>
                                                            <span className="text-sm font-black text-slate-900">{(stage.data as unknown[])?.length || 0}</span>
                                                        </div>
                                                    )}
                                                    {stage.id === 'role' && stage.data && (
                                                        <div className="flex items-center gap-4">
                                                            <div className="p-4 bg-blue-600 rounded-2xl text-white font-black text-sm">
                                                                {(stage.data as DiagnosisData['selectedRole'])?.matchPercentage}%
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-900">{(stage.data as DiagnosisData['selectedRole'])?.title}</p>
                                                                <p className="text-[10px] text-slate-500 font-medium">{(stage.data as DiagnosisData['selectedRole'])?.category}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {stage.id === 'simulation' && (
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                                                                <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">{dir === 'rtl' ? 'التوجيه' : 'Guidance'}</p>
                                                                <p className="text-sm font-black text-emerald-950">Active</p>
                                                            </div>
                                                            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                                                                <p className="text-[10px] font-black text-blue-600 uppercase mb-1">{dir === 'rtl' ? 'السيناريوهات' : 'Scenarios'}</p>
                                                                <p className="text-sm font-black text-blue-950">{(stage.data as DiagnosisData['simulationResults'])?.length || 0}</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <Link 
                                                        href={`${stage.href}?view=history`}
                                                        className={`mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-all border ${
                                                            stage.color === 'blue' ? 'border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100' :
                                                            stage.color === 'purple' ? 'border-purple-100 bg-purple-50 text-purple-700 hover:bg-purple-100' :
                                                            stage.color === 'emerald' ? 'border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100' :
                                                            'border-amber-100 bg-amber-50 text-amber-700 hover:bg-amber-100'
                                                        }`}
                                                    >
                                                        {dir === 'rtl' ? 'عرض التفاصيل والمراجعة' : 'View Details & Review History'}
                                                        <ArrowRight size={14} className={dir === 'rtl' ? 'rotate-180' : ''} />
                                                    </Link>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-slate-400 font-medium italic">
                                                    {dir === 'rtl' ? 'هذه المرحلة لم يتم إكمالها بعد ضمن البروتوكول الحالي.' : 'This stage has not been completed yet in the current protocol.'}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Icon in the middle */}
                                    <div className="relative z-20 w-16 h-16 bg-white rounded-full border-4 border-slate-100 shadow-lg flex items-center justify-center shrink-0 overflow-hidden group">
                                         <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                                            stage.color === 'blue' ? 'bg-blue-600' :
                                            stage.color === 'purple' ? 'bg-purple-600' :
                                            stage.color === 'emerald' ? 'bg-emerald-600' :
                                            'bg-amber-600'
                                         }`} />
                                         <stage.icon className={`w-6 h-6 transition-colors relative z-10 ${
                                            stage.complete 
                                            ? 'text-white' // Always white on hover/complete background
                                            : 'text-slate-300'
                                         } group-hover:text-white`} />
                                         {!stage.complete && (
                                            <stage.icon className={`w-6 h-6 absolute transition-colors z-10 text-slate-300 group-hover:text-white`} />
                                         )}
                                    </div>

                                    {/* Empty side */}
                                    <div className="flex-1 hidden md:block" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
