"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function ExpertPage() {
    const { t, language } = useLanguage();
    const [messages, setMessages] = useState([
        {
            role: 'expert',
            content: t.expert.defaultMessage,
            timestamp: new Date(),
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const quickQuestions = [
        "How can I transition to a senior role?",
        "What skills should I focus on?",
        "How to negotiate salary?",
        "Best way to build my personal brand?",
    ];

    const handleSend = async (text?: string) => {
        const messageToSend = text || inputValue;
        if (!messageToSend.trim() || isLoading) return;

        const userMessage = {
            role: 'user',
            content: messageToSend,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        try {
            const apiMessages = messages.concat(userMessage).map(msg => ({
                role: msg.role === 'expert' ? 'assistant' : 'user',
                content: msg.content
            }));

            const response = await fetch('/api/expert/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: apiMessages,
                    language: language
                }),
            });

            if (!response.ok) throw new Error('Failed to get response');

            const data = await response.json();

            setMessages(prev => [...prev, {
                role: 'expert',
                content: data.content,
                timestamp: new Date(),
            }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                role: 'expert',
                content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
                timestamp: new Date(),
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-[calc(100dvh-8rem)]">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{t.expert.title}</h1>
                <p className="text-slate-500">
                    {t.expert.subtitle}
                </p>
            </div>

            {/* Quick Questions */}
            <div className="mb-4">
                <p className="text-sm font-medium text-slate-600 mb-2">{t.expert.quickQuestions}</p>
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    {quickQuestions.map((question, index) => (
                        <button
                            key={index}
                            onClick={() => handleSend(question)}
                            disabled={isLoading}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 hover:border-blue-300 hover:bg-blue-50 whitespace-nowrap transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {question}
                        </button>
                    ))}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 overflow-y-auto mb-4 custom-scrollbar">
                <div className="space-y-6">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[85%] sm:max-w-[80%]`}>
                                {message.role === 'expert' && (
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                            <Sparkles className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <span className="text-sm font-medium text-slate-600">{t.expert.careerExpert}</span>
                                    </div>
                                )}

                                <div className={`rounded-2xl p-4 shadow-sm ${message.role === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-50 text-slate-900 border border-slate-100'
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
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                        <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-600">{t.expert.loading}</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        disabled={isLoading}
                        placeholder={t.expert.placeholder}
                        className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900 disabled:opacity-50"
                    />
                    <button
                        onClick={() => handleSend()}
                        disabled={isLoading || !inputValue.trim()}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                        <span className="hidden sm:inline">{t.expert.send}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
