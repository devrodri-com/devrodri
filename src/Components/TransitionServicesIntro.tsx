// src/Components/TransitionServicesIntro.tsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiCheckCircle, FiLayers, FiMessageCircle } from "react-icons/fi";
import translations from "../i18n";
import { useLanguage } from "../i18n/useLanguage";
import { getLocalizedPath } from "../routes/siteRoutes";

type BridgeProps = { variant?: "default" | "afterPortfolio" };

export default function TransitionServicesIntro({ variant = "default" }: BridgeProps) {
  const { language } = useLanguage();
  const t = translations[language];

  // Variant-specific copy
  const V = (() => {
    if (variant === "afterPortfolio") {
      return {
        kicker: language === "es" ? "PRÓXIMO PASO" : "NEXT STEP",
        title:
          language === "es"
            ? "De la idea a una solución clara"
            : "From an idea to a clear solution",
        subtitle:
          language === "es"
            ? "Contame el contexto y definimos el alcance, las prioridades y el mejor camino para avanzar."
            : "Tell me the context and we'll define the scope, priorities, and best way forward.",
        cta:
          language === "es"
            ? "Contame tu proyecto"
            : "Tell me about your project",
        badges: [
          { icon: "message" as const, es: "Contacto directo", en: "Direct communication" },
          { icon: "check" as const, es: "Alcance claro", en: "Clear scope" },
          { icon: "layers" as const, es: "Solución a medida", en: "Tailored solution" },
        ],
        href: "/#contacto",
      } as const;
    }
    return {
      kicker: t.transitionServicesIntro.smallTitle,
      title:
        language === "es"
          ? "Del enfoque a la implementación."
          : "From approach to implementation.",
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
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 max-w-[42rem] mx-auto w-full">
              {V.badges.map((b, i) => (
                <div
                  key={i}
                  className="flex w-full min-h-[52px] items-center gap-3 rounded-xl border border-gray-200/90 bg-white px-3.5 py-2.5 sm:min-h-0 sm:px-4 sm:py-3"
                >
                  <span
                    className="inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center text-[#3B82F6]"
                    aria-hidden
                  >
                    {b.icon === "message" ? (
                      <FiMessageCircle className="h-[18px] w-[18px]" strokeWidth={1.75} />
                    ) : b.icon === "check" ? (
                      <FiCheckCircle className="h-[18px] w-[18px]" strokeWidth={1.75} />
                    ) : (
                      <FiLayers className="h-[18px] w-[18px]" strokeWidth={1.75} />
                    )}
                  </span>
                  <span className="min-w-0 flex-1 text-left text-[13px] sm:text-sm font-medium text-gray-800 leading-snug">
                    {language === "es" ? b.es : b.en}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link
                to={`${getLocalizedPath("home", language)}#contacto`}
                aria-label={V.cta}
                data-analytics={`bridge-cta-${variant}`}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg bg-primary-on-light text-white text-sm font-medium px-5 py-2.5 shadow-md hover:shadow-lg hover:bg-primary-on-light-hover transition w-full sm:w-auto focus-visible:ring-2 ring-offset-2 ring-[#3B82F6]"
              >
                {V.cta}
              </Link>
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
