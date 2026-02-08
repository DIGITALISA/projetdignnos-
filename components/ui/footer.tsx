"use client";

import Link from "next/link";
import { ShieldCheck, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export function Footer() {
    const { t, dir } = useLanguage();

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
                                SuccessStrategy
                            </span>
                        </Link>
                        <p className="text-xl font-serif text-slate-500 dark:text-slate-400 font-light leading-relaxed max-w-sm italic">
                            The industrial operating system for career growth and strategic transformation. Verify, endorse, dominate.
                        </p>
                    </div>

                    {/* Links Grid */}
                    <div className="lg:col-span-7 grid md:grid-cols-3 gap-12">
                        {/* Protocol Column */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">The Protocol</h4>
                            <ul className="space-y-4">
                                {['Skill Scan', 'Pressure Test', 'Board Access', 'Executive Vault'].map((item) => (
                                    <li key={item}>
                                        <Link href="#" className="group flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white hover:text-blue-600 transition-colors">
                                            {item}
                                            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Company Column */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">B2B Protocol</h4>
                            <ul className="space-y-4">
                                {['Corporate Audit', 'Team Training', 'Scale Architecture', 'Industrial IA'].map((item) => (
                                    <li key={item}>
                                        <Link href="/digitalization" className="group flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white hover:text-blue-600 transition-colors">
                                            {item}
                                            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Support Column */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">Intelligence</h4>
                            <ul className="space-y-4">
                                {['Legal Warrant', 'Privacy Policy', 'Cookie Protocol', 'System Status'].map((item) => (
                                    <li key={item}>
                                        <Link href="#" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-24 pt-8 border-t border-slate-50 dark:border-slate-900/50 flex flex-col md:row items-center justify-between gap-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
                        {t.footer.rights}
                    </p>
                    <div className="flex gap-8 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
                        <Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Linkedin</Link>
                        <Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Twitter</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
