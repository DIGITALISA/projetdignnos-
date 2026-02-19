"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
    X, 
    Loader2, 
    CheckCircle2 
} from "lucide-react";
import { useState } from "react";
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
