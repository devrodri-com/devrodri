export type Language = "es" | "en";

export function isLanguage(value: unknown): value is Language {
  return value === "es" || value === "en";
}
