"use client";

import { motion } from "framer-motion";
import { 
    Check, 
    Shield, 
    Zap, 
    Sparkles, 
    ArrowRight, 
    Crown
} from "lucide-react";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface SubscriptionPlan {
    id: string;
    level: string;
    price: string;
    period: string;
    color: string;
    accent: string;
    glow: string;
    features: string[];
    recommended?: boolean;
    cta: string;
}

export default function ProfessionalSubscriptionsPage() {
    const { language, dir } = useLanguage();
    const isRtl = dir === 'rtl';
    const lang = language as "ar" | "en" | "fr";

    const [activeTab, setActiveTab] = useState<"annual" | "monthly">("annual");

    const trans = {
        ar: {
            title: "عضوية الكفاءة التنفيذية",
            subtitle: "اختر المستوى الاستراتيجي المناسب لمسارك المهني. حلول ذكية مدعومة بالذكاء الاصطناعي وخبرات الخبراء.",
            annual: "سنوي (توفير 20%)",
            monthly: "شهري",
            plans: {
                pro: { 
                    level: "تفعيل مهني (Pro)", 
                    price: "499", 
                    period: "/ سنوي", 
                    features: ["تشخيص مهني ذكي (AI)", "خارطة طريق مهنية أولية", "وحدات تعلم استراتيجية", "وصول للقواعد المعرفية"],
                    cta: "بدء التفعيل المهني"
                },
                exec: { 
                    level: "التوجيه التنفيذي (Executive)", 
                    price: "999", 
                    period: "/ سنوي", 
                    features: ["مجلس الخبراء كامل (4 خبراء)", "استوديو الهوية (سيرة ومحفظة)", "تقرير الذكاء الاستراتيجي SCI", "ورش عمل مجموعات مصغرة"],
                    cta: "انضمام كعضو تنفيذي"
                },
                board: { 
                    level: "عضوية مجلس الإدارة (Board)", 
                    price: "2499", 
                    period: "/ سنوي", 
                    features: ["محاكاة أدوار فردية (One-on-One)", "كوتشينغ مهني شخصي 24/7", "تقرير ملاءمة وظيفية مفصل", "وصول حصري للفرص الاستراتيجية"],
                    cta: "ترقية للمستوى الأعلى"
                }
            },
            methodology: "منهجية العمل الاستراتيجي",
            guarantee: "ضمان الجودة: بروتوكول التشخيص المهني المعتمد دولياً."
        },
        en: {
            title: "Executive Excellence Membership",
            subtitle: "Select the strategic level that fits your career path. Smart solutions powered by AI and expert insights.",
            annual: "Annual (Save 20%)",
            monthly: "Monthly",
            plans: {
                pro: { 
                    level: "Pro Activation", 
                    price: "499", 
                    period: "/ year", 
                    features: ["AI Professional Diagnosis", "Initial Career Roadmap", "Strategic Learning Modules", "Knowledge Base Access"],
                    cta: "Start Pro Activation"
                },
                exec: { 
                    level: "Executive Coaching", 
                    price: "999", 
                    period: "/ year", 
                    features: ["Full Advisory Board (4 Experts)", "Identity Studio Access", "SCI Strategic Report", "Small Group Workshops"],
                    cta: "Join as Executive Member"
                },
                board: { 
                    level: "Board Member Tier", 
                    price: "2499", 
                    period: "/ year", 
                    features: ["One-on-One Simulations", "24/7 Personal Coaching", "Detailed Suitability Audit", "Exclusive Strategy Opportunities"],
                    cta: "Upgrade to Board Tier"
                }
            },
            methodology: "Strategic Workflow",
            guarantee: "Quality Guarantee: Internationally recognized diagnosis protocol."
        },
        fr: {
            title: "Adhésion Excellence Exécutive",
            subtitle: "Choisissez le niveau stratégique adapté à votre carrière. Solutions IA et expertise de pointe.",
            annual: "Annuel (-20%)",
            monthly: "Mensuel",
            plans: {
                pro: { 
                    level: "Activation Pro", 
                    price: "499", 
                    period: "/ an", 
                    features: ["Diagnostic IA Professionnel", "Roadmap de Carrière Initiale", "Modules d'Apprentissage", "Accès Base de Connaissances"],
                    cta: "Démarrer l'activation"
                },
                exec: { 
                    level: "Coaching Exécutif", 
                    price: "999", 
                    period: "/ an", 
                    features: ["Comité d'Experts (4 IA)", "Accès Identity Studio", "Rapport Stratégique SCI", "Ateliers en petits groupes"],
                    cta: "Devenir Membre Exécutif"
                },
                board: { 
                    level: "Niveau Board Member", 
                    price: "2499", 
                    period: "/ an", 
                    features: ["Simulations One-on-One", "Coaching Personnel 24/7", "Audit de Conformité Détaillé", "Opportunités Stratégiques"],
                    cta: "Passer au Niveau Board"
                }
            },
            methodology: "Méthodologie Stratégique",
            guarantee: "Garantie Qualité : Protocole de diagnostic reconnu à l'international."
        }
    }[lang];

    const plans: SubscriptionPlan[] = [
        {
            id: "pro",
            level: trans.plans.pro.level,
            price: trans.plans.pro.price,
            period: trans.plans.pro.period,
            color: "text-blue-400",
            accent: "bg-blue-600",
            glow: "shadow-blue-500/20",
            features: trans.plans.pro.features,
            cta: trans.plans.pro.cta
        },
        {
            id: "exec",
            level: trans.plans.exec.level,
            price: trans.plans.exec.price,
            period: trans.plans.exec.period,
            color: "text-indigo-400",
            accent: "bg-indigo-600",
            glow: "shadow-indigo-500/30",
            features: trans.plans.exec.features,
            recommended: true,
            cta: trans.plans.exec.cta
        },
        {
            id: "board",
            level: trans.plans.board.level,
            price: trans.plans.board.price,
            period: trans.plans.board.period,
            color: "text-amber-400",
            accent: "bg-amber-600",
            glow: "shadow-amber-500/20",
            features: trans.plans.board.features,
            cta: trans.plans.board.cta
        }
    ];

    return (
        <div className={cn("min-h-screen bg-slate-950 px-6 py-16 md:py-24 space-y-20 pb-40", isRtl && "text-right")}>
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[200px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[200px] rounded-full" />
            </div>

            {/* Header */}
            <div className="relative z-10 text-center max-w-4xl mx-auto space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 font-black text-xs uppercase tracking-widest shadow-lg"
                >
                    <Crown size={18} />
                    {lang === 'ar' ? 'باقات المحترفين والقياديين' : 'Professional & Executive Tiers'}
                </motion.div>
                
                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
                    {trans.title}
                </h1>
                
                <p className="text-slate-400 font-medium text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                    {trans.subtitle}
                </p>

                {/* Billing Toggle */}
                <div className="flex items-center justify-center gap-4 mt-12 bg-slate-900 border border-white/5 p-2 rounded-2xl w-fit mx-auto shadow-2xl">
                    <button 
                        onClick={() => setActiveTab("monthly")}
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                            activeTab === "monthly" ? "bg-white/10 text-white shadow-inner" : "text-slate-500"
                        )}
                    >
                        {trans.monthly}
                    </button>
                    <button 
                        onClick={() => setActiveTab("annual")}
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all relative group",
                            activeTab === "annual" ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" : "text-slate-500"
                        )}
                    >
                        {trans.annual}
                    </button>
                </div>
            </div>

            {/* Plans Grid */}
            <div className="grid lg:grid-cols-3 gap-10 max-w-7xl mx-auto relative z-10">
                {plans.map((plan, idx) => (
                    <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ y: -10 }}
                        className={cn(
                            "relative overflow-hidden group p-1 bg-linear-to-b from-white/10 to-transparent rounded-[3.5rem] shadow-2xl transition-all",
                            plan.recommended && "from-indigo-500/40"
                        )}
                    >
                        <div className="bg-slate-900 rounded-[3.4rem] p-10 h-full flex flex-col items-center text-center">
                            {plan.recommended && (
                                <div className="absolute top-8 right-8 px-4 py-1.5 bg-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg">
                                    Recommended
                                </div>
                            )}

                            <div className={cn(`w-20 h-20 rounded-3xl flex items-center justify-center mb-10 border border-white/5 bg-slate-800 shadow-inner group-hover:scale-110 transition-transform ${plan.color}`)}>
                                {plan.id === "pro" && <Zap size={32} />}
                                {plan.id === "exec" && <Sparkles size={32} />}
                                {plan.id === "board" && <Crown size={32} />}
                            </div>

                            <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">{plan.level}</h3>
                            
                            <div className="flex items-baseline gap-1 mb-10">
                                <span className="text-4xl md:text-5xl font-black text-white tracking-widest">${plan.price}</span>
                                <span className="text-slate-500 font-bold text-sm">{plan.period}</span>
                            </div>

                            <div className="w-full flex-1 space-y-6 mb-12">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className={cn("flex items-center gap-4 text-left", isRtl && "flex-row-reverse")}>
                                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 shrink-0">
                                            <Check size={12} strokeWidth={4} />
                                        </div>
                                        <span className="text-sm font-bold text-slate-400 group-hover:text-slate-200 transition-colors whitespace-normal">
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <button className={cn(
                                "w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3",
                                plan.recommended 
                                    ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30" 
                                    : "bg-slate-800 hover:bg-slate-750 text-white border border-white/5"
                            )}>
                                {plan.cta}
                                <ArrowRight size={18} className={cn("group-hover:translate-x-1 transition-transform", isRtl && "rotate-180")} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Trust Footer */}
            <div className="text-center space-y-8 relative z-10 max-w-2xl mx-auto">
                <div className="h-px bg-linear-to-r from-transparent via-white/5 to-transparent w-full mb-12" />
                <div className="flex items-center justify-center gap-6 opacity-40">
                    <Shield className="text-indigo-400" />
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] max-w-sm">
                        {trans.guarantee}
                    </p>
                </div>
            </div>
        </div>
    );
}
