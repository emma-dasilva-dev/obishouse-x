"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { translations } from "@/data/translations";
import type { Language } from "@/types/language";

type LanguageContextValue = { language: Language; setLanguage: (language: Language) => void; t: (typeof translations)[Language] };
const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("fr");
  const setLanguage = (next: Language) => {
    setLanguageState(next);
    window.localStorage.setItem("ctn-language", next);
  };
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  const value = useMemo(() => ({ language, setLanguage, t: translations[language] }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
