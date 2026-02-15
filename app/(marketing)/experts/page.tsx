"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Microscope, 
    Palette,
    Code,
    Globe,
    ShieldCheck,
    ChevronLeft,
    CheckCircle2,
    FileText,
    LucideIcon
} from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";
import { translations } from "@/lib/i18n/translations";

type RoleType = 'expert' | 'employee' | 'partner' | 'animator';

export default function ExpertRecruitmentPage() {
    const { dir, language } = useLanguage();
    const t = translations[language].recruit;
    const [showInfoPage, setShowInfoPage] = useState(false);
    const [selectedRole, setSelectedRole] = useState<RoleType>('expert');
    const [isAgreed, setIsAgreed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        cvLink: "",
        videoLink: "",
        domain: "",
        experience: "",
        projects: "",
        tools: "",
        position: "",
        availability: "",
        salary: "",
        education: "",
        company: "",
        partnerType: "Equity Partner",
        contribution: "",
        network: "",
        specialty: "",
        portfolio: "",
        languages: "",
        motivation: ""
    });

    const updateFormData = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const roles: { key: 'consultant' | 'technical' | 'animator' | 'partner'; icon: LucideIcon; tags: string[] }[] = [
        {
            key: "consultant",
            icon: Microscope,
            tags: ["Strategy", "M&A", "Governance"]
        },
        {
            key: "technical",
            icon: Code,
            tags: ["AI", "Architecture", "Fullstack"]
        },
        {
            key: "animator",
            icon: Palette,
            tags: ["Soft Skills", "Training", "Public Speaking"]
        },
        {
            key: "partner",
            icon: Globe,
            tags: ["Global", "Contribution", "Expansion"]
        }
    ];

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const res = await fetch("/api/recruitment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    role: selectedRole,
                    ...formData
                })
            });

            if (res.ok) {
                setIsSubmitting(false);
                setIsSuccess(true);
            } else {
                alert("Failed to transmit application. Please try again.");
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error("Submission error:", error);
            setIsSubmitting(false);
        }
    };

    const handleConfirmAgreement = () => {
        if (!isAgreed) return;
        handleFormSubmit({ preventDefault: () => {} } as React.FormEvent);
        setShowInfoPage(false);
    };

    return (
        <div className={cn(
            "min-h-screen bg-white italic-none selection:bg-blue-100 selection:text-blue-900",
            language === 'ar' ? 'font-arabic' : 'font-sans'
        )} dir={dir}>
            <Navbar />

            <main className="relative pt-32 pb-24 overflow-hidden">
                <AnimatePresence mode="wait">
                    {!showInfoPage ? (
                        <motion.div
                            key="main-page"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="container mx-auto px-6 relative z-10"
                        >
                            {/* Hero Section */}
                            <div className="max-w-4xl mx-auto text-center space-y-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-100"
                                >
                                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                                    {t.badge}
                                </motion.div>

                                <motion.h1 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1]"
                                >
                                    {t.titlePre} <br />
                                    <span className="text-blue-600 font-extrabold">{t.titleHighlight}</span>
                                </motion.h1>

                                <motion.p 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-slate-500 text-lg md:text-xl font-medium max-w-3xl mx-auto leading-relaxed"
                                >
                                    {t.subtitle}
                                </motion.p>
                            </div>

                            {/* Roles Grid */}
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-24 max-w-7xl mx-auto">
                                {roles.map((role, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3 + (idx * 0.1) }}
                                        className="group p-8 rounded-4xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 cursor-default"
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-blue-600 mb-8 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                            <role.icon size={28} />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-4">{t.roles[role.key].title}</h3>
                                        <p className="text-slate-500 text-sm leading-relaxed mb-8">{t.roles[role.key].desc}</p>
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

                            {/* Registration Form Section */}
                            <div className="mt-32 max-w-5xl mx-auto">
                                <div className="bg-slate-900 rounded-[3rem] p-12 relative overflow-hidden border border-slate-800 shadow-3xl shadow-slate-900/50">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] -mr-32 -mt-32" />
                                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/10 blur-[100px] -ml-32 -mb-32" />
                                    
                                    <div className="relative z-10">
                                        <div className="mb-12 text-center md:text-left">
                                            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight flex items-center gap-4 justify-center md:justify-start">
                                                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center">
                                                    <FileText size={24} className="text-white" />
                                                </div>
                                                {t.form.title}
                                            </h2>
                                            <p className="text-slate-400 text-lg font-medium">
                                                {t.form.subtitle}
                                            </p>
                                        </div>

                                        <form className="space-y-8" onSubmit={handleFormSubmit}>
                                            {/* Role Selection */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {(Object.keys(t.form.roles) as RoleType[]).map((key) => (
                                                    <button
                                                        key={key}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedRole(key);
                                                            setIsSuccess(false);
                                                        }}
                                                        className={cn(
                                                            "p-4 rounded-2xl border-2 transition-all text-sm font-bold flex flex-col items-center gap-3",
                                                            selectedRole === key 
                                                                ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/20 scale-105" 
                                                                : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500"
                                                        )}
                                                    >
                                                        {key === 'expert' && <Microscope size={20} />}
                                                        {key === 'employee' && <ShieldCheck size={20} />}
                                                        {key === 'partner' && <Globe size={20} />}
                                                        {key === 'animator' && <Palette size={20} />}
                                                        {t.form.roles[key].label}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Common Fields */}
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">{t.form.common.fullName}</label>
                                                    <input required type="text" className="w-full bg-slate-800/50 border-2 border-slate-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold placeholder:text-slate-600" placeholder="e.g. John Doe" value={formData.fullName} onChange={(e) => updateFormData('fullName', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">{t.form.common.email}</label>
                                                    <input required type="email" className="w-full bg-slate-800/50 border-2 border-slate-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold placeholder:text-slate-600" placeholder="contact@company.com" value={formData.email} onChange={(e) => updateFormData('email', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">{t.form.common.phone}</label>
                                                    <input required type="tel" className="w-full bg-slate-800/50 border-2 border-slate-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold placeholder:text-slate-600" placeholder="+216 -- --- ---" value={formData.phone} onChange={(e) => updateFormData('phone', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">{t.form.common.cv}</label>
                                                    <input required type="url" className="w-full bg-slate-800/50 border-2 border-slate-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold placeholder:text-slate-600" placeholder="https://drive.google.com/..." value={formData.cvLink} onChange={(e) => updateFormData('cvLink', e.target.value)} />
                                                </div>
                                            </div>

                                            {/* Role Specific Fields */}
                                            <div className="pt-6 border-t border-slate-800">
                                                <AnimatePresence mode="wait">
                                                    <motion.div key={selectedRole} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6" >
                                                        <div className="grid md:grid-cols-2 gap-6">
                                                            {selectedRole === 'expert' && (
                                                                <>
                                                                    <div className="space-y-2">
                                                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">{t.form.roles.expert.domain}</label>
                                                                        <input type="text" className="w-full bg-slate-800/50 border-2 border-slate-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold" value={formData.domain} onChange={(e) => updateFormData('domain', e.target.value)} />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">{t.form.roles.expert.experience}</label>
                                                                        <input type="text" className="w-full bg-slate-800/50 border-2 border-slate-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold" value={formData.experience} onChange={(e) => updateFormData('experience', e.target.value)} />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">{t.form.roles.expert.projects}</label>
                                                                        <input type="text" className="w-full bg-slate-800/50 border-2 border-slate-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold" value={formData.projects} onChange={(e) => updateFormData('projects', e.target.value)} />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">{t.form.roles.expert.tools}</label>
                                                                        <input type="text" className="w-full bg-slate-800/50 border-2 border-slate-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold" value={formData.tools} onChange={(e) => updateFormData('tools', e.target.value)} />
                                                                    </div>
                                                                </>
                                                            )}
                                                            {selectedRole === 'employee' && (
                                                                <>
                                                                    <div className="space-y-2">
                                                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">{t.form.roles.employee.position}</label>
                                                                        <input type="text" className="w-full bg-slate-800/50 border-2 border-slate-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold" value={formData.position} onChange={(e) => updateFormData('position', e.target.value)} />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">{t.form.roles.employee.salary}</label>
                                                                        <input type="text" className="w-full bg-slate-800/50 border-2 border-slate-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold" value={formData.salary} onChange={(e) => updateFormData('salary', e.target.value)} />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">{t.form.roles.employee.availability}</label>
                                                                        <input type="text" className="w-full bg-slate-800/50 border-2 border-slate-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold" value={formData.availability} onChange={(e) => updateFormData('availability', e.target.value)} />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">{t.form.roles.employee.education}</label>
                                                                        <input type="text" className="w-full bg-slate-800/50 border-2 border-slate-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold" value={formData.education} onChange={(e) => updateFormData('education', e.target.value)} />
                                                                    </div>
                                                                </>
                                                            )}
                                                            {selectedRole === 'partner' && (
                                                                <>
                                                                    <div className="space-y-2">
                                                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">{t.form.roles.partner.company}</label>
                                                                        <input type="text" className="w-full bg-slate-800/50 border-2 border-slate-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold" value={formData.company} onChange={(e) => updateFormData('company', e.target.value)} />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">{t.form.roles.partner.type}</label>
                                                                        <select className="w-full bg-slate-800/50 border-2 border-slate-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold" value={formData.partnerType} onChange={(e) => updateFormData('partnerType', e.target.value)}>
                                                                            <option>Equity Partner</option>
                                                                            <option>Resource Partner</option>
                                                                            <option>Strategic Affiliate</option>
                                                                        </select>
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">{t.form.roles.partner.contribution}</label>
                                                                        <input type="text" className="w-full bg-slate-800/50 border-2 border-slate-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold" value={formData.contribution} onChange={(e) => updateFormData('contribution', e.target.value)} />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">{t.form.roles.partner.network}</label>
                                                                        <input type="text" className="w-full bg-slate-800/50 border-2 border-slate-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold" value={formData.network} onChange={(e) => updateFormData('network', e.target.value)} />
                                                                    </div>
                                                                </>
                                                            )}
                                                            {selectedRole === 'animator' && (
                                                                <>
                                                                    <div className="space-y-2">
                                                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">{t.form.roles.animator.specialty}</label>
                                                                        <input type="text" className="w-full bg-slate-800/50 border-2 border-slate-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold" value={formData.specialty} onChange={(e) => updateFormData('specialty', e.target.value)} />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">{t.form.roles.animator.experience}</label>
                                                                        <input type="text" className="w-full bg-slate-800/50 border-2 border-slate-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold" value={formData.experience} onChange={(e) => updateFormData('experience', e.target.value)} />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">{t.form.roles.animator.portfolio}</label>
                                                                        <input type="url" className="w-full bg-slate-800/50 border-2 border-slate-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold" value={formData.portfolio} onChange={(e) => updateFormData('portfolio', e.target.value)} />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">{t.form.roles.animator.languages}</label>
                                                                        <input type="text" className="w-full bg-slate-800/50 border-2 border-slate-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold" value={formData.languages} onChange={(e) => updateFormData('languages', e.target.value)} />
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>

                                                        {/* Description / Motivation Field */}
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">{t.form.roles[selectedRole].motivation}</label>
                                                            <textarea 
                                                                rows={4}
                                                                className="w-full bg-slate-800/50 border-2 border-slate-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold resize-none"
                                                                placeholder="..."
                                                                value={formData.motivation}
                                                                onChange={(e) => updateFormData('motivation', e.target.value)}
                                                            />
                                                        </div>
                                                    </motion.div>
                                                </AnimatePresence>
                                            </div>

                                            {/* Video Link Field */}
                                            <div className="space-y-2 mt-6">
                                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">{t.form.common.video}</label>
                                                <input required type="url" className="w-full bg-slate-800/50 border-2 border-slate-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold placeholder:text-slate-600" placeholder="https://..." value={formData.videoLink} onChange={(e) => updateFormData('videoLink', e.target.value)} />
                                                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-tighter">
                                                    {t.form.common.videoNote}
                                                </p>
                                            </div>

                                            <div className="pt-8">
                                                <div className="flex flex-col md:flex-row gap-6 items-center">
                                                    <button type="button" onClick={() => setShowInfoPage(true)} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest underline underline-offset-8">
                                                        <ShieldCheck size={14} />
                                                        {t.ctaInfo}
                                                    </button>
                                                    <button disabled={isSubmitting || isSuccess} type="submit" className={cn("flex-1 w-full py-6 rounded-4xl font-black uppercase tracking-[0.2em] text-sm transition-all flex items-center justify-center gap-3", isSuccess ? "bg-emerald-500 text-white" : "bg-white text-slate-900 hover:bg-blue-50 hover:text-blue-600 shadow-2xl shadow-white/5 active:scale-[0.98]")}>
                                                        {isSubmitting ? <span className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" /> : (isSuccess ? <><CheckCircle2 size={20} />{t.form.common.successTitle}</> : t.form.common.submit)}
                                                    </button>
                                                </div>
                                                {isSuccess && (
                                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-emerald-400 mt-4 font-bold text-sm">
                                                        {t.form.common.successDesc}
                                                    </motion.p>
                                                )}
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="info-page"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="container mx-auto px-6 relative z-10"
                        >
                            <div className="max-w-4xl mx-auto">
                                <button 
                                    onClick={() => setShowInfoPage(false)}
                                    className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold transition-colors mb-12"
                                >
                                    <ChevronLeft size={20} />
                                    {language === 'ar' ? 'عودة' : (language === 'fr' ? 'Retour' : 'Back')}
                                </button>

                                <div className="space-y-12">
                                    <div className="space-y-4">
                                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                                            {t.infoPage.title}
                                        </h1>
                                        <p className="text-blue-600 font-bold tracking-widest uppercase text-sm">
                                            {t.infoPage.subtitle}
                                        </p>
                                    </div>

                                    <div className="prose prose-slate max-w-none">
                                        <p className="text-xl text-slate-500 font-medium leading-relaxed italic">
                                            &ldquo;{t.infoPage.description}&rdquo;
                                        </p>
                                    </div>

                                    <div className="grid gap-4 mt-8">
                                        {t.infoPage.conditions.map((condition: string, i: number) => (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                key={i}
                                                className="flex gap-4 p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-white transition-all group"
                                            >
                                                <div className="shrink-0 mt-1">
                                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors font-black text-xs">
                                                        0{i + 1}
                                                    </div>
                                                </div>
                                                <p className="text-slate-700 font-semibold leading-relaxed">
                                                    {condition}
                                                </p>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <div className="mt-16 p-8 md:p-12 rounded-4xl bg-blue-50 border-2 border-blue-100 space-y-8">
                                        <div className="flex items-start gap-6">
                                            <div className="shrink-0 p-4 bg-white rounded-2xl shadow-sm border border-blue-100">
                                                <ShieldCheck size={32} className="text-blue-600" />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-2xl font-bold text-slate-900">
                                                    {language === 'ar' ? 'الموافقة القانونية' : (language === 'fr' ? 'Accord Légal' : 'Legal Agreement')}
                                                </h3>
                                                <p className="text-slate-500 font-medium">
                                                    {language === 'ar' ? 'بالتوقيع على هذا المستند، فإنك تلتزم بالعمل من أجل المصلحة المشتركة.' : 'By signing this document, you commit to working for the mutual interest of our global mission.'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-6 pt-4 border-t border-blue-200/50">
                                            <label className="flex items-start gap-4 cursor-pointer group">
                                                <div className="relative mt-1">
                                                    <input 
                                                        type="checkbox" 
                                                        className="peer sr-only"
                                                        checked={isAgreed}
                                                        onChange={(e) => setIsAgreed(e.target.checked)}
                                                    />
                                                    <div className="w-6 h-6 border-2 border-blue-200 rounded-lg bg-white peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                                                        <CheckCircle2 size={16} className="text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                                    </div>
                                                </div>
                                                <span className="text-slate-700 font-bold select-none group-hover:text-blue-700 transition-colors">
                                                    {t.infoPage.agreement}
                                                </span>
                                            </label>

                                            <button
                                                disabled={!isAgreed || isSubmitting || isSuccess}
                                                onClick={handleConfirmAgreement}
                                                className={cn(
                                                    "w-full py-6 rounded-4xl font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3",
                                                    isAgreed 
                                                        ? (isSuccess ? "bg-emerald-500 text-white" : "bg-slate-900 text-white hover:bg-slate-800 shadow-2xl shadow-slate-900/20") 
                                                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                                )}
                                            >
                                                {isSubmitting ? (
                                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : isSuccess ? (
                                                    <>
                                                        <CheckCircle2 size={20} />
                                                        {language === 'ar' ? 'تمت الموافقة' : 'Agreement Authorized'}
                                                    </>
                                                ) : (
                                                    t.infoPage.confirm
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
