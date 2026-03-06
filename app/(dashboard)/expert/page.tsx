"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Users, GraduationCap, HeartHandshake, Target, ArrowLeft, Bot } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { TrialGate } from "@/components/ui/TrialGate";

type ExpertType = 'hr' | 'learning' | 'advice' | 'strategic';

interface Message {
    role: 'user' | 'expert';
    content: string;
    timestamp: Date;
}

export default function ExpertPage() {
    const { t, language, dir } = useLanguage();
    const [selectedExpert, setSelectedExpert] = useState<ExpertType | null>(null);
    const [inputValues, setInputValues] = useState<Record<ExpertType, string>>({
        hr: "",
        learning: "",
        advice: "",
        strategic: ""
    });
    
    // Store separate histories for each expert
    const [histories, setHistories] = useState<Record<ExpertType, Message[]>>({
        hr: [],
        learning: [],
        advice: [],
        strategic: []
    });

    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(() => {
        scrollToBottom();
    }, [histories, selectedExpert]);

    // Initialize default messages if empty
    useEffect(() => {
        const initialMessages: Record<ExpertType, string> = {
            hr: t.expert.hrWelcome,
            learning: t.expert.learningWelcome,
            advice: t.expert.adviceWelcome,
            strategic: t.expert.strategicWelcome
        };

        setHistories(prev => {
            const next = { ...prev };
            (Object.keys(next) as ExpertType[]).forEach(type => {
                if (next[type].length === 0) {
                    next[type] = [{
                        role: 'expert',
                        content: initialMessages[type],
                        timestamp: new Date()
                    }];
                }
            });
            return next;
        });
    }, [t]);


    const experts = [
        {
            id: 'hr' as ExpertType,
            title: t.expert.hrTitle,
            description: t.expert.hrDesc,
            icon: Users,
            color: "bg-blue-100 text-blue-600",
            gradient: "from-blue-500 to-indigo-600"
        },
        {
            id: 'learning' as ExpertType,
            title: t.expert.learningTitle,
            description: t.expert.learningDesc,
            icon: GraduationCap,
            color: "bg-emerald-100 text-emerald-600",
            gradient: "from-emerald-500 to-teal-600"
        },
        {
            id: 'advice' as ExpertType,
            title: t.expert.adviceTitle,
            description: t.expert.adviceDesc,
            icon: HeartHandshake,
            color: "bg-violet-100 text-violet-600",
            gradient: "from-violet-500 to-purple-600"
        },
        {
            id: 'strategic' as ExpertType,
            title: t.expert.strategicTitle,
            description: t.expert.strategicDesc,
            icon: Target,
            color: "bg-amber-100 text-amber-600",
            gradient: "from-amber-500 to-orange-600"
        }
    ];

    const handleSend = async (overrideText?: string) => {
        if (!selectedExpert) return;

        const text = overrideText || inputValues[selectedExpert];
        if (!text.trim() || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: text,
            timestamp: new Date(),
        };

        // Update local state immediately
        setHistories(prev => ({
            ...prev,
            [selectedExpert]: [...prev[selectedExpert], userMessage]
        }));
        
        setInputValues(prev => ({ ...prev, [selectedExpert]: "" }));
        setIsLoading(true);

        try {
            // Prepare messages for API
            // Only send recent context to save tokens, but enough for context
            const currentHistory = histories[selectedExpert];
            const apiMessages = [...currentHistory, userMessage].map(msg => ({
                role: msg.role === 'expert' ? 'assistant' : 'user',
                content: msg.content
            }));

            const response = await fetch('/api/expert/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: apiMessages,
                    language: language,
                    expertType: selectedExpert
                }),
            });

            if (!response.ok) throw new Error('Failed to get response');

            const data = await response.json();
            
            // Mark module as used for trial students on first message
            const profile = JSON.parse(typeof window !== 'undefined' ? (localStorage.getItem('userProfile') || '{}') : '{}');
            // Check if it's a "Limited" trial user and this is the first message (after initial welcome message)
            if (profile.activationType === "Limited" && histories[selectedExpert].length === 1) {
                const userId = profile.email || profile.fullName;
                if (userId) {
                    fetch('/api/user/trial-gate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId, module: 'ai-experts', moduleHref: '/expert' })
                    }).then(() => {
                         window.dispatchEvent(new Event("profileUpdated"));
                    }).catch(console.error);
                }
            }

            const botMessage: Message = {
                role: 'expert',
                content: data.content,
                timestamp: new Date(),
            };

            setHistories(prev => ({
                ...prev,
                [selectedExpert]: [...prev[selectedExpert], botMessage]
            }));

        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage: Message = {
                role: 'expert',
                content: t.expert.errorResponse,
                timestamp: new Date(),
            };
            setHistories(prev => ({
                ...prev,
                [selectedExpert]: [...prev[selectedExpert], errorMessage]
            }));
        } finally {
            setIsLoading(false);
        }
    };

    const activeExpertConfig = experts.find(e => e.id === selectedExpert);

    return (
        <TrialGate 
            module="ai-experts" 
            moduleHref="/expert" 
            manualMark={true} 
            dir={dir} 
            language={language}
        >
        <div className="flex-1 flex flex-col h-[calc(100dvh-8rem)] relative">

            {!selectedExpert ? (
                /* Expert Selection View */
                <div className="flex flex-col h-full overflow-y-auto">
                    <div className="mb-8 p-8 bg-linear-to-r from-blue-600 to-indigo-700 rounded-3xl text-white shadow-xl shadow-blue-200">
                        <h1 className="text-4xl font-black mb-3">{t.expert.selectionTitle}</h1>
                        <p className="text-blue-100 text-lg font-medium">
                            {t.expert.selectionSubtitle}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                        {experts.map((expert) => (
                            <button
                                key={expert.id}
                                onClick={() => setSelectedExpert(expert.id)}
                                className="relative group text-left p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300"
                            >
                                <div className={`absolute inset-0 bg-linear-to-r ${expert.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`} />
                                
                                <div className="flex items-start gap-5">
                                    <div className={`p-4 rounded-xl ${expert.color} group-hover:scale-110 transition-transform duration-300`}>
                                        <expert.icon className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                                            {expert.title}
                                        </h3>
                                        <p className="text-slate-500 leading-relaxed">
                                            {expert.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6 flex items-center text-sm font-black text-blue-600 gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                                    {t.expert.startConsultation} <Send className="w-4 h-4" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                /* Chat View */
                <div className="flex flex-col h-full">
                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-100">
                        <button 
                            onClick={() => setSelectedExpert(null)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-900"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className={`p-2 rounded-lg ${activeExpertConfig?.color}`}>
                            {activeExpertConfig && <activeExpertConfig.icon className="w-6 h-6" />}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">{activeExpertConfig?.title}</h2>
                            <p className="text-sm text-slate-500">
                                {t.expert.specializedIn} {activeExpertConfig?.title}
                            </p>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 overflow-y-auto mb-4 custom-scrollbar">
                        <div className="space-y-6">
                            {histories[selectedExpert].map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] sm:max-w-[80%]`}>
                                        {message.role === 'expert' && (
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${activeExpertConfig?.color}`}>
                                                    <Bot className="w-3 h-3" />
                                                </div>
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                    {activeExpertConfig?.title}
                                                </span>
                                            </div>
                                        )}

                                        <div className={`rounded-2xl p-4 shadow-sm ${message.role === 'user'
                                            ? 'bg-linear-to-br from-blue-600 to-indigo-600 text-white'
                                            : 'bg-slate-50 text-slate-800 border border-slate-100'
                                            }`}>
                                            <p className="leading-relaxed whitespace-pre-wrap text-sm sm:text-base">{message.content}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="max-w-[80%]">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                                                <Loader2 className="w-3 h-3 text-slate-400 animate-spin" />
                                            </div>
                                            <span className="text-xs font-medium text-slate-400">{t.expert.thinking}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={inputValues[selectedExpert]}
                                onChange={(e) => setInputValues(prev => ({ ...prev, [selectedExpert]: e.target.value }))}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                disabled={isLoading}
                                placeholder={t.expert.askExpert.replace('{expert}', activeExpertConfig?.title || '')}
                                className="flex-1 px-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-900 disabled:opacity-50 text-lg font-medium"
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={isLoading || !inputValues[selectedExpert].trim()}
                                className={`px-6 py-3 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed bg-linear-to-r ${activeExpertConfig?.gradient}`}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </TrialGate>
    );
}
