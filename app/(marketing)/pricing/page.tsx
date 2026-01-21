"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Zap } from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import Link from "next/link";

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    const monthlyPrice = 30;
    const yearlyPrice = 50;
    const savings = Math.round(((monthlyPrice * 12 - yearlyPrice) / (monthlyPrice * 12)) * 100);

    const features = [
        "Unlimited CV Analysis with AI",
        "Unlimited Interview Sessions",
        "Advanced Role Simulations",
        "Full Training Hub Access",
        "Complete Digital Library",
        "Expert AI Consultation",
        "Career Strategy Reports",
        "Psychometric Assessments",
        "Priority Support 24/7",
        "Personalized Learning Paths",
        "Certificate of Completion",
        "Lifetime Updates",
    ];

    const price = billingCycle === 'monthly' ? monthlyPrice : yearlyPrice;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            <Navbar />

            <main className="container mx-auto px-4 pt-32 pb-16">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold mb-6">
                        <Sparkles className="w-4 h-4" />
                        All-Inclusive Plan
                    </div>
                    <h1 className="text-6xl font-bold text-slate-900 mb-4">
                        One Plan, Everything Included
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Get full access to all features and accelerate your career growth
                    </p>
                </motion.div>

                {/* Billing Toggle */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center justify-center gap-4 mb-16"
                >
                    <span className={`text-lg font-semibold ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-500'}`}>
                        Monthly
                    </span>
                    <button
                        onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                        className="relative w-20 h-10 bg-slate-200 rounded-full transition-colors hover:bg-slate-300"
                    >
                        <motion.div
                            layout
                            className="absolute top-1 w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg"
                            animate={{ left: billingCycle === 'monthly' ? 4 : 44 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                    </button>
                    <span className={`text-lg font-semibold ${billingCycle === 'yearly' ? 'text-slate-900' : 'text-slate-500'}`}>
                        Yearly
                    </span>
                    {billingCycle === 'yearly' && (
                        <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold shadow-md"
                        >
                            🎉 Save {savings}%
                        </motion.span>
                    )}
                </motion.div>

                {/* Pricing Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="relative bg-white rounded-3xl border-2 border-purple-500 p-12 shadow-2xl shadow-purple-500/30">
                        {/* Popular Badge */}
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                            <Zap className="w-4 h-4" />
                            Best Value
                        </div>

                        {/* Price */}
                        <div className="text-center mb-10">
                            <h3 className="text-3xl font-bold text-slate-900 mb-4">Complete Access</h3>

                            <div className="mb-4">
                                <span className="text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    €{price}
                                </span>
                                <span className="text-2xl text-slate-500 ml-3">
                                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                                </span>
                            </div>

                            {billingCycle === 'yearly' && (
                                <div className="space-y-2">
                                    <p className="text-lg text-green-600 font-semibold">
                                        💰 Save €{monthlyPrice * 12 - yearlyPrice} annually
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        That's only €{Math.round(yearlyPrice / 12)}/month when billed yearly
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Features */}
                        <div className="grid md:grid-cols-2 gap-4 mb-10">
                            {features.map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + idx * 0.05 }}
                                    className="flex items-start gap-3"
                                >
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Check className="w-4 h-4 text-green-600" />
                                    </div>
                                    <span className="text-slate-700 font-medium">{feature}</span>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <Link
                            href="/login"
                            className="block w-full py-5 rounded-2xl font-bold text-lg text-center text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl shadow-purple-500/40 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                        >
                            Start Your Journey Now
                        </Link>

                        {/* Money Back Guarantee */}
                        <p className="text-center text-sm text-slate-500 mt-6">
                            ✨ 30-day money-back guarantee • Cancel anytime
                        </p>
                    </div>
                </motion.div>

                {/* FAQ Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-24 text-center"
                >
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">
                        Questions?
                    </h2>
                    <p className="text-slate-600 mb-8">
                        Our team is here to help you succeed
                    </p>
                    <Link
                        href="/login"
                        className="inline-block px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-all shadow-lg"
                    >
                        Contact Support
                    </Link>
                </motion.div>
            </main>
        </div>
    );
}
