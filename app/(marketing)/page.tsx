"use client";

import { motion } from "framer-motion";
import {
  ArrowRight, CheckCircle2, Sparkles, Brain,
  GraduationCap, Briefcase, Shield, Zap, FileText, MessageSquare, Timer,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";

export default function Home() {
  const { dir, language } = useLanguage();
  const lang = (language as "en" | "fr" | "ar") || "fr";

  const T = {
    en: {
      badge: "100% Free Diagnostics — No Credit Card Required",
      title: "Choose Your",
      titleHl: "Professional Path",
      sub: "Each account type has its own free AI diagnostic. Register, complete your diagnostic, and start your personalized journey.",
      freeBadge: "Free",
      student: {
        tag: "Student",
        title: "Student Account",
        desc: "A comprehensive 8-stage AI journey that transforms your profile into a professional career roadmap with high-level simulations.",
        diagnostic: "Full 8-Stage Student Diagnostic",
        steps: [
          "AI ATS CV Audit & Analysis",
          "Executive Verification Interview",
          "Skills Accuracy & Readiness Report",
          "Role Discovery & AI Matching",
          "Professional CV & Cover Letter Studio",
          "Executive Behavioral Simulation",
          "Strategic Career Roadmap (Final)"
        ],
        cta: "Start Free — Student",
        href: "/register?plan=s-free",
        color: "blue",
      },
      pro: {
        tag: "Professional",
        title: "Professional Account",
        desc: "Navigate your career transformation with an elite 7-stage AI journey, expert-led workshops, and deep executive simulations.",
        diagnostic: "7-Stage Executive Diagnostic",
        steps: [
          "Global Competency & Gap Analysis",
          "Verification & Integrity Interview",
          "Role Discovery & Strategic Alignment",
          "AI-Powered High-Level Role Matching",
          "Executive CV & Portfolio Studio",
          "Scenario-Based Behavioral Simulation",
          "Full Executive Diagnostic Report"
        ],
        cta: "Start Free — Professional",
        href: "/register?plan=p-pro",
        color: "indigo",
      },
      expert: {
        tag: "Expert / Trainer",
        title: "Expert Account",
        desc: "Join our elite network. An AI Senior Peer evaluates your mastery, identifies strategic gaps, and validates your professional accreditation.",
        diagnostic: "AI-Expert Accreditation Process",
        steps: [
          "Live AI-Peer Assessment (5min/Q)",
          "Deep Methodology & Logic Analysis",
          "Anti-Fraud & Integrity Verification",
          "Professional Accreditation Report",
          "Visibility in Global Expert Directory"
        ],
        cta: "Apply as Expert",
        href: "/register?plan=x-expert",
        color: "violet",
      },
      trust: ["100% Free — No Card", "Instant AI Results", "3 Specialized Paths"],
      footer: "MA-TRAINING-CONSULTING © 2026 · All diagnostics are free · No hidden fees",
    },
    fr: {
      badge: "Diagnostics 100% Gratuits — Sans carte bancaire",
      title: "Choisissez votre",
      titleHl: "Parcours Professionnel",
      sub: "Chaque type de compte dispose d'un diagnostic IA gratuit. Inscrivez-vous, complétez votre diagnostic et commencez votre parcours personnalisé.",
      freeBadge: "Gratuit",
      student: {
        tag: "Étudiant",
        title: "Compte Étudiant",
        desc: "Un parcours IA complet en 8 étapes qui transforme votre profil en une feuille de route professionnelle avec des simulations exécutives de haut niveau.",
        diagnostic: "Diagnostic Étudiant en 8 Étapes",
        steps: [
          "Audit & Analyse CV ATS par l'IA",
          "Entretien Exécutif de Vérification",
          "Bilan de Précision & Aptitude",
          "Découverte de Rôle & Matching IA",
          "Studio CV Professional & Lettres",
          "Simulation Comportementale Exécutive",
          "Roadmap de Carrière (Rapport Final)"
        ],
        cta: "Commencer Gratuit — Étudiant",
        href: "/register?plan=s-free",
        color: "blue",
      },
      pro: {
        tag: "Professionnel",
        title: "Compte Professionnel",
        desc: "Naviguez votre transformation de carrière avec un parcours IA d'élite en 7 étapes, des ateliers d'experts et des simulations exécutives profondes.",
        diagnostic: "Diagnostic Exécutif en 7 Étapes",
        steps: [
          "Analyse Compétences & Lacunes Globales",
          "Entretien de Vérification & Intégrité",
          "Découverte de Rôle & Alignement Stratégique",
          "Matching IA de Haut Niveau",
          "Studio CV & Portfolio Exécutif",
          "Simulation de Mise en Situation",
          "Rapport Diagnostique Exécutif Complet"
        ],
        cta: "Commencer Gratuit — Pro",
        href: "/register?plan=p-pro",
        color: "indigo",
      },
      expert: {
        tag: "Expert / Formateur",
        title: "Compte Expert",
        desc: "Rejoignez notre réseau d'élites. Un pair senior IA évalue votre maîtrise, identifie vos lacunes stratégiques et valide votre accréditation.",
        diagnostic: "Accréditation Expert par l'IA",
        steps: [
          "Évaluation IA par les Pairs (5min/Q)",
          "Analyse de Méthodologie & Logique",
          "Vérification Anti-Fraude & Intégrité",
          "Rapport d'Accréditation Professionnel",
          "Visibilité dans l'Annuaire Global"
        ],
        cta: "Candidater comme Expert",
        href: "/register?plan=x-expert",
        color: "violet",
      },
      trust: ["100% Gratuit — Sans carte", "Résultats IA instantanés", "3 Parcours spécialisés"],
      footer: "MA-TRAINING-CONSULTING © 2026 · Tous les diagnostics sont gratuits · Aucun frais caché",
    },
    ar: {
      badge: "تشخيص مجاني 100% — بدون بطاقة بنكية",
      title: "اختر مسارك",
      titleHl: "المهني",
      sub: "كل نوع حساب له تشخيص ذكاء اصطناعي مجاني خاص به. سجّل، أكمل تشخيصك وابدأ رحلتك الشخصية.",
      freeBadge: "مجاني",
      student: {
        tag: "طالب",
        title: "حساب طالب",
        desc: "رحلة ذكاء اصطناعي متكاملة من 8 مراحل تحول ملفك الشخصي إلى خارطة طريق مهنية احترافية مع محاكاة تنفيذية عالية المستوى.",
        diagnostic: "تشخيص الطالب المتكامل (8 مراحل)",
        steps: [
          "تدقيق وتحليل الـ CV بمقاييس ATS",
          "مقابلة التحقق التنفيذية (AI)",
          "تقرير دقة المهارات والجاهزية",
          "اكتشاف الأدوار والمطابقة الذكية",
          "استوديو الـ CV والخطابات الاحترافية",
          "محاكاة السلوك التنفيذي للمهام",
          "خارطة الطريق الاستراتيجية (التقرير النهائي)"
        ],
        cta: "ابدأ مجاناً — طالب",
        href: "/register?plan=s-free",
        color: "blue",
      },
      pro: {
        tag: "محترف",
        title: "حساب محترف",
        desc: "شق مسار تحولك المهني عبر رحلة ذكاء اصطناعي نخبوية من 7 مراحل، ورشات خبراء ومحاكاة تنفيذية عميقة.",
        diagnostic: "تشخيص تنفيذي من 7 مراحل",
        steps: [
          "تحليل الكفاءات والفجوات العالمية",
          "مقابلة التحقق والنزاهة المهنية",
          "اكتشاف الأدوار والalignment الاستراتيجي",
          "مطابقة الأدوار القيادية بالذكاء الاصطناعي",
          "استوديو الـ CV والبروفايل التنفيذي",
          "محاكاة سلوكية لمواقف العمل",
          "تقرير التشخيص التنفيذي المتكامل"
        ],
        cta: "ابدأ مجاناً — محترف",
        href: "/register?plan=p-pro",
        color: "indigo",
      },
      expert: {
        tag: "خبير / مدرب",
        title: "حساب خبير",
        desc: "انضم لشبكة النخبة لدينا. خبير ذكاء اصطناعي أقدم يقيم مدى إتقانك، يحدد فجواتك الاستراتيجية ويعتمد كفاءتك.",
        diagnostic: "عملية اعتماد الخبراء بالـ AI",
        steps: [
          "تقييم مباشر من خبير افتراضي (5د/س)",
          "تحليل المنهجية والمنطق المهني",
          "التحقق من النزاهة وكشف التلاعب",
          "تقرير الاعتماد المهني النهائي",
          "ظهور في دليل الخبراء العالمي"
        ],
        cta: "التقدم كخبير",
        href: "/register?plan=x-expert",
        color: "violet",
      },
      trust: ["مجاني تماماً — بدون بطاقة", "تشخيص فوري بالذكاء الاصطناعي", "3 أنواع حسابات متخصصة"],
      footer: "MA-TRAINING-CONSULTING © 2026 · جميع التشخيصات مجانية · لا رسوم خفية",
    },
  }[lang];

  const COLOR = {
    blue: {
      border: "border-blue-500/20",
      bg: "bg-blue-500/5",
      accent: "text-blue-400",
      badge: "bg-blue-500/10 text-blue-300 border-blue-500/20",
      btn: "from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-blue-600/20",
      icon: "bg-blue-500/10 text-blue-400",
      check: "text-blue-400",
    },
    indigo: {
      border: "border-indigo-500/20",
      bg: "bg-indigo-500/5",
      accent: "text-indigo-400",
      badge: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
      btn: "from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 shadow-indigo-600/20",
      icon: "bg-indigo-500/10 text-indigo-400",
      check: "text-indigo-400",
    },
    violet: {
      border: "border-violet-500/20",
      bg: "bg-violet-500/5",
      accent: "text-violet-400",
      badge: "bg-violet-500/10 text-violet-300 border-violet-500/20",
      btn: "from-violet-600 to-indigo-700 hover:from-violet-500 hover:to-indigo-600 shadow-violet-600/20",
      icon: "bg-violet-500/10 text-violet-400",
      check: "text-violet-400",
    },
  } as const;

  const cards = [T.student, T.pro, T.expert] as const;
  const CardIcons = [GraduationCap, Briefcase, Shield] as const;
  const DiagIcons = [FileText, Brain, MessageSquare] as const;
  const TrustIcons = [Sparkles, Shield, Zap] as const;
  const trustColors = ["text-emerald-400", "text-blue-400", "text-violet-400"] as const;

  return (
    <div
      className={cn(
        "min-h-screen bg-[#050810] text-white overflow-x-hidden selection:bg-blue-500/30",
        lang === "ar" ? "font-arabic" : "font-sans"
      )}
      dir={dir}
    >
      {/* ── Ambient background ── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[700px] h-[500px] bg-blue-600/8 rounded-full blur-[160px]" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-violet-600/8 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 w-[600px] h-[400px] bg-indigo-600/8 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-size-[56px_56px]" />
      </div>

      <main className="relative z-10 container mx-auto px-5 py-24 md:py-32 max-w-7xl">

        {/* ══ Hero ══ */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 mb-8"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-emerald-300">
              {T.badge}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-[1.02]"
          >
            {T.title}{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-indigo-400 to-violet-400">
              {T.titleHl}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            {T.sub}
          </motion.p>
        </div>

        {/* ══ 3 Account Cards ══ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card, i) => {
            const c = COLOR[card.color as keyof typeof COLOR];
            const Icon = CardIcons[i];
            const DiagIcon = DiagIcons[i];
            const isExpert = i === 2;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                whileHover={{ y: -6 }}
                className={cn(
                  "relative flex flex-col rounded-4xl border p-8 transition-all duration-300",
                  "bg-slate-900/50 backdrop-blur-sm hover:shadow-2xl",
                  c.border,
                  isExpert && "md:ring-1 md:ring-violet-500/30"
                )}
              >
                {/* Expert pill */}
                {isExpert && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-1.5 rounded-full bg-linear-to-r from-violet-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-violet-500/30 flex items-center gap-1.5">
                    <Zap className="w-3 h-3" />
                    Experts &amp; Trainers
                  </div>
                )}

                {/* Header */}
                <div className="mb-6 mt-2">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-5", c.icon)}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={cn("inline-block text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border mb-3", c.badge)}>
                    {card.tag}
                  </span>
                  <h2 className="text-2xl font-black text-white mb-2">{card.title}</h2>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">{card.desc}</p>
                </div>

                {/* Diagnostic box */}
                <div className={cn("rounded-2xl border p-5 mb-6", c.bg, c.border)}>
                  <div className="flex items-center gap-2.5 mb-4">
                    <DiagIcon className={cn("w-4 h-4 shrink-0", c.accent)} />
                    <span className={cn("text-[10px] font-black uppercase tracking-widest", c.accent)}>
                      {card.diagnostic}
                    </span>
                    <span className="ml-auto text-[9px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      {T.freeBadge}
                    </span>
                  </div>

                  <ul className="space-y-2.5">
                    {card.steps.map((step, j) => (
                      <li key={j} className="flex items-start gap-2.5">
                        <CheckCircle2 className={cn("w-4 h-4 shrink-0 mt-0.5", c.check)} />
                        <span className="text-slate-300 text-xs font-medium leading-snug">{step}</span>
                      </li>
                    ))}
                  </ul>

                  {isExpert && (
                    <div className="mt-4 flex items-center gap-2 text-amber-400/80 text-[10px] font-bold">
                      <Timer className="w-3.5 h-3.5 shrink-0" />
                      <span>5 min max / question · Anti-triche</span>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <Link
                  href={isExpert ? "#" : card.href}
                  className={cn(
                    "mt-auto w-full flex items-center justify-center gap-3 py-4 rounded-2xl",
                    "bg-linear-to-r text-white font-black text-xs uppercase tracking-widest",
                    "transition-all duration-300 shadow-lg",
                    !isExpert ? "hover:scale-[1.02] active:scale-[0.98]" : "opacity-40 grayscale cursor-not-allowed",
                    c.btn
                  )}
                >
                  {isExpert 
                    ? (lang === 'ar' ? 'غير جاهز حالياً' : lang === 'fr' ? 'Prochainement' : 'Coming Soon') 
                    : card.cta}
                  {!isExpert && <ArrowRight className="w-4 h-4" />}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* ══ Trust row ══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-8"
        >
          {T.trust.map((text, i) => {
            const TIcon = TrustIcons[i];
            return (
              <div key={i} className="flex items-center gap-2">
                <TIcon className={cn("w-4 h-4 shrink-0", trustColors[i])} />
                <span className="text-slate-400 text-xs font-bold">{text}</span>
              </div>
            );
          })}
        </motion.div>

        {/* ══ Footer ══ */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-[11px] font-bold uppercase tracking-widest text-slate-700 mt-16 pt-8 border-t border-slate-800/50"
        >
          {T.footer}
        </motion.p>
      </main>
    </div>
  );
}
