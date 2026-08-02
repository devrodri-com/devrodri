import { Link } from "react-router-dom";
import type { Language } from "../i18n/language";
import { useLanguage } from "../i18n/useLanguage";
import { getLocalizedPath } from "../routes/siteRoutes";

const copy = {
  es: {
    cta: "Volver al inicio",
    description: "La página que buscás no está disponible.",
    heading: "Página no encontrada",
  },
  en: {
    cta: "Back to home",
    description: "The page you're looking for isn't available.",
    heading: "Page not found",
  },
} satisfies Record<
  Language,
  { cta: string; description: string; heading: string }
>;

export default function NotFoundPage() {
  const { language } = useLanguage();
  const localized = copy[language];

  return (
    <div className="flex flex-1 items-center justify-center bg-black px-6 py-28 text-white">
      <div className="max-w-xl text-center">
        <p className="text-sm uppercase tracking-widest text-primary mb-3">
          devrodri
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold">
          {localized.heading}
        </h1>
        <p className="mt-5 text-gray-300 leading-relaxed">
          {localized.description}
        </p>
        <Link
          to={getLocalizedPath("home", language)}
          className="mt-8 inline-flex min-h-[44px] items-center rounded-full bg-primary-on-light px-6 py-3 font-medium text-white hover:bg-primary-on-light-hover transition"
        >
          {localized.cta}
        </Link>
      </div>
    </div>
  );
}
