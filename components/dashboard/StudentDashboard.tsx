"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
    Target, 
    Zap, 
    PlayCircle, 
    Award, 
    ArrowRight, 
    CheckCircle2, 
    Star, 
    Rocket, 
    Briefcase, 
    Globe, 
    Cpu,
    Sparkles,
    BarChart,
    ExternalLink,
    Lightbulb,
    Search,
    Copy,
    Share2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentDashboardProps {
    userName: string;
    isDiagnosisComplete: boolean;
    hasStarted: boolean;
    dir: 'ltr' | 'rtl';
    language: string;
    stats: {
        totalSkills: number;
        overallScore: number;
        simScore: number;
        hasSCI: boolean;
        technicalScore?: number;
        softScore?: number;
    };
}

export function StudentDashboard({ 
    userName, 
    isDiagnosisComplete, 
    hasStarted, 
    dir,
    language,
    stats
}: StudentDashboardProps) {
    
    const isRtl = dir === 'rtl';

    const localT = {
        en: {
            roadmapTitle: "Career Path Visualizer",
            internshipTitle: "Internship Booster AI",
            internshipDesc: "Smart companies list & PFE strategy tailored to your profile.",
            privilegesTitle: "Premium Student Assets",
            privilegesDesc: "Exclusive tools and certifications for your growth.",
            benchmarkingTitle: "Junior Benchmarking",
            benchmarkingDesc: "See how you rank against other students in your field.",
            mentorTitle: "Side-Project Mentor",
            mentorDesc: "Turn your university projects into professional portfolio assets.",
            jobsTitle: "Junior Job Matcher",
            jobsDesc: "Direct opportunities curated for your identified skill set.",
            welcome: "Welcome back",
            portfolio: "Digital Portfolio",
            portfolioDesc: "Live Link for Recruiters",
            microCerts: "Micro-Certifications",
            microCertsDesc: "View Earned Badges",
            upgrade: "Upgrade Experience",
            roadmap: [
                { title: "Dreamer", sub: "Profile Setup" },
                { title: "Scout", sub: "Skill Audit" },
                { title: "Builder", sub: "Workshops" },
                { title: "Warrior", sub: "Simulations" },
                { title: "Professional", sub: "Market Ready" },
            ]
        },
        fr: {
            roadmapTitle: "Visualisateur de Parcours",
            internshipTitle: "Booster de Stage AI",
            internshipDesc: "Liste d'entreprises cibles & stratégie PFE sur mesure.",
            privilegesTitle: "Atouts Étudiant Premium",
            privilegesDesc: "Outils et certifications exclusifs pour votre croissance.",
            benchmarkingTitle: "Benchmarking Junior",
            benchmarkingDesc: "Comparez votre niveau avec les autres étudiants du domaine.",
            mentorTitle: "Mentor Projet-Perso",
            mentorDesc: "Transformez vos projets d'études en atouts pour votre Portfolio.",
            jobsTitle: "Job Matcher (Junior)",
            jobsDesc: "Opportunités directes sélectionnées selon vos compétences.",
            welcome: "Bon retour",
            portfolio: "Portfolio Numérique",
            portfolioDesc: "Lien Direct pour Recruteurs",
            microCerts: "Micro-Certifications",
            microCertsDesc: "Voir les Badges",
            upgrade: "Améliorer l'Expérience",
            roadmap: [
                { title: "Rêveur", sub: "Profil" },
                { title: "Éclaireur", sub: "Audit Skills" },
                { title: "Bâtisseur", sub: "Ateliers" },
                { title: "Guerrier", sub: "Simulations" },
                { title: "Professionnel", sub: "Prêt au Marché" },
            ]
        },
        ar: {
            roadmapTitle: "مخطط المسار المهني",
            internshipTitle: "داعم التربصات بالذكاء الاصطناعي",
            internshipDesc: "قائمة شركات مستهدفة واستراتيجية PFE مصممة لملفك.",
            privilegesTitle: "أصول الطالب المتميزة",
            privilegesDesc: "أدوات وشهادات حصرية لتطورك المهني.",
            benchmarkingTitle: "مقارنة الأداء للناشئين",
            benchmarkingDesc: "رؤية مركزك مقارنة بالطلبة الآخرين في اختصاصك.",
            mentorTitle: "موجه المشاريع الجانبية",
            mentorDesc: "حول مشاريعك الجامعية إلى أصول احترافية في معرض أعمالك.",
            jobsTitle: "مطابق الوظائف المبتدئة",
            jobsDesc: "فرص عمل مباشرة مختارة بعناية حسب مهاراتك المرصودة.",
            welcome: "مرحباً بعودتك",
            portfolio: "البورتفوليو الرقمي",
            portfolioDesc: "رابط مباشر للمشغلين",
            microCerts: "الشهادات المصغرة",
            microCertsDesc: "عرض الأوسمة المكتسبة",
            upgrade: "ترقية التجربة",
            roadmap: [
                { title: "الحالم", sub: "إعداد الملف" },
                { title: "المستكشف", sub: "تدقيق المهارات" },
                { title: "البنّاء", sub: "ورشات العمل" },
                { title: "المحارب", sub: "المحاكاة" },
                { title: "المحترف", sub: "جاهز للسوق" },
            ]
        }
    };

    const currentLang = dir === 'rtl' ? 'ar' : (language === 'fr' ? 'fr' : 'en');
    const local = localT[currentLang];

    const roadmapStages = [
        { id: 1, title: local.roadmap[0].title, sub: local.roadmap[0].sub, icon: Target, completed: hasStarted, active: !hasStarted },
        { id: 2, title: local.roadmap[1].title, sub: local.roadmap[1].sub, icon: Cpu, completed: isDiagnosisComplete, active: hasStarted && !isDiagnosisComplete },
        { id: 3, title: local.roadmap[2].title, sub: local.roadmap[2].sub, icon: PlayCircle, completed: false, active: isDiagnosisComplete },
        { id: 4, title: local.roadmap[3].title, sub: local.roadmap[3].sub, icon: Zap, completed: false, active: isDiagnosisComplete },
        { id: 5, title: local.roadmap[4].title, sub: local.roadmap[4].sub, icon: Rocket, completed: false, active: false },
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className={cn("space-y-12 pb-24", isRtl ? "text-right" : "text-left")}>
            {/* --- Hero: Level & Stats --- */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative overflow-hidden rounded-[3rem] bg-linear-to-br from-indigo-600 via-blue-700 to-purple-800 p-8 md:p-14 text-white shadow-[0_20px_50px_rgba(31,41,234,0.3)]"
            >
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-[100px]" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-400/20 rounded-full blur-[80px]" />
                
                <div className={cn("relative z-10 flex flex-col md:flex-row justify-between items-center gap-10", isRtl ? "md:flex-row-reverse" : "")}>
                    <div className="space-y-6 text-center md:text-left">
                        <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/15 backdrop-blur-xl border border-white/20 rounded-full text-xs font-black uppercase tracking-[0.2em]">
                            <Sparkles className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                            Elite Student Level 4
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.1]">
                            {local.welcome},<br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-100 to-yellow-400">{userName}</span>!
                        </h1>
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                            <span className="bg-white/10 px-4 py-2 rounded-2xl text-xs font-bold backdrop-blur-sm border border-white/5">🎯 Career Goal: PFE 2026</span>
                            <span className="bg-white/10 px-4 py-2 rounded-2xl text-xs font-bold backdrop-blur-sm border border-white/5">🚀 Power Boost: Active</span>
                        </div>
                    </div>
                    
                    <div className="flex gap-6">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                            <div className="relative bg-white/10 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/20 text-center flex flex-col items-center min-w-[140px] shadow-2xl">
                                <p className="text-5xl font-black text-white leading-none mb-2">{stats.overallScore || 0}</p>
                                <p className="text-[10px] uppercase font-black tracking-widest text-blue-200">Readiness Score</p>
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 text-center flex flex-col items-center min-w-[140px]">
                            <p className="text-5xl font-black text-white leading-none mb-2">{stats.totalSkills}</p>
                            <p className="text-[10px] uppercase font-black tracking-widest text-blue-200">Mastered Skills</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* --- 1. Student Path Visualizer --- */}
            <section className="space-y-10">
                <div className={cn("flex items-center justify-between", isRtl ? "flex-row-reverse" : "")}>
                    <div className="space-y-1">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                                <Target className="w-6 h-6 text-white" />
                            </div>
                            {local.roadmapTitle}
                        </h2>
                        <p className="text-slate-500 font-bold text-sm md:mx-16">Progress through levels to unlock professional opportunities.</p>
                    </div>
                </div>

                <div className="relative p-10 bg-slate-50 rounded-[3rem] border border-slate-100 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-slate-200">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: isDiagnosisComplete ? "60%" : "20%" }}
                            className="h-full bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.5)]"
                        />
                    </div>
                    
                    <motion.div 
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-5 gap-8 relative"
                    >
                        {roadmapStages.map((stage) => (
                            <motion.div 
                                key={stage.id}
                                variants={item}
                                className={cn(
                                    "relative z-10 flex flex-col items-center text-center space-y-6 group cursor-pointer",
                                    !stage.active && !stage.completed && "opacity-40 grayscale"
                                )}
                            >
                                <div className={cn(
                                    "w-20 h-20 rounded-4xl flex items-center justify-center shadow-2xl transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3",
                                    stage.completed ? "bg-emerald-500 text-white shadow-emerald-200" : 
                                    stage.active ? "bg-blue-600 text-white shadow-blue-200 animate-pulse" : 
                                    "bg-white text-slate-400 border border-slate-200"
                                )}>
                                    {stage.completed ? <CheckCircle2 className="w-10 h-10" /> : <stage.icon className="w-10 h-10" />}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">Level 0{stage.id}</p>
                                    <h3 className={cn("font-black text-lg", stage.completed ? "text-emerald-900" : stage.active ? "text-blue-600" : "text-slate-600")}>
                                        {stage.title}
                                    </h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{stage.sub}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <div className="grid lg:grid-cols-3 gap-10">
                {/* --- 2. Benchmarking --- */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="lg:col-span-1 bg-white rounded-[3rem] border border-slate-200 p-10 shadow-xl relative overflow-hidden flex flex-col justify-between"
                >
                    <div className="space-y-6">
                        <div className="w-14 h-14 bg-purple-600/10 text-purple-600 rounded-2xl flex items-center justify-center">
                            <BarChart className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">{local.benchmarkingTitle}</h2>
                            <p className="text-slate-500 font-medium text-sm mt-1">{local.benchmarkingDesc}</p>
                        </div>

                        <div className="space-y-5 py-4">
                            {[
                                { label: "Technical Proficiency", score: 82, avg: 65, color: "bg-blue-600" },
                                { label: "Soft Skills / EQ", score: 74, avg: 72, color: "bg-purple-600" },
                                { label: "Problem Solving", score: 91, avg: 58, color: "bg-emerald-600" }
                            ].map((stat, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-slate-600">{stat.label}</span>
                                        <span className="text-slate-400">Avg: {stat.avg}%</span>
                                    </div>
                                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden relative">
                                        <div className="absolute top-0 right-0 left-0 bottom-0 pointer-events-none z-10 flex">
                                            <div style={{ width: `${stat.avg}%` }} className="border-r-2 border-slate-900/10 h-full" />
                                        </div>
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${stat.score}%` }}
                                            className={cn("h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]", stat.color)}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-900">Your Score: {stat.score}%</span>
                                        <span className={cn("text-[10px] font-black px-2 py-0.5 rounded-md", 
                                            stat.score > stat.avg ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400")}>
                                            {stat.score > stat.avg ? `+${stat.score - stat.avg}% Ready` : "Below Average"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* --- 3. Internship Booster AI --- */}
                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-10 opacity-10">
                        <Rocket className="w-40 h-40 transform rotate-12" />
                    </div>
                    
                    <div className="relative z-10 space-y-10">
                        <div className="flex justify-between items-start">
                            <div className="space-y-4">
                                <span className="inline-flex items-center gap-2 px-4 py-1 bg-blue-600/20 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-400/20">
                                    <Sparkles className="w-3 h-3" />
                                    AI Strategy Unlocked
                                </span>
                                <h1 className="text-4xl font-black">{local.internshipTitle}</h1>
                                <p className="text-slate-400 font-medium max-w-xl">{local.internshipDesc}</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white/5 border border-white/10 p-6 rounded-4xl space-y-4 hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-3 text-blue-400 font-black text-xs uppercase tracking-widest">
                                    <Search className="w-5 h-5" />
                                    Target Companies
                                </div>
                                <div className="space-y-2">
                                    {["Deloitte Digital", "VaynerMedia", "Standard Chartered"].map(c => (
                                        <div key={c} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 group/row hover:bg-blue-600 transition-colors cursor-pointer">
                                            <span className="text-xs font-bold">{c}</span>
                                            <ExternalLink className="w-3 h-3 opacity-40 group-hover/row:opacity-100" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-6 rounded-4xl space-y-4 hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-3 text-emerald-400 font-black text-xs uppercase tracking-widest">
                                    <FileTextIconButton className="w-5 h-5" />
                                    CV Optimization
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed font-bold">
                                    Apply using project &ldquo;Fin-Alpha Analytics&rdquo;. Emphasize <span className="text-blue-400">Data Simulation</span> over manual entry.
                                </p>
                                <button className="w-full py-3 bg-white text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-400 hover:text-white transition-colors">
                                    Apply CV Patch
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* --- 4. Project Mentor --- */}
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="lg:col-span-1 bg-emerald-50 rounded-[3rem] p-10 border border-emerald-100 shadow-sm flex flex-col relative group overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-20">
                        <Lightbulb className="w-16 h-16 text-emerald-600" />
                    </div>
                    
                    <div className="space-y-6 flex-1">
                        <div className="w-14 h-14 bg-emerald-600 text-white rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-200">
                            <Lightbulb className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-emerald-900">{local.mentorTitle}</h2>
                            <p className="text-emerald-700/70 font-bold text-xs mt-1">{local.mentorDesc}</p>
                        </div>

                        <div className="p-5 bg-white rounded-3xl border border-emerald-100 space-y-4">
                            <p className="text-xs text-slate-600 leading-relaxed italic">
                                &ldquo;That Excel project on Inventory Management? Let&apos;s turn it into a <strong>Tableau Dashboard</strong> case study. I&apos;ll show you how to pitch it to hiring managers.&rdquo;
                            </p>
                            <button className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] group-hover:px-1 transition-all">
                                Get New Insight <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* --- 5. Job Matching --- */}
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-slate-200 shadow-xl overflow-hidden"
                >
                    <div className="space-y-8">
                        <div className="flex justify-between items-center">
                            <div className="space-y-1">
                                <h2 className="text-3xl font-black text-slate-900">{local.jobsTitle}</h2>
                                <p className="text-slate-500 font-medium text-sm">{local.jobsDesc}</p>
                            </div>
                            <button className="p-4 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100 transition-colors">
                                <ArrowRight className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {[
                                { title: "Junior Business Analyst", firm: "Amazon AWS", location: "Global (Remote)", skills: ["SQL", "Analytics"] },
                                { title: "Entry-Level Strategist", firm: "Publicis Groupe", location: "Casablanca Hub", skills: ["Branding", "Strategy"] }
                            ].map((job, idx) => (
                                <div key={idx} className="p-6 bg-slate-50 rounded-4xl border border-slate-100 hover:border-blue-400 group/job transition-all cursor-pointer">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200">
                                            <Briefcase className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <span className="bg-blue-600 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase">94% Match</span>
                                    </div>
                                    <h3 className="font-black text-slate-900 mb-1 group-hover/job:text-blue-600 transition-colors">{job.title}</h3>
                                    <p className="text-xs text-slate-500 font-bold mb-4">{job.firm} • {job.location}</p>
                                    <div className="flex gap-2">
                                        {job.skills.map(s => <span key={s} className="text-[9px] font-black px-2 py-1 bg-white border border-slate-200 text-slate-400 rounded-lg">{s}</span>)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* --- 6. Portfolio & Certs --- */}
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="lg:col-span-3 bg-linear-to-br from-indigo-800 to-slate-900 rounded-[3.5rem] p-10 md:p-14 text-white relative overflow-hidden flex flex-col md:flex-row gap-10 items-center"
                >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none" />
                    
                    <div className="flex-1 space-y-8 relative z-10">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black">{local.privilegesTitle}</h2>
                            <p className="text-indigo-200 font-medium text-lg leading-relaxed max-w-xl">
                                Your skills aren&apos;t just invisible numbers. Launch your professional brand with these premium student exclusive features.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <div className="bg-white/10 backdrop-blur-3xl border border-white/20 p-6 rounded-[2.5rem] flex items-center gap-6 group hover:bg-white/20 transition-all flex-1 min-w-[280px]">
                                <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/20">
                                    <Globe className="w-8 h-8" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-300 mb-1">{local.portfolio}</p>
                                    <p className="text-sm font-bold truncate mb-3">student-{userName.toLowerCase()}-2026.cv.live</p>
                                    <div className="flex gap-2">
                                        <button className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-blue-600 transition-colors">
                                            <Copy className="w-3 h-3" /> Copy
                                        </button>
                                        <button className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-colors">
                                            <Share2 className="w-3 h-3" /> Share
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-3xl border border-white/20 p-6 rounded-[2.5rem] flex items-center gap-6 group hover:bg-white/20 transition-all flex-1 min-w-[280px]">
                                <div className="w-16 h-16 bg-yellow-500 text-slate-900 rounded-3xl flex items-center justify-center shadow-2xl shadow-yellow-500/20">
                                    <Award className="w-8 h-8" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-yellow-300 mb-1">{local.microCerts}</p>
                                    <p className="text-sm font-bold mb-3">{local.microCertsDesc}</p>
                                    <div className="flex -space-x-3">
                                        {[1,2,3].map(i => (
                                            <div key={i} className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[10px] font-black">
                                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            </div>
                                        ))}
                                        <div className="w-10 h-10 rounded-full bg-slate-800/50 border-2 border-slate-900 flex items-center justify-center text-[10px] font-black text-slate-500 pointer-events-none">
                                            +4
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative group perspective-1000 hidden md:block">
                        <div className="absolute inset-0 bg-blue-600 blur-3xl opacity-20 animate-pulse" />
                        <motion.div 
                            animate={{ rotateY: [0, 10, 0], rotateX: [0, 5, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="bg-white/10 backdrop-blur-3xl p-2 rounded-[3rem] border border-white/20 transform rotate-3"
                        >
                            <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl w-64 space-y-6">
                                <div className="flex justify-between items-center">
                                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/20">
                                        <Award className="w-6 h-6" />
                                    </div>
                                    <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Official Certification</p>
                                    <p className="text-lg font-black leading-tight text-white">Elite Problem Solver</p>
                                </div>
                                <div className="h-1 w-full bg-white/10 rounded-full" />
                                <p className="text-[10px] font-bold text-slate-400">Verified by CareerUpgrade AI</p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function FileTextIconButton(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="M10 9H8" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
        </svg>
    )
}
