"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, TrendingUp, TrendingDown, Award, FileText, Target, ArrowRight, Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ResultsPage() {
    const router = useRouter();
    const [evaluation, setEvaluation] = useState<any>(null);

    useEffect(() => {
        const stored = localStorage.getItem('interviewEvaluation');
        if (stored) {
            setEvaluation(JSON.parse(stored));
        } else {
            // Redirect if no evaluation found
            router.push('/assessment/cv-upload');
        }
    }, [router]);

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
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-200 p-8"
            >
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Interview Evaluation Results</h1>
                        <p className="text-slate-600">Comprehensive analysis of your CV accuracy and capabilities</p>
                    </div>
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-blue-600">{evaluation.overallRating}</p>
                            <p className="text-xs text-slate-500">/ 10</p>
                        </div>
                    </div>
                </div>

                {/* Verdict */}
                <div className="bg-white rounded-xl p-4 border-l-4 border-blue-500">
                    <p className="text-slate-700 font-medium italic">"{evaluation.verdict}"</p>
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
                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
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
                                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
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
                                    <TrendingUp className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
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
                className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl border border-green-200 p-6"
            >
                <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-6 h-6 text-green-600" />
                    <h2 className="text-2xl font-bold text-slate-900">CV Improvement Recommendations</h2>
                </div>
                <p className="text-slate-600 mb-4">Specific changes to make your CV more accurate and effective:</p>
                <ol className="space-y-3">
                    {evaluation.cvImprovements?.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">
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
                            <ArrowRight className="w-5 h-5 text-orange-600 flex-shrink-0" />
                            <span className="text-slate-700 font-medium">{item}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Next Steps Banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border-2 border-purple-200 p-6"
            >
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Target className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">🎯 Next Step: Generate Your Professional Documents</h3>
                        <p className="text-slate-700 mb-4">
                            Ready to create your ATS-optimized CV and cover letter? Go to the <strong>Role Suggestions</strong> page,
                            select the role that best fits you, and click <strong>"Focus on This Role"</strong> to start the document generation process.
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
                    onClick={() => router.push('/assessment/role-suggestions')}
                    className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2"
                >
                    <Target className="w-5 h-5" />
                    View Role Suggestions
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
