"use client";

import { motion } from "framer-motion";
import { Shield, CheckCircle2, ArrowRight, User, Mail, Briefcase, ChevronRight, Gavel, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const currencies = [
    { code: "EUR", symbol: "€", rate: 1, name: "Euro" },
    { code: "USD", symbol: "$", rate: 1.08, name: "US Dollar" },
    { code: "MAD", symbol: "DH", rate: 10.85, name: "Moroccan Dirham" },
    { code: "TND", symbol: "DT", rate: 3.35, name: "Tunisian Dinar" },
    { code: "DZD", symbol: "DA", rate: 145.50, name: "Algerian Dinar" },
    { code: "EGP", symbol: "E£", rate: 33.40, name: "Egyptian Pound" },
    { code: "SAR", symbol: "SR", rate: 4.05, name: "Saudi Riyal" },
    { code: "AED", symbol: "DH", rate: 3.97, name: "UAE Dirham" },
    { code: "QAR", symbol: "QR", rate: 3.93, name: "Qatari Riyal" },
    { code: "KWD", symbol: "KD", rate: 0.33, name: "Kuwaiti Dinar" },
    { code: "GBP", symbol: "£", rate: 0.85, name: "British Pound" },
    { code: "CHF", symbol: "CHF", rate: 0.95, name: "Swiss Franc" },
    { code: "CAD", symbol: "C$", rate: 1.46, name: "Canadian Dollar" },
    { code: "AUD", symbol: "A$", rate: 1.65, name: "Australian Dollar" },
    { code: "JPY", symbol: "¥", rate: 161.50, name: "Japanese Yen" },
    { code: "CNY", symbol: "¥", rate: 7.80, name: "Chinese Yuan" },
];

const durations = [
    { label: "1 Mois", months: 1, discount: 0 },
    { label: "3 Mois", months: 3, discount: 0.10 },
    { label: "6 Mois", months: 6, discount: 0.15 },
    { label: "1 An", months: 12, discount: 0.25 },
];

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
    const [selectedDuration, setSelectedDuration] = useState(durations[0]);
    
    // Original price in EUR per month
    const basePricePerMonth = 79;
    
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [whatsapp, setWhatsapp] = useState("");
    const [password, setPassword] = useState("");
    const [plannedPaymentDate, setPlannedPaymentDate] = useState(new Date().toISOString().split('T')[0]);

    // Calculate total price after discount
    const totalPriceEUR = (basePricePerMonth * selectedDuration.months) * (1 - selectedDuration.discount);
    
    // Simulate getting plan from context or URL
    const planInfo = {
        name: "Executive",
        ref: "MATC-2026-EXE-9921"
    };

    const convertedTotalPriceValue = totalPriceEUR * selectedCurrency.rate;
    const convertedTotalPriceDisplay = convertedTotalPriceValue.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!agreed) return;
        
        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    whatsapp,
                    password,
                    mandateDuration: selectedDuration.months,
                    mandateCurrency: selectedCurrency.code,
                    mandateAmount: convertedTotalPriceValue,
                    plannedPaymentDate,
                    mandateAgreed: agreed
                })
            });

            if (res.ok) {
                setIsSubmitted(true);
            } else {
                const data = await res.json();
                alert(data.error || "Une erreur est survenue lors de l'inscription.");
            }
        } catch (error) {
            console.error("Registration error:", error);
            alert("Erreur de connexion au serveur.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col lg:flex-row">
            {/* Left Side: Visual Branding & Plan Summary */}
            <div className="lg:w-1/2 bg-slate-900 p-12 lg:p-24 text-white relative overflow-hidden flex flex-col justify-between">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 p-24 opacity-10 pointer-events-none">
                    <Gavel size={600} />
                </div>
                
                <div className="relative z-10">
                    <Link href="/" className="inline-flex items-center gap-2 mb-16">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-xl shadow-blue-500/20">
                            <Shield size={20} />
                        </div>
                        <span className="font-black text-xs tracking-[0.3em] uppercase">MA-TRAINING</span>
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="max-w-md"
                    >
                        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-8 leading-tight">
                            Soumettre votre <br/>
                            <span className="text-blue-500 underline decoration-blue-500/30 underline-offset-8">Demande de Mandat</span>
                        </h1>
                        <p className="text-slate-400 text-lg font-light leading-relaxed mb-12">
                            Réservez votre place parmi l&apos;élite. Votre demande sera traitée par nos conseillers pour validation finale et activation de vos accès prioritaires.
                        </p>

                        {/* Plan Card Summary */}
                        <div className="bg-white/5 border border-white/10 rounded-4xl p-8 backdrop-blur-sm shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <div className="px-4 py-1.5 bg-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                                    Mandat Signé
                                </div>
                                <span className="text-[10px] text-slate-500 font-mono">ID: {planInfo.ref}</span>
                            </div>
                            
                            <h3 className="text-2xl font-bold mb-2">{planInfo.name}</h3>
                            <div className="text-3xl font-black text-blue-400 mb-2">
                                {convertedTotalPriceDisplay} {selectedCurrency.symbol}
                            </div>
                            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-6">
                                Total pour {selectedDuration.label} 
                                {selectedDuration.discount > 0 && (
                                    <span className="text-emerald-500 ml-2">(-{selectedDuration.discount * 100}% Inclus)</span>
                                )}
                            </div>
                            
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-xs text-slate-400">
                                    <CheckCircle2 size={14} className="text-emerald-500" />
                                    Accès immédiat à la plateforme
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-400">
                                    <CheckCircle2 size={14} className="text-emerald-500" />
                                    Conseiller IA activé
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-400">
                                    <CheckCircle2 size={14} className="text-emerald-500" />
                                    Protection juridique Digitalisa
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="mt-12 text-[10px] font-medium text-slate-500 uppercase tracking-widest flex items-center gap-8 relative z-10">
                    <span>© 2026 DIGITALISA</span>
                    <Link href="/legal" className="hover:text-white transition-colors">Documents Légaux</Link>
                    <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                </div>
            </div>

            {/* Right Side: Registration Form / Success State */}
            <div className="lg:w-1/2 p-8 lg:p-24 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                {!isSubmitted ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-md"
                    >
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Formulaire de Demande</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Veuillez remplir ces informations pour que notre équipe puisse préparer votre contrat et vos accès.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Prénom</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input 
                                            type="text" 
                                            placeholder="Jean" 
                                            className="w-full h-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nom</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input 
                                            type="text" 
                                            placeholder="Dupont" 
                                            className="w-full h-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Addresse Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input 
                                        type="email" 
                                        placeholder="jean.dupont@consulting.fr" 
                                        className="w-full h-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Numéro WhatsApp (avec code pays)</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-400">
                                        <MessageCircle size={16} className="text-emerald-500" />
                                    </div>
                                    <input 
                                        type="tel" 
                                        placeholder="+212 6XX XXX XXX" 
                                        className="w-full h-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium"
                                        value={whatsapp}
                                        onChange={(e) => setWhatsapp(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mot de passe de sécurité (Access Code)</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-400">
                                        <Shield size={16} className="text-blue-500" />
                                    </div>
                                    <input 
                                        type="password" 
                                        placeholder="••••••••" 
                                        className="w-full h-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Duration Selector */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Durée du Mandat (Discount inclus)</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {durations.map((d) => (
                                        <button
                                            key={d.label}
                                            type="button"
                                            onClick={() => setSelectedDuration(d)}
                                            className={`h-12 rounded-xl text-[10px] font-bold transition-all border ${
                                                selectedDuration.months === d.months 
                                                ? "bg-slate-950 dark:bg-white text-white dark:text-black border-transparent shadow-lg" 
                                                : "bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800"
                                            }`}
                                        >
                                            {d.label}
                                            {d.discount > 0 && (
                                                <span className="block text-[8px] text-emerald-500">-{d.discount * 100}%</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Devise de paiement (Currency)</label>
                                <div className="relative">
                                    <select 
                                        value={selectedCurrency.code}
                                        onChange={(e) => {
                                            const curr = currencies.find(c => c.code === e.target.value);
                                            if (curr) setSelectedCurrency(curr);
                                        }}
                                        className="w-full h-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold appearance-none cursor-pointer"
                                    >
                                        {currencies.map(c => (
                                            <option key={c.code} value={c.code}>
                                                {c.code} - {c.name} ({c.symbol})
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <ArrowRight className="rotate-90" size={16} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date prévue du premier règlement</label>
                                <div className="relative">
                                    <input 
                                        type="date"
                                        className="w-full h-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold cursor-pointer text-slate-900 dark:text-white"
                                        value={plannedPaymentDate}
                                        onChange={(e) => setPlannedPaymentDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <p className="text-[9px] text-slate-400 font-medium italic">
                                    * Sélectionnez la date à laquelle vous prévoyez d&apos;effectuer le virement pour activer votre mandat.
                                </p>
                            </div>

                             <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Processus de Validation</label>
                                <div className="p-4 bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/10 rounded-2xl">
                                    <p className="text-[11px] text-blue-800 dark:text-blue-300 font-medium leading-relaxed">
                                        Cette inscription constitue une <span className="font-bold underline text-blue-600">Demande Officielle</span>. Un conseiller vous contactera sous 24h pour valider le règlement et ouvrir vos accès définitifs.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 py-2">
                                <input 
                                    type="checkbox" 
                                    id="agree"
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                    className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    required
                                />
                                <label htmlFor="agree" className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight cursor-pointer">
                                    J&apos;accepte les conditions. Je comprends que le paiement est requis pour l&apos;activation finale du mandat et que je peux tester la plateforme gratuitement en attendant.
                                </label>
                            </div>

                            <div className="pt-2">
                                 <Button 
                                    type="submit"
                                    disabled={isLoading || !agreed}
                                    className="w-full h-14 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-4 group"
                                >
                                    {isLoading ? "Envoi du dossier..." : "Envoyer ma Demande de Mandat"}
                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>

                            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-900 flex items-start gap-4">
                                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                                    <Shield size={18} />
                                </div>
                                <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                                    Accès immédiat à l&apos;interface de base après inscription.
                                </p>
                            </div>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-md text-center"
                    >
                        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-8 shadow-2xl shadow-emerald-500/20">
                            <CheckCircle2 size={48} />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-4">Bienvenue à Bord !</h2>
                         <div className="space-y-6">
                            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm">
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                                    Votre demande de <span className="font-bold text-blue-600">Mandat Exécutif</span> a été transmise avec succès !
                                </p>
                                <div className="h-px bg-slate-100 dark:bg-slate-800 w-12 mx-auto mb-4" />
                                <p className="text-slate-600 dark:text-slate-400 text-xs mb-8">
                                    Un conseiller MA Training Consulting vous contactera sous peu pour finaliser les étapes administratives.
                                </p>

                                <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                                        Envie d&apos;explorer tout de suite ?
                                    </p>
                                    <Button 
                                        onClick={() => window.location.href = '/register'}
                                        className="w-full h-12 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-bold transition-all shadow-lg"
                                    >
                                        Créer un Compte d&apos;Essai Gratuit
                                    </Button>
                                    <p className="text-[9px] text-slate-400 italic">
                                        Note : Utilisez une adresse email différente si vous souhaitez un accès immédiat en mode Free.
                                    </p>
                                </div>
                            </div>
                            
                            <p className="text-[10px] text-slate-500 italic">
                                Note : Les fonctionnalités avancées resteront verrouillées jusqu&apos;à confirmation du règlement.
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

