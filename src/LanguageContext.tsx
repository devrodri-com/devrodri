// src/LanguageContext.tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

// Idiomas disponibles
export type LanguageKeys = "es" | "en";

// Tipo del contexto
type LanguageContextType = {
  language: LanguageKeys;
  setLanguage: (lang: LanguageKeys) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

function isLanguage(value: string | null): value is LanguageKeys {
  return value === "es" || value === "en";
}

function detectBrowserLanguage(): LanguageKeys {
  return navigator.language.toLowerCase().startsWith("en") ? "en" : "es";
}

function readInitialLanguage(): LanguageKeys {
  try {
    const savedLanguage = window.localStorage.getItem("language");
    if (isLanguage(savedLanguage)) return savedLanguage;
  } catch {
    // Storage is optional; browser language remains a safe in-memory fallback.
  }

  return detectBrowserLanguage();
}

function persistLanguage(language: LanguageKeys): void {
  try {
    window.localStorage.setItem("language", language);
  } catch {
    // Keep the selected language in React state when storage is unavailable.
  }
}

// Proveedor del contexto
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] =
    useState<LanguageKeys>(readInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    persistLanguage(language);
  }, [language]);

  const setLanguage = useCallback((nextLanguage: LanguageKeys) => {
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

// Hook para consumir el contexto
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
