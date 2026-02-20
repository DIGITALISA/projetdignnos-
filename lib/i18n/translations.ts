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
        results: {
            title: "Interview Evaluation",
            badge: "Executive Report",
            accuracyScore: "Accuracy Score",
            highIntegrity: "High Integrity Profile",
            moderateAccuracy: "Moderate Accuracy",
            significantDiscrepancies: "Significant Discrepancies",
            executiveSummary: "Executive Summary",
            cvVsReality: "CV vs Reality Analysis",
            confirmedStrengths: "Confirmed Strengths",
            exaggerationsDetected: "Exaggerations Detected",
            hiddenStrengths: "Hidden Strengths",
            cvImprovements: "CV Improvement Recommendations",
            cvImprovementsDesc: "Specific changes to make your CV more accurate and effective:",
            skillPriorities: "Skill Development Priorities",
            skillPrioritiesDesc: "Focus on improving these areas to match your career goals:",
            nextStepPaths: "Next Step: Explore Your Career Paths",
            nextStepDesc: "Ready to discover your optimal roles? Go to the Career Discovery chat, share your aspirations, and our AI will identify the best positions for your profile.",
            tip: "Pick a role with a high match percentage (70%+) for best results.",
            continueDiscovery: "Continue to Career Discovery",
            pdfReport: "PDF Report",
            loadingResults: "Loading your results...",
            backToInterview: "Back to Interview",
            noneDetected: "None detected",
            verdict: "Verdict",
            seniority: "Assessed Seniority",
            recommendedActions: "Recommended Actions",
            noImprovementsNeeded: "No specific improvements needed."
        },
        roleSuggestions: {
            pageTitle: "Career Path Recommendations",
            pageSubtitle: "Based on your CV analysis and career discovery, here are the most suitable roles for you",
            back: "Back",
            downloadPdf: "Download PDF",
            generating: "Generating...",
            howItWorks: "How it works:",
            howItWorksBody: "Review the roles below, expand details to see strengths and gaps, then click",
            focusCTA: "\"Focus on This Role\"",
            focusCTATail: "to generate your personalized CV and cover letter!",
            readyNowTitle: "Ready Now - Short Term",
            readyNowSubtitle: "Roles you can pursue immediately with your current skills",
            futureGoalsTitle: "Future Goals - Long Term",
            futureGoalsSubtitle: "Roles to work towards with skill development",
            topMatch: "Top Match",
            stretchGoal: "Stretch Goal",
            strengthsLabel: "Strengths",
            gapsLabel: "Gaps",
            skillsNeededLabel: "Skills Needed",
            hideDetails: "Hide Details",
            viewAnalysis: "View Full Strategic Analysis",
            yourStrengths: "Your Strengths",
            areasToDevelop: "Areas to Develop",
            requiredSkills: "Required Skills",
            focusOnThisRole: "Focus on This Role",
            timeToReady: "Time to ready:",
            matchSuffix: "Match",
            noRecommendations: "No recommendations found",
            noRecommendationsDesc: "We couldn't identify specific roles based on current data. Please try the discovery interview again.",
            restartDiscovery: "Restart Career Discovery",
            analyzingPaths: "Analyzing career paths...",
            failedPdf: "Failed to generate PDF report."
        },
        roleDiscovery: {
            completeTitle: "Discovery Complete!",
            completeSubtitle: "We've analyzed your potential. It's time to see where you truly belong.",
            nextTitle: "What happens next?",
            nextDesc: "Based on our conversation and your CV analysis, our AI has identified specific career roles that align with your unique strengths and aspirations.",
            reviewChat: "Review Chat",
            revealPaths: "Reveal Career Paths"
        },
        simulation: {
            title: "Executive Role Simulation",
            back: "Back",
            complete: "Simulation Complete!",
            performanceReport: "Performance report for:",
            reviewChat: "Review Chat History",
            downloadPdf: "Download Report PDF",
            overallPerformance: "Overall Performance",
            overallScore: "Overall Score",
            readiness: "Readiness",
            rank: "Rank",
            competencyBreakdown: "Competency Breakdown",
            keyStrengths: "Key Strengths",
            areasGrowth: "Areas for Growth",
            strategicRecommendations: "Strategic Recommendations",
            generateComprehensive: "Generate Comprehensive Report",
            generating: "Generating...",
            timeExpired: "Time expired. Moving to next scenario.",
            resetConfirm: "Are you sure you want to reset this session? All conversation will be lost.",
            loadingSession: "Decrypting simulation session...",
            scenario: "Scenario",
            of: "of",
            practiceAs: "Practice as",
            aiScenarioManager: "AI Scenario Manager",
            score: "Score",
            toImprove: "To Improve",
            reset: "Reset",
            placeholder: "Describe how you would handle this situation...",
            submit: "Submit Response",
            submitShort: "Submit",
            completionModal: {
                congratulations: "🎉 Congratulations! Diagnosis Complete",
                subtitle: "You now have access to all available services to develop your career",
                title: "Available Services Now",
                dashboardCTA: "Go to Dashboard",
                services: {
                    simulations: { title: "Real Simulations", desc: "Practice real-world scenarios to develop your professional skills" },
                    workshops: { title: "Executive Workshops", desc: "Specialized workshops to develop leadership and management skills" },
                    aiAdvisor: { title: "AI Advisor", desc: "Get personalized advice from an advanced AI advisor" },
                    knowledgeBase: { title: "Knowledge Base", desc: "Comprehensive library of resources and articles to expand your knowledge" },
                    resourceCenter: { title: "Resource Center", desc: "Ready-to-use tools and templates to support your professional development" },
                    expertConsultation: { title: "Expert Consultation", desc: "Connect with specialized experts for personalized guidance" },
                    careerRoadmap: { title: "Career Roadmap", desc: "Personalized plan to achieve your career goals step by step" },
                    portfolio: { title: "Professional Portfolio", desc: "Comprehensive portfolio showcasing your achievements professionally" }
                }
            },
            userIdNotFound: "User ID not found. Please log in again.",
            failedGenerateReport: "Failed to generate comprehensive report. Please try again.",
            errorGeneratingReport: "Error generating report. Our systems are experiencing issues.",
            failedDownloadPdf: "Failed to generate PDF report.",
            failedNextScenario: "Failed to load next scenario.",
            failedCompleteSimulation: "Failed to complete simulation.",
            connectionError: "Connection error. Please try again.",
            serverSlow: "The server is very slow right now, please try again.",
            missingData: "Missing role or CV data. Please refresh.",
            retrying: "Retrying",
            analyzingResponse: "Analyzing your response...",
            completeDiagnosis: "Complete & Finish Diagnosis",
            failedStartSimulation: "Failed to start simulation. Please try again.",
            timeoutMessage: "Time expired. Moving to next scenario.",
            rankLabels: {
                Beginner: "Beginner",
                Intermediate: "Intermediate",
                Advanced: "Advanced",
                Expert: "Expert"
            },
            comprehensiveReport: {
                title: "Comprehensive Diagnostic Report",
                subtitle: "Strategic analysis of professional capabilities",
                exportToText: "Export to Text",
                generatingReport: "Generating Report...",
                generateButton: "Generate Comprehensive Report",
                verifiedAssessment: "Verified Assessment"
            },
            noMissionProtocol: {
                title: "Strategic Mission Allocation Protocol (DIGNNOS- Allocation)",
                intro: "Your profile is currently under 'Mission Engineering'. We are designing a fully personalized 'Executive Role Simulation' where you will face real-world professional tasks and strategic challenges tailored to your career trajectory.",
                features: [
                    {
                        title: "1. Scenario Design (24-72 hours)",
                        desc: "The expert builds a 'Strategic Mission' context and assigns tactical tasks based on your deep diagnostic results."
                    },
                    {
                        title: "2. Hyper-Personalized Simulation",
                        desc: "The mission is designed exclusively for you. Group interactions are a specific module for learning 'Team Leadership' and collaborative execution."
                    },
                    {
                        title: "3. Tactical Flexibility",
                        desc: "Choose between a focused Individual Mission or a team-lead scenario. You control the mission scope and investment."
                    },
                    {
                        title: "4. Mission Deployment (7 days)",
                        desc: "Once your mission architecture is finalized, deployment starts within 7 days of confirmation."
                    }
                ],
                noActiveTitle: "No Active Mission",
                noActiveDesc: "Your profile is in the strategic processing phase. Below is the protocol for allocating your tailored simulation mission.",
                premiumNote: "* Note: CareerUpgrade.AI mission is a premium service including live expert guidance and certified simulations."
            }
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
                    desc: "**Function:** Mandatory professional DNA analysis. \n**Action:** All services are delivered *via* this diagnosis to ensure precision. \n**Result:** A core maturity report that dictates your entire personalized development path.",
                    tags: ["Audit", "Mandatory Entry"]
                },
                simulation: {
                    title: "2. Real-world Simulations",
                    desc: "**Function:** Humanized Skill Validation. \n**Action:** 100% personalized role simulations with a human expert in a mimicked environment. \n**Result:** Objective evaluation of your performance under high-stakes conditions.",
                    tags: ["Expert-Led", "Simulated Environment"]
                },
                training: {
                    title: "3. Executive Workshops",
                    desc: "**Function:** Targeted Human Mentorship. \n**Action:** Live sessions with experts. Choose between group sessions (filtered by level) or individual units based on your diagnostic themes. \n**Result:** Practical mastery of specific skills suggested by your audit results.",
                    tags: ["Human Expert", "Per-Unit Pricing"]
                },
                mentor: {
                    title: "4. Strategic AI Advisor",
                    desc: "**Function:** Permanent Intelligence Support. \n**Action:** Advanced AI advisor that uses your diagnostic data to provide personalized daily career advice. \n**Result:** Continuous expert guidance to secure every professional decision.",
                    tags: ["AI Advisor", "Data-Driven"]
                },
                academy: {
                    title: "5. Knowledge Base",
                    desc: "**Function:** Core Intelligence Library. \n**Action:** Comprehensive access to global management resources, articles, and case studies. \n**Result:** Strong theoretical foundation aligned with international standards.",
                    tags: ["Library", "Resources"]
                },
                library: {
                    title: "6. Resource Center",
                    desc: "**Function:** Expert human-curated tools. \n**Action:** Ready-to-use models and tools provided by your human animator to support your daily work and career. \n**Result:** Immediate operational efficiency with executive-grade assets.",
                    tags: ["Human-Curated", "Toolkits"]
                },
                expert: {
                    title: "7. Expert Consultation",
                    desc: "**Function:** Human Authority Review. \n**Action:** Direct connection with specialized experts for tailored guidance and validation. \n**Result:** Drastic risk reduction and validation of your professional trajectory.",
                    tags: ["Expert Access", "Validation"]
                },
                roadmap: {
                    title: "8. Career Roadmap",
                    desc: "**Function:** AI-Powered Execution Plan. \n**Action:** AI analysis document that maps your goals and suggests specific paid workshops to bridge identified weaknesses. \n**Result:** Total clarity on your 90-day objectives and the exact steps to reach them.",
                    tags: ["AI Analysis", "Workshop Plan"]
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
                { title: "Strategic CV & Recommendation", desc: "A re-engineered, high-impact CV and letter of recommendation including all diagnostics, analyses, and feedback from your journey." }
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
            desc: "We provide organizations with a secure verification system and objective Advisory Reports. Based on the complete diagnostic journey, we help you decide if a candidate is ready for a promotion or a new role.",
            feature1_title: "Role & Promotion Posting",
            feature1_desc: "Companies can post positions; our AI provides an objective analysis of candidates vs. role requirements.",
            feature2_title: "Objective Gap Analysis",
            feature2_desc: "Direct mapping of strengths, weaknesses, and potential risks without bias, including expert feedback.",
            feature3_title: "Candidate Verification",
            feature3_desc: "Securely verify a participant's profile and progress within our certified protocol.",
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
            title: "Join Our Elite Expert Network",
            desc: "We are actively recruiting top-tier consultants, strategic experts, and independent keynote speakers. If you master the art of high-level discourse and possess deep industry expertise, join our global mission.",
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
                    "All transactions must be strictly legal and comply with applicable tax laws and professional regulations.",
                    "All work outputs, deliverables, and materials produced during the mission are the exclusive property of the company as part of the paid engagement.",
                    "Only the company's official branding (logo and name) may be used on deliverables; inclusion of external logos or third-party advertising is strictly prohibited.",
                    "Advertising or promoting external services or other companies during the performance of the mission is strictly forbidden.",
                    "Communication with clients is restricted to the specific scope of the assigned mission; unauthorized professional contact is prohibited.",
                    "Full protection of the company's intellectual property and technical assets is required, with a strict ban on use for personal gain.",
                    "Any breach of these terms authorizes the company to take necessary legal and administrative measures, with automatic consent granted upon acceptance."
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
            defaultMessage: "Ready for briefing. I've audited your latest performance. What is your current strategic objective?",
            selectionTitle: "Select Your Expert",
            selectionSubtitle: "Choose a specialized AI expert to guide your career journey.",
            hrTitle: "HR & Recruitment",
            hrDesc: "Expert in job market, interviews & contracts",
            hrWelcome: "Hello! I am your HR & Recruitment Specialist. I can help you with job search strategies, interview prep, and salary negotiations. How can I assist you today?",
            learningTitle: "Learning & Development",
            learningDesc: "Guidance on skills, certifications & growth",
            learningWelcome: "Welcome! I am your Learning & Development Consultant. Ask me about courses, certifications, and skill acquisition strategies.",
            adviceTitle: "Professional Mentor",
            adviceDesc: "Soft skills, leadership & workplace advice",
            adviceWelcome: "Hello. I am your Professional Mentor. I'm here to offer advice on workplace dynamics, soft skills, and professional conduct.",
            strategicTitle: "Strategic Advisor",
            strategicDesc: "Long-term career planning & roadmaps",
            strategicWelcome: "Greetings. I am your Chief Career Strategy Officer. Let's plan your long-term career roadmap and strategic moves."
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
                accessWorkshop: "Protocol Materials",
                viewResults: "Scientific Report",
                viewHistory: "Diagnostic History",
                restart: "Restart Diagnosis"
            },
            journey: {
                title: "Your Leadership Journey",
                stages: {
                    diagnosis: "Strategic Role Audit",
                    diagnosisDesc: "Mandatory professional DNA analysis. All following services are tailored via this data.",
                    simulation: "Expert simulations",
                    simulationDesc: "100% personalized simulations with a human expert in a mimicked environment.",
                    training: "Executive Workshops",
                    trainingDesc: "Live sessions with experts. Personalized workshops focused on your audit results.",
                    library: "Resource Center",
                    libraryDesc: "Expert human-curated tools and models to support your daily work and career.",
                    expert: "Expert Network",
                    expertDesc: "Direct connection with specialized experts for tailored guidance and validation.",
                    strategicReport: "Full Diagnostic Report",
                    strategicReportDesc: "AI-powered comprehensive career intelligence document with 18-month roadmap."
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
                subtitle: "Our AI compares your initial diagnosis with the target job description to generate a comprehensive gap analysis report.",
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
        results: {
            title: "Évaluation de l'Entretien",
            badge: "Rapport Exécutif",
            accuracyScore: "Score de Précision",
            highIntegrity: "Profil de Haute Intégrité",
            moderateAccuracy: "Précision Modérée",
            significantDiscrepancies: "Discrepances Significatives",
            executiveSummary: "Résumé Exécutif",
            cvVsReality: "Analyse CV vs Réalité",
            confirmedStrengths: "Forces Confirmées",
            exaggerationsDetected: "Exagérations Détectées",
            hiddenStrengths: "Forces Cachées",
            cvImprovements: "Recommandations d'Amélioration du CV",
            cvImprovementsDesc: "Changements spécifiques pour rendre votre CV plus précis et efficace :",
            skillPriorities: "Priorités de Développement des Compétences",
            skillPrioritiesDesc: "Concentrez-vous sur l'amélioration de ces domaines pour atteindre vos objectifs de carrière :",
            nextStepPaths: "Étape Suivante : Explorez Vos Parcours de Carrière",
            nextStepDesc: "Prêt à découvrir vos rôles optimaux ? Accédez au chat de Découverte de Carrière, partagez vos aspirations, et notre IA identifiera les meilleures positions pour votre profil.",
            tip: "Choisissez un rôle avec un pourcentage de correspondance élevé (70%+) pour de meilleurs résultats.",
            continueDiscovery: "Continuer vers la Découverte de Carrière",
            pdfReport: "Rapport PDF",
            loadingResults: "Chargement de vos résultats...",
            backToInterview: "Retour à l'Entretien",
            noneDetected: "Aucun détecté",
            verdict: "Verdict",
            seniority: "Séniorité Évaluée",
            recommendedActions: "Actions Recommandées",
            noImprovementsNeeded: "Aucune amélioration spécifique nécessaire."
        },
        roleSuggestions: {
            pageTitle: "Recommandations de Parcoursde Carrière",
            pageSubtitle: "Sur la base de votre analyse de CV et de votre découverte de carrière, voici les rôles les plus adaptés pour vous",
            back: "Retour",
            downloadPdf: "Télécharger PDF",
            generating: "Génération...",
            howItWorks: "Comment ça marche :",
            howItWorksBody: "Consultez les rôles ci-dessous, développez les détails pour voir les forces et les lacunes, puis cliquez sur",
            focusCTA: "\"Se concentrer sur ce rôle\"",
            focusCTATail: "pour générer votre CV et lettre de motivation personnalisés !",
            readyNowTitle: "Prêt Maintenant - Court Terme",
            readyNowSubtitle: "Rôles que vous pouvez poursuivre immédiatement avec vos compétences actuelles",
            futureGoalsTitle: "Objectifs Futurs - Long Terme",
            futureGoalsSubtitle: "Rôles à viser avec le développement des compétences",
            topMatch: "Meilleure Correspondance",
            stretchGoal: "Objectif Ambitieux",
            strengthsLabel: "Forces",
            gapsLabel: "Lacunes",
            skillsNeededLabel: "Compétences Requises",
            hideDetails: "Masquer les détails",
            viewAnalysis: "Voir l'analyse complète",
            yourStrengths: "Vos Forces",
            areasToDevelop: "Domaines à Développer",
            requiredSkills: "Compétences Requises",
            focusOnThisRole: "Se concentrer sur ce rôle",
            timeToReady: "Temps pour être prêt :",
            matchSuffix: "Correspondance",
            noRecommendations: "Aucune recommandation trouvée",
            noRecommendationsDesc: "Nous n'avons pas pu identifier de rôles spécifiques. Veuillez réessayer l'entretien de découverte.",
            restartDiscovery: "Recommencer la Découverte de Carrière",
            analyzingPaths: "Analyse des parcours de carrière...",
            failedPdf: "Impossible de générer le rapport PDF."
        },
        roleDiscovery: {
            completeTitle: "Découverte Terminée !",
            completeSubtitle: "Nous avons analysé votre potentiel. Il est temps de voir où vous appartenez vraiment.",
            nextTitle: "Que se passe-t-il ensuite ?",
            nextDesc: "Basé sur notre conversation et l'analyse de votre CV, notre IA a identifié des rôles de carrière spécifiques qui correspondent à vos forces et aspirations uniques.",
            reviewChat: "Revoir le Chat",
            revealPaths: "Révéler les parcours"
        },
        simulation: {
            title: "Simulation de Rôle Exécutif",
            back: "Retour",
            complete: "Simulation Terminée !",
            performanceReport: "Rapport de performance pour :",
            reviewChat: "Revoir l'Historique du Chat",
            downloadPdf: "Télécharger le Rapport PDF",
            overallPerformance: "Performance Globale",
            overallScore: "Score Global",
            readiness: "Préparation",
            rank: "Rang",
            competencyBreakdown: "Répartition des Compétences",
            keyStrengths: "Forces Clés",
            areasGrowth: "Domaines de Croissance",
            strategicRecommendations: "Recommandations Stratégiques",
            generateComprehensive: "Générer un Rapport Complet",
            generating: "Génération en cours...",
            timeExpired: "Temps écoulé. Passage au scénario suivant.",
            resetConfirm: "Êtes-vous sûr de vouloir réinitialiser cette session ? Toute la conversation sera perdue.",
            loadingSession: "Décryptage de la session de simulation...",
            scenario: "Scénario",
            of: "sur",
            practiceAs: "S'entraîner comme",
            aiScenarioManager: "Gestionnaire de Scénarios IA",
            score: "Score",
            toImprove: "À Améliorer",
            reset: "Réinitialiser",
            placeholder: "Décrivez comment vous géreriez cette situation...",
            submit: "Envoyer la Réponse",
            submitShort: "Envoyer",
            completionModal: {
                congratulations: "🎉 Félicitations ! Diagnostic Terminé",
                subtitle: "Vous avez maintenant accès à tous les services disponibles pour développer votre carrière",
                title: "Services Disponibles Maintenant",
                dashboardCTA: "Aller au Tableau de Bord",
                services: {
                    simulations: { title: "Simulations Réelles", desc: "Entraînez-vous sur des scénarios réels pour développer vos compétences" },
                    workshops: { title: "Workshops Exécutifs", desc: "Ateliers spécialisés pour développer les compétences de leadership" },
                    aiAdvisor: { title: "Conseiller IA", desc: "Obtenez des conseils personnalisés d'un conseiller IA avancé" },
                    knowledgeBase: { title: "Base de Connaissances", desc: "Bibliothèque complète de ressources et d'articles pour développer vos connaissances" },
                    resourceCenter: { title: "Centre de Ressources", desc: "Outils et modèles prêts à l'emploi pour soutenir votre développement" },
                    expertConsultation: { title: "Consultation d'Experts", desc: "Connectez-vous avec des experts pour obtenir des conseils personnalisés" },
                    careerRoadmap: { title: "Feuille de Route", desc: "Plan personnalisé pour atteindre vos objectifs professionnels" },
                    portfolio: { title: "Portfolio Professionnel", desc: "Portfolio complet présentant vos réalisations professionnellement" }
                }
            },
            userIdNotFound: "Identifiant utilisateur introuvable. Veuillez vous reconnecter.",
            failedGenerateReport: "Échec de la génération du rapport complet. Veuillez réessayer.",
            errorGeneratingReport: "Erreur lors de la génération du rapport. Nos systèmes rencontrent des problèmes.",
            failedDownloadPdf: "Échec de la génération du rapport PDF.",
            failedNextScenario: "Échec du chargement du scénario suivant.",
            failedCompleteSimulation: "Échec de l'achèvement de la simulation.",
            connectionError: "Erreur de connexion. Veuillez réessayer.",
            serverSlow: "Le serveur est très lent actuellement, veuillez réessayer.",
            missingData: "Données de rôle ou de CV manquantes. Veuillez rafraîchir.",
            retrying: "Nouvelle tentative",
            analyzingResponse: "Analyse de votre réponse...",
            completeDiagnosis: "Finaliser le Diagnostic Complet",
            failedStartSimulation: "Impossible de démarrer la simulation. Veuillez réessayer.",
            timeoutMessage: "Temps écoulé. Passage au scénario suivant.",
            rankLabels: {
                Beginner: "Débutant",
                Intermediate: "Intermédiaire",
                Advanced: "Avancé",
                Expert: "Expert"
            },
            comprehensiveReport: {
                title: "Rapport Diagnostique Complet",
                subtitle: "Analyse stratégique des compétences professionnelles",
                exportToText: "Exporter en texte",
                generatingReport: "Génération du rapport en cours...",
                generateButton: "Générer le Rapport Complet",
                verifiedAssessment: "Evaluation Certifiée"
            },
            noMissionProtocol: {
                title: "Protocole d'Allocation des Missions Stratégiques (DIGNNOS- Allocation)",
                intro: "Votre profil est actuellement en phase d'Ingénierie de Mission. Nous concevons une 'Simulation de Rôle Exécutif' personnalisée où vous ferez face à des tâches réelles et des défis stratégiques adaptés à votre trajectoire.",
                features: [
                    {
                        title: "1. Conception de Scénario (24-72 heures)",
                        desc: "L'expert construit un contexte de 'Mission Stratégique' et vous assigne des tâches tactiques basées sur vos résultats diagnostiques."
                    },
                    {
                        title: "2. Simulation Hyper-Personnalisée",
                        desc: "La mission est conçue exclusivement pour vous. Les interactions de groupe sont un module spécifique pour l'apprentissage de la 'Direction d'Équipe'."
                    },
                    {
                        title: "3. Flexibilité Tactique",
                        desc: "Choisissez entre une Mission Individuelle ciblée ou un scénario de leadership d'équipe. Vous contrôlez la portée de la mission."
                    },
                    {
                        title: "4. Déploiement de la Mission (7 jours)",
                        desc: "Une fois l'architecture de votre mission finalisée, le déploiement commence dans un délai de 7 jours après confirmation."
                    }
                ],
                noActiveTitle: "Aucune Mission Active",
                noActiveDesc: "Votre profil est en phase de traitement stratégique. Voici le protocole d'allocation de votre mission de simulation sur mesure.",
                premiumNote: "* Note : La mission CareerUpgrade.AI est un service premium comprenant un accompagnement d'experts en direct."
            }
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
                    desc: "**Fonction :** Analyse obligatoire de l'ADN professionnel. \n**Action :** Tous les services sont fournis *via* ce diagnostic pour garantir la précision. \n**Résultat :** Un rapport de maturité central qui dicte tout votre parcours de développement personnalisé.",
                    tags: ["Audit", "Entrée Obligatoire"]
                },
                simulation: {
                    title: "2. Simulations Réelles",
                    desc: "**Fonction :** Validation des compétences humaine. \n**Action :** Simulations de rôle 100% personnalisées avec un expert humain en environnement simulé. \n**Résultat :** Évaluation objective de votre performance dans des conditions réelles.",
                    tags: ["Expert Humain", "Environnement Simulé"]
                },
                training: {
                    title: "3. Workshops Exécutifs",
                    desc: "**Fonction :** Mentorat humain ciblé. \n**Action :** Sessions en direct avec des experts. Choisissez entre sessions de groupe (filtrées par niveau) ou unités individuelles selon vos besoins. \n**Résultat :** Maîtrise pratique des compétences suggérées par les résultats de votre audit.",
                    tags: ["Expert Humain", "Prix par Unité"]
                },
                mentor: {
                    title: "4. Conseiller Stratégique IA",
                    desc: "**Fonction :** Support d'intelligence permanent. \n**Action :** IA avancée utilisant vos données de diagnostic pour fournir des conseils de carrière quotidiens personnalisés. \n**Résultat :** Une guidance experte continue pour sécuriser vos décisions.",
                    tags: ["IA Advisor", "Basé sur les Données"]
                },
                academy: {
                    title: "5. Base de Connaissances",
                    desc: "**Fonction :** Bibliothèque d'intelligence centrale. \n**Action :** Accès complet aux ressources de gestion mondiales, articles et études de cas. \n**Résultat :** Solidité théorique alignée sur les standards internationaux.",
                    tags: ["Bibliothèque", "Ressources"]
                },
                library: {
                    title: "6. Centre de Ressources",
                    desc: "**Fonction :** Outils sélectionnés par des experts humains. \n**Action :** Modèles et outils prêts à l'emploi fournis par votre animateur humain pour soutenir votre travail quotidien. \n**Résultat :** Efficacité opérationnelle immédiate avec des assets de niveau exécutif.",
                    tags: ["Curaté par Humains", "Boîte à Outils"]
                },
                expert: {
                    title: "7. Consultation d'Expert",
                    desc: "**Fonction :** Révision par autorité humaine. \n**Action :** Connexion directe avec des experts spécialisés pour une guidance et une validation sur mesure. \n**Résultat :** Réduction drastique des risques et validation de votre trajectoire professionnelle.",
                    tags: ["Accès Expert", "Validation"]
                },
                roadmap: {
                    title: "8. Feuille de Route de Carrière",
                    desc: "**Fonction :** Plan d'exécution propulsé par l'IA. \n**Action :** Analyse IA cartographiant vos objectifs et suggérant des workshops payants spécifiques pour combler vos lacunes. \n**Résultat :** Clarté totale sur vos objectifs à 90 jours et les étapes exactes pour les atteindre.",
                    tags: ["Analyse IA", "Plan de Workshops"]
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
                "Développement sur mesure basé sur votre diagnostic de lacunes.",
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
            badge: "SOLUTIONS ENTREPRISES & RH",
            title: "Support de Décision Objectif",
            desc: "Nous fournissons aux organisations un système de vérification sécurisé et des rapports d'expertise objectifs. Basé sur le parcours complet, nous vous aidons à décider si un candidat est réellement prêt.",
            feature1_title: "Publication de Postes & Promotions",
            feature1_desc: "Les entreprises peuvent publier des postes ; notre IA fournit une analyse objective des candidats par rapport aux exigences.",
            feature2_title: "Analyse Objective des Écarts",
            feature2_desc: "Cartographie directe des forces, faiblesses et risques potentiels sans biais, avec avis d'experts.",
            feature3_title: "Vérification de Candidat",
            feature3_desc: "Vérifiez en toute sécurité le profil et la progression d'un participant au sein de notre protocole certifié.",
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
            desc: "Nous recrutons l'élite des consultants, experts stratégiques et maîtres de conférences indépendants. Si vous commandez l'art de l'éloquence et possédez une expertise de haut niveau, rejoignez notre réseau mondial pour transformer l'intelligence exécutive.",
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
                    "Toutes les transactions doivent être conformes aux législations fiscales et aux réglementations professionnelles en vigueur.",
                    "Tous les livrables, documents et supports produits durant la mission sont la propriété exclusive de la société dans le cadre de la prestation rémunérée.",
                    "Seule l'identité visuelle de la société (logo et nom) doit être utilisée sur les supports ; toute publicité ou logo tiers est strictement interdit.",
                    "Il est strictement interdit de promouvoir des services externes ou d'autres entreprises durant l'exécution de la mission.",
                    "La communication avec les clients est strictement limitée au cadre de la mission confiée ; tout contact hors périmètre professionnel est interdit.",
                    "Respect total de la propriété intellectuelle de la société et interdiction d'utiliser les ressources ou livrables à des fins personnelles.",
                    "En cas de non-respect de ces termes, la société se réserve le droit d'engager toute procédure légale ou administrative nécessaire, acceptée d'office par l'expert."
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
            defaultMessage: "Prêt pour le briefing. J'ai audité votre performance. Quel est votre objectif stratégique ?",
            selectionTitle: "Sélectionnez votre Expert",
            selectionSubtitle: "Choisissez un expert IA spécialisé pour guider votre parcours professionnel.",
            hrTitle: "RH & Recrutement",
            hrDesc: "Expert en marché du travail, entretiens & contrats",
            hrWelcome: "Bonjour ! Je suis votre Spécialiste RH & Recrutement. Je peux vous aider avec vos stratégies de recherche d'emploi, préparations d'entretien et négociations salariales. Comment puis-je vous aider ?",
            learningTitle: "Formation & Développement",
            learningDesc: "Conseils sur les compétences, certifications & croissance",
            learningWelcome: "Bienvenue ! Je suis votre Consultant en Formation & Développement. Interrogez-moi sur les cours, certifications et stratégies d'acquisition de compétences.",
            adviceTitle: "Mentor Professionnel",
            adviceDesc: "Soft skills, leadership & conseils en entreprise",
            adviceWelcome: "Bonjour. Je suis votre Mentor Professionnel. Je suis ici pour offrir des conseils sur la dynamique de travail, les compétences comportementales et la conduite professionnelle.",
            strategicTitle: "Conseiller Stratégique",
            strategicDesc: "Planification de carrière à long terme & feuilles de route",
            strategicWelcome: "Salutations. Je suis votre Directeur de la Stratégie de Carrière. Planifions votre feuille de route et vos mouvements stratégiques à long terme."
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
                accessWorkshop: "Matériels de Protocole",
                viewResults: "Rapport Stratégique",
                viewHistory: "Historique du Diagnostic",
                restart: "Redémarrer le Diagnostic"
            },
            journey: {
                title: "Votre Parcours de Leadership",
                stages: {
                    diagnosis: "Audit de Rôle Stratégique",
                    diagnosisDesc: "Analyse obligatoire de l'ADN professionnel. Tous les services sont personnalisés via ces données.",
                    simulation: "Simulations d'Experts",
                    simulationDesc: "Simulations 100% personnalisées avec un expert humain en environnement simulé.",
                    training: "Workshops Exécutifs",
                    trainingDesc: "Sessions en direct avec des experts. Ateliers personnalisés basés sur vos résultats d'audit.",
                    library: "Centre de Ressources",
                    libraryDesc: "Outils et modèles sélectionnés par des experts pour soutenir votre travail quotidien.",
                    expert: "Réseau d'Experts",
                    expertDesc: "Connexion directe avec des experts spécialisés pour une guidance sur mesure.",
                    strategicReport: "Rapport Diagnostic Complet",
                    strategicReportDesc: "Document d'intelligence de carrière avec roadmap stratégique à 18 mois."
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
                title: "Alignement Stratégique de Rôle",
                subtitle: "Notre IA compare votre diagnostic initial avec la description du poste pour générer un rapport d'analyse complet des écarts.",
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
        results: {
            title: "تقييم المقابلة",
            badge: "تقرير تنفيذي",
            accuracyScore: "درجة الدقة",
            highIntegrity: "ملف عالي النزاهة",
            moderateAccuracy: "دقة متوسطة",
            significantDiscrepancies: "تناقضات كبيرة",
            executiveSummary: "الملخص التنفيذي",
            cvVsReality: "تحليل السيرة الذاتية مقابل الواقع",
            confirmedStrengths: "نقاط القوة المؤكدة",
            exaggerationsDetected: "المبالغات المكتشفة",
            hiddenStrengths: "نقاط القوة الخفية",
            cvImprovements: "توصيات تحسين السيرة الذاتية",
            cvImprovementsDesc: "تغييرات محددة لجعل سيرتك الذاتية أكثر دقة وفعالية:",
            skillPriorities: "أولويات تطوير المهارات",
            skillPrioritiesDesc: "ركز على تحسين هذه المجالات لتناسب أهدافك المهنية:",
            nextStepPaths: "الخطوة التالية: استكشاف مساراتك المهنية",
            nextStepDesc: "هل أنت مستعد لاكتشاف أدوارك المثالية؟ انتقل إلى دردشة استكشاف القارير، وشارك تطلعاتك، وسيقوم الذكاء الاصطناعي بتحديد أفضل المناصب لملفك الشخصي.",
            tip: "اختر دوراً بنسبة تطابق عالية (70%+) للحصول على أفضل النتائج.",
            continueDiscovery: "المتابعة إلى استكشاف المسار المهني",
            pdfReport: "تقرير PDF",
            loadingResults: "جاري تحميل نتائجك...",
            backToInterview: "العودة للمقابلة",
            noneDetected: "لم يتم الكشف عن شيء",
            verdict: "الحكم",
            seniority: "الأقدمية المقدرة",
            recommendedActions: "الإجراءات الموصى بها",
            noImprovementsNeeded: "لا حاجة لتحسينات محددة."
        },
        roleSuggestions: {
            pageTitle: "توصيات المسار المهني",
            pageSubtitle: "بناءً على تحليل سيرتك الذاتية واكتشاف مسارك المهني، هذه أنسب الأدوار لك",
            back: "رجوع",
            downloadPdf: "تحميل PDF",
            generating: "جاري التوليد...",
            howItWorks: "كيف يعمل:",
            howItWorksBody: "راجع الأدوار أدناه، وسّع التفاصيل لرؤية المزايا والفجوات، ثم انقر على",
            focusCTA: "\"التركيز على هذا الدور\"",
            focusCTATail: "لتوليد سيرتك الذاتية وخطاب التقديم المخصصين لك!",
            readyNowTitle: "جاهز الآن - قصير الأمد",
            readyNowSubtitle: "أدوار يمكنك متابعتها فوراً بمهاراتك الحالية",
            futureGoalsTitle: "أهداف مستقبلية - طويل الأمد",
            futureGoalsSubtitle: "أدوار للعمل نحوها مع تطوير المهارات",
            topMatch: "أفضل تطابق",
            stretchGoal: "هدف طموح",
            strengthsLabel: "نقاط القوة",
            gapsLabel: "الفجوات",
            skillsNeededLabel: "المهارات المطلوبة",
            hideDetails: "إخفاء التفاصيل",
            viewAnalysis: "عرض كامل التفاصيل والتحليل",
            yourStrengths: "نقاط قوتك",
            areasToDevelop: "مجالات التطوير",
            requiredSkills: "المهارات المطلوبة",
            focusOnThisRole: "التركيز على هذا الدور",
            timeToReady: "وقت التجهيز:",
            matchSuffix: "تطابق",
            noRecommendations: "لم يتم العثور على توصيات",
            noRecommendationsDesc: "لم نتمكن من تحديد أدوار محددة. يرجى إعادة محاولة مقابلة الاكتشاف.",
            restartDiscovery: "إعادة اكتشاف المسار المهني",
            analyzingPaths: "تحليل المسارات المهنية...",
            failedPdf: "فشل إنشاء تقرير PDF."
        },
        roleDiscovery: {
            completeTitle: "اكتمل الكشف!",
            completeSubtitle: "لقد قمنا بتحليل إمكانياتك. حان الوقت لمعرفة المكان الذي تنتمي إليه حقاً.",
            nextTitle: "ماذا سيحدث بعد ذلك؟",
            nextDesc: "بناءً على محادثتنا وتحليل سيرتك الذاتية، حدد ذكاؤنا الاصطناعي أدواراً مهنية محددة تتوافق مع نقاط قوتك وتطلعاتك الفريدة.",
            reviewChat: "مراجعة المحادثة",
            revealPaths: "كشف المسارات المهنية"
        },
        simulation: {
            title: "محاكاة الدور التنفيذي",
            back: "رجوع",
            complete: "تمت المحاكاة بنجاح!",
            performanceReport: "تقرير الأداء لـ:",
            reviewChat: "مراجعة سجل المحادثة",
            downloadPdf: "تحميل تقرير PDF",
            overallPerformance: "الأداء العام",
            overallScore: "الدرجة الكلية",
            readiness: "الجاهزية",
            rank: "الرتبة",
            competencyBreakdown: "توزيع الكفاءات",
            keyStrengths: "نقاط القوة الرئيسية",
            areasGrowth: "مجالات النمو",
            strategicRecommendations: "توصيات استراتيجية",
            generateComprehensive: "إنشاء تقرير شامل",
            generating: "جاري الإنشاء...",
            timeExpired: "انتهى الوقت. الانتقال إلى السيناريو التالي.",
            resetConfirm: "هل أنت متأكد من رغبتك في إعادة تعيين هذه الجلسة؟ ستفقد كل المحادثة.",
            loadingSession: "جاري فك تشفير جلسة المحمحاكاة...",
            scenario: "سيناريو",
            of: "من",
            practiceAs: "التدرب كـ",
            aiScenarioManager: "مدير السيناريوهات بالذكاء الاصطناعي",
            score: "الدرجة",
            toImprove: "للتحسين",
            reset: "إعادة تعيين",
            placeholder: "صف كيف ستتعامل مع هذا الموقف...",
            submit: "إرسال الإجابة",
            submitShort: "إرسال",
            completionModal: {
                congratulations: "🎉 تهانينا! اكتمل التشخيص",
                subtitle: "الآن يمكنك الوصول إلى جميع الخدمات المتاحة لتطوير مسارك المهني",
                title: "الخدمات المتاحة الآن",
                dashboardCTA: "انتقل إلى لوحة التحكم",
                services: {
                    simulations: { title: "محاكاة واقعية", desc: "تدرب على سيناريوهات واقعية لتطوير مهاراتك المهنية" },
                    workshops: { title: "ورش تنفيذية", desc: "ورش عمل متخصصة لتطوير المهارات القيادية والإدارية" },
                    aiAdvisor: { title: "مستشار ذكاء اصطناعي", desc: "احصل على نصائح مخصصة من مستشار ذكاء اصطناعي متقدم" },
                    knowledgeBase: { title: "قاعدة المعرفة", desc: "مكتبة شاملة من الموارد والمقالات لتطوير معرفتك" },
                    resourceCenter: { title: "مركز الموارد", desc: "أدوات ونماذج جاهزة لدعم تطورك المهني" },
                    expertConsultation: { title: "استشارة خبراء", desc: "تواصل مع خبراء متخصصين للحصول على إرشادات مخصصة" },
                    careerRoadmap: { title: "خارطة الطريق المهنية", desc: "خطة مخصصة لتحقيق أهدافك المهنية خطوة بخطوة" },
                    portfolio: { title: "ملف مهني متقدم", desc: "ملف شامل يعرض إنجازاتك ومهاراتك بشكل احترافي" }
                }
            },
            userIdNotFound: "لم يتم العثور على معرف المستخدم. يرجى تسجيل الدخول مرة أخرى.",
            failedGenerateReport: "فشل في إنشاء التقرير الشامل. يرجى المحاولة مرة أخرى.",
            errorGeneratingReport: "حدث خطأ أثناء إنشاء التقرير. أنظمتنا تواجه بعض المشاكل حالياً.",
            failedDownloadPdf: "فشل في إنشاء تقرير PDF.",
            failedNextScenario: "فشل تحميل السيناريو التالي.",
            failedCompleteSimulation: "فشل في إكمال المحاكاة.",
            connectionError: "حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.",
            serverSlow: "الخادم بطيء جداً حالياً، يرجى المحاولة مرة أخرى.",
            missingData: "بيانات الدور أو السيرة الذاتية مفقودة. يرجى تحديث الصفحة.",
            retrying: "جاري إعادة المحاولة",
            analyzingResponse: "جاري تحليل إجابتك...",
            completeDiagnosis: "إتمام وإنهاء التشخيص بالكامل",
            failedStartSimulation: "فشل بدء المحاكاة. يرجى المحاولة مرة أخرى.",
            timeoutMessage: "انتهى الوقت. سأنتقل للسيناريو التالي.",
            rankLabels: {
                Beginner: "مبتدئ",
                Intermediate: "متوسط",
                Advanced: "متقدم",
                Expert: "خبير"
            },
            comprehensiveReport: {
                title: "التقرير التشخيصي الشامل",
                subtitle: "تحليل استراتيجي للقدرات والكفاءات المهنية",
                exportToText: "تصدير نصي",
                generatingReport: "جاري إنشاء التقرير الشامل...",
                generateButton: "إنشاء التقرير التشخيصي الشامل",
                verifiedAssessment: "تقييم معتمد"
            },
            noMissionProtocol: {
                title: "بروتوكول تخصيص المهمات الاستراتيجية (DIGNNOS- Mission Allocation)",
                intro: "يخضع ملفك المهني حالياً لمرحلة 'هندسة المهمة' من قبل خبراء المجمع. نقوم بتصميم سيناريو 'وظيفة تنفيذية' مخصصة لك بالكامل، حيث ستواجه مهاماً وتحديات استراتيجية واقعية تتبع تطورك المهني.",
                features: [
                    {
                        title: "1. تصميم السيناريو المهني (24-72 ساعة)",
                        desc: "يقوم الخبير ببناء سياق 'مهمة استراتيجية' وتكليفك بمهام قيادية تخصصية بناءً على مخرجات تشخيصك المعمق."
                    },
                    {
                        title: "2. المحاكاة الفردية المطلقة",
                        desc: "المهمة مصممة حصرياً لك؛ التفاعلات مع المجموعات هي حالة خاصة لتعلم مهارات 'قيادة الفرق' والعمل الجماعي تحت الضغط."
                    },
                    {
                        title: "3. التحكم في طبيعة المهمة",
                        desc: "يمكنك اختيار مهمة فردية مركزة (Individual Mission) أو قيادة مجموعة مصغرة؛ أنت من يحدد مسار التحدي وتكاليف المهمة."
                    },
                    {
                        title: "4. إطلاق العمل الميداني (7 أيام)",
                        desc: "نلتزم بتثبيت المواعيد النهائية وإرسال دعوات إطلاق المهمة في غضون 7 أيام كحد أقصى من تاريخ التأكيد."
                    }
                ],
                noActiveTitle: "لا توجد مهمة نشطة حالياً",
                noActiveDesc: "ملفك المهني في مرحلة المعالجة الاستراتيجية. فيما يلي البروتوكول المتبع لتخصيص مهمتك المحاكاتية.",
                premiumNote: "* ملاحظة: مهمة CareerUpgrade.AI هي خدمة ممتازة تتضمن مرافقة مباشرة من خبراء دوليين وشهادات أداء معتمدة."
            }
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
                    title: "1. Strategic Role Audit | التدقيق والتشخيص",
                    desc: "**الوظيفة:** تحليل الحمض النووي المهني الإلزامي. \n**الأكشن:** جميع الخدمات تُقدم *عبر* هذا التشخيص لضمان الدقة وتجنب العشوائية. \n**النتيجة:** تقرير نضج مركزي يحدد كامل مسار تطويرك الشخصي.",
                    tags: ["تدقيق إلزامي", "نقطة البداية"]
                },
                simulation: {
                    title: "2. Real-world Simulations | محاكاة واقعية",
                    desc: "**الوظيفة:** مصادقة المهارات بلمسة بشرية. \n**الأكشن:** محاكاة للأدوار مخصصة 100% مع خبير بشري في بيئة تحاكي الواقع. \n**النتيجة:** تقييم موضوعي لأدائك في ظل ظروف مهنية واقعية.",
                    tags: ["خبير بشري", "نظام محاكاتي"]
                },
                training: {
                    title: "3. Executive Workshops | ورش العمل التنفيذية",
                    desc: "**الوظيفة:** توجيه بشري مستهدف. \n**الأكشن:** جلسات مباشرة مع خبراء؛ يمكنك الاختيار بين المجموعات (مفلترة حسب المستوى) أو الوحدات الفردية حسب السعر. \n**النتيجة:** إتقان عملي للمهارات المقترحة بناءً على نتائج تشخيصك.",
                    tags: ["خبير بشري", "حسب التيمة"]
                },
                mentor: {
                    title: "4. AI Advisor | مستشار الذكاء الاصطناعي",
                    desc: "**الوظيفة:** دعم ذكاء مهني دائم. \n**الأكشن:** مستشار متقدم يستخدم بيانات تشخيصك لتقديم نصائح مهنية يومية مخصصة. \n**النتيجة:** توجيه مستمر يضمن صحة قراراتك المهنية في كل خطوة.",
                    tags: ["مستشار ذكي", "مبني على البيانات"]
                },
                academy: {
                    title: "5. Knowledge Base | قاعدة المعرفة",
                    desc: "**الوظيفة:** مكتبة ذكاء شاملة. \n**الأكشن:** وصول كامل لموارد الإدارة العالمية والمقالات والدراسات لتطوير معرفتك. \n**النتيجة:** أساس نظري متين يتماشى مع أرقى المعايير الدولية.",
                    tags: ["مكتبة", "موارد"]
                },
                library: {
                    title: "6. Resource Center | مركز الموارد",
                    desc: "**الوظيفة:** أدوات مهنية من إعداد خبراء بشريين. \n**الأكشن:** نماذج وأدوات جاهزة يقدمها لك الخبير المباشر (المنشط) لدعم عملك ومسيرتك ككل. \n**النتيجة:** كفاءة عملياتية فورية باستخدام أصول مهنية رفيعة المستوى.",
                    tags: ["إعداد خبراء", "أدوات جاهزة"]
                },
                expert: {
                    title: "7. Expert Consultation | استشارة الخبراء",
                    desc: "**الوظيفة:** مراجعة السلطة البشرية. \n**الأكشن:** تواصل مباشر مع خبراء متخصصين للحصول على إرشادات وحلول مخصصة وموثقة. \n**النتيجة:** تقليل المخاطر بشكل جذري والمصادقة على توجهاتك المهنية.",
                    tags: ["اتصال مباشر", "رأي خبير"]
                },
                roadmap: {
                    title: "8. Career Roadmap | خارطة الطريق المهنية",
                    desc: "**الوظيفة:** خطة تنفيذ مدعومة بالذكاء الاصطناعي. \n**الأكشن:** وثيقة تحليلية ترسم أهدافك وتقترح ورش عمل مخصصة (مدفوعة) لسد نقاط الضعف المكتشفة. \n**النتيجة:** وضوح تام لأهدافك ومسار واضح لبداية تطوير مهاراتك ومعرفتك.",
                    tags: ["تحليل ذكي", "خطة ورش"]
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
                { title: "سيرة ذاتية ورسالة تزكية مطورة", desc: "إعادة هندسة سيرتك الذاتية وصياغة رسالة توصية قوية تشمل كافة التحاليل والتعليقات الناتجة عن رحلتك." }
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
            desc: "نوفر للمؤسسات نظام تحقق آمن وتقارير استشارية موضوعية. بناءً على رحلة التشخيص الكاملة، نساعدكم في اتخاذ قرار ترقية أو توظيف مدروس ومبني على بيانات حقيقية.",
            feature1_title: "نشر الوظائف والترقيات",
            feature1_desc: "يمكن للشركات نشر الأدوار الوظيفية؛ ويقوم ذكاؤنا الاصطناعي بتقديم تحليل موضوعي للمرشحين مقابل المتطلبات.",
            feature2_title: "تحليل فجوات موضوعي",
            feature2_desc: "رصد دقيق لنقاط القوة والضعف والمخاطر المحتملة بعيداً عن الانحيازات، مع رأي الخبراء.",
            feature3_title: "التحقق من المشاركين",
            feature3_desc: "تحقق بأمان من بروفايل المشارك وتطوره ضمن بروتوكولنا المعتمد.",
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
            desc: "نستقطب نخبة المستشارين، الخبراء الاستراتيجيين، وأساتذة الخطابة المستقلين. إذا كنت تمتلك خبرة استثنائية وتتقن فن التفسير والتأثير القيادي، انضم إلى شبكتنا العالمية لهندسة مستقبل الذكاء التنفيذي.",
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
                subtitle: "قواعد العمل والمعايير المهنية",
                description: "لضمان جودة العمل واحترافية الخدمة، نطلب من كافة الخبراء والمستشارين الالتزام بالشروط التالية:",
                conditions: [
                    "يجب أن تكون كافة المعاملات قانونية وتخضع لتشريعات الضرائب والنظم المهنية السارية.",
                    "كافة مخرجات العمل والوثائق والوسائط المنتجة خلال المهمة هي ملكية حصرية للشركة وتدخل ضمن نطاق المهمة الموكلة.",
                    "الالتزام باستخدام الهوية البصرية (الشعار والاسم) الخاصة بالشركة حصراً في الوثائق، ويُمنع استخدام أي شعارات أو دعاية لجهات خارجية.",
                    "يُمنع منعاً باتاً القيام بأي نشاط إشهاري أو ترويجي لخدمات أخرى أو شركات منافسة خلال فترة تنفيذ المهمة.",
                    "يقتصر التواصل مع العملاء حصراً على إطار المهمة الموكلة، ويمنع أي تواصل مهني خارج هذا النطاق المعتمد.",
                    "الالتزام الكامل بحماية الملكية الفكرية والأصول التقنية للشركة، ويُمنع استغلال الموارد أو المخرجات لأغراض شخصية.",
                    "في حال الإخلال بأي من هذه الشروط، يحق للشركة اتخاذ كافة الإجراءات القانونية والإدارية اللازمة، وتعتبر الموافقة على هذه الشروط قبولاً تلقائياً لهذه الإجراءات."
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
            defaultMessage: "جاهز لتقديم الإيجاز. لقد دققت أداءك الأخير. ما هو هدفك الاستراتيجي الحالي؟",
            selectionTitle: "اختر خبيرك",
            selectionSubtitle: "اختر خبير ذكاء اصطناعي متخصص لتوجيه مسيرتك المهنية.",
            hrTitle: "الموارد البشرية والتوظيف",
            hrDesc: "خبير في سوق العمل والمقابلات والعقود",
            hrWelcome: "مرحباً! أنا متخصص الموارد البشرية والتوظيف. يمكنني مساعدتك في استراتيجيات البحث عن عمل، والتحضير للمقابلات، ومفاوضات الراتب. كيف يمكنني مساعدتك اليوم؟",
            learningTitle: "التعلم والتطوير",
            learningDesc: "توجيه حول المهارات والشهادات والنمو",
            learningWelcome: "أهلاً بك! أنا مستشار التعلم والتطوير الخاص بك. اسألني عن الدورات والشهادات واستراتيجيات اكتساب المهارات.",
            adviceTitle: "المرشد المهني",
            adviceDesc: "المهارات الشخصية والقيادة ونصائح العمل",
            adviceWelcome: "مرحباً. أنا مرشدك المهني. أنا هنا لتقديم المشورة حول ديناميكيات مكان العمل، والمهارات الشخصية، والسلوك المهني.",
            strategicTitle: "المستشار الاستراتيجي",
            strategicDesc: "تخطيط المسار الوظيفي طويل الأمد وخرائط الطريق",
            strategicWelcome: "تحياتي. أنا كبير مسؤولي استراتيجية المسار الوظيفي. دعنا نخطط لخارطة طريق مسارك الوظيفي وتحركاتك الاستراتيجية."
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
                accessWorkshop: "موارد البروتوكول",
                viewResults: "التقرير الاستراتيجي",
                viewHistory: "سجل بروتوكول التشخيص",
                restart: "إعادة التشخيص | Restart Diagnosis"
            },
            journey: {
                title: "رحلتك القيادية",
                stages: {
                    diagnosis: "تدقيق الدور الاستراتيجي",
                    diagnosisDesc: "تحليل الحمض النووي المهني الإلزامي. يتم تخصيص جميع الخدمات التالية عبر هذه البيانات.",
                    simulation: "محاكاة الخبراء",
                    simulationDesc: "محاكاة للأدوار مخصصة 100% مع خبير بشري في نظام محاكاتي واقعي.",
                    training: "ورش العمل التنفيذية",
                    trainingDesc: "جلسات مباشرة مع خبراء؛ ورش عمل مخصصة بناءً على نتائج تشخيصك.",
                    library: "مركز الموارد",
                    libraryDesc: "أدوات ونماذج جاهزة من إعداد خبراء لدعم عملك ومسيرتك اليومية.",
                    expert: "شبكة الخبراء",
                    expertDesc: "تواصل مباشر مع خبراء متخصصين للحصول على إرشادات وحلول مخصصة.",
                    strategicReport: "التقرير التشخيصي الشامل",
                    strategicReportDesc: "وثيقة ذكاء مهني مدعومة بالذكاء الاصطناعي مع خارطة طريق لـ 18 شهراً."
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
            subtitle: "يقوم الذكاء الاصطناعي بمقارنة نتائج تشخيصك الأولي مع متطلبات الوصف الوظيفي لإصدار تقرير تحليل فجوات شامل قبل التقديم.",
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
