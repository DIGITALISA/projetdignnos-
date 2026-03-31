"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { TrendingDown, Award, FileText, Target, ArrowRight, ArrowLeft, Download, Loader2, Brain, Sparkles, Shield, Star, Linkedin } from "lucide-react";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { sanitizeForHtml2Canvas } from "@/lib/pdf-utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { StageProgressBanner, NextStageTeaser } from "@/components/assessment/NextStageTeaser";
import { TrialGate } from "@/components/ui/TrialGate";

interface InterviewEvaluation {
    accuracyScore: number;
    overallRating: number;
    summary: string;
    cvVsReality: {
        confirmedStrengths: string[];
        exaggerations: string[];
        hiddenStrengths: string[];
    };
    cvImprovements: string[];
    skillDevelopmentPriorities: string[];
    verdict: string;
    seniorityLevel: string;
    suggestedRoles: string[];
}

export default function ResultsPage() {
    const router = useRouter();
    const { t, dir } = useLanguage();
    const resultsRef = useRef<HTMLDivElement>(null);
    const [evaluation, setEvaluation] = useState<InterviewEvaluation | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [linkedinUrl, setLinkedinUrl] = useState("");

    useEffect(() => {
        setLinkedinUrl(localStorage.getItem("linkedinUrl") || "");

        const loadResults = async () => {
            const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
            const userId = userProfile.email || userProfile.fullName;

            if (userId) {
                try {
                    const res = await fetch(`/api/user/progress?userId=${encodeURIComponent(userId)}`);
                    const response = await res.json();

                    if (response.hasData && response.data?.interviewEvaluation) {
                        const evalData = response.data.interviewEvaluation;
                        setEvaluation(evalData);
                        localStorage.setItem('interviewEvaluation', JSON.stringify(evalData));
                        
                        if (userProfile && !userProfile.isDiagnosisComplete) {
                            userProfile.isDiagnosisComplete = true;
                            userProfile.diagnosisData = evalData;
                            localStorage.setItem("userProfile", JSON.stringify(userProfile));
                            window.dispatchEvent(new Event("profileUpdated"));
                        }
                        return;
                    }
                } catch (e) {
                    console.error("Error loading results from API:", e);
                }
            }

            const stored = localStorage.getItem('interviewEvaluation');
            if (userId && !evaluation) {
                localStorage.removeItem('interviewEvaluation');
                router.push('/assessment/cv-upload');
            } else if (stored) {
                setEvaluation(JSON.parse(stored));
            } else {
                router.push('/assessment/cv-upload');
            }
        };

        loadResults();
    }, [router, evaluation]);


    const handleDownloadReport = async () => {
        if (!evaluation) return;

        setIsDownloading(true);
        const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
        const participantName = userProfile.fullName || "Candidate";
        const savedLinkedin = localStorage.getItem("linkedinUrl") || "";

        try {
            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            container.style.top = '0';
            container.style.width = '800px'; 
            container.style.backgroundColor = '#ffffff';
            container.dir = dir;

            container.innerHTML = `
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Tajawal:wght@400;500;700;900&display=swap');
                    * { box-sizing: border-box; }
                    .report-wrapper { position: relative; background: #ffffff; overflow: hidden; padding-bottom: 40px; }
                    .header-bg { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); height: 280px; width: 100%; position: absolute; top: 0; left: 0; }
                    .content-relative { position: relative; z-index: 10; padding: 50px 40px; }
                    .glass-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); padding: 30px; margin-bottom: 24px; }
                    .badge-ai { display: inline-flex; align-items: center; gap: 8px; background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.2); color: #4f46e5; padding: 6px 16px; border-radius: 99px; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; }
                    .score-circle { width: 140px; height: 140px; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #ffffff; border: 8px solid #4f46e5; box-shadow: 0 0 20px rgba(79, 70, 229, 0.2); }
                </style>
                <div class="report-wrapper" style="font-family: ${dir === 'rtl' ? "'Tajawal', sans-serif" : "'Space Grotesk', sans-serif"};">
                    <div class="header-bg"></div>
                    <div class="content-relative">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 60px; flex-direction: ${dir === 'rtl' ? 'row-reverse' : 'row'};">
                            <div>
                                <div style="color: #ffffff; font-size: 28px; font-weight: 900; letter-spacing: -1px; margin-bottom: 4px;">MATC <span style="font-weight: 300; color: #94a3b8;">EXECUTIVE</span></div>
                                <div style="color: #6366f1; font-size: 12px; font-weight: 700; letter-spacing: 4px; text-transform: uppercase;">Assessment Accreditation</div>
                            </div>
                            <div style="text-align: ${dir === 'rtl' ? 'left' : 'right'}">
                                <div class="badge-ai" style="background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); color: #ffffff;">Verified Strategic Diagnosis</div>
                                <div style="color: #94a3b8; font-size: 11px; margin-top: 12px; font-weight: 500;">
                                    ID: ACC-${Math.random().toString(36).substring(7).toUpperCase()} • ${new Date().toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        <div class="glass-card" style="margin-top: -20px; border-top: 4px solid #4f46e5; display: flex; flex-direction: column; gap: 40px;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-direction: ${dir === 'rtl' ? 'row-reverse' : 'row'};">
                                <div>
                                    <div style="color: #64748b; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px;">Participant Accreditation</div>
                                    <h1 style="font-size: 42px; font-weight: 900; color: #0f172a; margin: 0; line-height: 1;">${participantName}</h1>
                                    <div style="display: flex; align-items: center; gap: 12px; margin-top: 16px;">
                                        <div style="font-size: 18px; font-weight: 700; color: #4338ca;">${evaluation.seniorityLevel || 'Professional Executive'}</div>
                                    </div>
                                    ${savedLinkedin ? `<div style="margin-top: 8px; color: #0077b5; font-size: 12px; font-weight: 700;">Linked: ${savedLinkedin.replace(/https:\/\/www.linkedin.com\/in\//, '')}</div>` : ''}
                                </div>
                                <div class="score-circle">
                                    <div style="font-size: 12px; color: #94a3b8; font-weight: 700; text-transform: uppercase; margin-bottom: -4px;">Score</div>
                                    <div style="font-size: 48px; font-weight: 900; color: #4f46e5;">${evaluation.overallRating}</div>
                                </div>
                            </div>

                            <div style="background: #f8fafc; border-radius: 20px; padding: 30px; border-left: 6px solid #4f46e5;">
                                <div style="font-size: 11px; font-weight: 900; color: #4f46e5; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 16px;">Strategic Intelligence Verdict</div>
                                <p style="font-size: 18px; font-weight: 700; color: #1e293b; line-height: 1.6; font-style: italic; margin: 0;">"${evaluation.verdict}"</p>
                            </div>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
                                <div>
                                    <h3 style="font-size: 13px; font-weight: 900; color: #166534; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 20px;">Confirmed Masteries</h3>
                                    <div style="display: flex; flex-direction: column; gap: 12px;">
                                        ${evaluation.cvVsReality?.confirmedStrengths?.map(s => `<div style="font-size: 14px; color: #334155; font-weight: 600;">✓ ${s}</div>`).join('')}
                                    </div>
                                </div>
                                <div>
                                    <h3 style="font-size: 13px; font-weight: 900; color: #9a3412; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 20px;">Strategic Priorities</h3>
                                    <div style="display: flex; flex-direction: column; gap: 12px;">
                                        ${evaluation.skillDevelopmentPriorities?.map(s => `<div style="font-size: 14px; color: #334155; font-weight: 600;">! ${s}</div>`).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style="padding: 0 10px;">
                            <h2 style="font-size: 16px; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 20px;">Analysis Summary</h2>
                            <p style="font-size: 14px; color: #334155; line-height: 1.8; font-weight: 500;">${evaluation.summary}</p>
                        </div>

                        <div style="margin-top: 60px; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 20px;">
                            <div style="font-size: 12px; color: #94a3b8; font-weight: 700; letter-spacing: 1px;">MA-TRAINING-CONSULTING • STRATEGIC ACCREDITATION CENTER</div>
                            <div style="font-size: 10px; color: #cbd5e1; margin-top: 4px; font-weight: 500;">Paris • Tunis • Dubai · ${new Date().getFullYear()}</div>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(container);
            const canvas = await html2canvas(container, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#ffffff",
                windowWidth: 800,
                onclone: (clonedDoc) => sanitizeForHtml2Canvas(clonedDoc)
            });
            document.body.removeChild(container);

            const imgData = canvas.toDataURL('image/png', 1.0);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const imgProps = pdf.getImageProperties(imgData);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight, undefined, 'FAST');
            pdf.save(`MA-TRAINING-Executive-Report.pdf`);

        } catch (error) {
            console.error("PDF generation failed:", error);
        } finally {
            setIsDownloading(false);
        }
    };

    const userProfile = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("userProfile") || "{}") : {};
    const canDownload = ['pro', 'moderator', 'admin'].includes(userProfile.plan?.toLowerCase()) || userProfile.role === 'admin';

    if (!evaluation) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">{t.results.loadingResults}</p>
                </div>
            </div>
        );
    }

    return (
        <TrialGate module="strategic-report" dir={dir}>
            <div className="flex-1 p-4 md:p-8 max-w-6xl mx-auto space-y-8" dir={dir}>
                <StageProgressBanner stage="results" />

                <div ref={resultsRef} className="space-y-8">
                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-linear-to-br from-indigo-50 to-blue-50 rounded-3xl border border-indigo-100 p-8 shadow-sm"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <button onClick={() => router.push("/assessment/interview")} className="p-3 bg-white/50 hover:bg-white rounded-2xl transition-all text-slate-400 hover:text-indigo-600 border border-indigo-50 shadow-sm">
                                    <ArrowLeft className={`w-6 h-6 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                                </button>
                                <div>
                                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t.results.title}</h1>
                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">{t.results.badge}</span>
                                        <span className="text-slate-400 text-sm">•</span>
                                        <span className="text-slate-500 text-sm font-bold">{new Date().toLocaleDateString()}</span>
                                        {linkedinUrl && (
                                            <>
                                                <span className="text-slate-400 text-sm">•</span>
                                                <a
                                                    href={linkedinUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#0077b5] text-white text-[10px] font-black rounded-md hover:bg-[#006097] transition-colors"
                                                >
                                                    <Linkedin className="w-3 h-3" />
                                                    LINKEDIN
                                                </a>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {canDownload ? (
                                    <button onClick={handleDownloadReport} disabled={isDownloading} className="inline-flex items-center px-6 py-3 rounded-2xl bg-white border-2 border-slate-100 text-slate-700 font-black text-sm hover:shadow-xl hover:border-indigo-500 transition-all gap-2">
                                        {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                        {t.results.pdfReport}
                                    </button>
                                ) : (
                                    <div className="px-6 py-3 rounded-2xl bg-slate-100 border border-slate-200 text-slate-400 font-black text-sm flex items-center gap-2 cursor-not-allowed">
                                        <Download className="w-4 h-4" />
                                        {t.results.pdfReport}
                                        <span className="px-1.5 py-0.5 bg-amber-100 text-amber-600 border border-amber-200 rounded-md text-[9px]">PRO</span>
                                    </div>
                                )}
                                <button onClick={() => router.push("/assessment/role-discovery")} className="p-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all">
                                    <ArrowRight className={`w-6 h-6 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Metrics & Verdict */}
                    <div className="grid lg:grid-cols-3 gap-8">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[32px] border-2 border-slate-100 p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-lg">
                            <Award className="w-12 h-12 text-indigo-600 mb-4" />
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">{t.results.accuracyScore}</h2>
                            <div className="relative mb-6">
                                <span className="text-6xl font-black text-slate-900 leading-none">{evaluation.accuracyScore}%</span>
                            </div>
                            <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-black uppercase">
                                {evaluation.accuracyScore >= 80 ? t.results.highIntegrity : t.results.moderateAccuracy}
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 bg-[#0a0c1b] rounded-[32px] p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-14 h-14 bg-linear-to-tr from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center text-white"><Brain className="w-7 h-7" /></div>
                                    <h2 className="text-2xl font-black text-white">{t.results.executiveSummary}</h2>
                                </div>
                                <p className="text-2xl font-bold text-indigo-100 italic mb-6 leading-relaxed">&ldquo;{evaluation.verdict}&rdquo;</p>
                                <p className="text-slate-300 text-lg leading-relaxed">{evaluation.summary}</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Comparison & Growth */}
                    <div className="grid lg:grid-cols-2 gap-8">
                        <motion.div className="bg-white rounded-[32px] border-2 border-slate-100 p-10 shadow-lg">
                            <div className="flex items-center gap-4 mb-8">
                                <Shield className="w-8 h-8 text-indigo-600" />
                                <h2 className="text-2xl font-black text-slate-900">{t.results.cvVsReality}</h2>
                            </div>
                            <div className="space-y-4">
                                {evaluation.cvVsReality?.confirmedStrengths?.map((s, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                        <Star className="w-4 h-4 fill-emerald-600" />
                                        <span className="font-bold text-slate-700">{s}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div className="bg-[#f0f4ff] rounded-[32px] border-2 border-indigo-100 p-10 shadow-md">
                            <div className="flex items-center gap-4 mb-8">
                                <FileText className="w-8 h-8 text-indigo-600" />
                                <h2 className="text-2xl font-black text-slate-900">{t.results.cvImprovements}</h2>
                            </div>
                            <div className="space-y-4">
                                {evaluation.cvImprovements?.map((s, i) => (
                                    <div key={i} className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-indigo-50">
                                        <span className="w-8 h-8 bg-indigo-600 text-white flex items-center justify-center rounded-xl font-black text-sm shrink-0">{i+1}</span>
                                        <span className="font-bold text-slate-700 pt-1">{s}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Skill Priorities */}
                    <motion.div className="bg-white rounded-[32px] border-2 border-slate-100 p-10 shadow-lg">
                        <div className="flex items-center gap-4 mb-8">
                            <TrendingDown className="w-8 h-8 text-orange-600" />
                            <h2 className="text-2xl font-black text-slate-900">{t.results.skillPriorities}</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            {evaluation.skillDevelopmentPriorities?.map((s, i) => (
                                <div key={i} className="p-5 bg-orange-50 rounded-2xl border border-orange-100 font-bold text-slate-700">{s}</div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Next Steps */}
                    <motion.div className="bg-linear-to-r from-[#1e1b4b] to-[#312e81] rounded-[32px] p-10 text-white relative overflow-hidden shadow-2xl">
                        <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
                            <Target className="w-16 h-16 text-indigo-300" />
                            <div>
                                <h3 className="text-2xl font-black mb-3">{t.results.nextStepPaths}</h3>
                                <p className="text-indigo-100 text-lg mb-6">{t.results.nextStepDesc}</p>
                                <div className="p-4 bg-white/10 rounded-2xl flex items-center gap-4">
                                    <Sparkles className="w-5 h-5 text-indigo-300" />
                                    <span className="font-bold italic text-sm">{t.results.tip}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <NextStageTeaser stage="results" onNavigate={() => router.push('/assessment/role-discovery')} />
            </div>
        </TrialGate>
    );
}
