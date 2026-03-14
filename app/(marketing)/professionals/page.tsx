"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  ArrowRight, CheckCircle2, Sparkles, Brain, ChevronDown,
  Crown, Star, GraduationCap, Briefcase, Shield, Zap, FileText, MessageSquare, Timer
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";
import {
  NAV, HERO, PAIN, SOLUTION, COHORT, PATHS,
  EXPERT_MODULES, PROOF, PRICING, FAQ, FINAL_CTA, FOOTER
} from "./content";

type Lang = "en" | "fr" | "ar";

// ─── FADE IN COMPONENT ───────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = "", direction = "up" }: {
  children: React.ReactNode; delay?: number; className?: string; direction?: "up" | "left" | "right" | "none";
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const initial = direction === "up" ? { opacity: 0, y: 40 } : direction === "left" ? { opacity: 0, x: -40 } : direction === "right" ? { opacity: 0, x: 40 } : { opacity: 0 };
  return (
    <motion.div ref={ref} initial={initial} animate={inView ? { opacity: 1, x: 0, y: 0 } : initial}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

// ─── COUNTER ─────────────────────────────────────────────────────────────────




// ─── EFFECTS ───────────────────────────────────────────────────────────────────


// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function ProfessionalsPage() {
  const { language, dir } = useLanguage();
  const lang: Lang = (language as Lang) || "en";

  // Dynamic Translations
  const t = {
    nav: NAV[lang],
    hero: HERO[lang],
    pain: PAIN[lang],
    solution: SOLUTION[lang],
    cohort: COHORT[lang],
    paths: PATHS[lang],
    expertModules: EXPERT_MODULES[lang],
    proof: PROOF[lang],
    pricing: PRICING[lang],
    faq: FAQ[lang],
    finalCta: FINAL_CTA[lang],
    footer: FOOTER[lang]
  };

  const [openFaq, setOpenFaq] = useState<number | null>(null);




  return (
    <div className={cn("min-h-screen bg-[#040812] text-white overflow-x-hidden selection:bg-blue-500/30", lang === "ar" ? "font-arabic" : "font-sans")} dir={dir}>

      {/* ── AMBIENT BG ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div animate={{ x: [-50, 50, -50], y: [-20, 20, -20] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-blue-600/10 rounded-full blur-[150px]" />
        <motion.div animate={{ x: [50, -50, 50], y: [20, -20, 20] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-700/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[48px_48px]" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 1 — HERO                                                   */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 1 — HERO (3 CARDS VERSION)                                 */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center px-5 py-24 md:py-32 z-10">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 mb-8"
            >
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-emerald-300">
                {lang === 'ar' ? "تشخيص مجاني 100% — بدون بطاقة بنكية" : lang === 'fr' ? "Diagnostics 100% Gratuits — Sans carte" : "100% Free Diagnostics — No Card"}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-[1.02]"
            >
              {lang === 'ar' ? "اختر مسارك" : lang === 'fr' ? "Choisissez votre" : "Choose Your"}{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-indigo-400 to-violet-400">
                {lang === 'ar' ? "المهني" : lang === 'fr' ? "Parcours Professionnel" : "Professional Path"}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed"
            >
              {lang === 'ar' ? "كل نوع حساب له تشخيص ذكاء اصطناعي مجاني خاص به. سجّل، أكمل تشخيصك وابدأ رحلتك الشخصية." : 
               lang === 'fr' ? "Chaque type de compte dispose d'un diagnostic IA gratuit. Inscrivez-vous, complétez votre diagnostic et commencez votre parcours personnalisé." : 
               "Each account type has its own free AI diagnostic. Register, complete your diagnostic, and start your personalized journey."}
            </motion.p>
          </div>

          {/* 3 Account Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                color: "blue", tag: lang === 'ar' ? "طالب" : lang === 'fr' ? "Étudiant" : "Student",
                title: lang === 'ar' ? "حساب طالب" : lang === 'fr' ? "Compte Étudiant" : "Student Account",
                desc: lang === 'ar' ? "حلّل سيرتك الذاتية، اكتشف فجواتك المهنية، واحصل على خارطة طريق لإطلاق مسيرتك." : lang === 'fr' ? "Analysez votre CV, découvrez vos lacunes et obtenez une feuille de route pour lancer votre carrière." : "Analyze your CV, discover your career gaps, and get a roadmap to launch your career.",
                diag: lang === 'ar' ? "تشخيص الطالب" : lang === 'fr' ? "Diagnostic Étudiant" : "Student Diagnostic",
                steps: lang === 'ar' ? ["تحليل ذكي للسيرة الذاتية", "مقابلة محاكاة", "تقرير مهني"] : lang === 'fr' ? ["Analyse IA de CV", "Entretien RH simulé", "Rapport stratégique"] : ["AI CV Analysis", "Simulated HR Interview", "Strategic Report"],
                cta: lang === 'ar' ? "ابدأ مجاناً — طالب" : lang === 'fr' ? "Commencer Gratuit — Étudiant" : "Start Free — Student",
                href: "/register?plan=s-free", icon: GraduationCap, diagIcon: FileText
              },
              {
                color: "indigo", tag: lang === 'ar' ? "محترف" : lang === 'fr' ? "Professionnel" : "Professional",
                title: lang === 'ar' ? "حساب محترف" : lang === 'fr' ? "Compte Professionnel" : "Professional Account",
                desc: lang === 'ar' ? "شق مسار تحولك المهني عبر رحلة ذكية من 7 مراحل، ورشات خبراء ومحاكاة تنفيذية." : lang === 'fr' ? "Naviguez votre transformation via un parcours en 7 étapes, ateliers experts et simulations." : "Navigate your transformation via a 7-stage journey, expert workshops and simulations.",
                diag: lang === 'ar' ? "تشخيص المحترف" : lang === 'fr' ? "Diagnostic Professionnel" : "Professional Diagnostic",
                steps: lang === 'ar' ? ["تحليل الفجوات", "رحلة 7 مراحل", "تدريب تنفيذي"] : lang === 'fr' ? ["Analyse des lacunes", "Parcours 7 étapes", "Coaching exécutif"] : ["Gap Analysis", "7-Stage Journey", "Executive Coaching"],
                cta: lang === 'ar' ? "ابدأ مجاناً — محترف" : lang === 'fr' ? "Commencer Gratuit — Pro" : "Start Free — Professional",
                href: "/register?plan=p-pro", icon: Briefcase, diagIcon: Brain
              },
              {
                color: "violet", tag: lang === 'ar' ? "خبير / مدرب" : lang === 'fr' ? "Expert / Formateur" : "Expert / Trainer",
                title: lang === 'ar' ? "حساب خبير" : lang === 'fr' ? "Compte Expert" : "Expert Account",
                desc: lang === 'ar' ? "انضم لشبكة خبرائنا. خبير ذكاء اصطناعي يحاورك، يحدد فجواتك ويُنشئ تقريراً شاملاً." : lang === 'fr' ? "Rejoignez notre réseau. Un pair IA vous interviewe, identifie vos lacunes et génère un rapport." : "Join our network. An AI peer interviews you, identifies your gaps and generates a report.",
                diag: lang === 'ar' ? "اعتماد خبير IA" : lang === 'fr' ? "Accréditation Expert IA" : "Expert AI Accreditation",
                steps: lang === 'ar' ? ["مقابلة حية (5د/سؤال)", "تحليل خبرة", "تقرير تشخيصي"] : lang === 'fr' ? ["Entretien live (5min/Q)", "Analyse expertise", "Rapport diagnostique"] : ["Live Interview (5min/Q)", "Expertise Analysis", "Diagnostic Report"],
                cta: lang === 'ar' ? "التقدم كخبير" : lang === 'fr' ? "Candidater comme Expert" : "Apply as Expert",
                href: "/register?plan=x-expert", icon: Shield, diagIcon: MessageSquare, isExpert: true
              }
            ].map((card, i) => {
              interface ColorStyle {
                border: string;
                bg: string;
                accent: string;
                badge: string;
                btn: string;
                icon: string;
                check: string;
              }
              const colors: Record<string, ColorStyle> = {
                blue: { border: "border-blue-500/20", bg: "bg-blue-500/5", accent: "text-blue-400", badge: "bg-blue-500/10 text-blue-300 border-blue-500/20", btn: "from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-blue-600/20", icon: "bg-blue-500/10 text-blue-400", check: "text-blue-400" },
                indigo: { border: "border-indigo-500/20", bg: "bg-indigo-500/5", accent: "text-indigo-400", badge: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20", btn: "from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 shadow-indigo-600/20", icon: "bg-indigo-500/10 text-indigo-400", check: "text-indigo-400" },
                violet: { border: "border-violet-500/20", bg: "bg-violet-500/5", accent: "text-violet-400", badge: "bg-violet-500/10 text-violet-300 border-violet-500/20", btn: "from-violet-600 to-indigo-700 hover:from-violet-500 hover:to-indigo-600 shadow-violet-600/20", icon: "bg-violet-500/10 text-violet-400", check: "text-violet-400" }
              };
              const c = colors[card.color];
              const Icon = card.icon;
              const DiagIcon = card.diagIcon;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  whileHover={{ y: -6 }}
                  className={cn(
                    "relative flex flex-col rounded-4xl border p-8 transition-all duration-300",
                    "bg-slate-900/40 backdrop-blur-sm hover:shadow-2xl",
                    c.border,
                    card.isExpert && "md:ring-1 md:ring-violet-500/30"
                  )}
                >
                   {card.isExpert && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-1.5 rounded-full bg-linear-to-r from-violet-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-violet-500/30 flex items-center gap-1.5">
                      <Zap className="w-3 h-3" />
                      Experts & Trainers
                    </div>
                  )}

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

                  <div className={cn("rounded-2xl border p-5 mb-6", c.bg, c.border)}>
                    <div className="flex items-center gap-2.5 mb-4">
                      <DiagIcon className={cn("w-4 h-4 shrink-0", c.accent)} />
                      <span className={cn("text-[10px] font-black uppercase tracking-widest", c.accent)}>
                        {card.diag}
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

                    {card.isExpert && (
                      <div className="mt-4 flex items-center gap-2 text-amber-400/80 text-[10px] font-bold">
                        <Timer className="w-3.5 h-3.5 shrink-0" />
                        <span>5 min max / Q · Anti-triche</span>
                      </div>
                    )}
                  </div>

                  <Link
                    href={card.href}
                    className={cn(
                      "mt-auto w-full flex items-center justify-center gap-3 py-4 rounded-2xl",
                      "bg-linear-to-r text-white font-black text-xs uppercase tracking-widest",
                      "transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg",
                      c.btn
                    )}
                  >
                    {card.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Trust row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-8"
          >
            {[
              { icon: Sparkles, text: lang === 'ar' ? "مجاني 100% — بدون بطاقة" : "100% Gratuit — Sans carte", color: "text-emerald-400" },
              { icon: Shield, text: lang === 'ar' ? "نتائج فورية بالذكاء الاصطناعي" : "Résultats IA instantanés", color: "text-blue-400" },
              { icon: Zap, text: lang === 'ar' ? "3 مسارات متخصصة" : "3 Parcours spécialisés", color: "text-violet-400" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <item.icon className={cn("w-4 h-4 shrink-0", item.color)} />
                <span className="text-slate-400 text-xs font-bold">{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 2 — PAIN                                                   */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-slate-950/80 border-y border-white/5 relative z-10">
        <div className="container mx-auto max-w-4xl text-center">
          <FadeIn>
            <span className="text-red-400 font-bold text-xs uppercase tracking-[0.3em]">{t.pain.badge}</span>
            <h2 className="text-4xl md:text-5xl font-black mt-4 mb-16 tracking-tight">{t.pain.title}</h2>
          </FadeIn>
          <div className="space-y-4 mb-16">
            {t.pain.items.map((item, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <motion.div whileHover={{ scale: 1.02, x: dir === 'rtl' ? -5 : 5 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-4 p-5 rounded-2xl bg-white/3 border border-white/[0.07] hover:border-red-500/30 hover:bg-red-500/10 hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300 text-left cursor-default">
                  <motion.span whileHover={{ rotate: 90 }} className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-black text-sm shrink-0 shadow-[0_0_15px_rgba(239,68,68,0.2)]">✕</motion.span>
                  <p className="text-slate-300 font-medium">{item}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.5}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-3 px-8 py-5 rounded-2xl bg-linear-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] cursor-default transition-shadow">
              <Sparkles className="text-blue-400 w-5 h-5 shrink-0 animate-pulse" />
              <p className="text-blue-200 font-semibold">{t.pain.close}</p>
            </motion.div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 3 — SOLUTION                                               */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <FadeIn className="text-center mb-20">
            <span className="text-blue-400 font-bold text-xs uppercase tracking-[0.3em]">{t.solution.badge}</span>
            <h2 className="text-4xl md:text-6xl font-black mt-4 mb-6 tracking-tight">{t.solution.title}</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">{t.solution.sub}</p>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.solution.steps.map((step, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <motion.div whileHover={{ y: -5 }} className="group relative p-8 rounded-3xl bg-white/3 border border-white/[0.07] hover:border-blue-500/40 hover:bg-blue-500/10 transition-all duration-500 h-full hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] cursor-default overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors" />
                  <div className="absolute top-6 right-6 text-[10px] font-black text-slate-700 tabular-nums">0{i + 1}</div>
                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-all duration-300 relative z-10 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                    <step.icon size={26} strokeWidth={1.5} />
                  </motion.div>
                  <h3 className="text-lg font-black mb-3 text-white relative z-10">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium relative z-10">{step.desc}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 4 — COHORT SYSTEM                                          */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-linear-to-b from-slate-950/80 to-transparent border-y border-white/5 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="left">
              <span className="text-violet-400 font-bold text-xs uppercase tracking-[0.3em]">{t.cohort.badge}</span>
              <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 tracking-tight leading-tight">{t.cohort.title}</h2>
              <p className="text-slate-400 font-light leading-relaxed mb-10">{t.cohort.sub}</p>
              <div className="space-y-4">
                {t.cohort.points.map((p, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-white/3 border border-white/[0.07]">
                    <span className="text-2xl">{p.icon}</span>
                    <div>
                      <h4 className="font-black text-white mb-1">{p.title}</h4>
                      <p className="text-slate-500 text-sm">{p.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </FadeIn>

            {/* Visual */}
            <FadeIn direction="right" delay={0.2}>
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/10 rounded-3xl blur-3xl" />
                <div className="relative p-8 rounded-3xl bg-white/3 border border-white/10">
                  <div className="text-xs font-black uppercase tracking-widest text-slate-600 mb-6">{t.cohort.visual.title}</div>
                  {/* Simulate cohort grouping visual */}
                  <div className="space-y-4">
                    {[
                      { gap: "Strategic Leadership", level: "Mid-Senior", members: 4, color: "blue" },
                      { gap: "Negotiation & Value Positioning", level: "Senior", members: 3, color: "violet" },
                      { gap: "Executive Communication", level: "Junior-Mid", members: 5, color: "emerald" },
                    ].map((cohort, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                        className={cn("p-4 rounded-2xl border", i === 0 ? "bg-blue-500/10 border-blue-500/30" : i === 1 ? "bg-violet-500/10 border-violet-500/30" : "bg-emerald-500/10 border-emerald-500/30")}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-black uppercase tracking-widest text-slate-400">{cohort.gap}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-400">{cohort.level}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {Array(cohort.members).fill(0).map((_, j) => (
                              <div key={j} className={cn("w-7 h-7 rounded-full border-2 border-slate-950 flex items-center justify-center text-[9px] font-black", i === 0 ? "bg-blue-600" : i === 1 ? "bg-violet-600" : "bg-emerald-600")}>{j + 1}</div>
                            ))}
                          </div>
                          <span className="text-xs text-slate-500 font-medium">{cohort.members} {t.cohort.visual.unit}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-xs text-slate-500 font-medium">{t.cohort.visual.status}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 5 — TWO PATHS                                              */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <FadeIn className="text-center mb-20">
            <span className="text-amber-400 font-bold text-xs uppercase tracking-[0.3em]">{t.paths.badge}</span>
            <h2 className="text-4xl md:text-6xl font-black mt-4 tracking-tight">{t.paths.title}</h2>
          </FadeIn>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Client Path */}
            <FadeIn direction="left">
              <motion.div whileHover={{ scale: 1.02 }} className="group relative h-full bg-white/3 rounded-[2.5rem] border border-white/10 p-10 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all duration-500 overflow-hidden hover:shadow-[0_0_50px_rgba(59,130,246,0.15)]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl group-hover:bg-blue-600/10 transition-all opacity-0 group-hover:opacity-100" />
                <div className="relative z-10">
                  <span className="inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-6">{t.paths.client.tag}</span>
                  <motion.div whileHover={{ rotate: 10, scale: 1.1 }} className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(59,130,246,0.2)]"><Brain size={28} /></motion.div>
                  <h3 className="text-2xl font-black mb-8 text-white">{t.paths.client.title}</h3>
                  <ul className="space-y-3 mb-10">
                    {t.paths.client.items.map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-semibold text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                  <Link href={t.paths.client.href}
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest transition-all hover:scale-105 shadow-lg shadow-blue-600/20">
                    {t.paths.client.cta} <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            </FadeIn>

            {/* Expert Path */}
            <FadeIn direction="right" delay={0.15}>
              <motion.div whileHover={{ scale: 1.02 }} className="group relative h-full bg-linear-to-br from-slate-900 to-indigo-950/50 rounded-[2.5rem] border border-indigo-500/20 p-10 hover:border-indigo-500/50 transition-all duration-500 overflow-hidden hover:shadow-[0_0_50px_rgba(99,102,241,0.15)]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <span className="inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-6">{t.paths.expert.tag}</span>
                  <motion.div whileHover={{ rotate: -10, scale: 1.1 }} className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(99,102,241,0.2)]"><Crown size={28} /></motion.div>
                  <h3 className="text-2xl font-black mb-8 text-white">{t.paths.expert.title}</h3>
                  <ul className="space-y-3 mb-10">
                    {t.paths.expert.items.map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-semibold text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                  <Link href={t.paths.expert.href}
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-widest transition-all hover:scale-105 shadow-lg shadow-indigo-600/20">
                    {t.paths.expert.cta} <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 6 — EXPERT MODULES                                         */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-slate-950/60 border-y border-white/5 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <FadeIn className="text-center mb-20">
            <span className="text-indigo-400 font-bold text-xs uppercase tracking-[0.3em]">{t.expertModules.badge}</span>
            <h2 className="text-4xl md:text-5xl font-black mt-4 mb-4 tracking-tight">{t.expertModules.title}</h2>
            <p className="text-slate-400 max-w-xl mx-auto font-light">{t.expertModules.sub}</p>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-6">
            {t.expertModules.modules.map((mod, i) => {
              const colors: Record<string, string> = { blue: "from-blue-500/10 to-blue-600/5 border-blue-500/20 text-blue-400", violet: "from-violet-500/10 to-violet-600/5 border-violet-500/20 text-violet-400", emerald: "from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 text-emerald-400", amber: "from-amber-500/10 to-amber-600/5 border-amber-500/20 text-amber-400" };
              const [, , , iconColor] = colors[mod.color].split(" ");
              return (
                <FadeIn key={i} delay={i * 0.1}>
                  <motion.div whileHover={{ y: -5, scale: 1.01 }} className={cn("group p-8 rounded-3xl bg-linear-to-br border transition-all duration-300 h-full", colors[mod.color])}>
                    <div className="flex items-start gap-5">
                      <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.5 }} className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg", `bg-${mod.color}-500/20`, iconColor)}>
                        <mod.icon size={24} />
                      </motion.div>
                      <div>
                        <span className={cn("text-[9px] font-black uppercase tracking-widest mb-2 block", iconColor ?? "text-blue-400")}>{mod.tag}</span>
                        <h3 className="text-xl font-black text-white mb-3">{mod.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">{mod.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 7 — SOCIAL PROOF                                           */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <FadeIn className="text-center mb-16">
            <span className="text-yellow-400 font-bold text-xs uppercase tracking-[0.3em]">{t.proof.badge}</span>
            <h2 className="text-4xl md:text-5xl font-black mt-4 tracking-tight">{t.proof.title}</h2>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-6">
            {t.proof.reviews.map((r, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="h-full p-8 rounded-3xl bg-white/3 border border-white/[0.07] hover:border-yellow-500/20 transition-all duration-300 flex flex-col">
                  <div className="flex gap-1 mb-6">
                    {Array(r.stars).fill(0).map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed font-medium flex-1 italic mb-8">&ldquo;{r.text}&rdquo;</p>
                  <div>
                    <p className="text-white font-black text-sm">{r.name}</p>
                    <p className="text-slate-600 text-xs font-medium">{r.role}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>



      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 9 — FAQ                                                     */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 relative z-10">
        <div className="container mx-auto max-w-3xl">
          <FadeIn className="text-center mb-16">
            <span className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em]">{t.faq.badge}</span>
            <h2 className="text-4xl md:text-5xl font-black mt-4 tracking-tight">{t.faq.title}</h2>
          </FadeIn>
          <div className="space-y-4">
            {t.faq.items.map((item, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className={cn("rounded-2xl border transition-all duration-300 overflow-hidden",
                  openFaq === i ? "border-blue-500/30 bg-blue-500/5" : "border-white/[0.07] bg-white/2 hover:border-white/10")}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left">
                    <span className={cn("font-bold text-sm", openFaq === i ? "text-white" : "text-slate-300")}>{item.q}</span>
                    <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
                      <ChevronDown className={cn("w-4 h-4 shrink-0", openFaq === i ? "text-blue-400" : "text-slate-600")} />
                    </motion.div>
                  </button>
                  <motion.div initial={false} animate={{ height: openFaq === i ? "auto" : 0 }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }} className="overflow-hidden">
                    <p className="px-6 pb-6 text-sm text-slate-400 leading-relaxed font-medium">{item.a}</p>
                  </motion.div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 10 — FINAL CTA                                             */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 10 — SIMPLE FOOTER                                         */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 relative z-10 text-center">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-700">
          {lang === 'ar' ? "MA-TRAINING-CONSULTING © 2026 · جميع التشخيصات مجانية" : "MA-TRAINING-CONSULTING © 2026 · Tous les diagnostics sont gratuits"}
        </p>
      </section>

    </div>
  );
}
