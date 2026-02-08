"use client";

import { motion } from "framer-motion";
import { ArrowRight, User, Mail, Phone, Loader2, CheckCircle2, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function RegisterPage() {
    const { t, dir } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        whatsapp: "",
        password: ""
    });
    const [error, setError] = useState<string | null>(null);

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
                setError(data.error || "Une erreur est survenue");
            }
        } catch (err) {
            console.error("Registration error:", err);
            setError("Erreur système. Veuillez réessayer.");
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
                    <h2 className="text-2xl font-black text-slate-900 mb-4 opacity-90">Demande Envoyée</h2>
                    <p className="text-slate-500 font-medium leading-relaxed mb-8">
                        {dir === 'rtl'
                            ? "سنتثبت من معطياتك إن كانت صحيحة لنرسل لك رسالة على الواتساب والبريد الإلكتروني. يجب عليك تأكيدهما للبدء."
                            : "Nous vérifierons vos informations. Si elles sont correctes, nous vous enverrons un message sur WhatsApp et par e-mail. Vous devrez confirmer pour commencer."
                        }
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline"
                    >
                        Retour à la connexion <ArrowRight size={16} />
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
                        <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Inscription Gratuite</h1>
                        <p className="text-slate-500 font-medium">Rejoignez l'élite et profitez d'un accès d'essai</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Prénom</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Prénom"
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-500/10 outline-none transition-all font-bold text-slate-900"
                                        required
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Nom</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Nom"
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-500/10 outline-none transition-all font-bold text-slate-900"
                                        required
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Email Professionnel</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                                <input
                                    type="email"
                                    placeholder="nom@exemple.com"
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-500/10 outline-none transition-all font-bold text-slate-900"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Numéro WhatsApp</label>
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
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Code d'Accès Souhaité</label>
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
                                    S'inscrire Maintenant
                                    <ArrowRight size={20} className={dir === 'rtl' ? 'rotate-180' : ''} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-slate-50 text-center">
                        <p className="text-slate-500 text-sm">
                            Déjà membre ? <Link href="/login" className="text-blue-600 font-bold hover:underline">Se connecter</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
