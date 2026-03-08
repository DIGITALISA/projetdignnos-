"use client";

import { motion } from "framer-motion";
import { ArrowRight, User, Mail, Phone, Loader2, CheckCircle2, Lock } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useSearchParams } from "next/navigation";

export default function RegisterPage() {
    const { language, dir } = useLanguage();
    const lang = (language as "en" | "fr" | "ar") || "en";

    const T = {
        en: {
            expertBadge: "Expert Account",
            proBadge: "Professional Account",
            studentBadge: "Student Account",
            expertTitle: "Expert Registration",
            proTitle: "Professional Registration",
            studentTitle: "Student Registration",
            expertSub: "Start your executive consulting journey with AI",
            proSub: "Prepare for your next strategic career jump",
            studentSub: "Join the academic elite and prepare your career",
            firstName: "First Name",
            lastName: "Last Name",
            email: "Professional Email",
            emailPlaceholder: "name@example.com",
            whatsapp: "WhatsApp Number",
            password: "Desired Access Code",
            submit: "Register Now",
            alreadyMember: "Already a member?",
            loginLink: "Login",
            successTitle: "Request Sent",
            successP1: "We will verify your information. If correct, we will send you a message on WhatsApp and email. You must confirm to start.",
            successP2: "Account activation takes 24h to 72h. For instant activation, contact us:",
            backLogin: "Back to Login",
            errorGeneric: "An error occurred",
            errorSystem: "System error. Please try again."
        },
        fr: {
            expertBadge: "Compte Expert",
            proBadge: "Compte Professionnel",
            studentBadge: "Compte Étudiant",
            expertTitle: "Inscription Expert",
            proTitle: "Inscription Professionnelle",
            studentTitle: "Inscription Étudiant",
            expertSub: "Commencez votre parcours de conseil avec l'IA",
            proSub: "Préparez votre prochain saut de carrière stratégique",
            studentSub: "Rejoignez l'élite académique et préparez votre carrière",
            firstName: "Prénom",
            lastName: "Nom",
            email: "Email Professionnel",
            emailPlaceholder: "nom@exemple.com",
            whatsapp: "Numéro WhatsApp",
            password: "Code d'Accès Souhaité",
            submit: "S'inscrire Maintenant",
            alreadyMember: "Déjà membre ?",
            loginLink: "Se connecter",
            successTitle: "Demande Envoyée",
            successP1: "Nous vérifierons vos informations. Si elles sont correctes, nous vous enverrons un message sur WhatsApp et par e-mail. Vous devrez confirmer pour commencer.",
            successP2: "Votre compte sera activé sous 24h à 72h. Pour une activation immédiate, contactez-nous :",
            backLogin: "Retour à la connexion",
            errorGeneric: "Une erreur est survenue",
            errorSystem: "Erreur système. Veuillez réessayer."
        },
        ar: {
            expertBadge: "حساب خبير",
            proBadge: "حساب محترف",
            studentBadge: "حساب طالب",
            expertTitle: "تسجيل خبير استشاري",
            proTitle: "تسجيل مهني محترف",
            studentTitle: "تسجيل حساب طالب",
            expertSub: "ابدأ رحلة التميز الاستشاري مع أدواتنا الذكية",
            proSub: "استعد للقفزة المهنية الاستراتيجية الكبرى",
            studentSub: "انضم إلى النخبة الأكاديمية واستعد لمسيرتك المهنية",
            firstName: "الاسم الشخصي",
            lastName: "الاسم العائلي",
            email: "البريد الإلكتروني المهني",
            emailPlaceholder: "الاسم@مثال.com",
            whatsapp: "رقم الواتساب",
            password: "كلمة المرور المطلوبة",
            submit: "التسجيل الآن",
            alreadyMember: "عضو بالفعل؟",
            loginLink: "تسجيل الدخول",
            successTitle: "تم إرسال الطلب",
            successP1: "سنتثبت من معطياتك إن كانت صحيحة لنرسل لك رسالة على الواتساب والبريد الإلكتروني. يجب عليك تأكيدهما للبدء.",
            successP2: "سيتم تفعيل الحساب بعد التثبت من المعطيات مابين 24 ساعة و 72 ساعة. للتفعيل الفوري، تواصل معنا:",
            backLogin: "العودة لتسجيل الدخول",
            errorGeneric: "حدث خطأ ما",
            errorSystem: "خطأ في النظام. يرجى المحاولة مرة أخرى."
        }
    }[lang];

    const searchParams = useSearchParams();
    const planId = searchParams.get("plan") || "s-free";
    
    // Determine Account Group
    const isExpert = planId.startsWith("e-");
    const isPro = planId.startsWith("p-");

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        whatsapp: "",
        password: "",
        plan: planId
    });
    const [error, setError] = useState<string | null>(null);
    const [contactInfo, setContactInfo] = useState({ whatsapp: '+216 44 172 284' });

    useEffect(() => {
        fetch("/api/config/contact")
            .then(res => res.json())
            .then(data => {
                if (data.whatsapp) setContactInfo({ whatsapp: data.whatsapp });
            })
            .catch(err => console.error("Error fetching contact config:", err));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (data.success) {
                setIsSuccess(true);
            } else {
                setError(data.error || T.errorGeneric);
            }
        } catch (err) {
            console.error("Registration error:", err);
            setError(T.errorSystem);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div dir={dir} className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl text-center border border-slate-100"
                >
                    <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto text-emerald-500 mb-8 shadow-inner">
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-4 opacity-90">
                        {T.successTitle}
                    </h2>
                    <p className="text-slate-500 font-medium leading-relaxed mb-4">
                        {T.successP1}
                    </p>
                    
                    <div className="bg-blue-50/50 rounded-2xl p-6 mb-8 border border-blue-100/50">
                        <p className="text-sm text-slate-600 font-bold mb-3 leading-relaxed">
                            {T.successP2}
                        </p>
                        <a 
                            href={`https://wa.me/${contactInfo.whatsapp.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl font-black text-sm hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                            dir="ltr"
                        >
                            <Phone size={16} />
                            {contactInfo.whatsapp}
                        </a>
                    </div>

                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-slate-400 font-bold hover:text-blue-600 transition-colors"
                    >
                        {T.backLogin} <ArrowRight size={16} className={dir === 'rtl' ? 'rotate-180' : ''} />
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div dir={dir} className="min-h-screen bg-slate-50 flex items-center justify-center relative overflow-hidden p-6">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-200/50 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-200/50 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg relative z-10"
            >
                <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-10 md:p-12">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-6 shadow-sm">
                            {isExpert ? T.expertBadge : isPro ? T.proBadge : T.studentBadge}
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
                            {isExpert ? T.expertTitle : isPro ? T.proTitle : T.studentTitle}
                        </h1>
                        <p className="text-slate-500 font-medium">
                            {isExpert ? T.expertSub : isPro ? T.proSub : T.studentSub}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                                    {T.firstName}
                                </label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                                    <input
                                        type="text"
                                        placeholder={T.firstName}
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-500/10 outline-none transition-all font-bold text-slate-900"
                                        required
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                                    {T.lastName}
                                </label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                                    <input
                                        type="text"
                                        placeholder={T.lastName}
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-500/10 outline-none transition-all font-bold text-slate-900"
                                        required
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                                {T.email}
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                                <input
                                    type="email"
                                    placeholder={T.emailPlaceholder}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-500/10 outline-none transition-all font-bold text-slate-900"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                                {T.whatsapp}
                            </label>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="+216 -- --- ---"
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-500/10 outline-none transition-all font-bold text-slate-900"
                                    required
                                    value={formData.whatsapp}
                                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                                {T.password}
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-500/10 outline-none transition-all font-bold text-slate-900"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-blue-500/20 active:scale-95 text-sm uppercase tracking-[0.2em]"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin w-5 h-5" />
                            ) : (
                                <>
                                    {T.submit}
                                    <ArrowRight size={20} className={dir === 'rtl' ? 'rotate-180' : 'ltr:rotate-0'} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-slate-50 text-center">
                        <p className="text-slate-500 text-sm">
                            {T.alreadyMember} <Link href="/login" className="text-blue-600 font-bold hover:underline">{T.loginLink}</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
