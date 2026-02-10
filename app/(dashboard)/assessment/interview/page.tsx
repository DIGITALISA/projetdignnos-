"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, Sparkles, Globe, CheckCircle, AlertCircle, TrendingUp, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface Message {
    role: 'ai' | 'user';
    content: string;
    timestamp: Date;
}

const LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇬🇧', nativeName: 'English' },
    { code: 'fr', name: 'French', flag: '🇫🇷', nativeName: 'Français' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦', nativeName: 'العربية' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
];

export default function InterviewPage() {
    const router = useRouter();
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [cvAnalysis, setCvAnalysis] = useState<Record<string, unknown> | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(15); // Default 15 questions
    const [interviewComplete, setInterviewComplete] = useState(false);
    const [finalEvaluation, setFinalEvaluation] = useState<Record<string, unknown> | null>(null);
    const [diagnosisId, setDiagnosisId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const isEvaluatingRef = useRef(false);

    useEffect(() => {
        const loadSession = async () => {
            const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
            const userId = userProfile.email || userProfile.fullName;

            // First check URL/API for active session
            if (userId) {
                try {
                    const res = await fetch(`/api/assessment/progress?userId=${encodeURIComponent(userId)}`);
                    const data = await res.json();

                    if (data.hasActiveSession) {
                        setDiagnosisId(data.diagnosisId);
                        if (data.analysis) setCvAnalysis(data.analysis);
                        if (data.language) setSelectedLanguage(data.language);
                        if (data.totalQuestions) setTotalQuestions(data.totalQuestions);

                        if (data.evaluation) {
                            setFinalEvaluation(data.evaluation);
                            setInterviewComplete(true);
                            
                            // Restore to localStorage for other components
                            localStorage.setItem('interviewEvaluation', JSON.stringify(data.evaluation));
                            
                            // Update user profile status if needed
                            const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
                            if (!profile.isDiagnosisComplete) {
                                profile.isDiagnosisComplete = true;
                                profile.diagnosisData = data.evaluation;
                                localStorage.setItem("userProfile", JSON.stringify(profile));
                            }
                        }

                        if (data.currentStep === 'interview_complete' || data.currentStep === 'completed') {
                            // If we have messages, we might want to stay on page to show summary
                            // but if evaluate API already set currentStep, we should be in interviewComplete state
                            if (data.evaluation) {
                                setInterviewComplete(true);
                            } else {
                                router.push('/assessment/results');
                                return;
                            }
                        }

                        if (data.conversationHistory && data.conversationHistory.length > 0) {
                            // Resume existing chat
                            const restoredMessages = data.conversationHistory.map((m: { role: 'ai' | 'user', content: string, timestamp: string }) => ({
                                ...m,
                                timestamp: new Date(m.timestamp)
                            }));
                            setMessages(restoredMessages);

                            // Calculate current index accurately, capped by total
                            const calculatedIndex = Math.floor(restoredMessages.length / 2);
                            const finalIndex = Math.min(calculatedIndex, data.totalQuestions || 15);
                            setCurrentQuestionIndex(finalIndex);

                            // Auto-complete if at the end and we have no evaluation yet but messages are done
                            if (finalIndex >= (data.totalQuestions || 15) && !data.evaluation) {
                                // Potentially we are at the very last step but evaluation didn't run or save
                                console.log("At final step but no evaluation - user can still click send/skip to retry or it will auto-evaluate if they send a last message");
                            }

                            return;
                        }
                    }
                } catch (e) {
                    console.error("Failed to load session", e);
                }
            }

            // Fallback to localStorage (new session flow)
            const stored = localStorage.getItem('cvAnalysis');
            const storedLanguage = localStorage.getItem('selectedLanguage');

            if (stored && !cvAnalysis) {
                const analysis = JSON.parse(stored);
                setCvAnalysis(analysis);
            }

            if (storedLanguage && !selectedLanguage) {
                setSelectedLanguage(storedLanguage);
            }
        };

        loadSession();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array intentionally to run only on mount

    const startInterview = useCallback(async () => {
        if (messages.length > 0) return;
        setIsLoading(true);
        try {
            const response = await fetch('/api/interview/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cvAnalysis, language: selectedLanguage }),
            });

            const result = await response.json();

            if (result.success) {
                setTotalQuestions(result.totalQuestions || 15);
                const welcomeMsg = {
                    role: 'ai' as const,
                    content: result.welcomeMessage,
                    timestamp: new Date(),
                };

                setMessages([welcomeMsg]);

                // Add first question
                setTimeout(() => {
                    const q1 = {
                        role: 'ai' as const,
                        content: result.firstQuestion,
                        timestamp: new Date(),
                    };
                    setMessages(prev => [...prev, q1]);
                    setCurrentQuestionIndex(1);
                }, 1000);
            }
        } catch (error) {
            console.error('Error starting interview:', error);
        } finally {
            setIsLoading(false);
        }
    }, [cvAnalysis, messages.length, selectedLanguage]);

    useEffect(() => {
        // Start interview ONLY if we have analysis + language AND NO messages yet
        const shouldStart = selectedLanguage && cvAnalysis && messages.length === 0 && !isLoading;
        if (shouldStart) {
            startInterview();
        }
    }, [selectedLanguage, cvAnalysis, messages.length, isLoading, startInterview]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

        // Auto-focus input when AI finishes
        if (!isLoading && !interviewComplete) {
            setTimeout(() => {
                const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                if (input) input.focus();
            }, 500);
        }

        // Save progress whenever messages change
        if (messages.length > 0 && diagnosisId) {
            fetch('/api/interview/save-progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    diagnosisId,
                    messages,
                    currentQuestionIndex,
                    totalQuestions
                })
            }).catch(err => console.error("Error saving chat", err));
        }
    }, [messages, diagnosisId, isLoading, interviewComplete, currentQuestionIndex, totalQuestions]);

    // Safety valve: Ensure interviewComplete matches actual progress
    useEffect(() => {
        if (interviewComplete && currentQuestionIndex < totalQuestions) {
            setInterviewComplete(false);
        }
    }, [currentQuestionIndex, totalQuestions, interviewComplete]);

    const forceUnlock = useCallback(() => {
        setIsLoading(false);
        setInterviewComplete(false);
        // Re-calculate progress
        const calculatedIndex = Math.floor(messages.length / 2);
        setCurrentQuestionIndex(Math.min(calculatedIndex, totalQuestions));
    }, [messages.length, totalQuestions]);

    const processStep = useCallback(async (userMessage: Message, originalInput?: string) => {
        setMessages(prev => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        try {
            // Check if this is the last interaction
            if (currentQuestionIndex >= totalQuestions) {
                if (isEvaluatingRef.current) return;
                isEvaluatingRef.current = true;

                // Get user info from localStorage
                const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
                const userId = userProfile.email || userProfile.fullName || 'anonymous';
                const userName = userProfile.fullName || 'Anonymous User';

                // Finish interview and get final evaluation
                const response = await fetch('/api/interview/evaluate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cvAnalysis,
                        conversationHistory: [...messages, userMessage],
                        language: selectedLanguage,
                        userId,
                        userName
                    }),
                });

                const result = await response.json();

                if (result.success) {
                    setFinalEvaluation(result.evaluation);
                    setInterviewComplete(true);

                    // Update userProfile in localStorage to unlock other modules
                    const savedProfile = localStorage.getItem("userProfile");
                    if (savedProfile) {
                        const profile = JSON.parse(savedProfile);
                        profile.isDiagnosisComplete = true;
                        profile.diagnosisData = result.evaluation;
                        localStorage.setItem("userProfile", JSON.stringify(profile));
                        window.dispatchEvent(new Event("profileUpdated"));
                    }

                    const aiMessage: Message = {
                        role: 'ai',
                        content: result.closingMessage,
                        timestamp: new Date(),
                    };
                    setMessages(prev => [...prev, aiMessage]);
                } else {
                    throw new Error(result.error || "Evaluation failed");
                }
            } else {
                // Get next question
                const response = await fetch('/api/interview/next-question', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cvAnalysis,
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
                    // Increment progress index correctly
                    setCurrentQuestionIndex(prev => Math.min(prev + 1, totalQuestions));
                } else {
                    throw new Error(result.error || "Failed to get next question");
                }
            }
        } catch (error) {
            console.error('Interview Process Error:', error);
            if (originalInput) setInputValue(originalInput);

            const errorMsg = selectedLanguage === 'ar'
                ? "حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى."
                : "Connection error. Please try again.";
            alert(errorMsg);

            // Reset evaluation ref on error to allow retry
            isEvaluatingRef.current = false;
        } finally {
            setIsLoading(false);
        }
    }, [currentQuestionIndex, totalQuestions, cvAnalysis, messages, selectedLanguage]);

    const handleSendMessage = useCallback(async (e?: React.FormEvent | React.KeyboardEvent) => {
        if (e && 'preventDefault' in e) e.preventDefault();
        if (!inputValue.trim() || isLoading || interviewComplete) return;

        const currentInput = inputValue;
        const userMessage: Message = {
            role: 'user',
            content: currentInput,
            timestamp: new Date(),
        };

        await processStep(userMessage, currentInput);
    }, [inputValue, isLoading, interviewComplete, processStep]);

    const handleSkipQuestion = useCallback(async () => {
        if (isLoading || interviewComplete) return;

        const skipMessages: Record<string, string> = {
            'en': "I don't have enough information for this question, please move on to the next one.",
            'fr': "Je n'ai pas assez d'informations pour cette question, veuillez passer à la suivante.",
            'ar': "ليس لدي معلومات كافية لهذا السؤال، يرجى الانتقال إلى السؤال التالي.",
            'es': "No tengo suficiente información para esta pregunta, por favor pase a la siguiente.",
        };

        const skipMessage = skipMessages[selectedLanguage || 'en'] || skipMessages['en'];
        const userMessage: Message = {
            role: 'user',
            content: skipMessage,
            timestamp: new Date(),
        };

        await processStep(userMessage);
    }, [isLoading, interviewComplete, selectedLanguage, processStep]);

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
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Globe className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                            Choose Your Interview Language
                        </h1>
                        <p className="text-slate-500 text-lg">
                            Select the language you&apos;re most comfortable with for the interview
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
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            </div>
        );
    }

    // Interview Complete - Show Results Preview
    if (interviewComplete && finalEvaluation) {
        return (
            <div className="flex-1 p-8 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    {/* Completion Header */}
                    <div className="bg-linear-to-br from-green-50 to-blue-50 rounded-2xl border border-green-200 p-8 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Interview Complete!</h1>
                        <p className="text-slate-600">Thank you for your honest answers. Here&apos;s your evaluation summary.</p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                            <p className="text-sm text-slate-500 mb-2">CV Accuracy</p>
                            <p className="text-3xl font-bold text-blue-600">{Number(finalEvaluation.accuracyScore)}%</p>
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                            <p className="text-sm text-slate-500 mb-2">Questions Answered</p>
                            <p className="text-3xl font-bold text-purple-600">{totalQuestions}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                            <p className="text-sm text-slate-500 mb-2">Overall Rating</p>
                            <p className="text-3xl font-bold text-green-600">{Number(finalEvaluation.overallRating)}/10</p>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Summary</h2>
                        <p className="text-slate-700 leading-relaxed">{String(finalEvaluation.summary)}</p>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={() => {
                            // Store evaluation for role discovery
                            localStorage.setItem('interviewEvaluation', JSON.stringify(finalEvaluation));
                            router.push('/assessment/role-discovery');
                        }}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                    >
                        Continue to Career Path Discovery
                        <TrendingUp className="w-5 h-5" />
                    </button>
                </motion.div>
            </div>
        );
    }

    // Interview Chat Screen
    return (
        <div className="flex-1 flex flex-col h-[calc(100vh-8rem)]">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Career Interview</h1>
                    <p className="text-slate-500">
                        Answer honestly - we&apos;re verifying your CV and understanding your real capabilities.
                    </p>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm text-slate-500">Progress</p>
                        <p className="text-lg font-bold text-blue-600">{currentQuestionIndex}/{totalQuestions}</p>
                    </div>
                    <div className="relative w-10 h-10 rounded-xl bg-linear-to-br from-emerald-600 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <div
                            className="absolute inset-0 border-4 border-blue-600 transition-all duration-1000"
                            style={{
                                clipPath: `inset(${100 - Math.min(100, (currentQuestionIndex / totalQuestions) * 100)}% 0 0 0)`
                            }}
                        />
                        <span className="text-lg font-bold text-slate-700 relative z-10">
                            {Math.min(100, Math.round((currentQuestionIndex / totalQuestions) * 100))}%
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
                                            <Sparkles className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <span className="text-sm font-medium text-slate-600">AI HR Expert</span>
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
                                <span className="text-slate-600">AI is analyzing your answer...</span>
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
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                handleSendMessage(e);
                            }
                        }}
                        placeholder="Type your answer here..."
                        disabled={isLoading || interviewComplete}
                        className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    />
                    <button
                        onClick={handleSkipQuestion}
                        disabled={isLoading || interviewComplete}
                        className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        title="Skip this question"
                    >
                        <ArrowRight className="w-5 h-5" />
                        {selectedLanguage === 'ar' ? 'تخطي' :
                            selectedLanguage === 'fr' ? 'Passer' :
                                selectedLanguage === 'es' ? 'Saltar' : 'Skip'}
                    </button>
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isLoading || interviewComplete}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Send className="w-5 h-5" />
                        {selectedLanguage === 'ar' ? 'إرسال' :
                            selectedLanguage === 'fr' ? 'Envoyer' :
                                selectedLanguage === 'es' ? 'Enviar' : 'Send'}
                    </button>
                </div>

                {/* Emergency Unlock - Only shows if potentially stuck */}
                {(isLoading || interviewComplete) && currentQuestionIndex < totalQuestions && (
                    <div className="mt-4 flex justify-center">
                        <button
                            onClick={forceUnlock}
                            className="text-[10px] font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest flex items-center gap-1"
                        >
                            <AlertCircle size={10} />
                            Si le chat est bloqué, cliquez هنا لإعادة التفعيل / Si bloqué, cliquez ici
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
