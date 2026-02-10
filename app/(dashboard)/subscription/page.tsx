"use client";

import { motion } from "framer-motion";
import { Check, Zap, Crown, Shield, ArrowRight, Star, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const plans = [
    {
        name: "Explorer",
        badge: "Découverte",
        price: "Gratuit",
        duration: "Accès permanent",
        description: "Idéal pour découvrir la plateforme et explorer vos premières opportunités.",
        features: [
            "1 Analyse CV complète (AI-powered)",
            "3 questions/jour au Conseiller IA",
            "Accès à 3 modèles professionnels",
            "5 articles du Centre de Connaissance",
            "Roadmap de carrière basique",
            "Badge Explorer sur votre profil"
        ],
        type: "Explorer",
        color: "slate",
        icon: Globe
    },
    {
        name: "Professional",
        badge: "Pour les Professionnels",
        price: "39€",
        duration: "/ mois",
        priceYearly: "399€/an",
        savings: "Économisez 69€",
        description: "Pour les professionnels ambitieux qui veulent un développement continu.",
        features: [
            "Analyse CV illimitée",
            "Conseiller IA illimité 24/7",
            "Bibliothèque complète d'outils",
            "1 Job Alignment gratuit/mois",
            "Simulations (149€/unité)",
            "Workshops (49€-99€/unité)",
            "Support email (48h)",
            "Badge Professional"
        ],
        type: "Professional",
        color: "blue",
        icon: Zap,
        popular: false
    },
    {
        name: "Executive",
        badge: "Best Value 🔥",
        price: "79€",
        duration: "/ mois",
        priceYearly: "799€/an",
        savings: "Économisez 149€",
        description: "Le choix idéal pour les leaders ambitieux qui visent l'excellence.",
        features: [
            "Tout de Professional +",
            "Job Alignment illimité",
            "2 Simulations gratuites/mois",
            "1 Workshop gratuit/mois",
            "Lettre de Recommandation officielle",
            "Rapport SCI (Strategic Career Intelligence)",
            "1 Session de conseil/mois (30min)",
            "Support prioritaire (24h)",
            "Badge Executive doré",
            "Accès anticipé aux nouvelles fonctionnalités"
        ],
        type: "Executive",
        color: "indigo",
        icon: Star,
        popular: true
    },
    {
        name: "Elite",
        badge: "VIP Total Immersion",
        price: "199€",
        duration: "/ mois",
        priceYearly: "1,999€/an",
        savings: "Économisez 389€",
        description: "L'accompagnement VIP complet pour les dirigeants et cadres supérieurs.",
        features: [
            "Tout de Executive +",
            "Simulations illimitées",
            "Workshops illimités",
            "4 Sessions de conseil/mois (1h chacune)",
            "Expert dédié personnel",
            "Support VIP (6h + WhatsApp)",
            "Rapports mensuels personnalisés",
            "Révision LinkedIn Profile",
            "Coaching négociation salariale",
            "Badge Elite platine",
            "Invitations événements exclusifs",
            "Accès à vie au contenu (même après annulation)"
        ],
        type: "Elite",
        color: "amber",
        icon: Crown
    }
];

interface UserProfile {
    role: string;
    [key: string]: unknown;
}

export default function SubscriptionPage() {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        // Use Promise to move state update out of synchronous effect execution
        // to avoid "cascading renders" lint error
        Promise.resolve().then(() => {
            const saved = localStorage.getItem("userProfile");
            if (saved) {
                try {
                    setUserProfile(JSON.parse(saved));
                } catch (e) {
                    console.error("Error parsing user profile", e);
                }
            }
        });
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
                        Chaque pack est conçu pour répondre à un niveau d&apos;exigence spécifique. Choisissez le protocole qui correspond à vos ambitions.
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
                                    plan.popular ? "border-indigo-500 shadow-xl shadow-indigo-500/10 ring-4 ring-indigo-50" : "border-slate-100 shadow-lg shadow-slate-200/50",
                                    isCurrent && "border-slate-900 ring-4 ring-slate-100"
                                )}
                            >
                                {plan.popular && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                        Best Value 🔥
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
                                            plan.color === 'indigo' ? "bg-indigo-50 text-indigo-600" :
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
                                                    plan.color === 'indigo' ? "bg-indigo-100 text-indigo-600" :
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
                                                plan.color === 'indigo' ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20" :
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
