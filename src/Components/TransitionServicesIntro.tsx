// src/Components/TransitionServicesIntro.tsx
import { motion } from "framer-motion";
import { useLanguage } from "../LanguageContext";
import translations from "../translations";
import { CalendarCheck, Clock3, FileText } from "lucide-react";

type BridgeProps = { variant?: "default" | "afterPortfolio" };

export default function TransitionServicesIntro({ variant = "default" }: BridgeProps) {
  const { language } = useLanguage();
  const t = translations[language];

  // Variant-specific copy
  const V = (() => {
    if (variant === "afterPortfolio") {
      return {
        kicker: language === "es" ? "Empezar es simple" : "Getting started is simple",
        title: language === "es" ? "De la idea al lanzamiento" : "From idea to launch",
        subtitle:
          language === "es"
            ? "Un proceso claro para empezar sin fricción."
            : "A clear, frictionless way to get started.",
        cta: language === "es" ? "Agendar llamada" : "Schedule a call",
        badges: [
          { icon: <Clock3 className="h-4 w-4 stroke-[2] text-[#3B82F6]" />, es: "Diagnóstico 20′ gratis", en: "Free 20-min diagnostic" },
          { icon: <FileText className="h-4 w-4 stroke-[2] text-[#3B82F6]" />, es: "Propuesta en 24 hs", en: "Proposal within 24 hours" },
          { icon: <CalendarCheck className="h-4 w-4 stroke-[2] text-[#3B82F6]" />, es: "Kickoff esta semana", en: "Kickoff this week" },
        ],
        href: "/#contacto",
      } as const;
    }
    return {
      kicker: language === "es" ? "Próximo paso" : "Next step",
      title: language === "es" ? "Construyamos algo increíble" : "Let’s build something great",
      subtitle: t.transitionServicesIntro.text,
      cta: language === "es" ? "Hablemos" : "Let’s talk",
      badges: [] as { icon: JSX.Element; es: string; en: string }[],
      href: "/#contacto",
    } as const;
  })();

  return (
    <motion.section
      className="bg-white py-10 px-4 sm:px-6 text-center shadow-[0_-8px_24px_rgba(0,0,0,.18)]"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.55 }}
      viewport={{ once: true, amount: 0.25 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="max-w-6xl mx-auto"
      >
        <p className="text-xs sm:text-sm uppercase tracking-[0.14em] text-gray-400/80 mb-3">
          {V.kicker}
        </p>
        <h2 className="text-2xl sm:text-[1.85rem] font-semibold tracking-tight text-gray-900">
          {V.title}
        </h2>
        <p className="text-gray-600 mt-2 max-w-[34rem] mx-auto leading-normal">
          {V.subtitle}
        </p>

        {variant === "afterPortfolio" ? (
          <>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-[42rem] mx-auto">
              {V.badges.map((b, i) => (
                <div
                  key={i}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-600 ring-1 ring-gray-200" aria-hidden>
                    {b.icon}
                  </div>
                  <span className="text-[13.5px] font-medium text-gray-700 whitespace-normal sm:whitespace-nowrap">
                    {language === "es" ? b.es : b.en}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <a
                href={V.href}
                aria-label={language === "es" ? "Agendar una llamada" : "Schedule a call"}
                rel="nofollow"
                data-analytics={`bridge-cta-${variant}`}
                className="inline-flex items-center justify-center rounded-lg bg-[#3B82F6] text-white text-sm font-medium px-5 py-2 shadow-md hover:shadow-lg hover:opacity-90 transition w-full sm:w-auto focus-visible:ring-2 ring-offset-2 ring-[#3B82F6]"
              >
                {V.cta}
              </a>
              <p className="mt-2 text-sm text-gray-600">
                {language === "es" ? (
                  <>O escribime por <a href="mailto:r.opalo@icloud.com" className="underline hover:opacity-80">email</a>.</>
                ) : (
                  <>Or email me at <a href="mailto:r.opalo@icloud.com" className="underline hover:opacity-80">email</a>.</>
                )}
              </p>
            </div>
          </>
        ) : (
          // Default: conservar la pieza visual existente
          <div className="mt-6 rounded-3xl overflow-hidden shadow-xl transition hover:shadow-2xl w-full max-w-[1600px] mx-auto">
            <img
              src="/img/servicios.jpg"
              alt="Servicios"
              className="w-full h-24 object-cover object-center sm:h-28 md:h-32"
            />
          </div>
        )}
      </motion.div>
    </motion.section>
  );
}
