"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

// ─── Stage Configuration Data ──────────────────────────────────────────────────
const STAGE_CONFIG = {
  "cv-upload": {
    current: { id: "01", icon: "📄" },
    next: {
      id: "02", icon: "🎤", route: "/assessment/interview",
      color: "purple",
      label: { en: "Executive Assessment Interview", fr: "Entretien d'Évaluation Exécutif", ar: "مقابلة التقييم التنفيذي" },
      line1: {
        en: "Once your CV is analyzed, you'll enter a strategic dialogue with our AI expert.",
        fr: "Une fois votre CV analysé, vous entrez dans un dialogue stratégique avec notre expert IA.",
        ar: "بعد تحليل سيرتك الذاتية، ستدخل في حوار استراتيجي مع خبير الذكاء الاصطناعي."
      },
      line2: {
        en: "High-level scenario questions will verify your competencies and professional depth.",
        fr: "Des questions de scénarios de haut niveau vérifieront vos compétences et votre profondeur professionnelle.",
        ar: "أسئلة سيناريوهات رفيعة المستوى للتحقق المباشر من كفاءاتك وعمقك المهني."
      },
      btn: { en: "Launch Interview", fr: "Lancer l'Entretien", ar: "انطلق للمقابلة" }
    }
  },
  "interview": {
    current: { id: "02", icon: "🎤" },
    next: {
      id: "03", icon: "📊", route: "/assessment/results",
      color: "emerald",
      label: { en: "Assessment Results Report", fr: "Rapport des Résultats", ar: "تقرير نتائج التقييم" },
      line1: {
        en: "After the interview, you'll receive a comprehensive accuracy & readiness report.",
        fr: "Après l'entretien, vous recevrez un rapport de précision et de préparation complet.",
        ar: "بعد المقابلة، ستحصل على تقرير شامل للدقة والجاهزية المهنية."
      },
      line2: {
        en: "Your CV vs Reality score, verified strengths, and a professional verdict await you.",
        fr: "Le score CV vs Réalité, vos forces vérifiées et un verdict professionnel vous attendent.",
        ar: "نتيجة السيرة الذاتية مقابل الواقع، نقاط قوتك المؤكدة، والقرار المهني الرسمي."
      },
      btn: { en: "View My Results", fr: "Voir Mes Résultats", ar: "عرض نتائجي" }
    }
  },
  "results": {
    current: { id: "03", icon: "📊" },
    next: {
      id: "04", icon: "🧭", route: "/assessment/role-discovery",
      color: "orange",
      label: { en: "Career Path Discovery", fr: "Découverte du Parcours Professionnel", ar: "اكتشاف المسار المهني" },
      line1: {
        en: "Next, our AI will explore your professional goals and aspirations with you.",
        fr: "Ensuite, notre IA explorera avec vous vos objectifs et aspirations professionnels.",
        ar: "بعد ذلك، سيستكشف ذكاؤنا الاصطناعي معك أهدافك وطموحاتك المهنية."
      },
      line2: {
        en: "This conversation guides the AI to recommend roles perfectly matched to your vision.",
        fr: "Cette conversation guide l'IA pour recommander les rôles parfaitement adaptés à votre vision.",
        ar: "هذا الحوار يوجّه الذكاء الاصطناعي لاقتراح الأدوار المتوافقة تمامًا مع رؤيتك."
      },
      btn: { en: "Discover My Career Path", fr: "Découvrir Mon Parcours", ar: "اكتشف مساري المهني" }
    }
  },
  "role-discovery": {
    current: { id: "04", icon: "🧭" },
    next: {
      id: "05", icon: "🎯", route: "/assessment/role-suggestions",
      color: "pink",
      label: { en: "Personalized Role Recommendations", fr: "Recommandations de Rôles Personnalisées", ar: "اقتراحات الأدوار المخصصة" },
      line1: {
        en: "Based on your goals, the AI will generate a personalized list of matching roles.",
        fr: "En fonction de vos objectifs, l'IA génère une liste de rôles personnalisés pour vous.",
        ar: "بناءً على أهدافك، سيولّد الذكاء الاصطناعي قائمة أدوار وظيفية مخصصة لك."
      },
      line2: {
        en: "Each role comes with a match percentage, ready-now vs future goals classification.",
        fr: "Chaque rôle vient avec un pourcentage de correspondance et une classification prêt maintenant / futur.",
        ar: "كل دور يأتي مع نسبة توافق وتصنيف بين الجاهزية الآنية والأهداف المستقبلية."
      },
      btn: { en: "See My Role Matches", fr: "Voir Mes Rôles Compatibles", ar: "عرض أدواري المتوافقة" }
    }
  },
  "role-suggestions": {
    current: { id: "05", icon: "🎯" },
    next: {
      id: "06", icon: "✍️", route: "/assessment/cv-generation",
      color: "cyan",
      label: { en: "Professional CV Studio", fr: "Studio CV Professionnel", ar: "استوديو السيرة الذاتية الاحترافية" },
      line1: {
        en: "Once you choose your target role, our AI Career Architect will build your professional CV.",
        fr: "Une fois votre rôle cible choisi, l'Architecte Carrière IA construira votre CV professionnel.",
        ar: "بمجرد اختيار دورك المستهدف، سيبني مهندس المسار المهني الذكي سيرتك الذاتية الاحترافية."
      },
      line2: {
        en: "A tailored Cover Letter optimized for ATS systems is also included.",
        fr: "Une lettre de motivation personnalisée et optimisée pour les systèmes ATS est également incluse.",
        ar: "رسالة تغطية مخصصة ومحسّنة لأنظمة ATS مدرجة أيضًا."
      },
      btn: { en: "Build My Professional CV", fr: "Créer Mon CV Professionnel", ar: "إنشاء سيرتي الذاتية" }
    }
  },
  "cv-generation": {
    current: { id: "06", icon: "✍️" },
    next: {
      id: "07", icon: "🏆", route: "/assessment/simulation",
      color: "amber",
      label: { en: "Executive Role Simulation", fr: "Simulation de Rôle Exécutif", ar: "محاكاة الدور التنفيذي" },
      line1: {
        en: "The final stage: experience real executive scenarios to test your performance.",
        fr: "La dernière étape : vivez des scénarios exécutifs réels pour tester votre performance.",
        ar: "المرحلة الأخيرة: عش سيناريوهات تنفيذية حقيقية لقياس أدائك الفعلي."
      },
      line2: {
        en: "Your simulation score will complete your DIGNNOS™ executive certification.",
        fr: "Votre score de simulation complétera votre certification exécutive DIGNNOS™.",
        ar: "نتيجة محاكاتك ستُكمل شهادة التسجيل التنفيذي DIGNNOS™ الخاصة بك."
      },
      btn: { en: "Start Role Simulation", fr: "Lancer la Simulation", ar: "بدء محاكاة الدور" }
    }
  }
};

const colorClasses = {
  purple: { bg: "from-violet-700 via-purple-600 to-indigo-900", light: "bg-slate-900 border-slate-700", badge: "bg-violet-500/20 text-violet-300", text: "text-violet-400", btn: "bg-violet-800 hover:bg-violet-900 shadow-violet-900/50", ring: "ring-violet-500" },
  emerald: { bg: "from-emerald-700 via-teal-600 to-emerald-900", light: "bg-slate-900 border-slate-700", badge: "bg-emerald-500/20 text-emerald-300", text: "text-emerald-400", btn: "bg-emerald-800 hover:bg-emerald-900 shadow-emerald-900/50", ring: "ring-emerald-500" },
  orange: { bg: "from-orange-600 via-amber-600 to-orange-800", light: "bg-slate-900 border-slate-700", badge: "bg-orange-500/20 text-orange-300", text: "text-orange-400", btn: "bg-orange-700 hover:bg-orange-800 shadow-orange-900/50", ring: "ring-orange-400" },
  pink: { bg: "from-pink-700 via-rose-600 to-pink-900", light: "bg-slate-900 border-slate-700", badge: "bg-pink-500/20 text-pink-300", text: "text-pink-400", btn: "bg-pink-800 hover:bg-pink-900 shadow-pink-900/50", ring: "ring-pink-500" },
  cyan: { bg: "from-cyan-700 via-sky-600 to-cyan-900", light: "bg-slate-900 border-slate-700", badge: "bg-cyan-500/20 text-cyan-300", text: "text-cyan-400", btn: "bg-cyan-800 hover:bg-cyan-900 shadow-cyan-900/50", ring: "ring-cyan-500" },
  amber: { bg: "from-amber-600 via-yellow-600 to-amber-800", light: "bg-slate-900 border-slate-700", badge: "bg-amber-500/20 text-amber-300", text: "text-amber-400", btn: "bg-amber-700 hover:bg-amber-800 shadow-amber-900/50", ring: "ring-amber-400" },
};

type StageKey = keyof typeof STAGE_CONFIG;

// ─── TOP MINI BANNER ────────────────────────────────────────────────────────────
export function StageProgressBanner({ stage }: { stage: StageKey }) {
  const { language, dir } = useLanguage();
  const config = STAGE_CONFIG[stage];
  if (!config) return null;

  const next = config.next;
  const color = colorClasses[next.color as keyof typeof colorClasses];
  const lang = language as "en" | "fr" | "ar";

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className={`w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 mb-5 flex items-center gap-3 overflow-hidden relative`}
      dir={dir}
    >
      {/* Animated pulse dot */}
      <span className="relative flex h-3 w-3 shrink-0">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${color.badge}`} />
        <span className={`relative inline-flex rounded-full h-3 w-3 ${color.btn.split(" ")[0]}`} />
      </span>

      {/* Text */}
      <div className="flex-1 flex items-center gap-2 flex-wrap">
        <span className={`text-xs font-black uppercase tracking-widest ${color.text}`}>
          {lang === "ar" ? "المرحلة القادمة:" : lang === "fr" ? "Prochaine étape :" : "Up next:"}
        </span>
        <span className="text-xs font-bold text-slate-300">
          {next.icon} {next.label[lang]}
        </span>
      </div>

      {/* Step progress pills */}
      <div className="hidden sm:flex items-center gap-1 shrink-0">
        {Object.keys(STAGE_CONFIG).map((s, i) => (
          <div
            key={s}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              s === stage ? "w-6 " + color.btn.split(" ")[0] : i < Object.keys(STAGE_CONFIG).indexOf(stage) ? "w-3 bg-slate-500" : "w-3 bg-slate-800"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ─── BOTTOM FULL TEASER ─────────────────────────────────────────────────────────
export function NextStageTeaser({
  stage,
  onNavigate,
  visible = true,
}: {
  stage: StageKey;
  onNavigate: () => void;
  visible?: boolean;
}) {
  const { language, dir } = useLanguage();
  const config = STAGE_CONFIG[stage];
  if (!config) return null;

  const next = config.next;
  const color = colorClasses[next.color as keyof typeof colorClasses];
  const lang = language as "en" | "fr" | "ar";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          className={`mt-8 rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl overflow-hidden shadow-2xl relative`}
          dir={dir}
          data-html2canvas-ignore
        >
          {/* Gradient Header */}
          <div className={`bg-linear-to-r ${color.bg} px-6 py-4 flex items-center gap-4`}>
            <div className="text-4xl">{next.icon}</div>
            <div className="flex-1">
              <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-0.5">
                {lang === "ar" ? `المرحلة ${next.id} — القادمة` : lang === "fr" ? `Étape ${next.id} — Suivante` : `Stage ${next.id} — Coming Next`}
              </p>
              <h3 className="text-white font-black text-lg leading-tight">{next.label[lang]}</h3>
            </div>
            {/* Animated arrow */}
            <motion.div
              animate={{ x: [0, 6, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              className="text-white/60"
            >
              {dir === "rtl" ? <ArrowLeft className="w-7 h-7" /> : <ArrowRight className="w-7 h-7" />}
            </motion.div>
          </div>

          {/* Description body */}
          <div className="px-6 py-5">
            <div className="space-y-3 mb-6">
              {/* Line 1 */}
              <div className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 ${color.badge}`}>1</div>
                <p className="text-slate-300 text-sm leading-relaxed">{next.line1[lang]}</p>
              </div>
              {/* Line 2 */}
              <div className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 ${color.badge}`}>2</div>
                <p className="text-slate-300 text-sm leading-relaxed">{next.line2[lang]}</p>
              </div>
            </div>

            {/* CTA Button */}
            <motion.button
              animate={{
                scale: [1, 1.03, 1],
                boxShadow: [
                  `0px 8px 20px -4px rgba(0,0,0,0.25)`,
                  `0px 16px 30px -4px rgba(0,0,0,0.35)`,
                  `0px 8px 20px -4px rgba(0,0,0,0.25)`
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={onNavigate}
              className={`w-full py-4 rounded-2xl text-white font-black text-base transition-all ${color.btn} shadow-xl flex items-center justify-center gap-3`}
            >
              <span className="text-xl">{next.icon}</span>
              {next.btn[lang]}
              <ChevronRight className={`w-5 h-5 transition-transform ${dir === "rtl" ? "rotate-180" : ""}`} />
            </motion.button>

            {/* Small hint */}
            <p className={`text-center text-xs mt-3 ${color.text} opacity-75 font-medium`}>
              {lang === "ar" ? "⏱ هذه المرحلة إلزامية للمتابعة" : lang === "fr" ? "⏱ Cette étape est requise pour continuer" : "⏱ This stage is required to continue"}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
