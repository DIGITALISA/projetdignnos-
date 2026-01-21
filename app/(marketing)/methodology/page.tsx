"use client";

import { motion } from "framer-motion";
import {
    FileText,
    Users,
    PlayCircle,
    Library,
    MessageSquare,
    Shield,
    CheckCircle,
    ArrowRight,
    Award,
    AlertTriangle,
    Leaf,
    ClipboardCheck
} from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import Link from "next/link";

export default function MethodologyPage() {
    const qhseRoles = [
        {
            category: "Quality Management",
            icon: <Award className="w-6 h-6" />,
            color: "blue",
            positions: [
                "Quality Manager",
                "Quality Assurance Specialist",
                "Quality Control Inspector",
                "ISO Auditor",
                "Six Sigma Black Belt",
                "Quality Engineer"
            ]
        },
        {
            category: "Health & Safety",
            icon: <Shield className="w-6 h-6" />,
            color: "red",
            positions: [
                "HSE Manager",
                "Safety Officer",
                "Occupational Health Specialist",
                "Safety Coordinator",
                "Fire Safety Officer",
                "Industrial Hygienist"
            ]
        },
        {
            category: "Environmental Management",
            icon: <Leaf className="w-6 h-6" />,
            color: "green",
            positions: [
                "Environmental Manager",
                "Sustainability Specialist",
                "Environmental Compliance Officer",
                "Waste Management Coordinator",
                "EHS Consultant",
                "Carbon Footprint Analyst"
            ]
        },
        {
            category: "Compliance & Auditing",
            icon: <ClipboardCheck className="w-6 h-6" />,
            color: "purple",
            positions: [
                "QHSE Auditor",
                "Compliance Manager",
                "Regulatory Affairs Specialist",
                "Risk Assessment Specialist",
                "Internal Auditor",
                "Certification Specialist"
            ]
        }
    ];

    const stages = [
        {
            number: "01",
            title: "QHSE Profile Diagnosis",
            icon: <FileText className="w-10 h-10" />,
            description: "Comprehensive analysis of your QHSE experience, certifications, and competency gaps.",
            features: [
                "CV analysis for QHSE roles",
                "ISO certifications verification",
                "Risk assessment skills evaluation",
                "Industry-specific compliance knowledge",
                "Leadership and audit capabilities"
            ],
            color: "blue"
        },
        {
            number: "02",
            title: "QHSE Scenario Simulation",
            icon: <AlertTriangle className="w-10 h-10" />,
            description: "Real-world QHSE scenarios including incident investigations and audit simulations.",
            features: [
                "Workplace incident investigation",
                "ISO audit simulations",
                "Risk assessment exercises",
                "Emergency response scenarios",
                "Stakeholder communication practice"
            ],
            color: "red"
        },
        {
            number: "03",
            title: "QHSE Training Academy",
            icon: <PlayCircle className="w-10 h-10" />,
            description: "Specialized courses on ISO standards, safety regulations, and environmental compliance.",
            features: [
                "ISO 9001, 14001, 45001 training",
                "NEBOSH and IOSH courses",
                "Environmental legislation updates",
                "Risk management methodologies",
                "Leadership in QHSE"
            ],
            color: "green"
        },
        {
            number: "04",
            title: "QHSE Resource Library",
            icon: <Library className="w-10 h-10" />,
            description: "Access to standards, templates, checklists, and industry best practices.",
            features: [
                "ISO standards documentation",
                "Audit checklists and templates",
                "Risk assessment matrices",
                "Incident report templates",
                "QHSE policy examples"
            ],
            color: "orange"
        },
        {
            number: "05",
            title: "QHSE Expert Mentorship",
            icon: <MessageSquare className="w-10 h-10" />,
            description: "1-on-1 guidance from certified QHSE professionals and industry experts.",
            features: [
                "Career path planning in QHSE",
                "Certification roadmap guidance",
                "Interview preparation for QHSE roles",
                "Industry networking strategies",
                "Continuous professional development"
            ],
            color: "purple"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="pt-24 pb-16">
                {/* Hero Section */}
                <section className="container mx-auto px-4 py-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-sm font-medium text-blue-600 mb-8">
                            <Shield className="w-4 h-4" />
                            QHSE Specialized Platform
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
                            Accelerate Your QHSE Career
                        </h1>
                        <p className="text-xl text-slate-600 leading-relaxed mb-4">
                            The first AI-powered platform dedicated exclusively to Quality, Health, Safety, and Environment professionals.
                        </p>
                        <p className="text-lg text-slate-500">
                            From ISO certifications to incident management, we cover every aspect of your QHSE journey.
                        </p>
                    </motion.div>
                </section>

                {/* QHSE Roles Section */}
                <section className="container mx-auto px-4 py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">
                            QHSE Career Paths We Support
                        </h2>
                        <p className="text-lg text-slate-600">
                            Specialized training and guidance for all QHSE disciplines
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {qhseRoles.map((role, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className={`bg-white rounded-2xl border-2 border-${role.color}-100 p-6 hover:shadow-xl hover:border-${role.color}-300 transition-all`}
                            >
                                <div className={`w-14 h-14 rounded-xl bg-${role.color}-50 flex items-center justify-center text-${role.color}-600 mb-4`}>
                                    {role.icon}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-4">{role.category}</h3>
                                <ul className="space-y-2">
                                    {role.positions.map((position, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                            {position}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Stages Section */}
                <section className="bg-white py-16">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl font-bold text-slate-900 mb-4">
                                Your 5-Stage QHSE Development Journey
                            </h2>
                            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                                A proven methodology designed specifically for QHSE professionals at every career level
                            </p>
                        </motion.div>

                        <div className="space-y-12">
                            {stages.map((stage, index) => (
                                <motion.div
                                    key={stage.number}
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}
                                >
                                    {/* Icon & Number */}
                                    <div className="flex-shrink-0">
                                        <div className={`relative w-32 h-32 rounded-2xl bg-${stage.color}-50 flex items-center justify-center text-${stage.color}-600`}>
                                            {stage.icon}
                                            <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
                                                {stage.number}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 bg-slate-50 rounded-2xl p-8">
                                        <h3 className="text-2xl font-bold text-slate-900 mb-3">{stage.title}</h3>
                                        <p className="text-slate-600 mb-6">{stage.description}</p>

                                        <div className="grid md:grid-cols-2 gap-3">
                                            {stage.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-start gap-2">
                                                    <ArrowRight className={`w-5 h-5 text-${stage.color}-600 flex-shrink-0 mt-0.5`} />
                                                    <span className="text-sm text-slate-700">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="container mx-auto px-4 py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-blue-600 via-green-600 to-blue-600 rounded-3xl p-12 text-center text-white"
                    >
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <Shield className="w-12 h-12" />
                            <Award className="w-12 h-12" />
                            <Leaf className="w-12 h-12" />
                        </div>
                        <h2 className="text-4xl font-bold mb-4">Ready to Advance Your QHSE Career?</h2>
                        <p className="text-xl mb-8 opacity-90">
                            Join QHSE professionals who are mastering ISO standards, safety protocols, and environmental compliance
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/dashboard"
                                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-slate-100 transition-all shadow-xl"
                            >
                                Start Your QHSE Journey
                            </Link>
                            <Link
                                href="/pricing"
                                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-all"
                            >
                                View Pricing
                            </Link>
                        </div>
                    </motion.div>
                </section>
            </main>
        </div>
    );
}
