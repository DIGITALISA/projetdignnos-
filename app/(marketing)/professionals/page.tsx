"use client";

import { motion, useMotionTemplate, useMotionValue, AnimatePresence } from "framer-motion";
import React, { useRef, useState } from "react";
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
    Loader2,
    Star,
    Award,
    FileText,
    Target,
    ShieldCheck,
    X
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";

// --- CONTENT DICTIONARY (LOCALIZED) ---
const CONTENT = {
    en: {
        hero: {
            badge: "Premium Service by MA-TRAINING-CONSULTING",
            title: "Expert Career Management.",
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
            subtitle: "A professional service designed by industry experts.",
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
            subtitle: "Tangible proof of competence issued by MA-TRAINING-CONSULTING.",
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
            subtitle: "Please review our general terms of engagement before proceeding.",
            docTitle: "CONSULTING SERVICE AGREEMENT",
            parties: "Between: MA-TRAINING-CONSULTING (The Firm) And: The Client (You)",
            clauses: [
                { title: "1. Consultant Fee Structure", text: "This is a paid consulting service. Final fees are determined post-diagnosis based on the specific roadmap and services required." },
                { title: "2. Intellectual Property", text: "All methodologies, tools, and content remain the exclusive property of the Firm. Unauthorized sharing or reproduction is strictly prohibited." },
                { title: "3. Data Privacy & Consent", text: "Your data is strictly confidential. If a company requests an objective report comparing role requirements with your diagnosis, we will ONLY share it with your explicit consent." },
                { title: "4. Commitment & Refunds", text: "Payments are non-refundable. The Firm reserves the right to terminate the agreement without refund in cases of misconduct or non-compliance." }
            ],
            cta: "Download & Sign Agreement"
        },
        pricing: {
            title: "Professional Consulting Fees",
            subtitle: "Transparent pricing for expert services.",
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
            title: "استشارات مهنية متخصصة.",
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
            subtitle: "خدمة مهنية مصممة من قبل خبراء الصناعة.",
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
            subtitle: "إثبات ملموس للكفاءة صادر عن مكتبنا الاستشاري.",
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
            subtitle: "يرجى مراجعة الشروط العامة للتعاقد قبل البدء.",
            docTitle: "اتفاقية خدمات استشارية",
            parties: "بين: مكتب MA-TRAINING-CONSULTING (الطرف الأول) و: العميل (أنت)",
            clauses: [
                { title: "1. طبيعة الأتعاب", text: "هذه خدمة استشارية مدفوعة. يتم تحديد الأتعاب النهائية بعد مرحلة التشخيص بناءً على الخدمات المطلوبة وخارطة الطريق." },
                { title: "2. الملكية الفكرية", text: "جميع المنهجيات والأدوات هي ملكية حصرية للمكتب. يُمنع منعاً باتاً نشرها أو استخدامها تجارياً دون إذن." },
                { title: "3. سرية البيانات والموافقة", text: "بياناتك تظل سرية تماماً. إذا طلبت شركة تقريراً موضوعياً للمقارنة بين متطلبات الوظيفة وتشخيصك، لن نقوم بمشاركته إلا بعد الحصول على موافقتك الصريحة." },
                { title: "4. الدفع والالتزام", text: "المبالغ المدفوعة غير قابلة للاسترداد. يحتفظ المكتب بحق إلغاء العقد دون تعويض في حال عدم الاحترام أو مخالفة الشروط." }
            ],
            cta: "تحميل العقد وتوقيعه"
        },
        pricing: {
            title: "أتعاب الاستشارات",
            subtitle: "أسعار شفافة لخدمات الخبراء.",
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
    }
};

// --- Helper Components ---

function SpotlightCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <div
            className={cn(
                "group relative border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden",
                className
            )}
            onMouseMove={handleMouseMove}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(59, 130, 246, 0.1),
              transparent 80%
            )
          `,
                }}
            />
            <div className="relative h-full">{children}</div>
        </div>
    );
}

export default function ProfessionalsPage() {
    const { language, dir } = useLanguage();
    const t = CONTENT[language === 'ar' ? 'ar' : 'en'];
    const containerRef = useRef(null);
    const [isConsultingFormOpen, setIsConsultingFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: ''
    });

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const res = await fetch('/api/consulting-inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setSubmitStatus('success');
                setTimeout(() => {
                    setIsConsultingFormOpen(false);
                    setSubmitStatus('idle');
                    setFormData({ fullName: '', email: '', phone: '' });
                }, 3000);
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error("Submission error:", error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
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
                        className="relative bg-white dark:bg-slate-950 p-8 md:p-12 shadow-2xl rounded-sm border border-slate-200 dark:border-slate-800 mx-auto max-w-3xl"
                    >
                        {/* Paper Effect */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-slate-50 dark:bg-slate-900 -mr-10 -mt-10 rotate-45 transform origin-bottom-left shadow-lg z-0"></div>

                        <div className="relative z-10 space-y-8 font-serif">
                            <div className="text-center border-b border-slate-200 dark:border-slate-800 pb-8">
                                <h3 className="text-2xl font-bold uppercase tracking-widest text-slate-900 dark:text-white mb-2">{t.contract.docTitle}</h3>
                                <p className="text-xs text-slate-400 font-sans uppercase tracking-[0.2em]">Ref: MA-TC-2026-HQ</p>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 font-sans leading-relaxed text-center">
                                {t.contract.parties}
                            </div>

                            <div className="space-y-6">
                                {t.contract.clauses.map((clause: {title: string, text: string}, idx: number) => (
                                    <div key={idx}>
                                        <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase mb-2 font-sans">{clause.title}</h4>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-sans">{clause.text}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-between items-end">
                                <div className="space-y-2">
                                    <div className="h-12 w-32 border-b border-slate-300 dark:border-slate-700 mb-2"></div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400 font-sans">MA-TRAINING-CONSULTING</p>
                                </div>
                                <div className="space-y-2 text-right">
                                    <div className="h-12 w-32 border-b border-slate-300 dark:border-slate-700 mb-2 border-dashed"></div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400 font-sans">Client Signature</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 text-center">
                            <button className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-lg">
                                {t.contract.cta}
                            </button>
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

            {/* --- CONSULTING INQUIRY FORM MODAL --- */}
            <AnimatePresence>
                {isConsultingFormOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsConsultingFormOpen(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative"
                        >
                            <button 
                                onClick={() => setIsConsultingFormOpen(false)}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            >
                                <X size={24} />
                            </button>
                            
                            <div className="p-8">
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-serif text-slate-900 dark:text-white mb-2">
                                        {language === 'ar' ? 'طلب استشارة استراتيجية' : 'Request Strategic Consulting'}
                                    </h3>
                                    <p className="text-slate-500 text-sm">
                                        {language === 'ar' 
                                            ? 'املأ الاستمارة وسيتواصل معك أحد كبار مستشارينا.' 
                                            : 'Fill the form and a senior consultant will execute your request.'}
                                    </p>
                                </div>

                                <form className="space-y-4" onSubmit={handleFormSubmit}>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                                            {language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                                        </label>
                                        <input 
                                            type="text" 
                                            required
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-slate-900 dark:text-white" 
                                            placeholder={language === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                                            {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                                        </label>
                                        <input 
                                            type="email" 
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-slate-900 dark:text-white" 
                                            placeholder="example@mail.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                                            {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                                        </label>
                                        <input 
                                            type="tel" 
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-slate-900 dark:text-white" 
                                            placeholder="+123 456 789"
                                        />
                                    </div>
                                    
                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting || submitStatus === 'success'}
                                        className={cn(
                                            "w-full py-4 font-bold rounded-lg shadow-lg transition-all text-sm uppercase tracking-widest mt-6 flex items-center justify-center gap-2",
                                            submitStatus === 'success' 
                                                ? "bg-emerald-500 text-white" 
                                                : "bg-amber-500 hover:bg-amber-600 text-white hover:shadow-amber-500/20"
                                        )}
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="animate-spin w-5 h-5" />
                                        ) : submitStatus === 'success' ? (
                                            <>
                                                <CheckCircle2 size={18} />
                                                {language === 'ar' ? 'تم الإرسال بنجاح' : 'Sent Successfully'}
                                            </>
                                        ) : (
                                            language === 'ar' ? 'إرسال الطلب' : 'Submit Request'
                                        )}
                                    </button>

                                    {submitStatus === 'error' && (
                                        <p className="text-red-500 text-xs text-center mt-2 font-bold">
                                            {language === 'ar' ? 'حدث خطأ، يرجى المحاولة مرة أخرى.' : 'An error occurred, please try again.'}
                                        </p>
                                    )}
                                </form>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-950 px-8 py-4 text-center border-t border-slate-100 dark:border-slate-800">
                                <p className="text-xs text-slate-400">
                                    {language === 'ar' ? 'بياناتك محمية بموجب اتفاقية السرية.' : 'Your data is protected under our NDA.'}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
