"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, Zap, ShieldCheck, HeartHandshake, CreditCard } from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";

export default function PricingPage() {
    const { t, dir, language } = useLanguage();
    const p = t.pricing;
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    const monthlyPrice = 30;
    const yearlyPrice = 250; // Updated to be more realistic for "Best Value"
    const savings = Math.round(((monthlyPrice * 12 - yearlyPrice) / (monthlyPrice * 12)) * 100);

    const price = billingCycle === 'monthly' ? monthlyPrice : Math.round(yearlyPrice / 12);
    const totalPrice = billingCycle === 'monthly' ? monthlyPrice : yearlyPrice;

    return (
        <div className={cn(
            "min-h-screen bg-slate-50 selection:bg-blue-100 italic-none",
            language === 'ar' ? 'font-arabic' : 'font-sans'
        )} dir={dir}>
            <Navbar />

            <main className="relative pt-32 pb-24 overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-30">
                    <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-blue-200 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-20 left-0 w-[500px] h-[500px] bg-indigo-200 rounded-full blur-[120px] animate-pulse" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                            <Sparkles className="w-3 h-3 text-blue-400" />
                            {p.badge}
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 tracking-tight mb-6">
                            {p.title.split(',').map((part: string, i: number) => (
                                <span key={i} className={i === 1 ? "text-blue-600 block lg:inline" : ""}>
                                    {part}{i === 0 && ","}
                                </span>
                            ))}
                        </h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                            {p.subtitle}
                        </p>
                    </motion.div>

                    {/* Billing Toggle */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center justify-center gap-6 mb-20"
                    >
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={cn(
                                "text-sm font-black uppercase tracking-widest transition-all",
                                billingCycle === 'monthly' ? "text-slate-900" : "text-slate-400"
                            )}
                        >
                            {p.monthly}
                        </button>

                        <div
                            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                            className="w-16 h-8 bg-slate-200 rounded-full p-1 cursor-pointer relative"
                        >
                            <motion.div
                                animate={{ x: billingCycle === 'monthly' ? 0 : 32 }}
                                className="w-6 h-6 bg-white rounded-full shadow-md border border-slate-200"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setBillingCycle('yearly')}
                                className={cn(
                                    "text-sm font-black uppercase tracking-widest transition-all",
                                    billingCycle === 'yearly' ? "text-slate-900" : "text-slate-400"
                                )}
                            >
                                {p.yearly}
                            </button>
                            <AnimatePresence>
                                {billingCycle === 'yearly' && (
                                    <motion.span
                                        initial={{ opacity: 0, scale: 0.8, x: -10 }}
                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.8, x: -10 }}
                                        className="px-3 py-1 bg-green-500 text-white text-[10px] font-black rounded-full uppercase tracking-tighter"
                                    >
                                        {p.save} {savings}%
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Pricing Card */}
                    <div className="max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="relative"
                        >
                            {/* Card Glow */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[3rem] blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200" />

                            <div className="relative bg-white rounded-[3rem] p-8 lg:p-16 border border-slate-100 shadow-2xl flex flex-col lg:flex-row gap-12 lg:gap-20">
                                {/* Left Side: Price & CTA */}
                                <div className="lg:w-[40%] flex flex-col justify-between">
                                    <div>
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-6">
                                            <Zap size={12} className="fill-current" />
                                            {p.bestValue}
                                        </div>
                                        <h3 className="text-3xl font-bold text-slate-900 mb-8">{p.planTitle}</h3>

                                        <div className="flex items-baseline gap-2 mb-8">
                                            <span className="text-7xl font-black text-slate-900 tracking-tighter">€{price}</span>
                                            <span className="text-xl text-slate-400 font-medium">/{p.month}</span>
                                        </div>

                                        <div className="space-y-4 mb-10">
                                            <div className="flex items-center gap-3 text-slate-600">
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                                                    <CreditCard size={20} className="text-blue-600" />
                                                </div>
                                                <div className="text-sm">
                                                    <p className="font-bold text-slate-900">{billingCycle === 'monthly' ? p.monthly : p.yearly}</p>
                                                    <p className="text-xs">{billingCycle === 'monthly' ? `€${monthlyPrice} billed monthly` : p.saveAnnually.replace('{amount}', (monthlyPrice * 12 - yearlyPrice).toString())}</p>
                                                </div>
                                            </div>
                                            {billingCycle === 'yearly' && (
                                                <p className="text-xs text-green-600 font-bold bg-green-50 px-3 py-2 rounded-lg inline-block">
                                                    {p.effectivePrice.replace('{amount}', Math.round(yearlyPrice / 12).toString())}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Link
                                            href="/auth/register"
                                            className="block w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] text-center hover:bg-black hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-200"
                                        >
                                            {p.cta}
                                        </Link>
                                        <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            <ShieldCheck size={14} className="text-green-500" />
                                            {p.guarantee}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Features */}
                                <div className="lg:w-[60%] lg:border-l lg:border-slate-100 lg:pl-20">
                                    <div className="grid sm:grid-cols-2 gap-y-6 gap-x-12">
                                        {p.features.map((feature: string, i: number) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.3 + (i * 0.05) }}
                                                className="flex items-start gap-4"
                                            >
                                                <div className="mt-1 w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                    <Check size={12} className="text-blue-600 stroke-[3px]" />
                                                </div>
                                                <span className="text-sm font-bold text-slate-700 leading-tight">{feature}</span>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <div className="mt-12 pt-8 border-t border-dashed border-slate-100">
                                        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                                            <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                                                <HeartHandshake className="text-blue-600" size={24} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-slate-900 uppercase tracking-widest mb-1">{p.faqTitle}</p>
                                                <p className="text-xs text-slate-500">{p.faqSubtitle}</p>
                                            </div>
                                            <Link href="mailto:support@careerupgrade.ai" className="ml-auto text-xs font-black text-blue-600 uppercase tracking-tighter hover:underline">
                                                {p.contactSupport}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Trust Badges */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-20 flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500"
                    >
                        {/* Placeholder for partner logos */}
                        <div className="text-xl font-black tracking-tighter text-slate-400">ISO 9001</div>
                        <div className="text-xl font-black tracking-tighter text-slate-400">QHSE GLOBAL</div>
                        <div className="text-xl font-black tracking-tighter text-slate-400">SAFETY FIRST</div>
                        <div className="text-xl font-black tracking-tighter text-slate-400">ECOCERT</div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
