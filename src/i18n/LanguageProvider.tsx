import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { isLanguage, type Language } from "./language";
import { LanguageContext } from "./languageContext";
import {
  getEquivalentLocalePath,
  getLocaleForPathname,
  getPublicRoute,
} from "../routes/siteRoutes";
import { captureLocaleScrollContext } from "../lib/localeScroll";

function detectBrowserLanguage(): Language {
  if (typeof navigator === "undefined") return "es";
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

type LanguageProviderProps = {
  children: ReactNode;
  language?: Language;
  onLanguageChange?: (language: Language) => void;
};

export function LanguageProvider({
  children,
  language: controlledLanguage,
  onLanguageChange,
}: LanguageProviderProps) {
  const [uncontrolledLanguage, setUncontrolledLanguage] = useState<Language>(
    () => controlledLanguage ?? readInitialLanguage(),
  );
  const language = controlledLanguage ?? uncontrolledLanguage;

  useEffect(() => {
    document.documentElement.lang = language;
    persistLanguage(language);
  }, [language]);

  const setLanguage = useCallback((nextLanguage: Language) => {
    if (controlledLanguage === undefined) {
      setUncontrolledLanguage(nextLanguage);
    }
    onLanguageChange?.(nextLanguage);
  }, [controlledLanguage, onLanguageChange]);

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

export function RoutedLanguageProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const language = getLocaleForPathname(location.pathname);

  const handleLanguageChange = useCallback((nextLanguage: Language) => {
    const currentPage = getPublicRoute(location.pathname)?.page ?? null;
    const scrollContext = captureLocaleScrollContext(currentPage);

    navigate({
      pathname: getEquivalentLocalePath(location.pathname, nextLanguage),
      search: location.search,
      hash: location.hash,
    }, {
      state: { localeSwitch: true, scrollContext },
    });
  }, [location.hash, location.pathname, location.search, navigate]);

  return (
    <LanguageProvider
      language={language}
      onLanguageChange={handleLanguageChange}
    >
      {children}
    </LanguageProvider>
  );
}
