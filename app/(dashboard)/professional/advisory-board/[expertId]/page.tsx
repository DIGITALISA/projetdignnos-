"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Send,
    ArrowLeft,
    Loader2,
    Briefcase,
    Megaphone,
    Cpu,
    ChessKnight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import ReactMarkdown from "react-markdown";

interface ExpertProfile {
    id: string;
    icon: React.ElementType;
    title: { ar: string; en: string; fr: string };
    role: { ar: string; en: string; fr: string };
    color: string;
    bgColor: string;
    greeting: { ar: string; en: string; fr: string };
}

const expertsData: ExpertProfile[] = [
    {
        id: "hr",
        icon: Briefcase,
        title: { ar: "د. سالم", en: "Dr. Salem", fr: "Dr. Salem" },
        role: { ar: "خبير الموارد ومسارات العمل", en: "HR & Career Strategist", fr: "Stratège RH & Carrière" },
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
        greeting: {
            ar: "أهلاً بك، أنا د. سالم. لقد اطلعت على تشخيصك المهني الكامل... كيف يمكنني توجيه مسارك اليوم؟ هل تفكر في استقالة، أو ترقية، أو ربما تغيير مسارك بالكامل؟",
            en: "Welcome, I am Dr. Salem. I have reviewed your full professional diagnosis... How can I guide your path today? Are you considering resigning, seeking a promotion, or perhaps a complete career pivot?",
            fr: "Bienvenue, je suis le Dr. Salem. J'ai examiné l'intégralité de votre diagnostic professionnel... Comment puis-je guider votre parcours aujourd'hui ?"
        }
    },
    {
        id: "branding",
        icon: Megaphone,
        title: { ar: "أ. ندى", en: "Ms. Nada", fr: "Mme. Nada" },
        role: { ar: "خبيرة التسويق الذاتي وبناء الهوية", en: "Personal Branding Expert", fr: "Experte en Personal Branding" },
        color: "text-rose-400",
        bgColor: "bg-rose-500/10",
        greeting: {
            ar: "أهلاً! أنا ندى. هويتك المهنية هي رأس مالك الحقيقي. قراءة تشخيصك كشفت لي الكثير... جاهز لنبني استراتيجية تزيد من قيمتك السوقية وتبرز مهاراتك بشكل لا يُقاوم؟",
            en: "Hello! I'm Nada. Your professional brand is your true capital. Reading your diagnosis revealed a lot... ready to build a strategy that skyrockets your market value?",
            fr: "Bonjour ! Je suis Nada. Votre marque professionnelle est votre véritable capital. Prêt à construire une stratégie pour exploser votre valeur sur le marché ?"
        }
    },
    {
        id: "technical",
        icon: Cpu,
        title: { ar: "م. طارق", en: "Eng. Tarek", fr: "Ing. Tarek" },
        role: { ar: "المستشار المعرفي والتقني", en: "Technical & Domain Mentor", fr: "Mentor Technique et Domaine" },
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/10",
        greeting: {
            ar: "مرحباً يا بطل! أنا طارق. أنا هنا لأفكك لك أي تعقيد تقني أو منهجي قد يقف في طريق تطبيقك لما ورد في تشخيصك المهني. ما هو المفهوم الذي تريد إتقانه اليوم؟",
            en: "Welcome champion! I'm Tarek. I'm here to demystify any technical or methodological complexity outlined in your diagnosis. What concept do you want to master today?",
            fr: "Bienvenue champion ! Je suis Tarek. Je suis là pour démystifier toute complexité technique. Quel concept souhaitez-vous maîtriser aujourd'hui ?"
        }
    },
    {
        id: "strategic",
        icon: ChessKnight,
        title: { ar: "د. عمر", en: "Dr. Omar", fr: "Dr. Omar" },
        role: { ar: "الخبير الاستراتيجي التنفيذي", en: "Executive Strategy Solver", fr: "Stratège Exécutif" },
        color: "text-amber-400",
        bgColor: "bg-amber-500/10",
        greeting: {
            ar: "النجاح ليس صدفة، بل خطة. أنا د. عمر. قرأت نقاط الضعف والفجوات الاستراتيجية في ملفك. اطرح مشكلتك، لنسألك، ثم نضع خطة عمل جراحية لحلها فوراً.",
            en: "Success is not an accident; it's a plan. I'm Dr. Omar. I've read the gaps in your profile. Present your problem so we dissect it and build a surgical action plan.",
            fr: "Le succès n'est pas un hasard, c'est un plan. Je suis le Dr. Omar. Présentez votre problème pour que nous l'analysions et élaborions un plan d'action chirurgical."
        }
    }
];

interface Message {
    role: "assistant" | "user";
    content: string;
}

export default function ExpertChatStudio() {
    const params = useParams();
    const router = useRouter();
    const { language, dir } = useLanguage();
    const isRtl = dir === 'rtl';
    const lang = language as 'ar' | 'en' | 'fr';

    const expertId = params?.expertId as string;
    const expert = expertsData.find(e => e.id === expertId);

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (expert && messages.length === 0) {
            setMessages([{ role: "assistant", content: expert.greeting[lang] }]);
        }
    }, [expert, lang, messages.length]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    if (!expert) {
        return (
            <div className="flex-1 min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Studio...</p>
            </div>
        );
    }

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const trimmed = input.trim();
        if (!trimmed || loading) return;

        const newUserMessage: Message = { role: "user", content: trimmed };
        setMessages(prev => [...prev, newUserMessage]);
        setInput("");
        setLoading(true);

        try {
            const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
            const email = userProfile.email || userProfile.fullName;

            // Prepare API messages history
            const history = [...messages, newUserMessage].map(m => ({ role: m.role, content: m.content }));

            const response = await fetch(`/api/professional/advisory-board/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, expertId, language: lang, messages: history })
            });

            const data = await response.json();
            if (data.success) {
                setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
            } else {
                setMessages(prev => [...prev, { role: "assistant", content: "Error: " + (data.error || "Failed to load advice.") }]);
            }
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: "assistant", content: "A network error occurred." }]);
        } finally {
            setLoading(false);
        }
    };

    const trans = {
        ar: { back: "إلى مجلس الخبراء", placeholder: "اكتب رسالتك للخبير هنا...", online: "متصل وحلل تشخيصك" },
        en: { back: "Back to Board", placeholder: "Type your message to the expert here...", online: "Online & Context Ready" },
        fr: { back: "Retour au Comité", placeholder: "Tapez votre message ici...", online: "En ligne & Contexte Prêt" },
    }[lang];

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50 md:h-[calc(100vh)]">
            {/* Header */}
            <header className={cn(
                "flex-none h-24 bg-slate-950 border-b border-indigo-900/50 flex items-center justify-between px-6 md:px-10 z-10 shadow-lg shadow-indigo-900/10",
                isRtl && "flex-row-reverse"
            )}>
                <button
                    onClick={() => router.push('/professional/advisory-board')}
                    className={cn(
                        "flex items-center gap-2 text-slate-400 hover:text-white transition-colors uppercase tracking-widest text-[10px] font-black",
                        isRtl && "flex-row-reverse"
                    )}
                >
                    <ArrowLeft size={16} className={cn(isRtl && "rotate-180")} />
                    {trans.back}
                </button>

                <div className={cn("flex items-center gap-4", isRtl && "flex-row-reverse")}>
                    <div className={cn("hidden md:block text-right", isRtl && "text-left")}>
                        <h2 className="text-white font-black text-lg leading-tight">{expert.title[lang]}</h2>
                        <div className="flex items-center gap-1.5 justify-end">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className={cn("text-[9px] font-bold tracking-widest uppercase", expert.color)}>{trans.online}</span>
                        </div>
                    </div>
                    <div className={cn(`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl ${expert.bgColor} border border-white/5`)}>
                        <expert.icon className={cn("w-7 h-7", expert.color)} />
                    </div>
                </div>
            </header>

            {/* Chat Area */}
            <main className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 bg-slate-50" dir={dir}>
                <AnimatePresence>
                    {messages.map((msg, i) => {
                        const isAssistant = msg.role === "assistant";
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn(
                                    "flex w-full gap-4 max-w-4xl mx-auto",
                                    !isAssistant && (isRtl ? "flex-row-reverse" : "flex-row-reverse text-right")
                                )}
                            >
                                {isAssistant && (
                                    <div className={cn(
                                        `w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center text-white shadow-md ${expert.bgColor} border border-white/5`,
                                        isRtl && "ml-4"
                                    )}>
                                        <expert.icon className={cn("w-5 h-5", expert.color)} />
                                    </div>
                                )}
                                <div className={cn(
                                    "px-6 py-4 rounded-3xl shadow-sm border",
                                    isAssistant 
                                        ? "bg-white border-slate-200 text-slate-700 rtl:rounded-tr-sm ltr:rounded-tl-sm prose prose-slate"
                                        : "bg-slate-900 border-slate-800 text-white rtl:rounded-tl-sm ltr:rounded-tr-sm prose prose-invert"
                                )}>
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </div>
                            </motion.div>
                        );
                    })}
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={cn("flex w-full max-w-4xl mx-auto gap-4", isRtl && "flex-row-reverse")}
                        >
                            <div className={cn(`w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center text-white shadow-md ${expert.bgColor} border border-white/5`)}>
                                <expert.icon className={cn("w-5 h-5", expert.color)} />
                            </div>
                            <div className="px-6 py-4 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center gap-2">
                                <span className={cn("w-2 h-2 rounded-full bg-slate-300 animate-bounce", expert.color)} style={{ animationDelay: '0ms' }} />
                                <span className={cn("w-2 h-2 rounded-full bg-slate-300 animate-bounce", expert.color)} style={{ animationDelay: '150ms' }} />
                                <span className={cn("w-2 h-2 rounded-full bg-slate-300 animate-bounce", expert.color)} style={{ animationDelay: '300ms' }} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </main>

            {/* Input Area */}
            <div className="flex-none p-6 md:p-8 bg-white border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] z-10" dir={dir}>
                <div className="max-w-4xl mx-auto">
                    <form onSubmit={handleSendMessage} className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={trans.placeholder}
                            disabled={loading}
                            className={cn(
                                "w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-3xl px-8 py-5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium placeholder:text-slate-400 shadow-inner",
                                isRtl && "text-right"
                            )}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || loading}
                            className={cn(
                                "absolute w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:scale-95 active:scale-90 shadow-[0_0_20px_rgba(99,102,241,0.3)]",
                                isRtl ? "left-3" : "right-3"
                            )}
                        >
                            <Send size={18} className={cn(isRtl && "rotate-180", "translate-x-0.5")} />
                        </button>
                    </form>
                    <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4">
                        AI Advice depends on your submitted diagnostic profile.
                    </p>
                </div>
            </div>
        </div>
    );
}
