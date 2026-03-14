"use client";

import { motion } from "framer-motion";
import { Check, Shield, ArrowRight, Star, Globe, MessageSquare, Briefcase, Sparkles, PenTool, ChevronRight, Loader2, Download, Target, Award, TrendingUp, FileText } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../../lib/utils";
import ConsultingInquiryModal from "../../../components/modals/ConsultingInquiryModal";
import { useLanguage } from "../../../components/providers/LanguageProvider";
import ReactMarkdown from "react-markdown";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface Feature {
    title: string;
    status: string;
    desc: string;
    icon: string;
}

interface LocalContent {
    methodologyTitle: string;
    methodologySubtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    activationNote: string;
    enrollmentOptions: string;
    option1: string;
    option2: string;
    contactCTA: string;
    contractTitle: string;
    contractSubtitle: string;
    signToBegin: string;
    countryAr: string;
    addressAr: string;
    aiFeaturesTitle: string;
    aiFeaturesSubtitle: string;
    features: Feature[];
}

export default function SubscriptionPage() {
    const { t, dir, language } = useLanguage();
    const isRtl = dir === 'rtl';
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSigned, setIsSigned] = useState(false);
    const contractRef = useRef<HTMLDivElement>(null);
    
    // Form State for Contract
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        country: "",
        address: "",
        signature: "",
        agreed: false
    });

    const [mandateId] = useState(() => `MND-${Math.floor(Math.random() * 10000)}`);
    const [secureHash] = useState(() => Math.random().toString(36).substring(7));
    const [currentDate] = useState(() => new Date().toLocaleDateString());

    useEffect(() => {
        const saved = localStorage.getItem("userProfile");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Wrap in setTimeout to avoid synchronous setState in effect warning
                // and ensure hydration completes first.
                setTimeout(() => {
                    setFormData(prev => ({
                        ...prev,
                        firstName: parsed.firstName || prev.firstName,
                        lastName: parsed.lastName || prev.lastName,
                        email: parsed.email || prev.email,
                    }));
                }, 0);
            } catch (e) {
                console.error("Error parsing user profile", e);
            }
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleContractSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.agreed || !formData.signature) return;
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        setIsSigned(true);
    };

    const generatePDF = async () => {
        if (!contractRef.current) return;

        const canvas = await html2canvas(contractRef.current, {
            scale: 2,
            backgroundColor: "#ffffff"
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Strategic_Mandate_${formData.lastName}.pdf`);
    };



    const contentData: Record<string, LocalContent> = {
        en: {
            methodologyTitle: "Strategic Career Activation Methodology",
            methodologySubtitle: "Transforming your diagnostic results into a professional success story",
            step1Title: "1. Expert Diagnostic Analysis",
            step1Desc: "Our experts begin the strategic analysis immediately once you contact us, studying all your diagnostic and simulation reports to decode your 'Professional DNA'.",
            step2Title: "2. Progressive Executive Workshops",
            step2Desc: "Customized workshops (max 5 people) tailored to your weaknesses, aimed at elevating your level through 2-3 structured training stages.",
            step3Title: "3. PRO Role Simulation & Coaching",
            step3Desc: "Realistic role-play with an expert acting as client or manager, providing step-by-step coaching in a simulated professional environment.",
            activationNote: "All PRO modules are activated and in-depth analysis begins as soon as you connect with the team. While groups are forming, you get immediate access to AI-powered consultations and strategic educational resources (courses, documents, and theoretical training).",
            enrollmentOptions: "Professional Activation Options",
            option1: "Full Individual Mandate: Immediate access to personalized workshops and one-on-one role simulations with our experts.",
            option2: "Filtered Group Activation: Participate in workshops with peers who share similar needs (cost-effective with a short wait to form the group).",
            contactCTA: "Connect with Experts to Activate PRO",
            contractTitle: "Strategic Service Mandate",
            contractSubtitle: "Commitment to Professional Excellence",
            signToBegin: "Sign Digital Mandate to Proceed",
            countryAr: "Country",
            addressAr: "City / Region",
            aiFeaturesTitle: "Premium AI Career Features",
            aiFeaturesSubtitle: "Advanced modules powered by deep intelligence to accelerate your growth",
            features: [
                { title: "AI Career Diagnostic", status: "PRO", desc: "Deep analysis of personality, EQ, and technical skills to decode your professional DNA.", icon: "Target" },
                { title: "AI Mentor & Learning Path", status: "PRO", desc: "Personalized learning modules and active simulation exercises tailored to your gaps.", icon: "Sparkles" },
                { title: "Strategic Academy", status: "PRO", desc: "Expert-level slide decks and executive insights generated to build your strategic mindset.", icon: "Award" },
                { title: "AI Career Roadmap", status: "PRO", desc: "A sequential 15-milestone journey mapping your path to leadership with realistic timelines.", icon: "TrendingUp" },
                { title: "Job Alignment Mastery", status: "PRO", desc: "Strategic company research, MCQ audit, mock interviews, and final suitability reports.", icon: "Briefcase" },
                { title: "AI Strategic Consultants", status: "PRO", desc: "24/7 access to specialized AI experts in HR, Marketing, Legal, and Digital strategy.", icon: "MessageSquare" },
                { title: "SCI Strategic Report", status: "PRO", desc: "Comprehensive PDF advisory document synthesizing your entire career diagnostic and growth plan.", icon: "FileText" }
            ]
        },
        ar: {
            methodologyTitle: "منهجية التفعيل الاستراتيجي للمسار المهني",
            methodologySubtitle: "كيف نحول نتائج تشخيصك إلى قصة نجاح احترافية",
            step1Title: "1. التحليل المعمق من قبل الخبراء",
            step1Desc: "لا يبدأ الخبير التحليل إلا بعد تواصل المشارك معنا مباشرة. عندها فقط يتم تشريح كافة نتائج التشخيص والمحاكاة لتصميم ورشة عمل مطابقة تماماً لاحتياجاتك المهنية.",
            step2Title: "2. الورشات التنفيذية والتدريب المتدرج",
            step2Desc: "ورشات عمل مخصصة (5 أشخاص كحد أقصى) تُصمم بناءً على نقاط قوتك، تهدف للارتقاء بمستواك عبر مراحل تدريبية مدروسة.",
            step3Title: "3. محاكاة الأدوار والكوتشينغ الفردي",
            step3Desc: "محاكاة واقعية (Role Simulation) مع خبير يجسد دور العميل أو المدير، لمواكبتك خطوة بخطوة في بيئة عمل نموذجية.",
            activationNote: "يتم تفعيل وحدات PRO والبدء في التحليل الاستراتيجي المعمق فور تواصلك مع الفريق وإتمام التشخيص المهني. خلال فترة الانتظار لتشكيل المجموعات، نمنحك وصولاً فورياً لاستشارات عبر نماذج ذكاء اصطناعي وموارد تعليمية استراتيجية.",
            enrollmentOptions: "خيارات الانضمام الاحترافي",
            option1: "التفويض الاحترافي الشامل (Full Mandate): وصول كامل وفوري لجميع الورشات الفردية، والمحاكاة المخصصة مع خبراءنا بعد التواصل.",
            option2: "تفعيل المجموعات المصفاة: المشاركة في ورشات عمل مع أقران يشاركونك نفس الأهداف (توفير في التكلفة مع انتظار قصير لتشكيل المجموعة).",
            contactCTA: "تواصل مع الخبراء لتفعيل PRO",
            contractTitle: "تفويض الخدمة الاستراتيجية",
            contractSubtitle: "الالتزام بالتميز المهني",
            signToBegin: "وقع التفويض الرقمي للمتابعة",
            countryAr: "البلد",
            addressAr: "الولاية / المدينة",
            aiFeaturesTitle: "وحدات الذكاء الاصطناعي الاحترافية",
            aiFeaturesSubtitle: "وحدات متطورة مدعومة بنماذج ذكية لتمكين مسارك المهني وتسريعه",
            features: [
                { title: "التشخيص المهني الذكي", status: "PRO", desc: "تحليل معمق للشخصية، الذكاء العاطفي، والقدرات التقنية لتحديد هويتك المهنية الحقيقية.", icon: "Target" },
                { title: "الموجه والمسار التدريبي", status: "PRO", desc: "وحدات تعلم تفاعلية وتمارين محاكاة نشطة مصممة خصيصاً لسد فجواتك المهارية.", icon: "Sparkles" },
                { title: "الأكاديمية الاستراتيجية", status: "PRO", desc: "عروض تقديمية وأفكار استراتيجية تنفيذية لبناء عقلية القيادة والتميز الإداري.", icon: "Award" },
                { title: "خارطة الطريق المهنية", status: "PRO", desc: "رحلة متسلسلة من 15 مرحلة للوصول لهدفك المنشود خلال 3 سنوات بدقة واقعية.", icon: "TrendingUp" },
                { title: "إتقان التوافق الوظيفي", status: "PRO", desc: "البحث الاستراتيجي، اختبارات MCQ، المقابلات التجريبية وتقارير الملاءمة النهائية.", icon: "Briefcase" },
                { title: "الخبراء الاستشاريون الذكيون", status: "PRO", desc: "وصول كامل لخبراء الذكاء الاصطناعي في الموارد البشرية، التسويق، والقانون 24/7.", icon: "MessageSquare" },
                { title: "تقرير SCI الاستراتيجي", status: "PRO", desc: "وثيقة استشارية شاملة بصيغة PDF تلخص رحلتك وتحدد استراتيجية نموك القادمة.", icon: "FileText" }
            ]
        },
        fr: {
            methodologyTitle: "Méthodologie d'Activation Stratégique de Carrière",
            methodologySubtitle: "Transformer vos résultats de diagnostic en une success story professionnelle",
            step1Title: "1. Analyse Approfondie par des Experts",
            step1Desc: "Nos experts débutent l'analyse stratégique dès votre prise de contact, en étudiant tous vos rapports pour décoder votre 'ADN Professionnel'.",
            step2Title: "2. Ateliers Exécutifs & Formation Progressive",
            step2Desc: "Des ateliers sur mesure (max 5 personnes) conçus selon vos forces, visant à élever votre niveau via 2-3 étapes de formation structurées.",
            step3Title: "3. Simulation de Rôle & Coaching Individuel",
            step3Desc: "Simulation réaliste avec un expert incarnant le rôle d'un client ou d'un manager, vous accompagnant pas à pas dans un environnement de travail modèle.",
            activationNote: "Les modules PRO sont activés et l'analyse approfondie commence dès que vous contactez l'équipe. En attendant, profitez d'un accès immédiat aux consultations IA et aux ressources stratégiques.",
            enrollmentOptions: "Options d'Activation Professionnelle",
            option1: "Mandat Professionnel Complet : Accès total et immédiat à tous les ateliers individuels et simulations personnalisées avec nos experts.",
            option2: "Activation par Groupes Filtrés : Participez à des ateliers avec des pairs partageant les mêmes objectifs (coût réduit avec une courte attente).",
            contactCTA: "Contacter l'Équipe pour l'Activation PRO",
            contractTitle: "Mandat de Service Stratégique",
            contractSubtitle: "Engagement envers l'Excellence Professionnelle",
            signToBegin: "Signer le Mandat Numérique pour Procéder",
            countryAr: "Pays",
            addressAr: "Ville / Région",
            aiFeaturesTitle: "Modules IA Premium",
            aiFeaturesSubtitle: "Des outils d'intelligence avancée pour propulser votre ascension professionnelle",
            features: [
                { title: "Diagnostic de Carrière IA", status: "PRO", desc: "Analyse profonde de la personnalité, de l'EQ et des compétences pour décoder votre ADN.", icon: "Target" },
                { title: "Mentor & Parcours IA", status: "PRO", desc: "Modules d'apprentissage personnalisés et simulations actives adaptés à vos besoins.", icon: "Sparkles" },
                { title: "Academy Stratégique", status: "PRO", desc: "Supports visuels et insights exécutifs générés pour cultiver un mindset de leader.", icon: "Award" },
                { title: "Roadmap de Carrière IA", status: "PRO", desc: "Un parcours de 15 étapes vers vos objectifs avec des délais et paliers réalistes.", icon: "TrendingUp" },
                { title: "Mastery Job Alignment", status: "PRO", desc: "Recherche stratégique, audit MCQ, entretiens blancs et rapports de conformité.", icon: "Briefcase" },
                { title: "Consultants IA Stratégiques", status: "PRO", desc: "Accès 24/7 à des experts IA en RH, Marketing, Juridique et Stratégie Digitale.", icon: "MessageSquare" },
                { title: "Rapport Stratégique SCI", status: "PRO", desc: "Document PDF de conseil expert synthétisant votre diagnostic et plan de croissance.", icon: "FileText" }
            ]
        }
    };

    const localContent = contentData[language as 'en' | 'fr' | 'ar'] || contentData['en'];

    return (
        <div className={cn("min-h-screen bg-slate-50/50 pb-20 p-6 md:p-12", language === 'ar' ? 'font-arabic' : 'font-sans')}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-blue-100"
                    >
                        <Star size={14} className="fill-current" />
                        {language === 'ar' ? 'خيارات الانضمام الاحترافي' : language === 'fr' ? "Options d'Adhésion Pro" : "Pro Membership Options"}
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                        {language === 'ar' ? 'ارتقِ بمسارك ' : language === 'fr' ? 'Propulsez votre ' : 'Propel Your '} 
                        <span className="text-blue-600">{language === 'ar' ? 'المهني' : 'Carrière'}</span>
                    </h1>
                    <p className="text-slate-500 font-medium max-w-2xl mx-auto text-lg leading-relaxed">
                        {language === 'ar' ? 'منهجية التفعيل الاستراتيجي للمسار المهني - كيف نحول نتائج تشخيصك إلى قصة نجاح احترافية.' : 
                         language === 'fr' ? 'Votre parcours professionnel est activé selon un protocole stratégique conçu pour décoder votre ADN et réaliser vos ambitions.' : 
                         'Your professional path is activated according to a strategic protocol designed to decode your DNA and achieve your ambitions.'}
                    </p>
                </div>

                {/* Methodology Section */}
                <div className="mb-24 bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
                    <div className="grid lg:grid-cols-12">
                        <div className="lg:col-span-5 bg-slate-900 p-12 lg:p-16 text-white flex flex-col justify-center">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="p-3 bg-white/10 rounded-2xl w-fit mb-8 border border-white/10">
                                    <Briefcase className="text-blue-400" size={32} />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight line-height-tight">
                                    {localContent.methodologyTitle}
                                </h2>
                                <p className="text-slate-400 font-medium text-lg mb-10 leading-relaxed">
                                    {localContent.methodologySubtitle}
                                </p>
                                <div className="space-y-6 bg-white/5 p-8 rounded-3xl border border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black shrink-0">1</div>
                                        <p className="text-sm font-bold">{localContent.step1Title}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black shrink-0">2</div>
                                        <p className="text-sm font-bold">{localContent.step2Title}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black shrink-0">3</div>
                                        <p className="text-sm font-bold">{localContent.step3Title}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                        <div className="lg:col-span-7 p-12 lg:p-16 flex flex-col justify-center">
                            <div className="space-y-12">
                                <div className="flex gap-6 items-start">
                                    <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 shrink-0 border border-blue-100 shadow-sm"><Sparkles size={24} /></div>
                                    <div>
                                        <h4 className="text-xl font-black text-slate-900 mb-2">{localContent.methodologySubtitle}</h4>
                                        <p className="text-slate-500 font-medium leading-relaxed">{localContent.activationNote}</p>
                                    </div>
                                </div>
                                
                                <div className="p-8 bg-slate-50 rounded-4xl border border-slate-100 border-l-4 border-l-blue-600">
                                    <h4 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
                                        <Check className="text-blue-600" size={20} />
                                        {localContent.enrollmentOptions}
                                    </h4>
                                    <ul className="space-y-4">
                                        <li className="flex items-start gap-3">
                                            <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0" />
                                            <span className="text-slate-600 font-bold text-sm">{localContent.option1}</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0" />
                                            <span className="text-slate-600 font-bold text-sm">{localContent.option2}</span>
                                        </li>
                                    </ul>
                                </div>

                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="inline-flex items-center gap-3 px-8 py-5 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95 group"
                                >
                                    <MessageSquare size={18} />
                                    {localContent.contactCTA}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* AI Premium Features Grid */}
                <div className="mb-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">{localContent.aiFeaturesTitle}</h2>
                        <p className="text-slate-500 font-medium">{localContent.aiFeaturesSubtitle}</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {localContent.features.map((feature: Feature, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="group p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-lg hover:shadow-2xl hover:border-blue-200 transition-all relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-8 -mt-8 group-hover:bg-blue-500/10 transition-colors" />
                                
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-4 bg-slate-50 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform">
                                        {i === 0 && <Target size={24} />}
                                        {i === 1 && <Sparkles size={24} />}
                                        {i === 2 && <Award size={24} />}
                                        {i === 3 && <TrendingUp size={24} />}
                                        {i === 4 && <Briefcase size={24} />}
                                        {i === 5 && <MessageSquare size={24} />}
                                        {i === 6 && <FileText size={24} />}
                                    </div>
                                    <div className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black rounded-lg tracking-widest uppercase">
                                        {feature.status}
                                    </div>
                                </div>

                                <h3 className="text-xl font-black text-slate-900 mb-3 leading-tight">{feature.title}</h3>
                                <p className="text-sm font-medium text-slate-500 leading-relaxed mb-4">
                                    {feature.desc}
                                </p>
                                
                                <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                    {language === 'ar' ? 'اكتشف المزيد' : 'Learn More'}
                                    <ChevronRight size={14} className={language === 'ar' ? 'rotate-180' : ''} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Contract Section */}
                <div id="contract" className="pt-12 border-t border-slate-200">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white/50 backdrop-blur-sm mb-6 shadow-sm">
                            <PenTool className="w-3.5 h-3.5 text-blue-600" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                                {localContent.contractSubtitle}
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                            {localContent.contractTitle}
                        </h2>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
                        {/* Contract Content */}
                        <div className="lg:col-span-7 bg-white rounded-4xl border border-slate-200 shadow-xl overflow-hidden relative">
                            <div className="absolute top-0 w-full h-2 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600" />
                            <div className="p-8 md:p-12 h-[500px] overflow-y-auto custom-scrollbar">
                                <div className="prose max-w-none text-sm leading-relaxed font-serif text-slate-700">
                                    <ReactMarkdown
                                        components={{
                                            p: ({ ...props }) => <p className="mb-4 text-slate-600 leading-relaxed" {...props} />,
                                            strong: ({ ...props }) => <strong className="font-bold text-slate-900" {...props} />,
                                            ol: ({ ...props }) => <ol className="list-decimal pl-4 space-y-2 mb-4 marker:text-slate-900" {...props} />,
                                            li: ({ ...props }) => <li className="pl-1" {...props} />
                                        }}
                                    >
                                        {t.contract.terms}
                                    </ReactMarkdown>
                                </div>
                                <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-end">
                                    <div>
                                        <div className="w-40 h-20 border-b-2 border-slate-900 mb-2 flex items-end">
                                            {isSigned && (
                                                <p className="font-dancing text-3xl text-blue-800 transform -rotate-3 pl-2" style={{ fontFamily: 'Times New Roman, serif', fontStyle: 'italic' }}>
                                                    {formData.signature}
                                                </p>
                                            )}
                                        </div>
                                        <p className="text-[10px] uppercase tracking-widest text-slate-400">Authenticated Signature</p>
                                    </div>
                                    <Shield className="w-16 h-16 text-slate-100" />
                                </div>
                            </div>
                        </div>

                        {/* Signature Form */}
                        <div className="lg:col-span-5">
                            {!isSigned ? (
                                <form onSubmit={handleContractSubmit} className="bg-white p-8 rounded-4xl border border-slate-200 shadow-lg relative">
                                    <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black">1</span>
                                        {localContent.signToBegin}
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">{t.contract.firstName}</label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    required
                                                    value={formData.firstName}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                    placeholder={t.contract.firstName}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">{t.contract.lastName}</label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    required
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                    placeholder={t.contract.lastName}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">{localContent.countryAr}</label>
                                                <input
                                                    type="text"
                                                    name="country"
                                                    required
                                                    value={formData.country}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                    placeholder={localContent.countryAr}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">{localContent.addressAr}</label>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    required
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                    placeholder={localContent.addressAr}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">{t.contract.phone}</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                required
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                placeholder="+216 ..."
                                            />
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">{t.contract.signLabel}</label>
                                            <input
                                                type="text"
                                                name="signature"
                                                required
                                                value={formData.signature}
                                                onChange={handleInputChange}
                                                className="w-full bg-slate-50 border-none rounded-xl px-4 py-4 text-xl font-dancing text-blue-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                placeholder={t.contract.signPlaceholder}
                                                style={{ fontFamily: 'Times New Roman, serif', fontStyle: 'italic' }}
                                            />
                                        </div>

                                        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                                            <input
                                                type="checkbox"
                                                name="agreed"
                                                id="agreed"
                                                checked={formData.agreed}
                                                onChange={handleInputChange}
                                                className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                            />
                                            <label htmlFor="agreed" className="text-xs text-slate-600 font-bold leading-relaxed cursor-pointer select-none">
                                                {t.contract.readTerms}
                                            </label>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isLoading || !formData.agreed || !formData.signature || !formData.firstName || !formData.phone}
                                            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-2xl shadow-slate-900/20"
                                        >
                                            {isLoading ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <>
                                                    {t.contract.submit}
                                                    {isRtl ? <ChevronRight className="rotate-180 w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-green-50 border border-green-100 p-12 rounded-[3.5rem] text-center"
                                >
                                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-500/20">
                                        <Check className="text-white" size={40} strokeWidth={3} />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-4">{t.contract.successTitle}</h3>
                                    <p className="text-slate-600 font-medium mb-8 italic">
                                        {t.contract.successDesc}
                                    </p>
                                    
                                    <button
                                        onClick={generatePDF}
                                        className="w-full mb-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 shadow-xl hover:scale-105 transition-all"
                                    >
                                        <Download size={16} />
                                        {t.contract.download}
                                    </button>

                                    <div className="bg-white p-6 rounded-3xl border border-green-200 text-left space-y-4 shadow-sm">
                                        <div className="flex justify-between border-b border-slate-50 pb-2">
                                            <span className="text-[10px] font-black uppercase text-slate-400">ID</span>
                                            <span className="text-xs font-mono font-bold">{mandateId}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[10px] font-black uppercase text-slate-400">Status</span>
                                            <span className="text-[10px] font-black bg-green-500 text-white px-2 py-0.5 rounded uppercase">Active</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Hidden Contract for PDF Generation */}
                <div className="fixed left-[-9999px] top-0">
                    <div ref={contractRef} className="w-[800px] p-20" style={{ backgroundColor: '#ffffff', color: '#0f172a' }}>
                        <div className="text-center mb-12 pb-8" style={{ borderBottom: '2px solid #0f172a' }}>
                            <Shield className="w-16 h-16 mx-auto mb-4" style={{ color: '#0f172a' }} />
                            <h1 className="text-4xl font-serif font-bold uppercase tracking-widest mb-2" style={{ color: '#0f172a' }}>Success Mandate</h1>
                            <p className="text-sm font-bold uppercase tracking-[0.3em]" style={{ color: '#64748b' }}>Official Strategic Protocol</p>
                        </div>

                        <div className="mb-8 flex justify-between text-sm font-mono pb-4" style={{ borderBottom: '1px solid #e2e8f0', color: '#0f172a' }}>
                            <span>DATE: {currentDate}</span>
                            <span>ID: {mandateId}</span>
                        </div>

                        <div className="prose max-w-none mb-16 text-justify leading-relaxed font-serif">
                            <ReactMarkdown
                                components={{
                                    p: ({ ...props }) => <p className="mb-4 text-sm leading-loose" style={{ color: '#1e293b' }} {...props} />,
                                    strong: ({ ...props }) => <strong className="font-bold uppercase text-xs tracking-wide" style={{ color: '#000000' }} {...props} />,
                                    ol: ({ ...props }) => <ol className="list-decimal pl-4 space-y-4 mb-4 marker:font-bold" style={{ color: '#0f172a' }} {...props} />,
                                    li: ({ ...props }) => <li className="pl-2" {...props} />
                                }}
                            >
                                {t.contract.terms}
                            </ReactMarkdown>
                        </div>

                        <div className="grid grid-cols-2 gap-12 pt-8" style={{ borderTop: '2px solid #0f172a' }}>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest mb-4 font-bold" style={{ color: '#0f172a' }}>The Asset (Signatory)</p>
                                <p className="text-lg font-bold mb-1" style={{ color: '#0f172a' }}>{formData.firstName} {formData.lastName}</p>
                                <p className="text-sm mb-1" style={{ color: '#475569' }}>{formData.country}, {formData.address}</p>
                                <p className="text-sm mb-6" style={{ color: '#475569' }}>{formData.phone}</p>
                                <div className="h-20 flex items-end">
                                    <p className="font-dancing text-3xl" style={{ fontFamily: 'Times New Roman, serif', fontStyle: 'italic', color: '#1e3a8a' }}>
                                        {formData.signature}
                                    </p>
                                </div>
                                <div className="h-px w-full mt-2" style={{ backgroundColor: '#94a3b8' }} />
                                <p className="text-[9px] uppercase mt-1" style={{ color: '#94a3b8' }}>Digital Signature Verified</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] uppercase tracking-widest mb-4 font-bold" style={{ color: '#0f172a' }}>The Architecture</p>
                                <p className="text-lg font-bold mb-2" style={{ color: '#0f172a' }}>Success Strategy Inc.</p>
                                <div className="h-28 flex items-end justify-end relative">
                                    <div className="absolute top-[-20px] right-[-30px] z-20 pointer-events-none transform -rotate-12 opacity-95">
                                        <svg width="220" height="100" viewBox="0 0 150 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: '#1e3a8a', opacity: 0.95 }}>
                                            <path d="M10 45C30 40 50 15 70 25C90 35 110 5 140 15M20 50C40 45 60 40 100 42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M40 30C45 25 55 20 60 35C65 50 50 55 45 45C40 35 55 25 70 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        </svg>
                                    </div>
                                    
                                    <div className="w-52 h-26 border-[3px] rounded-xl flex flex-col items-center justify-center transform -rotate-6 mb-4 relative z-10" style={{ borderColor: '#1e3a8a', color: '#1e3a8a', fontFamily: 'serif' }}>
                                        <p className="text-xl font-black uppercase tracking-tighter leading-none mb-1">Sté MA</p>
                                        <p className="text-[12px] font-bold uppercase tracking-widest leading-none mb-2">Training Consulting</p>
                                        <p className="text-[10px] font-bold leading-none mb-0.5">Tel: 44 172 264</p>
                                        <p className="text-[10px] font-bold leading-none">MF: 1805031P/A/M/000</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-20 text-center text-[10px] font-mono uppercase" style={{ color: '#94a3b8' }}>
                            Generated by Success Strategy Protocol • Secure Hash {secureHash}
                        </div>
                    </div>
                </div>

                {/* Secure Footer */}
                <div className="mt-24 pt-12 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-8 opacity-60">
                    <div className="flex items-center gap-3">
                        <Shield className="text-blue-600" size={20} />
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center md:text-left">
                            Paiements 100% Sécurisés & Facturation Exécutive
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <Globe size={18} className="text-slate-400" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            © 2026 DIGITALISA - PROTOCOLE DIGNNOS-
                        </span>
                    </div>
                </div>
            </div>

            <ConsultingInquiryModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                redirectToDashboard={true}
            />
        </div>
    );
}
