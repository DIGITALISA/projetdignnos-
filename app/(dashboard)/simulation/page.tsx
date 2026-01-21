"use client";

import { motion } from "framer-motion";
import { Bot, Search, PenTool, Layout, Video, Calendar, ExternalLink, FileText, Briefcase } from "lucide-react";

export default function AIToolsPage() {
    const tools = [
        {
            id: 1,
            title: "ChatGPT",
            description: "Advanced AI assistant for writing, coding, and problem-solving.",
            category: "General",
            icon: <Bot className="w-6 h-6" />,
            url: "https://chat.openai.com",
            color: "text-green-600",
            bgColor: "bg-green-50"
        },
        {
            id: 2,
            title: "Perplexity",
            description: "AI-powered search engine for deep research and verifiable answers.",
            category: "Research",
            icon: <Search className="w-6 h-6" />,
            url: "https://www.perplexity.ai",
            color: "text-blue-600",
            bgColor: "bg-blue-50"
        },
        {
            id: 3,
            title: "Grammarly",
            description: "AI writing assistant for clear, mistake-free communication.",
            category: "Writing",
            icon: <PenTool className="w-6 h-6" />,
            url: "https://www.grammarly.com",
            color: "text-emerald-600",
            bgColor: "bg-emerald-50"
        },
        {
            id: 4,
            title: "Canva Magic Studio",
            description: "Create professional presentations and resumes with AI design tools.",
            category: "Design",
            icon: <Layout className="w-6 h-6" />,
            url: "https://www.canva.com",
            color: "text-purple-600",
            bgColor: "bg-purple-50"
        },
        {
            id: 5,
            title: "Interview Warmup",
            description: "Practice key interview questions and get insights from Google.",
            category: "Interview",
            icon: <Briefcase className="w-6 h-6" />,
            url: "https://grow.google/certificates/interview-warmup/",
            color: "text-orange-600",
            bgColor: "bg-orange-50"
        },
        {
            id: 6,
            title: "Resume Worded",
            description: "Instant feedback on your resume and LinkedIn profile.",
            category: "CV & Resume",
            icon: <FileText className="w-6 h-6" />,
            url: "https://resumeworded.com",
            color: "text-indigo-600",
            bgColor: "bg-indigo-50"
        }
    ];

    return (
        <div className="flex-1">
            <div className="mb-12">
                <h1 className="text-3xl font-bold mb-2 text-slate-900">AI Productivity Tools</h1>
                <p className="text-slate-500">
                    A curated collection of AI tools to help you streamline your tasks and accelerate your career growth.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map((tool, index) => (
                    <motion.div
                        key={tool.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl border p-6 hover:shadow-lg hover:border-blue-300 transition-all group"
                    >
                        <div className="flex flex-col h-full">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl ${tool.bgColor} flex items-center justify-center ${tool.color}`}>
                                    {tool.icon}
                                </div>
                                <span className="px-3 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                                    {tool.category}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                {tool.title}
                            </h3>
                            <p className="text-sm text-slate-500 mb-6 flex-1">
                                {tool.description}
                            </p>

                            <a
                                href={tool.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-2.5 rounded-lg font-medium transition-all"
                            >
                                Open Tool <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
