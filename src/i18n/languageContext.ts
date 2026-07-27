import { createContext } from "react";
import type { Language } from "./language";

export type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
};

export const LanguageContext = createContext<
  LanguageContextValue | undefined
>(undefined);
