"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
    Briefcase, Star, TrendingUp, User, BookOpen, Medal,
    Clock, Loader2, Download, CheckCircle2, LineChart, PlayCircle, ArrowRight,
    FileText, Target, Award, Zap, Calendar, Fingerprint
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

export default function StrategicReportPage() {
    const { dir, language, t } = useLanguage();
    const searchParams = useSearchParams();
    const [report, setReport] = useState<SCIReport | null>(null);
    const [diagnosis, setDiagnosis] = useState<DiagnosisData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'history' | 'professional'>('professional');
    const [userName, setUserName] = useState<string>("");

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
                setUserName(profile.fullName || "");

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
                        {t.strategicReport.loading || 'Generating Strategic Report...'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <TrialGate 
            module="strategic-report" 
            moduleHref="/strategic-report"
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
                        {t.strategicReport.title}
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
                        {t.strategicReport.history}
                    </button>
                </div>

                {activeTab === 'professional' ? (
                    /* ── PROFESSIONAL REPORT TAB ── */
                    <div id="professional-report" className="space-y-0 print:space-y-0">
                        {/* Print Button */}
                        <div className="flex justify-end mb-6 print:hidden">
                            <button
                                onClick={() => window.print()}
                                className="flex items-center gap-3 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-slate-900/20"
                            >
                                <Download size={18} />
                                {t.strategicReport.export}
                            </button>
                        </div>

                        {/* ── PROFESSIONAL REPORT CARD ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 print:shadow-none print:border-none"
                        >
                            {/* Header Strip */}
                            <div className="relative bg-linear-to-r from-slate-900 via-blue-950 to-slate-900 px-14 py-12 text-white overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
                                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />

                                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                                    <div className="flex items-center gap-6">
                                        {/* Avatar */}
                                        <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl font-black shadow-xl border-2 border-white/20">
                                            {userName ? userName.charAt(0).toUpperCase() : <User size={36} />}
                                        </div>
                                        <div>
                                            <p className="text-blue-300 text-xs font-black uppercase tracking-[0.3em] mb-1">
                                                {t.strategicReport.mainTitle}
                                            </p>
                                            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                                                {userName || t.strategicReport.participant}
                                            </h1>
                                            {diagnosis?.selectedRole && (
                                                <p className="text-blue-300 font-bold mt-1 text-lg">
                                                    {diagnosis.selectedRole.title}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Org Stamp */}
                                    <div className="shrink-0 flex flex-col items-end gap-3">
                                        <div className="border-2 border-blue-400/40 rounded-xl px-6 py-3 text-right">
                                            <p className="text-xs font-black text-blue-300 uppercase tracking-widest">Sté MA Training Consulting</p>
                                            <p className="text-xs text-slate-400">MF: 1805031P/A/M/000</p>
                                            <p className="text-xs text-slate-400">Tél: 44 172 264</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                                            <CheckCircle2 size={14} />
                                            <span>{t.strategicReport.certified}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Meta strip */}
                                <div className="relative z-10 mt-10 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {[
                                        { label: t.strategicReport.reference, value: `MAT-${new Date().getFullYear()}-${Math.random().toString(36).substr(2,6).toUpperCase()}`, icon: Fingerprint },
                                        { label: t.strategicReport.date, value: new Date().toLocaleDateString('fr-FR'), icon: Calendar },
                                        { label: t.strategicReport.status, value: diagnosis?.completionStatus?.interviewComplete ? t.strategicReport.completed : t.strategicReport.inProgress, icon: CheckCircle2 },
                                        { label: t.strategicReport.alignment, value: diagnosis?.selectedRole ? `${diagnosis.selectedRole.matchPercentage}%` : 'N/A', icon: Target },
                                    ].map((item, i) => (
                                        <div key={i}>
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{item.label}</p>
                                            <p className="text-sm font-bold flex items-center gap-1.5"><item.icon size={12} className="text-blue-400" /> {item.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-10 md:p-14 space-y-10">

                                {/* ── SECTION 1: Professional Profile ── */}
                                <section>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                                            <User size={18} className="text-blue-600" />
                                        </div>
                                        <h2 className="text-xl font-black text-slate-900">
                                            {t.strategicReport.sections.profile}
                                        </h2>
                                        <div className="flex-1 h-px bg-slate-100" />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">{t.strategicReport.sections.summary}</p>
                                            <p className="text-sm text-slate-700 font-medium leading-relaxed">
                                                {report?.executiveSummary?.overallAssessment || 
                                                 diagnosis?.cvAnalysis?.overview || 
                                                 t.strategicReport.sections.summaryPlaceholder}
                                            </p>
                                        </div>
                                        <div className="space-y-4">
                                            {diagnosis?.selectedRole && (
                                                <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                                                    <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-2">{t.strategicReport.sections.targetRole}</p>
                                                    <p className="text-lg font-black text-slate-900">{diagnosis.selectedRole.title}</p>
                                                    <p className="text-xs text-slate-500 mt-1">{diagnosis.selectedRole.category}</p>
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

                                {/* ── SECTION 2: Key Competencies ── */}
                                {diagnosis?.cvAnalysis?.strengths && diagnosis.cvAnalysis.strengths.length > 0 && (
                                    <section>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100">
                                                <Star size={18} className="text-emerald-600" />
                                            </div>
                                            <h2 className="text-xl font-black text-slate-900">
                                                {t.strategicReport.sections.competencies}
                                            </h2>
                                            <div className="flex-1 h-px bg-slate-100" />
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {diagnosis.cvAnalysis.strengths.map((s, i) => (
                                                <span key={i} className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-800 text-sm font-bold rounded-xl border border-emerald-100">
                                                    <CheckCircle2 size={14} className="text-emerald-500" />
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* ── SECTION 3: Assessment Results ── */}
                                <section>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center border border-purple-100">
                                            <TrendingUp size={18} className="text-purple-600" />
                                        </div>
                                        <h2 className="text-xl font-black text-slate-900">
                                            {t.strategicReport.sections.results}
                                        </h2>
                                        <div className="flex-1 h-px bg-slate-100" />
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        {[
                                            {
                                                label: t.strategicReport.sections.cvAudit,
                                                status: diagnosis?.completionStatus?.cvAnalysisComplete,
                                                icon: FileText,
                                                color: 'blue'
                                            },
                                            {
                                                label: t.strategicReport.sections.interview,
                                                status: diagnosis?.completionStatus?.interviewComplete,
                                                icon: Target,
                                                color: 'purple'
                                            },
                                            {
                                                label: t.strategicReport.sections.simulation,
                                                status: diagnosis?.completionStatus?.simulationComplete,
                                                icon: Zap,
                                                color: 'amber'
                                            },
                                        ].map((item, i) => (
                                            <div key={i} className={`p-6 rounded-2xl border-2 ${
                                                item.status 
                                                    ? 'bg-emerald-50 border-emerald-200' 
                                                    : 'bg-slate-50 border-slate-200'
                                            }`}>
                                                <div className="flex items-center gap-3 mb-3">
                                                    <item.icon size={18} className={item.status ? 'text-emerald-600' : 'text-slate-400'} />
                                                    <p className="text-xs font-black uppercase tracking-widest text-slate-600">{item.label}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {item.status 
                                                        ? <><CheckCircle2 size={16} className="text-emerald-500" /><span className="text-sm font-black text-emerald-700">{t.strategicReport.valid}</span></>
                                                        : <><Clock size={16} className="text-slate-400" /><span className="text-sm font-black text-slate-500">{t.strategicReport.pending}</span></>
                                                    }
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* ── SECTION 4: Strategic Recommendation ── */}
                                {report?.executiveSummary?.strategicRecommendation && (
                                    <section>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-100">
                                                <Medal size={18} className="text-amber-600" />
                                            </div>
                                            <h2 className="text-xl font-black text-slate-900">
                                                {t.strategicReport.sections.recommendation}
                                            </h2>
                                            <div className="flex-1 h-px bg-slate-100" />
                                        </div>
                                        <div className="relative bg-linear-to-br from-slate-900 to-blue-950 rounded-2xl p-8 text-white overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
                                            <div className="relative z-10">
                                                <BookOpen size={24} className="text-blue-400 mb-4" />
                                                <p className="text-base font-medium leading-relaxed italic text-slate-200">
                                                    &ldquo;{report.executiveSummary.strategicRecommendation}&rdquo;
                                                </p>
                                            </div>
                                        </div>
                                    </section>
                                )}

                                {/* ── SECTION 5: Next Steps ── */}
                                {report?.roadmap?.shortTerm && (
                                    <section>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100">
                                                <LineChart size={18} className="text-indigo-600" />
                                            </div>
                                            <h2 className="text-xl font-black text-slate-900">
                                                {t.strategicReport.sections.plan}
                                            </h2>
                                            <div className="flex-1 h-px bg-slate-100" />
                                        </div>
                                        <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100 mb-4">
                                            <p className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">{t.strategicReport.sections.objective}</p>
                                            <p className="text-base font-black text-slate-900">{report.roadmap.shortTerm.objective}</p>
                                        </div>
                                        <div className="space-y-3">
                                            {report.roadmap.shortTerm.actions.map((action, i) => (
                                                <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                                                    <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-[10px] font-black text-indigo-700 shrink-0 mt-0.5">{i + 1}</div>
                                                    <span className="text-sm font-medium text-slate-700 leading-relaxed">{action}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* ── FOOTER / SIGNATURE ── */}
                                <div className="pt-10 mt-10 border-t-2 border-dashed border-slate-200 grid md:grid-cols-2 gap-10 items-end">
                                    <div>
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{t.strategicReport.footer.expertSignature}</p>
                                        <svg width="180" height="60" viewBox="0 0 150 60" fill="none" className="text-blue-600/60 mb-2">
                                            <path d="M10 45C30 40 50 15 70 25C90 35 110 5 140 15M20 50C40 45 60 40 100 42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M40 30C45 25 55 20 60 35C65 50 50 55 45 45C40 35 55 25 70 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        </svg>
                                        <p className="text-sm font-black text-slate-700">MA Training Consulting</p>
                                        <p className="text-xs text-slate-500">Expert Conseil en Développement Stratégique</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{t.strategicReport.footer.officialStamp}</p>
                                        <div className="inline-block border-2 border-blue-600 rounded-xl px-8 py-4">
                                            <p className="text-sm font-black text-blue-800 uppercase tracking-wider">Sté MA Training</p>
                                            <p className="text-[10px] text-blue-600 font-bold">Consulting & Formation</p>
                                            <p className="text-[9px] text-slate-500 mt-1">MF: 1805031P/A/M/000</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Disclaimer */}
                                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                    <p className="text-[10px] text-slate-400 leading-relaxed font-medium text-center">
                                        {t.strategicReport.footer.disclaimer}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                ) : (
                    /* JOURNEY HISTORY VIEW */
                    <div className="space-y-12">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center space-y-4"
                        >
                            <h2 className="text-4xl font-black text-slate-900">
                                {t.strategicReport.historyTitle}
                            </h2>
                            <p className="text-slate-500 max-w-2xl mx-auto font-medium">
                                {t.strategicReport.historyDesc}
                            </p>
                            <div className="pt-4">
                                <Link 
                                    href="/assessment/cv-upload?view=history"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                                >
                                    <PlayCircle size={18} className="text-blue-400" />
                                    {t.strategicReport.reviewHistory}
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
                                                                {stage.complete ? t.strategicReport.completed : t.strategicReport.pending}
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
                                                                <span className="text-xs font-bold text-slate-500">{t.strategicReport.totalMessages}</span>
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
                                                                    <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">{t.strategicReport.guidance}</p>
                                                                    <p className="text-sm font-black text-emerald-950">Active</p>
                                                                </div>
                                                                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                                                                    <p className="text-[10px] font-black text-blue-600 uppercase mb-1">{t.strategicReport.scenarios}</p>
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
                                                            {t.strategicReport.viewDetails}
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
        </TrialGate>
    );
}
