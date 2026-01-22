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
    Shield
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/ui/navbar";
import { useRef } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";

export default function Home() {
    const { t, dir, language } = useLanguage();
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef });
    const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

    return (
        <div className={cn(
            "min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden",
            language === 'ar' ? 'font-arabic' : 'font-sans'
        )} dir={dir} ref={containerRef}>
            <Navbar />

            {/* Background Decor - Refined & Higher Fidelity */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-5%] w-[70%] h-[70%] bg-blue-50/50 rounded-full blur-[150px] opacity-40 animate-pulse" />
                <div className="absolute bottom-[0%] right-[-5%] w-[60%] h-[60%] bg-indigo-50/50 rounded-full blur-[150px] opacity-40 animate-pulse" />
                <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] bg-purple-50/30 rounded-full blur-[120px] opacity-30" />
            </div>

            {/* Hero Section */}
            <section className="container mx-auto px-4 pt-48 pb-32 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-5xl mx-auto"
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-12 cursor-default shadow-xl shadow-slate-200"
                    >
                        <Sparkles className="w-3 h-3 text-blue-400" />
                        {t.hero.badge}
                    </motion.div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tight text-slate-900 mb-10 leading-[0.95] lg:px-12">
                        {t.hero.titlePre} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                            {t.hero.titleHighlight}
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto mb-14 leading-relaxed font-medium">
                        {t.hero.subtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link href="/auth/register" className="group relative px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-[0.15em] shadow-2xl shadow-slate-300 overflow-hidden transition-all hover:scale-105 active:scale-95">
                            <span className="relative z-10 flex items-center gap-3">
                                {t.hero.ctaDashboard}
                                <ArrowRight className={cn("w-5 h-5 transition-transform", dir === 'rtl' ? 'group-hover:-translate-x-2 rotate-180' : 'group-hover:translate-x-2')} />
                            </span>
                        </Link>

                        <button className="px-10 py-5 bg-white text-slate-900 border border-slate-100 rounded-2xl font-black text-sm uppercase tracking-[0.15em] hover:bg-slate-50 transition-all flex items-center gap-3 shadow-sm hover:shadow-xl active:scale-95">
                            <Play className="w-4 h-4 fill-current" />
                            {t.hero.ctaTour}
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* Ecosystem Grid Section */}
            <section className="py-24 container mx-auto px-4 relative z-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-24 max-w-4xl mx-auto"
                >
                    <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-8 tracking-tighter">{t.features.title}</h2>
                    <p className="text-xl text-slate-400 font-bold max-w-2xl mx-auto leading-relaxed">{t.features.subtitle}</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {/* 1. Tools AI */}
                    <FeatureCard
                        icon={<Brain className="w-8 h-8 text-white" />}
                        iconBg="bg-blue-600"
                        title={t.features.cards.aiTools.title}
                        description={t.features.cards.aiTools.desc}
                        tags={t.features.cards.aiTools.tags}
                        availability={{ text: t.features.cards.aiTools.availability, status: "active" }}
                        delay={0.1}
                    />

                    {/* 2. Training Hub */}
                    <FeatureCard
                        icon={<Video className="w-8 h-8 text-white" />}
                        iconBg="bg-indigo-600"
                        title={t.features.cards.training.title}
                        description={t.features.cards.training.desc}
                        tags={t.features.cards.training.tags}
                        availability={{ text: t.features.cards.training.availability, status: "concept" }}
                        delay={0.2}
                    />

                    {/* 3. Library */}
                    <FeatureCard
                        icon={<Library className="w-8 h-8 text-white" />}
                        iconBg="bg-purple-600"
                        title={t.features.cards.library.title}
                        description={t.features.cards.library.desc}
                        tags={t.features.cards.library.tags}
                        availability={{ text: t.features.cards.library.availability, status: "concept" }}
                        delay={0.3}
                    />

                    {/* 4. Expert Chat */}
                    <FeatureCard
                        icon={<MessageSquare className="w-8 h-8 text-white" />}
                        iconBg="bg-pink-600"
                        title={t.features.cards.chat.title}
                        description={t.features.cards.chat.desc}
                        tags={t.features.cards.chat.tags}
                        availability={{ text: t.features.cards.chat.availability, status: "concept" }}
                        delay={0.4}
                    />

                    {/* 5. Achievements */}
                    <FeatureCard
                        icon={<Trophy className="w-8 h-8 text-white" />}
                        iconBg="bg-orange-500"
                        title={t.features.cards.achievements.title}
                        description={t.features.cards.achievements.desc}
                        tags={t.features.cards.achievements.tags}
                        availability={{ text: t.features.cards.achievements.availability, status: "concept" }}
                        delay={0.5}
                    />

                    {/* 6. My Certificates */}
                    <FeatureCard
                        icon={<GraduationCap className="w-8 h-8 text-white" />}
                        iconBg="bg-teal-600"
                        title={t.features.cards.certificates.title}
                        description={t.features.cards.certificates.desc}
                        tags={t.features.cards.certificates.tags}
                        availability={{ text: t.features.cards.certificates.availability, status: "concept" }}
                        delay={0.6}
                    />
                </div>
            </section>

            {/* Certificate Showcase Section */}
            <section className="py-40 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute inset-0 bg-slate-900/50" />
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px]" />

                <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-24 items-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: dir === 'rtl' ? 50 : -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10 border border-white/10">
                            <Shield className="w-4 h-4" />
                            {t.cert.badge}
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black mb-10 leading-[1] tracking-tight">{t.cert.title}</h2>
                        <p className="text-slate-400 text-xl mb-12 leading-relaxed font-medium">
                            {t.cert.desc}
                        </p>

                        <div className="grid gap-6">
                            <CheckItem text={t.cert.check1} />
                            <CheckItem text={t.cert.check2} />
                            <CheckItem text={t.cert.check3} />
                        </div>

                        <div className="mt-16">
                            <Link href="/auth/register" className="inline-flex items-center gap-4 px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm uppercase tracking-[0.15em] transition-all shadow-2xl shadow-blue-600/40 hover:scale-105 active:scale-95">
                                {t.cert.cta}
                                <ArrowRight className={cn("w-5 h-5", dir === 'rtl' && 'rotate-180')} />
                            </Link>
                        </div>
                    </motion.div>

                    <div className="relative">
                        <motion.div
                            initial={{ rotate: -5, y: 50, opacity: 0 }}
                            whileInView={{ rotate: -2, y: 0, opacity: 1 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            viewport={{ once: true }}
                            className="bg-white text-slate-900 p-1 lg:p-2 rounded-[2.5rem] shadow-2xl relative z-10 max-w-xl mx-auto transform border-[12px] border-slate-800"
                        >
                            <div className="border border-slate-100 p-10 lg:p-16 rounded-[2rem] h-full flex flex-col items-center text-center bg-slate-50/50">
                                <Trophy className="w-20 h-20 text-yellow-500 mb-10 drop-shadow-lg" />
                                <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">{t.cert.cardTitle}</h3>
                                <p className="text-slate-400 text-xs mb-10 uppercase tracking-[0.3em] font-black">{t.cert.cardSubtitle}</p>
                                <div className="w-full h-px bg-slate-200 mb-10" />
                                <p className="text-slate-600 text-lg mb-12 italic leading-relaxed font-medium px-4">"{t.cert.cardFooter}"</p>
                                <div className="relative">
                                    <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center border-4 border-slate-50">
                                        <Sparkles className="w-12 h-12 text-blue-600" />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-slate-900 rounded-full border-4 border-white flex items-center justify-center">
                                        <CheckCircle2 size={16} className="text-white" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        {/* Decorative elements behind the card */}
                        <div className="absolute top-10 left-10 w-full h-full bg-blue-600/20 rounded-[3rem] -z-10 rotate-[2deg] blur-2xl" />
                        <div className="absolute -bottom-10 -right-10 w-full h-full bg-purple-600/20 rounded-[3rem] -z-10 rotate-[-2deg] blur-2xl" />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white py-24 border-t border-slate-50 overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-16 mb-16">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-200">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <span className="font-black text-3xl text-slate-900 tracking-tighter">CareerUpgrade</span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-10">
                            <FooterLink href="/" label={t.nav.home} />
                            <FooterLink href="/methodology" label={t.nav.methodology} />
                            <FooterLink href="/pricing" label={t.nav.pricing} />
                        </div>
                    </div>

                    <div className="pt-16 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] text-center md:text-left">
                            {t.footer.rights} — {t.footer.tagline}
                        </p>
                        <div className="flex items-center gap-8">
                            <Link
                                href="/admin"
                                className="text-[10px] text-slate-300 hover:text-slate-900 transition-colors uppercase tracking-[0.2em] font-black"
                            >
                                Administration
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FooterLink({ href, label }: { href: string; label: string }) {
    return (
        <Link href={href} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-all">
            {label}
        </Link>
    );
}

function FeatureCard({ icon, iconBg, title, description, tags, availability, delay }: {
    icon: React.ReactNode,
    iconBg: string,
    title: string,
    description: string,
    tags: string[],
    availability?: { text: string, status: 'active' | 'concept' },
    delay: number
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.6, ease: "easeOut" }}
            className="block h-full cursor-default"
        >
            <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative p-10 rounded-[2.5rem] bg-slate-50 border border-slate-50 hover:bg-white hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 group h-full flex flex-col shadow-sm"
            >
                {availability && (
                    <div className={`absolute top-8 right-8 px-3 py-1 rounded-lg text-[8px] font-black border uppercase tracking-[0.2em] ${availability.status === 'active'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        : 'bg-slate-100 text-slate-400 border-slate-100'
                        }`}>
                        {availability.text}
                    </div>
                )}
                <div className={`w-16 h-16 ${iconBg} rounded-[1.25rem] flex items-center justify-center mb-10 shadow-xl shadow-opacity-20 group-hover:rotate-6 transition-all duration-500`}>
                    {icon}
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">{title}</h3>
                <p className="text-slate-500 mb-10 leading-relaxed flex-grow font-bold text-sm">{description}</p>
                <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-100/50">
                    {tags.map((tag) => (
                        <span key={tag} className="px-3 py-1.5 bg-white border border-slate-100 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover:border-slate-200 transition-colors">
                            {tag}
                        </span>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    )
}


function CheckItem({ text }: { text: string }) {
    const { dir } = useLanguage();
    return (
        <div className="flex items-center gap-4 text-slate-200">
            <div className="w-7 h-7 rounded-xl bg-blue-600/20 flex items-center justify-center flex-shrink-0 border border-blue-500/20">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
            </div>
            <span className="font-bold text-lg">{text}</span>
        </div>
    )
}
