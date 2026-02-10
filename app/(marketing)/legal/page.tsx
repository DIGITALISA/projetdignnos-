"use client";

import { motion } from "framer-motion";
import { Shield, Scale, Lock, FileText, CheckCircle, ArrowRight, Building2, Gavel } from "lucide-react";
import Link from "next/link";

const legalSections = [
  {
    title: "Conditions et Termes",
    icon: Scale,
    color: "blue",
    links: [
      { name: "Conditions Générales d'Utilisation (CGU)", href: "/legal/terms", desc: "Règles d'accès et d'utilisation de la plateforme." },
      { name: "Contrat de Service Cadre", href: "/legal/service-agreement", desc: "Le contrat principal régissant nos prestations." }
    ]
  },
  {
    title: "Confidentialité et Données",
    icon: Lock,
    color: "emerald",
    links: [
      { name: "Politique de Confidentialité (RGPD)", href: "/legal/privacy", desc: "Comment nous protégeons vos données personnelles." },
      { name: "Politique des Cookies", href: "/legal/privacy#cookies", desc: "Informations sur l'utilisation des traceurs." }
    ]
  },
  {
    title: "Détails des Formules",
    icon: FileText,
    color: "amber",
    links: [
      { name: "Formule Explorer", href: "/legal/plans/explorer", desc: "Détails de l'accès gratuit permanent." },
      { name: "Formule Professional", href: "/legal/plans/professional", desc: "Détails du pack pour les cadres." },
      { name: "Formule Executive", href: "/legal/plans/executive", desc: "Détails de notre offre Best Value." },
      { name: "Formule Elite", href: "/legal/plans/elite", desc: "Détails de l'immersion totale VIP." }
    ]
  }
];

export default function LegalCenterHub() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-5 pointer-events-none">
          <Building2 size={600} className="mx-auto" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-blue-100 dark:border-blue-800"
            >
                <Shield size={14} className="fill-current" />
                Protection & Transparence Juridique
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white mb-6">
                Centre <span className="text-blue-600">Juridique</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
                Retrouvez tous les documents contractuels, politiques de confidentialité et conditions d&apos;utilisation qui garantissent la sécurité de votre parcours chez DIGITALISA.
            </p>
        </div>
      </section>

      {/* Grid of Sections */}
      <section className="container mx-auto px-6 max-w-6xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {legalSections.map((section, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50"
                >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-${section.color}-50 text-${section.color}-600 dark:bg-${section.color}-900/20 dark:text-${section.color}-400`}>
                        <section.icon size={24} />
                    </div>
                    
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{section.title}</h2>
                    
                    <div className="space-y-6">
                        {section.links.map((link, lIdx) => (
                            <Link 
                                key={lIdx} 
                                href={link.href}
                                className="group block"
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                        {link.name}
                                    </h3>
                                    <ArrowRight size={14} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                                    {link.desc}
                                </p>
                            </Link>
                        ))}
                    </div>
                </motion.div>
            ))}
        </div>
      </section>

      {/* Footer Info */}
      <section className="container mx-auto px-6 max-w-4xl mt-20 text-center">
        <div className="bg-slate-900 dark:bg-slate-800 rounded-[2.5rem] p-10 md:p-16 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-12 opacity-10">
                <Gavel size={300} />
            </div>
            
            <div className="relative z-10">
                <CheckCircle className="mx-auto mb-6 text-blue-400" size={48} />
                <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6">Engagement de Conformité</h2>
                <p className="text-slate-300 text-lg font-light leading-relaxed mb-10 max-w-2xl mx-auto">
                    Tous nos documents sont conformes aux régulations RGPD européennes et aux standards du droit commercial international. Nous mettons à jour ces textes régulièrement pour refléter les évolutions technologiques et légales.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <div className="px-6 py-3 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest border border-white/10">
                        RGPD Compliance
                    </div>
                    <div className="px-6 py-3 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest border border-white/10">
                        Secure Data
                    </div>
                    <div className="px-6 py-3 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest border border-white/10">
                        Verified Identity
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Quick Contact */}
      <div className="mt-20 text-center">
        <p className="text-slate-400 text-sm mb-4">
            Une question juridique spécifique ?
        </p>
        <a 
            href="mailto:legal@ma-training-consulting.com" 
            className="text-blue-600 font-bold hover:underline"
        >
            legal@ma-training-consulting.com
        </a>
      </div>
    </div>
  );
}
