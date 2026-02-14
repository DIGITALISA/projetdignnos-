"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, Target, ArrowRight, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

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
    const messagesEndRef = useRef<HTMLDivElement>(null);

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
    }, [router]);

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

    const startRoleDiscovery = async (cv: CVAnalysisResult, evaluation: InterviewEvaluation, language: string) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/role-discovery/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cvAnalysis: cv,
                    interviewEvaluation: evaluation,
                    language
                }),
            });

            const result = await response.json();

            if (result.success) {
                const welcomeMsg: Message = {
                    role: 'ai',
                    content: result.welcomeMessage,
                    timestamp: new Date(),
                };
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
        } catch (error) {
            console.error('Error starting role discovery:', error);
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
                // Get userId
                const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
                const userId = userProfile.email || userProfile.fullName;

                // Finish discovery and generate role suggestions
                const response = await fetch('/api/role-discovery/complete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cvAnalysis,
                        interviewEvaluation,
                        conversationHistory: [...messages, userMessage],
                        language: selectedLanguage,
                        userId
                    }),
                });

                const result = await response.json();

                if (result.success) {
                    // Store role suggestions
                    localStorage.setItem('roleSuggestions', JSON.stringify(result.roles));
                    setDiscoveryComplete(true);

                    const aiMessage: Message = {
                        role: 'ai',
                        content: result.closingMessage,
                        timestamp: new Date(),
                    };
                    setMessages(prev => [...prev, aiMessage]);
                }
            } else {
                // Get next question
                const response = await fetch('/api/role-discovery/next-question', {
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

        const skipMessage = skipMessages[selectedLanguage] || skipMessages['en'];

        const userMessage: Message = {
            role: 'user',
            content: skipMessage,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            if (currentQuestionIndex >= totalQuestions) {
                // Get userId
                const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
                const userId = userProfile.email || userProfile.fullName;

                const response = await fetch('/api/role-discovery/complete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cvAnalysis,
                        interviewEvaluation,
                        conversationHistory: [...messages, userMessage],
                        language: selectedLanguage,
                        userId
                    }),
                });

                const result = await response.json();

                if (result.success) {
                    localStorage.setItem('roleSuggestions', JSON.stringify(result.roles));
                    setDiscoveryComplete(true);

                    const aiMessage: Message = {
                        role: 'ai',
                        content: result.closingMessage,
                        timestamp: new Date(),
                    };
                    setMessages(prev => [...prev, aiMessage]);
                }
            } else {
                const response = await fetch('/api/role-discovery/next-question', {
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

                        <button
                            onClick={() => router.push('/assessment/role-suggestions')}
                            className="group w-full py-4 px-6 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-lg font-bold rounded-xl shadow-xl shadow-purple-600/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                        >
                            <span>Reveal Your Career Paths</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-[calc(100vh-8rem)]">
            <div className="mb-6 flex flex-col items-center text-center gap-4 px-4">
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
                                <span className="text-slate-500 text-sm font-medium">Analyzing career goals...</span>
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
                            onClick={handleSkipQuestion}
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
                            onClick={handleSendMessage}
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
            </div>
        </div>
    );
}
