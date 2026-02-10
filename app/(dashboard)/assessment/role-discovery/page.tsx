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
            <div className="flex-1 p-8 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <div className="bg-linear-to-br from-green-50 to-blue-50 rounded-2xl border border-green-200 p-8 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Career Discovery Complete!</h1>
                        <p className="text-slate-600">Based on our conversation, I&apos;ve identified the best career paths for you.</p>
                    </div>

                    <button
                        onClick={() => router.push('/assessment/role-suggestions')}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                    >
                        View Your Personalized Career Paths
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-[calc(100vh-8rem)]">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Career Path Discovery</h1>
                    <p className="text-slate-500">
                        Let&apos;s explore your career goals and find the perfect roles for you
                    </p>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm text-slate-500">Progress</p>
                        <p className="text-lg font-bold text-purple-600">{currentQuestionIndex}/{totalQuestions}</p>
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
                                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                            <Target className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <span className="text-sm font-medium text-slate-600">Career Advisor</span>
                                    </div>
                                )}

                                <div className={`rounded-2xl p-4 ${message.role === 'user'
                                    ? 'bg-purple-600 text-white'
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
                                <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
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
                        disabled={isLoading || discoveryComplete}
                        className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    />
                    <button
                        onClick={handleSkipQuestion}
                        disabled={isLoading || discoveryComplete}
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
                        disabled={!inputValue.trim() || isLoading || discoveryComplete}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
