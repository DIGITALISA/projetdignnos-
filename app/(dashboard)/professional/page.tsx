"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Globe,
  Briefcase,
  Target,
  FileText,
  Mic,
  CheckCircle2,
  Languages,
  Shield,
  LogOut,
  ArrowRight,
  Info,
  X,
  Plus,
  Cpu,
  Send,
  User,
  MessageSquare,
  TrendingUp,
  BarChart3,
  AlertTriangle,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";

type Step =
  | "welcome"
  | "language"
  | "audit-form"
  | "experience-input"
  | "initial-analysis"
  | "expert-interview"
  | "mcq-assessment"
  | "portfolio-interview"
  | "final-report";

interface InterviewMessage {
  role: "assistant" | "user";
  content: string;
}

interface Position {
  title: string;
  years: string;
}

interface FormData {
  sectors: string;
  positions: Position[];
  vision: string;
  experienceMode: "upload" | "story" | "";
  cv: File | null;
  careerStory: string;
}

interface AuditResult {
  authorityScore: number;
  profileLevel: string;
  alignment: string;
  gaps: string[];
  strengths: string[];
  visionAnalysis: string;
  nextEvolutionSteps: string[];
  verdict: string;
}

interface SWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

interface CareerPath {
  role: string;
  shortTermProbability: number;
  longTermProbability: number;
  requirements: string[];
}

interface FinalReportResult {
  profileSummary: string;
  maturityLevel: string;
  leadershipFingerprint?: {
    archetype: string;
    description: string;
    riskContext: string;
  };
  selfAwarenessScore?: {
    score: number;
    verdict: string;
    evidence: string;
  };
  trajectoryVelocity?: {
    assessment: string;
    rationale: string;
  };
  swot: SWOT;
  deepInsights: string[];
  marketValue: string;
  finalVerdict: string;
  recommendedRoles: string[];
  gapAnalysis: {
    currentJobVsReality: string;
    hardSkillsMatch: number;
    softSkillsMatch: number;
    criticalCompetencyGaps: string[];
    comparisonPositionReality?: string;
  };
  actionPlan90Days?: {
    week: string;
    action: string;
    rationale: string;
  }[];
  careerAdvancement: CareerPath[];
  // NEW: Comprehensive Professional Dimensions
  expertInterviewNotes?: string[];
  authorityVsPotential?: {
    currentAuthority: number;
    futurePotential: number;
    quadrant: string;
  };
  strategicRadar?: {
    technical: number;
    leadership: number;
    strategy: number;
    execution: number;
    influence: number;
  };
  marketPerceptionVerdict?: string;
  linkedInStrategy?: {
    headline: string;
    summaryFocus: string;
    networkingAdvice: string;
  };
}

interface MCQQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface StepTranslations {
  tag?: string;
  title?: string;
  subtitle?: string;
  steps?: { title: string; desc: string }[];
  cta?: string;
  sectorsLabel?: string;
  sectorsPlac?: string;
  historyLabel?: string;
  jobPlac?: string;
  yearsPlac?: string;
  visionLabel?: string;
  visionPlac?: string;
  cvTitle?: string;
  cvDesc?: string;
  storyTitle?: string;
  storyDesc?: string;
  storyPlac?: string;
  cvBtn?: string;
  loading?: string;
  loadingSub?: string;
  complete?: string;
  completeSub?: string;
  profile?: string;
  authority?: string;
  alignmentLabel?: string;
  alignment?: string;
  gapsLabel?: string;
  gaps?: string;
  // Interview
  intro?: string;
  placeholder?: string;
  finalizing?: string;
  analysisStep?: string;
  // Report
  maturity?: string;
  marketValue?: string;
  finalVerdict?: string;
  recommendedRoles?: string;
  deepInsights?: string;
  swot?: string;
  // MCQ
  mcqTitle?: string;
  mcqSubtitle?: string;
  hardSkillsTitle?: string;
  softSkillsTitle?: string;
  mcqLoading?: string;
  mcqCorrect?: string;
  mcqIncorrect?: string;
  mcqCta?: string;
  gapTitle?: string;
  matchScore?: string;
  // Common
  logout?: string;
  back?: string;
  next?: string;
  years?: string;
  // New: SWOT & Career
  strengths?: string;
  weaknesses?: string;
  opportunities?: string;
  threats?: string;
  shortTerm?: string;
  longTerm?: string;
  masteryReqs?: string;
}

interface LanguageTranslations {
  welcome: StepTranslations;
  language: StepTranslations;
  auditForm: StepTranslations;
  experience: StepTranslations;
  analysis: StepTranslations;
  interview: StepTranslations;
  finalReport: StepTranslations;
  mcq: StepTranslations;
}

interface Translations {
  en: LanguageTranslations;
  fr: LanguageTranslations;
  ar: LanguageTranslations;
}

const TRANSLATIONS: Translations = {
  en: {
    welcome: {
      tag: "Professional Executive Account",
      title: "Welcome to Your Strategic Evolution.",
      subtitle:
        "Before we activate your executive dashboard, we need to execute a high-precision audit of your career path. Each step is designed to calibrate the AI engine to your specific professional reality.",
      steps: [
        {
          title: "Language Calibration",
          desc: "Setting the strategic linguistic tone for your account.",
        },
        {
          title: "Professional Audit",
          desc: "Detailed mapping of your sectors, roles, and experience history.",
        },
        {
          title: "Strategic Vision",
          desc: "Defining your long-term evolution goals and market stance.",
        },
        {
          title: "Evidence Extraction",
          desc: "CV processing or storytelling to extract core authority.",
        },
        {
          title: "Initial SCI Analysis",
          desc: "AI-generated audit report to kickstart your professional repair.",
        },
      ],
      cta: "Let's Begin the Audit",
      logout: "Log Out",
      back: "Back",
      next: "Fast Forward",
      years: "years",
      strengths: "Strengths",
      weaknesses: "Weaknesses",
      opportunities: "Opportunities",
      threats: "Threats",
      shortTerm: "Short-Term",
      longTerm: "Long-Term",
      masteryReqs: "Mastery Requirements",
    },
    language: {
      title: "Core Account Language",
      subtitle:
        "This will calibrate the AI diagnostic and the entire ecosystem interaction.",
    },
    auditForm: {
      title: "Professional Audit: Reality Mapping",
      subtitle: "Tell us about your context and your future market target.",
      sectorsLabel: "Professional Sectors / Domains",
      sectorsPlac: "e.g. Finance, IT Management, Strategic Marketing",
      historyLabel: "History: Positions Held & Duration",
      jobPlac: "Job Title",
      yearsPlac: "Years",
      visionLabel:
        "The 'Why': Where do you see your authority evolving in 3-5 years?",
      visionPlac:
        "Describe your career goals, target roles, or the impact you want to create in your field...",
      cta: "Execute Analysis Phase",
    },
    experience: {
      title: "Evidence Extraction",
      subtitle:
        "How would you like to provide the raw data of your career experience?",
      cvTitle: "Upload Executive CV",
      cvDesc:
        "PDF or Word format. The AI will extract your journey automatically.",
      storyTitle: "Experience Narrative",
      storyDesc:
        "Tell us your story in your own words. Focus on key missions and achievements.",
      storyPlac:
        "Talk about your career journey, key projects, roles and what you achieved...",
      cvBtn: "Select File",
      cta: "Execute Core Analysis",
    },
    analysis: {
      loading: "AI Engine Running Deep Audit",
      loadingSub: "Cross-referencing data with market benchmarks...",
      complete: "Audit Phase Complete",
      completeSub: "Preliminary Strategic Analysis Report Generated",
      profile: "Experience Profile",
      authority: "Authority Level",
      alignment: "Market Alignment",
      gaps: "Identified Gaps",
      cta: "Launch Strategic Interview",
    },
    interview: {
      title: "Strategic Executive Interview",
      subtitle: "The AI HR Mentor (50 years experience) probes your depth.",
      intro:
        "This conversation is high-stakes. Be precise, strategic, and professional.",
      placeholder: "Write your strategic response here...",
      cta: "Send Strategic Input",
      finalizing: "Synthesizing Final Strategic Verdict...",
      analysisStep: "Executing multi-dimensional analysis...",
    },
    finalReport: {
      title: "Executive Strategic Verdict",
      subtitle: "The definitive analysis of your trajectory and potential.",
      maturity: "Strategic Maturity Level",
      marketValue: "Market Perception",
      finalVerdict: "Veteran's Final Judgment",
      recommendedRoles: "High-level Target Roles",
      deepInsights: "Hidden Strategic Truths",
      swot: "Strategic SWOT Analysis",
      gapTitle: "Strategic Gap Analysis",
      matchScore: "Competency Alignment",
      cta: "Access Executive Dashboard",
    },
    mcq: {
      mcqTitle: "Competency Verification",
      mcqSubtitle: "High-precision testing of your Hard & Soft skills.",
      hardSkillsTitle: "Phase 1: Technical & Strategic Depth",
      softSkillsTitle: "Phase 2: Behavioral & Leadership Nuance",
      mcqLoading: "Generating targeted assessments...",
      mcqCorrect: "Response Verified",
      mcqIncorrect: "Gap Identified",
      mcqCta: "Proceed to Final Synthesis",
    },
  },
  fr: {
    welcome: {
      tag: "Compte Exécutif Professionnel",
      title: "Bienvenue dans votre Évolution Stratégique.",
      subtitle:
        "Avant d'activer votre tableau de bord exécutif, nous devons effectuer un audit de haute précision de votre parcours. Chaque étape est conçue pour calibrer le moteur IA à votre réalité professionnelle.",
      steps: [
        {
          title: "Calibration Linguistique",
          desc: "Définition du ton linguistique stratégique de votre compte.",
        },
        {
          title: "Audit Professionnel",
          desc: "Cartographie détaillée de vos secteurs, rôles et historique.",
        },
        {
          title: "Vision Stratégique",
          desc: "Définition de vos objectifs d'évolution à long terme.",
        },
        {
          title: "Extraction de Preuves",
          desc: "Traitement de CV ou narration pour extraire votre autorité.",
        },
        {
          title: "Analyse SCI Initiale",
          desc: "Rapport d'audit généré par l'IA pour lancer votre évolution.",
        },
      ],
      cta: "Commencer l'Audit",
      logout: "Déconnexion",
      back: "Retour",
      next: "Suivant",
      years: "ans",
      strengths: "Forces",
      weaknesses: "Faiblesses",
      opportunities: "Opportunités",
      threats: "Menaces",
      shortTerm: "Court Terme",
      longTerm: "Long Terme",
      masteryReqs: "Exigences de Maîtrise",
    },
    language: {
      title: "Langue Principale du Compte",
      subtitle:
        "Ceci calibrera le diagnostic IA et l'ensemble de l'interaction avec l'écosystème.",
    },
    auditForm: {
      title: "Audit Professionnel : Cartographie du Réel",
      subtitle:
        "Parlez-nous de votre contexte et de votre cible de marché future.",
      sectorsLabel: "Secteurs Professionnels / Domaines",
      sectorsPlac: "ex: Finance, Management IT, Marketing Stratégique",
      historyLabel: "Historique : Postes Occupés & Durée",
      jobPlac: "Intitulé du poste",
      yearsPlac: "Années",
      visionLabel:
        "Le 'Pourquoi' : Où voyez-vous votre autorité évoluer dans 3 à 5 ans ?",
      visionPlac: "Décrivez vos objectifs de carrière, vos rôles cibles...",
      cta: "Exécuter la Phase d'Analyse",
    },
    experience: {
      title: "Extraction de Preuves",
      subtitle:
        "Comment souhaitez-vous fournir les données brutes de votre expérience ?",
      cvTitle: "Télécharger un CV Exécutif",
      cvDesc:
        "Format PDF ou Word. L'IA extraira votre parcours automatiquement.",
      storyTitle: "Narration d'Expérience",
      storyDesc:
        "Racontez-nous votre histoire avec vos propres mots. Concentrez-vous sur les missions clés.",
      storyPlac:
        "Parlez de votre parcours, de vos projets clés, de vos rôles...",
      cvBtn: "Choisir un fichier",
      cta: "Exécuter l'Analyse Finale",
    },
    analysis: {
      loading: "Moteur IA en cours d'Audit Profond",
      loadingSub: "Croisement des données avec les références du marché...",
      complete: "Phase d'Audit Terminée",
      completeSub: "Rapport d'Analyse Stratégique Préliminaire Généré",
      profile: "Profil d'Expérience",
      authority: "Niveau d'Autorité",
      alignment: "Alignement Marché",
      gaps: "Lacunes Identifiées",
      cta: "Lancer l'Entretien Stratégique",
    },
    interview: {
      title: "Entretien Exécutif Stratégique",
      subtitle: "Le Mentor RH (50 ans d'expérience) sonde votre profondeur.",
      intro:
        "Cette conversation est à enjeux élevés. Soyez précis et stratégique.",
      placeholder: "Rédigez votre réponse stratégique ici...",
      cta: "Envoyer l'Input Stratégique",
      finalizing: "Synthèse du Verdict Stratégique Final...",
      analysisStep: "Exécution de l'analyse multidimensionnelle...",
    },
    finalReport: {
      title: "Verdict Stratégique Exécutif",
      subtitle:
        "L'analyse définitive de votre trajectoire et de votre potentiel.",
      maturity: "Niveau de Maturité Stratégique",
      marketValue: "Perception du Marché",
      finalVerdict: "Jugement Final du Vétéran",
      recommendedRoles: "Rôles Cibles de Haut Niveau",
      deepInsights: "Vérités Stratégiques Cachées",
      swot: "Analyse SWOT Stratégique",
      gapTitle: "Analyse des Écarts Stratégiques",
      matchScore: "Alignement des Compétences",
      cta: "Accéder au Tableau de Bord",
    },
    mcq: {
      mcqTitle: "Vérification des Compétences",
      mcqSubtitle: "Test de haute précision de vos Hard & Soft skills.",
      hardSkillsTitle: "Phase 1 : Profondeur Technique & Stratégique",
      softSkillsTitle: "Phase 2 : Nuance Comportementale & Leadership",
      mcqLoading: "Génération d'évaluations ciblées...",
      mcqCorrect: "Réponse Vérifiée",
      mcqIncorrect: "Écart Identifié",
      mcqCta: "Passer à la Synthèse Finale",
    },
  },
  ar: {
    welcome: {
      tag: "حساب تنفيذي مهني",
      title: "مرحباً بك في تطورك الاستراتيجي.",
      subtitle:
        "قبل تفعيل لوحة التحكم التنفيذية الخاصة بك، نحتاج إلى إجراء تدقيق عالي الدقة لمسارك المهني. تم تصميم كل خطوة لمعايرة محرك الذكاء الاصطناعي مع واقعك المهني المحدد.",
      steps: [
        {
          title: "المعايرة اللغوية",
          desc: "تحديد النبرة اللغوية الاستراتيجية لحسابك.",
        },
        {
          title: "التدقيق المهني",
          desc: "رسم خرائط مفصلة لقطاعاتك وأدوارك وتاريخ خبرتك.",
        },
        {
          title: "الرؤية الاستراتيجية",
          desc: "تحديد أهداف التطور طويلة المدى ومكانتك في السوق.",
        },
        {
          title: "استخراج الأدلة",
          desc: "معالجة السيرة الذاتية أو سرد القصص لاستخراج السلطة الأساسية.",
        },
        {
          title: "تحليل SCI الأولي",
          desc: "تقرير تدقيق مولد بالذكاء الاصطناعي لبدء إصلاحك المهني.",
        },
      ],
      cta: "لنبدأ التدقيق",
      logout: "تسجيل الخروج",
      back: "العودة",
      next: "التالي",
      years: "سنوات",
      strengths: "نقاط القوة",
      weaknesses: "نقاط الضعف",
      opportunities: "الفرص",
      threats: "المخاطر",
      shortTerm: "قصير المدى",
      longTerm: "طويل المدى",
      masteryReqs: "متطلبات الإتقان",
    },
    language: {
      title: "اللغة الأساسية للحساب",
      subtitle:
        "سيؤدي ذلك إلى معايرة تشخيص الذكاء الاصطناعي والتفاعل التام مع النظام البيئي.",
    },
    auditForm: {
      title: "التدقيق المهني: رسم خرائط الواقع",
      subtitle: "أخبرنا عن سياقك وهدفك المستقبلي في السوق.",
      sectorsLabel: "القطاعات / المجالات المهنية",
      sectorsPlac:
        "مثلاً: المالية، إدارة تقنيات المعلومات، التسويق الاستراتيجي",
      historyLabel: "التاريخ: المناصب التي شغلتها ومدتها",
      jobPlac: "المسمى الوظيفي",
      yearsPlac: "السنوات",
      visionLabel: "لماذا: أين ترى سلطتك المهنية تتطور خلال 3-5 سنوات؟",
      visionPlac:
        "صف أهدافك المهنية، الأدوار المستهدفة، أو التأثير الذي تريد تركه في مجالك...",
      cta: "تنفيذ مرحلة التحليل",
    },
    experience: {
      title: "استخراج الأدلة",
      subtitle: "كيف ترغب في تقديم البيانات الخام لخبرتك المهنية؟",
      cvTitle: "رفع السيرة الذاتية التنفيذية",
      cvDesc:
        "تنسيق PDF أو Word. سيقوم الذكاء الاصطناعي باستخراج مسارك تلقائياً.",
      storyTitle: "سرد الخبرة",
      storyDesc:
        "أخبرنا قصتك بكلماتك الخاصة. ركز على المهام والإنجازات الرئيسية.",
      storyPlac:
        "تحدث عن رحلتك المهنية، المشاريع الرئيسية، الأدوار وما حققته...",
      cvBtn: "اختر ملفاً",
      cta: "تنفيذ التحليل الأساسي",
    },
    analysis: {
      loading: "محرك الذكاء الاصطناعي يجري تدقيقاً عميقاً",
      loadingSub: "تحليل البيانات مقارنة بالمعايير العالمية...",
      complete: "اكتملت مرحلة التدقيق",
      completeSub: "تم إنشاء تقرير التحليل الاستراتيجي الأولي",
      profile: "ملف الخبرة",
      authority: "مستوى السلطة",
      alignment: "التوافق مع السوق",
      gaps: "الفجوات المكتشفة",
      cta: "بدء المقابلة الاستراتيجية",
    },
    interview: {
      title: "المقابلة التنفيذية الاستراتيجية",
      subtitle: "خبير موارد بشرية (50 سنة خبرة) يختبر عمقك المهني.",
      intro:
        "هذا الحوار عالي الأهمية. كن دقيقاً، استراتيجياً، ومحترفاً في إجاباتك.",
      placeholder: "اكتب استجابتك الاستراتيجية هنا...",
      cta: "إرسال المدخلات الاستراتيجية",
      finalizing: "جاري صياغة الحكم الاستراتيجي النهائي...",
      analysisStep: "تنفيذ عملية التركيب والتحليل الشامل...",
    },
    finalReport: {
      title: "الحكم الاستراتيجي النهائي",
      subtitle: "التحليل النهائي لمسارك وإمكانياتك.",
      maturity: "مستوى النضج الاستراتيجي",
      marketValue: "تصور السوق",
      finalVerdict: "الحكم النهائي للخبير",
      recommendedRoles: "الأدوار المستهدفة رفيعة المستوى",
      deepInsights: "الحقائق الاستراتيجية المخفية",
      swot: "تحليل SWOT الاستراتيجي",
      gapTitle: "تحليل الفجوات الاستراتيجية",
      matchScore: "توافق الكفاءات",
      cta: "الانتقال إلى المرحلة القادمة",
    },
    mcq: {
      mcqTitle: "التحقق من الكفاءات",
      mcqSubtitle: "اختبار عالي الدقة للمهارات الصلبة والناعمة.",
      hardSkillsTitle: "المرحلة الأولى: العمق التقني والاستراتيجي",
      softSkillsTitle: "المرحلة الثانية: الفروق السلوكية والقيادية",
      mcqLoading: "جاري إنشاء التقييمات المخصصة...",
      mcqCorrect: "تم التحقق من الإجابة",
      mcqIncorrect: "تم تحديد فجوة",
      mcqCta: "الانتقال إلى التوليف النهائي",
    },
  },
};

// ─── EXPERT INTERVIEW ──────────────────────────────────────────────────────────
function ExpertInterview({
  formData,
  auditResult,
  t,
  language,
  onComplete,
}: {
  formData: FormData;
  auditResult: AuditResult;
  t: StepTranslations;
  language: string;
  onComplete: (
    report: FinalReportResult,
    transcript: InterviewMessage[],
  ) => void;
}) {
  const [messages, setMessages] = useState<
    { role: "assistant" | "user"; content: string }[]
  >([]);
  const [currentInput, setCurrentInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const maxQuestions = 5;

  // Initialize First Question
  useEffect(() => {
    const fetchFirstQuestion = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/professional-interview/question", {
          method: "POST",
          body: JSON.stringify({ auditResult, formData, language }),
        });
        const data = await response.json();
        if (data.success) {
          setMessages([{ role: "assistant", content: data.question }]);
        }
      } catch (err) {
        console.error("Failed to start interview:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFirstQuestion();
  }, [auditResult, formData, language]);

  const handleSend = async () => {
    if (!currentInput.trim() || loading) return;

    const userMsg = { role: "user" as const, content: currentInput };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setCurrentInput("");
    setLoading(true);

    const userQuestionsCount = updatedMessages.filter(
      (m) => m.role === "assistant",
    ).length;

    try {
      if (userQuestionsCount >= maxQuestions) {
        setFinalizing(true);
        const response = await fetch("/api/professional-interview/analyze", {
          method: "POST",
          body: JSON.stringify({
            auditResult,
            formData,
            conversationHistory: updatedMessages,
            language,
            userId: JSON.parse(localStorage.getItem("userProfile") || "{}")
              .email,
          }),
        });
        const data = await response.json();
        if (data.success) {
          onComplete(data.report, updatedMessages);
        }
      } else {
        const response = await fetch("/api/professional-interview/question", {
          method: "POST",
          body: JSON.stringify({
            auditResult,
            formData,
            conversationHistory: updatedMessages,
            language,
          }),
        });
        const data = await response.json();
        if (data.success) {
          setMessages([
            ...updatedMessages,
            { role: "assistant", content: data.question },
          ]);
        }
      }
    } catch (err) {
      console.error("Interview action failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (finalizing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative">
          <div className="w-48 h-48 rounded-full border-4 border-slate-100 dark:border-slate-800 animate-[spin_3s_linear_infinite] border-t-blue-600 shadow-[0_0_40px_rgba(37,99,235,0.2)]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-blue-500/10 flex items-center justify-center backdrop-blur-sm border border-blue-500/20">
                <Cpu className="text-blue-500 w-12 h-12 animate-pulse" />
            </div>
          </div>
        </div>
        <div className="text-center space-y-5 relative z-10">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight bg-linear-to-r from-blue-600 to-indigo-400 bg-clip-text text-transparent drop-shadow-sm">
            {t.finalizing}
          </h2>
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.4em]">
                {t.analysisStep}
              </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto space-y-8 py-8"
    >
      <div className="text-center space-y-4 relative z-10">
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
          {t.title}
        </h2>
        <p className="text-lg md:text-xl text-slate-500 font-medium px-4 max-w-2xl mx-auto tracking-wide">{t.subtitle}</p>
      </div>

      <div className="bg-white dark:bg-slate-950 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 h-[600px] flex flex-col overflow-hidden shadow-[0_20px_60px_rgba(37,99,235,0.1)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl relative z-10 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-4xl bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-[0_10px_30px_rgba(37,99,235,0.3)] border border-white/20 group-hover:rotate-3 transition-transform">
              <Shield size={32} strokeWidth={1} />
            </div>
            <div>
              <div className="font-black text-sm md:text-base uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">
                Senior Strategic AI
              </div>
              <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] flex items-center gap-2 mt-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" /> 
                System: Active Analysis
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
             <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secure Protocol</div>
             <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && loading && (
            <div className="flex justify-center py-12">
              <Cpu className="animate-spin text-blue-600" />
            </div>
          )}
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 0,
                y: 20,
                x: m.role === "assistant" ? -20 : 20,
              }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className={cn(
                "flex items-end gap-4",
                m.role === "user" ? "flex-row-reverse" : "flex-row",
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg border backdrop-blur-md transition-transform hover:scale-105",
                  m.role === "assistant"
                    ? "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-blue-600"
                    : "bg-linear-to-br from-indigo-600 to-blue-700 border-white/20 text-white",
                )}
              >
                {m.role === "assistant" ? (
                  <Cpu size={22} strokeWidth={1.5} />
                ) : (
                  <User size={22} strokeWidth={1.5} />
                )}
              </div>
              <div
                className={cn(
                  "max-w-[85%] p-6 md:p-8 text-base font-medium leading-relaxed shadow-xl group transition-all",
                  m.role === "assistant"
                    ? "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-[2.5rem] rounded-bl-none"
                    : "bg-linear-to-br from-indigo-600 to-blue-700 text-white rounded-[2.5rem] rounded-br-none shadow-[0_15px_30px_rgba(37,99,235,0.15)] border border-white/10",
                )}
              >
                {m.content}
              </div>
            </motion.div>
          ))}
          {loading &&
            !finalizing &&
            messages.length > 0 &&
            messages[messages.length - 1].role === "user" && (
              <div className="flex gap-4 items-end animate-in fade-in slide-in-from-bottom-2 duration-700">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
                  <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />
                  <Cpu size={22} className="animate-spin text-blue-600 duration-3000" strokeWidth={1.5} />
                </div>
                <div className="px-6 py-4 rounded-4xl rounded-bl-none bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-[0.4em] text-blue-500/60 shadow-sm">
                  Synthesizing Cognitive Strategy...
                </div>
              </div>
            )}
        </div>

        <div className="p-8 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800 flex gap-4 relative z-10 backdrop-blur-md">
          <textarea
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={t.placeholder}
            className="flex-1 bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-4xl px-8 py-5 text-sm font-medium outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all resize-none shadow-inner"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!currentInput.trim() || loading}
            className="w-16 h-16 shrink-0 rounded-4xl bg-linear-to-br from-indigo-600 to-blue-600 text-white flex items-center justify-center hover:bg-linear-to-br hover:from-indigo-500 hover:to-blue-500 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-[0_10px_20px_rgba(37,99,235,0.3)]"
          >
            <Send size={24} strokeWidth={2.5} className="ml-1" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// --- Portfolio Interview Component ---
function PortfolioInterview({
  auditResult,
  formData,
  interviewTranscript,
  mcqResults,
  onComplete,
  language,
}: {
  auditResult: AuditResult;
  formData: FormData;
  interviewTranscript: InterviewMessage[];
  mcqResults: { hardScore: number; softScore: number; totalQuestions: number };
  onComplete: (
    report: FinalReportResult,
    transcript: InterviewMessage[],
  ) => void;
  language: string;
}) {
  const [messages, setMessages] = useState<
    { role: "assistant" | "user"; content: string }[]
  >([]);
  const [currentInput, setCurrentInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const TOTAL_QUESTIONS = 5; // 4 profile + 1 pivotal

  const assistantCount = messages.filter((m) => m.role === "assistant").length;
  const isPivotalPhase = assistantCount >= 4 && messages.length > 0;

  const PHASE_LABELS = [
    { label: "Profile Anchor", icon: "①", color: "text-blue-500" },
    { label: "Gap Confrontation", icon: "②", color: "text-amber-500" },
    { label: "Failure Deep-Dive", icon: "③", color: "text-rose-500" },
    { label: "Self-Awareness Probe", icon: "④", color: "text-violet-500" },
    { label: "THE PIVOTAL", icon: "⑤", color: "text-white" },
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const fetchFirstQuestion = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/portfolio-interview/question", {
          method: "POST",
          body: JSON.stringify({
            auditResult,
            formData,
            interviewTranscript,
            mcqResults,
            language,
          }),
        });
        const data = await response.json();
        if (data.success) {
          setMessages([{ role: "assistant", content: data.question }]);
        }
      } catch (err) {
        console.error("Failed to start portfolio interview:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFirstQuestion();
  }, [auditResult, formData, interviewTranscript, mcqResults, language]);

  const handleSend = async () => {
    if (!currentInput.trim() || loading) return;

    const userMsg = { role: "user" as const, content: currentInput };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setCurrentInput("");
    setLoading(true);

    const currentAssistantCount = updatedMessages.filter(
      (m) => m.role === "assistant",
    ).length;

    try {
      if (currentAssistantCount >= TOTAL_QUESTIONS) {
        setFinalizing(true);
        const response = await fetch("/api/portfolio-interview/analyze", {
          method: "POST",
          body: JSON.stringify({
            auditResult,
            formData,
            interview1Transcript: interviewTranscript,
            mcqResults,
            portfolioTranscript: updatedMessages,
            language,
            userId: JSON.parse(localStorage.getItem("userProfile") || "{}")
              .email,
          }),
        });
        const data = await response.json();
        if (data.success) {
          onComplete(data.report, updatedMessages);
        }
      } else {
        const response = await fetch("/api/portfolio-interview/question", {
          method: "POST",
          body: JSON.stringify({
            auditResult,
            formData,
            interviewTranscript,
            mcqResults,
            currentHistory: updatedMessages,
            language,
          }),
        });
        const data = await response.json();
        if (data.success) {
          setMessages([
            ...updatedMessages,
            { role: "assistant", content: data.question },
          ]);
        }
      }
    } catch (err) {
      console.error("Portfolio interview action failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (finalizing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative">
          <div className="w-48 h-48 rounded-full border-4 border-slate-100 dark:border-slate-800 animate-[spin_3s_linear_infinite] border-t-indigo-600 shadow-[0_0_40px_rgba(79,70,229,0.2)]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-indigo-500/10 flex items-center justify-center backdrop-blur-sm border border-indigo-500/20">
                <Cpu className="text-indigo-500 w-12 h-12 animate-pulse" />
            </div>
          </div>
        </div>
        <div className="text-center space-y-5 relative z-10">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight bg-linear-to-r from-indigo-600 to-violet-400 bg-clip-text text-transparent drop-shadow-sm">
            Synthesizing Strategic X-Ray Report...
          </h2>
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.4em]">
                Cross-referencing all audit data, interview transcripts & MCQ results
              </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto space-y-6 py-8"
    >
      {/* ─── PHASE HEADER ─────────────────────────────────────────────────── */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black uppercase tracking-tight">
          Portfolio & Leadership Deep-Dive
        </h2>
        <p className="text-slate-500 font-medium text-sm">
          {isPivotalPhase
            ? "Phase 2 — The Pivotal Case: Your executive decision-making under pressure."
            : "Phase 1 — Profile Analysis: Understanding your professional DNA before the pivotal."}
        </p>
      </div>

      {/* ─── PROGRESS BAR ─────────────────────────────────────────────────── */}
      <div className="space-y-4 max-w-2xl mx-auto p-6 rounded-4xl bg-white/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between px-2">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
            Phase Progression
          </span>
          <span
            className={cn(
              "text-[10px] font-black uppercase tracking-[0.3em] transition-colors flex items-center gap-2",
              isPivotalPhase ? "text-amber-500" : "text-indigo-600",
            )}
          >
            {isPivotalPhase && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
            {isPivotalPhase
              ? "⚡ PIVOTAL PRESSURE"
              : `${PHASE_LABELS[Math.max(assistantCount - 1, 0)]?.label || ""}`}
          </span>
        </div>
        <div className="flex gap-2">
          {PHASE_LABELS.map((phase, i) => (
            <div key={i} className="flex-1 space-y-2">
              <motion.div
                className={cn(
                  "h-2.5 rounded-full transition-all duration-500 ease-out",
                  i < assistantCount
                    ? i === 4
                      ? "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                      : "bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]"
                    : i === assistantCount && !loading
                      ? i === 4
                        ? "bg-amber-500/30 border border-amber-500/50"
                        : "bg-indigo-500/20 border border-indigo-500/30"
                      : "bg-slate-200/50 dark:bg-slate-800/50 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors",
                )}
              />
              <div
                className={cn(
                  "text-[8px] font-black uppercase tracking-widest text-center truncate hidden md:block",
                  i < assistantCount
                    ? i === 4
                      ? "text-amber-600 dark:text-amber-500"
                      : "text-indigo-600 dark:text-indigo-400"
                    : "text-slate-400 dark:text-slate-600",
                )}
              >
                {phase.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── CHAT CONTAINER ───────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {isPivotalPhase ? (
          /* ─── PIVOTAL MODE: Dramatic full-screen presentation ─── */
          <motion.div
            key="pivotal"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Pivotal badge */}
            <div className="flex items-center justify-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">
                ⚡ The Pivotal Question — Executive Pressure Case
              </div>
            </div>

            {/* Pivotal question card */}
            {messages
              .filter((m) => m.role === "assistant")
              .slice(-1)
              .map((m, i) => (
                <div
                  key={i}
                  className="relative rounded-[2.5rem] bg-linear-to-br from-slate-900 via-slate-800 to-black p-10 shadow-2xl border border-amber-500/20 overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-amber-500 via-orange-500 to-red-500" />
                  <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-amber-500/5" />
                  <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-indigo-500/5" />
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center">
                        <Shield className="text-amber-400" size={20} />
                      </div>
                      <div>
                        <div className="text-[8px] font-black uppercase tracking-[0.4em] text-amber-400">
                          Executive Pressure Case
                        </div>
                        <div className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">
                          No correct answer — only your judgment matters
                        </div>
                      </div>
                    </div>
                    <p className="text-white text-base font-bold leading-relaxed">
                      {m.content}
                    </p>
                    <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-slate-500 border-t border-white/10 pt-4">
                      <span className="text-amber-500">⚡</span>
                      This question evaluates: Strategic thinking · Crisis
                      leadership · Stakeholder management · Executive judgment
                    </div>
                  </div>
                </div>
              ))}

            {/* Previous user responses in pivotal mode */}
            <div className="space-y-4">
              {messages
                .slice(0, -1)
                .filter((m) => m.role === "user")
                .slice(-1)
                .map((m, i) => (
                  <div key={i} className="flex justify-end">
                    <div className="max-w-[80%] p-5 rounded-3xl bg-indigo-600 text-white text-sm font-medium leading-relaxed rounded-br-none shadow-lg shadow-indigo-600/20">
                      {m.content}
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        ) : (
          /* ─── PHASE 1 MODE: Standard chat interface ─── */
          <motion.div
            key="phase1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[3.5rem] shadow-[0_20px_60px_rgba(37,99,235,0.08)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden relative"
          >
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />
            
            {/* Chat header */}
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center gap-5 bg-slate-50/80 dark:bg-slate-900/40 backdrop-blur-md relative z-10">
              <div className="w-14 h-14 rounded-full bg-linear-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                <Shield size={28} strokeWidth={1.5} />
              </div>
              <div>
                <div className="font-black text-xs uppercase tracking-widest text-indigo-600">
                  Executive Portfolio Auditor
                </div>
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">
                  Phase 1 · Profile Deep-Dive · McKinsey Standard
                </div>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase text-slate-400">
                  Live Evaluation
                </span>
              </div>
            </div>

            {/* Messages */}
            <div className="p-8 space-y-6 max-h-[420px] overflow-y-auto">
              {messages.length === 0 && loading && (
                <div className="flex justify-center py-12">
                  <Cpu className="animate-spin text-indigo-600" size={32} />
                </div>
              )}
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20, x: m.role === "assistant" ? -20 : 20 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className={cn(
                    "flex items-end gap-4",
                    m.role === "assistant" ? "flex-row" : "flex-row-reverse",
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-md",
                      m.role === "assistant"
                        ? "bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-indigo-600"
                        : "bg-linear-to-br from-indigo-500 to-blue-600 text-white",
                    )}
                  >
                    {m.role === "assistant" ? (
                      <Cpu size={18} strokeWidth={2} />
                    ) : (
                      <User size={18} strokeWidth={2} />
                    )}
                  </div>
                  <div
                    className={cn(
                      "max-w-[85%] p-5 md:p-6 rounded-4xl text-sm font-medium leading-relaxed shadow-sm transition-shadow hover:shadow-md",
                      m.role === "assistant"
                        ? "bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-100 dark:border-slate-800"
                        : "bg-linear-to-br from-indigo-600 to-blue-600 text-white rounded-br-none shadow-[0_10px_20px_rgba(79,70,229,0.2)]",
                    )}
                  >
                    {m.content}
                  </div>
                </motion.div>
              ))}
              {loading && messages.length > 0 && (
                <div className="flex justify-start items-end gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-800">
                    <Cpu size={18} className="animate-spin text-indigo-600" />
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-4xl rounded-bl-none animate-pulse text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                    Evaluator is formulating the next challenge...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── INPUT AREA ───────────────────────────────────────────────────── */}
      <div
        className={cn(
          "rounded-4xl border-2 overflow-hidden transition-all",
          isPivotalPhase
            ? "border-amber-500/30 bg-black shadow-2xl shadow-amber-500/10"
            : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xl",
        )}
      >
        <textarea
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={
            isPivotalPhase
              ? "Deliver your 5 precise steps. Be specific. No safe answers."
              : "Provide a strategic, honest response..."
          }
          rows={isPivotalPhase ? 5 : 3}
          className={cn(
            "w-full px-8 py-6 text-sm font-medium outline-none resize-none bg-transparent transition-colors",
            isPivotalPhase
              ? "text-white placeholder:text-slate-600 font-bold"
              : "placeholder:text-slate-400",
          )}
        />
        <div
          className={cn(
            "flex items-center justify-between px-6 py-4 border-t",
            isPivotalPhase
              ? "border-amber-500/20"
              : "border-slate-100 dark:border-slate-800",
          )}
        >
          <div
            className={cn(
              "text-[9px] font-black uppercase tracking-widest",
              isPivotalPhase ? "text-amber-500/60" : "text-slate-400",
            )}
          >
            {isPivotalPhase
              ? "⚡ This is your executive moment"
              : "Enter to send · Shift+Enter for new line"}
          </div>
          <button
            onClick={handleSend}
            disabled={loading || !currentInput.trim()}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all disabled:opacity-40 disabled:scale-100",
              isPivotalPhase
                ? "bg-amber-500 text-black hover:bg-amber-400 hover:scale-105 shadow-lg shadow-amber-500/30"
                : "bg-indigo-600 text-white hover:scale-105 shadow-lg shadow-indigo-600/20",
            )}
          >
            <Send size={14} />
            {isPivotalPhase ? "Submit Judgment" : "Send Response"}
          </button>
        </div>
      </div>

      <div ref={chatEndRef} />
    </motion.div>
  );
}

// ─── MCQ ASSESSMENT ──────────────────────────────────────────────────────────
function MCQAssessment({
  auditResult,
  formData,
  interviewTranscript,
  onComplete,
  t,
  language,
}: {
  auditResult: AuditResult;
  formData: FormData;
  interviewTranscript: InterviewMessage[];
  onComplete: (
    report: FinalReportResult | null,
    results: { hardScore: number; softScore: number; totalQuestions: number },
  ) => void;
  t: StepTranslations;
  language: string;
}) {
  const [phase, setPhase] = useState<"hard" | "soft">("hard");
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<
    { type: "hard" | "soft"; score: number; total: number }[]
  >([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fetchStarted = useRef<string | null>(null);

  useEffect(() => {
    // Prevent duplicate fetches for the same phase
    if (fetchStarted.current === phase) return;
    if (!auditResult) return;

    const fetchQuestions = async () => {
      fetchStarted.current = phase;
      setLoading(true);
      setErrorMessage(null);
      try {
        const response = await fetch("/api/professional-mcq/generate", {
          method: "POST",
          body: JSON.stringify({
            auditResult,
            formData,
            interviewTranscript,
            type: phase,
            count: phase === "hard" ? 20 : 15,
            language,
          }),
        });
        const data = await response.json();
        if (data.success) {
          setQuestions(data.questions);
          setCurrentIndex(0);
          setSelectedIdx(null);
          setCurrentScore(0);
          setErrorMessage(null);
        } else {
          setErrorMessage(
            data.error || "Failed to generate assessment questions.",
          );
        }
      } catch (err: unknown) {
        console.error("Failed to fetch questions:", err);
        setErrorMessage(
          "Connection to AI Engine lost. Please check your network and retry.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [phase, auditResult, formData, interviewTranscript, language]);

  const handleAnswer = (idx: number) => {
    if (selectedIdx !== null) return;
    setSelectedIdx(idx);
    if (idx === questions[currentIndex].correctIndex) {
      setCurrentScore((prev) => prev + 1);
    }
  };

  const nextQuestion = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedIdx(null);
    } else {
      // Phase Complete
      const newResults = [
        ...results,
        { type: phase, score: currentScore, total: questions.length },
      ];
      setResults(newResults);

      if (phase === "hard") {
        setPhase("soft");
        // Reset state for new phase
        setQuestions([]);
        setCurrentIndex(0);
        setSelectedIdx(null);
        setCurrentScore(0);
      } else {
        // All Phases Complete
        const hard = newResults.find((r) => r.type === "hard");
        const soft = newResults.find((r) => r.type === "soft");
        onComplete(null, {
          hardScore: hard?.score || 0,
          softScore: soft?.score || 0,
          totalQuestions: (hard?.total || 0) + (soft?.total || 0),
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-16 relative overflow-hidden">
        {/* Background Decorative Blurs */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-emerald-600/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-teal-600/5 rounded-full blur-[100px] animate-pulse" />

        <div className="relative">
          <div className="w-64 h-64 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center relative shadow-2xl bg-white/50 dark:bg-black/50 backdrop-blur-3xl">
             <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: "radial-gradient(circle, #10b981 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-[0.5px] border-emerald-500/30 border-dashed rounded-full"
              />
              <div className="relative z-10 flex flex-col items-center">
                 <TrendingUp className="text-emerald-500 w-24 h-24 animate-pulse" strokeWidth={1} />
              </div>
          </div>
        </div>
        
        <div className="text-center space-y-8 max-w-lg z-10">
          <div className="space-y-3">
             <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight bg-linear-to-r from-emerald-600 to-teal-400 bg-clip-text text-transparent drop-shadow-sm">
                {t.mcqLoading}
             </h2>
             <div className="w-full bg-slate-100 dark:bg-slate-900 h-1 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 4, ease: "linear", repeat: Infinity }}
                  className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                />
             </div>
          </div>
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-xl">
             <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
             <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.5em]">
                {phase === "hard" ? t.hardSkillsTitle : t.softSkillsTitle}
             </p>
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 text-center p-6">
        <div className="w-24 h-24 rounded-4xl bg-rose-500/10 flex items-center justify-center text-rose-600">
          <X size={48} />
        </div>
        <div className="space-y-4 max-w-md">
          <h2 className="text-3xl font-black uppercase tracking-tight">
            Assessment Interrupted
          </h2>
          <p className="text-slate-500 font-medium leading-relaxed">
            {errorMessage ||
              "The AI engine was unable to generate specific questions for your profile at this moment."}
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-12 py-5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl"
        >
          Retry Diagnostic
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto space-y-10 py-12 relative z-10"
    >
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div className="space-y-2">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
            {t.mcqTitle}
          </h2>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {phase === "hard" ? t.hardSkillsTitle : t.softSkillsTitle}
          </div>
        </div>
        <div className="text-left md:text-right w-full md:w-auto bg-white/50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 backdrop-blur-md shadow-sm">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 flex items-center md:justify-end gap-2">
            <span>Evaluation Progress</span>
            <span className="text-emerald-500">
              {currentIndex + 1} / {questions.length}
            </span>
          </div>
          <div className="w-full md:w-56 h-2.5 bg-slate-200/50 dark:bg-slate-800/80 rounded-full overflow-hidden shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-linear-to-r from-emerald-600 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 p-10 md:p-14 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-[0_20px_60px_rgba(16,185,129,0.05)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] space-y-12 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
          <Target size={200} strokeWidth={1} />
        </div>
        <h3 className="text-2xl md:text-3xl font-black leading-snug text-slate-800 dark:text-white relative z-10 border-l-4 border-emerald-500 pl-6">
          {currentQ.question}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQ.options.map((opt, i) => {
            const isSelected = selectedIdx === i;
            const isCorrect = i === currentQ.correctIndex;
            const status =
              selectedIdx !== null
                ? isCorrect
                  ? "correct"
                  : isSelected
                    ? "incorrect"
                    : "idle"
                : "idle";

            return (
              <button
                key={i}
                disabled={selectedIdx !== null}
                onClick={() => handleAnswer(i)}
                className={cn(
                  "p-6 md:p-8 rounded-4xl border-2 text-left transition-all duration-300 flex items-center gap-6 group relative overflow-hidden",
                  status === "idle" &&
                    "border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 hover:border-emerald-500/50 hover:bg-emerald-500/5 hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)] hover:-translate-y-1",
                  status === "correct" &&
                    "border-emerald-500 bg-emerald-500/10 text-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.2)] scale-[1.02] z-10",
                  status === "incorrect" &&
                    "border-rose-500 bg-rose-500/10 text-rose-600 opacity-70",
                )}
              >
                {status === "correct" && (
                  <div className="absolute right-0 top-0 h-full w-2 bg-emerald-500" />
                )}
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center shrink-0 font-black text-sm border-2 transition-all duration-300",
                    status === "idle" &&
                      "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-slate-400 group-hover:border-emerald-500 group-hover:bg-emerald-500 group-hover:text-white shadow-sm",
                    status === "correct" && "bg-emerald-500 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]",
                    status === "incorrect" && "bg-rose-500 border-rose-500 text-white",
                  )}
                >
                  {String.fromCharCode(65 + i)}
                </div>
                <span className="font-bold text-sm md:text-base leading-relaxed relative z-10">{opt}</span>
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {selectedIdx !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "p-8 rounded-3xl space-y-4",
                selectedIdx === currentQ.correctIndex
                  ? "bg-emerald-50 dark:bg-emerald-950/20"
                  : "bg-rose-50 dark:bg-rose-950/20",
              )}
            >
              <div className="flex items-center gap-3">
                {selectedIdx === currentQ.correctIndex ? (
                  <CheckCircle2 className="text-emerald-500" />
                ) : (
                  <X className="text-rose-500" />
                )}
                <span className="font-black uppercase tracking-widest text-sm">
                  {selectedIdx === currentQ.correctIndex
                    ? t.mcqCorrect
                    : t.mcqIncorrect}
                </span>
              </div>
              <p className="text-sm font-medium leading-relaxed italic text-slate-600 dark:text-slate-400">
                {currentQ.explanation}
              </p>
              <div className="flex justify-end pt-4">
                <button
                  onClick={nextQuestion}
                  className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all"
                >
                  {currentIndex === questions.length - 1
                    ? t.mcqCta
                    : "Confirm & Next"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── FINAL REPORT ─────────────────────────────────────────────────────────────
function FinalReport({
  report,
  t,
}: {
  report: FinalReportResult;
  t: StepTranslations;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto space-y-12 pb-20"
    >
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(16,185,129,0.2)]">
          <CheckCircle2 size={18} strokeWidth={2.5} /> Audit Strategicized & Certified
        </div>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-[0.9] bg-clip-text text-transparent bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white">
          {t.title}
        </h1>
        <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl mx-auto tracking-wide">
          {t.subtitle}
        </p>
      </div>

      {/* === TOP MODULE: STRATEGIC RADAR & AUTHORITY MATRIX === */}
      {(report.strategicRadar || report.authorityVsPotential) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {report.strategicRadar && (
            <div className="p-10 rounded-[3rem] bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-[0_20px_60px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.2)] space-y-8 relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-[60px] pointer-events-none" />
              <div className="flex items-center gap-4 text-indigo-600 relative z-10">
                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                  <BarChart3 size={28} strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight">
                  Strategic Competency Radar
                </h3>
              </div>
              <div className="space-y-6 relative z-10">
                {Object.entries(report.strategicRadar).map(([key, val]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest px-1">
                      <span className="text-slate-500">{key}</span>
                      <span className="text-indigo-600 bg-indigo-500/10 px-2 py-0.5 rounded-md">{val}/10</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-900/80 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-800/50">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(val / 10) * 100}%` }}
                        transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                        className="h-full bg-linear-to-r from-indigo-500 to-violet-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)] relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-white/20 w-1/2 skew-x-12 translate-x-[-150%] animate-[shimmer_2s_infinite]" />
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {report.authorityVsPotential && (
            <div className="p-10 rounded-[3rem] bg-linear-to-br from-indigo-950 via-slate-900 to-black text-white shadow-2xl space-y-10 relative overflow-hidden flex flex-col justify-center border border-white/10 group">
              <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-[80px]" />
              <div className="absolute top-0 right-0 p-12 opacity-5 scale-110 group-hover:scale-125 transition-transform duration-1000">
                <Target size={240} strokeWidth={1} />
              </div>
              <div className="space-y-4 relative z-10">
                <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black uppercase text-[10px] tracking-[0.4em]">
                  Strategic Archetype
                </div>
                <h3 className="text-4xl lg:text-5xl font-black uppercase leading-tight tracking-tighter drop-shadow-md">
                  {report.authorityVsPotential.quadrant}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-8 relative z-10 pt-4">
                <div className="space-y-3 p-6 rounded-4xl bg-white/5 border border-white/5 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Current Authority
                  </div>
                  <div className="text-4xl font-black text-white">
                    {report.authorityVsPotential.currentAuthority}%
                  </div>
                  <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${report.authorityVsPotential.currentAuthority}%`,
                      }}
                      className="h-full bg-linear-to-r from-emerald-600 to-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                    />
                  </div>
                </div>
                <div className="space-y-3 p-6 rounded-4xl bg-white/5 border border-white/5 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                    Future Potential
                  </div>
                  <div className="text-4xl font-black text-white">
                    {report.authorityVsPotential.futurePotential}%
                  </div>
                  <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${report.authorityVsPotential.futurePotential}%`,
                      }}
                      className="h-full bg-linear-to-r from-indigo-600 to-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.5)]"
                    />
                  </div>
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-bold leading-relaxed italic text-slate-300 relative z-10 tracking-wide mt-auto">
                Diagnostic: High-precision mapping of current market weight vs. native cognitive adaptability.
              </div>
            </div>
          )}
        </div>
      )}

      {/* === Leadership Fingerprint + Self-Awareness + Velocity === */}
      {(report.leadershipFingerprint ||
        report.selfAwarenessScore ||
        report.trajectoryVelocity) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {report.leadershipFingerprint && (
            <div className="p-8 rounded-[2.5rem] bg-linear-to-br from-violet-600 to-indigo-700 text-white shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <User size={20} className="text-violet-200" />
                <h4 className="font-black uppercase text-[10px] tracking-[0.3em] text-violet-200">
                  Leadership Fingerprint
                </h4>
              </div>
              <div className="text-3xl font-black uppercase">
                {report.leadershipFingerprint.archetype}
              </div>
              <p className="text-xs text-violet-100 font-medium leading-relaxed">
                {report.leadershipFingerprint.description}
              </p>
              <div className="border-t border-violet-400/30 pt-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-violet-300">
                  Risk Context
                </span>
                <p className="text-xs text-violet-100 mt-1">
                  {report.leadershipFingerprint.riskContext}
                </p>
              </div>
            </div>
          )}

          {report.selfAwarenessScore && (
            <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center gap-3 text-amber-500">
                <Sparkles size={20} />
                <h4 className="font-black uppercase text-[10px] tracking-[0.3em] text-slate-400">
                  Self-Awareness
                </h4>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-black text-amber-500">
                  {report.selfAwarenessScore.score}
                </span>
                <span className="text-slate-400 font-black text-lg mb-1">
                  /100
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${report.selfAwarenessScore.score}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className={cn(
                    "h-full",
                    report.selfAwarenessScore.score >= 70
                      ? "bg-emerald-500"
                      : report.selfAwarenessScore.score >= 40
                        ? "bg-amber-500"
                        : "bg-rose-500",
                  )}
                />
              </div>
              <div className="text-xs font-black uppercase tracking-widest text-amber-600">
                {report.selfAwarenessScore.verdict}
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                {report.selfAwarenessScore.evidence}
              </p>
            </div>
          )}

          {report.trajectoryVelocity && (
            <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center gap-3 text-emerald-500">
                <TrendingUp size={20} />
                <h4 className="font-black uppercase text-[10px] tracking-[0.3em] text-slate-400">
                  Career Velocity
                </h4>
              </div>
              <div
                className={cn(
                  "text-3xl font-black uppercase",
                  report.trajectoryVelocity.assessment === "Accelerating"
                    ? "text-emerald-500"
                    : report.trajectoryVelocity.assessment === "On-track"
                      ? "text-blue-500"
                      : report.trajectoryVelocity.assessment === "Plateauing"
                        ? "text-amber-500"
                        : "text-rose-500",
                )}
              >
                {report.trajectoryVelocity.assessment}
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                {report.trajectoryVelocity.rationale}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Summary & Insights */}
        <div className="lg:col-span-2 space-y-8">
          <div className="p-10 rounded-[3rem] bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-2xl space-y-8">
            <div className="flex items-center gap-4 text-blue-600">
              <MessageSquare size={32} />
              <h3 className="text-2xl font-black uppercase tracking-tight">
                Strategic Synthesis
              </h3>
            </div>
            <p className="text-lg text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">
              &quot;{report.profileSummary}&quot;
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-4">
              <h4 className="font-black uppercase text-[10px] tracking-[0.2em] text-slate-400">
                {t.maturity}
              </h4>
              <div className="text-3xl font-black text-blue-600 uppercase">
                {report.maturityLevel}
              </div>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-4">
              <h4 className="font-black uppercase text-[10px] tracking-[0.2em] text-slate-400">
                {t.marketValue}
              </h4>
              <div className="text-3xl font-black text-emerald-500 uppercase">
                {report.marketValue}
              </div>
            </div>
          </div>

          <div className="p-12 rounded-[3.5rem] bg-linear-to-br from-indigo-600 to-violet-700 text-white shadow-[0_20px_60px_rgba(79,70,229,0.3)] relative overflow-hidden border border-white/10 group">
            <Shield className="absolute -top-10 -right-10 w-80 h-80 text-white/5 rotate-12 group-hover:scale-110 group-hover:rotate-24 transition-all duration-700" />
            <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-white/10 rounded-full blur-[60px]" />
            <div className="relative z-10">
              <h3 className="text-3xl font-black uppercase tracking-tight mb-8 drop-shadow-md">
                {t.finalVerdict}
              </h3>
              <p className="text-2xl font-black leading-relaxed text-blue-50 tracking-wide font-serif italic selection:bg-white/30">
                &quot;{report.finalVerdict}&quot;
              </p>
            </div>
          </div>

          {report.marketPerceptionVerdict && (
            <div className="p-10 rounded-[3rem] bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center gap-3 text-indigo-500">
                <Globe size={24} />
                <h3 className="text-xl font-black uppercase tracking-tight">
                  Market Perception Verdict
                </h3>
              </div>
              <p className="text-sm font-bold text-slate-600 dark:text-slate-400 leading-relaxed italic">
                &quot;{report.marketPerceptionVerdict}&quot;
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Roles & SWOT */}
        <div className="space-y-8">
          <div className="p-10 rounded-[2.5rem] bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-xl space-y-6">
            <h3 className="font-black uppercase text-[10px] tracking-[0.3em] text-blue-600">
              {t.recommendedRoles}
            </h3>
            <div className="space-y-3">
              {report.recommendedRoles.map((role, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 font-bold text-sm"
                >
                  <Target className="text-blue-500" size={18} /> {role}
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 space-y-6">
            <h3 className="font-black uppercase text-[10px] tracking-[0.2em] text-slate-500 flex items-center gap-2">
              <Sparkles size={14} className="text-orange-500" />{" "}
              {t.deepInsights}
            </h3>
            <div className="space-y-4">
              {report.deepInsights.map((insight, i) => (
                <p
                  key={i}
                  className="text-xs font-bold leading-relaxed dark:text-slate-400"
                >
                  <span className="text-orange-500 mr-2">/</span> {insight}
                </p>
              ))}
            </div>
          </div>

          {report.expertInterviewNotes && (
            <div className="p-10 rounded-[2.5rem] bg-slate-900 text-slate-400 border border-slate-800 space-y-6 shadow-2xl">
              <h3 className="font-black uppercase text-[10px] tracking-[0.3em] text-amber-500 flex items-center gap-2">
                <Mic size={16} /> Expert Observations Feed
              </h3>
              <div className="space-y-4">
                {report.expertInterviewNotes.map((note, i) => (
                  <div
                    key={i}
                    className="text-[10px] font-medium leading-relaxed border-l border-amber-500/30 pl-4 py-1 italic"
                  >
                    {note}
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-slate-800 text-[8px] font-black uppercase tracking-widest text-slate-600">
                Raw behavioral signals captured from strategic transcripts.
              </div>
            </div>
          )}

          {report.linkedInStrategy && (
            <div className="p-10 rounded-[2.5rem] bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-xl space-y-6">
              <h3 className="font-black uppercase text-[10px] tracking-[0.3em] text-blue-600 flex items-center gap-2">
                <Globe size={16} /> LinkedIn Authority Strategy
              </h3>
              <div className="space-y-4">
                <div>
                  <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">
                    Recommended Headline
                  </span>
                  <p className="text-xs font-bold text-slate-800 dark:text-white mt-1">
                    {report.linkedInStrategy.headline}
                  </p>
                </div>
                <div>
                  <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">
                    Profile Focus
                  </span>
                  <p className="text-[10px] font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                    {report.linkedInStrategy.summaryFocus}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                  <span className="text-[8px] font-black uppercase text-blue-500 tracking-widest">
                    Networking Advice
                  </span>
                  <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mt-1">
                    {report.linkedInStrategy.networkingAdvice}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* === NEW: 90-Day Action Plan === */}
      {report.actionPlan90Days && report.actionPlan90Days.length > 0 && (
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-black uppercase tracking-tight">
              90-Day Execution Plan
            </h2>
            <p className="text-slate-500 font-medium">
              Your personalized roadmap for the next 3 months
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {report.actionPlan90Days.map((step, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-950 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl space-y-4 relative"
              >
                <div className="absolute -top-4 left-8 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                  {step.week}
                </div>
                <div className="pt-4 text-sm font-black uppercase tracking-tight text-slate-800 dark:text-white">
                  {step.action}
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {step.rationale}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gap Analysis & Match Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-10 rounded-[3rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-8">
          <h3 className="text-2xl font-black uppercase tracking-tight">
            {t.gapTitle}
          </h3>
          <p className="text-sm font-medium leading-relaxed dark:text-slate-400">
            {report.gapAnalysis?.currentJobVsReality}
          </p>
          <div className="space-y-4">
            {report.gapAnalysis?.criticalCompetencyGaps.map((gap, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/5 text-rose-600 border border-rose-500/10 font-bold text-xs uppercase tracking-tight"
              >
                <X size={14} /> {gap}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-10 rounded-[2.5rem] bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-xl space-y-6">
            <h4 className="font-black uppercase text-[10px] tracking-[0.3em] text-slate-400">
              {t.matchScore}
            </h4>
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="flex justify-between font-black text-xs uppercase">
                  <span>Hard Skills Match</span>
                  <span>{report.gapAnalysis?.hardSkillsMatch}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${report.gapAnalysis?.hardSkillsMatch}%`,
                    }}
                    className="h-full bg-blue-600"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between font-black text-xs uppercase">
                  <span>Soft Skills Match</span>
                  <span>{report.gapAnalysis?.softSkillsMatch}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${report.gapAnalysis?.softSkillsMatch}%`,
                    }}
                    className="h-full bg-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {report.gapAnalysis?.comparisonPositionReality && (
            <div className="p-8 rounded-4xl bg-indigo-500/5 border border-indigo-500/10 space-y-4">
              <h4 className="font-black uppercase text-[10px] tracking-[0.3em] text-indigo-500">
                Position vs. Professional Reality
              </h4>
              <p className="text-xs font-bold leading-relaxed text-slate-600 dark:text-slate-400">
                {report.gapAnalysis.comparisonPositionReality}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Career Strategy & Advancement */}
      {report.careerAdvancement && report.careerAdvancement.length > 0 && (
        <div className="space-y-10 pt-10">
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-black uppercase tracking-tight">
              Strategic Path & Advancement
            </h2>
            <p className="text-slate-500 font-medium">
              Probabilistic evolution paths based on your current portfolio and
              vision
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {report.careerAdvancement.map((path, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-950 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl space-y-8 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />

                <div className="space-y-2">
                  <h4 className="text-2xl font-black uppercase tracking-tight text-slate-800 dark:text-white">
                    {path.role}
                  </h4>
                  <div className="flex gap-4">
                  <div className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-[10px] font-black uppercase tracking-widest">
                    {t.shortTerm || "Short-Term"}: {path.shortTermProbability}%
                  </div>
                  <div className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 text-[10px] font-black uppercase tracking-widest">
                    {t.longTerm || "Long-Term"}: {path.longTermProbability}%
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="font-black uppercase text-[10px] tracking-[0.3em] text-slate-400">
                  {t.masteryReqs || "Mastery Requirements"}
                </h5>
                  <div className="space-y-2">
                    {path.requirements.map((req, j) => (
                      <div
                        key={j}
                        className="flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-400"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />{" "}
                        {req}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SWOT Section */}
      <div className="space-y-8">
        <h2 className="text-3xl font-black uppercase tracking-tight text-center">
          {t.swot}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SWOTCard
            title={t.strengths || "Strengths"}
            items={report.swot.strengths}
            color="emerald"
            icon={<TrendingUp size={20} />}
          />
          <SWOTCard
            title={t.weaknesses || "Weaknesses"}
            items={report.swot.weaknesses}
            color="red"
            icon={<BarChart3 size={20} />}
          />
          <SWOTCard
            title={t.opportunities || "Opportunities"}
            items={report.swot.opportunities}
            color="blue"
            icon={<Target size={20} />}
          />
          <SWOTCard
            title={t.threats || "Threats"}
            items={report.swot.threats}
            color="orange"
            icon={<Shield size={20} />}
          />
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <a
          href="/professional/executive-dashboard"
          className="group flex items-center gap-6 px-16 py-7 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-[0.4em] text-xl rounded-4xl shadow-2xl hover:scale-105 transition-all outline-none"
        >
          {t.cta}{" "}
          <ArrowRight
            className="group-hover:translate-x-3 transition-transform"
            size={28}
          />
        </a>
      </div>
    </motion.div>
  );
}

function SWOTCard({
  title,
  items,
  color,
  icon,
}: {
  title: string;
  items: string[];
  color: "emerald" | "red" | "blue" | "orange";
  icon: React.ReactNode;
}) {
  const colors = {
    emerald: "bg-emerald-500/5 text-emerald-600 border-emerald-500/20",
    red: "bg-red-500/5 text-red-600 border-red-500/20",
    blue: "bg-blue-500/5 text-blue-600 border-blue-500/20",
    orange: "bg-orange-500/5 text-orange-600 border-orange-500/20",
  };

  return (
    <div
      className={cn(
        "p-8 rounded-[2.5rem] border-2 space-y-6 flex flex-col items-center text-center",
        colors[color],
      )}
    >
      <div
        className={cn(
          "p-4 rounded-2xl bg-white dark:bg-slate-950 shadow-sm mb-2",
        )}
      >
        {icon}
      </div>
      <h3 className="font-black uppercase tracking-widest text-sm">{title}</h3>
      <div className="space-y-3 w-full">
        {items.map((item, i) => (
          <div
            key={i}
            className="text-[10px] font-black uppercase leading-tight tracking-tighter opacity-80"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProfessionalDashboard() {
  const { language: currentLang, setLanguage, dir } = useLanguage();
  const [step, setStep] = useState<Step>("language");
  const [formData, setFormData] = useState<FormData>({
    sectors: "",
    positions: [],
    vision: "",
    experienceMode: "",
    cv: null,
    careerStory: "",
  });

  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [finalReport, setFinalReport] = useState<FinalReportResult | null>(
    null,
  );
  const [interviewTranscript, setInterviewTranscript] = useState<
    InterviewMessage[]
  >([]);
  const [mcqResults, setMcqResults] = useState<{
    hardScore: number;
    softScore: number;
    totalQuestions: number;
  } | null>(null);
  const [portfolioTranscript, setPortfolioTranscript] = useState<
    InterviewMessage[]
  >([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [newPosition, setNewPosition] = useState<Position>({
    title: "",
    years: "",
  });
  const [isHydrated, setIsHydrated] = useState(false);

  // Persistence: Load on Mount
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const storedProfile = localStorage.getItem("userProfile");
        const email = storedProfile ? JSON.parse(storedProfile)?.email : null;

        let loadedFromDB = false;

        if (email) {
          const response = await fetch(`/api/user/professional-progress?email=${encodeURIComponent(email)}`);
          const json = await response.json();

          if (json.success && json.data) {
            loadedFromDB = true;
            const {
              step: savedStep,
              formData: savedFormData,
              auditResult: savedAuditResult,
              finalReport: savedFinalReport,
              interviewTranscript: savedTranscript,
              portfolioTranscript: savedPortfolioTranscript,
              mcqResults: savedMcqResults,
            } = json.data;

            if (savedStep) setStep(savedStep as Step);
            if (savedAuditResult) setAuditResult(savedAuditResult);
            if (savedFinalReport) setFinalReport(savedFinalReport);
            if (savedTranscript) setInterviewTranscript(savedTranscript);
            if (savedPortfolioTranscript)
              setPortfolioTranscript(savedPortfolioTranscript);
            if (savedMcqResults) setMcqResults(savedMcqResults);

            if (savedFormData) {
              setFormData((prev) => ({
                ...prev,
                ...savedFormData,
                cv: null,
              }));
            }
          }
        }

        if (!loadedFromDB) {
          // Fallback to localStorage for smooth migration
          const savedStep = localStorage.getItem("prof_step");
          const savedFormData = localStorage.getItem("prof_formData");
          const savedAuditResult = localStorage.getItem("prof_auditResult");
          const savedFinalReport = localStorage.getItem("prof_finalReport");
          const savedTranscript = localStorage.getItem("prof_transcript");
          const savedPortfolioTranscript = localStorage.getItem(
            "prof_portfolioTranscript",
          );
          const savedMcqResults = localStorage.getItem("prof_mcqResults");

          if (savedStep) setStep(savedStep as Step);
          if (savedAuditResult) setAuditResult(JSON.parse(savedAuditResult));
          if (savedFinalReport) setFinalReport(JSON.parse(savedFinalReport));
          if (savedTranscript) setInterviewTranscript(JSON.parse(savedTranscript));
          if (savedPortfolioTranscript)
            setPortfolioTranscript(JSON.parse(savedPortfolioTranscript));
          if (savedMcqResults) setMcqResults(JSON.parse(savedMcqResults));

          if (savedFormData) {
            const parsed = JSON.parse(savedFormData);
            setFormData((prev) => ({
              ...prev,
              ...parsed,
              cv: null,
            }));
          }
        }
      } catch (error) {
        console.error("Failed to load professional progress", error);
      } finally {
        setIsHydrated(true);
      }
    };

    loadProgress();
  }, []);

  // Persistence: Save on Change
  useEffect(() => {
    if (!isHydrated) return;

    // Save to local storage for quick access
    localStorage.setItem("prof_step", step);
    localStorage.setItem("prof_auditResult", JSON.stringify(auditResult));
    localStorage.setItem("prof_finalReport", JSON.stringify(finalReport));
    localStorage.setItem(
      "prof_transcript",
      JSON.stringify(interviewTranscript),
    );
    localStorage.setItem(
      "prof_portfolioTranscript",
      JSON.stringify(portfolioTranscript),
    );
    localStorage.setItem("prof_mcqResults", JSON.stringify(mcqResults));

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { cv: _, ...dataToSave } = formData;
    localStorage.setItem("prof_formData", JSON.stringify(dataToSave));

    // Save to MongoDB with a slight debounce
    const saveToDB = async () => {
      try {
        const storedProfile = localStorage.getItem("userProfile");
        const email = storedProfile ? JSON.parse(storedProfile)?.email : null;
        if (!email) return;

        await fetch("/api/user/professional-progress", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            step,
            formData: dataToSave,
            auditResult,
            finalReport,
            interviewTranscript,
            portfolioTranscript,
            mcqResults,
          }),
        });
      } catch (error) {
        console.error("Failed to save professional progress to DB", error);
      }
    };

    const timeout = setTimeout(saveToDB, 1500);
    return () => clearTimeout(timeout);
  }, [
    step,
    formData,
    auditResult,
    finalReport,
    interviewTranscript,
    portfolioTranscript,
    mcqResults,
    isHydrated,
  ]);

  const t = TRANSLATIONS[(currentLang as "en" | "fr" | "ar") || "en"];

  const nextStep = useCallback(() => {
    setStep((prev) => {
      if (prev === "language") return "welcome";
      if (prev === "welcome") return "audit-form";
      if (prev === "audit-form") return "experience-input";
      if (prev === "experience-input") return "initial-analysis";
      if (prev === "initial-analysis") return "expert-interview";
      if (prev === "expert-interview") return "mcq-assessment";
      if (prev === "mcq-assessment") return "portfolio-interview";
      if (prev === "portfolio-interview") return "final-report";
      return prev;
    });
  }, []);

  const prevStep = useCallback(() => {
    setStep((prev) => {
      if (prev === "final-report") return "portfolio-interview";
      if (prev === "portfolio-interview") return "mcq-assessment";
      if (prev === "mcq-assessment") return "expert-interview";
      if (prev === "expert-interview") return "initial-analysis";
      if (prev === "initial-analysis") return "experience-input";
      if (prev === "experience-input") return "audit-form";
      if (prev === "audit-form") return "welcome";
      if (prev === "welcome") return "language";
      return prev;
    });
  }, []);

  const handleAnalysisComplete = useCallback((result: AuditResult) => {
    setAuditResult(result);
  }, []);

  const handleInterviewComplete = useCallback(
    (report: FinalReportResult, transcript: InterviewMessage[]) => {
      // We store the transcript for the next MCQ phase
      setInterviewTranscript(transcript);
      setStep("mcq-assessment");
    },
    [],
  );

  const handleMCQComplete = useCallback(
    (
      _report: FinalReportResult | null,
      results: { hardScore: number; softScore: number; totalQuestions: number },
    ) => {
      setMcqResults(results);
      setStep("portfolio-interview");
    },
    [],
  );

  const handlePortfolioComplete = useCallback(
    (report: FinalReportResult, transcript: InterviewMessage[]) => {
      setPortfolioTranscript(transcript);
      setFinalReport(report);
      setStep("final-report");
    },
    [],
  );

  const handleLogout = async () => {
    try {
      // 1. Call the logout API to clear secure session cookies
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout API failed", e);
    } finally {
      // 2. Clear all professional-specific localStorage keys
      const profKeys = [
        "prof_step",
        "prof_formData",
        "prof_auditResult",
        "prof_finalReport",
        "prof_transcript",
        "prof_portfolioTranscript",
        "prof_mcqResults",
        "prof_academy",
        "prof_roadmapResult",
      ];
      profKeys.forEach((k) => localStorage.removeItem(k));

      // 3. Clear everything else to be safe
      localStorage.clear();
      sessionStorage.clear();

      // 4. Force clear all client-side cookies just in case
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      // 5. Redirect to login page
      window.location.href = "/login";
    }
  };

  const STEPS: Step[] = [
    "language",
    "welcome",
    "audit-form",
    "experience-input",
    "initial-analysis",
    "expert-interview",
    "mcq-assessment",
    "portfolio-interview",
    "final-report",
  ];

  // Stage metadata driven by the selected language
  const STAGE_META: { icon: React.ReactNode; label: string; desc: string }[] = [
    {
      icon: <Languages size={18} />,
      label: currentLang === "ar" ? "اللغة" : currentLang === "fr" ? "Langue" : "Language",
      desc: currentLang === "ar" ? "اختيار لغة الحساب" : currentLang === "fr" ? "Langue du compte" : "Account language",
    },
    {
      icon: <Shield size={18} />,
      label: currentLang === "ar" ? "المرحبا" : currentLang === "fr" ? "Bienvenue" : "Welcome",
      desc: currentLang === "ar" ? "نظرة عامة على المسار" : currentLang === "fr" ? "Vue d'ensemble" : "Journey overview",
    },
    {
      icon: <Briefcase size={18} />,
      label: currentLang === "ar" ? "الملف المهني" : currentLang === "fr" ? "Profil" : "Profile",
      desc: currentLang === "ar" ? "القطاعات والمناصب والرؤية" : currentLang === "fr" ? "Secteurs, postes & vision" : "Sectors, roles & vision",
    },
    {
      icon: <FileText size={18} />,
      label: currentLang === "ar" ? "الأدلة" : currentLang === "fr" ? "Preuves" : "Evidence",
      desc: currentLang === "ar" ? "رفع السيرة الذاتية أو السرد" : currentLang === "fr" ? "CV ou narration" : "CV upload or narrative",
    },
    {
      icon: <Cpu size={18} />,
      label: currentLang === "ar" ? "التحليل الأولي" : currentLang === "fr" ? "Analyse" : "Analysis",
      desc: currentLang === "ar" ? "تقرير الذكاء الاصطناعي الأولي" : currentLang === "fr" ? "Rapport IA initial" : "AI initial audit report",
    },
    {
      icon: <MessageSquare size={18} />,
      label: currentLang === "ar" ? "المقابلة" : currentLang === "fr" ? "Entretien" : "Interview",
      desc: currentLang === "ar" ? "مقابلة استراتيجية مع خبير" : currentLang === "fr" ? "Entretien stratégique" : "AI strategic interview",
    },
    {
      icon: <CheckCircle2 size={18} />,
      label: currentLang === "ar" ? "التقييم" : currentLang === "fr" ? "MCQ" : "MCQ",
      desc: currentLang === "ar" ? "اختبار المهارات الصلبة والناعمة" : currentLang === "fr" ? "Test Hard & Soft skills" : "Hard & Soft skills test",
    },
    {
      icon: <Target size={18} />,
      label: currentLang === "ar" ? "المحفظة" : currentLang === "fr" ? "Portfolio" : "Portfolio",
      desc: currentLang === "ar" ? "غوص عميق في القيادة" : currentLang === "fr" ? "Deep-dive leadership" : "Leadership deep-dive",
    },
    {
      icon: <TrendingUp size={18} />,
      label: currentLang === "ar" ? "التقرير النهائي" : currentLang === "fr" ? "Rapport" : "Report",
      desc: currentLang === "ar" ? "الحكم الاستراتيجي الشامل" : currentLang === "fr" ? "Verdict stratégique" : "Final strategic verdict",
    },
  ];

  const STEP_LABELS: Record<Step, string> = {
    language: STAGE_META[0].label,
    welcome: STAGE_META[1].label,
    "audit-form": STAGE_META[2].label,
    "experience-input": STAGE_META[3].label,
    "initial-analysis": STAGE_META[4].label,
    "expert-interview": STAGE_META[5].label,
    "mcq-assessment": STAGE_META[6].label,
    "portfolio-interview": STAGE_META[7].label,
    "final-report": STAGE_META[8].label,
  };
  const currentStepIndex = STEPS.indexOf(step);
  const progressPercent = Math.round(
    ((currentStepIndex + 1) / STEPS.length) * 100,
  );

  const addPosition = () => {
    if (newPosition.title && newPosition.years) {
      setFormData((prev) => ({
        ...prev,
        positions: [...prev.positions, { ...newPosition }],
      }));
      setNewPosition({ title: "", years: "" });
    }
  };

  if (!isHydrated) return null; // Prevent flicker during hydration

  return (
    <div
      className={cn(
        "min-h-screen bg-slate-50 dark:bg-[#06080a] text-slate-900 dark:text-white font-sans selection:bg-blue-500/30 transition-colors duration-500",
        dir === "rtl" ? "font-arabic" : "font-sans",
      )}
      dir={dir}
    >
      {/* ── TOP BAR ── */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#06080a]/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Shield size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-black text-sm uppercase tracking-[0.2em] text-slate-800 dark:text-white hidden sm:block">
              {currentLang === "ar" ? "الحساب التنفيذي" : currentLang === "fr" ? "Compte Exécutif" : "Executive Account"}
            </span>
          </div>

          {/* Mobile: current step pill */}
          <div className="flex md:hidden items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">{STEP_LABELS[step]} — {currentStepIndex + 1}/{STEPS.length}</span>
          </div>

          {/* Right: progress % + logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <div className="w-20 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="h-full bg-indigo-500 rounded-full"
                />
              </div>
              <span className="text-indigo-600 dark:text-indigo-400">{progressPercent}%</span>
            </div>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:border-rose-200 dark:hover:border-rose-500/20 transition-all text-[10px] font-black uppercase tracking-[0.2em]"
            >
              <LogOut size={13} strokeWidth={2.5} />
              <span className="hidden sm:block">{t.welcome.logout || "Log Out"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN LAYOUT ── */}
      <div className="max-w-7xl mx-auto flex gap-0 md:gap-8 px-4 md:px-8 py-8">

        {/* ────────────────── SIDEBAR STEPPER ────────────────── */}
        {step !== "language" && step !== "welcome" && (
          <aside className="hidden md:flex flex-col w-72 shrink-0">
            <div className="sticky top-24 space-y-2">
              {/* Title */}
              <div className="px-4 pb-4">
                <p className="text-[9px] font-black uppercase tracking-[0.35em] text-slate-400">
                  {currentLang === "ar" ? "مسار التقييم" : currentLang === "fr" ? "Parcours d'évaluation" : "Assessment Journey"}
                </p>
              </div>

              {/* Steps */}
              {STEPS.map((s, i) => {
                const meta = STAGE_META[i];
                const isDone = i < currentStepIndex;
                const isActive = i === currentStepIndex;
                const isSkip = s === "language" || (s === "welcome" && currentStepIndex > 1);
                if (isSkip && !isDone) return null;

                return (
                  <motion.div
                    key={s}
                    initial={{ opacity: 0, x: dir === "rtl" ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={cn(
                      "flex items-start gap-3 px-4 py-3 rounded-2xl transition-all cursor-default group",
                      isActive
                        ? "bg-white dark:bg-slate-900 shadow-lg shadow-indigo-500/10 border border-indigo-200/60 dark:border-indigo-500/20"
                        : isDone
                        ? "hover:bg-white/60 dark:hover:bg-slate-900/40"
                        : "opacity-40",
                    )}
                  >
                    {/* Step Icon */}
                    <div
                      className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all",
                        isActive
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/40"
                          : isDone
                          ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-slate-100 dark:bg-slate-900 text-slate-400",
                      )}
                    >
                      {isDone ? <CheckCircle2 size={16} strokeWidth={2.5} /> : meta.icon}
                    </div>

                    {/* Label + Desc */}
                    <div className="min-w-0 flex-1 pt-0.5">
                      <p
                        className={cn(
                          "text-sm font-black uppercase tracking-tight leading-tight truncate",
                          isActive
                            ? "text-indigo-600 dark:text-indigo-400"
                            : isDone
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-slate-500",
                        )}
                      >
                        {meta.label}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5 leading-snug">
                        {meta.desc}
                      </p>
                    </div>

                    {/* Status dot */}
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shrink-0 mt-1" />
                    )}
                    {isDone && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1" />
                    )}
                  </motion.div>
                );
              })}

              {/* Footer: global progress ring */}
              <div className="mt-6 px-4 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4">
                <div className="relative w-14 h-14 shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="14" fill="none"
                      stroke="#6366f1" strokeWidth="3"
                      strokeDasharray={`${progressPercent * 0.88} 88`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-indigo-600">{progressPercent}%</span>
                </div>
                <div>
                  <p className="text-xs font-black text-slate-800 dark:text-white">
                    {currentLang === "ar" ? "التقدم الكلي" : currentLang === "fr" ? "Progression globale" : "Overall progress"}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                    {currentLang === "ar"
                      ? `${currentStepIndex + 1} من ${STEPS.length} مراحل`
                      : currentLang === "fr"
                      ? `Étape ${currentStepIndex + 1} sur ${STEPS.length}`
                      : `Step ${currentStepIndex + 1} of ${STEPS.length}`}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* ─────────────── MAIN CONTENT ─────────────── */}
        <main className={cn("flex-1 min-w-0", step === "language" || step === "welcome" ? "max-w-4xl mx-auto w-full" : "")}>
          {/* ── Logout Confirm ── */}
          <AnimatePresence>
            {showLogoutConfirm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white dark:bg-slate-950 rounded-[3rem] p-12 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 space-y-8 text-center"
                >
                  <div className="w-16 h-16 rounded-3xl bg-blue-500/10 flex items-center justify-center mx-auto">
                    <LogOut className="text-blue-600 dark:text-blue-500" size={28} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black uppercase tracking-tight">
                      {currentLang === "ar" ? "هل أنت متأكد؟" : "Are you sure?"}
                    </h3>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed">
                      {currentLang === "ar"
                        ? "سيتم حفظ جميع تقدمك وبياناتك بأمان. يمكنك العودة واستكمال التقييم التنفيذي في أي وقت ومن أي جهاز."
                        : "Your progress is securely saved. You can resume your executive assessment anytime, from any device."}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowLogoutConfirm(false)}
                      className="flex-1 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 font-black uppercase text-xs tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
                    >
                      {currentLang === "ar" ? "إلغاء" : "Cancel"}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex-1 py-4 rounded-2xl bg-blue-600 text-white font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition-all shadow-[0_10px_20px_rgba(37,99,235,0.2)]"
                    >
                      {currentLang === "ar" ? "خروج" : "Log Out"}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Back / Forward dev nav (hidden on final + analysis) ── */}
          {step !== "welcome" && step !== "initial-analysis" && step !== "language" && (
            <div className="flex justify-between items-center mb-6 px-1">
              <button
                onClick={prevStep}
                className="group flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 transition-all hover:shadow-md text-slate-500"
              >
                <ChevronLeft className={cn("w-5 h-5 transition-transform group-hover:-translate-x-0.5", dir === "rtl" && "rotate-180")} />
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">{t.welcome.back || "Back"}</span>
              </button>
              <button
                onClick={nextStep}
                className="group flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 transition-all hover:shadow-md text-slate-500"
              >
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">{t.welcome.next || "Skip"}</span>
                <ChevronRight className={cn("w-5 h-5 transition-transform group-hover:translate-x-0.5", dir === "rtl" && "rotate-180")} />
              </button>
            </div>
          )}

          {/* ── STEP CONTENT ── */}
          <AnimatePresence mode="wait">
            {step === "welcome" && (
              <WelcomeScreen key="welcome" onNext={nextStep} t={t.welcome} />
            )}

            {step === "language" && (
              <LanguageSelection
                key="language"
                selected={currentLang}
                onSelect={(l) => {
                  setLanguage(l);
                  nextStep();
                }}
                t={t.language}
              />
            )}

            {step === "audit-form" && (
              <AuditForm
                key="audit"
                formData={formData}
                setFormData={setFormData}
                newPosition={newPosition}
                setNewPosition={setNewPosition}
                addPosition={addPosition}
                onNext={nextStep}
                t={t.auditForm}
              />
            )}

            {step === "experience-input" && (
              <ExperienceInput
                key="experience"
                formData={formData}
                setFormData={setFormData}
                onNext={nextStep}
                t={t.experience}
                language={currentLang}
              />
            )}

            {step === "initial-analysis" && (
              <InitialAnalysis
                key="analysis"
                formData={formData}
                t={t.analysis}
                language={currentLang}
                onComplete={handleAnalysisComplete}
                onNext={nextStep}
              />
            )}

            {step === "expert-interview" && auditResult && (
              <ExpertInterview
                key="interview"
                formData={formData}
                auditResult={auditResult}
                t={t.interview}
                language={currentLang}
                onComplete={handleInterviewComplete}
              />
            )}

            {step === "mcq-assessment" && auditResult && (
              <MCQAssessment
                key="mcq"
                auditResult={auditResult}
                formData={formData}
                interviewTranscript={interviewTranscript}
                t={t.mcq}
                language={currentLang}
                onComplete={handleMCQComplete}
              />
            )}

            {step === "portfolio-interview" && auditResult && mcqResults && (
              <PortfolioInterview
                key="portfolio"
                auditResult={auditResult}
                formData={formData}
                interviewTranscript={interviewTranscript}
                mcqResults={mcqResults}
                language={currentLang}
                onComplete={handlePortfolioComplete}
              />
            )}

            {step === "final-report" && finalReport && (
              <FinalReport key="report" report={finalReport} t={t.finalReport} />
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// ─── Welcome SCREEN ─────────────────────────────────────────────────────────────
function WelcomeScreen({
  onNext,
  t,
}: {
  onNext: () => void;
  t: StepTranslations;
}) {
  const icons = [
    <Globe key="1" className="text-blue-500" />,
    <Briefcase key="2" className="text-emerald-500" />,
    <Target key="3" className="text-orange-500" />,
    <FileText key="4" className="text-purple-500" />,
    <Sparkles key="5" className="text-cyan-500" />,
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-16 relative z-10"
    >
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="space-y-6 text-center md:text-left relative z-10">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] shadow-sm">
          <Shield size={16} strokeWidth={2.5} className="text-blue-500" /> {t.tag}
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] uppercase drop-shadow-sm">
          {(t.title || "").split(" ").map((word: string, i: number) =>
            i > 1 ? (
              <span
                key={i}
                className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-indigo-600 to-violet-600 block md:inline"
              >
                {word}{" "}
              </span>
            ) : (
              word + " "
            ),
          )}
        </h1>
        <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-medium max-w-3xl leading-relaxed tracking-wide">
          {t.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {t.steps?.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
            className="group flex items-start gap-6 p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-blue-500/30 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-all hover:shadow-[0_20px_40px_rgba(37,99,235,0.06)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-500 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-6 shrink-0 relative z-10">
              {icons[i]}
            </div>
            <div className="space-y-1 relative z-10 pt-1">
              <h3 className="font-black text-xl uppercase tracking-tight text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors">
                {s.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed">
                {s.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center md:justify-start">
        <button
          onClick={onNext}
          className="group relative inline-flex items-center justify-center gap-4 px-12 py-6 rounded-4xl bg-linear-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-black text-xl uppercase tracking-[0.2em] overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_rgba(79,70,229,0.3)] hover:shadow-[0_0_60px_rgba(79,70,229,0.5)] border border-white/10"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          <span className="relative z-10 drop-shadow-md">{t.cta}</span>
          <ArrowRight
            size={24}
            className="transition-transform group-hover:translate-x-3 relative z-10 drop-shadow-md"
          />
        </button>
      </div>
    </motion.div>
  );
}

// ─── LANGUAGE SELECTION ─────────────────────────────────────────────────────────
function LanguageSelection({
  selected,
  onSelect,
  t,
}: {
  selected: string;
  onSelect: (l: "en" | "fr" | "ar") => void;
  t: StepTranslations;
}) {
  const options = [
    {
      code: "en" as const,
      label: "English",
      sub: "Global Professional Standard",
    },
    { code: "fr" as const, label: "Français", sub: "Standard Exécutif" },
    { code: "ar" as const, label: "العربية", sub: "المعيار الاستراتيجي" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      <div className="flex justify-center mb-10">
        <div className="p-8 rounded-full bg-linear-to-br from-blue-600/20 to-indigo-600/10 text-blue-600 animate-[pulse_4s_ease-in-out_infinite] shadow-[0_0_60px_rgba(37,99,235,0.2)] border border-blue-600/20">
          <Languages size={72} strokeWidth={1.5} />
        </div>
      </div>
      <h2 className="text-4xl md:text-6xl font-black uppercase mb-6 tracking-tight bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
        {t.title}
      </h2>
      <p className="text-xl md:text-2xl text-slate-500 mb-16 font-medium tracking-wide max-w-2xl mx-auto">{t.subtitle}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {options.map((opt) => (
          <button
            key={opt.code}
            onClick={() => onSelect(opt.code)}
            className={cn(
              "group p-10 rounded-[3.5rem] border bg-white dark:bg-slate-950 transition-all text-left relative overflow-hidden",
              selected === opt.code
                ? "border-blue-600 shadow-[0_20px_40px_rgba(37,99,235,0.15)] ring-4 ring-blue-600/10 scale-105 z-10"
                : "border-slate-100 dark:border-slate-800 hover:border-blue-400 hover:shadow-2xl hover:-translate-y-2",
            )}
          >
            <div className="text-2xl font-black mb-1 uppercase tracking-tight">
              {opt.label}
            </div>
            <div className="text-sm font-bold text-slate-500 tracking-wide uppercase">
              {opt.sub}
            </div>
            <div
              className={cn(
                "mt-8 h-1.5 w-0 group-hover:w-16 bg-blue-600 transition-all rounded-full",
                selected === opt.code && "w-16 bg-blue-600",
              )}
            />
            {selected === opt.code && (
              <div className="absolute top-4 right-4">
                <CheckCircle2 className="text-blue-600" />
              </div>
            )}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// ─── AUDIT FORM ─────────────────────────────────────────────────────────────────
function AuditForm({
  formData,
  setFormData,
  newPosition,
  setNewPosition,
  addPosition,
  onNext,
  t,
}: {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  newPosition: Position;
  setNewPosition: React.Dispatch<React.SetStateAction<Position>>;
  addPosition: () => void;
  onNext: () => void;
  t: StepTranslations;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-10"
    >
      <div className="flex items-center gap-6 mb-8 mt-4">
        <div className="p-5 rounded-4xl bg-linear-to-br from-indigo-500/20 to-blue-500/10 border border-indigo-500/20 text-indigo-500 shadow-inner">
          <Info size={36} strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
            {t.title}
          </h2>
          <p className="text-lg text-slate-500 font-medium tracking-wide mt-1">{t.subtitle}</p>
        </div>
      </div>

      <div className="space-y-10 bg-white dark:bg-slate-950 p-12 relative overflow-hidden rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
            {t.sectorsLabel}
          </label>
          <input
            type="text"
            placeholder={t.sectorsPlac || ""}
            value={formData.sectors}
            onChange={(e) =>
              setFormData({ ...formData, sectors: e.target.value })
            }
            className="w-full bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 font-bold focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all outline-none"
          />
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
            {t.historyLabel}
          </label>

          <div className="grid grid-cols-1 gap-3">
            {formData.positions.map((p: Position, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-between p-5 rounded-4xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="font-black text-sm uppercase tracking-tight ml-2">
                  {p.title} <span className="text-indigo-500 mx-3">—</span>{" "}
                  <span className="text-slate-500">{p.years} {t.years || "years"}</span>
                </span>
                <button
                  onClick={() =>
                    setFormData({
                      ...formData,
                      positions: formData.positions.filter(
                        (_: Position, idx: number) => idx !== i,
                      ),
                    })
                  }
                  className="p-2 hover:text-red-600 transition-colors bg-slate-50 dark:bg-slate-900 rounded-lg"
                >
                  <X size={16} />
                </button>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder={t.jobPlac || ""}
              value={newPosition.title}
              onChange={(e) =>
                setNewPosition({ ...newPosition, title: e.target.value })
              }
              className="flex-1 bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-3 text-sm font-bold outline-none"
            />
            <input
              type="number"
              placeholder={t.yearsPlac || ""}
              value={newPosition.years}
              onChange={(e) =>
                setNewPosition({ ...newPosition, years: e.target.value })
              }
              className="md:w-32 bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-3 text-sm font-bold outline-none"
            />
            <button
              onClick={addPosition}
              className="p-4 px-6 md:px-8 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-colors shadow-[0_10px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_15px_30px_rgba(79,70,229,0.4)] active:scale-95 flex items-center justify-center"
            >
              <Plus size={24} strokeWidth={3} />
            </button>
          </div>
        </div>

        <div className="space-y-3 pt-8 border-t border-slate-200 dark:border-slate-800">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
            {t.visionLabel}
          </label>
          <textarea
            placeholder={t.visionPlac || ""}
            value={formData.vision}
            onChange={(e) =>
              setFormData({ ...formData, vision: e.target.value })
            }
            className="w-full h-48 bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-4xl px-8 py-6 font-bold focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all outline-none resize-none shadow-inner"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={
            !formData.sectors ||
            formData.positions.length === 0 ||
            !formData.vision
          }
          className="group inline-flex items-center gap-4 px-12 py-5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:grayscale text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-emerald-500/30 transition-all hover:scale-[1.05]"
        >
          <span>{t.cta}</span>
          <ChevronRight
            size={24}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
    </motion.div>
  );
}

// ─── EXPERIENCE INPUT ───────────────────────────────────────────────────────────
function ExperienceInput({
  formData,
  setFormData,
  onNext,
  t,
  language,
}: {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onNext: () => void;
  t: StepTranslations;
  language: string;
}) {
  const [confirmed, setConfirmed] = useState(false);

  // Initialize mode to story on mount if it's not already set
  useEffect(() => {
    setFormData((prev) => ({ ...prev, experienceMode: "story" }));
  }, [setFormData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-16"
    >
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
          {t.title}
        </h2>
        <p className="text-xl text-slate-500 font-medium max-w-xl mx-auto">
          {t.subtitle}
        </p>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />
        <div
          className={cn(
            "p-12 md:p-16 rounded-[4rem] border transition-all text-center space-y-10 group relative bg-white dark:bg-slate-950 shadow-2xl border-slate-100 dark:border-slate-800 hover:border-indigo-500/30",
          )}
        >
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-indigo-600/5 to-indigo-600/10 rounded-[4rem] pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex p-10 rounded-[3rem] bg-linear-to-br from-indigo-600/20 to-violet-600/10 text-indigo-600 transition-all group-hover:scale-110 shadow-inner border border-indigo-600/20 relative">
               <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-2xl animate-pulse" />
               <Mic size={80} strokeWidth={1} className="relative z-10" />
            </div>
            <div className="space-y-4 mt-10">
              <h3 className="text-4xl font-black uppercase tracking-tighter italic">
                {t.storyTitle}
              </h3>
              <div className="flex items-center justify-center gap-2 text-slate-400 font-black uppercase text-[10px] tracking-[0.4em] mb-4">
                 <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                 Strategic Voice Capture Mode
                 <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
              </div>
              <p className="text-slate-500 font-bold text-sm max-w-lg mx-auto leading-relaxed italic">
                {t.storyDesc}
              </p>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pt-6"
            onClick={(e) => e.stopPropagation()}
          >
            <textarea
              className="w-full relative z-10 h-80 p-12 bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 rounded-[3.5rem] text-xl font-medium outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-600 focus:ring-20 focus:ring-indigo-600/5 transition-all resize-none shadow-2xl leading-relaxed placeholder:text-slate-300 dark:placeholder:text-slate-700"
              placeholder={
                language === "ar"
                  ? "أخبرنا عن رحلتك المهنية بحرية، المهام التي قمت بها، والإنجازات التي تفتخر بها..."
                  : t.storyPlac || ""
              }
              value={formData.careerStory}
              onChange={(e) => {
                setFormData({ ...formData, careerStory: e.target.value });
                setConfirmed(false);
              }}
            />
            {formData.careerStory.length >= 10 && !confirmed && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setConfirmed(true)}
                className="mt-10 relative z-10 w-full py-8 bg-linear-to-r from-indigo-700 to-violet-800 text-white font-black rounded-3xl hover:translate-y-[-4px] transition-all shadow-[0_25px_50px_rgba(79,70,229,0.4)] uppercase tracking-[0.3em] text-xs active:scale-95 border border-white/20"
              >
                {language === "ar" ? "تحليل المسار المهني" : "Analyze My Executive Path"}
              </motion.button>
            )}

            {confirmed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex flex-col items-center gap-3"
              >
                <div className="flex items-center gap-2 text-indigo-500 font-black uppercase text-[10px] tracking-widest bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/20">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse shadow-[0_0_10px_rgba(79,70,229,0.8)]" />
                  {language === "ar"
                    ? "تم تأمين البيانات - جاهز للانتقال"
                    : "Strategic Data Locked - Move Forward"}
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                   v4.2 Analysis Engine Awaiting Command
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {confirmed && (
        <div className="flex justify-center pt-8">
          <button
            onClick={onNext}
            className="group flex items-center gap-4 px-16 py-6 bg-slate-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-[0.3em] rounded-3xl animate-bounce shadow-2xl hover:scale-110 transition-all"
          >
            {t.cta}{" "}
            <Sparkles size={24} className="animate-spin duration-3000" />
          </button>
        </div>
      )}
    </motion.div>
  );
}

// ─── INITIAL ANALYSIS ───────────────────────────────────────────────────────────
function InitialAnalysis({
  formData,
  t,
  language,
  onComplete,
  onNext,
}: {
  formData: FormData;
  t: StepTranslations;
  language: string;
  onComplete: (result: AuditResult) => void;
  onNext: () => void;
}) {
  const [analyzing, setAnalyzing] = useState(true);
  const [auditData, setAuditData] = useState<AuditResult | null>(null);
  const [error, setError] = useState("");
  const auditStarted = useRef(false);

  useEffect(() => {
    if (auditStarted.current) return;

    // Guard: Only start if we have the minimum required data
    // This prevents 400 errors if the component mounts during state hydration
    if (
      !formData.sectors ||
      formData.positions.length === 0 ||
      !formData.vision
    ) {
      return;
    }

    const performAudit = async () => {
      console.log("🚀 Starting Professional Audit...");
      auditStarted.current = true;
      try {
        const userProfile = JSON.parse(
          localStorage.getItem("userProfile") || "{}",
        );
        const body = new FormData();
        body.append("sectors", formData.sectors);
        body.append("positions", JSON.stringify(formData.positions));
        body.append("vision", formData.vision);
        body.append("language", language);
        body.append("userId", userProfile.email || userProfile.fullName || "");
        body.append("userName", userProfile.fullName || "");

        if (formData.experienceMode === "upload" && formData.cv) {
          body.append("cv", formData.cv);
        } else {
          body.append("careerStory", formData.careerStory);
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 120000); // 120s timeout for deep analysis

        const response = await fetch("/api/strategic-audit", {
          method: "POST",
          body: body,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const data = await response.json();
        if (data.success) {
          setAuditData(data.audit);
          onComplete(data.audit);
          // Wait a bit to show a smooth transition
          setTimeout(() => setAnalyzing(false), 2000);
        } else {
          setError(data.error || "Audit failed");
          setAnalyzing(false);
        }
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        const errorName = err instanceof Error ? err.name : "";
        console.error("Audit error:", errorMsg);
        if (errorName === "AbortError") {
          setError(
            language === "ar"
              ? "استغرق التحليل وقتاً طويلاً جداً. يرجى المحاولة مرة أخرى."
              : "Analysis timed out. Please try again.",
          );
        } else {
          setError("Failed to connect to AI engine");
        }
        setAnalyzing(false);
      }
    };

    performAudit();
  }, [formData, language, onComplete]);

  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    if (!analyzing) return;
    const steps = [
      {
        en: "Extracting Professional DNA...",
        fr: "Extraction de l'ADN professionnel...",
        ar: "جاري استخراج الحمض النووي المهني...",
      },
      {
        en: "Scanning Competitive Gaps...",
        fr: "Analyse des lacunes compétitives...",
        ar: "جاري تحليل الفجوات التنافسية...",
      },
      {
        en: "Identifying the 'Red Thread'...",
        fr: "Identification du 'Fil Rouge'...",
        ar: "تحديد 'الخيط الناظم' للمسار...",
      },
      {
        en: "Cross-referencing Global Benchmarks...",
        fr: "Croisement des références mondiales...",
        ar: "تقاطع البيانات مع المعايير العالمية...",
      },
      {
        en: "Synthesizing Strategic Verdict...",
        fr: "Synthèse du verdict stratégique...",
        ar: "صياغة الحكم الاستراتيجي النهائي...",
      },
    ];

    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % steps.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [analyzing]);

  const loadingSteps = [
    {
      en: "Extracting Professional DNA...",
      fr: "Extraction de l'ADN professionnel...",
      ar: "جاري استخراج الحمض النووي المهني...",
    },
    {
      en: "Scanning Competitive Gaps...",
      fr: "Analyse des lacunes compétitives...",
      ar: "جاري تحليل الفجوات التنافسية...",
    },
    {
      en: "Identifying the 'Red Thread'...",
      fr: "Identification du 'Fil Rouge'...",
      ar: "تحديد 'الخيط الناظم' للمسار...",
    },
    {
      en: "Cross-referencing Global Benchmarks...",
      fr: "Croisement des références mondiales...",
      ar: "تقاطع البيانات مع المعايير العالمية...",
    },
    {
      en: "Synthesizing Strategic Verdict...",
      fr: "Synthèse du verdict stratégique...",
      ar: "صياغة الحكم الاستراتيجي النهائي...",
    },
  ];

  if (analyzing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-16 relative overflow-hidden px-6">
        {/* Background Decorative Blurs */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-600/5 rounded-full blur-[100px] animate-pulse" />

        <div className="relative">
          {/* Main Strategic Radar */}
          <div className="w-72 h-72 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center relative overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.4)] bg-white/50 dark:bg-black/50 backdrop-blur-3xl">
            {/* Background Grid Lines */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: "linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* Scanning Bar */}
            <motion.div
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 w-full h-[3px] bg-linear-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_25px_rgba(59,130,246,0.8)] z-30 opacity-80"
            />

            <motion.div
               animate={{ rotate: 360 }}
               transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 border-[0.5px] border-blue-500/20 border-dashed rounded-full"
            />

            {/* Inner Concentric Circles */}
            <div className="absolute inset-6 rounded-full border border-slate-200/50 dark:border-slate-800/50 flex items-center justify-center shadow-inner">
               <div className="absolute inset-12 rounded-full border border-slate-200/50 dark:border-slate-800/50 flex items-center justify-center">
                  <div className="absolute inset-16 rounded-full border border-blue-600/20" />
                  <div className="relative z-10 flex flex-col items-center">
                    <Cpu className="text-blue-600 w-20 h-20 animate-pulse" strokeWidth={1} />
                    <div className="absolute -bottom-4 text-[7px] font-black uppercase tracking-[0.3em] text-blue-500/60 animate-pulse">
                       Core Engine
                    </div>
                  </div>
               </div>
            </div>

            {/* Rotating Outer Ring Markers */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              {[0, 90, 180, 270].map((deg) => (
                <div 
                  key={deg} 
                  className="absolute w-4 h-0.5 bg-blue-500/30" 
                  style={{ top: '50%', left: '50%', transform: `rotate(${deg}deg) translate(140px)` }}
                />
              ))}
            </motion.div>
          </div>

          {/* Artificial Data Points */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                delay: i * 0.4,
                ease: "easeInOut"
              }}
              className="absolute w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,1)]"
              style={{
                left: `${50 + Math.cos(i * 1.04) * 35}%`,
                top: `${50 + Math.sin(i * 1.04) * 35}%`,
              }}
            />
          ))}

          {/* Floating Data Nodes */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{
                x: [0, Math.cos(i * 1.5) * 40, 0],
                y: [0, Math.sin(i * 1.5) * 40, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute w-2 h-2 bg-blue-500 rounded-full"
              style={{
                left: "50%",
                top: "50%",
                marginLeft: `${Math.cos(i * 1.5) * 140}px`,
                marginTop: `${Math.sin(i * 1.5) * 140}px`,
              }}
            />
          ))}
        </div>

        <div className="text-center space-y-8 max-w-lg z-10">
          <div className="space-y-3">
            <motion.h2
              key={loadingStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-800 dark:text-white"
            >
              {(loadingSteps[loadingStep] as Record<string, string>)[
                language
              ] || loadingSteps[loadingStep].en}
            </motion.h2>
            <div className="w-full bg-slate-100 dark:bg-slate-900 h-1 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 15, ease: "linear" }}
                className="h-full bg-blue-600"
              />
            </div>
          </div>

          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.5em] animate-pulse">
            SCI ENGINE v4.2 — High Precision Strategic Audit
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-rose-50 dark:bg-rose-900/10 rounded-[3rem] border border-rose-100 dark:border-rose-900/20">
        <h2 className="text-2xl font-black text-rose-600 uppercase mb-4">
          Engine Interrupted
        </h2>
        <p className="font-bold text-slate-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-8 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs"
        >
          Retry Diagnostic
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-12 max-w-5xl mx-auto"
    >
      <div className="p-10 md:p-14 rounded-[3.5rem] bg-linear-to-br from-blue-600 via-indigo-600 to-violet-700 border border-white/20 text-white shadow-[0_20px_60px_rgba(79,70,229,0.4)] overflow-hidden relative group">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />
        </div>
        <motion.div
           initial={{ x: -100, opacity: 0 }}
           animate={{ x: 0, opacity: 1 }}
           className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left"
        >
          <div className="p-6 bg-white/10 rounded-full backdrop-blur-md border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform duration-500">
            <CheckCircle2 size={56} strokeWidth={1.5} className="text-emerald-400" />
          </div>
          <div className="space-y-3">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-black uppercase tracking-widest text-emerald-300 mb-2">
                <Sparkles size={12} /> Strategic Signal Locked
             </div>
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none drop-shadow-2xl">
              {t.complete}
            </h2>
            <p className="font-black opacity-80 uppercase tracking-[0.4em] text-[10px] md:text-xs">
              {t.completeSub}
            </p>
          </div>
        </motion.div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-[80px]" />
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-indigo-400/20 rounded-full blur-[60px]" />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="p-10 rounded-[3rem] bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-2xl space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Target size={120} />
          </div>
          <h3 className="font-black uppercase text-xs text-blue-600 tracking-[0.4em] relative z-10">
            {t.profile}
          </h3>
          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-6 rounded-4xl border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all hover:border-emerald-500/30">
              <span className="text-xs font-black uppercase text-slate-400 tracking-wider">
                {t.authority}
              </span>
              <span className="font-black text-4xl text-emerald-500">
                {auditData?.authorityScore}%
              </span>
            </div>
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-6 rounded-4xl border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all hover:border-blue-500/30">
              <span className="text-xs font-black uppercase text-slate-400 tracking-wider">
                {t.alignment}
              </span>
              <span className="font-black text-lg text-blue-600 uppercase tracking-tight">
                {auditData?.profileLevel}
              </span>
            </div>
          </div>
          <div className="pt-4 space-y-2 border-t border-slate-100 dark:border-slate-800 relative z-10">
            <p className="text-sm text-slate-600 dark:text-slate-400 font-bold leading-relaxed italic">
              &quot;{auditData?.verdict}&quot;
            </p>
          </div>
        </div>

        <div className="p-10 rounded-[3rem] bg-slate-900 dark:bg-black border border-slate-800 text-white shadow-2xl relative overflow-hidden space-y-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full blur-[80px]" />
          <h3 className="font-black uppercase text-xs text-orange-500 tracking-[0.4em] relative z-10 flex items-center gap-3">
            <AlertTriangle size={18} /> {t.gaps}
          </h3>
          <ul className="space-y-4 relative z-10">
            {auditData?.gaps?.map((gap: string, i: number) => (
              <li
                key={i}
                className="flex items-start gap-4 text-sm font-bold leading-relaxed text-slate-300 group p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500 mt-1.5 shrink-0 group-hover:scale-150 transition-transform shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                {gap}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-6 pt-6">
        <h3 className="font-black uppercase text-xs text-slate-400 tracking-[0.4em] text-center flex items-center justify-center gap-3">
          <Eye size={18} /> Vision Alignment Analysis
        </h3>
        <p className="text-center text-lg md:text-xl text-slate-700 dark:text-slate-300 font-bold italic leading-relaxed max-w-4xl mx-auto px-6">
          &quot;{auditData?.visionAnalysis}&quot;
        </p>
      </div>

      <div className="flex justify-center pt-10">
        <button
          onClick={onNext}
          className="group flex items-center gap-6 px-14 py-6 bg-emerald-600 text-white font-black uppercase tracking-[0.3em] text-lg rounded-4xl shadow-[0_20px_40px_rgba(16,185,129,0.3)] hover:shadow-[0_25px_50px_rgba(16,185,129,0.4)] hover:scale-105 transition-all outline-none"
        >
          {t.cta}{" "}
          <ChevronRight className="group-hover:translate-x-2 transition-transform w-8 h-8" />
        </button>
      </div>
    </motion.div>
  );
}
