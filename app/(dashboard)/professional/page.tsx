"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Brain,
    Sparkles,
    ArrowRight,
    History,
    ShieldCheck,
    Send,
    Loader2,
    Target,
    AlertCircle,
    CheckCircle2,
    TrendingUp,
    Zap,
    Rocket,
    BarChart3,
    RefreshCw,
    Briefcase,
    Search,
    Trophy,
    ChevronUp,
    ChevronDown,
    Layout,
    Database,
    GraduationCap,
    User,
    Star,
    ArrowLeft,
    Calendar,
    Download
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";

// --- Types ---
interface AuditIndicator {
    label: string;
    value: string;
    score: number;
    color: string;
}

interface AuditResult {
    professionalIdentity: string;
    executiveSummary: string;
    strategicCriticism: string;
    basicData: {
        field: string;
        specialization: string;
        education: string;
        trainingType: string;
        yearsOfExperience: string;
        sector: string;
    };
    dimensions: {
        careerProgression: string;
        progressionIcon: 'up' | 'stable' | 'down';
        responsibilityLevel: string;
        marketPosition: string;
        leadershipSignal: string;
    };
    learningSignals: string[];
    indicators: AuditIndicator[];
    skills: {
        detected: string[];
        gaps: string[];
    };
    timeline: { year: string; event: string; duration?: string }[];
    actionPlan: string[];
    textAnalysis: {
        tone: string;
        clarity: string;
        consistency: string;
    };
}

interface FinalReport {
    executiveVerdict: string;
    level1Analysis: {
        score: number;
        consistency: string;
        presentationQuality: string;
    };
    level2Analysis: {
        hardSkills: string[];
        softSkills: string[];
        criticalGaps: string[];
    };
    level3Analysis: {
        alignmentScore: number;
        pathAnalysis: string;
        marketValue: string;
    };
    actionPlan: {
        immediate: string[];
        strategic: string[];
    };
    finalScore: number;
}

interface AssessmentQuestion {
    id: string;
    category: "technical" | "soft" | "scenario";
    question: string;
    options: string[];
    correctIndex: number;
    feedback: {
        explanation: string;
        evidence: string;
        advice: string;
    };
}

interface AssessmentAnalysis {
  score: number;
  total: number;
  technicalProficiency: string;
  behavioralInsight: string;
  decisionMakingQuality: string;
  finalConclusion: string;
}

interface MindsetAnalysis {
    mindsetType: "Growth" | "Financial" | "Stability" | "Entrepreneurial";
    satisfactionLevel: "High" | "Medium" | "Low";
    futureDirection: "Stay" | "Change Job" | "Change Sector" | "Entrepreneurship";
    psychologicalProfile: {
        motivation: string;
        stressHandling: string;
        ambitionScore: number;
        loyaltyPattern: string;
    };
    recommendation: string;
}

interface GrandFinalReport {
    professionalIdentity: {
        verdict: string;
        maturityScore: number;
        psychologicalFootprint: string;
    };
    competencyMatrix: {
        skillRadar: { name: string; score: number }[];
        gapAnalysis: string;
        decisionQualityVerdict: string;
    };
    marketPositioning: {
        jobAlignmentScore: number;
        stabilityProfile: string;
        marketValueVerdict: string;
    };
    actionableRoadmap: {
        shortTerm: string[];
        mediumTerm: string;
        longTermVision: string;
    };
    expertSynthesis: string;
}

interface StrategicPath {
    title: string;
    matchPercentage: number;
    description: string;
    rationale: string;
    pros: string[];
    cons: string[];
    risks: string[];
}

interface StrategicPathsAnalysis {
    paths: StrategicPath[];
    finalRecommendation: string;
}

interface ImplementationBlueprint {
    tacticalWins: { title: string; action: string }[];
    suggestedRoles: { title: string; matchingWhy: string }[];
    gapBridge: {
        skills: string[];
        summary: string;
        riskWarning: string;
        goldenAdvice: string;
    };
}

interface FinalMasterReport {
    executiveSummary: string;
    holisticScore: number;
    pillarAnalysis: {
        technical: string;
        strategic: string;
        psychological: string;
    };
    marketabilityVerdict: string;
    premiumOpportunity: string;
    finalCallToAction: string;
}


export default function ProfessionalDiagnosisPage() {
    const { language, dir } = useLanguage();
    const isRtl = dir === 'rtl';

    // State management
    const [step, setStep] = useState(0); // 0: Welcome, 1: Formatting Narrative, 2: Results
    const [narrative, setNarrative] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<AuditResult | null>(null);

    // Interview Phase States
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
    const [isInterviewing, setIsInterviewing] = useState(false);
    const [chatInput, setChatInput] = useState("");
    const [isInterviewComplete, setIsInterviewComplete] = useState(false);
    
    // Final Report States
    const [finalReport, setFinalReport] = useState<FinalReport | null>(null);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);

    // Assessment States
    const [assessmentQuestions, setAssessmentQuestions] = useState<AssessmentQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<number[]>([]);
    const [isGeneratingAssessment, setIsGeneratingAssessment] = useState(false);
    const [isAnalyzingAssessment, setIsAnalyzingAssessment] = useState(false);
    const [assessmentAnalysis, setAssessmentAnalysis] = useState<AssessmentAnalysis | null>(null);
    const [assessmentError, setAssessmentError] = useState<string | null>(null);
    const [showCorrection, setShowCorrection] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    // Mindset Phase States
    const [mindsetMessages, setMindsetMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
    const [isMindsetInterviewing, setIsMindsetInterviewing] = useState(false);
    const [mindsetInput, setMindsetInput] = useState("");
    const [mindsetAnalysis, setMindsetAnalysis] = useState<MindsetAnalysis | null>(null);
    const [isAnalyzingMindset, setIsAnalyzingMindset] = useState(false);

    // Grand final report states
    const [grandFinalReport, setGrandFinalReport] = useState<GrandFinalReport | null>(null);
    const [isGeneratingGrandReport, setIsGeneratingGrandReport] = useState(false);

    // Strategic Paths states
    const [strategicPaths, setStrategicPaths] = useState<StrategicPathsAnalysis | null>(null);
    const [isGeneratingPaths, setIsGeneratingPaths] = useState(false);
    const [selectedPath, setSelectedPath] = useState<StrategicPath | null>(null);
    const [pathInterviewMessages, setPathInterviewMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
    const [isPathSimulating, setIsPathSimulating] = useState(false);
    const [pathSimulationInput, setPathSimulationInput] = useState("");
    const [isPathSimulationComplete, setIsPathSimulationComplete] = useState(false);
    const [implementationBlueprint, setImplementationBlueprint] = useState<ImplementationBlueprint | null>(null);
    const [isGeneratingBlueprint, setIsGeneratingBlueprint] = useState(false);

    // Final Master Report states
    const [finalMasterReport, setFinalMasterReport] = useState<FinalMasterReport | null>(null);
    const [isGeneratingMasterReport, setIsGeneratingMasterReport] = useState(false);
    const [masterReportError, setMasterReportError] = useState<string | null>(null);

    // Simulation Phase (The new strategic dialogue)
    const [simulationMessages, setSimulationMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
    const [isSimulating, setIsSimulating] = useState(false);
    const [simulationInput, setSimulationInput] = useState("");
    const [isSimulationComplete, setIsSimulationComplete] = useState(false);
    // --- Persistence Logic ---
    const isHydrating = useRef(true);

    // 1. Sync Load from Mongo on Mount
    useEffect(() => {
        const loadProgress = async () => {
            try {
                const userProfileRaw = localStorage.getItem('userProfile');
                if (!userProfileRaw) return;
                const email = JSON.parse(userProfileRaw).email;
                
                const res = await fetch(`/api/professional/sync-progress?email=${email}`);
                const data = await res.json();
                
                if (data.success && data.progress) {
                    const p = data.progress;
                    if (p.step !== undefined) setStep(p.step);
                    if (p.narrative) setNarrative(p.narrative);
                    if (p.result) setResult(p.result);
                    if (p.messages) setMessages(p.messages);
                    if (p.isInterviewComplete !== undefined) setIsInterviewComplete(p.isInterviewComplete);
                    if (p.finalReport) setFinalReport(p.finalReport);
                    if (p.assessmentQuestions) setAssessmentQuestions(p.assessmentQuestions);
                    if (p.currentQuestionIndex !== undefined) setCurrentQuestionIndex(p.currentQuestionIndex);
                    if (p.userAnswers) setUserAnswers(p.userAnswers);
                    if (p.assessmentAnalysis) setAssessmentAnalysis(p.assessmentAnalysis);
                    if (p.mindsetMessages) setMindsetMessages(p.mindsetMessages);
                    if (p.mindsetAnalysis) setMindsetAnalysis(p.mindsetAnalysis);
                    if (p.grandFinalReport) setGrandFinalReport(p.grandFinalReport);
                    if (p.strategicPaths) setStrategicPaths(p.strategicPaths);
                    if (p.simulationMessages) setSimulationMessages(p.simulationMessages);
                    if (p.isSimulationComplete !== undefined) setIsSimulationComplete(p.isSimulationComplete);
                    if (p.selectedPath) setSelectedPath(p.selectedPath);
                    if (p.pathInterviewMessages) setPathInterviewMessages(p.pathInterviewMessages);
                    if (p.isPathSimulationComplete !== undefined) setIsPathSimulationComplete(p.isPathSimulationComplete);
                    if (p.implementationBlueprint) setImplementationBlueprint(p.implementationBlueprint);
                    if (p.finalMasterReport) setFinalMasterReport(p.finalMasterReport);
                }
            } catch (err) {
                console.error("Hydration professional progress error", err);
            } finally {
                isHydrating.current = false;
            }
        };
        loadProgress();
    }, []);

    // 1b. Auto-trigger generation if stuck at step 13 without data
    useEffect(() => {
        if (!isHydrating.current && step === 13 && !finalMasterReport && !isGeneratingMasterReport && !masterReportError) {
            handleGenerateMasterReport();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step, finalMasterReport, isGeneratingMasterReport, masterReportError]);

    // 2. Sync Save to Mongo on State Change
    useEffect(() => {
        if (isHydrating.current) return;
        
        const saveProgress = async () => {
            try {
                const userProfileRaw = localStorage.getItem('userProfile');
                if (!userProfileRaw) return;
                const email = JSON.parse(userProfileRaw).email;
                
                const progressData = {
                    step,
                    narrative,
                    result,
                    messages,
                    isInterviewComplete,
                    finalReport,
                    assessmentQuestions,
                    currentQuestionIndex,
                    userAnswers,
                    assessmentAnalysis,
                    mindsetMessages,
                    mindsetAnalysis,
                    grandFinalReport,
                    strategicPaths,
                    simulationMessages,
                    isSimulationComplete,
                    selectedPath,
                    pathInterviewMessages,
                    isPathSimulationComplete,
                    implementationBlueprint,
                    finalMasterReport
                };

                await fetch('/api/professional/sync-progress', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, progressData })
                });
            } catch (err) {
                console.error("Save professional progress error", err);
            }
        };

        const timer = setTimeout(saveProgress, 1000); // Debounce saves
        return () => clearTimeout(timer);
    }, [
        step, narrative, result, messages, isInterviewComplete, 
        finalReport, assessmentQuestions, currentQuestionIndex, 
        userAnswers, assessmentAnalysis, mindsetMessages, 
        mindsetAnalysis, grandFinalReport, strategicPaths,
        simulationMessages, isSimulationComplete,
        selectedPath, pathInterviewMessages, isPathSimulationComplete,
        implementationBlueprint, finalMasterReport
    ]);

    const translations = {
        ar: {
            welcomeTitle: "التشخيص الاستراتيجي المتقدم",
            welcomeSub: "نحن هنا لنقوم بتحليل مسارك المهني بعمق وفهم أهدافك القيادية القادمة.",
            startBtn: "ابدأ جلسة التعريف",
            narrativeTitle: "بناء الرواية المهنية (Career Narrative)",
            narrativeSub: "يرجى أن تتحدث بإيجاز عن العناصر التالية في فقرة متماسكة (بين 10 و 20 سطراً):",
            points: [
                "دراستك الأكاديمية: الشهادات، الاختصاص، والمؤسسة.",
                "التربصات المهنية (Stages): المهام والمهارات المكتسبة.",
                "التجارب المهنية: الوظائف السابقة، المدة، والمسؤوليات.",
                "وظيفتك الحالية: منصبك، أهم المهام، والقيمة المضافة."
            ],
            placeholder: "اكتب قصتك المهنية هنا...",
            submitBtn: "إرسال للتحليل الذكي",
            validationNote: "يرجى كتابة وصف وافٍ (10 أسطر على الأقل) لضمان دقة التحليل.",
            lineCount: "عدد الأسطر المقدر",
            reportTitle: "نتائج تدقيق ملفك الشخصي",
            resultsTitle: "نتائج تدقيق ملفك الشخصي",
            originalMirror: "المرآة الواقعية",
            strategicAudit: "نقد استراتيجي",
            detectedSkills: "المهارات المرصودة",
            skillGaps: "الفجوات الحرجة",
            timeline: "التسلسل الزمني للمسار",
            actions: "خطة العمل الفورية",
            restart: "إعادة التشخيص",
            narrativeAnalysis: "تحليل النص والاتساق",
            tone: "نبرة النص",
            clarity: "وضوح الأفكار",
            consistency: "الاتساق المنطقي",
            identity: "الهوية المهنية",
            basicInfo: "البيانات الأساسية",
            careerDimensions: "الأبعاد المهنية",
            field: "المجال المهني",
            specialization: "الاختصاص",
            education: "الشهادة الأكاديمية",
            experience: "سنوات الخبرة",
            sector: "القطاع",
            progression: "تطور المسار",
            responsibility: "مستوى المسؤولية",
            marketPosition: "التموضع في السوق",
            learningSignals: "إشارات التعلم",
            leadership: "القيادة",
            phase2Title: "المرحلة الثانية: المقابلة الاستراتيجية",
            phase2Sub: "تعميق التشخيص عبر نقاش مباشر مع الخبير الذكي",
            chatPlaceholder: "اكتب رسالتك للخبير هنا...",
            startPhase2: "الانتقال للمرحلة الثانية: المقابلة الاستراتيجية",
            aiThinking: "الخبير يفكر في ردك...",
            viewFinalReport: "عرض التقرير الاستراتيجي الشامل",
            interviewFinished: "تم استكمال المقابلة بنجاح",
            finalAuditTitle: "التقرير الاستراتيجي النهائي",
            executiveVerdict: "خلاصة التدقيق",
            level1Label: "المستوى ١: المصداقية والاتساق",
            level2Label: "المستوى ٢: تحليل الكفاءة والفجوات",
            level3Label: "المستوى ٣: التموضع والطموح",
            verifiedHardSkills: "المهارات التقنية التي تم التحقق منها",
            observedSoftSkills: "المهارات السلوكية المرصودة",
            marketValueLabel: "القيمة في السوق",
            finalScoreLabel: "مؤشر النضج المهني الكلي",
            startAssessment: "الانتقال للمرحلة الثالثة: اختبار الكفاءة",
            assessmentTitle: "اختبار الكفاءة والذكاء المهني",
            technicalCat: "الجدارة التقنية",
            softCat: "الذكاء السلوكي",
            scenarioCat: "محاكاة اتخاذ القرار",
            nextQuestion: "السؤال التالي",
            seeResult: "عرض تحليل الاختبار",
            explanationLabel: "التعليل",
            evidenceLabel: "الدلائل",
            adviceLabel: "النصيحة الاستراتيجية",
            correctAnswer: "إجابة صحيحة",
            wrongAnswer: "إجابة غير دقيقة",
            assessmentAnalysisTitle: "التحليل النهائي لاختبار الكفاءة",
            technicalProficiencyLabel: "الكفاءة التقنية",
            behavioralInsightLabel: "البصيرة السلوكية",
            decisionMakingLabel: "جودة اتخاذ القرار",
            finalVerdictLabel: "الاستنتاج النهائي الشامل",
            startMindsetInterview: "المرحلة التالية: تحليل العقلية (Mindset)",
            mindsetTitle: "تحليل العقلية والبروفايل النفسي المهني",
            mindsetSub: "فهم الدوافع العميقة، الرضا الوظيفي، والرؤية المستقبلية",
            mindsetTypeLabel: "نوع العقلية المهنية",
            satisfactionLabel: "مستوى الرضا الوظيفي",
            futureDirectionLabel: "الاتجاه الاستراتيجي القادم",
            psychologicalProfileTitle: "الملف النفسي المهني",
            ambitionScoreLabel: "مؤشر الطموح",
            loyaltyPatternLabel: "نمط الولاء المهني",
            motivationLabel: "المحرك الأساسي للعمل",
            stressHandlingLabel: "القدرة على تحمل الضغط",
            viewMindsetAnalysis: "عرض البروفايل النفسي النهائي",
            mindsetAnalysisTitle: "النتائج النهائية لتحليل العقلية والبروفايل",
            mindsetChatPlaceholder: "اكتب رسالتك للخبير النفسي هنا...",
            generateGrandReportBtn: "توليد التقرير الاستراتيجي الشامل النهائي",
            grandReportTitle: "مخطط النضج المهني الشامل",
            grandReportSub: "الخلاصة الكبرى لرحلة التشخيص والتحليل",
            maturityScoreLabel: "مؤشر النضج الكلي",
            psychologyLabel: "الهوية النفسية المهنية",
            skillRadarTitle: "رادار الكفاءة المتكامل",
            gapAnalysisTitle: "تحليل الفجوة السوقية",
            decisionVerdictTitle: "جودة اتخاذ القرار الاستراتيجي",
            marketValuesTitle: "التموضع والقيمة في السوق",
            roadmapTitle: "خارطة الطريق التنفيذية",
            shortTermLabel: "المدى القريب (٦-١٢ شهر)",
            mediumTermLabel: "الهدف الانتقالي (١-٢ سنة)",
            longTermLabel: "الرؤية القصوى (٥ سنوات)",
            expertSynthesisTitle: "خلاصة الخبير الاستراتيجي (Grand Synthesis)",
            back: "الرجوع للمرحلة السابقة",
            simulationTitle: "المواجهة الاستراتيجية والحسم",
            simulationSub: "حوار توجيهي لتحديد مسارك القادم بناءً على طموحك ونتائج تشخيصك",
            simulationPlaceholder: "تحدث مع الخبير حول خطوتك القادمة (ترقية، تغيير، استقرار)...",
            simulationNote: "ملاحظة: هذا التحليل يعكس جاهزيتك بناءً على بروفايلك الحالي فقط، ولا يشمل الظروف الخارجية لشركتك أو السوق.",
            finalizePaths: "توليد الخيارات الاستراتيجية النهائية"
        },
        en: {
            welcomeTitle: "Advanced Strategic Diagnosis",
            welcomeSub: "Deep analysis of your career path and leadership goals.",
            startBtn: "Start Session",
            narrativeTitle: "Career Narrative Building",
            narrativeSub: "Speak briefly about these elements in 10-20 lines:",
            points: [
                "Academic studies: degrees, specialization, and institution.",
                "Professional internships (Stages): tasks and acquired skills.",
                "Professional experiences: previous jobs, duration, and responsibilities.",
                "Your current job: position, main tasks, and added value."
            ],
            placeholder: "Write your career story...",
            submitBtn: "Submit Analysis",
            validationNote: "Min 10 lines required.",
            lineCount: "Estimated lines",
            reportTitle: "Profile Audit Results",
            resultsTitle: "Profile Audit Results",
            originalMirror: "Reality Mirror",
            strategicAudit: "Strategic Criticism",
            detectedSkills: "Detected Skills",
            skillGaps: "Critical Gaps",
            timeline: "Career Timeline",
            actions: "Immediate Actions",
            restart: "Restart Diagnosis",
            narrativeAnalysis: "Narrative & Consistency Analysis",
            tone: "Text Tone",
            clarity: "Idea Clarity",
            consistency: "Logical Consistency",
            identity: "Professional Identity",
            basicInfo: "Basic Data",
            careerDimensions: "Career Dimensions",
            field: "Field",
            specialization: "Specialization",
            education: "Education",
            experience: "Years of Experience",
            sector: "Sector",
            progression: "Career Progression",
            responsibility: "Responsibility Level",
            marketPosition: "Market Position",
            learningSignals: "Learning Signals",
            leadership: "Leadership",
            phase2Title: "Phase 2: Strategic Interview",
            phase2Sub: "Deepen the diagnosis via direct chat with the AI expert",
            chatPlaceholder: "Write your message to the expert...",
            startPhase2: "Move to Stage 2: Strategic Interview",
            aiThinking: "Expert is thinking...",
            viewFinalReport: "View Full Strategic Report",
            interviewFinished: "Interview successfully completed",
            finalAuditTitle: "Final Strategic Audit Report",
            executiveVerdict: "Audit Executive Verdict",
            level1Label: "Level 1: Credibility & Consistency",
            level2Label: "Level 2: Skill & Gap Analysis",
            level3Label: "Level 3: Strategic Fit & Ambition",
            verifiedHardSkills: "Verified Hard Skills",
            observedSoftSkills: "Observed Soft Skills",
            marketValueLabel: "Market Value Standing",
            finalScoreLabel: "Overall Professional Maturity Score",
            startAssessment: "Move to Stage 3: Competency Assessment",
            assessmentTitle: "Professional Competency & Intelligence Test",
            technicalCat: "Technical Proficiency",
            softCat: "Behavioral Intelligence",
            scenarioCat: "Decision-Making Simulation",
            nextQuestion: "Next Question",
            seeResult: "View Assessment Analysis",
            explanationLabel: "Reasoning",
            evidenceLabel: "Evidence",
            adviceLabel: "Strategic Advice",
            correctAnswer: "Correct Answer",
            wrongAnswer: "Inaccurate Answer",
            assessmentAnalysisTitle: "Final Assessment Analysis",
            technicalProficiencyLabel: "Technical Proficiency",
            behavioralInsightLabel: "Behavioral Insight",
            decisionMakingLabel: "Decision Quality",
            finalVerdictLabel: "Final Integrated Conclusion",
            startMindsetInterview: "Next Step: Mindset Analysis",
            mindsetTitle: "Mindset & Professional Psychological Profile",
            mindsetSub: "Understanding deep motivations, job satisfaction, and future vision",
            mindsetTypeLabel: "Professional Mindset Type",
            satisfactionLabel: "Job Satisfaction Level",
            futureDirectionLabel: "Upcoming Strategic Direction",
            psychologicalProfileTitle: "Professional Psychological Profile",
            ambitionScoreLabel: "Ambition Index",
            loyaltyPatternLabel: "Career Loyalty Pattern",
            motivationLabel: "Core Work Driver",
            stressHandlingLabel: "Pressure Handling Capability",
            viewMindsetAnalysis: "View Final Psychological Profile",
            mindsetAnalysisTitle: "Final Mindset & Profile Analysis Results",
            mindsetChatPlaceholder: "Type your message to the psychologist here...",
            generateGrandReportBtn: "Generate Final Strategic Career Report",
            grandReportTitle: "Master Career Maturity Blueprint",
            grandReportSub: "The ultimate synthesis of your diagnosis journey",
            maturityScoreLabel: "Overall Maturity Score",
            psychologyLabel: "Professional Psychological Identity",
            skillRadarTitle: "Integrated Competency Radar",
            gapAnalysisTitle: "Market Gap Analysis",
            decisionVerdictTitle: "Strategic Decision Quality",
            marketValuesTitle: "Positioning & Market Value",
            roadmapTitle: "Actionable Roadmap",
            shortTermLabel: "Short Term (6-12 Months)",
            mediumTermLabel: "Transition Goal (1-2 Years)",
            longTermLabel: "Ultimate Vision (5 Years)",
            expertSynthesisTitle: "Expert Strategic Synthesis (Grand Synthesis)",
            back: "Back to Previous Step",
            simulationTitle: "Strategic Mirror & Decision",
            simulationSub: "Dialogue to define your next move based on ambition and diagnosis results",
            simulationPlaceholder: "Talk to the expert about your next move (Promotion, Change, Stability)...",
            simulationNote: "Note: This analysis reflects your readiness based purely on your profile, not external market conditions.",
            finalizePaths: "Generate Final Strategic Options"
        },
        fr: {
            welcomeTitle: "Diagnostic Stratégique Avancé",
            welcomeSub: "Analyse approfondie de votre parcours et objectifs.",
            startBtn: "Démarrer",
            narrativeTitle: "Récit Professionnel",
            narrativeSub: "Présentez-vous en 10-20 lignes (études, stages, jobs, poste actuel).",
            points: [
                "Vos études académiques : diplômes, spécialisation et institution.",
                "Vos stages professionnels : tâches et compétences acquises.",
                "Vos expériences professionnelles : emplois précédents, durée et responsabilités.",
                "Votre poste actuel : votre fonction, les tâches principales et la valeur ajoutée."
            ],
            placeholder: "Écrivez votre récit...",
            submitBtn: "Lancer l'Analyse",
            validationNote: "Min 10 lignes.",
            lineCount: "Lignes",
            reportTitle: "Résultats de l'Audit",
            resultsTitle: "Résultats de l'Audit",
            originalMirror: "Miroir Réalité",
            strategicAudit: "Critique Stratégique",
            detectedSkills: "Compétences Détectées",
            skillGaps: "Gaps Critiques",
            timeline: "Chronologie",
            actions: "Actions Immédiates",
            restart: "Recommencer",
            narrativeAnalysis: "Analyse du Récit & Cohérence",
            tone: "Ton du texte",
            clarity: "Clarté des idées",
            consistency: "Cohérence logique",
            identity: "Identité Professionnelle",
            basicInfo: "Données de Base",
            careerDimensions: "Dimensions Professionnelles",
            field: "Domaine",
            specialization: "Spécialité",
            education: "Diplôme",
            experience: "Expérience",
            sector: "Secteur",
            progression: "Progression",
            responsibility: "Niveau",
            marketPosition: "Position Marché",
            learningSignals: "Signaux d'Apprentissage",
            leadership: "Leadership",
            phase2Title: "Phase 2: Interview Stratégique",
            phase2Sub: "Approfondir le diagnostic via un échange direct avec l'expert IA",
            chatPlaceholder: "Écrivez votre message à l'expert...",
            startPhase2: "Passer à l'Étape 2 : Interview Stratégique",
            aiThinking: "L'expert réfléchit...",
            viewFinalReport: "Voir le Rapport Stratégique Complet",
            interviewFinished: "Entretien terminé avec succès",
            finalAuditTitle: "Rapport d'Audit Stratégique Final",
            executiveVerdict: "Verdict Exécutif de l'Audit",
            level1Label: "Niveau 1 : Crédibilité & Cohérence",
            level2Label: "Niveau 2 : Analyse des Compétences & Gaps",
            level3Label: "Niveau 3 : Alignement & Ambition",
            verifiedHardSkills: "Compétences Techniques Validées",
            observedSoftSkills: "Compétences Comportementales Observées",
            marketValueLabel: "Valeur sur le Marché",
            finalScoreLabel: "Score Global de Maturité Professionnelle",
            startAssessment: "Passer à l'Étape 3 : Évaluation des Compétences",
            assessmentTitle: "Test de Compétence Professional & Intelligence",
            technicalCat: "Maîtrise Technique",
            softCat: "Intelligence Comportementale",
            scenarioCat: "Simulation de Prise de Décision",
            nextQuestion: "Question Suivante",
            seeResult: "Voir l'Analyse de l'Évaluation",
            explanationLabel: "Explication",
            evidenceLabel: "Preuves",
            adviceLabel: "Conseil Stratégique",
            correctAnswer: "Bonne Réponse",
            wrongAnswer: "Réponse Imprécise",
            assessmentAnalysisTitle: "Analyse Finale de l'Évaluation",
            technicalProficiencyLabel: "Compétence Technique",
            behavioralInsightLabel: "Aperçu Comportemental",
            decisionMakingLabel: "Qualité de Décision",
            finalVerdictLabel: "Conclusion Finale Intégrée",
            startMindsetInterview: "Étape Suivante : Analyse du Mindset",
            mindsetTitle: "Mindset & Profil Psychologique Professionnel",
            mindsetSub: "Comprendre les motivations profondes, satisfaction et vision future",
            mindsetTypeLabel: "Type de Mindset Professionnel",
            satisfactionLabel: "Niveau de Satisfaction",
            futureDirectionLabel: "Direction Stratégique Future",
            psychologicalProfileTitle: "Profil Psychologique Professionnel",
            ambitionScoreLabel: "Indice d'Ambition",
            loyaltyPatternLabel: "Modèle de Loyauté",
            motivationLabel: "Moteur de Travail Principal",
            stressHandlingLabel: "Capacité à gérer la pression",
            viewMindsetAnalysis: "Voir le Profil Psychologique Final",
            mindsetAnalysisTitle: "Analyse Finale du Mindset & Profil",
            mindsetChatPlaceholder: "Écrivez votre message à l'expert ici...",
            generateGrandReportBtn: "Générer le Rapport Stratégique Final",
            grandReportTitle: "Schéma de Maturité Professionnelle",
            grandReportSub: "La synthèse ultime de votre parcours de diagnostic",
            maturityScoreLabel: "Score de Maturité Global",
            psychologyLabel: "Identité Psychologique Professionnelle",
            skillRadarTitle: "Radar de Compétences Intégré",
            gapAnalysisTitle: "Analyse des Écarts du Marché",
            decisionVerdictTitle: "Qualité de Décision Stratégique",
            marketValuesTitle: "Positionnement & Valeur Marchande",
            roadmapTitle: "Feuille de Route Actionnable",
            shortTermLabel: "Court Terme (6-12 Mois)",
            mediumTermLabel: "Objectif Transition (1-2 Ans)",
            longTermLabel: "Vision Ultime (5 Ans)",
            expertSynthesisTitle: "Synthèse Stratégique de l'Expert",
            back: "Retour à l'étape précédente",
            simulationTitle: "Miroir Stratégique & Décision",
            simulationSub: "Dialogue pour définir votre prochaine étape selon vos ambitions et résultats",
            simulationPlaceholder: "Parlez à l'expert de votre prochaine étape (Promotion, Changement, Stabilité)...",
            simulationNote: "Note : Cette analyse reflète votre préparation selon votre profil uniquement, sans inclure le marché externe.",
            finalizePaths: "Générer les options stratégiques finales"
        }
    };

    const t = translations[language as 'ar' | 'en' | 'fr'] || translations['en'];

    const countLines = (text: string) => {
        if (!text) return 0;
        return text.split("\n").filter(line => line.trim().length > 0).length;
    };

    const handleSubmit = async () => {
        if (countLines(narrative) < 3) return; // Simple safety, the logic uses 10 lines
        
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/professional/audit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ narrative, language })
            });
            const data = await response.json();
            if (data.success) {
                setResult(data.analysis);
                setStep(2);
            }
        } catch (error) {
            console.error("Audit submission failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStartInterview = async () => {
        setStep(3);
        setIsInterviewing(true);
        try {
            const response = await fetch('/api/professional/interview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    narrative, 
                    auditResult: result, 
                    language 
                })
            });
            const data = await response.json();
            if (data.success) {
                setMessages([{ role: 'assistant', content: data.message }]);
            }
        } catch (error) {
            console.error("Failed to start interview:", error);
        } finally {
            setIsInterviewing(false);
        }
    };

    const handleSendMessage = async () => {
        if (!chatInput.trim() || isInterviewing) return;

        const newMessages = [...messages, { role: 'user', content: chatInput } as const];
        setMessages(newMessages);
        setChatInput("");
        setIsInterviewing(true);

        try {
            const response = await fetch('/api/professional/interview/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    messages: newMessages,
                    language 
                })
            });
            const data = await response.json();
            if (data.success) {
                let content = data.message;
                if (content.includes('[COMPLETED]')) {
                    content = content.replace('[COMPLETED]', '').trim();
                    setIsInterviewComplete(true);
                }
                setMessages([...newMessages, { role: 'assistant', content }]);
            }
        } finally {
            setIsInterviewing(false);
        }
    };

    const handleGenerateFinalReport = async () => {
        setIsGeneratingReport(true);
        try {
            const response = await fetch('/api/professional/final-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    narrative, 
                    auditResult: result, 
                    messages, 
                    language 
                })
            });
            const data = await response.json();
            if (data.success) {
                setFinalReport(data.report);
                setStep(4);
            }
        } catch (error) {
            console.error("Failed to generate final report:", error);
        } finally {
            setIsGeneratingReport(false);
        }
    };

    const handleStartAssessment = useCallback(async () => {
        setIsGeneratingAssessment(true);
        setAssessmentError(null);
        setStep(5);
        try {
            const response = await fetch('/api/professional/assessment/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    auditResult: result,
                    narrative,
                    messages,
                    language
                })
            });
            const data = await response.json();
            if (data.success) {
                setAssessmentQuestions(data.questions);
                setCurrentQuestionIndex(0);
                setUserAnswers([]);
            } else {
                setAssessmentError(data.error || "Failed to generate assessment questions.");
            }
        } catch (error) {
            console.error("Failed to generate assessment:", error);
            setAssessmentError("A network or system error occurred during assessment generation.");
        } finally {
            setIsGeneratingAssessment(false);
        }
    }, [result, narrative, messages, language]);

    // 3. Auto-Trigger Assessment if stuck at Step 5 with 0 questions
    useEffect(() => {
        if (!isHydrating.current && step === 5 && assessmentQuestions.length === 0 && !isGeneratingAssessment && !assessmentError) {
            handleStartAssessment();
        }
    }, [step, assessmentQuestions.length, isGeneratingAssessment, assessmentError, handleStartAssessment]);

    const handleSelectOption = (index: number) => {
        if (showCorrection) return;
        setSelectedOption(index);
        setShowCorrection(true);
        
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestionIndex] = index;
        setUserAnswers(newAnswers);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < assessmentQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setShowCorrection(false);
            setSelectedOption(null);
        } else {
            handleAnalyzeAssessment();
        }
    };

    const handleAnalyzeAssessment = async () => {
        setIsAnalyzingAssessment(true);
        try {
            const response = await fetch('/api/professional/assessment/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    questions: assessmentQuestions,
                    userAnswers,
                    auditResult: result,
                    language
                })
            });
            const data = await response.json();
            if (data.success) {
                setAssessmentAnalysis(data.analysis);
            }
        } catch (error) {
            console.error("Failed to analyze assessment:", error);
        } finally {
            setIsAnalyzingAssessment(false);
        }
    };

    const handleStartMindsetInterview = async () => {
        setStep(6);
        setIsMindsetInterviewing(true);
        try {
            const response = await fetch('/api/professional/mindset/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [], language })
            });
            const data = await response.json();
            if (data.success) {
                setMindsetMessages([{ role: 'assistant', content: data.message }]);
            }
        } catch (error) {
            console.error("Failed to start mindset interview:", error);
        } finally {
            setIsMindsetInterviewing(false);
        }
    };

    const handleSendMindsetMessage = async () => {
        if (!mindsetInput.trim() || isMindsetInterviewing) return;

        const newMessages = [...mindsetMessages, { role: 'user', content: mindsetInput } as const];
        setMindsetMessages(newMessages);
        setMindsetInput("");
        setIsMindsetInterviewing(true);

        try {
            const response = await fetch('/api/professional/mindset/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages, language })
            });
            const data = await response.json();
            if (data.success) {
                setMindsetMessages([...newMessages, { role: 'assistant', content: data.message }]);
                
                // If we reach a certain depth, offer analysis
                if (newMessages.filter(m => m.role === 'assistant').length >= 4) {
                    // This is handled in the UI by showing a "View Analysis" button
                }
            }
        } catch (error) {
            console.error("Failed to send mindset message:", error);
        } finally {
            setIsMindsetInterviewing(false);
        }
    };

    const handleAnalyzeMindset = async () => {
        setIsAnalyzingMindset(true);
        setStep(7);
        try {
            const response = await fetch('/api/professional/mindset/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: mindsetMessages, language })
            });
            const data = await response.json();
            if (data.success) {
                setMindsetAnalysis(data.analysis);
            }
        } catch (error) {
            console.error("Failed to analyze mindset:", error);
        } finally {
            setIsAnalyzingMindset(false);
        }
    };

    const handleGenerateGrandReport = async () => {
        setIsGeneratingGrandReport(true);
        setStep(8);
        try {
            const response = await fetch('/api/professional/grand-final-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    auditResult: result, 
                    interviewTranscript: messages, 
                    assessmentAnalysis, 
                    mindsetAnalysis, 
                    language 
                })
            });
            const data = await response.json();
            if (data.success) {
                setGrandFinalReport(data.report);
            }
        } catch (error) {
            console.error("Failed to generate grand report:", error);
        } finally {
            setIsGeneratingGrandReport(false);
        }
    };

    const handleGeneratePaths = async () => {
        if (!grandFinalReport) return;
        setIsGeneratingPaths(true);
        setStep(10);
        try {
            const response = await fetch('/api/professional/strategic-paths', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    grandReport: grandFinalReport, 
                    language,
                    simulationContext: simulationMessages
                })
            });
            const data = await response.json();
            setStrategicPaths(data);
        } catch (error) {
            console.error("Failed to generate strategic paths:", error);
        } finally {
            setIsGeneratingPaths(false);
        }
    };

    const handleStartSimulation = async () => {
        setStep(9);
        setIsSimulating(true);
        try {
            const response = await fetch('/api/professional/simulation/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    grandReport: grandFinalReport,
                    assessmentAnalysis,
                    mindsetAnalysis,
                    language 
                })
            });
            const data = await response.json();
            if (data.success) {
                setSimulationMessages([{ role: 'assistant', content: data.message }]);
            }
        } catch (error) {
            console.error("Failed to start simulation:", error);
        } finally {
            setIsSimulating(false);
        }
    };

    const handleSendSimulationMessage = async () => {
        if (!simulationInput.trim() || isSimulating) return;

        const newMessages = [...simulationMessages, { role: 'user', content: simulationInput } as const];
        setSimulationMessages(newMessages);
        setSimulationInput("");
        setIsSimulating(true);

        try {
            const response = await fetch('/api/professional/simulation/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    messages: newMessages,
                    grandReport: grandFinalReport,
                    language 
                })
            });
            const data = await response.json();
            if (data.success) {
                let content = data.message;
                if (content.includes('[READY_FOR_PATHS]')) {
                    content = content.replace('[READY_FOR_PATHS]', '').trim();
                    setIsSimulationComplete(true);
                }
                setSimulationMessages([...newMessages, { role: 'assistant', content }]);
            }
        } finally {
            setIsSimulating(false);
        }
    };

    const handleSelectPath = async (path: StrategicPath) => {
        setSelectedPath(path);
        // Clear previous messages and start fresh
        setPathInterviewMessages([]);
        setStep(11); // Switch UI to Step 11
        setIsPathSimulating(true);

        try {
            const response = await fetch('/api/professional/path-simulation/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    path,
                    grandReport: grandFinalReport,
                    language 
                })
            });
            
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || `Server Error: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                setPathInterviewMessages([{ role: 'assistant', content: data.message }]);
            } else {
                throw new Error(data.error || 'Failed to start simulation');
            }
        } catch (err: unknown) {
            console.error("Path Simulation Error:", err);
            const errorMsg = language === 'ar' 
                ? `عذراً، فشل الاتصال بالخبير: ${err instanceof Error ? err.message : 'خطأ غير معروف'}` 
                : `Sorry, failed to connect to expert: ${err instanceof Error ? err.message : 'Unknown error'}`;
            setPathInterviewMessages([{ role: 'assistant', content: errorMsg }]);
        } finally {
            setIsPathSimulating(false);
        }
    };

    const handleSendPathMessage = async () => {
        if (!pathSimulationInput.trim() || isPathSimulating) return;

        const currentInput = pathSimulationInput;
        const newMessages = [...pathInterviewMessages, { role: 'user', content: currentInput } as const];
        setPathInterviewMessages(newMessages);
        setPathSimulationInput("");
        setIsPathSimulating(true);

        try {
            const response = await fetch('/api/professional/path-simulation/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    messages: newMessages,
                    path: selectedPath,
                    grandReport: grandFinalReport,
                    language 
                })
            });

            if (!response.ok) {
                throw new Error(`Server Error: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                let content = data.message;
                if (content.includes('[READY_FOR_BLUEPRINT]')) {
                    content = content.replace('[READY_FOR_BLUEPRINT]', '').trim();
                    setIsPathSimulationComplete(true);
                }
                setPathInterviewMessages([...newMessages, { role: 'assistant', content }]);
            } else {
                throw new Error(data.error || 'Simulation error');
            }
        } catch (err: unknown) {
            console.error("Send Path Message Error:", err);
            const errorMsg = language === 'ar' 
                ? `فشل في إرسال الرسالة: ${err instanceof Error ? err.message : 'خطأ غير معروف'}` 
                : `Failed to send message: ${err instanceof Error ? err.message : 'Unknown error'}`;
            setPathInterviewMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
        } finally {
            setIsPathSimulating(false);
        }
    };

    const handleGenerateBlueprint = async () => {
        setIsGeneratingBlueprint(true);
        setStep(12);
        try {
            const response = await fetch('/api/professional/path-blueprint', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    selectedPath,
                    pathContext: pathInterviewMessages,
                    grandReport: grandFinalReport,
                    language 
                })
            });
            const data = await response.json();
            setImplementationBlueprint(data);
        } finally {
            setIsGeneratingBlueprint(false);
        }
    };

    const handleGenerateMasterReport = async () => {
        setIsGeneratingMasterReport(true);
        setMasterReportError(null);
        setStep(13);
        try {
            // Prune data to avoid token limits and slow responses
            const prunedData = {
                narrative: narrative.substring(0, 2000),
                auditResult: result,
                finalReport: finalReport,
                assessmentAnalysis: assessmentAnalysis,
                mindsetAnalysis: mindsetAnalysis,
                grandFinalReport: grandFinalReport,
                strategicPaths: strategicPaths,
                selectedPath: selectedPath,
                // Only take last 10 messages for context
                pathInterviewMessages: pathInterviewMessages.slice(-10),
                // Only take important blueprint parts
                implementationBlueprint: implementationBlueprint ? {
                    tacticalWins: implementationBlueprint.tacticalWins,
                    suggestedRoles: implementationBlueprint.suggestedRoles,
                    gapBridge: implementationBlueprint.gapBridge
                } : null,
                language,
                userName: JSON.parse(localStorage.getItem('userProfile') || '{}').name
            };

            const response = await fetch('/api/professional/final-master-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(prunedData)
            });
            
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || `HTTP ${response.status}`);
            }

            const data = await response.json();
            setFinalMasterReport(data);
        } catch (err: unknown) {
            console.error("Master Report Generation Error:", err);
            setMasterReportError(err instanceof Error ? err.message : "Failed to generate master report");
        } finally {
            setIsGeneratingMasterReport(false);
        }
    };

    if (step === 4 && finalReport) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto p-6 md:p-12 space-y-12"
            >
                <button 
                    onClick={() => setStep(3)}
                    className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-black text-[10px] uppercase tracking-widest transition-all group mb-6"
                >
                    <ArrowLeft size={16} className={cn("group-hover:-translate-x-1 transition-transform", isRtl && "rotate-180 group-hover:translate-x-1")} />
                    {t.back}
                </button>

                {/* Header */}
                <div className="bg-slate-900 rounded-6xl p-12 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-10"><ShieldCheck size={200} /></div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black">{t.finalAuditTitle}</h2>
                            <p className="text-indigo-300 font-bold uppercase tracking-[0.3em]">{finalReport.executiveVerdict}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-8 rounded-4xl border border-white/10 text-center min-w-[200px]">
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">{t.finalScoreLabel}</p>
                            <span className="text-5xl font-black">{finalReport.finalScore}%</span>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Level 1: Credibility */}
                    <div className="bg-white rounded-5xl p-10 border border-slate-100 shadow-xl space-y-8">
                        <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                <Search size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900">{t.level1Label}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500" style={{ width: `${finalReport.level1Analysis.score}%` }} />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400">{finalReport.level1Analysis.score}%</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t.consistency}</span>
                                <p className="text-sm font-bold text-slate-700 leading-relaxed">{finalReport.level1Analysis.consistency}</p>
                            </div>
                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t.clarity}</span>
                                <p className="text-sm font-bold text-slate-700 leading-relaxed">{finalReport.level1Analysis.presentationQuality}</p>
                            </div>
                        </div>
                    </div>

                    {/* Level 3: Alignment */}
                    <div className="bg-white rounded-5xl p-10 border border-slate-100 shadow-xl space-y-8">
                        <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                                <Target size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900">{t.level3Label}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500" style={{ width: `${finalReport.level3Analysis.alignmentScore}%` }} />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400">{finalReport.level3Analysis.alignmentScore}%</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-2">{t.marketValueLabel}</span>
                                <p className="text-sm font-black text-emerald-900 leading-relaxed">{finalReport.level3Analysis.marketValue}</p>
                            </div>
                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Analysis</span>
                                <p className="text-sm font-bold text-slate-700 leading-relaxed">{finalReport.level3Analysis.pathAnalysis}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Level 2: Skills Deep Dive */}
                <div className="bg-white rounded-6xl p-12 border border-slate-100 shadow-2xl space-y-12">
                    <div className="flex items-center gap-4 border-b border-slate-100 pb-8">
                        <div className="w-14 h-14 bg-amber-50 rounded-3xl flex items-center justify-center text-amber-600">
                            <Zap size={28} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900">{t.level2Label}</h3>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="space-y-4">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <CheckCircle2 size={14} className="text-emerald-500" />
                                {t.verifiedHardSkills}
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {finalReport.level2Analysis.hardSkills.map((s, i) => (
                                    <span key={i} className="px-4 py-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-100">{s}</span>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Brain size={14} className="text-indigo-500" />
                                {t.observedSoftSkills}
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {finalReport.level2Analysis.softSkills.map((s, i) => (
                                    <span key={i} className="px-4 py-2 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-100">{s}</span>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <AlertCircle size={14} className="text-rose-500" />
                                {t.skillGaps}
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {finalReport.level2Analysis.criticalGaps.map((s, i) => (
                                    <span key={i} className="px-4 py-2 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl border border-rose-100">{s}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Final Action Plan */}
                <div className="bg-indigo-600 rounded-6xl p-12 text-white shadow-3xl grid md:grid-cols-2 gap-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-10"><Rocket size={150} /></div>
                    <div className="space-y-6 relative z-10">
                        <h4 className="text-xl font-black uppercase tracking-[0.2em] opacity-60">Immediate Roadmap</h4>
                        <div className="space-y-4">
                            {finalReport.actionPlan.immediate.map((act, i) => (
                                <div key={i} className="flex gap-4 p-5 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
                                    <div className="w-8 h-8 rounded-full bg-white text-indigo-600 flex items-center justify-center font-black text-xs shrink-0">{i+1}</div>
                                    <p className="text-sm font-bold">{act}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-6 relative z-10">
                        <h4 className="text-xl font-black uppercase tracking-[0.2em] opacity-60">Strategic Growth</h4>
                        <div className="space-y-4">
                            {finalReport.actionPlan.strategic.map((act, i) => (
                                <div key={i} className="flex gap-4 p-5 bg-indigo-900/30 rounded-2xl border border-indigo-400/20 backdrop-blur-sm">
                                    <div className="w-8 h-8 rounded-full bg-indigo-400 text-white flex items-center justify-center font-black text-xs shrink-0">{i+1}</div>
                                    <p className="text-sm font-bold">{act}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-center items-center gap-6 pt-8">
                    <button 
                        onClick={handleStartAssessment}
                        className="w-full md:w-auto px-12 py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-200 flex items-center justify-center gap-4"
                    >
                        {t.startAssessment}
                        <ArrowRight size={20} className={isRtl ? "rotate-180" : ""} />
                    </button>
                    <button 
                        onClick={() => setStep(0)}
                        className="w-full md:w-auto px-12 py-5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-black uppercase tracking-widest transition-all"
                    >
                        {t.restart}
                    </button>
                </div>
            </motion.div>
        );
    }

    if (step === 3) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-7xl mx-auto p-4 md:p-6 h-[calc(100vh-80px)] flex flex-col"
            >
                <button 
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 text-slate-400 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all group mb-6 bg-slate-900 w-fit px-4 py-2 rounded-xl"
                >
                    <ArrowLeft size={16} className={cn("group-hover:-translate-x-1 transition-transform", isRtl && "rotate-180 group-hover:translate-x-1")} />
                    {t.back}
                </button>

                {/* Interview Header */}
                <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-5xl border border-slate-100 shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <Brain size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900">{t.phase2Title}</h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.phase2Sub}</p>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-indigo-50 rounded-xl border border-indigo-100">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Active Audit Session</span>
                    </div>
                </div>

                {/* Chat Interface */}
                <div className="flex-1 bg-white rounded-6xl border border-slate-100 shadow-2xl overflow-hidden flex flex-col relative">
                    <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                        {messages.map((msg, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                className={cn(
                                    "flex w-full max-w-[85%] md:max-w-[75%] gap-4",
                                    msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                                )}
                            >
                                {/* Avatar */}
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 z-10",
                                    msg.role === 'user' 
                                        ? "bg-slate-100 text-slate-500 shadow-sm border border-slate-200" 
                                        : "bg-linear-to-br from-indigo-600 to-violet-700 text-white shadow-[0_8px_30px_-6px_rgba(79,70,229,0.5)] ring-4 ring-white"
                                )}>
                                    {msg.role === 'user' ? <User size={20} /> : <Brain size={24} />}
                                </div>
                                
                                {/* Message Bubble */}
                                <div className={cn(
                                    "flex flex-col gap-2 max-w-[calc(100%-4rem)]",
                                    msg.role === 'user' ? "items-end" : "items-start"
                                )}>
                                    <div className={cn(
                                        "px-7 py-6 rounded-4xl",
                                        msg.role === 'user' 
                                            ? "bg-slate-900 text-white rounded-tr-xl shadow-2xl shadow-slate-200/50 border border-slate-800" 
                                            : "bg-white text-slate-700 rounded-tl-xl border-l-4 border-l-indigo-600 border-y border-r border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] relative overflow-hidden"
                                    )}>
                                        {msg.role === 'assistant' && (
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-60"></div>
                                        )}
                                        <div className="relative z-10">
                                            <p className={cn(
                                                "text-[14.5px] leading-[1.85] font-semibold whitespace-pre-wrap",
                                                msg.role === 'user' ? "text-slate-100" : "text-slate-700"
                                            )}>{msg.content}</p>
                                        </div>
                                    </div>
                                    <span className={cn(
                                        "text-[10px] font-black uppercase tracking-widest px-3",
                                        msg.role === 'user' ? "text-slate-400" : "text-indigo-600"
                                    )}>
                                        {msg.role === 'user' ? 'Candidate' : 'Strategic AI Expert'}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                        {isInterviewing && messages.length > 0 && messages[messages.length-1].role === 'user' && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex w-full max-w-[85%] md:max-w-[75%] gap-4 mr-auto"
                            >
                                <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-slate-100/50 bg-indigo-600 flex-col overflow-hidden relative text-white">
                                    <Brain size={18} className="animate-pulse" />
                                    <div className="absolute inset-0 bg-white/20 animate-ping rounded-2xl"></div>
                                </div>
                                <div className="flex flex-col gap-2 items-start max-w-[calc(100%-3rem)]">
                                    <div className="px-6 py-5 rounded-4xl bg-white text-slate-700 rounded-tl-md border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-indigo-500">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                        <span className="text-[10px] font-black uppercase text-slate-400">{t.aiThinking}</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        {messages.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-30 select-none">
                                <Brain size={120} className="text-indigo-200" />
                                <p className="text-xs font-black uppercase tracking-[0.4em] text-indigo-400 text-center leading-relaxed">
                                    Initializing Strategic Connection...<br/>DeepSeek Core Waiting
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Chat Input */}
                    <div className="p-8 bg-slate-50 border-t border-slate-100">
                        {isInterviewComplete ? (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center gap-4 py-4"
                            >
                                <div className="flex items-center gap-3 text-emerald-600 font-black uppercase tracking-widest text-[10px]">
                                    <CheckCircle2 size={16} />
                                    {t.interviewFinished}
                                </div>
                                <button 
                                    onClick={handleGenerateFinalReport}
                                    disabled={isGeneratingReport}
                                    className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-2xl flex items-center justify-center gap-4 disabled:opacity-50"
                                >
                                    {isGeneratingReport ? <Loader2 className="animate-spin" size={20} /> : (
                                        <>
                                            {t.viewFinalReport}
                                            <ArrowRight size={20} className={isRtl ? "rotate-180" : ""} />
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        ) : (
                            <div className="flex gap-4 items-center bg-white p-2 pl-6 rounded-3xl border border-slate-200 shadow-sm focus-within:border-indigo-500 transition-all">
                                <input 
                                    className="flex-1 bg-transparent py-3 outline-none text-sm font-bold text-slate-700 placeholder:text-slate-300"
                                    placeholder={t.chatPlaceholder}
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    disabled={isInterviewing}
                                />
                                <button 
                                    onClick={handleSendMessage}
                                    disabled={!chatInput.trim() || isInterviewing}
                                    className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50 disabled:grayscale"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    }

    if (step === 2 && result) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-7xl mx-auto p-6 md:p-12 space-y-8"
            >
                <button 
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-black text-[10px] uppercase tracking-widest transition-all group"
                >
                    <ArrowLeft size={16} className={cn("group-hover:-translate-x-1 transition-transform", isRtl && "rotate-180 group-hover:translate-x-1")} />
                    {t.back}
                </button>

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 text-indigo-600">
                            <ShieldCheck size={24} />
                            <h2 className="text-3xl font-black tracking-tight">{t.resultsTitle}</h2>
                        </div>
                        <p className="text-slate-500 font-medium">
                            {language === 'ar' ? "تحليل الحمض النووي المهني - نسخة المدقق الاستراتيجي" : "Professional DNA Analysis - Strategic Auditor Edition"}
                        </p>
                    </div>
                    <button 
                        onClick={() => setStep(0)}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-all shadow-sm group"
                    >
                        <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                        {t.restart}
                    </button>
                </div>

                {/* Identity & Basic Info Grid */}
                <div className="grid lg:grid-cols-3 gap-8 mb-12">
                    {/* Professional Identity Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-1 bg-linear-to-br from-indigo-600 to-violet-700 rounded-6xl p-10 text-white shadow-2xl relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                            <Briefcase size={160} />
                        </div>
                        <div className="relative z-10 space-y-6">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                                <Search size={24} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-indigo-100 font-bold uppercase tracking-widest text-xs">{t.identity}</h3>
                                <p className="text-3xl font-black leading-tight drop-shadow-md">
                                    {result.professionalIdentity}
                                </p>
                            </div>
                            <div className="pt-4 border-t border-white/10 flex items-center gap-4">
                                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                    <Trophy size={20} className="text-amber-300" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-tighter">{t.progression}</p>
                                    <div className="flex items-center gap-2">
                                        <p className="font-black text-sm">{result.dimensions.careerProgression}</p>
                                        {result.dimensions.progressionIcon === 'up' && <ChevronUp size={16} className="text-emerald-400" />}
                                        {result.dimensions.progressionIcon === 'down' && <ChevronDown size={16} className="text-rose-400" />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Basic Info Data Matrix */}
                    <div className="lg:col-span-2 bg-white rounded-6xl border border-slate-100 p-10 shadow-xl grid md:grid-cols-2 gap-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-5"><Layout size={100} /></div>
                        
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Database className="text-indigo-600" size={18} />
                                <h4 className="font-black text-xs uppercase tracking-widest text-slate-400">{t.basicInfo}</h4>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    { label: t.field, value: result.basicData.field, icon: Briefcase },
                                    { label: t.specialization, value: result.basicData.specialization, icon: Target },
                                    { label: t.education, value: result.basicData.education, icon: GraduationCap },
                                    { label: t.experience, value: result.basicData.yearsOfExperience, icon: History },
                                    { label: t.sector, value: result.basicData.sector, icon: Layout },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100/50">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                                <item.icon size={14} className="text-indigo-500" />
                                            </div>
                                            <span className="text-xs font-bold text-slate-500">{item.label}</span>
                                        </div>
                                        <span className="text-sm font-black text-slate-900">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Zap className="text-amber-500" size={18} />
                                <h4 className="font-black text-xs uppercase tracking-widest text-slate-400">{t.careerDimensions}</h4>
                            </div>
                            
                            <div className="space-y-4">
                                {[
                                    { label: t.responsibility, value: result.dimensions.responsibilityLevel, score: 70, color: "bg-indigo-500" },
                                    { label: t.marketPosition, value: result.dimensions.marketPosition, score: 60, color: "bg-emerald-500" },
                                    { label: t.leadership, value: result.dimensions.leadershipSignal, score: 40, color: "bg-amber-500" },
                                ].map((dim, idx) => (
                                    <div key={idx} className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <span className="text-xs font-bold text-slate-500">{dim.label}</span>
                                            <span className="text-xs font-black text-slate-900">{dim.value}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${dim.score}%` }}
                                                className={`h-full ${dim.color}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                                
                                <div className="pt-4 border-t border-slate-50">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">{t.learningSignals}</span>
                                    <div className="flex flex-wrap gap-2">
                                        {result.learningSignals.map((sig, i) => (
                                            <span key={i} className="px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-black rounded-lg border border-amber-100">
                                                {sig}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content: Mirror & Criticism */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Reality Mirror */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-6xl p-10 border border-slate-100 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5"><History size={120} /></div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 shadow-sm">
                                <AlertCircle size={20} />
                            </div>
                            <h3 className="font-black text-sm uppercase tracking-widest text-slate-900">{t.originalMirror}</h3>
                        </div>
                        <p className="text-lg font-bold leading-relaxed text-slate-700 italic border-l-4 border-amber-500 pl-6 py-2">
                            &quot;{result.executiveSummary}&quot;
                        </p>
                    </motion.div>

                    {/* Strategic Criticism */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-slate-900 text-white rounded-6xl p-10 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10"><Target size={120} /></div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-400 shadow-sm">
                                <Zap size={20} />
                            </div>
                            <h3 className="font-black text-sm uppercase tracking-widest text-indigo-100">{t.strategicAudit}</h3>
                        </div>
                        <p className="text-lg font-bold leading-relaxed opacity-90">
                            {result.strategicCriticism}
                        </p>
                    </motion.div>
                </div>

                {/* Skills & Timeline Section */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Skills Matrix */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-6xl p-10 border border-slate-100 shadow-xl space-y-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Zap className="text-indigo-600" size={20} />
                                    <h3 className="font-black text-sm uppercase tracking-widest text-slate-900">{t.detectedSkills}</h3>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {result.skills.detected.map((skill, i) => (
                                    <motion.span 
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="px-6 py-3 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-black border border-emerald-100 flex items-center gap-2"
                                    >
                                        <CheckCircle2 size={14} />
                                        {skill}
                                    </motion.span>
                                ))}
                            </div>

                            <div className="pt-10 border-t border-slate-50 space-y-6">
                                <div className="flex items-center gap-3">
                                    <Rocket className="text-rose-500" size={20} />
                                    <h3 className="font-black text-sm uppercase tracking-widest text-slate-900">{t.skillGaps}</h3>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {result.skills.gaps.map((gap, i) => (
                                        <span key={i} className="px-6 py-3 bg-rose-50 text-rose-600 rounded-2xl text-xs font-black border border-rose-100">
                                            {gap}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline & Analysis */}
                    <div className="space-y-8">
                        {/* Career Timeline */}
                        <div className="bg-white rounded-5xl p-8 border border-slate-100 shadow-xl space-y-8">
                            <div className="flex items-center gap-3">
                                <TrendingUp className="text-indigo-600" size={20} />
                                <h3 className="font-black text-sm uppercase tracking-widest text-slate-900">{t.timeline}</h3>
                            </div>
                            <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:w-0.5 before:bg-slate-100 before:h-full">
                                {result.timeline.length > 0 ? result.timeline.map((item, i) => (
                                    <div key={i} className="relative flex items-center gap-8 pl-4 group">
                                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 border-4 border-white shadow-lg z-10 group-hover:scale-125 transition-transform" />
                                        <div className="flex flex-col">
                                            <div className="flex gap-4 items-center">
                                                <span className="text-xs font-black text-indigo-600 min-w-[50px]">{item.year}</span>
                                                <span className="text-sm font-bold text-slate-700">{item.event}</span>
                                            </div>
                                            {item.duration && (
                                                <span className="text-[10px] font-bold text-slate-400 ml-[66px]">{item.duration}</span>
                                            )}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-xs font-bold text-slate-400 italic py-4 pl-12">
                                        {language === 'ar' ? "لا يوجد تسلسل زمني واضح" : "No clear timeline detected"}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Narrative Analysis Card */}
                        <div className="bg-slate-50 rounded-5xl p-8 border border-slate-200 shadow-inner space-y-8">
                            <div className="flex items-center gap-3">
                                <Brain className="text-indigo-600" size={20} />
                                <h3 className="font-black text-sm uppercase tracking-widest text-slate-900">{t.narrativeAnalysis}</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.tone}</span>
                                    <p className="text-sm font-black text-indigo-600">{result.textAnalysis?.tone}</p>
                                </div>
                                <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.clarity}</span>
                                    <p className="text-sm font-black text-indigo-600">{result.textAnalysis?.clarity}</p>
                                </div>
                                <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.consistency}</span>
                                    <p className="text-sm font-black text-indigo-600">{result.textAnalysis?.consistency}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Final Action Plan */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-indigo-600 rounded-6xl p-12 text-white shadow-[0_30px_60px_-15px_rgba(79,70,229,0.3)] relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-12 opacity-10"><Rocket size={200} /></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                                    <BarChart3 size={24} />
                                </div>
                                <h3 className="text-3xl font-black">{t.actions}</h3>
                            </div>
                            <div className="space-y-4">
                                {result.actionPlan.map((action, i) => (
                                    <div key={i} className="flex gap-4 items-center p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm group hover:bg-white/20 transition-all">
                                        <div className="w-8 h-8 rounded-full bg-white text-indigo-600 flex items-center justify-center font-black text-xs shrink-0">
                                            {i + 1}
                                        </div>
                                        <p className="text-sm font-bold">{action}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="w-full md:w-auto">
                            <button 
                                onClick={handleStartInterview}
                                className="w-full px-10 py-6 bg-white text-indigo-600 rounded-3xl font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-2xl flex items-center justify-center gap-4"
                            >
                                {t.startPhase2}
                                <ArrowRight size={20} className={isRtl ? "rotate-180" : ""} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        );
    }

    if (step === 5) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-6xl mx-auto p-6 md:p-12 min-h-screen flex flex-col"
            >
                <button 
                    onClick={() => setStep(4)}
                    className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-black text-[10px] uppercase tracking-widest transition-all group mb-6"
                >
                    <ArrowLeft size={16} className={cn("group-hover:-translate-x-1 transition-transform", isRtl && "rotate-180 group-hover:translate-x-1")} />
                    {t.back}
                </button>

                {/* Assessment Header */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12 bg-white p-8 rounded-5xl border border-slate-100 shadow-xl">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-emerald-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-emerald-100">
                            <GraduationCap size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">{t.assessmentTitle}</h2>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-emerald-100">
                                    30 {language === 'ar' ? 'سؤالاً' : 'Questions'}
                                </span>
                                <span className="text-slate-300">|</span>
                                <span className="text-xs font-bold text-slate-400">
                                    {assessmentQuestions.length > 0 ? `${currentQuestionIndex + 1} / ${assessmentQuestions.length}` : 'Initializing...'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {assessmentError ? (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-8 py-20">
                        <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-600 shadow-xl shadow-rose-100">
                             <AlertCircle size={40} />
                        </div>
                        <div className="text-center space-y-4 max-w-md">
                            <h3 className="text-2xl font-black text-slate-900">{language === 'ar' ? 'فشل توليد الاختبار' : 'Assessment Generation Failed'}</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">
                                {assessmentError}
                            </p>
                            <button 
                                onClick={handleStartAssessment}
                                className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 mx-auto mt-6 shadow-2xl"
                            >
                                <RefreshCw size={20} />
                                {language === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
                            </button>
                        </div>
                    </div>
                ) : isGeneratingAssessment ? (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-8 py-20">
                        <div className="relative">
                            <div className="w-24 h-24 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles className="text-emerald-600 animate-pulse" size={32} />
                            </div>
                        </div>
                        <div className="text-center space-y-3">
                            <h3 className="text-2xl font-black text-slate-900">{language === 'ar' ? 'جاري توليد الاختبار الاستراتيجي...' : 'Generating Strategic Assessment...'}</h3>
                            <p className="text-slate-500 font-medium">{language === 'ar' ? 'نقوم بتحليل التقارير السابقة لبناء 30 سؤالاً محاكاةً لوضعيتك...' : 'Synthesizing previous reports to build 30 tailored simulation questions...'}</p>
                        </div>
                    </div>
                ) : isAnalyzingAssessment ? (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-8 py-20">
                        <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                        <div className="text-center space-y-3">
                            <h3 className="text-2xl font-black text-slate-900">{language === 'ar' ? 'جاري تحليل النتائج بدقة...' : 'Analyzing results with precision...'}</h3>
                            <p className="text-slate-500 font-medium">{language === 'ar' ? 'الخبير يراجع إجاباتك ويقارنها بمسارك المهني...' : 'The expert is reviewing your answers and comparing them with your career path...'}</p>
                        </div>
                    </div>
                ) : assessmentAnalysis ? (
                    /* Final Analysis Results */
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8 pb-20"
                    >
                        <div className="bg-slate-900 rounded-6xl p-12 text-white relative overflow-hidden shadow-3xl">
                             <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12"><Trophy size={250} /></div>
                             <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                                <h3 className="text-3xl font-black uppercase tracking-[0.2em]">{t.assessmentAnalysisTitle}</h3>
                                <div className="flex items-center gap-12">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Final Assessment Score</p>
                                        <span className="text-7xl font-black">{Math.round((assessmentAnalysis.score / assessmentAnalysis.total) * 100)}%</span>
                                    </div>
                                    <div className="text-left bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                                        <p className="text-xs font-bold opacity-60">Accuracy</p>
                                        <p className="text-xl font-black">{assessmentAnalysis.score} / {assessmentAnalysis.total}</p>
                                    </div>
                                </div>
                             </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-xl space-y-4">
                                <div className="flex items-center gap-3">
                                    <Zap className="text-amber-500" size={20} />
                                    <h4 className="font-black text-slate-900 uppercase tracking-widest text-sm">{t.technicalProficiencyLabel}</h4>
                                </div>
                                <p className="text-sm font-medium leading-relaxed text-slate-600">{assessmentAnalysis.technicalProficiency}</p>
                            </div>
                            <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-xl space-y-4">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="text-indigo-500" size={20} />
                                    <h4 className="font-black text-slate-900 uppercase tracking-widest text-sm">{t.behavioralInsightLabel}</h4>
                                </div>
                                <p className="text-sm font-medium leading-relaxed text-slate-600">{assessmentAnalysis.behavioralInsight}</p>
                            </div>
                            <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-xl space-y-4">
                                <div className="flex items-center gap-3">
                                    <Target className="text-rose-500" size={20} />
                                    <h4 className="font-black text-slate-900 uppercase tracking-widest text-sm">{t.decisionMakingLabel}</h4>
                                </div>
                                <p className="text-sm font-medium leading-relaxed text-slate-600">{assessmentAnalysis.decisionMakingQuality}</p>
                            </div>
                        </div>

                        <div className="bg-emerald-50 border border-emerald-100 p-10 rounded-5xl">
                            <h4 className="text-lg font-black text-emerald-800 mb-4 flex items-center gap-3">
                                <CheckCircle2 size={24} />
                                {t.finalVerdictLabel}
                            </h4>
                            <p className="text-emerald-900 font-bold leading-relaxed">{assessmentAnalysis.finalConclusion}</p>
                        </div>

                        <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                            <button 
                                onClick={handleStartMindsetInterview}
                                className="w-full md:w-auto px-12 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-4"
                            >
                                {t.startMindsetInterview}
                                <ArrowRight size={20} className={isRtl ? "rotate-180" : ""} />
                            </button>
                            <button 
                                onClick={() => setStep(0)}
                                className="w-full md:w-auto px-12 py-5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-black uppercase tracking-widest transition-all"
                            >
                                {t.restart}
                            </button>
                        </div>
                    </motion.div>
                ) : assessmentQuestions.length > 0 && (
                    /* Active Testing UI */
                    <div className="max-w-4xl mx-auto w-full space-y-12 pb-20">
                        {/* Progress Bar */}
                        <div className="space-y-3">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <span>{assessmentQuestions[currentQuestionIndex].category} Assessment</span>
                                <span>{Math.round(((currentQuestionIndex + 1) / assessmentQuestions.length) * 100)}%</span>
                            </div>
                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-0.5">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((currentQuestionIndex + 1) / assessmentQuestions.length) * 100}%` }}
                                    className="h-full bg-emerald-500 rounded-full"
                                />
                            </div>
                        </div>

                        {/* Question Card */}
                        <motion.div 
                            key={currentQuestionIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-5xl border border-slate-100 shadow-2xl overflow-hidden"
                        >
                            <div className="p-10 md:p-14 space-y-10">
                                <div className="space-y-6">
                                    <span className={cn(
                                        "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                        assessmentQuestions[currentQuestionIndex].category === 'technical' ? "bg-amber-50 text-amber-700 border-amber-100" :
                                        assessmentQuestions[currentQuestionIndex].category === 'soft' ? "bg-indigo-50 text-indigo-700 border-indigo-100" :
                                        "bg-emerald-50 text-emerald-700 border-emerald-100"
                                    )}>
                                        {assessmentQuestions[currentQuestionIndex].category === 'technical' ? t.technicalCat :
                                         assessmentQuestions[currentQuestionIndex].category === 'soft' ? t.softCat : t.scenarioCat}
                                    </span>
                                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                                        {assessmentQuestions[currentQuestionIndex].question}
                                    </h3>
                                </div>

                                <div className="grid gap-4">
                                    {assessmentQuestions[currentQuestionIndex].options.map((option, idx) => {
                                        const isCorrect = idx === assessmentQuestions[currentQuestionIndex].correctIndex;
                                        const isSelected = selectedOption === idx;
                                        
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => handleSelectOption(idx)}
                                                disabled={showCorrection}
                                                className={cn(
                                                    "text-left p-6 rounded-3xl border-2 transition-all flex items-center justify-between group",
                                                    !showCorrection && "border-slate-100 hover:border-emerald-500 hover:bg-emerald-50/30",
                                                    showCorrection && isCorrect && "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-lg shadow-emerald-100 scale-[1.02]",
                                                    showCorrection && isSelected && !isCorrect && "border-rose-300 bg-rose-50 text-rose-900 opacity-80"
                                                )}
                                            >
                                                <div className="flex items-center gap-6">
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-2xl flex items-center justify-center font-black transition-colors",
                                                        !showCorrection && "bg-slate-100 text-slate-500 group-hover:bg-emerald-600 group-hover:text-white",
                                                        showCorrection && isCorrect && "bg-emerald-600 text-white",
                                                        showCorrection && isSelected && !isCorrect && "bg-rose-600 text-white"
                                                    )}>
                                                        {String.fromCharCode(65 + idx)}
                                                    </div>
                                                    <span className="text-lg font-bold">{option}</span>
                                                </div>
                                                {showCorrection && isCorrect && <CheckCircle2 className="text-emerald-600" size={24} />}
                                                {showCorrection && isSelected && !isCorrect && <AlertCircle className="text-rose-600" size={24} />}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Feedback Section */}
                                <AnimatePresence>
                                    {showCorrection && (
                                        <motion.div 
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="pt-10 border-t border-slate-100 space-y-8"
                                        >
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div className="space-y-3">
                                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.explanationLabel}</h4>
                                                    <p className="text-sm font-bold text-slate-700 leading-relaxed">
                                                        {assessmentQuestions[currentQuestionIndex].feedback.explanation}
                                                    </p>
                                                </div>
                                                <div className="space-y-3">
                                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.evidenceLabel}</h4>
                                                    <p className="text-sm font-bold text-indigo-600 leading-relaxed italic">
                                                        {assessmentQuestions[currentQuestionIndex].feedback.evidence}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-700 mb-2">{t.adviceLabel}</h4>
                                                <p className="text-sm font-black text-amber-900 leading-relaxed">
                                                    {assessmentQuestions[currentQuestionIndex].feedback.advice}
                                                </p>
                                            </div>
                                            
                                            <div className="flex justify-end">
                                                <button 
                                                    onClick={handleNextQuestion}
                                                    className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center gap-3"
                                                >
                                                    {currentQuestionIndex < assessmentQuestions.length - 1 ? t.nextQuestion : t.seeResult}
                                                    <ArrowRight size={20} className={isRtl ? "rotate-180" : ""} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                )}
            </motion.div>
        );
    }

    if (step === 6) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-7xl mx-auto p-4 md:p-6 h-[calc(100vh-80px)] flex flex-col"
            >
                <button 
                    onClick={() => setStep(5)}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest transition-all group mb-6"
                >
                    <ArrowLeft size={16} className={cn("group-hover:-translate-x-1 transition-transform", isRtl && "rotate-180 group-hover:translate-x-1")} />
                    {t.back}
                </button>

                {/* Mindset Header */}
                <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-5xl border border-slate-100 shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900">{t.mindsetTitle}</h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.mindsetSub}</p>
                        </div>
                    </div>
                </div>

                {/* Mindset Chat Interface */}
                <div className="flex-1 overflow-hidden bg-white rounded-5xl border border-slate-100 shadow-2xl flex flex-col relative">
                    <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar">
                        {mindsetMessages.map((msg, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn(
                                    "flex items-start gap-4",
                                    msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                                )}
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center font-black text-xs",
                                    msg.role === 'user' ? "bg-slate-900 text-white" : "bg-linear-to-br from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-100"
                                )}>
                                    {msg.role === 'user' ? <User size={18} /> : <Brain size={18} />}
                                </div>
                                <div className={cn(
                                    "max-w-[80%] p-6 rounded-4xl",
                                    msg.role === 'user' 
                                        ? "bg-slate-900 text-white rounded-tr-none" 
                                        : "bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100"
                                )}>
                                    <p className="text-sm md:text-base font-bold leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                </div>
                            </motion.div>
                        ))}
                        {isMindsetInterviewing && (
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white">
                                    <Brain size={18} />
                                </div>
                                <div className="bg-slate-50 p-6 rounded-4xl rounded-tl-none border border-slate-100">
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-100">
                        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center">
                            <input 
                                className="flex-1 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm outline-none focus:border-indigo-600 transition-all font-bold text-slate-700"
                                placeholder={t.mindsetChatPlaceholder}
                                value={mindsetInput}
                                onChange={(e) => setMindsetInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMindsetMessage()}
                                disabled={isMindsetInterviewing}
                            />
                            <div className="flex gap-4">
                                <button 
                                    onClick={handleSendMindsetMessage}
                                    disabled={isMindsetInterviewing || !mindsetInput.trim()}
                                    className="p-5 bg-indigo-600 text-white rounded-3xl hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
                                >
                                    <Send size={24} />
                                </button>
                                {mindsetMessages.filter(m => m.role === 'assistant').length >= 4 && (
                                    <button 
                                        onClick={handleAnalyzeMindset}
                                        className="px-8 py-5 bg-emerald-600 text-white rounded-3xl font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 flex items-center gap-3"
                                    >
                                        {t.viewMindsetAnalysis}
                                        <ArrowRight size={20} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    if (step === 7) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-6xl mx-auto p-6 md:p-12 space-y-12 pb-20"
            >
                <button 
                    onClick={() => setStep(6)}
                    className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-black text-[10px] uppercase tracking-widest transition-all group mb-6"
                >
                    <ArrowLeft size={16} className={cn("group-hover:-translate-x-1 transition-transform", isRtl && "rotate-180 group-hover:translate-x-1")} />
                    {t.back}
                </button>

                {/* Results Header */}
                <div className="bg-slate-900 rounded-6xl p-12 text-white shadow-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-10"><Brain size={250} /></div>
                    <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                        <h2 className="text-4xl font-black">{t.mindsetAnalysisTitle}</h2>
                        <div className="flex flex-wrap justify-center gap-6">
                            <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/10">
                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">{t.mindsetTypeLabel}</p>
                                <span className="text-xl font-black">{mindsetAnalysis?.mindsetType || "Calculating..."}</span>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/10">
                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">{t.satisfactionLabel}</p>
                                <span className="text-xl font-black">{mindsetAnalysis?.satisfactionLevel || "..."}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {isAnalyzingMindset ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-8">
                        <Loader2 className="animate-spin text-indigo-600" size={60} />
                        <p className="text-xl font-black text-slate-900 tracking-widest uppercase animate-pulse">{language === 'ar' ? 'جاري استخراج الملف النفسي المهني...' : 'Extracting Psychological Profile...'}</p>
                    </div>
                ) : mindsetAnalysis && (
                    <div className="space-y-12">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Detailed Profile */}
                            <div className="bg-white rounded-5xl p-10 border border-slate-100 shadow-xl space-y-8">
                                <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
                                        <Target size={24} />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900">{t.psychologicalProfileTitle}</h3>
                                </div>
                                <div className="space-y-6">
                                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">{t.motivationLabel}</h4>
                                        <p className="font-bold text-slate-700 leading-relaxed">{mindsetAnalysis.psychologicalProfile.motivation}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-700 mb-2">{t.ambitionScoreLabel}</h4>
                                            <span className="text-3xl font-black text-amber-900">{mindsetAnalysis.psychologicalProfile.ambitionScore}%</span>
                                        </div>
                                        <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-700 mb-2">{t.loyaltyPatternLabel}</h4>
                                            <span className="text-lg font-black text-indigo-900">{mindsetAnalysis.psychologicalProfile.loyaltyPattern}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recommendations */}
                            <div className="bg-indigo-600 rounded-5xl p-10 text-white shadow-xl space-y-8 flex flex-col justify-between">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white">
                                            <Zap size={24} />
                                        </div>
                                        <h3 className="text-xl font-black">{t.futureDirectionLabel}</h3>
                                    </div>
                                    <div className="p-8 bg-white/10 rounded-4xl border border-white/10 backdrop-blur-md">
                                        <span className="text-4xl font-black block mb-4">{mindsetAnalysis.futureDirection}</span>
                                        <p className="font-bold opacity-80 leading-relaxed">{mindsetAnalysis.recommendation}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <button 
                                        onClick={handleGenerateGrandReport}
                                        className="w-full py-6 bg-emerald-500 text-white rounded-3xl font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-2xl flex items-center justify-center gap-3 animate-pulse"
                                    >
                                        <Trophy size={24} />
                                        {t.generateGrandReportBtn}
                                    </button>
                                    <button 
                                        onClick={() => setStep(0)}
                                        className="w-full py-4 bg-white/10 text-white rounded-3xl font-black uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10"
                                    >
                                        {t.restart}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Stress Handling specialized section */}
                        <div className="bg-slate-50 border border-slate-100 p-10 rounded-5xl flex items-center gap-8">
                            <div className="w-20 h-20 shrink-0 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-slate-100">
                                <ShieldCheck size={32} className="text-emerald-500" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">{t.stressHandlingLabel}</h4>
                                <p className="text-lg font-bold text-slate-700">{mindsetAnalysis.psychologicalProfile.stressHandling}</p>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        );
    }

    if (step === 8) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-6xl mx-auto p-6 md:p-12 space-y-12 pb-32"
            >
                <button 
                    onClick={() => setStep(7)}
                    className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-black text-[10px] uppercase tracking-widest transition-all group mb-6"
                >
                    <ArrowLeft size={16} className={cn("group-hover:-translate-x-1 transition-transform", isRtl && "rotate-180 group-hover:translate-x-1")} />
                    {t.back}
                </button>

                {/* Grand Header */}
                <div className="bg-slate-900 rounded-6xl p-16 text-white shadow-3xl relative overflow-hidden text-center">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute top-0 right-0 p-12"><Trophy size={300} /></div>
                    </div>
                    
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative z-10 space-y-8"
                    >
                        <div className="w-24 h-24 bg-linear-to-br from-amber-400 to-amber-600 rounded-4xl flex items-center justify-center text-white mx-auto shadow-2xl shadow-amber-500/20">
                            <Trophy size={48} />
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-6xl font-black tracking-tight">{t.grandReportTitle}</h1>
                            <p className="text-xl text-indigo-200 font-medium tracking-wide uppercase">{t.grandReportSub}</p>
                        </div>
                        
                        <div className="flex flex-wrap justify-center gap-8 pt-8">
                             <div className="bg-white/10 backdrop-blur-xl px-10 py-6 rounded-4xl border border-white/20">
                                <p className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-2">{t.maturityScoreLabel}</p>
                                <span className="text-6xl font-black">{grandFinalReport?.professionalIdentity.maturityScore || "0"}%</span>
                             </div>
                             <div className="bg-white/10 backdrop-blur-xl px-10 py-6 rounded-4xl border border-white/20 flex flex-col justify-center">
                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-2">{t.psychologyLabel}</p>
                                <span className="text-2xl font-black">{grandFinalReport?.professionalIdentity.psychologicalFootprint || "..."}</span>
                             </div>
                        </div>
                    </motion.div>
                </div>

                {isGeneratingGrandReport ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-10">
                        <div className="relative">
                            <div className="w-32 h-32 border-8 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Brain size={48} className="text-indigo-600 animate-pulse" />
                            </div>
                        </div>
                        <div className="text-center space-y-4">
                            <h3 className="text-3xl font-black text-slate-900">{language === 'ar' ? 'جاري دمج كافة البيانات الاستراتيجية...' : 'Synthesizing all strategic data...'}</h3>
                            <p className="text-slate-500 text-lg font-medium">{language === 'ar' ? 'الخبير يحلل الرواية، الأداء، والعقلية لاستخراج الخلاصة النهائية...' : 'Analyzing narrative, performance, and mindset for the ultimate verdict...'}</p>
                        </div>
                    </div>
                ) : grandFinalReport && (
                    <div className="grid grid-cols-1 gap-12">
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-amber-50 border-2 border-amber-200 p-12 rounded-7xl text-center"
                        >
                            <h3 className="text-4xl font-black text-amber-900 mb-6 italic">&quot;{grandFinalReport.professionalIdentity.verdict}&quot;</h3>
                            <div className="w-20 h-1 bg-amber-300 mx-auto rounded-full" />
                        </motion.div>

                        <div className="grid lg:grid-cols-2 gap-12">
                             <div className="bg-white rounded-6xl p-12 border border-slate-100 shadow-2xl space-y-10">
                                <div className="flex items-center gap-6 border-b border-slate-50 pb-8">
                                    <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 shadow-lg shadow-blue-50">
                                        <BarChart3 size={32} />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900">{t.skillRadarTitle}</h3>
                                </div>
                                
                                <div className="space-y-8">
                                    {grandFinalReport.competencyMatrix.skillRadar.map((skill, idx) => (
                                        <div key={idx} className="space-y-3">
                                            <div className="flex justify-between font-black uppercase tracking-widest text-xs text-slate-500">
                                                <span>{skill.name}</span>
                                                <span className="text-slate-900">{skill.score}%</span>
                                            </div>
                                            <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-1">
                                                <div 
                                                    style={{ width: `${skill.score}%` }}
                                                    className="h-full bg-linear-to-r from-blue-500 to-indigo-600 rounded-full"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-8 bg-indigo-50/50 rounded-4xl border border-indigo-100 mt-10">
                                    <h4 className="text-sm font-black uppercase text-indigo-900 mb-3">{t.gapAnalysisTitle}</h4>
                                    <p className="text-indigo-800 font-bold leading-relaxed">{grandFinalReport.competencyMatrix.gapAnalysis}</p>
                                </div>
                             </div>

                             <div className="space-y-12">
                                <div className="bg-slate-900 rounded-6xl p-12 text-white shadow-2xl relative overflow-hidden h-full flex flex-col justify-center">
                                    <div className="absolute bottom-0 right-0 p-10 opacity-10"><Target size={150} /></div>
                                    <h3 className="text-2xl font-black text-indigo-300 mb-8 flex items-center gap-4">
                                        <Target size={32} />
                                        {t.marketValuesTitle}
                                    </h3>
                                    <div className="space-y-8 relative z-10">
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Job Alignment</p>
                                            <div className="flex items-baseline gap-4">
                                                <span className="text-6xl font-black">{grandFinalReport.marketPositioning.jobAlignmentScore}%</span>
                                                <span className="text-indigo-400 font-black">Match</span>
                                            </div>
                                        </div>
                                        <div className="bg-white/5 p-8 rounded-4xl border border-white/10">
                                            <p className="font-bold opacity-90 leading-relaxed text-lg">{grandFinalReport.marketPositioning.marketValueVerdict}</p>
                                        </div>
                                    </div>
                                </div>
                             </div>
                        </div>

                        <div className="bg-white rounded-6xl p-12 border border-slate-100 shadow-2xl overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 z-0 rounded-l-[100px]" />
                            <div className="relative z-10 grid lg:grid-cols-2 gap-16">
                                <div className="space-y-10">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 shadow-xl shadow-emerald-50">
                                            <TrendingUp size={32} />
                                        </div>
                                        <h3 className="text-3xl font-black text-slate-900">{t.roadmapTitle}</h3>
                                    </div>
                                    
                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <h4 className="flex items-center gap-3 text-emerald-700 font-black uppercase tracking-widest text-xs">
                                                <Zap size={18} />
                                                {t.shortTermLabel}
                                            </h4>
                                            <ul className="space-y-3">
                                                {grandFinalReport.actionableRoadmap.shortTerm.map((item, i) => (
                                                    <li key={i} className="flex items-center gap-4 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">
                                                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                                        <span className="font-bold text-emerald-900">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="flex items-center gap-3 text-indigo-700 font-black uppercase tracking-widest text-xs">
                                                <Target size={18} />
                                                {t.mediumTermLabel}
                                            </h4>
                                            <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 font-black text-indigo-900 text-2xl">
                                                {grandFinalReport.actionableRoadmap.mediumTerm}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-900 rounded-5xl p-12 text-white flex flex-col justify-center space-y-8">
                                    <h4 className="text-amber-400 font-black uppercase tracking-[0.2em] text-[10px]">{t.longTermLabel}</h4>
                                    <p className="text-3xl font-black italic leading-tight">&quot;{grandFinalReport.actionableRoadmap.longTermVision}&quot;</p>
                                    <div className="pt-8 border-t border-white/10">
                                        <button 
                                            onClick={() => window.print()} 
                                            className="w-full py-5 bg-white text-slate-900 rounded-3xl font-black uppercase tracking-widest hover:bg-slate-300 transition-all shadow-2xl"
                                        >
                                            {language === 'ar' ? 'تحميل التقرير الكامل PDF' : 'Download Complete PDF Report'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-linear-to-br from-indigo-600 to-indigo-800 rounded-7xl p-16 text-white shadow-3xl text-center space-y-10 relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-20 opacity-10 rotate-12"><Zap size={400} /></div>
                             <div className="relative z-10 max-w-4xl mx-auto space-y-10">
                                <div className="w-20 h-20 bg-white/20 rounded-4xl flex items-center justify-center text-white mx-auto backdrop-blur-md">
                                    <Star size={40} className="fill-white" />
                                </div>
                                <h3 className="text-4xl font-black tracking-tight">{t.expertSynthesisTitle}</h3>
                                <p className="text-2xl font-bold leading-relaxed opacity-95">{grandFinalReport.expertSynthesis}</p>
                                <div className="pt-10 flex flex-col md:flex-row justify-center gap-6">
                                    <button 
                                        onClick={handleStartSimulation}
                                        className="px-16 py-6 bg-emerald-500 text-white rounded-3xl font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-2xl flex items-center justify-center gap-3 group"
                                    >
                                        <Rocket size={24} className="group-hover:animate-bounce" />
                                        {language === 'ar' ? 'استكشاف المسارات الاستراتيجية' : language === 'fr' ? 'Explorer les pistes stratégiques' : 'Explore Strategic Paths'}
                                    </button>
                                    <button 
                                        onClick={() => setStep(0)}
                                        className="px-16 py-6 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-widest hover:bg-white hover:text-indigo-600 transition-all shadow-2xl"
                                    >
                                        {t.restart}
                                    </button>
                                </div>
                             </div>
                        </div>
                    </div>
                )}
            </motion.div>
        );
    }

    if (step === 9) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-7xl mx-auto p-4 md:p-6 h-[calc(100vh-80px)] flex flex-col"
            >
                <button 
                    onClick={() => setStep(8)}
                    className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-black text-[10px] uppercase tracking-widest transition-all group mb-6"
                >
                    <ArrowLeft size={16} className={cn("group-hover:-translate-x-1 transition-transform", isRtl && "rotate-180 group-hover:translate-x-1")} />
                    {t.back}
                </button>

                {/* Simulation Header */}
                <div className="flex items-center justify-between mb-8 bg-slate-900 p-8 rounded-5xl border border-slate-800 shadow-2xl">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-linear-to-br from-indigo-500 to-violet-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
                            <Target size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white">{t.simulationTitle}</h2>
                            <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest opacity-70">{t.simulationSub}</p>
                        </div>
                    </div>
                </div>

                {/* Simulation Interface */}
                <div className="flex-1 bg-white rounded-6xl border border-slate-100 shadow-3xl overflow-hidden flex flex-col relative">
                    <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8 custom-scrollbar bg-slate-50/30">
                        {simulationMessages.map((msg, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn(
                                    "flex w-full max-w-[85%] md:max-w-[70%] gap-6",
                                    msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                                )}
                            >
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                                    msg.role === 'user' ? "bg-slate-900 text-white" : "bg-indigo-600 text-white"
                                )}>
                                    {msg.role === 'user' ? <User size={20} /> : <Brain size={24} />}
                                </div>
                                <div className={cn(
                                    "p-7 rounded-4xl text-sm md:text-base leading-relaxed font-bold shadow-sm",
                                    msg.role === 'user' 
                                        ? "bg-slate-900 text-white rounded-tr-none" 
                                        : "bg-white text-slate-800 rounded-tl-none border border-slate-100 italic"
                                )}>
                                    {msg.content}
                                </div>
                            </motion.div>
                        ))}
                        {isSimulating && (
                            <div className="flex gap-4 items-center animate-pulse text-indigo-400">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center"><Loader2 size={16} className="animate-spin" /></div>
                                <span className="text-[10px] font-black uppercase tracking-widest">{t.aiThinking}</span>
                            </div>
                        )}
                        <div className="pt-8">
                            <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex items-start gap-4">
                                <AlertCircle size={20} className="text-amber-500 shrink-0 mt-1" />
                                <p className="text-xs font-bold text-amber-800 leading-relaxed italic">{t.simulationNote}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-white border-t border-slate-100">
                        {isSimulationComplete ? (
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-6">
                                <div className="flex items-center gap-3 text-emerald-600 font-black uppercase tracking-[.3em] text-xs">
                                    <CheckCircle2 size={18} />
                                    STRATEGY CLEAR
                                </div>
                                <button 
                                    onClick={handleGeneratePaths}
                                    disabled={isGeneratingPaths}
                                    className="w-full max-w-2xl py-6 bg-slate-900 text-white rounded-4xl font-black uppercase tracking-[.2em] hover:bg-emerald-600 transition-all shadow-3xl flex items-center justify-center gap-4 disabled:opacity-50"
                                >
                                    {isGeneratingPaths ? <Loader2 size={24} className="animate-spin" /> : (
                                        <>
                                            {t.finalizePaths}
                                            <Rocket size={24} />
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        ) : (
                            <div className="max-w-4xl mx-auto flex items-center gap-4 bg-slate-50 p-2 pl-8 rounded-4xl border border-slate-200">
                                <input 
                                    className="flex-1 bg-transparent py-4 text-sm font-bold text-slate-700 outline-none"
                                    placeholder={t.simulationPlaceholder}
                                    value={simulationInput}
                                    onChange={(e) => setSimulationInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendSimulationMessage()}
                                    disabled={isSimulating}
                                />
                                <button 
                                    onClick={handleSendSimulationMessage}
                                    disabled={!simulationInput.trim() || isSimulating}
                                    className="w-14 h-14 bg-indigo-600 text-white rounded-3xl flex items-center justify-center hover:bg-slate-900 transition-all shadow-xl disabled:opacity-50"
                                >
                                    <Send size={24} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    }

    if (step === 11) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-7xl mx-auto p-4 md:p-6 h-[calc(100vh-80px)] flex flex-col"
            >
                <div className="flex items-center justify-between mb-8 bg-indigo-900 p-8 rounded-5xl border border-indigo-800 shadow-2xl">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-indigo-900 shadow-xl">
                            <Zap size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white">{language === 'ar' ? 'مقابلة تعميق المسار' : 'Path Deep-Dive Interview'}</h2>
                            <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest opacity-70">{selectedPath?.title}</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 bg-white rounded-6xl border border-slate-100 shadow-3xl overflow-hidden flex flex-col relative">
                    <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8 custom-scrollbar bg-slate-50/30">
                        {pathInterviewMessages.map((msg, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={cn(
                                    "flex w-full max-w-[85%] md:max-w-[70%] gap-6",
                                    msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                                )}
                            >
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                                    msg.role === 'user' ? "bg-slate-900 text-white" : "bg-emerald-600 text-white"
                                )}>
                                    {msg.role === 'user' ? <User size={20} /> : <Target size={24} />}
                                </div>
                                <div className={cn(
                                    "p-7 rounded-4xl text-sm md:text-base leading-relaxed font-bold shadow-sm",
                                    msg.role === 'user' 
                                        ? "bg-slate-900 text-white rounded-tr-none" 
                                        : "bg-emerald-50 text-emerald-900 rounded-tl-none border border-emerald-100 italic"
                                )}>
                                    {msg.content}
                                </div>
                            </motion.div>
                        ))}
                        {isPathSimulating && (
                            <div className="flex gap-4 items-center animate-pulse text-emerald-500 p-8">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center"><Loader2 size={16} className="animate-spin" /></div>
                                <span className="text-[10px] font-black uppercase tracking-widest">
                                    {language === 'ar' ? 'الخبير يحلل الاستراتيجية...' : 'Expert Analyzing Strategy...'}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="p-8 bg-white border-t border-slate-100">
                        {isPathSimulationComplete || pathInterviewMessages.length >= 3 ? (
                            <div className="flex flex-col gap-4">
                                <button 
                                    onClick={handleGenerateBlueprint}
                                    disabled={isGeneratingBlueprint}
                                    className="w-full py-6 bg-emerald-500 text-white rounded-4xl font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-3xl flex items-center justify-center gap-4"
                                >
                                    {isGeneratingBlueprint ? <Loader2 size={24} className="animate-spin" /> : (
                                        <>
                                            {language === 'ar' ? 'توليد خطة التنفيذ النهائية' : 'Generate Implementation Blueprint'}
                                            <Sparkles size={24} />
                                        </>
                                    )}
                                </button>
                                {!isPathSimulationComplete && (
                                     <div className="max-w-4xl mx-auto w-full flex items-center gap-4 bg-slate-50 p-2 pl-8 rounded-4xl border border-slate-200">
                                        <input 
                                            className="flex-1 bg-transparent py-4 text-sm font-bold text-slate-700 outline-none"
                                            placeholder={language === 'ar' ? 'رد على الخبير الاستراتيجي...' : 'Respond to strategic expert...'}
                                            value={pathSimulationInput}
                                            onChange={(e) => setPathSimulationInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSendPathMessage()}
                                            disabled={isPathSimulating}
                                        />
                                        <button 
                                            onClick={handleSendPathMessage}
                                            disabled={!pathSimulationInput.trim() || isPathSimulating}
                                            className="w-14 h-14 bg-emerald-600 text-white rounded-3xl flex items-center justify-center hover:bg-slate-900 transition-all shadow-xl disabled:opacity-50"
                                        >
                                            <Send size={24} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="max-w-4xl mx-auto flex items-center gap-4 bg-slate-50 p-2 pl-8 rounded-4xl border border-slate-200">
                                <input 
                                    className="flex-1 bg-transparent py-4 text-sm font-bold text-slate-700 outline-none"
                                    placeholder={language === 'ar' ? 'رد على الخبير الاستراتيجي...' : 'Respond to strategic expert...'}
                                    value={pathSimulationInput}
                                    onChange={(e) => setPathSimulationInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendPathMessage()}
                                    disabled={isPathSimulating}
                                />
                                <button 
                                    onClick={handleSendPathMessage}
                                    disabled={!pathSimulationInput.trim() || isPathSimulating}
                                    className="w-14 h-14 bg-emerald-600 text-white rounded-3xl flex items-center justify-center hover:bg-slate-900 transition-all"
                                >
                                    <Send size={24} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    }

    if (step === 12) {
        if (!implementationBlueprint || isGeneratingBlueprint) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 space-y-12">
                    <div className="relative">
                        <div className="w-32 h-32 border-8 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="text-emerald-500 animate-pulse" size={32} />
                        </div>
                    </div>
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-black text-white">
                            {language === 'ar' ? 'جاري صياغة وثيقة التنفيذ الاستراتيجية...' : 'Crafting Strategic Implementation Blueprint...'}
                        </h2>
                        <p className="text-emerald-400 font-bold uppercase tracking-[.3em] animate-pulse">
                            {language === 'ar' ? 'تحليل مساراتك المهنية بدقة' : 'Precision path mapping in progress'}
                        </p>
                    </div>
                </div>
            );
        }

        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-6xl mx-auto p-6 md:p-12 space-y-12 pb-32"
            >
                {/* Implementation Blueprint Header */}
                <div className="bg-slate-900 rounded-6xl p-16 text-white shadow-3xl text-center space-y-8 relative overflow-hidden border-b-8 border-emerald-500">
                    <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12"><Zap size={200} /></div>
                    <div className="relative z-10 space-y-4">
                        <div className="px-6 py-2 bg-emerald-500/20 rounded-full text-emerald-400 font-black text-xs inline-block mb-4 border border-emerald-500/30">
                            OFFICIAL STRATEGY DOCUMENT
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black">{language === 'ar' ? 'خطة التنفيذ والتموضع' : 'Implementation Blueprint'}</h1>
                        <p className="text-indigo-200 text-lg uppercase tracking-widest font-bold">{selectedPath?.title}</p>
                    </div>
                </div>

                {/* Blueprint Sections */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Tactical Plan */}
                    <div className="bg-white rounded-5xl p-10 border border-slate-100 shadow-xl space-y-8">
                        <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center"><Calendar size={24} /></div>
                            <h3 className="text-2xl font-black">Tactical Wins (90 Days)</h3>
                        </div>
                        <div className="space-y-6">
                            {implementationBlueprint.tacticalWins.map((win: { title: string; action: string }, idx: number) => (
                                <div key={idx} className="flex gap-4 p-4 bg-slate-50 rounded-3xl border border-slate-100 hover:border-emerald-200 transition-all">
                                    <div className="text-emerald-500 font-black pt-1">0{idx + 1}</div>
                                    <div>
                                        <h4 className="font-black text-slate-900">{win.title}</h4>
                                        <p className="text-sm text-slate-500 font-medium">{win.action}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Role Archetypes */}
                    <div className="bg-white rounded-5xl p-10 border border-slate-100 shadow-xl space-y-8">
                        <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center"><Briefcase size={24} /></div>
                            <h3 className="text-2xl font-black">Suggested Roles</h3>
                        </div>
                        <div className="space-y-4">
                            {implementationBlueprint.suggestedRoles.map((role: { title: string; matchingWhy: string }, idx: number) => (
                                <div key={idx} className="p-6 bg-slate-900 text-white rounded-3xl space-y-2 group hover:bg-indigo-600 transition-all cursor-default">
                                    <h4 className="text-lg font-black">{role.title}</h4>
                                    <p className="text-xs text-indigo-200 font-bold opacity-80">{role.matchingWhy}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Gap Bridge Section */}
                <div className="bg-white rounded-6xl p-12 border-2 border-slate-100 shadow-2xl relative">
                    <div className="absolute top-0 right-12 -translate-y-1/2 px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs tracking-widest uppercase shadow-2xl">
                        Critical Gap Bridge
                    </div>
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="space-y-6">
                            <h4 className="text-sm font-black text-slate-400 uppercase tracking-[.3em]">Targeted Skills</h4>
                            <div className="space-y-3">
                                {implementationBlueprint.gapBridge.skills.map((s: string, i: number) => <div key={i} className="px-4 py-3 bg-slate-50 rounded-2xl font-bold text-slate-700 text-sm border border-slate-100">{s}</div>)}
                            </div>
                        </div>
                        <div className="md:col-span-2 space-y-6">
                             <h4 className="text-sm font-black text-slate-400 uppercase tracking-[.3em]">Executive Summary</h4>
                             <p className="text-2xl font-bold text-slate-800 leading-relaxed italic">&quot;{implementationBlueprint.gapBridge.summary}&quot;</p>
                             <div className="pt-6 border-t border-slate-50 flex flex-col md:flex-row items-center gap-6">
                                <div className="flex-1 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                                    <h5 className="text-[10px] font-black uppercase text-amber-600 mb-1">Risk Warning</h5>
                                    <p className="text-xs font-bold text-amber-900">{implementationBlueprint.gapBridge.riskWarning}</p>
                                </div>
                                <div className="flex-1 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                    <h5 className="text-[10px] font-black uppercase text-emerald-600 mb-1">Golden Advice</h5>
                                    <p className="text-xs font-bold text-emerald-900">{implementationBlueprint.gapBridge.goldenAdvice}</p>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-12">
                    <button 
                        onClick={() => window.print()}
                        className="px-12 py-5 bg-white text-slate-900 border-2 border-slate-900 rounded-3xl font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-4"
                    >
                        <Download size={20} />
                        {language === 'ar' ? 'تحميل خطة الطريق' : 'Download Strategy'}
                    </button>
                    
                    <button 
                        onClick={handleGenerateMasterReport}
                        className="px-20 py-6 bg-emerald-600 text-white rounded-3xl font-black uppercase tracking-[.2em] shadow-2xl shadow-emerald-500/30 hover:bg-slate-900 hover:scale-105 transition-all flex items-center gap-4 group"
                    >
                        {language === 'ar' ? 'إنهاء التشخيص الشامل' : 'Finalize Global Diagnosis'}
                        <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            </motion.div>
        );
    }

    if (step === 13) {
        if (!finalMasterReport || isGeneratingMasterReport) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-6">
                    {masterReportError ? (
                        <div className="max-w-md w-full bg-white/5 backdrop-blur-3xl rounded-[3rem] p-12 border border-white/10 text-center space-y-8">
                            <div className="w-20 h-20 bg-rose-500/20 text-rose-500 rounded-3xl flex items-center justify-center mx-auto">
                                <AlertCircle size={40} />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-xl font-black text-white">
                                    {language === 'ar' ? 'فشل إنشاء التقرير' : 'Generation Failed'}
                                </h3>
                                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                                    {masterReportError}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => setStep(12)}
                                    className="py-4 bg-white/5 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                                >
                                    {t.back}
                                </button>
                                <button 
                                    onClick={handleGenerateMasterReport}
                                    className="py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20"
                                >
                                    {language === 'ar' ? 'إعادة المحاولة' : 'Retry'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-12 flex flex-col items-center">
                            <div className="relative">
                                <div className="w-40 h-40 border-8 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Brain className="text-indigo-400 animate-pulse" size={48} />
                                </div>
                            </div>
                            <div className="text-center space-y-6">
                                <h2 className="text-4xl font-black text-white">
                                    {language === 'ar' ? 'جاري إنشاء النسخة النهائية من التقرير الشامل...' : 'Generating Final Global Diagnostic Synthesis...'}
                                </h2>
                                <p className="text-indigo-400 font-bold uppercase tracking-[.4em] animate-pulse">
                                    DeepSeek AI is synthesizing all diagnostic data
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-6xl mx-auto p-6 md:p-12 space-y-12 pb-40"
            >
                {/* Appreciation & Victory Header */}
                <div className="bg-linear-to-br from-indigo-900 via-slate-950 to-emerald-950 rounded-6xl p-20 text-white shadow-3xl text-center space-y-8 relative overflow-hidden border border-white/5">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
                    
                    <div className="relative z-10 space-y-6">
                        <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl mb-8 animate-bounce">
                            <ShieldCheck size={48} />
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
                            {language === 'ar' ? 'تم اكتمال التشخيص بنجاح' : 'Diagnostic Fully Complete'}
                        </h1>
                        <p className="text-indigo-200 text-xl font-medium max-w-3xl mx-auto leading-relaxed">
                            {language === 'ar' 
                                ? 'لقد انتهيت من الرحلة الكاملة لتقييم قدراتك المهنية. إليك الآن التقرير الاستراتيجي الشامل الذي يجمع كل التحليلات في وثيقة واحدة.'
                                : 'You have successfully navigated the full professional evaluation journey. Here is your global strategic synthesis combining all insights.'}
                        </p>


                    </div>
                </div>

                {/* Score & Verdict Card */}
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white rounded-5xl p-10 border border-slate-100 shadow-xl flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="relative">
                             <svg className="w-32 h-32 transform -rotate-90">
                                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={364} strokeDashoffset={364 - (364 * finalMasterReport.holisticScore) / 100} className="text-emerald-500 transition-all duration-1000" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-3xl font-black text-slate-900">
                                {finalMasterReport.holisticScore}%
                            </div>
                        </div>
                        <h3 className="font-black text-slate-500 uppercase tracking-widest text-[10px]">Strategic Readiness Index</h3>
                    </div>

                    <div className="md:col-span-2 bg-slate-900 text-white rounded-5xl p-12 shadow-2xl space-y-6 border-l-8 border-indigo-500">
                         <h3 className="text-2xl font-black text-indigo-400">{language === 'ar' ? 'ملخص الإدارة التنفيذية' : 'Executive Master Summary'}</h3>
                         <p className="text-xl font-bold leading-relaxed opacity-90 italic">
                            &quot;{finalMasterReport.executiveSummary}&quot;
                         </p>
                    </div>
                </div>

                {/* Pillar Analysis */}
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { title: 'Technical Axis', content: finalMasterReport.pillarAnalysis.technical, icon: <Database />, color: 'emerald' },
                        { title: 'Strategic Axis', content: finalMasterReport.pillarAnalysis.strategic, icon: <Target />, color: 'indigo' },
                        { title: 'Mental Axis', content: finalMasterReport.pillarAnalysis.psychological, icon: <Brain />, color: 'rose' }
                    ].map((pillar, i) => (
                        <div key={i} className="bg-white rounded-4xl p-8 border border-slate-100 shadow-lg space-y-5 group hover:border-indigo-200 transition-all">
                             <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl", 
                                pillar.color === 'emerald' ? "bg-emerald-500" : pillar.color === 'indigo' ? "bg-indigo-600" : "bg-rose-500"
                             )}>
                                {pillar.icon}
                             </div>
                             <h4 className="text-lg font-black text-slate-900">{pillar.title}</h4>
                             <p className="text-sm font-medium text-slate-500 leading-relaxed">{pillar.content}</p>
                        </div>
                    ))}
                </div>

                {/* Market Verdict & Premium Teaser */}
                <div className="bg-slate-50 rounded-6xl p-12 border border-slate-200 space-y-12">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-black flex items-center gap-3">
                             <Trophy className="text-amber-500" size={28} />
                             {language === 'ar' ? 'حكم السوق وقيمتك التنافسية' : 'Market Verdict & Value'}
                        </h3>
                        <p className="text-lg font-bold text-slate-700 leading-relaxed">{finalMasterReport.marketabilityVerdict}</p>
                    </div>

                    <div className="bg-indigo-600 rounded-4xl p-10 text-white shadow-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform"><Rocket size={120} /></div>
                        <div className="relative z-10 space-y-6">
                             <div className="px-4 py-2 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest inline-block">PRO MODULE INTERFACE UNLOCKED</div>
                             <h4 className="text-3xl font-black">{language === 'ar' ? 'ماذا بعد؟ التحول إلى الاحترافية القائمة على البيانات' : 'What\'s Next? Data-Driven Professional Growth'}</h4>
                             <p className="text-indigo-100 font-bold text-lg max-w-2xl leading-relaxed">
                                {finalMasterReport.premiumOpportunity}
                             </p>
                             <div className="pt-6 grid md:grid-cols-3 gap-4">
                                <div className="p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md opacity-50 grayscale">
                                    <h5 className="font-black text-xs mb-2">PRO Simulation Studio</h5>
                                    <p className="text-[10px] uppercase font-bold opacity-60 italic">
                                        {language === 'ar' ? 'محاكاة مقابلات عمل شخصية بناءً على ثغراتك المهنية' : 'Personalized Job interview simulations based on your gaps.'}
                                    </p>
                                </div>
                                <div className="p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md opacity-50 grayscale">
                                    <h5 className="font-black text-xs mb-2">Personalized Roadmap 2.0</h5>
                                    <p className="text-[10px] uppercase font-bold opacity-60 italic">
                                        {language === 'ar' ? 'خارطة طريق ديناميكية تتحدث آلياً مع تطور مهاراتك' : 'A dynamic AI roadmap that updates as you learn skills.'}
                                    </p>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="text-center space-y-12">
                     <p className="text-3xl font-black text-slate-400 opacity-30 italic max-w-3xl mx-auto">&quot;{finalMasterReport.finalCallToAction}&quot;</p>
                     
                     <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                        <button 
                            onClick={() => window.location.href = '/dashboard'}
                            className="px-20 py-6 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-3xl flex items-center gap-4"
                        >
                            Return to Dashboard
                        </button>
                        <button 
                            onClick={() => window.print()}
                            className="px-16 py-5 bg-white text-slate-900 border-2 border-slate-900 rounded-3xl font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-4 shadow-xl"
                        >
                            <Download size={20} />
                            Save Master Report
                        </button>
                     </div>
                </div>
            </motion.div>
        );
    }

    if (step === 10 && strategicPaths) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-6xl mx-auto p-6 md:p-12 space-y-12 pb-32"
            >
                <button 
                    onClick={() => setStep(9)}
                    className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-black text-[10px] uppercase tracking-widest transition-all group mb-6"
                >
                    <ArrowLeft size={16} className={cn("group-hover:-translate-x-1 transition-transform", isRtl && "rotate-180 group-hover:translate-x-1")} />
                    {t.back}
                </button>

                {/* Header */}
                <div className="bg-slate-900 rounded-6xl p-16 text-white shadow-3xl text-center space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-10"><Rocket size={200} /></div>
                    <div className="relative z-10 space-y-4">
                        <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center text-white mx-auto shadow-2xl">
                            <Rocket size={40} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black">{language === 'ar' ? 'المسارات الاستراتيجية المستقبلية' : language === 'fr' ? 'Pistes Stratégiques Futures' : 'Future Strategic Paths'}</h1>
                        <p className="text-indigo-200 text-lg uppercase tracking-widest font-bold">
                            {language === 'ar' ? 'تحليل الفرص بناءً على ملفك الكامل' : language === 'fr' ? 'Analyse des opportunités selon votre profil complet' : 'Opportunity analysis based on your full profile'}
                        </p>
                    </div>
                </div>

                {isGeneratingPaths ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-10">
                        <div className="w-24 h-24 border-8 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                        <h3 className="text-2xl font-black text-slate-900">
                            {language === 'ar' ? 'جاري محاكاة السيناريوهات الاستراتيجية...' : language === 'fr' ? 'Simulation des scénarios stratégiques...' : 'Simulating strategic scenarios...'}
                        </h3>
                    </div>
                ) : strategicPaths && (
                    <div className="space-y-12">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {strategicPaths.paths.map((path, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white rounded-5xl p-8 border border-slate-100 shadow-xl flex flex-col justify-between group hover:border-indigo-200 transition-all"
                                >
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                <Target size={28} />
                                            </div>
                                            <div className="px-4 py-2 bg-indigo-50 rounded-full text-indigo-700 font-black text-xs">
                                                {path.matchPercentage}% Match
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-black text-slate-900 leading-tight">{path.title}</h3>
                                            <p className="text-slate-500 font-medium text-sm leading-relaxed">{path.description}</p>
                                        </div>
                                        
                                        <div className="pt-6 border-t border-slate-50 space-y-4">
                                            <div className="space-y-2">
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{language === 'ar' ? 'الإيجابيات' : 'Pros'}</h4>
                                                <ul className="space-y-1">
                                                    {path.pros.map((p, i) => <li key={i} className="text-xs font-bold text-slate-700 flex items-center gap-2">
                                                        <CheckCircle2 size={12} className="text-emerald-500" /> {p}
                                                    </li>)}
                                                </ul>
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-600">{language === 'ar' ? 'المخاطر' : 'Risks'}</h4>
                                                <ul className="space-y-1">
                                                    {path.risks.map((r, i) => <li key={i} className="text-xs font-bold text-slate-700 flex items-center gap-2">
                                                        <AlertCircle size={12} className="text-rose-500" /> {r}
                                                    </li>)}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-slate-50 flex flex-col gap-4">
                                        <p className="text-xs italic text-slate-400 font-medium">&quot;{path.rationale}&quot;</p>
                                        <button 
                                            onClick={() => handleSelectPath(path)}
                                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl group/btn flex items-center justify-center gap-2"
                                        >
                                            {language === 'ar' ? 'اختيار هذا المسار والتحدي' : 'Select & Challenge'}
                                            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="bg-indigo-600 rounded-6xl p-12 text-white shadow-3xl text-center space-y-8">
                             <h3 className="text-3xl font-black">{language === 'ar' ? 'التوصية النهائية للخبير' : language === 'fr' ? 'Recommandation finale de l\'expert' : 'Final Expert Recommendation'}</h3>
                             <p className="text-2xl font-bold leading-relaxed opacity-90 italic max-w-4xl mx-auto">
                                &quot;{strategicPaths.finalRecommendation}&quot;
                             </p>
                             <div className="pt-8">
                                <button 
                                    onClick={() => setStep(0)}
                                    className="px-16 py-6 bg-white text-indigo-600 rounded-3xl font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-2xl"
                                >
                                    {t.restart}
                                </button>
                             </div>
                        </div>
                    </div>
                )}
            </motion.div>
        );
    }

    return (
        <div className="min-h-screen p-6 md:p-12 max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
                {step === 0 ? (
                    <motion.div 
                        key="step0"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white rounded-6xl border border-slate-100 shadow-2xl p-12 text-center space-y-8"
                    >
                        <div className="w-24 h-24 bg-indigo-600 rounded-4xl flex items-center justify-center text-white mx-auto shadow-2xl shadow-indigo-200">
                            <ShieldCheck size={48} />
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                                {t.welcomeTitle}
                            </h1>
                            <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
                                {t.welcomeSub}
                            </p>
                        </div>
                        <button 
                            onClick={() => setStep(1)}
                            className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all flex items-center gap-4 mx-auto group shadow-xl"
                        >
                            {t.startBtn}
                            <ArrowRight size={20} className={cn("group-hover:translate-x-1 transition-transform", isRtl && "rotate-180 group-hover:-translate-x-1")} />
                        </button>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="grid lg:grid-cols-12 gap-12"
                    >
                        <div className="lg:col-span-12 mb-4">
                            <button 
                                onClick={() => setStep(0)}
                                className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-black text-[10px] uppercase tracking-widest transition-all group"
                            >
                                <ArrowLeft size={16} className={cn("group-hover:-translate-x-1 transition-transform", isRtl && "rotate-180 group-hover:translate-x-1")} />
                                {t.back}
                            </button>
                        </div>
                        {/* Info / Prompts Side */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-indigo-600 rounded-5xl p-8 text-white shadow-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                    <Brain size={120} />
                                </div>
                                <h3 className="text-xl font-black mb-6 relative z-10">{t.narrativeTitle}</h3>
                                <p className="text-sm font-medium text-indigo-100 mb-8 relative z-10 opacity-90">
                                    {t.narrativeSub}
                                </p>
                                <ul className="space-y-4 relative z-10">
                                    {t.points.map((p: string, i: number) => (
                                        <li key={i} className="flex gap-3 text-xs font-bold bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                                            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                                {i + 1}
                                            </div>
                                            <span className="leading-relaxed">{p}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="lg:col-span-8 space-y-6">
                            <div className="bg-white rounded-5xl border border-slate-100 shadow-xl overflow-hidden flex flex-col h-full">
                                <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <Sparkles className="text-indigo-600" size={18} />
                                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Executive Narrative Workspace</span>
                                    </div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        {t.lineCount}: <span className={cn("text-sm", countLines(narrative) >= 10 ? "text-emerald-500" : "text-amber-500")}>{countLines(narrative)}</span>
                                    </div>
                                </div>
                                
                                <textarea 
                                    className="flex-1 p-10 text-lg font-medium leading-loose text-slate-700 outline-none resize-none min-h-[400px] bg-white custom-scrollbar placeholder:text-slate-300"
                                    placeholder={t.placeholder}
                                    value={narrative}
                                    onChange={(e) => setNarrative(e.target.value)}
                                    disabled={isSubmitting}
                                />

                                <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-3 text-slate-400">
                                        <History size={16} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">{t.validationNote}</span>
                                    </div>
                                    <button 
                                        onClick={handleSubmit}
                                        disabled={isSubmitting || countLines(narrative) < 3}
                                        className="w-full md:w-auto px-10 py-5 bg-indigo-600 text-white rounded-4xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-indigo-200 hover:bg-slate-900 transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:grayscale"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 size={20} className="animate-spin" />
                                        ) : (
                                            <>
                                                {t.submitBtn}
                                                <Send size={18} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
          {/* Floating Refresh/Sync Action */}
        <div className="fixed bottom-8 left-8 z-50 flex flex-col gap-2">
            <button 
                onClick={() => window.location.reload()}
                className="w-14 h-14 bg-white border border-slate-100 rounded-2xl shadow-2xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:scale-110 transition-all group"
                title={language === 'ar' ? 'تحديث' : 'Refresh'}
            >
                <RefreshCw size={24} className="group-active:rotate-180 transition-transform duration-500" />
            </button>
            <div className="bg-slate-900 px-3 py-1.5 rounded-lg text-white text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {language === 'ar' ? 'تحديث يدوي' : 'Manual Sync'}
            </div>
        </div>
      </div>
    );
}
