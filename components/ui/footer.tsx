"use client";

import Link from "next/link";
import { ShieldCheck, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useState, useEffect } from "react";

interface FooterLink {
    id: string;
    label: string;
    href: string;
}

interface FooterColumn {
    id: string;
    title: string;
    titleHref?: string;
    links: FooterLink[];
}

interface FooterConfig {
    brandName: string;
    brandDescription: string;
    columns: FooterColumn[];
    socials: {
        linkedin: string;
        twitter: string;
    };
    rightsText: string;
}

export function Footer() {
    const { t, dir } = useLanguage();
    const [config, setConfig] = useState<FooterConfig | null>(null);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await fetch("/api/admin/config");
                const data = await res.json();
                if (data.success && data.configs.footer_config) {
                    setConfig(JSON.parse(data.configs.footer_config));
                }
            } catch (error) {
                console.error("Failed to fetch footer config:", error);
            }
        };

        fetchConfig();
    }, []);

    // Fallback data if no config is set
    const fallbackConfig: FooterConfig = {
        brandName: "SuccessStrategy",
        brandDescription: "The industrial operating system for career growth and strategic transformation. Verify, endorse, dominate.",
        columns: [
            {
                id: "col-1",
                title: "The Protocol",
                links: [
                    { id: "l1", label: "Skill Scan", href: "#" },
                    { id: "l2", label: "Pressure Test", href: "#" },
                    { id: "l3", label: "Board Access", href: "#" },
                    { id: "l4", label: "Executive Vault", href: "#" },
                ]
            },
            {
                id: "col-2",
                title: "B2B Protocol",
                links: [
                    { id: "l5", label: "Corporate Audit", href: "/digitalization" },
                    { id: "l6", label: "Team Training", href: "/digitalization" },
                    { id: "l7", label: "Scale Architecture", href: "/digitalization" },
                    { id: "l8", label: "Industrial IA", href: "/digitalization" },
                ]
            },
            {
                id: "col-3",
                title: "Intelligence",
                links: [
                    { id: "l9", label: "Legal Warrant", href: "#" },
                    { id: "l10", label: "Privacy Policy", href: "#" },
                    { id: "l11", label: "Cookie Protocol", href: "#" },
                    { id: "l12", label: "System Status", href: "#" },
                ]
            }
        ],
        socials: {
            linkedin: "#",
            twitter: "#"
        },
        rightsText: t.footer.rights || ".MA-TRAINING-CONSULTING 2026 ©"
    };

    const displayConfig = config || fallbackConfig;

    return (
        <footer dir={dir} className="bg-white dark:bg-[#050505] border-t border-slate-100 dark:border-slate-900 py-24 px-6">
            <div className="container mx-auto">
                <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">
                    {/* Brand Column */}
                    <div className="lg:col-span-5 space-y-8">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-950 dark:bg-white flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6 text-white dark:text-black" />
                            </div>
                            <span className="font-serif font-bold text-2xl tracking-tight text-slate-950 dark:text-white">
                                {displayConfig.brandName}
                            </span>
                        </Link>
                        <p className="text-xl font-serif text-slate-500 dark:text-slate-400 font-light leading-relaxed max-w-sm italic">
                            {displayConfig.brandDescription}
                        </p>
                    </div>

                    {/* Links Grid */}
                    <div className="lg:col-span-7 grid md:grid-cols-3 gap-12">
                        {displayConfig.columns.map((column) => (
                            <div key={column.id} className="space-y-6">
                                {column.titleHref ? (
                                    <Link 
                                        href={column.titleHref} 
                                        target={column.titleHref.startsWith('http') ? "_blank" : "_self"}
                                        className="inline-block group"
                                    >
                                        <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                                            {column.title}
                                            <ArrowUpRight className="w-2 h-2" />
                                        </h4>
                                    </Link>
                                ) : (
                                    <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">{column.title}</h4>
                                )}
                                
                                <ul className="space-y-4">
                                    {column.links.map((link) => (
                                        <li key={link.id}>
                                            <Link 
                                                href={link.href} 
                                                target={link.href.startsWith('http') ? "_blank" : "_self"}
                                                className="group flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white hover:text-blue-600 transition-colors"
                                            >
                                                {link.label}
                                                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-24 pt-8 border-t border-slate-50 dark:border-slate-900/50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
                        {displayConfig.rightsText}
                    </p>
                    <div className="flex gap-8 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
                        <Link 
                            href={displayConfig.socials.linkedin} 
                            target="_blank" 
                            className="hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                            Linkedin
                        </Link>
                        <Link 
                            href={displayConfig.socials.twitter} 
                            target="_blank" 
                            className="hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                            Twitter
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
