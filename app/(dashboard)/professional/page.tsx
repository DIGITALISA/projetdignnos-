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
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12">
        <div className="relative">
          <div className="w-48 h-48 rounded-full border-4 border-slate-100 dark:border-slate-800 animate-spin border-t-blue-600" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Cpu className="text-blue-600 w-16 h-16 animate-pulse" />
          </div>
        </div>
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-black uppercase tracking-tight">
            {t.finalizing}
          </h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.4em]">
            {t.analysisStep}
          </p>
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
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black uppercase tracking-tight">
          {t.title}
        </h2>
        <p className="text-slate-500 font-medium px-4">{t.subtitle}</p>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 h-[500px] flex flex-col overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 bg-white/50 dark:bg-slate-950/50">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white">
            <Shield size={24} />
          </div>
          <div>
            <div className="font-black text-xs uppercase tracking-widest text-blue-600">
              Senior HR Strategist
            </div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
              Status: Evaluation in Progress
            </div>
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
                y: 10,
                x: m.role === "assistant" ? -10 : 10,
              }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              className={cn(
                "flex items-end gap-3",
                m.role === "user" ? "flex-row-reverse" : "flex-row",
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  m.role === "assistant"
                    ? "bg-slate-200 dark:bg-slate-800"
                    : "bg-blue-600 text-white",
                )}
              >
                {m.role === "assistant" ? (
                  <Cpu size={14} />
                ) : (
                  <User size={14} />
                )}
              </div>
              <div
                className={cn(
                  "max-w-[80%] p-4 rounded-3xl font-medium text-sm leading-relaxed",
                  m.role === "assistant"
                    ? "bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-bl-none"
                    : "bg-blue-600 text-white rounded-br-none",
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
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                  <Cpu size={14} className="animate-spin" />
                </div>
                <div className="p-4 rounded-3xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 animate-pulse text-[10px] font-black uppercase tracking-widest">
                  Thought process active...
                </div>
              </div>
            )}
        </div>

        <div className="p-6 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex gap-4">
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
            className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-3 text-sm font-medium outline-none focus:border-blue-600 transition-colors resize-none h-14"
          />
          <button
            onClick={handleSend}
            disabled={!currentInput.trim() || loading}
            className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-50 transition-all shadow-xl shadow-blue-600/20"
          >
            <Send size={24} />
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12">
        <div className="relative">
          <div className="w-48 h-48 rounded-full border-4 border-slate-100 dark:border-slate-800 animate-spin border-t-indigo-600" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Cpu className="text-indigo-600 w-16 h-16 animate-pulse" />
          </div>
        </div>
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-black uppercase tracking-tight">
            Synthesizing Strategic X-Ray Report...
          </h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.4em] text-center">
            Cross-referencing all audit data, interview transcripts & MCQ
            results
          </p>
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
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Question{" "}
            {Math.min(assistantCount + (loading ? 0 : 0), TOTAL_QUESTIONS)} /{" "}
            {TOTAL_QUESTIONS}
          </span>
          <span
            className={cn(
              "text-[10px] font-black uppercase tracking-widest transition-colors",
              isPivotalPhase ? "text-amber-500" : "text-indigo-500",
            )}
          >
            {isPivotalPhase
              ? "⚡ PIVOTAL PHASE"
              : `Phase 1 — ${PHASE_LABELS[Math.max(assistantCount - 1, 0)]?.label || ""}`}
          </span>
        </div>
        <div className="flex gap-1.5">
          {PHASE_LABELS.map((phase, i) => (
            <div key={i} className="flex-1 space-y-1">
              <motion.div
                className={cn(
                  "h-2 rounded-full transition-all",
                  i < assistantCount
                    ? i === 4
                      ? "bg-amber-500"
                      : "bg-indigo-500"
                    : i === assistantCount && !loading
                      ? i === 4
                        ? "bg-amber-500/60"
                        : "bg-indigo-500/30"
                      : "bg-slate-100 dark:bg-slate-800",
                )}
              />
              <div
                className={cn(
                  "text-[7px] font-black uppercase tracking-widest text-center truncate hidden md:block",
                  i < assistantCount
                    ? i === 4
                      ? "text-amber-500"
                      : "text-indigo-500"
                    : "text-slate-300 dark:text-slate-700",
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[3rem] shadow-2xl overflow-hidden"
          >
            {/* Chat header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                <Shield size={22} />
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
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex",
                    m.role === "assistant" ? "justify-start" : "justify-end",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] p-5 rounded-3xl text-sm font-medium leading-relaxed",
                      m.role === "assistant"
                        ? "bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-100 dark:border-slate-800"
                        : "bg-indigo-600 text-white rounded-br-none shadow-lg shadow-indigo-600/20",
                    )}
                  >
                    {m.content}
                  </div>
                </motion.div>
              ))}
              {loading && messages.length > 0 && (
                <div className="flex justify-start">
                  <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-3xl rounded-bl-none animate-pulse text-[10px] font-black uppercase tracking-widest text-slate-400">
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12">
        <div className="relative">
          <div className="w-48 h-48 rounded-full border-4 border-slate-100 dark:border-slate-800 animate-spin border-t-emerald-600" />
          <div className="absolute inset-0 flex items-center justify-center">
            <TrendingUp className="text-emerald-600 w-16 h-16 animate-pulse" />
          </div>
        </div>
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-black uppercase tracking-tight">
            {t.mcqLoading}
          </h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.4em]">
            {phase === "hard" ? t.hardSkillsTitle : t.softSkillsTitle}
          </p>
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-10 py-12"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-4xl font-black uppercase tracking-tight">
            {t.mcqTitle}
          </h2>
          <p className="text-slate-500 font-medium">
            {phase === "hard" ? t.hardSkillsTitle : t.softSkillsTitle}
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
            Question {currentIndex + 1} / {questions.length}
          </div>
          <div className="w-48 bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-emerald-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 p-12 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl space-y-10">
        <h3 className="text-2xl font-black leading-tight text-slate-800 dark:text-white">
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
                  "p-6 rounded-3xl border-2 text-left transition-all duration-300 flex items-center gap-4 group",
                  status === "idle" &&
                    "border-slate-100 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-500/5",
                  status === "correct" &&
                    "border-emerald-500 bg-emerald-500/10 text-emerald-600",
                  status === "incorrect" &&
                    "border-rose-500 bg-rose-500/10 text-rose-600",
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-black text-xs",
                    status === "idle" &&
                      "bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-emerald-500 group-hover:text-white",
                    status === "correct" && "bg-emerald-500 text-white",
                    status === "incorrect" && "bg-rose-500 text-white",
                  )}
                >
                  {String.fromCharCode(65 + i)}
                </div>
                <span className="font-bold">{opt}</span>
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
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em]">
          <CheckCircle2 size={16} /> Audit Strategicized & Certified
        </div>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-[0.9]">
          {t.title}
        </h1>
        <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
          {t.subtitle}
        </p>
      </div>

      {/* === TOP MODULE: STRATEGIC RADAR & AUTHORITY MATRIX === */}
      {(report.strategicRadar || report.authorityVsPotential) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {report.strategicRadar && (
            <div className="p-10 rounded-[3rem] bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-2xl space-y-8">
              <div className="flex items-center gap-3 text-blue-600">
                <BarChart3 size={24} />
                <h3 className="text-xl font-black uppercase tracking-tight">
                  Strategic Competency Radar
                </h3>
              </div>
              <div className="space-y-6">
                {Object.entries(report.strategicRadar).map(([key, val]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest px-1">
                      <span className="text-slate-500">{key}</span>
                      <span className="text-blue-600">{val}/10</span>
                    </div>
                    <div className="w-full h-2 bg-slate-50 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(val / 10) * 100}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="h-full bg-linear-to-r from-blue-500 to-indigo-600 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {report.authorityVsPotential && (
            <div className="p-10 rounded-[3rem] bg-linear-to-br from-slate-900 to-black text-white shadow-2xl space-y-10 relative overflow-hidden flex flex-col justify-center">
              <div className="absolute top-0 right-0 p-12 opacity-5">
                <Target size={200} />
              </div>
              <div className="space-y-2 relative z-10">
                <h4 className="text-emerald-400 font-black uppercase text-[10px] tracking-[0.4em]">
                  Strategic Archetype
                </h4>
                <h3 className="text-4xl font-black uppercase leading-tight tracking-tighter">
                  {report.authorityVsPotential.quadrant}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-8 relative z-10">
                <div className="space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Current Authority
                  </div>
                  <div className="text-4xl font-black text-white">
                    {report.authorityVsPotential.currentAuthority}%
                  </div>
                  <div className="w-full h-1 bg-slate-800 rounded-full">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${report.authorityVsPotential.currentAuthority}%`,
                      }}
                      className="h-full bg-emerald-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Future Potential
                  </div>
                  <div className="text-4xl font-black text-white">
                    {report.authorityVsPotential.futurePotential}%
                  </div>
                  <div className="w-full h-1 bg-slate-800 rounded-full">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${report.authorityVsPotential.futurePotential}%`,
                      }}
                      className="h-full bg-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-medium leading-relaxed italic text-slate-300 relative z-10">
                Diagnostic: High-precision mapping of current market weight vs.
                native cognitive adaptability.
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

          <div className="p-10 rounded-[3.5rem] bg-linear-to-br from-blue-600 to-indigo-700 text-white shadow-2xl relative overflow-hidden">
            <Shield className="absolute -top-10 -right-10 w-64 h-64 text-white/5 rotate-12" />
            <h3 className="text-3xl font-black uppercase tracking-tight mb-8 relative z-10">
              {t.finalVerdict}
            </h3>
            <p className="text-xl font-bold leading-relaxed relative z-10 text-blue-50">
              {report.finalVerdict}
            </p>
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
    // We use a small timeout to avoid the "cascading renders" error during direct hydration execution
    // which some strict linters/React dev builds flag as problematic
    const hydrate = () => {
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

      setIsHydrated(true);
    };

    const timeout = setTimeout(hydrate, 0);
    return () => clearTimeout(timeout);
  }, []);

  // Persistence: Save on Change
  useEffect(() => {
    if (!isHydrated) return;
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

    // Save form data without the file object (omit cv using the rest pattern)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { cv: _, ...dataToSave } = formData;
    localStorage.setItem("prof_formData", JSON.stringify(dataToSave));
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
  const STEP_LABELS: Record<Step, string> = {
    language: "Language",
    welcome: "Welcome",
    "audit-form": "Profile",
    "experience-input": "Evidence",
    "initial-analysis": "Analysis",
    "expert-interview": "Interview",
    "mcq-assessment": "MCQ",
    "portfolio-interview": "Portfolio",
    "final-report": "Report",
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
        "min-h-screen bg-white dark:bg-[#06080a] text-slate-900 dark:text-white p-6 lg:p-12 font-sans selection:bg-blue-500/30 transition-colors duration-500",
        dir === "rtl" ? "font-arabic" : "font-sans",
      )}
      dir={dir}
    >
      <div className="max-w-4xl mx-auto">
        {/* Top bar with Logout */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/5 transition-all text-[10px] font-black uppercase tracking-widest"
          >
            <LogOut size={16} />
            {t.welcome.logout || "Log Out"}
          </button>
        </div>

        {/* === PROGRESS BAR === */}
        {step !== "welcome" && (
          <div className="mb-8 space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                Step {currentStepIndex + 1} / {STEPS.length}
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">
                {STEP_LABELS[step]}
              </div>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full bg-linear-to-r from-indigo-500 to-violet-500 rounded-full"
              />
            </div>
            <div className="hidden md:flex justify-between">
              {STEPS.map((s, i) => (
                <div
                  key={s}
                  className={cn(
                    "text-[8px] font-black uppercase tracking-widest transition-colors",
                    i <= currentStepIndex
                      ? "text-indigo-500"
                      : "text-slate-300 dark:text-slate-700",
                  )}
                >
                  {STEP_LABELS[s]}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === LOGOUT CONFIRMATION DIALOG === */}
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
                <div className="w-16 h-16 rounded-3xl bg-red-500/10 flex items-center justify-center mx-auto">
                  <LogOut className="text-red-500" size={28} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black uppercase tracking-tight">
                    {currentLang === "ar" ? "هل أنت متأكد؟" : "Are you sure?"}
                  </h3>
                  <p className="text-slate-500 font-medium text-sm">
                    {currentLang === "ar"
                      ? "سيتم حذف كل تقدمك في التدقيق الاستراتيجي ولا يمكن استعادته."
                      : "All your audit progress will be permanently deleted and cannot be recovered."}
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
                    className="flex-1 py-4 rounded-2xl bg-red-500 text-white font-black uppercase text-xs tracking-widest hover:bg-red-600 transition-all"
                  >
                    {currentLang === "ar" ? "خروج" : "Log Out"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step Navigation Hooks */}
        {step !== "welcome" && step !== "initial-analysis" && (
          <div className="flex justify-between items-center mb-8 px-2">
            <button
              onClick={prevStep}
              className="group flex items-center gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 transition-all hover:shadow-xl"
            >
              <ChevronLeft
                className={cn(
                  "w-6 h-6 transition-transform group-hover:-translate-x-1",
                  dir === "rtl" && "rotate-180 group-hover:translate-x-1",
                )}
              />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                {t.welcome.back || "Back"}
              </span>
            </button>

            <button
              onClick={nextStep}
              className="group flex items-center gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 transition-all hover:shadow-xl"
            >
              <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                {t.welcome.next || "Fast Forward"}
              </span>
              <ChevronRight
                className={cn(
                  "w-6 h-6 transition-transform group-hover:translate-x-1",
                  dir === "rtl" && "rotate-180 group-hover:-translate-x-1",
                )}
              />
            </button>
          </div>
        )}

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
      className="space-y-12"
    >
      <div className="space-y-4 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-[0.2em]">
          <Shield size={14} /> {t.tag}
        </div>
        <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-[0.9] uppercase">
          {(t.title || "").split(" ").map((word: string, i: number) =>
            i > 2 ? (
              <span
                key={i}
                className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-indigo-500 to-purple-600 block md:inline"
              >
                {word}{" "}
              </span>
            ) : (
              word + " "
            ),
          )}
        </h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {t.steps?.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group flex items-start gap-5 p-6 rounded-4xl bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/50 hover:bg-white dark:hover:bg-slate-900 transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)]"
          >
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-sm transition-colors group-hover:bg-blue-600 group-hover:text-white">
              {icons[i]}
            </div>
            <div>
              <h3 className="font-black text-lg uppercase tracking-tight">
                {s.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                {s.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center md:justify-start">
        <button
          onClick={onNext}
          className="group relative inline-flex items-center justify-center gap-4 px-10 py-5 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black text-xl uppercase tracking-widest overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>{t.cta}</span>
          <ArrowRight
            size={24}
            className="transition-transform group-hover:translate-x-2"
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
      <div className="flex justify-center mb-8">
        <div className="p-6 rounded-4xl bg-blue-600/10 text-blue-600 animate-pulse">
          <Languages size={64} />
        </div>
      </div>
      <h2 className="text-4xl md:text-5xl font-black uppercase mb-4">
        {t.title}
      </h2>
      <p className="text-xl text-slate-500 mb-16 font-medium">{t.subtitle}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {options.map((opt) => (
          <button
            key={opt.code}
            onClick={() => onSelect(opt.code)}
            className={cn(
              "group p-10 rounded-[2.5rem] border-4 transition-all text-left relative overflow-hidden",
              selected === opt.code
                ? "border-blue-600 bg-blue-600/5 shadow-2xl"
                : "border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700",
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
      <div className="flex items-center gap-6 mb-4">
        <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500">
          <Info size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight">
            {t.title}
          </h2>
          <p className="text-lg text-slate-500 font-medium">{t.subtitle}</p>
        </div>
      </div>

      <div className="space-y-8 bg-slate-50/50 dark:bg-slate-900/30 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50">
        <div className="space-y-3">
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
                className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-sm"
              >
                <span className="font-black text-sm uppercase tracking-tight">
                  {p.title} <span className="text-blue-600 mx-2">—</span>{" "}
                  {p.years} {t.years || "years"}
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
              className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 active:scale-95"
            >
              <Plus size={24} />
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
            className="w-full h-40 bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-4xl px-8 py-6 font-bold focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all outline-none resize-none"
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

      <div className="max-w-4xl mx-auto">
        <div
          className={cn(
            "p-12 rounded-[3.5rem] border-4 transition-all text-center space-y-10 group relative bg-indigo-600/5 border-indigo-600 shadow-2xl",
          )}
        >
          <div className="inline-flex p-8 rounded-3xl bg-indigo-600/10 text-indigo-600 transition-transform group-hover:-rotate-6 group-hover:scale-110">
            <Mic size={80} />
          </div>
          <div className="space-y-4">
            <h3 className="text-3xl font-black uppercase tracking-tight">
              {t.storyTitle}
            </h3>
            <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.2em] max-w-md mx-auto leading-relaxed">
              {t.storyDesc}
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pt-4"
            onClick={(e) => e.stopPropagation()}
          >
            <textarea
              className="w-full h-80 p-10 bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-[2.5rem] text-xl font-medium outline-none focus:border-indigo-600 transition-all resize-none shadow-inner leading-relaxed"
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
            {formData.careerStory.length >= 1 && !confirmed && (
              <button
                onClick={() => setConfirmed(true)}
                className="mt-6 w-full py-6 bg-indigo-600 text-white font-black rounded-3xl hover:bg-indigo-700 transition-all shadow-xl uppercase tracking-[0.2em] text-sm active:scale-95"
              >
                {language === "ar" ? "تأكيد ما كتبت" : "Confirm My Story"}
              </button>
            )}

            {confirmed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center justify-center gap-2 text-indigo-600 font-black uppercase text-xs tracking-widest"
              >
                <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                {language === "ar"
                  ? "تم التأكيد - جاهز للتحليل"
                  : "Story Confirmed - Ready for Analysis"}
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
          <div className="w-64 h-64 rounded-full border-2 border-slate-100 dark:border-slate-800 flex items-center justify-center relative overflow-hidden shadow-2xl bg-white dark:bg-slate-950">
            {/* Rotating Grid Lines */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #3b82f6 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />

            {/* Scanning Bar */}
            <motion.div
              animate={{ y: [-150, 150] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_20px_rgba(59,130,246,0.5)] z-20"
            />

            {/* Inner Concentric Circles */}
            <div className="absolute inset-4 rounded-full border border-slate-100 dark:border-slate-800 flex items-center justify-center">
              <div className="absolute inset-8 rounded-full border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                <div className="absolute inset-12 rounded-full border border-blue-600/20 animate-ping" />
                <Cpu className="text-blue-600 w-16 h-16 animate-pulse" />
              </div>
            </div>

            {/* Rotating Outer Ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-4 border-dashed border-blue-600/20 rounded-full"
            />
          </div>

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
      className="space-y-10"
    >
      <div className="p-10 rounded-[3rem] bg-blue-600 text-white shadow-2xl shadow-blue-600/30 overflow-hidden relative">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="relative z-10 flex items-center gap-6"
        >
          <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
            <CheckCircle2 size={48} />
          </div>
          <div>
            <h2 className="text-4xl font-black uppercase italic tracking-tight leading-none">
              {t.complete}
            </h2>
            <p className="font-black opacity-80 uppercase tracking-[0.2em] text-[10px] mt-2">
              {t.completeSub}
            </p>
          </div>
        </motion.div>
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 space-y-6">
          <h3 className="font-black uppercase text-[10px] text-blue-600 tracking-[0.3em]">
            {t.profile}
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-xs font-black uppercase text-slate-400 tracking-wider font-sans">
                {t.authority}
              </span>
              <span className="font-black text-3xl text-emerald-500 font-serif">
                {auditData?.authorityScore}%
              </span>
            </div>
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-xs font-black uppercase text-slate-400 tracking-wider font-sans">
                {t.alignment}
              </span>
              <span className="font-black text-sm text-blue-600 uppercase tracking-tight">
                {auditData?.profileLevel}
              </span>
            </div>
          </div>
          <div className="pt-4 space-y-2">
            <p className="text-xs text-slate-500 font-bold uppercase leading-relaxed">
              {auditData?.verdict}
            </p>
          </div>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 space-y-6">
          <h3 className="font-black uppercase text-[10px] text-orange-600 tracking-[0.3em]">
            {t.gaps}
          </h3>
          <ul className="space-y-3">
            {auditData?.gaps?.map((gap: string, i: number) => (
              <li
                key={i}
                className="flex items-start gap-4 text-sm font-bold leading-tight group"
              >
                <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0 group-hover:scale-150 transition-transform" />
                {gap}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-black uppercase text-[10px] text-slate-400 tracking-[0.3em] text-center">
          Vision Alignment Analysis
        </h3>
        <p className="text-center text-slate-500 dark:text-slate-400 font-medium italic leading-relaxed max-w-3xl mx-auto px-6">
          &quot;{auditData?.visionAnalysis}&quot;
        </p>
      </div>

      <div className="flex justify-center pt-8">
        <button
          onClick={onNext}
          className="group flex items-center gap-4 px-12 py-5 bg-emerald-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-emerald-600/30 hover:scale-105 transition-all"
        >
          {t.cta}{" "}
          <ChevronRight className="group-hover:translate-x-2 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
