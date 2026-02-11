"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, Language } from "@/lib/i18n/translations";

type TranslationType = typeof translations.en;

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: TranslationType;
    dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    // Initialize with 'en' to match SSR
    const [language, setLanguageState] = useState<Language>('en');
    const [isHydrated, setIsHydrated] = useState(false);

    // Hydration effect - runs once on mount
    useEffect(() => {
        // Defer execution to avoid synchronous setState warning
        const timer = setTimeout(() => {
            // Get saved language from localStorage
            const savedLang = localStorage.getItem('career-upgrade-lang') as Language;
            const initialLang = (savedLang && (savedLang === 'en' || savedLang === 'fr' || savedLang === 'ar')) ? savedLang : 'en';
            
            // Update state
            if (initialLang !== 'en') {
                setLanguageState(initialLang);
            }
            
            // Update document attributes
            document.documentElement.lang = initialLang;
            document.documentElement.dir = initialLang === 'ar' ? 'rtl' : 'ltr';
            
            // Mark as hydrated
            setIsHydrated(true);
        }, 0);

        return () => clearTimeout(timer);
    }, []); // Intentionally empty - only run once on mount

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('career-upgrade-lang', lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    };

    const t = translations[language];
    const dir = language === 'ar' ? 'rtl' : 'ltr';

    // Show minimal loading screen during hydration to prevent mismatch
    if (!isHydrated) {
        return <div className="min-h-screen bg-slate-50" />;
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
            <div dir={dir} className={dir === 'rtl' ? 'font-arabic' : 'font-sans'}>
                {children}
            </div>
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
