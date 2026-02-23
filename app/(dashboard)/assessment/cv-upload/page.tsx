"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  CheckCircle,
  Loader2,
  FileText,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Globe,
  Check,
  Download,
} from "lucide-react";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Language } from "@/lib/i18n/translations";
import { StageProgressBanner, NextStageTeaser } from "@/components/assessment/NextStageTeaser";

const LANGUAGES = [
  { code: "en", name: "English", flag: "🇬🇧", nativeName: "English" },
  { code: "fr", name: "French", flag: "🇫🇷", nativeName: "Français" },
  { code: "ar", name: "Arabic", flag: "🇸🇦", nativeName: "العربية" },
];

// ✅ تعريف نوع بيانات تحليل السيرة الذاتية
interface CVAnalysisResult {
  overallScore: number;
  verdict: string;
  overview: string;
  strengths: string[];
  weaknesses: string[];
  skills: {
    technical: string[];
    soft: string[];
    gaps: string[];
  };
  experience: {
    years: number;
    quality: string;
    progression: string;
  };
  education: {
    level: string;
    relevance: string;
    notes: string;
  };
  immediateActions: string[];
  careerPaths: string[];
}

export default function CVUploadPage() {
  const router = useRouter();
  const { t, language, dir, setLanguage } = useLanguage();
  const resultsRef = useRef<HTMLDivElement>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<CVAnalysisResult | null>(
    null,
  );
  const [showResults, setShowResults] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const checkProgress = async () => {
      try {
        const userProfile = JSON.parse(
          localStorage.getItem("userProfile") || "{}",
        );
        const userId = userProfile.email || userProfile.fullName;

        let sessionFound = false;

        // ✅ 1. المصدر الأساسي: MongoDB عبر API الجديد
        if (userId) {
          try {
            const res = await fetch(
              `/api/user/progress?userId=${encodeURIComponent(userId)}`,
            );
            if (res.ok) {
              const response = await res.json();

              if (response.hasData && response.data) {
                const data = response.data;
                sessionFound = true;

                // حفظ البيانات في localStorage كنسخة احتياطية
                if (data.cvAnalysis) {
                  localStorage.setItem(
                    "cvAnalysis",
                    JSON.stringify(data.cvAnalysis),
                  );
                }
                if (data.language) {
                  localStorage.setItem("selectedLanguage", data.language);
                }
                if (data.interviewEvaluation) {
                  localStorage.setItem(
                    "interviewEvaluation",
                    JSON.stringify(data.interviewEvaluation),
                  );
                }
                if (data.roleSuggestions) {
                  localStorage.setItem(
                    "roleSuggestions",
                    JSON.stringify(data.roleSuggestions),
                  );
                }
                if (data.selectedRole) {
                  localStorage.setItem(
                    "selectedRole",
                    JSON.stringify(data.selectedRole),
                  );
                }
                if (data.generatedDocuments) {
                  localStorage.setItem(
                    "generatedDocuments",
                    JSON.stringify(data.generatedDocuments),
                  );
                }

                const params = new URLSearchParams(window.location.search);
                const isViewMode = params.get('view') === 'history';

                if (isViewMode && data.cvAnalysis) {
                  setAnalysisResult(data.cvAnalysis as CVAnalysisResult);
                  setShowResults(true);
                  if (data.language) setSelectedLanguage(data.language);
                }

                // التوجيه بناءً على currentStep - فقط إذا لم نكن في وضع المشاهدة
                if (!isViewMode) {
                  switch (data.currentStep) {
                    case "interview_in_progress":
                      router.push("/assessment/interview");
                      return;
                    case "interview_complete":
                      router.push("/assessment/results");
                      return;
                    case "role_discovery":
                      router.push("/assessment/role-discovery");
                      return;
                    case "role_discovery_complete":
                      router.push("/assessment/role-suggestions");
                      return;
                    case "role_selected":
                    case "cv_generation":
                      router.push("/assessment/cv-generation");
                      return;
                    case "simulation_in_progress":
                    case "simulation_complete":
                      router.push("/assessment/simulation");
                      return;
                    case "completed":
                      router.push("/dashboard");
                      return;
                    case "analysis_complete":
                      // عرض النتائج في هذه الصفحة
                      if (data.cvAnalysis) {
                        setAnalysisResult(data.cvAnalysis);
                        setShowResults(true);
                        setUploadComplete(true);
                        setSelectedLanguage(data.language || "en");
                      }
                      return;
                  }
                } else {
                  // في وضع المشاهدة، نعرض النتائج دائماً إذا وجدت
                  if (data.cvAnalysis) {
                    setAnalysisResult(data.cvAnalysis);
                    setShowResults(true);
                    setUploadComplete(true);
                    setSelectedLanguage(data.language || "en");
                  }
                }
              }
            }
          } catch (err) {
            console.error("❌ API check failed", err);
          }
        }

        // 2. Fallback logic: Only for Guests or specific error cases
        if (!sessionFound) {
          const localAnalysis = localStorage.getItem("cvAnalysis");
          const localLanguage = localStorage.getItem("selectedLanguage");

          // If we have a userId but the API returned nothing, the local data is likely stale (from another user)
          if (userId) {
            console.log(
              "Logged in user with no cloud data - clearing stale local cache",
            );
            localStorage.removeItem("cvAnalysis");
            // Don't show results from other users
            setAnalysisResult(null);
            setUploadComplete(false);
            setShowResults(false);
          } else if (localAnalysis) {
            // Guest user fallback
            try {
              const parsedAnalysis = JSON.parse(localAnalysis);
              if (parsedAnalysis && parsedAnalysis.overallScore) {
                setAnalysisResult(parsedAnalysis);
                setUploadComplete(true);
                setShowResults(true);
                if (localLanguage) setSelectedLanguage(localLanguage);
              }
            } catch (e) {
              console.error("Failed to parse local analysis", e);
            }
          }
        }
      } catch (error) {
        console.error("Error checking progress:", error);
      }
    };

    checkProgress();
  }, [router]);

  const handleDownloadReport = async () => {
    if (!analysisResult) return;
    setIsDownloading(true);

    try {
      // 1. Create a dedicated container
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.top = "0";
      container.style.width = "800px";
      container.style.backgroundColor = "#ffffff";
      container.style.padding = "40px";
      container.style.fontFamily = "'Tajawal', sans-serif";
      container.style.color = "#0f172a";

      // 2. Build Report HTML
      container.innerHTML = `
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap');
                    * { box-sizing: border-box; }
                    .page-break { page-break-inside: avoid; }
                    .section-title { font-size: 16px; font-weight: bold; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 15px; }
                    .skill-tag { display: inline-block; padding: 4px 10px; border-radius: 99px; font-size: 12px; margin-right: 5px; margin-bottom: 5px; }
                </style>
                <div style="font-family: 'Tajawal', sans-serif;">
                    
                    <!-- Header -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px;">
                        <div>
                            <div style="color: #2563eb; font-size: 24px; font-weight: bold;">MA-TRAINING-CONSULTING</div>
                            <div style="color: #64748b; font-size: 14px;">Professional CV Audit</div>
                        </div>
                        <div style="text-align: right;">
                            <h1 style="margin: 0; font-size: 20px; color: #1e293b;">Analysis Report</h1>
                            <p style="margin: 5px 0 0 0; color: #64748b; font-size: 12px;">${new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    <!-- Score & Verdict -->
                    <div style="background-color: #f8fafc; padding: 25px; border-radius: 12px; margin-bottom: 30px; border: 1px solid #e2e8f0;">
                         <div style="display: flex; gap: 20px; align-items: start;">
                             <div style="text-align: center; padding: 15px; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; min-width: 120px;">
                                 <div style="font-size: 12px; color: #64748b; text-transform: uppercase;">Overall Score</div>
                                 <div style="font-size: 36px; font-weight: bold; color: #2563eb; line-height: 1;">${analysisResult.overallScore}</div>
                             </div>
                             <div style="flex: 1;">
                                 <h2 style="font-size: 16px; color: #334155; margin-top: 0; font-style: italic;">"${analysisResult.verdict}"</h2>
                                 <p style="font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 0;">
                                     ${analysisResult.overview}
                                 </p>
                             </div>
                         </div>
                    </div>

                    <!-- Strengths & Weaknesses -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                        <div class="page-break" style="border: 1px solid #bbf7d0; padding: 20px; border-radius: 12px;">
                             <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #166534; text-transform: uppercase;">Key Strengths</h3>
                             <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #14532d; line-height: 1.5;">
                                 ${analysisResult.strengths?.map((s) => `<li style="margin-bottom: 5px;">${s}</li>`).join("") || "<li>None identified</li>"}
                             </ul>
                        </div>
                        <div class="page-break" style="border: 1px solid #fecaca; padding: 20px; border-radius: 12px;">
                             <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #b91c1c; text-transform: uppercase;">Critical Weaknesses</h3>
                             <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #7f1d1d; line-height: 1.5;">
                                 ${analysisResult.weaknesses?.map((s) => `<li style="margin-bottom: 5px;">${s}</li>`).join("") || "<li>None identified</li>"}
                             </ul>
                        </div>
                    </div>

                    <!-- Skills -->
                    <div class="page-break" style="margin-bottom: 30px; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px;">
                        <h3 class="section-title">Skills Assessment</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
                            <div>
                                <div style="font-size: 12px; font-weight: bold; color: #1d4ed8; margin-bottom: 8px;">Technical</div>
                                <div>
                                    ${analysisResult.skills?.technical?.map((s) => `<span class="skill-tag" style="background: #eff6ff; color: #1d4ed8; border: 1px solid #dbeafe;">${s}</span>`).join("") || "-"}
                                </div>
                            </div>
                            <div>
                                <div style="font-size: 12px; font-weight: bold; color: #7e22ce; margin-bottom: 8px;">Soft Skills</div>
                                <div>
                                    ${analysisResult.skills?.soft?.map((s) => `<span class="skill-tag" style="background: #faf5ff; color: #7e22ce; border: 1px solid #f3e8ff;">${s}</span>`).join("") || "-"}
                                </div>
                            </div>
                            <div>
                                <div style="font-size: 12px; font-weight: bold; color: #c2410c; margin-bottom: 8px;">Identified Gaps</div>
                                <div>
                                    ${analysisResult.skills?.gaps?.map((s) => `<span class="skill-tag" style="background: #fff7ed; color: #c2410c; border: 1px solid #ffedd5;">${s}</span>`).join("") || "-"}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Experience & Education -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                        <div class="page-break" style="border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px;">
                             <h3 class="section-title">Experience</h3>
                             <div style="font-size: 13px; margin-bottom: 5px;"><strong>Years:</strong> ${analysisResult.experience?.years}</div>
                             <div style="font-size: 13px; margin-bottom: 5px;"><strong>Quality:</strong> <span style="color: #2563eb;">${analysisResult.experience?.quality}</span></div>
                             <p style="font-size: 12px; color: #64748b; margin-top: 10px;">${analysisResult.experience?.progression}</p>
                        </div>
                        <div class="page-break" style="border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px;">
                             <h3 class="section-title">Education</h3>
                             <div style="font-size: 13px; margin-bottom: 5px;"><strong>Level:</strong> ${analysisResult.education?.level}</div>
                             <div style="font-size: 13px; margin-bottom: 5px;"><strong>Relevance:</strong> ${analysisResult.education?.relevance}</div>
                             <p style="font-size: 12px; color: #64748b; margin-top: 10px;">${analysisResult.education?.notes}</p>
                        </div>
                    </div>

                    <!-- Immediate Actions -->
                    <div class="page-break" style="background-color: #eff6ff; padding: 20px; border-radius: 12px; border: 1px solid #bfdbfe; margin-bottom: 30px;">
                        <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #1e40af;">Recommended Actions</h3>
                        <ol style="margin: 0; padding-left: 20px; font-size: 13px; color: #1e3a8a; line-height: 1.6;">
                             ${analysisResult.immediateActions?.map((s) => `<li style="margin-bottom: 5px;">${s}</li>`).join("") || "<li>No specific actions.</li>"}
                        </ol>
                    </div>

                    <!-- Footer -->
                    <div style="margin-top: 50px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
                        MA-TRAINING-CONSULTING • Artificial Intelligence HR Audit
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
        windowWidth: 800,
      });

      // 4. Cleanup
      document.body.removeChild(container);

      // 5. Generate PDF
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(
        imgData,
        "PNG",
        0,
        position,
        pdfWidth,
        imgHeight,
        undefined,
        "FAST",
      );
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(
          imgData,
          "PNG",
          0,
          position,
          pdfWidth,
          imgHeight,
          undefined,
          "FAST",
        );
        heightLeft -= pdfHeight;
      }

      pdf.save(
        `CV-Analysis-Report-${fileName?.replace(/\s+/g, "-") || "Expert"}.pdf`,
      );
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to generate PDF report.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    // ... existing drag logic ...
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) processFile(files[0]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  interface FileUploadError extends Error {
    details?: {
      extractedLength: number;
      fileName: string;
      bufferSize: number;
      bufferPreview: string;
    };
  }

  const processFile = async (file: File) => {
    // ... existing process logic ...
    setFileName(file.name);
    setIsUploading(true);
    setShowResults(false);

    try {
      // Check file size (500MB = 500 * 1024 * 1024 bytes)
      const maxSize = 500 * 1024 * 1024; // 500MB in bytes
      if (file.size > maxSize) {
        throw new Error(
          `File size exceeds 500MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`,
        );
      }

      // Get user info from localStorage
      const userProfile = JSON.parse(
        localStorage.getItem("userProfile") || "{}",
      );
      const userId = userProfile.email || userProfile.fullName || "anonymous";
      const userName = userProfile.fullName || "Anonymous User";

      // Prepare FormData to send the actual file for server-side parsing
      const formData = new FormData();
      formData.append("file", file);
      formData.append("language", selectedLanguage || "en");
      formData.append("userId", userId);
      formData.append("userName", userName);

      // Call AI Analysis API
      const response = await fetch("/api/analyze-cv", {
        method: "POST",
        body: formData, // Send FormData instead of JSON
      });

      const result = await response.json();
      console.log("API Response:", result);

      if (!response.ok) {
        if (result.error === 'ONE_ATTEMPT_LIMIT') {
             const confirmUpgrade = confirm(selectedLanguage === 'ar' 
                ? 'لقد استخدمت محاولتك المجانية الوحيدة. هل تريد الانتقال لصفحة الاشتراك لفتح محاولات غير محدودة؟' 
                : 'You have already used your one free diagnostic attempt. Would you like to go to the subscription page to unlock unlimited attempts?');
             if (confirmUpgrade) {
                 router.push('/subscription');
             }
             setIsUploading(false);
             return;
        }

        const errorData = new Error(
          result.error || `Server error: ${response.status}`,
        ) as FileUploadError;
        errorData.details = result.details;
        throw errorData;
      }

      if (result.success && result.analysis) {
        setAnalysisResult(result.analysis);
        setUploadComplete(true);
        setIsUploading(false);

        // Show results after a brief delay
        setTimeout(() => {
          setShowResults(true);
        }, 500);

        // Store analysis in localStorage for interview page
        localStorage.setItem("cvAnalysis", JSON.stringify(result.analysis));
        localStorage.setItem("selectedLanguage", selectedLanguage || "en");

        // ✅ Update Trial Expiry in Profile
        if (result.trialExpiry) {
            const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
            const updatedProfile = { ...userProfile, trialExpiry: result.trialExpiry };
            localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
            window.dispatchEvent(new Event("profileUpdated"));
        }

        // Clear old progress to ensure fresh start
        localStorage.removeItem("roleSuggestions");
        localStorage.removeItem("interviewEvaluation");
        localStorage.removeItem("selectedRole");
        localStorage.removeItem("interviewHistory");
      } else {
        throw new Error(result.error || "Analysis failed - no data returned");
      }
    } catch (error: unknown) {
      console.error("Upload error:", error);
      setIsUploading(false);

      const uploadError = error as FileUploadError;
      const errorMessage = uploadError.message || "Unknown error occurred";
      const details = uploadError.details
        ? `\n\nTechnical Details:\n- Extracted Text: ${uploadError.details.extractedLength} chars\n- File Size: ${(uploadError.details.bufferSize / 1024).toFixed(1)} KB\n- Buffer Preview: ${uploadError.details.bufferPreview}`
        : "";

      alert(
        `Failed to analyze CV: ${errorMessage}${details}\n\nTips:\n1. Ensure the PDF has selectable text (not a scan).\n2. Try a Word (.docx) file instead.\n3. Try exporting from Canva as "PDF Standard".`,
      );
    }
  };

  const proceedToInterview = () => {
    const params = new URLSearchParams(window.location.search);
    const isViewMode = params.get('view') === 'history';
    if (isViewMode) {
      router.push("/assessment/interview?view=history");
    } else {
      router.push("/assessment/interview");
    }
  };




    const handleLanguageSelect = (langCode: string) => {
        setSelectedLanguage(langCode);
        setLanguage(langCode as Language);
        localStorage.setItem('selectedLanguage', langCode);
    };

    // Language Selection Screen
    if (!selectedLanguage) {
        const platformLanguages = LANGUAGES.filter(l => l.code !== 'es');
        
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 md:p-12"
                >
                    <div className="text-center mb-10">
                        <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <Globe className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                            {selectedLanguage === 'ar' ? 'اختر لغتك' : selectedLanguage === 'fr' ? 'Choisissez votre langue' : 'Choose Your Language'}
                        </h1>
                        <p className="text-slate-500 text-lg">
                            {selectedLanguage === 'ar' ? 'اختر اللغة المفضلة لتحليل سيرتك الذاتية وتلقي الملاحظات' : selectedLanguage === 'fr' ? 'Sélectionnez votre langue préférée pour l\'analyse du CV et les retours' : 'Select your preferred language for CV analysis and feedback'}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {platformLanguages.map((lang) => (
                            <motion.button
                                key={lang.code}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleLanguageSelect(lang.code)}
                                className="group relative p-6 bg-slate-50 hover:bg-blue-50 border-2 border-slate-200 hover:border-blue-500 rounded-2xl transition-all text-left overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="relative flex items-center gap-4">
                                    <div className="text-5xl">{lang.flag}</div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-slate-900 mb-1">
                                            {lang.nativeName}
                                        </h3>
                                        <p className="text-sm text-slate-500">{lang.name}</p>
                                    </div>
                                    <div className="w-6 h-6 rounded-full border-2 border-slate-300 group-hover:border-blue-500 group-hover:bg-blue-500 flex items-center justify-center transition-all">
                                        <Check className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-sm text-blue-800 text-center">
              <strong>Note:</strong> All feedback and analysis will be provided
              in your selected language
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── Full Diagnostic Journey Data ────────────────────────────────────────────
  const journeySteps = language === 'ar' ? [
    {
      id: "01", color: "blue", icon: "📄",
      title: "رفع ملف السيرة الذاتية",
      subtitle: "التدقيق الرقمي للملف",
      desc: "ارفع سيرتك الذاتية وسيقوم الذكاء الاصطناعي بتحليل خبراتك ومهاراتك والفجوات المحتملة تلقائياً.",
      duration: "دقيقتان",
      status: "current"
    },
    {
      id: "02", color: "purple", icon: "🎤",
      title: "مقابلة التقييم التنفيذي",
      subtitle: "التحقق الاستراتيجي",
      desc: "محادثة استراتيجية مع خبير الذكاء الاصطناعي للتحقق المباشر من كفاءاتك عبر أسئلة تنفيذية عميقة.",
      duration: "15-20 دقيقة",
      status: "upcoming"
    },
    {
      id: "03", color: "emerald", icon: "📊",
      title: "نتائج التقييم",
      subtitle: "تقرير الدقة والجاهزية",
      desc: "تقرير شامل يقارن السيرة الذاتية بالواقع مع درجة الدقة وتحليل نقاط القوة والمبالغات المكتشفة.",
      duration: "فوري",
      status: "upcoming"
    },
    {
      id: "04", color: "orange", icon: "🧭",
      title: "اكتشاف المسار المهني",
      subtitle: "تحديد الأهداف والطموحات",
      desc: "محادثة لاستكشاف أهدافك المهنية وطموحاتك لتوجيه الذكاء الاصطناعي نحو الأدوار الأنسب لك.",
      duration: "10 دقائق",
      status: "upcoming"
    },
    {
      id: "05", color: "pink", icon: "🎯",
      title: "اقتراحات الأدوار",
      subtitle: "الوظائف المتوافقة مع ملفك",
      desc: "قائمة الأدوار الوظيفية المخصصة لك مصنفة بين الجاهزية الآنية والأهداف المستقبلية مع نسبة التوافق.",
      duration: "فوري",
      status: "upcoming"
    },
    {
      id: "06", color: "cyan", icon: "✍️",
      title: "إنشاء السيرة الذاتية الاحترافية",
      subtitle: "CV + رسالة التغطية",
      desc: "حوار مع مهندس المسار المهني الذكي لبناء سيرة ذاتية محترفة ورسالة تغطية مخصصة للدور المختار.",
      duration: "15 دقيقة",
      status: "upcoming"
    },
    {
      id: "07", color: "amber", icon: "🏆",
      title: "محاكاة الدور التنفيذي",
      subtitle: "اختبار الأداء في بيئة محاكاة",
      desc: "سيناريوهات تنفيذية حقيقية لقياس أداءك وتطوير مهاراتك في بيئة تحاكي دورك المهني المستهدف.",
      duration: "30-45 دقيقة",
      status: "upcoming"
    },
  ] : language === 'fr' ? [
    {
      id: "01", color: "blue", icon: "📄",
      title: "Téléchargement du CV",
      subtitle: "Audit numérique du profil",
      desc: "Téléchargez votre CV et notre IA analyse automatiquement vos expériences, compétences et lacunes.",
      duration: "2 minutes",
      status: "current"
    },
    {
      id: "02", color: "purple", icon: "🎤",
      title: "Entretien d'évaluation exécutif",
      subtitle: "Vérification stratégique",
      desc: "Dialogue stratégique avec l'expert IA pour valider directement vos compétences via des questions de haut niveau.",
      duration: "15-20 min",
      status: "upcoming"
    },
    {
      id: "03", color: "emerald", icon: "📊",
      title: "Résultats de l'évaluation",
      subtitle: "Rapport de précision",
      desc: "Rapport complet comparant votre CV à la réalité avec score de précision et analyse des forces détectées.",
      duration: "Instantané",
      status: "upcoming"
    },
    {
      id: "04", color: "orange", icon: "🧭",
      title: "Découverte du parcours",
      subtitle: "Objectifs et ambitions",
      desc: "Conversation pour explorer vos objectifs afin de guider l'IA vers les rôles les plus adaptés à votre profil.",
      duration: "10 minutes",
      status: "upcoming"
    },
    {
      id: "05", color: "pink", icon: "🎯",
      title: "Recommandations de rôles",
      subtitle: "Postes alignés avec votre profil",
      desc: "Liste de rôles personnalisés classés en prêts maintenant et objectifs futurs avec pourcentage d'alignement.",
      duration: "Instantané",
      status: "upcoming"
    },
    {
      id: "06", color: "cyan", icon: "✍️",
      title: "Studio CV professionnel",
      subtitle: "CV + Lettre de motivation",
      desc: "Dialogue avec l'architecte de carrière IA pour créer un CV professionnel et une lettre adaptée au rôle choisi.",
      duration: "15 minutes",
      status: "upcoming"
    },
    {
      id: "07", color: "amber", icon: "🏆",
      title: "Simulation de rôle exécutif",
      subtitle: "Test de performance en simulation",
      desc: "Scénarios exécutifs réels pour mesurer votre performance et développer vos compétences dans votre rôle cible.",
      duration: "30-45 min",
      status: "upcoming"
    },
  ] : [
    {
      id: "01", color: "blue", icon: "📄",
      title: "CV Upload & Parsing",
      subtitle: "Digital Profile Audit",
      desc: "Upload your resume and our AI automatically analyzes your experience, skills, and career gaps in depth.",
      duration: "2 minutes",
      status: "current"
    },
    {
      id: "02", color: "purple", icon: "🎤",
      title: "Executive Assessment Interview",
      subtitle: "Strategic Verification",
      desc: "Strategic dialogue with the AI expert to directly validate your competencies through high-level scenario questions.",
      duration: "15-20 min",
      status: "upcoming"
    },
    {
      id: "03", color: "emerald", icon: "📊",
      title: "Assessment Results",
      subtitle: "Accuracy & Readiness Report",
      desc: "Comprehensive report comparing your CV to reality with accuracy score and analysis of verified strengths.",
      duration: "Instant",
      status: "upcoming"
    },
    {
      id: "04", color: "orange", icon: "🧭",
      title: "Career Path Discovery",
      subtitle: "Goals & Aspirations Chat",
      desc: "Conversation to explore your professional goals to guide the AI toward the most suitable roles for your profile.",
      duration: "10 minutes",
      status: "upcoming"
    },
    {
      id: "05", color: "pink", icon: "🎯",
      title: "Role Recommendations",
      subtitle: "Profile-Aligned Positions",
      desc: "Personalized role list classified into ready-now and future goals, each with a match percentage score.",
      duration: "Instant",
      status: "upcoming"
    },
    {
      id: "06", color: "cyan", icon: "✍️",
      title: "Professional CV Studio",
      subtitle: "CV + Cover Letter",
      desc: "Dialogue with the AI Career Architect to build a professional CV and custom cover letter for your chosen role.",
      duration: "15 minutes",
      status: "upcoming"
    },
    {
      id: "07", color: "amber", icon: "🏆",
      title: "Executive Role Simulation",
      subtitle: "Performance Testing",
      desc: "Real executive scenarios to measure your performance and develop your skills in a simulated professional environment.",
      duration: "30-45 min",
      status: "upcoming"
    },
  ];

  const colorMap: Record<string, { bg: string; border: string; badge: string; text: string; glow: string; line: string }> = {
    blue:    { bg: "bg-blue-50",   border: "border-blue-500",   badge: "bg-blue-600 text-white",    text: "text-blue-600",   glow: "shadow-blue-500/20",   line: "bg-blue-300" },
    purple:  { bg: "bg-purple-50", border: "border-purple-400", badge: "bg-purple-600 text-white",  text: "text-purple-600", glow: "shadow-purple-500/20", line: "bg-purple-300" },
    emerald: { bg: "bg-emerald-50",border: "border-emerald-400",badge: "bg-emerald-600 text-white", text: "text-emerald-600",glow: "shadow-emerald-500/20",line: "bg-emerald-300" },
    orange:  { bg: "bg-orange-50", border: "border-orange-400", badge: "bg-orange-500 text-white",  text: "text-orange-600", glow: "shadow-orange-500/20", line: "bg-orange-300" },
    pink:    { bg: "bg-pink-50",   border: "border-pink-400",   badge: "bg-pink-600 text-white",    text: "text-pink-600",   glow: "shadow-pink-500/20",   line: "bg-pink-300" },
    cyan:    { bg: "bg-cyan-50",   border: "border-cyan-400",   badge: "bg-cyan-600 text-white",    text: "text-cyan-600",   glow: "shadow-cyan-500/20",   line: "bg-cyan-300" },
    amber:   { bg: "bg-amber-50",  border: "border-amber-400",  badge: "bg-amber-500 text-white",   text: "text-amber-600",  glow: "shadow-amber-500/20",  line: "bg-amber-300" },
  };

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto">

      {/* ═══ DIGNNOS Full Journey Section ══════════════════════════════════════ */}
      <div className="mb-14 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-4 border border-blue-100"
        >
          {t.diagnosticFlow.badge}
        </motion.div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-2xl md:text-4xl font-black text-slate-900 mb-3 uppercase tracking-tight"
        >
          {t.diagnosticFlow.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-slate-500 text-lg max-w-2xl mx-auto mb-12"
        >
          {t.diagnosticFlow.subtitle}
        </motion.p>

        {/* ─── Journey Timeline Grid ──────────────────────────────────────── */}
        <div className="relative max-w-6xl mx-auto px-2">

          {/* Desktop: 4 + 3 layout */}
          <div className="hidden md:block">
            {/* Row 1 — Steps 01-04 */}
            <div className="grid grid-cols-4 gap-0 mb-0 relative">
              {journeySteps.slice(0, 4).map((step, idx) => {
                const c = colorMap[step.color];
                const isActive = step.status === "current";
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="relative flex flex-col items-center"
                  >
                    {/* Card */}
                    <div className={`w-full mx-2 p-5 rounded-2xl border-2 transition-all duration-300 text-${dir === 'rtl' ? 'right' : 'left'} ${
                      isActive
                        ? `${c.bg} ${c.border} shadow-xl ${c.glow} scale-105 z-10`
                        : "bg-white border-slate-100 hover:border-slate-200 hover:shadow-md"
                    }`}>
                      {/* Badge + Icon */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${
                          isActive ? c.badge : "bg-slate-100 text-slate-500"
                        }`}>
                          {step.id}
                        </div>
                        <span className="text-2xl">{step.icon}</span>
                        {isActive && (
                          <span className={`ml-auto text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${c.badge}`}>
                            {language === 'ar' ? 'أنت هنا' : language === 'fr' ? 'Vous êtes ici' : 'You are here'}
                          </span>
                        )}
                      </div>
                      <h3 className={`font-bold text-sm mb-1 ${isActive ? "text-slate-900" : "text-slate-700"}`}>
                        {step.title}
                      </h3>
                      <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${isActive ? c.text : "text-slate-400"}`}>
                        {step.subtitle}
                      </p>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                        {step.desc}
                      </p>
                      <div className={`mt-3 text-[10px] font-bold flex items-center gap-1 ${isActive ? c.text : "text-slate-300"}`}>
                        ⏱ {step.duration}
                      </div>
                    </div>

                    {/* Connector line right → */}
                    {idx < 3 && (
                      <div className="absolute top-8 right-0 translate-x-1/2 w-full flex items-center justify-end pr-0 z-20 pointer-events-none" style={{top: "2.2rem"}}>
                        <div className={`h-0.5 w-full max-w-[calc(100%-3rem)] ${idx === 0 ? "bg-blue-300" : "bg-slate-200"}`} />
                        <ArrowRight className={`w-4 h-4 -ml-1 ${idx === 0 ? "text-blue-400" : "text-slate-300"}`} />
                      </div>
                    )}

                    {/* Down connector on last of row 1 */}
                    {idx === 3 && (
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 h-8 w-0.5 bg-slate-200" />
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Row 2 — Steps 05-07 (reversed for snake layout) */}
            <div className="mt-8 grid grid-cols-4 gap-0">
              {/* Empty cell to align with col 4 */}
              <div className="col-start-4 relative">
                {/* Up connector from row 1 col 4 */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 h-8 w-0.5 bg-slate-200" />
              </div>

              {/* Steps 07, 06, 05 in cols 4, 3, 2 (snake RTL direction) */}
              {[...journeySteps.slice(4)].reverse().map((step, idx) => {
                const colIdx = 2 - idx; // cols 2,1,0
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (4 + idx) * 0.08 }}
                    className="relative flex flex-col items-center"
                    style={{ gridColumn: colIdx + 1, gridRow: 1 }}
                  >
                    <div className={`w-full mx-2 p-5 rounded-2xl border-2 transition-all duration-300 text-${dir === 'rtl' ? 'right' : 'left'} bg-white border-slate-100 hover:border-slate-200 hover:shadow-md`}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs bg-slate-100 text-slate-500">
                          {step.id}
                        </div>
                        <span className="text-2xl">{step.icon}</span>
                      </div>
                      <h3 className="font-bold text-sm mb-1 text-slate-700">{step.title}</h3>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-2 text-slate-400">{step.subtitle}</p>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{step.desc}</p>
                      <div className="mt-3 text-[10px] font-bold flex items-center gap-1 text-slate-300">
                        ⏱ {step.duration}
                      </div>
                    </div>

                    {/* Connector arrows (left ← direction for snake) */}
                    {colIdx > 0 && (
                      <div className="absolute top-8 left-0 -translate-x-1/2 z-20 pointer-events-none flex items-center" style={{top: "2.2rem"}}>
                        <ArrowLeft className="w-4 h-4 text-slate-300" />
                        <div className="h-0.5 w-full max-w-[calc(100%-1rem)] bg-slate-200" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Mobile: Vertical list */}
          <div className="md:hidden flex flex-col gap-4">
            {journeySteps.map((step, idx) => {
              const c = colorMap[step.color];
              const isActive = step.status === "current";
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className="relative flex gap-4 items-start"
                >
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 z-10 ${
                      isActive ? c.badge : "bg-slate-100 text-slate-500"
                    }`}>
                      {step.icon}
                    </div>
                    {idx < journeySteps.length - 1 && (
                      <div className={`w-0.5 h-6 mt-1 ${isActive ? c.line : "bg-slate-200"}`} />
                    )}
                  </div>

                  {/* Card */}
                  <div className={`flex-1 p-4 rounded-xl border-2 mb-2 ${
                    isActive
                      ? `${c.bg} ${c.border} shadow-lg ${c.glow}`
                      : "bg-white border-slate-100"
                  }`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                        isActive ? c.badge : "bg-slate-100 text-slate-500"
                      }`}>
                        {step.id}
                      </span>
                      {isActive && (
                        <span className={`text-[10px] font-black ${c.text}`}>
                          ← {language === 'ar' ? 'أنت هنا' : language === 'fr' ? 'Vous êtes ici' : 'You are here'}
                        </span>
                      )}
                    </div>
                    <h3 className={`font-bold text-sm mb-0.5 ${isActive ? "text-slate-900" : "text-slate-600"}`}>
                      {step.title}
                    </h3>
                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${isActive ? c.text : "text-slate-400"}`}>
                      {step.subtitle}
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                    <div className={`mt-2 text-[10px] font-bold ${isActive ? c.text : "text-slate-300"}`}>⏱ {step.duration}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>

      {/* ── Next Stage Banner (top of upload area) ── */}
      <StageProgressBanner stage="cv-upload" />

      <AnimatePresence mode="wait">
        {!showResults ? (
          // Upload Section
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-12 text-center"
          >
            <div className="mb-8 flex items-center justify-between">
              <div className="text-left flex-1 flex items-center gap-4">
                <button
                  onClick={() => setSelectedLanguage(null)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors group"
                  title={t.cvUpload.back}
                >
                  <ArrowLeft className="w-6 h-6 text-slate-400 group-hover:text-blue-600" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold mb-1 text-slate-900">
                    {t.cvUpload.title}
                  </h1>
                  <p className="text-slate-500 text-lg">
                    {t.cvUpload.subtitle}
                  </p>
                </div>
              </div>

              {/* Language Badge */}
              <button
                onClick={() => setSelectedLanguage(null)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all ml-4"
                title="Change language"
              >
                <span className="text-2xl">
                  {LANGUAGES.find((l) => l.code === selectedLanguage)?.flag}
                </span>
                <span className="text-sm font-medium text-slate-700">
                  {LANGUAGES.find((l) => l.code === selectedLanguage)?.name}
                </span>
              </button>
            </div>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                                relative group h-80 flex flex-col items-center justify-center
                                border-3 border-dashed rounded-2xl transition-all duration-300
                                ${isDragOver ? "border-blue-500 bg-blue-50 scale-[1.02]" : "border-slate-200 bg-slate-50 hover:border-blue-400 hover:bg-slate-100"}
                                ${uploadComplete ? "border-green-500/50 bg-green-50" : ""}
                            `}
            >
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                onChange={handleFileInput}
                disabled={isUploading || uploadComplete}
              />

              <div className="flex flex-col items-center justify-center gap-6 relative z-10 pointer-events-none p-6">
                <AnimatePresence mode="wait">
                  {!isUploading && !uploadComplete && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform shadow-sm">
                        <UploadCloud className="w-10 h-10" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        {t.cvUpload.dragDrop}
                      </h3>
                      <p className="text-base text-slate-500">
                        {t.cvUpload.fileTypes}
                      </p>
                      <button className="mt-6 px-6 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium shadow-sm group-hover:border-blue-400 group-hover:text-blue-600 transition-colors">
                        {t.cvUpload.browse}
                      </button>
                    </motion.div>
                  )}

                  {isUploading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-24 h-24 rounded-full border-4 border-blue-100 border-t-blue-600 flex items-center justify-center mb-6 animate-spin">
                        <Loader2 className="w-10 h-10 text-transparent" />
                      </div>
                      <h3 className="text-xl font-bold text-blue-600 mb-2">
                        {t.cvUpload.analyzing}
                      </h3>
                      <p className="text-base text-slate-500">
                        {t.cvUpload.extracting}
                      </p>
                      {fileName && (
                        <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                          <FileText className="w-4 h-4" />
                          <span>{fileName}</span>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {uploadComplete && !showResults && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-green-600 mb-2">
                        Analysis Complete!
                      </h3>
                      <p className="text-base text-slate-500">
                        Preparing your detailed feedback...
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ) : (
          // Results Section
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Wrapper div for PDF capture */}
            <div
              ref={resultsRef}
              style={{
                backgroundColor: "#f8fafc",
                padding: "24px",
                borderRadius: "12px",
                fontFamily: "sans-serif",
              }}
            >
              {/* Header */}
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  padding: "24px",
                  marginBottom: "24px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    zIndex: 10,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "16px",
                    marginBottom: "16px",
                  }}
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <h1
                          style={{
                            fontSize: "30px",
                            fontWeight: "bold",
                            color: "#0f172a",
                            marginBottom: "8px",
                          }}
                        >
                          {t.diagnosticFlow.resultsTitle}
                        </h1>
                        <p style={{ color: "#64748b" }}>
                          {t.diagnosticFlow.resultsSubtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: "12px",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "8px 16px",
                          backgroundColor: "#eff6ff",
                          borderRadius: "12px",
                          border: "1px solid #dbeafe",
                        }}
                      >
                        <Award
                          style={{
                            width: "20px",
                            height: "20px",
                            color: "#2563eb",
                          }}
                        />
                        <div style={{ textAlign: "right" }}>
                          <p
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              fontWeight: "500",
                              margin: 0,
                            }}
                          >
                            {t.diagnosticFlow.overallScoreLabel}
                          </p>
                          <p
                            style={{
                              fontSize: "24px",
                              fontWeight: "bold",
                              color: "#2563eb",
                              margin: 0,
                            }}
                          >
                            {analysisResult?.overallScore || 0}/100
                          </p>
                        </div>
                      </div>
                      <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                animate={{ 
                                                    scale: [1, 1.1, 1],
                                                }}
                                                transition={{ 
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                                onClick={proceedToInterview}
                                                className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg shadow-blue-600/20 group"
                                                title="Next Phase: Interview"
                                                data-html2canvas-ignore
                                            >
                                                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                            </motion.button>
                    </div>
                    <button
                      onClick={handleDownloadReport}
                      disabled={isDownloading}
                      data-html2canvas-ignore
                      className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors bg-white border border-blue-200 px-3 py-1.5 rounded-lg shadow-sm hover:shadow-md"
                    >
                      {isDownloading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      {isDownloading ? (selectedLanguage === 'ar' ? "جاري الإنشاء..." : "Generating...") : t.diagnosticFlow.downloadReport}
                    </button>
                  </div>
                </div>

                {/* Verdict */}
                <div
                  style={{
                    backgroundColor: "#eff6ff",
                    borderRadius: "12px",
                    padding: "16px",
                    borderLeft: "4px solid #3b82f6",
                    position: "relative",
                    zIndex: 10,
                  }}
                >
                  <p
                    style={{
                      color: "#334155",
                      fontWeight: "500",
                      fontStyle: "italic",
                      margin: 0,
                    }}
                  >
                    &ldquo;{analysisResult?.verdict}&rdquo;
                  </p>
                </div>
              </div>

              {/* Overview */}
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  padding: "24px",
                  marginBottom: "24px",
                }}
              >
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#0f172a",
                    marginBottom: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Target
                    style={{ width: "20px", height: "20px", color: "#9333ea" }}
                  />
                  {t.diagnosticFlow.overviewLabel}
                </h2>
                <p style={{ color: "#475569", lineHeight: "1.6" }}>
                  {analysisResult?.overview}
                </p>
              </div>

              {/* Strengths & Weaknesses */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "24px",
                  marginBottom: "24px",
                }}
              >
                {/* Strengths */}
                <div
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "16px",
                    border: "1px solid #bbf7d0",
                    padding: "24px",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "#15803d",
                      marginBottom: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <TrendingUp style={{ width: "20px", height: "20px" }} />
                    {t.diagnosticFlow.strengthsLabel}
                  </h2>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {analysisResult?.strengths?.map(
                      (strength: string, i: number) => (
                        <li
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "8px",
                            color: "#334155",
                            marginBottom: "8px",
                          }}
                        >
                          <CheckCircle
                            style={{
                              width: "20px",
                              height: "20px",
                              color: "#22c55e",
                              flexShrink: 0,
                              marginTop: "2px",
                            }}
                          />
                          <span>{strength}</span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "16px",
                    border: "1px solid #fecaca",
                    padding: "24px",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "#b91c1c",
                      marginBottom: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <TrendingDown style={{ width: "20px", height: "20px" }} />
                    {t.diagnosticFlow.weaknessesLabel}
                  </h2>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {analysisResult?.weaknesses?.map(
                      (weakness: string, i: number) => (
                        <li
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "8px",
                            color: "#334155",
                            marginBottom: "8px",
                          }}
                        >
                          <AlertCircle
                            style={{
                              width: "20px",
                              height: "20px",
                              color: "#ef4444",
                              flexShrink: 0,
                              marginTop: "2px",
                            }}
                          />
                          <span>{weakness}</span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>

              {/* Skills Assessment */}
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  padding: "24px",
                  marginBottom: "24px",
                }}
              >
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#0f172a",
                    marginBottom: "16px",
                  }}
                >
                  {t.diagnosticFlow.skillsLabel}
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "24px",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontWeight: "bold",
                        color: "#1d4ed8",
                        marginBottom: "8px",
                      }}
                    >
                      Technical Skills
                    </h3>
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
                    >
                      {analysisResult?.skills?.technical?.map(
                        (skill: string, i: number) => (
                          <span
                            key={i}
                            style={{
                              padding: "4px 12px",
                              backgroundColor: "#eff6ff",
                              color: "#1d4ed8",
                              borderRadius: "9999px",
                              fontSize: "14px",
                              fontWeight: "500",
                              border: "1px solid #dbeafe",
                            }}
                          >
                            {skill}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                  <div>
                    <h3
                      style={{
                        fontWeight: "bold",
                        color: "#7e22ce",
                        marginBottom: "8px",
                      }}
                    >
                      Soft Skills
                    </h3>
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
                    >
                      {analysisResult?.skills?.soft?.map(
                        (skill: string, i: number) => (
                          <span
                            key={i}
                            style={{
                              padding: "4px 12px",
                              backgroundColor: "#faf5ff",
                              color: "#7e22ce",
                              borderRadius: "9999px",
                              fontSize: "14px",
                              fontWeight: "500",
                              border: "1px solid #f3e8ff",
                            }}
                          >
                            {skill}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                  <div>
                    <h3
                      style={{
                        fontWeight: "bold",
                        color: "#c2410c",
                        marginBottom: "8px",
                      }}
                    >
                      Skills Gaps
                    </h3>
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
                    >
                      {analysisResult?.skills?.gaps?.map(
                        (skill: string, i: number) => (
                          <span
                            key={i}
                            style={{
                              padding: "4px 12px",
                              backgroundColor: "#fff7ed",
                              color: "#c2410c",
                              borderRadius: "9999px",
                              fontSize: "14px",
                              fontWeight: "500",
                              border: "1px solid #ffedd5",
                            }}
                          >
                            {skill}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Experience & Education */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "24px",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
                    padding: "24px",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "#0f172a",
                      marginBottom: "16px",
                    }}
                  >
                    {t.diagnosticFlow.experienceLabel}
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ color: "#475569" }}>{t.diagnosticFlow.yearsLabel}:</span>
                      <span style={{ fontWeight: "bold", color: "#0f172a" }}>
                        {analysisResult?.experience?.years} {t.diagnosticFlow.yearsSuffix}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ color: "#475569" }}>Level:</span>
                      <span style={{ fontWeight: "bold", color: "#2563eb" }}>
                        {analysisResult?.experience?.quality}
                      </span>
                    </div>
                    <div
                      style={{
                        paddingTop: "12px",
                        borderTop: "1px solid #e2e8f0",
                      }}
                    >
                      <p style={{ fontSize: "14px", color: "#475569" }}>
                        {analysisResult?.experience?.progression}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
                    padding: "24px",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "#0f172a",
                      marginBottom: "16px",
                    }}
                  >
                    {t.diagnosticFlow.educationLabel}
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ color: "#475569" }}>{t.diagnosticFlow.levelLabel}:</span>
                      <span style={{ fontWeight: "bold", color: "#0f172a" }}>
                        {analysisResult?.education?.level}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ color: "#475569" }}>{t.diagnosticFlow.relevanceLabel}:</span>
                      <span
                        style={{
                          fontWeight: "bold",
                          color:
                            analysisResult?.education?.relevance === "High"
                              ? "#16a34a"
                              : analysisResult?.education?.relevance ===
                                  "Medium"
                                ? "#ca8a04"
                                : "#dc2626",
                        }}
                      >
                        {analysisResult?.education?.relevance}
                      </span>
                    </div>
                    <div
                      style={{
                        paddingTop: "12px",
                        borderTop: "1px solid #e2e8f0",
                      }}
                    >
                      <p style={{ fontSize: "14px", color: "#475569" }}>
                        {analysisResult?.education?.notes}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Immediate Actions */}
              <div
                style={{
                  background:
                    "linear-gradient(to bottom right, #eff6ff, #faf5ff)",
                  borderRadius: "16px",
                  border: "1px solid #bfdbfe",
                  padding: "24px",
                  marginBottom: "24px",
                }}
              >
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#0f172a",
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <BookOpen
                    style={{ width: "20px", height: "20px", color: "#2563eb" }}
                  />
                  Top 3 Immediate Actions
                </h2>
                <ol
                  style={{
                    margin: 0,
                    padding: 0,
                    listStyle: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {analysisResult?.immediateActions?.map(
                    (action: string, i: number) => (
                      <li
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "12px",
                        }}
                      >
                        <span
                          style={{
                            flexShrink: 0,
                            width: "28px",
                            height: "28px",
                            borderRadius: "9999px",
                            backgroundColor: "#2563eb",
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "bold",
                            fontSize: "14px",
                          }}
                        >
                          {i + 1}
                        </span>
                        <span style={{ color: "#334155", paddingTop: "2px" }}>
                          {action}
                        </span>
                      </li>
                    ),
                  )}
                </ol>
              </div>

              {/* Career Paths */}
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  padding: "24px",
                }}
              >
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#0f172a",
                    marginBottom: "16px",
                  }}
                >
                  Recommended Career Paths
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                  }}
                >
                  {analysisResult?.careerPaths?.map(
                    (path: string, i: number) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "12px",
                          backgroundColor: "#f8fafc",
                          borderRadius: "12px",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <ArrowRight
                          style={{
                            width: "20px",
                            height: "20px",
                            color: "#2563eb",
                            flexShrink: 0,
                          }}
                        />
                        <span style={{ color: "#334155", fontWeight: "500" }}>
                          {path}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>

            {/* ── Next Stage Full Teaser ── */}
            <NextStageTeaser stage="cv-upload" onNavigate={proceedToInterview} />

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
