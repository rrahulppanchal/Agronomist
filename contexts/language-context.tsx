"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { dictionaries, type Language } from "@/lib/dictionaries"

type LanguageContextType = {
    language: Language
    setLanguage: (lang: Language) => void
    t: typeof dictionaries.en
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>("en")

    // Load saved language from local storage on mount
    useEffect(() => {
        const savedLanguage = localStorage.getItem("language") as Language
        if (savedLanguage && dictionaries[savedLanguage]) {
            setLanguage(savedLanguage)
        }
    }, [])

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang)
        localStorage.setItem("language", lang)
    }

    const value = {
        language,
        setLanguage: handleSetLanguage,
        t: dictionaries[language],
    }

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider")
    }
    return context
}
