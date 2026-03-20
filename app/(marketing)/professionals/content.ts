import { 
  Shield, Users, Target, FileText, 
  Zap, BarChart3, Brain 
} from "lucide-react";

// ─── NAV ────────────────────────────────────────────────────────────────────────
export const NAV = {
  en: { home: "Home", experts: "For Experts", enterprise: "Enterprise", verify: "Verify", workspace: "My Workspace" },
  fr: { home: "Accueil", experts: "Pour Experts", enterprise: "Entreprise", verify: "Vérifier", workspace: "Mon Espace" },
  ar: { home: "الرئيسية", experts: "للخبراء", enterprise: "للمؤسسات", verify: "تحقق", workspace: "مساحتي" },
};

// ─── HERO ────────────────────────────────────────────────────────────────────────
export const HERO = {
  en: {
    badge: "Strategic AI Consulting",
    h1a: "Your Profile Is Hiding",
    h1b: "Half Your Real Value.",
    sub: "We reveal it — then build a strategic consulting path around it. AI diagnostic meets expert advisory, designed precisely around your gaps.",
    cta: "Start Free Diagnostic",
    ctaSub: "No card required · 15 min · Fully private",
    cta2: "View Pricing",
    stats: [
      { val: 2500, suf: "+", label: "Professionals Advised" },
      { val: 94, suf: "%", label: "Satisfaction Rate" },
      { val: 15, suf: " min", label: "Full Diagnostic" },
      { val: 3, suf: " langs", label: "EN / FR / AR" },
    ]
  },
  fr: {
    badge: "Conseil Stratégique IA",
    h1a: "Votre Profil Cache",
    h1b: "La Moitié de Votre Valeur.",
    sub: "Nous la révélons — puis construisons un parcours de conseil stratégique autour. Le diagnostic IA rencontre l'avis d'expert, conçu précisément selon vos lacunes.",
    cta: "Lancer le Diagnostic Gratuit",
    ctaSub: "Aucune carte requise · 15 min · Privé",
    cta2: "Voir les Tarifs",
    stats: [
      { val: 2500, suf: "+", label: "Professionnels Conseillés" },
      { val: 94, suf: "%", label: "Taux de Satisfaction" },
      { val: 15, suf: " min", label: "Diagnostic Complet" },
      { val: 3, suf: " langs", label: "EN / FR / AR" },
    ]
  },
  ar: {
    badge: "استشارات ذكية استراتيجية",
    h1a: "ملفك المهني يخفي",
    h1b: "نصف قيمتك الحقيقية.",
    sub: "نحن نكشفها — ثم نبني مسار استشارة استراتيجية حولها. تشخيص ذكي يلتقي بخبرة بشرية، مصمم بدقة حول فجواتك المهنية.",
    cta: "ابدأ التشخيص المجاني",
    ctaSub: "بدون بطاقة · 15 دقيقة · خصوصية تامة",
    cta2: "عرض الأسعار",
    stats: [
      { val: 2500, suf: "+", label: "محترف تم تأطيره" },
      { val: 94, suf: "%", label: "نسبة الرضا" },
      { val: 15, suf: " دقيقة", label: "تشخيص كامل" },
      { val: 3, suf: " لغات", label: "AR / EN / FR" },
    ]
  }
};

// ─── PAIN ────────────────────────────────────────────────────────────────────────
export const PAIN = {
  en: {
    badge: "The Hidden Problem",
    title: "Does Any of This Sound Like You?",
    items: [
      "Your CV doesn't reflect the depth of what you actually do.",
      "You've applied to dozens of roles and never heard back.",
      "You feel stuck at the same level despite years of experience.",
      "You walk into interviews without knowing how to position your real value.",
      "You have ambition — but no clear, realistic roadmap to act on it.",
    ],
    close: "If even one of these resonates — you're in the right place."
  },
  fr: {
    badge: "Le Problème Invisible",
    title: "Est-ce que cela vous ressemble ?",
    items: [
      "Votre CV ne reflète pas la profondeur de votre travail réel.",
      "Vous avez postulé à des dizaines de postes sans retour.",
      "Vous vous sentez bloqué au même niveau malgré vos années d'expérience.",
      "Vous allez en entretien sans savoir comment positionner votre valeur réelle.",
      "Vous avez de l'ambition — mais pas de feuille de route claire pour agir.",
    ],
    close: "Si au moins l'un de ces points vous parle — vous êtes au bon endroit."
  },
  ar: {
    badge: "المشكلة الخفية",
    title: "هل تشعر بأي من هذه الإحباطات؟",
    items: [
      "سيرتك الذاتية لا تعكس عمق ما تفعله حقاً.",
      "تقدمت لعشرات الوظائف ولم تتلقَ أي رد.",
      "تشعر أنك عالق في نفس المستوى رغم سنوات الخبرة.",
      "تدخل المقابلات دون أن تعرف كيف تبرز قيمتك الحقيقية.",
      "تملك الطموح — لكن لا تملك خارطة طريق واقعية للتنفيذ.",
    ],
    close: "إذا كان أحد هذه النقاط يلمسك — فأنت في المكان الصحيح."
  }
};

// ─── SOLUTION ────────────────────────────────────────────────────────────────────
export const SOLUTION = {
  en: {
    badge: "Our Approach",
    title: "Not a Training Platform. A Strategic Advisory Firm.",
    sub: "We combine AI precision with senior expert insight to build your professional strategy — not a generic course, but a tailored advisory path.",
    steps: [
      { icon: Brain, title: "AI Diagnostic", desc: "Deep analysis of your CV, experience, and professional positioning in 15 minutes." },
      { icon: Target, title: "Gap Mapping", desc: "We identify exactly what is holding you back — skills, positioning, or narrative." },
      { icon: Users, title: "Expert Advisory Session", desc: "Grouped with peers who share your exact gaps. A senior consultant leads the session." },
      { icon: Shield, title: "Strategic Documents", desc: "AI-generated SCI report, roadmap, and authority documents tailored to your profile." },
    ]
  },
  fr: {
    badge: "Notre Approche",
    title: "Pas une formation. Un cabinet de conseil stratégique.",
    sub: "Nous combinons la précision de l'IA avec l'expertise senior pour bâtir votre stratégie pro — pas un cours générique, mais un parcours de conseil sur mesure.",
    steps: [
      { icon: Brain, title: "Diagnostic IA", desc: "Analyse profonde de votre CV, expérience et positionnement en 15 minutes." },
      { icon: Target, title: "Cartographie des Lacunes", desc: "Nous identifions exactement ce qui vous freine — compétences أو positionnement." },
      { icon: Users, title: "Conseil Expert", desc: "Groupé avec des pairs partageant les mêmes lacunes. Un consultant senior dirige la session." },
      { icon: Shield, title: "Documents Stratégiques", desc: "Rapport SCI généré par IA, roadmap et documents d'autorité sur mesure." },
    ]
  },
  ar: {
    badge: "منهجيتنا",
    title: "لسنا منصة تدريب. نحن مكتب استشارات استراتيجية.",
    sub: "نجمع بين دقة الذكاء الاصطناعي وبصيرة الخبراء لبناء استراتيجيتك المهنية — ليس كباقة تعليمية، بل كمسار استشاري مخصص.",
    steps: [
      { icon: Brain, title: "التشخيص الذكي", desc: "تحليل عميق لسيرتك الذاتية وخبرتك وموقعك المهني في 15 دقيقة." },
      { icon: Target, title: "خارطة الفجوات", desc: "نحدد بدقة ما الذي يعيق تقدمك — سواء كانت مهارات، موقعاً سوقياً، أو سردية مهنية." },
      { icon: Users, title: "جلسة استشارة خبير", desc: "يتم تجميعك مع أقران يملكون نفس فجواتك تماماً. يقود الجلسة مستشار أول متخصص." },
      { icon: Shield, title: "الوثائق الاستراتيجية", desc: "تقرير SCI المولّد بالـ AI، خارطة طريق، ووثائق سلطة مهنية مصممة لبروفايلك." },
    ]
  }
};

// ─── COHORT ──────────────────────────────────────────────────────────────────────
export const COHORT = {
  en: {
    badge: "Intelligent Grouping",
    title: "Advisory Sessions Built Around Your Exact Profile",
    sub: "Unlike generic group sessions, our AI groups you with peers who share the same gaps, level, and challenges — so every minute of the session is relevant to you.",
    points: [
      { icon: "🧠", title: "AI-Matched Cohorts", desc: "Grouped by diagnostic similarity, not random assignment." },
      { icon: "👔", title: "Senior Expert Facilitation", desc: "Each session is led by a certified professional consultant." },
      { icon: "🎯", title: "Zero Generic Content", desc: "Sessions are built around real gaps from participant diagnostics." },
      { icon: "📊", title: "Measurable Outcomes", desc: "Post-session scorecard tracks your progress precisely." },
    ],
    visual: {
      title: "AI Cohort Matching",
      unit: "matched professionals",
      status: "AI matching updates in real-time"
    }
  },
  fr: {
    badge: "Groupement Intelligent",
    title: "Conseil construit autour de votre profil exact",
    sub: "Contrairement aux sessions de groupe classiques, notre IA vous regroupe avec des pairs partageant les mêmes lacunes et défis.",
    points: [
      { icon: "🧠", title: "Cohortes par IA", desc: "Groupés par similarité de diagnostic, pas par hasard." },
      { icon: "👔", title: "Facilitation par Expert Senior", desc: "Chaque session est dirigée par un consultant certifié." },
      { icon: "🎯", title: "Zéro Contenu Générique", desc: "Sessions basées sur les lacunes réelles des participants." },
      { icon: "📊", title: "Résultats Mesurables", desc: "Scorecard post-session pour suivre votre progression." },
    ],
    visual: {
      title: "Groupement IA",
      unit: "professionnels assortis",
      status: "Calcul IA en temps réel"
    }
  },
  ar: {
    badge: "التجميع الذكي",
    title: "جلسات استشارية مبنية حول بروفايلك بدقة",
    sub: "على عكس الجلسات الجماعية العادية، يقوم الذكاء الاصطناعي بتجميعك مع أقران يشاركونك نفس الفجوات والتحديات — لتكون كل دقيقة من الجلسة مفيدة لك.",
    points: [
      { icon: "🧠", title: "مجموعات متجانسة بالـ AI", desc: "يتم تجميعكم بناءً على تماثل التشخيص، وليس عشوائياً." },
      { icon: "👔", title: "تأطير من خبراء أوائل", desc: "يتم قيادة كل جلسة من قبل مستشار مهني معتمد." },
      { icon: "🎯", title: "محتوى غير تقليدي", desc: "تُبنى الجلسات حول الفجوات الحقيقية لمشاركي المجموعة." },
      { icon: "📊", title: "نتائج قابلة للقياس", desc: "بطاقة أداء (Scorecard) بعد الجلسة لتتبع تطورك بدقة." },
    ],
    visual: {
      title: "تجميع المجموعات بالـ AI",
      unit: "محترفين متطابقين",
      status: "تحديثات التجميع فورية"
    }
  }
};

// ─── PATHS ───────────────────────────────────────────────────────────────────────
export const PATHS = {
  en: {
    badge: "Two Paths. One Platform.",
    title: "Who Is This For?",
    client: {
      tag: "Professionals, Students & Job Seekers",
      title: "You want to unlock your real career value.",
      items: ["AI diagnostic in 15 min", "Personalized gap analysis", "Expert advisory sessions (matched cohort)", "Strategic roadmap generation", "Professional authority documents", "SCI Report + Recommendation letter"],
      cta: "Start As Professional",
      href: "/register"
    },
    expert: {
      tag: "For Expert Consultants",
      title: "You want AI intelligence to elevate your advisory work.",
      items: ["Portfolio analysis with critical benchmarks", "Participant profiling before each session", "Session animation strategy suggestions", "Project intelligence & key insights", "Auto-generated dashboards & scorecards", "Document generator for any consulting asset"],
      cta: "Apply As Expert",
      href: "/modeteur"
    }
  },
  fr: {
    badge: "Deux Chemins. Une Plateforme.",
    title: "Pour qui est-ce ?",
    client: {
      tag: "Professionnels, Étudiants & Chercheurs",
      title: "Libérez votre valeur réelle sur le marché.",
      items: ["Diagnostic IA en 15 min", "Analyse personnalisée des lacunes", "Conseil expert (cohorte assortie)", "Génération de roadmap stratégique", "Documents d'autorité professionnelle", "Rapport SCI + Lettre de recommandation"],
      cta: "Commencer en tant que Pro",
      href: "/register"
    },
    expert: {
      tag: "Pour Experts & Consultants",
      title: "Élevez votre travail de conseil via l'IA.",
      items: ["Analyse de portfolio (benchmarks critiques)", "Profilage des participants avant session", "Stratégies d'animation de sessions", "Intelligence de projet & Insights clés", "Dashboards & Scorecards auto-générés", "Générateur de documents de conseil"],
      cta: "Devenir Expert MATC",
      href: "/modeteur"
    }
  },
  ar: {
    badge: "مساران. منصة واحدة.",
    title: "لمن هذه المنصة؟",
    client: {
      tag: "للمحترفين، الطلبة والباحثين",
      title: "تريد تحرير قيمتك المهنية الحقيقية.",
      items: ["تشخيص ذكي في 15 دقيقة", "تحليل مخصص للفجوات المهنية", "جلسات استشارية (مجموعات متجانسة)", "توليد خارطة طريق استراتيجية", "وثائق سلطة مهنية موثقة", "تقرير SCI + خطاب توصية رسمي"],
      cta: "ابدأ كمحترف",
      href: "/register"
    },
    expert: {
      tag: "للخبراء والمستشارين",
      title: "تريد ذكاءً اصطناعياً يرفع جودة استشاراتك.",
      items: ["تحليل الـ Portfolio بمقاييس نقدية", "تحليل المشاركين قبل الجلسة (Briefing)", "مقترحات لاستراتيجية إدارة الجلسة", "تحليل المشاريع المنجزة ونقاط التأثير", "لوحات تحكم وبطاقات أداء آلية", "مولد أي وثيقة استشارية أو تقرير"],
      cta: "انضم كخبير معتمد",
      href: "/modeteur"
    }
  }
};

// ─── EXPERT MODULES ──────────────────────────────────────────────────────────────
export const EXPERT_MODULES = {
  en: {
    badge: "Expert Intelligence Suite",
    title: "4 AI Modules That Elevate Your Consulting",
    sub: "Tools built specifically for senior advisors who want to deliver with data-backed precision.",
    modules: [
      { icon: FileText, color: "blue", tag: "Module A", title: "Portfolio Intelligence", desc: "AI audits your professional portfolio with real-world benchmarks. It asks critical questions, surfaces hidden gaps, and tells you exactly what's missing to position yourself at the top of your field." },
      { icon: Users, color: "violet", tag: "Module B", title: "Participant Profiling", desc: "Before each advisory session, AI analyzes your participants' diagnostic data and gives you a strategic briefing: their gap clusters, suggested approaches, and a ready-to-use animation plan." },
      { icon: BarChart3, color: "emerald", tag: "Module C", title: "Project Intelligence", desc: "Load your completed consulting projects and get AI-powered insights: recurring patterns, high-impact areas, and a personal development map to sharpen your advisory edge." },
      { icon: Zap, color: "amber", tag: "Module D", title: "Document Generator", desc: "Generate any consulting document in seconds — scorecards, dashboards, session reports, ROI analyses, or proposals. AI also suggests documents you hadn't thought of based on your project context." },
    ]
  },
  fr: {
    badge: "Suite d'Intelligence Expert",
    title: "4 Modules IA qui élèvent votre conseil",
    sub: "Outils conçus pour les conseillers senior voulant livrer avec précision.",
    modules: [
      { icon: FileText, color: "blue", tag: "Module A", title: "Expertise Portfolio", desc: "L'IA audite votre portfolio pro avec des benchmarks réels. Elle pose les questions critiques, révèle les lacunes et optimise votre positionnement." },
      { icon: Users, color: "violet", tag: "Module B", title: "Profilage Participants", desc: "Avant chaque session, l'IA analyse vos participants et vous donne un briefing : clusters de lacunes, approches suggérées et plan d'animation." },
      { icon: BarChart3, color: "emerald", tag: "Module C", title: "Intelligence Projet", desc: "Analysez vos projets passés : patterns récurrents, zones à fort impact et roadmap de développement personnel pour l'expert." },
      { icon: Zap, color: "amber", tag: "Module D", title: "Générateur Documents", desc: "Générez scorecards, dashboards et rapports en secondes. L'IA suggère des documents pertinents selon le contexte de votre projet." },
    ]
  },
  ar: {
    badge: "باقة ذكاء الخبير",
    title: "4 وحدات AI ترفع جودة عملك الاستشاري",
    sub: "أدوات صممت خصيصاً للمستشارين الأوائل الذين يطمحون للدقة المبنية على البيانات.",
    modules: [
      { icon: FileText, color: "blue", tag: "الموديل أ", title: "تحليل البورتفوليو", desc: "AI يحلل ملفك المهني بمقاييس واقعية. يطرح أسئلة نقدية، يكشف الفجوات المخفية، ويخبرك بالضبط بما ينقصك لتتصدّر مجالك." },
      { icon: Users, color: "violet", tag: "الموديل ب", title: "تحليل المشاركين", desc: "قبل كل جلسة، يحلل AI بيانات تشخيص المشاركين ويعطيك تقريراً استراتيجياً: نقاط ضعفهم المشتركة، المقترحات التأطيرية، وخطة Animation جاهزة." },
      { icon: BarChart3, color: "emerald", tag: "الموديل ج", title: "تحليل المشاريع", desc: "ارفع مشاريعك الاستشارية المنجزة واحصل على رؤى معززة: الأنماط المتكررة، مناطق التأثير العالي، وخارطة تطوير شخصية لأدائك كخبير." },
      { icon: Zap, color: "amber", tag: "الموديل د", title: "مولّد الوثائق", desc: "ولّد أي وثيقة استشارية في ثوانٍ — بطاقات أداء، لوحات تحكم، تقارير جلسات، أو مقترحات. النظام يقترح عليك وثائق لم تفكر فيها بناءً على سياق المشروع." },
    ]
  }
};

// ─── PROOF ───────────────────────────────────────────────────────────────────────
export const PROOF = {
  en: {
    badge: "Social Proof",
    title: "What Our Professionals Say",
    reviews: [
      { name: "Yasmine B.", role: "Marketing Manager · Tunis", text: "The diagnostic revealed skill gaps I had completely overlooked. In 6 weeks, I repositioned my profile and got an offer 40% above my previous salary.", stars: 5 },
      { name: "Karim S.", role: "Operations Director · Algiers", text: "The expert advisory session was unlike anything I'd experienced. Every insight was directly relevant — because everyone in the group had the same challenges.", stars: 5 },
      { name: "Leila M.", role: "Consultant · Casablanca", text: "The Portfolio Intelligence module changed how I present my consultation work. The AI asked questions I'd never thought to answer. Incredibly sharp.", stars: 5 },
    ]
  },
  fr: {
    badge: "Preuve Sociale",
    title: "Ce que disent nos professionnels",
    reviews: [
      { name: "Yasmine B.", role: "Responsable Marketing · Tunis", text: "Le diagnostic a révélé des lacunes que j'avais ignorées. En 6 semaines, j'ai repositionné mon profil et obtenu une offre +40% supérieure.", stars: 5 },
      { name: "Karim S.", role: "Directeur Opérations · Alger", text: "La session de conseil expert était unique. Chaque conseil était pertinent car le groupe partageait les mêmes défis réels.", stars: 5 },
      { name: "Leila M.", role: "Consultante · Casablanca", text: "Le module Portfolio Intelligence a changé ma façon de présenter mon travail. L'IA a posé des questions fondamentales. Très pointu.", stars: 5 },
    ]
  },
  ar: {
    badge: "شهادات",
    title: "ماذا يقول شركاؤنا في النجاح",
    reviews: [
      { name: "ياسمين ب.", role: "مديرة تسويق · تونس", text: "كشف لي التشخيص فجوات مهارية كنت أغفل عنها تماماً. في 6 أسابيع، أعدت تموضع ملفي وحصلت على عرض عمل بزيادة 40% عن راتبي السابق.", stars: 5 },
      { name: "كريم س.", role: "مدير عمليات · الجزائر", text: "جلسة الخبير كانت مختلفة عن أي شيء جربته. كل معلومة كانت مفيدة ومباشرة لأن المجموعة كاملة كانت تعاني من نفس التحديات.", stars: 5 },
      { name: "ليلى م.", role: "مستشارة · الدار البيضاء", text: "موديل تحليل البورتفوليو غير طريقتي في عرض عملي الاستشاري. طرح الـ AI أسئلة لم أفكر فيها أبداً. ذكاء حاد جداً.", stars: 5 },
    ]
  }
};

// ─── PRICING ─────────────────────────────────────────────────────────────────────
export const PRICING = {
  en: {
    badge: "Transparent Pricing",
    title: "One Platform. Three Paths.",
    sub: "Choose the account that matches your situation.",
    tabs: [
      { id: "student", label: "Students & Job Seekers", icon: "🎓" },
      { id: "pro",     label: "Professionals",          icon: "👔" },
      { id: "expert",  label: "Expert Consultants",     icon: "🧠" },
    ],
    popular: "Most Popular",
    groups: {
      student: {
        headline: "Built for graduates and job seekers who need a real edge.",
        plans: [
          {
            id: "s-free", name: "Starter", icon: "🌱", price: "Free", priceTND: "0 DT", period: "", highlight: false,
            desc: "Explore the diagnostic engine at zero cost.",
            features: ["AI CV preliminary analysis", "Partial gap preview (first 3 gaps)", "Community access (Alfaida)", "Suggested workshop categories"],
            notIncluded: ["Full SCI Report", "AI Diagnostic Interview", "CV generation", "Simulation & workshops"],
            cta: "Start Free", href: "/register"
          },
          {
            id: "s-essential", name: "Essential", icon: "🎓", price: "15", priceTND: "49 DT", period: "/ month", highlight: false, popular: false,
            desc: "Full diagnostic — CV, interview, SCI report, and generated documents.",
            features: ["Full 7-step AI Diagnostic", "AI Diagnostic Interview", "Complete SCI Report", "Generated CV + Cover Letter", "Workshop access", "Knowledge Library"],
            notIncluded: ["Simulation mission", "Expert session", "Certificate & Recommendation"],
            cta: "Activate Essential", href: "/register"
          },
          {
            id: "s-full", name: "Full Journey", icon: "🚀", price: "47", priceTND: "149 DT", period: "/ 3 months", highlight: true, popular: true,
            desc: "From graduate to market-ready professional in 3 months.",
            features: ["Everything in Essential", "Executive Simulation Mission", "1 Expert Advisory Session", "Complete Strategic Report", "Dynamic 18-month Roadmap", "Workshop Certificate", "Official Recommendation Letter"],
            notIncluded: [],
            cta: "Start Full Journey", href: "/register"
          }
        ]
      },
      pro: {
        headline: "Strategic tools for professionals ready to make their next big career move.",
        plans: [
          {
            id: "p-exec", name: "Executive", icon: "⚡", price: "79", priceTND: "249 DT", period: "/ month", highlight: false,
            desc: "Advanced diagnostic + roadmap + executive logic audit in one hub.",
            features: ["Advanced X-Ray Diagnostic (SWOT + Radar)", "AI Strategic Roadmap (18 months)", "Executive Logic Audit simulation", "Skill Assessment Center (Operations)", "Dashboard & analytics"],
            notIncluded: ["Self-Marketing Studio", "Final Verdict PDF", "Human expert session"],
            cta: "Activate Executive", href: "/register"
          },
          {
            id: "p-strategic", name: "Strategic", icon: "💼", price: "189", priceTND: "599 DT", period: "/ 3 months", highlight: true, popular: true,
            desc: "Complete professional transformation — from diagnosis to market authority.",
            features: ["Everything in Executive", "Self-Marketing Studio (CV + Report + Negotiation)", "Final Strategic Verdict (PDF)", "3 Executive Logic Audit simulations", "1 Human Expert Session (45 min)", "Job Alignment Testing"],
            notIncluded: ["Multiple human expert sessions"],
            cta: "Start Strategic Plan", href: "/register"
          },
          {
            id: "p-authority", name: "Authority", icon: "🏆", price: "315", priceTND: "999 DT", period: "/ 6 months", highlight: false,
            desc: "Senior-level support + full AI suite for market leaders.",
            features: ["Everything in Strategic", "3 Human Expert Sessions (45 min each)", "Unlimited Job Alignment Testing", "CV reviewed by human consultant", "Priority support & direct advisor access", "Corporate billing available"],
            notIncluded: [],
            cta: "Claim Authority", href: "/register"
          }
        ]
      },
      expert: {
        headline: "AI intelligence that makes your advisory sessions more precise and impactful.",
        plans: [
          {
            id: "e-starter", name: "Expert Starter", icon: "🧠", price: "95", priceTND: "299 DT", period: "/ month", highlight: false,
            desc: "Portfolio analysis + participant profiling for sharper sessions.",
            features: ["Module A: AI Portfolio Analysis (with benchmarks)", "Module B: Participant Profiling (5/month)", "Basic expert dashboard", "Session preparation briefing"],
            notIncluded: ["Module C: Project Intelligence", "Module D: Document Generator", "Unlimited profiling"],
            cta: "Start as Expert", href: "/register"
          },
          {
            id: "e-pro", name: "Expert Pro", icon: "💡", price: "220", priceTND: "699 DT", period: "/ 3 months", highlight: true, popular: true,
            desc: "All 4 AI modules — the complete intelligence suite for serious consultants.",
            features: ["All 4 Modules (A+B+C+D)", "Unlimited participant profiling", "20 AI-generated documents/month", "Advanced analytics dashboard", "PDF export for all reports", "Project pattern analysis"],
            notIncluded: ["White-label reports", "Dedicated onboarding"],
            cta: "Go Expert Pro", href: "/register"
          },
          {
            id: "e-elite", name: "Expert Elite", icon: "👑", price: "315", priceTND: "999 DT", period: "/ 3 months", highlight: false,
            desc: "Unlimited, white-labeled, and fully supported for elite practices.",
            features: ["Everything in Expert Pro (unlimited)", "Dedicated onboarding session (1h)", "White-label reports (your branding)", "Priority 24h support", "Client-facing analytics dashboard", "Custom document templates"],
            notIncluded: [],
            cta: "Join Elite", href: "/register"
          }
        ]
      }
    }
  },
  fr: {
    badge: "Tarification Transparente",
    title: "Une Plateforme. Trois Trajectoires.",
    sub: "Choisissez le compte qui correspond à votre situation.",
    tabs: [
      { id: "student", label: "Étudiants & Chercheurs", icon: "🎓" },
      { id: "pro",     label: "Professionnels",         icon: "👔" },
      { id: "expert",  label: "Consultants Experts",    icon: "🧠" },
    ],
    popular: "Plus Populaire",
    groups: {
      student: {
        headline: "Pour les diplômés et chercheurs d'emploi qui veulent un vrai avantage.",
        plans: [
          {
            id: "s-free", name: "Démarrage", icon: "🌱", price: "Gratuit", priceTND: "0 DT", period: "", highlight: false,
            desc: "Explorez le moteur de diagnostic sans engagement.",
            features: ["Analyse CV IA préliminaire", "Aperçu 3 premières lacunes", "Accès communauté (Alfaida)", "Catégories de workshops suggérées"],
            notIncluded: ["Rapport SCI complet", "Entretien AI diagnostique", "Génération CV", "Workshops & simulation"],
            cta: "Commencer Gratuitement", href: "/register"
          },
          {
            id: "s-essential", name: "Essentiel", icon: "🎓", price: "15", priceTND: "49 DT", period: "/ mois", highlight: false, popular: false,
            desc: "Diagnostic complet — CV, entretien, rapport SCI, documents générés.",
            features: ["Diagnostic IA complet en 7 étapes", "Entretien AI diagnostique", "Rapport SCI complet", "CV + Lettre de motivation", "Accès workshops", "Bibliothèque"],
            notIncluded: ["Mission simulation", "Session expert", "Certificat & Recommandation"],
            cta: "Activer Essentiel", href: "/register"
          },
          {
            id: "s-full", name: "Parcours Complet", icon: "🚀", price: "47", priceTND: "149 DT", period: "/ 3 mois", highlight: true, popular: true,
            desc: "De diplômé à professionnel prêt pour le marché en 3 mois.",
            features: ["Tout de l'Essentiel", "Mission simulation exécutive", "1 Session conseil expert", "Rapport stratégique complet", "Roadmap dynamique 18 mois", "Certificat workshops", "Lettre de recommandation"],
            notIncluded: [],
            cta: "Lancer le Parcours Complet", href: "/register"
          }
        ]
      },
      pro: {
        headline: "Outils stratégiques pour les professionnels prêts à franchir un nouveau cap.",
        plans: [
          {
            id: "p-exec", name: "Exécutif", icon: "⚡", price: "79", priceTND: "249 DT", period: "/ mois", highlight: false,
            desc: "Diagnostic avancé + roadmap + audit logique exécutif en un seul endroit.",
            features: ["Diagnostic X-Ray avancé (SWOT + Radar)", "Roadmap IA (18 mois)", "Simulation d'audit logique exécutif", "Centre d'Évaluation des Compétences", "Dashboard & analytics"],
            notIncluded: ["Studio Self-Marketing", "Verdict Final PDF", "Session expert humain"],
            cta: "Activer Exécutif", href: "/register"
          },
          {
            id: "p-strategic", name: "Stratégique", icon: "💼", price: "189", priceTND: "599 DT", period: "/ 3 mois", highlight: true, popular: true,
            desc: "Transformation professionnelle complète — du diagnostic à l'autorité.",
            features: ["Tout de l'Exécutif", "Studio Self-Marketing complet", "Verdict Final (PDF)", "3 simulations d'audit logique", "1 Session Expert Humain (45 min)", "Test alignement emploi"],
            notIncluded: ["Sessions multiples expert humain"],
            cta: "Démarrer Plan Stratégique", href: "/register"
          },
          {
            id: "p-authority", name: "Autorité", icon: "🏆", price: "315", priceTND: "999 DT", period: "/ 6 mois", highlight: false,
            desc: "Support senior + suite IA complète pour ceux qui commandent.",
            features: ["Tout du Stratégique", "3 Sessions Expert Humain (45 min)", "Tests alignement illimités", "CV révisé par consultant humain", "Support prioritaire & accès direct", "Facturation entreprise"],
            notIncluded: [],
            cta: "Prendre l'Autorité", href: "/register"
          }
        ]
      },
      expert: {
        headline: "L'intelligence IA pour des sessions de conseil plus précises et impactantes.",
        plans: [
          {
            id: "e-starter", name: "Expert Démarrage", icon: "🧠", price: "95", priceTND: "299 DT", period: "/ mois", highlight: false,
            desc: "Analyse portfolio + profilage participants pour des sessions plus intelligentes.",
            features: ["Module A: Analyse Portfolio IA (benchmarks)", "Module B: Profilage Participants (5/mois)", "Dashboard expert de base", "Briefing préparation session"],
            notIncluded: ["Module C: Intelligence Projet", "Module D: Générateur Documents", "Profilage illimité"],
            cta: "Démarrer en tant qu'Expert", href: "/register"
          },
          {
            id: "e-pro", name: "Expert Pro", icon: "💡", price: "220", priceTND: "699 DT", period: "/ 3 mois", highlight: true, popular: true,
            desc: "Les 4 modules IA — la suite complète pour consultants sérieux.",
            features: ["Modules A+B+C+D (tous)", "Profilage participants illimité", "20 documents générés/mois", "Dashboard analytics avancé", "Export PDF", "Analyse patterns projets"],
            notIncluded: ["Rapports marque blanche", "Onboarding dédié"],
            cta: "Passer Expert Pro", href: "/register"
          },
          {
            id: "e-elite", name: "Expert Élite", icon: "👑", price: "315", priceTND: "999 DT", period: "/ 3 mois", highlight: false,
            desc: "Illimité, marque blanche, accompagné — pour les pratiques conseil élites.",
            features: ["Tout de l'Expert Pro (illimité)", "Session onboarding dédiée (1h)", "Rapports marque blanche", "Support prioritaire 24h", "Dashboard client", "Templates personnalisés"],
            notIncluded: [],
            cta: "Rejoindre l'Élite", href: "/register"
          }
        ]
      }
    }
  },
  ar: {
    badge: "تسعير شفاف",
    title: "منصة واحدة. ثلاثة مسارات.",
    sub: "اختر الحساب الذي يناسب وضعك.",
    tabs: [
      { id: "student", label: "الطلاب والباحثون",        icon: "🎓" },
      { id: "pro",     label: "المحترفون",               icon: "👔" },
      { id: "expert",  label: "الخبراء والمستشارون",     icon: "🧠" },
    ],
    popular: "الأكثر شعبية",
    groups: {
      student: {
        headline: "مصمم للخريجين والباحثين عن عمل الذين يحتاجون ميزة تنافسية حقيقية.",
        plans: [
          {
            id: "s-free", name: "البداية", icon: "🌱", price: "مجاناً", priceTND: "0 DT", period: "", highlight: false,
            desc: "استكشف محرك التشخيص بدون أي التزام.",
            features: ["تحليل CV مبدئي بالـ AI", "معاينة جزئية (أول 3 فجوات)", "دخول المجتمع (الفايدة)", "اقتراح فئات ورش العمل"],
            notIncluded: ["تقرير SCI الكامل", "المقابلة التشخيصية AI", "توليد CV", "الورش والمحاكاة"],
            cta: "ابدأ مجاناً", href: "/register"
          },
          {
            id: "s-essential", name: "الأساسية", icon: "🎓", price: "15", priceTND: "49 DT", period: "/ شهر", highlight: false, popular: false,
            desc: "رحلة تشخيص كاملة — CV، مقابلة، تقرير SCI، وثائق مولّدة.",
            features: ["تشخيص AI كامل بـ 7 مراحل", "مقابلة تشخيصية بالـ AI", "تقرير SCI كامل", "CV + خطاب تقديم (مولّدان)", "حضور ورش العمل", "وصول المكتبة"],
            notIncluded: ["مهمة محاكاة", "جلسة خبير", "شهادة وخطاب توصية"],
            cta: "تفعيل الأساسية", href: "/register"
          },
          {
            id: "s-full", name: "الرحلة الكاملة", icon: "🚀", price: "47", priceTND: "149 DT", period: "/ 3 أشهر", highlight: true, popular: true,
            desc: "من خريج إلى محترف جاهز لسوق العمل في 3 أشهر.",
            features: ["كل ما في الأساسية", "مهمة محاكاة تنفيذية", "جلسة استشارة خبير واحدة", "التقرير الاستراتيجي الكامل", "خارطة طريق (18 شهراً)", "شهادة إتمام الورش", "خطاب توصية رسمي"],
            notIncluded: [],
            cta: "ابدأ الرحلة الكاملة", href: "/register"
          }
        ]
      },
      pro: {
        headline: "أدوات استراتيجية للمحترفين المستعدين للقفزة المهنية الكبرى.",
        plans: [
          {
            id: "p-exec", name: "التنفيذي", icon: "⚡", price: "79", priceTND: "249 DT", period: "/ شهر", highlight: false,
            desc: "تشخيص متقدم + خارطة طريق + تدقيق المنطق التنفيذي في مكان واحد.",
            features: ["تشخيص X-Ray متقدم (SWOT + Radar)", "خارطة طريق استراتيجية AI (18 شهراً)", "محاكاة تدقيق المنطق التنفيذي", "مركز تقييم الكفاءات (تفاعلي)", "لوحة تحكم وتحليلات"],
            notIncluded: ["ستوديو التسويق الذاتي", "حكم استراتيجي نهائي PDF", "جلسة خبير بشري"],
            cta: "تفعيل التنفيذي", href: "/register"
          },
          {
            id: "p-strategic", name: "الاستراتيجي", icon: "💼", price: "189", priceTND: "599 DT", period: "/ 3 أشهر", highlight: true, popular: true,
            desc: "التحول المهني الكامل — من التشخيص إلى السلطة في السوق.",
            features: ["كل ما في التنفيذي", "ستوديو التسويق الذاتي (CV + تقرير + تفاوض)", "الحكم الاستراتيجي النهائي (PDF)", "3 محاكاة لتدقيق المنطق التنفيذي", "جلسة خبير بشري (45 دقيقة)", "اختبار التوافق الوظيفي"],
            notIncluded: ["جلسات متعددة مع خبير بشري"],
            cta: "ابدأ الخطة الاستراتيجية", href: "/register"
          },
          {
            id: "p-authority", name: "السلطة", icon: "🏆", price: "315", priceTND: "999 DT", period: "/ 6 أشهر", highlight: false,
            desc: "دعم أول + سويت AI كامل لمن يقودون السوق.",
            features: ["كل ما في الاستراتيجي", "3 جلسات خبير بشري (45 دقيقة لكل)", "اختبارات توافق غير محدودة", "مراجعة CV من مستشار بشري", "دعم أولوية ووصول مباشر للمستشار", "فوترة للشركات"],
            notIncluded: [],
            cta: "امتلاك السلطة", href: "/register"
          }
        ]
      },
      expert: {
        headline: "ذكاء AI يجعل جلساتك الاستشارية أكثر دقة وتأثيراً.",
        plans: [
          {
            id: "e-starter", name: "خبير مبتدئ", icon: "🧠", price: "95", priceTND: "299 DT", period: "/ شهر", highlight: false,
            desc: "تحليل البورتفوليو + تحليل المشاركين لجلسات أذكى.",
            features: ["الموديل أ: تحليل Portfolio بالـ AI (معايير)", "الموديل ب: تحليل المشاركين (5/شهر)", "لوحة تحكم خبير أساسية", "تقرير تحضيري للجلسة"],
            notIncluded: ["الموديل ج: تحليل المشاريع", "الموديل د: مولّد الوثائق", "تحليل غير محدود"],
            cta: "ابدأ كخبير", href: "/register"
          },
          {
            id: "e-pro", name: "خبير محترف", icon: "💡", price: "220", priceTND: "699 DT", period: "/ 3 أشهر", highlight: true, popular: true,
            desc: "الموديولات الأربعة الكاملة للمستشارين الجادين.",
            features: ["الموديولات أ+ب+ج+د (الكل)", "تحليل مشاركين غير محدود", "20 وثيقة مولّدة/شهر", "لوحة تحليلات متقدمة", "تصدير PDF", "تحليل أنماط المشاريع"],
            notIncluded: ["تقارير بشعارك (White-label)", "جلسة Onboarding مخصصة"],
            cta: "الانتقال لخبير محترف", href: "/register"
          },
          {
            id: "e-elite", name: "خبير النخبة", icon: "👑", price: "315", priceTND: "999 DT", period: "/ 3 أشهر", highlight: false,
            desc: "غير محدود، بشعارك، مدعوم بالكامل للممارسات الاحترافية.",
            features: ["كل ما في خبير محترف (غير محدود)", "جلسة Onboarding مخصصة (ساعة)", "تقارير بشعارك (White-label)", "دعم أولوي 24 ساعة", "لوحة تحليلات للعملاء", "قوالب وثائق مخصصة"],
            notIncluded: [],
            cta: "الانضمام للنخبة", href: "/register"
          }
        ]
      }
    }
  }
};

// ─── FAQ ─────────────────────────────────────────────────────────────────────────
export const FAQ = {
  en: {
    badge: "FAQ",
    title: "Common Questions",
    items: [
      { q: "Is this a training platform?", a: "No. We are a strategic consulting firm. Everything we offer is advisory-based, expert-led, and built around your diagnostic data — not generic course content." },
      { q: "How are advisory groups formed?", a: "Our AI matches you with peers who share similar diagnostic gaps, experience levels, and professional challenges — ensuring every session is directly relevant to your situation." },
      { q: "How long does the diagnostic take?", a: "The full AI diagnostic takes approximately 15 minutes. Results are available immediately after completion." },
      { q: "Is my data private?", a: "Completely. Your diagnostic data is encrypted and never shared with third parties. You own your data." },
      { q: "Can I apply as an expert consultant?", a: "Yes. We have a dedicated Expert Account with 4 AI-powered modules to elevate your consulting work. Apply through the Expert path." },
    ]
  },
  fr: {
    badge: "FAQ",
    title: "Questions Fréquentes",
    items: [
      { q: "Est-ce une plateforme de formation ?", a: "Non. Nous sommes un cabinet de conseil stratégique. Tout est basé sur le conseil, dirigé par des experts et construit sur vos données — pas du contenu de cours générique." },
      { q: "Comment sont formés les groupes de conseil ?", a: "Notre IA vous associe à des pairs partageant les mêmes lacunes, niveaux et défis — garantissant que chaque minute de session est pertinente." },
      { q: "Combien de temps prend le diagnostic ?", a: "Le diagnostic IA complet prend environ 15 minutes. Les résultats sont disponibles immédiatement." },
      { q: "Mes données sont-elles privées ?", a: "Totalement. Vos données sont cryptées et ne sont jamais partagées. Vous restez propriétaire de vos données." },
      { q: "Puis-je postuler en tant qu'expert ?", a: "Oui. Nous avons un compte Expert dédié avec 4 modules IA pour élever votre travail. Postulez via le chemin Expert." },
    ]
  },
  ar: {
    badge: "الأسئلة الشائعة",
    title: "أسئلة تهمك",
    items: [
      { q: "هل هذه منصة تعليمية أو دورات تدريبية؟", a: "لا. نحن مكتب استشارات استراتيجية. كل ما نقدمه مبني على الاستشارة، يقوده خبراء، ومصمم بناءً على بيانات تشخيصك — وليس محتوى تعليمياً عاماً." },
      { q: "كيف يتم تكوين المجموعات الاستشارية؟", a: "يقوم الذكاء الاصطناعي بربطك بأقران يملكون نفس الفجوات المهارية ونفس مستوى الخبرة والتحديات — لضمان أن كل جلسة تخصك وتهمك مباشرة." },
      { q: "كم يستغرق التشخيص الذكي؟", a: "يستغرق التشخيص الكامل حوالي 15 دقيقة. وتظهر النتائج والتقارير فور الانتهاء." },
      { q: "هل بياناتي في أمان؟", a: "بالتأكيد. جميع بيانات التشخيص مشفرة ولا تتم مشاركتها مع أي طرف ثالث. أنت تملك بياناتك بالكامل." },
      { q: "هل يمكنني الانضمام كخبير أو مستشار؟", a: "نعم. لدينا حساب مخصص للخبراء يوفر 4 وحدات ذكاء اصطناعي لرفع جودة عملك الاستشاري. يمكنك التقديم عبر مسار الخبراء." },
    ]
  }
};

// ─── FINAL CTA ───────────────────────────────────────────────────────────────────
export const FINAL_CTA = {
  en: {
    title: "Your career is not waiting for the right moment.",
    sub: "The diagnostic takes 15 minutes. The clarity lasts a lifetime.",
    cta: "Start Free Diagnostic",
    note: "Free · No credit card · Instant results"
  },
  fr: {
    title: "Votre carrière n'attend pas le bon moment.",
    sub: "Le diagnostic prend 15 minutes. La clarté dure toute une vie.",
    cta: "Lancer le Diagnostic Gratuit",
    note: "Gratuit · Sans carte · Résultats instantanés"
  },
  ar: {
    title: "مسارك المهني لا ينتظر اللحظة المناسبة.",
    sub: "التشخيص يستغرق 15 دقيقة. والوضوح يدوم لمدى الحياة.",
    cta: "ابدأ التشخيص المجاني",
    note: "مجاناً · بدون بطاقة · نتائج فورية"
  }
};

// ─── FOOTER ─────────────────────────────────────────────────────────────────────
export const FOOTER = {
  en: { copyright: "MA-TRAINING-CONSULTING © 2026", links: ["Legal", "Privacy", "Contact"] },
  fr: { copyright: "MA-TRAINING-CONSULTING © 2026", links: ["Légal", "Confidentialité", "Contact"] },
  ar: { copyright: "MA-TRAINING-CONSULTING © 2026", links: ["القانوني", "الخصوصية", "اتصل بنا"] },
};
