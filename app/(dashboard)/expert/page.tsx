"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, User } from "lucide-react";

export default function ExpertPage() {
    const [messages, setMessages] = useState([
        {
            role: 'expert',
            content: "Hello! I'm your AI Career Strategist. I've reviewed your profile and I'm here to help you navigate your career path. What would you like to discuss today?",
            timestamp: new Date(),
        }
    ]);
    const [inputValue, setInputValue] = useState("");

    const quickQuestions = [
        "How can I transition to a senior role?",
        "What skills should I focus on?",
        "How to negotiate salary?",
        "Best way to build my personal brand?",
    ];

    const handleSend = () => {
        if (!inputValue.trim()) return;

        setMessages(prev => [...prev, {
            role: 'user',
            content: inputValue,
            timestamp: new Date(),
        }]);

        setInputValue("");

        // Simulate AI response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'expert',
                content: "That's a great question! Based on your profile...",
                timestamp: new Date(),
            }]);
        }, 1000);
    };

    return (
        <div className="flex-1 flex flex-col h-[calc(100vh-8rem)]">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Expert Consultation</h1>
                <p className="text-slate-500">
                    Get personalized career advice from AI experts specialized in your field.
                </p>
            </div>

            {/* Quick Questions */}
            <div className="mb-4">
                <p className="text-sm font-medium text-slate-600 mb-2">Quick Questions:</p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {quickQuestions.map((question, index) => (
                        <button
                            key={index}
                            onClick={() => setInputValue(question)}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 hover:border-pink-300 hover:bg-pink-50 whitespace-nowrap transition-all"
                        >
                            {question}
                        </button>
                    ))}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 overflow-y-auto mb-4">
                <div className="space-y-6">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%]`}>
                                {message.role === 'expert' && (
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                                            <Sparkles className="w-4 h-4 text-pink-600" />
                                        </div>
                                        <span className="text-sm font-medium text-slate-600">Career Expert</span>
                                    </div>
                                )}

                                <div className={`rounded-2xl p-4 ${message.role === 'user'
                                    ? 'bg-pink-600 text-white'
                                    : 'bg-slate-50 text-slate-900'
                                    }`}>
                                    <p className="leading-relaxed">{message.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
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
                        placeholder="Ask your career question..."
                        className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all text-slate-900"
                    />
                    <button
                        onClick={handleSend}
                        className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                        <Send className="w-5 h-5" />
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
