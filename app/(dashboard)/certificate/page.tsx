"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import domtoimage from "dom-to-image-more";
import jsPDF from "jspdf";
import Image from "next/image";

import { AssetLocked } from "@/components/layout/AssetLocked";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface Competency {
  label: string;
  status: string;
  score: number;
}

interface ReadinessStatus {
  isReady: boolean;
  hasDiagnosis: boolean;
  hasSimulation: boolean;
  certReady: boolean;
  recReady: boolean;
}

interface PerformanceProfile {
  referenceId: string;
  userName: string;
  summary: string;
  verdict: string;
  competencies: Competency[];
  createdAt: string;
}

export default function CertificatePage() {
  const { t, language, dir } = useLanguage();
  const certificateRef = useRef<HTMLDivElement>(null);
  const [profile, setProfile] = useState<PerformanceProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [readiness, setReadiness] = useState<ReadinessStatus>({
    isReady: false,
    hasDiagnosis: false,
    hasSimulation: false,
    certReady: false,
    recReady: false,
  });

  const checkReadiness = async (userId: string) => {
    try {
      const res = await fetch(
        `/api/user/readiness?userId=${encodeURIComponent(userId)}`,
      );
      const data = await res.json();
      if (data.success) {
        setReadiness(data);
        return data.certReady;
      }
    } catch (err) {
      console.error("Readiness check error:", err);
    }
    return false;
  };

  const fetchProfile = async (identifier: string) => {
    setIsLoading(true);
    try {
      const ready = await checkReadiness(identifier);
      if (!ready) {
        setIsLoading(false);
        return;
      }

      const res = await fetch(
        `/api/user/performance-profile?userId=${encodeURIComponent(identifier)}`,
      );
      const data = await res.json();
      if (data.success) {
        setProfile(data.profile);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const savedProfile = localStorage.getItem("userProfile");
      const { fullName, email } = JSON.parse(savedProfile || "{}");
      const identifier = email || fullName;
      // Use the language from our context
      const currentLanguage = language;

      const res = await fetch("/api/user/performance-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: identifier,
          userName: fullName,
          language: currentLanguage,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.profile);
      } else {
        alert(data.error || "Generation failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const [userPlan, setUserPlan] = useState("None");

  useEffect(() => {
    const loadProfile = () => {
      try {
        const savedProfile = localStorage.getItem("userProfile");
        if (savedProfile) {
          const parsed = JSON.parse(savedProfile);
          setUserPlan(parsed.plan || "None");
          const { fullName, email } = parsed;
          const identifier = email || fullName;
          if (identifier) {
            fetchProfile(identifier);
          }
        } else {
          setIsLoading(false);
        }
      } catch (e) {
        console.error("Failed to load profile", e);
        setIsLoading(false);
      }
    };

    loadProfile();
    window.addEventListener("profileUpdated", loadProfile);
    return () => window.removeEventListener("profileUpdated", loadProfile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDownload = async () => {
    if (!certificateRef.current || !profile) return;
    setIsDownloading(true);
    try {
      await document.fonts.ready;
      const original = certificateRef.current;
      const clone = original.cloneNode(true) as HTMLElement;
      clone.style.position = "fixed";
      clone.style.top      = "-9999px";
      clone.style.left     = "-9999px";
      clone.style.width    = `${original.offsetWidth}px`;
      clone.style.height   = `${original.offsetHeight}px`;
      clone.style.overflow = "visible";
      document.body.appendChild(clone);

      const unsupported = /oklch|oklab|lab\(|lch\(|hwb\(|color-mix/i;
      const resolveColor = (raw: string): string => {
        const tmp = document.createElement("span");
        tmp.style.color = raw;
        document.body.appendChild(tmp);
        const resolved = getComputedStyle(tmp).color;
        document.body.removeChild(tmp);
        return resolved || "rgb(0,0,0)";
      };

      [clone, ...Array.from(clone.querySelectorAll("*"))].forEach(node => {
        const el = node as HTMLElement;
        const computed = getComputedStyle(el);
        el.style.setProperty("transition", "none", "important");
        el.style.setProperty("animation", "none", "important");
        el.style.setProperty("backdrop-filter", "none", "important");
        el.style.setProperty("-webkit-backdrop-filter", "none", "important");
        (["color", "backgroundColor", "outlineColor"] as const).forEach(key => {
          const val = computed[key] as string;
          if (val && unsupported.test(val)) {
            el.style.setProperty(key.replace(/([A-Z])/g, "-$1").toLowerCase(), resolveColor(val), "important");
          }
        });
        (["Top", "Right", "Bottom", "Left"] as const).forEach(side => {
          const w = computed[`border${side}Width` as keyof CSSStyleDeclaration] as string;
          if (!w || w === "0px") {
            el.style.setProperty(`border-${side.toLowerCase()}-width`, "0px", "important");
          } else {
            const c = computed[`border${side}Color` as keyof CSSStyleDeclaration] as string;
            if (c && unsupported.test(c)) el.style.setProperty(`border-${side.toLowerCase()}-color`, resolveColor(c), "important");
          }
        });
        const bg = computed.backgroundImage;
        if (bg && bg !== "none" && (bg.includes("http://") || bg.includes("https://"))) {
          el.style.setProperty("background-image", "none", "important");
        }
      });

      const dataUrl = await domtoimage.toPng(clone, {
        scale: 2,
        bgcolor: "#ffffff",
        width:  original.offsetWidth,
        height: original.offsetHeight,
      });
      document.body.removeChild(clone);

      const img = new window.Image();
      img.src = dataUrl;
      await new Promise<void>(resolve => { img.onload = () => resolve(); });

      const pdf   = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const pdfW  = pdf.internal.pageSize.getWidth();
      const pdfH  = pdf.internal.pageSize.getHeight();
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pdfW, pdfH, "F");
      const ratio    = img.width / img.height;
      const pdfRatio = pdfW / pdfH;
      let imgW = pdfW, imgH = pdfH;
      if (ratio > pdfRatio) { imgH = pdfW / ratio; } else { imgW = pdfH * ratio; }
      pdf.addImage(dataUrl, "PNG", (pdfW - imgW) / 2, (pdfH - imgH) / 2, imgW, imgH);
      pdf.save(`Executive-Performance-Profile-${profile.referenceId}.pdf`);
    } catch (err) {
      console.error("PDF FAILURE:", err);
      alert(`Export Failed: ${err instanceof Error ? err.message : "Unknown error"}.`);
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center flex flex-col items-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-6" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
          {t.performanceProfile.retrieving}
        </p>
      </div>
    );
  }

  if (
    !readiness.certReady ||
    userPlan === "Free Trial" ||
    userPlan === "None"
  ) {
    return (
      <AssetLocked
        title={t.performanceProfile.title}
        description={t.performanceProfile.subtitle}
        readiness={readiness}
        isPremiumRequired={userPlan === "Free Trial" || userPlan === "None"}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12 pb-20">
      {/* Header & Generation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-blue-600" />
        <div className="flex-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
            {t.performanceProfile.badge}
          </h2>
          <p
            className="text-slate-500 font-medium max-w-lg mt-1 font-arabic"
            dir={dir}
          >
            {t.performanceProfile.emptyStateDesc}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50"
          >
            {isGenerating ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Sparkles size={16} />
            )}
            {profile ? t.performanceProfile.regenerate : t.performanceProfile.generate}
          </button>
          {profile && (
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-3 px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl disabled:opacity-50"
            >
              {isDownloading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Download size={16} />
              )}
              {t.performanceProfile.exportPdf}
            </button>
          )}
        </div>
      </div>

      {isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-12 text-center space-y-4 bg-blue-50/50 rounded-[3rem] border border-blue-100 border-dashed"
        >
          <div className="relative inline-block">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
            <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600 w-6 h-6" />
          </div>
          <h3
            className="text-xl font-black text-blue-900"
            dir={dir}
          >
            {t.performanceProfile.analyzing}
          </h3>
          <p className="text-blue-600 text-sm font-bold uppercase tracking-[0.2em] animate-pulse">
            {t.performanceProfile.synthesisNote}
          </p>
        </motion.div>
      )}

      {/* Empty State */}
      {!profile && !isGenerating && (
        <div className="py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-100">
          <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-300">
            <Target size={40} />
          </div>
          <h3
            className="text-2xl font-black text-slate-900"
            dir={dir}
          >
            {t.performanceProfile.emptyStateTitle}
          </h3>
          <p
            className="text-slate-500 mt-2 max-w-sm mx-auto font-medium"
            dir={dir}
          >
            {t.performanceProfile.emptyStateDesc}
          </p>
        </div>
      )}

      {/* Profile Display */}
      {profile && !isGenerating && (
        <div className="flex flex-col items-center">
          <div className="w-full max-w-6xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={profile.referenceId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative p-1 bg-slate-200 rounded-[3.5rem] shadow-2xl"
              >
                <div
                  ref={certificateRef}
                  id="certificate-content"
                  dir={dir}
                  className={`relative w-full md:aspect-[1.414/1] flex flex-col p-8 md:p-16 overflow-hidden ${dir === 'rtl' ? 'font-arabic' : ''}`}
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "3.4rem",
                    minHeight: "650px",
                  }}
                >
                  {/* Security & Design Elements */}
                  <div className="absolute inset-4 md:inset-8 border-[0.5px] border-slate-200 pointer-events-none" />
                  <div className="absolute inset-6 md:inset-10 border-[3px] border-double border-slate-900/10 pointer-events-none" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none">
                    <ShieldCheck
                      size={300}
                      className="md:w-[600px] md:h-[600px]"
                    />
                  </div>

                  <div className="relative z-10 h-full flex flex-col justify-between gap-8 md:gap-0">
                    {/* Header */}
                    <div
                      className="flex flex-col md:flex-row justify-between items-start pb-8 md:pb-12 gap-6 md:gap-0"
                      style={{ borderBottom: "1px solid #e2e8f0" }}
                    >
                      <div className="space-y-4">
                        <h2
                          className="text-3xl md:text-5xl font-serif font-black tracking-tighter uppercase leading-none"
                          style={{ color: "#0f172a" }}
                        >
                          {t.performanceProfile.title}
                        </h2>
                        <p
                          className="text-[10px] font-black uppercase tracking-[0.3em] mt-2"
                          style={{ color: "#94a3b8" }}
                        >
                          {t.performanceProfile.subtitle}
                        </p>
                        <div className="flex items-center gap-3">
                          <div
                            className="px-3 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-widest"
                            style={{
                              backgroundColor: "#f1f5f9",
                              color: "#64748b",
                            }}
                          >
                            {t.performanceProfile.ref}: {profile.referenceId}
                          </div>
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: "#2563eb" }}
                          />
                          <div
                            className="text-[10px] font-black uppercase tracking-widest"
                            style={{ color: "#cbd5e1" }}
                          >
                            {t.performanceProfile.verificationActive}
                          </div>
                        </div>
                      </div>
                      <div
                        className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-slate-100 p-2 shrink-0 overflow-hidden relative"
                      >
                        <Image
                          src="/logo-matc.png"
                          alt="Company Logo"
                          fill
                          sizes="(max-width: 768px) 96px, 128px"
                          className="object-contain p-2"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 py-8 md:py-12">
                      <div className="col-span-1 md:col-span-8 space-y-6 md:space-y-10">
                        <div className="space-y-4">
                          <p
                            className="text-[10px] font-black uppercase tracking-[0.4em]"
                            style={{ color: "#94a3b8" }}
                          >
                            {t.performanceProfile.institutionalAnalysis}
                          </p>
                          <h1
                            className="text-4xl md:text-7xl font-serif font-black tracking-tight leading-none italic break-all"
                            style={{ color: "#0f172a" }}
                          >
                            {profile.userName}
                          </h1>
                        </div>

                        <div
                          className={`${dir === 'rtl' ? 'pr-6 md:pr-8 border-r-4' : 'pl-6 md:pl-8 border-l-4'}`}
                          style={{ borderColor: "#2563eb" }}
                        >
                          <p
                            className="text-base md:text-lg font-serif leading-relaxed max-w-2xl font-medium"
                            style={{ color: "#334155" }}
                          >
                            {profile.summary}
                          </p>
                        </div>

                        <div className="flex gap-4">
                          <div
                            className="px-6 md:px-8 py-3 text-white text-[10px] md:text-[11px] font-black uppercase tracking-[0.25em] rounded-xl self-start"
                            style={{ backgroundColor: "#0f172a" }}
                          >
                            {t.performanceProfile.strategicLevel}: {profile.verdict}
                          </div>
                        </div>
                      </div>

                      <div
                        className="col-span-1 md:col-span-4 border rounded-3xl md:rounded-[2.5rem] p-6 md:p-8 space-y-6 md:space-y-8"
                        style={{
                          backgroundColor: "#f8fafc",
                          borderColor: "#f1f5f9",
                        }}
                      >
                        <h4
                          className="text-[10px] font-black uppercase tracking-[0.3em] pb-4"
                          style={{
                            color: "#0f172a",
                            borderBottom: "1px solid #e2e8f0",
                          }}
                        >
                          {t.performanceProfile.coreCompetencies}
                        </h4>
                        <div className="space-y-4 md:space-y-6">
                          {profile.competencies?.map(
                            (item: Competency, i: number) => (
                              <div key={i} className="space-y-2">
                                <div className="flex justify-between items-end">
                                  <span
                                    className="text-[9px] font-bold uppercase tracking-widest"
                                    style={{ color: "#94a3b8" }}
                                  >
                                    {item.label}
                                  </span>
                                  <span
                                    className="text-[9px] md:text-[10px] font-black uppercase tracking-tighter"
                                    style={{ color: "#1d4ed8" }}
                                  >
                                    {item.status}
                                  </span>
                                </div>
                                <div
                                  className="h-1 rounded-full overflow-hidden"
                                  style={{ backgroundColor: "#e2e8f0" }}
                                >
                                  <div
                                    className="h-full transition-all duration-1000"
                                    style={{
                                      width: `${item.score}%`,
                                      backgroundColor: "#0f172a",
                                    }}
                                  />
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                        <div className="pt-6 mt-auto border-t border-slate-100/50">
                          <div className="flex flex-col items-center">
                            <div className="flex items-center gap-2 mb-2 text-emerald-700/70">
                              <CheckCircle2 size={12} />
                              <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                                {t.performanceProfile.verifiedReadiness}
                              </span>
                            </div>

                            {/* Professional Validation Group - Signature OVER Stamp */}
                            <div className="relative flex flex-col items-center justify-center py-4">
                              {/* Company Stamp Base - Realistic CSS version */}
                              <div id="company-stamp-container" className="opacity-70 transform -rotate-12 transition-transform hover:rotate-0 duration-700">
                                <div
                                  className="w-36 h-18 border-[3px] rounded-xl flex flex-col items-center justify-center bg-white/50 backdrop-blur-[1px] shadow-sm relative overflow-hidden"
                                  style={{
                                    borderColor: "#3b82f6",
                                    color: "#3b82f6",
                                    fontFamily: "serif",
                                  }}
                                >
                                  {/* Ink Bleed Effect (CSS only to avoid CORS errors) */}
                                  <div className="absolute inset-0 opacity-[0.03] bg-slate-900 pointer-events-none" />

                                  <p className="text-[10px] font-black uppercase tracking-tighter leading-none mb-0.5">
                                    Sté MA
                                  </p>
                                  <p className="text-[7px] font-bold uppercase tracking-widest leading-none mb-1">
                                    Training Consulting
                                  </p>
                                  <div className="w-full h-px bg-blue-400/30 my-0.5" />
                                  <p className="text-[5px] font-bold leading-none mb-0.5">
                                    Tel: 44 172 264
                                  </p>
                                  <p className="text-[5px] font-bold leading-none">
                                    MF: 1805031P/A/M/000
                                  </p>
                                </div>
                              </div>

                              {/* Consultant Signature - Scrolled OVER the stamp with artistic offset */}
                              <div className="absolute top-1/2 left-1/2 -translate-x-[45%] -translate-y-1/2 opacity-90 pointer-events-none transform -rotate-6 z-20">
                                <svg
                                  width="200"
                                  height="85"
                                  viewBox="0 0 150 60"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  style={{ color: "#1e3a8a" }}
                                >
                                  {/* Primary Signature Path */}
                                  <path
                                    d="M10 45C25 42 45 12 65 22C85 32 105 5 130 15M15 52C35 48 55 42 95 45"
                                    stroke="currentColor"
                                    strokeWidth="2.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="drop-shadow-[0_2px_2px_rgba(30,58,138,0.2)]"
                                  />
                                  {/* Secondary Loop/Detail */}
                                  <path
                                    d="M35 28C40 22 50 18 55 32C60 46 45 52 40 42C35 32 50 22 65 27"
                                    stroke="currentColor"
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                  />
                                </svg>
                              </div>
                            </div>

                            <div className="w-20 h-px bg-slate-200 mb-1" />
                            <p className="text-[7px] font-black uppercase tracking-[0.4em] text-slate-400">
                            {t.performanceProfile.institutionalAuthority}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div
                      className="flex flex-col md:flex-row md:items-end justify-between pt-6 md:pt-8 gap-8 md:gap-0"
                      style={{ borderTop: "1px solid #e2e8f0" }}
                    >
                      <div className="flex gap-12 md:gap-16">
                        <div className="space-y-1">
                          <p
                            className="text-[10px] md:text-xs font-serif font-black"
                            style={{ color: "#0f172a" }}
                          >
                            {t.performanceProfile.dateOfAttestation}:{" "}
                            {new Date(profile.createdAt).toLocaleDateString(language, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                          </p>
                          <p
                            className="text-[8px] font-black uppercase tracking-[0.4em]"
                            style={{ color: "#94a3b8" }}
                          >
                            {t.performanceProfile.recordsHash}: SEC-{profile.referenceId}
                          </p>
                        </div>
                      </div>

                      <div className="text-left md:text-right">
                        <p
                          className="text-[8px] font-bold uppercase tracking-[0.35em] leading-relaxed"
                          style={{ color: "#cbd5e1" }}
                        >
                          {t.performanceProfile.generationNote}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
