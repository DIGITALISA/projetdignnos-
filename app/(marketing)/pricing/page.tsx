"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Zap, ShieldCheck, HeartHandshake, Crown, Clock, ArrowRight, Shield } from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";

export default function PricingPage() {
    const { t, dir, language } = useLanguage();
    const p = t.pricing;

    const tiers = [
        {
            key: 'explorer',
            icon: Clock,
            color: "slate",
            data: p.tiers.explorer
        },
        {
            key: 'professional',
            icon: Shield,
            color: "slate",
            data: p.tiers.professional
        },
        {
            key: 'executive',
            icon: Zap,
            color: "blue",
            popular: true,
            data: p.tiers.executive
        },
        {
            key: 'elite',
            icon: Crown,
            color: "amber",
            data: p.tiers.elite
        }
    ];

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
                        className="text-center mb-20"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                            <Sparkles className="w-3 h-3 text-blue-400" />
                            {p.badge}
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 tracking-tight mb-6">
                            {p.title}
                        </h1>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
                            {p.subtitle}
                        </p>
                    </motion.div>

                    {/* Plans Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto items-stretch">
                        {tiers.map((tier, idx) => (
                            <motion.div
                                key={tier.key}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={cn(
                                    "relative bg-white rounded-[3rem] p-10 flex flex-col border transition-all duration-500 hover:shadow-2xl group",
                                    tier.popular ? "border-blue-500 shadow-xl shadow-blue-500/10 ring-4 ring-blue-50" : "border-slate-100 shadow-lg shadow-slate-200/50"
                                )}
                            >
                                {tier.popular && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                        RECOMMANDÉ
                                    </div>
                                )}

                                <div className="mb-8">
                                    <div className={cn(
                                        "w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-inner transition-transform group-hover:scale-110 duration-500",
                                        tier.color === 'blue' ? "bg-blue-50 text-blue-600" :
                                            tier.color === 'amber' ? "bg-amber-50 text-amber-600" :
                                                "bg-slate-50 text-slate-600"
                                    )}>
                                        <tier.icon size={32} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">
                                        {tier.data.badge}
                                    </span>
                                    <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">{tier.data.name}</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-5xl font-black text-slate-900 tracking-tighter">{tier.data.price}</span>
                                        <span className="text-slate-400 font-bold text-sm tracking-tight">{tier.data.duration}</span>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-12 flex-1">
                                    {tier.data.features.map((feature: string, fIdx: number) => (
                                        <div key={fIdx} className="flex items-start gap-4">
                                            <div className={cn(
                                                "w-5 h-5 rounded-full flex items-center justify-center mt-0.5 shrink-0",
                                                tier.color === 'blue' ? "bg-blue-100 text-blue-600" :
                                                    tier.color === 'amber' ? "bg-amber-100 text-amber-600" :
                                                        "bg-slate-100 text-slate-600"
                                            )}>
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                            <span className="text-sm font-bold text-slate-600 tracking-tight leading-snug">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Link
                                    href="/auth/register"
                                    className={cn(
                                        "w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl",
                                        tier.color === 'blue' ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20" :
                                            tier.color === 'amber' ? "bg-slate-900 hover:bg-black text-white shadow-slate-900/20" :
                                                "bg-white border-2 border-slate-100 text-slate-900 hover:bg-slate-50"
                                    )}
                                >
                                    {p.cta}
                                    <ArrowRight size={18} />
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Footer Info */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="mt-24 pt-12 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-12 opacity-80"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                                <ShieldCheck className="text-green-500" size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-900 uppercase tracking-widest mb-1">{p.guarantee}</p>
                                <p className="text-xs text-slate-500 font-medium">ID: SECURE-PROTO-2026</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <Link href="mailto:advisor@careerupgrade.ai" className="flex items-center gap-3 group">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <HeartHandshake size={18} />
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-widest text-slate-600 group-hover:text-blue-600 transition-colors">
                                    {p.contact}
                                </span>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
