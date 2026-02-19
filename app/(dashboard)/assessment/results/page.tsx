"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, TrendingUp, TrendingDown, Award, FileText, Target, ArrowRight, ArrowLeft, Download, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { type Language } from "@/lib/i18n/translations";

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

    useEffect(() => {
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
                        
                        // Update profile status
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

            // Fallback: Only for Guests or if something went wrong
            const stored = localStorage.getItem('interviewEvaluation');
            if (userId && !evaluation) {
                // If we have a userId but no API data, the local cache is stale
                console.log("Logged in user with no evaluation in cloud - clearing stale cache");
                localStorage.removeItem('interviewEvaluation');
                router.push('/assessment/cv-upload');
            } else if (stored) {
                const parsedEvaluation = JSON.parse(stored);
                setEvaluation(parsedEvaluation);
            } else {
                router.push('/assessment/cv-upload');
            }
        };

        loadResults();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);

    const handleDownloadReport = async () => {
        if (!evaluation) return;

        setIsDownloading(true);
        try {
            // 1. Create a dedicated container
            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            container.style.top = '0';
            container.style.width = '800px'; 
            container.style.backgroundColor = '#ffffff';
            container.style.padding = '40px';
            container.style.fontFamily = dir === 'rtl' ? "'Tajawal', sans-serif" : "Inter, sans-serif";
            container.style.color = '#0f172a';
            container.dir = dir;

            // 2. Build Report HTML
            container.innerHTML = `
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap');
                    * { box-sizing: border-box; }
                    .page-break { page-break-inside: avoid; }
                    .bar-container { background-color: #e2e8f0; border-radius: 99px; height: 10px; width: 100%; overflow: hidden; }
                    .bar-fill { height: 100%; border-radius: 99px; }
                </style>
                <div style="font-family: ${dir === 'rtl' ? "'Tajawal', sans-serif" : "inherit"};" dir="${dir}">
                    
                    <!-- Header -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; flex-direction: ${dir === 'rtl' ? 'row-reverse' : 'row'};">
                        <div style="text-align: ${dir === 'rtl' ? 'right' : 'left'};">
                            <div style="color: #2563eb; font-size: 24px; font-weight: bold;">MA-TRAINING-CONSULTING</div>
                            <div style="color: #64748b; font-size: 14px;">Executive Assessment Center</div>
                        </div>
                        <div style="text-align: ${dir === 'rtl' ? 'left' : 'right'};">
                            <h1 style="margin: 0; font-size: 20px; color: #1e293b;">${t.results.title}</h1>
                            <p style="margin: 5px 0 0 0; color: #64748b; font-size: 12px;">${new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    <!-- Executive Summary -->
                    <div style="background-color: #f8fafc; padding: 25px; border-radius: 12px; margin-bottom: 30px; border: 1px solid #e2e8f0;">
                         <div style="display: flex; gap: 20px; align-items: start; flex-direction: ${dir === 'rtl' ? 'row-reverse' : 'row'}; text-align: ${dir === 'rtl' ? 'right' : 'left'};">
                             <div style="flex: 1;">
                                 <h2 style="font-size: 16px; color: #334155; text-transform: uppercase; letter-spacing: 1px; margin-top: 0;">${t.results.executiveSummary}</h2>
                                 <p style="font-size: 14px; line-height: 1.6; color: #0f172a; margin-bottom: 10px; font-style: italic;">
                                     "${evaluation.summary}"
                                 </p>
                                 <div style="font-size: 14px; color: #2563eb; font-weight: bold;">${t.results.verdict}: ${evaluation.verdict}</div>
                             </div>
                             <div style="text-align: center; padding: 15px; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; min-width: 120px;">
                                 <div style="font-size: 12px; color: #64748b; text-transform: uppercase;">Overall Rating</div>
                                 <div style="font-size: 36px; font-weight: bold; color: #2563eb; line-height: 1;">${evaluation.overallRating}<span style="font-size: 14px; color: #94a3b8;">/10</span></div>
                             </div>
                         </div>
                    </div>

                    <!-- Metrics Grid -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                        <!-- Accuracy -->
                        <div style="border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; text-align: ${dir === 'rtl' ? 'right' : 'left'};">
                             <h3 style="margin: 0 0 15px 0; font-size: 16px;">${t.results.accuracyScore}</h3>
                             <div style="display: flex; align-items: flex-end; gap: 5px; margin-bottom: 10px; flex-direction: ${dir === 'rtl' ? 'row-reverse' : 'row'};">
                                 <span style="font-size: 32px; font-weight: bold; color: ${evaluation.accuracyScore > 70 ? '#16a34a' : '#ea580c'};">${evaluation.accuracyScore}%</span>
                             </div>
                             <div class="bar-container">
                                 <div class="bar-fill" style="width: ${evaluation.accuracyScore}%; background-color: ${evaluation.accuracyScore > 70 ? '#16a34a' : '#ea580c'};"></div>
                             </div>
                        </div>
                        
                        <!-- Level -->
                        <div style="border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; text-align: ${dir === 'rtl' ? 'right' : 'left'};">
                             <h3 style="margin: 0 0 15px 0; font-size: 16px;">${t.results.seniority}</h3>
                             <div style="font-size: 24px; font-weight: bold; color: #4f46e5; margin-bottom: 5px;">${evaluation.seniorityLevel || 'Professional'}</div>
                             <p style="font-size: 12px; color: #64748b; margin: 0;">Based on technical depth and strategic awareness.</p>
                        </div>
                    </div>

                    <!-- Detailed Analysis -->
                    <div style="margin-bottom: 30px; text-align: ${dir === 'rtl' ? 'right' : 'left'};">
                        <h2 style="font-size: 18px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 20px; color: #0f172a;">${t.results.cvVsReality}</h2>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                            <!-- Strengths -->
                            <div class="page-break">
                                <h3 style="font-size: 14px; color: #166534; text-transform: uppercase; margin-bottom: 10px;">${t.results.confirmedStrengths}</h3>
                                <ul style="margin: 0; padding-${dir === 'rtl' ? 'right' : 'left'}: 20px; font-size: 13px; color: #334155; line-height: 1.5;">
                                    ${evaluation.cvVsReality?.confirmedStrengths?.map((s: string) => `<li style="margin-bottom: 5px;">${s}</li>`).join('') || `<li>${t.results.noneDetected}</li>`}
                                </ul>
                            </div>

                            <!-- Areas for Improvement -->
                            <div class="page-break">
                                <h3 style="font-size: 14px; color: #9a3412; text-transform: uppercase; margin-bottom: 10px;">${t.results.skillPriorities}</h3>
                                <ul style="margin: 0; padding-${dir === 'rtl' ? 'right' : 'left'}: 20px; font-size: 13px; color: #334155; line-height: 1.5;">
                                    ${evaluation.skillDevelopmentPriorities?.map((s: string) => `<li style="margin-bottom: 5px;">${s}</li>`).join('') || `<li>${t.results.noneDetected}</li>`}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Improvement Plan -->
                    <div class="page-break" style="background-color: #fffbeb; padding: 25px; border-radius: 12px; border: 1px solid #fcd34d; text-align: ${dir === 'rtl' ? 'right' : 'left'};">
                        <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #92400e;">${t.results.recommendedActions}</h3>
                        <ul style="margin: 0; padding-${dir === 'rtl' ? 'right' : 'left'}: 20px; font-size: 14px; color: #78350f;">
                             ${evaluation.cvImprovements?.map((s: string) => `<li style="margin-bottom: 8px;">${s}</li>`).join('') || `<li>${t.results.noImprovementsNeeded}</li>`}
                        </ul>
                    </div>

                    <!-- Footer -->
                    <div style="margin-top: 50px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
                        MA-TRAINING-CONSULTING • Confidential Evaluation Report
                    </div>
                </div>
            `;

            document.body.appendChild(container);

            // 3. Capture
            const canvas = await html2canvas(container, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: "#ffffff",
                windowWidth: 800
            });

            // 4. Cleanup
            document.body.removeChild(container);

            // 5. Generate PDF
            const imgData = canvas.toDataURL('image/png', 1.0);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgProps = pdf.getImageProperties(imgData);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position -= pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
                heightLeft -= pdfHeight;
            }

            pdf.save(`MA-TRAINING-Evaluation-Report.pdf`);

        } catch (error) {
            console.error("PDF generation failed:", error);
            alert("Failed to generate PDF report.");
        } finally {
            setIsDownloading(false);
        }
    };

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
        <div className="flex-1 p-4 md:p-8 max-w-6xl mx-auto space-y-6" dir={dir}>
            <div ref={resultsRef} className="space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-linear-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100 p-8"
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push("/assessment/interview")}
                                className="p-2 hover:bg-white/50 rounded-full transition-colors group text-slate-400 hover:text-indigo-600"
                                title={t.results.backToInterview}
                                data-html2canvas-ignore
                            >
                                <ArrowLeft className={`w-6 h-6 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                            </button>
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t.results.title}</h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-md uppercase tracking-wider">
                                        {t.results.badge}
                                    </span>
                                    <span className="text-slate-400 text-sm">•</span>
                                    <span className="text-slate-500 text-sm">{new Date().toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleDownloadReport}
                                disabled={isDownloading}
                                data-html2canvas-ignore
                                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:shadow-md transition-all gap-2"
                            >
                                {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                {t.results.pdfReport}
                            </button>
                            <motion.button
                                initial={{ scale: 1 }}
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                onClick={() => router.push("/assessment/role-discovery")}
                                className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-lg shadow-indigo-600/20 group"
                                data-html2canvas-ignore
                            >
                                <ArrowRight className={`w-6 h-6 group-hover:translate-x-1 transition-transform ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Key Metrics & Executive Summary */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* CV Accuracy Score */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-center"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">{t.results.accuracyScore}</h2>
                            <Award className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="text-center mb-6">
                            <div className="inline-flex items-baseline gap-1">
                                <span className="text-6xl font-black text-indigo-600 tracking-tighter">{evaluation.accuracyScore}</span>
                                <span className="text-2xl font-bold text-slate-300">%</span>
                            </div>
                            <div className="mt-4 w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${evaluation.accuracyScore}%` }}
                                    className="bg-indigo-600 h-full rounded-full"
                                />
                            </div>
                        </div>
                        <p className="text-xs text-center font-bold text-slate-400 uppercase leading-relaxed">
                            {evaluation.accuracyScore >= 80 ? t.results.highIntegrity :
                                evaluation.accuracyScore >= 60 ? t.results.moderateAccuracy :
                                    t.results.significantDiscrepancies}
                        </p>
                    </motion.div>

                    {/* Executive Summary & Verdict */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 bg-white rounded-2xl border border-indigo-100 p-8 shadow-sm relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mt-16 blur-3xl" />
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                                    <Target className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 tracking-tight">{t.results.executiveSummary}</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-slate-50 border-l-4 border-indigo-500 p-4 rounded-r-xl">
                                    <p className="text-indigo-900 font-bold italic leading-relaxed text-lg">
                                        &quot;{evaluation.verdict}&quot;
                                    </p>
                                </div>
                                
                                <p className="text-slate-600 leading-relaxed text-base font-medium">
                                    {evaluation.summary}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* CV vs Reality Comparison */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl border border-slate-200 p-6"
                >
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">{t.results.cvVsReality}</h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Confirmed Strengths */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <h3 className="font-bold text-green-700">{t.results.confirmedStrengths}</h3>
                            </div>
                            <ul className="space-y-2">
                                {evaluation.cvVsReality?.confirmedStrengths?.map((item: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                        <span className={`w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0 ${dir === 'rtl' ? 'ml-2' : ''}`} />
                                        <span>{item}</span>
                                    </li>
                                ))}
                                {(!evaluation.cvVsReality?.confirmedStrengths || evaluation.cvVsReality.confirmedStrengths.length === 0) && (
                                    <li className="text-sm text-slate-400 italic">{t.results.noneDetected}</li>
                                )}
                            </ul>
                        </div>

                        {/* Exaggerations */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <AlertCircle className="w-5 h-5 text-red-600" />
                                <h3 className="font-bold text-red-700">{t.results.exaggerationsDetected}</h3>
                            </div>
                            <ul className="space-y-2">
                                {evaluation.cvVsReality?.exaggerations?.map((item: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                        <AlertCircle className={`w-4 h-4 text-red-500 shrink-0 mt-0.5 ${dir === 'rtl' ? 'ml-2' : ''}`} />
                                        <span>{item}</span>
                                    </li>
                                ))}
                                {(!evaluation.cvVsReality?.exaggerations || evaluation.cvVsReality.exaggerations.length === 0) && (
                                    <li className="text-sm text-slate-400 italic">{t.results.noneDetected}</li>
                                )}
                            </ul>
                        </div>

                        {/* Hidden Strengths */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="w-5 h-5 text-blue-600" />
                                <h3 className="font-bold text-blue-700">{t.results.hiddenStrengths}</h3>
                            </div>
                            <ul className="space-y-2">
                                {evaluation.cvVsReality?.hiddenStrengths?.map((item: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                        <span className={`w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0 ${dir === 'rtl' ? 'ml-2' : ''}`} />
                                        <span>{item}</span>
                                    </li>
                                ))}
                                {(!evaluation.cvVsReality?.hiddenStrengths || evaluation.cvVsReality.hiddenStrengths.length === 0) && (
                                    <li className="text-sm text-slate-400 italic">{t.results.noneDetected}</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </motion.div>

                {/* CV Improvement Recommendations */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-linear-to-br from-green-50 to-blue-50 rounded-2xl border border-green-200 p-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <FileText className="w-6 h-6 text-green-600" />
                        <h2 className="text-2xl font-bold text-slate-900">{t.results.cvImprovements}</h2>
                    </div>
                    <p className="text-slate-600 mb-4">{t.results.cvImprovementsDesc}</p>
                    <ol className="space-y-3">
                        {evaluation.cvImprovements?.map((item: string, i: number) => (
                            <li key={i} className="flex items-start gap-3">
                                <span className="shrink-0 w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">
                                    {i + 1}
                                </span>
                                <span className="text-slate-700 pt-0.5">{item}</span>
                            </li>
                        ))}
                    </ol>
                </motion.div>

                {/* Skill Development Priorities */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-2xl border border-slate-200 p-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingDown className="w-6 h-6 text-orange-600" />
                        <h2 className="text-2xl font-bold text-slate-900">{t.results.skillPriorities}</h2>
                    </div>
                    <p className="text-slate-600 mb-4">{t.results.skillPrioritiesDesc}</p>
                    <div className="grid md:grid-cols-2 gap-3">
                        {evaluation.skillDevelopmentPriorities?.map((item: string, i: number) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl border border-orange-100">
                                <ArrowRight className={`ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform shrink-0 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                                <span className="text-slate-700 font-medium">{item}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-linear-to-r from-purple-50 to-blue-50 rounded-2xl border-2 border-purple-200 p-6"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                            <Target className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">🎯 {t.results.nextStepPaths}</h3>
                            <p className="text-slate-700 mb-4">
                                {t.results.nextStepDesc}
                            </p>
                            <div className="bg-white rounded-lg p-3 border border-purple-200">
                                <p className="text-sm text-slate-600">
                                    💡 <strong>Tip:</strong> {t.results.tip}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8" data-html2canvas-ignore>
                <motion.button
                    initial={{ scale: 1 }}
                    animate={{ 
                        scale: [1, 1.05, 1],
                        boxShadow: [
                            "0px 10px 15px -3px rgba(147, 51, 234, 0.3)",
                            "0px 20px 25px -5px rgba(147, 51, 234, 0.5)",
                            "0px 10px 15px -3px rgba(147, 51, 234, 0.3)"
                        ]
                    }}
                    transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    onClick={() => router.push('/assessment/role-discovery')}
                    className="px-16 py-5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black text-xl transition-all shadow-xl shadow-purple-600/30 flex items-center justify-center gap-3"
                >
                    <Target className="w-6 h-6" />
                    {t.results.continueDiscovery}
                    <ArrowRight className={`w-6 h-6 ml-2 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                </motion.button>
            </div>
        </div>
    );
}
