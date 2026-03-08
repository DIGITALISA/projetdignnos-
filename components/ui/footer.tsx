"use client";

import Link from "next/link";
import { ArrowUpRight, Shield } from "lucide-react";
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
    const { dir, language } = useLanguage();
    const [config, setConfig] = useState<FooterConfig | null>(null);

    // Simple language handling for standard texts in case t is missing
    const lang = (language as "en" | "fr" | "ar") || "en";
    const L = {
        en: { desc: "The industrial operating system for career growth and strategic transformation.", col1: "Platforms", col2: "Resources", col3: "Legal", linkedin: "LinkedIn", twitter: "Twitter" },
        fr: { desc: "Le système d'exploitation industriel pour la croissance de carrière et la transformation stratégique.", col1: "Plateformes", col2: "Ressources", col3: "Légal", linkedin: "LinkedIn", twitter: "Twitter" },
        ar: { desc: "نظام التشغيل الصناعي للنمو الوظيفي والتحول الاستراتيجي المعمق.", col1: "المنصات", col2: "الموارد", col3: "قانوني", linkedin: "لينكد إن", twitter: "تويتر" }
    }[lang];

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
        brandName: "MA-TRAINING CONSULTING",
        brandDescription: L.desc,
        columns: [
            {
                id: "col-1",
                title: L.col1,
                links: [
                    { id: "l1", label: lang === 'ar' ? "للمحترفين" : lang === 'fr' ? "Pour Professionnels" : "For Professionals", href: "/professionals" },
                    { id: "l2", label: lang === 'ar' ? "للمؤسسات" : lang === 'fr' ? "Pour Entreprises" : "For Enterprises", href: "/organizations" },
                    { id: "l3", label: lang === 'ar' ? "التحقق من الاعتماد" : lang === 'fr' ? "Vérification" : "Verify Credential", href: "/verify" },
                ]
            },
            {
                id: "col-2",
                title: L.col2,
                links: [
                    { id: "l5", label: lang === 'ar' ? "من نحن" : lang === 'fr' ? "À Propos" : "About Us", href: "#" },
                    { id: "l6", label: lang === 'ar' ? "الأسئلة الشائعة" : lang === 'fr' ? "FAQ" : "FAQ", href: "#" },
                    { id: "l7", label: lang === 'ar' ? "تسجيل الدخول" : lang === 'fr' ? "Se Connecter" : "Login", href: "/login" },
                ]
            },
            {
                id: "col-3",
                title: L.col3,
                links: [
                    { id: "l9", label: lang === 'ar' ? "الشروط والاحكام" : lang === 'fr' ? "Conditions" : "Terms & Conditions", href: "#" },
                    { id: "l10", label: lang === 'ar' ? "سياسة الخصوصية" : lang === 'fr' ? "Confidentialité" : "Privacy Policy", href: "#" },
                    { id: "l11", label: lang === 'ar' ? "اتصل بنا" : lang === 'fr' ? "Contact" : "Contact Us", href: "#" },
                ]
            }
        ],
        socials: {
            linkedin: "#",
            twitter: "#"
        },
        rightsText: "MA-TRAINING-CONSULTING © 2026"
    };

    const displayConfig = config || fallbackConfig;

    return (
        <footer dir={dir} className="bg-[#040812] border-t border-white/5 pt-24 pb-12 px-6 relative overflow-hidden text-white font-sans">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-size-[48px_48px] pointer-events-none" />

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 mb-24">
                    {/* Brand Column */}
                    <div className="lg:col-span-5 space-y-8">
                        <Link href="/" className="inline-flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
                                <Shield className="w-6 h-6 text-blue-400" />
                            </div>
                            <span className="font-black text-2xl tracking-tight text-white drop-shadow-md">
                                {displayConfig.brandName}
                            </span>
                        </Link>
                        <p className="text-lg text-slate-400 font-light leading-relaxed max-w-sm">
                            {displayConfig.brandDescription}
                        </p>
                    </div>

                    {/* Links Grid */}
                    <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
                        {displayConfig.columns.map((column) => (
                            <div key={column.id} className="space-y-6">
                                {column.titleHref ? (
                                    <Link 
                                        href={column.titleHref} 
                                        target={column.titleHref.startsWith('http') ? "_blank" : "_self"}
                                        className="inline-block group"
                                    >
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 group-hover:text-blue-400 transition-colors flex items-center gap-1">
                                            {column.title}
                                            <ArrowUpRight className="w-2 h-2" />
                                        </h4>
                                    </Link>
                                ) : (
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">{column.title}</h4>
                                )}
                                
                                <ul className="space-y-4">
                                    {column.links.map((link) => (
                                        <li key={link.id}>
                                            <Link 
                                                href={link.href} 
                                                target={link.href.startsWith('http') ? "_blank" : "_self"}
                                                className="group flex items-center text-sm font-semibold text-slate-300 hover:text-white transition-all duration-300"
                                            >
                                                <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300 ease-out text-blue-500">
                                                    →
                                                </span>
                                                <span className="group-hover:translate-x-1 hover:text-blue-400 transition-transform duration-300 ease-out inline-block">
                                                    {link.label}
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-600">
                        {displayConfig.rightsText}
                    </p>
                    <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.25em]">
                        <Link 
                            href={displayConfig.socials.linkedin} 
                            target="_blank" 
                            className="text-slate-600 hover:text-blue-400 transition-colors flex items-center gap-1"
                        >
                            {L.linkedin} <ArrowUpRight className="w-3 h-3" />
                        </Link>
                        <Link 
                            href={displayConfig.socials.twitter} 
                            target="_blank" 
                            className="text-slate-600 hover:text-blue-400 transition-colors flex items-center gap-1"
                        >
                            {L.twitter} <ArrowUpRight className="w-3 h-3" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
