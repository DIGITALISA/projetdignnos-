"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Loader2,
  Bot,
  User,
  Brain,
  Clock,
  AlertTriangle,
  ChevronRight,
  Mic,
  Shield,
  FileText,
  TrendingUp,
  Target,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Timer,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────
interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isTimeout?: boolean;
}

interface UserProfile {
  id?: string;
  fullName?: string;
  email?: string;
  plan?: string;
}

type Phase = "welcome" | "active" | "report";

// ── Timer config ───────────────────────────────────────────────────────
const QUESTION_TIME_SECONDS = 5 * 60; // 5 minutes

// ── Report parser ──────────────────────────────────────────────────────
function parseReport(content: string) {
  const start = content.indexOf("---RAPPORT_DEBUT---");
  const end = content.indexOf("---RAPPORT_FIN---");
  if (start !== -1 && end !== -1) {
    return content.substring(start + 19, end).trim();
  }
  if (content.includes("RAPPORT DIAGNOSTIQUE")) {
    return content;
  }
  return null;
}

// ── Markdown-like renderer (basic) ─────────────────────────────────────
function RenderReport({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        if (line.startsWith("## ")) {
          return (
            <h2 key={i} className="text-xl font-black text-white mt-6 mb-3">
              {line.replace("## ", "")}
            </h2>
          );
        }
        if (line.startsWith("### ")) {
          const sectionTitle = line.replace("### ", "");
          let color = "text-slate-300";
          let border = "border-slate-700/40";
          let bg = "bg-slate-800/40";
          if (sectionTitle.includes("FORTS") || sectionTitle.includes("✅") || sectionTitle.includes("القوة")) {
            color = "text-emerald-300"; border = "border-emerald-500/30"; bg = "bg-emerald-500/5";
          } else if (sectionTitle.includes("FAIBLESSE") || sectionTitle.includes("⚠️") || sectionTitle.includes("التحسين")) {
            color = "text-amber-300"; border = "border-amber-500/30"; bg = "bg-amber-500/5";
          } else if (sectionTitle.includes("LACUNES") || sectionTitle.includes("🕳️") || sectionTitle.includes("الفجوات")) {
            color = "text-red-300"; border = "border-red-500/30"; bg = "bg-red-500/5";
          } else if (sectionTitle.includes("CONTRADICTION") || sectionTitle.includes("🔄") || sectionTitle.includes("تناقض")) {
            color = "text-orange-300"; border = "border-orange-500/30"; bg = "bg-orange-500/5";
          } else if (sectionTitle.includes("DÉVELOPPEMENT") || sectionTitle.includes("📈") || sectionTitle.includes("المسار") || sectionTitle.includes("توصيات")) {
            color = "text-blue-300"; border = "border-blue-500/30"; bg = "bg-blue-500/5";
          } else if (sectionTitle.includes("ÉVALUATION") || sectionTitle.includes("🎯") || sectionTitle.includes("التقييم") || sectionTitle.includes("النقاط")) {
            color = "text-violet-300"; border = "border-violet-500/30"; bg = "bg-violet-500/5";
          } else if (sectionTitle.includes("VERDICT") || sectionTitle.includes("💬") || sectionTitle.includes("كلمة") || sectionTitle.includes("تصنيف")) {
            color = "text-indigo-300"; border = "border-indigo-500/30"; bg = "bg-indigo-500/5";
          }
          return (
            <div key={i} className={`mt-5 mb-2 px-4 py-2 rounded-xl border ${border} ${bg}`}>
              <h3 className={`font-black text-sm uppercase tracking-wider ${color}`}>{sectionTitle}</h3>
            </div>
          );
        }
        if (line.startsWith("- ") || line.startsWith("• ")) {
          return (
            <div key={i} className="flex gap-2 ml-2">
              <span className="text-slate-500 shrink-0 mt-1">→</span>
              <p className="text-slate-300 text-sm leading-relaxed">{line.replace(/^[-•] /, "")}</p>
            </div>
          );
        }
        if (line.startsWith("[")) {
          return null; // placeholders
        }
        if (line.trim() === "") return <div key={i} className="h-1" />;
        return (
          <p key={i} className="text-slate-300 text-sm leading-relaxed">
            {line}
          </p>
        );
      })}
    </div>
  );
}

// ── Countdown Timer Component ──────────────────────────────────────────
function CountdownTimer({
  seconds,
  onTimeout,
  isPaused,
}: {
  seconds: number;
  onTimeout: () => void;
  isPaused: boolean;
}) {
  const [remaining, setRemaining] = useState(seconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onTimeoutRef = useRef(onTimeout);

  // Keep ref up-to-date without causing render issues
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  });

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          onTimeoutRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, seconds]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const pct = (remaining / seconds) * 100;
  const isWarning = remaining <= 60;
  const isCritical = remaining <= 20;

  return (
    <div
      className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border transition-all ${
        isCritical
          ? "bg-red-500/10 border-red-500/40"
          : isWarning
          ? "bg-amber-500/10 border-amber-500/30"
          : "bg-slate-800/60 border-slate-700/40"
      }`}
    >
      <Timer
        className={`w-4 h-4 shrink-0 ${
          isCritical ? "text-red-400 animate-pulse" : isWarning ? "text-amber-400" : "text-slate-500"
        }`}
      />
      <div className="flex flex-col gap-1 min-w-[80px]">
        <div
          className={`font-black text-sm tabular-nums ${
            isCritical ? "text-red-400" : isWarning ? "text-amber-400" : "text-slate-400"
          }`}
        >
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </div>
        <div className="w-full h-1 bg-slate-700/60 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              isCritical ? "bg-red-500" : isWarning ? "bg-amber-500" : "bg-violet-500"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      {isCritical && (
        <span className="text-red-400 text-[9px] font-black uppercase tracking-widest animate-pulse">
          ⚡ FIN
        </span>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────
export default function ExpertDashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [phase, setPhase] = useState<Phase>("welcome");
  const [messageCount, setMessageCount] = useState(0);
  const [timerKey, setTimerKey] = useState(0); // reset timer by changing key
  const [timerPaused, setTimerPaused] = useState(true);
  const [timeoutCount, setTimeoutCount] = useState(0);
  const [reportContent, setReportContent] = useState<string | null>(null);
  const [interviewStarted, setInterviewStarted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load profile
  useEffect(() => {
    const saved = localStorage.getItem("userProfile");
    if (saved) setProfile(JSON.parse(saved));
  }, []);

  // Scroll to bottom on new messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // ── Start interview ──
  const startInterview = () => {
    setInterviewStarted(true);
    setPhase("active");
    setIsLoading(true);

    const opening: Message = {
      role: "assistant",
      content:
        "مرحباً بك.\n\nأنا خبيرك التقييمي لليوم. سنقوم بإجراء مقابلة تشخيصية مهنية متعمقة لتحديد مستواك الحقيقي كخبير أو مدرب.\n\n**هدفي هو تشخيص قدراتك بدقة، تحديد نقاط قوتك، واكتشاف الثغرات التي قد تحتاج لتطويرها. سيتم تقييمك بناءً على نظام 100 نقطة يغطي الخبرة، المعرفة التقنية، المهارات البيداغوجية، والتفكير الاستراتيجي.**\n\nكل سؤال لديه مهلة **5 دقائق**. عدم الرد في الوقت المحدد يعتبر بياناً مهماً في تقييم الجاهزية.\n\nكن دقيقاً، واقعياً، واستعد للتحدي.\n\n---\n\n**لنبدأ بالمرحلة الصفر: يرجى التعريف بنفسك، مجالك الدقيق، وسنوات خبرتك الحقيقية. وهل تعتبر نفسك مدرباً أم خبيراً أم كلاهما؟ وما هي فئتك المستهدفة؟**",
      timestamp: new Date(),
    };

    setMessages([opening]);
    setMessageCount(1);
    setIsLoading(false);
    setTimerPaused(false); // start timer
    setTimerKey((k) => k + 1);
    setTimeout(() => inputRef.current?.focus(), 300);
  };

  // ── Send message ──
  const sendMessage = useCallback(
    async (overrideText?: string) => {
      const text = (overrideText ?? inputValue).trim();
      if ((!text && !overrideText) || isLoading) return;

      const isTimeout = overrideText === "[TIMEOUT]";

      const userMsg: Message = {
        role: "user",
        content: text,
        timestamp: new Date(),
        isTimeout,
      };

      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setInputValue("");
      setIsLoading(true);
      setTimerPaused(true); // pause timer while AI responds

      if (isTimeout) setTimeoutCount((c) => c + 1);

      try {
        const apiMessages = newMessages.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const res = await fetch("/api/expert-assessment/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: apiMessages,
            userId: profile?.id,
            language: "fr",
          }),
        });

        const data = await res.json();
        const aiText = data.content || "Une erreur s'est produite.";

        const botMsg: Message = {
          role: "assistant",
          content: aiText,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botMsg]);
        setMessageCount(data.messageCount || messageCount + 2);

        // Check if report generated
        const report = parseReport(aiText);
        if (report || data.isComplete) {
          setReportContent(report ?? aiText);
          setPhase("report");
          setTimerPaused(true);
        } else {
          // Reset timer for next question
          setTimerKey((k) => k + 1);
          setTimerPaused(false);
          setTimeout(() => inputRef.current?.focus(), 200);
        }
      } catch (err) {
        console.error("Chat error:", err);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Une erreur réseau s'est produite. Veuillez réessayer.",
            timestamp: new Date(),
          },
        ]);
        setTimerKey((k) => k + 1);
        setTimerPaused(false);
      } finally {
        setIsLoading(false);
      }
    },
    [inputValue, isLoading, messages, messageCount, profile?.id]
  );

  // ── Timeout handler ──
  const handleTimeout = useCallback(() => {
    sendMessage("[TIMEOUT]");
  }, [sendMessage]);

  // ── Key handler ──
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Progress %
  const progressPct = Math.min((messageCount / 20) * 100, 92);

  // ════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#07090F] flex flex-col text-white">

      {/* ── TOP BAR ── */}
      <div className="sticky top-0 z-30 border-b border-slate-800/60 bg-[#07090F]/90 backdrop-blur-xl px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-linear-to-br from-violet-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-black text-xs tracking-tight">تشخيص الخبير</p>
            <p className="text-slate-600 text-[9px] font-medium">مقابلة تشخيصية ذكاء اصطناعي · مستوى النخبة</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Timeout badge */}
          {interviewStarted && timeoutCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full">
              <Clock className="w-3 h-3 text-red-400" />
              <span className="text-red-400 text-[10px] font-black">{timeoutCount} حالة عدم رد</span>
            </div>
          )}
          {profile && (
            <span className="text-slate-500 text-xs font-medium hidden sm:block">{profile.fullName}</span>
          )}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-violet-300 text-[9px] font-black uppercase tracking-widest">Expert Track</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
           WELCOME SCREEN
      ══════════════════════════════════════════════ */}
      {!interviewStarted && (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full">

            {/* Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-linear-to-br from-violet-600 via-indigo-600 to-blue-700 flex items-center justify-center shadow-2xl shadow-violet-500/30">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center shadow-lg">
                  <span className="text-[8px] font-black text-amber-900">AI</span>
                </div>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-white text-center mb-3 leading-tight tracking-tight">
              المقابلة التشخيصية
              <span className="block text-transparent bg-clip-text bg-linear-to-r from-violet-400 via-indigo-400 to-blue-400">
                للخبراء والمدربين
              </span>
            </h1>

            <p className="text-slate-400 text-center text-base font-medium mb-10 leading-relaxed max-w-lg mx-auto">
              سيقوم خبير ذكاء اصطناعي بإجراء حوار مهني معمق معك 
              وتوليد <strong className="text-slate-200">تقرير تشخيصي</strong> حول نقاط قوتك، فجواتك، ومسارات تطويرك.
            </p>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                {
                  icon: Timer,
                  title: "5 دقائق للسؤال",
                  desc: "كل سؤال له توقيت محدد. الصمت هو جزء من البيانات.",
                  border: "border-amber-500/20",
                  bg: "bg-amber-500/5",
                  ic: "text-amber-400",
                },
                {
                  icon: Target,
                  title: "نظام تقييم (100)",
                  desc: "تقييم شامل يغطي الخبرة، التقنية، التدريب، والاستراتيجية.",
                  border: "border-red-500/20",
                  bg: "bg-red-500/5",
                  ic: "text-red-400",
                },
                {
                  icon: FileText,
                  title: "تقرير احترافي",
                  desc: "في النهاية: نقاط القوة، التحسين، وتصنيف المستوى المهني.",
                  border: "border-violet-500/20",
                  bg: "bg-violet-500/5",
                  ic: "text-violet-400",
                },
              ].map((c) => (
                <div
                  key={c.title}
                  className={`p-5 rounded-2xl border ${c.border} ${c.bg}`}
                >
                  <c.icon className={`w-5 h-5 ${c.ic} mb-3`} />
                  <h3 className="text-white font-bold text-sm mb-1">{c.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>

            {/* Warning */}
            <div className="flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl mb-8">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-slate-400 text-sm leading-relaxed">
                <strong className="text-amber-300">ملاحظة هامة:</strong> هذا التشخيص مصمم ليكون 
                <strong className="text-slate-200"> عادلاً وصارماً</strong>. كل سؤال متاح لـ 5 دقائق فقط. 
                إذا تجاوزت الوقت، سيتم تسجيل ذلك في التقرير كدليل على عدم الجاهزية.
              </p>
            </div>

            <button
              onClick={startInterview}
              className="w-full py-5 rounded-2xl bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black text-base transition-all shadow-2xl shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3"
            >
              <Mic className="w-5 h-5" />
              ابدأ التشخيص المهني
              <ChevronRight className="w-5 h-5" />
            </button>

            <p className="text-slate-700 text-xs text-center mt-4 font-medium">
              المدة المتوقعة: 20–35 دقيقة · نتائج فورية · تقرير مفصل
            </p>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
           ACTIVE INTERVIEW
      ══════════════════════════════════════════════ */}
      {interviewStarted && phase === "active" && (
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-4 gap-3">

          {/* Progress + Timer row */}
          <div className="flex items-center gap-3">
            {/* Progress bar */}
            <div className="flex-1 bg-slate-900/60 border border-slate-800/40 rounded-2xl px-4 py-2.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-slate-600 text-[9px] font-black uppercase tracking-widest">
                  التقدم في التشخيص
                </span>
                <span className="text-slate-500 text-[9px] font-bold">{Math.round(progressPct)}%</span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-violet-500 to-blue-500 rounded-full transition-all duration-700"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* Countdown timer */}
            <CountdownTimer
              key={timerKey}
              seconds={QUESTION_TIME_SECONDS}
              onTimeout={handleTimeout}
              isPaused={timerPaused}
            />
          </div>

          {/* Messages area */}
          <div
            className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-0 custom-scrollbar"
            style={{ maxHeight: "calc(100dvh - 290px)" }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-lg bg-linear-to-br from-violet-600 to-indigo-700 flex items-center justify-center shrink-0 mt-1 shadow-md">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[78%] rounded-2xl px-4 py-3 shadow-sm text-sm leading-relaxed ${
                    msg.isTimeout
                      ? "bg-red-500/10 border border-red-500/20 text-red-300 italic rounded-tr-sm"
                      : msg.role === "user"
                      ? "bg-linear-to-br from-violet-700 to-indigo-700 text-white rounded-tr-sm"
                      : "bg-slate-900/80 border border-slate-700/40 text-slate-200 rounded-tl-sm"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-violet-400">
                        خبير التقييم الذكي
                      </span>
                    </div>
                  )}
                  {msg.isTimeout ? (
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>⏱ انتهى الوقت — لم يتم تقديم إجابة</span>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap font-medium">{msg.content}</p>
                  )}
                  <p className={`text-[9px] mt-2 font-medium ${
                    msg.role === "user" ? "text-violet-300/60" : "text-slate-600"
                  }`}>
                    {msg.timestamp.toLocaleTimeString("ar-TN", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>

                {msg.role === "user" && !msg.isTimeout && (
                  <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-3.5 h-3.5 text-slate-300" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-7 h-7 rounded-lg bg-linear-to-br from-violet-600 to-indigo-700 flex items-center justify-center shrink-0 shadow-md">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-slate-900/80 border border-slate-700/40 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-violet-400"
                        style={{ animation: `dotBounce 1.2s infinite ${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-3 backdrop-blur-sm">
            <div className="flex gap-2 items-end">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                placeholder="أجب على سؤال الخبير هنا... (Enter للإرسال)"
                rows={2}
                className="flex-1 bg-transparent text-slate-200 placeholder-slate-700 outline-none resize-none text-sm font-medium leading-relaxed py-1 px-1 disabled:opacity-40"
              />
              <button
                onClick={() => sendMessage()}
                disabled={isLoading || !inputValue.trim()}
                className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white flex items-center justify-center transition-all shadow-lg shadow-violet-500/20 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shrink-0"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-slate-700 text-[9px] font-medium">
                ↵ Enter للإرسال · Shift+Enter لسطر جديد
              </p>
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-amber-500/60">
                <AlertCircle className="w-3 h-3" />
                <span>5 دقائق كحد أقصى لكل سؤال</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
           DIAGNOSTIC REPORT
      ══════════════════════════════════════════════ */}
      {phase === "report" && reportContent && (
        <div className="flex-1 overflow-y-auto px-4 py-6 max-w-4xl mx-auto w-full">

          {/* Report header */}
          <div className="mb-8 p-6 rounded-3xl bg-linear-to-br from-violet-600/10 via-indigo-600/5 to-transparent border border-violet-500/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-violet-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">Rapport Diagnostique</h1>
                <p className="text-slate-500 text-sm font-medium">
                  Généré par l&apos;Expert Senior IA · {new Date().toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  icon: CheckCircle2,
                  label: "Questions",
                  val: Math.floor(messageCount / 2),
                  color: "text-emerald-400",
                },
                {
                  icon: Clock,
                  label: "Non-réponses",
                  val: timeoutCount,
                  color: timeoutCount > 0 ? "text-red-400" : "text-slate-500",
                },
                {
                  icon: XCircle,
                  label: "Durée",
                  val: `~${Math.ceil((messageCount / 2) * 3)}min`,
                  color: "text-blue-400",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-slate-900/60 border border-slate-800/40 rounded-xl p-3 text-center"
                >
                  <s.icon className={`w-4 h-4 ${s.color} mx-auto mb-1`} />
                  <div className={`font-black text-lg ${s.color}`}>{s.val}</div>
                  <div className="text-slate-600 text-[9px] font-bold uppercase tracking-widest">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Report body */}
          <div className="bg-slate-900/40 border border-slate-800/40 rounded-3xl p-6 mb-6">
            <RenderReport text={reportContent} />
          </div>

          {/* Footer note */}
          <div className="flex items-start gap-3 p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
            <FileText className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-slate-500 text-xs leading-relaxed">
              Ce rapport diagnostique a été généré à partir de votre entretien avec l&apos;Expert Senior IA.
              Il sera transmis à l&apos;équipe de notre plateforme pour examen et activation éventuelle de votre compte Expert.
              <strong className="text-slate-400"> Contactez-nous via WhatsApp si vous avez des questions.</strong>
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes dotBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.25);
          border-radius: 100px;
        }
      `}</style>
    </div>
  );
}
