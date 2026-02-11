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
        system: {
            title: "The Executive Operating System",
            subtitle: "A complete ecosystem designed to transform potential into confirmed executive power.",
            stages: [
                { id: "01", title: "Audit", desc: "AI-driven skill gap analysis" },
                { id: "02", title: "Strategy", desc: "Personalized roadmap generation" },
                { id: "03", title: "Execution", desc: "Real-world mission simulations" },
                { id: "04", title: "Authority", desc: "Official certification & placement" }
            ]
        },
        audit: {
            badge: "Phase 1: Diagnosis",
            title: "The Forensic Career Audit",
            desc: "Stop guessing. Our AI deep-scans your profile against 50+ executive parameters to identify exactly where you stand versus where you want to be.",
            stat: "98% Accuracy",
            statDesc: "in skill gap identification",
            features: [
                "Analyzes your CV against global executive benchmarks.",
                "Identifies hidden skill gaps blocking your promotion.",
                "Generates a personalized 90-day execution roadmap."
            ],
            forensicsLabel: "AI Forensics Active",
            scanningLabel: "Scanning 50+ Parameters"
        },
        missions: {
            badge: "Phase 2: Simulation",
            title: "Corporate War Games",
            desc: "Theory is for students. You will execute real-world corporate missions—handling crises, managing P&L, and leading teams—under expert observation.",
            stat: "Risk-Free",
            statDesc: "Failure here saves you millions later",
            crisisLabel: "Live Crisis Scenario",
            features: [
                "Navigate high-pressure boardroom scenarios.",
                "Make critical financial & operational decisions.",
                "Receive instant feedback from AI & human experts."
            ]
        },
        assets: {
            badge: "Phase 3: Authority",
            title: "Bankable Career Proof",
            desc: "Don't just say you're good. Prove it. Graduate with a 'Strategic Performance Profile' that validates your capability to recruiters and boards.",
            stat: "Verified",
            statDesc: "Blockchain-ready credentials",
            p1_title: "Verified Performance History",
            p1_desc: "Every decision you make in simulations is recorded in a secure ledger, proving your competence to recruiters.",
            p2_title: "Boardroom-Ready Portfolio",
            p2_desc: "Export a comprehensive portfolio of your strategic work, not just a generic resume."
        },
        cert: {
            badge: "STRATEGIC WARRANT",
            title: "Official Accreditation",
            desc: "This is not a certificate of completion. It is a Warrant of Competence, verifying that you have successfully executed executive-level mandates.",
            cardTitle: "EXECUTIVE WARRANT",
            check1: "Internationally Recognized Standards",
            check2: "Verifiable Digital Ledger",
            check3: "Endorsed by Industry Leaders",
            cta: "Get Certified",
            cardSubtitle: "STRATEGIC ENDORSEMENT",
            cardFooter: "\"Accredited for demonstrating exceptional strategic capabilities and executive readiness.\"",
            warrant_text: "This warrant certifies that the holder has successfully demonstrated executive-level strategic competence.",
            authorized: "Authorized by System",
            ledger: "Secure Ledger ID"
        },
        mandate: {
            title: "SERVICE MANDATE",
            ref: "Ref",
            intro: "This document constitutes the legal agreement governing your access to the {plan} plan. By accepting it, you engage a service mandate with DIGITALISA - MA-TRAINING-CONSULTING.",
            section1_title: "1. Subject of the Mandate",
            section1_desc: "The present mandate is entrusted to DIGITALISA for the strategic support of the CLIENT within the framework of the {plan} plan. This service specifically includes:",
            section2_title: "2. Financial Conditions",
            section2_desc: "Access to this mandate is conditioned by the payment of the sum of {price}. Payment is due at the time of subscription and guarantees immediate access to the services described in Article 1.",
            section3_title: "3. Intellectual Property & Confidentiality",
            section3_desc: "All reports, diagnostics, and methodologies (including AI algorithms) remain the exclusive property of DIGITALISA. The CLIENT benefits from a personal use license. The CLIENT agrees to maintain the confidentiality of the provided strategic documents.",
            section4_title: "4. Data Protection (GDPR)",
            section4_desc: "Your professional data is processed in accordance with our Privacy Policy. It is used exclusively for the personalization of your support and is never shared with third parties.",
            signature_clause_title: "Electronic Signature Clause",
            signature_clause_desc: "By clicking the acceptance button below, you acknowledge having read the General Terms of Use and having accepted the terms of this mandate. This action is equivalent to a handwritten electronic signature according to Article 1367 of the Civil Code.",
            ready_for_auth: "Document ready for digital authentication",
            scroll_to_sign: "Scroll to sign the mandate ↓",
            footer_title: "Acceptance of the Mandate",
            footer_desc: "A PDF copy of this contract will be sent to your email after confirmation.",
            print: "Print",
            accept: "I accept the mandate"
        },
        footer: {
            rights: "© 2026 MA-TRAINING-CONSULTING.",
            tagline: "Global Consulting & Training Excellence."
        },
        saleBanner: {
            title: "Join Our Expert Team",
            desc: "We are constantly looking for independent consultants, experts, and trainers in all fields with extensive experience. We also need independent animators who excel in the art of public speaking, explanation, and presentation.",
            cta: "Apply as an Expert",
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
                desc: "MA-TRAINING-CONSULTING is your Global Partner. We combine expert consulting with practical workshops.",
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
                title: "Stop Learning. Start Dominating.",
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
                explorer: {
                    name: "Explorer",
                    badge: "Discovery",
                    price: "Free",
                    duration: "Forever",
                    features: [
                        "1 Complete CV Analysis (AI-powered)",
                        "3 questions/day to AI Advisor",
                        "Access to 3 professional templates",
                        "5 Knowledge Base articles",
                        "Basic career roadmap",
                        "Explorer badge on profile"
                    ]
                },
                professional: {
                    name: "Professional",
                    badge: "For Professionals",
                    price: "39€",
                    duration: "/ month",
                    priceYearly: "399€/year",
                    savings: "Save 69€",
                    features: [
                        "Unlimited CV Analysis",
                        "Unlimited AI Advisor 24/7",
                        "Complete tools library",
                        "1 Free Job Alignment/month",
                        "Simulations (149€/unit)",
                        "Workshops (49€-99€/unit)",
                        "Email support (48h)",
                        "Professional badge"
                    ]
                },
                executive: {
                    name: "Executive",
                    badge: "Best Value 🔥",
                    price: "79€",
                    duration: "/ month",
                    priceYearly: "799€/year",
                    savings: "Save 149€",
                    features: [
                        "Everything in Professional +",
                        "Unlimited Job Alignment",
                        "2 Free Simulations/month",
                        "1 Free Workshop/month",
                        "Official Recommendation Letter",
                        "SCI Report (Strategic Career Intelligence)",
                        "1 Consultation session/month (30min)",
                        "Priority support (24h)",
                        "Golden Executive badge",
                        "Early access to new features"
                    ]
                },
                elite: {
                    name: "Elite",
                    badge: "VIP Total Immersion",
                    price: "199€",
                    duration: "/ month",
                    priceYearly: "1,999€/year",
                    savings: "Save 389€",
                    features: [
                        "Everything in Executive +",
                        "Unlimited Simulations",
                        "Unlimited Workshops",
                        "4 Consultation sessions/month (1h each)",
                        "Dedicated personal expert",
                        "VIP support (6h + WhatsApp)",
                        "Monthly personalized reports",
                        "LinkedIn Profile review",
                        "Salary negotiation coaching",
                        "Platinum Elite badge",
                        "Exclusive events invitations",
                        "Lifetime content access (even after cancellation)"
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
                hoursLearned: "Workshop Hours",
                certificates: "Workshop Attestations"
            },
            liveSessions: {
                title: "Live Strategic Sessions",
                expert: "Expert",
                date: "Date",
                time: "Time",
                noSessions: "No sessions scheduled yet.",
                join: "Join Session",
                upcoming: "Upcoming Briefing"
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
                    training: "Executive Workshops",
                    trainingDesc: "Tailored individual workshops and high-stakes coaching.",
                    library: "Resources & Tools",
                    libraryDesc: "Access to premium frameworks and toolkits.",
                    expert: "Executive Network",
                    expertDesc: "Connect with global leaders and mentors.",
                    strategicReport: "Strategic Audit",
                    strategicReportDesc: "Executive-grade career intelligence report."
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
                strategicReport: "Strategic Career Intelligence",
                recommendation: "Get Recommendation",
                jobAlignment: "Strategic Role Alignment",
                settings: "Settings",
                signOut: "Sign Out"
            },
            premium: "Elite Member",
            loading: "Decrypting workspace...",
            sciReport: {
                loading: "Analyzing Strategic Intelligence...",
                pendingTitle: "Strategic Report Pending",
                pendingDesc: "Your Strategic Career Intelligence Report is being finalized by our executive board. It will appear here once the final validation is complete.",
                export: "Export Intelligence",
                exportDesc: "Download full 8-section advisory PDF for your next career review."
            }
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
        },
        jobAlignment: {
                title: "Strategic Role Alignment",
                subtitle: "Verify your executive readiness for a specific new role or promotion.",
                form: {
                    type: "Audit Type",
                    newJob: "New Opportunity",
                    promotion: "Internal Promotion",
                    descriptionLabel: "Job Description / Internal Vacancy Text",
                    placeholder: "Paste the complete JD or responsibilities here...",
                    submit: "Start Strategic Audit"
                },
                analysis: {
                    loading: "Architecting Deep Skill Evaluation...",
                    subtitle: "Our AI is analyzing the requirements against global executive standards."
                },
                questions: {
                    title: "Executive Competency Validation",
                    subtitle: "Please respond to these strategic scenarios to verify your alignment.",
                    submit: "Generate Final Alignment Report"
                },
                result: {
                    scoreLabel: "Strategic Alignment Score",
                    verdict: "Executive Verdict",
                    download: "Export Alignment Certificate",
                    strength: "Operational Strengths",
                    gap: "Strategic Gaps",
                    recommendation: "Implementation Roadmap"
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
        system: {
            title: "Le Système d'Exploitation Exécutif",
            subtitle: "Un écosystème complet conçu pour transformer le potentiel en pouvoir exécutif confirmé.",
            stages: [
                { id: "01", title: "Audit", desc: "Analyse des écarts de compétences par IA" },
                { id: "02", title: "Stratégie", desc: "Génération de feuille de route personnalisée" },
                { id: "03", title: "Exécution", desc: "Simulations de missions réelles" },
                { id: "04", title: "Autorité", desc: "Certification officielle & placement" }
            ]
        },
        audit: {
            badge: "Phase 1: Diagnostic",
            title: "L'Audit de Carrière Forensique",
            desc: "Arrêtez de deviner. Notre IA scanne votre profil contre plus de 50 paramètres exécutifs pour identifier exactement où vous vous situez.",
            stat: "Précision 98%",
            statDesc: "dans l'identification des lacunes",
            features: [
                "Analyse votre CV par rapport aux références exécutives mondiales.",
                "Identifie les lacunes de compétences cachées bloquant votre promotion.",
                "Génère une feuille de route d'exécution personnalisée de 90 jours."
            ],
            forensicsLabel: "Audit Forensique IA Actif",
            scanningLabel: "Scan de 50+ Paramètres"
        },
        missions: {
            badge: "Phase 2: Simulation",
            title: "Jeux de Guerre Corporatifs",
            desc: "La théorie est pour les étudiants. Vous exécuterez de vraies missions d'entreprise—gestion de crise, P&L, leadership—sous observation experte.",
            stat: "Sans Risque",
            statDesc: "L'échec ici vous sauve des millions plus tard",
            crisisLabel: "Scénario de Crise en Direct",
            features: [
                "Naviguez dans des scénarios de boardroom à haute pression.",
                "Prenez des décisions financières et opérationnelles critiques.",
                "Recevez un feedback instantané de l'IA et d'experts humains."
            ]
        },
        assets: {
            badge: "Phase 3: Autorité",
            title: "Preuve de Carrière Bancable",
            desc: "Ne dites pas juste que vous êtes bon. Prouvez-le. Obtenez un 'Profil de Performance Stratégique' qui valide votre capacité auprès des recruteurs.",
            stat: "Vérifié",
            statDesc: "Accréditations prêtes pour la blockchain",
            p1_title: "Historique de Performance Vérifié",
            p1_desc: "Chaque décision prise en simulation est enregistrée dans un registre sécurisé, prouvant votre compétence aux recruteurs.",
            p2_title: "Portfolio Prêt pour la Boardroom",
            p2_desc: "Exportez un portfolio complet de votre travail stratégique, pas seulement un CV générique."
        },
        cert: {
            badge: "MANDAT STRATÉGIQUE",
            title: "Accréditation Officielle",
            desc: "Ce n'est pas un certificat de complétion. C'est un Mandat de Compétence, vérifiant que vous avez exécuté avec succès des mandats de niveau exécutif.",
            cardTitle: "MANDAT EXÉCUTIF",
            check1: "Normes Internationalement Reconnues",
            check2: "Registre Numérique Vérifiable",
            check3: "Approuvé par les Leaders de l'Industrie",
            cta: "Obtenir la Certification",
            cardSubtitle: "ENDOSSEMENT STRATÉGIQUE",
            cardFooter: "\"Accrédité pour avoir démontré des capacités stratégiques exceptionnelles et une préparation exécutive.\"",
            warrant_text: "Ce mandat certifie que le titulaire a démontré avec succès une compétence stratégique de niveau exécutif.",
            authorized: "Autorisé par le Système",
            ledger: "ID Registre Sécurisé"
        },
        mandate: {
            title: "MANDAT DE SERVICE",
            ref: "Réf",
            intro: "Ce document constitue l'accord juridique régissant votre accès à la formule {plan}. En l'acceptant, vous engagez un mandat de service avec DIGITALISA - MA-TRAINING-CONSULTING.",
            section1_title: "1. Objet du Mandat",
            section1_desc: "Le présent mandat est confié à DIGITALISA pour l'accompagnement stratégique du CLIENT dans le cadre de la formule {plan}. Ce service inclut spécifiquement :",
            section2_title: "2. Conditions Financières",
            section2_desc: "L'accès à ce mandat est conditionné par le règlement de la somme de {price}. Le paiement est dû au moment de la souscription et garantit l'accès immédiat aux services décrits à l'article 1.",
            section3_title: "3. Propriété Intellectuelle & Confidentialité",
            section3_desc: "Tous les rapports, diagnostics et méthodologies (incluant les algorithmes IA) restent la propriété exclusive de DIGITALISA. Le CLIENT bénéficie d'une licence d'usage personnel. Le CLIENT s'engage à maintenir la confidentialité des documents stratégiques fournis.",
            section4_title: "4. Protection des Données (RGPD)",
            section4_desc: "Vos données professionnelles sont traitées conformément à notre Politique de Confidentialité. Elles sont utilisées exclusivement pour la personnalisation de votre accompagnement et ne sont jamais cédées à des tiers.",
            signature_clause_title: "Clause de Signature Électronique",
            signature_clause_desc: "En cliquant sur le bouton d'acceptation ci-dessous, vous reconnaissez avoir pris connaissance des Conditions Générales d'Utilisation et avoir accepté les termes du présent mandat. Cette action vaut signature électronique manuscrite selon l'article 1367 du Code Civil.",
            ready_for_auth: "Document prêt pour authentification digitale",
            scroll_to_sign: "Scrollez pour signer le mandat ↓",
            footer_title: "Acceptation du Mandat",
            footer_desc: "Une copie PDF de ce contrat sera envoyée à votre email après confirmation.",
            print: "Imprimer",
            accept: "J'accepte le mandat"
        },
        footer: {
            rights: "© 2026 MA-TRAINING-CONSULTING.",
            tagline: "L'excellence en Conseil & Workshop."
        },
        saleBanner: {
            title: "Rejoignez notre équipe d'experts",
            desc: "Nous sommes constamment à la recherche de consultants, d'experts et de formateurs indépendants dans tous les domaines, dotés d'une grande expérience. Nous recherchons également des animateurs indépendants excellant dans l'art de la parole, de l'explication et de la présentation.",
            cta: "Postuler en tant qu'expert",
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
                desc: "MA-TRAINING-CONSULTING est votre partenaire mondial. Nous combinons conseil expert et workshops individuels.",
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
                title: "Arrêtez d'Apprendre. Commencez à Dominer.",
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
                explorer: {
                    name: "Explorer",
                    badge: "Découverte",
                    price: "Gratuit",
                    duration: "Toujours",
                    features: [
                        "1 Analyse CV Complète (IA)",
                        "3 questions/jour au Conseiller IA",
                        "Accès à 3 modèles professionnels",
                        "5 articles de la Base de Connaissances",
                        "Feuille de route carrière basique",
                        "Badge Explorer sur le profil"
                    ]
                },
                professional: {
                    name: "Professionnel",
                    badge: "Pour Professionnels",
                    price: "39€",
                    duration: "/ mois",
                    priceYearly: "399€/an",
                    savings: "Économisez 69€",
                    features: [
                        "Analyse CV Illimitée",
                        "Conseiller IA Illimité 24/7",
                        "Bibliothèque d'outils complète",
                        "1 Alignement de Poste/mois",
                        "Simulations (149€/unité)",
                        "Workshops (49€-99€/unité)",
                        "Support Email (48h)",
                        "Badge Professionnel"
                    ]
                },
                executive: {
                    name: "Executive",
                    badge: "Meilleure Valeur 🔥",
                    price: "79€",
                    duration: "/ mois",
                    priceYearly: "799€/an",
                    savings: "Économisez 149€",
                    features: [
                        "Tout dans Professionnel +",
                        "Alignement de Poste Illimité",
                        "2 Simulations Gratuites/mois",
                        "1 Workshop Gratuit/mois",
                        "Lettre de Recommandation Officielle",
                        "Rapport SCI (Intelligence de Carrière Stratégique)",
                        "1 Session de Consultation/mois (30min)",
                        "Support Prioritaire (24h)",
                        "Badge Executive Doré",
                        "Accès anticipé aux nouvelles fonctionnalités"
                    ]
                },
                elite: {
                    name: "Elite",
                    badge: "Immersion Totale VIP",
                    price: "199€",
                    duration: "/ mois",
                    priceYearly: "1,999€/an",
                    savings: "Économisez 389€",
                    features: [
                        "Tout dans Executive +",
                        "Simulations Illimitées",
                        "Workshops Illimités",
                        "4 Sessions de Consultation/mois (1h chacune)",
                        "Expert personnel dédié",
                        "Support VIP (6h + WhatsApp)",
                        "Rapports personnalisés mensuels",
                        "Revue de Profil LinkedIn",
                        "Coaching négociation salaire",
                        "Badge Elite Platine",
                        "Invitations événements exclusifs",
                        "Accès contenu à vie (même après annulation)"
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
                hoursLearned: "Heures de Workshop",
                certificates: "Attestations de Workshop"
            },
            liveSessions: {
                title: "Sessions Stratégiques en Direct",
                expert: "Expert",
                date: "Date",
                time: "Heure",
                noSessions: "Aucune session prévue pour le moment.",
                join: "Rejoindre la Session",
                upcoming: "Briefing à venir"
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
                    training: "Workshops Individuels",
                    trainingDesc: "Workshops de leadership et coaching individuel sur-mesure.",
                    library: "Ressources & Outils",
                    libraryDesc: "Accès aux cadres et outils premium.",
                    expert: "Réseau Exécutif",
                    expertDesc: "Connexion avec des leaders mondiaux et mentors.",
                    strategicReport: "Audit Stratégique",
                    strategicReportDesc: "Rapport d'intelligence de carrière de niveau exécutif."
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
                strategicReport: "Intelligence Stratégique",
                recommendation: "Obtenir Recommandation",
                jobAlignment: "Alignment Stratégique de Rôle",
                settings: "Paramètres",
                signOut: "Déconnexion"
            },
            premium: "Membre Élite",
            loading: "Décryptage de l'espace...",
            sciReport: {
                loading: "Analyse de l'Intelligence Stratégique...",
                pendingTitle: "Rapport Stratégique En Attente",
                pendingDesc: "Votre rapport d'intelligence stratégique de carrière est en cours de finalisation par notre conseil exécutif. Il apparaîtra ici une fois la validation finale terminée.",
                export: "Exporter l'Intelligence",
                exportDesc: "Téléchargez le PDF complet de 8 sections pour votre prochain bilan de carrière."
            }
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
                    { title: "Exécution & Workshop", desc: "Nous vous aidons à mettre en œuvre la stratégie et coachons votre équipe." }
                ]
            }
        },
        jobAlignment: {
                title: "Alignment Stratégique de Rôle",
                subtitle: "Vérifiez votre préparation exécutive pour un nouveau rôle ou une promotion.",
                form: {
                    type: "Type d'Audit",
                    newJob: "Nouvelle Opportunité",
                    promotion: "Promotion Interne",
                    descriptionLabel: "Description du Poste / Texte de l'Offre",
                    placeholder: "Collez la description complète du poste ici...",
                    submit: "Démarrer l'Audit Stratégique"
                },
                analysis: {
                    loading: "Architecture de l'Évaluation des Compétences...",
                    subtitle: "Notre IA analyse les exigences par rapport aux standards mondiaux."
                },
                questions: {
                    title: "Validation des Compétences Exécutives",
                    subtitle: "Répondez à ces scénarios stratégiques pour vérifier votre alignement.",
                    submit: "Générer le Rapport d'Alignement Final"
                },
                result: {
                    scoreLabel: "Score d'Alignement Stratégique",
                    verdict: "Verdict Exécutif",
                    download: "Exporter le Certificat d'Alignement",
                    strength: "Forces Opérationnelles",
                    gap: "Lacunes Stratégiques",
                    recommendation: "Feuille de Route d'Implémentation"
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
        system: {
            title: "نظام التشغيل التنفيذي",
            subtitle: "نظام بيئي متكامل مصمم لتحويل الكفاءة الكامنة إلى قوة تنفيذية مؤكدة.",
            stages: [
                { id: "01", title: "التدقيق", desc: "تحليل فجوات المهارات بالذكاء الاصطناعي" },
                { id: "02", title: "الاستراتيجية", desc: "توليد خارطة طريق مخصصة" },
                { id: "03", title: "التنفيذ", desc: "محاكاة مهام وتحديات واقعية" },
                { id: "04", title: "السلطة", desc: "اعتماد رسمي وشهادات موثقة" }
            ]
        },
        audit: {
            badge: "المرحلة 1: التشخيص",
            title: "التدقيق المهني الجنائي",
            desc: "توقف عن التخمين. يقوم الذكاء الاصطناعي لدينا بمسح ملفك الشخصي مقابل أكثر من 50 معياراً تنفيذياً لتحديد مكانك بدقة.",
            stat: "دقة 98%",
            statDesc: "في تحديد الفجوات المهارية",
            features: [
                "تحليل سيرتك الذاتية مقابل معايير القيادة العالمية.",
                "تحديد فجوات المهارات الخفية التي تعيق ترقيتك.",
                "إنشاء خارطة طريق تنفيذية مخصصة لمدة 90 يوماً."
            ],
            forensicsLabel: "التحليل الجنائي للذكاء الاصطناعي نشط",
            scanningLabel: "مسح أكثر من 50 معياراً"
        },
        missions: {
            badge: "المرحلة 2: المحاكاة",
            title: "مناورات الشركات الكبرى",
            desc: "النظرية للطلاب. هنا ستقوم بتنفيذ مهام شركات حقيقية—إدارة الأزمات، الربح والخسارة، وقيادة الفرق—تحت ملاحظة الخبراء.",
            stat: "خالي من المخاطر",
            statDesc: "الفشل هنا ينقذ الملايين لاحقاً",
            crisisLabel: "سيناريو أزمة حية",
            features: [
                "خوض سيناريوهات غرف الاجتماعات عالية الضغط.",
                "اتخاذ قرارات مالية وعملياتية حاسمة.",
                "تلقي تعليقات فورية من خبراء الذكاء الاصطناعي والبشر."
            ]
        },
        assets: {
            badge: "المرحلة 3: السلطة",
            title: "إثبات مهني مصرفي",
            desc: "لا تكتفِ بالقول أنك جيد. أثبت ذلك. تخرج بـ 'ملف الأداء الاستراتيجي' الذي يثبت قدرتك للموظفين ومجالس الإدارة.",
            stat: "مؤكد",
            statDesc: "اعتمادات جاهزة للبلوكشين",
            p1_title: "سجل أداء تم التحقق منه",
            p1_desc: "يتم تسجيل كل قرار تتخذه في المحاكاة في سجل آمن، مما يثبت كفاءتك للموظفين.",
            p2_title: "محفظة جاهزة لمجالس الإدارة",
            p2_desc: "تصدير محفظة شاملة لعملك الاستراتيجي، وليس مجرد سيرة ذاتية عادية."
        },
        cert: {
            badge: "التفويض الاستراتيجي",
            title: "الاعتماد الرسمي",
            desc: "هذه ليست شهادة إتمام دورة. إنه تفويض بالكفاءة، يثبت أنك قمت بتنفيذ مهام على مستوى تنفيذي بنجاح.",
            cardTitle: "تفويض تنفيذي",
            check1: "معايير معترف بها دولياً",
            check2: "سجل رقمي قابل للتحقق",
            check3: "معتمد من قادة الصناعة",
            cta: "احصل على الاعتماد",
            cardSubtitle: "تزكية استراتيجية",
            cardFooter: "\"معتمد لإظهار قدرات استراتيجية استثنائية وجاهزية تنفيذية.\"",
            warrant_text: "تشهد هذه المذكرة أن حاملها قد أظهر بنجاح كفاءة استراتيجية على المستوى التنفيذي.",
            authorized: "معتمد من النظام",
            ledger: "معرف السجل الآمن"
        },
        mandate: {
            title: "تفويض الخدمة",
            ref: "مرجع",
            intro: "تشكل هذه الوثيقة الاتفاق القانوني الذي يحكم وصولك إلى خطة {plan}. بقبولها، فإنك تلتزم بتفويض خدمة مع DIGITALISA - MA-TRAINING-CONSULTING.",
            section1_title: "1. موضوع التفويض",
            section1_desc: "يتم إسناد هذا التفويض إلى DIGITALISA للدعم الاستراتيجي للعميل في إطار خطة {plan}. تتضمن هذه الخدمة على وجه التحديد:",
            section2_title: "2. الشروط المالية",
            section2_desc: "يرتبط الوصول إلى هذه الخدمة بسداد مبلغ {price}. يستحق الدفع عند الاشتراك ويضمن الوصول الفوري إلى الخدمات الموضحة في المادة 1.",
            section3_title: "3. الملكية الفكرية والسرية",
            section3_desc: "تظل جميع التقارير والتشخيصات والمنهجيات (بما في ذلك خوارزميات الذكاء الاصطناعي) ملكية حصرية لشركة DIGITALISA. يستفيد العميل من ترخيص استخدام شخصي. يوافق العميل على الحفاظ على سرية الوثائق الاستراتيجية المقدمة.",
            section4_title: "4. حماية البيانات (RGPD)",
            section4_desc: "يتم معالجة بياناتك المهنية وفقاً لسياسة الخصوصية الخاصة بنا. يتم استخدامها حصرياً لتخصيص دعمك ولا يتم مشاركتها أبداً مع أطراف ثالثة.",
            signature_clause_title: "بند التوقيع الإلكتروني",
            signature_clause_desc: "بالنقر على زر القبول أدناه، فإنك تقر بأنك قد قرأت شروط الاستخدام العامة وقبلت شروط هذا التفويض. هذا الإجراء يعادل التوقيع الإلكتروني بخط اليد وفقاً للمادة 1367 من القانون المدني.",
            ready_for_auth: "المستند جاهز للمصادقة الرقمية",
            scroll_to_sign: "قم بالتمرير لتوقيع التفويض ↓",
            footer_title: "قبول التفويض",
            footer_desc: "سيتم إرسال نسخة PDF من هذا العقد إلى بريدك الإلكتروني بعد التأكيد.",
            print: "طباعة",
            accept: "أقبل التفويض"
        },
        footer: {
            rights: "© 2026 MA-TRAINING-CONSULTING.",
            tagline: "التميز في الاستشارات والورش العملية."
        },
        saleBanner: {
            title: "انضم إلى فريق خبرائنا",
            desc: "نحن في بحث مستمر عن مستشارين، خبراء، ومدربين مستقلين في كافة المجالات وذوي خبرة كبيرة جداً. كما نبحث أيضاً عن مقدمين ومنشطين مستقلين يمتازون بفن المخاطبة والتفسير والتعريف.",
            cta: "سجل الآن كخبير",
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
                desc: "MA-TRAINING-CONSULTING هي شريكك العالمي. نجمع بين الاستشارات الخبيرة والورش العملية الفردية. قدرتك على إدارة الضغوط.",
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
                title: "توقف عن التلقين. ابدأ بالسيطرة.",
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
                explorer: {
                    name: "المستكشف",
                    badge: "اكتشاف",
                    price: "مجاني",
                    duration: "مدى الحياة",
                    features: [
                        "1 تحليل سيرة ذاتية كامل (ذكاء اصطناعي)",
                        "3 أسئلة/يوم للمستشار الذكي",
                        "وصول لـ 3 نماذج احترافية",
                        "5 مقالات من قاعدة المعرفة",
                        "خارطة طريق مهنية أساسية",
                        "شارة المستكشف في الملف الشخصي"
                    ]
                },
                professional: {
                    name: "محترف",
                    badge: "للمحترفين",
                    price: "39€",
                    duration: "/ شهرياً",
                    priceYearly: "399€/سنوياً",
                    savings: "وفر 69€",
                    features: [
                        "تحليل سيرة ذاتية غير محدود",
                        "مستشار ذكي غير محدود 24/7",
                        "مكتبة الأدوات الكاملة",
                        "1 توافق وظيفي مجاني/شهر",
                        "محاكاة (149€/وحدة)",
                        "ورش عمل (49€-99€/وحدة)",
                        "دعم عبر البريد (48 ساعة)",
                        "شارة محترف"
                    ]
                },
                executive: {
                    name: "تنفيذي",
                    badge: "أفضل قيمة 🔥",
                    price: "79€",
                    duration: "/ شهرياً",
                    priceYearly: "799€/سنوياً",
                    savings: "وفر 149€",
                    features: [
                        "كل شيء في باقة محترف +",
                        "توافق وظيفي غير محدود",
                        "2 محاكاة مجانية/شهر",
                        "1 ورشة عمل مجانية/شهر",
                        "خطاب توصية رسمي",
                        "تقرير SCI (ذكاء المسار الاستراتيجي)",
                        "1 جلسة استشارية/شهر (30 دقيقة)",
                        "دعم أولوية (24 ساعة)",
                        "شارة تنفيذي ذهبية",
                        "وصول مبكر للميزات الجديدة"
                    ]
                },
                elite: {
                    name: "النخبة",
                    badge: "غمر كامل VIP",
                    price: "199€",
                    duration: "/ شهرياً",
                    priceYearly: "1,999€/سنوياً",
                    savings: "وفر 389€",
                    features: [
                        "كل شيء في باقة تنفيذي +",
                        "محاكاة غير محدودة",
                        "ورش عمل غير محدودة",
                        "4 جلسات استشارية/شهر (1 ساعة لكل منها)",
                        "خبير شخصي مخصص",
                        "دعم VIP (6 ساعات + واتساب)",
                        "تقارير شهرية مخصصة",
                        "مراجعة ملف LinkedIn",
                        "كوتشينغ تفاوض الراتب",
                        "شارة النخبة البلاتينية",
                        "دعوات لفعاليات حصرية",
                        "وصول للمحتوى مدى الحياة (حتى بعد الإلغاء)"
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
                hoursLearned: "ساعات الورش العملية",
                certificates: "شهادات الورش"
            },
            liveSessions: {
                title: "الجلسات الاستراتيجية المباشرة",
                expert: "الخبير",
                date: "التاريخ",
                time: "الوقت",
                noSessions: "لا توجد جلسات مجدولة حالياً.",
                join: "انضم للجلسة",
                upcoming: "إيجاز قادم"
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
                    training: "الورش العملية الفردية",
                    trainingDesc: "ورش قيادية وكوتشينغ فردي مخصص على مقاسك.",
                    library: "الموارد والأدوات",
                    libraryDesc: "الوصول لأطر العمل والأدوات المتميزة.",
                    expert: "شبكة القيادات",
                    expertDesc: "التواصل مع قادة عالميين وموجهين.",
                    strategicReport: "التدقيق الاستراتيجي",
                    strategicReportDesc: "تقرير ذكاء المسار المهني من مستوى تنفيذي."
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
                strategicReport: "ذكاء المسار الاستراتيجي",
                recommendation: "احصل على توصية",
                jobAlignment: "تقييم التوافق الاستراتيجي",
                settings: "الإعدادات",
                signOut: "تسجيل الخروج"
            },
            premium: "عضو نخبوِي",
            loading: "جاري فك تشفير مساحة العمل...",
            sciReport: {
                loading: "جاري تحليل الذكاء الاستراتيجي...",
                pendingTitle: "التقرير الاستراتيجي قيد الانتظار",
                pendingDesc: "يتم حالياً وضع اللمسات الأخيرة على تقرير ذكاء المسار الاستراتيجي الخاص بك من قبل المجلس التنفيذي. سيظهر هنا بمجرد اكتمال الاعتماد النهائي.",
                export: "تصدير التقرير",
                exportDesc: "قم بتحميل التقرير الاستشاري الكامل المكون من 8 أقسام لمراجعته في مسارك المهني."
            }
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
                    { title: "التنفيذ والورش العملية", desc: "نساعدك في تنفيذ الاستراتيجية ونرافق فريق عملك خطوة بخطوة." }
                ]
            }
        },
        jobAlignment: {
            title: "تقييم التوافق الاستراتيجي",
            subtitle: "تحقق من جاهزيتك التنفيذية لمنصب جديد أو ترقية داخلية.",
            form: {
                type: "نوع التدقيق",
                newJob: "فرصة عمل جديدة",
                promotion: "ترقية داخلية",
                descriptionLabel: "وصف الوظيفة / نص الإعلان الوظيفي",
                placeholder: "ضع نص الوصف الوظيفي الكامل هنا...",
                submit: "بدء التدقيق الاستراتيجي"
            },
            analysis: {
                loading: "هندسة تقييم المهارات العميقة...",
                subtitle: "يقوم الذكاء الاصطناعي بتحليل المتطلبات مقابل المعايير التنفيذية العالمية."
            },
            questions: {
                title: "التحقق من الكفاءات التنفيذية",
                subtitle: "يرجى الإجابة على هذه السيناريوهات الاستراتيجية للتحقق من توافقك.",
                submit: "إصدار تقرير التوافق النهائي"
            },
            result: {
                scoreLabel: "درجة التوافق الاستراتيجي",
                verdict: "الحكم التنفيذي",
                download: "تصدير شهادة التوافق",
                strength: "نقاط القوة العملياتية",
                gap: "الفجوات الاستراتيجية",
                recommendation: "خارطة طريق التنفيذ"
            }
        }
    }
};
