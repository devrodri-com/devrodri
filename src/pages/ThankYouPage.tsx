import { Link } from "react-router-dom";
import type { Language } from "../i18n/language";
import { useLanguage } from "../i18n/useLanguage";
import { getLocalizedPath } from "../routes/siteRoutes";

const copy = {
  es: {
    cta: "Volver al inicio",
    description:
      "Gracias por escribirme. Recibí tu consulta y te voy a responder lo antes posible.",
    heading: "Consulta enviada",
  },
  en: {
    cta: "Back to home",
    description:
      "Thanks for getting in touch. I received your inquiry and will get back to you as soon as possible.",
    heading: "Inquiry sent",
  },
} satisfies Record<
  Language,
  { cta: string; description: string; heading: string }
>;

export default function ThankYouPage() {
  const { language } = useLanguage();
  const localized = copy[language];

  return (
    <div className="flex flex-1 items-center justify-center bg-black px-6 py-28 text-white">
      <div className="max-w-xl text-center">
        <p className="mb-3 text-sm uppercase tracking-widest text-primary">
          devrodri
        </p>
        <h1 className="text-3xl font-bold sm:text-4xl">
          {localized.heading}
        </h1>
        <p className="mt-5 leading-relaxed text-gray-300">
          {localized.description}
        </p>
        <Link
          to={getLocalizedPath("home", language)}
          className="mt-8 inline-flex min-h-[44px] items-center rounded-full bg-primary-on-light px-6 py-3 font-medium text-white transition hover:bg-primary-on-light-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          {localized.cta}
        </Link>
      </div>
    </div>
  );
}
