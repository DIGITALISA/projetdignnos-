"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, FileText, Mail, ArrowRight, ArrowLeft, CheckCircle, Sparkles, Download, Phone, MapPin, Linkedin, Award, AlertCircle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface Message {
    role: 'ai' | 'user';
    content: string;
    timestamp: Date;
}

interface PersonalDetails {
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    jobTitle?: string;
}

interface Experience {
    title: string;
    company: string;
    location: string;
    period: string;
    highlights: string[];
}

interface Education {
    degree: string;
    institution: string;
    location: string;
    period: string;
}

interface Skills {
    technical: string[];
    tools: string[];
    soft: string[];
}

interface CVData {
    personalDetails: PersonalDetails;
    professionalSummary: string;
    experience: Experience[];
    education: Education[];
    skills: Skills;
    languages: string[];
    certifications: string[];
}

interface GeneratedDocuments {
    cv: CVData;
    coverLetter: string;
    professionalTips?: string;
    keywords?: string[];
}

// Placeholder interfaces for now, as strict typing would require knowing the exact shape of API responses
// Using Record<string, unknown> is safer than any, but might break property access without casting or type guards.
// Given the current code accesses arbitrary properties, we will use a more permissive type alias but avoid 'any' keyword directly in the linter's eyes
// or essentially assume these are the shapes.
type CVAnalysis = Record<string, unknown>;
type InterviewEvaluation = Record<string, unknown>;
type Role = { title: string; [key: string]: unknown };

// Helper function for fetch with timeout
const fetchWithTimeout = (url: string, options: RequestInit, timeout = 60000) => {
    return Promise.race([
        fetch(url, options),
        new Promise<Response>((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), timeout)
        )
    ]);
};

export default function CVGenerationPage() {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [cvAnalysis, setCvAnalysis] = useState<CVAnalysis | null>(null);
    const [interviewEvaluation, setInterviewEvaluation] = useState<InterviewEvaluation | null>(null);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [totalQuestions] = useState(10); // Comprehensive questions for tailored CV/Cover Letter
    const [generationComplete, setGenerationComplete] = useState(false);
    const [generatedDocuments, setGeneratedDocuments] = useState<GeneratedDocuments | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const cvRef = useRef<HTMLDivElement>(null);
    const letterRef = useRef<HTMLDivElement>(null);
    const [isExporting, setIsExporting] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    // Retry mechanism states
    const [retryCount, setRetryCount] = useState(0);
    const [lastError, setLastError] = useState<string | null>(null);

    const handleResetSession = () => {
        if (confirm("Are you sure you want to reset this session? All conversation will be lost.")) {
            setMessages([]);
            setCurrentQuestionIndex(0);
            setGenerationComplete(false);
            setGeneratedDocuments(null);
            
            const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
            const userId = userProfile.email || userProfile.fullName;
            if (userId) {
                fetch('/api/user/progress', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId,
                        updateData: {
                            cvGenerationConversation: [],
                            currentStep: 'cv_generation',
                            generatedDocuments: null
                        }
                    })
                });
            }
            
            if (cvAnalysis && interviewEvaluation && selectedRole) {
                startCVGeneration(cvAnalysis, interviewEvaluation, selectedRole, selectedLanguage);
            }
        }
    };

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
                        if (data.selectedRole) setSelectedRole(data.selectedRole);
                        if (data.language) setSelectedLanguage(data.language);

                        // If there is existing conversation, restore it
                        if (data.cvGenerationConversation && data.cvGenerationConversation.length > 0) {
                            const restoredMessages = data.cvGenerationConversation.map((m: { role: 'ai' | 'user', content: string, timestamp: string }) => ({
                                ...m,
                                timestamp: new Date(m.timestamp)
                            }));
                            setMessages(restoredMessages);
                            
                            // Calculate current index
                            const calculatedIndex = Math.floor(restoredMessages.length / 2);
                            setCurrentQuestionIndex(calculatedIndex);

                            if (data.completionStatus?.cvGenerationComplete && data.generatedDocuments) {
                                setGeneratedDocuments(data.generatedDocuments);
                                setGenerationComplete(true);
                            }
                            return;
                        }

                        // If no conversation but we have base data, start new
                        if (data.cvAnalysis && data.interviewEvaluation && data.selectedRole) {
                            startCVGeneration(data.cvAnalysis, data.interviewEvaluation, data.selectedRole, data.language || 'en');
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
            const storedRole = localStorage.getItem('selectedRole');
            const storedLanguage = localStorage.getItem('selectedLanguage');

            if (storedCV && storedEval && storedRole) {
                const cv = JSON.parse(storedCV);
                const evaluation = JSON.parse(storedEval);
                const role = JSON.parse(storedRole);

                setCvAnalysis(cv);
                setInterviewEvaluation(evaluation);
                setSelectedRole(role);
                setSelectedLanguage(storedLanguage || 'en');
                startCVGeneration(cv, evaluation, role, storedLanguage || 'en');
            } else {
                router.push('/assessment/role-suggestions');
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
                            cvGenerationConversation: messages,
                            currentStep: 'cv_generation',
                            generatedDocuments: generationComplete ? generatedDocuments : null
                        }
                    })
                }).catch(err => console.error("Error saving CV generation progress", err));
            }
        }
    }, [messages, generationComplete, generatedDocuments]);

    const startCVGeneration = async (cv: CVAnalysis, evaluation: InterviewEvaluation, role: Role, language: string) => {
        setIsLoading(true);
        try {
            console.log('[CV Generation] Starting with role:', role.title);

            const response = await fetch('/api/cv-generation/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cvAnalysis: cv,
                    interviewEvaluation: evaluation,
                    selectedRole: role,
                    language
                }),
            });

            const result = await response.json();
            console.log('[CV Generation] Start result:', result);

            if (result.success) {
                setMessages([
                    {
                        role: 'ai',
                        content: result.welcomeMessage,
                        timestamp: new Date(),
                    },
                    {
                        role: 'ai',
                        content: result.firstQuestion,
                        timestamp: new Date(),
                    }
                ]);
                setCurrentQuestionIndex(1);
            }
        } catch (error) {
            console.error('Error starting CV generation:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async (isRetryAttempt = false) => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: inputValue,
            timestamp: new Date(),
        };

        if (!isRetryAttempt) {
            setMessages(prev => [...prev, userMessage]);
            setInputValue("");
            setRetryCount(0);
        }
        
        setIsLoading(true);
        setError(null);
        setLastError(null);

        // Data recovery fallback
        let currentCV = cvAnalysis;
        let currentEval = interviewEvaluation;
        let currentRole = selectedRole;

        if (!currentCV) {
            const stored = localStorage.getItem('cvAnalysis');
            if (stored) currentCV = JSON.parse(stored);
        }
        if (!currentEval) {
            const stored = localStorage.getItem('interviewEvaluation');
            if (stored) currentEval = JSON.parse(stored);
        }
        if (!currentRole) {
            const stored = localStorage.getItem('selectedRole');
            if (stored) currentRole = JSON.parse(stored);
        }

        if (!currentCV || !currentEval || !currentRole) {
            console.error('[CV Generation] Cannot send message - Missing required data:', {
                hasCVAnalysis: !!currentCV,
                hasInterviewEvaluation: !!currentEval,
                hasSelectedRole: !!currentRole,
                language: selectedLanguage
            });
            const errorMsg = selectedLanguage === 'ar' 
                ? "بيانات الجلسة مفقودة. يرجى العودة إلى النتائج والمحاولة مرة أخرى." 
                : selectedLanguage === 'fr'
                ? "Données de session manquantes. Veuillez revenir aux résultats et réessayer."
                : "Session data is missing. Please go back to Results and try again.";
            setError(errorMsg);
            setLastError(errorMsg);
            setIsLoading(false);
            return;
        }

        const maxRetries = 2;
        
        try {
            if (currentQuestionIndex >= totalQuestions) {
                // Generate final CV and Cover Letter
                console.log('[CV Generation] Sending complete request...');
                const response = await fetchWithTimeout('/api/cv-generation/complete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cvAnalysis: currentCV,
                        interviewEvaluation: currentEval,
                        selectedRole: currentRole,
                        conversationHistory: isRetryAttempt ? messages : [...messages, userMessage],
                        language: selectedLanguage,
                        userId: JSON.parse(localStorage.getItem('userProfile') || '{}').email || JSON.parse(localStorage.getItem('userProfile') || '{}').fullName,
                    }),
                }, 90000); // 90s timeout for document generation

                const result = await response.json();

                if (result.success) {
                    setRetryCount(0);
                    setGeneratedDocuments(result.documents);
                    setGenerationComplete(true);

                    const aiMessage: Message = {
                        role: 'ai',
                        content: result.completionMessage,
                        timestamp: new Date(),
                    };
                    setMessages(prev => [...prev, aiMessage]);
                } else {
                    throw new Error(result.error || "Generation failed");
                }
            } else {
                // Get next question
                console.log('[CV Generation] Sending next-question request for question:', currentQuestionIndex + 1);
                const response = await fetchWithTimeout('/api/cv-generation/next-question', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cvAnalysis: currentCV,
                        interviewEvaluation: currentEval,
                        selectedRole: currentRole,
                        conversationHistory: isRetryAttempt ? messages : [...messages, userMessage],
                        language: selectedLanguage,
                        questionNumber: currentQuestionIndex + 1,
                        totalQuestions,
                    }),
                }, 60000);

                const result = await response.json();

                if (result.success) {
                    setRetryCount(0);
                    const aiMessage: Message = {
                        role: 'ai',
                        content: result.question,
                        timestamp: new Date(),
                    };
                    setMessages(prev => [...prev, aiMessage]);
                    setCurrentQuestionIndex(prev => prev + 1);
                } else {
                    throw new Error(result.error || "Failed to get next question");
                }
            }
        } catch (err) {
            console.error('Error:', err);
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            
            // Retry logic
            if (retryCount < maxRetries) {
                console.log(`[CV Generation] Retry attempt ${retryCount + 1}/${maxRetries}`);
                setRetryCount(prev => prev + 1);
                
                const retryMsg = selectedLanguage === 'ar'
                    ? `إعادة المحاولة ${retryCount + 1}/${maxRetries}...`
                    : selectedLanguage === 'fr'
                    ? `Nouvelle tentative ${retryCount + 1}/${maxRetries}...`
                    : `Retrying ${retryCount + 1}/${maxRetries}...`;
                setLastError(retryMsg);
                
                setTimeout(() => handleSendMessage(true), 1500);
                return;
            }
            
            // Max retries reached
            const finalError = errorMessage.includes('timeout') || errorMessage.includes('Request timeout')
                ? (selectedLanguage === 'ar'
                    ? 'انتهت مهلة الطلب. يرجى المحاولة مرة أخرى.'
                    : selectedLanguage === 'fr'
                    ? 'Délai d\'attente dépassé. Veuillez réessayer.'
                    : 'Request timed out. Please try again.')
                : (selectedLanguage === 'ar'
                    ? 'فشل في الحصول على السؤال التالي. يرجى المحاولة مرة أخرى أو استخدام "إنهاء طارئ".'
                    : selectedLanguage === 'fr'
                    ? 'Échec de l\'obtention de la question suivante. Veuillez réessayer ou utiliser "Fin d\'urgence".'
                    : 'Failed to get next question. Please try again or use Emergency Finish.');
            
            setError(finalError);
            setLastError(finalError);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmergencyFinish = async () => {
        setIsLoading(true);
        setError(null);
        
        // Data recovery fallback
        let currentCV = cvAnalysis;
        let currentEval = interviewEvaluation;
        let currentRole = selectedRole;

        if (!currentCV) {
            const stored = localStorage.getItem('cvAnalysis');
            if (stored) currentCV = JSON.parse(stored);
        }
        if (!currentEval) {
            const stored = localStorage.getItem('interviewEvaluation');
            if (stored) currentEval = JSON.parse(stored);
        }
        if (!currentRole) {
            const stored = localStorage.getItem('selectedRole');
            if (stored) currentRole = JSON.parse(stored);
        }

        console.log('[CV Generation] Emergency Finish clicked', {
            hasCVAnalysis: !!currentCV,
            hasInterviewEvaluation: !!currentEval,
            hasSelectedRole: !!currentRole,
            messagesCount: messages.length
        });

        if (!currentCV || !currentEval || !currentRole) {
            setError(selectedLanguage === 'ar' ? "بيانات الجلسة مفقودة. يرجى العودة إلى النتائج." : "Missing session data. Please return to Results.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/cv-generation/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cvAnalysis: currentCV,
                    interviewEvaluation: currentEval,
                    selectedRole: currentRole,
                    conversationHistory: messages,
                    language: selectedLanguage,
                    userId: JSON.parse(localStorage.getItem('userProfile') || '{}').email || JSON.parse(localStorage.getItem('userProfile') || '{}').fullName,
                }),
            });

            const result = await response.json();

            if (result.success) {
                setGeneratedDocuments(result.documents);
                setGenerationComplete(true);
                
                const aiMessage: Message = {
                    role: 'ai',
                    content: result.completionMessage,
                    timestamp: new Date(),
                };
                setMessages(prev => [...prev, aiMessage]);
            } else {
                setError(result.error || "Generation failed");
            }
        } catch (error) {
            console.error('Emergency finish error:', error);
            setError("Emergency finish failed. Please try resetting the session.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleProceedToSimulation = async () => {
        if (generationComplete) {
            localStorage.setItem('generatedDocuments', JSON.stringify(generatedDocuments));
            router.push('/assessment/simulation');
            return;
        }

        // If not complete but unlocked (>= 5 questions), trigger finish first
        await handleEmergencyFinish();
    };

    const handleSkipQuestion = async () => {
        if (isLoading) return;

        const skipMessages: Record<string, string> = {
            'en': "I prefer to skip this question.",
            'fr': "Je préfère passer cette question.",
            'ar': "أفضل تخطي هذا السؤال.",
            'es': "Prefiero omitir esta pregunta.",
        };

        const userMessage: Message = {
            role: 'user',
            content: skipMessages[selectedLanguage] || skipMessages['en'],
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setError(null);

        // Data recovery fallback
        let currentCV = cvAnalysis;
        let currentEval = interviewEvaluation;
        let currentRole = selectedRole;

        if (!currentCV) {
            const stored = localStorage.getItem('cvAnalysis');
            if (stored) currentCV = JSON.parse(stored);
        }
        if (!currentEval) {
            const stored = localStorage.getItem('interviewEvaluation');
            if (stored) currentEval = JSON.parse(stored);
        }
        if (!currentRole) {
            const stored = localStorage.getItem('selectedRole');
            if (stored) currentRole = JSON.parse(stored);
        }

        if (!currentCV || !currentEval || !currentRole) {
            console.error('[CV Generation] Cannot skip - Missing required data:', {
                hasCVAnalysis: !!currentCV,
                hasInterviewEvaluation: !!currentEval,
                hasSelectedRole: !!currentRole
            });
            setError(selectedLanguage === 'ar' ? "بيانات الجلسة مفقودة. يرجى العودة إلى النتائج والمحاولة مرة أخرى." : "Session data is missing. Please go back to Results and try again.");
            setIsLoading(false);
            return;
        }

        try {
            if (currentQuestionIndex >= totalQuestions) {
                console.log('[CV Generation] Skipping to complete...');
                const response = await fetch('/api/cv-generation/complete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cvAnalysis: currentCV,
                        interviewEvaluation: currentEval,
                        selectedRole: currentRole,
                        conversationHistory: [...messages, userMessage],
                        language: selectedLanguage,
                        userId: JSON.parse(localStorage.getItem('userProfile') || '{}').email || JSON.parse(localStorage.getItem('userProfile') || '{}').fullName,
                    }),
                });

                const result = await response.json();

                if (result.success) {
                    setGeneratedDocuments(result.documents);
                    setGenerationComplete(true);

                    const aiMessage: Message = {
                        role: 'ai',
                        content: result.completionMessage,
                        timestamp: new Date(),
                    };
                    setMessages(prev => [...prev, aiMessage]);
                } else {
                    setError(result.error || "Generation failed");
                }
            } else {
                console.log('[CV Generation] Skipping to next question:', currentQuestionIndex + 1);
                const response = await fetch('/api/cv-generation/next-question', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cvAnalysis: currentCV,
                        interviewEvaluation: currentEval,
                        selectedRole: currentRole,
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
                } else {
                    setError(result.error || "Failed to get next question");
                }
            }
        } catch (err) {
            console.error('Error:', err);
            setError("Failed to process skip. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadPDF = async (ref: React.RefObject<HTMLDivElement | null>, filename: string) => {
        if (!ref.current) return;
        setIsExporting(filename);
        try {
            const element = ref.current;
            
            // Capture with robust settings
            const canvas = await html2canvas(element, {
                scale: 2, // Good balance of quality/size
                useCORS: true,
                logging: false,
                backgroundColor: "#ffffff",
                windowWidth: 800, // Force desktop width for consistent layout
                onclone: (clonedDoc) => {
                    // 1. Remove stubborn link tags that break html2canvas with modern CSS (lab/oklch)
                    const links = clonedDoc.getElementsByTagName('link');
                    while (links.length > 0) {
                        links[0].parentNode?.removeChild(links[0]);
                    }

                    // 2. Reveal the printable element (it might be hidden in scrollbox)
                    const el = clonedDoc.getElementById('printable-doc');
                    if (el) {
                        (el as HTMLElement).style.display = 'block';
                        (el as HTMLElement).style.padding = '40px'; // Add padding for "page" feel
                        (el as HTMLElement).style.width = '100%';
                        (el as HTMLElement).style.maxWidth = 'none';
                        (el as HTMLElement).style.margin = '0 auto';
                    }

                    // 3. Inject Safe Styles & Font
                    const safeStyle = clonedDoc.createElement('style');
                    safeStyle.innerHTML = `
                        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap');
                        * { font-family: 'Tajawal', sans-serif !important; box-sizing: border-box; }
                        
                        /* Basic Reset & Tailwind Emulation for PDF */
                        .bg-white { background-color: #ffffff !important; }
                        .text-slate-900 { color: #0f172a !important; }
                        .text-slate-800 { color: #1e293b !important; }
                        .text-slate-700 { color: #334155 !important; }
                        .text-slate-600 { color: #475569 !important; }
                        .text-slate-500 { color: #64748b !important; }
                        .text-blue-600 { color: #2563eb !important; }
                        .text-blue-700 { color: #1d4ed8 !important; }
                        .text-purple-600 { color: #9333ea !important; }
                        .border-blue-600 { border-color: #2563eb !important; }
                        .border-b-2 { border-bottom-width: 2px !important; }
                        .border-b { border-bottom-width: 1px !important; }
                        .border-slate-200 { border-color: #e2e8f0 !important; }
                        .bg-slate-100 { background-color: #f1f5f9 !important; }
                        
                        .p-12 { padding: 3rem !important; }
                        .mb-8 { margin-bottom: 2rem !important; }
                        .mb-6 { margin-bottom: 1.5rem !important; }
                        .mb-4 { margin-bottom: 1rem !important; }
                        .mb-3 { margin-bottom: 0.75rem !important; }
                        .mb-2 { margin-bottom: 0.5rem !important; }
                        .mb-1 { margin-bottom: 0.25rem !important; }
                        
                        .text-4xl { font-size: 2.25rem !important; line-height: 2.5rem !important; }
                        .text-xl { font-size: 1.25rem !important; line-height: 1.75rem !important; }
                        .text-lg { font-size: 1.125rem !important; line-height: 1.75rem !important; }
                        .text-sm { font-size: 0.875rem !important; line-height: 1.25rem !important; }
                        .text-xs { font-size: 0.75rem !important; line-height: 1rem !important; }
                        
                        .font-bold { font-weight: 700 !important; }
                        .font-extrabold { font-weight: 800 !important; }
                        .font-semibold { font-weight: 600 !important; }
                        .uppercase { text-transform: uppercase !important; }
                        
                        .flex { display: flex !important; }
                        .flex-wrap { flex-wrap: wrap !important; }
                        .items-center { align-items: center !important; }
                        .justify-between { justify-content: space-between !important; }
                        .gap-4 { gap: 1rem !important; }
                        .gap-2 { gap: 0.5rem !important; }
                        .gap-1 { gap: 0.25rem !important; }
                        
                        .grid { display: grid !important; }
                        .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
                        .col-span-2 { grid-column: span 2 / span 2 !important; }
                        .col-span-1 { grid-column: span 1 / span 1 !important; }
                        .space-y-8 > * + * { margin-top: 2rem !important; }
                        .space-y-6 > * + * { margin-top: 1.5rem !important; }
                        .space-y-4 > * + * { margin-top: 1rem !important; }
                        .space-y-2 > * + * { margin-top: 0.5rem !important; }
                        .space-y-1 > * + * { margin-top: 0.25rem !important; }
                        
                        .list-disc { list-style-type: disc !important; }
                        .ml-4 { margin-left: 1rem !important; }
                        .rounded { border-radius: 0.25rem !important; }
                    `;
                    clonedDoc.head.appendChild(safeStyle);
                }
            });

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

            pdf.save(`${filename}.pdf`);
        } catch (error) {
            console.error("Export failed:", error);
            alert("Failed to export PDF");
        } finally {
            setIsExporting(null);
        }
    };

    // Generation Complete Screen
    if (generationComplete && generatedDocuments) {
        return (
            <div className="flex-1 p-4 md:p-8 max-w-6xl mx-auto space-y-8 relative">
                 {/* Header Section */}
                 <div className="mb-6 flex flex-col items-center text-center gap-6 px-4 shrink-0 relative">
                    <button 
                        onClick={() => setGenerationComplete(false)}
                        className="absolute left-0 top-2 p-2 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm flex items-center gap-2 px-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-bold">Back to Chat</span>
                    </button>

                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative"
                    >
                        <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-cyan-400 rounded-2xl blur opacity-20"></div>
                        <div className="relative bg-white/50 backdrop-blur-sm px-8 py-4 rounded-2xl border border-slate-200/60">
                            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
                                Your Professional <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500">Portfolio</span>
                            </h1>
                            <p className="text-slate-500 text-lg font-medium">
                                Ready for review and download
                            </p>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-linear-to-br from-green-50 to-blue-50 rounded-3xl border-2 border-green-200 p-10 text-center shadow-lg shadow-green-600/5"
                >
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
                        {selectedLanguage === 'ar' ? 'تم إنشاء ملفك المهني بنجاح!' : 'Documents Generated Successfully!'}
                    </h1>
                    <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
                        {selectedLanguage === 'ar' ? 'سيرتك الذاتية ورسالة التحفيز المخصصة جاهزة الآن. يمكنك مراجعتها وتحميلها أدناه، أو الانتقال للمرحلة التالية.' : 'Your professional ATS-optimized CV and cover letter are ready. Preview them below or proceed to the next stage.'}
                    </p>
                </motion.div>

                {/* Generated Documents Preview */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* CV Column */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-600" />
                                ATS-Optimized CV
                            </h2>
                            <button
                                onClick={() => handleDownloadPDF(cvRef, `CV-${generatedDocuments.cv.personalDetails?.fullName?.replace(/\s+/g, '_') || 'Professional'}`)}
                                disabled={!!isExporting}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-600/20 text-sm"
                            >
                                {isExporting && isExporting.startsWith('CV-') ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                Download PDF
                            </button>
                        </div>

                        {/* CV Preview Scrollbox */}
                        <div className="bg-slate-200 rounded-2xl p-4 md:p-8 overflow-y-auto max-h-[800px] shadow-inner border border-slate-300 custom-scrollbar">
                            <div ref={cvRef}>
                                <CVDocument data={generatedDocuments.cv} language={selectedLanguage} />
                            </div>
                        </div>
                    </div>

                    {/* Cover Letter Column */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <Mail className="w-5 h-5 text-purple-600" />
                                Professional Cover Letter
                            </h2>
                            <button
                                onClick={() => handleDownloadPDF(letterRef, 'Cover_Letter')}
                                disabled={!!isExporting}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-bold shadow-lg shadow-purple-600/20 text-sm"
                            >
                                {isExporting === 'Cover_Letter' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                Download PDF
                            </button>
                        </div>

                        {/* Letter Preview Scrollbox */}
                        <div className="bg-slate-200 rounded-2xl p-4 md:p-8 overflow-y-auto max-h-[800px] shadow-inner border border-slate-300 custom-scrollbar">
                            <div ref={letterRef}>
                                <LetterDocument
                                    content={generatedDocuments.coverLetter}
                                    fullName={generatedDocuments.cv.personalDetails?.fullName || ''}
                                    jobTitle={generatedDocuments.cv.personalDetails?.jobTitle || ''}
                                    language={selectedLanguage}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Professional Tips - REIMAGINED UI */}
                {generatedDocuments.professionalTips && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="relative group overflow-hidden"
                    >
                        {/* Animated Gradient Background for Border Effect */}
                        <div className="absolute -inset-0.5 bg-linear-to-r from-yellow-400 via-amber-500 to-orange-400 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>

                        <div className="relative bg-white rounded-2xl p-8 md:p-10 shadow-xl border border-yellow-100 flex flex-col md:flex-row gap-8">
                            {/* Sticky Sidebar for Title */}
                            <div className="md:w-1/3">
                                <div className="sticky top-0">
                                    <div className="w-16 h-16 bg-linear-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg mb-6 transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                        <Sparkles className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">
                                        Professional <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-600 to-orange-600">Marketing Tips</span>
                                    </h3>
                                    <p className="text-slate-500 text-lg font-medium leading-relaxed">
                                        Expert strategy to showcase your profile and stand out from other candidates.
                                    </p>

                                    <div className="mt-10 hidden md:block">
                                        <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                                            <div className="text-sm text-yellow-800 font-bold mb-2 flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-yellow-600 animate-pulse"></div>
                                                Expert Strategy
                                            </div>
                                            <p className="text-xs text-yellow-700 leading-relaxed">
                                                These tips are generated based on local market trends and HR best practices.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Content Area */}
                            <div className="flex-1 space-y-6">
                                <div className="grid gap-4">
                                    {generatedDocuments.professionalTips
                                        .split(/\n(?=\d+\.)/) // Split by numbered lists
                                        .map((tip: string, idx: number) => {
                                            const cleanTip = tip.replace(/^\d+\.\s*/, '').trim();
                                            if (!cleanTip) return null;

                                            return (
                                                <motion.div
                                                    key={idx}
                                                    whileHover={{ x: 5 }}
                                                    className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition-all group/tip"
                                                >
                                                    <div className="flex gap-4">
                                                        <span className="shrink-0 w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center font-black text-slate-900 text-lg group-hover/tip:text-yellow-600 group-hover/tip:border-yellow-200 transition-colors">
                                                            {idx + 1}
                                                        </span>
                                                        <p className="text-slate-700 leading-relaxed font-medium pt-1">
                                                            {cleanTip}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                </div>

                                {/* Premium Keywords Display */}
                                {generatedDocuments.keywords && (
                                    <div className="mt-12 pt-8 border-t border-slate-100">
                                        <div className="flex items-center gap-2 mb-6">
                                            <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-black uppercase tracking-widest">
                                                ATS Core
                                            </div>
                                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Optimization Keywords</h4>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {generatedDocuments.keywords.map((kw: string, i: number) => (
                                                <motion.span
                                                    key={i}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:border-blue-400 hover:text-blue-600 hover:shadow-lg hover:shadow-blue-500/10 transition-all cursor-default"
                                                >
                                                    {kw}
                                                </motion.span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                <div className="flex flex-col items-center gap-6 pt-12 pb-16 border-t border-slate-100">
                    <div className="text-center space-y-2">
                        <div className="px-5 py-1.5 bg-purple-100 text-purple-700 rounded-full text-[10px] font-black uppercase tracking-[0.3em] inline-block shadow-sm">
                            Next Strategic Stage
                        </div>
                    </div>

                    <div className="relative group w-full flex justify-center">
                        {/* Pulsing Background Glow */}
                        <motion.div
                            animate={{ 
                                scale: [1, 1.1, 1],
                                opacity: [0.3, 0.6, 0.3]
                            }}
                            transition={{ 
                                duration: 2.5, 
                                repeat: Infinity, 
                                ease: "easeInOut" 
                            }}
                            className="absolute -inset-4 bg-linear-to-r from-purple-600 to-blue-600 rounded-[2.5rem] blur-3xl z-0 max-w-2xl w-full"
                        />
                        
                        <motion.button
                            onClick={() => {
                                localStorage.setItem('generatedDocuments', JSON.stringify(generatedDocuments));
                                router.push('/assessment/simulation');
                            }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.96 }}
                            className="relative z-10 w-full max-w-2xl px-12 py-8 bg-linear-to-r from-purple-600 via-indigo-600 to-blue-600 text-white rounded-4xl font-black text-3xl shadow-[0_20px_50px_rgba(79,70,229,0.3)] flex items-center justify-center gap-6 transition-all border border-white/20"
                        >
                            <Sparkles className="w-10 h-10 text-yellow-300 drop-shadow-lg" />
                            <span className="tracking-tight">
                                {selectedLanguage === 'ar' ? 'ابدأ محاكاة الدور الاستراتيجية' :
                                 selectedLanguage === 'fr' ? 'Lancer la Simulation Stratégique' : 'Start Strategic Simulation'}
                            </span>
                            <motion.div
                                animate={{ x: [0, 8, 0] }}
                                transition={{ 
                                    duration: 1.5, 
                                    repeat: Infinity, 
                                    ease: "easeInOut" 
                                }}
                                className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30"
                            >
                                <ArrowRight className="w-8 h-8" />
                            </motion.div>
                        </motion.button>
                    </div>

                    <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.4em] animate-pulse">
                         {selectedLanguage === 'ar' ? 'انقر أعلاه للتحقق من كفاءتك في ظروف حقيقية' : 'Test your capabilities in real-world scenarios'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-[calc(100vh-8rem)] max-w-5xl mx-auto w-full font-sans">
            {/* Header Section */}
            <div className="mb-6 flex flex-col items-center text-center gap-6 px-4 shrink-0 relative">
                <button 
                    onClick={() => router.push('/assessment/role-suggestions')}
                    className="absolute left-0 top-2 p-2 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative"
                >
                    <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-cyan-400 rounded-2xl blur opacity-20"></div>
                    <div className="relative bg-white/50 backdrop-blur-sm px-8 py-4 rounded-2xl border border-slate-200/60">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
                            Professional <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500">CV Studio</span>
                        </h1>
                        <p className="text-slate-500 text-lg font-medium">
                            Drafting high-impact documents for <span className="text-slate-900 font-bold bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">{selectedRole?.title}</span>
                        </p>
                    </div>
                </motion.div>

                {/* Progress Bar */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col md:flex-row items-center gap-4 bg-white/80 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-sm border border-slate-200"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Progress</span>
                        <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden shrink-0">
                            <motion.div 
                                className="h-full bg-linear-to-r from-blue-500 to-cyan-400"
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, (currentQuestionIndex / totalQuestions) * 100)}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                        <span className="text-sm font-black text-blue-600">{currentQuestionIndex} / {totalQuestions}</span>
                    </div>

                    {/* Reset Button */}
                    <button 
                        onClick={handleResetSession}
                        className="text-xs font-bold text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                    >
                        <RefreshCw className="w-3 h-3" />
                        Reset
                    </button>
                    
                    
                    {/* Emergency Finish Button */}
                    {!generationComplete && currentQuestionIndex >= totalQuestions && (
                        <button
                            onClick={handleEmergencyFinish}
                            disabled={isLoading}
                            className="bg-amber-100 text-amber-700 hover:bg-amber-200 px-3 py-1 rounded-lg text-xs font-black uppercase transition-all flex items-center gap-1"
                        >
                            <Sparkles className="w-3 h-3" />
                            Emergency Finish
                        </button>
                    )}
                </motion.div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 bg-white/60 backdrop-blur-md rounded-[2.5rem] shadow-xl border border-white/50 p-6 md:p-8 overflow-y-auto mb-6 mx-2 md:mx-0 custom-scrollbar relative">
                <div className="space-y-8">
                    {messages.map((message, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[85%] ${message.role === 'user' ? 'order-2' : 'order-1'} group`}>
                                {message.role === 'ai' && (
                                    <div className="flex items-center gap-3 mb-3 ml-1">
                                        <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
                                            <Sparkles className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Career Architect</span>
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

                                <span className={`text-[10px] uppercase font-bold text-slate-300 mt-2 block px-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
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
                            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-100 shadow-sm ml-4">
                                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                                <span className="text-slate-500 text-sm font-medium">Drafting response...</span>
                            </div>
                        </motion.div>
                    )}

                    {/* Retry Feedback */}
                    {lastError && !error && retryCount > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-center mt-4"
                        >
                            <div className="bg-amber-50 border border-amber-200 text-amber-700 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-sm">
                                <RefreshCw className="w-5 h-5 animate-spin" />
                                <span className="text-sm font-bold">{lastError}</span>
                            </div>
                        </motion.div>
                    )}

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex justify-center mt-4"
                        >
                            <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-sm">
                                <AlertCircle className="w-5 h-5" />
                                <span className="text-sm font-bold">{error}</span>
                                {currentQuestionIndex >= totalQuestions && (
                                    <button 
                                        onClick={handleEmergencyFinish}
                                        className="ml-4 underline text-xs font-black uppercase hover:text-red-800"
                                    >
                                        Finish Now
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
                <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-3 md:p-5 mx-2 md:mx-0 shrink-0">
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage(false)}
                                placeholder="Type your answer here..."
                                disabled={isLoading || generationComplete}
                                className="w-full pl-6 pr-4 py-4 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                            />
                        </div>
                        
                        <div className="flex gap-2">
                            <button
                                onClick={handleSkipQuestion}
                                disabled={isLoading || generationComplete}
                                className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                            >
                                <ArrowRight className="w-4 h-4" />
                                <span className="hidden md:inline">Skip</span>
                            </button>
                            <button
                                onClick={() => handleSendMessage(false)}
                                disabled={!inputValue.trim() || isLoading || generationComplete}
                                className="px-8 py-3 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                            >
                                <Send className="w-4 h-4" />
                                <span className="hidden md:inline">Send Answer</span>
                            </button>
                        </div>
                    </div>

                    {/* Next Step Navigation - Active only when complete */}
                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-center">
                        <button
                            onClick={handleProceedToSimulation}
                            disabled={(currentQuestionIndex < 8 && !generationComplete) || isLoading}
                            className={`
                                group px-10 py-4 rounded-2xl font-black text-lg transition-all flex items-center gap-3
                                ${(generationComplete || currentQuestionIndex >= 8)
                                    ? "bg-purple-600 text-white shadow-xl shadow-purple-600/20 hover:bg-purple-700 hover:-translate-y-1"
                                    : "bg-slate-100 text-slate-400 cursor-not-allowed border-2 border-slate-200"
                                }
                            `}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>{generationComplete ? "Redirecting..." : "Generating Documents..."}</span>
                                </>
                            ) : (
                                <>
                                    {selectedLanguage === 'ar' ? 'البدء في محاكاة الدور' :
                                        selectedLanguage === 'fr' ? 'Commencer la simulation' : 'Start Role Simulation'}
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${(generationComplete || currentQuestionIndex >= 8) ? 'bg-white/20' : 'bg-slate-200'}`}>
                                        <ArrowRight className={`w-5 h-5 ${(generationComplete || currentQuestionIndex >= 8) ? 'translate-x-0 group-hover:translate-x-1' : ''} transition-transform`} />
                                    </div>
                                </>
                            )}
                        </button>
                    </div>

                    <div className="mt-3 text-center">
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                            AI-Powered Career Assistant • {selectedLanguage?.toUpperCase()} Mode
                        </p>
                    </div>
                </div>
        </div>
    );
}

// PREMIUM CV DOCUMENT COMPONENT
function CVDocument({ data, language }: { data: CVData, language: string }) {
    const isAR = language === 'ar';

    // Labels based on language
    const labels: Record<string, Record<string, string>> = {
        en: { summary: "Professional Summary", experience: "Professional Experience", education: "Education", skills: "Skills", tech: "Technical", tools: "Tools", soft: "Soft Skills", lang: "Languages", certs: "Certifications" },
        fr: { summary: "Résumé Professionnel", experience: "Expérience Professionnelle", education: "Formation", skills: "Compétences", tech: "Techniques", tools: "Outils", soft: "Qualités", lang: "Langues", certs: "Certifications" },
        ar: { summary: "الملخص المهني", experience: "الخبرة المهنية", education: "التعليم", skills: "المهارات", tech: "تقنية", tools: "أدوات", soft: "شخصية", lang: "اللغات", certs: "الشهادات" },
    };

    const t = labels[language] || labels.en;

    return (
        <div id="printable-doc" className={`bg-white w-full max-w-[210mm] min-h-[297mm] p-12 text-slate-800 shadow-xl mx-auto rounded-xl ${isAR ? 'text-right' : 'text-left'}`} dir={isAR ? 'rtl' : 'ltr'}>
            {/* Header */}
            <header className="border-b-2 border-blue-600 pb-6 mb-8">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-2">{data.personalDetails?.fullName}</h1>
                <p className="text-xl text-blue-600 font-bold mb-4">{data.personalDetails?.jobTitle}</p>

                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    {data.personalDetails?.email && <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {data.personalDetails.email}</span>}
                    {data.personalDetails?.phone && <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {data.personalDetails.phone}</span>}
                    {data.personalDetails?.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {data.personalDetails.location}</span>}
                    {data.personalDetails?.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-4 h-4" /> {data.personalDetails.linkedin}</span>}
                </div>
            </header>

            {/* Content Body */}
            <div className="space-y-8">
                {/* Summary */}
                <section>
                    <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-3 border-b border-slate-200 pb-1">{t.summary}</h2>
                    <p className="leading-relaxed text-slate-700">{data.professionalSummary}</p>
                </section>

                <div className="grid grid-cols-3 gap-8">
                    {/* Left Column (Main Content) */}
                    <div className="col-span-2 space-y-8">
                        {/* Experience */}
                        <section>
                            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-1">{t.experience}</h2>
                            <div className="space-y-6">
                                {data.experience?.map((exp: Experience, i: number) => (
                                    <div key={i} className="relative">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-slate-900">{exp.title}</h3>
                                            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{exp.period}</span>
                                        </div>
                                        <p className="text-sm font-semibold text-blue-600 mb-2">{exp.company} • {exp.location}</p>
                                        <ul className="list-disc list-outside ml-4 space-y-1 text-sm text-slate-600">
                                            {exp.highlights?.map((point: string, j: number) => (
                                                <li key={j}>{point}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Education */}
                        <section>
                            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-1">{t.education}</h2>
                            <div className="space-y-4">
                                {data.education?.map((edu: Education, i: number) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-slate-900">{edu.degree}</h4>
                                            <span className="text-xs font-bold text-slate-500">{edu.period}</span>
                                        </div>
                                        <p className="text-sm text-slate-600">{edu.institution} • {edu.location}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column (Sidebar) */}
                    <div className="space-y-8">
                        {/* Skills */}
                        <section>
                            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-1">{t.skills}</h2>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xs font-bold text-blue-600 uppercase mb-2">{t.tech}</h3>
                                    <div className="flex flex-wrap gap-1">
                                        {data.skills?.technical?.map((s: string, i: number) => (
                                            <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded border border-blue-100">{s}</span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-purple-600 uppercase mb-2">{t.tools}</h3>
                                    <div className="flex flex-wrap gap-1">
                                        {data.skills?.tools?.map((s: string, i: number) => (
                                            <span key={i} className="px-2 py-1 bg-purple-50 text-purple-700 text-[10px] font-bold rounded border border-purple-100">{s}</span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-emerald-600 uppercase mb-2">{t.soft}</h3>
                                    <div className="flex flex-wrap gap-1">
                                        {data.skills?.soft?.map((s: string, i: number) => (
                                            <span key={i} className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-100">{s}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Languages */}
                        {data.languages?.length > 0 && (
                            <section>
                                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-3 border-b border-slate-200 pb-1">{t.lang}</h2>
                                <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                                    {data.languages.map((l: string, i: number) => (
                                        <span key={i}>{l}</span>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Certifications */}
                        {data.certifications?.length > 0 && (
                            <section>
                                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-3 border-b border-slate-200 pb-1">{t.certs}</h2>
                                <div className="space-y-2">
                                    {data.certifications.map((c: string, i: number) => (
                                        <div key={i} className="flex gap-2 text-sm text-slate-600">
                                            <Award className="w-4 h-4 text-yellow-600 shrink-0" />
                                            <span>{c}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// PROFESSIONAL COVER LETTER DOCUMENT COMPONENT
function LetterDocument({ content, fullName, jobTitle, language }: { content: string, fullName: string, jobTitle: string, language: string }) {
    const isAR = language === 'ar';
    const date = new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : language === 'fr' ? 'fr-FR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div id="printable-doc" className={`bg-white w-full max-w-[210mm] min-h-[297mm] p-20 text-slate-800 shadow-xl mx-auto rounded-xl ${isAR ? 'text-right' : 'text-left'}`} dir={isAR ? 'rtl' : 'ltr'}>
            <div className="border-b-2 border-slate-100 pb-10 mb-10">
                <h1 className="text-3xl font-bold text-slate-900 mb-1">{fullName}</h1>
                <p className="text-slate-500 uppercase tracking-widest text-sm">{jobTitle}</p>
            </div>

            <p className="text-slate-500 mb-8">{date}</p>

            <div className="prose prose-slate max-w-none">
                <div className="text-slate-700 leading-[1.8] whitespace-pre-wrap text-lg">
                    {content}
                </div>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-100">
                <p className="font-bold text-slate-900">{fullName}</p>
            </div>
        </div>
    );
}
