import { motion } from "framer-motion";
import { Blocks, Globe2, Palette } from "lucide-react";
import { FiCheckCircle, FiLayers, FiMessageCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import {
  useLanguage,
  type LanguageKeys,
} from "../LanguageContext";
import translations, { type TranslationsStructure } from "../translations";

type BridgeProps = { variant?: "default" | "afterPortfolio" };
type ServicesCopy = TranslationsStructure["services"];

function ServicesContent({ copy }: { copy: ServicesCopy }) {
  const items = [
    { key: "systems", item: copy.items.systems, Icon: Blocks },
    { key: "web", item: copy.items.web, Icon: Globe2 },
    { key: "brand", item: copy.items.brand, Icon: Palette },
  ];

  return (
    <motion.section
      id="servicios"
      className="bg-white px-4 py-24 text-gray-900 sm:px-6"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.55 }}
      viewport={{ once: true, amount: 0.15 }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {copy.title}
          </h2>
          <p className="mx-auto mt-4 max-w-[62ch] text-base leading-relaxed text-gray-600 sm:text-lg">
            {copy.intro}
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {items.map(({ key, item, Icon }, index) => {
            return (
              <motion.article
                key={key}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                viewport={{ once: true }}
              >
                <span
                  className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-primary-on-light"
                  aria-hidden="true"
                >
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mb-3 text-xl font-semibold leading-snug text-gray-900">
                  {item.title}
                </h3>
                <p className="leading-relaxed text-gray-600">{item.desc}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}

function ContactBridge({ language }: { language: LanguageKeys }) {
  const copy =
    language === "es"
      ? {
          kicker: "Próximo paso",
          title: "De la idea a una solución clara",
          subtitle:
            "Contame tu contexto y te ayudo a definir el alcance, las prioridades y el mejor camino para avanzar.",
          cta: "Ir al contacto",
          emailPrefix: "O escribime a",
          badges: [
            { icon: "message", label: "Contacto directo" },
            { icon: "check", label: "Alcance por etapas" },
            { icon: "layers", label: "Stack a medida" },
          ],
        }
      : {
          kicker: "Next step",
          title: "From idea to a clear solution",
          subtitle:
            "Share your context and I will help define scope, priorities and the best path forward.",
          cta: "Go to contact",
          emailPrefix: "Or email me at",
          badges: [
            { icon: "message", label: "Direct contact" },
            { icon: "check", label: "Phased scope" },
            { icon: "layers", label: "Tailored stack" },
          ],
        };

  return (
    <motion.section
      className="bg-white px-4 py-10 text-center shadow-[0_-8px_24px_rgba(0,0,0,.18)] sm:px-6"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.55 }}
      viewport={{ once: true, amount: 0.25 }}
    >
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-xs uppercase tracking-[0.14em] text-gray-600 sm:text-sm">
          {copy.kicker}
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-[1.85rem]">
          {copy.title}
        </h2>
        <p className="mx-auto mt-2 max-w-[34rem] leading-normal text-gray-600">
          {copy.subtitle}
        </p>

        <div className="mx-auto mt-6 grid w-full max-w-[42rem] grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {copy.badges.map((badge) => (
            <div
              key={badge.label}
              className="flex min-h-[52px] w-full items-center gap-3 rounded-xl border border-gray-200/90 bg-white px-3.5 py-2.5 sm:min-h-0 sm:px-4 sm:py-3"
            >
              <span
                className="inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center text-primary-on-light"
                aria-hidden="true"
              >
                {badge.icon === "message" ? (
                  <FiMessageCircle className="h-[18px] w-[18px]" />
                ) : badge.icon === "check" ? (
                  <FiCheckCircle className="h-[18px] w-[18px]" />
                ) : (
                  <FiLayers className="h-[18px] w-[18px]" />
                )}
              </span>
              <span className="min-w-0 flex-1 text-left text-[13px] font-medium leading-snug text-gray-800 sm:text-sm">
                {badge.label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Link
            to="/#contacto"
            aria-label={language === "es" ? "Ir al formulario de contacto" : "Go to contact form"}
            data-analytics="bridge-cta-afterPortfolio"
            className="inline-flex min-h-[44px] min-w-[44px] w-full items-center justify-center rounded-lg bg-primary-on-light px-5 py-2.5 text-sm font-medium text-white shadow-md transition hover:opacity-90 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary-on-light focus-visible:ring-offset-2 sm:w-auto"
          >
            {copy.cta}
          </Link>
          <p className="mt-2 text-sm text-gray-600">
            {copy.emailPrefix}{" "}
            <a
              href="mailto:r.opalo@icloud.com"
              className="underline hover:opacity-80"
            >
              r.opalo@icloud.com
            </a>
            .
          </p>
        </div>
      </div>
    </motion.section>
  );
}

export default function TransitionServicesIntro({
  variant = "default",
}: BridgeProps) {
  const { language } = useLanguage();

  if (variant === "afterPortfolio") {
    return <ContactBridge language={language} />;
  }

  return <ServicesContent copy={translations[language].services} />;
}
