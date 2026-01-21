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
    // Default to English, but check localStorage on mount
    const [language, setLanguageState] = useState<Language>('en');

    useEffect(() => {
        const savedLang = localStorage.getItem('career-upgrade-lang') as Language;
        if (savedLang && (savedLang === 'en' || savedLang === 'fr' || savedLang === 'ar')) {
            setLanguageState(savedLang);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('career-upgrade-lang', lang);
        // Update HTML dir and lang attributes for accessibility and proper rendering
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    };

    // derived state
    const t = translations[language];
    const dir = language === 'ar' ? 'rtl' : 'ltr';

    // Ensure initial render matches hydration to avoid mismatch, 
    // or accept that first paint is default lang (en). 
    // To avoid flicker we might want to just render children, 
    // but let's stick to simple client-side switch for now.

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
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
