"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, CheckCircle, AlertCircle, Lightbulb, ArrowRight, Award, Clock, Brain, Download, ArrowLeft, Sparkles, RefreshCw, X, Target, BookOpen, Users, MessageSquare, FileText, Map, Briefcase } from "lucide-react";
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
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ReactMarkdown from "react-markdown";

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

interface Role {
    title: string;
    [key: string]: unknown;
}

interface CVAnalysis {
    [key: string]: unknown;
}

interface FinalReport {
    overallScore: number;
    readinessLevel: number;
    rank: string;
    skillScores: Record<string, number>;
    keyStrengths: string[];
    areasToImprove: string[];
    recommendations: string;
}

export default function SimulationPage() {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [cvAnalysis, setCvAnalysis] = useState<CVAnalysis | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
    const [currentScenario, setCurrentScenario] = useState(1);
    const [totalScenarios] = useState(4); // 2 major + 2 minor scenarios
    const [scenarioResults, setScenarioResults] = useState<ScenarioResult[]>([]);
    const [simulationComplete, setSimulationComplete] = useState(false);
    const [finalReport, setFinalReport] = useState<FinalReport | null>(null);
    const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [comprehensiveReport, setComprehensiveReport] = useState<string | null>(null);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [lastError, setLastError] = useState<string | null>(null);
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const hasInitializedRef = useRef(false);

    const handleDownloadReport = async () => {
        if (!finalReport || !selectedRole) return;
        setIsDownloading(true);

        try {
            // 1. Create a dedicated container
            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            container.style.top = '0';
            container.style.width = '800px'; 
            container.style.backgroundColor = '#ffffff';
            container.style.padding = '40px';
            container.style.fontFamily = "'Tajawal', sans-serif";
            container.style.color = '#0f172a';

            // 2. Build Report HTML
            container.innerHTML = `
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap');
                    * { box-sizing: border-box; }
                    .page-break { page-break-inside: avoid; }
                    .bar-container { background-color: #f1f5f9; border-radius: 99px; height: 8px; width: 100%; overflow: hidden; margin-top: 5px; }
                    .bar-fill { height: 100%; border-radius: 99px; }
                </style>
                <div style="font-family: 'Tajawal', sans-serif;">
                    
                    <!-- Header -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #9333ea; padding-bottom: 20px; margin-bottom: 30px;">
                        <div>
                            <div style="color: #9333ea; font-size: 24px; font-weight: bold;">MA-TRAINING-CONSULTING</div>
                            <div style="color: #64748b; font-size: 14px;">Role Simulation Analysis</div>
                        </div>
                        <div style="text-align: right;">
                            <h1 style="margin: 0; font-size: 20px; color: #1e293b;">${selectedRole.title}</h1>
                            <p style="margin: 5px 0 0 0; color: #64748b; font-size: 12px;">${new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    <!-- Overall Stats -->
                    <div style="display: flex; gap: 20px; margin-bottom: 30px; justify-content: space-between;">
                        <div style="flex: 1; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center; background-color: #eff6ff;">
                             <div style="font-size: 12px; font-weight: bold; color: #64748b; text-transform: uppercase;">Overall Score</div>
                             <div style="font-size: 32px; font-weight: bold; color: #2563eb;">${finalReport.overallScore}/10</div>
                        </div>
                        <div style="flex: 1; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center; background-color: #f0fdf4;">
                             <div style="font-size: 12px; font-weight: bold; color: #64748b; text-transform: uppercase;">Readiness</div>
                             <div style="font-size: 32px; font-weight: bold; color: #16a34a;">${finalReport.readinessLevel}%</div>
                        </div>
                        <div style="flex: 1; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center; background-color: #faf5ff;">
                             <div style="font-size: 12px; font-weight: bold; color: #64748b; text-transform: uppercase;">Rank</div>
                             <div style="font-size: 32px; font-weight: bold; color: #9333ea;">${finalReport.rank}</div>
                        </div>
                    </div>

                    <!-- Skill Breakdown -->
                    <div style="margin-bottom: 30px; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px;">
                        <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Skill Competency Breakdown</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                             ${Object.entries(finalReport.skillScores || {}).map(([skill, score]: [string, number]) => `
                                <div style="margin-bottom: 10px;">
                                    <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; color: #475569; margin-bottom: 4px;">
                                        <span>${skill.replace(/([A-Z])/g, ' $1').trim()}</span>
                                        <span>${score}/10</span>
                                    </div>
                                    <div class="bar-container">
                                        <div class="bar-fill" style="width: ${score * 10}%; background-color: #3b82f6;"></div>
                                    </div>
                                </div>
                             `).join('')}
                        </div>
                    </div>

                    <!-- Strengths & Improvements -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                        <div class="page-break" style="border: 1px solid #bbf7d0; background-color: #f0fdf4; padding: 20px; border-radius: 12px;">
                             <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #166534; text-transform: uppercase;">Key Strengths</h3>
                             <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #14532d; line-height: 1.5;">
                                 ${finalReport.keyStrengths?.map(s => `<li style="margin-bottom: 5px;">${s}</li>`).join('') || '<li>None identified</li>'}
                             </ul>
                        </div>
                        <div class="page-break" style="border: 1px solid #fed7aa; background-color: #fff7ed; padding: 20px; border-radius: 12px;">
                             <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #9a3412; text-transform: uppercase;">Areas for Growth</h3>
                             <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #7c2d12; line-height: 1.5;">
                                 ${finalReport.areasToImprove?.map(s => `<li style="margin-bottom: 5px;">${s}</li>`).join('') || '<li>None identified</li>'}
                             </ul>
                        </div>
                    </div>

                    <!-- Recommendations -->
                    <div class="page-break" style="background-color: #f8fafc; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0;">
                        <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #334155;">Strategic Recommendations</h3>
                        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #475569; white-space: pre-wrap;">${finalReport.recommendations}</p>
                    </div>

                    <!-- Footer -->
                    <div style="margin-top: 50px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
                        MA-TRAINING-CONSULTING • Role Simulation & Capability Analysis
                    </div>
                </div>
            `;

            document.body.appendChild(container);

            // 3. Capture
            const canvas = await html2canvas(container, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: "#ffffff",
                windowWidth: 800
            });

            // 4. Cleanup
            document.body.removeChild(container);

            // 5. Generate PDF
            const imgData = canvas.toDataURL('image/png', 1.0);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgProps = pdf.getImageProperties(imgData);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position -= pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
                heightLeft -= pdfHeight;
            }

            pdf.save(`Simulation_Report_${selectedRole.title.replace(/\s+/g, '_')}.pdf`);

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert("Failed to generate PDF report.");
        } finally {
            setIsDownloading(false);
        }
    };

    const handleGenerateComprehensiveReport = async () => {
        setIsGeneratingReport(true);
        setLastError(null);
        try {
            const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
            const userId = userProfile.email || userProfile.fullName;

            if (!userId) {
                alert(selectedLanguage === 'ar' ? 'لم يتم العثور على معرف المستخدم' :
                      selectedLanguage === 'fr' ? 'Identifiant utilisateur introuvable' :
                      'User ID not found');
                return;
            }

            const response = await fetchWithTimeout('/api/diagnosis/comprehensive-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    language: selectedLanguage
                }),
            }, 90000);

            if (!response.ok) throw new Error(`Server returned ${response.status}`);
            const result = await response.json();

            if (result.success) {
                setComprehensiveReport(result.report);
            } else {
                const msg = selectedLanguage === 'ar' ? 'فشل في إنشاء التقرير الشامل' :
                      selectedLanguage === 'fr' ? 'Échec de la génération du rapport' :
                      'Failed to generate comprehensive report';
                setLastError(msg);
                alert(msg);
            }
        } catch (error) {
            console.error('Error generating comprehensive report:', error);
            const msg = selectedLanguage === 'ar' ? 'حدث خطأ أثناء إنشاء التقرير' :
                  selectedLanguage === 'fr' ? 'Erreur lors de la génération du rapport' :
                  'Error generating report';
            setLastError(msg);
            alert(msg);
        } finally {
            setIsGeneratingReport(false);
        }
    };

    const saveProgress = useCallback(async (currentMessages: Message[], currentResults: ScenarioResult[], scenarioIndex: number) => {
        const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
        const userId = userProfile.email || userProfile.fullName;
        
        if (!userId) return;

        try {
            await fetch('/api/simulation/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    messages: currentMessages,
                    results: currentResults,
                    currentScenario: scenarioIndex,
                    totalScenarios,
                    selectedRole,
                    cvAnalysis
                }),
            });
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    }, [totalScenarios, selectedRole, cvAnalysis]);

    const startSimulation = useCallback(async (role: Role, cv: CVAnalysis, language: string) => {
        setIsLoading(true);
        setLastError(null);
        setTimeLeft(20 * 60); // Reset timer
        try {
            console.log('[Simulation] Starting scenario 1 for role:', role.title);

            const response = await fetchWithTimeout('/api/simulation/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    selectedRole: role,
                    cvAnalysis: cv,
                    language,
                    scenarioNumber: 1
                }),
            }, 60000);

            if (!response.ok) throw new Error(`Server returned ${response.status}`);
            const result = await response.json();
            console.log('[Simulation] Start result:', result);

            if (result.success) {
                const initialMsgs: Message[] = [
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
                ];
                setMessages(initialMsgs);
                // Save initial scenario progress
                saveProgress(initialMsgs, [], 1);
            } else {
                setLastError(selectedLanguage === 'ar' ? 'فشل بدء المحاكاة' : 'Failed to start simulation');
            }
        } catch (error: unknown) {
            console.error('Error starting simulation:', error);
            setLastError(selectedLanguage === 'ar' ? 'فشل بدء المحاكاة. يرجى المحاولة مرة أخرى.' : 'Failed to start simulation. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [selectedLanguage, saveProgress]);

    useEffect(() => {
        const loadInitialData = async () => {
            const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
            const userId = userProfile.email || userProfile.fullName;
            
            let storedRole = localStorage.getItem('selectedRole');
            let storedCV = localStorage.getItem('cvAnalysis');
            let storedLanguage = localStorage.getItem('selectedLanguage');

            if (userId) {
                try {
                    const res = await fetch(`/api/user/progress?userId=${encodeURIComponent(userId)}`);
                    const response = await res.json();

                    if (response.hasData && response.data) {
                        const data = response.data;
                        
                        if (!storedRole && data.selectedRole) {
                            storedRole = JSON.stringify(data.selectedRole);
                            localStorage.setItem('selectedRole', storedRole);
                        }
                        if (!storedCV && data.cvAnalysis) {
                            storedCV = JSON.stringify(data.cvAnalysis);
                            localStorage.setItem('cvAnalysis', storedCV);
                        }
                        if (data.language) {
                            storedLanguage = data.language;
                            localStorage.setItem('selectedLanguage', data.language);
                        }

                        if (data.simulationConversation && data.simulationConversation.length > 0) {
                            const restoredMessages = data.simulationConversation.map((m: { 
                                role: 'ai' | 'user', 
                                content: string, 
                                timestamp: string, 
                                feedback?: { score: number, strengths: string[], improvements: string[] } 
                            }) => ({
                                ...m,
                                timestamp: new Date(m.timestamp)
                            }));
                            setMessages(restoredMessages);
                            setScenarioResults(data.simulationResults || []);
                            setSelectedRole(data.selectedRole);
                            setCvAnalysis(data.cvAnalysis);
                            setSelectedLanguage(data.language || 'en');
                            
                            if (data.completionStatus?.simulationComplete) {
                                setSimulationComplete(true);
                            }
                            return;
                        }
                    }
                } catch (e) {
                    console.error("Failed to load session from API", e);
                }
            }

            if (storedRole && storedCV) {
                const role = JSON.parse(storedRole);
                const cv = JSON.parse(storedCV);
                setSelectedRole(role);
                setCvAnalysis(cv);
                setSelectedLanguage(storedLanguage || 'en');
                startSimulation(role, cv, storedLanguage || 'en');
            } else {
                router.push('/assessment/role-suggestions');
            }
        };

        if (hasInitializedRef.current) return;
        hasInitializedRef.current = true;
        loadInitialData();
    }, [router, startSimulation]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = useCallback(async (forceMessage?: string, isRetry = false) => {
        const messageContent = forceMessage || inputValue;
        if (!messageContent.trim() || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: messageContent,
            timestamp: new Date(),
        };

        if (timerRef.current) clearInterval(timerRef.current);
        
        const initialMessages = !isRetry ? [...messages, userMessage] : messages;
        if (!isRetry) {
            setMessages(initialMessages);
            setInputValue("");
        }
        
        setIsLoading(true);
        setLastError(null);
        
        // Save user message progress
        saveProgress(initialMessages, scenarioResults, currentScenario);

        try {
            // Evaluate the response
            const response = await fetchWithTimeout('/api/simulation/evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    selectedRole,
                    cvAnalysis,
                    scenarioNumber: currentScenario,
                    userResponse: messageContent,
                    conversationHistory: messages,
                    language: selectedLanguage,
                }),
            }, 60000);

            if (!response.ok) throw new Error(`Server returned ${response.status}`);
            const result = await response.json();

            if (result.success) {
                setRetryCount(0);
                // Add AI feedback
                const feedbackMessage: Message = {
                    role: 'ai',
                    content: result.feedback,
                    timestamp: new Date(),
                    feedback: result.evaluation
                };

                const updatedMessages = [...initialMessages, feedbackMessage];
                setMessages(updatedMessages);

                // Store scenario result
                const scenarioResult: ScenarioResult = {
                    scenarioNumber: currentScenario,
                    title: result.scenarioTitle,
                    userActions: [messageContent],
                    aiEvaluation: result.evaluation
                };

                const updatedResults = [...scenarioResults, scenarioResult];
                setScenarioResults(updatedResults);
                
                // Save progress to DB
                saveProgress(updatedMessages, updatedResults, currentScenario);

                // Check if we should move to next scenario or finish
                if (currentScenario < totalScenarios) {
                    // Start next scenario
                    setTimeout(async () => {
                        const nextScenario = currentScenario + 1;
                        setCurrentScenario(nextScenario);
                        setTimeLeft(20 * 60); // Reset timer for next scenario

                        try {
                            const nextResponse = await fetchWithTimeout('/api/simulation/next-scenario', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    selectedRole,
                                    cvAnalysis,
                                    scenarioNumber: nextScenario,
                                    previousResults: updatedResults,
                                    language: selectedLanguage,
                                }),
                            }, 60000);

                            if (!nextResponse.ok) throw new Error(`Server returned ${nextResponse.status}`);
                            const nextResult = await nextResponse.json();

                            if (nextResult.success) {
                                const finalMessages = [...updatedMessages, {
                                    role: 'ai' as const,
                                    content: nextResult.scenario,
                                    timestamp: new Date(),
                                }];
                                setMessages(finalMessages);
                                saveProgress(finalMessages, updatedResults, nextScenario);
                            }
                        } catch (err) {
                            console.error("Error fetching next scenario", err);
                            setLastError(selectedLanguage === 'ar' ? 'فشل تحميل السيناريو التالي' : 'Failed to load next scenario');
                        }
                    }, 2000);
                } else {
                    // Complete simulation
                    setTimeout(async () => {
                        const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
                        
                        try {
                            // Persist diagnosis to MongoDB
                            const completeResponse = await fetchWithTimeout('/api/simulation/complete', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    email: userProfile.email,
                                    selectedRole,
                                    cvAnalysis,
                                    scenarioResults: updatedResults,
                                    language: selectedLanguage,
                                }),
                            }, 90000);

                            if (!completeResponse.ok) throw new Error(`Server returned ${completeResponse.status}`);
                            const completeResult = await completeResponse.json();

                            if (completeResult.success) {
                                // Update local storage to unlock sections immediately
                                const currentProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
                                currentProfile.isDiagnosisComplete = true;
                                localStorage.setItem('userProfile', JSON.stringify(currentProfile));

                                setFinalReport(completeResult.report);
                                setSimulationComplete(true);

                                const finalMsgs = [...updatedMessages, {
                                    role: 'ai' as const,
                                    content: completeResult.completionMessage,
                                    timestamp: new Date(),
                                }];
                                setMessages(finalMsgs);
                                saveProgress(finalMsgs, updatedResults, currentScenario + 1);
                            }
                        } catch (err) {
                            console.error("Error completing simulation", err);
                            setLastError(selectedLanguage === 'ar' ? 'فشل في إكمال المحاكاة' : 'Failed to complete simulation');
                        }
                    }, 2000);
                }
            }
        } catch (error: unknown) {
            console.error('Simulation Error:', error);
            
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
                    handleSendMessage(messageContent, true);
                }, 2000);
                return;
            }

            if (messageContent && !forceMessage) setInputValue(messageContent);
            alert(errorMsg);
        } finally {
            setIsLoading(false);
        }
    }, [inputValue, isLoading, selectedRole, cvAnalysis, currentScenario, messages, selectedLanguage, totalScenarios, scenarioResults, saveProgress, retryCount]);

    const handleEmergencyFinish = async () => {
        if (scenarioResults.length < 2) return;
        
        setIsLoading(true);
        try {
            const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
            
            // Critical fallbacks for 400 errors
            const finalRole = selectedRole || JSON.parse(localStorage.getItem('selectedRole') || 'null');
            const finalCV = cvAnalysis || JSON.parse(localStorage.getItem('cvAnalysis') || 'null');

            if (!finalRole || !finalCV) {
                throw new Error("Missing role or CV data. Please refresh.");
            }

            const completeResponse = await fetch('/api/simulation/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: userProfile.email,
                    selectedRole: finalRole,
                    cvAnalysis: finalCV,
                    scenarioResults,
                    language: selectedLanguage,
                }),
            });

            const completeResult = await completeResponse.json();

            if (completeResult.success) {
                const currentProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
                currentProfile.isDiagnosisComplete = true;
                localStorage.setItem('userProfile', JSON.stringify(currentProfile));

                setFinalReport(completeResult.report);
                setSimulationComplete(true);

                const finalMsgs = [...messages, {
                    role: 'ai' as const,
                    content: completeResult.completionMessage,
                    timestamp: new Date(),
                }];
                setMessages(finalMsgs);
                saveProgress(finalMsgs, scenarioResults, currentScenario + 1);
            }
        } catch (error) {
            console.error('Error in emergency finish:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetSession = () => {
        if (confirm(selectedLanguage === 'ar' ? 'هل أنت متأكد أنك تريد إعادة الجلسة؟ ستفقد كل المحادثات.' : 
                   selectedLanguage === 'fr' ? 'Êtes-vous sûr de vouloir réinitialiser la session ? Toute la conversation sera perdue.' : 
                   "Are you sure you want to reset this session? All conversation will be lost.")) {
            setMessages([]);
            setScenarioResults([]);
            setCurrentScenario(1);
            setSimulationComplete(false);
            setFinalReport(null);
            
            if (selectedRole && cvAnalysis) {
                startSimulation(selectedRole, cvAnalysis, selectedLanguage);
            }
        }
    };

    const handleTimeout = useCallback(() => {
        const timeoutMessage = selectedLanguage === 'ar' ? "انتهى الوقت. سأنتقل للسيناريو التالي." :
            selectedLanguage === 'fr' ? "Temps écoulé. Passage au scénario suivant." : "Time expired. Moving to next scenario.";
        handleSendMessage(timeoutMessage);
    }, [selectedLanguage, handleSendMessage]);

    // Timer Effect
    useEffect(() => {
        if (simulationComplete || isLoading) return;

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    handleTimeout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [currentScenario, simulationComplete, isLoading, handleTimeout]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Simulation Complete Screen
    if (simulationComplete && finalReport) {
        return (
            <div className="simulation-completion-wrapper">
            <div className="flex-1 p-4 md:p-8 max-w-6xl mx-auto space-y-6">
                <div data-html2canvas-ignore>
                    <button
                        onClick={() => router.push('/assessment/role-suggestions')}
                        className="inline-flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">
                            {selectedLanguage === 'ar' ? 'العودة' :
                             selectedLanguage === 'fr' ? 'Retour' : 'Back'}
                        </span>
                    </button>
                </div>
                <div ref={resultsRef} id="simulation-results" className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-linear-to-br from-purple-50 to-blue-50 rounded-2xl border-2 border-purple-200 p-8"
                    >
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                                    <Award className="w-10 h-10 text-purple-600" />
                                </div>
                                <div className="text-left">
                                    <h1 className="text-3xl font-bold text-slate-900 mb-1">Simulation Complete!</h1>
                                    <p className="text-slate-600">Performance report for: <span className="font-bold text-purple-600">{selectedRole?.title}</span></p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => setSimulationComplete(false)}
                                    data-html2canvas-ignore
                                    className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-bold text-slate-700 shadow-sm active:scale-95"
                                >
                                    <MessageSquare className="w-5 h-5 text-slate-400" />
                                    {selectedLanguage === 'ar' ? 'مراجعة المحادثة' : 
                                     selectedLanguage === 'fr' ? 'Revoir la conversation' : 'Review Chat History'}
                                </button>

                                <button
                                    onClick={handleDownloadReport}
                                    disabled={isDownloading}
                                    data-html2canvas-ignore
                                    className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-purple-200 rounded-xl hover:bg-purple-50 transition-all font-bold text-purple-700 shadow-sm active:scale-95"
                                >
                                    {isDownloading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Download className="w-5 h-5" />
                                    )}
                                    {selectedLanguage === 'ar' ? 'تحميل التقرير PDF' :
                                        selectedLanguage === 'fr' ? 'Télécharger le rapport PDF' : 'Download Report PDF'}
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Overall Performance */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
                    >
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Overall Performance</h2>

                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <div className="text-center p-6 bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                                <div className="text-5xl font-black text-blue-600 mb-2">{finalReport.overallScore}</div>
                                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Overall Score</div>
                            </div>
                            <div className="text-center p-6 bg-linear-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
                                <div className="text-5xl font-black text-green-600 mb-2">{finalReport.readinessLevel}%</div>
                                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Role Readiness</div>
                            </div>
                            <div className="text-center p-6 bg-linear-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
                                <div className="text-5xl font-black text-purple-600 mb-2">{finalReport.rank}</div>
                                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Performance Rank</div>
                            </div>
                        </div>

                        {/* Skill Breakdown */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Skill Breakdown</h3>
                            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                                {Object.entries(finalReport.skillScores || {}).map(([skill, score]: [string, number]) => (
                                    <div key={skill} className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold text-slate-700 capitalize">{skill.replace(/([A-Z])/g, ' $1').trim()}</span>
                                            <span className="text-sm font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{score}/10</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-3 block shadow-inner">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(score / 10) * 100}%` }}
                                                className="bg-linear-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-1000"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Key Strengths & Improvements */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl border border-green-200 p-6 shadow-sm"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                                <h3 className="text-xl font-bold text-slate-900">Key Strengths</h3>
                            </div>
                            <ul className="space-y-3">
                                {finalReport.keyStrengths?.map((strength: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3 p-3 bg-green-50 rounded-xl text-slate-700 text-sm font-medium">
                                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                        <span>{strength}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl border border-orange-200 p-6 shadow-sm"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <AlertCircle className="w-6 h-6 text-orange-600" />
                                <h3 className="text-xl font-bold text-slate-900">Areas to Improve</h3>
                            </div>
                            <ul className="space-y-3">
                                {finalReport.areasToImprove?.map((area: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3 p-3 bg-orange-50 rounded-xl text-slate-700 text-sm font-medium">
                                        <AlertCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
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
                        className="bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl p-0.5"
                    >
                        <div className="bg-white rounded-[calc(1rem-2px)] p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <Lightbulb className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">Strategic Recommendations</h3>
                            </div>
                            <div className="prose prose-slate max-w-none">
                                <div className="text-slate-700 leading-relaxed text-lg whitespace-pre-wrap">
                                    {finalReport.recommendations}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Comprehensive Report Section */}
                {comprehensiveReport && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-8 relative overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-2xl"
                    >
                        {/* Decorative Top Banner */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500" />
                        
                        {/* Background Pattern/Watermark */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-indigo-50 to-purple-50 rounded-bl-full opacity-50 z-0" />
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-linear-to-tr from-blue-50 to-cyan-50 rounded-tr-full opacity-50 z-0" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none select-none">
                             <Award className="w-[600px] h-[600px] text-slate-900" />
                        </div>

                        <div className="p-8 md:p-12 relative z-10">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-100">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg text-white">
                                        <Award className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                                            {selectedLanguage === 'ar' ? 'التقرير التشخيصي الشامل' :
                                             selectedLanguage === 'fr' ? 'Rapport Diagnostique Complet' :
                                             'Comprehensive Diagnostic Report'}
                                        </h2>
                                        <p className="text-slate-500 font-medium mt-1">
                                            {selectedLanguage === 'ar' ? 'تحليل استراتيجي للقدرات والكفاءات المهنية' :
                                             selectedLanguage === 'fr' ? 'Analyse stratégique des compétences professionnelles' :
                                             'Strategic analysis of professional capabilities'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        const blob = new Blob([comprehensiveReport], { type: 'text/plain' });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = `Comprehensive_Diagnosis_${new Date().toISOString().split('T')[0]}.txt`;
                                        a.click();
                                        URL.revokeObjectURL(url);
                                    }}
                                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all flex items-center gap-2 text-sm"
                                >
                                    <Download className="w-4 h-4" />
                                    <span>
                                        {selectedLanguage === 'ar' ? 'تصدير نصي' :
                                         selectedLanguage === 'fr' ? 'Exporter en texte' :
                                         'Export to Text'}
                                    </span>
                                </button>
                            </div>

                            <div className="prose prose-slate prose-lg max-w-none font-sans text-lg text-slate-700">
                                <ReactMarkdown
                                    components={{
                                        h1: ({ ...props }) => <h1 className="text-3xl md:text-4xl font-black text-center text-transparent bg-clip-text bg-linear-to-r from-indigo-700 to-purple-600 mb-10 pb-6 border-b-2 border-indigo-100" {...props} />,
                                        h2: ({ ...props }) => <h2 className="text-xl md:text-2xl font-bold text-indigo-900 mt-12 mb-6 flex items-center gap-3 bg-indigo-50/80 p-5 rounded-2xl border-l-4 border-indigo-500 shadow-sm" {...props} />,
                                        h3: ({ ...props }) => <h3 className="text-lg md:text-xl font-bold text-slate-800 mt-8 mb-4 border-b border-slate-200 pb-2 flex items-center gap-2" {...props} />,
                                        p: ({ ...props }) => <p className="mb-6 leading-loose text-slate-700 text-[17px]" {...props} />,
                                        ul: ({ ...props }) => <ul className="space-y-4 mb-8 bg-slate-50 p-6 rounded-3xl border border-slate-200/60 shadow-inner" {...props} />,
                                        li: ({ ...props }) => (
                                            <li className="flex items-start gap-3" {...props}>
                                                <span className="mt-2.5 w-2 h-2 rounded-full bg-indigo-600 shrink-0 shadow-sm shadow-indigo-500/30" />
                                                <span className="flex-1 leading-relaxed">{props.children}</span>
                                            </li>
                                        ),
                                        strong: ({ ...props }) => <strong className="font-bold text-indigo-900 bg-indigo-50/80 px-1.5 py-0.5 rounded-md mx-0.5 border border-indigo-100/50" {...props} />,
                                        blockquote: ({ ...props }) => (
                                            <div className="relative my-8 group">
                                                <div className="absolute -left-2 top-0 bottom-0 w-1 bg-linear-to-b from-amber-400 to-orange-400 rounded-full" />
                                                <blockquote className="italic text-slate-700 bg-amber-50/50 p-6 rounded-2xl border border-amber-100/50 pl-8 leading-relaxed" {...props} />
                                            </div>
                                        ),
                                        hr: ({ ...props }) => <hr className="my-10 border-slate-200" {...props} />,
                                    }}
                                >
                                    {comprehensiveReport || ''}
                                </ReactMarkdown>
                            </div>
                            
                            {/* Professional Footer */}
                            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span>Verified Assessment</span>
                                </div>
                                <span>MA-TRAINING-CONSULTING • AI CAREER ARCHITECTURE</span>
                                <span>{new Date().getFullYear()}</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Action Button - Strategically enhanced to guide user */}
                <div className="mt-12 flex justify-center w-full px-4">
                    {!comprehensiveReport ? (
                        <div className="relative w-full max-w-4xl group">
                            {/* Giant Pulsing Background Glow */}
                            {!isGeneratingReport && (
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
                                    className="absolute -inset-4 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-[3rem] blur-2xl z-0"
                                />
                            )}
                            
                            <motion.button
                                onClick={handleGenerateComprehensiveReport}
                                disabled={isGeneratingReport}
                                data-html2canvas-ignore
                                whileHover={{ scale: 1.02, y: -5 }}
                                whileTap={{ scale: 0.98 }}
                                className="relative z-10 w-full py-8 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-[2.5rem] font-black text-2xl md:text-3xl transition-all shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:shadow-[0_30px_60px_rgba(79,70,229,0.5)] flex items-center justify-center gap-6 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-white/20"
                            >
                                {isGeneratingReport ? (
                                    <>
                                        <Loader2 className="w-10 h-10 animate-spin" />
                                        <span>
                                            {selectedLanguage === 'ar' ? 'جاري إنشاء التقرير الشامل...' :
                                             selectedLanguage === 'fr' ? 'Génération du rapport en cours...' :
                                             'Generating Report...'}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                                            <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
                                        </div>
                                        <span>
                                            {selectedLanguage === 'ar' ? 'إنشاء التقرير التشخيصي الشامل' :
                                             selectedLanguage === 'fr' ? 'Générer le Rapport Complet' :
                                             'Generate Comprehensive Report'}
                                        </span>
                                        <motion.div
                                            animate={{ x: [0, 8, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                            className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
                                        >
                                            <ArrowRight className="w-8 h-8" />
                                        </motion.div>
                                    </>
                                )}
                            </motion.button>
                        </div>
                    ) : (
                        <div className="relative w-full max-w-4xl group">
                            {/* Pulsing Green Glow */}
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
                                className="absolute -inset-4 bg-linear-to-r from-green-600 to-emerald-600 rounded-[3rem] blur-2xl z-0"
                            />
                            
                            <motion.button
                                onClick={async () => {
                                    try {
                                        const savedProfile = localStorage.getItem("userProfile");
                                        const profile = savedProfile ? JSON.parse(savedProfile) : null;
                                        const userId = profile?.email || profile?.fullName;
                                        
                                        if (userId) {
                                            await fetch('/api/user/progress', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({
                                                    userId,
                                                    updateData: {
                                                        currentStep: 'completed',
                                                        completionStatus: 'complete',
                                                        completedAt: new Date()
                                                    }
                                                })
                                            });
                                        }
                                    } catch (error) {
                                        console.error("Failed to update status", error);
                                    } finally {
                                        setShowCompletionModal(true);
                                    }
                                }}
                                data-html2canvas-ignore
                                whileHover={{ scale: 1.02, y: -5 }}
                                whileTap={{ scale: 0.98 }}
                                className="relative z-10 w-full py-8 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-[2.5rem] font-black text-2xl md:text-3xl transition-all shadow-[0_20px_50px_rgba(22,163,74,0.3)] hover:shadow-[0_30px_60px_rgba(22,163,74,0.5)] flex items-center justify-center gap-6 border-2 border-white/20"
                            >
                                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                                    <CheckCircle className="w-8 h-8 text-white animate-pulse" />
                                </div>
                                <span>
                                    {selectedLanguage === 'ar' ? 'إتمام وإنهاء التشخيص بالكامل' :
                                     selectedLanguage === 'fr' ? 'Finaliser le Diagnostic Complet' :
                                     'Complete & Finish Diagnosis'}
                                </span>
                                <motion.div
                                    animate={{ x: [0, 8, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
                                >
                                    <ArrowRight className="w-8 h-8" />
                                </motion.div>
                            </motion.button>
                        </div>
                    )}
                </div>
            </div>

        {/* 🎉 Completion Modal - Integrated into Report View */}
        {showCompletionModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => {
                        setShowCompletionModal(false);
                        router.push('/dashboard');
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative text-left"
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => {
                                setShowCompletionModal(false);
                                router.push('/dashboard');
                            }}
                            className="absolute top-6 right-6 w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors z-10"
                        >
                            <X className="w-5 h-5 text-slate-600" />
                        </button>

                        {/* Header */}
                        <div className="bg-linear-to-r from-green-600 to-emerald-600 text-white p-8 md:p-12 rounded-t-3xl text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />
                            
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10"
                            >
                                <CheckCircle className="w-14 h-14 text-white" />
                            </motion.div>
                            
                            <h2 className="text-3xl md:text-4xl font-black mb-3 relative z-10">
                                {selectedLanguage === 'ar' ? '🎉 تهانينا! اكتمل التشخيص' :
                                 selectedLanguage === 'fr' ? '🎉 Félicitations ! Diagnostic Terminé' :
                                 '🎉 Congratulations! Diagnosis Complete'}
                            </h2>
                            <p className="text-lg text-white/90 max-w-2xl mx-auto relative z-10">
                                {selectedLanguage === 'ar' ? 'الآن يمكنك الوصول إلى جميع الخدمات المتاحة لتطوير مسارك المهني' :
                                 selectedLanguage === 'fr' ? 'Vous avez maintenant accès à tous les services disponibles pour développer votre carrière' :
                                 'You now have access to all available services to develop your career'}
                            </p>
                        </div>

                        {/* Services Grid */}
                        <div className="p-8 md:p-12">
                            <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center uppercase tracking-wider">
                                {selectedLanguage === 'ar' ? 'الخدمات المتاحة الآن' :
                                 selectedLanguage === 'fr' ? 'Services Disponibles Maintenant' :
                                 'Available Services Now'}
                            </h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Service 1: Real Simulations */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-linear-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-6 hover:shadow-lg transition-all group cursor-pointer"
                                >
                                    <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Target className="w-6 h-6 text-white" />
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-900 mb-2">
                                        {selectedLanguage === 'ar' ? 'محاكاة واقعية' :
                                         selectedLanguage === 'fr' ? 'Simulations Réelles' :
                                         'Real Simulations'}
                                    </h4>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {selectedLanguage === 'ar' ? 'تدرب على سيناريوهات واقعية لتطوير مهاراتك المهنية' :
                                         selectedLanguage === 'fr' ? 'Entraînez-vous sur des scénarios réels pour développer vos compétences' :
                                         'Practice real-world scenarios to develop your professional skills'}
                                    </p>
                                </motion.div>

                                {/* Service 2: Executive Workshops */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-linear-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 hover:shadow-lg transition-all group cursor-pointer"
                                >
                                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Users className="w-6 h-6 text-white" />
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-900 mb-2">
                                        {selectedLanguage === 'ar' ? 'ورش تنفيذية' :
                                         selectedLanguage === 'fr' ? 'Workshops Exécutifs' :
                                         'Executive Workshops'}
                                    </h4>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {selectedLanguage === 'ar' ? 'ورش عمل متخصصة لتطوير المهارات القيادية والإدارية' :
                                         selectedLanguage === 'fr' ? 'Ateliers spécialisés pour développer les compétences de leadership' :
                                         'Specialized workshops to develop leadership and management skills'}
                                    </p>
                                </motion.div>

                                {/* Service 3: AI Advisor */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-linear-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-6 hover:shadow-lg transition-all group cursor-pointer"
                                >
                                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Brain className="w-6 h-6 text-white" />
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-900 mb-2">
                                        {selectedLanguage === 'ar' ? 'مستشار ذكاء اصطناعي' :
                                         selectedLanguage === 'fr' ? 'Conseiller IA' :
                                         'AI Advisor'}
                                    </h4>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {selectedLanguage === 'ar' ? 'احصل على نصائح مخصصة من مستشار ذكاء اصطناعي متقدم' :
                                         selectedLanguage === 'fr' ? 'Obtenez des conseils personnalisés d\'un conseiller IA avancé' :
                                         'Get personalized advice from an advanced AI advisor'}
                                    </p>
                                </motion.div>

                                {/* Service 4: Knowledge Base */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-linear-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 hover:shadow-lg transition-all group cursor-pointer"
                                >
                                    <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <BookOpen className="w-6 h-6 text-white" />
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-900 mb-2">
                                        {selectedLanguage === 'ar' ? 'قاعدة المعرفة' :
                                         selectedLanguage === 'fr' ? 'Base de Connaissances' :
                                         'Knowledge Base'}
                                    </h4>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {selectedLanguage === 'ar' ? 'مكتبة شاملة من الموارد والمقالات لتطوير معرفتك' :
                                         selectedLanguage === 'fr' ? 'Bibliothèque complète de ressources et d\'articles pour développer vos connaissances' :
                                         'Comprehensive library of resources and articles to expand your knowledge'}
                                    </p>
                                </motion.div>

                                {/* Service 5: Resource Center */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="bg-linear-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 hover:shadow-lg transition-all group cursor-pointer"
                                >
                                    <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <FileText className="w-6 h-6 text-white" />
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-900 mb-2">
                                        {selectedLanguage === 'ar' ? 'مركز الموارد' :
                                         selectedLanguage === 'fr' ? 'Centre de Ressources' :
                                         'Resource Center'}
                                    </h4>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {selectedLanguage === 'ar' ? 'أدوات ونماذج جاهزة لدعم تطورك المهني' :
                                         selectedLanguage === 'fr' ? 'Outils et modèles prêts à l\'emploi pour soutenir votre développement' :
                                         'Ready-to-use tools and templates to support your professional development'}
                                    </p>
                                </motion.div>

                                {/* Service 6: Expert Consultation */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="bg-linear-to-br from-rose-50 to-pink-50 border-2 border-rose-200 rounded-2xl p-6 hover:shadow-lg transition-all group cursor-pointer"
                                >
                                    <div className="w-12 h-12 bg-rose-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <MessageSquare className="w-6 h-6 text-white" />
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-900 mb-2">
                                        {selectedLanguage === 'ar' ? 'استشارة خبراء' :
                                         selectedLanguage === 'fr' ? 'Consultation d\'Experts' :
                                         'Expert Consultation'}
                                    </h4>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {selectedLanguage === 'ar' ? 'تواصل مع خبراء متخصصين للحصول على إرشادات مخصصة' :
                                         selectedLanguage === 'fr' ? 'Connectez-vous avec des experts pour obtenir des conseils personnalisés' :
                                         'Connect with specialized experts for personalized guidance'}
                                    </p>
                                </motion.div>

                                {/* Service 7: Career Roadmap */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                    className="bg-linear-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-2xl p-6 hover:shadow-lg transition-all group cursor-pointer"
                                >
                                    <div className="w-12 h-12 bg-cyan-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Map className="w-6 h-6 text-white" />
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-900 mb-2">
                                        {selectedLanguage === 'ar' ? 'خارطة الطريق المهنية' :
                                         selectedLanguage === 'fr' ? 'Feuille de Route' :
                                         'Career Roadmap'}
                                    </h4>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {selectedLanguage === 'ar' ? 'خطة مخصصة لتحقيق أهدافك المهنية خطوة بخطوة' :
                                         selectedLanguage === 'fr' ? 'Plan personnalisé pour atteindre vos objectifs professionnels' :
                                         'Personalized plan to achieve your career goals step by step'}
                                    </p>
                                </motion.div>

                                {/* Service 8: Professional Portfolio */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                    className="bg-linear-to-br from-violet-50 to-purple-50 border-2 border-violet-200 rounded-2xl p-6 hover:shadow-lg transition-all group cursor-pointer"
                                >
                                    <div className="w-12 h-12 bg-violet-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Briefcase className="w-6 h-6 text-white" />
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-900 mb-2">
                                        {selectedLanguage === 'ar' ? 'ملف مهني متقدم' :
                                         selectedLanguage === 'fr' ? 'Portfolio Professionnel' :
                                         'Professional Portfolio'}
                                    </h4>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {selectedLanguage === 'ar' ? 'ملف شامل يعرض إنجازاتك ومهاراتك بشكل احترافي' :
                                         selectedLanguage === 'fr' ? 'Portfolio complet présentant vos réalisations professionnellement' :
                                         'Comprehensive portfolio showcasing your achievements professionally'}
                                    </p>
                                </motion.div>
                            </div>

                            {/* CTA Button */}
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9 }}
                                onClick={() => {
                                    setShowCompletionModal(false);
                                    router.push('/dashboard');
                                }}
                                className="mt-10 w-full py-5 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3"
                            >
                                {selectedLanguage === 'ar' ? 'انتقل إلى لوحة التحكم' :
                                 selectedLanguage === 'fr' ? 'Aller au Tableau de Bord' :
                                 'Go to Dashboard'}
                                <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
            </div>
        );
    }

    return (
        <>
        <div className="flex-1 flex flex-col h-[calc(100vh-8rem)] max-w-5xl mx-auto w-full font-sans">
            {/* Header Section */}
            <div className="mb-4 flex flex-col items-center text-center gap-4 px-4 shrink-0 relative">
                <button 
                    onClick={() => router.push('/assessment/role-suggestions')}
                    className="absolute left-0 top-2 p-2 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10"
                >
                    <div className="absolute -inset-1 bg-linear-to-r from-purple-600 to-blue-400 rounded-2xl blur opacity-20"></div>
                    <div className="relative bg-white/50 backdrop-blur-sm px-8 py-3 rounded-2xl border border-slate-200/60 shadow-sm">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">
                            Role <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-blue-600">Simulation</span>
                        </h1>
                        <p className="text-slate-500 text-sm font-medium flex items-center justify-center gap-2">
                            <span>Practice as:</span>
                            <span className="font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-lg border border-purple-100 text-xs uppercase tracking-wide">
                                {selectedRole?.title}
                            </span>
                        </p>
                    </div>
                </motion.div>

                {/* Progress & Timer Bar */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap justify-center items-center gap-4 bg-white/80 backdrop-blur-sm px-5 py-2 rounded-2xl shadow-sm border border-slate-200 w-full md:w-auto"
                >
                    {/* Progress */}
                    <div className="flex items-center gap-3 pr-4 border-r border-slate-200">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Scenario</span>
                        <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden shrink-0">
                            <motion.div 
                                className="h-full bg-linear-to-r from-purple-500 to-blue-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${(currentScenario / totalScenarios) * 100}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                        <span className="text-sm font-black text-purple-600">{currentScenario}/{totalScenarios}</span>
                    </div>

                    {/* Timer */}
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${timeLeft < 60 ? 'bg-red-50 text-red-600 animate-pulse' : 'text-slate-600'}`}>
                        <Clock className={`w-4 h-4 ${timeLeft < 60 ? 'text-red-500' : 'text-slate-400'}`} />
                        <span className={`font-mono font-bold text-lg ${timeLeft < 60 ? 'text-red-600' : 'text-slate-700'}`}>
                            {formatTime(timeLeft)}
                        </span>
                    </div>

                    {/* Reset Button */}
                    <button 
                        onClick={handleResetSession}
                        className="text-xs font-bold text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors pl-4 border-l border-slate-200"
                    >
                        <RefreshCw className="w-3 h-3" />
                        Reset
                    </button>
                </motion.div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col bg-white/60 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 overflow-hidden mx-2 md:mx-0 relative">
                
                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
                    {messages.map((message, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[90%] md:max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'} group`}>
                                {message.role === 'ai' && (
                                    <div className="flex items-center gap-3 mb-2 ml-1">
                                        <div className="w-8 h-8 rounded-xl bg-linear-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20 text-white">
                                            <Brain className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Scenario Manager</span>
                                    </div>
                                )}

                                <div className={`relative p-5 md:p-6 shadow-sm border ${message.role === 'user'
                                    ? 'bg-linear-to-br from-slate-900 to-slate-800 text-white rounded-3xl rounded-tr-none border-slate-700'
                                    : 'bg-white text-slate-700 rounded-3xl rounded-tl-none border-slate-100'
                                    }`}>
                                    <p className="leading-relaxed whitespace-pre-wrap text-[15px]">{message.content}</p>
                                    
                                    {/* Subtle shine effect for user bubbles */}
                                    {message.role === 'user' && (
                                        <div className="absolute inset-0 rounded-3xl rounded-tr-none bg-linear-to-t from-white/5 to-transparent pointer-events-none" />
                                    )}
                                </div>

                                {/* Feedback Section */}
                                {message.feedback && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-4 mx-2 overflow-hidden"
                                    >
                                        <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-100 rounded-2xl p-4 md:p-5 relative">
                                            <div className="absolute top-0 right-0 p-3 opacity-10">
                                                <Award className="w-16 h-16 text-blue-600" />
                                            </div>
                                            
                                            <div className="flex items-center gap-3 mb-4 relative z-10">
                                                <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-black border border-blue-200">
                                                    Score: {message.feedback.score}/10
                                                </div>
                                                <div className="h-px flex-1 bg-blue-200"></div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4 relative z-10">
                                                {message.feedback.strengths.length > 0 && (
                                                    <div className="bg-white/60 rounded-xl p-3 border border-blue-100">
                                                        <p className="text-xs font-bold text-green-700 mb-2 uppercase tracking-wide flex items-center gap-1">
                                                            <CheckCircle className="w-3 h-3" /> Strengths
                                                        </p>
                                                        <ul className="text-sm text-slate-600 space-y-1.5 ml-1">
                                                            {message.feedback.strengths.map((s, i) => (
                                                                <li key={i} className="flex items-start gap-2">
                                                                    <span className="block w-1 h-1 rounded-full bg-green-400 mt-2 shrink-0"></span>
                                                                    {s}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                
                                                {message.feedback.improvements.length > 0 && (
                                                    <div className="bg-white/60 rounded-xl p-3 border border-blue-100">
                                                        <p className="text-xs font-bold text-orange-700 mb-2 uppercase tracking-wide flex items-center gap-1">
                                                            <Lightbulb className="w-3 h-3" /> To Improve
                                                        </p>
                                                        <ul className="text-sm text-slate-600 space-y-1.5 ml-1">
                                                            {message.feedback.improvements.map((s, i) => (
                                                                <li key={i} className="flex items-start gap-2">
                                                                    <span className="block w-1 h-1 rounded-full bg-orange-400 mt-2 shrink-0"></span>
                                                                    {s}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                <span className={`text-[10px] uppercase font-bold text-slate-300 mt-2 block px-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </motion.div>
                    ))}

                    {/* Loading Indicator */}
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start"
                        >
                            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-100 shadow-sm ml-4">
                                <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
                                <span className="text-slate-500 text-sm font-medium">
                                    {retryCount > 0 
                                        ? (selectedLanguage === 'ar' ? `جاري إعادة المحاولة (${retryCount}/2)...` : `Retrying (${retryCount}/2)...`)
                                        : (selectedLanguage === 'ar' ? 'جاري تحليل إجابتك...' : 'Analyzing your response...')}
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

                {/* Input Area */}
                <div className="bg-white border-t border-slate-100 p-4 md:p-6 shrink-0 relative z-20">
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="relative flex-1 w-full">
                            <textarea
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                placeholder="Describe how you would handle this situation..."
                                disabled={isLoading || simulationComplete}
                                rows={2}
                                className="w-full pl-6 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-500/10 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium resize-none"
                            />
                        </div>
                        
                        <button
                            onClick={() => handleSendMessage()}
                            disabled={!inputValue.trim() || isLoading || simulationComplete}
                            className="w-full md:w-auto px-8 py-4 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-purple-600/20 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                            <Send className="w-5 h-5" />
                            <span className="hidden md:inline">Submit Reponse</span>
                            <span className="md:hidden">Submit</span>
                        </button>
                    </div>

                    {/* Emergency Finish Button - Unlocks after 2 scenarios */}
                    <div className="mt-6 pt-4 border-t border-slate-100 flex justify-center">
                        <button
                            onClick={handleEmergencyFinish}
                            disabled={scenarioResults.length < 2 || isLoading || simulationComplete}
                            className="group px-10 py-4 bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-amber-600/20 hover:shadow-2xl hover:shadow-amber-600/40 hover:-translate-y-1 flex items-center justify-center gap-3 w-full md:w-auto disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            {selectedLanguage === 'ar' ? 'إنهاء المحاكاة والحصول على التقرير' :
                                selectedLanguage === 'fr' ? 'Terminer et obtenir le rapport' : 'Finish & Get Report'}
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* 🎉 Completion Modal - Shows all available services */}
        {showCompletionModal && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => {
                    setShowCompletionModal(false);
                    router.push('/dashboard');
                }}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative"
                >
                    {/* Close Button */}
                    <button
                        onClick={() => {
                            setShowCompletionModal(false);
                            router.push('/dashboard');
                        }}
                        className="absolute top-6 right-6 w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors z-10"
                    >
                        <X className="w-5 h-5 text-slate-600" />
                    </button>

                    {/* Header */}
                    <div className="bg-linear-to-r from-green-600 to-emerald-600 text-white p-8 md:p-12 rounded-t-3xl text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />
                        
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10"
                        >
                            <CheckCircle className="w-14 h-14 text-white" />
                        </motion.div>
                        
                        <h2 className="text-3xl md:text-4xl font-black mb-3 relative z-10">
                            {selectedLanguage === 'ar' ? '🎉 تهانينا! اكتمل التشخيص' :
                             selectedLanguage === 'fr' ? '🎉 Félicitations ! Diagnostic Terminé' :
                             '🎉 Congratulations! Diagnosis Complete'}
                        </h2>
                        <p className="text-lg text-white/90 max-w-2xl mx-auto relative z-10">
                            {selectedLanguage === 'ar' ? 'الآن يمكنك الوصول إلى جميع الخدمات المتاحة لتطوير مسارك المهني' :
                             selectedLanguage === 'fr' ? 'Vous avez maintenant accès à tous les services disponibles pour développer votre carrière' :
                             'You now have access to all available services to develop your career'}
                        </p>
                    </div>

                    {/* Services Grid */}
                    <div className="p-8 md:p-12">
                        <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
                            {selectedLanguage === 'ar' ? 'الخدمات المتاحة الآن' :
                             selectedLanguage === 'fr' ? 'Services Disponibles Maintenant' :
                             'Available Services Now'}
                        </h3>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Service 1: Real Simulations */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-linear-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-6 hover:shadow-lg transition-all group cursor-pointer"
                            >
                                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Target className="w-6 h-6 text-white" />
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 mb-2">
                                    {selectedLanguage === 'ar' ? 'محاكاة واقعية' :
                                     selectedLanguage === 'fr' ? 'Simulations Réelles' :
                                     'Real Simulations'}
                                </h4>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {selectedLanguage === 'ar' ? 'تدرب على سيناريوهات واقعية لتطوير مهاراتك المهنية' :
                                     selectedLanguage === 'fr' ? 'Entraînez-vous sur des scénarios réels pour développer vos compétences' :
                                     'Practice real-world scenarios to develop your professional skills'}
                                </p>
                            </motion.div>

                            {/* Service 2: Executive Workshops */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-linear-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 hover:shadow-lg transition-all group cursor-pointer"
                            >
                                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 mb-2">
                                    {selectedLanguage === 'ar' ? 'ورش تنفيذية' :
                                     selectedLanguage === 'fr' ? 'Workshops Exécutifs' :
                                     'Executive Workshops'}
                                </h4>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {selectedLanguage === 'ar' ? 'ورش عمل متخصصة لتطوير المهارات القيادية والإدارية' :
                                     selectedLanguage === 'fr' ? 'Ateliers spécialisés pour développer les compétences de leadership' :
                                     'Specialized workshops to develop leadership and management skills'}
                                </p>
                            </motion.div>

                            {/* Service 3: AI Advisor */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-linear-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-6 hover:shadow-lg transition-all group cursor-pointer"
                            >
                                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Brain className="w-6 h-6 text-white" />
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 mb-2">
                                    {selectedLanguage === 'ar' ? 'مستشار ذكاء اصطناعي' :
                                     selectedLanguage === 'fr' ? 'Conseiller IA' :
                                     'AI Advisor'}
                                </h4>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {selectedLanguage === 'ar' ? 'احصل على نصائح مخصصة من مستشار ذكاء اصطناعي متقدم' :
                                     selectedLanguage === 'fr' ? 'Obtenez des conseils personnalisés d\'un conseiller IA avancé' :
                                     'Get personalized advice from an advanced AI advisor'}
                                </p>
                            </motion.div>

                            {/* Service 4: Knowledge Base */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-linear-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 hover:shadow-lg transition-all group cursor-pointer"
                            >
                                <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <BookOpen className="w-6 h-6 text-white" />
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 mb-2">
                                    {selectedLanguage === 'ar' ? 'قاعدة المعرفة' :
                                     selectedLanguage === 'fr' ? 'Base de Connaissances' :
                                     'Knowledge Base'}
                                </h4>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {selectedLanguage === 'ar' ? 'مكتبة شاملة من الموارد والمقالات لتطوير معرفتك' :
                                     selectedLanguage === 'fr' ? 'Bibliothèque complète de ressources et d\'articles pour développer vos connaissances' :
                                     'Comprehensive library of resources and articles to expand your knowledge'}
                                </p>
                            </motion.div>

                            {/* Service 5: Resource Center */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-linear-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 hover:shadow-lg transition-all group cursor-pointer"
                            >
                                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <FileText className="w-6 h-6 text-white" />
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 mb-2">
                                    {selectedLanguage === 'ar' ? 'مركز الموارد' :
                                     selectedLanguage === 'fr' ? 'Centre de Ressources' :
                                     'Resource Center'}
                                </h4>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {selectedLanguage === 'ar' ? 'أدوات ونماذج جاهزة لدعم تطورك المهني' :
                                     selectedLanguage === 'fr' ? 'Outils et modèles prêts à l\'emploi pour soutenir votre développement' :
                                     'Ready-to-use tools and templates to support your professional development'}
                                </p>
                            </motion.div>

                            {/* Service 6: Expert Consultation */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="bg-linear-to-br from-rose-50 to-pink-50 border-2 border-rose-200 rounded-2xl p-6 hover:shadow-lg transition-all group cursor-pointer"
                            >
                                <div className="w-12 h-12 bg-rose-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <MessageSquare className="w-6 h-6 text-white" />
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 mb-2">
                                    {selectedLanguage === 'ar' ? 'استشارة خبراء' :
                                     selectedLanguage === 'fr' ? 'Consultation d\'Experts' :
                                     'Expert Consultation'}
                                </h4>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {selectedLanguage === 'ar' ? 'تواصل مع خبراء متخصصين للحصول على إرشادات مخصصة' :
                                     selectedLanguage === 'fr' ? 'Connectez-vous avec des experts pour obtenir des conseils personnalisés' :
                                     'Connect with specialized experts for personalized guidance'}
                                </p>
                            </motion.div>

                            {/* Service 7: Career Roadmap */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                className="bg-linear-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-2xl p-6 hover:shadow-lg transition-all group cursor-pointer"
                            >
                                <div className="w-12 h-12 bg-cyan-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Map className="w-6 h-6 text-white" />
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 mb-2">
                                    {selectedLanguage === 'ar' ? 'خارطة الطريق المهنية' :
                                     selectedLanguage === 'fr' ? 'Feuille de Route' :
                                     'Career Roadmap'}
                                </h4>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {selectedLanguage === 'ar' ? 'خطة مخصصة لتحقيق أهدافك المهنية خطوة بخطوة' :
                                     selectedLanguage === 'fr' ? 'Plan personnalisé pour atteindre vos objectifs professionnels' :
                                     'Personalized plan to achieve your career goals step by step'}
                                </p>
                            </motion.div>

                            {/* Service 8: Professional Portfolio */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="bg-linear-to-br from-violet-50 to-purple-50 border-2 border-violet-200 rounded-2xl p-6 hover:shadow-lg transition-all group cursor-pointer"
                            >
                                <div className="w-12 h-12 bg-violet-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Briefcase className="w-6 h-6 text-white" />
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 mb-2">
                                    {selectedLanguage === 'ar' ? 'ملف مهني متقدم' :
                                     selectedLanguage === 'fr' ? 'Portfolio Professionnel' :
                                     'Professional Portfolio'}
                                </h4>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {selectedLanguage === 'ar' ? 'ملف شامل يعرض إنجازاتك ومهاراتك بشكل احترافي' :
                                     selectedLanguage === 'fr' ? 'Portfolio complet présentant vos réalisations professionnellement' :
                                     'Comprehensive portfolio showcasing your achievements professionally'}
                                </p>
                            </motion.div>
                        </div>

                        {/* CTA Button */}
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                            onClick={() => {
                                setShowCompletionModal(false);
                                router.push('/dashboard');
                            }}
                            className="mt-10 w-full py-5 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3"
                        >
                            {selectedLanguage === 'ar' ? 'انتقل إلى لوحة التحكم' :
                             selectedLanguage === 'fr' ? 'Aller au Tableau de Bord' :
                             'Go to Dashboard'}
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        )}
        </>
    );
}
