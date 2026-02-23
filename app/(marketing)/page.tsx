"use client";

import { motion } from "framer-motion";
import { ArrowRight, User, Building2, CheckCircle2, Zap, Sparkles, Brain, Rocket } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";

export default function Home() {
    const { dir, language } = useLanguage();

    const stats = {
        en: [
            { label: "AI Diagnostic Accuracy", value: "98%" },
            { label: "Certified Alumni", value: "2,500+" },
            { label: "Strategic Partners", value: "120+" },
            { label: "Success Rate", value: "95%" },
        ],
        fr: [
            { label: "Précision Diagnostic IA", value: "98%" },
            { label: "Alumni Certifiés", value: "2 500+" },
            { label: "Partenaires Stratégiques", value: "120+" },
            { label: "Taux de Réussite", value: "95%" },
        ],
        ar: [
            { label: "دقة التشخيص الذكي", value: "98%" },
            { label: "خريجون معتمدون", value: "+2500" },
            { label: "شركاء استراتيجيون", value: "120" },
            { label: "نسبة النجاح", value: "95%" },
        ]
    }[language as 'en' | 'fr' | 'ar'] || [
        { label: "AI Diagnostic Accuracy", value: "98%" },
        { label: "Certified Alumni", value: "2,500+" },
        { label: "Strategic Partners", value: "120+" },
        { label: "Success Rate", value: "95%" },
    ];

    const content = {
        en: {
            badge: "The Future of Career Management",
            title: "Reinvent Your Career with",
            titleHighlight: "AI & Human Mastery",
            subtitle: "The world's first integrated ecosystem combining high-precision AI diagnostics with human-led executive coaching. Get your roadmap, your skills, and your verified future.",
            professional: {
                title: "For Professionals",
                desc: "Navigate your career transformation with our 7-stage AI journey and certified expert workshops.",
                features: ["7-Stage AI Diagnostic", "Verified Accreditation", "Executive Simulation Missions"]
            },
            enterprise: {
                title: "For Enterprises",
                desc: "Scale organizational excellence with AI-driven audits, digitalization roadmaps, and corporate training.",
                features: ["Digital Audit & Strategy", "Performance Benchmarking", "Custom Corporate Mastery"]
            },
            ctaProfessional: "Start Your Transformation",
            ctaEnterprise: "Scalable Solutions",
            footer: "MA-TRAINING-CONSULTING © 2026 • Defining the Gold Standard in Career Architecture."
        },
        fr: {
            badge: "L'Avenir de la Gestion de Carrière",
            title: "Réinventez votre carrière avec l'IA",
            titleHighlight: "et l'Expertise Humaine",
            subtitle: "Le premier écosystème intégré combinant diagnostic IA de haute précision et coaching exécutif humain. Obtenez votre feuille de route et votre avenir vérifié.",
            professional: {
                title: "Pour les Professionnels",
                desc: "Naviguez votre transformation de carrière avec notre parcours IA en 7 étapes et ateliers d'experts certifiés.",
                features: ["Diagnostic IA en 7 étapes", "Accréditation Vérifiée", "Missions de Simulation Exécutive"]
            },
            enterprise: {
                title: "Pour les Entreprises",
                desc: "Développez l'excellence organisationnelle avec des audits IA, des feuilles de route digitales et des formations sur mesure.",
                features: ["Audit Digital & Stratégie", "Analyse de Performance", "Maîtrise d'Entreprise Customisée"]
            },
            ctaProfessional: "Démarrer Votre Transformation",
            ctaEnterprise: "Solutions d'Entreprise",
            footer: "MA-TRAINING-CONSULTING © 2026 • Définir le Standard d'Excellence en Architecture de Carrière."
        },
        ar: {
            badge: "مستقبل إدارة المسارات المهنية",
            title: "أعد ابتكار مسارك بالذكاء الاصطناعي",
            titleHighlight: "والخبرة البشرية",
            subtitle: "أول نظام متكامل في العالم يجمع بين التشخيص الذكي عالي الدقة والتدريب التنفيذي البشري. احصل على خارطة طريقك، مهاراتك، ومستقبلك الموثّق.",
            professional: {
                title: "للمحترفين",
                desc: "قد جولة تحولك المهني عبر رحلتنا الذكية المكونة من 7 مراحل وورش عمل الخبراء المعتمدين.",
                features: ["تشخيص ذكي من 7 مراحل", "اعتمادات مهنية موثّقة", "مهام محاكاة تنفيذية"]
            },
            enterprise: {
                title: "للمؤسسات",
                desc: "ارتقِ بتميز مؤسستك عبر التدقيق الذكي، وخرائط التحول الرقمي، والتدريب المؤسسي المتطور.",
                features: ["التدقيق الرقمي والاستراتيجية", "قياس مؤشرات الأداء", "برامج تميز مؤسسي مخصصة"]
            },
            ctaProfessional: "ابدأ تحولك المهني",
            ctaEnterprise: "حلول المؤسسات",
            footer: "مكتب MA-TRAINING-CONSULTING © 2026 • وضع معايير التميز في هندسة المسارات المهنية."
        }
    }[language as 'en' | 'fr' | 'ar'] || {
        badge: "The Future of Career Management",
        title: "Reinvent Your Career with",
        titleHighlight: "AI & Human Mastery",
        subtitle: "The world's first integrated ecosystem combining high-precision AI diagnostics with human-led executive coaching. Get your roadmap, your skills, and your verified future.",
        professional: {
            title: "For Professionals",
            desc: "Navigate your career transformation with our 7-stage AI journey and certified expert workshops.",
            features: ["7-Stage AI Diagnostic", "Verified Accreditation", "Executive Simulation Missions"]
        },
        enterprise: {
            title: "For Enterprises",
            desc: "Scale organizational excellence with AI-driven audits, digitalization roadmaps, and corporate training.",
            features: ["Digital Audit & Strategy", "Performance Benchmarking", "Custom Corporate Mastery"]
        },
        ctaProfessional: "Start Your Transformation",
        ctaEnterprise: "Scalable Solutions",
        footer: "MA-TRAINING-CONSULTING © 2026 • Defining the Gold Standard in Career Architecture."
    };

    return (
        <div className={cn(
            "min-h-screen bg-slate-50 dark:bg-[#020617] selection:bg-blue-500 selection:text-white pb-12",
            language === 'ar' ? 'font-arabic' : 'font-sans'
        )} dir={dir}>

            {/* Premium Background Effects */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px]" />
                <div className="absolute top-[40%] left-[-10%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px]" />
            </div>

            <main className="relative z-10 container mx-auto px-6 pt-32">

                {/* Hero Section */}
                <div className="max-w-5xl mx-auto text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800 mb-10 shadow-sm hover:shadow-md transition-shadow cursor-default"
                    >
                        <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300">
                            {content.badge}
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-6xl md:text-8xl font-serif font-medium text-slate-900 dark:text-white mb-8 tracking-tight leading-[1.1]"
                    >
                        {content.title} <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
                            {content.titleHighlight}
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed mb-12"
                    >
                        {content.subtitle}
                    </motion.p>

                    {/* Stats Row */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-slate-200 dark:border-slate-800 pt-12"
                    >
                        {stats.map((stat, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <span className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-1">{stat.value}</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">{stat.label}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Main Navigation Cards */}
                <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-20">

                    {/* Professionals Card */}
                    <Link href="/professionals" className="group">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="relative h-full bg-white dark:bg-slate-900/60 backdrop-blur-xl rounded-[3rem] border border-slate-200 dark:border-slate-800 p-10 md:p-14 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/30 transition-all duration-500"
                        >
                            <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-700">
                                <User strokeWidth={0.5} size={300} />
                            </div>

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-8 border border-blue-100 dark:border-blue-500/20 group-hover:rotate-6 transition-transform duration-500 shadow-sm">
                                        <Brain size={32} />
                                    </div>
                                    <h3 className="text-4xl font-serif font-medium text-slate-900 dark:text-white mb-4">{content.professional.title}</h3>
                                    <p className="text-lg text-slate-500 font-medium leading-relaxed mb-8 max-w-md">
                                        {content.professional.desc}
                                    </p>
                                    <ul className="space-y-4 mb-10">
                                        {content.professional.features.map((f, i) => (
                                            <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-400">
                                                <div className="p-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"><CheckCircle2 className="w-3 h-3" /></div>
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                
                                <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 group-hover:gap-5 transition-all">
                                    {content.ctaProfessional} <ArrowRight className="w-5 h-5" />
                                </div>
                            </div>
                        </motion.div>
                    </Link>

                    {/* Enterprises Card */}
                    <Link href="/digitalization" className="group">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="relative h-full bg-slate-900 dark:bg-white rounded-[3rem] border border-slate-800 dark:border-slate-200 p-10 md:p-14 overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20 dark:hover:shadow-lg transition-all duration-500"
                        >
                            <div className="absolute top-0 right-0 p-16 opacity-[0.06] group-hover:opacity-[0.1] group-hover:scale-110 transition-all duration-700">
                                <Building2 strokeWidth={0.5} size={300} className="text-white dark:text-slate-900" />
                            </div>

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <div className="w-16 h-16 rounded-2xl bg-white/10 dark:bg-slate-100 flex items-center justify-center text-white dark:text-slate-900 mb-8 border border-white/10 dark:border-slate-200 group-hover:-rotate-6 transition-transform duration-500 shadow-sm">
                                        <Rocket size={32} />
                                    </div>
                                    <h3 className="text-4xl font-serif font-medium text-white dark:text-slate-900 mb-4">{content.enterprise.title}</h3>
                                    <p className="text-lg text-slate-400 dark:text-slate-600 font-medium leading-relaxed mb-8 max-w-md">
                                        {content.enterprise.desc}
                                    </p>
                                    <ul className="space-y-4 mb-10">
                                        {content.enterprise.features.map((f, i) => (
                                            <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-300 dark:text-slate-600">
                                                <div className="p-1 rounded-full bg-white/10 dark:bg-slate-200 text-white dark:text-slate-900"><Zap className="w-3 h-3" /></div>
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-white dark:text-slate-900 group-hover:gap-5 transition-all">
                                    {content.ctaEnterprise} <ArrowRight className="w-5 h-5" />
                                </div>
                            </div>
                        </motion.div>
                    </Link>

                </div>

                {/* Footer Minimal */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-center border-t border-slate-200 dark:border-slate-800/50 pt-12"
                >
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 opacity-60">
                        {content.footer}
                    </p>
                </motion.div>

            </main>
        </div>
    );
}
