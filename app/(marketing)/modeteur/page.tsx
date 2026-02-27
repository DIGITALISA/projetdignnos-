"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
    Brain, 
    Target, 
    Zap, 
    ShieldCheck, 
    Sparkles, 
    ClipboardCheck, 
    Award, 
    TrendingUp, 
    CheckCircle2, 
    Users2, 
    MonitorPlay,
    ChevronRight,
    CheckCircle,
    Send,
    LayoutDashboard,
    Calendar
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils";

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
};

const stagger = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function ExpertCallPage() {
    const { language, dir } = useLanguage();
    const t = translations[language as keyof typeof translations].expertCall;

    // Interview state
    const [step, setStep] = useState<'intro' | 'questions' | 'form' | 'done'>('intro');
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', paymentMode: '', amount: '', paymentOther: '' });
    const [submitting, setSubmitting] = useState(false);
    const [otherText, setOtherText] = useState<Record<number, string>>({});
    const [multiSelectAnswers, setMultiSelectAnswers] = useState<Record<number, string[]>>({}); 

    const questions = [
        { q: "Quel est votre domaine d'expertise principal ?", opts: ["Ressources Humaines", "Finance & Comptabilité", "Commerce & Vente", "Management & Leadership"], hasOther: true },
        { q: "Combien d'années d'expérience professionnelle avez-vous ?", opts: ["1–3 ans", "3–7 ans", "7–15 ans", "+15 ans"], hasOther: false },
        { q: "Avez-vous déjà encadré ou coaché des collaborateurs ?", opts: ["Oui, régulièrement", "Occasionnellement", "Rarement", "Jamais"], hasOther: false },
        { q: "Comment évaluez-vous votre aisance en communication orale ?", opts: ["Excellente", "Bonne", "Moyenne", "À améliorer"], hasOther: false },
        { q: "Êtes-vous à l'aise avec les outils digitaux et la visioconférence ?", opts: ["Très à l'aise", "À l'aise", "Peu habitué(e)", "Pas du tout"], hasOther: false },
        { q: "Quelle est votre disponibilité hebdomadaire pour ce projet ?", opts: ["2–5h/semaine", "5–10h/semaine", "10–20h/semaine", "+20h/semaine"], hasOther: false },
        { q: "Avez-vous de l'expérience en formation ou pédagogie ?", opts: ["Oui, formateur certifié", "Oui, informellement", "Un peu", "Aucune"], hasOther: false },
        { q: "Comment gérez-vous les situations de pression et de stress ?", opts: ["Très bien, c'est mon quotidien", "Bien la plupart du temps", "J'ai des difficultés parfois", "C'est un défi pour moi"], hasOther: false },
        { q: "Êtes-vous capable de simuler des situations professionnelles réelles ?", opts: ["Oui, c'est naturel pour moi", "Je peux m'y adapter", "Avec de la préparation", "J'ai besoin d'aide"], hasOther: false },
        { q: "Quel est votre secteur d'activité professionnel ?", opts: ["Industrie & Production", "Services & Conseil", "Tech & Innovation", "Santé & Éducation"], hasOther: true },
        { q: "Avez-vous un réseau professionnel actif ?", opts: ["Très actif (LinkedIn, associations…)", "Modérément actif", "Peu développé", "Non"], hasOther: false },
        { q: "Comment décririez-vous votre style de leadership ?", opts: ["Directif et structuré", "Collaboratif et participatif", "Coaching et développement", "Flexible selon le contexte"], hasOther: true },
        { q: "Quelle valeur apportez-vous en priorité à un participant ?", opts: ["Expertise technique pointue", "Expérience terrain réelle", "Réseau et contacts", "Vision stratégique"], hasOther: true },
        { q: "Êtes-vous motivé(e) par un projet d'impact social et professionnel ?", opts: ["Absolument, c'est essentiel", "Oui, c'est important", "C'est un plus", "Peu important pour moi"], hasOther: false },
        { q: "Dans quel délai pouvez-vous commencer votre collaboration ?", opts: ["Immédiatement", "Dans 2 semaines", "Dans 1 mois", "Dans plus d'un mois"], hasOther: false },
        { 
            q: "Au-delà de votre rôle d’expert, seriez-vous prêt(e) à contribuer aux activités suivantes ?", 
            opts: [
                "🎤 Animer des webinaires & formations live",
                "📢 Promouvoir le contenu sur mes réseaux",
                "🤝 Collaborer sur des actions marketing",
                "🎥 Créer du contenu éducatif (vidéos, articles...)",
                "✅ Je me concentre uniquement sur mon rôle d’expert"
            ], 
            hasOther: false,
            multiSelect: true 
        },
    ];

    const handleAnswer = (answer: string) => {
        const updated = { ...answers, [currentQ]: answer };
        setAnswers(updated);
        // Don't auto-advance for "Autre" — let user fill the text first
        if (answer === 'Autre') return;
        if (currentQ < questions.length - 1) {
            setTimeout(() => setCurrentQ(q => q + 1), 300);
        } else {
            setTimeout(() => setStep('form'), 300);
        }
    };

    const toggleMultiSelect = (qIndex: number, opt: string) => {
        setMultiSelectAnswers(prev => {
            const current = prev[qIndex] || [];
            const isExclusiveOpt = opt.includes("uniquement sur mon rôle");
            if (isExclusiveOpt) {
                // If exclusive option selected, deselect all others
                return { ...prev, [qIndex]: current.includes(opt) ? [] : [opt] };
            }
            // Deselect the exclusive option if another is chosen
            const withoutExclusive = current.filter(o => !o.includes("uniquement sur mon rôle"));
            if (withoutExclusive.includes(opt)) {
                return { ...prev, [qIndex]: withoutExclusive.filter(o => o !== opt) };
            }
            return { ...prev, [qIndex]: [...withoutExclusive, opt] };
        });
    };

    const handleMultiSelectConfirm = () => {
        const selected = multiSelectAnswers[currentQ] || [];
        if (selected.length === 0) return;
        setAnswers(a => ({ ...a, [currentQ]: selected.join(' | ') }));
        if (currentQ < questions.length - 1) {
            setTimeout(() => setCurrentQ(q => q + 1), 300);
        } else {
            setTimeout(() => setStep('form'), 300);
        }
    };

    const handleOtherConfirm = () => {
        const text = otherText[currentQ]?.trim();
        if (!text) return;
        setAnswers(a => ({ ...a, [currentQ]: `Autre: ${text}` }));
        if (currentQ < questions.length - 1) {
            setTimeout(() => setCurrentQ(q => q + 1), 300);
        } else {
            setTimeout(() => setStep('form'), 300);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch("/api/expert-interview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    answers
                })
            });
            if (res.ok) {
                setStep('done');
            }
        } catch (error) {
            console.error("Error submitting expert interview:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={cn(
            "min-h-screen bg-white pb-20 pt-20",
            language === 'ar' ? 'font-arabic' : 'font-sans'
        )} dir={dir}>
            <div className="max-w-7xl mx-auto px-6 space-y-32">
                {/* Hero Section */}
                <motion.section 
                    initial="initial"
                    animate="animate"
                    variants={stagger}
                    className="text-center space-y-10 pt-20"
                >
                    <motion.div variants={fadeIn} className="inline-flex items-center gap-3 px-6 py-2.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black uppercase tracking-[0.2em] border border-indigo-100 shadow-sm">
                        <Sparkles size={16} className="animate-pulse" />
                        {t.badge}
                    </motion.div>
                    
                    <motion.h1 variants={fadeIn} className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight leading-[1.1]">
                        {t.heroTitle.split(' ').map((word, i) => (
                            word === 'Complet' || word === 'متكامل' || word === 'Complete' || word === 'Professional' || word === 'Parcours' ? 
                            <span key={i} className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-blue-600"> {word} </span> : word + ' '
                        ))}
                    </motion.h1>
                    
                    <motion.p variants={fadeIn} className="text-xl md:text-2xl text-slate-500 max-w-4xl mx-auto leading-relaxed font-medium italic opacity-80">
                        {t.heroSubtitle}
                    </motion.p>


                </motion.section>

                {/* Concept & Pillars */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-12"
                    >
                        <div className="space-y-6">
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight">{t.conceptTitle}</h2>
                            <p className="text-slate-600 leading-relaxed text-xl font-medium">
                                {t.conceptDesc}
                            </p>
                        </div>
                        
                        <div className="space-y-6">
                            <h3 className="text-sm font-black text-indigo-600 uppercase tracking-[0.3em]">{t.pillarsTitle}</h3>
                            <div className="space-y-6">
                                {[
                                    { icon: Brain, key: 'ai', color: "blue" },
                                    { icon: Users2, key: 'sup', color: "indigo" },
                                    { icon: Award, key: 'exp', color: "amber" }
                                ].map((pillar, i) => {
                                    const pillarData = t.pillars[pillar.key as keyof typeof t.pillars];
                                    return (
                                        <div key={i} className="flex gap-6 p-6 bg-slate-50 rounded-4xl border border-slate-100 hover:bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group">
                                            <div className={`shrink-0 w-14 h-14 rounded-2xl bg-white shadow-sm text-${pillar.color}-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all`}>
                                                <pillar.icon size={28} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black text-slate-900 mb-1">{pillarData.title}</h3>
                                                <p className="text-sm text-slate-500 font-medium leading-relaxed">{pillarData.desc}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="absolute -inset-10 bg-indigo-600/5 rounded-[5rem] blur-3xl animate-pulse" />
                        <div className="relative bg-white p-3 rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden">
                            <div className="bg-slate-900 p-12 rounded-[3rem] text-white space-y-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                        <Target size={24} />
                                    </div>
                                    <span className="font-black tracking-[0.2em] uppercase text-xs text-indigo-300">{t.target.badge}</span>
                                </div>
                                <h3 className="text-3xl font-black leading-tight">{t.target.title}</h3>
                                <ul className="space-y-6 text-slate-400 font-medium text-lg">
                                    {t.target.list.map((item, i) => (
                                        <li key={i} className="flex items-start gap-4 group">
                                            <CheckCircle2 size={24} className="text-indigo-500 mt-1 shrink-0 group-hover:scale-110 transition-transform" />
                                            <span className="group-hover:text-white transition-colors">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Intelligence & Workshops Phases */}
                <section className="space-y-20">
                    <div className="text-center space-y-6 max-w-3xl mx-auto">
                        <h2 className="text-5xl font-black text-slate-900 tracking-tight">{t.phases.title}</h2>
                        <p className="text-slate-500 text-xl font-medium">{t.phases.subtitle}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {[
                            { 
                                key: 'diag',
                                icon: ClipboardCheck, 
                                badge: "Phase 01",
                                color: "blue"
                            },
                            { 
                                key: 'ws',
                                icon: Zap, 
                                badge: "Phase 02",
                                color: "indigo"
                            }
                        ].map((phase, i) => {
                            const phaseData = t.phases[phase.key as 'diag' | 'ws'] as { title: string; desc: string };
                            return (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="relative bg-white p-12 rounded-4xl border border-slate-100 shadow-2xl shadow-slate-200/50 hover:border-indigo-100 transition-all group overflow-hidden"
                                >
                                    <div className={`absolute top-0 right-0 px-4 py-1.5 bg-${phase.color}-50 text-${phase.color}-600 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest border-b border-l border-${phase.color}-100`}>
                                        {phase.badge}
                                    </div>
                                    <div className={`w-16 h-16 rounded-3xl bg-${phase.color}-50 text-${phase.color}-600 flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform`}>
                                        <phase.icon size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{phaseData.title}</h3>
                                    <p className="text-slate-600 leading-relaxed text-lg font-medium">{phaseData.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* Platform & Community Section */}
                <section className="space-y-24">
                    {/* Platform Highlights */}
                    <div className="relative overflow-hidden pt-10">
                        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />
                        <div className="relative space-y-16">
                            <div className="text-center space-y-4">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                                    <Sparkles size={12} />
                                    Innovation Digitale
                                </div>
                                <h2 className="text-5xl font-black text-slate-900 tracking-tight">{t.platform.title}</h2>
                                <p className="text-slate-500 text-xl max-w-3xl mx-auto font-medium">{t.platform.desc}</p>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {t.platform.features.map((feature: string, i: number) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:border-indigo-200 hover:shadow-indigo-500/10 transition-all group relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 transition-transform duration-500">
                                            {i === 0 && <LayoutDashboard size={80} />}
                                            {i === 1 && <Users2 size={80} />}
                                            {i === 2 && <Calendar size={80} />}
                                            {i === 3 && <TrendingUp size={80} />}
                                        </div>
                                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600 mb-8 group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-12 transition-all">
                                            {i === 0 && <LayoutDashboard size={28} />}
                                            {i === 1 && <Users2 size={28} />}
                                            {i === 2 && <Calendar size={28} />}
                                            {i === 3 && <TrendingUp size={28} />}
                                        </div>
                                        <p className="font-black text-slate-900 text-lg leading-tight relative z-10">{feature}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Community Note */}
                    {t.communityNote && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-indigo-50/50 border border-indigo-100/50 rounded-4xl p-10 flex flex-col md:flex-row items-center gap-8 max-w-5xl mx-auto shadow-sm"
                        >
                            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-indigo-600 shadow-xl shadow-indigo-500/10 shrink-0">
                                <Users2 size={40} />
                            </div>
                            <p className="text-indigo-900/80 font-black text-xl leading-relaxed italic text-center md:text-left">
                                &ldquo; {t.communityNote} &rdquo;
                            </p>
                        </motion.div>
                    )}
                </section>

                {/* Role of Expert & Stimulation */}
                <section className="bg-slate-900 rounded-[4rem] p-12 lg:p-24 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/20 blur-[150px] -mr-64 -mt-64 animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] -ml-64 -mb-64" />
                    
                    <div className="relative z-10 space-y-24">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                            <div className="space-y-10">
                                <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/10 rounded-full text-[11px] font-black uppercase tracking-[0.3em] text-indigo-300 backdrop-blur-md border border-white/10">
                                    <Award size={14} />
                                    {t.role.badge}
                                </div>
                                <h2 className="text-5xl font-black tracking-tight leading-tight">{t.role.title}</h2>
                                <p className="text-slate-400 text-xl leading-relaxed font-medium">
                                    {t.role.desc}
                                </p>
                                
                                <div className="space-y-8 pt-4">
                                    <h4 className="text-sm font-black uppercase tracking-[0.3em] text-indigo-400 border-l-4 border-indigo-600 pl-4">{t.role.tasksTitle}</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                        {t.role.tasks.map((task: { title: string; text: string }, i: number) => (
                                            <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors group">
                                                <h5 className="font-black text-indigo-300 mb-2 truncate group-hover:text-white transition-colors">{task.title}</h5>
                                                <p className="text-sm text-slate-400 leading-relaxed font-medium">{task.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-12">
                                <div className="bg-indigo-600 rounded-4xl p-12 space-y-8 shadow-3xl shadow-indigo-600/40 border border-indigo-500/50 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
                                        <MonitorPlay size={120} />
                                    </div>
                                    <h3 className="text-3xl font-black flex items-center gap-4">
                                        <MonitorPlay className="animate-pulse" />
                                        {t.stim.title}
                                    </h3>
                                    <div className="space-y-6 text-indigo-50 font-medium text-lg">
                                        <p className="border-b border-indigo-400/50 pb-4 opacity-80">{t.stim.intro}</p>
                                        <ul className="space-y-6">
                                            {t.stim.list.map((item, i) => (
                                                <li key={i} className="flex gap-4 items-center group/item">
                                                    <div className="w-2 h-2 rounded-full bg-white group-hover/item:scale-150 transition-transform"/> 
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-4xl p-12 space-y-6 hover:bg-white/10 transition-all">
                                    <h3 className="text-2xl font-black flex items-center gap-4">
                                        <ShieldCheck className="text-indigo-400" />
                                        {t.binome.title}
                                    </h3>
                                    <p className="text-lg text-slate-400 leading-relaxed font-medium">
                                        {t.binome.desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Conditions & Benefits */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 pb-20">
                    <div className="bg-white p-14 rounded-[4rem] border border-slate-100 shadow-2xl space-y-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[4rem] -mr-16 -mt-16 transition-all group-hover:scale-110" />
                        <h3 className="text-3xl font-black text-slate-900 relative z-10">{t.conditions.title}</h3>
                        <div className="space-y-6 relative z-10">
                            {t.conditions.list.map((text, i) => (
                                <div key={i} className="flex gap-5 items-center group">
                                    <div className="shrink-0 w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        <TrendingUp size={20} />
                                    </div>
                                    <p className="text-slate-600 font-bold text-sm tracking-tight">{text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-amber-50 p-14 rounded-[4rem] border border-amber-100 space-y-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/50 rounded-bl-[4rem] -mr-16 -mt-16" />
                        <div className="space-y-6 relative z-10">
                            <div className="flex items-center gap-5 text-amber-700">
                                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
                                    <ShieldCheck size={28} />
                                </div>
                                <h3 className="text-3xl font-black">{t.pedag.title}</h3>
                            </div>
                            <p className="text-amber-900/70 font-bold text-lg leading-relaxed italic">
                                &ldquo;{t.pedag.desc}&rdquo;
                            </p>
                        </div>

                        <div className="pt-10 border-t border-amber-200/50 relative z-10">
                            <h4 className="text-sm font-black text-amber-900 uppercase tracking-widest mb-8">{t.benefits.title}</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {t.benefits.list.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                                        <span className="text-sm font-black text-amber-900/80">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Expert Interview Section */}
                <section id="candidature" className="pb-20">
                    <div className="text-center space-y-4 mb-16">
                        <div className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black uppercase tracking-[0.2em] border border-indigo-100">
                            <Send size={14} />
                            Candidature Expert
                        </div>
                        <h2 className="text-5xl font-black text-slate-900 tracking-tight">Entretien Préliminaire</h2>
                        <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto">
                            Répondez à {questions.length} questions rapides pour évaluer votre profil — cela prend moins de 3 minutes.
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <AnimatePresence mode="wait">

                            {/* INTRO */}
                            {step === 'intro' && (
                                <motion.div key="intro"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="bg-slate-900 rounded-[3rem] p-14 text-white text-center space-y-10 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-600/20 blur-[80px] -mr-20 -mt-20" />
                                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-600/10 blur-[80px] -ml-20 -mb-20" />
                                    <div className="relative z-10 space-y-8">
                                        <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-indigo-600/40">
                                            <Award size={40} />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-black mb-3">Prêt à rejoindre l&apos;équipe ?</h3>
                                            <p className="text-slate-400 text-lg font-medium leading-relaxed">
                                                Cet entretien est confidentiel. Il nous permet d&apos;évaluer votre profil pour trouver la meilleure collaboration possible.
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-center gap-8 text-sm text-slate-400">
                                            <div className="flex items-center gap-2"><CheckCircle size={16} className="text-indigo-400" /> {questions.length} questions</div>
                                            <div className="flex items-center gap-2"><CheckCircle size={16} className="text-indigo-400" /> ~3 minutes</div>
                                            <div className="flex items-center gap-2"><CheckCircle size={16} className="text-indigo-400" /> Confidentiel</div>
                                        </div>
                                        <button
                                            onClick={() => setStep('questions')}
                                            className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-black uppercase tracking-[0.2em] text-sm transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-indigo-600/30 flex items-center gap-3 mx-auto"
                                        >
                                            Commencer l&apos;entretien
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* QUESTIONS */}
                            {step === 'questions' && (
                                <motion.div key={`q-${currentQ}`}
                                    initial={{ opacity: 0, x: 40 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -40 }}
                                    className="space-y-8"
                                >
                                    {/* Progress bar */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm font-bold text-slate-500">
                                            <span>Question {currentQ + 1} / {questions.length}</span>
                                            <span>{Math.round(((currentQ) / questions.length) * 100)}% complété</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-indigo-600 rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${((currentQ) / questions.length) * 100}%` }}
                                                transition={{ duration: 0.4 }}
                                            />
                                        </div>
                                    </div>

                                    {/* Question card */}
                                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-12 shadow-2xl shadow-slate-200/60 space-y-8">
                                        <h3 className="text-2xl font-black text-slate-900 leading-tight">
                                            {questions[currentQ].q}
                                        </h3>
                                        <div className="space-y-4">
                                            {questions[currentQ].multiSelect ? (
                                                // Multi-select checkboxes
                                                <div className="space-y-3">
                                                    {questions[currentQ].opts.map((opt, i) => {
                                                        const isSelected = (multiSelectAnswers[currentQ] || []).includes(opt);
                                                        return (
                                                            <button
                                                                key={i}
                                                                type="button"
                                                                onClick={() => toggleMultiSelect(currentQ, opt)}
                                                                className={cn(
                                                                    "w-full text-left px-7 py-5 rounded-2xl border-2 font-bold text-base transition-all flex items-center gap-4",
                                                                    isSelected
                                                                        ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                                                                        : "border-slate-100 bg-slate-50 text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/50"
                                                                )}
                                                            >
                                                                <span className={cn(
                                                                    "w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all",
                                                                    isSelected ? "bg-indigo-600 border-indigo-600" : "bg-white border-slate-300"
                                                                )}>
                                                                    {isSelected && <CheckCircle size={14} className="text-white" />}
                                                                </span>
                                                                {opt}
                                                            </button>
                                                        );
                                                    })}
                                                    <p className="text-xs font-bold text-slate-400 text-center pt-2">Vous pouvez sélectionner plusieurs réponses</p>
                                                    
                                                    <button
                                                        onClick={handleMultiSelectConfirm}
                                                        disabled={(multiSelectAnswers[currentQ] || []).length === 0}
                                                        className="w-full mt-6 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.15em] text-sm hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                                    >
                                                        <CheckCircle size={18} />
                                                        Confirmer ma sélection ({(multiSelectAnswers[currentQ] || []).length})
                                                    </button>
                                                </div>
                                            ) : (
                                                // Single-select buttons
                                                <>
                                                    {questions[currentQ].opts.map((opt, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => handleAnswer(opt)}
                                                            className={cn(
                                                                "w-full text-left px-7 py-5 rounded-2xl border-2 font-bold text-base transition-all",
                                                                answers[currentQ] === opt
                                                                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                                                                    : "border-slate-100 bg-slate-50 text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/50"
                                                            )}
                                                        >
                                                            <span className="inline-flex items-center gap-4">
                                                                <span className="w-8 h-8 rounded-xl bg-white border-2 border-current flex items-center justify-center text-xs font-black shrink-0">
                                                                    {String.fromCharCode(65 + i)}
                                                                </span>
                                                                {opt}
                                                            </span>
                                                        </button>
                                                    ))}

                                                    {/* Autre option */}
                                                    {questions[currentQ].hasOther && (
                                                <div className="space-y-3">
                                                    <button
                                                        onClick={() => handleAnswer('Autre')}
                                                        className={cn(
                                                            "w-full text-left px-7 py-5 rounded-2xl border-2 font-bold text-base transition-all",
                                                            answers[currentQ] === 'Autre' || answers[currentQ]?.startsWith('Autre:')
                                                                ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                                                                : "border-dashed border-slate-300 bg-slate-50 text-slate-500 hover:border-indigo-300 hover:text-indigo-600"
                                                        )}
                                                    >
                                                        <span className="inline-flex items-center gap-4">
                                                            <span className="w-8 h-8 rounded-xl bg-white border-2 border-current flex items-center justify-center text-xs font-black shrink-0">
                                                                ✏️
                                                            </span>
                                                            Autre (préciser)
                                                        </span>
                                                    </button>

                                                    {(answers[currentQ] === 'Autre' || answers[currentQ]?.startsWith('Autre:')) && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -8 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="flex gap-3"
                                                        >
                                                            <input
                                                                autoFocus
                                                                type="text"
                                                                placeholder="Précisez votre réponse..."
                                                                value={otherText[currentQ] || ''}
                                                                onChange={e => setOtherText(o => ({...o, [currentQ]: e.target.value}))}
                                                                onKeyDown={e => e.key === 'Enter' && handleOtherConfirm()}
                                                                className="flex-1 px-5 py-3.5 bg-white border-2 border-indigo-200 rounded-2xl font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
                                                            />
                                                            <button
                                                                onClick={handleOtherConfirm}
                                                                disabled={!otherText[currentQ]?.trim()}
                                                                className="px-5 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                                            >
                                                                <ChevronRight size={18} />
                                                            </button>
                                                        </motion.div>
                                                    )}
                                                </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {currentQ > 0 && (
                                        <button
                                            onClick={() => setCurrentQ(q => q - 1)}
                                            className="text-sm font-bold text-slate-400 hover:text-slate-700 transition-colors"
                                        >
                                            ← Question précédente
                                        </button>
                                    )}
                                </motion.div>
                            )}

                            {/* FORM */}
                            {step === 'form' && (
                                <motion.div key="form"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="text-center space-y-3">
                                        <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto">
                                            <CheckCircle size={32} className="text-green-500" />
                                        </div>
                                        <h3 className="text-3xl font-black text-slate-900">Excellent ! Profil complété</h3>
                                        <p className="text-slate-500 font-medium">Une dernière étape — renseignez vos coordonnées pour que nous puissions vous contacter.</p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="bg-white border border-slate-100 rounded-[2.5rem] p-12 shadow-2xl shadow-slate-200/60 space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-500">Prénom</label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={formData.firstName}
                                                    onChange={e => setFormData(f => ({...f, firstName: e.target.value}))}
                                                    placeholder="Votre prénom"
                                                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-500">Nom</label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={formData.lastName}
                                                    onChange={e => setFormData(f => ({...f, lastName: e.target.value}))}
                                                    placeholder="Votre nom"
                                                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-500">Adresse Email</label>
                                            <input
                                                required
                                                type="email"
                                                value={formData.email}
                                                onChange={e => setFormData(f => ({...f, email: e.target.value}))}
                                                placeholder="votre@email.com"
                                                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-500">Numéro de Téléphone</label>
                                            <input
                                                required
                                                type="tel"
                                                value={formData.phone}
                                                onChange={e => setFormData(f => ({...f, phone: e.target.value}))}
                                                placeholder="+213 XX XX XX XX"
                                                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all"
                                            />
                                        </div>

                                        {/* Payment preference */}
                                        <div className="space-y-3">
                                            <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-500">Mode de rémunération souhaité</label>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                {[
                                                    { value: 'projet', label: 'Par projet', icon: '📦' },
                                                    { value: 'jour', label: 'Par jour', icon: '📅' },
                                                    { value: 'heure', label: 'Par heure', icon: '⏱️' },
                                                    { value: 'flexible', label: 'Flexible', icon: '🤝' },
                                                    { value: 'autre', label: 'Autre', icon: '✏️' },
                                                ].map(opt => (
                                                    <button
                                                        key={opt.value}
                                                        type="button"
                                                        onClick={() => setFormData(f => ({...f, paymentMode: opt.value, amount: ''}) )}
                                                        className={cn(
                                                            "flex flex-col items-center gap-1.5 px-4 py-4 rounded-2xl border-2 font-bold text-sm transition-all",
                                                            formData.paymentMode === opt.value
                                                                ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                                                                : "border-slate-100 bg-slate-50 text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/30"
                                                        )}
                                                    >
                                                        <span className="text-2xl">{opt.icon}</span>
                                                        <span className="text-xs font-black">{opt.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Amount */}
                                        {formData.paymentMode && formData.paymentMode !== 'flexible' && formData.paymentMode !== 'autre' && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="space-y-2"
                                            >
                                                <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-500">
                                                    Montant souhaité ({formData.paymentMode === 'projet' ? 'par projet' : formData.paymentMode === 'jour' ? 'par jour' : 'par heure'})
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        required
                                                        type="number"
                                                        min="0"
                                                        value={formData.amount}
                                                        onChange={e => setFormData(f => ({...f, amount: e.target.value}))}
                                                        placeholder="Ex: 5000"
                                                        className="w-full pl-5 pr-20 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all"
                                                    />
                                                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">DZD</span>
                                                </div>
                                            </motion.div>
                                        )}

                                        {formData.paymentMode === 'autre' && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="space-y-4"
                                            >
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-500">Précisez votre souhait</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        value={formData.paymentOther}
                                                        onChange={e => setFormData(f => ({...f, paymentOther: e.target.value}))}
                                                        placeholder="Ex: Forfait mensuel, Commission..."
                                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-500">Montant indicatif</label>
                                                    <div className="relative">
                                                        <input
                                                            required
                                                            type="number"
                                                            min="0"
                                                            value={formData.amount}
                                                            onChange={e => setFormData(f => ({...f, amount: e.target.value}))}
                                                            placeholder="Ex: 5000"
                                                            className="w-full pl-5 pr-20 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all"
                                                        />
                                                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">DZD</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {formData.paymentMode === 'flexible' && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="px-6 py-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 font-bold text-sm flex items-center gap-3"
                                            >
                                                <span className="text-xl">🤝</span>
                                                Parfait ! Nous discuterons des conditions ensemble lors du premier contact.
                                            </motion.div>
                                        )}


                                        <button
                                            type="submit"
                                            disabled={submitting || !formData.paymentMode}
                                            className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-sm hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/20 mt-10"
                                        >
                                            {submitting ? (
                                                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Envoi en cours...</>
                                            ) : (
                                                <>
                                                    Soumettre ma candidature
                                                    <Send size={18} />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </motion.div>
                            )}

                            {/* DONE */}
                            {step === 'done' && (
                                <motion.div key="done"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-slate-900 rounded-[3rem] p-16 text-white text-center space-y-8 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-indigo-500 via-blue-400 to-indigo-500" />
                                    <div className="w-24 h-24 bg-green-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-green-500/30">
                                        <CheckCircle size={48} />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black mb-3">Candidature envoyée !</h3>
                                        <p className="text-slate-400 text-lg font-medium leading-relaxed">
                                            Merci <strong className="text-white">{formData.firstName} {formData.lastName}</strong>.<br />
                                            Notre équipe examinera votre profil et vous contactera dans les meilleurs délais.
                                        </p>
                                    </div>
                                    <div className="text-indigo-400 text-sm font-bold tracking-widest uppercase">MA-TRAINING-CONSULTING — Équipe Experts</div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </section>

            </div>
        </div>
    );
}
