"use client";

import { motion } from "framer-motion";
import { 
    Microscope, 
    ArrowRight, 
    MessageSquare,
    Mail,
    Palette,
    Code
} from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";

const roles = [
    {
        title: "Strategic Consultant",
        icon: Microscope,
        desc: "Experts in corporate strategy, organizational design, and market entry.",
        tags: ["Strategy", "M&A", "Governance"]
    },
    {
        title: "Technical Lead",
        icon: Code,
        desc: "Builders of digital ecosystems and AI transformation specialists.",
        tags: ["AI", "Architecture", "Fullstack"]
    },
    {
        title: "Executive Animator",
        icon: Palette,
        desc: "Masters of public speaking and explanation who command the board room.",
        tags: ["Soft Skills", "Training", "Public Speaking"]
    }
];

export default function ExpertRecruitmentPage() {
    const { dir, language } = useLanguage();

    return (
        <div className={cn(
            "min-h-screen bg-white italic-none",
            language === 'ar' ? 'font-arabic' : 'font-sans'
        )} dir={dir}>
            <Navbar />

            <main className="relative pt-32 pb-24 overflow-hidden">
                {/* Hero Section */}
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-100"
                        >
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                            Recruitment 2026 Active
                        </motion.div>

                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1]"
                        >
                            Architect the Future of <br />
                            <span className="text-blue-600">Executive Intelligence</span>
                        </motion.h1>

                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed"
                        >
                            We are expanding our global network of elite consultants, trainers, and masters of public speaking. Join DIGITALISA - MA-TRAINING-CONSULTING.
                        </motion.p>
                    </div>

                    {/* Roles Grid */}
                    <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-6xl mx-auto">
                        {roles.map((role, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 + (idx * 0.1) }}
                                className="group p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 cursor-default"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-blue-600 mb-8 group-hover:scale-110 transition-transform duration-500">
                                    <role.icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4">{role.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-8">{role.desc}</p>
                                <div className="flex flex-wrap gap-2">
                                    {role.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-wider group-hover:border-blue-100 group-hover:text-blue-500 transition-colors">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* How to Apply */}
                    <div className="mt-32 max-w-4xl mx-auto">
                        <div className="bg-slate-900 rounded-[3rem] p-12 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] -mr-32 -mt-32" />
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                                <div className="space-y-6">
                                    <h2 className="text-3xl font-bold text-white tracking-tight">Ready to Command?</h2>
                                    <p className="text-slate-400 text-lg max-w-md font-medium">
                                        Send your resume and a video presentation of 2-3 minutes answering: &quot;How do you architect growth?&quot;
                                    </p>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-4 text-emerald-400 font-bold">
                                            <Mail size={20} />
                                            <span>careers@careerupgrade.ai</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-blue-400 font-bold">
                                            <MessageSquare size={20} />
                                            <span>WhatsApp Recruitment: +216 99 123 456</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="shrink-0">
                                    <a 
                                        href="mailto:careers@careerupgrade.ai"
                                        className="inline-flex items-center gap-3 px-8 py-5 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition-all shadow-xl shadow-white/5 active:scale-95"
                                    >
                                        Transmit Assets
                                        <ArrowRight size={18} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
