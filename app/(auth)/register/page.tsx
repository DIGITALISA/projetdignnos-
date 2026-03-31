"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowRight, User, Mail, Phone, Loader2, CheckCircle2, Lock, GraduationCap, Shield, Eye, EyeOff, Copy, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useSearchParams } from "next/navigation";

export default function RegisterPage() {
    const { language, dir } = useLanguage();
    const lang = (language as "en" | "fr" | "ar") || "en";

    const T = {
        en: {
            expertBadge: "Compte Expert",
            proBadge: "Compte Pro",
            studentBadge: "Compte Gratuit",
            trainerBadge: "Compte Expert/Formateur",
            expertTitle: "Inscription Expert",
            proTitle: "Inscription Pro",
            studentTitle: "Inscription Gratuite",
            trainerTitle: "Inscription Expert & Formateur",
            expertSub: "Start your executive consulting journey with AI",
            proSub: "Prepare for your next strategic career jump",
            studentSub: "Join the academic elite and prepare your career",
            trainerSub: "Join our expert network — AI accreditation required",
            firstName: "First Name",
            lastName: "Last Name",
            email: "Professional Email",
            emailPlaceholder: "name@example.com",
            whatsapp: "WhatsApp Number",
            password: "Desired Access Code",
            submit: "Register Now",
            alreadyMember: "Already a member?",
            loginLink: "Login",
            successTitle: "Congratulations! Your request is ready",
            successP1: "You can now log in to your account. Click 'Back to login' and use the email and password you just chose.",
            successP2: "Important: Final activation will only be completed after contacting us via WhatsApp to verify your account information.",
            successP3: "Your account will be activated once verified within 24 hours maximum. Contact us now for instant activation:",
            backLogin: "Back to Login",
            errorGeneric: "An error occurred",
            errorSystem: "System error. Please try again.",
            chooseAccount: "Choose Your Account Type",
            chooseSub: "Select the path that best matches your current professional status",
            studentCard: "Student / Academic",
            proCard: "Professional / Executive",
            expertCard: "Expert / Consultant",
            select: "Select This Path",
            activationNote: "Important Note: After registration, you can explore the account for 10 minutes for free! Full activation is completed after contacting us via WhatsApp.",
            trialNote: "Try for 10 minutes free before activation!",
            passwordSafetyNote: "Please save your access code in a safe place, you will need it to login later.",
            copyBtn: "Copy"
        },
        fr: {
            expertBadge: "Compte Expert",
            proBadge: "Compte Pro",
            studentBadge: "Compte Gratuit",
            trainerBadge: "Compte Expert/Formateur",
            expertTitle: "Inscription Expert",
            proTitle: "Inscription Pro",
            studentTitle: "Inscription Gratuite",
            trainerTitle: "Inscription Expert & Formateur",
            expertSub: "Commencez votre parcours de conseil avec l'IA",
            proSub: "Préparez votre prochain saut de carrière stratégique",
            studentSub: "Rejoignez l'élite académique et préparez votre carrière",
            trainerSub: "Rejoignez notre réseau d'experts — accréditation IA requise",
            firstName: "Prénom",
            lastName: "Nom",
            email: "Email Professionnel",
            emailPlaceholder: "nom@exemple.com",
            whatsapp: "Numéro WhatsApp",
            password: "Code d'Accès Souhaité",
            submit: "S'inscrire Maintenant",
            alreadyMember: "Déjà membre ?",
            loginLink: "Se connecter",
            successTitle: "Félicitations ! Votre demande est créée",
            successP1: "Vous pouvez maintenant vous connecter à votre compte. Cliquez sur 'Retour à la connexion' puis utilisez l'email et le mot de passe que vous venez de choisir.",
            successP2: "Important : Vous pouvez explorer votre compte pendant 10 minutes gratuitement ! Pour continuer à l'utiliser et débloquer toutes les fonctionnalités, vous devez nous contacter via WhatsApp pour l'activation finale.",
            successP3: "Votre compte sera activé dès vérification sous 24h maximum. Contactez-nous dès maintenant pour accélérer le processus :",
            backLogin: "Retour à la connexion",
            errorGeneric: "Une erreur est survenue",
            errorSystem: "Erreur système. Veuillez réessayer.",
            chooseAccount: "Choisissez votre type de compte",
            chooseSub: "Sélectionnez le parcours qui correspond le mieux à votre statut professionnel",
            studentCard: "Étudiant / Académique",
            proCard: "Professionnel / Cadre",
            expertCard: "Expert / Consultant",
            select: "Choisir ce parcours",
            activationNote: "Note importante : Après l'inscription, vous pouvez explorer le compte gratuitement pendant 10 minutes ! L'activation finale se fait après nous avoir contactés via WhatsApp.",
            trialNote: "Essayez pendant 10 minutes gratuitement avant l'activation !",
            passwordSafetyNote: "Veuillez conserver votre code d'accès en lieu sûr, vous en aurez besoin pour vous connecter.",
            copyBtn: "Copier"
        },
        ar: {
            expertBadge: "حساب خبير",
            proBadge: "حساب برو (تحليل ساعة)",
            studentBadge: "حساب مجاني",
            trainerBadge: "حساب خبير/مدرب",
            expertTitle: "تسجيل خبير استشاري",
            proTitle: "تسجيل حساب برو",
            studentTitle: "تسجيل حساب مجاني",
            trainerTitle: "تسجيل حساب خبير ومدرب",
            expertSub: "ابدأ رحلة التميز الاستشاري مع أدواتنا الذكية",
            proSub: "استعد للقفزة المهنية الاستراتيجية الكبرى",
            studentSub: "انضم إلى النخبة الأكاديمية واستعد لمسيرتك المهنية",
            trainerSub: "انضم إلى شبكة خبرائنا — مقابلة تقييم بالذكاء الاصطناعي مطلوبة",
            firstName: "الاسم الشخصي",
            lastName: "الاسم العائلي",
            email: "البريد الإلكتروني المهني",
            emailPlaceholder: "الاسم@مثال.com",
            whatsapp: "رقم الواتساب",
            password: "كلمة المرور المطلوبة",
            submit: "التسجيل الآن",
            alreadyMember: "عضو بالفعل؟",
            loginLink: "تسجيل الدخول",
            successTitle: "تهانينا! تم إنشاء طلبك بنجاح",
            successP1: "بإمكانك الآن تسجيل الدخول إلى حسابك. انقر على 'العودة لتسجيل الدخول' ثم أدخل بريدك الإلكتروني وكلمة المرور التي اخترتها عند التسجيل.",
            successP2: "ملاحظة هامة: يمكنك الآن استكشاف حسابك لمدة 10 دقائق مجاناً! لمواصلة الاستخدام وفتح جميع المميزات، يجب التواصل معنا عبر الواتساب للتفعيل النهائي.",
            successP3: "سيتم تفعيل حسابك فور التحقق من البيانات في غضون 24 ساعة كحد أقصى. تواصل معنا الآن لتسريع التفعيل:",
            backLogin: "العودة لتسجيل الدخول",
            errorGeneric: "حدث خطأ ما",
            errorSystem: "خطأ في النظام. يرجى المحاولة مرة أخرى.",
            chooseAccount: "اختر نوع حسابك",
            chooseSub: "حدد المسار الذي يتناسب مع وضعك المهني الحالي",
            studentCard: "طالب / أكاديمي",
            proCard: "محترف / إطار مسير",
            expertCard: "خبير / مستشار",
            select: "اختر هذا المسار",
            activationNote: "ملاحظة هامة: بعد التسجيل، يمكنك تجربة الحساب مجاناً لمدة 10 دقائق! يتم التفعيل النهائي بعد التواصل معنا عبر الواتساب للتثبت من المعطيات.",
            trialNote: "جرب الحساب لمدة 10 دقائق مجاناً قبل التفعيل!",
            passwordSafetyNote: "يرجى حفظ كلمة المرور الخاصة بك في مكان آمن، ستحتاجها للدخول لاحقاً.",
            copyBtn: "نسخ"
        }
    }[lang];

    const searchParams = useSearchParams();
    const urlPlan = searchParams.get("plan");
    
    const [selectedPlan, setSelectedPlan] = useState<string | null>(urlPlan);

    // Determine Account Group
    const isExpert = selectedPlan?.startsWith("e-");
    const isPro = selectedPlan?.startsWith("p-");
    const isTrainer = selectedPlan?.startsWith("x-"); // Expert/Trainer account

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        whatsapp: "",
        password: "",
        plan: selectedPlan || "s-free"
    });

    useEffect(() => {
        if (selectedPlan) {
            setFormData(prev => ({ ...prev, plan: selectedPlan }));
        }
    }, [selectedPlan]);
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

    const handleCopyPassword = () => {
        if (!formData.password) return;
        navigator.clipboard.writeText(formData.password);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

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
            <div dir={dir} className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-100/50 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[100px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="max-w-xl w-full bg-white/80 backdrop-blur-xl rounded-[3rem] p-12 shadow-2xl text-center border border-white relative z-10"
                >
                    <div className="w-24 h-24 bg-emerald-500 rounded-4xl flex items-center justify-center mx-auto text-white mb-10 shadow-2xl shadow-emerald-500/30 rotate-3 transition-transform hover:rotate-0 duration-500">
                        <CheckCircle2 size={48} />
                    </div>

                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 tracking-tight">
                        {T.successTitle}
                    </h2>

                    <div className="space-y-8 mb-12">
                        <p className="text-lg text-slate-600 font-medium leading-relaxed">
                            {T.successP1}
                        </p>

                        <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
                                <Shield size={120} />
                            </div>
                            
                            <p className="relative z-10 text-[11px] font-black uppercase tracking-[0.2em] opacity-80 mb-4">
                                {dir === 'rtl' ? 'الإجراء المطلوب' : 'Action Requise'}
                            </p>
                            
                            <p className="relative z-10 text-sm md:text-base font-bold mb-6 leading-relaxed">
                                {T.successP2}
                                <span className="block mt-4 text-xs opacity-90 font-medium italic">
                                    {T.successP3}
                                </span>
                            </p>
                            
                            <a 
                                href={`https://wa.me/${contactInfo.whatsapp.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative z-10 inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all shadow-lg active:scale-95"
                                dir="ltr"
                            >
                                <Phone size={18} className="animate-bounce" />
                                {contactInfo.whatsapp}
                            </a>
                        </div>
                    </div>

                    <Link
                        href="/login"
                        className="w-full bg-slate-900 hover:bg-blue-700 text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-4 shadow-xl active:scale-95 uppercase tracking-[0.2em] text-xs"
                    >
                        <ArrowRight size={18} className={dir === 'rtl' ? 'rotate-180 order-2' : ''} />
                        <span className={dir === 'rtl' ? 'order-1' : ''}>{T.backLogin}</span>
                    </Link>
                </motion.div>
            </div>
        );
    }

    if (!selectedPlan) {
        return (
            <div dir={dir} className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-200/50 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-200/50 rounded-full blur-[100px]" />
                </div>
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-4xl w-full z-10"
                >
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight uppercase">
                            {T.chooseAccount}
                        </h1>
                        <p className="text-slate-500 font-medium text-lg">
                            {T.chooseSub}
                        </p>
                        
                        {/* Summary Activation Note */}
                        <div className="mt-8 max-w-2xl mx-auto flex flex-col gap-3">
                            <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-2xl p-4 flex gap-3 items-center justify-center">
                                <Sparkles className="w-5 h-5 text-emerald-500 shrink-0" />
                                <p className="text-xs text-emerald-700 font-bold leading-relaxed">
                                    {T.trialNote}
                                </p>
                            </div>
                            <div className="bg-blue-50/50 border border-blue-100/50 rounded-2xl p-4 flex gap-3 items-center justify-center">
                                <Shield className="w-5 h-5 text-blue-500 shrink-0" />
                                <p className="text-xs text-blue-700 font-bold leading-relaxed">
                                    {T.activationNote}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { id: 's-free', title: T.studentCard, sub: T.studentSub, color: 'blue', icon: GraduationCap },
                            { id: 'p-pro', title: T.proCard, sub: T.proSub, color: 'indigo', icon: User },
                            { id: 'e-expert', title: T.expertCard, sub: T.expertSub, color: 'emerald', icon: Lock }
                        ].map((item) => {
                            const Icon = item.icon;
                            const isNotReady = item.id === 'e-expert';
                            return (
                                <motion.button
                                    key={item.id}
                                    whileHover={!isNotReady ? { y: -10 } : {}}
                                    onClick={() => !isNotReady && setSelectedPlan(item.id)}
                                    disabled={isNotReady}
                                    className={cn(
                                        "bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl transition-all text-center group flex flex-col items-center",
                                        !isNotReady ? "hover:shadow-2xl hover:border-blue-500/20" : "opacity-60 grayscale cursor-not-allowed"
                                    )}
                                >
                                    <div className={cn(
                                        "w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-all shadow-inner",
                                        !isNotReady && "group-hover:scale-110",
                                        item.color === 'blue' ? 'bg-blue-50 text-blue-500' : 
                                        item.color === 'indigo' ? 'bg-indigo-50 text-indigo-500' : 'bg-emerald-50 text-emerald-500'
                                    )}>
                                        <Icon size={32} />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 flex-1">
                                        {item.sub}
                                    </p>
                                    <div className={cn(
                                        "w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all",
                                        isNotReady 
                                            ? "bg-slate-200 text-slate-500" 
                                            : "bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white"
                                    )}>
                                        {isNotReady 
                                            ? (dir === 'rtl' ? 'غير جاهز حالياً' : lang === 'fr' ? 'Prochainement' : 'Coming Soon')
                                            : T.select}
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>

                    <div className="mt-12 text-center text-slate-500 text-sm font-medium">
                        {T.alreadyMember} <Link href="/login" className="text-blue-600 font-black hover:underline">{T.loginLink}</Link>
                    </div>
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
                <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-10 md:p-12 relative">
                    <button 
                        onClick={() => setSelectedPlan(null)}
                        className="absolute top-6 left-6 text-slate-300 hover:text-slate-900 transition-colors"
                    >
                        <ArrowRight size={24} className="rotate-180" />
                    </button>

                    <div className="text-center mb-10 mt-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-6 shadow-sm">
                            {isTrainer ? T.trainerBadge : isExpert ? T.expertBadge : isPro ? T.proBadge : T.studentBadge}
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
                            {isTrainer ? T.trainerTitle : isExpert ? T.expertTitle : isPro ? T.proTitle : T.studentTitle}
                        </h1>
                        <p className="text-slate-500 font-medium">
                            {isTrainer ? T.trainerSub : isExpert ? T.expertSub : isPro ? T.proSub : T.studentSub}
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
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-16 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-500/10 outline-none transition-all font-bold text-slate-900"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={handleCopyPassword}
                                        className={cn(
                                            "p-2 rounded-lg transition-colors",
                                            isCopied ? "text-emerald-500 bg-emerald-50" : "text-slate-400 hover:text-blue-500 hover:bg-slate-100"
                                        )}
                                        title={T.copyBtn}
                                    >
                                        <Copy size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-slate-100 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            <p className="mt-2 ml-1 text-[9px] text-slate-400 font-medium italic">
                                * {T.passwordSafetyNote}
                            </p>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold text-center">
                                {error}
                            </div>
                        )}

                        {/* Trial & Activation Note */}
                        <div className="space-y-3">
                            <div className="bg-emerald-50/50 border border-emerald-200/50 rounded-2xl p-4 flex gap-3 items-center animate-pulse">
                                <Sparkles className="w-5 h-5 text-emerald-500 shrink-0" />
                                <p className="text-[10px] md:text-xs text-emerald-700 font-bold leading-relaxed">
                                    {T.trialNote}
                                </p>
                            </div>
                            <div className="bg-amber-50/50 border border-amber-200/50 rounded-2xl p-4 flex gap-3 items-start">
                                <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                                    <span className="text-amber-600 font-black text-xs">!</span>
                                </div>
                                <p className="text-[10px] md:text-xs text-amber-700 font-bold leading-relaxed">
                                    {T.activationNote}
                                </p>
                            </div>
                        </div>

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
