"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowRight, Lightbulb,
    Globe, Zap, Target,
    Clock, ArrowLeft,
    Gavel, Filter, ShoppingCart
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";
import { translations } from "@/lib/i18n/translations";

type Translations = typeof translations.en;

// Types for the project structure
interface Project {
    id: string;
    title: { [key: string]: string };
    idea: { [key: string]: string };
    strategy: { [key: string]: string };
    extraServices: { [key: string]: string[] };
    price: number;
    currentBid?: number;
    auctionStartedAt?: string | null;
    demoUrl: string;
    image: string;
    category: string;
    tier: "basic" | "pro"; // Basic = Fixed Price, Pro = Auction
}

const PROJECTS: Project[] = [
    {
        id: "basic-landing-1",
        title: {
            en: "Minimalist Portfolio Template",
            fr: "Template Portfolio Minimaliste",
            ar: "قالب معرض أعمال بسيط"
        },
        idea: {
            en: "High-performance personal branding site with optimized speed and SEO structure.",
            fr: "Site de branding personnel haute performance avec vitesse et SEO optimisés.",
            ar: "موقع براندينغ شخصي عالي الأداء مع سرعة فائقة وهيكلية سيو محسنة."
        },
        strategy: {
            en: "Focus on conversion-oriented UI and mobile-first experience.",
            fr: "Focus sur une UI orientée conversion et une expérience mobile-first.",
            ar: "التركيز على واجهة مستخدم موجهة لتحقيق التحويلات وتجربة متوافقة مع الهاتف."
        },
        extraServices: {
            en: ["Custom Domain Setup", "Analytics Integration"],
            fr: ["Config Domaine Personnalisé", "Intégration Analytics"],
            ar: ["إعداد دومين مخصص", "ربط التحليلات"]
        },
        price: 49,
        demoUrl: "https://portfolio-basic.example.com",
        image: "/images/digitalization/retail-demo.png",
        category: "Creative",
        tier: "basic"
    },
    {
        id: "edtech-premium",
        title: {
            en: "Executive AI Academy",
            fr: "Académie IA pour Cadres",
            ar: "أكاديمية الذكاء الاصطناعي التنفيذية"
        },
        idea: {
            en: "A fully automated LMS designed for high-end corporate training with AI-driven content adaptation.",
            fr: "Un LMS entièrement automatisé conçu pour la formation en entreprise haut de gamme avec adaptation du contenu par l'IA.",
            ar: "نظام إدارة تعلم مؤتمت بالكامل مصمم لتدريب الشركات رفيع المستوى مع تكييف المحتوى بالذكاء الاصطناعي."
        },
        strategy: {
            en: "Focus on B2B subscription models with automated sales funnels and global certification standards.",
            fr: "Focus sur les modèles d'abonnement B2B avec des tunnels de vente automatisés et des standards de certification mondiaux.",
            ar: "التركيز على نماذج اشتراكات الشركات مع أقماع مبيعات مؤتمتة ومعايير اعتماد عالمية."
        },
        extraServices: {
            en: ["White-label Branding", "Course Content Generation AI", "Dedicated Cloud Hosting"],
            fr: ["Marque Blanche", "IA de Génération de Contenu de Cours", "Hébergement Cloud Dédié"],
            ar: ["براندينغ خاص (White-label)", "ذكاء اصطناعي لإنشاء المحتوى", "استضافة سحابية خاصة"]
        },
        price: 2500,
        currentBid: 2650,
        auctionStartedAt: "2026-02-14T10:00:00Z",
        demoUrl: "https://academy-demo.example.com",
        image: "/images/digitalization/edtech-demo.png",
        category: "EdTech",
        tier: "pro"
    },
    {
        id: "basic-saas-1",
        title: {
            en: "SaaS Waitlist & Landing",
            fr: "Landing Page & Waitlist SaaS",
            ar: "قالب صفحة انتظار للشركات الناشئة"
        },
        idea: {
            en: "Convert early visitors into leads with this high-converting waitlist template.",
            fr: "Convertissez les premiers visiteurs en prospects avec ce template de waitlist à haute conversion.",
            ar: "حوّل الزوار الأوائل إلى عملاء محتملين باستخدام قالب قائمة الانتظار هذا."
        },
        strategy: {
            en: "Psychological triggers and clear CTA paths for maximum lead capture.",
            fr: "Déclencheurs psychologiques et chemins CTA clairs pour une capture maximale de leads.",
            ar: "محفزات نفسية ومسارات عمل واضحة لضمان أكبر قدر من التحويلات."
        },
        extraServices: {
            en: ["Email Autoresponder Sync", "AB Testing Setup"],
            fr: ["Sync Auto-répondeur Email", "Config A/B Testing"],
            ar: ["ربط الرد الآلي للإيميلات", "إعداد اختبارات A/B"]
        },
        price: 89,
        demoUrl: "https://saas-waitlist.example.com",
        image: "/images/digitalization/services-demo.png",
        category: "Productivity",
        tier: "basic"
    },
    {
        id: "proptech-ai",
        title: {
            en: "AI Real Estate Strategist",
            fr: "Stratège Immobilier avec IA",
            ar: "خبير العقارات بالذكاء الاصطناعي"
        },
        idea: {
            en: "Predictive investment analysis platform for real estate, identifying high-yield opportunities before they hit the market.",
            fr: "Plateforme d'analyse d'investissement prédictive pour l'immobilier, identifiant les opportunités à haut rendement avant qu'elles n'arrivent sur le marché.",
            ar: "منصة تحليل استثمار تنبؤية للعقارات، تحدد الفرص ذات العائد المرتفع قبل وصولها إلى السوق."
        },
        strategy: {
            en: "Data scraping of non-obvious indicators combined with automated outreach to distressed property owners.",
            fr: "Scraping de données d'indicateurs non évidents combiné à une sensibilisation automatisée des propriétaires de biens en difficulté.",
            ar: "جمع البيانات من مؤشرات غير تقليدية مع أتمتة التواصل مع أصحاب العقارات المتعثرة."
        },
        extraServices: {
            en: ["VR Virtual Tours Integration", "Smart Contract Escrow", "Automated Tax Optimization"],
            fr: ["Intégration Visites Virtuelles VR", "Escrow par Smart Contract", "Optimisation Fiscale Automatisée"],
            ar: ["دمج الجولات الافتراضية VR", "ضمان العقود الذكية", "تحسين الضرائب المؤتمت"]
        },
        price: 4200,
        currentBid: 0,
        auctionStartedAt: null,
        demoUrl: "https://proptech-demo.example.com",
        image: "/images/digitalization/strategy.png",
        category: "PropTech",
        tier: "pro"
    }
];

export default function DigitalizationPage() {
    const { t, language } = useLanguage();
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [filter, setFilter] = useState<"all" | "basic" | "pro">("all");
    const [timeLeft, setTimeLeft] = useState<string>("");

    useEffect(() => {
        if (!selectedProject || !selectedProject.auctionStartedAt) return;

        const timer = setInterval(() => {
            const start = new Date(selectedProject.auctionStartedAt!).getTime();
            const end = start + (72 * 60 * 60 * 1000);
            const now = new Date().getTime();
            const diff = end - now;

            if (diff <= 0) {
                setTimeLeft("ENDED");
                clearInterval(timer);
            } else {
                const h = Math.floor(diff / (1000 * 60 * 60));
                const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((diff % (1000 * 60)) / 1000);
                setTimeLeft(`${h}h ${m}m ${s}s`);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [selectedProject]);

    const filteredProjects = PROJECTS.filter(p => filter === "all" || p.tier === filter);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 overflow-x-hidden">
            
            {/* Hero Section */}
            <section className="relative pt-32 pb-16 px-4 overflow-hidden bg-slate-50 dark:bg-slate-950">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-indigo-600/10 rounded-full blur-[100px]" />
                </div>

                <div className="container mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 dark:bg-white/5 backdrop-blur-md border border-slate-800 text-blue-400 text-sm font-bold mb-8"
                    >
                        <Zap className="w-4 h-4" />
                        {t.digitalization.marketplace.title}
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-serif font-medium text-slate-900 dark:text-white mb-8 tracking-tight"
                    >
                        {t.digitalization.marketplace.subtitle}
                    </motion.h1>

                    {/* Explanation Cards Section */}
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-16 text-left"
                    >
                        <div className="p-8 rounded-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                                <Globe className="w-16 h-16" />
                            </div>
                            <div className="flex items-center gap-3 mb-4 text-slate-900 dark:text-white">
                                <div className="p-2.5 rounded-xl bg-blue-600/10 text-blue-600">
                                    <Globe className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-bold">
                                    {t.digitalization.marketplace.explanation.basicTitle}
                                </h3>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                {t.digitalization.marketplace.explanation.basicDesc}
                            </p>
                        </div>

                        <div className="p-8 rounded-4xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 border border-white/10 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                                <Gavel className="w-16 h-16" />
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 dark:text-blue-600">
                                    <Gavel className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-bold">
                                    {t.digitalization.marketplace.explanation.proTitle}
                                </h3>
                            </div>
                            <p className="opacity-70 text-sm leading-relaxed">
                                {t.digitalization.marketplace.explanation.proDesc}
                            </p>
                        </div>
                    </motion.div>

                    {/* Filter Tabs */}
                    <div className="flex justify-center mt-16">
                        <div className="inline-flex p-1.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl backdrop-blur-xl">
                            {(['all', 'basic', 'pro'] as const).map((key) => (
                                <button
                                    key={key}
                                    onClick={() => setFilter(key)}
                                    className={cn(
                                        "px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                                        filter === key 
                                            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl" 
                                            : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                    )}
                                >
                                    {key === 'all' ? <Filter className="w-4 h-4" /> : key === 'basic' ? <Globe className="w-4 h-4" /> : <Gavel className="w-4 h-4" />}
                                    {t.digitalization.marketplace.categories[key]}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <div className="container mx-auto px-4">
                <AnimatePresence mode="wait">
                    {!selectedProject ? (
                        /* Projects Grid View */
                        <motion.div 
                            key="grid"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {filteredProjects.map((project) => (
                                <ProjectCard 
                                    key={project.id} 
                                    project={project} 
                                    lang={language}
                                    onSelect={() => setSelectedProject(project)}
                                    t={t}
                                />
                            ))}
                        </motion.div>
                    ) : (
                        /* Project Detail View */
                        <motion.div 
                            key="details"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="max-w-6xl mx-auto"
                        >
                            <button 
                                onClick={() => setSelectedProject(null)}
                                className="mb-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                {t.digitalization.marketplace.backToProjects}
                            </button>

                            <div className="grid lg:grid-cols-2 gap-12 bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl">
                                {/* Image & Demo Section */}
                                <div className="relative aspect-square lg:aspect-auto min-h-[400px]">
                                    <Image 
                                        src={selectedProject.image} 
                                        alt={selectedProject.title[language]} 
                                        fill 
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 to-transparent" />
                                    <div className="absolute bottom-10 left-10 right-10">
                                        <div className="flex items-center gap-4">
                                            <a 
                                                href={selectedProject.demoUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex-1 px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-center flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                                            >
                                                <Globe className="w-5 h-5" />
                                                {t.digitalization.marketplace.demo}
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Info & Pricing Section */}
                                <div className="p-10 md:p-16 flex flex-col">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="text-blue-500 font-bold uppercase tracking-widest text-xs">
                                            {selectedProject.category}
                                        </div>
                                        <div className={cn(
                                            "px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border",
                                            selectedProject.tier === 'pro' 
                                                ? "bg-purple-600/10 text-purple-600 border-purple-600/20" 
                                                : "bg-blue-600/10 text-blue-600 border-blue-600/20"
                                        )}>
                                            {selectedProject.tier.toUpperCase()}
                                        </div>
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-serif font-medium text-slate-900 dark:text-white mb-8 leading-tight">
                                        {selectedProject.title[language]}
                                    </h2>

                                    <div className="space-y-8 mb-12">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                                <Lightbulb className="w-5 h-5 text-yellow-500" />
                                                {t.digitalization.marketplace.details.generalIdea}
                                            </h3>
                                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                                {selectedProject.idea[language]}
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                                <Target className="w-5 h-5 text-blue-500" />
                                                {t.digitalization.marketplace.details.strategy}
                                            </h3>
                                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                                {selectedProject.strategy[language]}
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                                <Zap className="w-5 h-5 text-purple-500" />
                                                {t.digitalization.marketplace.details.extraServices}
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {selectedProject.extraServices[language].map((service, idx) => (
                                                    <div key={idx} className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-700 dark:text-slate-300">
                                                        {service}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price Box */}
                                    {selectedProject.tier === 'pro' ? (
                                        /* Auction Box */
                                        <div className="mt-auto p-8 rounded-3xl bg-slate-900 border border-slate-800 text-white relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                                <Gavel className="w-24 h-24" />
                                            </div>
                                            
                                            <div className="relative z-10">
                                                <div className="flex flex-wrap justify-between items-end gap-6 mb-8">
                                                    <div>
                                                        <div className="text-slate-400 text-sm mb-1">{t.digitalization.marketplace.startingPrice}</div>
                                                        <div className="text-2xl font-bold">${selectedProject.price}</div>
                                                    </div>
                                                    {selectedProject.currentBid! > 0 && (
                                                        <div className="text-right">
                                                            <div className="text-blue-400 text-sm mb-1">{t.digitalization.marketplace.currentBid}</div>
                                                            <div className="text-4xl font-black text-white">${selectedProject.currentBid}</div>
                                                        </div>
                                                    )}
                                                </div>

                                                {selectedProject.auctionStartedAt && (
                                                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 mb-8">
                                                        <Clock className="w-6 h-6 text-red-400" />
                                                        <div>
                                                            <div className="text-xs text-slate-400 uppercase tracking-widest">{t.digitalization.marketplace.auctionEnds}</div>
                                                            <div className="text-xl font-black font-mono">{timeLeft}</div>
                                                        </div>
                                                    </div>
                                                )}

                                                <button className="w-full py-5 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-600/20">
                                                    {t.digitalization.marketplace.bidNow}
                                                </button>
                                                
                                                <p className="mt-4 text-xs text-slate-500 text-center italic leading-relaxed">
                                                    {t.digitalization.marketplace.details.auctionInfo}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Fixed Price Box */
                                        <div className="mt-auto p-8 rounded-3xl bg-blue-600 text-white relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4 opacity-20">
                                                <ShoppingCart className="w-24 h-24" />
                                            </div>
                                            <div className="relative z-10">
                                                <div className="mb-6">
                                                    <div className="text-blue-100 text-sm mb-1">{t.digitalization.marketplace.fixedPrice}</div>
                                                    <div className="text-5xl font-black">${selectedProject.price}</div>
                                                </div>
                                                <button className="w-full py-5 bg-white text-blue-600 rounded-2xl font-black text-xl hover:bg-slate-50 transition-all shadow-xl shadow-blue-700/50">
                                                    {t.digitalization.marketplace.buyNow}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            {/* Standard "Trusted By" Footnote */}
            <section className="py-32 mt-20 opacity-40 grayscale pointer-events-none">
                <div className="container mx-auto px-4 flex flex-wrap justify-center gap-24 items-center">
                    <span className="font-black text-2xl">NEXUS</span>
                    <span className="font-black text-2xl italic underline">QUANTUM</span>
                    <span className="font-black text-2xl">ATLAS</span>
                    <span className="font-black text-2xl border-4 border-slate-900 px-4">ORBIT</span>
                </div>
            </section>
        </div>
    );
}

function ProjectCard({ project, lang, onSelect, t }: { project: Project, lang: string, onSelect: () => void, t: Translations }) {
    const isAuction = project.tier === 'pro';

    return (
        <motion.div 
            whileHover={{ y: -10 }}
            onClick={onSelect}
            className="group cursor-pointer relative bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all h-full flex flex-col"
        >
            <div className="relative aspect-square overflow-hidden">
                <Image 
                    src={project.image} 
                    alt={project.title[lang]} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-6 left-6">
                    <div className="px-4 py-2 bg-slate-900/80 backdrop-blur-md rounded-full text-white text-xs font-bold tracking-widest uppercase border border-white/10">
                        {project.category}
                    </div>
                </div>
                
                {isAuction && project.auctionStartedAt && (
                    <div className="absolute top-6 right-6">
                        <div className="px-4 py-2 bg-red-600 rounded-full text-white text-[10px] font-black tracking-tighter flex items-center gap-1.5 shadow-lg animate-pulse">
                            <Clock className="w-3 h-3" />
                            LIVE AUCTION
                        </div>
                    </div>
                )}
                
                <div className={cn(
                    "absolute bottom-6 left-6 right-6 p-4 rounded-2xl backdrop-blur-xl border flex items-center justify-between",
                    isAuction 
                        ? "bg-purple-950/40 border-purple-500/30 text-white" 
                        : "bg-blue-950/40 border-blue-500/30 text-white"
                )}>
                    <div>
                        <div className="text-[10px] uppercase font-black opacity-60 mb-0.5 tracking-widest">
                            {isAuction ? t.digitalization.marketplace.currentBid : t.digitalization.marketplace.fixedPrice}
                        </div>
                        <div className="text-xl font-black">
                            ${(isAuction && project.currentBid! > 0) ? project.currentBid : project.price}
                        </div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/10 border border-white/10 group-hover:bg-white group-hover:text-slate-900 transition-all">
                        <ArrowRight className="w-5 h-5" />
                    </div>
                </div>
            </div>

            <div className="p-8 flex flex-col flex-1">
                <div className="mb-4">
                    <span className={cn(
                        "text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-md border",
                        isAuction ? "text-purple-500 border-purple-500/20 bg-purple-500/5" : "text-blue-500 border-blue-500/20 bg-blue-500/5"
                    )}>
                        {isAuction ? "Strategic Pro" : "Asset Basic"}
                    </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 leading-tight group-hover:text-blue-600 transition-colors">
                    {project.title[lang]}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 line-clamp-2 text-sm leading-relaxed">
                    {project.idea[lang]}
                </p>
            </div>
        </motion.div>
    );
}
