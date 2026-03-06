"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Clock, Sparkles, ArrowRight, CheckCircle2, Timer } from "lucide-react";
import Link from "next/link";

interface TrialInfo {
    startedAt: string;
    expiresAt: string;
    durationHours: number;
    isExpired: boolean;
    moduleUsed: boolean;
    minutesRemaining?: number;
    visitedModules?: string[];
}

interface TrialGateProps {
    /** The module key to check. One of: 'ai-path', 'strategic-resources', 'ai-experts', 'strategic-roadmap', 'resources' */
    module: 'ai-path' | 'strategic-resources' | 'ai-experts' | 'strategic-roadmap' | 'resources' | 'strategic-report' | 'performance-scorecard' | 'job-alignment';
    /** Optional sidebar href to lock when this module is marked as used */
    moduleHref?: string;
    /** If true, the module won't be marked as used automatically after viewing */
    manualMark?: boolean;
    /** Children to render if access is granted */
    children: React.ReactNode;
    /** Display language direction */
    dir?: 'ltr' | 'rtl';
    /** Language code */
    language?: string;
    /** Called when access is confirmed - use this to mark the module as used */
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
};

const ALL_MODULES = ['ai-path', 'strategic-resources', 'ai-experts', 'strategic-roadmap', 'resources', 'strategic-report', 'performance-scorecard', 'job-alignment'];

export function TrialGate({ module, moduleHref, manualMark = false, children, dir = 'ltr', language = 'fr', onAccessGranted }: TrialGateProps) {
    const [status, setStatus] = useState<'loading' | 'allowed' | 'blocked_used' | 'blocked_expired' | 'blocked_paid' | 'not_trial'>('loading');
    const [trialInfo, setTrialInfo] = useState<TrialInfo | null>(null);
    const [marked, setMarked] = useState(false);

    const isRtl = dir === 'rtl';
    const lang = isRtl ? 'ar' : (language === 'fr' ? 'fr' : 'en');

    const checkAccess = useCallback(async () => {
        // Small delay to prevent synchronous state update warning in useEffect
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
                if (data.reason === 'not_trial' || data.reason === 'module_not_gated') {
                    setStatus('not_trial');
                } else {
                    setStatus('allowed');
                    setTrialInfo(data.trialInfo);
                }
            } else {
                if (data.reason === 'trial_expired') {
                    setStatus('blocked_expired');
                } else if (data.reason === 'paid_only') {
                    setStatus('blocked_paid');
                } else {
                    setStatus('blocked_used');
                }
                setTrialInfo(data.trialInfo);
            }
        } catch (err) {
            console.error("TrialGate check error:", err);
            setStatus('not_trial'); // Fail open
        }
    }, [module]);

    const markModuleAsUsed = useCallback(async () => {
        if (marked) return;
        try {
            const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
            const userId = profile.email || profile.fullName;
            if (!userId) return;

            await fetch('/api/user/trial-gate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, module, moduleHref })
            });

            // Update local profile
            const visitedModules = [...(profile.visitedModules || [])];
            if (!visitedModules.includes(module)) {
                visitedModules.push(module);
            }
            if (moduleHref && !visitedModules.includes(moduleHref)) {
                visitedModules.push(moduleHref);
            }
            
            const updatedProfile = { ...profile, visitedModules };
            localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
            
            // Dispatch event to update sidebar
            window.dispatchEvent(new Event("profileUpdated"));
            
            setMarked(true);
            onAccessGranted?.();
        } catch (err) {
            console.error("TrialGate mark error:", err);
        }
    }, [module, moduleHref, marked, onAccessGranted]);

    useEffect(() => {
        let isMounted = true;
        const initAccess = async () => {
            if (!isMounted) return;
            await checkAccess();
        };
        initAccess();
        return () => { isMounted = false; };
    }, [checkAccess]);

    // When access is granted, mark module as used after a short delay
    useEffect(() => {
        if (status === 'allowed' && !marked && !manualMark) {
            const timer = setTimeout(() => {
                markModuleAsUsed();
            }, 2000); // Mark as used after 2 seconds of viewing
            return () => clearTimeout(timer);
        }
    }, [status, marked, manualMark, markModuleAsUsed]);

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

    // Full access (not a trial user, or no restriction)
    if (status === 'not_trial' || status === 'allowed') {
        return <>{children}</>;
    }

    // BLOCKED - show overlay
    const moduleName = MODULE_NAMES[module];
    const visitedModules = trialInfo?.visitedModules || [];
    const usedCount = ALL_MODULES.filter(m => visitedModules.includes(m)).length;

    const texts = {
        ar: {
            trialBadge: 'تجربة مجانية محدودة',
            usedTitle: 'تم استخدام الموديل بالكامل',
            paidTitle: 'موديل حصري للمشتركين',
            expiredTitle: 'انتهت فترة المحاكاة التجريبية',
            usedDesc: `لقد استخدمت موديل "${moduleName.ar}" مرة واحدة. لإكمال بقية مراحل مسارك المهني والوصول إلى كافة الموديلات (المحاكاة، الورش، والتقارير الاستراتيجية)، يرجى ترقية حسابك.`,
            paidDesc: `موديل "${moduleName.ar}" مخصص حصرياً للمشتركين في الخطط المتقدمة. قم بالترقية الآن للوصول إلى كافة التقارير الاستراتيجية ومحاكاة القيادة.`,
            expiredDesc: `انتهت فترة التجربة المجانية (${trialInfo?.durationHours || 3} ساعات). للوصول إلى كامل المراحل والمميزات الحصرية، يرجى الترقية الآن.`,
            modulesUsed: `${usedCount} من ${ALL_MODULES.length} مراحل مكتملة`,
            upgrade: 'الترقية وإكمال المسار المهني',
            contact: 'تواصل للاشتراك',
            oneUseRule: 'نظام التجربة المحدودة',
            oneUseDesc: 'كل مرحلة متاحة مرة واحدة فقط خلال فترة التجربة لضمان عدالة الوصول',
            availableModules: 'المراحل والموديلات المتبقية',
        },
        fr: {
            trialBadge: 'Essai Gratuit Limité',
            usedTitle: 'Module Déjà Visité',
            paidTitle: 'Module Premium Exclusif',
            expiredTitle: 'Session d\'Essai Terminée',
            usedDesc: `Vous avez déjà utilisé le module "${moduleName.fr}". Pour poursuivre les étapes suivantes de votre parcours (Simulations, Workshops, et Rapports Stratégiques), vous devez passer à un abonnement premium.`,
            paidDesc: `Le module "${moduleName.fr}" est réservé aux abonnements premium. Mettez à niveau votre compte pour accéder aux rapports stratégiques et simulations avancées.`,
            expiredDesc: `Votre période d'essai gratuit (${trialInfo?.durationHours || 3}h) est terminée. Mettez à niveau votre compte pour débloquer toutes les fonctionnalités.`,
            modulesUsed: `${usedCount}/${ALL_MODULES.length} étapes validées`,
            upgrade: 'Upgrade & Accès Complet',
            contact: 'Contacter pour s\'inscrire',
            oneUseRule: 'Règle de l\'essai limité',
            oneUseDesc: 'Chaque module n\'est accessible qu\'une seule fois pendant la période d\'essai',
            availableModules: 'Étapes et modules restants',
        },
        en: {
            trialBadge: 'Limited Free Trial',
            usedTitle: 'Module Already Used',
            paidTitle: 'Exclusive Premium Module',
            expiredTitle: 'Trial Session Ended',
            usedDesc: `You've already accessed the "${moduleName.en}" module. To continue with the remaining stages of your career path (Simulations, Workshops, and Strategic Reports), please upgrade your account.`,
            paidDesc: `The "${moduleName.en}" module is exclusive to premium plans. Upgrade your account now to access strategic reports and advanced simulations.`,
            expiredDesc: `Your free trial period (${trialInfo?.durationHours || 3}h) has ended. Upgrade your account now to unlock all premium features and stages.`,
            modulesUsed: `${usedCount}/${ALL_MODULES.length} stages completed`,
            upgrade: 'Upgrade & Full Access',
            contact: 'Contact to Subscribe',
            oneUseRule: 'Trial Limit Protocol',
            oneUseDesc: 'Each module is accessible only once during the trial period',
            availableModules: 'Remaining Stages & Modules',
        }
    };

    const t = texts[lang as keyof typeof texts];
    const isExpired = status === 'blocked_expired';

    return (
        <div className="relative min-h-[calc(100vh-8rem)]" dir={dir}>
            {/* Blurred background content */}
            <div className="pointer-events-none select-none blur-sm opacity-30 absolute inset-0 overflow-hidden">
                {children}
            </div>

            {/* Overlay */}
            <AnimatePresence>
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-white/60 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className={`bg-white rounded-[2.5rem] p-8 md:p-12 max-w-2xl w-full shadow-2xl border border-slate-200 relative overflow-hidden ${isRtl ? 'text-right' : 'text-left'}`}
                    >
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/80 rounded-full -mr-32 -mt-32 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-50/80 rounded-full -ml-24 -mb-24 pointer-events-none" />

                        {/* Trial Badge */}
                        <div className={`flex items-center gap-2 mb-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-200">
                                <Sparkles className="w-3 h-3" />
                                {t.trialBadge}
                            </div>
                            {!isExpired && trialInfo?.minutesRemaining !== undefined && (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-[10px] font-black border border-amber-200">
                                    <Timer className="w-3 h-3" />
                                    {trialInfo.minutesRemaining}min
                                </div>
                            )}
                        </div>

                        {/* Lock Icon */}
                        <div className={`relative z-10 flex ${isRtl ? 'flex-row-reverse' : ''} items-start gap-6 mb-8`}>
                            <div className={`w-20 h-20 shrink-0 rounded-3xl flex items-center justify-center shadow-xl ${
                                status === 'blocked_expired' ? 'bg-red-100' : 
                                status === 'blocked_paid' ? 'bg-blue-100' : 'bg-amber-100'}`}>
                                {status === 'blocked_expired' 
                                    ? <Clock className="w-10 h-10 text-red-600" />
                                    : <Lock className={`w-10 h-10 ${status === 'blocked_paid' ? 'text-blue-600' : 'text-amber-600'}`} />
                                }
                            </div>
                            <div className="flex-1 relative z-10">
                                <div className="text-3xl mb-1">{moduleName.emoji}</div>
                                <h2 className="text-2xl font-black text-slate-900 mb-2">
                                    {status === 'blocked_expired' 
                                        ? t.expiredTitle 
                                        : status === 'blocked_paid' 
                                            ? t.paidTitle 
                                            : t.usedTitle}
                                </h2>
                                <p className="text-slate-600 font-medium leading-relaxed text-sm">
                                    {status === 'blocked_expired' 
                                        ? t.expiredDesc 
                                        : status === 'blocked_paid' 
                                            ? t.paidDesc 
                                            : t.usedDesc}
                                </p>
                            </div>
                        </div>

                        {/* Module Progress */}
                        <div className="relative z-10 mb-8 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <div className={`flex items-center justify-between mb-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    {t.availableModules}
                                </p>
                                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                    {t.modulesUsed}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {ALL_MODULES.map((m) => {
                                    const info = MODULE_NAMES[m];
                                    const isUsed = visitedModules.includes(m);
                                    const isCurrent = m === module;
                                    return (
                                        <div
                                            key={m}
                                            className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                                                isCurrent 
                                                    ? 'border-amber-200 bg-amber-50' 
                                                    : isUsed 
                                                        ? 'border-emerald-100 bg-emerald-50' 
                                                        : 'border-slate-200 bg-white'
                                            } ${isRtl ? 'flex-row-reverse' : ''}`}
                                        >
                                            <span className="text-base">{info.emoji}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-[10px] font-black uppercase tracking-wide truncate ${
                                                    isCurrent ? 'text-amber-700' : isUsed ? 'text-emerald-700' : 'text-slate-400'
                                                }`}>
                                                    {info[lang as keyof typeof info]}
                                                </p>
                                            </div>
                                            {isUsed && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                                            {!isUsed && !isCurrent && (
                                                <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
                                            )}
                                            {isCurrent && <Lock className="w-4 h-4 text-amber-500 shrink-0" />}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Rule Info */}
                        <div className={`relative z-10 flex items-start gap-3 mb-8 p-4 bg-blue-50 rounded-2xl border border-blue-100 ${isRtl ? 'flex-row-reverse' : ''}`}>
                            <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-xs font-black text-blue-800 mb-1">{t.oneUseRule}</p>
                                <p className="text-[10px] text-blue-600 font-medium">{t.oneUseDesc}</p>
                            </div>
                        </div>

                        {/* CTA Buttons */}
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
                                {lang === 'ar' ? 'العودة للوحة التحكم' : lang === 'fr' ? 'Retour au tableau de bord' : 'Back to Dashboard'}
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </AnimatePresence>
        </div>
    );
}
