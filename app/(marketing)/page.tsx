"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
    Sparkles,
    ArrowRight,
    Play,
    CheckCircle2,
    Brain,
    Library,
    GraduationCap,
    MessageSquare,
    Trophy,
    Video,
    FileText,
    Search
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/ui/navbar";
import { useRef } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function Home() {
    const { t } = useLanguage();
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef });
    const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900" ref={containerRef}>
            <Navbar />

            {/* Background Decor - Subtle & Premium */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-50/80 rounded-full blur-[120px] opacity-60" />
                <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-purple-50/80 rounded-full blur-[120px] opacity-60" />
            </div>

            {/* Hero Section */}
            <section className="container mx-auto px-4 pt-44 pb-32 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-5xl mx-auto"
                >
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900/5 border border-slate-900/10 text-sm font-semibold text-slate-700 mb-10 cursor-pointer backdrop-blur-sm hover:bg-slate-900/10 transition-colors"
                    >
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">{t.hero.badge}</span>
                    </motion.div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tight text-slate-900 mb-8 leading-[1.05]">
                        {t.hero.titlePre} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient-x">
                            {t.hero.titleHighlight}
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
                        {t.hero.subtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/dashboard" className="group relative px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/20 overflow-hidden transition-all hover:scale-105 hover:shadow-2xl">
                            <span className="relative z-10 flex items-center gap-2">
                                {t.hero.ctaDashboard}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>

                        <button className="px-8 py-4 bg-white text-slate-700 border-2 border-slate-100 rounded-2xl font-bold text-lg hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-3 shadow-sm hover:shadow-md">
                            <Play className="w-5 h-5 fill-slate-700" />
                            {t.hero.ctaTour}
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* Ecosystem Grid Section - The Core Update */}
            <section className="py-24 container mx-auto px-4 relative z-20">
                <div className="text-center mb-20 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">{t.features.title}</h2>
                    <p className="text-lg text-slate-500 font-medium">{t.features.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* 1. Tools AI */}
                    <FeatureCard
                        icon={<Brain className="w-8 h-8 text-white" />}
                        iconBg="bg-blue-600"
                        title={t.features.cards.aiTools.title}
                        description={t.features.cards.aiTools.desc}
                        tags={["Deep Diagnosis", "Smart Strategy", "Gap Analysis"]}
                        availability={{ text: t.features.cards.aiTools.availability, status: "active" }}
                    />

                    {/* 2. Training Hub */}
                    <FeatureCard
                        icon={<Video className="w-8 h-8 text-white" />}
                        iconBg="bg-indigo-600"
                        title={t.features.cards.training.title}
                        description={t.features.cards.training.desc}
                        tags={["Recorded Sessions", "Workshops", "Skill Drills"]}
                        availability={{ text: t.features.cards.training.availability, status: "concept" }}
                    />

                    {/* 3. Library */}
                    <FeatureCard
                        icon={<Library className="w-8 h-8 text-white" />}
                        iconBg="bg-purple-600"
                        title={t.features.cards.library.title}
                        description={t.features.cards.library.desc}
                        tags={["Templates", "Guides", "Methodologies"]}
                        availability={{ text: t.features.cards.library.availability, status: "concept" }}
                    />

                    {/* 4. Expert Chat */}
                    <FeatureCard
                        icon={<MessageSquare className="w-8 h-8 text-white" />}
                        iconBg="bg-pink-600"
                        title={t.features.cards.chat.title}
                        description={t.features.cards.chat.desc}
                        tags={["24/7 Availability", "Instant Feedback", "Specialized Personas"]}
                        availability={{ text: t.features.cards.chat.availability, status: "concept" }}
                    />

                    {/* 5. Achievements */}
                    <FeatureCard
                        icon={<Trophy className="w-8 h-8 text-white" />}
                        iconBg="bg-orange-500"
                        title={t.features.cards.achievements.title}
                        description={t.features.cards.achievements.desc}
                        tags={["Progress Tracking", "Milestone Badges", "Gamified Growth"]}
                        availability={{ text: t.features.cards.achievements.availability, status: "concept" }}
                    />

                    {/* 6. My Certificates */}
                    <FeatureCard
                        icon={<GraduationCap className="w-8 h-8 text-white" />}
                        iconBg="bg-teal-600"
                        title={t.features.cards.certificates.title}
                        description={t.features.cards.certificates.desc}
                        tags={["Job-Ready Proof", "Shareable", "Blockchain Verified"]}
                        availability={{ text: t.features.cards.certificates.availability, status: "concept" }}
                    />
                </div>
            </section>

            {/* Certificate Showcase Section */}
            <section className="py-32 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute inset-0 bg-slate-900/20 mix-blend-overlay" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />

                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center relative z-10">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-blue-300 font-bold text-sm mb-6 border border-white/10">
                            <CheckCircle2 className="w-4 h-4" />
                            {t.cert.badge}
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{t.cert.title}</h2>
                        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                            {t.cert.desc}
                        </p>

                        <div className="space-y-4">
                            <CheckItem text={t.cert.check1} />
                            <CheckItem text={t.cert.check2} />
                            <CheckItem text={t.cert.check3} />
                        </div>

                        <div className="mt-10">
                            <Link href="/dashboard" className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/30">
                                {t.cert.cta}
                            </Link>
                        </div>
                    </div>

                    <div className="relative">
                        <motion.div
                            initial={{ rotate: -5, y: 20, opacity: 0 }}
                            whileInView={{ rotate: -2, y: 0, opacity: 1 }}
                            transition={{ duration: 1 }}
                            className="bg-white text-slate-900 p-8 rounded-2xl shadow-2xl relative z-10 max-w-md mx-auto transform rotate-[-2deg] border-4 border-slate-200"
                        >
                            <div className="border border-slate-200 p-6 rounded-xl h-full flex flex-col items-center text-center bg-slate-50/50">
                                <Trophy className="w-16 h-16 text-yellow-500 mb-6" />
                                <h3 className="text-2xl font-serif font-bold text-slate-800 mb-2">{t.cert.cardTitle}</h3>
                                <p className="text-slate-500 text-sm mb-6 uppercase tracking-wider">{t.cert.cardSubtitle}</p>
                                <div className="w-full h-px bg-slate-200 mb-6" />
                                <p className="text-slate-600 text-sm mb-6 italic">{t.cert.cardFooter}</p>
                                <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center">
                                    <Sparkles className="w-8 h-8 text-slate-400" />
                                </div>
                            </div>
                        </motion.div>
                        {/* Decorative card underneath */}
                        <div className="absolute top-4 right-4 md:right-10 w-full h-full bg-slate-800 rounded-2xl -z-10 rotate-[3deg] border border-slate-700" />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white py-16 border-t border-slate-100">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-xl text-slate-900">CareerUpgrade</span>
                    </div>
                    <p className="text-slate-500 text-sm text-center md:text-right">
                        {t.footer.rights} <br className="hidden md:block" />
                        {t.footer.tagline}
                    </p>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, iconBg, title, description, tags, availability }: {
    icon: React.ReactNode,
    iconBg: string,
    title: string,
    description: string,
    tags: string[],
    availability?: { text: string, status: 'active' | 'concept' }
}) {
    return (
        <div className="block h-full cursor-default">
            <motion.div
                whileHover={{ y: -5 }}
                className="relative p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group h-full flex flex-col"
            >
                {availability && (
                    <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide ${availability.status === 'active'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                        : 'bg-slate-100 text-slate-400 border-slate-200'
                        }`}>
                        {availability.text}
                    </div>
                )}
                <div className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-opacity-20 group-hover:scale-110 transition-transform duration-300`}>
                    {icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed flex-grow">{description}</p>
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 uppercase tracking-wider">
                            {tag}
                        </span>
                    ))}
                </div>
            </motion.div>
        </div>
    )
}


function CheckItem({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3 text-slate-300">
            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
            </div>
            <span className="font-medium">{text}</span>
        </div>
    )
}
