"use client";

import LegalDocument from "@/components/legal/LegalDocument";
import { useParams, notFound } from "next/navigation";
import { Check, X } from "lucide-react";

interface PlanFeature {
  name: string;
  included: boolean;
}

interface PlanData {
  title: string;
  subtitle: string;
  version: string;
  price: string;
  duration: string;
  features: PlanFeature[];
  content: string;
}

const plansData: Record<string, PlanData> = {
  explorer: {
    title: "Annexe : Formule Explorer",
    subtitle: "Détails de l'accès gratuit permanent à la plateforme.",
    version: "1.0",
    price: "0€ / Gratuit",
    duration: "Accès permanent",
    features: [
      { name: "Analyse CV (1 analyse)", included: true },
      { name: "Conseiller IA (3 questions/jour)", included: true },
      { name: "Bibliothèque d'Outils (3 modèles)", included: true },
      { name: "Centre de Connaissance (5 articles)", included: true },
      { name: "Roadmap de Carrière Basique", included: true },
      { name: "Job Alignment", included: false },
      { name: "Simulations Premium", included: false },
      { name: "Support Prioritaire", included: false }
    ],
    content: `
      La formule Explorer est conçue pour permettre aux utilisateurs de découvrir la valeur de la plateforme DIGITALISA sans engagement financier. 
      L'accès est maintenu tant que le compte est actif (connexion au moins une fois tous les 24 mois). 
      Les analyses et conseils IA sont limités par des quotas quotidiens ou totaux pour garantir la qualité de service pour tous.
    `
  },
  professional: {
    title: "Annexe : Formule Professional",
    subtitle: "Conditions spécifiques pour les professionnels en développement continu.",
    version: "1.2",
    price: "39€ / mois",
    duration: "Mensuel renouvelable / Annuel",
    features: [
      { name: "Analyse CV Illimitée", included: true },
      { name: "Conseiller IA Illimité 24/7", included: true },
      { name: "Bibliothèque Complète d'Outils", included: true },
      { name: "Job Alignment (1/mois gratuit)", included: true },
      { name: "Roadmap de Carrière Avancée", included: true },
      { name: "Simulations Premium (Paiement à l'unité)", included: true },
      { name: "Support Email (48h)", included: true }
    ],
    content: `
      La formule Professional offre un accès complet aux outils de diagnostic et de planification de carrière. 
      Elle inclut des quotas généreux pour l'utilisation de l'intelligence artificielle et permet d'accéder aux simulations de crise par un paiement à l'acte hautement préférentiel.
    `
  },
  executive: {
    title: "Annexe : Formule Executive 🔥",
    subtitle: "Les conditions de l'offre Best Value pour les leaders ambitieux.",
    version: "1.5",
    price: "80€ / mois (HT)",
    duration: "Mensuel renouvelable / Annuel",
    features: [
      { name: "Tout de Professional", included: true },
      { name: "Job Alignment ILLIMITÉ", included: true },
      { name: "2 Simulations gratuites / mois", included: true },
      { name: "1 Workshop gratuit / mois", included: true },
      { name: "Lettre de Recommandation Officielle", included: true },
      { name: "Rapport SCI Trimestriel", included: true },
      { name: "Session Consultation (30 min/mois)", included: true },
      { name: "Support Prioritaire (24h)", included: true }
    ],
    content: `
      La formule Executive est notre offre phare, offrant le meilleur rapport qualité-prix. 
      Elle combine la puissance de l'IA avec un accompagnement humain stratégique et l'accès régulier aux outils de simulation de haut niveau pour une préparation optimale aux enjeux de direction.
    `
  },
  elite: {
    title: "Annexe : Formule Elite 👑",
    subtitle: "Conditions de l'immersion totale VIP pour dirigeants.",
    version: "1.0",
    price: "199€ / mois",
    duration: "Mensuel renouvelable / Annuel",
    features: [
      { name: "Simulations ILLIMITÉES", included: true },
      { name: "Workshops ILLIMITÉS", included: true },
      { name: "4 Sessions Consultation Expert / mois", included: true },
      { name: "Expert Dédié Personnel", included: true },
      { name: "Support VIP 6h + WhatsApp Business", included: true },
      { name: "Révision LinkedIn Professionnelle", included: true },
      { name: "Coaching Négociation Salariale", included: true },
      { name: "Accès à Vie au Contenu", included: true }
    ],
    content: `
      La formule Elite représente le sommet de l'accompagnement DIGITALISA. 
      Elle est destinée aux dirigeants exigeant une réactivité totale, une expertise humaine dédiée et un accès sans limite à l'ensemble de notre écosystème de formation et de simulation.
    `
  }
};

export default function PlanDetailsPage() {
    const params = useParams();
    const slug = params.slug as string;
    const plan = plansData[slug];

    if (!plan) return notFound();

    return (
        <LegalDocument
            title={plan.title}
            subtitle={plan.subtitle}
            lastUpdated="09 Février 2026"
            version={plan.version}
        >
            <div className="grid md:grid-cols-2 gap-12 mb-16">
                <div>
                    <h2 className="text-xl font-bold mb-6">Conditions Financières</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-slate-500 font-medium">Prix de la formule</span>
                            <span className="font-bold text-slate-900 dark:text-white">{plan.price}</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-slate-500 font-medium">Engagement</span>
                            <span className="font-bold text-slate-900 dark:text-white">{plan.duration}</span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <h2 className="text-xl font-bold mb-6">Détail des Services</h2>
                    <div className="space-y-3">
                        {plan.features.map((feature: PlanFeature, idx: number) => (
                            <div key={idx} className="flex items-center gap-3">
                                {feature.included ? (
                                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                                ) : (
                                    <X className="w-4 h-4 text-slate-300 dark:text-slate-700 shrink-0" />
                                )}
                                <span className={`text-sm ${feature.included ? "text-slate-700 dark:text-slate-300 font-medium" : "text-slate-400 dark:text-slate-600 font-light"}`}>
                                    {feature.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Description des Prestations</h2>
                <div className="text-slate-600 dark:text-slate-400 space-y-4 leading-relaxed">
                    {plan.content}
                </div>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Garanties de Satisfaction</h2>
                <p>
                    Conformément à notre politique &quot;Satisfait ou Remboursé&quot;, vous disposez de 30 jours pour tester la formule {slug.toUpperCase()}. Si vous n&apos;êtes pas entièrement satisfait, vous pouvez demander le remboursement intégral (hors services additionnels consommés).
                </p>
            </section>

            <div className="mt-16 p-8 bg-slate-900 dark:bg-white rounded-3xl text-white dark:text-slate-900 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                    <h3 className="text-xl font-bold mb-2">Prêt à propulser votre carrière ?</h3>
                    <p className="opacity-70 text-sm">Activez votre formule {plan.title.split(":")[1]} dès maintenant.</p>
                </div>
                <button className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                    Souscrire maintenant
                </button>
            </div>
        </LegalDocument>
    );
}
