import en from "./en";
import es from "./es";
import type { Language } from "./language";
import type { TranslationSchema } from "./types";

export type TranslationsStructure = TranslationSchema<typeof es>;

const translations = {
  es,
  en,
} satisfies Record<Language, TranslationsStructure>;

export { en, es };
export default translations;
