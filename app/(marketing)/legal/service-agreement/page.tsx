"use client";

import LegalDocument from "@/components/legal/LegalDocument";

export default function ServiceAgreementPage() {
    return (
        <LegalDocument
            title="Contrat de Services Professionnels"
            subtitle="Modèle de référence pour les engagements contractuels entre DIGITALISA et ses clients."
            lastUpdated="09 Février 2026"
            version="1.0"
        >
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 p-6 rounded-xl mb-12 text-blue-800 dark:text-blue-300">
                <p className="text-sm font-medium italic">
                    Note : Ce document constitue le contrat-cadre. Les conditions spécifiques à votre formule (Explorer, Professional, Executive ou Elite) sont détaillées dans les annexes respectives.
                </p>
            </div>

            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Préambule</h2>
                <p>
                    Le PRESTATAIRE (DIGITALISA - MA-TRAINING-CONSULTING) est une société spécialisée dans l&apos;accompagnement stratégique de carrière pour cadres et dirigeants, proposant des services de conseil, formation, simulation de crise, et intelligence artificielle appliquée au développement professionnel.
                </p>
                <p>
                    Le CLIENT souhaite bénéficier des services du PRESTATAIRE dans le cadre de son développement de carrière et de ses compétences managériales.
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Article 1 - Objet du Contrat</h2>
                <p>
                    Le présent contrat a pour objet de définir les conditions dans lesquelles le PRESTATAIRE s&apos;engage à fournir au CLIENT les services d&apos;accompagnement décrits dans la formule choisie.
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>Plateforme en ligne : Accessible 24/7.</li>
                    <li>Support technique : Selon niveau de formule.</li>
                    <li>Expertise IA : Protocoles de diagnostic et simulation.</li>
                </ul>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Article 2 - Durée du Contrat</h2>
                <p>
                    Le présent contrat est conclu pour une durée déterminée par la formule souscrite à compter de la date de signature électronique.
                </p>
                <p className="mt-4">
                    Le contrat peut être à durée indéterminée avec renouvellement automatique mensuel ou à durée déterminée annuelle selon l&apos;option choisie par le CLIENT.
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Article 3 - Conditions Financières</h2>
                <p>
                    Les prix sont fixés selon le tarif en vigueur au jour de la souscription. Le règlement s&apos;effectue par voie électronique sécurisée.
                </p>
                <p className="mt-4">
                    Toute facture impayée entraîne la suspension immédiate des services après une relance infructueuse.
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Article 4 - Obligations du Prestataire</h2>
                <p>
                    Le PRESTATAIRE s&apos;engage à fournir les services avec diligence et professionnalisme, à maintenir la plateforme accessible et à garantir la confidentialité des données.
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Article 5 - Obligations du Client</h2>
                <p>
                    Le CLIENT s&apos;engage à régler les sommes dues, à utiliser les services conformément à leur destination et à respecter la propriété intellectuelle du PRESTATAIRE.
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Article 6 - Propriété Intellectuelle</h2>
                <p>
                    Tous les contenus et méthodologies restent la propriété exclusive de DIGITALISA. Le CLIENT bénéficie d&apos;une licence d&apos;utilisation non-exclusive et limitée à la durée du contrat.
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Article 7 - Protection des Données (RGPD)</h2>
                <p>
                    Le PRESTATAIRE respecte le Règlement Général sur la Protection des Données. Les données sont collectées pour la fourniture des services et conservées selon les durées légales.
                </p>
            </section>

            <section className="mb-12 border-t pt-12 border-slate-100 dark:border-slate-800">
                <p className="text-sm text-slate-500 italic">
                    Ce document est une version simplifiée pour consultation en ligne. Le contrat complet avec signature électronique est généré lors de la souscription à un mandat.
                </p>
            </section>
        </LegalDocument>
    );
}
