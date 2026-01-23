"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Menu, X, ChevronRight, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const { t, dir } = useLanguage();

    const navLinks = [
        { name: t.nav.home, href: "/" },
        { name: t.nav.methodology, href: "/methodology" },
        { name: t.nav.pricing, href: "/pricing" },
        { name: t.nav.verify, href: "/verification" },
    ];

    return (
        <nav dir={dir} className="fixed top-0 w-full z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-slate-900">
                        CareerUpgrade
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-blue-600",
                                pathname === link.href ? "text-blue-600" : "text-slate-600"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Auth Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    <LanguageSwitcher />
                    <Link
                        href="/dashboard"
                        className="group relative px-4 py-2 rounded-lg bg-slate-900 text-sm font-medium text-white shadow-lg hover:bg-blue-600 hover:scale-105 transition-all duration-300"
                    >
                        <span className="relative z-10 flex items-center gap-1">
                            {t.nav.workspace}
                            <ChevronRight className={cn(
                                "w-4 h-4 transition-transform",
                                dir === 'rtl' ? "group-hover:-translate-x-0.5 rotate-180" : "group-hover:translate-x-0.5"
                            )} />
                        </span>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-slate-600 hover:text-slate-900"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-16 left-0 w-full bg-white border-b border-slate-200 p-4 md:hidden flex flex-col gap-4 shadow-xl"
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-base font-medium text-slate-600 hover:text-blue-600 p-2"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="h-px bg-slate-100 my-2" />
                    <Link
                        href="/dashboard"
                        className="text-center bg-blue-600 text-white p-3 rounded-xl font-semibold shadow-lg shadow-blue-500/20"
                        onClick={() => setIsOpen(false)}
                    >
                        {t.nav.workspace}
                    </Link>
                    <div className="flex justify-center pt-2">
                        <LanguageSwitcher />
                    </div>
                </motion.div>
            )}
        </nav>
    );
}
