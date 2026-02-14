"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, TrendingUp, TrendingDown, Award, FileText, Target, ArrowRight, Home, ShieldCheck, Download, Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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
            container.style.fontFamily = "'Tajawal', sans-serif";
            container.style.color = '#0f172a';

            // 2. Build Report HTML
            container.innerHTML = `
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap');
                    * { box-sizing: border-box; }
                    .page-break { page-break-inside: avoid; }
                    .bar-container { background-color: #e2e8f0; border-radius: 99px; height: 10px; width: 100%; overflow: hidden; }
                    .bar-fill { height: 100%; border-radius: 99px; }
                </style>
                <div style="font-family: 'Tajawal', sans-serif;">
                    
                    <!-- Header -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px;">
                        <div>
                            <div style="color: #2563eb; font-size: 24px; font-weight: bold;">MA-TRAINING-CONSULTING</div>
                            <div style="color: #64748b; font-size: 14px;">Executive Assessment Center</div>
                        </div>
                        <div style="text-align: right;">
                            <h1 style="margin: 0; font-size: 20px; color: #1e293b;">Evaluation Report</h1>
                            <p style="margin: 5px 0 0 0; color: #64748b; font-size: 12px;">${new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    <!-- Executive Summary -->
                    <div style="background-color: #f8fafc; padding: 25px; border-radius: 12px; margin-bottom: 30px; border: 1px solid #e2e8f0;">
                         <div style="display: flex; gap: 20px; align-items: start;">
                             <div style="flex: 1;">
                                 <h2 style="font-size: 16px; color: #334155; text-transform: uppercase; letter-spacing: 1px; margin-top: 0;">Executive Summary</h2>
                                 <p style="font-size: 14px; line-height: 1.6; color: #0f172a; margin-bottom: 10px; font-style: italic;">
                                     "${evaluation.summary}"
                                 </p>
                                 <div style="font-size: 14px; color: #2563eb; font-weight: bold;">Verdict: ${evaluation.verdict}</div>
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
                        <div style="border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px;">
                             <h3 style="margin: 0 0 15px 0; font-size: 16px;">CV Accuracy</h3>
                             <div style="display: flex; align-items: flex-end; gap: 5px; margin-bottom: 10px;">
                                 <span style="font-size: 32px; font-weight: bold; color: ${evaluation.accuracyScore > 70 ? '#16a34a' : '#ea580c'};">${evaluation.accuracyScore}%</span>
                             </div>
                             <div class="bar-container">
                                 <div class="bar-fill" style="width: ${evaluation.accuracyScore}%; background-color: ${evaluation.accuracyScore > 70 ? '#16a34a' : '#ea580c'};"></div>
                             </div>
                        </div>
                        
                        <!-- Level -->
                        <div style="border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px;">
                             <h3 style="margin: 0 0 15px 0; font-size: 16px;">Assessed Seniority</h3>
                             <div style="font-size: 24px; font-weight: bold; color: #4f46e5; margin-bottom: 5px;">${evaluation.seniorityLevel || 'Professional'}</div>
                             <p style="font-size: 12px; color: #64748b; margin: 0;">Based on technical depth and strategic awareness.</p>
                        </div>
                    </div>

                    <!-- Detailed Analysis -->
                    <div style="margin-bottom: 30px;">
                        <h2 style="font-size: 18px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 20px; color: #0f172a;">Detailed Analysis</h2>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                            <!-- Strengths -->
                            <div class="page-break">
                                <h3 style="font-size: 14px; color: #166534; text-transform: uppercase; margin-bottom: 10px;">Confirmed Strengths</h3>
                                <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #334155; line-height: 1.5;">
                                    ${evaluation.cvVsReality?.confirmedStrengths?.map((s: string) => `<li style="margin-bottom: 5px;">${s}</li>`).join('') || '<li>None detected</li>'}
                                </ul>
                            </div>

                            <!-- Areas for Improvement -->
                            <div class="page-break">
                                <h3 style="font-size: 14px; color: #9a3412; text-transform: uppercase; margin-bottom: 10px;">Development Areas</h3>
                                <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #334155; line-height: 1.5;">
                                    ${evaluation.skillDevelopmentPriorities?.map((s: string) => `<li style="margin-bottom: 5px;">${s}</li>`).join('') || '<li>None detected</li>'}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Improvement Plan -->
                    <div class="page-break" style="background-color: #fffbeb; padding: 25px; border-radius: 12px; border: 1px solid #fcd34d;">
                        <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #92400e;">Recommended Actions</h3>
                        <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #78350f;">
                             ${evaluation.cvImprovements?.map((s: string) => `<li style="margin-bottom: 8px;">${s}</li>`).join('') || '<li>No specific improvements needed.</li>'}
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
                    <p className="text-slate-600">Loading your results...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-4 md:p-8 max-w-6xl mx-auto space-y-6">
            <div ref={resultsRef} className="space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-linear-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-200 p-8"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <h1 className="text-3xl font-bold text-slate-900">Interview Evaluation Results</h1>
                                <button
                                    onClick={handleDownloadReport}
                                    disabled={isDownloading}
                                    data-html2canvas-ignore
                                    className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all group"
                                >
                                    {isDownloading ? (
                                        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                                    ) : (
                                        <Download className="w-5 h-5 text-blue-600" />
                                    )}
                                    {isDownloading ? 'Generating...' : 'Download PDF'}
                                </button>
                            </div>
                            <p className="text-slate-600">Comprehensive analysis of your CV accuracy and capabilities</p>
                        </div>
                        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-2xl font-bold text-indigo-700 mx-auto mb-4">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-blue-600">{evaluation.overallRating}</p>
                                <p className="text-xs text-slate-500">/ 10</p>
                            </div>
                        </div>
                    </div>

                    {/* Verdict */}
                    <div className="bg-white rounded-xl p-4 border-l-4 border-blue-500">
                        <p className="text-slate-700 font-medium italic">&quot;{evaluation.verdict}&quot;</p>
                    </div>
                </motion.div>

                {/* Key Metrics */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* CV Accuracy */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl border border-slate-200 p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-slate-900">CV Accuracy Score</h2>
                            <Award className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="mb-4">
                            <div className="flex items-end gap-2">
                                <span className="text-5xl font-bold text-blue-600">{evaluation.accuracyScore}</span>
                                <span className="text-2xl text-slate-400 mb-2">%</span>
                            </div>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3">
                            <div
                                className="bg-blue-600 h-3 rounded-full transition-all duration-1000"
                                style={{ width: `${evaluation.accuracyScore}%` }}
                            />
                        </div>
                        <p className="text-sm text-slate-600 mt-3">
                            {evaluation.accuracyScore >= 80 ? "Excellent accuracy! Your CV reflects your real capabilities well." :
                                evaluation.accuracyScore >= 60 ? "Good accuracy with room for improvement." :
                                    "Significant gaps detected between CV and reality."}
                        </p>
                    </motion.div>

                    {/* Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl border border-slate-200 p-6"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Target className="w-6 h-6 text-purple-600" />
                            <h2 className="text-xl font-bold text-slate-900">Summary</h2>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{evaluation.summary}</p>
                    </motion.div>
                </div>

                {/* CV vs Reality Comparison */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl border border-slate-200 p-6"
                >
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">CV vs Reality Analysis</h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Confirmed Strengths */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <h3 className="font-bold text-green-700">Confirmed Strengths</h3>
                            </div>
                            <ul className="space-y-2">
                                {evaluation.cvVsReality?.confirmedStrengths?.map((item: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Exaggerations */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <AlertCircle className="w-5 h-5 text-red-600" />
                                <h3 className="font-bold text-red-700">Exaggerations Detected</h3>
                            </div>
                            <ul className="space-y-2">
                                {evaluation.cvVsReality?.exaggerations?.map((item: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Hidden Strengths */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="w-5 h-5 text-blue-600" />
                                <h3 className="font-bold text-blue-700">Hidden Strengths</h3>
                            </div>
                            <ul className="space-y-2">
                                {evaluation.cvVsReality?.hiddenStrengths?.map((item: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
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
                        <h2 className="text-2xl font-bold text-slate-900">CV Improvement Recommendations</h2>
                    </div>
                    <p className="text-slate-600 mb-4">Specific changes to make your CV more accurate and effective:</p>
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
                        <h2 className="text-2xl font-bold text-slate-900">Skill Development Priorities</h2>
                    </div>
                    <p className="text-slate-600 mb-4">Focus on improving these areas to match your career goals:</p>
                    <div className="grid md:grid-cols-2 gap-3">
                        {evaluation.skillDevelopmentPriorities?.map((item: string, i: number) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl border border-orange-100">
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform shrink-0" />
                                <span className="text-slate-700 font-medium">{item}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* AI Mentor Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                    className="bg-indigo-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl"
                >
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px]" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                        <div className="w-20 h-20 bg-white/10 rounded-4xl flex items-center justify-center border border-white/20 backdrop-blur-md">
                            <Sparkles className="w-10 h-10 text-blue-400" />
                        </div>
                        <div className="flex-1 space-y-2">
                            <h3 className="text-2xl md:text-3xl font-black tracking-tight">Access Executive Simulation</h3>
                            <p className="text-indigo-200 font-medium leading-relaxed max-w-2xl">
                                Move beyond theory. Work with an <strong>Industry Expert</strong> to execute your personal Action Plan in a real-world simulation environment.
                            </p>
                        </div>
                        <button
                            onClick={() => router.push('/simulation')}
                            className="px-8 py-4 bg-white text-indigo-900 rounded-2xl font-black text-lg hover:bg-blue-50 transition-all shadow-xl active:scale-95 whitespace-nowrap"
                        >
                            Start Executive Simulation
                        </button>
                    </div>
                </motion.div>

                {/* Next Steps Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 p-6"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-linear-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">📜 Official Recommendation Letter</h3>
                            <p className="text-slate-700 mb-4">
                                Based on your excellent performance in the interview and your training progress, you can now generate an official <strong>Recommendation Letter</strong> from our AI HR Expert.
                            </p>
                            <button
                                onClick={() => router.push('/recommendation')}
                                data-html2canvas-ignore
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md"
                            >
                                Generate My Letter
                            </button>
                        </div>
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
                            <h3 className="text-xl font-bold text-slate-900 mb-2">🎯 Next Step: Explore Your Career Paths</h3>
                            <p className="text-slate-700 mb-4">
                                Ready to discover your optimal roles? Go to the <strong>Career Discovery</strong> chat,
                                share your aspirations, and our AI will identify the best positions for your profile.
                            </p>
                            <div className="bg-white rounded-lg p-3 border border-purple-200">
                                <p className="text-sm text-slate-600">
                                    💡 <strong>Tip:</strong> Choose a role with a high match percentage (70%+) for the best results.
                                    The AI will create tailored documents specifically for that position.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <button
                    onClick={() => router.push('/dashboard')}
                    className="px-8 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                    <Home className="w-5 h-5" />
                    Back to Dashboard
                </button>
                <button
                    onClick={() => router.push('/assessment/role-discovery')}
                    className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2"
                >
                    <Target className="w-5 h-5" />
                    Continue to Career Discovery
                </button>
                <button
                    onClick={() => router.push('/assessment/cv-upload')}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                >
                    Upload New CV
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
