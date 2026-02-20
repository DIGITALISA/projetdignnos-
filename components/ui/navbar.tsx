"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const { t, dir } = useLanguage();

    // Verify user still exists (for deleted accounts)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem("userProfile");
            if (saved) {
                try {
                    const profile = JSON.parse(saved);
                    const identifier = profile.email || profile.fullName;
                    if (identifier) {
                        fetch(`/api/user/readiness?userId=${encodeURIComponent(identifier)}`)
                            .then(async (res) => {
                                if (res.status === 404) {
                                    localStorage.removeItem("userProfile");
                                    if (pathname.includes('/dashboard')) {
                                        window.location.href = '/login';
                                    }
                                }
                            })
                            .catch(() => {});
                    }
                } catch {
                    localStorage.removeItem("userProfile");
                }
            }
        }
    }, [pathname]);

    const navLinks = [
        { name: t.nav.home, href: "/" },
        { name: t.nav.professionals, href: "/professionals" },
        { name: t.nav.enterprises, href: "/digitalization" },
        { name: t.nav.verify, href: "/verification" },
    ];

    return (
        <nav dir={dir} className="fixed top-0 w-full z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative h-14 w-48">
                        <Image
                            src="/logo-matc.png"
                            alt="MA-TRAINING-CONSULTING"
                            fill
                            sizes="(max-width: 768px) 192px, 192px"
                            className="object-contain object-left"
                            priority
                        />
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:opacity-100",
                                pathname === link.href ? "opacity-100 text-blue-600" : "opacity-40 text-slate-900 dark:text-white hover:text-blue-600"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Auth Buttons */}
                <div className="hidden md:flex items-center gap-6">
                    <LanguageSwitcher />
                    <Link
                        href="/dashboard"
                        className="group relative px-6 py-2.5 rounded-full bg-slate-950 dark:bg-white text-[10px] font-bold uppercase tracking-[0.25em] text-white dark:text-black shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            {t.nav.workspace}
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
