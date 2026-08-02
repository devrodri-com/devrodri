// src/Components/CTASection.tsx
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import translations from "../i18n";
import { useLanguage } from "../i18n/useLanguage";
import { Link } from "react-router-dom";
import { getLocalizedPath } from "../routes/siteRoutes";

const MotionLink = motion(Link);

export default function CTASection() {
  const { language } = useLanguage();
  const t = translations[language];
  const prefersReduced = useReducedMotion();
  const [hasHydrated, setHasHydrated] = useState(false);
  const shouldReduceMotion = hasHydrated && prefersReduced === true;

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return (
    <motion.section
      id="cta"
      className="relative bg-black text-white py-16 sm:py-20 px-4 sm:px-6 text-center"
      {...(shouldReduceMotion
        ? {
            initial: false as const,
            animate: { opacity: 1 },
            transition: { duration: 0 },
          }
        : {
            initial: { opacity: 0 },
            whileInView: { opacity: 1 },
            transition: { duration: 0.55 },
          })}
      viewport={{ once: true }}
    >
      {/* Curva blanca arriba */}
      <div className="absolute inset-x-0 top-0 overflow-hidden leading-none rotate-180">
        <svg viewBox="0 0 1440 60" className="w-full h-[60px]" preserveAspectRatio="none">
          <path 
            fill="#f9fafb"
            d="M0,0 C480,40 960,0 1440,40 L1440,60 L0,60 Z"
          />
        </svg>
      </div>

      <h2 className="text-2xl sm:text-4xl font-bold mb-8 leading-snug">{t.call.title}</h2>
      <p className="text-lg text-gray-300 mb-8">{t.call.subtitle}</p>

      <div className="inline-block w-full sm:w-auto">
        <MotionLink
          to={`${getLocalizedPath("home", language)}#contacto`}
          aria-label={language === "es" ? "Ir al formulario de contacto" : "Go to contact form"}
          data-analytics="cta-start-project"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center justify-center min-h-[44px] bg-white text-black font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-gray-200 transition-all duration-300 focus-visible:ring-2 ring-offset-2 ring-white w-full sm:w-auto text-center"
        >
          {t.call.button}
        </MotionLink>
      </div>
      <p className="mt-1 text-sm text-gray-400">
        <a
          href="https://wa.me/17544653318?text=Hola%20Rodrigo%2C%20vengo%20de%20devrodri.com%20y%20quiero%20empezar%20un%20proyecto"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
          data-analytics="cta-whatsapp"
        >
          {language === "es" ? "WhatsApp" : "WhatsApp"}
        </a>
        <span className="mx-2">·</span>
        <a
          href={`mailto:r.opalo@icloud.com?subject=${encodeURIComponent(language === "es" ? "Comencemos tu proyecto" : "Start a new project")}`}
          className="text-primary hover:underline"
          data-analytics="cta-email"
        >
          Email
        </a>
      </p>
    </motion.section>
  );
}
