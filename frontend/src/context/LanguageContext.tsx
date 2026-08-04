import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import en from "../locales/en";
import tr from "../locales/tr";

type Language = "en" | "tr";

type Translations = typeof en;

interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>(() => {
        return (localStorage.getItem("language") as Language) || "en";
    });

    useEffect(() => {
        localStorage.setItem("language", language);
    }, [language]);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
    };

    const t = language === "tr" ? tr : en;

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguageContext() {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error("useLanguageContext must be used inside LanguageProvider");
    }

    return context;
}