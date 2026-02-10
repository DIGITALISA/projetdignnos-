"use client";

import LegalDocument from "@/components/legal/LegalDocument";

export default function PrivacyPolicyPage() {
    return (
        <LegalDocument
            title="Politique de Confidentialité"
            subtitle="Engagements concernant la protection de vos données personnelles (RGPD)."
            lastUpdated="09 Février 2026"
            version="2.0"
        >
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">1. Introduction</h2>
                <p>
                    Chez <strong>MA-TRAINING-CONSULTING</strong>, la protection de vos données personnelles est une priorité absolue. Cette politique de confidentialité vous informe sur la manière dont nous collectons, utilisons et protégeons vos informations.
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">2. Responsable du Traitement</h2>
                <p>Le responsable du traitement des données est :</p>
                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg my-4">
                    <strong>DIGITALISA</strong><br/>
                    (Adresse complète de la société)<br/>
                    Délégué à la Protection des Données (DPO) : <a href="mailto:dpo@ma-training-consulting.com" className="text-blue-600 hover:underline">dpo@ma-training-consulting.com</a>
                </div>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">3. Données Collectées</h2>
                <h3 className="text-xl font-semibold mb-4">3.1 Données que vous nous fournissez</h3>
                <ul className="list-disc pl-6 space-y-2 mb-6">
                    <li><strong>Identité</strong> : Nom, prénom, date de naissance, nationalité.</li>
                    <li><strong>Contact</strong> : Email, téléphone, adresse postale.</li>
                    <li><strong>Profil Professionnel</strong> : CV, lettre de motivation, compétences, expériences.</li>
                    <li><strong>Paiement</strong> : Informations bancaires (traitées via Stripe/PayPal sécurisé).</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4">3.2 Données collectées automatiquement</h3>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Techniques</strong> : Adresse IP, type de navigateur, système d&apos;exploitation.</li>
                    <li><strong>Navigation</strong> : Historique des pages consultées, durée de session.</li>
                    <li><strong>IA Interactions</strong> : Logs des conversations avec nos agents IA (anonymisés pour l&apos;amélioration).</li>
                </ul>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">4. Finalités du Traitement</h2>
                <p>Nous utilisons vos données pour :</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>Fournir nos services</strong> : Analyse de CV, conseils IA, gestion de carrière.</li>
                    <li><strong>Gérer votre compte</strong> : Création, accès sécurisé, support client.</li>
                    <li><strong>Améliorer la plateforme</strong> : Statistiques d&apos;utilisation, optimisation des algorithmes.</li>
                    <li><strong>Marketing (avec consentement)</strong> : Newsletter, offres personnalisées.</li>
                    <li><strong>Conformité légale</strong> : Obligations fiscales et comptables.</li>
                </ul>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">5. Base Légale</h2>
                <p>Le traitement de vos données repose sur :</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>L&apos;exécution du contrat</strong> (CGU/CGV).</li>
                    <li><strong>Votre consentement</strong> (cookies, newsletter).</li>
                    <li><strong>L&apos;intérêt légitime</strong> de l&apos;Éditeur (sécurité, amélioration continue).</li>
                    <li><strong>Les obligations légales</strong>.</li>
                </ul>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">6. Destinataires des Données</h2>
                <p>Vos données peuvent être transmises à :</p>
                <ul className="list-disc pl-6 space-y-2 mt-4 mb-4">
                    <li><strong>Prestataires techniques</strong> : Hébergement (AWS/Azure), paiement (Stripe), email (SendGrid).</li>
                    <li><strong>Autorités légales</strong> : Sur réquisition judiciaire uniquement.</li>
                </ul>
                <p className="font-bold text-red-500">Aucune donnée n&apos;est vendue à des tiers.</p>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">7. Transfert de Données Hors UE</h2>
                <p>
                    Si des données sont transférées hors de l&apos;Union Européenne (par exemple vers nos serveurs aux États-Unis), nous garantissons un niveau de protection adéquat par le biais de Clauses Contractuelles Types (SCC) validées par la Commission Européenne ou le Data Privacy Framework (DPF).
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">8. Sécurité des Données</h2>
                <p>Nous mettons en œuvre des mesures de sécurité avancées :</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>Chiffrement</strong> : SSL/TLS pour les transferts, AES-256 pour le stockage sensible.</li>
                    <li><strong>Contrôle d&apos;accès</strong> : Authentification forte, journaux d&apos;accès.</li>
                    <li><strong>Sauvegardes</strong> : Quotidiennes et chiffrées.</li>
                </ul>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">9. Durée de Conservation</h2>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>Compte actif</strong> : Tant que le compte n&apos;est pas clôturé.</li>
                    <li><strong>Facturation</strong> : 10 ans (obligation légale).</li>
                    <li><strong>Données inactives</strong> : Suppression après 3 ans d&apos;inactivité.</li>
                    <li><strong>Logs de connexion</strong> : 1 an.</li>
                </ul>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">10. Vos Droits (RGPD)</h2>
                <p>Vous disposez des droits suivants :</p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <strong>Accès</strong><br/>Obtenir une copie de vos données.
                    </div>
                    <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <strong>Rectification</strong><br/>Corriger des données inexactes.
                    </div>
                    <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <strong>Effacement</strong><br/>Demander la suppression (&quot;droit à l&apos;oubli&quot;).
                    </div>
                    <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <strong>Opposition</strong><br/>Refuser certains traitements (marketing).
                    </div>
                    <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg col-span-2">
                        <strong>Portabilité</strong><br/>Recevoir vos données dans un format structuré.
                    </div>
                </div>
                <p className="mt-6">
                    Pour exercer vos droits : <a href="mailto:privacy@ma-training-consulting.com" className="text-blue-600 hover:underline">privacy@ma-training-consulting.com</a>
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">11. Cookies</h2>
                <p>
                    Nous utilisons des cookies pour améliorer votre expérience. Vous pouvez gérer vos préférences via notre bandeau de consentement ou les paramètres de votre navigateur.
                </p>
            </section>

            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold mb-2">Contact DPO</h3>
                <p className="text-sm">Pour toute question, contactez notre Délégué à la Protection des Données : <a href="mailto:dpo@ma-training-consulting.com" className="text-blue-600 hover:underline">dpo@ma-training-consulting.com</a></p>
            </div>
        </LegalDocument>
    );
}
