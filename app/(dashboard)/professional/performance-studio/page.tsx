"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, FileText, 
  ChevronRight, ArrowLeft, Shield, Sparkles, 
  Zap, Award, Briefcase, Globe,
  Download, PlayCircle, LogOut, Video, Calendar, User, Clock,
  CheckCircle, Loader2, ExternalLink, Layout,
  Send, CheckCircle2, ShieldCheck, AlertCircle
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import SimulationPage from "../../simulation/page";

// --- TYPES ---
interface FinalReport {
  profileSummary: string;
  maturityLevel: string;
  leadershipFingerprint?: { archetype: string; description: string; riskContext: string };
  careerTypology?: "Specialist" | "Generalist" | "T-Shaped";
  aiReadiness?: { score: number; riskLevel: "Low" | "Medium" | "High"; advice: string };
  selfAwarenessScore?: { score: number; verdict: string; evidence: string };
  blindSpots?: string[];
  trajectoryVelocity?: { score: number; status: string; assessment: string; rationale: string };
  swot: { strengths: string[]; weaknesses: string[]; opportunities: string[]; threats: string[] };
  deepInsights: string[];
  marketValue: string;
  finalVerdict: string;
  recommendedRoles: string[];
  gapAnalysis: {
    currentJobVsReality: string;
    hardSkillsMatch: number;
    softSkillsMatch: number;
    criticalCompetencyGaps: string[];
    comparisonPositionReality?: string;
  };
  actionPlan90Days?: { week: string; action: string; rationale: string }[];
  careerAdvancement: { role: string; shortTermProbability: number; longTermProbability: number; requirements: string[] }[];
  expertInterviewNotes?: string[];
  authorityVsPotential?: { currentAuthority: number; futurePotential: number; quadrant: string };
  strategicRadar?: { technical: number; leadership: number; strategy: number; execution: number; influence: number };
  marketPerceptionVerdict?: string;
  linkedInStrategy?: { headline: string; summaryFocus: string; networkingAdvice: string };
}

interface Course {
    _id: string;
    title: string;
    instructor: string;
    sessions?: number;
    status: string;
    location: string;
    date?: string;
    isAccessOpen?: boolean;
    allowedUsers?: string[];
    price?: number;
    maxParticipants?: number;
    enrolled?: number;
}

interface CourseSession {
    _id: string;
    title: string;
    videoUrl: string;
    duration: string;
}

interface AdminSession {
    _id?: string;
    title: string;
    date: string;
    time: string;
    expertName: string;
    meetingLink: string;
}

interface Resource {
    _id: string;
    title: string;
    description?: string;
    url: string;
    type?: string;
    category: string;
    size?: string;
}

interface Tool {
    _id: string;
    title: string;
    description?: string;
    url: string;
    category: string;
    visibility?: string;
}

type TabId = "overview" | "workshops" | "sessions" | "resources" | "missions" | "technical_ai" | "attestations";

interface NavItem {
    id: TabId;
    label: string;
    labelAr: string;
    icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
    { id: "technical_ai",  label: "Technical AI Expert",       labelAr: "الخبير التقني (AI)",        icon: <Zap size={18} /> },
    { id: "workshops",     label: "Strategic Workshops",       labelAr: "الورشات الاستراتيجية",    icon: <BookOpen size={18} /> },
    { id: "missions",      label: "Strategic Simulation",      labelAr: "محاكاة استراتيجية",         icon: <Zap size={18} /> },
    { id: "overview",      label: "AI Strategic Advisor",      labelAr: "الخبير الاستراتيجي (AI)",    icon: <Sparkles size={18} /> },
    { id: "sessions",      label: "Live Sessions",             labelAr: "الجلسات المباشرة",           icon: <Video size={18} /> },
    { id: "attestations",  label: "Official Documents",        labelAr: "احصل على وثائقك الرسمية",    icon: <Award size={18} /> },
];

export default function PerformanceStudio() {
    const [activeTab, setActiveTab] = useState<TabId>("technical_ai");
    const [report, setReport] = useState<FinalReport | null>(null);
    const [currentLang, setCurrentLang] = useState('ar');
    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const hydrate = () => {
            const lang = localStorage.getItem("language") || "ar";
            setCurrentLang(lang);
            const saved = localStorage.getItem("prof_finalReport");
            if (saved) {
                try { setReport(JSON.parse(saved) as FinalReport); } catch { /* ignore */ }
            }
            const profile = JSON.parse(localStorage.getItem("userProfile") || "{}");
            setUserEmail(profile.email || profile.fullName || "");
            setLoading(false);
        };
        const timeout = setTimeout(hydrate, 0);
        return () => clearTimeout(timeout);
    }, []);

    const isRTL = currentLang === 'ar';

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-4 border-rose-500/20 border-t-rose-500 animate-spin" />
            </div>
        );
    }

    if (!report) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center border border-white/5">
                    <Shield size={40} className="text-slate-500" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Diagnostic Required</h1>
                    <p className="text-slate-500 text-sm max-w-sm">Please complete the executive diagnostic to unlock your Performance Studio.</p>
                </div>
                <a href="/professional" className="px-12 py-4 bg-rose-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all">
                    Start Diagnosis
                </a>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans" dir={isRTL ? 'rtl' : 'ltr'}>
            
            {/* ── TOP HORIZONTAL NAVBAR ── */}
            <header className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-white/5 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    {/* Logo & Info */}
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-rose-600 flex items-center justify-center shadow-lg shadow-rose-600/20">
                                <Award className="text-white" size={24} />
                            </div>
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">Executive</div>
                                <div className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Studio</div>
                            </div>
                        </div>

                        {/* Status Badge */}
                            <div className="hidden sm:flex px-4 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{report?.maturityLevel || "EXECUTIVE"}</span>
                            </div>
                    </div>

                    {/* Navigation Items (Horizontal) */}
                    <nav className="hidden lg:flex items-center gap-1 bg-slate-50 dark:bg-white/5 p-1 rounded-2xl">
                        {NAV_ITEMS.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={cn(
                                    "flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-black text-[10px] uppercase tracking-wider",
                                    activeTab === item.id 
                                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md" 
                                        : "text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5"
                                )}
                            >
                                <span className={cn(activeTab === item.id ? "text-rose-500" : "text-slate-400 group-hover:text-rose-500")}>
                                    {React.cloneElement(item.icon as React.ReactElement<{ size?: number }>, { size: 14 })}
                                </span>
                                {isRTL ? item.labelAr : item.label}
                            </button>
                        ))}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end mr-2">
                            <span className="text-[10px] font-black uppercase text-slate-400">Professional</span>
                            <span className="text-xs font-bold text-slate-900 dark:text-white group flex items-center gap-1">
                                {userEmail.split('@')[0]}
                                <Shield className="text-rose-500" size={12} />
                            </span>
                        </div>
                        <button
                            onClick={async () => {
                                try { await fetch('/api/auth/logout', { method: 'POST' }); } catch { /* ignore */ }
                                localStorage.clear();
                                sessionStorage.clear();
                                window.location.href = '/login';
                            }}
                            className="p-3 rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-100"
                        >
                            <LogOut size={18} className={isRTL ? "rotate-180" : ""} />
                        </button>
                    </div>
                </div>

                {/* Mobile Scroll Nav */}
                <div className="lg:hidden px-4 pb-4 overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-2 w-max">
                        {NAV_ITEMS.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-black text-[9px] uppercase tracking-wider whitespace-nowrap",
                                    activeTab === item.id 
                                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" 
                                        : "text-slate-400 bg-slate-50 dark:bg-white/5"
                                )}
                            >
                                {isRTL ? item.labelAr : item.label}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* ── MAIN CONTENT ── */}
            <main className="flex-1 bg-slate-50 dark:bg-slate-950">
                <div className="max-w-7xl mx-auto p-6 md:p-12">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                            <div className="mb-10 flex items-center justify-between">
                                <div>
                                    <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">
                                        {isRTL ? NAV_ITEMS.find(n => n.id === activeTab)?.labelAr : NAV_ITEMS.find(n => n.id === activeTab)?.label}
                                    </h2>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mt-1">
                                        <Sparkles size={11} className="text-rose-500" />
                                        {isRTL ? "مؤسسة على تشخيصك الأخير" : "Based on your latest diagnosis"}
                                    </div>
                                </div>
                                <Link href="/professional/executive-dashboard" className="hidden sm:flex items-center gap-2 px-6 py-3 rounded-2xl border border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
                                    <ArrowLeft size={14} className={isRTL ? "rotate-180" : ""} />
                                    {isRTL ? "لوحة المعلومات" : "Executive Dashboard"}
                                </Link>
                            </div>

                            {activeTab === "overview"      && <div key="overview"><AIAdvisor report={report} isRTL={isRTL} userEmail={userEmail} /></div>}
                            {activeTab === "workshops"     && <div key="workshops"><Workshops isRTL={isRTL} userEmail={userEmail} /></div>}
                            {activeTab === "sessions"      && <div key="sessions"><Sessions isRTL={isRTL} userEmail={userEmail} /></div>}
                            {activeTab === "resources"     && <div key="resources"><Resources isRTL={isRTL} /></div>}
                            {activeTab === "missions"      && <div key="missions" className="-mx-6 md:-mx-12 -my-8"><SimulationPage /></div>}
                            {activeTab === "technical_ai"  && <div key="technical_ai"><TechnicalAI report={report} isRTL={isRTL} userEmail={userEmail} /></div>}
                            {activeTab === "attestations"  && <div key="attestations"><Attestations isRTL={isRTL} userEmail={userEmail} /></div>}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

// ─── AI STRATEGIC ADVISOR (Chat Interface) ──────────────────────────────────────
function AIAdvisor({ report, isRTL, userEmail }: { report: FinalReport, isRTL: boolean, userEmail: string }) {
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Initial welcome message
        const welcome = isRTL 
            ? `مرحباً بك. أنا خبيرك الاستراتيجي المخصص. بناءً على تشخيصك الأخير في قطاع **${report.recommendedRoles?.[0] || 'تخصصك'}**، أنا هنا لمساعدتك في أي استفسار يتعلق بمسارك المهني، تموضعك السوقي، أو كيفية تنفيذ خطتك الاستراتيجية. ما هو سؤالك الأول؟`
            : `Welcome. I am your specialized Strategic Advisor. Based on your recent diagnosis in the **${report.recommendedRoles?.[0] || 'professional'}** sector, I am here to assist with any inquiry regarding your career path, market positioning, or strategic execution. What is your first question?`;
        
        setMessages([{ role: 'assistant', content: welcome }]);
    }, [isRTL, report.recommendedRoles]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMsg = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsTyping(true);

        try {
            // Enhanced context for the expert
            const expertContext = `User is in the ${report.marketValue || 'N/A'} market. Maturity: ${report.maturityLevel || 'N/A'}. 
            Recommended Roles: ${(report.recommendedRoles || []).join(', ')}. 
            Strategic Gaps: ${(report.gapAnalysis?.criticalCompetencyGaps || []).join(', ')}.
            Final Verdict Context: ${report.finalVerdict || 'N/A'}`;

            const response = await fetch("/api/expert/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [
                        { 
                            role: 'system', 
                            content: `Context about user: ${expertContext}. 
                            You must act as an elite Strategic CSO for this specific user. 
                            You are an expert in their domain (${report.recommendedRoles?.[0] || 'listed roles'}).
                            IMPORTANT: Use simple, direct, and accessible language (كلام ساهل). 
                            Avoid niche or irrelevant geographic examples (e.g., Nigerian). 
                            Use general examples or none at all if not necessary. 
                            Keep the tone professional but easy to converse with.`
                        },
                        ...messages,
                        { role: 'user', content: userMsg }
                    ],
                    language: isRTL ? 'ar' : 'en',
                    expertType: 'strategic'
                })
            });

            const data = await response.json();
            if (data.content) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
            }
        } catch (err) {
            console.error("Chat error", err);
        } finally {
            setIsTyping(false);
        }
    };

    if (!mounted) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border border-white/5">
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-20 h-20 rounded-3xl bg-linear-to-br from-indigo-500 to-rose-600 flex items-center justify-center shadow-2xl shadow-rose-500/20 shrink-0">
                        <Sparkles size={32} className="text-white animate-pulse" />
                    </div>
                    <div className="text-center md:text-right space-y-2">
                        <h3 className="text-2xl font-black uppercase tracking-tight">
                            {isRTL ? "مستشارك الاستراتيجي المعتمد" : "Your Certified Strategic Advisor"}
                        </h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center justify-center md:justify-start gap-2">
                           <Shield size={12} className="text-emerald-500" /> {isRTL ? "خبير متخصص في قطاعك العملي" : "Domain-Specific Executive Expert"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-2xl flex flex-col h-[600px] overflow-hidden">
                {/* Chat Header */}
                <div className="p-6 border-b border-slate-50 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/2">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{isRTL ? "وضع الاستشارة النشط" : "Active Consultation Mode"}</span>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={cn(
                                "flex flex-col max-w-[85%]",
                                msg.role === 'user' ? (isRTL ? "mr-auto items-start" : "ml-auto items-end") : (isRTL ? "ml-auto items-end" : "mr-auto items-start")
                            )}
                        >
                            <div className={cn(
                                "p-5 rounded-3xl text-sm leading-relaxed font-medium shadow-sm",
                                msg.role === 'user' 
                                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-bl-none"
                                    : "bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 rounded-br-none border border-slate-100 dark:border-white/5"
                            )}>
                                {msg.content}
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-2 px-2">
                                {msg.role === 'user' ? (isRTL ? "أنت" : "You") : (isRTL ? "الخبير الاستراتيجي" : "Lead Strategist")}
                            </span>
                        </motion.div>
                    ))}
                    {isTyping && (
                        <div className={cn("flex items-center gap-2 text-slate-400", isRTL ? "ml-auto" : "mr-auto")}>
                            <Loader2 className="animate-spin" size={12} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">{isRTL ? "الخبير يحلل الآن..." : "Expert is analyzing..."}</span>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="p-6 border-t border-slate-50 dark:border-white/5 bg-slate-50/30">
                    <div className="relative group">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={isRTL ? "اسأل خبيرك الاستراتيجي عن أي شيء..." : "Ask your strategist anything..."}
                            className="w-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-white/5 rounded-2xl py-4 px-6 pr-16 text-sm font-medium focus:border-rose-500 transition-all outline-hidden text-slate-900 dark:text-white"
                        />
                        <button 
                            type="submit"
                            disabled={!input.trim() || isTyping}
                            className="absolute right-3 top-2 bottom-2 px-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:bg-rose-600 dark:hover:bg-rose-600 dark:hover:text-white transition-all disabled:opacity-50"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </form>
            </div>

            {/* Suggestions */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                    { textAr: "كيف يمكنني تحسين تموضعي في السوق الحالي؟", textEn: "How can I improve my current market positioning?" },
                    { textAr: "ما هي المهارات التقنية التي تنقصني للوصول لرؤيتي؟", textEn: "Which technical skills am I missing for my vision?" },
                    { textAr: "أعطني نصيحة بخصوص التحديات الاستراتيجية في قطاعي.", textEn: "Give me advice on strategic challenges in my sector." }
                ].map((s, i) => (
                    <button 
                        key={i}
                        onClick={() => { setInput(isRTL ? s.textAr : s.textEn); }}
                        className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 text-[10px] font-bold text-slate-500 hover:border-rose-500 hover:text-rose-500 transition-all text-center"
                    >
                        {isRTL ? s.textAr : s.textEn}
                    </button>
                ))}
            </div>
        </div>
    );
}



// ─── WORKSHOPS (Real data from admin) ──────────────────────────────────────────
function Workshops({ isRTL, userEmail }: { isRTL: boolean; userEmail: string }) {
    const [courses, setCourses] = useState<Course[]>([]);
    const [sessions, setSessions] = useState<CourseSession[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingSessions, setLoadingSessions] = useState(false);
    const [pendingRequests, setPendingRequests] = useState<string[]>([]);
    const [attestationSent, setAttestationSent] = useState(false);
    const [attestationLoading, setAttestationLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!userEmail) { setIsLoading(false); return; }
            try {
                const [coursesRes, profileRes] = await Promise.all([
                    fetch(`/api/user/courses?email=${encodeURIComponent(userEmail)}`, { cache: 'no-store' }),
                    fetch(`/api/user/profile?userId=${encodeURIComponent(userEmail)}`)
                ]);
                const coursesData = await coursesRes.json();
                const profileData = await profileRes.json();
                if (Array.isArray(coursesData)) setCourses(coursesData);
                if (profileData.success && profileData.profile?.workshopAccessRequests) {
                    setPendingRequests(profileData.profile.workshopAccessRequests);
                }
            } catch (e) { console.error(e); }
            finally { setIsLoading(false); }
        };
        fetchData();
    }, [userEmail]);

    const requestAccess = async (courseId: string, courseTitle: string) => {
        try {
            const res = await fetch('/api/user/workshop-access/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userEmail, courseId })
            });
            const data = await res.json();
            if (data.success) {
                setPendingRequests(prev => [...prev, courseId]);
                // Send notification to admin
                await fetch('/api/admin/notifications', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: 'New Workshop Access Request',
                        message: `${userEmail} (Professional) requested access for: ${courseTitle}`,
                        type: 'booking'
                    })
                }).catch(() => {});
            }
        } catch (e) { console.error(e); }
    };

    const openCourse = async (course: Course) => {
        const email = userEmail.toLowerCase().trim();
        const allowed = (course.allowedUsers || []).map((u: string) => u.toLowerCase().trim());
        const isAllowed = allowed.length === 0 || allowed.includes(email);
        if (!isAllowed || !course.isAccessOpen) {
            alert(isRTL ? "لا يمكن الوصول إلى هذه الورشة حتى الآن." : "Access not available yet.");
            return;
        }
        setSelectedCourse(course);
        setAttestationSent(false);
        setLoadingSessions(true);
        try {
            const res = await fetch(`/api/admin/sessions?courseId=${course._id}`);
            const data = await res.json();
            if (Array.isArray(data)) setSessions(data);
        } catch (e) { console.error(e); }
        finally { setLoadingSessions(false); }
    };

    const requestAttestation = async () => {
        if (!selectedCourse) return;
        setAttestationLoading(true);
        try {
            const res = await fetch('/api/user/workshop-attestation/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userEmail, workshopTitle: selectedCourse.title })
            });
            const data = await res.json();
            if (data.success) setAttestationSent(true);
        } catch (e) { console.error(e); }
        finally { setAttestationLoading(false); }
    };

    if (selectedCourse) {
        return (
            <div className="space-y-8 pb-12">
                <button onClick={() => setSelectedCourse(null)} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[11px] font-black uppercase tracking-widest">{isRTL ? "العودة للورشات" : "Back to Workshops"}</span>
                </button>

                <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-100 dark:border-white/5 shadow-xl space-y-6">
                    <div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter">{selectedCourse.title}</h2>
                        <div className="flex items-center gap-6 text-sm text-slate-500 font-bold mt-3">
                            <span className="flex items-center gap-2"><User size={14} /> {selectedCourse.instructor}</span>
                            <span className="flex items-center gap-2"><Video size={14} /> {selectedCourse.sessions || 0} {isRTL ? "جلسات" : "sessions"}</span>
                        </div>
                    </div>

                    {loadingSessions ? (
                        <div className="py-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-rose-500" /></div>
                    ) : sessions.length === 0 ? (
                        <div className="py-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl">
                            {isRTL ? "لا توجد جلسات مسجّلة بعد." : "No recorded sessions yet."}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {sessions.map((s, i) => (
                                <div key={s._id} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-rose-200 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-black text-sm">{i + 1}</div>
                                        <div>
                                            <p className="font-bold text-slate-900">{s.title}</p>
                                            {s.duration && <p className="text-xs text-slate-400">{s.duration}</p>}
                                        </div>
                                    </div>
                                    <a href={s.videoUrl} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-rose-600 transition-all shadow-md">
                                        <PlayCircle size={14} /> {isRTL ? "مشاهدة" : "Watch Replay"}
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── ATTESTATION BLOCK (identical to student page) ── */}
                {sessions.length > 0 && (
                    <div className="bg-slate-900 rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-slate-900/30 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                        <div className="relative z-10 space-y-2">
                            <div className="flex items-center gap-2 text-rose-400">
                                <Award size={20} />
                                <span className="text-[10px] font-black uppercase tracking-widest">
                                    {isRTL ? "شهادة الحضور" : "Attestation of Completion"}
                                </span>
                            </div>
                            <h3 className="text-2xl font-black">
                                {isRTL ? "احصل على شهادتك" : "Get Your Certificate"}
                            </h3>
                            <p className="text-slate-400 text-sm font-medium">
                                {isRTL
                                    ? "بعد إتمام الجلسات، يمكنك طلب شهادة إتمام الورشة الرسمية."
                                    : "After completing the sessions, request your official workshop attestation."}
                            </p>
                        </div>
                        <div className="relative z-10">
                            {attestationSent ? (
                                <div className="flex items-center gap-3 px-8 py-4 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl">
                                    <CheckCircle2 size={18} className="text-emerald-400" />
                                    <span className="text-emerald-300 font-black text-sm uppercase tracking-widest">
                                        {isRTL ? "تم إرسال الطلب!" : "Request Sent!"}
                                    </span>
                                </div>
                            ) : (
                                <button
                                    onClick={requestAttestation}
                                    disabled={attestationLoading}
                                    className="px-10 py-4 bg-rose-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-rose-500 hover:scale-105 transition-all flex items-center gap-3 disabled:opacity-50"
                                >
                                    {attestationLoading ? <Loader2 size={16} className="animate-spin" /> : <Award size={16} />}
                                    {isRTL ? "طلب الشهادة" : "Request Attestation"}
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black uppercase tracking-tighter">{isRTL ? "الورشات الاستراتيجية" : "Strategic Workshops"}</h2>
                    <p className="text-slate-500 text-sm font-medium">{isRTL ? "جلسات مكثفة لمعالجة الثغرات المكتشفة في تشخيصك." : "Intensive sessions designed to close the gaps in your diagnosis."}</p>
                </div>
                <div className="px-6 py-3 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
                    <PlayCircle size={14} className="text-rose-500" /> {courses.length} {isRTL ? "ورش عمل" : "Workshops"}
                </div>
            </div>

            {isLoading ? (
                <div className="py-20 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto text-rose-500" /></div>
            ) : courses.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 md:p-16 border border-slate-100 dark:border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-rose-500 to-indigo-600" />
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-4xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 shrink-0 shadow-lg">
                                <ShieldCheck size={32} />
                            </div>
                            <div>
                                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white leading-tight">
                                    {isRTL ? "بروتوكول تخصيص المهام الاستراتيجية (DIGNNOS- التخصيص)" : "Strategic Task Allocation Protocol (DIGNNOS- Allocation)"}
                                </h3>
                                <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-black uppercase tracking-widest border border-amber-500/20">
                                    <Sparkles size={12} /> {isRTL ? "خدمة مدفوعة مميزة" : "Premium Paid Service"}
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-3">
                            <a href="mailto:support@matc.com" className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-indigo-600 hover:text-white transition-all">
                                <Send size={14} /> {isRTL ? "دعم عبر البريد" : "Email Support"}
                            </a>
                            <a href="#" className="flex items-center gap-2 px-6 py-3 bg-emerald-500/10 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all">
                                <Globe size={14} /> WhatsApp
                            </a>
                        </div>
                    </div>

                    <div className="max-w-4xl">
                        <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-12 font-medium">
                            {isRTL 
                              ? "يبدأ خبراؤنا بتصميم مهمتك الاستراتيجية فور تواصلك معنا. ثم نصمم لك \"محاكاة دور تنفيذي\" مخصصة بالكامل، حيث ستواجه مهامًا مهنية واقعية وتحديات استراتيجية مصممة خصيصًا لنتائج تشخيصك."
                              : "Our experts begin designing your strategic mission immediately upon contact. We then design a fully customized 'Executive Role Simulation' where you will face realistic professional tasks and strategic challenges tailored to your diagnosis."
                            }
                        </p>

                        <div className="grid sm:grid-cols-2 gap-6 mb-12">
                            {[
                                {
                                    id: "1",
                                    titleAr: "تصميم السيناريو (24-72 ساعة)",
                                    titleEn: "Scenario Design (24-72 hours)",
                                    descAr: "يقوم الخبير ببناء سياق \"المهمة الاستراتيجية\" ويحدد المهام التكتيكية بناءً على نتائج التشخيص العميق التي توصلت إليها.",
                                    descEn: "The expert builds the 'Strategic Mission' context and defines tactical tasks based on your deep diagnosis results."
                                },
                                {
                                    id: "2",
                                    titleAr: "محاكاة فائقة التخصيص",
                                    titleEn: "Ultra-Personalized Simulation",
                                    descAr: "صُممت هذه المهمة خصيصاً لك. وتُعدّ التفاعلات الجماعية وحدةً خاصةً لتعلم \"قيادة الفريق\" والتنفيذ التعاوني.",
                                    descEn: "This mission is designed specifically for you. Group interactions are a special unit for learning 'Team Leadership' and collaboration."
                                },
                                {
                                    id: "3",
                                    titleAr: "المرونة التكتيكية",
                                    titleEn: "Tactical Flexibility",
                                    descAr: "اختر بين مهمة فردية مركزة أو سيناريو بقيادة فريق. أنت تتحكم في نطاق المهمة والاستثمار.",
                                    descEn: "Choose between a focused individual mission or a team-led scenario. You control the scope and investment of the mission."
                                },
                                {
                                    id: "4",
                                    titleAr: "نشر المهمة (7 أيام)",
                                    titleEn: "Mission Deployment (7 days)",
                                    descAr: "بمجرد الانتهاء من تصميم هيكل المهمة، يبدأ النشر في غضون 7 أيام من التأكيد.",
                                    descEn: "Once the mission structure design is complete, deployment begins within 7 days of confirmation."
                                }
                            ].map((step, idx) => (
                                <div key={idx} className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 group hover:border-indigo-500/30 transition-all">
                                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-black mb-4 shadow-lg shadow-indigo-600/20">
                                        {step.id}
                                    </div>
                                    <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white mb-2">
                                        {isRTL ? step.titleAr : step.titleEn}
                                    </h4>
                                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                                        {isRTL ? step.descAr : step.descEn}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="p-8 rounded-3xl bg-slate-900 text-white relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 rounded-full blur-3xl" />
                           <div className="relative z-10 flex items-start gap-4">
                               <AlertCircle size={18} className="text-indigo-400 shrink-0 mt-0.5" />
                               <p className="text-[11px] font-bold text-slate-300 leading-relaxed italic">
                                  {isRTL 
                                    ? "* ملاحظة: مهمة CareerUpgrade.AI هي خدمة متميزة تتضمن إرشادات مباشرة من الخبراء ومحاكاة معتمدة."
                                    : "* Note: The CareerUpgrade.AI mission is a premium service that includes direct expert guidance and certified simulations."
                                  }
                               </p>
                           </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-8">
                    {courses.map((course) => {
                        const email = (userEmail || "").toLowerCase().trim();
                        const allowed = (course.allowedUsers || []).map((u: string) => u.toLowerCase().trim());
                        const isAllowed = allowed.length === 0 || allowed.includes(email);
                        const isOpen = course.isAccessOpen;
                        return (
                            <div key={course._id} className="group bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-100 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-3xl -mr-16 -mt-16 bg-rose-500" />
                                <div className="relative z-10 space-y-6">
                                    <div className="flex items-start justify-between">
                                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl bg-rose-600 shadow-rose-500/20">
                                            <Zap size={24} />
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full text-[8px] font-black uppercase tracking-widest">
                                                {course.sessions || 0} {isRTL ? "جلسات" : "sessions"}
                                            </span>
                                            {isOpen && isAllowed && (
                                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[8px] font-black uppercase tracking-widest">
                                                    {isRTL ? "مفتوح" : "Open"}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-black uppercase tracking-tight group-hover:text-rose-500 transition-colors">{course.title}</h3>
                                        <div className="flex items-center gap-4 text-sm text-slate-500 font-bold">
                                            <span className="flex items-center gap-1"><User size={12} /> {course.instructor}</span>
                                            {course.date && <span className="flex items-center gap-1"><Calendar size={12} /> {course.date}</span>}
                                        </div>
                                    </div>
                                    {/* Access Button */}
                                    {isAllowed && isOpen ? (
                                        <button
                                            onClick={() => openCourse(course)}
                                            className="w-full py-4 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all bg-slate-900 dark:bg-white dark:text-slate-900 text-white hover:bg-rose-600 hover:gap-5"
                                        >
                                            {isRTL ? "دخول الورشة" : "Access Workshop"} <ChevronRight size={14} />
                                        </button>
                                    ) : isAllowed && !isOpen ? (
                                        <div className="w-full py-4 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 bg-slate-100 text-slate-400">
                                            <Clock size={14} /> {isRTL ? "لم تفتح بعد" : "Not Started Yet"}
                                        </div>
                                    ) : pendingRequests.includes(course._id) ? (
                                        <div className="w-full py-4 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 bg-emerald-50 text-emerald-600 border border-emerald-200">
                                            <CheckCircle size={14} /> {isRTL ? "تم إرسال الطلب" : "Request Sent"}
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => requestAccess(course._id, course.title)}
                                            className="w-full py-4 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-600 hover:text-white hover:border-rose-600"
                                        >
                                            <Send size={14} /> {isRTL ? "طلب الوصول" : "Request Access"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// ─── SESSIONS (Real admin sessions for this user) ───────────────────────────────
function Sessions({ isRTL, userEmail }: { isRTL: boolean; userEmail: string }) {
    const [sessions, setSessions] = useState<AdminSession[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSessions = async () => {
            if (!userEmail) { setIsLoading(false); return; }
            try {
                const res = await fetch(`/api/admin/sessions?userId=${encodeURIComponent(userEmail)}`);
                const data = await res.json();
                if (data.success && Array.isArray(data.sessions)) setSessions(data.sessions);
            } catch (e) { console.error(e); }
            finally { setIsLoading(false); }
        };
        fetchSessions();
    }, [userEmail]);

    return (
        <div className="space-y-12 pb-12">
            <div className="space-y-2">
                <h2 className="text-3xl font-black uppercase tracking-tighter">{isRTL ? "الجلسات الاستراتيجية المباشرة" : "Live Strategic Sessions"}</h2>
                <p className="text-slate-500 text-sm font-medium">{isRTL ? "جلساتك الخاصة مع الخبراء التنفيذيين." : "Your personal sessions with executive experts."}</p>
            </div>

            {isLoading ? (
                <div className="py-20 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto text-rose-500" /></div>
            ) : sessions.length === 0 ? (
                <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-white/10 space-y-4">
                    <Video size={48} className="mx-auto text-slate-300" />
                    <p className="text-slate-500 font-medium">{isRTL ? "لا توجد جلسات مجدولة لحسابك حتى الآن." : "No sessions scheduled for your account yet."}</p>
                    <p className="text-slate-400 text-xs">{isRTL ? "سيقوم المسؤول بجدولة جلساتك قريباً." : "The admin will schedule your sessions soon."}</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-8">
                    {sessions.map((session, i) => {
                        const sessionDate = session.date ? new Date(`${session.date}T${session.time || '00:00'}`) : null;
                        const now = new Date();
                        const isUpcoming = sessionDate ? sessionDate > now : true;
                        return (
                            <motion.div
                                key={session._id || i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-xl space-y-6 relative overflow-hidden group"
                            >
                                <div className={cn("absolute top-0 left-0 w-full h-1 rounded-t-[2.5rem]", isUpcoming ? "bg-rose-500" : "bg-emerald-500")} />
                                <div className="flex items-start justify-between">
                                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", isUpcoming ? "bg-rose-600" : "bg-emerald-600")}>
                                        <Video size={22} />
                                    </div>
                                    <span className={cn("px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5",
                                        isUpcoming ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                    )}>
                                        <div className={cn("w-1.5 h-1.5 rounded-full", isUpcoming ? "bg-rose-500 animate-pulse" : "bg-emerald-500")} />
                                        {isUpcoming ? (isRTL ? "قادمة" : "Upcoming") : (isRTL ? "منتهية" : "Completed")}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-black uppercase tracking-tight">{session.title}</h3>
                                    <div className="space-y-2 text-sm text-slate-500 font-bold">
                                        <div className="flex items-center gap-2"><User size={13} className="text-slate-400" /> {session.expertName}</div>
                                        <div className="flex items-center gap-2"><Calendar size={13} className="text-slate-400" /> {session.date}</div>
                                        <div className="flex items-center gap-2"><Clock size={13} className="text-slate-400" /> {session.time}</div>
                                    </div>
                                </div>
                                {session.meetingLink ? (
                                    <a
                                        href={session.meetingLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-rose-600 transition-all"
                                    >
                                        <PlayCircle size={16} /> {isRTL ? "انضم للجلسة" : "Join Session"}
                                    </a>
                                ) : (
                                    <div className="w-full py-4 bg-slate-100 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3">
                                        <Clock size={16} /> {isRTL ? "الرابط سيُضاف قريباً" : "Link coming soon"}
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// ─── RESOURCES (Real lib + tools from admin) ────────────────────────────────────
function Resources({ isRTL }: { isRTL: boolean }) {
    const [resources, setResources] = useState<Resource[]>([]);
    const [tools, setTools] = useState<Tool[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"documents" | "tools">("documents");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [libRes, toolsRes] = await Promise.all([
                    fetch('/api/admin/library'),
                    fetch('/api/admin/tools')
                ]);
                const libData = await libRes.json();
                const toolsData = await toolsRes.json();
                if (Array.isArray(libData)) setResources(libData);
                if (Array.isArray(toolsData)) setTools(toolsData);
            } catch (e) { console.error(e); }
            finally { setIsLoading(false); }
        };
        fetchData();
    }, []);

    const items = activeTab === "documents" ? resources : tools;

    return (
        <div className="space-y-12 pb-12">
            <div className="space-y-2">
                <h2 className="text-3xl font-black uppercase tracking-tighter">{isRTL ? "الأصول الاستراتيجية" : "The Vault: Strategic Assets"}</h2>
                <p className="text-slate-500 text-sm font-medium">{isRTL ? "جميع الأدوات والوثائق المتاحة لدعم مسيرتك." : "All tools and documents available to support your journey."}</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl w-fit">
                <button onClick={() => setActiveTab("documents")}
                    className={cn("px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                        activeTab === "documents" ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-400 hover:text-slate-600"
                    )}>
                    <FileText size={14} /> {isRTL ? "وثائق" : "Documents"}
                </button>
                <button onClick={() => setActiveTab("tools")}
                    className={cn("px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                        activeTab === "tools" ? "bg-white dark:bg-slate-800 text-rose-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                    )}>
                    <Sparkles size={14} /> {isRTL ? "أدوات الذكاء الاصطناعي" : "AI Tools"}
                </button>
            </div>

            {isLoading ? (
                <div className="py-20 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto text-rose-500" /></div>
            ) : items.length === 0 ? (
                <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-white/10 space-y-4">
                    <Briefcase size={48} className="mx-auto text-slate-300" />
                    <p className="text-slate-500 font-medium">
                        {activeTab === "documents"
                            ? (isRTL ? "لا توجد وثائق متاحة حتى الآن." : "No documents available yet.")
                            : (isRTL ? "لا توجد أدوات متاحة حتى الآن." : "No AI tools available yet.")}
                    </p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item, i) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="group bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-lg flex flex-col gap-6 hover:shadow-2xl transition-all hover:-translate-y-1"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                                {activeTab === "documents" ? <FileText className="text-rose-500" size={24} /> : <Globe className="text-blue-500" size={24} />}
                            </div>
                            <div className="flex-1 space-y-2">
                                <h3 className="font-black uppercase tracking-tight text-slate-800 dark:text-white leading-tight">{item.title}</h3>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">{item.description || item.category}</p>
                            </div>
                            <a
                                href={(item as Resource).url || (item as Tool).url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 dark:hover:bg-rose-600 dark:hover:text-white transition-all"
                            >
                                {activeTab === "documents" ? <Download size={14} /> : <ExternalLink size={14} />}
                                {activeTab === "documents" ? (isRTL ? "تحميل" : "Download") : (isRTL ? "فتح الأداة" : "Launch Tool")}
                            </a>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── ATTESTATIONS ───────────────────────────────────────────────────────────────

function Attestations({ isRTL, userEmail }: { isRTL: boolean; userEmail: string }) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-12">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group cursor-pointer"
            >
                <div className="absolute -inset-10 bg-rose-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="w-32 h-32 rounded-[2.5rem] bg-slate-900 flex items-center justify-center relative z-10 shadow-2xl group-hover:scale-110 transition-transform duration-500 border border-white/5">
                    <Award className="text-rose-500" size={56} />
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center z-20 animate-bounce">
                    <Sparkles className="text-rose-500" size={24} />
                </div>
            </motion.div>

            <div className="text-center space-y-4 max-w-2xl px-6">
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight">
                    {isRTL ? "احصل على وثائقك الرسمية" : "Get Your Official Documents"}
                </h2>
                <p className="text-slate-500 font-medium text-lg leading-relaxed">
                    {isRTL 
                        ? "بوابة الوصول السريع إلى جميع شهاداتك، خطابات التوصية، والتقارير الاستراتيجية المعتمدة." 
                        : "Your gateway to all official certificates, letters of recommendation, and certified strategic reports."}
                </p>
            </div>

            <Link 
                href={`/attestations?layout=pro&userId=${encodeURIComponent(userEmail)}`}
                className="group relative px-12 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-4xl font-black uppercase text-sm tracking-[0.3em] shadow-2xl hover:bg-rose-600 dark:hover:bg-rose-600 dark:hover:text-white transition-all overflow-hidden"
            >
                <span className="relative z-10 flex items-center gap-4">
                    {isRTL ? "دخول بوابة المستندات" : "Enter Documents Portal"}
                    <ChevronRight size={20} className={cn("transition-transform", isRTL ? "rotate-180 group-hover:-translate-x-2" : "group-hover:translate-x-2")} />
                </span>
                <div className="absolute inset-0 bg-rose-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Link>

            <div className="grid grid-cols-3 gap-8 pt-12">
                {[
                    { icon: <Award className="text-amber-500" />, label: isRTL ? "شهادات معتمدة" : "Accredited Certs" },
                    { icon: <ShieldCheck className="text-blue-500" />, label: isRTL ? "خطاب توصية" : "Recommendations" },
                    { icon: <FileText className="text-emerald-500" />, label: isRTL ? "تقارير رسمية" : "Official Reports" }
                ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                            {React.cloneElement(item.icon as React.ReactElement<{ size?: number }>, { size: 18 })}
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}



// ─── TECHNICAL AI EXPERT (Strategic Workshop & Content Generator) ──────────
function TechnicalAI({ report, isRTL, userEmail }: { report: FinalReport, isRTL: boolean, userEmail: string }) {
    const [query, setQuery] = useState("");
    const [generatedContent, setGeneratedContent] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleGenerate = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!query.trim() || isGenerating) return;

        setIsGenerating(true);
        setGeneratedContent(null);

        try {
            const techContext = `User Position: ${report.marketValue || 'Executive'}. Domain: ${(report.recommendedRoles || []).join(', ')}.
            Goal: Generate a high-level, structured TRAINING COURSE or DETAILED TECHNICAL REPORT based on the user's prompt.
            Structure: Use headings, bullet points, and strategic modules. Format it for an elite professional.`;

            const response = await fetch("/api/expert/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [
                        { 
                            role: 'system', 
                            content: `You are an Elite Instructional Designer and Technical Solutions Architect. ${techContext}. 
                            Provide the response in a structured course/report format.
                            IMPORTANT: Use simple, direct, and accessible language (كلام ساهل). 
                            Avoid niche or irrelevant geographic examples (e.g., Nigerian). 
                            Use general examples or none at all if not necessary. 
                            The user wants to understand easily without complex jargon.` 
                        },
                        { role: 'user', content: `Please generate a detailed technical training course or strategic report on: ${query}` }
                    ],
                    language: isRTL ? 'ar' : 'en',
                    expertType: 'technical'
                })
            });

            const data = await response.json();
            if (data.content) {
                setGeneratedContent(data.content);
            }
        } catch (err) {
            console.error("Technical generation error", err);
        } finally {
            setIsGenerating(false);
        }
    };

    if (!mounted) return null;

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-24">
            {/* Executive Header Section - REDESIGNED */}
            <div className="bg-slate-950 rounded-4xl p-16 text-white relative overflow-hidden border border-white/10 text-center shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
                <div className="relative z-10 space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/20 flex items-center justify-center mx-auto shadow-2xl">
                        <Shield size={28} className="text-slate-400" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-4xl font-black uppercase tracking-tighter leading-tight">
                            {isRTL ? "محرر الاستراتيجيات التنفيذية" : "Executive Strategy Architect"}
                        </h2>
                        <div className="w-20 h-1 bg-amber-500/50 mx-auto rounded-full" />
                    </div>
                    <p className="text-slate-400 text-sm font-medium max-w-xl mx-auto tracking-wide">
                        {isRTL 
                            ? "تحويل الرؤى التقنية إلى وثائق استراتيجية معتمدة. أدخل النطاق الهندسي أو الاستراتيجي لتبدأ عملية الهندسة العكسية للمحتوى." 
                            : "Transform technical insights into certified strategic documents. Enter the engineering or strategic scope to begin the content reverse-engineering process."}
                    </p>
                </div>
            </div>

            {!generatedContent ? (
                <div className="space-y-16">
                    {/* Input Form - Architectural Design */}
                    <form onSubmit={handleGenerate} className="max-w-3xl mx-auto -mt-16 relative z-20">
                        <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-white/5 flex flex-col md:flex-row gap-3">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder={isRTL ? "ما هو النطاق الاستراتيجي المطلوب؟..." : "Define the strategic scope..."}
                                className="flex-1 bg-transparent py-5 px-8 text-lg font-bold outline-hidden text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700"
                            />
                            <button
                                type="submit"
                                disabled={!query.trim() || isGenerating}
                                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-12 py-5 rounded-xl font-black uppercase tracking-widest hover:bg-amber-600 dark:hover:bg-amber-600 dark:hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {isGenerating ? <Loader2 className="animate-spin" /> : <Award size={18} />}
                                {isRTL ? "بدء البناء" : "Begin Build"}
                            </button>
                        </div>
                    </form>

                    {/* Quick Suggestions - Minimalist */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            { textAr: "بروتوكول إدارة الأزمات التقنية", textEn: "Technical Crisis Management Protocol", icon: <Shield size={20} /> },
                            { textAr: "هندسة النطاق الوظيفي المتقدم", textEn: "Advanced Functional Scope Engineering", icon: <Layout size={20} /> },
                            { textAr: "نموذج التشغيل الرقمي الموحد", textEn: "Unified Digital Operating Model", icon: <Briefcase size={20} /> }
                        ].map((s, i) => (
                            <button 
                                key={i}
                                onClick={() => { setQuery(isRTL ? s.textAr : s.textEn); handleGenerate(); }}
                                className="group p-8 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-white/5 text-left flex flex-col gap-6 hover:border-amber-500/50 transition-all duration-500 shadow-sm hover:shadow-2xl"
                            >
                                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-amber-500 transition-colors">
                                    {s.icon}
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{isRTL ? "قالب استراتيجي" : "STRATEGIC TEMPLATE"}</h4>
                                    <p className="text-sm font-bold text-slate-900 dark:text-slate-200 leading-tight">
                                        {isRTL ? s.textAr : s.textEn}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                /* Generated Content Result - UPGRADED EXECUTIVE DESIGN */
                <motion.div 
                    key="generated-content"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group"
                >
                    {/* Background Decorative Elements */}
                    <div className="absolute -inset-4 bg-slate-200/50 dark:bg-slate-800/20 rounded-[3rem] blur-2xl opacity-50" />
                    
                    <div className="relative bg-white dark:bg-slate-950 rounded-4xl border border-slate-200 dark:border-white/5 shadow-2xl overflow-hidden">
                        {/* Professional Metadata / Cover Section - Redesigned to be serious */}
                        <div className="p-12 md:p-16 border-b border-slate-50 dark:border-white/10 bg-slate-950 text-white flex flex-col md:flex-row items-center gap-10">
                            <div className="w-24 h-24 rounded-2xl bg-slate-900 border border-white/20 flex items-center justify-center shrink-0">
                                <Award size={40} className="text-amber-500" />
                            </div>
                            <div className="text-center md:text-right flex-1 space-y-4">
                                <div className="inline-block px-4 py-1 rounded-full bg-white/5 text-slate-400 text-[9px] font-black uppercase tracking-[0.3em] border border-white/10">
                                    {isRTL ? "وثيقة استراتيجية معتمدة" : "CERTIFIED STRATEGIC DOCUMENT"}
                                </div>
                                <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-tight text-white">
                                    {query}
                                </h3>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                                    <span className="flex items-center gap-2 underline decoration-amber-500/50 flex-row-reverse">{isRTL ? "النطاق:" : "SCOPE:"} {report.marketValue || 'N/A'}</span>
                                    <span className="flex items-center gap-2 underline decoration-amber-500/50 flex-row-reverse">{isRTL ? "التصنيف:" : "CLASSIFIED:"} MATC-INTERNAL</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Toolbar - Business Style */}
                        <div className="p-4 bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 flex items-center justify-center gap-6">
                            <button 
                                onClick={() => { setGeneratedContent(null); setQuery(""); }}
                                className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-2"
                            >
                                <ArrowLeft size={14} className={isRTL ? "rotate-180" : ""} /> {isRTL ? "مسار جديد" : "NEW PATH"}
                            </button>
                            <div className="w-px h-6 bg-slate-200 dark:bg-white/10" />
                            <button 
                                onClick={() => window.print()}
                                className="px-10 py-3 rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 dark:hover:bg-amber-600 dark:hover:text-white transition-all flex items-center gap-3"
                            >
                                <Download size={16} /> {isRTL ? "تصدير بصيغة PDF" : "EXPORT AS PDF"}
                            </button>
                        </div>

                        {/* Content Area - Architectural Strategic Layout */}
                        <div className="p-10 md:p-20 space-y-20">
                            {generatedContent?.split('\n\n').map((block, idx) => {
                                const isHeader = block.trim().startsWith('#');
                                
                                if (isHeader) {
                                    const text = block.replace(/^#+\s*/, '').trim();
                                    return (
                                        <div key={idx} className="space-y-6 pt-10 border-t border-slate-100 dark:border-white/5">
                                            <div className="flex items-center gap-4">
                                                <span className="text-4xl font-black text-slate-200 dark:text-white/5 tabular-nums">{String(idx + 1).padStart(2, '0')}</span>
                                                <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
                                                    {text}
                                                </h2>
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={idx} className="relative group">
                                        <div className="pl-8 border-l-2 border-slate-100 dark:border-white/5 group-hover:border-amber-500/50 transition-colors">
                                            <div className="prose prose-slate dark:prose-invert max-w-none prose-p:text-lg prose-p:font-medium prose-p:leading-relaxed prose-li:font-bold prose-li:text-slate-600 dark:prose-li:text-slate-400 whitespace-pre-wrap selection:bg-amber-500/20">
                                                {block}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer Disclaimer */}
                        <div className="p-8 bg-slate-950 text-center">
                            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.5em] mb-4">
                                {isRTL ? "تم إنشاؤه بواسطة هندسة الاستراتيجية - MATC" : "BY STRATEGIC ARCHITECTURE - MATC"}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}


