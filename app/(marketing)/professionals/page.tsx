"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import {
    Scan,
    Play,
    Zap,
    BookOpen,
    Shield,
    Users,
    TrendingUp,
    MessageSquare,
    CheckCircle2,
    Crown,
    ArrowRight,
    Star,
    Award,
    FileText,
    Target,
    ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";
import ConsultingInquiryModal from "@/components/modals/ConsultingInquiryModal";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

// --- CONTENT DICTIONARY (LOCALIZED) ---
const CONTENT = {
    en: {
        hero: {
            badge: "Premium Service by MA-TRAINING-CONSULTING",
            title: "Expert Career Management",
            subtitle: "Benefit from the expertise of MA-TRAINING-CONSULTING. We combine AI technology with proven consulting methodologies to accelerate your career.",
            ctaPrimary: "Start Consulting Assessment",
            ctaSecondary: "Our Methodology"
        },
        psychology: {
            title: "Why Do Careers Stall?",
            desc: "Many professionals miss opportunities because they lack structured guidance. MA-TRAINING-CONSULTING provides the strategic roadmap you need to grow."
        },
        strategy: {
            title: "Our Consulting Approach",
            subtitle: "A professional service designed by industry experts",
            items: [
                { title: "Consultant Diagnosis", desc: "Detailed review of your profile based on consulting standards.", icon: Scan },
                { title: "Role Simulations", desc: "Practice real-world tasks designed by our experts.", icon: Play },
                { title: "Executive Workshops", desc: "Specialized sessions delivered by certified consultants.", icon: Users },
                { title: "AI Advisor", desc: "Instant guidance calibrated by our consulting team.", icon: Zap },
                { title: "Knowledge Library", desc: "Access to our firm's proven templates and guides.", icon: BookOpen },
                { title: "Tools & Resources", desc: "Practical assets used in top consulting projects.", icon: Shield },
                { title: "Expert Support", desc: "Direct validation from our senior consultants.", icon: MessageSquare },
                { title: "Career Roadmap", desc: "A clear plan developed with consulting precision.", icon: TrendingUp }
            ]
        },
        assets: {
            title: "Official Consulting Assets",
            subtitle: "Tangible proof of competence issued by MA-TRAINING-CONSULTING",
            items: [
                { title: "Capability Assessment", desc: "A formal rating of your professional readiness.", icon: Target },
                { title: "Consultant Recommendation", desc: "A professional endorsement letter from our firm.", icon: FileText },
                { title: "Performance Report", desc: "Detailed feedback on how you performed in simulations.", icon:  Award },
                { title: "Job Match Report", desc: "See exactly which roles fit your profile best.", icon: Users },
                { title: "Workshop Attestation", desc: "Verified proof of completed specialized sessions.", icon: Star },
                { title: "Market Insights", desc: "Data about your position in the current job market.", icon: Crown }
            ]
        },
        contract: {
            title: "General Service Agreement",
            subtitle: "Please review our general terms of engagement before proceeding",
            docTitle: "CONSULTING SERVICE AGREEMENT",
            parties: "Between: MA-TRAINING-CONSULTING (The Firm) And: The Client ({{client}})",
            clauses: [
                { title: "Article 1: Nature of Engagement", text: "This agreement constitutes a professional consulting mandate aimed at career development and strategic optimization." },
                { title: "Article 2: Fee Structure & Billing", text: "Final consulting fees are determined post-initial diagnosis based on the complexity of the roadmap and specific resources deployed." },
                { title: "Article 3: Data Confidentiality & Protection", text: "The Firm adheres to strict professional secrecy standards. No diagnostic reports will be shared with third parties without express written consent." },
                { title: "Article 4: Intellectual Property", text: "All frameworks, models, and tools provided are the exclusive property of MA-TRAINING-CONSULTING and are for personal professional use only." },
                { title: "Article 5: Payment Terms", text: "Fees are non-refundable as they represent the immediate allocation of expert resources and technology access upon engagement." },
                { title: "Article 6: Professional Conduct", text: "The Firm reserves the right to terminate engagement unilaterally in case of non-compliance with professional standards or terms of service." }
            ],
            cta: "Download & Sign (PDF)"
        },
        pricing: {
            title: "Professional Consulting Fees",
            subtitle: "Transparent pricing for expert services",
            plans: [
                {
                    name: "Initial Diagnosis",
                    price: "Free",
                    period: "forever",
                    desc: "Limited access suitable for quick audit.",
                    features: [
                        "Basic CV Review", 
                        "Pay-per-unit Workshops (Higher Rate)", 
                        "Basic Diagnosis (50% Accuracy)", 
                        "No Library Access",
                        "No Strategic Roadmap"
                    ],
                    cta: "Start Free Audit",
                    highlight: false
                },
                {
                    name: "Strategic Consulting",
                    price: "From €80",
                    period: "/ month",
                    desc: "Comprehensive consulting support.",
                    features: [
                        "Deep Consulting Diagnosis (100% Precision)", 
                        "Tailored Executive Workshops (As per diagnosis)", 
                        "Real-world Simulation Missions (As per diagnosis)", 
                        "Full Platform Access (As per diagnosis)", 
                        "Firm-Verified Documents",
                        "Senior Consultant Feedback"
                    ],
                    cta: "Start Program",
                    highlight: true
                }
            ]
        }
    },
    ar: {
        hero: {
            badge: "خدمة استشارية من مكتب MA-TRAINING-CONSULTING",
            title: "استشارات مهنية متخصصة",
            subtitle: "استفد من خبرة مكتب MA-TRAINING-CONSULTING. نحن نجمع بين التكنولوجيا والمنهجيات الاستشارية لتسريع مسارك المهني.",
            ctaPrimary: "ابدأ التقييم الاستشاري",
            ctaSecondary: "منهجية العمل"
        },
        psychology: {
            title: "لماذا يتوقف التطور المهني؟",
            desc: "يضيع الكثير من الفرص بسبب غياب التوجيه المنهجي. بصفتنا مكتب استشاري، نحن نقدم لك خارطة الطريق الاستراتيجية التي تحتاجها للنمو."
        },
        strategy: {
            title: "منهجيتنا الاستشارية",
            subtitle: "خدمة مهنية مصممة من قبل خبراء الصناعة",
            items: [
                { title: "تشخيص الخبراء", desc: "مراجعة دقيقة لملفك بناءً على معايير الاستشارات العالمية.", icon: Scan },
                { title: "محاكاة الوظائف", desc: "تدرب على مهام واقعية صممها خبراؤنا.", icon: Play },
                { title: "ورش عمل تنفيذية", desc: "جلسات متخصصة يقدمها مستشارون معتمدون.", icon: Users },
                { title: "المستشار الذكي", desc: "توجيه فوري تمت معايرته بواسطة فريقنا الاستشاري.", icon: Zap },
                { title: "مكتبة المعرفة", desc: "وصول لنماذج وأدلة المكتب الاستشاري المجربة.", icon: BookOpen },
                { title: "الأدوات والموارد", desc: "أصول عملية تُستخدم في كبرى المشاريع الاستشارية.", icon: Shield },
                { title: "دعم الخبراء", desc: "تحقق وتوجيه مباشر من كبار المستشارين لدينا.", icon: MessageSquare },
                { title: "خارطة الطريق", desc: "خطة واضحة تم تطويرها بدقة استشارية.", icon: TrendingUp }
            ]
        },
        assets: {
            title: "وثائق المكتب الرسمية",
            subtitle: "إثبات ملموس للكفاءة صادر عن مكتبنا الاستشاري",
            items: [
                { title: "تقييم الجاهزية", desc: "تقييم رسمي لمدى جاهزيتك المهنية.", icon: Target },
                { title: "توصية المكتب", desc: "خطاب تزكية احترافي صادر عن مكتبنا.", icon: FileText },
                { title: "تقرير الأداء", desc: "ملاحظات مفصلة حول أدائك في عمليات المحاكاة.", icon: Award },
                { title: "تقرير التوافق الوظيفي", desc: "اعرف بدقة الوظائف التي تناسب ملفك الشخصي.", icon: Users },
                { title: "إثبات ورشة عمل", desc: "وثيقة موثقة لاكتساب مهارات متخصصة.", icon: Star },
                { title: "رؤى السوق", desc: "بيانات حول موقعك في سوق العمل الحالي.", icon: Crown }
            ]
        },
        contract: {
            title: "اتفاقية الخدمة العامة",
            subtitle: "يرجى مراجعة الشروط العامة للتعاقد قبل البدء",
            docTitle: "اتفاقية خدمات استشارية",
            parties: "بين: مكتب MA-TRAINING-CONSULTING (الطرف الأول) و: العميل ({{client}})",
            clauses: [
                { title: "المادة الأولى: طبيعة الخدمة والتعاقد", text: "يعتبر هذا العقد اتفاقية خدمات استشارية مهنية تهدف إلى تطوير المسارات الوظيفية وتقديم الحلول الاستراتيجية." },
                { title: "المادة الثانية: بروتوكول الأتعاب والفوترة", text: "تخضع الخدمات لنظام أتعاب يتم الاتفاق عليه نهائياً عقب مرحلة التشخيص الأولي، بناءً على حجم التدخل الاستشاري المطلوب." },
                { title: "المادة الثالثة: سرية البيانات وحماية الخصوصية", text: "يلتزم المكتب بأعلى معايير السرية المهنية. لا يتم مشاركة أي تقارير تخص العميل مع جهات خارجية إلا بموافقة كتابية صريحة." },
                { title: "المادة الرابعة: الملكية الفكرية والمنهجيات", text: "جميع المنهجيات، النماذج، والوسائط المقدمة خلال البرنامج هي ملكية حصرية لمكتب MA-TRAINING-CONSULTING ويُمنع تداولها." },
                { title: "المادة الخامسة: شروط الدفع والتنفيذ", text: "تعتبر المبالغ المدفوعة نهائية وغير قابلة للاسترداد نظراً للتخصيص الفوري للموارد البشرية والتقنية والبدء في التنفيذ." },
                { title: "المادة السادسة: الالتزام الأخلاقي والسلوك المهني", text: "يحتفظ المكتب بحق إنهاء التعاقد من طرف واحد في حال ثبوت مخالفات تمس بنزاهة العملية الاستشارية أو عدم الالتزام بالشروط." }
            ],
            cta: "تحميل العقد وتوقيعه (PDF)"
        },
        pricing: {
            title: "أتعاب الاستشارات",
            subtitle: "أسعار شفافة لخدمات الخبراء",
            plans: [
                {
                    name: "التشخيص الأولي",
                    price: "مجاناً",
                    period: "جس نبض",
                    desc: "وصول محدود لمعاينة الخدمة.",
                    features: [
                        "مراجعة أساسية للسيرة الذاتية", 
                        "شراء الورش بالقطعة (سعر أعلى)", 
                        "تشخيص أولي (دقة 50% فقط)", 
                        "لا يوجد وصول للمكتبة أو الوثائق",
                        "لا توجد خارطة طريق استراتيجية"
                    ],
                    cta: "ابدأ التدقيق المجاني",
                    highlight: false
                },
                {
                    name: "الاستشارات الاستراتيجية",
                    price: "ابتداءً من €80",
                    period: "/ شهرياً",
                    desc: "دعم استشاري شامل.",
                    features: [
                        "تشخيص استشاري عميق (دقة 100%)", 
                        "ورش عمل تنفيذية (حسب التشخيص)", 
                        "مهمات محاكاة واقعية (حسب التشخيص)", 
                        "وصول شامل للمنصة (حسب التشخيص)", 
                        "وثائق موثقة من المكتب", 
                        "ملاحظات كبار المستشارين"
                    ],
                    cta: "ابدأ البرنامج",
                    highlight: true
                }
            ]
        }
    },
    fr: {
        hero: {
            badge: "Service Premium par MA-TRAINING-CONSULTING",
            title: "Conseil de Carrière Spécialisé",
            subtitle: "Bénéficiez de l'expertise de MA-TRAINING-CONSULTING. Nous combinons la technologie IA avec des méthodologies de conseil éprouvées pour accélérer votre carrière.",
            ctaPrimary: "Démarrer l'Évaluation",
            ctaSecondary: "Notre Méthodologie"
        },
        psychology: {
            title: "Pourquoi les carrières stagnent-elles ?",
            desc: "De nombreux professionnels manquent d'opportunités faute d'orientation structurée. Nous vous offrons la feuille de route stratégique nécessaire à votre croissance."
        },
        strategy: {
            title: "Notre Approche de Conseil",
            subtitle: "Un service professionnel conçu par des experts du secteur",
            items: [
                { title: "Diagnostic Consultant", desc: "Examen détaillé de votre profil basé sur les standards du conseil.", icon: Scan },
                { title: "Simulations de Rôle", desc: "Pratiquez des tâches réelles conçues par nos experts.", icon: Play },
                { title: "Workshops Exécutifs", desc: "Sessions spécialisées dispensées par des consultants certifiés.", icon: Users },
                { title: "Conseiller IA", desc: "Guidance instantanée calibrée par notre équipe de conseil.", icon: Zap },
                { title: "Bibliothèque de Savoir", desc: "Accès aux modèles et guides éprouvés de notre cabinet.", icon: BookOpen },
                { title: "Outils & Ressources", desc: "Actifs pratiques utilisés dans les plus grands projets de conseil.", icon: Shield },
                { title: "Support d'Experts", desc: "Validation directe de nos consultants seniors.", icon: MessageSquare },
                { title: "Feuille de Route", desc: "Un plan clair développé avec une précision de conseil.", icon: TrendingUp }
            ]
        },
        assets: {
            title: "Actifs Officiels du Cabinet",
            subtitle: "Preuves tangibles de compétence délivrées par MA-TRAINING-CONSULTING",
            items: [
                { title: "Évaluation de Capacité", desc: "Une évaluation formelle de votre préparation professionnelle.", icon: Target },
                { title: "Recommandation du Cabinet", desc: "Une lettre de recommandation professionnelle de notre cabinet.", icon: FileText },
                { title: "Rapport de Performance", desc: "Commentaires détaillés sur votre performance lors des simulations.", icon: Award },
                { title: "Rapport d'Adéquation", desc: "Découvrez exactement quels rôles correspondent le mieux à votre profil.", icon: Users },
                { title: "Attestation de Workshop", desc: "Preuve vérifiée des sessions spécialisées terminées.", icon: Star },
                { title: "Aperçus du Marché", desc: "Données sur votre position sur le marché du travail actuel.", icon: Crown }
            ]
        },
        contract: {
            title: "Accord de Service Général",
            subtitle: "Veuillez consulter nos conditions générales d'engagement avant de continuer",
            docTitle: "ACCORD DE SERVICE DE CONSEIL",
            parties: "Entre : MA-TRAINING-CONSULTING (Le Cabinet) Et : Le Client ({{client}})",
            clauses: [
                { title: "Article 1 : Nature de l'Engagement", text: "Cet accord constitue un mandat de conseil professionnel dédié au développement de carrière et à l'optimisation stratégique." },
                { title: "Article 2 : Structure des Honoraires", text: "Les honoraires finaux sont fixés après le diagnostic initial, selon la complexité de la feuille de route et les ressources déployées." },
                { title: "Article 3 : Confidentialité des Données", text: "Le Cabinet s'engage au secret professionnel strict. Aucun rapport de diagnostic ne sera partagé sans un consentement écrit explicite." },
                { title: "Article 4 : Propriété Intellectuelle", text: "Tous les outils, modèles et cadres fournis sont la propriété exclusive de MA-TRAINING-CONSULTING et sont destinés à un usage personnel." },
                { title: "Article 5 : Conditions de Règlement", text: "Les paiements sont définitifs et non remboursables en raison de l'allocation immédiate des ressources expertes et techniques." },
                { title: "Article 6 : Éthique & Résiliation", text: "Le Cabinet se réserve le droit de résilier le mandat unilatéralement en cas de non-respect des normes professionnelles ou des conditions." }
            ],
            cta: "Télécharger & Signer (PDF)"
        },
        pricing: {
            title: "Honoraires de Conseil Professionnel",
            subtitle: "Tarification transparente pour des services d'experts",
            plans: [
                {
                    name: "Diagnostic Initial",
                    price: "Gratuit",
                    period: "à vie",
                    desc: "Accès limité adapté pour un audit rapide.",
                    features: [
                        "Examen de base du CV", 
                        "Workshops à l'unité (Tarif supérieur)", 
                        "Diagnostic de base (Précision 50%)", 
                        "Pas d'accès à la bibliothèque",
                        "Pas de feuille de route stratégique"
                    ],
                    cta: "Démarrer l'Audit Gratuit",
                    highlight: false
                },
                {
                    name: "Conseil Stratégique",
                    price: "À partir de 80€",
                    period: "/ mois",
                    desc: "Accompagnement complet en conseil.",
                    features: [
                        "Diagnostic approfondi (Précision 100%)", 
                        "Workshops exécutifs sur mesure", 
                        "Missions de simulation réelles", 
                        "Accès complet à la plateforme", 
                        "Documents vérifiés par le Cabinet",
                        "Retours de consultants seniors"
                    ],
                    cta: "Démarrer le Programme",
                    highlight: true
                }
            ]
        }
    }
};

// --- Helper Components ---

function SpotlightCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    return (
        <div
            className={cn(
                "group relative border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden",
                className
            )}
        >
            <div className="relative h-full">{children}</div>
        </div>
    );
}

export default function ProfessionalsPage() {
    const { language, dir } = useLanguage();
    const t = CONTENT[language as keyof typeof CONTENT] || CONTENT.en;
    const containerRef = useRef<HTMLDivElement>(null);
    const contractRef = useRef<HTMLDivElement>(null);
    const [isConsultingFormOpen, setIsConsultingFormOpen] = useState(false);
    const [clientName, setClientName] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownloadContract = async () => {
        if (!contractRef.current) return;
        setIsGenerating(true);

        try {
            const element = contractRef.current;
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#ffffff",
                logging: false,
                onclone: (clonedDoc) => {
                    const el = clonedDoc.body.querySelector('[data-contract-container="true"]') as HTMLElement;
                    if (el) {
                        el.style.boxShadow = 'none';
                        el.style.border = '1px solid #e2e8f0';
                        el.style.backgroundColor = '#ffffff';
                        el.style.color = '#000000';
                        
                        const allNodes = Array.from(el.querySelectorAll('*')) as HTMLElement[];
                        allNodes.forEach((node) => {
                            node.style.transition = 'none';
                            node.style.animation = 'none';
                            node.style.boxShadow = 'none';
                            node.style.textShadow = 'none';
                            
                            // Force-replace any color that looks like a modern CSS function
                            const computedStyle = window.getComputedStyle(node);
                            const color = computedStyle.color;
                            const bg = computedStyle.backgroundColor;
                            
                            if (color.includes('oklch') || color.includes('lab')) node.style.color = '#000000';
                            if (bg.includes('oklch') || bg.includes('lab')) node.style.backgroundColor = 'transparent';
                            
                            // Specific check for border colors which often use these functions
                            const bc = computedStyle.borderColor;
                            if (bc.includes('oklch') || bc.includes('lab')) node.style.borderColor = '#e2e8f0';
                        });
                    }
                }
            });
            
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            const imgProps = pdf.getImageProperties(imgData);
            const ratio = imgProps.width / imgProps.height;
            const pageRatio = pdfWidth / pdfHeight;
            
            let finalWidth, finalHeight;
            
            // Constrain by height to ensure the bottom part is never cut off
            if (ratio > pageRatio) {
                // Width limited
                finalWidth = pdfWidth - 20; // 10mm margins
                finalHeight = finalWidth / ratio;
            } else {
                // Height limited
                finalHeight = pdfHeight - 20; // 10mm margins
                finalWidth = finalHeight * ratio;
            }
            
            // Center horizontally
            const xOffset = (pdfWidth - finalWidth) / 2;
            const yOffset = 10; // 10mm top margin
            
            pdf.addImage(imgData, "PNG", xOffset, yOffset, finalWidth, finalHeight);
            pdf.save(`MA-CONSULTING-CONTRACT-${clientName || "CLIENT"}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div 
            className={cn(
                "min-h-screen bg-[#FAFAFA] dark:bg-[#020202] overflow-x-hidden selection:bg-blue-500/30",
                language === 'ar' ? 'font-arabic' : 'font-sans'
            )} 
            dir={dir} 
            ref={containerRef}
        >
            {/* AMBIENT BACKGROUND */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[24px_24px]"></div>
                <div className="absolute left-0 right-0 top-[-10%] z-[-1] m-auto h-[500px] w-[500px] rounded-full bg-blue-500/10 dark:bg-blue-900/10 opacity-50 blur-[100px]"></div>
            </div>

            {/* --- HERO SECTION --- */}
            <section className="relative min-h-[90vh] flex flex-col justify-center px-6 pt-32 pb-20 overflow-hidden">
                <div className="container mx-auto max-w-6xl relative z-10 text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md mb-8 shadow-sm"
                    >
                        <Crown className="w-4 h-4 text-blue-600" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300">
                            {t.hero.badge}
                        </span>
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium leading-[0.95] tracking-tight mb-8 text-slate-900 dark:text-white"
                    >
                        {t.hero.title}
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 1 }}
                        className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto mb-12 font-light leading-relaxed"
                    >
                        {t.hero.subtitle}
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-xl shadow-blue-900/10">
                            {t.hero.ctaPrimary}
                        </Link>
                        <a href="#assets" className="w-full sm:w-auto px-8 py-4 bg-transparent border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                            {t.hero.ctaSecondary}
                        </a>
                    </motion.div>
                </div>
            </section>

             {/* --- PSYCHOLOGY SECTION --- */}
             <section className="py-20 bg-slate-900 dark:bg-black text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
                    <h2 className="text-3xl md:text-5xl font-serif mb-6">{t.psychology.title}</h2>
                    <p className="text-xl text-slate-400 leading-relaxed font-light">{t.psychology.desc}</p>
                </div>
            </section>

            {/* --- STRATEGY GRID (8 POINTS) --- */}
            <section className="py-32 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="text-center mb-20">
                        <span className="text-blue-600 font-bold text-xs uppercase tracking-[0.2em]">{t.strategy.title}</span>
                        <h2 className="text-4xl md:text-5xl font-serif text-slate-900 dark:text-white mt-4">{t.strategy.subtitle}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {t.strategy.items.map((item, idx) => (
                            <SpotlightCard key={idx} className="rounded-2xl p-8 min-h-[280px] flex flex-col items-start hover:border-blue-500/40 transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white mb-6">
                                    <item.icon size={24} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                    {item.desc}
                                </p>
                            </SpotlightCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- OFFICIAL ASSETS (6 ITEMS) --- */}
            <section id="assets" className="py-32 px-6 bg-slate-50 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                        <div className="max-w-2xl">
                            <span className="text-amber-600 font-bold text-xs uppercase tracking-[0.2em]">{t.assets.title}</span>
                            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 dark:text-white mt-4">{t.assets.subtitle}</h2>
                        </div>
                        <div className="hidden md:block">
                            <ShieldCheck size={48} className="text-slate-200 dark:text-slate-800" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {t.assets.items.map((item, idx) => (
                            <div key={idx} className="group relative bg-white dark:bg-slate-950 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-amber-500/5 transition-all duration-500 hover:-translate-y-1">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <item.icon size={64} />
                                </div>
                                <div className="relative z-10">
                                    <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center mb-6 text-sm font-bold">
                                        {idx + 1}
                                    </div>
                                    <h3 className="text-2xl font-serif text-slate-900 dark:text-white mb-4 group-hover:text-amber-600 transition-colors">{item.title}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CONTRACT / MANDATE SECTION --- */}
            <section className="py-24 px-6 bg-slate-100 dark:bg-slate-900 overflow-hidden">
                <div className="container mx-auto max-w-4xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-serif text-slate-900 dark:text-white mb-4">{t.contract.title}</h2>
                        <p className="text-slate-500 font-light">{t.contract.subtitle}</p>
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                        {language === 'ar' ? 'الاسم الكامل للعميل' : language === 'fr' ? 'Nom complet du client' : 'Client Full Name'}
                                    </label>
                                    <input 
                                        type="text" 
                                        value={clientName}
                                        onChange={(e) => setClientName(e.target.value)}
                                        placeholder={language === 'ar' ? 'أدخل اسمك هنا' : language === 'fr' ? 'Entrez votre nom' : 'Enter your name'}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                        {language === 'ar' ? 'التاريخ' : language === 'fr' ? 'Date' : 'Date'}
                                    </label>
                                    <div className="px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-500">
                                        {new Date().toLocaleDateString(language === 'ar' ? 'ar-TN' : 'fr-FR')}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div 
                            ref={contractRef}
                            data-contract-container="true"
                            className="relative p-8 md:p-16 mx-auto max-w-3xl"
                            style={{ 
                                minHeight: '1000px', 
                                backgroundColor: '#ffffff', 
                                color: '#000000',
                                border: '1px solid #e2e8f0',
                                borderRadius: '2px',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' 
                            }}
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 rotate-45 transform origin-bottom-left z-0" style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}></div>

                            <div className="relative z-10 space-y-10 font-serif">
                                <div className="text-center pb-10" style={{ borderBottom: '2px solid #0f172a' }}>
                                    <div className="text-xl font-bold mb-2 tracking-[0.3em]" style={{ color: '#0f172a' }}>MA-TRAINING-CONSULTING</div>
                                    <h3 className="text-3xl font-black uppercase tracking-widest mb-4" style={{ color: '#020617' }}>{t.contract.docTitle}</h3>
                                    <p className="text-[10px] font-sans uppercase tracking-[0.4em]" style={{ color: '#64748b' }}>Ref: MA-TC-2026-HQ / AUTH-REQUIRED</p>
                                </div>

                                <div className="p-8 rounded-lg text-sm font-bold font-sans leading-relaxed text-center" style={{ backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', color: '#1e293b' }}>
                                    {t.contract.parties.replace('{{client}}', clientName || '....................')}
                                </div>

                                <div className="space-y-8 px-4">
                                    {t.contract.clauses.map((clause: {title: string, text: string}, idx: number) => (
                                        <div key={idx} className="space-y-2">
                                            <h4 className="font-black text-base uppercase font-sans pl-4" style={{ color: '#020617', borderLeft: '4px solid #0f172a' }}>{clause.title}</h4>
                                            <p className="text-sm leading-relaxed font-sans text-justify" style={{ color: '#334155' }}>{clause.text}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-16 grid grid-cols-2 gap-12" style={{ borderTop: '2px solid #0f172a' }}>
                                    <div className="space-y-6">
                                        <div className="h-24 flex items-center justify-center" style={{ borderBottom: '1px solid #94a3b8', backgroundColor: '#fdfdfd' }}>
                                            <div className="text-xl font-serif italic" style={{ color: '#94a3b8', opacity: 0.5 }}>OFFICIAL STAMP REQUIRED</div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase font-black font-sans tracking-widest" style={{ color: '#020617' }}>MA-TRAINING-CONSULTING</p>
                                            <p className="text-[8px] font-sans tracking-tight" style={{ color: '#94a3b8' }}>Verified Corporate Entity • 2026</p>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="h-24 flex flex-col items-center justify-center p-4 relative" style={{ border: '1px solid #d1d5db', borderStyle: 'dashed', backgroundColor: '#f0f9ff', borderRadius: '4px' }}>
                                            {clientName ? (
                                                <>
                                                    <div className="absolute top-0 right-0 p-1" style={{ color: '#1d4ed8' }}>
                                                        <span className="text-[10px] font-bold">✓ VERIFIED</span>
                                                    </div>
                                                    <span className="text-2xl font-serif italic animate-in fade-in duration-700" style={{ color: '#1e3a8a', fontFamily: 'cursive' }}>
                                                        {clientName}
                                                    </span>
                                                    <div className="mt-2 flex flex-col items-center">
                                                        <div className="text-[7px] font-mono font-bold uppercase tracking-tighter" style={{ color: '#3b82f6' }}>
                                                            Digitally Authorized • ID: {Math.random().toString(36).substring(2, 9).toUpperCase()}
                                                        </div>
                                                        <div className="text-[6px] mt-0.5" style={{ color: '#94a3b8' }}>
                                                            TS: {new Date().toISOString()} • IP: Verified
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-[10px] font-sans italic" style={{ color: '#cbd5e1' }}>SIGNATURE AREA</div>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase font-black font-sans tracking-widest" style={{ color: '#020617' }}>Client Signature & Legal Consent</p>
                                            <p className="text-[8px] font-sans tracking-tight" style={{ color: '#94a3b8' }}>Acceptance of Consulting Mandate Conditions</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-20 text-center text-[8px] font-sans uppercase tracking-widest" style={{ color: '#94a3b8' }}>
                                    Generated via Secure Protocol • Verified Digital Asset • {new Date().toISOString()}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-4">
                            <button 
                                onClick={handleDownloadContract}
                                disabled={!clientName || isGenerating}
                                className={cn(
                                    "w-full max-w-md px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-sm uppercase tracking-[0.2em] transition-all shadow-2xl flex items-center justify-center gap-3",
                                    (!clientName || isGenerating) ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95"
                                )}
                            >
                                {isGenerating ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <FileText size={18} />
                                )}
                                {isGenerating ? (language === 'ar' ? 'جاري التحميل...' : 'Downloading...') : t.contract.cta}
                            </button>
                            {!clientName && (
                                <p className="text-xs text-amber-600 font-bold animate-pulse">
                                    {language === 'ar' ? 'يرجى إدخال اسمك لتفعيل العقد والتحميل' : 'Please enter your name to activate the contract and download'}
                                </p>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- PRICING SECTION --- */}
            <section className="py-32 px-6 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="container mx-auto max-w-5xl relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-serif text-slate-900 dark:text-white mb-6">{t.pricing.title}</h2>
                        <p className="text-xl text-slate-500 font-light">{t.pricing.subtitle}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        {t.pricing.plans.map((plan, idx) => (
                            <div 
                                key={idx} 
                                className={cn(
                                    "relative rounded-[2.5rem] p-10 md:p-14 border transition-all duration-500",
                                    plan.highlight 
                                        ? "bg-slate-900 dark:bg-white text-white dark:text-black border-slate-900 dark:border-white shadow-2xl scale-105 z-10" 
                                        : "bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 hover:border-slate-300"
                                )}
                            >
                                {plan.highlight && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
                                        Recommended
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                <p className={cn("text-sm font-medium mb-8", plan.highlight ? "text-slate-400 dark:text-slate-500" : "text-slate-500")}>
                                    {plan.desc}
                                </p>
                                <div className="flex items-baseline gap-1 mb-10">
                                    <span className="text-5xl font-serif">{plan.price}</span>
                                    <span className={cn("text-sm", plan.highlight ? "text-slate-400" : "text-slate-400")}>{plan.period}</span>
                                </div>
                                <ul className="space-y-4 mb-12">
                                    {plan.features.map((feat, fIdx) => (
                                        <li key={fIdx} className="flex items-center gap-3 text-sm font-medium">
                                            <CheckCircle2 size={16} className={plan.highlight ? "text-blue-400 dark:text-blue-600" : "text-blue-600"} />
                                            {feat}
                                        </li>
                                    ))}
                                </ul>
                                {plan.highlight ? (
                                    <button 
                                        onClick={() => setIsConsultingFormOpen(true)}
                                        className="w-full block text-center py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all bg-white dark:bg-black text-black dark:text-white hover:bg-slate-200 dark:hover:bg-slate-800 shadow-lg"
                                    >
                                        {plan.cta}
                                    </button>
                                ) : (
                                    <Link 
                                        href="/register" 
                                        className={cn(
                                            "w-full block text-center py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all",
                                            "bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-800"
                                        )}
                                    >
                                        {plan.cta}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

             {/* --- FINAL CTA --- */}
             <section className="py-24 bg-blue-600 text-white text-center">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h2 className="text-4xl md:text-5xl font-serif mb-8">
                        {language === 'ar' ? 'هل أنت مستعد لقيادة مستقبلك؟' : 'Ready to command your future?'}
                    </h2>
                    <Link href="/register" className="inline-flex items-center gap-2 px-10 py-5 bg-white text-blue-600 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-blue-50 transition-colors shadow-xl">
                        {language === 'ar' ? 'ابدأ الآن' : 'Get Started Now'} <ArrowRight size={16} />
                    </Link>
                </div>
            </section>

            <ConsultingInquiryModal 
                isOpen={isConsultingFormOpen}
                onClose={() => setIsConsultingFormOpen(false)}
                redirectToDashboard={true}
            />
        </div>
    );
}
