"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, FileText, Mail, ArrowRight, CheckCircle, Sparkles, Download, Phone, MapPin, Linkedin, Globe, Briefcase, GraduationCap, Award } from "lucide-react";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface Message {
    role: 'ai' | 'user';
    content: string;
    timestamp: Date;
}

export default function CVGenerationPage() {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [cvAnalysis, setCvAnalysis] = useState<any>(null);
    const [interviewEvaluation, setInterviewEvaluation] = useState<any>(null);
    const [selectedRole, setSelectedRole] = useState<any>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [totalQuestions] = useState(6); // Focused questions for CV/Cover Letter
    const [generationComplete, setGenerationComplete] = useState(false);
    const [generatedDocuments, setGeneratedDocuments] = useState<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const cvRef = useRef<HTMLDivElement>(null);
    const letterRef = useRef<HTMLDivElement>(null);
    const [isExporting, setIsExporting] = useState<string | null>(null);

    useEffect(() => {
        const storedCV = localStorage.getItem('cvAnalysis');
        const storedEval = localStorage.getItem('interviewEvaluation');
        const storedRole = localStorage.getItem('selectedRole');
        const storedLanguage = localStorage.getItem('selectedLanguage');

        console.log('[CV Generation] Checking data:', {
            hasCV: !!storedCV,
            hasEval: !!storedEval,
            hasRole: !!storedRole
        });

        if (storedCV && storedEval && storedRole) {
            const cv = JSON.parse(storedCV);
            const evaluation = JSON.parse(storedEval);
            const role = JSON.parse(storedRole);

            setCvAnalysis(cv);
            setInterviewEvaluation(evaluation);
            setSelectedRole(role);
            setSelectedLanguage(storedLanguage || 'en');
            startCVGeneration(cv, evaluation, role, storedLanguage || 'en');
        } else {
            console.log('[CV Generation] Missing data, redirecting');
            router.push('/assessment/role-suggestions');
        }
    }, [router]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const startCVGeneration = async (cv: any, evaluation: any, role: any, language: string) => {
        setIsLoading(true);
        try {
            console.log('[CV Generation] Starting with role:', role.title);

            const response = await fetch('/api/cv-generation/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cvAnalysis: cv,
                    interviewEvaluation: evaluation,
                    selectedRole: role,
                    language
                }),
            });

            const result = await response.json();
            console.log('[CV Generation] Start result:', result);

            if (result.success) {
                setMessages([
                    {
                        role: 'ai',
                        content: result.welcomeMessage,
                        timestamp: new Date(),
                    },
                    {
                        role: 'ai',
                        content: result.firstQuestion,
                        timestamp: new Date(),
                    }
                ]);
                setCurrentQuestionIndex(1);
            }
        } catch (error) {
            console.error('Error starting CV generation:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: inputValue,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        try {
            if (currentQuestionIndex >= totalQuestions) {
                // Generate final CV and Cover Letter
                const response = await fetch('/api/cv-generation/complete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cvAnalysis,
                        interviewEvaluation,
                        selectedRole,
                        conversationHistory: [...messages, userMessage],
                        language: selectedLanguage,
                    }),
                });

                const result = await response.json();

                if (result.success) {
                    setGeneratedDocuments(result.documents);
                    setGenerationComplete(true);

                    const aiMessage: Message = {
                        role: 'ai',
                        content: result.completionMessage,
                        timestamp: new Date(),
                    };
                    setMessages(prev => [...prev, aiMessage]);
                }
            } else {
                // Get next question
                const response = await fetch('/api/cv-generation/next-question', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cvAnalysis,
                        interviewEvaluation,
                        selectedRole,
                        conversationHistory: [...messages, userMessage],
                        language: selectedLanguage,
                        questionNumber: currentQuestionIndex + 1,
                        totalQuestions,
                    }),
                });

                const result = await response.json();

                if (result.success) {
                    const aiMessage: Message = {
                        role: 'ai',
                        content: result.question,
                        timestamp: new Date(),
                    };
                    setMessages(prev => [...prev, aiMessage]);
                    setCurrentQuestionIndex(prev => prev + 1);
                }
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSkipQuestion = async () => {
        if (isLoading) return;

        const skipMessages: Record<string, string> = {
            'en': "I prefer to skip this question.",
            'fr': "Je préfère passer cette question.",
            'ar': "أفضل تخطي هذا السؤال.",
            'es': "Prefiero omitir esta pregunta.",
        };

        const userMessage: Message = {
            role: 'user',
            content: skipMessages[selectedLanguage] || skipMessages['en'],
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            if (currentQuestionIndex >= totalQuestions) {
                const response = await fetch('/api/cv-generation/complete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cvAnalysis,
                        interviewEvaluation,
                        selectedRole,
                        conversationHistory: [...messages, userMessage],
                        language: selectedLanguage,
                    }),
                });

                const result = await response.json();

                if (result.success) {
                    setGeneratedDocuments(result.documents);
                    setGenerationComplete(true);

                    const aiMessage: Message = {
                        role: 'ai',
                        content: result.completionMessage,
                        timestamp: new Date(),
                    };
                    setMessages(prev => [...prev, aiMessage]);
                }
            } else {
                const response = await fetch('/api/cv-generation/next-question', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cvAnalysis,
                        interviewEvaluation,
                        selectedRole,
                        conversationHistory: [...messages, userMessage],
                        language: selectedLanguage,
                        questionNumber: currentQuestionIndex + 1,
                        totalQuestions,
                    }),
                });

                const result = await response.json();

                if (result.success) {
                    const aiMessage: Message = {
                        role: 'ai',
                        content: result.question,
                        timestamp: new Date(),
                    };
                    setMessages(prev => [...prev, aiMessage]);
                    setCurrentQuestionIndex(prev => prev + 1);
                }
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadPDF = async (ref: React.RefObject<HTMLDivElement | null>, filename: string) => {
        if (!ref.current) return;
        setIsExporting(filename);
        try {
            const element = ref.current;
            const canvas = await html2canvas(element, {
                scale: 3, // Very high quality for documents
                useCORS: true,
                backgroundColor: "#ffffff",
                onclone: (clonedDoc) => {
                    const el = clonedDoc.getElementById('printable-doc');
                    if (el) {
                        (el as HTMLElement).style.display = 'block';
                        (el as HTMLElement).style.padding = '0';
                    }
                }
            });

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

            pdf.save(`${filename}.pdf`);
        } catch (error) {
            console.error("Export failed:", error);
            alert("Failed to export PDF");
        } finally {
            setIsExporting(null);
        }
    };

    // Generation Complete Screen
    if (generationComplete && generatedDocuments) {
        return (
            <div className="flex-1 p-4 md:p-8 max-w-6xl mx-auto space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl border-2 border-green-200 p-8 text-center"
                >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Documents Generated Successfully!</h1>
                    <p className="text-slate-600">Your professional ATS-optimized CV and cover letter are ready</p>
                </motion.div>

                {/* Generated Documents Preview */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* CV Column */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-600" />
                                ATS-Optimized CV
                            </h2>
                            <button
                                onClick={() => handleDownloadPDF(cvRef, `CV-${generatedDocuments.cv.personalDetails?.fullName?.replace(/\s+/g, '_') || 'Professional'}`)}
                                disabled={!!isExporting}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-600/20 text-sm"
                            >
                                {isExporting && isExporting.startsWith('CV-') ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                Download PDF
                            </button>
                        </div>

                        {/* CV Preview Scrollbox */}
                        <div className="bg-slate-200 rounded-2xl p-4 md:p-8 overflow-y-auto max-h-[800px] shadow-inner border border-slate-300 custom-scrollbar">
                            <div ref={cvRef}>
                                <CVDocument data={generatedDocuments.cv} language={selectedLanguage} />
                            </div>
                        </div>
                    </div>

                    {/* Cover Letter Column */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <Mail className="w-5 h-5 text-purple-600" />
                                Professional Cover Letter
                            </h2>
                            <button
                                onClick={() => handleDownloadPDF(letterRef, 'Cover_Letter')}
                                disabled={!!isExporting}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-bold shadow-lg shadow-purple-600/20 text-sm"
                            >
                                {isExporting === 'Cover_Letter' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                Download PDF
                            </button>
                        </div>

                        {/* Letter Preview Scrollbox */}
                        <div className="bg-slate-200 rounded-2xl p-4 md:p-8 overflow-y-auto max-h-[800px] shadow-inner border border-slate-300 custom-scrollbar">
                            <div ref={letterRef}>
                                <LetterDocument
                                    content={generatedDocuments.coverLetter}
                                    fullName={generatedDocuments.cv.personalDetails?.fullName}
                                    jobTitle={generatedDocuments.cv.personalDetails?.jobTitle}
                                    language={selectedLanguage}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Professional Tips - REIMAGINED UI */}
                {generatedDocuments.professionalTips && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="relative group overflow-hidden"
                    >
                        {/* Animated Gradient Background for Border Effect */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-400 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>

                        <div className="relative bg-white rounded-2xl p-8 md:p-10 shadow-xl border border-yellow-100 flex flex-col md:flex-row gap-8">
                            {/* Sticky Sidebar for Title */}
                            <div className="md:w-1/3">
                                <div className="sticky top-0">
                                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg mb-6 transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                        <Sparkles className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">
                                        Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600">Marketing Tips</span>
                                    </h3>
                                    <p className="text-slate-500 text-lg font-medium leading-relaxed">
                                        Expert strategy to showcase your profile and stand out from other candidates.
                                    </p>

                                    <div className="mt-10 hidden md:block">
                                        <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                                            <p className="text-sm text-yellow-800 font-bold mb-2 flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-yellow-600 animate-pulse"></div>
                                                Expert Strategy
                                            </p>
                                            <p className="text-xs text-yellow-700 leading-relaxed">
                                                These tips are generated based on local market trends and HR best practices.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Content Area */}
                            <div className="flex-1 space-y-6">
                                <div className="grid gap-4">
                                    {generatedDocuments.professionalTips
                                        .split(/\n(?=\d+\.)/) // Split by numbered lists
                                        .map((tip: string, idx: number) => {
                                            const cleanTip = tip.replace(/^\d+\.\s*/, '').trim();
                                            if (!cleanTip) return null;

                                            return (
                                                <motion.div
                                                    key={idx}
                                                    whileHover={{ x: 5 }}
                                                    className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition-all group/tip"
                                                >
                                                    <div className="flex gap-4">
                                                        <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center font-black text-slate-900 text-lg group-hover/tip:text-yellow-600 group-hover/tip:border-yellow-200 transition-colors">
                                                            {idx + 1}
                                                        </span>
                                                        <p className="text-slate-700 leading-relaxed font-medium pt-1">
                                                            {cleanTip}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                </div>

                                {/* Premium Keywords Display */}
                                {generatedDocuments.keywords && (
                                    <div className="mt-12 pt-8 border-t border-slate-100">
                                        <div className="flex items-center gap-2 mb-6">
                                            <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-black uppercase tracking-widest">
                                                ATS Core
                                            </div>
                                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Optimization Keywords</h4>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {generatedDocuments.keywords.map((kw: string, i: number) => (
                                                <motion.span
                                                    key={i}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:border-blue-400 hover:text-blue-600 hover:shadow-lg hover:shadow-blue-500/10 transition-all cursor-default"
                                                >
                                                    {kw}
                                                </motion.span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Next Step Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border-2 border-purple-200 p-6"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <Sparkles className="w-6 h-6 text-purple-600" />
                        <h3 className="text-xl font-bold text-slate-900">Ready for the Final Step?</h3>
                    </div>
                    <p className="text-slate-700 mb-4">
                        Test your skills in real-world scenarios! Practice as a <strong>{selectedRole?.title}</strong> and get AI-powered feedback on your performance.
                    </p>
                </motion.div>

                <button
                    onClick={() => {
                        // Store generated documents for simulation
                        localStorage.setItem('generatedDocuments', JSON.stringify(generatedDocuments));
                        router.push('/assessment/simulation');
                    }}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                >
                    Start Role Simulation
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-[calc(100vh-8rem)]">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">CV & Cover Letter Generation</h1>
                    <p className="text-slate-500">
                        Let's create your professional documents for: <span className="font-semibold text-blue-600">{selectedRole?.title}</span>
                    </p>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm text-slate-500">Progress</p>
                        <p className="text-lg font-bold text-blue-600">{currentQuestionIndex}/{totalQuestions}</p>
                    </div>
                    <div className="w-16 h-16 rounded-full border-4 border-slate-200 flex items-center justify-center">
                        <span className="text-lg font-bold text-slate-700">
                            {Math.round((currentQuestionIndex / totalQuestions) * 100)}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 overflow-y-auto mb-4">
                <div className="space-y-6">
                    {messages.map((message, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                                {message.role === 'ai' && (
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                            <FileText className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <span className="text-sm font-medium text-slate-600">HR Expert</span>
                                    </div>
                                )}

                                <div className={`rounded-2xl p-4 ${message.role === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-50 text-slate-900'
                                    }`}>
                                    <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                </div>

                                <span className="text-xs text-slate-400 mt-1 block">
                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </motion.div>
                    ))}

                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start"
                        >
                            <div className="flex items-center gap-2 bg-slate-50 rounded-2xl p-4">
                                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                                <span className="text-slate-600">Analyzing your response...</span>
                            </div>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                        placeholder="Type your answer here..."
                        disabled={isLoading || generationComplete}
                        className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    />
                    <button
                        onClick={handleSkipQuestion}
                        disabled={isLoading || generationComplete}
                        className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <ArrowRight className="w-5 h-5" />
                        {selectedLanguage === 'ar' ? 'تخطي' :
                            selectedLanguage === 'fr' ? 'Passer' :
                                selectedLanguage === 'es' ? 'Saltar' : 'Skip'}
                    </button>
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isLoading || generationComplete}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Send className="w-5 h-5" />
                        {selectedLanguage === 'ar' ? 'إرسال' :
                            selectedLanguage === 'fr' ? 'Envoyer' :
                                selectedLanguage === 'es' ? 'Enviar' : 'Send'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// PREMIUM CV DOCUMENT COMPONENT
function CVDocument({ data, language }: { data: any, language: string }) {
    const isAR = language === 'ar';

    // Labels based on language
    const labels: Record<string, any> = {
        en: { summary: "Professional Summary", experience: "Professional Experience", education: "Education", skills: "Skills", tech: "Technical", tools: "Tools", soft: "Soft Skills", lang: "Languages", certs: "Certifications" },
        fr: { summary: "Résumé Professionnel", experience: "Expérience Professionnelle", education: "Formation", skills: "Compétences", tech: "Techniques", tools: "Outils", soft: "Qualités", lang: "Langues", certs: "Certifications" },
        ar: { summary: "الملخص المهني", experience: "الخبرة المهنية", education: "التعليم", skills: "المهارات", tech: "تقنية", tools: "أدوات", soft: "شخصية", lang: "اللغات", certs: "الشهادات" },
    };

    const t = labels[language] || labels.en;

    return (
        <div id="printable-doc" className={`bg-white w-full max-w-[210mm] min-h-[297mm] p-12 text-slate-800 shadow-xl mx-auto rounded-xl ${isAR ? 'text-right' : 'text-left'}`} dir={isAR ? 'rtl' : 'ltr'}>
            {/* Header */}
            <header className="border-b-2 border-blue-600 pb-6 mb-8">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-2">{data.personalDetails?.fullName}</h1>
                <p className="text-xl text-blue-600 font-bold mb-4">{data.personalDetails?.jobTitle}</p>

                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    {data.personalDetails?.email && <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {data.personalDetails.email}</span>}
                    {data.personalDetails?.phone && <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {data.personalDetails.phone}</span>}
                    {data.personalDetails?.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {data.personalDetails.location}</span>}
                    {data.personalDetails?.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-4 h-4" /> {data.personalDetails.linkedin}</span>}
                </div>
            </header>

            {/* Content Body */}
            <div className="space-y-8">
                {/* Summary */}
                <section>
                    <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-3 border-b border-slate-200 pb-1">{t.summary}</h2>
                    <p className="leading-relaxed text-slate-700">{data.professionalSummary}</p>
                </section>

                <div className="grid grid-cols-3 gap-8">
                    {/* Left Column (Main Content) */}
                    <div className="col-span-2 space-y-8">
                        {/* Experience */}
                        <section>
                            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-1">{t.experience}</h2>
                            <div className="space-y-6">
                                {data.experience?.map((exp: any, i: number) => (
                                    <div key={i} className="relative">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-slate-900">{exp.title}</h3>
                                            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{exp.period}</span>
                                        </div>
                                        <p className="text-sm font-semibold text-blue-600 mb-2">{exp.company} • {exp.location}</p>
                                        <ul className="list-disc list-outside ml-4 space-y-1 text-sm text-slate-600">
                                            {exp.highlights?.map((point: string, j: number) => (
                                                <li key={j}>{point}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Education */}
                        <section>
                            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-1">{t.education}</h2>
                            <div className="space-y-4">
                                {data.education?.map((edu: any, i: number) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-slate-900">{edu.degree}</h4>
                                            <span className="text-xs font-bold text-slate-500">{edu.period}</span>
                                        </div>
                                        <p className="text-sm text-slate-600">{edu.institution} • {edu.location}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column (Sidebar) */}
                    <div className="space-y-8">
                        {/* Skills */}
                        <section>
                            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-1">{t.skills}</h2>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xs font-bold text-blue-600 uppercase mb-2">{t.tech}</h3>
                                    <div className="flex flex-wrap gap-1">
                                        {data.skills?.technical?.map((s: string, i: number) => (
                                            <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded border border-blue-100">{s}</span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-purple-600 uppercase mb-2">{t.tools}</h3>
                                    <div className="flex flex-wrap gap-1">
                                        {data.skills?.tools?.map((s: string, i: number) => (
                                            <span key={i} className="px-2 py-1 bg-purple-50 text-purple-700 text-[10px] font-bold rounded border border-purple-100">{s}</span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-emerald-600 uppercase mb-2">{t.soft}</h3>
                                    <div className="flex flex-wrap gap-1">
                                        {data.skills?.soft?.map((s: string, i: number) => (
                                            <span key={i} className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-100">{s}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Languages */}
                        {data.languages?.length > 0 && (
                            <section>
                                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-3 border-b border-slate-200 pb-1">{t.lang}</h2>
                                <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                                    {data.languages.map((l: string, i: number) => (
                                        <span key={i}>{l}</span>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Certifications */}
                        {data.certifications?.length > 0 && (
                            <section>
                                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-3 border-b border-slate-200 pb-1">{t.certs}</h2>
                                <div className="space-y-2">
                                    {data.certifications.map((c: string, i: number) => (
                                        <div key={i} className="flex gap-2 text-sm text-slate-600">
                                            <Award className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                                            <span>{c}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// PROFESSIONAL COVER LETTER DOCUMENT COMPONENT
function LetterDocument({ content, fullName, jobTitle, language }: { content: string, fullName: string, jobTitle: string, language: string }) {
    const isAR = language === 'ar';
    const date = new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : language === 'fr' ? 'fr-FR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div id="printable-doc" className={`bg-white w-full max-w-[210mm] min-h-[297mm] p-20 text-slate-800 shadow-xl mx-auto rounded-xl ${isAR ? 'text-right' : 'text-left'}`} dir={isAR ? 'rtl' : 'ltr'}>
            <div className="border-b-2 border-slate-100 pb-10 mb-10">
                <h1 className="text-3xl font-bold text-slate-900 mb-1">{fullName}</h1>
                <p className="text-slate-500 uppercase tracking-widest text-sm">{jobTitle}</p>
            </div>

            <p className="text-slate-500 mb-8">{date}</p>

            <div className="prose prose-slate max-w-none">
                <div className="text-slate-700 leading-[1.8] whitespace-pre-wrap text-lg">
                    {content}
                </div>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-100">
                <p className="font-bold text-slate-900">{fullName}</p>
            </div>
        </div>
    );
}
