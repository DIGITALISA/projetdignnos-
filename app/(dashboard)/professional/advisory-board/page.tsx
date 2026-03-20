"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    Users,
    Briefcase,
    Megaphone,
    Cpu,
    ChessKnight,
    ArrowRight,
    Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface ExpertProfile {
    id: string;
    icon: React.ElementType;
    title: { ar: string; en: string; fr: string };
    role: { ar: string; en: string; fr: string };
    description: { ar: string; en: string; fr: string };
    color: string;
    bgColor: string;
}

const experts: ExpertProfile[] = [
    {
        id: "hr",
        icon: Briefcase,
        title: {
            ar: "د. سالم - خبير الموارد ومسارات العمل",
            en: "Dr. Salem - HR & Career Transition Strategist",
            fr: "Dr. Salem - Stratège RH & Transition de Carrière"
        },
        role: {
            ar: "استشاري الموارد البشرية",
            en: "HR Consultant",
            fr: "Consultant RH"
        },
        description: {
            ar: "متخصص في التفاوض على الراتب، تغيير المسار المهني، وتحليل المخاطر قبل الاستقالة. يوجهك خطوة بخطوة بناءً على تقييمك.",
            en: "Specializes in salary negotiation, career pivots, and pre-resignation risk analysis. Guides you step-by-step based on your diagnosis.",
            fr: "Spécialisé dans la négociation de salaire, les pivots de carrière et l'analyse des risques avant démission."
        },
        color: "text-blue-400",
        bgColor: "bg-blue-500/10"
    },
    {
        id: "branding",
        icon: Megaphone,
        title: {
            ar: "أ. ندى - خبيرة التسويق الذاتي وبناء الهوية",
            en: "Ms. Nada - Personal Branding Expert",
            fr: "Mme. Nada - Experte en Personal Branding"
        },
        role: {
            ar: "استشاري التسويق الشخصي",
            en: "Brand Consultant",
            fr: "Consultante en Marque"
        },
        description: {
            ar: "تساعدك على بناء هويتك الرقمية (LinkedIn)، وضع استراتيجيات لتسويق مهاراتك بشكل احترافي، ورفع قيمتك السوقية.",
            en: "Helps you build your digital identity (LinkedIn), strategize how to market your skills, and increase your market value.",
            fr: "Vous aide à construire votre identité numérique, à élaborer des stratégies pour commercialiser vos compétences."
        },
        color: "text-rose-400",
        bgColor: "bg-rose-500/10"
    },
    {
        id: "technical",
        icon: Cpu,
        title: {
            ar: "م. طارق - المستشار المعرفي والتقني",
            en: "Eng. Tarek - Technical & Domain Mentor",
            fr: "Ing. Tarek - Mentor Technique et Domaine"
        },
        role: {
            ar: "مدرب تقني ومعرفي",
            en: "Technical Trainer",
            fr: "Formateur Technique"
        },
        description: {
            ar: "مكتبتك الخاصة. يشرح المفاهيم المعقدة، يدلّك على أفضل الممارسات التقنية، ويساعدك في فهم أي استراتيجية تقنية أو منهجية عمل.",
            en: "Your personal library. Explains complex concepts, points you to technical best practices, and helps you understand any methodology.",
            fr: "Votre bibliothèque privée. Explique les concepts complexes et vous guide vers les meilleures pratiques."
        },
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/10"
    },
    {
        id: "strategic",
        icon: ChessKnight,
        title: {
            ar: "د. عمر - الخبير الاستراتيجي التنفيذي",
            en: "Dr. Omar - Executive Strategy Solver",
            fr: "Dr. Omar - Stratège Exécutif"
        },
        role: {
            ar: "محلل أزمات واستراتيجي",
            en: "Crisis Solver & Strategist",
            fr: "Analyste de Crise & Stratège"
        },
        description: {
            ar: "لحالات الطوارئ والمواقف المعقدة. اطلب منه استراتيجية لرفع المردودية وسيسألك عدة أسئلة ليصمم لك خطة عمل جراحية وشاملة.",
            en: "For emergencies and complex situations. Ask him for a strategy to boost productivity, and he will map out a comprehensive action plan.",
            fr: "Pour les urgences et situations complexes. Demandez-lui une stratégie pour stimuler la productivité."
        },
        color: "text-amber-400",
        bgColor: "bg-amber-500/10"
    }
];

export default function AdvisoryBoardLobby() {
    const { language, dir } = useLanguage();
    const isRtl = dir === 'rtl';
    const lang = language as 'ar' | 'en' | 'fr';

    const trans = {
        ar: {
            title: "مجلس الخبراء",
            subtitle: "أربعة عقليات فذة من الذكاء الاصطناعي مبرمجة لخدمة مسارك المهني. يتوفر لديهم وصول كامل لتشخيصك السري لتقديم استشارات دقيقة ومباشرة.",
            badge: "غرفة القيادة",
            consult: "ابدأ الاستشارة",
            expert: "خبير مرخص"
        },
        en: {
            title: "The Advisory Board",
            subtitle: "Four elite AI minds programmed to serve your career path. They possess full access to your confidential diagnosis to provide precise consulting.",
            badge: "The War Room",
            consult: "Start Consultation",
            expert: "Certified Expert"
        },
        fr: {
            title: "Comité d'Experts",
            subtitle: "Quatre esprits d'élite IA programmés pour servir votre carrière. Ils ont un accès complet à votre diagnostic confidentiel.",
            badge: "Salle de Commandement",
            consult: "Commencer la Consultation",
            expert: "Expert Certifié"
        }
    }[lang];

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-16 pb-32">
            {/* Header */}
            <header className={cn("flex flex-col md:flex-row md:items-end justify-between gap-6", isRtl ? 'md:flex-row-reverse' : '')}>
                <div className={cn("space-y-4 max-w-3xl", isRtl ? 'text-right' : 'text-left')}>
                    <div className={cn("inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 font-black text-[10px] uppercase tracking-widest shadow-sm", isRtl ? 'flex-row-reverse' : '')}>
                        <Users size={14} />
                        {trans.badge}
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none uppercase">
                        {trans.title}
                    </h1>
                    <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed">
                        {trans.subtitle}
                    </p>
                </div>
            </header>

            {/* Experts Grid */}
            <div className="grid md:grid-cols-2 gap-8">
                {experts.map((exp, idx) => (
                    <motion.div
                        key={exp.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={cn(
                            "group relative flex flex-col bg-slate-950 border border-slate-800 p-10 rounded-[2.5rem] hover:bg-slate-900 transition-all duration-500 shadow-2xl hover:shadow-indigo-500/10 overflow-hidden",
                            isRtl ? "text-right" : "text-left"
                        )}
                    >
                        {/* Background Glow */}
                        <div className={cn("absolute top-0 right-0 w-64 h-64 opacity-5 blur-3xl pointer-events-none rounded-full", exp.bgColor)} />

                        <div className={cn("flex items-start justify-between mb-8", isRtl && "flex-row-reverse")}>
                            <div className={cn(`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl ${exp.bgColor} border border-white/5`)}>
                                <exp.icon className={cn("w-8 h-8", exp.color)} />
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{trans.expert}</span>
                            </div>
                        </div>

                        <div className="space-y-4 flex-1 relative z-10">
                            <h3 className="text-2xl font-black text-white leading-tight tracking-tight">{exp.title[lang]}</h3>
                            <h4 className={cn("text-xs font-black uppercase tracking-widest", exp.color)}>
                                {exp.role[lang]}
                            </h4>
                            <p className="text-slate-400 font-medium leading-relaxed text-sm pt-4 border-t border-white/10">
                                {exp.description[lang]}
                            </p>
                        </div>

                        <Link
                            href={`/professional/advisory-board/${exp.id}`}
                            className={cn(
                                "mt-10 w-full px-6 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black transition-all flex items-center justify-center gap-3 hover:bg-white hover:text-slate-950 active:scale-95", 
                                isRtl && "flex-row-reverse"
                            )}
                        >
                            {trans.consult}
                            <ArrowRight size={18} className={cn("group-hover:translate-x-1 transition-transform", isRtl && "rotate-180 group-hover:-translate-x-1")} />
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
