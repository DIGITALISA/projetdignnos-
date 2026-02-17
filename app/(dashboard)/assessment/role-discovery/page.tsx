"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, Target, ArrowRight, ArrowLeft, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

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
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [cvAnalysis, setCvAnalysis] = useState<CVAnalysisResult | null>(null);
    const [interviewEvaluation, setInterviewEvaluation] = useState<InterviewEvaluation | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [totalQuestions] = useState(8); // Shorter interview focused on career goals
    const [discoveryComplete, setDiscoveryComplete] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [isTimeUnlocked, setIsTimeUnlocked] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [lastError, setLastError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

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
        } catch (error: unknown) {
            console.error('Error starting role discovery:', error);
            setLastError(selectedLanguage === 'ar' ? 'فشل بدء كشف المسارات. يرجى المحاولة مرة أخرى.' : 'Failed to start discovery. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [selectedLanguage]);

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
                        if (data.language) setSelectedLanguage(data.language);

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
            const storedLanguage = localStorage.getItem('selectedLanguage');

            if (storedCV && storedEval) {
                const cv = JSON.parse(storedCV);
                const evalData = JSON.parse(storedEval);
                setCvAnalysis(cv);
                setInterviewEvaluation(evalData);
                setSelectedLanguage(storedLanguage || 'en');
                startRoleDiscovery(cv, evalData, storedLanguage || 'en');
            } else {
                router.push('/assessment/cv-upload');
            }
        };

        loadSession();
    }, [router, startRoleDiscovery]);

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
            router.push('/assessment/role-suggestions');
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
                        language: selectedLanguage,
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
                setLastError(selectedLanguage === 'ar' ? 'فشل كشف المسارات. يرجى المحاولة مرة أخرى.' : 'Discovery completion failed. Please try again.');
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
                        language: selectedLanguage,
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
                        language: selectedLanguage,
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
            
            let errorMsg = selectedLanguage === 'ar'
                ? "حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى."
                : "Connection error. Please try again.";

            if (error instanceof Error && error.name === 'AbortError') {
                errorMsg = selectedLanguage === 'ar'
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
    }, [currentQuestionIndex, cvAnalysis, interviewEvaluation, messages, retryCount, selectedLanguage, totalQuestions, inputValue, isLoading]);

    const handleSkipQuestion = useCallback(async (isRetry = false) => {
        if (isLoading) return;

        const skipMessages: Record<string, string> = {
            'en': "I prefer to skip this question.",
            'fr': "Je préfère passer cette question.",
            'ar': "أفضل تخطي هذا السؤال.",
            'es': "Prefiero omitir esta pregunta.",
        };

        const skipMessage = skipMessages[selectedLanguage] || skipMessages['en'];

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
                        language: selectedLanguage,
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
                        language: selectedLanguage,
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
            
            let errorMsg = selectedLanguage === 'ar'
                ? "حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى."
                : "Connection error. Please try again.";

            if (error instanceof Error && error.name === 'AbortError') {
                errorMsg = selectedLanguage === 'ar'
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
    }, [currentQuestionIndex, cvAnalysis, interviewEvaluation, messages, retryCount, selectedLanguage, totalQuestions, isLoading]);

    // Discovery Complete Screen
    if (discoveryComplete) {
        return (
            <div className="flex-1 flex items-center justify-center p-4 md:p-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
                >
                    {/* Header Section with Decoration */}
                    <div className="relative bg-linear-to-br from-purple-600 to-indigo-700 p-8 md:p-12 text-center text-white">
                        <div className="absolute top-4 left-4 z-20">
                            <button
                                onClick={() => setDiscoveryComplete(false)}
                                className="p-2 hover:bg-white/20 rounded-full transition-colors group flex items-center gap-2 text-white/80 hover:text-white font-medium"
                                title="Back to Chat"
                            >
                                <ArrowLeft className="w-6 h-6" />
                                <span className="hidden sm:inline">Review Chat</span>
                            </button>
                        </div>

                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
                            <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white blur-3xl" />
                            <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-pink-400 blur-3xl" />
                        </div>
                        
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                            className="relative w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-white/30 shadow-xl"
                        >
                            <Target className="w-12 h-12 text-white" />
                        </motion.div>
                        
                        <h1 className="relative text-3xl md:text-4xl font-bold mb-3">Discovery Complete!</h1>
                        <p className="relative text-purple-100 text-lg max-w-lg mx-auto">
                            We&apos;ve analyzed your potential. It&apos;s time to see where you truly belong.
                        </p>
                    </div>

                    {/* Content Section */}
                    <div className="p-8 md:p-10 space-y-8">
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                            <h3 className="text-slate-900 font-semibold mb-2 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                What happens next?
                            </h3>
                            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                                Based on our conversation and your CV analysis, our AI has identified specific career roles that align with your unique strengths and aspirations.
                            </p>
                        </div>

                        {/* Action Button - Reveal Career Paths */}
                        <div className="relative group">
                            {/* Pulsing Background Glow */}
                            <motion.div
                                animate={{ 
                                    scale: [1, 1.05, 1],
                                    opacity: [0.3, 0.6, 0.3]
                                }}
                                transition={{ 
                                    duration: 2, 
                                    repeat: Infinity, 
                                    ease: "easeInOut" 
                                }}
                                className="absolute -inset-2 bg-linear-to-r from-purple-600 to-indigo-600 rounded-2xl blur-xl z-0"
                            />
                            
                            <motion.button
                                onClick={() => router.push('/assessment/role-suggestions')}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="relative z-10 group w-full py-6 bg-linear-to-r from-purple-600 via-indigo-600 to-indigo-700 text-white text-xl font-black rounded-2xl shadow-2xl shadow-purple-600/40 transition-all flex items-center justify-center gap-4"
                            >
                                <Sparkles className="w-7 h-7 text-yellow-300" />
                                <span>
                                    {selectedLanguage === 'ar' ? 'كشف المسارات المهنية' : 
                                     selectedLanguage === 'fr' ? 'Révéler les parcours' : 'Reveal Your Career Paths'}
                                </span>
                                <motion.div
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
                                >
                                    <ArrowRight className="w-6 h-6" />
                                </motion.div>
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-[calc(100vh-8rem)]">
            <div className="mb-6 flex flex-col items-center text-center gap-4 px-4 relative w-full">
                <div className="absolute left-4 top-0" data-html2canvas-ignore>
                    <button
                        onClick={() => router.push("/assessment/results")}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors group flex items-center gap-2 text-slate-500 hover:text-purple-600 font-medium"
                        title="Back to Assessment Results"
                    >
                        <ArrowLeft className="w-6 h-6" />
                        <span className="hidden sm:inline">Back</span>
                    </button>
                </div>

                {discoveryComplete && (
                    <div className="absolute right-4 top-0" data-html2canvas-ignore>
                        <button
                            onClick={() => router.push("/assessment/role-suggestions")}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors group flex items-center gap-2 text-purple-600 font-bold"
                            title="Go to Role Suggestions"
                        >
                            <span className="hidden sm:inline">Next</span>
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}

                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Career Path Discovery</h1>
                    <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto">
                        Let&apos;s explore your career goals and find the perfect roles for you.
                    </p>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-200">
                    <div className="text-right">
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Progress</p>
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
                                        ? (selectedLanguage === 'ar' ? `جاري إعادة المحاولة (${retryCount}/2)...` : `Retrying (${retryCount}/2)...`)
                                        : (selectedLanguage === 'ar' ? 'جاري تحليل الأهداف المهنية...' : 'Analyzing career goals...')}
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
                        placeholder={selectedLanguage === 'ar' ? "اكتب إجابتك هنا..." : "Type your answer here..."}
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
                                {selectedLanguage === 'ar' ? 'تخطي' :
                                    selectedLanguage === 'fr' ? 'Passer' :
                                        selectedLanguage === 'es' ? 'Saltar' : 'Skip'}
                            </span>
                        </button>
                        <button
                            onClick={() => handleSendMessage()}
                            disabled={!inputValue.trim() || isLoading || discoveryComplete}
                            className="flex-1 md:flex-none px-6 md:px-8 py-3 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 hover:shadow-xl hover:shadow-purple-600/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
                        >
                            <Send className="w-4 h-4" />
                            <span className="hidden md:inline">
                                {selectedLanguage === 'ar' ? 'إرسال' :
                                    selectedLanguage === 'fr' ? 'Envoyer' :
                                        selectedLanguage === 'es' ? 'Enviar' : 'Send'}
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
                                {selectedLanguage === 'ar' ? 'كشف المسارات المهنية' :
                                    selectedLanguage === 'fr' ? 'Révéler les parcours' : 'Reveal Career Paths'}
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${discoveryComplete || isTimeUnlocked || currentQuestionIndex >= 5 ? 'bg-white/20' : 'bg-slate-200'}`}>
                                    <ArrowRight className={`w-5 h-5 ${discoveryComplete || isTimeUnlocked || currentQuestionIndex >= 5 ? 'translate-x-0 group-hover:translate-x-1' : ''} transition-transform`} />
                                </div>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
