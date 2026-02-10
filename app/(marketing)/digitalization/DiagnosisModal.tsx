"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ArrowRight, BrainCircuit, Target, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface DiagnosisModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type ChatMessage = {
    role: 'ai' | 'user';
    content: string;
};

export default function DiagnosisModal({ isOpen, onClose }: DiagnosisModalProps) {
    const [step, setStep] = useState<'intro' | 'chat' | 'analyzing' | 'result'>('intro');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial AI Message
    useEffect(() => {
        if (step === 'chat' && messages.length === 0) {
            const timer = setTimeout(() => {
                setMessages([
                    { role: 'ai', content: "مرحباً، أنا مستشارك الاستراتيجي الذكي. سأقوم بتحليل مشروعك بدقة. أخبرني أولاً، ما هو التحدي الرئيسي الذي يواجه مشروعك حالياً؟" }
                ]);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [step, messages.length]);

    // Scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newMessages = [...messages, { role: 'user', content: inputValue } as ChatMessage];
        setMessages(newMessages);
        setInputValue("");

        // Simulate AI Response
        setTimeout(() => {
            if (newMessages.length < 4) {
                const nextQuestion = newMessages.length === 2 
                    ? "فهمت. وما هو هدفك الاستراتيجي للعام القادم؟"
                    : "ممتاز. هل هناك أي عوائق تقنية أو تشغيلية محددة؟";
                setMessages(prev => [...prev, { role: 'ai', content: nextQuestion }]);
            } else {
                setStep('analyzing');
                setTimeout(() => setStep('result'), 3000);
            }
        }, 1000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-4xl shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10 max-h-[90vh] flex flex-col"
            >
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 z-10 p-2 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                >
                    <X className="w-5 h-5 text-slate-500" />
                </button>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <AnimatePresence mode="wait">
                        {step === 'intro' && (
                            <motion.div 
                                key="intro"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-8 md:p-12 text-center flex flex-col items-center justify-center min-h-[500px]"
                            >
                                <div className="w-20 h-20 rounded-3xl bg-blue-600/10 text-blue-600 flex items-center justify-center mb-8">
                                    <BrainCircuit className="w-10 h-10" />
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
                                    نبتكر حلولاً <span className="text-blue-600">استراتيجية</span> لمستقبلك الرقمي
                                </h2>
                                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                                    نحن نقدم حلولاً واستراتيجيات جاهزة، مبنية على أحدث التقنيات. نقدم خدمات متنوعة ننفذها نحن أو شركاؤنا تحت توجيهنا الاستراتيجي. نتولى مشروعك من الصفر ونزودك بكل الخدمات، وكل ذلك مبني على تحليل واستراتيجيات دقيقة.
                                </p>
                                <button 
                                    onClick={() => setStep('chat')}
                                    className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-500/20 transition-all transform hover:scale-105 flex items-center gap-3"
                                >
                                    <Sparkles className="w-5 h-5" />
                                    ابدأ تشخيص مشروعك
                                </button>
                            </motion.div>
                        )}

                        {step === 'chat' && (
                            <motion.div 
                                key="chat"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col h-[600px]"
                            >
                                <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                                        <BrainCircuit className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white">المستشار الاستراتيجي</h3>
                                        <p className="text-xs text-blue-600 font-medium">متصل - تحليل مباشر</p>
                                    </div>
                                </div>
                                
                                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 dark:bg-slate-950/50">
                                    {messages.map((msg, idx) => (
                                        <div key={idx} className={cn("flex gap-3 max-w-[80%]", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}>
                                            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", msg.role === 'ai' ? "bg-blue-600 text-white" : "bg-slate-200 dark:bg-white/10 text-slate-600")}>
                                                {msg.role === 'ai' ? <BrainCircuit className="w-4 h-4" /> : <div className="w-4 h-4 bg-slate-400 rounded-full" />}
                                            </div>
                                            <div className={cn("p-4 rounded-2xl text-sm leading-relaxed", msg.role === 'ai' ? "bg-white dark:bg-white/5 text-slate-700 dark:text-slate-200 shadow-sm rounded-tl-none" : "bg-blue-600 text-white rounded-tr-none")}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>

                                <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-white/5">
                                    <form onSubmit={handleSendMessage} className="flex gap-2">
                                        <input 
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            placeholder="اكتب إجابتك هنا..."
                                            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                                        />
                                        <button 
                                            type="submit"
                                            className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                                        >
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </form>
                                </div>
                            </motion.div>
                        )}

                        {step === 'analyzing' && (
                            <motion.div 
                                key="analyzing"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-[600px] flex flex-col items-center justify-center text-center p-8"
                            >
                                <div className="relative w-24 h-24 mb-8">
                                    <div className="absolute inset-0 border-4 border-slate-100 dark:border-white/5 rounded-full" />
                                    <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
                                    <BrainCircuit className="absolute inset-0 m-auto w-8 h-8 text-blue-600 animate-pulse" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">جاري تحليل البيانات...</h3>
                                <p className="text-slate-500 dark:text-slate-400">يقوم الذكاء الاصطناعي ببناء مصفوفة SWOT الخاصة بمشروعك</p>
                            </motion.div>
                        )}

                        {step === 'result' && (
                            <motion.div 
                                key="result"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-[600px] overflow-y-auto p-8"
                            >
                                <div className="text-center mb-10">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-sm font-bold mb-4">
                                        <ShieldCheck className="w-4 h-4" />
                                        تم اكتمال التشخيص
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">تقرير التحليل الاستراتيجي</h2>
                                    <p className="text-slate-500">تم إنشاء هذا التقرير بناءً على مدخلاتك وتحليل السوق</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 mb-8">
                                    <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10">
                                        <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                            <Zap className="w-5 h-5 text-yellow-500" />
                                            نقاط القوة
                                        </h3>
                                        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                            <li className="flex gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5" />
                                                إمكانية نمو عالية في السوق المستهدف
                                            </li>
                                            <li className="flex gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5" />
                                                أساس تقني قابل للتطوير
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10">
                                        <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                            <Target className="w-5 h-5 text-red-500" />
                                            نقاط الضعف المحتملة
                                        </h3>
                                        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                            <li className="flex gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5" />
                                                الحاجة إلى تحسين استراتيجية التسويق
                                            </li>
                                            <li className="flex gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5" />
                                                تحديات في تخصيص الموارد
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-blue-600 text-white p-8 rounded-2xl text-center">
                                    <h3 className="text-2xl font-bold mb-4">هل تريد تنفيذ هذا المخطط؟</h3>
                                    <p className="text-blue-100 mb-8 max-w-lg mx-auto">نحن مستعدون لاستلام المشروع وتنفيذ الاستراتيجية كاملة معك من اليوم.</p>
                                    <button className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg w-full md:w-auto">
                                        تواصل مع الخبير الآن
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
