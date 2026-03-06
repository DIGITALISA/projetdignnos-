"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, Target, ArrowRight, ArrowLeft, CheckCircle, AlertCircle, Sparkles, Lock as LockedIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { StageProgressBanner, NextStageTeaser } from "@/components/assessment/NextStageTeaser";
import { TrialGate } from "@/components/ui/TrialGate";

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

interface Message {
    role: 'ai' | 'user';
    content: string;
    timestamp: Date;
}

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

export default function RoleDiscoveryPage() {
    const router = useRouter();
    const { language, t, dir } = useLanguage();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [cvAnalysis, setCvAnalysis] = useState<CVAnalysisResult | null>(null);
    const [interviewEvaluation, setInterviewEvaluation] = useState<InterviewEvaluation | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [totalQuestions] = useState(8); // Shorter interview focused on career goals
    const [discoveryComplete, setDiscoveryComplete] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [isTimeUnlocked, setIsTimeUnlocked] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [lastError, setLastError] = useState<string | null>(null);
    const [isStudentFreeTrial, setIsStudentFreeTrial] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Detect Student Free Trial / Limited
    useEffect(() => {
        const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
        const isLimited = profile.activationType === 'Limited';
        const isPaid = ["Professional", "Pro", "Executive", "Premium"].includes(profile.plan) || (profile.plan === "Student" && !isLimited);
        setIsStudentFreeTrial(!isPaid);
    }, [router]);

    // Timer logic for 20-minute safety unlock
    useEffect(() => {
        if (!startTime || discoveryComplete) return;

        const checkTime = () => {
            const elapsed = Date.now() - startTime;
            const twentyMinutes = 20 * 60 * 1000;
            if (elapsed >= twentyMinutes && !isTimeUnlocked) {
                setIsTimeUnlocked(true);
            }
        };

        const interval = setInterval(checkTime, 10000); // Check every 10 seconds
        return () => clearInterval(interval);
    }, [startTime, discoveryComplete, isTimeUnlocked]);

    const startRoleDiscovery = useCallback(async (cv: CVAnalysisResult, evaluation: InterviewEvaluation, language: string) => {
        setIsLoading(true);
        setLastError(null);
        try {
            const response = await fetchWithTimeout('/api/role-discovery/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cvAnalysis: cv,
                    interviewEvaluation: evaluation,
                    language
                }),
            }, 60000);

            const result = await response.json();

            if (result.success) {
                const welcomeMsg: Message = {
                    role: 'ai',
                    content: result.welcomeMessage,
                    timestamp: new Date(),
                };
                setStartTime(Date.now());
                setMessages([welcomeMsg]);

                setTimeout(() => {
                    const firstQuestion: Message = {
                        role: 'ai',
                        content: result.firstQuestion,
                        timestamp: new Date(),
                    };
                    setMessages(prev => [...prev, firstQuestion]);
                    setCurrentQuestionIndex(1);
                }, 1000);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const loadSession = async () => {
            const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
            const userId = userProfile.email || userProfile.fullName;

            if (userId) {
                try {
                    const res = await fetch(`/api/user/progress?userId=${encodeURIComponent(userId)}`);
                    const response = await res.json();

                    if (response.hasData && response.data) {
                        const data = response.data;
                        
                        if (data.cvAnalysis) setCvAnalysis(data.cvAnalysis);
                        if (data.interviewEvaluation) setInterviewEvaluation(data.interviewEvaluation);

                        // If there is existing conversation, restore it
                        if (data.roleDiscoveryConversation && data.roleDiscoveryConversation.length > 0) {
                            const restoredMessages = data.roleDiscoveryConversation.map((m: { role: 'ai' | 'user', content: string, timestamp: string }) => ({
                                ...m,
                                timestamp: new Date(m.timestamp)
                            }));
                            setMessages(restoredMessages);
                            if (restoredMessages.length > 0) {
                                setStartTime(restoredMessages[0].timestamp.getTime());
                            }
                            
                            // Calculate current index
                            const calculatedIndex = Math.floor(restoredMessages.length / 2);
                            setCurrentQuestionIndex(calculatedIndex);

                            if (data.completionStatus?.roleDiscoveryComplete) {
                                setDiscoveryComplete(true);
                            }
                            return;
                        }

                        // If no conversation but we have base data, start new
                        if (data.cvAnalysis && data.interviewEvaluation) {
                            startRoleDiscovery(data.cvAnalysis, data.interviewEvaluation, data.language || 'en');
                            return;
                        }
                    }
                } catch (e) {
                    console.error("Failed to load session from API", e);
                }
            }

            // Fallback to localStorage
            const storedCV = localStorage.getItem('cvAnalysis');
            const storedEval = localStorage.getItem('interviewEvaluation');

            if (storedCV && storedEval) {
                const cv = JSON.parse(storedCV);
                const evalData = JSON.parse(storedEval);
                setCvAnalysis(cv);
                setInterviewEvaluation(evalData);
                startRoleDiscovery(cv, evalData, language || 'en');
            } else {
                router.push('/assessment/cv-upload');
            }
        };

        loadSession();
    }, [router, startRoleDiscovery, language]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

        // Save progress to API
        if (messages.length > 0) {
            const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
            const userId = userProfile.email || userProfile.fullName;
            
            if (userId) {
                fetch('/api/user/progress', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId,
                        updateData: {
                            roleDiscoveryConversation: messages,
                            currentStep: discoveryComplete ? 'role_discovery_complete' : 'role_discovery'
                        }
                    })
                }).catch(err => console.error("Error saving role discovery progress", err));
            }
        }
    }, [messages, discoveryComplete]);

    const handleProceedToSuggestions = async () => {
        if (discoveryComplete) {
            // Student Free Trial → back to dashboard
            if (isStudentFreeTrial) {
                router.push('/dashboard');
            } else {
                router.push('/assessment/role-suggestions');
            }
            return;
        }

        const isThresholdMet = currentQuestionIndex >= 5;

        if (isTimeUnlocked || isThresholdMet) {
            setIsLoading(true);
            try {
                const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
                const userId = userProfile.email || userProfile.fullName;

                const response = await fetchWithTimeout('/api/role-discovery/complete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cvAnalysis,
                        interviewEvaluation,
                        conversationHistory: messages,
                        language: language,
                        userId
                    }),
                }, 90000);

                if (!response.ok) throw new Error(`Server returned ${response.status}`);
                const result = await response.json();
                if (result.success) {
                    localStorage.setItem('roleSuggestions', JSON.stringify(result.roles));
                    setDiscoveryComplete(true);
                }
            } catch (error) {
                console.error("Emergency discovery completion failed", error);
                setLastError(language === 'ar' ? 'فشل كشف المسارات. يرجى المحاولة مرة أخرى.' : 'Discovery completion failed. Please try again.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleSendMessage = useCallback(async (isRetry = false) => {
        if (!inputValue.trim() || isLoading) return;

        const currentInput = inputValue;
        const userMessage: Message = {
            role: 'user',
            content: currentInput,
            timestamp: new Date(),
        };

        if (!isRetry) {
            setMessages(prev => [...prev, userMessage]);
            setInputValue("");
        }
        
        setIsLoading(true);
        setLastError(null);

        try {
            if (currentQuestionIndex >= totalQuestions) {
                const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
                const userId = userProfile.email || userProfile.fullName;

                const response = await fetchWithTimeout('/api/role-discovery/complete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cvAnalysis,
                        interviewEvaluation,
                        conversationHistory: [...messages, userMessage],
                        language: language,
                        userId
                    }),
                }, 90000);

                if (!response.ok) throw new Error(`Server returned ${response.status}`);
                const result = await response.json();

                if (result.success) {
                    localStorage.setItem('roleSuggestions', JSON.stringify(result.roles));
                    setDiscoveryComplete(true);
                    setRetryCount(0);

                    const aiMessage: Message = {
                        role: 'ai',
                        content: result.closingMessage,
                        timestamp: new Date(),
                    };
                    setMessages(prev => [...prev, aiMessage]);
                }
            } else {
                const response = await fetchWithTimeout('/api/role-discovery/next-question', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cvAnalysis,
                        interviewEvaluation,
                        conversationHistory: [...messages, userMessage],
                        language: language,
                        questionNumber: currentQuestionIndex + 1,
                        totalQuestions,
                    }),
                }, 60000);

                if (!response.ok) throw new Error(`Server returned ${response.status}`);
                const result = await response.json();

                if (result.success && result.question) {
                    const aiMessage: Message = {
                        role: 'ai',
                        content: result.question,
                        timestamp: new Date(),
                    };
                    setMessages(prev => [...prev, aiMessage]);
                    setCurrentQuestionIndex(prev => prev + 1);
                    setRetryCount(0);
                }
            }
        } catch (error: unknown) {
            console.error('Role Discovery Error:', error);
            
            let errorMsg = language === 'ar'
                ? "حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى."
                : "Connection error. Please try again.";

            if (error instanceof Error && error.name === 'AbortError') {
                errorMsg = language === 'ar'
                    ? "الخادم بطيء جداً حالياً، يرجى المحاولة مرة أخرى."
                    : "The server is very slow right now, please try again.";
            }

            setLastError(errorMsg);

            if (!isRetry && retryCount < 2) {
                setRetryCount(prev => prev + 1);
                setTimeout(() => {
                    handleSendMessage(true);
                }, 2000);
                return;
            }

            if (currentInput) setInputValue(currentInput);
            alert(errorMsg);
        } finally {
            setIsLoading(false);
        }
    }, [currentQuestionIndex, cvAnalysis, interviewEvaluation, messages, retryCount, language, totalQuestions, inputValue, isLoading]);

    const handleSkipQuestion = useCallback(async (isRetry = false) => {
        if (isLoading) return;

        const skipMessages: Record<string, string> = {
            'en': "I prefer to skip this question.",
            'fr': "Je préfère passer cette question.",
            'ar': "أفضل تخطي هذا السؤال.",
            'es': "Prefiero omitir esta pregunta.",
        };

        const skipMessage = skipMessages[language] || skipMessages['en'];

        const userMessage: Message = {
            role: 'user',
            content: skipMessage,
            timestamp: new Date(),
        };

        if (!isRetry) {
            setMessages(prev => [...prev, userMessage]);
        }
        
        setIsLoading(true);
        setLastError(null);

        try {
            if (currentQuestionIndex >= totalQuestions) {
                const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
                const userId = userProfile.email || userProfile.fullName;

                const response = await fetchWithTimeout('/api/role-discovery/complete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cvAnalysis,
                        interviewEvaluation,
                        conversationHistory: [...messages, userMessage],
                        language: language,
                        userId
                    }),
                }, 90000);

                if (!response.ok) throw new Error(`Server returned ${response.status}`);
                const result = await response.json();

                if (result.success) {
                    localStorage.setItem('roleSuggestions', JSON.stringify(result.roles));
                    setDiscoveryComplete(true);
                    setRetryCount(0);

                    const aiMessage: Message = {
                        role: 'ai',
                        content: result.closingMessage,
                        timestamp: new Date(),
                    };
                    setMessages(prev => [...prev, aiMessage]);
                }
            } else {
                const response = await fetchWithTimeout('/api/role-discovery/next-question', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cvAnalysis,
                        interviewEvaluation,
                        conversationHistory: [...messages, userMessage],
                        language: language,
                        questionNumber: currentQuestionIndex + 1,
                        totalQuestions,
                    }),
                }, 60000);

                if (!response.ok) throw new Error(`Server returned ${response.status}`);
                const result = await response.json();

                if (result.success && result.question) {
                    const aiMessage: Message = {
                        role: 'ai',
                        content: result.question,
                        timestamp: new Date(),
                    };
                    setMessages(prev => [...prev, aiMessage]);
                    setCurrentQuestionIndex(prev => prev + 1);
                    setRetryCount(0);
                }
            }
        } catch (error: unknown) {
            console.error('Skip Question Error:', error);
            
            let errorMsg = language === 'ar'
                ? "حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى."
                : "Connection error. Please try again.";

            if (error instanceof Error && error.name === 'AbortError') {
                errorMsg = language === 'ar'
                    ? "الخادم بطيء جداً حالياً، يرجى المحاولة مرة أخرى."
                    : "The server is very slow right now, please try again.";
            }

            setLastError(errorMsg);

            if (!isRetry && retryCount < 2) {
                setRetryCount(prev => prev + 1);
                setTimeout(() => {
                    handleSkipQuestion(true);
                }, 2000);
                return;
            }

            alert(errorMsg);
        } finally {
            setIsLoading(false);
        }
    }, [currentQuestionIndex, cvAnalysis, interviewEvaluation, messages, retryCount, language, totalQuestions, isLoading]);

    // Discovery Complete Screen
    if (discoveryComplete) {
        return (
            <div className="flex-1 flex items-center justify-center p-4 md:p-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
                >
                    {/* Header Section */}
                    <div className={`relative p-8 md:p-12 text-center text-white ${isStudentFreeTrial ? 'bg-linear-to-br from-slate-800 to-slate-950' : 'bg-linear-to-br from-purple-600 to-indigo-700'}`}>
                        {!isStudentFreeTrial && (
                            <div className="absolute top-4 left-4 z-20">
                                <button
                                    onClick={() => setDiscoveryComplete(false)}
                                    className="p-2 hover:bg-white/20 rounded-full transition-colors group flex items-center gap-2 text-white/80 hover:text-white font-medium"
                                >
                                    <ArrowLeft className="w-6 h-6" />
                                    <span className="hidden sm:inline">{t.roleDiscovery.reviewChat}</span>
                                </button>
                            </div>
                        )}

                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                            className="relative w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-white/30 shadow-xl"
                        >
                            {isStudentFreeTrial ? <LockedIcon className="w-12 h-12 text-white" /> : <Target className="w-12 h-12 text-white" />}
                        </motion.div>
                        
                        <h1 className="relative text-3xl md:text-4xl font-bold mb-3">
                            {isStudentFreeTrial 
                                ? (language === 'ar' ? 'أكمل رحلتك المهنية الآن!' : language === 'fr' ? 'Complétez votre parcours !' : 'Complete your journey!')
                                : t.roleDiscovery.completeTitle}
                        </h1>
                        <p className="relative text-slate-300 text-lg max-w-lg mx-auto font-medium">
                            {isStudentFreeTrial 
                                ? (language === 'ar' ? 'لقد انتهت المرحلة التجريبية للديغنوس. اشترك الآن لفتح باقي المميزات.' : language === 'fr' ? 'La phase d\'essai est terminée. Abonnez-vous pour débloquer la suite.' : 'Trial phase completed. Subscribe to unlock the rest.')
                                : t.roleDiscovery.completeSubtitle}
                        </p>
                    </div>

                    {/* Content Section */}
                    <div className="p-8 md:p-10 space-y-8">
                        {isStudentFreeTrial ? (
                            <div className="space-y-6">
                                <h3 className={`font-black text-slate-800 flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                    <Sparkles className="w-5 h-5 text-amber-500" />
                                    {language === 'ar' ? 'المراحل المتبقية لك:' : language === 'fr' ? 'Vos étapes restantes :' : 'Your remaining stages:'}
                                </h3>
                                <div className="grid gap-3">
                                    {[
                                        { icon: "🎯", label: { ar: 'اقتراحات الأدوار المخصصة', fr: 'Recommandations de Rôles', en: 'Role Recommendations' } },
                                        { icon: "✍️", label: { ar: 'استوديو السيرة الذاتية الاحترافية', fr: 'Studio CV Professionnel', en: 'Professional CV Studio' } },
                                        { icon: "🏆", label: { ar: 'محاكاة الدور التنفيذي والشهادة', fr: 'Simulation & Certification', en: 'Simulation & Certification' } }
                                    ].map((step, i) => (
                                        <div key={i} className={`flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                            <span className="text-2xl">{step.icon}</span>
                                            <span className="font-bold text-slate-700 text-sm md:text-base">
                                                {step.label[language as 'ar'|'fr'|'en'] || step.label.fr}
                                            </span>
                                            <div className={`${dir === 'rtl' ? 'mr-auto' : 'ml-auto'}`}>
                                                <LockedIcon className="w-4 h-4 text-slate-300" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                <h3 className="text-slate-900 font-semibold mb-2 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    {t.roleDiscovery.nextTitle}
                                </h3>
                                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                                    {t.roleDiscovery.nextDesc}
                                </p>
                            </div>
                        )}

                        {/* Action Button */}
                        <div className="relative group">
                            <motion.div
                                animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className={`absolute -inset-2 rounded-2xl blur-xl z-0 ${isStudentFreeTrial ? 'bg-blue-600' : 'bg-purple-600'}`}
                            />
                            
                            <motion.button
                                onClick={() => isStudentFreeTrial ? router.push('/subscription') : router.push('/assessment/role-suggestions')}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`relative z-10 group w-full py-6 text-white text-xl font-black rounded-2xl shadow-2xl transition-all flex items-center justify-center gap-4 ${isStudentFreeTrial ? 'bg-blue-600 hover:bg-blue-700' : 'bg-linear-to-r from-purple-600 to-indigo-700'}`}
                            >
                                <Sparkles className="w-7 h-7 text-yellow-300" />
                                <span>
                                    {isStudentFreeTrial 
                                        ? (language === 'ar' ? 'فتح جميع المميزات الآن' : language === 'fr' ? 'Débloquer tout maintenant' : 'Unlock everything now')
                                        : t.roleDiscovery.revealPaths
                                    }
                                </span>
                                <ArrowRight className={`w-6 h-6 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                            </motion.button>
                        </div>

                        {isStudentFreeTrial && (
                            <button 
                                onClick={() => router.push('/dashboard')}
                                className="w-full text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
                            >
                                {language === 'ar' ? 'العودة للوحة التحكم' : language === 'fr' ? 'Retour au tableau de bord' : 'Return to Dashboard'}
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <TrialGate 
            module="strategic-report" 
            moduleHref="/strategic-report"
            dir={dir}
            language={language}
        >
        <div className="flex-1 flex flex-col h-[calc(100vh-8rem)]">
            <div className="mb-6 flex flex-col items-center text-center gap-4 px-4 relative w-full">
                <div className="absolute left-4 top-0" data-html2canvas-ignore>
                    <button
                        onClick={() => router.push("/assessment/results")}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors group flex items-center gap-2 text-slate-500 hover:text-purple-600 font-medium"
                        title="Back to Assessment Results"
                    >
                        <ArrowLeft className="w-6 h-6" />
                        <span className="hidden sm:inline">{t.roleDiscovery.back}</span>
                    </button>
                </div>

                {discoveryComplete && (
                    <div className="absolute right-4 top-0" data-html2canvas-ignore>
                        <button
                            onClick={() => router.push("/assessment/role-suggestions")}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors group flex items-center gap-2 text-purple-600 font-bold"
                            title="Go to Role Suggestions"
                        >
                            <span className="hidden sm:inline">{t.roleDiscovery.next}</span>
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}

                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{t.roleDiscovery.title}</h1>
                    <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto">
                        {t.roleDiscovery.subtitle}
                    </p>
                </div>

                {/* ── Next Stage Top Banner ── */}
                <div className="w-full max-w-2xl">
                    <StageProgressBanner stage="role-discovery" />
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-200">
                    <div className="text-right">
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">{t.roleDiscovery.progress}</p>
                        <p className="text-sm font-bold text-slate-700">{currentQuestionIndex} / {totalQuestions}</p>
                    </div>
                    
                    {/* Purple Frame Percentage Badge */}
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
                                className="stroke-purple-500 fill-none transition-all duration-1000 ease-out"
                                strokeWidth="4"
                                strokeDasharray="283"
                                strokeDashoffset={283 - (Math.min(100, (currentQuestionIndex / totalQuestions) * 100) / 100) * 283}
                                strokeLinecap="round"
                            />
                        </svg>
                        
                        {/* The Percentage Text in Purple Frame */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs md:text-sm font-bold text-purple-700 bg-purple-50 px-1 py-0.5 rounded-md border border-purple-200">
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
                                        <div className="w-6 h-6 rounded-full bg-linear-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-md shadow-purple-500/20">
                                            <Target className="w-3 h-3 text-white" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Career Advisor</span>
                                    </div>
                                )}

                                <div className={`relative rounded-2xl p-4 md:p-5 shadow-sm border ${message.role === 'user'
                                    ? 'bg-linear-to-br from-purple-600 to-purple-700 text-white border-purple-500 rounded-tr-none'
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
                                <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
                                <span className="text-slate-500 text-sm font-medium">
                                    {retryCount > 0 
                                        ? (language === 'ar' ? `جاري إعادة المحاولة (${retryCount}/2)...` : `Retrying (${retryCount}/2)...`)
                                        : (language === 'ar' ? 'جاري تحليل الأهداف المهنية...' : 'Analyzing career goals...')}
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
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                        placeholder={t.roleDiscovery.placeholder}
                        disabled={isLoading || discoveryComplete}
                        className="w-full flex-1 px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-500/10 outline-none transition-all text-slate-900 placeholder:text-slate-400 text-sm md:text-base font-medium"
                    />
                    <div className="flex gap-2 shrink-0">
                        <button
                            onClick={() => handleSkipQuestion()}
                            disabled={isLoading || discoveryComplete}
                            className="flex-1 md:flex-none px-4 md:px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
                            title="Skip this question"
                        >
                            <ArrowRight className="w-4 h-4" />
                            <span className="hidden md:inline">
                                {t.roleDiscovery.skip}
                            </span>
                        </button>
                        <button
                            onClick={() => handleSendMessage()}
                            disabled={!inputValue.trim() || isLoading || discoveryComplete}
                            className="flex-1 md:flex-none px-6 md:px-8 py-3 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 hover:shadow-xl hover:shadow-purple-600/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
                        >
                            <Send className="w-4 h-4" />
                            <span className="hidden md:inline">
                                {t.roleDiscovery.send}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Next Step Navigation - Active only when complete */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-center">
                    <button
                        onClick={handleProceedToSuggestions}
                        disabled={!discoveryComplete && !isTimeUnlocked && currentQuestionIndex < 5 || isLoading}
                        className={`
                            group px-10 py-4 rounded-2xl font-black text-lg transition-all flex items-center gap-3
                            ${(discoveryComplete || isTimeUnlocked || currentQuestionIndex >= 5)
                                ? "bg-purple-600 text-white shadow-xl shadow-purple-600/20 hover:bg-purple-700 hover:-translate-y-1"
                                : "bg-slate-100 text-slate-400 cursor-not-allowed border-2 border-slate-200"
                            }
                        `}
                    >
                        {isLoading && !discoveryComplete ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Generating Roles...</span>
                            </>
                        ) : (
                            <>
                                {discoveryComplete || isTimeUnlocked || currentQuestionIndex >= 5 ? t.roleDiscovery.revealPaths : t.roleDiscovery.loading}
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${discoveryComplete || isTimeUnlocked || currentQuestionIndex >= 5 ? 'bg-white/20' : 'bg-slate-200'}`}>
                                    <ArrowRight className={`w-5 h-5 ${discoveryComplete || isTimeUnlocked || currentQuestionIndex >= 5 ? 'translate-x-0 group-hover:translate-x-1' : ''} transition-transform`} />
                                </div>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* ── Next Stage Full Teaser (when discovery complete) ── */}
            {discoveryComplete && (
                <NextStageTeaser
                    stage="role-discovery"
                    onNavigate={() => isStudentFreeTrial ? router.push('/dashboard') : router.push('/assessment/role-suggestions')}
                    visible={discoveryComplete}
                />
            )}
        </div>
        </TrialGate>
    );
}
