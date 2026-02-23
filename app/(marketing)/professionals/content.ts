import { Shield, Users, TrendingUp, MessageSquare, Target, FileText, Crown, Rocket, Globe, Activity, Zap, Library, Sparkles, BarChart3 } from "lucide-react";

// ─── SEO Meta ───────────────────────────────────────────────────────────────────
export const SEO = {
  en: {
    title: "AI Career Transformation & Executive Coaching | MA-TRAINING-CONSULTING",
    description: "The world's first AI+Human ecosystem for career diagnostics, executive simulations, and strategic growth. Get your DIGNNOS™ certification and a 24/7 AI Strategic Mentor.",
    keywords: "AI career guidance, executive coaching, professional roadmap, job simulation, HR consulting, strategic role audit, MATC",
  },
  fr: {
    title: "Transformation de Carrière IA & Coaching Exécutif | MA-TRAINING-CONSULTING",
    description: "Le premier écosystème IA+Humain pour le diagnostic de carrière, les simulations exécutives et la croissance stratégique. Obtenez votre certification DIGNNOS™.",
    keywords: "conseiller IA, coaching exécutif, feuille de route stratégique, simulation emploi, audit RH, diagnostic carrière",
  },
  ar: {
    title: "التحول المهني بالذكاء الاصطناعي والتدريب التنفيذي | MA-TRAINING-CONSULTING",
    description: "أول نظام بيئي متكامل (ذكاء اصطناعي + بشري) للتشخيص المهني، المحاكاة التنفيذية، والنمو الاستراتيجي. احصل على شهادة DIGNNOS™ ومستشار ذكي 24/7.",
    keywords: "مستشار ذكي, تدريب تنفيذي, خارطة طريق استراتيجية, محاكاة وظيفة, استشارات HR, تدقيق الدور الاستراتيجي",
  },
};

// ─── HERO ────────────────────────────────────────────────────────────────────────
export const HERO = {
  en: {
    badge: "Official Executive Platform",
    title: "Master Your Future with",
    titleHighlight: "AI Strategic Mastery",
    subtitle: "Navigate your career transformation with high-precision AI diagnostics, executive simulations, and 24/7 expert guidance. From your initial CV scan to official DIGNNOS™ certification.",
    ctaPrimary: "Start Free Diagnostic",
    ctaSecondary: "View Ecosystem",
    stats: [
      { value: "07", label: "Diagnostic Stages" },
      { value: "24/7", label: "AI Strategic Mentor" },
      { value: "100%", label: "Verified Credentials" },
      { value: "98%", label: "Market Accuracy" },
    ],
  },
  fr: {
    badge: "Plateforme Exécutive Officielle",
    title: "Maîtrisez Votre Avenir avec",
    titleHighlight: "l'Excellence IA Stratégique",
    subtitle: "Naviguez votre transformation de carrière avec des diagnostics IA de haute précision, des simulations exécutives et un accompagnement 24/7. Du scan initial du CV à la certification officielle DIGNNOS™.",
    ctaPrimary: "Démarrer le Diagnostic",
    ctaSecondary: "Voir l'Écosystème",
    stats: [
      { value: "07", label: "Étapes de Diagnostic" },
      { value: "24h/24", label: "Mentor Stratégique IA" },
      { value: "100%", label: "Diplômes Vérifiés" },
      { value: "98%", label: "Précision Marché" },
    ],
  },
  ar: {
    badge: "المنصة التنفيذية الرسمية",
    title: "سدّد خطاك نحو المستقبل عبر",
    titleHighlight: "الذكاء الاستراتيجي المتكامل",
    subtitle: "قُد رحلة تحولك المهني عبر تشخيص ذكي عالي الدقة، محاكاة تنفيذية واقعية، وتوجيه خبير على مدار الساعة. من أول فحص للسيرة الذاتية حتى شهادة DIGNNOS™ الرسمية.",
    ctaPrimary: "ابدأ التشخيص المجاني",
    ctaSecondary: "استكشف النظام",
    stats: [
      { value: "٠٧", label: "مراحل تشخيصية" },
      { value: "٢٤/٧", label: "مستشار استراتيجي" },
      { value: "١٠٠٪", label: "اعتمادات موثّقة" },
      { value: "٩٨٪", label: "دقة سوقية" },
    ],
  },
};

// ─── PROBLEM ─────────────────────────────────────────────────────────────────────
export const PROBLEM = {
  en: {
    badge: "The Career Gap",
    title: "Why Most Professionals Stall",
    points: [
      { icon: "📉", text: "Outdated skills that no longer match high-paying market demands." },
      { icon: "🌫️", text: "Lack of clarity on which executive roles actually fit your profile." },
      { icon: "📜", text: "Generic CVs that fail to pass through modern AI filtering systems." },
      { icon: "🛑", text: "Uncertainty in interview performance under high-pressure scenarios." },
    ],
    solution: "We replace guesswork with precision. Our AI-driven diagnostic is your unfair advantage.",
  },
  fr: {
    badge: "Le Fossé de Carrière",
    title: "Pourquoi la plupart des professionnels stagnent",
    points: [
      { icon: "📉", text: "Compétences obsolètes qui ne correspondent plus aux demandes du marché." },
      { icon: "🌫️", text: "Manque de clarté sur les rôles exécutifs qui correspondent à votre profil." },
      { icon: "📜", text: "CV génériques qui échouent aux systèmes de filtrage IA modernes." },
      { icon: "🛑", text: "Incertitude lors des entretiens dans des scénarios à haute pression." },
    ],
    solution: "Nous remplaçons l'incertitude par la précision. Notre diagnostic piloté par l'IA est votre avantage injuste.",
  },
  ar: {
    badge: "فجوة المسار المهني",
    title: "لماذا يتوقف معظم المحترفين عن التقدم؟",
    points: [
      { icon: "📉", text: "مهارات قديمة لم تعد تواكب متطلبات السوق ذات الدخل المرتفع." },
      { icon: "🌫️", text: "غياب الوضوح بشأن الأدوار التنفيذية التي تناسب ملفك الشخصي حقاً." },
      { icon: "📜", text: "سير ذاتية تقليدية تفشل في عبور أنظمة الفرز الذكية الحديثة." },
      { icon: "🛑", text: "عدم اليقين في أداء المقابلات تحت سيناريوهات الضغط العالي." },
    ],
    solution: "نحن نستبدل التخمين بالدقة. تشخيصنا المدعوم بالذكاء الاصطناعي هو ميزتك التنافسية.",
  },
};

// ─── THE 7-STAGE AI JOURNEY ──────────────────────────────────────────────────────
export const JOURNEY = {
  en: {
    badge: "The Methodology",
    title: "The 7-Stage Diagnostic Journey",
    subtitle: "A systematic transformation process from CV analysis to executive certification.",
    steps: [
      { id: "01", title: "AI CV Intelligence", desc: "Instant skill extraction and market positioning audit.", icon: FileText, color: "blue", tag: "Analysis" },
      { id: "02", title: "Executive AI Interview", desc: "A deep strategic dialogue to verify your core competencies.", icon: MessageSquare, color: "purple", tag: "Verification" },
      { id: "03", title: "Diagnostic Verdict", desc: "Real-time accuracy scoring and professional readiness report.", icon: Activity, color: "emerald", tag: "Verdict" },
      { id: "04", title: "Role Discovery Chat", desc: "AI-led exploration of your professional goals and aspirations.", icon: Zap, color: "orange", tag: "Discovery" },
      { id: "05", title: "Precision Matching", desc: "Tailored role recommendations with detailed gap analysis.", icon: Target, color: "pink", tag: "Matching" },
      { id: "06", title: "AI CV Architecture", desc: "Creation of high-impact, ATS-optimized professional documents.", icon: FileText, color: "cyan", tag: "Design" },
      { id: "07", title: "DIGNNOS™ Simulation", desc: "Final executive mission to validate your expertise & earn certification.", icon: Crown, color: "amber", tag: "Certification" },
    ]
  },
  fr: {
    badge: "La Méthodologie",
    title: "Le Parcours Diagnostic en 7 Étapes",
    subtitle: "Un processus de transformation systématique, de l'analyse du CV à la certification exécutive.",
    steps: [
      { id: "01", title: "Intelligence CV IA", desc: "Extraction instantanée des compétences et audit de positionnement.", icon: FileText, color: "blue", tag: "Analyse" },
      { id: "02", title: "Entretien Exécutif IA", desc: "Un dialogue stratégique profond pour vérifier vos compétences clés.", icon: MessageSquare, color: "purple", tag: "Vérification" },
      { id: "03", title: "Verdict du Diagnostic", desc: "Scoring de précision en temps réel et rapport de préparation.", icon: Activity, color: "emerald", tag: "Verdict" },
      { id: "04", title: "Chat Découverte de Rôles", desc: "Exploration de vos objectifs professionnels guidée par l'IA.", icon: Zap, color: "orange", tag: "Découverte" },
      { id: "05", title: "Matching de Précision", desc: "Recommandations de rôles sur mesure avec analyse des écarts.", icon: Target, color: "pink", tag: "Matching" },
      { id: "06", title: "Architecture CV IA", desc: "Création de documents professionnels à haut impact optimisés ATS.", icon: FileText, color: "cyan", tag: "Design" },
      { id: "07", title: "Simulation DIGNNOS™", desc: "Mission exécutive finale pour valider votre expertise et être certifié.", icon: Crown, color: "amber", tag: "Certification" },
    ]
  },
  ar: {
    badge: "المنهجية",
    title: "رحلة التشخيص المكونة من 7 مراحل",
    subtitle: "عملية تحول منهجية من تحليل السيرة الذاتية إلى الاعتماد التنفيذي.",
    steps: [
      { id: "٠١", title: "ذكاء السيرة الذاتية", desc: "استخراج فوري للمهارات وتدقيق الموقع في سوق العمل.", icon: FileText, color: "blue", tag: "تحليل" },
      { id: "٠٢", title: "المقابلة التنفيذية الذكية", desc: "حوار استراتيجي عميق للتحقق من كفاءاتك الأساسية.", icon: MessageSquare, color: "purple", tag: "تحقق" },
      { id: "٠٣", title: "قرار التشخيص", desc: "تقييم الدقة اللحظي وتقرير الجاهزية المهنية.", icon: Activity, color: "emerald", tag: "قرار" },
      { id: "٠٤", title: "اكتشاف الأدوار", desc: "استكشاف أهدافك وطموحاتك المهنية بقيادة الذكاء الاصطناعي.", icon: Zap, color: "orange", tag: "اكتشاف" },
      { id: "٠٥", title: "التطابق الدقيق", desc: "اقتراحات أدوار مخصصة مع تحليل مفصل للفجوات.", icon: Target, color: "pink", tag: "تطابق" },
      { id: "٠٦", title: "هندسة السيرة الذاتية", desc: "بناء وثائق مهنية عالية التأثير ومحسّنة لأنظمة ATS.", icon: FileText, color: "cyan", tag: "تصميم" },
      { id: "٠٧", title: "محاكاة DIGNNOS™", desc: "المهمة التنفيذية النهائية لتأكيد خبرتك والحصول على الشهادة.", icon: Crown, color: "amber", tag: "اعتماد" },
    ]
  }
};

// ─── THE ADVANCED AI ECOSYSTEM ──────────────────────────────────────────────────
export const ECOSYSTEM_MODULES = {
  en: {
    badge: "AI Power Modules",
    title: "A Complete Ecosystem of Intelligence",
    subtitle: "Access a suite of modules designed for continuous professional mastery.",
    modules: [
      { icon: Sparkles, title: "AI Strategic Mentor", desc: "Your 24/7 executive advisor for instant career guidance and tactical support.", link: "/mentor" },
      { icon: Library, title: "Knowledge Archives", desc: "A vast vault of expert-curated frameworks, masterclasses, and strategic resources.", link: "/library" },
      { icon: TrendingUp, title: "Strategic Roadmap", desc: "A dynamic, evolving development plan that adapts to your growth journey.", link: "/roadmap" },
      { icon: MessageSquare, title: "Expert AI Consultation", desc: "Persona-based AI chats specialized in HR, Strategic Advice, and Learning Strategy.", link: "/expert" },
      { icon: BarChart3, title: "Strategic Role Audit (SCI)", desc: "Deep-dive performance report benchmarking your readiness against global standards.", link: "/strategic-report" },
      { icon: Globe, title: "Resource Vault", desc: "Access specialized industry tools and templates curated by senior consultants.", link: "/library" },
    ]
  },
  fr: {
    badge: "Modules de Puissance IA",
    title: "Un Écosystème Complet d'Intelligence",
    subtitle: "Accédez à une suite de modules conçus pour une maîtrise professionnelle continue.",
    modules: [
      { icon: Sparkles, title: "Mentor Stratégique IA", desc: "Votre conseiller exécutif 24/7 pour une orientation instantanée et un support tactique.", link: "/mentor" },
      { icon: Library, title: "Archives du Savoir", desc: "Un coffre-fort de frameworks, masterclasses et ressources stratégiques curatés.", link: "/library" },
      { icon: TrendingUp, title: "Feuille de Route Stratégique", desc: "Un plan de développement dynamique qui s'adapte à votre progression.", link: "/roadmap" },
      { icon: MessageSquare, title: "Consultation Expert IA", desc: "Chats IA spécialisés en RH, Conseil Stratégique et Stratégie d'Apprentissage.", link: "/expert" },
      { icon: BarChart3, title: "Audit de Rôle Stratégique (SCI)", desc: "Rapport de performance mesurant votre préparation par rapport aux standards mondiaux.", link: "/strategic-report" },
      { icon: Globe, title: "Coffre de Ressources", desc: "Accédez à des outils et modèles industriels spécialisés.", link: "/library" },
    ]
  },
  ar: {
    badge: "وحدات الذكاء المتقدمة",
    title: "نظام بيئي متكامل من الذكاء",
    subtitle: "وصول كامل لمجموعة من الوحدات المصممة للتمكن المهني المستمر.",
    modules: [
      { icon: Sparkles, title: "المستشار الاستراتيجي الذكي", desc: "مستشارك التنفيذي المتاح 24/7 للتوجيه المهني الفوري والدعم التكتيكي.", link: "/mentor" },
      { icon: Library, title: "أرشيف المعرفة", desc: "خزنة ضخمة من المنهجيات والدروس المتقدمة والموارد الاستراتيجية الموثقة.", link: "/library" },
      { icon: TrendingUp, title: "خارطة الطريق الاستراتيجية", desc: "خطة تطوير ديناميكية تتطور وتتكيف مع رحلة نموك المهني.", link: "/roadmap" },
      { icon: MessageSquare, title: "استشارات الخبراء الذكية", desc: "حوارات متخصصة في الموارد البشرية، النصائح الاستراتيجية، واستراتيجيات التعلم.", link: "/expert" },
      { icon: BarChart3, title: "تدقيق الدور الاستراتيجي (SCI)", desc: "تقرير أداء معمق يقيس جاهزيتك مقابل المعايير العالمية.", link: "/strategic-report" },
      { icon: Globe, title: "خزنة الموارد", desc: "الوصول إلى أدوات ونماذج صناعية متخصصة منسقة من قبل كبار المستشارين.", link: "/library" },
    ]
  }
};

// ─── HUMAN-LED MODULES ───────────────────────────────────────────────────────────
export const HUMAN = {
  en: {
    badge: "Human Excellence",
    title: "Expert-Led Integration",
    subtitle: "AI analyzes, but humans validate. Our senior consultants bring real-world wisdom to your transition.",
    items: [
      { icon: Users, badge: "Interactive Sessions", title: "Live Executive Workshops", desc: "Interactive group sessions focusing on leadership psychology, high-stakes negotiation, and real-time tactical decision making." },
      { icon: Zap, badge: "The Mission", title: "DIGNNOS™ Simulation Missions", desc: "Senior experts provide realistic simulation scenarios where you operate in a high-pressure interactive work environment to prove your competence." },
      { icon: Rocket, badge: "Execution", title: "Strategic Roadmap Support", desc: "Your dedicated expert accompanies you in co-creating your professional development roadmap, helping you activate and execute the strategy in the real market." },
      { icon: TrendingUp, badge: "Quality Audit", title: "Strategic Human Validation", desc: "Every AI-generated diagnostic is reviewed and nuanced by a senior human consultant to ensure contextual accuracy." },
    ]
  },
  fr: {
    badge: "Excellence Humaine",
    title: "Intégration Guidée par des Experts",
    subtitle: "L'IA analyse, mais l'humain valide. Nos consultants seniors apportent une sagesse concرète à votre transition.",
    items: [
      { icon: Users, badge: "Sessions Interactives", title: "Ateliers Exécutifs Live", desc: "Sessions de groupe interactives sur la psychologie du leadership, la négociation et la prise de décision tactique en temps réel." },
      { icon: Zap, badge: "La Mission", title: "Missions de Simulation DIGNNOS™", desc: "Des experts seniors proposent des scénarios de simulation réalistes où vous opérez dans un environnement de travail interactif pour valider vos compétences." },
      { icon: Rocket, badge: "Exécution", title: "Accompagnement de Feuille de Route", desc: "Votre expert dédié vous accompagne dans la co-création de votre feuille de route de développement, vous aidant à activer et exécuter la stratégie sur le marché réel." },
      { icon: TrendingUp, badge: "Audit de Qualité", title: "Validation Humaine Stratégique", desc: "Chaque diagnostic généré par l'IA est revu et nuancé par un consultant senior pour garantir la pertinence contextuelle." },
    ]
  },
  ar: {
    badge: "التميز البشري",
    title: "تكامل بقيادة الخبراء",
    subtitle: "الذكاء الاصطناعي يحلل، ولكن البشر يصدقون. مستشارونا الكبار يجلبون الحكمة الواقعية لرحلة تحولك.",
    items: [
      { icon: Users, badge: "جلسات تفاعلية", title: "ورش العمل التنفيذية المباشرة", desc: "جلسات جماعية تفاعلية تركز على علم نفس القيادة، التفاوض رفيع المستوى، واتخاذ القرار التكتيكي في الوقت الفعلي." },
      { icon: Zap, badge: "المهمة", title: "مهام محاكاة DIGNNOS™", desc: "يقدم كبار الخبراء سيناريوهات محاكاة واقعية حيث تعمل في بيئة عمل تفاعلية تحت الضغط لإثبات كفاءتك القيادية." },
      { icon: Rocket, badge: "التنفيذ", title: "دعم خارطة الطريق الاستراتيجية", desc: "يرافقك خبيرنا المخصص في صياغة خارطة طريق تطويرك المهني، ويعمل معك على تفعيل الاستراتيجية وتنفيذها في سوق العمل الفعلي." },
      { icon: TrendingUp, badge: "تدقيق الجودة", title: "التصديق البشري الاستراتيجي", desc: "كل تقرير تشخيصي ناتج عن الذكاء الاصطناعي يخضع للمراجعة والتدقيق من قبل مستشار بشري أول لضمان الدقة السياقية." },
    ]
  }
};

// ─── CORPORATE SOLUTIONS (HR & COMPANY) ─────────────────────────────────────────
export const CORPORATE = {
  en: {
    badge: "Corporate Excellence",
    title: "Company & HR Solutions",
    description: "Are you looking to evaluate a candidate or employee? We provide objective, data-backed advisory reports and free HR consulting based on their diagnostic journey.",
    features: [
      "Objective Talent Readiness Mapping",
      "Executive Benchmarking Reports",
      "Custom Recruitment Simulations",
      "Employee Promotion Analytics",
      "Organizational Digital Strategy Audits"
    ],
    cta: "Contact HR Advisory"
  },
  fr: {
    badge: "Excellence d'Entreprise",
    title: "Solutions Entreprise & RH",
    description: "Vous souhaitez évaluer un candidat ou un employé ? Nous fournissons des rapports consultatifs objectifs, basés sur les données, et un conseil RH gratuit basé sur leur parcours.",
    features: [
      "Cartographie de la Jaurès des Talents",
      "Rapports de Benchmarking Exécutif",
      "Simulations de Recrutement Sur Mesure",
      "Analyses pour Promotions d'Employés",
      "Audits de Stratégie Digitale Organisationnelle"
    ],
    cta: "Contacter le Conseil RH"
  },
  ar: {
    badge: "التميز المؤسسي",
    title: "حلول الشركات والموارد البشرية",
    description: "هل تبحث عن تقييم مرشح أو موظف؟ نحن نقدم تقارير استشارية موضوعية مدعومة بالبيانات واستشارات مجانية للموارد البشرية بناءً على رحلتهم التشخيصية.",
    features: [
      "رسم خرائط جاهزية المواهب الموضوعية",
      "تقارير المقارنة المعيارية التنفيذية",
      "محاكاة مخصصة لأغراض التوظيف",
      "تحليلات ترقية الموظفين",
      "تدقيق استراتيجيات التحول الرقمي للمؤسسات"
    ],
    cta: "تواصل مع مستشار HR"
  }
};

// ─── BENEFITS ────────────────────────────────────────────────────────────────────
export const BENEFITS = {
  en: {
    badge: "The Value",
    title: "Why Choose the DIGNNOS™ Model?",
    items: [
      { icon: Shield, title: "Verified Authority", desc: "Official certifications that command respect from global recruiters." },
      { icon: Rocket, title: "Accelerated Growth", desc: "Cut years off your career ladder by identifying your 'High-ROI' skills today." },
      { icon: Target, title: "Precision Mapping", desc: "Stop applying to the wrong roles. Know exactly where you fit in the market." },
    ]
  },
  fr: {
    badge: "La Valeur",
    title: "Pourquoi choisir le modèle DIGNNOS™ ?",
    items: [
      { icon: Shield, title: "Autorité Vérifiée", desc: "Certifications officielles qui imposent le respect des recruteurs mondiaux." },
      { icon: Rocket, title: "Croissance Accélérée", desc: "Gagnez des années sur votre parcours en identifiant vos compétences à haut ROI." },
      { icon: Target, title: "Mapping de Précision", desc: "Arrêtez de postuler aux mauvais rôles. Sachez exactement où vous vous situez." },
    ]
  },
  ar: {
    badge: "القيمة المضافة",
    title: "لماذا تختار نموذج DIGNNOS™؟",
    items: [
      { icon: Shield, title: "سلطة موثقة", desc: "شهادات رسمية تفرض الاحترام من مسؤولي التوظيف العالميين." },
      { icon: Rocket, title: "نمو متسارع", desc: "اختصر سنوات من سلمك الوظيفي عبر تحديد مهاراتك ذات العائد العالي اليوم." },
      { icon: Target, title: "خرائط دقيقة", desc: "توقف عن التقديم للوظائف الخاطئة. اعرف بالضبط أين تناسب السوق." },
    ]
  }
};

// ─── OFFICIAL ASSETS ─────────────────────────────────────────────────────────────
export const ASSETS = {
  en: {
    badge: "Official Deliverables",
    subtitle: "Your Strategic Portfolio",
    items: [
      { icon: BarChart3, title: "DIGNNOS™ Diagnostic Report (SCI)", desc: "A comprehensive analysis of your strategic leadership merit and professional readiness." },
      { icon: FileText, title: "Executive Letter of Recommendation", desc: "A formal endorsement based on your verified performance during AI-led simulations." },
      { icon: Users, title: "Consulting Workshop Verification", desc: "Official proof of participation and high-level interaction in live executive sessions." },
      { icon: TrendingUp, title: "Strategic Roadmap (18-Month Plan)", desc: "A detailed execution plan to close skill gaps and achieve your next career milestone." },
      { icon: Shield, title: "Consulting Mandate (Verified)", desc: "The formal, legally-backed advisory agreement ensuring professional authority." },
      { icon: Target, title: "Executive Readiness Audit", desc: "A specialized audit report benchmarking your profile against global market standards." },
    ]
  },
  fr: {
    badge: "Livrables Officiels",
    subtitle: "Votre Portfolio Stratégique",
    items: [
      { icon: BarChart3, title: "Rapport Diagnostic DIGNNOS™ (SCI)", desc: "Une analyse complète de votre mérite en leadership stratégique et préparation professionnelle." },
      { icon: FileText, title: "Lettre de Recommandation Exécutive", desc: "Un endossement formel basé sur vos performances vérifiées lors des simulations." },
      { icon: Users, title: "Vérification d'Atelier Stratégique", desc: "Preuve officielle de participation et d'interaction de haut niveau lors des sessions live." },
      { icon: TrendingUp, title: "Feuille de Route (Plan 18 Mois)", desc: "Un plan d'exécution détaillé pour combler les écarts et atteindre vos objectifs." },
      { icon: Shield, title: "Mandat de Conseil (Vérifié)", desc: "L'accord formel d'accompagnement garantissant l'autorité professionnelle." },
      { icon: Target, title: "Audit de Préparation Exécutive", desc: "Un rapport d'audit spécialisé comparant votre profil aux standards du marché mondial." },
    ]
  },
  ar: {
    badge: "الوثائق المعتمدة",
    subtitle: "حقيبتك الاستراتيجية",
    items: [
      { icon: BarChart3, title: "تقرير التشخيص DIGNNOS™ (SCI)", desc: "تحليل شامل للجدارة القيادية والجاهزية المهنية الخاصة بك." },
      { icon: FileText, title: "خطاب توصية تنفيذي", desc: "تزكية رسمية بناءً على أدائك في محاكاة القيادة والذكاء الاصطناعي." },
      { icon: Users, title: "إثبات ورشة عمل استشارية", desc: "وثيقة رسمية للمشاركة والتفاعل عالي المستوى في الجلسات المباشرة." },
      { icon: TrendingUp, title: "خارطة الطريق (خطة ١٨ شهر)", desc: "خطة تنفيذية مفصلة لسد الفجوات وتحقيق أهدافك المهنية القادمة." },
      { icon: Shield, title: "تفويض استشاري (موثق)", desc: "اتفاقية الاستشارة الرسمية التي تضمن المرجعية والسلطة المهنية." },
      { icon: Target, title: "تدقيق الجاهزية التنفيذية", desc: "تقرير تدقيق متخصص يقيس ملفك الشخصي مقابل المعايير العالمية." },
    ]
  }
};

// ─── PRICING ─────────────────────────────────────────────────────────────────────
export const PRICING = {
  en: {
    badge: "Investment",
    title: "Pricing Plans",
    subtitle: "Choose the level of support that fits your professional goals.",
    plans: [
      {
        name: "Discovery Trial",
        price: "Free",
        annualPrice: "Free",
        annualNote: "No credit card required",
        period: "7 days",
        desc: "Test the power of AI diagnostics for your career.",
        features: ["Initial CV Analysis", "AI Profile Preview", "Basic Career Discovery", "Community Access"],
        notIncluded: ["Full Professional Roadmap", "Strategic Report (SCI)", "Expert Sessions"],
        cta: "Try for Free",
        color: "slate",
        icon: "🌱"
      },
      {
        name: "Core AI Access",
        price: "$49",
        annualPrice: "$39/mo",
        annualNote: "Billed annually ($468/yr)",
        period: "/mo",
        desc: "Full AI diagnostic & basic roadmap access.",
        features: ["7-Stage AI Journey", "CV Generation", "Basic Roadmap", "Community Access"],
        notIncluded: ["AI Strategic Mentor", "Strategic Report (SCI)", "Live Workshops"],
        cta: "Get Started",
        color: "blue",
        icon: "⚡"
      },
      {
        name: "Premium Mastery",
        price: "$299",
        annualPrice: "$239/mo",
        annualNote: "Billed annually ($2,868/yr)",
        period: "/mo",
        popular: true,
        highlight: true,
        desc: "The complete AI ecosystem + live expert sessions.",
        features: ["Everything in Core", "AI Strategic Mentor (24/7)", "Knowledge Archives access", "Live Executive Workshop", "1 Simulation Mission", "Strategic Report (SCI)"],
        notIncluded: ["Unlimited Simulations", "Dedicated Consultant"],
        cta: "Master Your Career",
        color: "indigo",
        icon: "💎"
      },
      {
        name: "Ultimate Partner",
        price: "$1,200",
        annualPrice: "$1,200",
        annualNote: "Priority scheduling included",
        period: "one-time",
        desc: "Ongoing strategic partnership for leaders.",
        features: ["Everything in Premium", "Unlimited Simulations", "Dedicated Senior Consultant", "Full Certification Suite", "DIGNNOS™ Executive Diploma"],
        notIncluded: [],
        cta: "Scale Your Legacy",
        color: "amber",
        icon: "🏆"
      }
    ],
    extras: {
      title: "Strategic Add-ons",
      subtitle: "Customize your growth path with targeted expert interventions.",
      items: [
        { name: "Single Simulation", desc: "High-pressure executive mission", price: "$99" },
        { name: "Deep Audit Session", desc: "1:1 with Senior Consultant", price: "$199" },
        { name: "CV Architecture", desc: "Professional ATS rewrite", price: "$79" },
      ]
    },
    paymentMethods: {
      title: "Secure & Flexible Payment",
      options: ["Bank Transfer (Tunisia & Global)", "International Card", "Corporate Billing"]
    },
    paymentNote: "All transactions are secured with military-grade encryption."
  },
  fr: {
    badge: "Investissement",
    title: "Plans Tarifaires",
    subtitle: "Choisissez le niveau d'accompagnement qui correspond à vos objectifs.",
    plans: [
      {
        name: "Essai Découverte",
        price: "Gratuit",
        annualPrice: "Gratuit",
        annualNote: "Sans carte de crédit",
        period: "7 jours",
        desc: "Testez la puissance du diagnostic IA pour votre carrière.",
        features: ["Analyse CV Initiale", "Aperçu du Profil IA", "Découverte de Carrière", "Accès Communauté"],
        notIncluded: ["Feuille de Route Pro", "Rapport Stratégique (SCI)", "Sessions Experts"],
        cta: "Essayer Gratuitement",
        color: "slate",
        icon: "🌱"
      },
      {
        name: "Accès IA Core",
        price: "49€",
        annualPrice: "39€/mois",
        annualNote: "Facturé annuellement (468€/an)",
        period: "/mois",
        desc: "Diagnostic IA complet & accès feuille de route.",
        features: ["Parcours IA en 7 Étapes", "Génération de CV", "Plan de Base", "Accès Communauté"],
        notIncluded: ["Mentor Stratégique IA", "Rapport Stratégique (SCI)", "Workshops Live"],
        cta: "Démarrer",
        color: "blue",
        icon: "⚡"
      },
      {
        name: "Premium Mastery",
        price: "299€",
        annualPrice: "239€/mois",
        annualNote: "Facturé annuellement (2 868€/an)",
        period: "/mois",
        popular: true,
        highlight: true,
        desc: "Écosystème IA complet + sessions experts en direct.",
        features: ["Tout dans Core", "Mentor Stratégique IA (24/7)", "Archives du Savoir", "Workshop Exécutif Live", "1 Mission de Simulation", "Rapport Stratégique (SCI)"],
        notIncluded: ["Simulations Illimitées", "Consultant Dédié"],
        cta: "Maîtrisez Votre Carrière",
        color: "indigo",
        icon: "💎"
      },
      {
        name: "Ultimate Partner",
        price: "1 200€",
        annualPrice: "1 200€",
        annualNote: "Planification prioritaire incluse",
        period: "paiement unique",
        desc: "Partenariat stratégique continu pour leaders.",
        features: ["Tout dans Premium", "Simulations Illimitées", "Consultant Senior Dédié", "Suite de Certification Complète", "Diplôme Exécutif DIGNNOS™"],
        notIncluded: [],
        cta: "Scalez Votre Héritage",
        color: "amber",
        icon: "🏆"
      }
    ],
    extras: {
      title: "Compléments Stratégiques",
      subtitle: "Personnalisez votre parcours avec des interventions d'experts ciblées.",
      items: [
        { name: "Simulation Unique", desc: "Mission exécutive haute pression", price: "99€" },
        { name: "Session d'Audit Profond", desc: "1:1 avec Consultant Senior", price: "199€" },
        { name: "Architecture CV", desc: "Réécriture ATS professionnelle", price: "79€" },
      ]
    },
    paymentMethods: {
      title: "Paiement Sécurisé & Flexible",
      options: ["Virement Bancaire", "Carte Internationale", "Facturation Entreprise"]
    },
    paymentNote: "Toutes les transactions sont sécurisées par cryptage de grade militaire."
  },
  ar: {
    badge: "الاستثمار",
    title: "خطط الأسعار",
    subtitle: "اختر مستوى الدعم الذي يناسب أهدافك المهنية.",
    plans: [
      {
        name: "الباقة التجريبية",
        price: "مجاناً",
        annualPrice: "مجاناً",
        annualNote: "لا تتطلب بطاقة ائتمان",
        period: "٧ أيام",
        desc: "اختبر قوة التشخيص الذكي لمسارك المهني.",
        features: ["تحليل السيرة الذاتية الأولي", "معاينة الملف الشخصي الذكي", "اكتشاف الأهداف الأساسية", "دخول المجتمع"],
        notIncluded: ["خارطة الطريق المهنية", "التقرير الاستراتيجي (SCI)", "جلسات الخبراء"],
        cta: "ابدأ التجربة مجاناً",
        color: "slate",
        icon: "🌱"
      },
      {
        name: "الوصول الذكي الأساسي",
        price: "$49",
        annualPrice: "$39/شهر",
        annualNote: "تُدفع سنوياً ($468/سنة)",
        period: "/شهر",
        desc: "التشخيص الذكي الكامل والوصول لخارطة الطريق.",
        features: ["رحلة ذكية من 7 مراحل", "بناء السيرة الذاتية", "خارطة طريق أساسية", "دخول المجتمع"],
        notIncluded: ["المستشار الذكي", "التقرير الاستراتيجي (SCI)", "ورش عمل مباشرة"],
        cta: "ابدأ الآن",
        color: "blue",
        icon: "⚡"
      },
      {
        name: "بريميوم ماستري",
        price: "$299",
        annualPrice: "$239/شهر",
        annualNote: "تُدفع سنوياً ($2,868/سنة)",
        period: "/شهر",
        popular: true,
        highlight: true,
        desc: "النظام البيئي المتكامل + جلسات الخبراء المباشرة.",
        features: ["كل شيء في الأساسي", "المستشار الذكي (24/7)", "دخول أرشيف المعرفة", "ورشة عمل تنفيذية مباشرة", "مهمة محاكاة واحدة", "تقرير استراتيجي (SCI)"],
        notIncluded: ["محاكاة غير محدودة", "مستشار مخصص"],
        cta: "تمكّن من مسارك",
        color: "indigo",
        icon: "💎"
      },
      {
        name: "الشريك النهائي",
        price: "$1,200",
        annualPrice: "$1,200",
        annualNote: "جدولة ذات أولوية مشمولة",
        period: "دفعة واحدة",
        desc: "شراكة استراتيجية مستمرة للقادة.",
        features: ["كل شيء في بريميوم", "محاكاة غير محدودة", "مستشار أول مخصص", "مجموعة الشهادات الكاملة", "دبلوم DIGNNOS™ التنفيذي"],
        notIncluded: [],
        cta: "أطلق إرثك المهني",
        color: "amber",
        icon: "🏆"
      }
    ],
    extras: {
      title: "إضافات استراتيجية",
      subtitle: "خصص مسار نموك عبر تدخلات الخبراء المستهدفة.",
      items: [
        { name: "محاكاة واحدة", desc: "مهمة تنفيذية تحت الضغط", price: "$99" },
        { name: "جلسة تدقيق معمق", desc: "1:1 مع مستشار أول", price: "$199" },
        { name: "هندسة السيرة الذاتية", desc: "إعادة كتابة مهنية متوافقة مع ATS", price: "$79" },
      ]
    },
    paymentMethods: {
      title: "دفع آمن ومرن",
      options: ["تحويل بنكي (تونس وعالمياً)", "بطاقة دولية", "فوترة شركات"]
    },
    paymentNote: "جميع المعاملات مؤمنة بتشفير من الدرجة العسكرية."
  }
};

// ─── CONTRACT ────────────────────────────────────────────────────────────────────
export const CONTRACT = {
  en: {
    title: "General Service Agreement",
    subtitle: "Ref: MA-TC-2026-HQ / AUTH-GO10DI | Authorized Professional Mandate",
    docTitle: "CONSULTING SERVICE AGREEMENT",
    parties: "Between: MA-TRAINING-CONSULTING (The Firm) And: The Client ({{client}})",
    clauses: [
      { title: "Article 1: Scope of Service", text: "We provide professional consulting, strategic diagnostics, and career development support to help you reach your goals." },
      { title: "Article 2: Privacy & Professional Sharing", text: "Your data is protected. However, diagnostic reports may be shared with potential employers and partners to verify your professional level and support your career advancement." },
      { title: "Article 3: Ownership of Tools", text: "All methodologies, simulation missions, and tools used remain the exclusive property of MA-TRAINING-CONSULTING." },
      { icon: Rocket, title: "Article 4: Engagement Terms", text: "Consulting fees are final once expert resources are activated. Payments are non-refundable as they represent immediate technical and human allocation." },
      { title: "Article 5: Formal Agreement", text: "Downloading, signing, and emailing this document confirms your full agreement to start the service under these terms." },
    ],
    cta: "Download & Sign (PDF)",
    nameLabel: "Client Full Name",
    namePlaceholder: "Enter your name",
    dateLabel: "Date",
    nameRequired: "Identification required to activate the mandate",
    legalNote: "Note: You must download this document, sign it, and send it back to contact@matrainingconsulting.com. This action constitutes a formal legal agreement to start the service.",
  },
  fr: {
    title: "Accord de Service Général",
    subtitle: "Réf: MA-TC-2026-HQ / AUTH-GO10DI | Mandat Professionnel Autorisé",
    docTitle: "ACCORD DE SERVICE DE CONSEIL",
    parties: "Entre : MA-TRAINING-CONSULTING (Le Cabinet) Et : Le Client ({{client}})",
    clauses: [
      { title: "Article 1 : Objet du Service", text: "Nous fournissons du conseil professionnel, des diagnostics stratégiques et un soutien au développement pour vous aider à atteindre vos objectifs." },
      { title: "Article 2 : Confidentialité et Partage", text: "Vos données sont protégées. Toutefois, les rapports de diagnostic peuvent être partagés avec des employeurs potentiels et partenaires pour certifier votre niveau et soutenir votre carrière." },
      { title: "Article 3 : Propriété des Outils", text: "Toutes les méthodologies, missions de simulation et outils utilisés restent la propriété exclusive de MA-TRAINING-CONSULTING." },
      { title: "Article 4 : Conditions d'Engagement", text: "Les honoraires sont définitifs dès l'activation des ressources expertes. Ils sont non remboursables car ils représentent une allocation technique et humaine immédiate." },
      { title: "Article 5 : Accord Formel", text: "Le fait de télécharger, signer et renvoyer ce document confirme votre accord complet pour débuter le service selon ces conditions." },
    ],
    cta: "Télécharger & Signer (PDF)",
    nameLabel: "Nom complet du client",
    namePlaceholder: "Enregistrez votre nom",
    dateLabel: "Date",
    nameRequired: "Identification requise pour activer le mandat",
    legalNote: "Note : Vous devez télécharger ce document, le signer et le renvoyer à contact@matrainingconsulting.com. Cette action constitue un accord juridique formel pour le début du service.",
  },
  ar: {
    title: "اتفاقية الخدمة العامة",
    subtitle: "المرجع: MA-TC-2026-HQ / AUTH-GO10DI | تفويض مهني معتمد",
    docTitle: "اتفاقية خدمات استشارية",
    parties: "بين: مكتب MA-TRAINING-CONSULTING (الطرف الأول) و: العميل ({{client}})",
    clauses: [
      { title: "المادة الأولى: هدف الخدمة", text: "نحن نقدم خدمات الاستشارة المهنية، التشخيص الاستراتيجي، ودعم التطوير لمساعدتك في تحقيق أهدافك الوظيفية." },
      { title: "المادة الثانية: الخصوصية والمشاركة المهنية", text: "بياناتك محمية، ومع ذلك، يمكن مشاركة تقارير التشخيص مع أصحاب العمل المحتملين والشركاء لتوثيق مستواك المهني ودعم فرص توظيفك." },
      { title: "المادة الثالثة: ملكية الأدوات", text: "تظل جميع المنهجيات، مهام المحاكاة، والأدوات المستخدمة ملكية حصرية لمكتب MA-TRAINING-CONSULTING." },
      { title: "المادة الرابعة: شروط الالتزام", text: "تعتبر الأتعاب نهائية بمجرد تفعيل موارد الخبراء، وهي غير قابلة للاسترداد نظراً للتخصيص الفني والبشري الفوري لخدمتكم." },
      { title: "المادة الخامسة: الموافقة الرسمية", text: "تحميل هذا المستند وتوقيعه وإعادة إرساله يؤكد موافقتك الكاملة على بدء الخدمة وفقاً لهذه الشروط." },
    ],
    cta: "تحميل العقد وتوقيعه (PDF)",
    nameLabel: "الاسم الكامل للعميل",
    namePlaceholder: "أدخل اسمك كما في الهوية",
    dateLabel: "التاريخ",
    nameRequired: "التعريف بالهوية مطلوب لتفعيل التفويض",
    legalNote: "ملاحظة: يجب عليك تحميل هذا المستند، توقيعه، وإعادة إرساله إلى contact@matrainingconsulting.com. يعتبر هذا الإجراء موافقة قانونية رسمية على بدء الخدمة.",
  },
};

// ─── FINAL CTA ───────────────────────────────────────────────────────────────────
export const FINAL_CTA = {
  en: {
    title: "Ready to Command Your Future?",
    subtitle: "Join the elite ecosystem defined by MATC. Accuracy, Authority, and Advancement.",
    cta: "Start Your Diagnostic Journey",
    note: "Join 5,000+ professionals who transformed their careers."
  },
  fr: {
    title: "Prêt à Diriger Votre Avenir ?",
    subtitle: "Rejoignez l'écosystème d'élite défini par MATC. Précision, Autorité et Avancement.",
    cta: "Démarrer Votre Parcours Diagnostic",
    note: "Rejoignez plus de 5 000 professionnels déjà transformés."
  },
  ar: {
    title: "هل أنت مستعد لقيادة مستقبلك؟",
    subtitle: "انضم إلى النظام البيئي النخوي الذي يحدده MATC. دقة، سلطة، وتقدم.",
    cta: "ابدأ رحلتك التشخيصية الآن",
    note: "انضم إلى أكثر من 5000 محترف غيروا مسارهم المهني بالفعل."
  }
};
