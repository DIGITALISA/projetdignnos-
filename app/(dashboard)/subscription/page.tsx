"use client";

import { motion } from "framer-motion";
import { Check, Zap, Crown, Shield, ArrowRight, Star, Clock, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const plans = [
    {
        name: "Pack Initial",
        badge: "Découverte",
        price: "Gratuit",
        duration: "Accès 3 heures",
        description: "Idéal pour tester l'interface et découvrir la puissance du protocole.",
        features: [
            "Accès complet pendant 3 heures",
            "Audit initial IA (CV & Profil)",
            "Accès aux Simulations (Limité)",
            "Accès aux Workshops (Limité)",
            "Assistance communautaire"
        ],
        type: "Free Trial",
        color: "slate",
        icon: Clock
    },
    {
        name: "Pack Pro Essential",
        badge: "Sélection Executive",
        price: "30€",
        duration: "/ par an",
        description: "Pour les cadres souhaitant garder leurs outils IA à portée de main toute l'année.",
        features: [
            "Outils Audit IA (Utilisation illimitée)",
            "Accès aux outils AI Advisor & Mentor",
            "Simulations (Payantes à l'unité)",
            "Workshops (Payants à l'unité)",
            "Mise à jour régulière des contenus"
        ],
        type: "Pro Essential",
        color: "blue",
        icon: Zap,
        popular: true
    },
    {
        name: "Elite Full Pack",
        badge: "Immersion Totale",
        price: "65€",
        duration: "/ par mois",
        description: "L'accompagnement haut de gamme pour une transformation de carrière radicale.",
        features: [
            "Simulation & Coaching Illimité",
            "Tous les Workshops Exécutifs inclus",
            "Accompagnement Expert Dédié (1-on-1)",
            "Lettre de Recommandation Elite",
            "Conseil Stratégique Hebdomadaire",
            "Engagement de 12 mois requis"
        ],
        type: "Elite Full Pack",
        color: "amber",
        icon: Crown
    }
];

export default function SubscriptionPage() {
    const [userProfile, setUserProfile] = useState<any>(null);

    useEffect(() => {
        const saved = localStorage.getItem("userProfile");
        if (saved) setUserProfile(JSON.parse(saved));
    }, []);

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20 p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-blue-100"
                    >
                        <Star size={14} className="fill-current" />
                        Options de Mandat Stratégique
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                        Propulsez votre <span className="text-blue-600">Carrière</span>
                    </h1>
                    <p className="text-slate-500 font-medium max-w-2xl mx-auto text-lg leading-relaxed">
                        Chaque pack est conçu pour répondre à un niveau d'exigence spécifique. Choisissez le protocole qui correspond à vos ambitions.
                    </p>
                </div>

                {/* Plans Grid */}
                <div className="grid lg:grid-cols-3 gap-8 items-stretch">
                    {plans.map((plan, idx) => {
                        const isCurrent = userProfile?.role === plan.type || (plan.type === 'Free Trial' && userProfile?.role === 'Trial User');

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={cn(
                                    "relative bg-white rounded-[2.5rem] p-10 flex flex-col border transition-all duration-500 hover:shadow-2xl",
                                    plan.popular ? "border-blue-500 shadow-xl shadow-blue-500/10 ring-4 ring-blue-50" : "border-slate-100 shadow-lg shadow-slate-200/50",
                                    isCurrent && "border-slate-900 ring-4 ring-slate-100"
                                )}
                            >
                                {plan.popular && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                        Recommandé
                                    </div>
                                )}

                                {isCurrent && (
                                    <div className="absolute -top-4 -right-2 bg-slate-900 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg">
                                        <Check size={12} />
                                        Votre Pack Actuel
                                    </div>
                                )}

                                <div className="mb-8">
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner transition-transform group-hover:scale-110",
                                        plan.color === 'blue' ? "bg-blue-50 text-blue-600" :
                                            plan.color === 'amber' ? "bg-amber-50 text-amber-600" :
                                                "bg-slate-50 text-slate-600"
                                    )}>
                                        <plan.icon size={28} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">
                                        {plan.badge}
                                    </span>
                                    <h3 className="text-2xl font-black text-slate-900 mb-4">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                                        <span className="text-slate-400 font-bold text-sm tracking-tight">{plan.duration}</span>
                                    </div>
                                </div>

                                <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">
                                    {plan.description}
                                </p>

                                <div className="space-y-4 mb-10 flex-1">
                                    {plan.features.map((feature, fIdx) => (
                                        <div key={fIdx} className="flex items-start gap-3">
                                            <div className={cn(
                                                "w-5 h-5 rounded-full flex items-center justify-center mt-0.5 shrink-0",
                                                plan.color === 'blue' ? "bg-blue-100 text-blue-600" :
                                                    plan.color === 'amber' ? "bg-amber-100 text-amber-600" :
                                                        "bg-slate-100 text-slate-600"
                                            )}>
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                            <span className="text-sm font-bold text-slate-600 tracking-tight leading-snug">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => alert("Contactez l'administration pour changer de pack.")}
                                    className={cn(
                                        "w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl",
                                        isCurrent ? "bg-slate-100 text-slate-400 cursor-not-allowed" :
                                            plan.color === 'blue' ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20" :
                                                plan.color === 'amber' ? "bg-slate-900 hover:bg-black text-white shadow-slate-900/20" :
                                                    "bg-white border-2 border-slate-100 text-slate-900 hover:bg-slate-50"
                                    )}
                                >
                                    {isCurrent ? "Mandat Actif" : "S'inscrire Maintenant"}
                                    {!isCurrent && <ArrowRight size={16} />}
                                </button>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Security Footer */}
                <div className="mt-20 pt-12 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-8 opacity-60">
                    <div className="flex items-center gap-3">
                        <Shield className="text-blue-600" size={20} />
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center md:text-left">
                            Paiements 100% Sécurisés & Facturation Exécutive
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <Globe size={18} className="text-slate-400" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            © 2026 DIGITALISA - PROTOCOLE DIGNNOS-
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
