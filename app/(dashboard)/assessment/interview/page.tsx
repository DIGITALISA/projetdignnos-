"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, Sparkles, Globe, AlertCircle, ArrowRight, ArrowLeft, Lock, ShieldCheck, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Language } from "@/lib/i18n/translations";
import { StageProgressBanner, NextStageTeaser } from "@/components/assessment/NextStageTeaser";

interface Message {
    role: 'ai' | 'user';
    content: string;
    timestamp: Date;
}

const LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇬🇧', nativeName: 'English' },
    { code: 'fr', name: 'French', flag: '🇫🇷', nativeName: 'Français' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦', nativeName: 'العربية' },
];

const fetchWithTimeout = async (resource: string, options: RequestInit = {}, timeout = 60000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(resource, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
};

export default function InterviewPage() {
    const router = useRouter();
    const { t, setLanguage } = useLanguage();
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [cvAnalysis, setCvAnalysis] = useState<Record<string, unknown> | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(15); 
    const [interviewComplete, setInterviewComplete] = useState(false);
    const [finalEvaluation, setFinalEvaluation] = useState<Record<string, unknown> | null>(null);
    const [diagnosisId, setDiagnosisId] = useState<string | null>(null);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [isTimeUnlocked, setIsTimeUnlocked] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const isEvaluatingRef = useRef(false);
    const [retryCount, setRetryCount] = useState(0);
    const [lastError, setLastError] = useState<string | null>(null);

    // Timer logic for 20-minute safety unlock
    useEffect(() => {
        if (!startTime || interviewComplete) return;

        const checkTime = () => {
            const elapsed = Date.now() - startTime;
            const twentyMinutes = 20 * 60 * 1000;
            if (elapsed >= twentyMinutes && !isTimeUnlocked) {
                setIsTimeUnlocked(true);
            }
        };

        const interval = setInterval(checkTime, 10000); // Check every 10 seconds
        return () => clearInterval(interval);
    }, [startTime, interviewComplete, isTimeUnlocked]);

    const handleLanguageSelect = (lang: string) => {
        setSelectedLanguage(lang);
        setLanguage(lang as Language);
        localStorage.setItem('selectedLanguage', lang);
    };

    useEffect(() => {
        const loadSession = async () => {
            const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
            const userId = userProfile.email || userProfile.fullName;

            if (userId) {
                try {
                    const res = await fetch(`/api/assessment/progress?userId=${encodeURIComponent(userId)}`);
                    const data = await res.json();

                    if (data.hasActiveSession) {
                        setDiagnosisId(data.diagnosisId);
                        if (data.analysis) setCvAnalysis(data.analysis);
                        
                        // ✅ SYNC GLOBAL LANGUAGE FROM SAVED SESSION
                        if (data.language) {
                            setSelectedLanguage(data.language);
                            setLanguage(data.language as Language);
                            localStorage.setItem('selectedLanguage', data.language);
                        }
                        
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

                        const params = new URLSearchParams(window.location.search);
                        const isViewMode = params.get('view') === 'history';

                        if (!isViewMode && (data.currentStep === 'interview_complete' || data.currentStep === 'completed')) {
                            // If we have messages, we might want to stay on page to show summary
                            // but if evaluate API already set currentStep, we should be in interviewComplete state
                            if (data.evaluation) {
                                setInterviewComplete(true);
                            } else {
                                router.push('/assessment/results');
                                return;
                            }
                        }

                        if (data.evaluation && isViewMode) {
                            // In view mode, we might want to see the chat directly or the summary.
                            // Let's default to summary but with the option to see chat.
                            setInterviewComplete(true);
                        }

                        if (data.conversationHistory && data.conversationHistory.length > 0) {
                            // Resume existing chat
                            const restoredMessages = data.conversationHistory.map((m: { role: 'ai' | 'user', content: string, timestamp: string }) => ({
                                ...m,
                                timestamp: new Date(m.timestamp)
                            }));
                            setMessages(restoredMessages);
                            if (restoredMessages.length > 0) {
                                setStartTime(restoredMessages[0].timestamp.getTime());
                            }

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
            const response = await fetchWithTimeout('/api/interview/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cvAnalysis, language: selectedLanguage }),
            }, 60000);

            const result = await response.json();

            if (result.success) {
                setTotalQuestions(result.totalQuestions || 15);
                const welcomeMsg = {
                    role: 'ai' as const,
                    content: result.welcomeMessage,
                    timestamp: new Date(),
                };

                setStartTime(Date.now());
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

    // Removal of problematic safety valve that was preventing early completion
    // The previous code was:
    // useEffect(() => {
    //     if (interviewComplete && currentQuestionIndex < totalQuestions) {
    //         setInterviewComplete(false);
    //     }
    // }, [currentQuestionIndex, totalQuestions, interviewComplete]);

    const forceUnlock = useCallback(() => {
        setIsLoading(false);
        setInterviewComplete(false);
        // Re-calculate progress
        const calculatedIndex = Math.floor(messages.length / 2);
        setCurrentQuestionIndex(Math.min(calculatedIndex, totalQuestions));
    }, [messages.length, totalQuestions]);

    const handleProceedToResults = useCallback(async () => {
        const params = new URLSearchParams(window.location.search);
        const isViewMode = params.get('view') === 'history';

        if (interviewComplete) {
            router.push(isViewMode ? '/assessment/results?view=history' : '/assessment/results');
            return;
        }

        const isThresholdMet = currentQuestionIndex >= 10;

        if (isTimeUnlocked || isThresholdMet) {
            // Force evaluate even if not all questions answered
            setIsLoading(true);
            try {
                const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
                const userId = userProfile.email || userProfile.fullName || 'anonymous';
                const userName = userProfile.fullName || 'Anonymous User';

                const response = await fetch('/api/interview/evaluate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cvAnalysis,
                        conversationHistory: messages,
                        language: selectedLanguage,
                        userId,
                        userName
                    }),
                });

                const result = await response.json();
                if (result.success) {
                    setFinalEvaluation(result.evaluation);
                    setInterviewComplete(true);
                    
                    const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
                    profile.isDiagnosisComplete = true;
                    profile.diagnosisData = result.evaluation;
                    localStorage.setItem("userProfile", JSON.stringify(profile));
                    window.dispatchEvent(new Event("profileUpdated"));
                }
            } catch (error) {
                console.error("Emergency evaluation failed", error);
            } finally {
                setIsLoading(false);
            }
        }
    }, [interviewComplete, isTimeUnlocked, currentQuestionIndex, router, cvAnalysis, messages, selectedLanguage]);

    const processStep = useCallback(async (userMessage: Message, originalInput?: string) => {
        setMessages(prev => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);
        setLastError(null);

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
                const response = await fetchWithTimeout('/api/interview/evaluate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cvAnalysis,
                        conversationHistory: [...messages, userMessage],
                        language: selectedLanguage,
                        userId,
                        userName
                    }),
                }, 90000); // 90s for full evaluation

                if (!response.ok) {
                    throw new Error(`Server returned ${response.status}`);
                }

                const result = await response.json();

                if (result.success) {
                    setFinalEvaluation(result.evaluation);
                    setInterviewComplete(true);
                    setRetryCount(0);

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
                const response = await fetchWithTimeout('/api/interview/next-question', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cvAnalysis,
                        conversationHistory: [...messages, userMessage],
                        language: selectedLanguage,
                        questionNumber: currentQuestionIndex + 1,
                        totalQuestions,
                    }),
                }, 60000); // 60s for next question

                if (!response.ok) {
                    throw new Error(`Server returned ${response.status}`);
                }

                const result = await response.json();

                if (result.success && result.question) {
                    const aiMessage: Message = {
                        role: 'ai',
                        content: result.question,
                        timestamp: new Date(),
                    };
                    setMessages(prev => [...prev, aiMessage]);
                    setCurrentQuestionIndex(prev => Math.min(prev + 1, totalQuestions));
                    setRetryCount(0);
                } else {
                    throw new Error(result.error || "Failed to get next question");
                }
            }
        } catch (error: unknown) {
            console.error('Interview Process Error:', error);
            
            let errorMsg = selectedLanguage === 'ar'
                ? "حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى."
                : "Connection error. Please try again.";

            if (error instanceof Error && error.name === 'AbortError') {
                errorMsg = selectedLanguage === 'ar'
                    ? "الخادم بطيء جداً حالياً، يرجى المحاولة مرة أخرى."
                    : "The server is very slow right now, please try again.";
            }

            setLastError(errorMsg);

            // Auto-retry up to 2 times
            if (retryCount < 2) {
                console.log(`Auto-retrying request (${retryCount + 1}/2)...`);
                setRetryCount(prev => prev + 1);
                setTimeout(() => {
                    processStep(userMessage, originalInput);
                }, 2000);
                return;
            }

            // If retry failed or max retries reached, restore input and show error
            if (originalInput) setInputValue(originalInput);
            alert(errorMsg);

            // Reset evaluation ref on error to allow retry
            isEvaluatingRef.current = false;
        } finally {
            setIsLoading(false);
        }
    }, [currentQuestionIndex, totalQuestions, cvAnalysis, messages, selectedLanguage, retryCount]);

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
                            {t.interview.languageTitle}
                        </h1>
                        <p className="text-slate-500 text-lg">
                            {t.interview.languageSubtitle}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {LANGUAGES.map((lang) => (
                            <motion.button
                                key={lang.code}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleLanguageSelect(lang.code)}
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
        const userProfile = JSON.parse(typeof window !== 'undefined' ? (localStorage.getItem('userProfile') || '{}') : '{}');
        const isFreeTier = userProfile.plan === "Free Trial" || userProfile.plan === "None" || userProfile.role === "Trial User" || !userProfile.plan;

        return (
            <div className="flex-1 flex items-center justify-center p-4 md:p-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
                >
                    {/* Header Section */}
                    <div className="relative bg-linear-to-br from-indigo-600 to-slate-900 p-8 text-center text-white overflow-hidden">
                        <div className="absolute top-4 left-4 z-20">
                            <button
                                onClick={() => setInterviewComplete(false)}
                                className="p-2 hover:bg-white/20 rounded-full transition-colors group flex items-center gap-2 text-white/80 hover:text-white font-medium"
                                title="Back to Chat"
                            >
                                 <ArrowLeft className="w-6 h-6" />
                                 <span className="hidden sm:inline">{t.interview.reviewChat}</span>
                            </button>
                        </div>

                        <div className="absolute top-0 left-0 w-full h-full opacity-20">
                             <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500 blur-3xl rounded-full" />
                             <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500 blur-3xl rounded-full" />
                        </div>
 
                        <motion.div 
                            initial={{ scale: 0 }} 
                            animate={{ scale: 1 }} 
                            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                            className="relative w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30 shadow-lg"
                        >
                            <Sparkles className="w-10 h-10 text-yellow-400" />
                        </motion.div>
                        
                        <h1 className="relative text-3xl font-bold mb-2">
                            {t.interview.urgentAuditCompleted}
                        </h1>
                        <p className="relative text-indigo-100 text-lg">
                            {t.interview.detectedGaps}
                        </p>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Quick Stats Grid */}
                        <div className="grid md:grid-cols-3 gap-4">
                            {[
                                { label: t.interview.cvAccuracy, value: `${Number(finalEvaluation.accuracyScore)}%`, color: Number(finalEvaluation.accuracyScore) < 40 ? "text-red-600" : "text-blue-600", bg: "bg-slate-50 border-slate-100" },
                                { label: t.interview.questions, value: totalQuestions, color: "text-slate-600", bg: "bg-slate-50 border-slate-100" },
                                { label: t.interview.initialRating, value: `${Number(finalEvaluation.overallRating)}/10`, color: Number(finalEvaluation.overallRating) < 4 ? "text-red-600" : "text-emerald-600", bg: "bg-slate-50 border-slate-100" }
                            ].map((stat, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + (i * 0.1) }}
                                    className={`${stat.bg} border rounded-2xl p-4 text-center transition-transform hover:scale-105`}
                                >
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                    <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Teaser Context for Free Tier */}
                        {isFreeTier ? (
                            <div className="space-y-6">
                                <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700 shadow-2xl relative overflow-hidden">
                                     {/* Background Graphic */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full -mr-16 -mt-16" />
                                    
                                    <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2 relative z-10">
                                        <AlertCircle className="w-5 h-5 text-amber-500" />
                                        {selectedLanguage === 'ar' ? 'تقرير أولي - الدخول محدود' : 'Preliminary Report - Limited Access'}
                                    </h2>
                                    <p className="text-slate-300 leading-relaxed text-sm relative z-10">
                                        {selectedLanguage === 'ar' 
                                            ? 'انتباه: هذا التقييم غير مكتمل ولا يشمل كامل البيانات لأنك حالياً في الخطة المجانية. لقد قمنا فقط بتحليل القشرة السطحية لملفك المهني.' 
                                            : 'Note: This assessment is incomplete and does not include full data because you are currently on the free plan. We have only analyzed the surface level of your professional profile.'}
                                    </p>
                                    <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-2 text-amber-400 font-bold text-xs relative z-10">
                                        <Lock className="w-3 h-3" />
                                        <span>
                                            {selectedLanguage === 'ar' ? 'هناك 4 ميزات استراتيجية ما زالت مغلقة في انتظارك' : '4 Strategic features are still locked awaiting you'}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {[
                                        { title: selectedLanguage === 'ar' ? 'التدقيق الاستراتيجي العميق (SCI)' : 'Deep Strategic Audit (SCI)', desc: selectedLanguage === 'ar' ? 'كشف نقاط العمى التي تمنع ترقيتك' : 'Unlock blind spots blocking your promotion' },
                                        { title: selectedLanguage === 'ar' ? 'خارطة الطريق التنفيذية' : 'Executive Roadmap', desc: selectedLanguage === 'ar' ? 'خطة عمل لـ 18 شهراً القادمة' : 'Action plan for the next 18 months' },
                                        { title: selectedLanguage === 'ar' ? 'محاكاة القيادة والضغط' : 'Leadership & Pressure Simulation', desc: selectedLanguage === 'ar' ? 'اختبار قدراتك في مواجهة الأزمات' : 'Test your crisis management skills' },
                                        { title: selectedLanguage === 'ar' ? 'تحليل التنافسية السوقية' : 'Market Competitiveness Analysis', desc: selectedLanguage === 'ar' ? 'أين أنت فعلياً مقارنة بالمحترفين؟' : 'Where you really stand vs pros?' }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-indigo-300 transition-colors">
                                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center mt-0.5 shrink-0">
                                                <Lock className="w-3 h-3 text-slate-400" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                                                <p className="text-[10px] text-slate-500">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                                <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-amber-500" />
                                    {t.interview.completeTitle}
                                </h2>
                                <p className="text-slate-700 leading-relaxed text-base italic">
                                    &ldquo;{String(finalEvaluation.summary)}&rdquo;
                                </p>
                            </div>
                        )}

                        {/* Action Button */}
                        <div className="relative pt-4">
                            <motion.button
                                onClick={() => {
                                    if (isFreeTier) {
                                        router.push('/subscription');
                                    } else {
                                        localStorage.setItem('interviewEvaluation', JSON.stringify(finalEvaluation));
                                        router.push('/assessment/results');
                                    }
                                }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="relative z-10 w-full py-5 bg-linear-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-2xl font-black text-xl transition-all shadow-xl flex items-center justify-center gap-4"
                            >
                                {isFreeTier ? (
                                    <>
                                        <ShieldCheck className="w-6 h-6 text-yellow-400" />
                                        <span>
                                            {selectedLanguage === 'ar' ? 'اكتشف التشخيص الكامل الآن' : 'Unlock Full Diagnosis Now'}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span>
                                            {selectedLanguage === 'ar' ? 'عرض التقرير الاستراتيجي' : 'View Strategic Report'}
                                        </span>
                                        <ArrowRight className="w-6 h-6" />
                                    </>
                                )}
                            </motion.button>
                        </div>

                        {isFreeTier && (
                             <div className="mt-8 pt-6 border-t border-slate-100">
                                <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                                    {selectedLanguage === 'ar' ? 'ورش عمل مخصصة لفجواتك' : 'Workshops Tailored to Your Gaps'}
                                </p>
                                <div className="flex justify-center gap-4">
                                    <Link href="/training" className="group flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-800 transition-colors">
                                        <BookOpen className="w-5 h-5" />
                                        <span>{selectedLanguage === 'ar' ? 'تصفح الورش المقترحة بك' : 'Explore Your Recommended Workshops'}</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                             </div>
                        )}
                    </div>
                </motion.div>
            </div>
        );
    }

    // Interview Chat Screen
    return (
        <div className="flex-1 flex flex-col h-[calc(100vh-8rem)]">
            <div className="mb-6 flex flex-col items-center text-center gap-4 px-4 relative w-full">
                <div className="absolute left-4 top-0" data-html2canvas-ignore>
                    <button
                        onClick={() => router.push("/assessment/cv-upload")}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors group flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium"
                        title="Back to CV Analysis"
                    >
                        <ArrowLeft className="w-6 h-6" />
                        <span className="hidden sm:inline">{t.interview.back || 'Back'}</span>
                    </button>
                </div>
                
                {(interviewComplete && finalEvaluation) && (
                    <div className="absolute right-4 top-0" data-html2canvas-ignore>
                        <button
                            onClick={() => router.push("/assessment/results")}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors group flex items-center gap-2 text-blue-600 font-bold"
                            title="Go to Full Results"
                        >
                            <span className="hidden sm:inline">Next</span>
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}

                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{t.interview.title}</h1>
                    <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto">
                        {t.interview.subtitle}
                    </p>
                </div>

                {/* ── Next Stage Top Banner ── */}
                <div className="w-full max-w-2xl">
                    <StageProgressBanner stage="interview" />
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-200">
                    <div className="text-right">
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">{t.interview.progress}</p>
                        <p className="text-sm font-bold text-slate-700">{currentQuestionIndex} / {totalQuestions}</p>
                    </div>
                    
                    {/* Green Frame Percentage Badge */}
                    <div className="relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center">
                         {/* Circular Progress Background */}
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="50%"
                                cy="50%"
                                r="45%"
                                className="stroke-slate-100 fill-none"
                                strokeWidth="4"
                            />
                            <circle
                                cx="50%"
                                cy="50%"
                                r="45%"
                                className="stroke-emerald-500 fill-none transition-all duration-1000 ease-out"
                                strokeWidth="4"
                                strokeDasharray="283" // 2 * PI * r (approx for 45% of 100)
                                strokeDashoffset={283 - (Math.min(100, (currentQuestionIndex / totalQuestions) * 100) / 100) * 283}
                                strokeLinecap="round"
                            />
                        </svg>
                        
                        {/* The Percentage Text in Green Frame */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs md:text-sm font-bold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded-md border border-emerald-200">
                                {Math.min(100, Math.round((currentQuestionIndex / totalQuestions) * 100))}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-slate-200/60 p-4 md:p-6 overflow-y-auto mb-4 mx-2 md:mx-0">
                <div className="space-y-6">
                    {messages.map((message, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[90%] md:max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1 text-left'}`}>
                                {message.role === 'ai' && (
                                    <div className="flex items-center gap-2 mb-2 ml-1">
                                        <div className="w-6 h-6 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
                                            <Sparkles className="w-3 h-3 text-white" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{t.interview.sidebar}</span>
                                    </div>
                                )}

                                <div className={`relative rounded-2xl p-4 md:p-5 shadow-sm border ${message.role === 'user'
                                    ? 'bg-linear-to-br from-blue-600 to-blue-700 text-white border-blue-500 rounded-tr-none'
                                    : 'bg-white text-slate-800 border-slate-100 rounded-tl-none'
                                    }`}>
                                    <p className="leading-relaxed whitespace-pre-wrap text-sm md:text-[15px]">{message.content}</p>
                                </div>

                                <span className={`text-[10px] md:text-xs mt-1 block px-1 ${message.role === 'user' ? 'text-right text-slate-400' : 'text-left text-slate-400'}`}>
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
                            <div className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm rounded-tl-none ml-10">
                                <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                                <span className="text-slate-500 text-sm font-medium">
                                    {retryCount > 0 
                                        ? `${t.interview.retrying} (${retryCount}/2)...`
                                        : t.interview.loading}
                                </span>
                            </div>
                        </motion.div>
                    )}

                    {lastError && !isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-center"
                        >
                            <div className="flex items-center gap-2 bg-red-50 text-red-600 rounded-2xl p-3 border border-red-200 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                <span>{lastError}</span>
                            </div>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-3 md:p-5 mx-2 md:mx-0">
                <div className="flex flex-col md:flex-row gap-3">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                handleSendMessage(e);
                            }
                        }}
                        placeholder={selectedLanguage === 'ar' ? "اكتب إجابتك هنا..." : "Type your answer here..."}
                        disabled={isLoading || interviewComplete}
                        className="w-full flex-1 px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-900 placeholder:text-slate-400 text-sm md:text-base font-medium"
                    />
                    <div className="flex gap-2 shrink-0">
                        <button
                            onClick={handleSkipQuestion}
                            disabled={isLoading || interviewComplete}
                            className="flex-1 md:flex-none px-4 md:px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
                            title="Skip this question"
                        >
                            <ArrowRight className="w-4 h-4" />
                            <span className="hidden md:inline">
                                {t.interview.skip}
                            </span>
                        </button>
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim() || isLoading || interviewComplete}
                            className="flex-1 md:flex-none px-6 md:px-8 py-3 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 hover:shadow-xl hover:shadow-indigo-600/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
                        >
                            <Send className="w-4 h-4" />
                            <span className="hidden md:inline">
                                {t.interview.send}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Next Step Navigation - Active only when complete */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-center">
                    <button
                        onClick={handleProceedToResults}
                        disabled={!interviewComplete && !isTimeUnlocked && currentQuestionIndex < 10 || isLoading}
                        className={`
                            group px-10 py-4 rounded-2xl font-black text-lg transition-all flex items-center gap-3
                            ${(interviewComplete || isTimeUnlocked || currentQuestionIndex >= 10)
                                ? "bg-emerald-600 text-white shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 hover:-translate-y-1"
                                : "bg-slate-100 text-slate-400 cursor-not-allowed border-2 border-slate-200"
                            }
                        `}
                    >
                        {isLoading && !interviewComplete ? (
                             <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                 <span>
                                    {t.interview.loading}
                                 </span>
                             </>
                        ) : (
                            <>
                                {t.interview.revealResults}
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${interviewComplete || isTimeUnlocked || currentQuestionIndex >= 10 ? 'bg-white/20' : 'bg-slate-200'}`}>
                                    <ArrowRight className={`w-5 h-5 ${interviewComplete || isTimeUnlocked || currentQuestionIndex >= 10 ? 'translate-x-0 group-hover:translate-x-1' : ''} transition-transform`} />
                                </div>
                            </>
                        )}
                    </button>
                </div>

                {/* Emergency Unlock - Only shows if potentially stuck */}
                {(isLoading && currentQuestionIndex < totalQuestions) && (
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

            {/* ── Next Stage Teaser (shows when interview completes) ── */}
            {interviewComplete && finalEvaluation && (
                <div className="px-2 md:px-0 pb-4">
                    <NextStageTeaser
                        stage="interview"
                        onNavigate={() => router.push('/assessment/results')}
                        visible={interviewComplete && !!finalEvaluation}
                    />
                </div>
            )}

        </div>
    );
}
