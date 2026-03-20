"use client";

import { useState, useEffect } from "react";
import { 
    Briefcase, User, Loader2, Download, 
    CheckCircle2, LineChart, FileText, Target, 
    Award, Zap, Clock
} from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useSearchParams } from "next/navigation";
import { TrialGate } from "@/components/ui/TrialGate";

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

export default function ProfessionalStrategicReportPage() {
    const { dir, language } = useLanguage();
    const searchParams = useSearchParams();
    const [report, setReport] = useState<SCIReport | null>(null);
    const [diagnosis, setDiagnosis] = useState<DiagnosisData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'history' | 'professional'>('professional');
    const [userName, setUserName] = useState<string>("");



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
                setUserName(profile.fullName || "");

                if (userId) {
                    const res = await fetch(`/api/user/progress?userId=${encodeURIComponent(userId)}`);
                    const response = await res.json();
                    
                    if (response.hasData && response.data) {
                        setDiagnosis(response.data);
                        
                        if (response.data.generatedDocuments?.scientificReport) {
                            setReport(response.data.generatedDocuments.scientificReport);
                        } else {
                            setReport({
                                header: {
                                    title: dir === 'rtl' ? 'التقرير الاستراتيجي للقيادة (SCI)' : 'Strategic Leadership Intelligence (SCI)',
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
            href: '/professional'
        },
        { 
            id: 'interview', 
            title: dir === 'rtl' ? 'المقابلة الاستراتيجية' : 'Strategic Interview', 
            complete: diagnosis?.completionStatus.interviewComplete,
            data: diagnosis?.interviewEvaluation,
            icon: Target,
            color: 'purple' as const,
            href: '/professional'
        },
        { 
            id: 'role', 
            title: dir === 'rtl' ? 'مواءمة الرأي المهني' : 'Role Alignment', 
            complete: diagnosis?.completionStatus.roleDiscoveryComplete,
            data: diagnosis?.selectedRole,
            icon: Award,
            color: 'emerald' as const,
            href: '/professional'
        },
        { 
            id: 'simulation', 
            title: dir === 'rtl' ? 'محاكاة القيادة' : 'Leadership Simulation', 
            complete: diagnosis?.completionStatus.simulationComplete,
            data: diagnosis?.simulationResults,
            icon: Zap,
            color: 'amber' as const,
            href: '/professional'
        }
    ];

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
                    <p className="text-slate-500 font-bold animate-pulse">
                        {language === 'ar' ? 'جاري إنشاء تقرير الذكاء الاستراتيجي...' : 'Generating Strategic Report...'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <TrialGate 
            module="strategic-report"
            dir={dir}
            language={language}
        >
            <div className={`max-w-5xl mx-auto space-y-8 pb-32 ${dir === 'rtl' ? 'font-arabic' : ''}`} dir={dir}>
                {/* Tabs Navigation */}
                <div className="flex p-1 bg-slate-100 rounded-2xl w-fit mx-auto mb-8 border border-slate-200 shadow-sm relative z-20">
                    <button
                        onClick={() => setActiveTab('professional')}
                        className={`px-6 py-3 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${
                            activeTab === 'professional' 
                            ? 'bg-white text-slate-900 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <Briefcase size={16} />
                        {language === 'ar' ? 'تقرير SCI' : 'SCI Report'}
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-6 py-3 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${
                            activeTab === 'history' 
                            ? 'bg-white text-slate-900 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <Clock size={16} />
                        {language === 'ar' ? 'التسلسل الزمني' : 'Timeline'}
                    </button>
                </div>

                {activeTab === 'professional' ? (
                    <div id="professional-report" className="space-y-0 print:space-y-0">
                        <div className="flex justify-end mb-6 print:hidden">
                            <div
                                title={dir === 'rtl' ? 'التصدير متاح للمشتركين فقط' : 'Export available for paid plans only'}
                                className="flex items-center gap-3 px-8 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black text-sm cursor-not-allowed select-none border border-slate-200"
                            >
                                <Download size={18} />
                                {language === 'ar' ? 'تصدير التقرير' : 'Export Report'}
                                <span className="text-[9px] bg-amber-100 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">
                                    {dir === 'rtl' ? 'برو' : 'PRO'}
                                </span>
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 print:shadow-none print:border-none"
                        >
                            <div className="relative bg-linear-to-r from-slate-900 via-blue-950 to-slate-900 px-14 py-12 text-white overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
                                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />

                                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl font-black shadow-xl border-2 border-white/20">
                                            {userName ? userName.charAt(0).toUpperCase() : <User size={36} />}
                                        </div>
                                        <div>
                                            <p className="text-blue-300 text-xs font-black uppercase tracking-[0.3em] mb-1">
                                                INTELLIGENCE STRATÉGIQUE (SCI)
                                            </p>
                                            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                                                {userName || (language === 'ar' ? 'المشارك' : 'Participant')}
                                            </h1>
                                            {diagnosis?.selectedRole && (
                                                <p className="text-blue-300 font-bold mt-1 text-lg">
                                                    {diagnosis.selectedRole.title}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="shrink-0 flex flex-col items-end gap-3">
                                        <div className="border-2 border-blue-400/40 rounded-xl px-6 py-3 text-right">
                                            <p className="text-xs font-black text-blue-300 uppercase tracking-widest">Sté MA Training Consulting</p>
                                            <p className="text-xs text-slate-400">MF: 1805031P/A/M/000</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                                            <CheckCircle2 size={14} />
                                            <span>CERTIFIÉ SCI</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-10 md:p-14 space-y-10">
                                <section>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                                            <User size={18} className="text-blue-600" />
                                        </div>
                                        <h2 className="text-xl font-black text-slate-900">
                                            {language === 'ar' ? 'الملف المهني' : 'Professional Profile'}
                                        </h2>
                                        <div className="flex-1 h-px bg-slate-100" />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">{language === 'ar' ? 'ملخص تنفيذي' : 'Executive Summary'}</p>
                                            <p className="text-sm text-slate-700 font-medium leading-relaxed">
                                                {report?.executiveSummary?.overallAssessment || 
                                                 diagnosis?.cvAnalysis?.overview || 
                                                 (language === 'ar' ? 'جاري تحليل البيانات...' : 'Data analysis in progress...')}
                                            </p>
                                        </div>
                                        <div className="space-y-4">
                                            {diagnosis?.selectedRole && (
                                                <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                                                    <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-2">{language === 'ar' ? 'المركز المستهدف' : 'Target Role'}</p>
                                                    <p className="text-lg font-black text-slate-900">{diagnosis.selectedRole.title}</p>
                                                    <div className="mt-3 flex items-center gap-2">
                                                        <div className="flex-1 h-2 bg-blue-100 rounded-full overflow-hidden">
                                                            <div className="h-full bg-linear-to-r from-blue-500 to-indigo-600 rounded-full" style={{ width: `${diagnosis.selectedRole.matchPercentage}%` }} />
                                                        </div>
                                                        <span className="text-sm font-black text-blue-700">{diagnosis.selectedRole.matchPercentage}%</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-100">
                                            <Award size={18} className="text-amber-600" />
                                        </div>
                                        <h2 className="text-xl font-black text-slate-900">
                                            {language === 'ar' ? 'التوصية الاستراتيجية' : 'Strategic Recommendation'}
                                        </h2>
                                        <div className="flex-1 h-px bg-slate-100" />
                                    </div>
                                    <div className="relative bg-linear-to-br from-slate-900 to-blue-950 rounded-2xl p-8 text-white overflow-hidden">
                                        <p className="text-base font-medium leading-relaxed italic text-slate-200">
                                            &ldquo;{report?.executiveSummary?.strategicRecommendation}&rdquo;
                                        </p>
                                    </div>
                                </section>

                                <section>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100">
                                            <LineChart size={18} className="text-indigo-600" />
                                        </div>
                                        <h2 className="text-xl font-black text-slate-900">
                                            {language === 'ar' ? 'خارطة الطريق' : 'Strategic Roadmap'}
                                        </h2>
                                        <div className="flex-1 h-px bg-slate-100" />
                                    </div>
                                    <div className="space-y-3">
                                        {report?.roadmap?.shortTerm?.actions.map((action, i) => (
                                            <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                                                <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-[10px] font-black text-indigo-700 shrink-0 mt-0.5">{i + 1}</div>
                                                <span className="text-sm font-medium text-slate-700 leading-relaxed">{action}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        </motion.div>
                    </div>
                ) : (
                    <div className="space-y-12">
                        <div className="relative">
                            <div className={`absolute top-0 bottom-0 w-1 bg-slate-100 hidden md:block ${dir === 'rtl' ? 'right-1/2 -mr-0.5' : 'left-1/2 -ml-0.5'}`} />
                            <div className="space-y-16 relative z-10">
                                {journeyStages.map((stage, idx) => (
                                    <motion.div 
                                        key={stage.id}
                                        initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        className={`flex flex-col md:flex-row items-center gap-8 ${
                                            idx % 2 !== 0 && dir !== 'rtl' ? 'md:flex-row-reverse' : ''
                                        } ${idx % 2 === 0 && dir === 'rtl' ? 'md:flex-row-reverse' : ''}`}
                                    >
                                        <div className="flex-1 w-full">
                                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
                                                <h3 className="text-xl font-black text-slate-900">{stage.title}</h3>
                                                <p className="text-sm text-slate-500 mt-2">
                                                    {stage.complete ? (language === 'ar' ? 'تم الإكمال' : 'Completed') : (language === 'ar' ? 'قيد الانتظار' : 'Pending')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="w-16 h-16 bg-white rounded-full border-4 border-slate-100 shadow-lg flex items-center justify-center shrink-0">
                                            <stage.icon className={stage.complete ? 'text-blue-600' : 'text-slate-300'} />
                                        </div>
                                        <div className="flex-1 hidden md:block" />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </TrialGate>
    );
}
