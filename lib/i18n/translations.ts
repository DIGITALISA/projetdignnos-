export type Language = 'en' | 'fr' | 'ar';

export const translations = {
    en: {
        nav: {
            home: "Home",
            methodology: "Our Services",
            pricing: "Pricing",
            verify: "Verify Accreditation",
            signIn: "Sign In",
            workspace: "My Workspace",
            digitalization: "Business Solutions",
            professionals: "For Professionals",
            enterprises: "For Enterprises"
        },
        contract: {
            title: "Service Agreement",
            subtitle: "Professional Consulting Agreement",
            step1: "Identity Verification",
            step2: "Terms of Service",
            step3: "Digital Signature",
            firstName: "First Name",
            lastName: "Last Name",
            phone: "Mobile Number",
            email: "Email Address",
            readTerms: "I have read and accept the agreement terms.",
            signLabel: "Digital Signature (Type Full Name)",
            signPlaceholder: "e.g. John Doe",
            submit: "Sign Agreement",
            successTitle: "Agreement Signed",
            successDesc: "Your commitment has been recorded successfully.",
            download: "Download Agreement (PDF)",
            terms: `
**PROFESSIONAL CONSULTING SERVICE AGREEMENT**

1. **Objective**: The client agrees to participate in the professional development program.
2. **Confidentiality**: All assessment results and advice provided are strictly confidential.
3. **Commitment**: Results depend on active participation in all program stages.
4. **Certification**: The "Information Verification" is issued upon successful completion of the program.
5. **Payment**: The client agrees to the fees as defined in the pricing plan.

By signing below, you agree to start the consulting process.
            `
        },
        hero: {
            badge: "Global Career & Business Consulting",
            titlePre: "Grow Your Career &",
            titleHighlight: "Business Strategy",
            subtitle: "The world's leading consulting platform for professionals and entrepreneurs. We help you advance your career and scale your business using global expertise and AI.",
            ctaDashboard: "Start Now",
            ctaTour: "How It Works"
        },
        features: {
            title: "Our Consulting Services",
            subtitle: "Comprehensive leadership transformation through seven integrated consulting services designed to elevate your strategic capabilities.",
            cards: {
                diagnosis: {
                    title: "1. Strategic Career Assessment",
                    desc: "Comprehensive analysis of your professional profile against global leadership standards to identify strategic development opportunities.",
                    tags: ["Career Analysis", "Leadership Assessment"]
                },
                simulation: {
                    title: "2. Leadership Crisis Simulations",
                    desc: "Real-world crisis scenarios to evaluate and enhance your decision-making capabilities under pressure.",
                    tags: ["Crisis Management", "Decision Intelligence"]
                },
                training: {
                    title: "3. Executive Development Programs",
                    desc: "Customized leadership development programs and executive coaching sessions based on global consulting methodologies.",
                    tags: ["Executive Coaching", "Leadership Development"]
                },
                mentor: {
                    title: "4. AI Strategic Advisor",
                    desc: "Your personal strategic advisor powered by AI, available 24/7 for career guidance and leadership insights.",
                    tags: ["Strategic Guidance", "24/7 Support"]
                },
                academy: {
                    title: "5. Global Knowledge Center",
                    desc: "Access to elite frameworks, case studies, and methodologies from Harvard, INSEAD, and leading consulting firms.",
                    tags: ["Best Practices", "Global Standards"]
                },
                library: {
                    title: "6. Strategic Toolkit Library",
                    desc: "Professional tools, frameworks, and templates used by McKinsey, BCG, and Bain consultants.",
                    tags: ["Consulting Tools", "Frameworks"]
                },
                expert: {
                    title: "7. Executive Network Access",
                    desc: "Direct connection to our global network of C-level executives and industry leaders for mentorship and opportunities.",
                    tags: ["Executive Network", "Mentorship"]
                }
            }
        },
        cert: {
            badge: "EXECUTIVE ACCREDITATION",
            title: "Professional Accreditation & Endorsement",
            desc: "Receive an official professional endorsement and accreditation that validates your strategic capabilities and executive readiness.",
            check1: "Professional Executive Accreditation",
            check2: "Strategic Endorsement",
            check3: "Validated by Global Standards",
            cta: "Get Accredited",
            cardTitle: "Executive Accreditation",
            cardSubtitle: "STRATEGIC ENDORSEMENT",
            cardFooter: "\"Accredited for demonstrating exceptional strategic capabilities and executive readiness.\""
        },
        footer: {
            rights: "© 2026 MA-TRAINING-CONSULTING.",
            tagline: "Global Consulting & Training Excellence."
        },
        saleBanner: {
            title: "Licensed Operations Partner",
            desc: "We provide a complete, ready-to-sell system combining learning, consulting, and practical application.\n\nWe Handle:\n• Full Content & Tech Stack\n• Structured Methodology\n• Operational System\n\nYour Role:\n• Get Full Partner Access\n• Sell at Fixed Price\n• Keep 100% of Revenue\n\n🔒 Limited to 5 Partners Only.\nThis is not a course. It is a business-in-a-box.",
            cta: "Apply for Partnership",
            close: "Close"
        },
        demoDisclaimer: {
            text: "This is a prototype model for demonstration purposes only, not a fully operational system."
        },
        verification: {
            badge: "Certificate Verification",
            titlePre: "Verify Professional",
            titleHighlight: "Credentials",
            subtitle: "Ensure the authenticity of our certificates and recommendations through our secure validation system.",
            label: "Certificate ID",
            placeholder: "e.g. CERT-2026-XXXX",
            buttonIdle: "Verify Now",
            buttonLoading: "Checking...",
            resultTitle: "Valid Certificate Found",
            resultSubtitle: "Verification successful",
            subject: "Certificate Holder",
            domain: "Field of Expertise",
            date: "Issue Date",
            status: "Status",
            statusElite: "Valid & Active",
            viewSign: "View Digital Signature",
            errorTitle: "Verification Failed",
            errorDesc: "No certificate found for ID: {id}. Please check the reference code."
        },
        methodology: {
            badge: "OUR CONSULTING METHODOLOGY",
            titlePre: "From Professional to",
            titleHighlight: "Strategic Leader",
            subtitle: "We don't train. We transform. Our proven 5-stage consulting methodology combines global best practices with AI-powered personalization to accelerate your leadership journey.",
            ctaStart: "Begin Your Transformation",
            ctaVideo: "Explore Our Approach",
            essence: {
                title: "Why Choose MA-TRAINING-CONSULTING",
                desc: "MA-TRAINING-CONSULTING is your Global Partner. We combine expert consulting wih practical training.",
                precision: "Data-driven assessment of your leadership potential and development needs.",
                recognition: "Internationally recognized certifications valued by global employers.",
                speed: "Accelerated career growth through targeted, personalized development.",
                network: "Exclusive access to our global network of C-level executives and industry leaders."
            },
            cycle: {
                title: "The Transformation Mandate",
                subtitle: "A rigorous 5-stage architectural journey from diagnostic to board-level leadership.",
                stage1: {
                    title: "Deep Skill Audit",
                    sub: "Analyzing Professional DNA",
                    desc: "Our AI engines perform a deep-level audit of your professional assets, mapping them against global leadership standards.",
                    f1: "Asset Mapping",
                    f2: "Compliance Audit",
                    f3: "Gap Analysis"
                },
                stage2: {
                    title: "Pressure Simulations",
                    sub: "Operational Intelligence",
                    desc: "Verify your leadership capacity in high-stakes environments. Manage crisis scenarios in an AI-controlled room.",
                    f1: "Scenario Pressure",
                    f2: "Crisis Audit",
                    f3: "Executive Comms"
                },
                stage3: {
                    title: "Strategic Implementation",
                    sub: "Architecting Capability",
                    desc: "Access specialized implementation mandates designed to close identified gaps with high-yield content.",
                    f1: "Capability Build",
                    f2: "Execution frameworks",
                    f3: "Operational IQ"
                },
                stage4: {
                    title: "Strategic Resource Bank",
                    sub: "The Executive Toolkit",
                    desc: "Access our curated bank of audit protocols, risk matrices, and compliance frameworks from top consultancies.",
                    f1: "Global Protocols",
                    f2: "Operating Standards",
                    f3: "Risk Matrices"
                },
                stage5: {
                    title: "Global Boardroom Access",
                    sub: "Executive Mentorship",
                    desc: "Connect with high-level advisors for strategic career pathing and board-level interview readiness.",
                    f1: "Boardroom Strategy",
                    f2: "Executive Masterclasses",
                    f3: "Legacy Leadership"
                }
            },
            ctaFinal: {
                title: "Stop Training. Start Dominating.",
                desc: "Join the elite professionals who have redefined their career trajectory using the Success Protocol.",
                btnStart: "Begin My Mandate",
                btnPlans: "View Access Plans"
            }
        },
        pricing: {
            badge: "MEMBERSHIP PLANS",
            title: "Propel Your Leadership Journey",
            subtitle: "Select the mandate that centers on your professional growth and specific strategic requirements.",
            tiers: {
                initial: {
                    name: "Initial Pack",
                    badge: "Discovery",
                    price: "Free",
                    duration: "3-Hour Access",
                    features: [
                        "3-Hour Protocol Access",
                        "AI Initial Audit (CV & Profile)",
                        "Limited Simulations Pool",
                        "Limited Workshops Access",
                        "Community Assistance"
                    ]
                },
                pro: {
                    name: "Pro Essential",
                    badge: "Executive Selection",
                    price: "30€",
                    duration: "/ year",
                    features: [
                        "Unlimited AI Audit Tools",
                        "Full AI Advisor Access",
                        "Pay-per-item Simulations",
                        "Pay-per-item Workshops",
                        "Strategic Content Updates"
                    ]
                },
                elite: {
                    name: "Elite Full Pack",
                    badge: "Total Immersion",
                    price: "65€",
                    duration: "/ month",
                    features: [
                        "Unlimited Simulations & Coaching",
                        "All Executive Workshops Included",
                        "Dedicated Expert Support (1-on-1)",
                        "Elite Recommendation Letter",
                        "Weekly Strategic Advisory",
                        "12-Month Mandate Required"
                    ]
                }
            },
            cta: "Choose Your Mandate",
            contact: "Inquire with an Advisor",
            guarantee: "100% Secure Processing & Executive Invoicing"
        },
        expert: {
            title: "Expert Intelligence",
            subtitle: "Get personalized strategic advice from AI specialized in executive leadership.",
            quickQuestions: "Intelligence Queries:",
            placeholder: "Interrogate the advisor...",
            send: "Command",
            careerExpert: "Strategic Advisor",
            loading: "Advisor is calculating...",
            defaultMessage: "Ready for briefing. I've audited your latest performance. What is your current strategic objective?"
        },
        auth: {
            welcomeBack: "Identity Confirmed",
            signInSubtitle: "Sign in to access your Strategic Workspace",
            emailLabel: "Email / ID",
            passwordLabel: "Access Code",
            signInButton: "Authorize Access",
            signingIn: "Verifying Identity...",
            orContinueWith: "Alternative Auth",
            noAccount: "Not registered yet?",
            createOne: "Free Registration",
            errorInvalid: "Access Denied: Invalid Credentials",
            errorGeneric: "System Error. Attempting reconnection."
        },
        dashboard: {
            welcome: "Welcome back",
            subtitle: "Your professional development journey is active.",
            topLearner: "Top 5% Talent",
            stats: {
                skillsGained: "Skills Verified",
                hoursLearned: "Training Hours",
                certificates: "Certificates"
            },
            currentFocus: {
                title: "Current Mandate",
                continue: "Execute",
                resume: "Return to Simulation",
                progress: "Maturity",
                accessWorkshop: "Protocol Materials"
            },
            journey: {
                title: "Your Leadership Journey",
                stages: {
                    diagnosis: "Career Assessment",
                    diagnosisDesc: "Professional profile analysis and gap identification.",
                    simulation: "Leadership Simulations",
                    simulationDesc: "Crisis management and decision-making evaluation.",
                    training: "Development Programs",
                    trainingDesc: "Customized leadership development and coaching.",
                    library: "Resources & Tools",
                    libraryDesc: "Access to premium frameworks and toolkits.",
                    expert: "Executive Network",
                    expertDesc: "Connect with global leaders and mentors."
                }
            },
            recommended: {
                title: "Prioritized for You",
                seeAll: "View All"
            }
        },
        sidebar: {
            categories: {
                main: "Main",
                journey: "Success Strategy",
                achievements: "Official Assets",
                system: "Advisory Settings"
            },
            items: {
                overview: "Dashboard",
                diagnosis: "Career Assessment",
                tools: "Leadership Simulations",
                training: "Development Programs",
                mentor: "AI Strategic Advisor",
                academy: "Knowledge Center",
                library: "Tools & Resources",
                expert: "Executive Network",
                certificates: "Executive Performance Profile",
                recommendation: "Get Recommendation",
                settings: "Settings",
                signOut: "Sign Out"
            },
            premium: "Elite Member",
            loading: "Decrypting workspace..."
        },
        digitalization: {
            hero: {
                badge: "AI Business Consulting",
                title: "Scale Your Business with",
                titleHighlight: "Data-Driven Strategy",
                subtitle: "We help businesses grow, optimize operations, and launch new products using advanced AI analysis and global consulting frameworks.",
                ctaStart: "Start Business Assessment",
                ctaPortfolio: "View Our Solutions"
            },
            process: {
                title: "Where are you starting?",
                subtitle: "Select your current status to get a tailored AI roadmap.",
                options: {
                    existing: {
                        title: "Existing Project",
                        desc: "I have a running business and need optimization or scaling."
                    },
                    idea: {
                        title: "Project Idea",
                        desc: "I have a concept but need a roadmap to launch."
                    },
                    none: {
                        title: "No Idea Yet",
                        desc: "I want to invest but need profitable opportunities."
                    }
                }
            },
            questions: {
                existing: [
                    { id: "q1", label: "Strategic Position", placeholder: "e.g., Market Leader, Challenger, Niche Player", type: "text" },
                    { id: "q2", label: "Current Revenue & Growth Rate", placeholder: "e.g., $500k/yr, +20% YoY", type: "text" },
                    { id: "q3", label: "Primary Operational Bottleneck", placeholder: "e.g., Client Acquisition, Tech Scalability, Team Efficiency", type: "text" },
                    { id: "q4", label: "12-Month Strategic Goal", placeholder: "e.g., Expansion to new market, 2x Revenue", type: "text" }
                ],
                idea: [
                    { id: "q1", label: "Core Value Proposition", placeholder: "What problem are you solving and for whom?", type: "text" },
                    { id: "q2", label: "Market Validation Status", placeholder: "e.g., Concept only, Surveyed 100 people, MVP ready", type: "text" },
                    { id: "q3", label: "Go-to-Market Strategy", placeholder: "e.g., Paid Ads, Direct Sales, Viral Growth", type: "text" }
                ],
                none: [
                    { id: "q1", label: "Investment Capital Available", placeholder: "e.g., $10k - $50k, $100k+", type: "text" },
                    { id: "q2", label: "Key Professional Assets", placeholder: "e.g., Strong Sales Network, Technical Skills", type: "text" },
                    { id: "q3", label: "Preferred Sector/Industry", placeholder: "e.g., High Tech, Real Estate, E-commerce", type: "text" }
                ],
                freeTextLabel: "Executive Summary / Specific Challenge",
                freeTextPlaceholder: "Describe your situation in detail. What is stopping you from reaching the next level? (The AI will use this to build your custom roadmap)",
                submit: "Generate Strategic Roadmap"
            },
            portfolio: {
                title: "Our Success Stories",
                subtitle: "From Strategy to Execution.",
                strategy: "Strategy",
                website: "Digital Product",
                training: "Team Training"
            },
            diagnostic: {
                title: "AI Executive Consultant",
                subtitle: "I will analyze your inputs to generate a professional SWOT Analysis and a Quarter-by-Quarter Execution Map.",
                step: "Step",
                submit: "Generate Analysis",
                analyzing: "Consultant AI is architecting your roadmap...",
                swot: {
                    strengths: "Strengths",
                    weaknesses: "Weaknesses",
                    opportunities: "Opportunities",
                    threats: "Threats"
                },
                plan: "Strategic Execution Roadmap"
            },
            blueprints: {
                title: "Industry Innovation Models",
                subtitle: "Select your sector to see a complete digital transformation framework.",
                accompaniment: "Included Service: We build the technology, design the marketing funnel, and train your team.",
                demoLabel: "Live Strategy Demo",
                items: [
                    {
                        id: "edtech",
                        title: "Training & Education",
                        strategy: "The Hybrid Academy Model",
                        desc: "Transform traditional training into a scalable digital academy. High-ticket automated webinars + LMS platform.",
                        demoTitle: "Academy Platform Demo"
                    },
                    {
                        id: "retail",
                        title: "Retail & Commerce",
                        strategy: "Direct-to-Consumer (D2C) Engine",
                        desc: "Bypass marketplaces. Build a brand-centric store with AI recommendations and automated retargeting.",
                        demoTitle: "E-Store Experience"
                    },
                    {
                        id: "services",
                        title: "Professional Services",
                        strategy: "Productized Service Hub",
                        desc: "Stop selling hours. Sell outcomes. Automated booking, client portals, and subscription-based service models.",
                        demoTitle: "Client Portal Demo"
                    }
                ]
            },
            tools: {
                title: "Proprietary Growth Engines",
                subtitle: "Automated assets we deploy to accelerate your project development.",
                items: [
                    {
                        title: "Meta-Manager Pro",
                        desc: "Automated Facebook & Instagram management system for content and engagement."
                    },
                    {
                        title: "LeadPulse CRM",
                        desc: "Integrated customer tracking system designed for rapid scaling."
                    },
                    {
                        title: "AutoFunnel Builder",
                        desc: "High-conversion sales funnel architecture deployed in days, not months."
                    }
                ]
            },
            trustedBy: {
                title: "Strategically Aligned with Global Excellence",
                subtitle: "Trusted by visionary companies seeking digital dominance."
            },
            metrics: {
                title: "Proven Strategic Impact",
                items: [
                    { value: "140M+", label: "Capital Optimized", icon: "DollarSign" },
                    { value: "450+", label: "Digital Success Stories", icon: "TrendingUp" },
                    { value: "12ms", label: "AI Latency Average", icon: "Zap" },
                    { value: "98%", label: "Client Retention", icon: "ShieldCheck" }
                ]
            },
            methodology: {
                title: "The Industrial AI Framework",
                subtitle: "Our proprietary architecture for sustainable scaling.",
                pillars: [
                    { title: "Business Audit", desc: "We analyze your current business model, revenue, and challenges." },
                    { title: "Action Plan", desc: "We create a step-by-step roadmap to achieve your growth goals." },
                    { title: "Execution & Training", desc: "We help you implement the strategy and train your team." }
                ]
            }
        }
    },
    fr: {
        nav: {
            home: "Accueil",
            methodology: "Nos Services",
            pricing: "Tarifs",
            verify: "Vérifier Accréditation",
            signIn: "Connexion",
            workspace: "Mon Espace",
            digitalization: "Solutions Entreprises",
            professionals: "Pour Professionnels",
            enterprises: "Pour Entreprises"
        },
        contract: {
            title: "Contrat de Service",
            subtitle: "Accord de Conseil Professionnel",
            step1: "Vérification d'Identité",
            step2: "Conditions de Service",
            step3: "Signature Numérique",
            firstName: "Prénom",
            lastName: "Nom",
            phone: "Numéro de Mobile",
            email: "Adresse Email",
            readTerms: "J'ai lu et j'accepte les termes du contrat.",
            signLabel: "Signature Numérique (Tapez votre nom complet)",
            signPlaceholder: "ex: Jean Dupont",
            submit: "Signer le Contrat",
            successTitle: "Contrat Signé",
            successDesc: "Votre engagement a été enregistré avec succès.",
            download: "Télécharger le Contrat (PDF)",
            terms: `
**CONTRAT DE SERVICE DE CONSEIL PROFESSIONNEL**

1. **Objectif** : Le client accepte de participer au programme de développement professionnel.
2. **Confidentialité** : Tous les résultats d'évaluation et conseils fournis sont strictement confidentiels.
3. **Engagement** : Les résultats dépendent d'une participation active à toutes les étapes du programme.
4. **Certification** : La "Vérification d'Information" est délivrée après la réussite du programme.
5. **Paiement** : Le client accepte les frais tels que définis dans le plan tarifaire.

En signant ci-dessous, vous acceptez de commencer le processus de conseil.
            `
        },
        hero: {
            badge: "Conseil en Carrière & Affaires",
            titlePre: "Développez votre Carrière &",
            titleHighlight: "Stratégie d'Affaires",
            subtitle: "La plateforme de conseil leader pour les professionnels et entrepreneurs. Nous vous aidons à avancer votre carrière et à développer votre entreprise.",
            ctaDashboard: "Commencer Maintenant",
            ctaTour: "Comment ça Marche"
        },
        features: {
            title: "Nos Services de Conseil",
            subtitle: "Transformation complète du leadership à travers sept services de conseil intégrés conçus pour élever vos capacités stratégiques.",
            cards: {
                diagnosis: {
                    title: "1. Évaluation Stratégique de Carrière",
                    desc: "Analyse complète de votre profil professionnel par rapport aux standards mondiaux de leadership pour identifier les opportunités de développement stratégique.",
                    tags: ["Analyse de Carrière", "Évaluation du Leadership"]
                },
                simulation: {
                    title: "2. Simulations de Crise en Leadership",
                    desc: "Scénarios de crise réels pour évaluer et améliorer vos capacités de prise de décision sous pression.",
                    tags: ["Gestion de Crise", "Intelligence Décisionnelle"]
                },
                training: {
                    title: "3. Programmes de Développement Exécutif",
                    desc: "Programmes de développement du leadership et sessions de coaching exécutif basés sur les méthodologies mondiales.",
                    tags: ["Coaching Exécutif", "Développement du Leadership"]
                },
                mentor: {
                    title: "4. Conseiller Stratégique IA",
                    desc: "Votre conseiller stratégique personnel alimenté par l'IA, disponible 24/7 pour des conseils de carrière et des insights en leadership.",
                    tags: ["Orientation Stratégique", "Support 24/7"]
                },
                academy: {
                    title: "5. Centre de Connaissances Mondial",
                    desc: "Accès aux cadres d'élite, études de cas et méthodologies de Harvard, INSEAD et des principaux cabinets de conseil.",
                    tags: ["Meilleures Pratiques", "Standards Mondiaux"]
                },
                library: {
                    title: "6. Bibliothèque d'Outils Stratégiques",
                    desc: "Outils professionnels, cadres et modèles utilisés par les consultants de McKinsey, BCG et Bain.",
                    tags: ["Outils de Conseil", "Cadres"]
                },
                expert: {
                    title: "7. Accès au Réseau Exécutif",
                    desc: "Connexion directe à notre réseau mondial de dirigeants de niveau C et de leaders de l'industrie pour le mentorat et les opportunités.",
                    tags: ["Réseau Exécutif", "Mentorat"]
                }
            }
        },
        cert: {
            badge: "ACCRÉDITATION EXÉCUTIVE",
            title: "Accréditation & Endossement Professionnel",
            desc: "Recevez un endossement professionnel officiel et une accréditation qui valide vos capacités stratégiques et votre préparation exécutive.",
            check1: "Accréditation Exécutive Professionnelle",
            check2: "Endossement Stratégique",
            check3: "Validé par les Standards Mondiaux",
            cta: "Obtenir l'Accréditation",
            cardTitle: "Accréditation Exécutive",
            cardSubtitle: "ENDOSSEMENT STRATÉGIQUE",
            cardFooter: "\"Accrédité pour avoir démontré des capacités stratégiques exceptionnelles et une préparation exécutive.\""
        },
        footer: {
            rights: "© 2026 MA-TRAINING-CONSULTING.",
            tagline: "L'excellence en Conseil & Formation."
        },
        saleBanner: {
            title: "Partenaire d'Opérations Licencié",
            desc: "Nous offrons un système complet prêt à la vente combinant apprentissage, conseil et pratique.\n\nNous Gérons :\n• Contenu Complet & Tech\n• Méthodologie Structurée\n• Système Opérationnel\n\nVotre Rôle :\n• Accès Partenaire Complet\n• Vendez à Prix Fixe\n• Gardez 100% des Revenus\n\n🔒 Limité à 5 Partenaires.\nCe n'est pas un cours. C'est un business clé en main.",
            cta: "Postuler au Partenariat",
            close: "Fermer"
        },
        demoDisclaimer: {
            text: "Ceci est un modèle prototype à des fins de démonstration uniquement, et non un système opérationnel complet."
        },
        verification: {
            badge: "Vérification de Certificat",
            titlePre: "Vérifier les Titres",
            titleHighlight: "Professionnels",
            subtitle: "Assurez l'authenticité de nos certificats et recommandations via notre système de validation sécurisé.",
            label: "ID du Certificat",
            placeholder: "ex: CERT-2026-XXXX",
            buttonIdle: "Vérifier Maintenant",
            buttonLoading: "Vérification...",
            resultTitle: "Certificat Valide Trouvé",
            resultSubtitle: "Vérification réussie",
            subject: "Titulaire du Certificat",
            domain: "Domaine d'Expertise",
            date: "Date d'Émission",
            status: "Statut",
            statusElite: "Valide & Actif",
            viewSign: "Voir Signature Numérique",
            errorTitle: "Échec de Vérification",
            errorDesc: "Aucun certificat trouvé pour l'ID : {id}. Veuillez vérifier le code."
        },
        methodology: {
            badge: "LE PROTOCOLE DE SUCCÈS",
            titlePre: "De Professionnel à",
            titleHighlight: "Actif Stratégique",
            subtitle: "Nous n'enseignons pas. Nous architecturons. Notre cycle de transformation en 5 étapes est conçu pour une domination professionnelle à fort impact.",
            ctaStart: "Démarrer la Transformation",
            ctaVideo: "Regarder le Protocole",
            essence: {
                title: "Pourquoi choisir MA-TRAINING-CONSULTING",
                desc: "MA-TRAINING-CONSULTING est votre partenaire mondial. Nous combinons conseil expert et formation pratique.",
                precision: "Diagnostics de précision qui cartographient votre ADN professionnel.",
                recognition: "Garanties reconnues par les cadres institutionnels mondiaux.",
                speed: "Vitesse de carrière accélérée avec comblement d'écarts par IA.",
                network: "Accès stratégique au réseau mondial de l'élite dirigeante."
            },
            cycle: {
                title: "Le Mandat de Transformation",
                subtitle: "Un voyage architectural rigoureux en 5 étapes, du diagnostic au leadership de haut niveau.",
                stage1: {
                    title: "Audit Profond des Compétences",
                    sub: "Analyse de l'ADN Professionnel",
                    desc: "Nos moteurs IA effectuent un audit de haut niveau de vos actifs professionnels selon les standards mondiaux.",
                    f1: "Cartographie d'Actifs",
                    f2: "Audit de Conformité",
                    f3: "Analyse d'Écarts"
                },
                stage2: {
                    title: "Simulations de Pression",
                    sub: "Intelligence Opérationnelle",
                    desc: "Vérifiez votre capacité de leadership dans des environnements à enjeux élevés. Gérez les crises en temps réel.",
                    f1: "Pression de Scénario",
                    f2: "Audit de Crise",
                    f3: "Comms Exécutives"
                },
                stage3: {
                    title: "Implémentation Stratégique",
                    sub: "Architecture de Capacité",
                    desc: "Accédez à des mandats d'implémentation spécialisés conçus pour combler les lacunes identifiées.",
                    f1: "Bâtir la Capacité",
                    f2: "Cadres d'Exécution",
                    f3: "QI Opérationnel"
                },
                stage4: {
                    title: "Banque de Ressources Stratégiques",
                    sub: "La Boîte à Outils Exécutive",
                    desc: "Accédez à notre banque de protocoles d'audit et matrices de risques provenant des meilleurs cabinets.",
                    f1: "Protocoles Mondiaux",
                    f2: "Standards Opérationnels",
                    f3: "Matrices de Risques"
                },
                stage5: {
                    title: "Accès Direct au Boardroom",
                    sub: "Mentorat Exécutif",
                    desc: "Connectez-vous avec des conseillers de haut niveau pour votre stratégie de carrière.",
                    f1: "Stratégie de Boardroom",
                    f2: "Masterclasses Exécutives",
                    f3: "Leadership d'Héritage"
                }
            },
            ctaFinal: {
                title: "Arrêtez de Former. Commencez à Dominer.",
                desc: "Rejoignez l'élite des professionnels qui ont redéfini leur trajectoire avec le Protocole Success.",
                btnStart: "Commencer Mon Mandat",
                btnPlans: "Voir les Plans d'Accès"
            }
        },
        pricing: {
            badge: "PLANS DE MEMBRE",
            title: "Propulsez votre Leadership",
            subtitle: "Sélectionnez le mandat qui correspond à votre croissance professionnelle et à vos exigences stratégiques.",
            tiers: {
                initial: {
                    name: "Pack Initial",
                    badge: "Découverte",
                    price: "Gratuit",
                    duration: "Accès 3 heures",
                    features: [
                        "Accès complet pendant 3 heures",
                        "Audit initial IA (CV & Profil)",
                        "Simulations (Limité)",
                        "Workshops (Limité)",
                        "Assistance communautaire"
                    ]
                },
                pro: {
                    name: "Pack Pro Essential",
                    badge: "Sélection Exécutive",
                    price: "30€",
                    duration: "/ an",
                    features: [
                        "Outils Audit IA (Illimité)",
                        "Accès complet AI Advisor",
                        "Simulations (Payantes par item)",
                        "Workshops (Payants par item)",
                        "Mises à jour stratégiques"
                    ]
                },
                elite: {
                    name: "Elite Full Pack",
                    badge: "Immersion Totale",
                    price: "65€",
                    duration: "/ mois",
                    features: [
                        "Simulations & Coaching Illimités",
                        "Tous les Workshops Inclus",
                        "Accompagnement Expert (1-on-1)",
                        "Lettre de Recommandation Elite",
                        "Conseil Stratégique Hebdomadaire",
                        "Engagement de 12 mois requis"
                    ]
                }
            },
            cta: "Choisir mon Mandat",
            contact: "Consulter un Conseiller",
            guarantee: "Traitement 100% Sécurisé & Facturation Exécutive"
        },
        expert: {
            title: "Intelligence d'Expert",
            subtitle: "Conseils stratégiques personnalisés par une IA spécialisée en leadership exécutif.",
            quickQuestions: "Requêtes d'Intelligence :",
            placeholder: "Interroger le conseiller...",
            send: "Commande",
            careerExpert: "Conseiller Stratégique",
            loading: "Calcul en cours...",
            defaultMessage: "Prêt pour le briefing. J'ai audité votre performance. Quel est votre objectif stratégique ?"
        },
        auth: {
            welcomeBack: "Identité Confirmée",
            signInSubtitle: "Connectez-vous à votre Espace Stratégique",
            emailLabel: "Email / ID",
            passwordLabel: "Code d'Accès",
            signInButton: "Autoriser l'Accès",
            signingIn: "Vérification...",
            orContinueWith: "Authentification Alternative",
            noAccount: "Pas encore inscrit ?",
            createOne: "Inscription Gratuite",
            errorInvalid: "Accès Refusé : Identifiants Invalides",
            errorGeneric: "Erreur Système. Tentative de reconnexion."
        },
        dashboard: {
            welcome: "Bon retour",
            subtitle: "Votre parcours de développement professionnel est actif.",
            topLearner: "Top 5% Talent",
            stats: {
                skillsGained: "Compétences Vérifiées",
                hoursLearned: "Heures de Formation",
                certificates: "Certificats"
            },
            currentFocus: {
                title: "Mandat Actuel",
                continue: "Exécuter",
                resume: "Retour à la Simulation",
                progress: "Maturité",
                accessWorkshop: "Matériels de Protocole"
            },
            journey: {
                title: "Votre Parcours de Leadership",
                stages: {
                    diagnosis: "Évaluation de Carrière",
                    diagnosisDesc: "Analyse du profil professionnel et identification des lacunes.",
                    simulation: "Simulations de Leadership",
                    simulationDesc: "Évaluation de la gestion de crise et de la prise de décision.",
                    training: "Programmes de Développement",
                    trainingDesc: "Développement du leadership et coaching personnalisé.",
                    library: "Ressources & Outils",
                    libraryDesc: "Accès aux cadres et outils premium.",
                    expert: "Réseau Exécutif",
                    expertDesc: "Connexion avec des leaders mondiaux et mentors."
                }
            },
            recommended: {
                title: "Priorités Pour Vous",
                seeAll: "Tout Voir"
            }
        },
        sidebar: {
            categories: {
                main: "Principal",
                journey: "Stratégie de Succès",
                achievements: "Actifs Officiels",
                system: "Paramètres"
            },
            items: {
                overview: "Tableau de Bord",
                diagnosis: "Évaluation de Carrière",
                tools: "Simulations de Leadership",
                training: "Programmes de Développement",
                mentor: "Conseiller Stratégique IA",
                academy: "Centre de Connaissances",
                library: "Outils & Ressources",
                expert: "Réseau Exécutif",
                certificates: "Profil de Performance Exécutive",
                recommendation: "Obtenir Recommandation",
                settings: "Paramètres",
                signOut: "Déconnexion"
            },
            premium: "Membre Élite",
            loading: "Décryptage de l'espace..."
        },
        digitalization: {
            hero: {
                badge: "Conseil en Stratégie IA",
                title: "Développez votre Entreprise avec",
                titleHighlight: "l'Intelligence Stratégique",
                subtitle: "Nous aidons les entreprises à croître, optimiser leurs opérations et lancer de nouveaux produits grâce à l'analyse IA et aux méthodes de conseil mondiales.",
                ctaStart: "Démarrer l'Audit Business",
                ctaPortfolio: "Voir Nos Solutions"
            },
            process: {
                title: "D'où commencez-vous ?",
                subtitle: "Sélectionnez votre statut actuel pour obtenir une feuille de route IA personnalisée.",
                options: {
                    existing: {
                        title: "Projet Existant",
                        desc: "J'ai une entreprise en activité et j'ai besoin d'optimisation ou de croissance."
                    },
                    idea: {
                        title: "Idée de Projet",
                        desc: "J'ai un concept mais j'ai besoin d'une feuille de route pour le lancer."
                    },
                    none: {
                        title: "Pas d'Idée",
                        desc: "Je veux investir mais j'ai besoin d'opportunités rentables."
                    }
                }
            },
            questions: {
                existing: [
                    { id: "q1", label: "Positionnement Stratégique", placeholder: "ex: Leader du marché, Challenger, Spécialiste de niche", type: "text" },
                    { id: "q2", label: "Revenus Actuels & Croissance", placeholder: "ex: 500k€/an, +20% sur un an", type: "text" },
                    { id: "q3", label: "Goulot d'Étranglement Principal", placeholder: "ex: Acquisition Client, Scalabilité Tech, Efficacité Équipe", type: "text" },
                    { id: "q4", label: "Objectif Stratégique à 12 mois", placeholder: "ex: Expansion nouveau marché, Doubler le CA", type: "text" }
                ],
                idea: [
                    { id: "q1", label: "Proposition de Valeur Centrale", placeholder: "Quel problème résolvez-vous et pour qui ?", type: "text" },
                    { id: "q2", label: "Statut de Validation Marché", placeholder: "ex: Concept seulement, Sondage 100 personnes, MVP prêt", type: "text" },
                    { id: "q3", label: "Stratégie de Go-to-Market", placeholder: "ex: Publicité payante, Vente directe, Croissance virale", type: "text" }
                ],
                none: [
                    { id: "q1", label: "Capital d'Investissement Disponible", placeholder: "ex: 10k€ - 50k€, 100k€+", type: "text" },
                    { id: "q2", label: "Actifs Professionnels Clés", placeholder: "ex: Réseau commercial fort, Compétences techniques", type: "text" },
                    { id: "q3", label: "Secteur/Industrie Préféré", placeholder: "ex: High Tech, Immobilier, E-commerce", type: "text" }
                ],
                freeTextLabel: "Résumé Exécutif / Défi Spécifique",
                freeTextPlaceholder: "Décrivez votre situation en détail. Qu'est-ce qui vous empêche d'atteindre le niveau supérieur ? (L'IA utilisera ceci pour construire votre feuille de route personnalisée)",
                submit: "Générer la Feuille de Route Stratégique"
            },
            portfolio: {
                title: "Nos Réussites",
                subtitle: "De la Stratégie à l'Exécution.",
                strategy: "Stratégie",
                website: "Produit Digital",
                training: "Formation d'Équipe"
            },
            diagnostic: {
                title: "Consultant Exécutif IA",
                subtitle: "J'analyserai vos entrées pour générer une analyse SWOT professionnelle et un plan d'exécution trimestre par trimestre.",
                step: "Étape",
                submit: "Générer l'Analyse",
                analyzing: "L'IA Consultante architecture votre plan...",
                swot: {
                    strengths: "Forces",
                    weaknesses: "Faiblesses",
                    opportunities: "Opportunités",
                    threats: "Menaces"
                },
                plan: "Feuille de Route d'Exécution"
            },
            blueprints: {
                title: "Modèles d'Innovation Sectorielle",
                subtitle: "Sélectionnez votre secteur pour voir un cadre de transformation numérique complet.",
                accompaniment: "Service Inclus : Nous construisons la technologie, concevons le funnel marketing et formons votre équipe.",
                demoLabel: "Démo Stratégie Live",
                items: [
                    {
                        id: "edtech",
                        title: "Formation & Éducation",
                        strategy: "Modèle Académie Hybride",
                        desc: "Transformez la formation traditionnelle en académie numérique évolutive. Webinaires automatisés High-Ticket + Plateforme LMS.",
                        demoTitle: "Démo Plateforme Académie"
                    },
                    {
                        id: "retail",
                        title: "Commerce & Retail",
                        strategy: "Moteur Direct-Consumer (D2C)",
                        desc: "Contournez les marketplaces. Construisez une boutique centrée sur la marque avec recommandations IA et retargeting.",
                        demoTitle: "Expérience E-Store"
                    },
                    {
                        id: "services",
                        title: "Services Professionnels",
                        strategy: "Hub de Services Productisés",
                        desc: "Arrêtez de vendre des heures. Vendez des résultats. Réservation automatisée, portails clients et modèles par abonnement.",
                        demoTitle: "Démo Portail Client"
                    }
                ]
            },
            tools: {
                title: "Moteurs de Croissance Propriétaires",
                subtitle: "Des outils automatisés que nous déployons pour accélérer le développement de votre projet.",
                items: [
                    {
                        title: "Meta-Manager Pro",
                        desc: "Système de gestion automatisé Facebook & Instagram pour le contenu et l'engagement."
                    },
                    {
                        title: "LeadPulse CRM",
                        desc: "Système de suivi client intégré conçu pour une mise à l'échelle rapide."
                    },
                    {
                        title: "AutoFunnel Builder",
                        desc: "Architecture de tunnel de vente à haute conversion déployée en quelques jours."
                    }
                ]
            },
            trustedBy: {
                title: "Aligné Stratégiquement avec l'Excellence Mondiale",
                subtitle: "Approuvé par des entreprises visionnaires recherchant la dominance numérique."
            },
            metrics: {
                title: "Impact Stratégique Prouvé",
                items: [
                    { value: "140M€+", label: "Capital Optimisé", icon: "DollarSign" },
                    { value: "450+", label: "Réussites Digitales", icon: "TrendingUp" },
                    { value: "12ms", label: "Latence IA Moyenne", icon: "Zap" },
                    { value: "98%", label: "Rétention Client", icon: "ShieldCheck" }
                ]
            },
            methodology: {
                title: "Le Cadre IA Industriel",
                subtitle: "Notre architecture propriétaire pour une croissance durable.",
                pillars: [
                    { title: "Audit d'Entreprise", desc: "Nous analysons votre modèle commercial, vos revenus et vos défis." },
                    { title: "Plan d'Action", desc: "Nous créons une feuille de route étape par étape pour atteindre vos objectifs." },
                    { title: "Exécution & Formation", desc: "Nous vous aidons à mettre en œuvre la stratégie et formons votre équipe." }
                ]
            }
        }
    },
    ar: {
        nav: {
            home: "الرئيسية",
            methodology: "خدماتنا",
            pricing: "الأسعار",
            verify: "التحقق من الاعتماد",
            signIn: "تسجيل الدخول",
            workspace: "مساحتي",
            digitalization: "حلول الأعمال",
            professionals: "للمهنيين",
            enterprises: "للشركات"
        },
        contract: {
            title: "اتفاقية الخدمة",
            subtitle: "اتفاقية الاستشارات المهنية",
            step1: "التحقق من الهوية",
            step2: "شروط الخدمة",
            step3: "التوقيع الرقمي",
            firstName: "الاسم الأول",
            lastName: "الاسم الأخير",
            phone: "رقم الجوال",
            email: "البريد الإلكتروني",
            readTerms: "لقد قرأت وقبلت شروط الاتفاقية.",
            signLabel: "التوقيع الرقمي (اكتب الاسم الكامل)",
            signPlaceholder: "مثال: فلان الفلاني",
            submit: "توقيع الاتفاقية",
            successTitle: "تم توقيع الاتفاقية",
            successDesc: "تم تسجيل التزامك بنجاح.",
            download: "تحميل الاتفاقية (PDF)",
            terms: `
**اتفاقية خدمة الاستشارات المهنية**

1. **الهدف**: يوافق العميل على المشاركة في برنامج التطوير المهني.
2. **السرية**: جميع نتائج التقييم والنصائح المقدمة سرية تماماً.
3. **الالتزام**: تعتمد النتائج على المشاركة الفعالة في جميع مراحل البرنامج.
4. **الشهادة**: يتم إصدار "التحقق من المعلومات" بعد إتمام البرنامج بنجاح.
5. **الدفع**: يوافق العميل على الرسوم كما هو محدد في خطة الأسعار.

بالتوقيع أدناه، أنت توافق على بدء عملية الاستشارة.
            `
        },
        hero: {
            badge: "استشارات مهنية وتجارية عالمية",
            titlePre: "طوّر مسارك المهني و",
            titleHighlight: "استراتيجية أعمالك",
            subtitle: "المنصة الاستشارية الرائدة للمحترفين ورواد الأعمال. نساعدك على تطوير مسارك المهني وتنمية مشروعك التجاري باستخدام الخبرات العالمية.",
            ctaDashboard: "ابدأ الآن",
            ctaTour: "كيف نعمل"
        },
        features: {
            title: "خدماتنا الاستشارية",
            subtitle: "تحول قيادي شامل من خلال سبع خدمات استشارية متكاملة مصممة لتطوير قدراتك الاستراتيجية.",
            cards: {
                diagnosis: {
                    title: "1. التقييم الاستراتيجي للمسار المهني",
                    desc: "تحليل شامل لملفك المهني مقابل معايير القيادة العالمية لتحديد فرص التطوير الاستراتيجي.",
                    tags: ["تحليل المسار المهني", "تقييم القيادة"]
                },
                simulation: {
                    title: "2. محاكاة القيادة في الأزمات",
                    desc: "سيناريوهات أزمات واقعية لتقييم وتطوير قدرتك على اتخاذ القرارات تحت الضغط.",
                    tags: ["إدارة الأزمات", "ذكاء القرارات"]
                },
                training: {
                    title: "3. برامج التطوير التنفيذي",
                    desc: "برامج تطوير قيادي وجلسات كوتشينغ تنفيذي مخصصة مبنية على منهجيات عالمية.",
                    tags: ["كوتشينغ تنفيذي", "تطوير القيادة"]
                },
                mentor: {
                    title: "4. المستشار الاستراتيجي الذكي",
                    desc: "مستشارك الاستراتيجي الشخصي المدعوم بالذكاء الاصطناعي، متاح 24/7 للإرشاد المهني ورؤى القيادة.",
                    tags: ["إرشاد استراتيجي", "دعم 24/7"]
                },
                academy: {
                    title: "5. مركز المعرفة العالمي",
                    desc: "الوصول لأطر العمل النخبوية ودراسات الحالة والمنهجيات من Harvard وINSEAD وأفضل شركات الاستشارات.",
                    tags: ["أفضل الممارسات", "معايير عالمية"]
                },
                library: {
                    title: "6. مكتبة الأدوات الاستراتيجية",
                    desc: "أدوات احترافية وأطر عمل ونماذج يستخدمها مستشارو McKinsey وBCG وBain.",
                    tags: ["أدوات استشارية", "أطر عمل"]
                },
                expert: {
                    title: "7. الوصول لشبكة القيادات التنفيذية",
                    desc: "تواصل مباشر مع شبكتنا العالمية من القيادات التنفيذية وقادة الصناعة للتوجيه والفرص.",
                    tags: ["شبكة تنفيذية", "توجيه مهني"]
                }
            }
        },
        cert: {
            badge: "الاعتماد التنفيذي",
            title: "الاعتماد والتزكية المهنية",
            desc: "احصل على تزكية مهنية رسمية واعتماد يثبت قدراتك الاستراتيجية وجاهزيتك للمناصب التنفيذية.",
            check1: "اعتماد تنفيذي محترف",
            check2: "تزكية استراتيجية",
            check3: "مصدق وفق المعايير العالمية",
            cta: "احصل على الاعتماد",
            cardTitle: "الاعتماد التنفيذي",
            cardSubtitle: "تزكية استراتيجية",
            cardFooter: "\"معتمد لإظهار قدرات استراتيجية استثنائية وجاهزية تنفيذية.\""
        },
        footer: {
            rights: "© 2026 MA-TRAINING-CONSULTING.",
            tagline: "التميز في الاستشارات والتدريب."
        },
        saleBanner: {
            title: "شريك تشغيلي مرخّص",
            desc: "نقدّم نظامًا متكاملًا وجاهزًا للبيع، يجمع بين التعلّم، الاستشارة، والتطبيق العملي.\n\nنحن نتكفّل بـ:\n• المحتوى الكامل والتقنية\n• الهيكلة والمنهجية التشغيلية\n\nدورك كشريك:\n• تحصل على وصول كامل للنظام\n• تبيع بالسعر المحدَّد\n• تحتفظ بـ 100% من العائدات\n\n🔒 متاح لـ 5 شركاء فقط.\nهذا ليس كورس. هذا نظام جاهز للأعمال.",
            cta: "قدم طلب شراكة",
            close: "إغلاق"
        },
        demoDisclaimer: {
            text: "هذا فقط نموذج وليس نظام متكامل الأركان، للتفسير والفهم فقط."
        },
        verification: {
            badge: "التحقق من الشهادات",
            titlePre: "التحقق من المؤهلات",
            titleHighlight: "المهنية",
            subtitle: "تأكد من صحة شهاداتنا وتوصياتنا من خلال نظام التحقق الآمن لدينا.",
            label: "رقم الشهادة",
            placeholder: "مثال: CERT-2026-XXXX",
            buttonIdle: "تحقق الآن",
            buttonLoading: "جاري التحقق...",
            resultTitle: "تم العثور على شهادة صالحة",
            resultSubtitle: "تم التحقق بنجاح",
            subject: "صاحب الشهادة",
            domain: "مجال الخبرة",
            date: "تاريخ الإصدار",
            status: "الحالة",
            statusElite: "صالح ونشط",
            viewSign: "عرض التوقيع الرقمي",
            errorTitle: "فشل التحقق",
            errorDesc: "لم يتم العثور على شهادة بالرقم: {id}. يرجى التحقق من الرمز."
        },
        methodology: {
            badge: "بروتوكول النجاح",
            titlePre: "من مجرد موظف إلى",
            titleHighlight: "أصل استراتيجي",
            subtitle: "نحن لا نعلم. نحن نهندس. دورة التحول المكونة من 5 مراحل مصممة للسيطرة المهنية عالية التأثير.",
            ctaStart: "ابدأ التحول",
            ctaVideo: "شاهد البروتوكول",
            essence: {
                title: "لماذا تختار MA-TRAINING-CONSULTING",
                desc: "MA-TRAINING-CONSULTING هي شريكك العالمي. نجمع بين الاستشارات الخبيرة والتدريب العملي. قدرتك على إدارة الضغوط.",
                precision: "تشخيصات دقيقة ترسم خريطة حمضك النووي المهني.",
                recognition: "ضمانات معترف بها من قبل الأطر المؤسسية العالمية.",
                speed: "تسريع المسار المهني مع سد الفجوات بالذكاء الاصطناعي.",
                network: "وصول استراتيجي لشبكة مجالس الإدارة العالمية النخبوية."
            },
            cycle: {
                title: "تفويض التحول",
                subtitle: "رحلة معمارية صارمة من 5 مراحل من التشخيص إلى القيادة العليا.",
                stage1: {
                    title: "تدقيق المهارات العميق",
                    sub: "تحليل الحمض النووي المهني",
                    desc: "تقوم محركاتنا بالذكاء الاصطناعي بجرء تدقيق عميق لأصولك المهنية مقابل المعايير القيادية العالمية.",
                    f1: "رسم خرائط الأصول",
                    f2: "تدقيق الامتثال",
                    f3: "تحليل الفجوات"
                },
                stage2: {
                    title: "محاكاة الضغوط",
                    sub: "الذكاء العملياتي",
                    desc: "تحقق من قدرتك القيادية في بيئة عالية المخاطر. أدر سيناريوهات الأزمات في غرفة تحكم ذكية.",
                    f1: "ضغط السيناريو",
                    f2: "تدقيق الأزمات",
                    f3: "التواصل التنفيذي"
                },
                stage3: {
                    title: "التنفيذ الاستراتيجي",
                    sub: "هندسة القدرات",
                    desc: "الوصول إلى تفويضات تنفيذية مصممة لسد الفجوات المحددة بمحتوى عالي المردود.",
                    f1: "بناء القدرات",
                    f2: "أطر التنفيذ",
                    f3: "الذكاء العملي"
                },
                stage4: {
                    title: "بنك الموارد الاستراتيجية",
                    sub: "مجموعة الأدوات التنفيذية",
                    desc: "الوصول إلى بنك بروتوكولات التدقيق ومصفوفات المخاطر من كبرى شركات الاستشارة.",
                    f1: "بروتوكولات عالمية",
                    f2: "معايير التشغيل",
                    f3: "مصفوفات المخاطر"
                },
                stage5: {
                    title: "الوصول لمجالس الإدارة",
                    sub: "التوجيه التنفيذي",
                    desc: "تواصل مع مستشارين رفيعي المستوى للتخطيط لمسار مسيرتك الاستراتيجي.",
                    f1: "استراتيجية الإدارة",
                    f2: "دروس قيادية متقدمة",
                    f3: "إرث القيادة"
                }
            },
            ctaFinal: {
                title: "توقف عن التدرب. ابدأ بالسيطرة.",
                desc: "انضم إلى نخبة المحترفين الذين أعادوا رسم مسارهم باستخدام بروتوكول النجاح.",
                btnStart: "ابدأ تفويضي",
                btnPlans: "عرض خطط الوصول"
            }
        },
        pricing: {
            badge: "خطط العضوية",
            title: "ادفع مسيرتك القيادية للأمام",
            subtitle: "اختر التفويض الذي يتماشى مع أهدافك الاستراتيجية ومتطلباتك المهنية.",
            tiers: {
                initial: {
                    name: "الباقة الأولية",
                    badge: "اكتشاف",
                    price: "مجاني",
                    duration: "وصول لمدة 3 ساعات",
                    features: [
                        "وصول كامل للبروتوكول لمدة 3 ساعات",
                        "تدقيق الأصول الأولي بالذكاء الاصطناعي",
                        "وصول محدود للمحاكاة",
                        "وصول محدود لورش العمل",
                        "دعم مجتمعي"
                    ]
                },
                pro: {
                    name: "برو الأساسي",
                    badge: "الاختيار التنفيذي",
                    price: "30€",
                    duration: "/ سنوياً",
                    features: [
                        "أدوات تدقيق غير محدودة",
                        "وصول كامل للمستشار الذكي",
                        "دفع لكل محاكاة بشكل فردي",
                        "دفع لكل ورشة عمل بشكل فردي",
                        "تحديثات استراتيجية دورية"
                    ]
                },
                elite: {
                    name: "باقة النخبة الكاملة",
                    badge: "غمر كامل",
                    price: "65€",
                    duration: "/ شهرياً",
                    features: [
                        "محاكاة وكوتشينغ غير محدود",
                        "جميع ورش العمل التنفيذية مشمولة",
                        "دعم خبير مخصص (1-on-1)",
                        "خطاب توصية للنخبة",
                        "استشارات استراتيجية أسبوعية",
                        "مطلوب التزام لمدة 12 شهراً"
                    ]
                }
            },
            cta: "اختر تفويضك",
            contact: "استفسر من مستشار",
            guarantee: "معالجة آمنة 100% وفواتير رسمية"
        },
        expert: {
            title: "استخبارات الخبراء",
            subtitle: "احصل على نصيحة استراتيجية مخصصة من ذكاء اصطناعي متخصص في القيادة التنفيذية.",
            quickQuestions: "استعلامات الاستخبارات:",
            placeholder: "استجوب المستشار...",
            send: "أمر",
            careerExpert: "مستشار استراتيجي",
            loading: "المستشار يقوم بالحسابات...",
            defaultMessage: "جاهز لتقديم الإيجاز. لقد دققت أداءك الأخير. ما هو هدفك الاستراتيجي الحالي؟"
        },
        auth: {
            welcomeBack: "تم تأكيد الهوية",
            signInSubtitle: "سجل الدخول للوصول لمساحتك الاستراتيجية",
            emailLabel: "البريد الإلكتروني / الهوية",
            passwordLabel: "كود الوصول",
            signInButton: "مصادقة الدخول",
            signingIn: "جاري التحقق...",
            orContinueWith: "مصادقة بديلة",
            noAccount: "لست مسجلاً بعد؟",
            createOne: "تسجيل مجاني",
            errorInvalid: "تم رفض الوصول: بيانات غير صالحة",
            errorGeneric: "خطأ في النظام. جاري محاولة إعادة الاتصال."
        },
        dashboard: {
            welcome: "مرحباً بعودتك",
            subtitle: "رحلة تطويرك المهني نشطة.",
            topLearner: "ضمن أفضل 5% من المواهب",
            stats: {
                skillsGained: "مهارات تم التحقق منها",
                hoursLearned: "ساعات التدريب",
                certificates: "الشهادات"
            },
            currentFocus: {
                title: "التفويض الحالي",
                continue: "تنفيذ",
                resume: "العودة للمحاكاة",
                progress: "مستوى النضج",
                accessWorkshop: "موارد البروتوكول"
            },
            journey: {
                title: "رحلتك القيادية",
                stages: {
                    diagnosis: "تقييم المسار المهني",
                    diagnosisDesc: "تحليل الملف المهني وتحديد الفجوات.",
                    simulation: "محاكاة القيادة",
                    simulationDesc: "تقييم إدارة الأزمات واتخاذ القرارات.",
                    training: "برامج التطوير",
                    trainingDesc: "تطوير قيادي وكوتشينغ مخصص.",
                    library: "الموارد والأدوات",
                    libraryDesc: "الوصول لأطر العمل والأدوات المتميزة.",
                    expert: "شبكة القيادات",
                    expertDesc: "التواصل مع قادة عالميين وموجهين."
                }
            },
            recommended: {
                title: "الأولويات الموكلة إليك",
                seeAll: "عرض الكل"
            }
        },
        sidebar: {
            categories: {
                main: "الرئيسية",
                journey: "استراتيجية النجاح",
                achievements: "الأصول الرسمية",
                system: "الإعدادات"
            },
            items: {
                overview: "لوحة التحكم",
                diagnosis: "تقييم المسار المهني",
                tools: "محاكاة القيادة",
                training: "برامج التطوير",
                mentor: "المستشار الاستراتيجي",
                academy: "مركز المعرفة",
                library: "الأدوات والموارد",
                expert: "شبكة القيادات",
                certificates: "ملف الأداء التنفيذي الاستراتيجي",
                recommendation: "احصل على توصية",
                settings: "الإعدادات",
                signOut: "تسجيل الخروج"
            },
            premium: "عضو نخبوِي",
            loading: "جاري فك تشفير مساحة العمل..."
        },
        digitalization: {
            hero: {
                badge: "استشارات الأعمال والذكاء الاصطناعي",
                title: "طوّر أعمالك باستخدام",
                titleHighlight: "تحليل البيانات الاستراتيجي",
                subtitle: "نساعد الشركات على النمو، وتحسين العمليات، وإطلاق منتجات جديدة باستخدام تحليل الذكاء الاصطناعي ومنهجيات الاستشارة العالمية.",
                ctaStart: "ابدأ تقييم مشروعك",
                ctaPortfolio: "شاهد حلولنا"
            },
            process: {
                title: "من أين ستبدأ؟",
                subtitle: "اختر وضعك الحالي للحصول على خارطة طريق مخصصة.",
                options: {
                    existing: {
                        title: "مشروع قائم",
                        desc: "لدي عمل تجاري قائم وأحتاج إلى تحسين أو توسيع."
                    },
                    idea: {
                        title: "فكرة مشروع",
                        desc: "لدي مفهوم ولكن أحتاج إلى خطة للإطلاق."
                    },
                    none: {
                        title: "لا توجد فكرة",
                        desc: "أرغب في الاستثمار ولكن أحتاج إلى فرص مربحة."
                    }
                }
            },
            questions: {
                existing: [
                    { id: "q1", label: "التمركز الاستراتيجي", placeholder: "مثال: رائد في السوق، منافس، متخصص في نيش", type: "text" },
                    { id: "q2", label: "الإيرادات الحالية ومعدل النمو", placeholder: "مثال: 500 ألف/سنة، +20% نمو سنوي", type: "text" },
                    { id: "q3", label: "عنق الزجاجة التشغيلي الرئيسي", placeholder: "مثال: اكتساب العملاء، التوسع التقني، كفاءة الفريق", type: "text" },
                    { id: "q4", label: "الهدف الاستراتيجي لـ 12 شهر", placeholder: "مثال: التوسع لسوق جديد، مضاعفة الإيرادات", type: "text" }
                ],
                idea: [
                    { id: "q1", label: "عرض القيمة الأساسي", placeholder: "ما المشكلة التي تحلها ومن المستهدف؟", type: "text" },
                    { id: "q2", label: "حالة التحقق من السوق", placeholder: "مثال: مجرد فكرة، استبيان 100 شخص، نموذج أولي جاهز", type: "text" },
                    { id: "q3", label: "استراتيجية دخول السوق", placeholder: "مثال: إعلانات مدفوعة، مبيعات مباشرة، نمو فيروسي", type: "text" }
                ],
                none: [
                    { id: "q1", label: "رأس المال الاستثماري المتاح", placeholder: "مثال: 10k - 50k، 100k+", type: "text" },
                    { id: "q2", label: "الأصول المهنية الرئيسية", placeholder: "مثال: شبكة علاقات قوية، مهارات تقنية", type: "text" },
                    { id: "q3", label: "القطاع/الصناعة المفضلة", placeholder: "مثال: التكنولوجيا المالية، العقارات، التجارة الإلكترونية", type: "text" }
                ],
                freeTextLabel: "الملخص التنفيذي / التحدي المحدد",
                freeTextPlaceholder: "صف وضعك بالتفصيل. ما الذي يمنعك من الوصول للمستوى التالي؟ (سيستخدم المستشار الذكي هذا لبناء خارطة طريق مخصصة لك)",
                submit: "إنشاء خارطة الطريق الاستراتيجية"
            },
            portfolio: {
                title: "قصص نجاحنا",
                subtitle: "من الاستراتيجية إلى التنفيذ.",
                strategy: "الاستراتيجية",
                website: "المنتج الرقمي",
                training: "تدريب الفريق"
            },
            diagnostic: {
                title: "المستشار التنفيذي الذكي",
                subtitle: "سأقوم بتحليل مدخلاتك لإنشاء تحليل SWOT احترافي وخريطة تنفيذ ربع سنوية.",
                step: "خطوة",
                submit: "إنشاء التحليل",
                analyzing: "يقوم المستشار الذكي بهندسة خطتك...",
                swot: {
                    strengths: "نقاط القوة",
                    weaknesses: "نقاط الضعف",
                    opportunities: "الفرص",
                    threats: "التهديدات"
                },
                plan: "خارطة طريق التنفيذ"
            },
            blueprints: {
                title: "نماذج الابتكار القطاعي",
                subtitle: "اختر قطاعك لرؤية إطار عمل تحول رقمي كامل.",
                accompaniment: "الخدمة المرافقة: نقوم ببناء التكنولوجيا، تصميم قمع التسويق، وتدريب فريقك بالكامل.",
                demoLabel: "ديمو استراتيجية حي",
                items: [
                    {
                        id: "edtech",
                        title: "التدريب والتعليم",
                        strategy: "نموذج الأكاديمية الهجين",
                        desc: "تحويل التدريب التقليدي إلى أكاديمية رقمية قابلة للتوسع. ويبينار مبيعات آلي + منصة تعليمية.",
                        demoTitle: "ديمو منصة الأكاديمية"
                    },
                    {
                        id: "retail",
                        title: "التجارة والتجزئة",
                        strategy: "محرك البيع المباشر (D2C)",
                        desc: "تجاوز الأسواق العامة. ابن متجراً يركز على العلامة التجارية مع توصيات الذكاء الاصطناعي وإعادة الاستهداف.",
                        demoTitle: "تجربة المتجر الإلكتروني"
                    },
                    {
                        id: "services",
                        title: "الخدمات المهنية",
                        strategy: "مركز الخدمات الإنتاجية",
                        desc: "توقف عن بيع الساعات. بع النتائج. حجز آلي، بوابات عملاء، ونماذج اشتراك شهرية.",
                        demoTitle: "ديمو بوابة العملاء"
                    }
                ]
            },
            tools: {
                title: "أدوات النمو الحصرية",
                subtitle: "أنظمة برمجية جاهزة نقوم بتفعيلها لتسريع تطوير مشروعك.",
                items: [
                    {
                        title: "Meta-Manager Pro",
                        desc: "نظام آلي لإدارة محتوى وتفاعل صفحات فيسبوك وإنستغرام."
                    },
                    {
                        title: "LeadPulse CRM",
                        desc: "نظام متكامل لتتبع العملاء مصمم خصيصاً للتوسع السريع."
                    },
                    {
                        title: "AutoFunnel Builder",
                        desc: "هيكلية أقماع مبيعات عالية التحويل يتم تفعيلها في أيام معدودة."
                    }
                ]
            },
            trustedBy: {
                title: "تحالفات استراتيجية مع التميز العالمي",
                subtitle: "موثوقون من قبل شركات رؤيوية تسعى للهيمنة الرقمية."
            },
            metrics: {
                title: "تأثير استراتيجي مثبت بالأرقام",
                items: [
                    { value: "+140 مليون", label: "رؤوس أموال تم تحسينها", icon: "DollarSign" },
                    { value: "+450", label: "قصة نجاح رقمية", icon: "TrendingUp" },
                    { value: "12ms", label: "متوسط سرعة الاستجابة", icon: "Zap" },
                    { value: "98%", label: "نسبة رضا العملاء", icon: "ShieldCheck" }
                ]
            },
            methodology: {
                title: "منهجية الذكاء الاصطناعي الصناعي",
                subtitle: "هندستنا الخاصة للنمو المستدام والقابل للتوسع.",
                pillars: [
                    { title: "تدقيق المشروع", desc: "نحلل نموذج عملك الحالي، إيراداتك، والتحديات التي تواجهها." },
                    { title: "خطة العمل", desc: "نضع لك خارطة طريق خطوة بخطوة لتحقيق أهداف نموك." },
                    { title: "التنفيذ والتدريب", desc: "نساعدك في تنفيذ الاستراتيجية وتدريب فريق عملك." }
                ]
            }
        }
    }
};
