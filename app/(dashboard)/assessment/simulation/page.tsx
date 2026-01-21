"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Target, CheckCircle, AlertCircle, TrendingUp, Lightbulb, ArrowRight, Award, Clock, Brain } from "lucide-react";
import { useRouter } from "next/navigation";

interface Message {
    role: 'ai' | 'user';
    content: string;
    timestamp: Date;
    feedback?: {
        score: number;
        strengths: string[];
        improvements: string[];
    };
}

interface ScenarioResult {
    scenarioNumber: number;
    title: string;
    userActions: string[];
    aiEvaluation: {
        planning: number;
        taskManagement: number;
        thinking: number;
        behavior: number;
        decisionMaking: number;
        overallScore: number;
        strengths: string[];
        improvements: string[];
        feedback: string;
    };
}

export default function SimulationPage() {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState<any>(null);
    const [cvAnalysis, setCvAnalysis] = useState<any>(null);
    const [generatedCV, setGeneratedCV] = useState<any>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
    const [currentScenario, setCurrentScenario] = useState(1);
    const [totalScenarios] = useState(4); // 2 major + 2 minor scenarios
    const [scenarioResults, setScenarioResults] = useState<ScenarioResult[]>([]);
    const [simulationComplete, setSimulationComplete] = useState(false);
    const [finalReport, setFinalReport] = useState<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const storedRole = localStorage.getItem('selectedRole');
        const storedCV = localStorage.getItem('cvAnalysis');
        const storedGeneratedDocs = localStorage.getItem('generatedDocuments');
        const storedLanguage = localStorage.getItem('selectedLanguage');

        console.log('[Simulation] Checking data:', {
            hasRole: !!storedRole,
            hasCV: !!storedCV,
            hasDocs: !!storedGeneratedDocs
        });

        if (storedRole && storedCV) {
            const role = JSON.parse(storedRole);
            const cv = JSON.parse(storedCV);
            const docs = storedGeneratedDocs ? JSON.parse(storedGeneratedDocs) : null;

            setSelectedRole(role);
            setCvAnalysis(cv);
            setGeneratedCV(docs);
            setSelectedLanguage(storedLanguage || 'en');
            startSimulation(role, cv, docs, storedLanguage || 'en');
        } else {
            console.log('[Simulation] Missing data, redirecting');
            router.push('/assessment/role-suggestions');
        }
    }, [router]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const startSimulation = async (role: any, cv: any, docs: any, language: string) => {
        setIsLoading(true);
        try {
            console.log('[Simulation] Starting scenario 1 for role:', role.title);

            const response = await fetch('/api/simulation/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    selectedRole: role,
                    cvAnalysis: cv,
                    generatedCV: docs,
                    language,
                    scenarioNumber: 1
                }),
            });

            const result = await response.json();
            console.log('[Simulation] Start result:', result);

            if (result.success) {
                setMessages([
                    {
                        role: 'ai',
                        content: result.welcomeMessage,
                        timestamp: new Date(),
                    },
                    {
                        role: 'ai',
                        content: result.scenario,
                        timestamp: new Date(),
                    }
                ]);
            }
        } catch (error) {
            console.error('Error starting simulation:', error);
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
            // Evaluate the response
            const response = await fetch('/api/simulation/evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    selectedRole,
                    cvAnalysis,
                    scenarioNumber: currentScenario,
                    userResponse: inputValue,
                    conversationHistory: messages,
                    language: selectedLanguage,
                }),
            });

            const result = await response.json();

            if (result.success) {
                // Add AI feedback
                const feedbackMessage: Message = {
                    role: 'ai',
                    content: result.feedback,
                    timestamp: new Date(),
                    feedback: result.evaluation
                };

                setMessages(prev => [...prev, feedbackMessage]);

                // Store scenario result
                const scenarioResult: ScenarioResult = {
                    scenarioNumber: currentScenario,
                    title: result.scenarioTitle,
                    userActions: [inputValue],
                    aiEvaluation: result.evaluation
                };

                setScenarioResults(prev => [...prev, scenarioResult]);

                // Check if we should move to next scenario or finish
                if (currentScenario < totalScenarios) {
                    // Start next scenario
                    setTimeout(async () => {
                        const nextScenario = currentScenario + 1;
                        setCurrentScenario(nextScenario);

                        const nextResponse = await fetch('/api/simulation/next-scenario', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                selectedRole,
                                cvAnalysis,
                                scenarioNumber: nextScenario,
                                previousResults: [...scenarioResults, scenarioResult],
                                language: selectedLanguage,
                            }),
                        });

                        const nextResult = await nextResponse.json();

                        if (nextResult.success) {
                            setMessages(prev => [...prev, {
                                role: 'ai',
                                content: nextResult.scenario,
                                timestamp: new Date(),
                            }]);
                        }
                    }, 2000);
                } else {
                    // Complete simulation
                    setTimeout(async () => {
                        const completeResponse = await fetch('/api/simulation/complete', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                selectedRole,
                                cvAnalysis,
                                scenarioResults: [...scenarioResults, scenarioResult],
                                language: selectedLanguage,
                            }),
                        });

                        const completeResult = await completeResponse.json();

                        if (completeResult.success) {
                            setFinalReport(completeResult.report);
                            setSimulationComplete(true);

                            setMessages(prev => [...prev, {
                                role: 'ai',
                                content: completeResult.completionMessage,
                                timestamp: new Date(),
                            }]);
                        }
                    }, 2000);
                }
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Simulation Complete Screen
    if (simulationComplete && finalReport) {
        return (
            <div className="flex-1 p-4 md:p-8 max-w-6xl mx-auto space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border-2 border-purple-200 p-8 text-center"
                >
                    <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Award className="w-10 h-10 text-purple-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Simulation Complete!</h1>
                    <p className="text-slate-600">You've successfully completed all role scenarios</p>
                </motion.div>

                {/* Overall Performance */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl border border-slate-200 p-6"
                >
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Overall Performance</h2>

                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                            <div className="text-5xl font-bold text-blue-600 mb-2">{finalReport.overallScore}</div>
                            <div className="text-sm text-slate-600">Overall Score</div>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                            <div className="text-5xl font-bold text-green-600 mb-2">{finalReport.readinessLevel}%</div>
                            <div className="text-sm text-slate-600">Role Readiness</div>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                            <div className="text-5xl font-bold text-purple-600 mb-2">{finalReport.rank}</div>
                            <div className="text-sm text-slate-600">Performance Rank</div>
                        </div>
                    </div>

                    {/* Skill Breakdown */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-slate-900">Skill Breakdown</h3>
                        {Object.entries(finalReport.skillScores || {}).map(([skill, score]: [string, any]) => (
                            <div key={skill} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-slate-700 capitalize">{skill}</span>
                                    <span className="text-sm font-bold text-blue-600">{score}/10</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                                        style={{ width: `${(score / 10) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Key Strengths & Improvements */}
                <div className="grid md:grid-cols-2 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl border border-green-200 p-6"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            <h3 className="text-xl font-bold text-slate-900">Key Strengths</h3>
                        </div>
                        <ul className="space-y-2">
                            {finalReport.keyStrengths?.map((strength: string, i: number) => (
                                <li key={i} className="flex items-start gap-2 text-slate-700">
                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span>{strength}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl border border-orange-200 p-6"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="w-6 h-6 text-orange-600" />
                            <h3 className="text-xl font-bold text-slate-900">Areas to Improve</h3>
                        </div>
                        <ul className="space-y-2">
                            {finalReport.areasToImprove?.map((area: string, i: number) => (
                                <li key={i} className="flex items-start gap-2 text-slate-700">
                                    <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                                    <span>{area}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* Recommendations */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-200 p-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Lightbulb className="w-6 h-6 text-blue-600" />
                        <h3 className="text-xl font-bold text-slate-900">Recommendations</h3>
                    </div>
                    <div className="prose prose-slate max-w-none">
                        <p className="text-slate-700 whitespace-pre-wrap">{finalReport.recommendations}</p>
                    </div>
                </motion.div>

                <button
                    onClick={() => router.push('/dashboard')}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                >
                    Back to Dashboard
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-[calc(100vh-8rem)]">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Role Simulation</h1>
                    <p className="text-slate-500">
                        Practice as: <span className="font-semibold text-purple-600">{selectedRole?.title}</span>
                    </p>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm text-slate-500">Scenario</p>
                        <p className="text-lg font-bold text-purple-600">{currentScenario}/{totalScenarios}</p>
                    </div>
                    <div className="w-16 h-16 rounded-full border-4 border-slate-200 flex items-center justify-center">
                        <span className="text-lg font-bold text-slate-700">
                            {Math.round((currentScenario / totalScenarios) * 100)}%
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
                                            <Brain className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <span className="text-sm font-medium text-slate-600">AI Coach</span>
                                    </div>
                                )}

                                <div className={`rounded-2xl p-4 ${message.role === 'user'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-slate-50 text-slate-900'
                                    }`}>
                                    <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                </div>

                                {message.feedback && (
                                    <div className="mt-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Award className="w-5 h-5 text-blue-600" />
                                            <span className="font-bold text-blue-900">Score: {message.feedback.score}/10</span>
                                        </div>
                                        {message.feedback.strengths.length > 0 && (
                                            <div className="mb-2">
                                                <p className="text-xs font-semibold text-green-700 mb-1">✓ Strengths:</p>
                                                <ul className="text-xs text-slate-700 space-y-1">
                                                    {message.feedback.strengths.map((s, i) => (
                                                        <li key={i}>• {s}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {message.feedback.improvements.length > 0 && (
                                            <div>
                                                <p className="text-xs font-semibold text-orange-700 mb-1">→ Improvements:</p>
                                                <ul className="text-xs text-slate-700 space-y-1">
                                                    {message.feedback.improvements.map((s, i) => (
                                                        <li key={i}>• {s}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}

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
                                <span className="text-slate-600">Evaluating your response...</span>
                            </div>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                <div className="flex gap-3">
                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                        placeholder="Describe how you would handle this situation..."
                        disabled={isLoading || simulationComplete}
                        rows={3}
                        className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-slate-900 placeholder:text-slate-400 resize-none"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isLoading || simulationComplete}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 self-end"
                    >
                        <Send className="w-5 h-5" />
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}
