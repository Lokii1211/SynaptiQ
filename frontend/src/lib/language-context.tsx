'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale, getText } from './i18n';

interface LanguageContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
    locale: 'en',
    setLocale: () => { },
    t: (key) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>('en');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('skillten_locale') as Locale;
            if (saved && ['en', 'hi', 'ta', 'te'].includes(saved)) {
                setLocaleState(saved);
            }
        }
    }, []);

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
        if (typeof window !== 'undefined') {
            localStorage.setItem('skillten_locale', newLocale);
        }
    };

    const t = (key: string) => getText(key, locale);

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
