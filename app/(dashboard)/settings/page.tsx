"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
    Bell, 
    User, 
    Save, 
    CheckCircle2, 
    RotateCcw, 
    Loader2, 
    Globe,
    Zap,
    Settings
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function SettingsPage() {
    const { language, dir, setLanguage } = useLanguage();
    const isRtl = dir === 'rtl';
    const lang = language as "ar" | "en" | "fr";

    const [profile, setProfile] = useState({
        fullName: "Ahmed User",
        email: "ahmed@example.com",
        notifications: true,
        plan: "Executive Professional",
        language: "ar",
        expertLevel: "Senior Strategist"
    });
    const [saved, setSaved] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [resetRequested, setResetRequested] = useState(false);

    useEffect(() => {
        const savedProfile = localStorage.getItem("userProfile");
        if (savedProfile) {
            try {
                const parsed = JSON.parse(savedProfile);
                setProfile(prev => ({ ...prev, ...parsed }));
                if (parsed.resetRequested) setResetRequested(true);
            } catch (e) {
                console.error("Error parsing profile", e);
            }
        }
    }, []);

    const trans = {
        ar: {
            title: "الإعدادات الاستراتيجية",
            subtitle: "إدارة تفضيلات حسابك التنفيذي وبوابتك الاحترافية.",
            profile: {
                title: "المعلومات الشخصية",
                desc: "تحديث تفاصيل الحساب والهوية المهنية العامة.",
                name: "الاسم الكامل",
                email: "البريد الإلكتروني",
                expertLevel: "المستوى المهني"
            },
            notifications: {
                title: "التنبيهات والذكاء",
                desc: "إدارة كيفية استلام التحديثات والتحليلات الأسبوعية.",
                email: "تنبيهات البريد الإلكتروني",
                email_desc: "استلام ملخصات أسبوعية وتقارير SCI مباشرة."
            },
            language: {
                title: "اللغة والمنطقة",
                desc: "اختر اللغة المفضلة لواجهة التحكم الاستراتيجية.",
                label: "لغة النظام"
            },
            danger: {
                title: "التحكم في المسار",
                desc: "طلب إعادة تعيين كاملة لمسار التشخيص الاستراتيجي.",
                warning: "إعادة تعيين التقدم",
                warning_desc: "هذا سيقوم بأرشفة تقدمك الحالي والبدء من جديد بعد موافقة الخبراء.",
                request: "طلب إعادة تعيين شاملة",
                pending: "طلب قيد المراجعة"
            },
            save: "حفظ الإعدادات",
            updated: "تم تحديث الملف"
        },
        en: {
            title: "Strategic Settings",
            subtitle: "Manage your executive account preferences and professional portal.",
            profile: {
                title: "Profile Information",
                desc: "Update your account details and public professional identity.",
                name: "Full Name",
                email: "Email Address",
                expertLevel: "Expert Level"
            },
            notifications: {
                title: "Intelligence & Alerts",
                desc: "Manage how you receive updates and weekly analytics.",
                email: "Email Notifications",
                email_desc: "Receive weekly digests and direct SCI reports."
            },
            language: {
                title: "Language & Region",
                desc: "Choose your preferred language for the strategic console.",
                label: "System Language"
            },
            danger: {
                title: "Journey Control",
                desc: "Request a full restart of your strategic diagnostic path.",
                warning: "Progress Reset",
                warning_desc: "This will archive current progress and restart after expert approval.",
                request: "Request Full Reset",
                pending: "Reset Pending"
            },
            save: "Save Settings",
            updated: "Profile Updated"
        },
        fr: {
            title: "Paramètres Stratégiques",
            subtitle: "Gérez vos préférences de compte exécutif et votre portail professionnel.",
            profile: {
                title: "Informations de Profil",
                desc: "Mettez à jour vos détails de compte et votre identité publique.",
                name: "Nom Complet",
                email: "Adresse E-mail",
                expertLevel: "Niveau Expert"
            },
            notifications: {
                title: "Intelligence & Alertes",
                desc: "Gérez la réception de vos mises à jour et analyses.",
                email: "Notifications E-mail",
                email_desc: "Recevoir les résumés hebdomadaires et rapports SCI."
            },
            language: {
                title: "Langue & Région",
                desc: "Choisissez votre langue préférée pour la console stratégique.",
                label: "Langue du Système"
            },
            danger: {
                title: "Contrôle du Parcours",
                desc: "Demander une réinitialisation complète du diagnostic.",
                warning: "Réinitialisation",
                warning_desc: "Archive votre progression actuelle après approbation experte.",
                request: "Demander le Reset",
                pending: "Reset en Attente"
            },
            save: "Enregistrer",
            updated: "Profil Mis à jour"
        }
    }[lang];

    const handleSave = () => {
        localStorage.setItem("userProfile", JSON.stringify(profile));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        window.dispatchEvent(new Event("profileUpdated"));
    };

    const handleResetRequest = async () => {
        const confirmMsg = lang === 'ar' ? "هل أنت متأكد؟ سيؤدي هذا لمسح جميع بياناتك بعد موافقة الإدارة." : "Are you sure? This will request a full data reset after admin approval.";
        if (!window.confirm(confirmMsg)) return;

        setIsResetting(true);
        try {
            const res = await fetch('/api/user/request-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: profile.email || profile.fullName })
            });
            const data = await res.json();
            if (data.success) {
                setResetRequested(true);
                const updatedProfile = { ...profile, resetRequested: true };
                localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
            }
        } catch (error) {
            console.error("Reset error:", error);
        } finally {
            setIsResetting(false);
        }
    };

    return (
        <div className={cn("min-h-screen bg-slate-950 p-6 md:p-12 pb-32 space-y-12 max-w-6xl mx-auto", isRtl && "text-right")}>
            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
            >
                <div className="flex items-center gap-3 text-indigo-400 font-black text-xs uppercase tracking-widest">
                    <Settings className="w-4 h-4" />
                    {lang === 'ar' ? 'لوحة التحكم' : 'Console Settings'}
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                    {trans.title}
                </h1>
                <p className="text-slate-500 font-medium text-lg max-w-2xl">
                    {trans.subtitle}
                </p>
            </motion.div>

            <div className="grid lg:grid-cols-12 gap-10">
                {/* Left Side: Forms */}
                <div className="lg:col-span-8 space-y-10">
                    {/* Profile Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                            <User size={120} />
                        </div>

                        <div className="flex items-center gap-6 mb-10 relative z-10">
                            <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-3xl flex items-center justify-center shadow-inner">
                                <User className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">{trans.profile.title}</h2>
                                <p className="text-sm text-slate-500 font-medium">{trans.profile.desc}</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 relative z-10">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">{trans.profile.name}</label>
                                <input
                                    type="text"
                                    value={profile.fullName}
                                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-950 border border-white/10 text-white focus:border-indigo-500 outline-none transition-all font-bold placeholder:text-slate-800"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">{trans.profile.email}</label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-950 border border-white/10 text-white focus:border-indigo-500 outline-none transition-all font-bold placeholder:text-slate-800"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">{trans.profile.expertLevel}</label>
                                <div className="px-6 py-4 rounded-2xl bg-slate-950 border border-white/10 text-indigo-400 font-black text-xs uppercase tracking-widest flex items-center gap-3">
                                    <Zap size={14} className="fill-current" />
                                    {profile.plan} • {profile.expertLevel}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Language & Interface Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-xl shadow-2xl overflow-hidden"
                    >
                        <div className="flex items-center gap-6 mb-10">
                            <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-3xl flex items-center justify-center shadow-inner">
                                <Globe className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">{trans.language.title}</h2>
                                <p className="text-sm text-slate-500 font-medium">{trans.language.desc}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {['ar', 'en', 'fr'].map((l) => (
                                <button
                                    key={l}
                                    onClick={() => {
                                        setLanguage(l as "ar" | "en" | "fr");
                                        setProfile({ ...profile, language: l });
                                    }}
                                    className={cn(
                                        "py-4 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all",
                                        language === l 
                                            ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20" 
                                            : "bg-slate-950 border-white/10 text-slate-500 hover:border-indigo-500/50"
                                    )}
                                >
                                    {l === 'ar' ? 'العربية' : l === 'en' ? 'English' : 'Français'}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Right Side: Small widgets & Save */}
                <div className="lg:col-span-4 space-y-10">
                    {/* Save Widget */}
                    <div className="sticky top-10 space-y-10">
                        <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-xl shadow-2xl">
                             <button
                                onClick={handleSave}
                                className="w-full flex items-center justify-center gap-4 py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/40 active:scale-95 group"
                            >
                                {saved ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                                {saved ? trans.updated : trans.save}
                            </button>
                        </div>

                        {/* Notifications Toggles */}
                        <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl shadow-2xl">
                            <div className="flex items-center gap-4 mb-8">
                                <Bell className="text-indigo-400" size={20} />
                                <h3 className="font-black text-white uppercase tracking-tighter text-lg">{trans.notifications.title}</h3>
                            </div>
                            <div className="flex items-center justify-between gap-6">
                                <div>
                                    <p className="font-bold text-white text-sm">{trans.notifications.email}</p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{trans.notifications.email_desc}</p>
                                </div>
                                <button
                                    onClick={() => setProfile({ ...profile, notifications: !profile.notifications })}
                                    className={cn(
                                        "w-12 h-6 rounded-full transition-all relative flex items-center px-1",
                                        profile.notifications ? 'bg-indigo-600' : 'bg-slate-800'
                                    )}
                                >
                                    <motion.div 
                                        animate={{ x: profile.notifications ? isRtl ? -20 : 24 : 0 }}
                                        className="w-4 h-4 bg-white rounded-full shadow-lg" 
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Danger Section */}
                        <div className="bg-rose-500/5 border border-rose-500/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
                            <div className="flex items-center gap-3 text-rose-500 mb-6">
                                <RotateCcw size={18} />
                                <h3 className="font-black uppercase tracking-widest text-xs">{trans.danger.title}</h3>
                            </div>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
                                {trans.danger.warning_desc}
                            </p>
                            <button
                                onClick={handleResetRequest}
                                disabled={isResetting || resetRequested}
                                className={cn(
                                    "w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                                    resetRequested 
                                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                                        : "bg-rose-500 text-white hover:bg-rose-600 shadow-xl shadow-rose-500/20"
                                )}
                            >
                                {isResetting ? <Loader2 className="w-4 h-4 animate-spin" /> : resetRequested ? <CheckCircle2 size={14} /> : <RotateCcw size={14} />}
                                {resetRequested ? trans.danger.pending : trans.danger.request}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
