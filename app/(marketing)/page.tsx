"use client";

import { motion } from "framer-motion";
import { ArrowRight, User, Building2, CheckCircle2, Zap, Sparkles, Brain, Rocket, Globe2, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
            subtitle: "The world's first integrated ecosystem for professionals, students, and researchers, combining high-precision AI diagnostics with human-led executive coaching.",
            professional: {
                title: "For Professionals & Researchers",
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
            subtitle: "Le premier écosystème intégré pour professionnels, étudiants et chercheurs, combinant diagnostic IA de haute précision et coaching exécutif humain.",
            professional: {
                title: "Pour les Professionnels & Chercheurs",
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
            subtitle: "أول نظام متكامل في العالم للمحترفين والطلبة والباحثين، يجمع بين التشخيص الذكي عالي الدقة والتدريب التنفيذي البشري.",
            professional: {
                title: "للمحترفين والباحثين",
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
        subtitle: "The world's first integrated ecosystem combining high-precision AI diagnostics with human-led executive coaching.",
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
            "min-h-screen bg-slate-50 dark:bg-[#020617] selection:bg-blue-500 selection:text-white pb-12 overflow-hidden",
            language === 'ar' ? 'font-arabic' : 'font-sans'
        )} dir={dir}>

            {/* Premium Background Effects */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[20%] w-[1000px] h-[1000px] bg-blue-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px]" />
                <div className="absolute top-[40%] left-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px]" />
            </div>

            <main className="relative z-10 container mx-auto px-6 pt-32">

                {/* Hero Section */}
                <div className="max-w-6xl mx-auto text-center mb-32 relative">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="absolute -top-20 right-0 w-64 h-64 grayscale opacity-10 pointer-events-none hidden lg:block"
                    >
                        <Image src="/images/landing_hero_visual.png" alt="Visual Decor" fill className="object-cover rounded-full" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 mb-12 shadow-2xl shadow-blue-500/5 hover:shadow-blue-500/10 transition-all cursor-default"
                    >
                        <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-pulse" />
                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-700 dark:text-slate-200">
                            {content.badge}
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-7xl md:text-9xl font-serif font-medium text-slate-900 dark:text-white mb-10 tracking-tighter leading-[0.95]"
                    >
                        {content.title} <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-linear-to-b from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 drop-shadow-sm">
                            {content.titleHighlight}
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-2xl md:text-3xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed mb-16 italic font-medium opacity-90"
                    >
                        {content.subtitle}
                    </motion.p>

                    {/* Stats Row */}
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-5xl mx-auto border-t-2 border-slate-200/50 dark:border-slate-800/50 pt-16"
                    >
                        {stats.map((stat, index) => (
                            <div key={index} className="flex flex-col items-center group cursor-default">
                                <span className="text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-2 group-hover:scale-110 transition-transform duration-500">{stat.value}</span>
                                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 text-center">{stat.label}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Main Navigation Cards */}
                <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto mb-32">

                    {/* Professionals Card */}
                    <Link href="/professionals" className="group">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative h-[600px] bg-white dark:bg-slate-900/60 backdrop-blur-2xl rounded-[4rem] border border-slate-200 dark:border-slate-800 p-12 md:p-20 overflow-hidden hover:shadow-[0_0_100px_-20px_rgba(37,99,235,0.15)] hover:border-blue-500/40 transition-all duration-700"
                        >
                            <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 group-hover:rotate-6 transition-all duration-1000">
                                <User strokeWidth={0.5} size={400} />
                            </div>

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="space-y-10">
                                    <div className="w-20 h-20 rounded-3xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-12 border border-blue-100 dark:border-blue-500/20 group-hover:rotate-12 transition-all duration-700 shadow-xl shadow-blue-500/10">
                                        <Brain size={40} />
                                    </div>
                                    <h3 className="text-5xl font-serif font-medium text-slate-900 dark:text-white tracking-tight">{content.professional.title}</h3>
                                    <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-md italic">
                                        {content.professional.desc}
                                    </p>
                                    <ul className="space-y-6">
                                        {content.professional.features.map((f, i) => (
                                            <li key={i} className="flex items-center gap-4 text-sm font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">
                                                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm"><CheckCircle2 className="w-4 h-4" /></div>
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                
                                <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400 group-hover:gap-8 transition-all duration-500 mt-10">
                                    {content.ctaProfessional} <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                </div>
                            </div>
                        </motion.div>
                    </Link>

                    {/* Enterprises Card */}
                    <Link href="/digitalization" className="group">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative h-[600px] bg-slate-900 dark:bg-white rounded-[4rem] border border-slate-800 dark:border-slate-200 p-12 md:p-20 overflow-hidden hover:shadow-[0_0_100px_-20px_rgba(99,102,241,0.2)] transition-all duration-700"
                        >
                            <div className="absolute top-0 right-0 p-16 opacity-[0.06] group-hover:opacity-[0.1] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-1000">
                                <Building2 strokeWidth={0.5} size={400} className="text-white dark:text-slate-900" />
                            </div>

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="space-y-10">
                                    <div className="w-20 h-20 rounded-3xl bg-white/10 dark:bg-slate-100 flex items-center justify-center text-white dark:text-slate-900 mb-12 border border-white/10 dark:border-slate-200 group-hover:-rotate-12 transition-all duration-700 shadow-xl shadow-white/5 dark:shadow-slate-200/50">
                                        <Rocket size={40} />
                                    </div>
                                    <h3 className="text-5xl font-serif font-medium text-white dark:text-slate-900 tracking-tight">{content.enterprise.title}</h3>
                                    <p className="text-xl text-slate-400 dark:text-slate-600 font-medium leading-relaxed max-w-md italic">
                                        {content.enterprise.desc}
                                    </p>
                                    <ul className="space-y-6">
                                        {content.enterprise.features.map((f, i) => (
                                            <li key={i} className="flex items-center gap-4 text-sm font-black uppercase tracking-widest text-slate-300 dark:text-slate-600">
                                                <div className="p-2 rounded-xl bg-white/10 dark:bg-slate-200 text-white dark:text-slate-900 shadow-sm"><Zap className="w-4 h-4" /></div>
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-white dark:text-slate-900 group-hover:gap-8 transition-all duration-500 mt-10">
                                    {content.ctaEnterprise} <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                </div>
                            </div>
                        </motion.div>
                    </Link>

                </div>

                {/* Additional Trust Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-6xl mx-auto mb-32 grid grid-cols-1 md:grid-cols-3 gap-16 text-center"
                >
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400 mb-6">
                            <Globe2 size={24} />
                        </div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.25em]">Global Standards</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Aligning talent with international benchmarks and C-suite expectations.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400 mb-6">
                            <Shield size={24} />
                        </div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.25em]">Verified Accuracy</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">High-precision AI diagnostics cross-validated by industry executive experts.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center mx-auto text-purple-600 dark:text-purple-400 mb-6">
                            <Sparkles size={24} />
                        </div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.25em]">Elite Network</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Access to an exclusive ecosystem of leaders, researchers, and innovators.</p>
                    </div>
                </motion.div>

                {/* Footer Minimal */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center border-t border-slate-200 dark:border-slate-800/50 pt-16"
                >
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500 opacity-60">
                        {content.footer}
                    </p>
                </motion.div>

            </main>
        </div>
    );
}
