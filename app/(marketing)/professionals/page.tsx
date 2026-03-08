"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  ArrowRight, CheckCircle2, X, Sparkles, Brain, ChevronDown,
  Crown, Rocket, Star
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
function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  if (inView && count === 0 && value > 0) {
    const steps = 40;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setCount(Math.round((value * i) / steps));
      if (i >= steps) clearInterval(interval);
    }, 35);
  }
  return <span ref={ref}>{count}{suffix}</span>;
}



// ─── EFFECTS ───────────────────────────────────────────────────────────────────
function AnimatedHeroVisual() {
  return (
    <div className="relative w-full aspect-square flex items-center justify-center pointer-events-none">
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="absolute inset-0 bg-blue-500/20 rounded-full blur-[100px]" />
      
      <motion.div animate={{ y: [-15, 15, -15] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="relative z-10 w-40 h-40 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-4xl flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer">
        <Brain className="w-20 h-20 text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
      </motion.div>

      {[...Array(3)].map((_, i) => (
        <motion.div key={i} animate={{ rotate: 360 }} transition={{ duration: 20 + i * 10, repeat: Infinity, ease: "linear" }} className="absolute inset-0 flex items-center justify-center">
          <div className={cn("rounded-full border border-dashed border-white/10", i === 0 ? "w-[120%] h-[120%]" : i === 1 ? "w-[160%] h-[160%] border-indigo-500/20" : "w-[200%] h-[200%] border-blue-500/10")} style={{ transform: `rotate(${i * 45}deg)` }} />
          <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2 + i, repeat: Infinity }} className={cn("absolute w-3 h-3 rounded-full blur-[1px]", i === 0 ? "bg-blue-400 top-0" : i === 1 ? "bg-indigo-400 bottom-[10%] right-[10%]" : "bg-violet-400 top-[20%] left-[5%]")} />
        </motion.div>
      ))}
    </div>
  );
}

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
  const [currency, setCurrency] = useState("EUR");
  const [activeTab, setActiveTab] = useState<"student" | "pro" | "expert">("pro");
  const rates: Record<string, { symbol: string; rate: number }> = {
    EUR: { symbol: "€", rate: 1 },
    USD: { symbol: "$", rate: 1.08 },
    TND: { symbol: "DT", rate: 3.42 },
    MAD: { symbol: "DH", rate: 11 },
  };

  const price = (base: string) => {
    if (base === "Free" || base === "Gratuit" || base === "مجاناً") return base;
    if (base === "Custom" || base === "Sur Mesure" || base === "حسب الطلب") return base;
    const num = parseFloat(base);
    if (isNaN(num)) return base;
    const val = Math.round(num * rates[currency].rate);
    return currency === "TND" || currency === "MAD" ? `${val} ${rates[currency].symbol}` : `${rates[currency].symbol}${val}`;
  };

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
      <section className="relative min-h-screen flex flex-col justify-center px-6 pt-28 pb-20 z-10">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className={cn("relative z-10", dir === 'rtl' ? "lg:pl-10" : "lg:pr-10")}>
              {/* Badge */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md mb-8 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-blue-300">{t.hero.badge}</span>
              </motion.div>

              {/* H1 */}
              <div className="mb-6">
                <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.8 }}
                  className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-2 text-white">
                  {t.hero.h1a}
                </motion.h1>
                <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.8 }}
                  className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-indigo-400 to-violet-400 drop-shadow-sm">
                  {t.hero.h1b}
                </motion.h1>
              </div>

              {/* Subtitle */}
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 1 }}
                className="text-lg md:text-xl text-slate-300 max-w-2xl mb-10 font-light leading-relaxed">
                {t.hero.sub}
              </motion.p>

              {/* CTAs */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
                className="flex flex-col sm:flex-row gap-4 items-start md:items-center mb-6">
                <Link href="/register"
                  className="group relative px-8 py-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-sm uppercase tracking-widest transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(59,130,246,0.3)] flex items-center gap-3 overflow-hidden">
                  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative z-10">{t.hero.cta}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
                </Link>
                <a href="#pricing"
                  className="px-8 py-4 border border-white/10 hover:border-white/30 text-slate-400 hover:text-white rounded-2xl font-bold text-sm uppercase tracking-widest transition-all duration-300 hover:bg-white/5">
                  {t.hero.cta2}
                </a>
              </motion.div>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                className="text-xs text-slate-500 font-medium">{t.hero.ctaSub}</motion.p>

              {/* Stats */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}
                className="grid grid-cols-2 gap-8 mt-16 pt-10 border-t border-white/10">
                {t.hero.stats.map((s, i) => (
                  <motion.div key={i} whileHover={{ scale: 1.05 }} className="space-y-2 p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 cursor-default">
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                       <div className="text-3xl font-black text-white">
                         <Counter value={s.val} suffix={s.suf} />
                       </div>
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{s.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Right Visual (Desktop Only) */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 1 }}
              className="hidden lg:flex items-center justify-center p-10 relative">
               <div className="absolute inset-0 bg-blue-600/5 rounded-full blur-[100px]" />
               <AnimatedHeroVisual />
            </motion.div>
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-700">
          <ChevronDown className="w-6 h-6" />
        </motion.div>
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
      {/* SECTION 8 — PRICING                                                */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="pricing" className="py-32 px-6 bg-slate-950/60 border-t border-white/5 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <FadeIn className="text-center mb-12">
            <span className="text-indigo-400 font-bold text-xs uppercase tracking-[0.3em]">{t.pricing.badge}</span>
            <h2 className="text-4xl md:text-6xl font-black mt-4 mb-4 tracking-tight">{t.pricing.title}</h2>
            <p className="text-slate-400 font-light mb-8">{t.pricing.sub}</p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
              {/* Account Type Tabs */}
              <div className="inline-flex p-1.5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                {t.pricing.tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as "student" | "pro" | "expert")}
                    className={cn(
                      "flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black transition-all duration-500",
                      activeTab === tab.id
                        ? "bg-white text-black shadow-2xl scale-105"
                        : "text-slate-500 hover:text-white"
                    )}
                  >
                    <span>{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="w-px h-8 bg-white/10 hidden md:block" />

              {/* Currency selector */}
              <div className="inline-flex items-center gap-1 p-1.5 rounded-2xl bg-white/5 border border-white/10">
                {Object.entries(rates).map(([code]) => (
                  <button key={code} onClick={() => setCurrency(code)}
                    className={cn("px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                      currency === code ? "bg-white text-black shadow-lg" : "text-slate-500 hover:text-white")}>
                    {code}
                  </button>
                ))}
              </div>
            </div>

            <FadeIn delay={0.2}>
              <div className="mb-16 max-w-2xl mx-auto text-center">
                <p className="text-xl font-medium text-indigo-300 mb-4">{t.pricing.groups[activeTab as keyof typeof t.pricing.groups].headline}</p>
                {"note" in t.pricing.groups[activeTab as keyof typeof t.pricing.groups] && (
                  <p className="text-sm text-slate-500 italic">{(t.pricing.groups[activeTab as keyof typeof t.pricing.groups] as { note?: string }).note}</p>
                )}
              </div>
            </FadeIn>
          </FadeIn>

          <div className="grid lg:grid-cols-3 gap-8 items-stretch">
            {t.pricing.groups[activeTab as keyof typeof t.pricing.groups].plans.map((plan: {id?: string; name: string; desc: string; icon: string; price: string; priceTND?: string; period: string; highlight?: boolean; popular?: boolean; features: string[]; notIncluded?: string[]; cta: string; href?: string}, i: number) => (
              <FadeIn key={i} delay={i * 0.12}>
                <motion.div whileHover={{ y: -8 }} className={cn("relative h-full rounded-[2.5rem] p-10 border flex flex-col transition-all duration-300 cursor-default",
                  plan.highlight
                    ? "bg-white text-slate-900 border-white shadow-2xl shadow-blue-500/10 scale-[1.03] z-10"
                    : "bg-white/3 text-white border-white/10 hover:border-white/30 hover:shadow-[0_0_40px_rgba(255,255,255,0.03)]"
                )}>
                  {"popular" in plan && plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-blue-600 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl animate-bounce">{t.pricing.popular}</div>
                  )}
                  <motion.div whileHover={{ scale: 1.2, rotate: 5 }} className="text-4xl mb-4 self-start">{plan.icon}</motion.div>
                  <h3 className={cn("text-2xl font-black mb-2", plan.highlight ? "text-slate-900" : "text-white")}>{plan.name}</h3>
                  <p className={cn("text-sm mb-6", plan.highlight ? "text-slate-500" : "text-slate-400")}>{plan.desc}</p>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className={cn("text-4xl font-black", plan.highlight ? "text-blue-600" : "text-white")}>
                      {currency === "TND" ? plan.priceTND : price(plan.price)}
                    </span>
                    <span className={cn("text-sm", plan.highlight ? "text-slate-400" : "text-slate-500")}>{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f: string, fi: number) => (
                      <li key={fi} className="flex items-start gap-3 text-sm font-semibold">
                        <CheckCircle2 size={16} className={cn("shrink-0 mt-0.5", plan.highlight ? "text-blue-600" : "text-blue-400")} />
                        <span className={plan.highlight ? "text-slate-700" : "text-slate-300"}>{f}</span>
                      </li>
                    ))}
                    {plan.notIncluded && plan.notIncluded.map((f: string, fi: number) => (
                      <li key={`n${fi}`} className="flex items-start gap-3 text-sm font-medium opacity-30">
                        <X size={16} className="shrink-0 mt-0.5" />
                        <span className="line-through">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={plan.id ? `/register?plan=${plan.id}` : (plan.price === "Custom" ? "mailto:contact@ma-training.com" : "/register")}
                    className={cn("w-full block text-center py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:scale-105",
                      plan.highlight
                        ? "bg-slate-900 text-white hover:bg-blue-600 shadow-xl"
                        : "bg-white/5 border border-white/10 text-white hover:bg-white/10")}>
                    {plan.cta}
                  </Link>
                </motion.div>
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
      <section className="py-32 px-6 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-blue-950/30 to-indigo-950/30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/15 rounded-full blur-[100px]" />
        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <FadeIn>
            <div className="w-20 h-20 rounded-3xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-10">
              <Rocket className="w-10 h-10 text-blue-400" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight">{t.finalCta.title}</h2>
            <p className="text-xl text-slate-400 font-light mb-12">{t.finalCta.sub}</p>
            <Link href="/register"
              className="inline-flex items-center gap-4 px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 hover:scale-105 shadow-2xl shadow-blue-600/30 mb-6">
              {t.finalCta.cta} <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-slate-600 font-medium">{t.finalCta.note}</p>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}
