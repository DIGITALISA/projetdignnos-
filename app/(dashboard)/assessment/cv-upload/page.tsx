"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, CheckCircle, Loader2, FileText, AlertCircle, TrendingUp, TrendingDown, Target, Award, ArrowRight, BookOpen, Globe, Check, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇬🇧', nativeName: 'English' },
    { code: 'fr', name: 'French', flag: '🇫🇷', nativeName: 'Français' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦', nativeName: 'العربية' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
];

// ✅ تعريف نوع بيانات تحليل السيرة الذاتية
interface CVAnalysisResult {
    overallScore: number;
    verdict: string;
    overview: string;
    strengths: string[];
    weaknesses: string[];
    skills: {
        technical: string[];
        soft: string[];
        gaps: string[];
    };
    experience: {
        years: number;
        quality: string;
        progression: string;
    };
    education: {
        level: string;
        relevance: string;
        notes: string;
    };
    immediateActions: string[];
    careerPaths: string[];
}

export default function CVUploadPage() {
    const router = useRouter();
    const resultsRef = useRef<HTMLDivElement>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadComplete, setUploadComplete] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<CVAnalysisResult | null>(null);
    const [showResults, setShowResults] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        const checkProgress = async () => {
            try {
                const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
                const userId = userProfile.email || userProfile.fullName;

                let sessionFound = false;

                // ✅ 1. المصدر الأساسي: MongoDB عبر API الجديد
                if (userId) {
                    try {
                        const res = await fetch(`/api/user/progress?userId=${encodeURIComponent(userId)}`);
                        if (res.ok) {
                            const response = await res.json();

                            if (response.hasData && response.data) {
                                const data = response.data;
                                sessionFound = true;

                                // حفظ البيانات في localStorage كنسخة احتياطية
                                if (data.cvAnalysis) {
                                    localStorage.setItem('cvAnalysis', JSON.stringify(data.cvAnalysis));
                                }
                                if (data.language) {
                                    localStorage.setItem('selectedLanguage', data.language);
                                }
                                if (data.interviewEvaluation) {
                                    localStorage.setItem('interviewEvaluation', JSON.stringify(data.interviewEvaluation));
                                }
                                if (data.roleSuggestions) {
                                    localStorage.setItem('roleSuggestions', JSON.stringify(data.roleSuggestions));
                                }
                                if (data.selectedRole) {
                                    localStorage.setItem('selectedRole', JSON.stringify(data.selectedRole));
                                }
                                if (data.generatedDocuments) {
                                    localStorage.setItem('generatedDocuments', JSON.stringify(data.generatedDocuments));
                                }

                                // التوجيه بناءً على currentStep
                                switch (data.currentStep) {
                                    case 'interview_in_progress':
                                        router.push("/assessment/interview");
                                        return;
                                    case 'interview_complete':
                                        router.push("/assessment/results");
                                        return;
                                    case 'role_discovery':
                                        router.push("/assessment/role-discovery");
                                        return;
                                    case 'role_selected':
                                        router.push("/assessment/cv-generation");
                                        return;
                                    case 'completed':
                                        router.push("/dashboard");
                                        return;
                                    case 'analysis_complete':
                                        // عرض النتائج في هذه الصفحة
                                        if (data.cvAnalysis) {
                                            setAnalysisResult(data.cvAnalysis);
                                            setUploadComplete(true);
                                            setShowResults(true);
                                            setSelectedLanguage(data.language || 'en');
                                        }
                                        break;
                                }
                            }
                        }
                    } catch (err) {
                        console.error("❌ API check failed", err);
                    }
                }

                // 2. Fallback: LocalStorage (للضيوف أو في حالة فشل API)
                if (!sessionFound) {
                    const localAnalysis = localStorage.getItem('cvAnalysis');
                    const localLanguage = localStorage.getItem('selectedLanguage');

                    if (localAnalysis) {
                        try {
                            const parsedAnalysis = JSON.parse(localAnalysis);
                            if (parsedAnalysis && parsedAnalysis.overallScore) {
                                setAnalysisResult(parsedAnalysis);
                                setUploadComplete(true);
                                setShowResults(true);
                                if (localLanguage) setSelectedLanguage(localLanguage);
                            }
                        } catch (e) {
                            console.error("Failed to parse local analysis", e);
                        }
                    }
                }

            } catch (error) {
                console.error("Error checking progress:", error);
            }
        };

        checkProgress();
    }, [router]);

    const handleDownloadReport = async () => {
        if (!resultsRef.current) return;

        setIsDownloading(true);
        try {
            // 1. Clone the results element to manipulate it safely
            const element = resultsRef.current;
            const clone = element.cloneNode(true) as HTMLElement;

            // 2. Cleanup the clone: Remove the download button and other UI elements
            const ignoreElements = clone.querySelectorAll('[data-html2canvas-ignore], button');
            ignoreElements.forEach(el => el.remove());

            // 3. Robust Fix for 'lab()' and other unsupported color functions
            // We traverse all elements and replace any color that might cause html2canvas to fail
            const allElements = clone.querySelectorAll('*');
            allElements.forEach(el => {
                const htmlEl = el as HTMLElement;
                // Force a background color if it's potentially using something weird
                // but usually, it's enough to just let it be if we're not using lab() explicitly.
                // However, Tailwind/Modern browsers might.
                // Let's strip any 'lab(' from style attributes if present
                if (htmlEl.getAttribute('style')?.includes('lab(')) {
                    htmlEl.style.color = 'inherit';
                    htmlEl.style.backgroundColor = 'transparent';
                }
            });

            // 4. Append clone to body (off-screen)
            clone.style.position = "absolute";
            clone.style.left = "-9999px";
            clone.style.top = "0";
            clone.style.width = `${element.offsetWidth}px`;
            document.body.appendChild(clone);

            // 5. Capture the canvas
            const canvas = await html2canvas(clone, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: "#ffffff",
                scrollX: 0,
                scrollY: 0,
                onclone: (clonedDoc) => {
                    // Final safety check on the internal clone of html2canvas
                    const styles = clonedDoc.getElementsByTagName('style');
                    for (let i = 0; i < styles.length; i++) {
                        if (styles[i].innerHTML.includes('lab(')) {
                            styles[i].innerHTML = styles[i].innerHTML.replace(/lab\([^)]+\)/g, '#000000');
                        }
                    }
                }
            });

            // 6. Remove clone from DOM
            document.body.removeChild(clone);

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const imgProps = pdf.getImageProperties(imgData);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

            let heightLeft = imgHeight;
            let position = 0;

            // Add first page
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;

            // Add subsequent pages if content overflows
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            pdf.save(`CV-Analysis-Report-${fileName?.replace(/\s+/g, '-') || 'Expert'}.pdf`);
        } catch (error) {
            console.error("PDF generation failed:", error);
            alert("Failed to generate PDF report: " + (error instanceof Error ? error.message : "Internal Error"));
        } finally {
            setIsDownloading(false);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        // ... existing drag logic ...
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
        // ... existing process logic ...
        setFileName(file.name);
        setIsUploading(true);
        setShowResults(false);

        try {
            // Check file size (500MB = 500 * 1024 * 1024 bytes)
            const maxSize = 500 * 1024 * 1024; // 500MB in bytes
            if (file.size > maxSize) {
                throw new Error(`File size exceeds 500MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`);
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

            // Get user info from localStorage
            const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
            const userId = userProfile.email || userProfile.fullName || 'anonymous';
            const userName = userProfile.fullName || 'Anonymous User';

            // Call AI Analysis API with selected language
            const response = await fetch('/api/analyze-cv', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cvText,
                    language: selectedLanguage || 'en',
                    userId,
                    userName
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
                        <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
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
                                <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

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
                                                Supports PDF, DOCX, TXT (Max 500MB)
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
                    // Results Section
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Wrapper div for PDF capture */}
                        <div ref={resultsRef} style={{ backgroundColor: "#f8fafc", padding: "24px", borderRadius: "12px", fontFamily: "sans-serif" }}>

                            {/* Header */}
                            <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "24px", marginBottom: "24px", position: "relative", overflow: "hidden" }}>
                                <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", marginBottom: "16px" }}>
                                    <div>
                                        <h1 style={{ fontSize: "30px", fontWeight: "bold", color: "#0f172a", marginBottom: "8px" }}>CV Analysis Results</h1>
                                        <p style={{ color: "#64748b" }}>Honest feedback from our AI HR Expert</p>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 16px", backgroundColor: "#eff6ff", borderRadius: "12px", border: "1px solid #dbeafe" }}>
                                            <Award style={{ width: "20px", height: "20px", color: "#2563eb" }} />
                                            <div style={{ textAlign: "right" }}>
                                                <p style={{ fontSize: "12px", color: "#64748b", fontWeight: "500", margin: 0 }}>Overall Score</p>
                                                <p style={{ fontSize: "24px", fontWeight: "bold", color: "#2563eb", margin: 0 }}>{analysisResult?.overallScore || 0}/100</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleDownloadReport}
                                            disabled={isDownloading}
                                            data-html2canvas-ignore
                                            className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors bg-white border border-blue-200 px-3 py-1.5 rounded-lg shadow-sm hover:shadow-md"
                                        >
                                            {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                            {isDownloading ? 'Generating...' : 'Download Report'}
                                        </button>
                                    </div>
                                </div>

                                {/* Verdict */}
                                <div style={{ backgroundColor: "#eff6ff", borderRadius: "12px", padding: "16px", borderLeft: "4px solid #3b82f6", position: "relative", zIndex: 10 }}>
                                    <p style={{ color: "#334155", fontWeight: "500", fontStyle: "italic", margin: 0 }}>&ldquo;{analysisResult?.verdict}&rdquo;</p>
                                </div>
                            </div>

                            {/* Overview */}
                            <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "24px", marginBottom: "24px" }}>
                                <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#0f172a", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <Target style={{ width: "20px", height: "20px", color: "#9333ea" }} />
                                    Profile Overview
                                </h2>
                                <p style={{ color: "#475569", lineHeight: "1.6" }}>{analysisResult?.overview}</p>
                            </div>

                            {/* Strengths & Weaknesses */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
                                {/* Strengths */}
                                <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #bbf7d0", padding: "24px" }}>
                                    <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#15803d", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                                        <TrendingUp style={{ width: "20px", height: "20px" }} />
                                        Key Strengths
                                    </h2>
                                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                        {analysisResult?.strengths?.map((strength: string, i: number) => (
                                            <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", color: "#334155", marginBottom: "8px" }}>
                                                <CheckCircle style={{ width: "20px", height: "20px", color: "#22c55e", flexShrink: 0, marginTop: "2px" }} />
                                                <span>{strength}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Weaknesses */}
                                <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #fecaca", padding: "24px" }}>
                                    <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#b91c1c", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                                        <TrendingDown style={{ width: "20px", height: "20px" }} />
                                        Critical Weaknesses
                                    </h2>
                                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                        {analysisResult?.weaknesses?.map((weakness: string, i: number) => (
                                            <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", color: "#334155", marginBottom: "8px" }}>
                                                <AlertCircle style={{ width: "20px", height: "20px", color: "#ef4444", flexShrink: 0, marginTop: "2px" }} />
                                                <span>{weakness}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Skills Assessment */}
                            <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "24px", marginBottom: "24px" }}>
                                <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#0f172a", marginBottom: "16px" }}>Skills Assessment</h2>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px" }}>
                                    <div>
                                        <h3 style={{ fontWeight: "bold", color: "#1d4ed8", marginBottom: "8px" }}>Technical Skills</h3>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                            {analysisResult?.skills?.technical?.map((skill: string, i: number) => (
                                                <span key={i} style={{ padding: "4px 12px", backgroundColor: "#eff6ff", color: "#1d4ed8", borderRadius: "9999px", fontSize: "14px", fontWeight: "500", border: "1px solid #dbeafe" }}>
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 style={{ fontWeight: "bold", color: "#7e22ce", marginBottom: "8px" }}>Soft Skills</h3>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                            {analysisResult?.skills?.soft?.map((skill: string, i: number) => (
                                                <span key={i} style={{ padding: "4px 12px", backgroundColor: "#faf5ff", color: "#7e22ce", borderRadius: "9999px", fontSize: "14px", fontWeight: "500", border: "1px solid #f3e8ff" }}>
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 style={{ fontWeight: "bold", color: "#c2410c", marginBottom: "8px" }}>Skills Gaps</h3>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                            {analysisResult?.skills?.gaps?.map((skill: string, i: number) => (
                                                <span key={i} style={{ padding: "4px 12px", backgroundColor: "#fff7ed", color: "#c2410c", borderRadius: "9999px", fontSize: "14px", fontWeight: "500", border: "1px solid #ffedd5" }}>
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Experience & Education */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
                                <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "24px" }}>
                                    <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#0f172a", marginBottom: "16px" }}>Experience</h2>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <span style={{ color: "#475569" }}>Years:</span>
                                            <span style={{ fontWeight: "bold", color: "#0f172a" }}>{analysisResult?.experience?.years} years</span>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <span style={{ color: "#475569" }}>Level:</span>
                                            <span style={{ fontWeight: "bold", color: "#2563eb" }}>{analysisResult?.experience?.quality}</span>
                                        </div>
                                        <div style={{ paddingTop: "12px", borderTop: "1px solid #e2e8f0" }}>
                                            <p style={{ fontSize: "14px", color: "#475569" }}>{analysisResult?.experience?.progression}</p>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "24px" }}>
                                    <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#0f172a", marginBottom: "16px" }}>Education</h2>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <span style={{ color: "#475569" }}>Level:</span>
                                            <span style={{ fontWeight: "bold", color: "#0f172a" }}>{analysisResult?.education?.level}</span>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <span style={{ color: "#475569" }}>Relevance:</span>
                                            <span style={{
                                                fontWeight: "bold",
                                                color: analysisResult?.education?.relevance === 'High' ? '#16a34a' :
                                                    analysisResult?.education?.relevance === 'Medium' ? '#ca8a04' : '#dc2626'
                                            }}>{analysisResult?.education?.relevance}</span>
                                        </div>
                                        <div style={{ paddingTop: "12px", borderTop: "1px solid #e2e8f0" }}>
                                            <p style={{ fontSize: "14px", color: "#475569" }}>{analysisResult?.education?.notes}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Immediate Actions */}
                            <div style={{ background: "linear-gradient(to bottom right, #eff6ff, #faf5ff)", borderRadius: "16px", border: "1px solid #bfdbfe", padding: "24px", marginBottom: "24px" }}>
                                <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#0f172a", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <BookOpen style={{ width: "20px", height: "20px", color: "#2563eb" }} />
                                    Top 3 Immediate Actions
                                </h2>
                                <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
                                    {analysisResult?.immediateActions?.map((action: string, i: number) => (
                                        <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                                            <span style={{ flexShrink: 0, width: "28px", height: "28px", borderRadius: "9999px", backgroundColor: "#2563eb", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "14px" }}>
                                                {i + 1}
                                            </span>
                                            <span style={{ color: "#334155", paddingTop: "2px" }}>{action}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>

                            {/* Career Paths */}
                            <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "24px" }}>
                                <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#0f172a", marginBottom: "16px" }}>Recommended Career Paths</h2>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                    {analysisResult?.careerPaths?.map((path: string, i: number) => (
                                        <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                                            <ArrowRight style={{ width: "20px", height: "20px", color: "#2563eb", flexShrink: 0 }} />
                                            <span style={{ color: "#334155", fontWeight: "500" }}>{path}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons - Outside of PDF Capture */}
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
