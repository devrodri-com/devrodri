import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { isLanguage, type Language } from "./language";
import { LanguageContext } from "./languageContext";

function detectBrowserLanguage(): Language {
  return navigator.language.toLowerCase().startsWith("en") ? "en" : "es";
}

function readInitialLanguage(): Language {
  try {
    const savedLanguage = window.localStorage.getItem("language");
    if (isLanguage(savedLanguage)) return savedLanguage;
  } catch {
    // Storage is optional; browser language remains a safe in-memory fallback.
  }

  return detectBrowserLanguage();
}

function persistLanguage(language: Language): void {
  try {
    window.localStorage.setItem("language", language);
  } catch {
    // Keep the selected language in React state when storage is unavailable.
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] =
    useState<Language>(readInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    persistLanguage(language);
  }, [language]);

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);
  }, []);

  const contextValue = useMemo(
    () => ({ language, setLanguage }),
    [language, setLanguage],
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}
