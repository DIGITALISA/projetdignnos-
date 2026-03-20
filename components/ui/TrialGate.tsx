"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface TrialGateProps {
    /** The module key to check. */
    module: 'ai-path' | 'strategic-resources' | 'ai-experts' | 'strategic-roadmap' | 'resources' | 'strategic-report' | 'performance-scorecard' | 'job-alignment' | 'assessment-results';
    /** Children to render if access is granted */
    children: React.ReactNode;
    /** Display language direction */
    dir?: 'ltr' | 'rtl';
    /** Language code */
    language?: string;
    /** Optional href for the module */
    moduleHref?: string;
    /** Whether to manually mark as accessible/seen */
    manualMark?: boolean;
    /** Called when access is confirmed */
    onAccessGranted?: () => void;
}

const MODULE_NAMES: Record<string, { ar: string; fr: string; en: string; emoji: string }> = {
    'ai-path': { ar: 'مسار الذكاء الاصطناعي التلقائي', fr: 'Parcours IA Automatique', en: 'Automatic AI Path', emoji: '⚡' },
    'strategic-resources': { ar: 'الموارد الاستراتيجية', fr: 'Ressources Stratégiques', en: 'Strategic Resources', emoji: '📚' },
    'ai-experts': { ar: 'خبراء الذكاء الاصطناعي', fr: 'Experts IA', en: 'AI Experts', emoji: '🔥' },
    'strategic-roadmap': { ar: 'خارطة الطريق الاستراتيجية', fr: 'Feuille de Route Stratégique', en: 'Strategic Roadmap', emoji: '🚀' },
    'resources': { ar: 'الموارد', fr: 'Ressources', en: 'Resources', emoji: '📂' },
    'strategic-report': { ar: 'التقرير الاستراتيجي', fr: 'Rapport Stratégique', en: 'Strategic Report', emoji: '📊' },
    'performance-scorecard': { ar: 'بطاقة الأداء المهني', fr: 'Scorecard Performance', en: 'Performance Scorecard', emoji: '📈' },
    'job-alignment': { ar: 'مواءمة المهنة', fr: 'Alignement Métier', en: 'Job Alignment', emoji: '🌍' },
    'assessment-results': { ar: 'نتائج التقييم', fr: 'Résultats de l\'évaluation', en: 'Assessment Results', emoji: '🎯' },
};

export function TrialGate({ module, children, dir = 'ltr', language = 'fr', onAccessGranted }: TrialGateProps) {
    const [status, setStatus] = useState<'loading' | 'allowed' | 'blocked_paid' | 'not_trial'>('loading');

    const isRtl = dir === 'rtl';
    const lang = isRtl ? 'ar' : (language === 'fr' ? 'fr' : 'en');

    const checkAccess = useCallback(async () => {
        await Promise.resolve();
        
        try {
            const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
            const userId = profile.email || profile.fullName;

            if (!userId) {
                setStatus('not_trial');
                return;
            }

            const res = await fetch(`/api/user/trial-gate?userId=${encodeURIComponent(userId)}&module=${module}`);
            const data = await res.json();

            if (data.allowed) {
                setStatus(data.reason === 'not_trial' || data.reason === 'module_not_gated' ? 'not_trial' : 'allowed');
                onAccessGranted?.();
            } else {
                setStatus('blocked_paid');
            }
        } catch (err) {
            console.error("TrialGate check error:", err);
            setStatus('not_trial'); 
        }
    }, [module, onAccessGranted]);

    useEffect(() => {
        let isMounted = true;
        const initAccess = async () => {
            if (!isMounted) return;
            await checkAccess();
        };
        initAccess();
        return () => { isMounted = false; };
    }, [checkAccess]);

    if (status === 'loading') {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-500 text-sm font-medium animate-pulse">
                        {lang === 'ar' ? 'جاري التحقق من الصلاحية...' : lang === 'fr' ? 'Vérification en cours...' : 'Checking access...'}
                    </p>
                </div>
            </div>
        );
    }

    if (status === 'not_trial' || status === 'allowed') {
        return <>{children}</>;
    }

    // BLOCKED - show overlay
    const moduleName = MODULE_NAMES[module] || { ar: module, fr: module, en: module, emoji: '🔒' };

    const texts = {
        ar: {
            trialBadge: 'ديغنوستيك مجاني',
            paidTitle: 'موديل حصري للمشتركين',
            paidDesc: `موديل "${moduleName.ar}" مخصص حصرياً للمشتركين في الخطط المتقدمة. قم بالترقية الآن للوصول إلى كافة المزايا الاستراتيجية ومحاكاة القيادة والذكاء الاصطناعي.`,
            upgrade: 'الترقية وإكمال المسار المهني',
            back: 'العودة للوحة التحكم',
            diagnosticInfo: 'الديغنوستيك متاح مجاناً للجميع',
            diagnosticDesc: 'يمكنك إكمال تحليل السيرة الذاتية والمقابلة والتقرير الاستراتيجي بالكامل بدون قيود.',
        },
        fr: {
            trialBadge: 'Diagnostic Gratuit',
            paidTitle: 'Module Premium Exclusif',
            paidDesc: `Le module "${moduleName.fr}" est réservé aux abonnements premium. Mettez à niveau votre compte pour débloquer le mentor IA, les ressources stratégiques et les outils d'expert.`,
            upgrade: 'Upgrade & Accès Complet',
            back: 'Retour au tableau de bord',
            diagnosticInfo: 'Diagnostic Gratuit pour tous',
            diagnosticDesc: 'L\'audit de CV, l\'entretien et le rapport stratégique sont accessibles sans limites.',
        },
        en: {
            trialBadge: 'Free Diagnostic',
            paidTitle: 'Exclusive Premium Module',
            paidDesc: `The "${moduleName.en}" module is exclusive to premium plans. Upgrade your account now to unlock the AI Mentor, strategic resources, and expert tools.`,
            upgrade: 'Upgrade & Full Access',
            back: 'Back to Dashboard',
            diagnosticInfo: 'Free Diagnostic for Everyone',
            diagnosticDesc: 'CV Audit, Interview, and Strategic Report are fully accessible at no cost.',
        }
    };

    const t = texts[lang as keyof typeof texts];

    return (
        <div className="relative min-h-[calc(100vh-8rem)]" dir={dir}>
            <div className="pointer-events-none select-none blur-sm opacity-30 absolute inset-0 overflow-hidden">
                {children}
            </div>

            <AnimatePresence>
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-white/60 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className={`bg-white rounded-[2.5rem] p-8 md:p-12 max-w-2xl w-full shadow-2xl border border-slate-200 relative overflow-hidden ${isRtl ? 'text-right' : 'text-left'}`}
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/80 rounded-full -mr-32 -mt-32 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-50/80 rounded-full -ml-24 -mb-24 pointer-events-none" />

                        <div className={`flex items-center gap-2 mb-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-200">
                                <Sparkles className="w-3 h-3" />
                                {t.trialBadge}
                            </div>
                        </div>

                        <div className={`relative z-10 flex ${isRtl ? 'flex-row-reverse' : ''} items-start gap-6 mb-8`}>
                            <div className="w-20 h-20 shrink-0 rounded-3xl flex items-center justify-center shadow-xl bg-blue-100">
                                <Lock className="w-10 h-10 text-blue-600" />
                            </div>
                            <div className="flex-1 relative z-10">
                                <div className="text-3xl mb-1">{moduleName.emoji}</div>
                                <h2 className="text-2xl font-black text-slate-900 mb-2">{t.paidTitle}</h2>
                                <p className="text-slate-600 font-medium leading-relaxed text-sm">{t.paidDesc}</p>
                            </div>
                        </div>

                        <div className={`relative z-10 flex items-start gap-3 mb-8 p-6 bg-emerald-50 rounded-2xl border border-emerald-100 ${isRtl ? 'flex-row-reverse' : ''}`}>
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm font-black text-emerald-800 mb-1">{t.diagnosticInfo}</p>
                                <p className="text-xs text-emerald-600 font-medium">{t.diagnosticDesc}</p>
                            </div>
                        </div>

                        <div className={`relative z-10 flex flex-col sm:flex-row gap-4 ${isRtl ? 'sm:flex-row-reverse' : ''}`}>
                            <Link
                                href="/subscription"
                                className={`flex-1 flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 ${isRtl ? 'flex-row-reverse' : ''}`}
                            >
                                {t.upgrade}
                                <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                            </Link>
                            <Link
                                href="/dashboard"
                                className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all"
                            >
                                {t.back}
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </AnimatePresence>
        </div>
    );
}
