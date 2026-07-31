// src/Components/SobreMiSection.tsx
import { motion } from "framer-motion";
import translations from "../i18n";
import { useLanguage } from "../i18n/useLanguage";
import { getLocalizedPath } from "../routes/siteRoutes";
export default function SobreMiSection() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <motion.section
      id="sobremi"
      className="bg-neutral py-24 px-4 sm:px-6 relative"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55 }}
    >
      <div className="flex justify-center mb-5">
        <img
          src="/img/sobremi.jpg"
          alt="Rodrigo Opalo"
          loading="lazy"
          decoding="async"
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-1 ring-gray-300/80 shadow"
        />
      </div>
      <div className="max-w-5xl mx-auto text-center">
        <motion.h2
          className="text-4xl sm:text-5xl font-semibold tracking-tight text-gray-900 mb-4 md:mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          {t.about.title}
        </motion.h2>
        <p className="text-gray-700 md:text-gray-600 text-base md:text-lg leading-[1.7] md:leading-[1.75] max-w-[60ch] mx-auto mb-6">
          {language === "es"
            ? (
                <>
                  Integrador de tecnología con mentalidad de producto
                  <br />
                  Full-stack · Sistemas · Automatización · Integraciones
                </>
              )
            : (
                <>
                  Technology integrator with a product mindset
                  <br />
                  Full-stack · Systems · Automation · Integrations
                </>
              )}
        </p>
        <p className="text-gray-700 md:text-gray-600 text-base md:text-lg leading-relaxed md:leading-[1.8] max-w-[60ch] mx-auto mb-6">
          {language === "es"
            ? (
                <>Soy Rodrigo Opalo. Trabajo bajo la marca <span className="font-semibold">devrodri</span> y desarrollo productos digitales orientados al negocio. Creo sitios, aplicaciones y sistemas a medida combinando estrategia, experiencia de usuario y tecnología.</>
              )
            : (
                <>I'm Rodrigo Opalo. I work under the <span className="font-semibold">devrodri</span> brand and develop business-oriented digital products. I create custom websites, applications, and systems by combining strategy, user experience, and technology.</>
              )}
        </p>
        <p className="text-gray-700 md:text-gray-600 text-base md:text-lg leading-relaxed max-w-[60ch] mx-auto mb-6">
          {language === "es"
            ? "También implemento automatizaciones, integraciones y asistentes con IA para conectar herramientas, optimizar procesos y reducir trabajo manual."
            : "I also implement automations, integrations, and AI assistants to connect tools, optimize processes, and reduce manual work."}
        </p>
        <div className="flex items-center justify-center gap-4 mt-2 md:mt-3">
          <a
            href={getLocalizedPath("portfolio", language)}
            className="px-5 py-2 rounded-lg bg-primary-on-light text-white font-medium hover:bg-primary-on-light-hover transition"
            aria-label={language === "es" ? "Ver casos del porfolio" : "View portfolio work"}
            data-analytics="about-cta-primary"
          >
            {language === "es" ? "Ver casos" : "View work"}
          </a>
          <a
            href={`${getLocalizedPath("home", language)}#contacto`}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-100 transition focus-visible:ring-2 ring-offset-2 ring-gray-300"
            aria-label={language === "es" ? "Contame tu proyecto" : "Tell me about your project"}
            data-analytics="about-cta-secondary"
          >
            {language === "es" ? "Contame tu proyecto" : "Tell me about your project"}
          </a>
        </div>
        <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[12.5px] tracking-wide text-gray-500/90">
          <li>{language === "es"
            ? "Next.js · React · Node.js · Python · Firebase · Docker · CI/CD · Integraciones API · Pagos digitales · Automatización e IA"
            : "Next.js · React · Node.js · Python · Firebase · Docker · CI/CD · API integrations · Digital payments · Automation and AI"}</li>
        </ul>
        {/* Certifications */}
        <div className="mt-4 flex flex-col items-center gap-1">
          <a
            href="https://www.credly.com/badges/26e359b2-526b-4f12-85b4-34a51759be15/linked_in_profile"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full max-w-[21rem] flex-col items-center gap-2 rounded-lg ring-1 ring-gray-300 px-3 py-2 text-center hover:bg-gray-100 text-sm text-gray-700 sm:w-auto sm:max-w-none sm:flex-row sm:py-1.5"
            aria-label={language === "es" ? "Verificar certificado IBM Full Stack en Credly" : "Verify IBM Full Stack certificate on Credly"}
          >
            <span className="font-medium">IBM Full Stack Software Developer Professional Certificate (V5)</span>
            <span className="text-primary-on-light underline">{language === "es" ? "Verificar" : "Verify"}</span>
          </a>
          <a
            href="/img/certs/ibm-fullstack.png"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center justify-center"
            aria-label={language === "es" ? "Ampliar certificado IBM (imagen)" : "Open IBM certificate image"}
          >
            <img
              src="/img/certs/ibm-fullstack.png"
              alt=""
              className="h-16 w-auto rounded ring-1 ring-gray-300 hover:ring-gray-400 shadow-sm hover:scale-105 transition-transform duration-300"
              loading="lazy"
              decoding="async"
            />
          </a>
          <p className="text-[11px] text-gray-400 mt-1">{language === "es" ? "Vista previa" : "Preview"}</p>
          <p className="text-xs text-gray-500 text-center">
            {language === "es"
              ? "Certificación profesional verificada por IBM Skills Network y Credly"
              : "Professional certification verified by IBM Skills Network and Credly"}
          </p>
          
        </div>
      </div>

      {/* Curva inferior tipo Apple */}
      <div className="absolute inset-x-0 bottom-0 overflow-hidden leading-none rotate-180">
        <svg viewBox="0 0 1440 100" className="w-full h-[96px]" preserveAspectRatio="none">
          <path
            fill="#000000"
            d="M0,0 C480,100 960,0 1440,100 L1440,0 L0,0 Z"
          />
        </svg>
      </div>
    </motion.section>
  );
}
