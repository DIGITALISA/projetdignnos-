"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import {
  Crown, ArrowRight, CheckCircle2, ShieldCheck, FileText, X,
  Sparkles, Zap, CreditCard, Calendar, DollarSign, Building2,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";
import ConsultingInquiryModal from "@/components/modals/ConsultingInquiryModal";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { sanitizeForHtml2Canvas } from "@/lib/pdf-utils";
import { HERO, PROBLEM, JOURNEY, ECOSYSTEM_MODULES, CORPORATE, HUMAN, BENEFITS, PRICING, ASSETS, FINAL_CTA, CONTRACT } from "./content";

type Lang = "en" | "fr" | "ar";

const stepColors: Record<string, string> = {
  blue: "from-blue-500 to-blue-700",
  purple: "from-purple-500 to-purple-700",
  emerald: "from-emerald-500 to-emerald-700",
  orange: "from-orange-500 to-orange-700",
  pink: "from-pink-500 to-pink-700",
  cyan: "from-cyan-500 to-cyan-700",
  amber: "from-amber-500 to-amber-700",
};

const stepBadgeColors: Record<string, string> = {
  blue: "bg-blue-100 text-blue-700 border-blue-200",
  purple: "bg-purple-100 text-purple-700 border-purple-200",
  emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
  orange: "bg-orange-100 text-orange-700 border-orange-200",
  pink: "bg-pink-100 text-pink-700 border-pink-200",
  cyan: "bg-cyan-100 text-cyan-700 border-cyan-200",
  amber: "bg-amber-100 text-amber-700 border-amber-200",
};

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────────
export default function ProfessionalsPage() {
  const { language, dir } = useLanguage();
  const lang = (language as Lang) || "en";
  const hero = HERO[lang] || HERO.en;
  const problem = PROBLEM[lang] || PROBLEM.en;
  const journey = JOURNEY[lang] || JOURNEY.en;
  const human = HUMAN[lang] || HUMAN.en;
  const benefits = BENEFITS[lang] || BENEFITS.en;
  const pricing = PRICING[lang] || PRICING.en;
  const assets = ASSETS[lang] || ASSETS.en;
  const finalCta = FINAL_CTA[lang] || FINAL_CTA.en;
  const corporate = CORPORATE[lang] || CORPORATE.en;
  const ecosystem = ECOSYSTEM_MODULES[lang] || ECOSYSTEM_MODULES.en;
  const contract = CONTRACT[lang] || CONTRACT.en;

  const contractRef = useRef<HTMLDivElement>(null);
  const [isConsultingFormOpen, setIsConsultingFormOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  const [contractId] = useState(() => Math.random().toString(36).substring(2, 9).toUpperCase());
  const [authId] = useState(() => Math.random().toString(36).substring(2, 9).toUpperCase());
  const [currentTime] = useState(() => new Date().toISOString());
  const [currentDate] = useState(() => new Date().toLocaleDateString(lang === "ar" ? "ar-TN" : "fr-FR"));

  const handleDownloadContract = async () => {
    if (!contractRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(contractRef.current, {
        scale: 3, useCORS: true, backgroundColor: "#ffffff", logging: false, imageTimeout: 0, windowWidth: 1200,
        onclone: (doc) => {
          sanitizeForHtml2Canvas(doc);
          const el = doc.body.querySelector('[data-contract-container="true"]') as HTMLElement;
          if (el) { el.style.boxShadow = "none"; el.style.border = "1px solid #e2e8f0"; el.style.backgroundColor = "#ffffff"; el.style.color = "#000000"; }
        },
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pw = pdf.internal.pageSize.getWidth(), ph = pdf.internal.pageSize.getHeight();
      const r = canvas.width / canvas.height, pr = pw / ph;
      let fw: number, fh: number;
      if (r > pr) { fw = pw - 20; fh = fw / r; } else { fh = ph - 20; fw = fh * r; }
      pdf.addImage(imgData, "PNG", (pw - fw) / 2, 10, fw, fh);
      pdf.save(`MA-CONSULTING-CONTRACT-${clientName || "CLIENT"}.pdf`);
    } catch (e) { console.error("PDF error:", e); }
    finally { setIsGenerating(false); }
  };

  return (
    <div className={cn("min-h-screen bg-[#FAFAFA] dark:bg-[#020202] overflow-x-hidden selection:bg-blue-500/30", lang === "ar" ? "font-arabic" : "font-sans")} dir={dir}>

      {/* ═══ AMBIENT BACKGROUND ═══ */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[24px_24px]" />
        <div className="absolute left-0 right-0 top-[-10%] m-auto h-[500px] w-[500px] rounded-full bg-blue-500/10 opacity-50 blur-[100px]" />
      </div>

      {/* ═══════════════ SECTION 1: HERO ═══════════════ */}
      <section className="relative min-h-[90vh] flex flex-col justify-center px-6 pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto max-w-6xl relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md mb-8 shadow-sm">
            <Crown className="w-4 h-4 text-blue-600" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300">{hero.badge}</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium leading-[0.95] tracking-tight mb-4 text-slate-900 dark:text-white">
            {hero.title}
          </motion.h1>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium leading-[0.95] tracking-tight mb-8 text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600">
            {hero.titleHighlight}
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 1 }}
            className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto mb-12 font-light leading-relaxed">
            {hero.subtitle}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/register"
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">
              {hero.ctaPrimary}
            </Link>
            <a href="#pricing"
              className="w-full sm:w-auto px-8 py-4 bg-transparent border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-slate-50 transition-colors">
              {hero.ctaSecondary}
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-slate-200 dark:border-slate-800 pt-12">
            {hero.stats.map((s, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-1">{s.value}</span>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ SECTION 2: PROBLEM ═══════════════ */}
      <section className="py-20 bg-slate-900 dark:bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        <div className="container mx-auto px-6 relative z-10 max-w-4xl">
          <div className="text-center mb-12">
            <span className="text-red-400 font-bold text-xs uppercase tracking-[0.3em]">{problem.badge}</span>
            <h2 className="text-3xl md:text-5xl font-serif mt-4 mb-6">{problem.title}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {problem.points.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <span className="text-3xl shrink-0">{p.icon}</span>
                <p className="text-slate-300 font-medium leading-relaxed">{p.text}</p>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center p-8 rounded-3xl bg-linear-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30">
            <Sparkles className="w-8 h-8 text-blue-400 mx-auto mb-4" />
            <p className="text-lg text-blue-200 font-medium leading-relaxed">{problem.solution}</p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ SECTION 3: AI JOURNEY ═══════════════ */}
      <section className="py-32 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <span className="text-blue-600 font-bold text-xs uppercase tracking-[0.3em]">{journey.badge}</span>
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 dark:text-white mt-4 mb-4">{journey.title}</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">{journey.subtitle}</p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />
            <div className="space-y-12 md:space-y-0">
              {journey.steps.map((step, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                  className={cn("relative md:flex items-center gap-8 md:mb-16", idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse")}>
                  <div className={cn("flex-1", idx % 2 === 0 ? "md:text-end" : "md:text-start")}>
                    <div className={cn("inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border mb-3", stepBadgeColors[step.color])}>
                      {step.tag}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed max-w-sm inline-block">{step.desc}</p>
                  </div>
                  <div className="relative z-10 my-4 md:my-0 flex items-center justify-center">
                    <div className={cn("w-16 h-16 rounded-2xl bg-linear-to-br flex items-center justify-center text-white font-black text-sm shadow-xl", stepColors[step.color])}>
                      {step.icon && <step.icon size={28} strokeWidth={2} />}
                    </div>
                  </div>
                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 3.5: AI ECOSYSTEM MODULES ═══════════════ */}
      <section className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-slate-900 to-black opacity-50" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <span className="text-blue-400 font-bold text-xs uppercase tracking-[0.3em]">{ecosystem.badge}</span>
            <h2 className="text-4xl md:text-5xl font-serif mt-4 mb-4">{ecosystem.title}</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">{ecosystem.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ecosystem.modules.map((mod, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }}
                className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <mod.icon size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">{mod.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">{mod.desc}</p>
                <Link href={mod.link} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors">
                  Explore Module <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 4: HUMAN-LED ═══════════════ */}
      <section className="py-24 px-6 bg-slate-50 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-purple-600 font-bold text-xs uppercase tracking-[0.3em]">{human.badge}</span>
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 dark:text-white mt-4 mb-4">{human.title}</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">{human.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {human.items.map((item, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                className="group relative bg-white dark:bg-slate-950 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-purple-500/5 transition-all duration-500 hover:-translate-y-1">
                <div className="absolute top-6 end-6">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-purple-100 text-purple-700 border border-purple-200">{item.badge}</span>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center mb-6">
                  <item.icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 5: BENEFITS ═══════════════ */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-bold text-xs uppercase tracking-[0.3em]">{benefits.badge}</span>
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 dark:text-white mt-4">{benefits.title}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.items.map((item, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                className="text-center p-8 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 hover:shadow-lg transition-all">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center mx-auto mb-5">
                  <item.icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 6: ASSETS ═══════════════ */}
      <section className="py-24 px-6 bg-slate-50 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="max-w-2xl">
              <span className="text-amber-600 font-bold text-xs uppercase tracking-[0.3em]">{assets.badge}</span>
              <h2 className="text-4xl md:text-5xl font-serif text-slate-900 dark:text-white mt-4">{assets.subtitle}</h2>
            </div>
            <ShieldCheck size={48} className="hidden md:block text-slate-200 dark:text-slate-800" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {assets.items.map((item, idx) => (
              <div key={idx} className="group relative bg-white dark:bg-slate-950 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-amber-500/5 transition-all duration-500 hover:-translate-y-1">
                <div className="absolute top-0 end-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity"><item.icon size={64} /></div>
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center mb-6 text-sm font-bold">{idx + 1}</div>
                  <h3 className="text-2xl font-serif text-slate-900 dark:text-white mb-4 group-hover:text-amber-600 transition-colors">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 6.5: CORPORATE / HR INQUIRY ═══════════════ */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-linear-to-br from-slate-900 to-indigo-950 rounded-[3rem] p-8 md:p-16 text-white border border-white/5 relative overflow-hidden shadow-2xl">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]" />
            
            <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
              <div>
                <span className="text-blue-400 font-bold text-xs uppercase tracking-[0.3em] font-sans">{corporate.badge}</span>
                <h2 className="text-4xl md:text-5xl font-serif mt-4 mb-6">{corporate.title}</h2>
                <p className="text-lg text-slate-300 mb-8 font-light leading-relaxed">{corporate.description}</p>
                <ul className="space-y-4 mb-10">
                  {corporate.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-200">
                      <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={12} className="text-blue-400" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => setIsConsultingFormOpen(true)}
                  className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl">
                  {corporate.cta}
                </button>
              </div>
              <div className="hidden lg:block">
                <div className="relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center"><Building2 size={24} className="text-blue-400" /></div>
                    <div><h4 className="font-bold">HR Strategic Advisor</h4><p className="text-xs text-slate-400">Objective-Driven Analytics</p></div>
                  </div>
                  <div className="space-y-6">
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} whileInView={{ width: "85%" }} className="h-full bg-blue-500" /></div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} whileInView={{ width: "70%" }} className="h-full bg-indigo-500" /></div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} whileInView={{ width: "95%" }} className="h-full bg-purple-500" /></div>
                  </div>
                  <div className="mt-10 p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Evaluation Accuracy Score</p>
                    <p className="text-3xl font-serif font-bold text-white mt-1">98.4%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 7: PRICING ═══════════════ */}
      <section id="pricing" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-12">
            <span className="text-indigo-600 font-bold text-xs uppercase tracking-[0.3em]">{pricing.badge}</span>
            <h2 className="text-4xl md:text-6xl font-serif text-slate-900 dark:text-white mt-4 mb-4">{pricing.title}</h2>
            <p className="text-xl text-slate-500 font-light mb-8">{pricing.subtitle}</p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-3 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800">
              <button onClick={() => setBillingCycle("monthly")}
                className={cn("px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-widest transition-all",
                  billingCycle === "monthly" ? "bg-white dark:bg-slate-800 shadow-md text-slate-900 dark:text-white" : "text-slate-500")}>
                {lang === "ar" ? "شهري" : lang === "fr" ? "Mensuel" : "Monthly"}
              </button>
              <button onClick={() => setBillingCycle("annual")}
                className={cn("px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-widest transition-all flex items-center gap-2",
                  billingCycle === "annual" ? "bg-white dark:bg-slate-800 shadow-md text-slate-900 dark:text-white" : "text-slate-500")}>
                {lang === "ar" ? "سنوي" : lang === "fr" ? "Annuel" : "Annual"}
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black">-20%</span>
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-stretch">
            {pricing.plans.map((plan, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: idx * 0.15 }}
                className={cn("relative rounded-[2.5rem] p-10 border transition-all duration-500 flex flex-col",
                  plan.highlight
                    ? "bg-slate-900 dark:bg-white text-white dark:text-black border-slate-900 dark:border-white shadow-2xl scale-[1.03] z-10"
                    : "bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 hover:border-slate-300")}>

                {"popular" in plan && (plan as { popular?: boolean }).popular ? (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full shadow-lg">
                    {lang === "ar" ? "الأكثر شعبية" : lang === "fr" ? "Le Plus Populaire" : "Most Popular"}
                  </div>
                ) : null}

                <div className="mb-6">
                  <span className="text-4xl">{plan.icon}</span>
                </div>
                <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
                <p className={cn("text-sm font-medium mb-6", plan.highlight ? "text-slate-400" : "text-slate-500")}>{plan.desc}</p>

                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-5xl font-serif font-bold">
                    {billingCycle === "annual" && plan.annualPrice ? plan.annualPrice.split("/")[0] : plan.price}
                  </span>
                  <span className={cn("text-sm", plan.highlight ? "text-slate-400" : "text-slate-400")}>
                    {plan.period === "one-time" || plan.period === "دفعة واحدة" || plan.period === "paiement unique"
                      ? plan.period
                      : billingCycle === "annual" ? (lang === "ar" ? "/شهر" : "/mo") : plan.period}
                  </span>
                </div>
                {billingCycle === "annual" && plan.annualNote && (
                  <p className="text-xs text-emerald-500 font-bold mb-6">{plan.annualNote}</p>
                )}
                {billingCycle === "monthly" && <div className="mb-6" />}

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-3 text-sm font-medium">
                      <CheckCircle2 size={16} className={plan.highlight ? "text-blue-400 shrink-0 mt-0.5" : "text-blue-600 shrink-0 mt-0.5"} />
                      <span>{f}</span>
                    </li>
                  ))}
                  {plan.notIncluded.map((f, fi) => (
                    <li key={`n${fi}`} className="flex items-start gap-3 text-sm font-medium opacity-40">
                      <X size={16} className="shrink-0 mt-0.5" />
                      <span className="line-through">{f}</span>
                    </li>
                  ))}
                </ul>

                {plan.highlight ? (
                  <button onClick={() => setIsConsultingFormOpen(true)}
                    className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest bg-white dark:bg-black text-black dark:text-white hover:bg-slate-200 dark:hover:bg-slate-800 shadow-lg transition-all">
                    {plan.cta}
                  </button>
                ) : (
                  <Link href="/register"
                    className="w-full block text-center py-4 rounded-xl font-bold text-sm uppercase tracking-widest bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all">
                    {plan.cta}
                  </Link>
                )}
              </motion.div>
            ))}
          </div>

          {/* Pay-Per-Session */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-16 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{pricing.extras.title}</h3>
            <p className="text-sm text-slate-500 mb-6">{pricing.extras.subtitle}</p>
            <div className="grid md:grid-cols-3 gap-4">
              {pricing.extras.items.map((ex, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <div><p className="font-bold text-slate-900 dark:text-white text-sm">{ex.name}</p><p className="text-xs text-slate-400">{ex.desc}</p></div>
                  <span className="text-lg font-serif font-bold text-blue-600">{ex.price}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Payment Methods */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mb-4">{pricing.paymentMethods.title}</p>
            <div className="flex flex-wrap justify-center gap-3">
              {pricing.paymentMethods.options.map((opt, i) => (
                <span key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-900 text-xs font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                  {i === 0 ? <Calendar size={14} /> : i === 1 ? <CreditCard size={14} /> : i === 2 ? <DollarSign size={14} /> : <Zap size={14} />}
                  {opt}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-4">{pricing.paymentNote}</p>
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 8: CONTRACT ═══════════════ */}
      <section className="py-24 px-6 bg-slate-100 dark:bg-slate-900 overflow-hidden">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif text-slate-900 dark:text-white mb-4">{contract.title}</h2>
            <p className="text-slate-500 font-light">{contract.subtitle}</p>
          </div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">{contract.nameLabel}</label>
                  <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder={contract.namePlaceholder}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">{contract.dateLabel}</label>
                  <div className="px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-500">{currentDate}</div>
                </div>
              </div>
            </div>

            <div ref={contractRef} data-contract-container="true" className="relative p-8 md:p-16 mx-auto max-w-3xl"
              style={{ minHeight: "1000px", backgroundColor: "#fff", color: "#000", border: "1px solid #e2e8f0", borderRadius: "2px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
              <div className="relative z-10 space-y-10 font-serif">
                <div className="text-center pb-10" style={{ borderBottom: "2px solid #0f172a" }}>
                  <div className="text-xl font-bold mb-2 tracking-[0.3em]" style={{ color: "#0f172a" }}>MA-TRAINING-CONSULTING</div>
                  <h3 className="text-3xl font-black uppercase tracking-widest mb-4" style={{ color: "#020617" }}>{contract.docTitle}</h3>
                  <p className="text-[10px] font-sans uppercase tracking-[0.4em]" style={{ color: "#64748b" }}>Ref: MA-TC-2026-HQ / AUTH-{contractId}</p>
                </div>
                <div className="p-8 rounded-lg text-sm font-bold font-sans leading-relaxed text-center" style={{ backgroundColor: "#f8fafc", border: "1px solid #f1f5f9", color: "#1e293b" }}>
                  {contract.parties.replace("{{client}}", clientName || "....................")}
                </div>
                <div className="space-y-8 px-4">
                  {contract.clauses.map((cl, idx) => (
                    <div key={idx} className="space-y-2">
                      <h4 className="font-black text-base uppercase font-sans pl-4" style={{ color: "#020617", borderLeft: "4px solid #0f172a" }}>{cl.title}</h4>
                      <p className="text-sm leading-relaxed font-sans text-justify" style={{ color: "#334155" }}>{cl.text}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-16 grid grid-cols-2 gap-12" style={{ borderTop: "2px solid #0f172a" }}>
                  <div className="space-y-6">
                    <div className="h-24 flex items-center justify-center relative" style={{ borderBottom: "1px solid #94a3b8", backgroundColor: "#fdfdfd" }}>
                      <div className="absolute top-[-10px] left-[-20px] transform -rotate-6 z-20 opacity-95 pointer-events-none">
                        <svg width="200" height="80" viewBox="0 0 150 60" fill="none" className="text-blue-900/90">
                          <path d="M10 45C30 40 50 15 70 25C90 35 110 5 140 15M20 50C40 45 60 40 100 42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M40 30C45 25 55 20 60 35C65 50 50 55 45 45C40 35 55 25 70 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div className="absolute opacity-90 transform -rotate-12 z-10">
                        <div className="w-44 h-22 border-[3px] rounded-xl flex flex-col items-center justify-center" style={{ borderColor: "#1e3a8a", color: "#1e3a8a", fontFamily: "serif" }}>
                          <p className="text-lg font-black uppercase tracking-tighter leading-none mb-1">Sté MA</p>
                          <p className="text-[10px] font-bold uppercase tracking-widest leading-none mb-1.5">Training Consulting</p>
                          <p className="text-[8px] font-bold leading-none mb-0.5">Tel: 44 172 264</p>
                          <p className="text-[8px] font-bold leading-none">MF: 1805031P/A/M/000</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-black font-sans tracking-widest" style={{ color: "#020617" }}>MA-TRAINING-CONSULTING</p>
                      <p className="text-[8px] font-sans tracking-tight" style={{ color: "#94a3b8" }}>Verified Corporate Entity • 2026</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="h-24 flex flex-col items-center justify-center p-4 relative" style={{ border: "1px dashed #d1d5db", backgroundColor: "#f0f9ff", borderRadius: "4px" }}>
                      {clientName ? (
                        <>
                          <div className="absolute top-0 right-0 p-1" style={{ color: "#1d4ed8" }}><span className="text-[10px] font-bold">✓ VERIFIED</span></div>
                          <span className="text-2xl font-serif italic" style={{ color: "#1e3a8a", fontFamily: "cursive" }}>{clientName}</span>
                          <div className="mt-2 flex flex-col items-center">
                            <div className="text-[7px] font-mono font-bold uppercase tracking-tighter" style={{ color: "#3b82f6" }}>Digitally Authorized • ID: {authId}</div>
                            <div className="text-[6px] mt-0.5" style={{ color: "#94a3b8" }}>TS: {currentTime} • IP: Verified</div>
                          </div>
                        </>
                      ) : (
                        <div className="text-[10px] font-sans italic" style={{ color: "#cbd5e1" }}>SIGNATURE AREA</div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-black font-sans tracking-widest" style={{ color: "#020617" }}>Client Signature & Legal Consent</p>
                      <p className="text-[8px] font-sans tracking-tight" style={{ color: "#94a3b8" }}>Acceptance of Consulting Mandate</p>
                    </div>
                  </div>
                </div>
                <div className="mt-20 text-center text-[8px] font-sans uppercase tracking-widest" style={{ color: "#94a3b8" }}>
                  Generated via Secure Protocol • Verified Digital Asset • {currentTime}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <button onClick={handleDownloadContract} disabled={!clientName || isGenerating}
                className={cn("w-full max-w-md px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-sm uppercase tracking-[0.2em] transition-all shadow-2xl flex items-center justify-center gap-3",
                  !clientName || isGenerating ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95")}>
                {isGenerating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FileText size={18} />}
                {isGenerating ? "..." : contract.cta}
              </button>
              {!clientName && <p className="text-xs text-amber-600 font-bold animate-pulse">{contract.nameRequired}</p>}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ SECTION 9: FINAL CTA ═══════════════ */}
      <section className="py-24 bg-blue-600 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <h2 className="text-4xl md:text-5xl font-serif mb-4">{finalCta.title}</h2>
          <p className="text-xl text-blue-200 mb-10 font-light">{finalCta.subtitle}</p>
          <Link href="/register"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-blue-600 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-blue-50 transition-colors shadow-xl hover:scale-105">
            {finalCta.cta} <ArrowRight size={16} />
          </Link>
          <p className="text-xs text-blue-300 mt-6 font-medium">{finalCta.note}</p>
        </div>
      </section>

      <ConsultingInquiryModal isOpen={isConsultingFormOpen} onClose={() => setIsConsultingFormOpen(false)} redirectToDashboard={true} />
    </div>
  );
}
