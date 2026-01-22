"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, CheckCircle, Loader2, FileText, AlertCircle, TrendingUp, TrendingDown, Target, Award, ArrowRight, BookOpen, Globe, Check } from "lucide-react";
import { useRouter } from "next/navigation";

const LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇬🇧', nativeName: 'English' },
    { code: 'fr', name: 'French', flag: '🇫🇷', nativeName: 'Français' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦', nativeName: 'العربية' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
];

export default function CVUploadPage() {
    const router = useRouter();
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadComplete, setUploadComplete] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [showResults, setShowResults] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => setIsDragOver(false);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) processFile(files[0]);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            processFile(e.target.files[0]);
        }
    };

    const processFile = async (file: File) => {
        setFileName(file.name);
        setIsUploading(true);
        setShowResults(false);

        try {
            // Check file size (100MB = 100 * 1024 * 1024 bytes)
            const maxSize = 100 * 1024 * 1024; // 100MB in bytes
            if (file.size > maxSize) {
                throw new Error(`File size exceeds 100MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`);
            }

            let cvText = '';

            // Handle different file types
            if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
                cvText = await file.text();
            } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
                cvText = await file.text();
            } else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
                cvText = await file.text();
            } else {
                throw new Error('Unsupported file type. Please upload PDF, DOCX, or TXT file.');
            }

            if (!cvText || cvText.trim().length < 50) {
                throw new Error('CV content is too short or could not be extracted. Please ensure your file contains text.');
            }

            console.log('Sending CV text to API:', cvText.substring(0, 200) + '...');

            // Call AI Analysis API with selected language
            const response = await fetch('/api/analyze-cv', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cvText,
                    language: selectedLanguage || 'en'
                }),
            });

            const result = await response.json();
            console.log('API Response:', result);

            if (!response.ok) {
                throw new Error(result.error || `Server error: ${response.status}`);
            }

            if (result.success && result.analysis) {
                setAnalysisResult(result.analysis);
                setUploadComplete(true);
                setIsUploading(false);

                // Show results after a brief delay
                setTimeout(() => {
                    setShowResults(true);
                }, 500);

                // Store analysis in localStorage for interview page
                localStorage.setItem('cvAnalysis', JSON.stringify(result.analysis));
                localStorage.setItem('selectedLanguage', selectedLanguage || 'en');
            } else {
                throw new Error(result.error || 'Analysis failed - no data returned');
            }
        } catch (error) {
            console.error('Upload error:', error);
            setIsUploading(false);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            alert(`Failed to analyze CV: ${errorMessage}\n\nPlease try again or contact support.`);
        }
    };

    const proceedToInterview = () => {
        router.push("/assessment/interview");
    };

    const resetUpload = () => {
        setShowResults(false);
        setUploadComplete(false);
        setAnalysisResult(null);
        setFileName(null);
    };

    // Language Selection Screen
    if (!selectedLanguage) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 md:p-12"
                >
                    <div className="text-center mb-10">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <Globe className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                            Choose Your Language
                        </h1>
                        <p className="text-slate-500 text-lg">
                            Select your preferred language for CV analysis and feedback
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {LANGUAGES.map((lang) => (
                            <motion.button
                                key={lang.code}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedLanguage(lang.code)}
                                className="group relative p-6 bg-slate-50 hover:bg-blue-50 border-2 border-slate-200 hover:border-blue-500 rounded-2xl transition-all text-left overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="relative flex items-center gap-4">
                                    <div className="text-5xl">{lang.flag}</div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-slate-900 mb-1">
                                            {lang.nativeName}
                                        </h3>
                                        <p className="text-sm text-slate-500">{lang.name}</p>
                                    </div>
                                    <div className="w-6 h-6 rounded-full border-2 border-slate-300 group-hover:border-blue-500 group-hover:bg-blue-500 flex items-center justify-center transition-all">
                                        <Check className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <p className="text-sm text-blue-800 text-center">
                            <strong>Note:</strong> All feedback and analysis will be provided in your selected language
                        </p>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
                {!showResults ? (
                    // Upload Section
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-12 text-center"
                    >
                        <div className="mb-8 flex items-center justify-between">
                            <div className="text-left flex-1">
                                <h1 className="text-3xl font-bold mb-3 text-slate-900">Upload Your Resume</h1>
                                <p className="text-slate-500 text-lg">
                                    Our AI engine will analyze your experience, skills, and potential gaps.
                                </p>
                            </div>

                            {/* Language Badge */}
                            <button
                                onClick={() => setSelectedLanguage(null)}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all ml-4"
                                title="Change language"
                            >
                                <span className="text-2xl">
                                    {LANGUAGES.find(l => l.code === selectedLanguage)?.flag}
                                </span>
                                <span className="text-sm font-medium text-slate-700">
                                    {LANGUAGES.find(l => l.code === selectedLanguage)?.name}
                                </span>
                            </button>
                        </div>

                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`
                                relative group h-80 flex flex-col items-center justify-center
                                border-3 border-dashed rounded-2xl transition-all duration-300
                                ${isDragOver ? "border-blue-500 bg-blue-50 scale-[1.02]" : "border-slate-200 bg-slate-50 hover:border-blue-400 hover:bg-slate-100"}
                                ${uploadComplete ? "border-green-500/50 bg-green-50" : ""}
                            `}
                        >
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx,.txt"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                onChange={handleFileInput}
                                disabled={isUploading || uploadComplete}
                            />

                            <div className="flex flex-col items-center justify-center gap-6 relative z-10 pointer-events-none p-6">
                                <AnimatePresence mode="wait">
                                    {!isUploading && !uploadComplete && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex flex-col items-center"
                                        >
                                            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform shadow-sm">
                                                <UploadCloud className="w-10 h-10" />
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                                                Drag & Drop your resume
                                            </h3>
                                            <p className="text-base text-slate-500">
                                                Supports PDF, DOCX, TXT (Max 100MB)
                                            </p>
                                            <button className="mt-6 px-6 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium shadow-sm group-hover:border-blue-400 group-hover:text-blue-600 transition-colors">
                                                Browse Files
                                            </button>
                                        </motion.div>
                                    )}

                                    {isUploading && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex flex-col items-center"
                                        >
                                            <div className="w-24 h-24 rounded-full border-4 border-blue-100 border-t-blue-600 flex items-center justify-center mb-6 animate-spin">
                                                <Loader2 className="w-10 h-10 text-transparent" />
                                            </div>
                                            <h3 className="text-xl font-bold text-blue-600 mb-2">
                                                AI Analyzing Profile...
                                            </h3>
                                            <p className="text-base text-slate-500">
                                                Extracting skills, experience, and career insights.
                                            </p>
                                            {fileName && (
                                                <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                                                    <FileText className="w-4 h-4" />
                                                    <span>{fileName}</span>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}

                                    {uploadComplete && !showResults && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex flex-col items-center"
                                        >
                                            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
                                                <CheckCircle className="w-12 h-12 text-green-600" />
                                            </div>
                                            <h3 className="text-xl font-bold text-green-600 mb-2">
                                                Analysis Complete!
                                            </h3>
                                            <p className="text-base text-slate-500">
                                                Preparing your detailed feedback...
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    // Results Section (same as before)
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Header */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-900 mb-2">CV Analysis Results</h1>
                                    <p className="text-slate-500">Honest feedback from our AI HR Expert</p>
                                </div>
                                <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-xl border border-blue-100">
                                    <Award className="w-5 h-5 text-blue-600" />
                                    <div className="text-right">
                                        <p className="text-xs text-slate-500 font-medium">Overall Score</p>
                                        <p className="text-2xl font-bold text-blue-600">{analysisResult?.overallScore || 0}/100</p>
                                    </div>
                                </div>
                            </div>

                            {/* Verdict */}
                            <div className="bg-slate-50 rounded-xl p-4 border-l-4 border-blue-500">
                                <p className="text-slate-700 font-medium italic">"{analysisResult?.verdict}"</p>
                            </div>
                        </div>

                        {/* Overview */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6">
                            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <Target className="w-5 h-5 text-purple-600" />
                                Profile Overview
                            </h2>
                            <p className="text-slate-600 leading-relaxed">{analysisResult?.overview}</p>
                        </div>

                        {/* Strengths & Weaknesses */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Strengths */}
                            <div className="bg-white rounded-2xl border border-green-200 p-6">
                                <h2 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" />
                                    Key Strengths
                                </h2>
                                <ul className="space-y-2">
                                    {analysisResult?.strengths?.map((strength: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-slate-700">
                                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span>{strength}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Weaknesses */}
                            <div className="bg-white rounded-2xl border border-red-200 p-6">
                                <h2 className="text-xl font-bold text-red-700 mb-4 flex items-center gap-2">
                                    <TrendingDown className="w-5 h-5" />
                                    Critical Weaknesses
                                </h2>
                                <ul className="space-y-2">
                                    {analysisResult?.weaknesses?.map((weakness: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-slate-700">
                                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                            <span>{weakness}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Skills Assessment */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Skills Assessment</h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <h3 className="font-bold text-blue-700 mb-2">Technical Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {analysisResult?.skills?.technical?.map((skill: string, i: number) => (
                                            <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-purple-700 mb-2">Soft Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {analysisResult?.skills?.soft?.map((skill: string, i: number) => (
                                            <span key={i} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-100">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-orange-700 mb-2">Skills Gaps</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {analysisResult?.skills?.gaps?.map((skill: string, i: number) => (
                                            <span key={i} className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm font-medium border border-orange-100">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Experience & Education */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                                <h2 className="text-xl font-bold text-slate-900 mb-4">Experience</h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-600">Years:</span>
                                        <span className="font-bold text-slate-900">{analysisResult?.experience?.years} years</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-600">Level:</span>
                                        <span className="font-bold text-blue-600">{analysisResult?.experience?.quality}</span>
                                    </div>
                                    <div className="pt-3 border-t">
                                        <p className="text-sm text-slate-600">{analysisResult?.experience?.progression}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                                <h2 className="text-xl font-bold text-slate-900 mb-4">Education</h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-600">Level:</span>
                                        <span className="font-bold text-slate-900">{analysisResult?.education?.level}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-600">Relevance:</span>
                                        <span className={`font-bold ${analysisResult?.education?.relevance === 'High' ? 'text-green-600' :
                                            analysisResult?.education?.relevance === 'Medium' ? 'text-yellow-600' :
                                                'text-red-600'
                                            }`}>{analysisResult?.education?.relevance}</span>
                                    </div>
                                    <div className="pt-3 border-t">
                                        <p className="text-sm text-slate-600">{analysisResult?.education?.notes}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Immediate Actions */}
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-200 p-6">
                            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-blue-600" />
                                Top 3 Immediate Actions
                            </h2>
                            <ol className="space-y-3">
                                {analysisResult?.immediateActions?.map((action: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                                            {i + 1}
                                        </span>
                                        <span className="text-slate-700 pt-0.5">{action}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        {/* Career Paths */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Recommended Career Paths</h2>
                            <div className="grid md:grid-cols-2 gap-3">
                                {analysisResult?.careerPaths?.map((path: string, i: number) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                                        <ArrowRight className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                        <span className="text-slate-700 font-medium">{path}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 justify-center pt-4">
                            <button
                                onClick={resetUpload}
                                className="px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all"
                            >
                                Upload Another CV
                            </button>
                            <button
                                onClick={proceedToInterview}
                                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
                            >
                                Continue to Interview
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
