export type Language = 'en' | 'fr' | 'ar';

export const translations = {
    en: {
        nav: {
            home: "Home",
            methodology: "Our Services",
            verify: "Verify Accreditation",
            signIn: "Sign In",
            workspace: "My Workspace",
            digitalization: "Business Solutions",
            professionals: "For Professionals",
            enterprises: "For Enterprises"
        },
        contract: {
            title: "Service Mandate",
            subtitle: "Strategic Advisory Partnership",
            step1: "Identity Verification",
            step2: "Mandate Terms",
            step3: "Digital Authorization",
            firstName: "First Name",
            lastName: "Last Name",
            phone: "Mobile Number",
            email: "Email Address",
            readTerms: "I have read and accept the mandate terms.",
            signLabel: "Digital Signature (Type Full Name)",
            signPlaceholder: "e.g. John Doe",
            submit: "Authorize Mandate",
            successTitle: "Mandate Authorized",
            successDesc: "Your partnership commitment has been recorded successfully.",
            download: "Download Mandate (PDF)",
            terms: `
**STRATEGIC ADVISORY SERVICE MANDATE**

1. **Objective**: The client engages the Strategic Advisory Firm for a professional transformation mandate.
2. **Confidentiality**: All diagnostic data, simulation results, and advisory opinions are strictly confidential between the firm and the client.
3. **Firm Commitment**: The advisor provides high-level strategic intelligence and expert-led simulations to build the client's executive capacity.
4. **Advisory Assets**: Official advisory dossiers and performance proofs are issued based on the successful validation of the protocol stages.
5. **Subscription**: Fees and payment cycles (Monthly, Quarterly, or Semi-Annual) are determined based on the client's specific diagnostic results and selected support level.

By signing below, you authorize the commencement of the strategic advisory mandate.
            `
        },
        hero: {
            badge: "🚀 Comprehensive Professional Development Platform",
            titlePre: "Elevate Your",
            titleHighlight: "Professional Level",
            subtitle: "The leading consulting platform for professionals combining precise diagnosis, realistic simulation, and strategic planning to develop your career and ensure your success.",
            ctaDashboard: "Start Free Diagnosis",
            ctaTour: "See How We Work"
        },
        features: {
            title: "Professional Development System",
            subtitle: "8 integrated modules designed to analyze and accelerate your career path with clarity and efficiency.",
            cards: {
                diagnosis: {
                    title: "1. Strategic Role Audit",
                    desc: "**Function:** Deep analysis of professional identity. \n**Action:** CV Audit vs. Target Market + Gap Diagnosis. \n**Result:** A precise maturity report identifying your immediate growth levers.",
                    tags: ["Audit", "Gap Analysis"]
                },
                simulation: {
                    title: "2. Coordinated Simulations",
                    desc: "**Function:** Real-time skill validation. \n**Action:** Crisis scenarios and strategic meetings with collaborative tools. \n**Result:** Objective evaluation of your performance under high pressure.",
                    tags: ["Missions", "Leadership"]
                },
                training: {
                    title: "3. Executive Workshops",
                    desc: "**Function:** Targeted and intensive development. \n**Action:** Mentorship sessions with international experts. \n**Result:** Mastering the tools and frameworks essential for leadership roles.",
                    tags: ["Workshops", "Mentorship"]
                },
                mentor: {
                    title: "4. Strategic AI Advisor",
                    desc: "**Function:** 24/7 permanent accompaniment. \n**Action:** AI support for daily challenges + Personalized learning plan. \n**Result:** Continuous expert guidance to secure your decisions.",
                    tags: ["24/7 Support", "AI Advisor"]
                },
                academy: {
                    title: "5. Knowledge Center",
                    desc: "**Function:** Library of advanced frameworks. \n**Action:** Access to global business cases and management methodologies. \n**Result:** Theoretical and strategic solidity aligned with global standards.",
                    tags: ["Strategy", "Case Studies"]
                },
                library: {
                    title: "6. Toolkits & Assets",
                    desc: "**Function:** Immediate operational efficiency. \n**Action:** Ready-to-use strategy templates, reports, and action plans. \n**Result:** Production of high-quality professional deliverables in record time.",
                    tags: ["Templates", "Productivity"]
                },
                expert: {
                    title: "7. Expert Consultation",
                    desc: "**Function:** Strategic second look. \n**Action:** Review of your critical projects by domain experts. \n**Result:** Drastic reduction of risks and validation of your directions.",
                    tags: ["Expert View", "Validation"]
                },
                roadmap: {
                    title: "8. 90-Day Roadmap",
                    desc: "**Function:** Execution planning. \n**Action:** Visual timeline with specific and measurable milestones. \n**Result:** Total clarity on your goals and the exact steps to reach them.",
                    tags: ["Roadmap", "Execution"]
                }
            }
        },
        system: {
            title: "The DIGNNOS- Protocol",
            subtitle: "A complete ecosystem designed to transform potential into confirmed executive authority.",
            stages: [
                { id: "01", title: "Diagnostic & Intelligence", desc: "AI-driven skill gap audit and strategic mapping" },
                { id: "02", title: "Execution & Simulations", desc: "Real-world missions under expert mentorship" },
                { id: "03", title: "Advisory & Authority", desc: "Strategic advisory dossier and placement" }
            ]
        },
        audit: {
            badge: "Strategic Audit Engine",
            title: "Strategic Role Alignment",
            desc: "Verify your executive readiness for a new role or internal promotion. Our AI compares your initial diagnosis with the target job description to generate a comprehensive gap analysis report.",
            stat: "AI Analysis",
            statDesc: "Alignment Readiness Reports",
            features: [
                "Strategic Comparison: Profile vs. Specific Job Description.",
                "Gap Identification: Clear report on what is missing for the new role.",
                "Readiness Verdict: Data-driven evaluation of your promotion potential."
            ],
            forensicsLabel: "AI Audit Engine Active",
            scanningLabel: "Generating Alignment Report"
        },
        missions: {
            badge: "Expert Accompaniment & Mentorship",
            title: "Expert-Led Simulations",
            desc: "Based on your initial diagnosis, our global experts mentor you through live sessions and real-world simulations. We precision-target your weaknesses and amplify your strengths to align you with the global job market.",
            stat: "Risk-Free Execution",
            statDesc: "Expert mentorship in safe environments",
            crisisLabel: "Live Market Scenario",
            features: [
                "Live mentorship workshops and specialized expert sessions.",
                "Tailored development based on your diagnosed skill gaps.",
                "High-stakes simulations to boost your global market value."
            ]
        },
        targetAudience: {
            title: "Who is this Platform for?",
            subtitle: "Our system is designed for professionals who refuse to settle for the status quo and aspire to global excellence.",
            cards: [
                {
                    title: "Rising Professionals",
                    desc: "Those seeking their next big promotion and wanting to master the skills needed for senior roles."
                },
                {
                    title: "Career Switchers",
                    desc: "Professionals moving to new industries who need a fast-track to bridge skill gaps and prove credibility."
                },
                {
                    title: "Aspiring Leaders",
                    desc: "Mid-level managers aiming for C-suite positions by developing strategic thinking and high-level EQ."
                },
                {
                    title: "Global Talent",
                    desc: "Experts wanting to align their profiles with international standards to work in top global firms."
                },
                {
                    title: "Fresh Graduates",
                    desc: "Talents just starting their journey who want to build a solid professional foundation from day one."
                },
                {
                    title: "Students & Aspiring Talent",
                    desc: "Those preparing to enter the market and wanting to understand real-world requirements before graduation."
                }
            ]
        },
        assets: {
            badge: "Professional Authority",
            title: "Strategic Consulting Assets",
            desc: "Beyond training, you receive a full suite of executive-grade strategic advisory documents that prove your market value.",
            reportsTitle: "Downloadable Consulting Reports",
            reports: [
                { title: "CV Analysis Results", desc: "Honest feedback and comprehensive analysis of your CV accuracy and capabilities." },
                { title: "Interview Evaluation Results", desc: "Data-driven results from your executive-level AI simulated interviews." },
                { title: "Career Path Recommendations", desc: "Personalized roles and sectors perfectly aligned with your diagnosis results." },
                { title: "Strategic CV & Recommendation", desc: "A re-engineered, high-impact CV and letter of recommendation based on your audit." }
            ],
            officialTitle: "Advisory Portfolio & Expert Opinions",
            official: [
                { title: "Strategic Capability Assessment", desc: "Detailed evaluation of your professional readiness and strategic thinking." },
                { title: "Expert Advisory Report", desc: "A formal expert opinion on your leadership potential, verifiable online." },
                { title: "Executive Scorecard", desc: "A transparent record of your performance metrics across all simulations." },
                { title: "Strategic Role Alignment", desc: "Proof of your compatibility with specific high-level executive positions." },
                { title: "Strategic Career Intelligence", desc: "In-depth audit of your long-term career trajectory and growth potential." }
            ],
            verifiable: "All advisory assets are 100% verifiable on our global platform."
        },
        cert: {
            badge: "ADVISORY EVIDENCE",
            title: "Your Strategic Profile",
            desc: "Verify your leadership DNA and strategic thinking. Our protocol generates strategic advisory evidence ready for recruiters and boards.",
            cardTitle: "Executive Readiness Profile",
            check1: "Strategic Impact Data",
            check2: "Digital Dossier Authentication",
            check3: "Validated Advisory Assets",
            cta: "Get Advisory Dossier",
            cardSubtitle: "Professional DNA ID",
            cardFooter: "\"Expert advisory on strategic mindset and executive readiness.\"",
            warrant_text: "This profile confirms that the bearer has demonstrated the specific strategic impact and executive potential required for top-tier roles.",
            authorized: "Validated via DIGNNOS- Protocol",
            ledger: "Advisory Dossier ID"
        },
        corporate: {
            badge: "CORPORATE & HR SOLUTIONS",
            title: "Objective Decision Support",
            desc: "We provide organizations with a free, objective Advisory Report. Based on the complete journey (Diagnosis, Simulations, Mentorship), we help you decide if a candidate is truly ready for a promotion or a new role.",
            feature1_title: "Verdict of Readiness",
            feature1_desc: "Clear 'Go/No-Go' recommendation for specific roles or internal promotions.",
            feature2_title: "Objective Gap Analysis",
            feature2_desc: "Direct mapping of strengths, weaknesses, and potential risks without bias.",
            feature3_title: "Pre-boarding Roadmap",
            feature3_desc: "Actionable steps to prepare the candidate or close critical gaps before they start.",
            freeBadge: "FREE ADVISORY",
            inquiryForm: {
                title: "Request Corporate Advisory",
                companyName: "Company Name",
                companyEmail: "Official Email",
                companyPhone: "Phone Number",
                targetPosition: "Target Position / Role",
                jobDesc: "Job Description / Requirements",
                candidateId: "Candidate Reference ID",
                candidateFirstName: "Candidate First Name",
                candidateLastName: "Candidate Last Name",
                reportDate: "Desired Report Date",
                interviewDate: "Interview Date",
                otherInfo: "Additional Requirements / Notes",
                submit: "Submit Request",
                success: "Request sent successfully! Our experts will contact you soon."
            }
        },
        mandate: {
            title: "SERVICE MANDATE",
            ref: "Ref",
            intro: "This document constitutes the formal strategic mandate governing the professional engagement between the CLIENT and the Strategic Advisory Firm (MA-TRAINING-CONSULTING).",
            section1_title: "ARTICLE 1: SUBJECT OF THE MANDATE",
            section1_desc: "The CLIENT entrusts the FIRM with a strategic advisory mandate aimed at professional transformation. This includes the audit of leadership assets and the execution of the DIGNNOS- Protocol.",
            section2_title: "ARTICLE 2: ENGAGEMENT & IMPLEMENTATION",
            section2_desc: "The FIRM provides high-level executive intelligence, crisis simulations, and expert workshops. The implementation follows a rigorous methodology designed to meet international management standards.",
            section3_title: "ARTICLE 3: FINANCIAL FRAMEWORK & BANKING COMPLIANCE",
            section3_desc: "Professional fees are determined based on the mandate scope. The FIRM satisfies all banking compliance requirements, providing official invoices and supporting documentation for bank transfers (SWIFT/SEPA).",
            section4_title: "ARTICLE 4: CONFIDENTIALITY & INTELLECTUAL PROPERTY",
            section4_desc: "All diagnostic reports and advisory methodologies remain the exclusive property of the FIRM. The CLIENT shall maintain strict confidentiality regarding all strategic dossiers provided.",
            section5_title: "ARTICLE 5: PROFESSIONAL ETHICS & RESPONSIBILITY",
            section5_desc: "Both parties agree to collaborate in good faith. The FIRM is committed to professional excellence, while the CLIENT ensures active participation in all protocol stages.",
            section6_title: "ARTICLE 6: JURISDICTION & DIGITAL AUTHORIZATION",
            section6_desc: "This mandate is governed by international advisory standards. Digital authorization constitutes an irrevocable legal signature authorizing the commencement of services.",
            signature_clause_title: "Digital Signature Clause",
            signature_clause_desc: "By accepting this mandate, you certify your identity and authorize the professional engagement. This action is recording as a legal digital signature for banking and administrative purposes.",
            ready_for_auth: "Mandate ready for digital authentication",
            scroll_to_sign: "Scroll to authorize the mandate ↓",
            footer_title: "Authorization of the Mandate",
            footer_desc: "A copy of this mandate will be sent to your email after digital authorization.",
            print: "Print",
            download: "Download PDF",
            signature_label: "Digital Signature (Type Full Name)",
            signature_placeholder: "e.g. John Doe",
            accept: "I authorize the mandate"
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
        recruit: {
            badge: "Recruitment 2026 Active",
            titlePre: "Architect the Future of",
            titleHighlight: "Executive Intelligence",
            subtitle: "We are expanding our global network of elite consultants, trainers, and masters of public speaking. We seek experts, animators, and strategic partners from around the world.",
            roles: {
                consultant: {
                    title: "Strategic Consultant",
                    desc: "Experts in corporate strategy, organizational design, and market entry."
                },
                technical: {
                    title: "Technical Lead",
                    desc: "Builders of digital ecosystems and AI transformation specialists."
                },
                animator: {
                    title: "Executive Animator",
                    desc: "Masters of public speaking and explanation who command the board room."
                },
                partner: {
                    title: "Strategic Partner",
                    desc: "Collaborators and contributors for global professional development."
                }
            },
            ctaInfo: "Go to Information Page",
            howToApply: {
                title: "Ready to Join?",
                desc: "Send your resume and a video presentation of 2-3 minutes answering: \"How do you architect growth?\"",
                email: "careers@careerupgrade.ai",
                whatsapp: "WhatsApp Recruitment: +216 99 123 456",
                button: "Transmit Assets"
            },
            infoPage: {
                title: "Terms & Conditions for Experts",
                subtitle: "Rules of Engagement & Professional Standards",
                description: "To maintain our standard of excellence, all consultants, experts, and partners must strictly adhere to the following conditions defined by the company.",
                conditions: [
                    "Compliance with global advisory and ethics standards.",
                    "Strict confidentiality regarding all client data and proprietary methodologies.",
                    "Active participation in continuous development and peer review processes.",
                    "Commitment to the mutual interest of the firm and the professional network.",
                    "Adherence to the formal contract and documented operating procedures."
                ],
                agreement: "I have read the document and agree to follow all conditions strictly for our mutual benefit and continuous development.",
                confirm: "Authorize Agreement"
            },
            form: {
                title: "Excellence Application",
                subtitle: "Complete your profile for strategic selection",
                common: {
                    fullName: "Full Name",
                    email: "Professional Email",
                    phone: "Contact Number",
                    cv: "CV Link / Drive Link",
                    video: "Presentation Video Link (YouTube/Vimeo/Drive)",
                    videoNote: "2-3 minutes answering: 'How do you architect growth?'",
                    submit: "Transmit Application",
                    successTitle: "Application Transmitted",
                    successDesc: "Your assets are being audited by our selection board."
                },
                roles: {
                    expert: {
                        label: "Expert / Consultant",
                        domain: "Primary Domain of Expertise",
                        experience: "Years of High-Level Experience",
                        projects: "Notable Projects / Clients",
                        tools: "Mastered Tools & Methodologies",
                        motivation: "Professional Vision & Description"
                    },
                    employee: {
                        label: "Permanent Employee",
                        position: "Target Position",
                        availability: "Availability (Notice Period)",
                        salary: "Expected Compensation Range",
                        education: "Highest Academic Degree",
                        motivation: "Career Objectives & Description"
                    },
                    partner: {
                        label: "Strategic Partner / Shareholder",
                        company: "Entity Name (if applicable)",
                        type: "Partnership Type (Equity/Resource/Client)",
                        contribution: "Proposed Strategic Contribution",
                        network: "Market Reach / Professional Network",
                        motivation: "Partnership Vision & Description"
                    },
                    animator: {
                        label: "Lead Animator",
                        specialty: "Speaking Specialty",
                        experience: "Public Speaking Record",
                        portfolio: "Performance Portfolio Link",
                        languages: "Languages Spoken",
                        motivation: "Stage Methodology & Description"
                    }
                }
            }
        },
        demoDisclaimer: {
            text: "This is a prototype model for demonstration purposes only, not a fully operational system."
        },
        verification: {
            badge: "Professional Verification",
            titlePre: "Verify Professional",
            titleHighlight: "Credentials",
            subtitle: "Ensure the authenticity of our official documents, recommendations, and strategic audits through our secure validation system.",
            label: "Reference or Member ID",
            placeholder: "e.g. EXP-2026-XXXX or EXEC-YYYY-...",
            buttonIdle: "Verify Now",
            buttonLoading: "Checking...",
            resultTitle: "Verified Credential Found",
            resultSubtitle: "Authentication successful",
            subject: "Credential Holder",
            domain: "Credential Type",
            date: "Issue Date",
            status: "Verification Status",
            statusElite: "Verified & Active",
            viewSign: "View Digital Signature",
            errorTitle: "Verification Failed",
            errorDesc: "No credential found for ID: {id}. Please check the reference code.",
            types: {
                member: "Certified Executive Member",
                workshop_attestation: "Workshop Attestation",
                performance_profile: "Executive Performance Profile",
                recommendation: "Letter of Recommendation",
                role_alignment: "Strategic Role Alignment",
                career_intelligence: "Strategic Career Intelligence"
            },
            corporateNoteTitle: "Company / HR Inquiry?",
            corporateNoteDesc: "Are you looking to evaluate a candidate or employee? We provide objective, data-backed advisory reports and free HR consulting based on their diagnostic journey.",
            corporateNoteCTA: "Get Corporate Advisory"
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
                btnStart: "Begin My Mandate"
            }
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
                diagnosis: "1. Diagnosis & Audit",
                tools: "2. Real-world Simulations",
                training: "3. Executive Workshops",
                mentor: "4. AI Advisor",
                academy: "5. Knowledge Base",
                library: "6. Resource Center",
                expert: "7. Expert Consultation",
                roadmap: "8. Career Roadmap",
                certificates: "Strategic Capability Assessment",
                strategicReport: "Strategic Career Intelligence",
                recommendation: "Get Recommendation",
                jobAlignment: "Strategic Role Alignment",
                settings: "Settings",
                signOut: "Sign Out"
            },
            premium: "Pro Member",
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
            },
            marketplace: {
                title: "Strategic Consultation Hub",
                subtitle: "Select a Strategic Framework. We Consult, Adapt, and Build Your Turnkey Solution.",
                viewProject: "View Strategy",
                startingPrice: "Consultation Start",
                currentBid: "Current Value",
                auctionEnds: "Exclusive Window Ends",
                bidNow: "Secure Strategy",
                sold: "Sold Out",
                demo: "Live Concept",
                details: {
                    generalIdea: "Foundational Concept",
                    strategy: "Strategic Roadmap",
                    extraServices: "Implementation Services",
                    auctionInfo: "Exclusive strategies are sold once. Includes deep strategic consulting to customize the framework and full implementation of all required modules."
                },
                backToProjects: "Back to Hub",
                buyNow: "Deploy Now",
                fixedPrice: "Asset Price",
                categories: {
                    all: "All Solutions",
                    basic: "Basic Assets",
                    pro: "Exclusive Strategies"
                },
                explanation: {
                    title: "The Strategic Hub",
                    description: "Select the foundation that matches your vision. We provide the expertise to transform these frameworks into your unique business reality.",
                    basicTitle: "Standard Frameworks",
                    basicDesc: "Ready-to-deploy digital structures. Includes standard setup and initial consulting to launch your presence.",
                    proTitle: "Exclusive Transformations",
                    proDesc: "Unique business models sold once. Includes deep strategic adaptation and end-to-end implementation of all necessary services."
                }
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
            badge: "🚀 Plateforme de Développement Professionnel Complète",
            titlePre: "Élevez Votre",
            titleHighlight: "Niveau Professionnel",
            subtitle: "La plateforme de conseil leader pour les professionnels combinant diagnostic précis, simulation réaliste et planification stratégique pour développer votre carrière et assurer votre succès.",
            ctaDashboard: "Commencer le Diagnostic Gratuit",
            ctaTour: "Voir Comment nous Travaillons"
        },
        features: {
            title: "Système de Développement Professionnel",
            subtitle: "8 modules intégrés conçus pour analyser et accélérer votre parcours avec clarté et efficacité.",
            cards: {
                diagnosis: {
                    title: "1. Audit de Rôle Stratégique",
                    desc: "**Fonction :** Analyse profonde de l'identité professionnelle. \n**Action :** Audit du CV vs Marché Cible + Diagnostic des écarts. \n**Résultat :** Un rapport de maturité précis identifiant vos leviers de croissance immédiats.",
                    tags: ["Audit", "Gap Analysis"]
                },
                simulation: {
                    title: "2. Simulations Coordonnées",
                    desc: "**Fonction :** Validation des compétences en temps réel. \n**Action :** Scénarios de crise et réunions stratégiques avec outils collaboratifs. \n**Résultat :** Évaluation objective de votre performance sous haute pression.",
                    tags: ["Missions", "Leadership"]
                },
                training: {
                    title: "3. Workshops Exécutifs",
                    desc: "**Fonction :** Développement ciblé et intensif. \n**Action :** Sessions de mentorat avec des experts internationaux. \n**Resultat :** Maîtrise des outils et frameworks indispensables pour les postes de direction.",
                    tags: ["Workshops", "Mentorat"]
                },
                mentor: {
                    title: "4. Conseiller Stratégique",
                    desc: "**Fonction :** Accompagnement permanent 24/7. \n**Action :** Support IA pour vos défis quotidiens + Plan d'apprentissage personnalisé. \n**Résultat :** Une guidance experte continue pour sécuriser vos décisions.",
                    tags: ["24/7 Support", "IA Advisor"]
                },
                academy: {
                    title: "5. Centre de Connaissances",
                    desc: "**Fonction :** Bibliothèque de frameworks avancés. \n**Action :** Accès aux cas d'affaires et méthodologies de gestion mondiales. \n**Résultat :** Solidité théorique et stratégique alignée sur les standards internationaux.",
                    tags: ["Stratégie", "Études de Cas"]
                },
                library: {
                    title: "6. Boîte à Outils & Assets",
                    desc: "**Fonction :** Efficacité opérationnelle immédiate. \n**Action :** Templates de stratégies, rapports et plans d'action prêts à l'emploi. \n**Résultat :** Production de livrables professionnels de haute qualité en un temps record.",
                    tags: ["Templates", "Productivity"]
                },
                expert: {
                    title: "7. Consultation d'Expert",
                    desc: "**Fonction :** Second regard stratégique. \n**Action :** Révision de vos projets critiques par des experts du domaine. \n**Résultat :** Réduction drastique des risques et validation de vos orientations.",
                    tags: ["Expert View", "Validation"]
                },
                roadmap: {
                    title: "8. Feuille de Route 90 Jours",
                    desc: "**Fonction :** Planification de l'exécution. \n**Action :** Chronologie visuelle avec jalons spécifiques et mesurables. \n**Résultat :** Clarté totale sur vos objectifs et les étapes exactes pour les atteindre.",
                    tags: ["Roadmap", "Exécution"]
                }
            }
        },
        system: {
            title: "Le Protocole DIGNNOS-",
            subtitle: "Un écosystème complet conçu pour transformer le potentiel en autorité exécutive confirmée.",
            stages: [
                { id: "01", title: "Diagnostic & Intelligence", desc: "Audit par IA et cartographie des écarts de compétences" },
                { id: "02", title: "Mise en Situation & Simulations", desc: "Exécution de missions réelles sous mentorat d'experts" },
                { id: "03", title: "Advisory & Autorité", desc: "Dossier de conseil stratégique et placement" }
            ]
        },
        audit: {
            badge: "Moteur d'Audit Stratégique",
            title: "Évaluation de l'Alignement Exécutif",
            desc: "Vérifiez votre préparation exécutive pour un nouveau poste ou une promotion interne. Notre IA compare votre diagnostic initial avec la description du poste pour générer un rapport d'analyse complet.",
            stat: "Analyse IA",
            statDesc: "Rapports d'alignement stratégique",
            features: [
                "Comparaison Stratégique : Profil vs Description de Poste spécifique.",
                "Identification des Écarts : Rapport clair sur les compétences manquantes.",
                "Verdict de Préparation : Évaluation basée sur les données pour votre promotion."
            ],
            forensicsLabel: "IA d'Audit Active",
            scanningLabel: "Génération du rapport d'alignement"
        },
        missions: {
            badge: "Accompagnement et Mentorat d'Experts",
            title: "Simulations Dirigées par des Experts",
            desc: "Sur la base de votre diagnostic initial, nos experts mondiaux vous accompagnent lors de sessions en direct et de simulations réelles. Nous ciblons vos faiblesses et amplifions vos forces pour vous aligner sur le marché mondial.",
            stat: "Exécution sans risque",
            statDesc: "Mentorat d'experts en environnement sécurisé",
            crisisLabel: "Scénario de Marché en Direct",
            features: [
                "Ateliers de mentorat en direct et sessions d'experts spécialisés.",
                "Développement sur mesure basé sur vos lacunes diagnostiquées.",
                "Simulations à enjeux élevés pour booster votre valeur sur le marché mondial."
            ]
        },
        targetAudience: {
            title: "À qui s'adresse cette plateforme ?",
            subtitle: "Notre système est conçu pour les professionnels qui refusent le statu quo et aspirent à l'excellence mondiale.",
            cards: [
                {
                    title: "Professionnels en Ascension",
                    desc: "Ceux qui cherchent leur prochaine grande promotion et veulent maîtriser les compétences des rôles seniors."
                },
                {
                    title: "Changement de Carrière",
                    desc: "Professionnels en transition vers de nouveaux secteurs ayant besoin d'accélérer leur montée en compétence."
                },
                {
                    title: "Futurs Leaders",
                    desc: "Managers de niveau intermédiaire visant des postes de direction en développant leur pensée stratégique."
                },
                {
                    title: "Talents Internationaux",
                    desc: "Experts souhaitant aligner leur profil sur les standards mondiaux pour intégrer les grandes firmes."
                },
                {
                    title: "Jeunes Diplômés",
                    desc: "Les talents qui commencent leur parcours et aspirent à bâtir une base professionnelle solide dès le premier jour."
                },
                {
                    title: "Étudiants et Aspirants",
                    desc: "Ceux qui se préparent à entrer sur le marché et veulent comprendre les exigences réelles avant l'obtention du diplôme."
                }
            ]
        },
        assets: {
            badge: "Autorité Professionnelle",
            title: "Actifs de Conseil Stratégique",
            desc: "Prouvez votre impact. Obtenez une validation claire et basée sur vos données réelles, prête à être présentée aux recruteurs et conseils d'administration.",
            reportsTitle: "Rapports de Conseil Exécutif",
            reports: [
                { title: "Audit de Maturité CV", desc: "Analyse critique et recommandations d'optimisation basées sur les standards du marché cible." },
                { title: "Évaluation de Performance IA", desc: "Rapport détaillé de vos compétences décisionnelles et opérationnelles suite aux simulations." },
                { title: "Plan de Croissance 90 Jours", desc: "Feuille de route stratégique personnalisée pour sécuriser vos premiers succès en poste." },
                { title: "Dossier d'Expertise Digitale", desc: "Compilation de vos livrables et recommandations produits durant le programme." }
            ],
            officialTitle: "Documentation & Avis d'Expert",
            official: [
                { title: "Warrant de Capacité Stratégique", desc: "Document officiel attestant de votre aptitude à porter des responsabilités de direction." },
                { title: "Attestation de Validation de Profile", desc: "Validation factuelle de votre parcours d'excellence, vérifiable par QR code." },
                { title: "Portfolio de Missions Réelles", desc: "Preuve tangible de vos capacités d'exécution sur des scénarios d'affaires complexes." },
                { title: "Scorecard de Leadership", desc: "Synthèse de vos métriques de performance validée par nos experts mondiaux." },
                { title: "Audit d'ADN Professionnel", desc: "Analyse profonde de votre identité de leader et de votre potentiel de transformation." }
            ],
            verifiable: "Tous les dossiers de conseil sont 100% vérifiables sur notre registre global sécurisé."
        },
        cert: {
            badge: "AVIS D'EXPERT",
            title: "L' डीएनए Professional Profile",
            desc: "Votre capital professionnel mérite un avis d'expert indiscutable. Notre protocole d'audit génère des documents de conseil stratégique prêts pour les comités de direction.",
            cardTitle: "Profil de Préparation Exécutive",
            check1: "Validation d'Impact Stratégique",
            check2: "Authentification de Dossier Digital",
            check3: "Avis Experts Validés",
            cta: "Obtenir le Dossier de Conseil",
            cardSubtitle: "Dossier d'Expertise Professionnelle",
            cardFooter: "\"Avis d'expert sur la préparation exécutive et le leadership stratégique.\"",
            warrant_text: "Ce profil atteste que le porteur a validé avec succès les compétences décisionnelles et l'autorité exécutive requises pour le haut management.",
            authorized: "Validé via Protocole DIGNNOS-",
            ledger: "ID de Dossier Conseil"
        },
        corporate: {
            badge: "SOLUTIONS D'AIDE À LA DÉCISION",
            title: "Expertise RH & Stratégique Objective",
            desc: "Nous fournissons aux organisations un rapport d'avis indépendant et factuel. En croisant diagnostic IA et simulations réelles, nous validons avec précision si un talent est prêt pour une promotion critique ou un recrutement stratégique.",
            feature1_title: "Verdict de Préparation",
            feature1_desc: "Recommandation claire pour des rôles spécifiques ou des promotions internes.",
            feature2_title: "Analyse Objective des Écarts",
            feature2_desc: "Cartographie directe des forces, faiblesses et risques potentiels, sans biais.",
            feature3_title: "Roadmap de Pré-intégration",
            feature3_desc: "Étapes concrètes pour préparer le candidat ou combler les lacunes critiques.",
            freeBadge: "CONSEIL GRATUIT",
            inquiryForm: {
                title: "Demander un Conseil Corporate",
                companyName: "Nom de l'entreprise",
                companyEmail: "Email officiel",
                companyPhone: "Numéro de téléphone",
                targetPosition: "Poste / Rôle visé",
                jobDesc: "Description du poste / Exigences",
                candidateId: "ID de référence du candidat",
                candidateFirstName: "Prénom du candidat",
                candidateLastName: "Nom du candidat",
                reportDate: "Date souhaitée du rapport",
                interviewDate: "Date de l'entretien",
                otherInfo: "Exigences supplémentaires / Notes",
                submit: "Envoyer la demande",
                success: "Demande envoyée avec succès ! Nos experts vous contacteront bientôt."
            }
        },
        mandate: {
            title: "MANDAT DE PRESTATION",
            ref: "Réf",
            intro: "Ce document constitue le mandat stratégique formel régissant l'engagement professionnel entre le CLIENT et le Cabinet de Conseil Stratégique (MA-TRAINING-CONSULTING).",
            section1_title: "ARTICLE 1 : OBJET DU MANDAT",
            section1_desc: "Le CLIENT confie au CABINET un mandat de conseil stratégique visant à la transformation professionnelle. Ceci inclut l'audit des actifs de leadership et l'exécution du Protocole DIGNNOS-.",
            section2_title: "ARTICLE 2 : ENGAGEMENT & MISE EN ŒUVRE",
            section2_desc: "Le CABINET fournit une intelligence exécutive de haut niveau, des simulations de crise et des ateliers d'experts. La mise en œuvre suit une méthodologie rigoureuse conforme aux standards internationaux.",
            section3_title: "ARTICLE 3 : CADRE FINANCIER & CONFORMITÉ BANCAIRE",
            section3_desc: "Les honoraires professionnels sont déterminés selon l'étendue du mandat. Le CABINET satisfait à toutes les exigences de conformité bancaire, fournissant des factures officielles pour les virements (SWIFT/SEPA).",
            section4_title: "ARTICLE 4 : CONFIDENTIALITÉ & PROPRIÉTÉ INTELLECTUELLE",
            section4_desc: "Tous les rapports de diagnostic et méthodologies de conseil restent la propriété exclusive du CABINET. Le CLIENT s'engage à maintenir une confidentialité stricte.",
            section5_title: "ARTICLE 5 : ÉTHIQUE & RESPONSABILITÉ PROFESSIONNELLE",
            section5_desc: "Les deux parties s'engagent à collaborer de bonne foi. Le CABINET s'engage à l'excellence professionnelle, tandis que le CLIENT assure une participation active.",
            section6_title: "ARTICLE 6 : JURIDICTION & AUTORISATION DIGITALE",
            section6_desc: "Ce mandat est régi par les normes internationales de conseil. L'autorisation digitale constitue une signature juridique irrévocable autorisant le début des services.",
            signature_clause_title: "Clause de Signature Digitale",
            signature_clause_desc: "En acceptant ce mandat, vous certifiez votre identité. Cette action est enregistrée comme une signature numérique légale à des fins bancaires et administratives.",
            ready_for_auth: "Mandat prêt pour authentification digitale",
            scroll_to_sign: "Scrollez pour autoriser le mandat ↓",
            footer_title: "Autorisation du Mandat",
            footer_desc: "Une copie de ce mandat sera envoyée à votre email après autorisation digitale.",
            print: "Imprimer",
            download: "Télécharger PDF",
            signature_label: "Signature Numérique (Nom Complet)",
            signature_placeholder: "ex: Jean Dupont",
            accept: "J'autorise le mandat"
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
        recruit: {
            badge: "Recrutement 2026 Actif",
            titlePre: "Architecturer le Futur de",
            titleHighlight: "l'Intelligence Exécutive",
            subtitle: "Nous élargissons notre réseau mondial de consultants d'élite, d'experts et de maîtres de la parole. Nous recherchons des experts, animateurs et partenaires stratégiques du monde entier.",
            roles: {
                consultant: {
                    title: "Consultant Stratégique",
                    desc: "Experts en stratégie d'entreprise, design organisationnel et entrée sur le marché."
                },
                technical: {
                    title: "Leader Technique",
                    desc: "Bâtisseurs d'écosystèmes numériques et spécialistes de la transformation IA."
                },
                animator: {
                    title: "Animateur Exécutif",
                    desc: "Maîtres de la parole et de l'explication qui maîtrisent les salles de conseil."
                },
                partner: {
                    title: "Partenaire Stratégique",
                    desc: "Collaborateurs et contributeurs pour le développement professionnel mondial."
                }
            },
            ctaInfo: "Aller à la page d'information",
            howToApply: {
                title: "Prêt à nous rejoindre ?",
                desc: "Envoyez votre CV et une présentation vidéo de 2-3 minutes répondant à : \"Comment architecturez-vous la croissance ?\"",
                email: "careers@careerupgrade.ai",
                whatsapp: "Recrutement WhatsApp : +216 99 123 456",
                button: "Transmettre les Atouts"
            },
            infoPage: {
                title: "Conditions pour les Experts",
                subtitle: "Règles d'Engagement et Standards Professionnels",
                description: "Pour maintenir notre standard d'excellence, tous les consultants, experts et partenaires doivent strictement adhérer aux conditions suivantes définies par l'entreprise.",
                conditions: [
                    "Respect des standards mondiaux de conseil et d'éthique.",
                    "Confidentialité stricte concernant toutes les données clients et méthodologies propriétaires.",
                    "Participation active aux processus de développement continu et de revue par les pairs.",
                    "Engagement envers l'intérêt mutuel du cabinet et du réseau professionnel.",
                    "Respect du contrat formel et des procédures opérationnelles documentées."
                ],
                agreement: "J'ai lu le document et j'accepte de suivre strictement toutes les conditions pour notre bénéfice mutuel et un développement continu.",
                confirm: "Autoriser l'Accord"
            },
            form: {
                title: "Candidature d'Excellence",
                subtitle: "Complétez votre profil pour une sélection stratégique",
                common: {
                    fullName: "Nom Complet",
                    email: "Email Professionnel",
                    phone: "Numéro de Contact",
                    cv: "Lien CV / Lien Drive",
                    video: "Lien Vidéo de Présentation (YouTube/Vimeo/Drive)",
                    videoNote: "2-3 minutes répondant à : 'Comment architecturez-vous la croissance ?'",
                    submit: "Transmettre la Candidature",
                    successTitle: "Candidature Transmise",
                    successDesc: "Vos atouts sont en cours d'audit par notre comité de sélection."
                },
                roles: {
                    expert: {
                        label: "Expert / Consultant",
                        domain: "Domaine d'Expertise Principal",
                        experience: "Années d'Expérience de Haut Niveau",
                        projects: "Projets / Clients Notables",
                        tools: "Outils & Méthodologies Maîtrisés",
                        motivation: "Vision Professionnelle & Description"
                    },
                    employee: {
                        label: "Employé Permanent",
                        position: "Poste Visé",
                        availability: "Disponibilité (Préavis)",
                        salary: "Fourchette de Rémunération Attendue",
                        education: "Diplôme Académique le plus élevé",
                        motivation: "Objectifs de Carrière & Description"
                    },
                    partner: {
                        label: "Partenaire / Actionnaire Stratégique",
                        company: "Nom de l'Entité (si applicable)",
                        type: "Type de Partenariat (Equity/Ressource/Client)",
                        contribution: "Contribution Stratégique Proposée",
                        network: "Portée du Marché / Réseau Professionnel",
                        motivation: "Vision du Partenariat & Description"
                    },
                    animator: {
                        label: "Animateur Principal",
                        specialty: "Spécialité d'Élocution",
                        experience: "Historique de Prises de Parole",
                        portfolio: "Lien Portfolio / Performance",
                        languages: "Langues Maîtrisées",
                        motivation: "Méthodologie d'Animation & Description"
                    }
                }
            }
        },
        demoDisclaimer: {
            text: "Ceci est un modèle prototype à des fins de démonstration uniquement, et non un système opérationnel complet."
        },
        verification: {
            badge: "Vérification Professionnelle",
            titlePre: "Vérifier les",
            titleHighlight: "Titres et Accréditations",
            subtitle: "Assurez l'authenticité de nos documents officiels, recommandations et audits stratégiques via notre système de validation sécurisé.",
            label: "Référence ou ID Membre",
            placeholder: "ex: EXP-2026-XXXX ou EXEC-YYYY-...",
            buttonIdle: "Vérifier Maintenant",
            buttonLoading: "Vérification...",
            resultTitle: "Accréditation Valide Trouvée",
            resultSubtitle: "Authentification réussie",
            subject: "Titulaire",
            domain: "Type de Document",
            date: "Date d'Émission",
            status: "Statut de Vérification",
            statusElite: "Vérifié & Actif",
            viewSign: "Voir Signature Numérique",
            errorTitle: "Échec de la Vérification",
            errorDesc: "Aucun titre trouvé pour l'ID : {id}. Veuillez vérifier le code de référence.",
            types: {
                member: "Membre Exécutif Certifié",
                workshop_attestation: "Attestation d'Atelier",
                performance_profile: "Profil de Performance Exécutif",
                recommendation: "Lettre de Recommandation",
                role_alignment: "Alignement de Rôle Stratégique",
                career_intelligence: "Intelligence de Carrière Stratégique"
            },
            corporateNoteTitle: "Demande Entreprise / RH ?",
            corporateNoteDesc: "Vous cherchez à évaluer un candidat ou un employé ? Nous fournissons des rapports d'avis objectifs basés sur les données et du conseil RH gratuit basés sur leur parcours de diagnostic.",
            corporateNoteCTA: "Obtenir un Conseil Corporate"
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
                btnStart: "Commencer Mon Mandat"
            }
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
                diagnosis: "1. Diagnostic & Audit",
                tools: "2. Simulations Réelles",
                training: "3. Workshops Exécutifs",
                mentor: "4. Conseiller IA",
                academy: "5. Base de Connaissances",
                library: "6. Centre de Ressources",
                expert: "7. Consultation d'Experts",
                roadmap: "8. Feuille de Route",
                certificates: "Évaluation des Capacités Stratégiques",
                strategicReport: "Intelligence Stratégique",
                recommendation: "Obtenir Recommandation",
                jobAlignment: "Alignement Stratégique",
                settings: "Paramètres",
                signOut: "Déconnexion"
            },
            premium: "Membre Pro",
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
            },
            marketplace: {
                title: "Hub de Consultation Digitale",
                subtitle: "Choisissez un Framework. Nous Consultions, Adaptons et Bâtissons votre Solution.",
                viewProject: "Voir la Stratégie",
                startingPrice: "Début Consultation",
                currentBid: "Valeur Actuelle",
                auctionEnds: "Fin de l'Exclusivité",
                bidNow: "Sécuriser la Stratégie",
                sold: "Vendu",
                demo: "Concept en Direct",
                details: {
                    generalIdea: "Concept Fondateur",
                    strategy: "Feuille de Route Stratégique",
                    extraServices: "Services d'Implémentation",
                    auctionInfo: "Les stratégies exclusives sont vendues une fois. Comprend un conseil approfondi pour personnaliser le framework et l'implémentation complète."
                },
                backToProjects: "Retour au Hub",
                buyNow: "Déployer Maintenant",
                fixedPrice: "Prix de l'Asset",
                categories: {
                    all: "Toutes les Solutions",
                    basic: "Assets Standards",
                    pro: "Stratégies Exclusives"
                },
                explanation: {
                    title: "Le Hub Stratégique",
                    description: "Sélectionnez la base qui correspond à votre vision. Nous apportons l'expertise pour transformer ces frameworks en réalité commerciale.",
                    basicTitle: "Frameworks Standards",
                    basicDesc: "Structures digitales prêtes à l'emploi. Inclut l'installation standard et le conseil initial pour démarrer votre présence.",
                    proTitle: "Transformations Exclusives",
                    proDesc: "Modèles d'affaires uniques vendus une fois. Inclut une adaptation stratégique personnalisée et l'implémentation de bout en bout."
                }
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
            verify: "التحقق من الاعتماد",
            signIn: "تسجيل الدخول",
            workspace: "مساحتي",
            digitalization: "حلول الأعمال",
            professionals: "للمهنيين",
            enterprises: "للشركات"
        },
        contract: {
            title: "تفويض الخدمة الاستراتيجي",
            subtitle: "تفويض مهني استشاري",
            step1: "التحقق من الهوية",
            step2: "بنود التفويض",
            step3: "المصادقة الرقمية",
            firstName: "الاسم الأول",
            lastName: "الاسم الأخير",
            phone: "رقم الجوال",
            email: "البريد الإلكتروني",
            readTerms: "أقر بقرائتي والموافقة على بنود التفويض الاستشاري.",
            signLabel: "التوقيع الرقمي (اكتب الاسم الكامل)",
            signPlaceholder: "مثال: فلان الفلاني",
            submit: "المصادقة على التفويض",
            successTitle: "تمت المصادقة الرقمية",
            successDesc: "تم تسجيل تفويضك المهني بنجاح لأغراض الامتثال الإداري والبنكي.",
            download: "تحميل التفويض (PDF)",
            terms: `
**تفويض أداء الخدمات الاستشارية الاستراتيجية**

**المادة 1: موضوع التفويض الاستشاري**
يلتزم العميل بالدخول في تفويض استشاري مهني مع MA-TRAINING-CONSULTING بهدف التحول الاستراتيجي وبناء القدرات القيادية التنفيذية.

**المادة 2: نطاق الخدمات والتنفيذ**
يشمل التفويض إجراء محاكاة للضغوط، ورش عمل تنفيذية مكثفة، وإصدار ملفات استشارية موثقة وآراء خبراء بناءً على مخرجات بروتوكول DIGNNOS-.

**المادة 3: الإطار المالي والامتثال المصرفي**
يتم تحديد الرسوم المهنية وفقاً لنطاق التفويض المتفق عليه. يلتزم المكتب بتقديم كافة الفواتير الرسمية والوثائق الداعمة للتحويلات البنكية (SWIFT/SEPA).

**المادة 4: السرية وحقوق الملكية الفكرية**
تعتبر كافة التقارير التشخيصية والمنهجيات الاستشارية ملكاً حصرياً للمكتب. يلتزم العميل بالسرية المطلقة وعدم نشر الوثائق الاستراتيجية المقدمة.

**المادة 5: قواعد السلوك والمسؤولية المهنية**
يلتزم المكتب بتقديم أعلى معايير الجودة المهنية العالمية، بينما يلتزم العميل بالمشاركة الفعالة والجادة في كافة مراحل البروتوكول لضمان النتائج.

**المادة 6: الاختصاص القضائي والمصادقة الرقمية**
يخضع هذا التفويض للمعايير التنظيمية الدولية. تعتبر المصادقة الرقمية بمثابة توقيع رسمي ملزم وقابل للتعديل لأغراض الامتثال القانوني والبنكي.

بالتوقيع أدناه، أنت تفوض البدء الفوري في تنفيذ مهام التفويض الاستراتيجي.
            `
        },
        hero: {
            badge: "🚀 منصة التطوير المهني الشاملة",
            titlePre: "ارفع مستواك",
            titleHighlight: "المهني",
            subtitle: "المنصة الاستشارية الرائدة للمحترفين تجمع بين التشخيص الدقيق، المحاكاة الواقعية، والتخطيط الاستراتيجي لتطوير مسارك المهني وضمان نجاحك.",
            ctaDashboard: "ابدأ التشخيص المجاني",
            ctaTour: "شاهد كيف نعمل"
        },
        features: {
            title: "منظومة التطوير المهني المتكاملة",
            subtitle: "8 موديلات مصممة لتحليل وتطوير مسارك المهني بوضوح وفاعلية.",
            cards: {
                diagnosis: {
                    title: "1. Strategic Role Audit | تقييم التوافق الاستراتيجي",
                    desc: "**الوظيفة:** تقييم مواءمة الكفاءات. \n**الأكشن:** مقارنة الوصف الوظيفي المستهدف مع نتائج التشخيص الأولي. \n**النتيجة:** تقرير تفصيلي يكشف مدى جاهزيتك للمنصب أو الترقية.",
                    tags: ["توافق وظيفي", "تقرير تقييم"]
                },
                simulation: {
                    title: "2. Real-world Simulations",
                    desc: "**الوظيفة:** اختبار المهارات العملية. \n**الأكشن:** خوض مواقف عمل واجتماعات واقعية في بيئة افتراضية. \n**النتيجة:** تقييم واضح لأدائك وقدرتك على اتخاذ القرار تحت الضغط.",
                    tags: ["محاكاة", "أداء عملي"]
                },
                training: {
                    title: "3. Executive Workshops",
                    desc: "**الوظيفة:** بناء مهارات محددة. \n**الأكشن:** ورش عمل مخصصة تركز فقط على جوانب التطوير المطلوبة لديك. \n**النتيجة:** إتقان أدوات القيادة الأساسية اللازمة لترقيتك القادمة.",
                    tags: ["تطوير مهارات", "ورش عمل"]
                },
                mentor: {
                    title: "4. AI Advisor",
                    desc: "**الوظيفة:** دعم مهني مستمر 24/7. \n**الأكشن:** مساعد ذكاء اصطناعي لتحديات العمل اليومية + خطة تعلم مخصصة. \n**النتيجة:** توجيه مستمر يساعدك على التطور يومياً والبقاء في المسار الصحيح.",
                    tags: ["دعم 24/7", "مستشار ذكي"]
                },
                academy: {
                    title: "5. Knowledge Base",
                    desc: "**الوظيفة:** مركز المعرفة الاستراتيجية. \n**الأكشن:** الوصول لأهم منهجيات الإدارة وحالات دراسية واقعية. \n**النتيجة:** فهم قوي لاستراتيجيات الإدارة الحديثة والقيادة الفعالة.",
                    tags: ["معرفة", "استراتيجية"]
                },
                library: {
                    title: "6. Resource Center",
                    desc: "**الوظيفة:** أدوات وموارد مهنية جاهزة. \n**الأكشن:** قوالب جاهزة للاستخدام (خطط، تقارير، نماذج عمل). \n**النتيجة:** سرعة في إنجاز المهام واحترافية عالية في مخرجات عملك اليومي.",
                    tags: ["قوالب", "أدوات"]
                },
                expert: {
                    title: "7. Expert Consultation",
                    desc: "**الوظيفة:** رأي استراتيجي خبير. \n**الأكشن:** مراجعة قراراتك ومشاريعك الهامة عبر خبير ذكاء اصطناعي متخصص. \n**النتيجة:** تقليل الأخطاء والحصول على منظور مهني في القضايا المعقدة.",
                    tags: ["استشارة", "خبرة"]
                },
                roadmap: {
                    title: "8. Career Roadmap",
                    desc: "**الوظيفة:** تخطيط واضح للخطوات القادمة. \n**الأكشن:** جدول زمني مرئي بأهداف محددة لفترة 90 يوماً القادمة. \n**النتيجة:** وضوح تام لأهدافك المهنية والخطوات الدقيقة للوصول إليها.",
                    tags: ["خارطة طريق", "تنفيذ"]
                }
            }
        },
        system: {
            title: "نظام التشغيل التنفيذي (DIGNNOS- Protocol)",
            subtitle: "منظومة متكاملة مصممة لتحويل الكفاءة الكامنة إلى سلطة تنفيذية مؤكدة.",
            stages: [
                { id: "01", title: "التشخيص والذكاء", desc: "تدقيق فجوات المهارات بالذكاء الاصطناعي ورسم الخرائط الاستراتيجية" },
                { id: "02", title: "التنفيذ والمحاكاة", desc: "خوض مهام واقعية تحت إشراف خبراء ممارسين" },
                { id: "03", title: "الاستشارة والسلطة", desc: "إصدار ملف الاستشارة الاستراتيجي والتمكين المهني" }
            ]
        },
        audit: {
            badge: "التشخيص والتدقيق الاستراتيجي",
            title: "Strategic Role Audit",
            desc: "تحقق من جاهزيتك التنفيذية لمنصب جديد أو ترقية داخلية. يقوم الذكاء الاصطناعي بمقارنة نتائج تشخيصك الأولي مع متطلبات الوصف الوظيفي لإصدار تقرير تحليل فجوات شامل.",
            stat: "AI Analysis",
            statDesc: "تقارير الجاهزية والمواءمة",
            features: [
                "مقارنة استراتيجية: مطابقة بروفايلك المشخّص مع متطلبات الوظيفة.",
                "تحديد الفجوات: تقرير واضح حول ما ينقصك للانتقال للدور الجديد.",
                "حكم الجاهزية: تقييم دقيق مبني على البيانات لفرص ترقيتك."
            ],
            forensicsLabel: "محرك التدقيق الذكي نشط",
            scanningLabel: "جاري إصدار تقرير المواءمة"
        },
        missions: {
            badge: "المرافقة والتمكين المهني الشامل",
            title: "محاكاة واقعية بقيادة الخبراء",
            desc: "بناءً على نتائج تشخيصك، يرافقك خبراؤنا الدوليون في جلسات حية وورش عمل لمحاكاة الواقع المهني؛ نركز فيها على معالجة نقاط ضعفك وتعزيز نقاط قوتك بما يتوافق مع متطلبات سوق الشغل العالمي.",
            stat: "بيئة آمنة",
            statDesc: "تطوير تحت إشراف خبراء ممارسين",
            crisisLabel: "سيناريو سوق عمل حي",
            features: [
                "جلسات استشارية حية وورش عمل قيادية متخصصة.",
                "تطوير مخصص يعالج الفجوات المهارية المكتشفة في تشخيصك.",
                "محاكاة لسيناريوهات عالمية لرفع قيمتك وتنافسيتك المهنية."
            ]
        },
        targetAudience: {
            title: "لمن هذه المنصة؟",
            subtitle: "نظامنا مصمم للمحترفين الذين يطمحون للتميز والوصول إلى مستويات عالمية في مساراتهم المهنية.",
            cards: [
                {
                    title: "الطموحون للترقية",
                    desc: "الساعون للحصول على ترقيتهم الكبرى التالية وإتقان مهارات المناصب القيادية العليا."
                },
                {
                    title: "المغيرون لمسارهم المهني",
                    desc: "المحترفون المنتقلون إلى قطاعات جديدة ويحتاجون لمسار سريع لسد الفجوات المهارية."
                },
                {
                    title: "القادة الواعدون",
                    desc: "مدراء الصف المتوسط الطامحون لمناصب الإدارة العليا عبر تطوير التفكير الاستراتيجي."
                },
                {
                    title: "المواهب العالمية",
                    desc: "الخبراء الراغبون في مواءمة ملفاتهم مع المعايير الدولية للعمل في كبرى الشركات العالمية."
                },
                {
                    title: "حديثو التخرج",
                    desc: "المواهب التي تبدأ رحلتها وتطمح لبناء أساس مهني صلب منذ اليوم الأول."
                },
                {
                    title: "الطلاب والمقبلون على العمل",
                    desc: "المستعدون لدخول سوق العمل والراغبون في فهم المتطلبات الحقيقية قبل التخرج."
                }
            ]
        },
        assets: {
            badge: "التمكين والسلطة المهنية",
            title: "الأصول الاستشارية الاستراتيجية",
            desc: "أكثر من مجرد تدريب؛ ستحصل على حزمة كاملة من التقارير التنفيذية والوثائق الاستشارية الموثقة التي تثبت قيمتك في سوق العمل.",
            reportsTitle: "تقارير استشارية تنزيلية (PDF)",
            reports: [
                { title: "تقرير تحليل السيرة الذاتية (CV Analysis)", desc: "تحليل معمق لدقة سيرتك الذاتية وقدراتك مع ملاحظات صريحة من خبراء الذكاء الاصطناعي." },
                { title: "نتائج تقييم المقابلات (Interview Evaluation)", desc: "نتائج مبنية على البيانات من مقابلات محاكاة لسيناريوهات القيادة رفيعة المستوى." },
                { title: "توصيات المسار المهني (Career Path)", desc: "تحديد الأدوار والقطاعات الأكثر ملاءمة لك بناءً على نتائج تشخيصك الشامل." },
                { title: "سيرة ذاتية ورسالة تزكية مطورة", desc: "إعادة هندسة سيرتك الذاتية وصياغة رسالة توصية قوية بناءً على تدقيق شامل لأدائك." }
            ],
            officialTitle: "ملف الاستشارة ورأي الخبراء (صلاحية دائمة)",
            official: [
                { title: "وثيقة تقييم القدرات الاستراتيجية والجاهزية المهنية", desc: "الوثيقة الكبرى التي تثبت امتلاكك للفكر الاستراتيجي والقدرة التنفيذية." },
                { title: "رسالة توصية مهنية رسمية", desc: "تزكية رسمية لمسارك القيادي، قابلة للتحقق الفوري عبر منصتنا العالمية." },
                { title: "Executive Scorecard", desc: "سجل شفاف ودقيق لمقاييس أدائك في جميع المحاكيات والمهام التي أتممتها." },
                { title: "تقرير التوافق الاستراتيجي", desc: "إثبات رسمي لمدى مواءمتك مع مناصب تنفيذية محددة بناءً على المعايير العالمية." },
                { title: "ذكاء المسار الاستراتيجي (SCI)", desc: "تقرير شامل يدقق في مسارك المهني بعيد المدى وفرص نموك المستقبلية." }
            ],
            verifiable: "جميع الأصول الاستشارية قابلة للتحقق بنسبة 100% عبر سجلنا العالمي وجهات التوظيف."
        },
        cert: {
            badge: "أدلة استشارية",
            title: "بصمتك الاستراتيجية.. رأي خبير",
            desc: "أظهر أثرك الحقيقي وكفاءتك القيادية من خلال بروفايل دقيق يوثق أدلتك الاستشارية بالأرقام ويدعم خطوتك الكبيرة القادمة.",
            cardTitle: "ملف الجاهزية التنفيذية",
            check1: "بيانات الأثر الاستراتيجي",
            check2: "توثيق الملف الاستشاري الرقمي",
            check3: "أصول استشارية موثقـة",
            cta: "احصل على الملف الاستشاري",
            cardSubtitle: "هوية البصمة الاستشارية",
            cardFooter: "\"رأي خبير موثق حول الجاهزية التنفيذية والقيادة الاستراتيجية.\"",
            warrant_text: "يؤكد هذا الملف أن صاحبه قد أتم بنجاح بروتوكول التدقيق الاستراتيجي وأظهر الأثر القيادي المطلوب للمناصب العليا.",
            authorized: "موثق عبر بروتوكول DIGNNOS-",
            ledger: "رمز الملف الاستشاري"
        },
        corporate: {
            badge: "حلول الشركات والموارد البشرية",
            title: "دعم القرار الاسترايتيجي الموضوعي",
            desc: "نوفر للمؤسسات تقرير رأي استشاري مجاني وموضوعي. بناءً على رحلة المشارك الكاملة، نساعدكم في اتخاذ قرار ترقية أو توظيف مدروس ومبني على بيانات حقيقية.",
            feature1_title: "حكم الجاهزية",
            feature1_desc: "توصية واضحة ومباشرة حول مدى ملاءمة المرشح لمنصب أو ترقية محددة.",
            feature2_title: "تحليل فجوات موضوعي",
            feature2_desc: "رصد دقيق لنقاط القوة والضعف والمخاطر المحتملة بعيداً عن الانطباعات الشخصية.",
            feature3_title: "خارطة طريق التجهيز",
            feature3_desc: "خطوات ملموسة لسد الثغرات وتجهيز الشخص للمهمة الجديدة قبل البدء فيها.",
            freeBadge: "استشارة مجانية",
            inquiryForm: {
                title: "طلب استشارة للشركات",
                companyName: "اسم الشركة",
                companyEmail: "البريد الإلكتروني الرسمي",
                companyPhone: "رقم الهاتف",
                targetPosition: "المنصب / الدور المستهدف",
                jobDesc: "وصف المنصب / المتطلبات",
                candidateId: "الرقم المرجعي للمرشح",
                candidateFirstName: "الاسم الأول للمرشح",
                candidateLastName: "لقب المرشح",
                reportDate: "التاريخ المطلوب للتقرير",
                interviewDate: "تاريخ المقابلة",
                otherInfo: "متطلبات إضافية / ملاحظات",
                submit: "إرسال الطلب",
                success: "تم إرسال الطلب بنجاح! سيتواصل معك خبراؤنا قريباً."
            }
        },
        mandate: {
            title: "تفويض أداء الخدمات",
            ref: "مرجع",
            intro: "تشكل هذه الوثيقة التفويض الرسمي الذي ينظم العلاقة المهنية بين العميل ومكتب MA-TRAINING-CONSULTING.",
            section1_title: "المادة 1: موضوع التفويض",
            section1_desc: "يهدف هذا التفويض إلى تقديم خدمات استشارية متكاملة لرفع الكفاءة المهنية وتطوير المهارات القيادية للعميل.",
            section2_title: "المادة 2: بنود التنفيذ",
            section2_desc: "يوفر المكتب استشارات استراتيجية، محاكاة واقعية، وورش عمل تنفيذية، وفقاً لأعلى معايير الجودة العلمية والمهنية.",
            section3_title: "المادة 3: الامتثال البنكي والمالي",
            section3_desc: "يتم تحديد الرسوم بناءً على نطاق العمل، مع التزام المكتب بتوفير كافة الفواتير الرسمية اللازمة للتعاملات البنكية (SWIFT/SEPA).",
            section4_title: "المادة 4: السرية والخصوصية",
            section4_desc: "تعتبر كافة التقارير والنتائج ملكية خاصة تضمن سريتها التامة، ويلتزم العميل بعدم نشر الوثائق الاستشارية المقدمة.",
            section5_title: "المادة 5: الالتزام المهني",
            section5_desc: "يلتزم المكتب بتقديم أفضل الحلول الاستشارية، بينما يضمن العميل التفاعل الجاد في كافة مراحل البرنامج لضمان أفضل النتائج.",
            section6_title: "المادة 6: المصادقة الرقمية",
            section6_desc: "تعتبر المصادقة الرقمية بمثابة توقيع رسمي ونهائي يسمح بالبدء الفوري في تقديم الخدمات الاستشارية المتفق عليها.",
            signature_clause_title: "بند التوقيع الرقمي",
            signature_clause_desc: "بالموافقة على هذا التفويض، أنت تؤكد هويتك وتلتزم بالبنود أعلاه. يتم تسجيل هذا الإجراء كتوقيع قانوني معتمد.",
            ready_for_auth: "المستند جاهز للمصادقة الرقمية",
            scroll_to_sign: "قم بالتمرير للمصادقة على التفويض ↓",
            footer_title: "المصادقة على التفويض",
            footer_desc: "سيتم إرسال نسخة رسمية من هذا التفويض إلى بريدك الإلكتروني فور المصادقة.",
            print: "طباعة",
            download: "تحميل (PDF)",
            signature_label: "التوقيع الرقمي (اكتب الاسم الكامل)",
            signature_placeholder: "مثال: فلان الفلاني",
            accept: "أصادق على التفويض"
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
        recruit: {
            badge: "التوظيف لعام 2026 نشط",
            titlePre: "هندسة مستقبل",
            titleHighlight: "الذكاء التنفيذي",
            subtitle: "نحن في توسع مستمر لشبكتنا العالمية من نخبة المستشارين والمدربين وأساتذة الخطابة. نبحث عن خبراء، منشطين، وموظفين مستقلين أو دائمين، ومساهمين وشركاء استراتيجيين من مختلف أنحاء العالم.",
            roles: {
                consultant: {
                    title: "مستشار استراتيجي",
                    desc: "خبراء في استراتيجية الشركات، التصميم التنظيمي، ودخول الأسواق."
                },
                technical: {
                    title: "قائد تقني",
                    desc: "بناة الأنظمة الرقمية والمتخصصون في التحول باستخدام الذكاء الاصطناعي."
                },
                animator: {
                    title: "منشط تنفيذي",
                    desc: "أساتذة الخطابة والتفسير والتعريف الذين يسيطرون على غرف الاجتماعات."
                },
                partner: {
                    title: "شريك استراتيجي",
                    desc: "مساهمون وشركاء لتطوير المسارات المهنية على مستوى عالمي."
                }
            },
            ctaInfo: "انتقل إلى صفحة المعلومات",
            howToApply: {
                title: "هل أنت مستعد للانضمام؟",
                desc: "أرسل سيرتك الذاتية وعرض فيديو لمدة 2-3 دقائق تجيب فيه على: \"كيف تهندس النمو؟\"",
                email: "careers@careerupgrade.ai",
                whatsapp: "واتساب التوظيف: +216 99 123 456",
                button: "إرسال الأصول"
            },
            infoPage: {
                title: "شروط وأحكام الخبراء",
                subtitle: "قواعد الاشتباك والمعايير المهنية",
                description: "للحفاظ على معايير التميز لدينا، يجب على جميع المستشارين والخبراء والشركاء الالتزام الصارم بالشروط التالية التي تحددها الشركة.",
                conditions: [
                    "الامتثال لمعايير الاستشارة والأخلاقيات العالمية.",
                    "السرية التامة لجميع بيانات العملاء والمنهجيات الحصرية.",
                    "المشاركة النشطة في عمليات التطوير المستمر ومراجعة الأقران.",
                    "الالتزام بالمصلحة المشتركة للشركة وشبكة المحترفين.",
                    "احترام العقد الرسمي ووثائق إجراءات التشغيل بحذافيرها."
                ],
                agreement: "لقد قرأت الوثيقة وأوافق على اتباع كافة الشروط بحذافيرها من أجل المصلحة المشتركة والتطوير الدائم.",
                confirm: "الموافقة على الاتفاقية"
            },
            form: {
                title: "طلب التميز المهني",
                subtitle: "أكمل ملفك الشخصي لعملية الاختيار الاستراتيجي",
                common: {
                    fullName: "الاسم الكامل",
                    email: "البريد الإلكتروني المهني",
                    phone: "رقم التواصل",
                    cv: "رابط السيرة الذاتية (Drive/LinkedIn)",
                    video: "رابط فيديو التقديم (YouTube/Drive)",
                    videoNote: "الإجابة خلال 2-3 دقائق على: \"كيف تهندس النمو؟\"",
                    submit: "إرسال الطلب والأصول",
                    successTitle: "تم استلام الطلب",
                    successDesc: "أصولك قيد المراجعة والتدقيق من قبل لجنة الاختيار."
                },
                roles: {
                    expert: {
                        label: "خبير / مستشار",
                        domain: "مجال الخبرة الأساسي",
                        experience: "سنوات الخبرة (مستوى عالٍ)",
                        projects: "أبرز المشاريع / العملاء",
                        tools: "الأدوات والمنهجيات المستخدمة",
                        motivation: "الرؤية المهنية والوصف"
                    },
                    employee: {
                        label: "موظف دائم",
                        position: "المنصب المستهدف",
                        availability: "تاريخ الالتحاق (notice period)",
                        salary: "نطاق الراتب المتوقع",
                        education: "المؤهل العلمي / الشهادة",
                        motivation: "الأهداف المهنية والوصف"
                    },
                    partner: {
                        label: "شريك استراتيجي / مساهم",
                        company: "اسم المؤسسة (إن وجد)",
                        type: "نوع الشراكة (رأس مال/موارد/عملاء)",
                        contribution: "المساهمة الاستراتيجية المقترحة",
                        network: "النطاق الجغرافي / الوصول للأسواق",
                        motivation: "رؤية الشراكة والوصف"
                    },
                    animator: {
                        label: "منشط رئيسي",
                        specialty: "تخصص الخطابة",
                        experience: "سجل الأداء العلني",
                        portfolio: "رابط معرض الأعمال / الأداء",
                        languages: "اللغات المتقنة",
                        motivation: "منهجية الإلقاء والوصف"
                    }
                }
            }
        },
        demoDisclaimer: {
            text: "هذا فقط نموذج وليس نظام متكامل الأركان، للتفسير والفهم فقط."
        },
        verification: {
            badge: "التحقق المهني",
            titlePre: "التحقق من",
            titleHighlight: "الاعتمادات المهنية",
            subtitle: "تأكد من أصالة وثائقنا الرسمية وتوصياتنا وعمليات التدقيق الاستراتيجي من خلال نظام التحقق الآمن الخاص بنا.",
            label: "الرقم المرجعي أو معرف العضو",
            placeholder: "مثال: EXP-2026-XXXX أو EXEC-YYYY-...",
            buttonIdle: "تحقق الآن",
            buttonLoading: "جاري التحقق...",
            resultTitle: "تم العثور على اعتماد صالح",
            resultSubtitle: "تم التحقق بنجاح",
            subject: "صاحب الاعتماد",
            domain: "نوع الاعتماد",
            date: "تاريخ الإصدار",
            status: "حالة التحقق",
            statusElite: "متحقق منه ونشط",
            viewSign: "عرض التوقيع الرقمي",
            errorTitle: "فشل التحقق",
            errorDesc: "لم يتم العثور على أي اعتماد للمعرف: {id}. يرجى التحقق من الرقم المرجعي.",
            types: {
                member: "عضو تنفيذي معتمد",
                workshop_attestation: "شهادة ورشة عمل",
                performance_profile: "ملف الأداء التنفيذي",
                recommendation: "خطاب توصية",
                role_alignment: "التوافق الوظيفي الاستراتيجي",
                career_intelligence: "ذكاء المسار الوظيفي الاستراتيجي"
            },
            corporateNoteTitle: "استفسار للشركات / الموارد البشرية؟",
            corporateNoteDesc: "هل ترغب في تقييم مرشح أو موظف؟ نحن نقدم تقارير استشارية موضوعية مدعومة بالبيانات واستشارات مجانية للموارد البشرية بناءً على رحلتهم التشخيصية.",
            corporateNoteCTA: "احصل على استشارة للشركات"
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
                btnStart: "ابدأ تفويضي"
            }
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
                diagnosis: "1. التشخيص والتدقيق",
                tools: "2. محاكاة الواقع",
                training: "3. ورش العمل التنفيذية",
                mentor: "4. مستشار الذكاء الاصطناعي",
                academy: "5. قاعدة المعرفة",
                library: "6. مركز الموارد",
                expert: "7. استشارة الخبراء",
                roadmap: "8. خريطة الطريق المهنية",
                certificates: "وثيقة تقييم القدرات الاستراتيجية",
                strategicReport: "ذكاء المسار الاستراتيجي",
                recommendation: "احصل على توصية",
                jobAlignment: "تقييم التوافق الاستراتيجي",
                settings: "الإعدادات",
                signOut: "تسجيل الخروج"
            },
            premium: "عضو برو",
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
            },
            marketplace: {
                title: "مركز الاستشارات الرقمية",
                subtitle: "اختر هيكلاً استراتيجياً. نحن نستشير، نكيف، ونبني حلك المتكامل.",
                viewProject: "عرض الاستراتيجية",
                startingPrice: "بداية الاستشارة",
                currentBid: "القيمة الحالية",
                auctionEnds: "تنتهي نافذة الحصرية",
                bidNow: "احجز الاستراتيجية",
                sold: "تم البيع",
                demo: "مفهوم حي",
                details: {
                    generalIdea: "المفهوم التأسيسي",
                    strategy: "خارطة الطريق الاستراتيجية",
                    extraServices: "خدمات التنفيذ والرقمنة",
                    auctionInfo: "الاستراتيجيات الحصرية تباع مرة واحدة. تشمل استشارات استراتيجية لتمكين الفكرة وتنفيذ حل كامل لجميع الخدمات المطلوبة.",
                },
                backToProjects: "العودة للمركز",
                buyNow: "نفذ الآن",
                fixedPrice: "سعر الأصل",
                categories: {
                    all: "كل الحلول",
                    basic: "أصول قياسية",
                    pro: "استراتيجيات حصرية"
                },
                explanation: {
                    title: "المركز الاستراتيجي",
                    description: "اختر الأساس الذي يتوافق مع رؤيتك. نحن نوفر الخبرة لتحويل هذه الأطُر إلى واقع تجاري فريد خاص بك.",
                    basicTitle: "أطر عمل قياسية",
                    basicDesc: "هياكل رقمية جاهزة للتنفيذ. تشمل الإعداد القياسي والاستشارات الأولية لإطلاق حضورك الرقمي.",
                    proTitle: "تحولات حصرية",
                    proDesc: "نماذج أعمال فريدة تباع مرة واحدة. تشمل تكييفاً استراتيجياً عميقاً وتنفيذاً شاملاً لجميع الخدمات اللازمة.",
                }
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
