"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, FileText, Mail, ArrowRight, CheckCircle, Sparkles, Download } from "lucide-react";
import { useRouter } from "next/navigation";

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

    // Generation Complete Screen
    if (generationComplete && generatedDocuments) {
        return (
            <div className="flex-1 p-4 md:p-8 max-w-6xl mx-auto space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl border-2 border-green-200 p-8 text-center"
                >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Documents Generated Successfully!</h1>
                    <p className="text-slate-600">Your professional CV and cover letter are ready</p>
                </motion.div>

                {/* Generated Documents Preview */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* CV Preview */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl border-2 border-blue-200 p-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">ATS-Optimized CV</h2>
                                <p className="text-sm text-slate-500">Tailored for {selectedRole?.title}</p>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-4 mb-4 max-h-96 overflow-y-auto">
                            <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans">
                                {generatedDocuments.cv}
                            </pre>
                        </div>

                        <button
                            onClick={() => {
                                const blob = new Blob([generatedDocuments.cv], { type: 'text/plain' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'CV_ATS_Optimized.txt';
                                a.click();
                            }}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                        >
                            <Download className="w-5 h-5" />
                            Download CV
                        </button>
                    </motion.div>

                    {/* Cover Letter Preview */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl border-2 border-purple-200 p-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <Mail className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Cover Letter</h2>
                                <p className="text-sm text-slate-500">Professional & Compelling</p>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-4 mb-4 max-h-96 overflow-y-auto">
                            <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans">
                                {generatedDocuments.coverLetter}
                            </pre>
                        </div>

                        <button
                            onClick={() => {
                                const blob = new Blob([generatedDocuments.coverLetter], { type: 'text/plain' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'Cover_Letter.txt';
                                a.click();
                            }}
                            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                        >
                            <Download className="w-5 h-5" />
                            Download Cover Letter
                        </button>
                    </motion.div>
                </div>

                {/* Professional Tips */}
                {generatedDocuments.professionalTips && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-2xl border border-slate-200 p-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <Sparkles className="w-6 h-6 text-yellow-600" />
                            <h3 className="text-xl font-bold text-slate-900">Professional Marketing Tips</h3>
                        </div>
                        <div className="prose prose-slate max-w-none">
                            <div className="text-slate-700 whitespace-pre-wrap">
                                {generatedDocuments.professionalTips}
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
