"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
    X, 
    Loader2, 
    CheckCircle2 
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface ConsultingInquiryModalProps {
    isOpen: boolean;
    onClose: () => void;
    redirectToDashboard?: boolean;
}

export default function ConsultingInquiryModal({ isOpen, onClose, redirectToDashboard = false }: ConsultingInquiryModalProps) {
    const { language, dir } = useLanguage();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: ''
    });

    const [contactInfo, setContactInfo] = useState({
        whatsapp: '+216 23 351 048',
        email: 'matrainingconsulting@gmail.com'
    });

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await fetch('/api/config/contact');
                const data = await res.json();
                if (data.whatsapp || data.email) {
                    setContactInfo({
                        whatsapp: data.whatsapp || '+216 23 351 048',
                        email: data.email || 'matrainingconsulting@gmail.com'
                    });
                }
            } catch (error) {
                console.error("Failed to fetch contact config", error);
            }
        };
        
        if (isOpen) {
            fetchConfig();
        }
    }, [isOpen]);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const res = await fetch('/api/consulting-inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setSubmitStatus('success');
                setTimeout(() => {
                    setIsSubmitting(false);
                    setSubmitStatus('idle');
                    setFormData({ fullName: '', email: '', phone: '' });
                    onClose();
                    if (redirectToDashboard) {
                        router.push('/dashboard');
                    }
                }, 2000);
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error("Submission error:", error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                    dir={dir}
                >
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative border border-slate-100 dark:border-slate-800"
                    >
                        <button 
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors z-10"
                        >
                            <X size={24} />
                        </button>
                        
                        <div className="p-8 md:p-10">
                            <div className="text-center mb-10">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-500 mb-6 font-black border border-amber-100 dark:border-amber-900/30">
                                    <CheckCircle2 size={32} />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-3">
                                    {language === 'ar' ? 'طلب استشارة استراتيجية' : 'Demande de Protocole'}
                                </h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs mx-auto">
                                    {language === 'ar' 
                                        ? 'املأ الاستمارة وسيتواصل معك أحد كبار مستشارينا.' 
                                        : 'Complétez ce formulaire pour initier votre mandat stratégique.'}
                                </p>
                            </div>

                            <form className="space-y-6" onSubmit={handleFormSubmit}>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ps-1 block">
                                        {language === 'ar' ? 'الاسم الكامل' : 'Nom Complet'}
                                    </label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-amber-500 transition-all text-slate-900 dark:text-white font-medium outline-none" 
                                        placeholder={language === 'ar' ? 'أدخل اسمك الكامل' : 'Votre nom complet'}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ps-1 block">
                                        {language === 'ar' ? 'البريد الإلكتروني' : 'Adresse Email'}
                                    </label>
                                    <input 
                                        type="email" 
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-amber-500 transition-all text-slate-900 dark:text-white font-medium outline-none" 
                                        placeholder="votre@email.com"
                                    />
                                </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800">
                                            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0 shadow-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-widest">
                                                    {language === 'ar' ? 'واتساب' : 'WhatsApp'}
                                                </div>
                                                <div className="text-lg font-bold text-slate-900 dark:text-white" dir="ltr">{contactInfo.whatsapp}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 shrink-0 shadow-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest">
                                                    {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                                                </div>
                                                <div className="text-sm font-bold text-slate-900 dark:text-white">{contactInfo.email}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative flex items-center gap-4 py-2">
                                        <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
                                        <span className="text-[10px] font-black uppercase text-slate-400">OR</span>
                                        <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ps-1 block">
                                            {language === 'ar' ? 'رقم الهاتف' : 'Numéro de Téléphone'}
                                        </label>
                                        <input 
                                            type="tel" 
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-amber-500 transition-all text-slate-900 dark:text-white font-medium outline-none" 
                                            placeholder="+33 6 00 00 00 00"
                                        />
                                    </div>
                                
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting || submitStatus === 'success'}
                                    className={cn(
                                        "w-full py-5 font-black rounded-2xl shadow-xl transition-all text-xs uppercase tracking-[0.2em] mt-4 flex items-center justify-center gap-3 active:scale-95",
                                        submitStatus === 'success' 
                                            ? "bg-emerald-500 text-white" 
                                            : "bg-slate-900 hover:bg-black text-white hover:shadow-slate-900/20"
                                    )}
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="animate-spin w-5 h-5" />
                                    ) : submitStatus === 'success' ? (
                                        <>
                                            <CheckCircle2 size={18} />
                                            {language === 'ar' ? 'تم الإرسال بنجاح' : 'Envoyé avec Succès'}
                                        </>
                                    ) : (
                                        language === 'ar' ? 'إرسال الطلب' : 'Lancer le Mandat'
                                    )}
                                </button>

                                {submitStatus === 'error' && (
                                    <p className="text-red-500 text-[10px] text-center mt-2 font-black uppercase tracking-widest">
                                        {language === 'ar' ? 'حدث خطأ، يرجى المحاولة مرة أخرى.' : 'Une erreur est survenue. Réessayez.'}
                                    </p>
                                )}
                            </form>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-950 px-8 py-6 text-center border-t border-slate-100 dark:border-slate-800/50">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                {language === 'ar' ? 'بياناتك محمية بموجب اتفاقية السرية.' : 'Données protégées par accord de confidentialité (NDA)'}
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
