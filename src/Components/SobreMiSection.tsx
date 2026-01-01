// src/Components/SobreMiSection.tsx
import { motion } from "framer-motion";
import { useLanguage } from "../LanguageContext";
import translations from "../translations";
import SeoSobreMiSection from "./SeoSobreMiSection";

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
      <SeoSobreMiSection />
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
                  Full-stack · React · Automatizaciones · IA aplicada
                </>
              )
            : (
                <>
                  Product-minded technologist
                  <br />
                  Full-stack · React · Automations · Applied AI
                </>
              )}
        </p>
        <p className="text-gray-700 md:text-gray-600 text-base md:text-lg leading-relaxed md:leading-[1.8] max-w-[60ch] mx-auto mb-6">
          {language === "es"
            ? (
                <>Soy Rodrigo Opalo. Trabajo bajo la marca <span className="font-semibold">devrodri</span> y desarrollo productos digitales modernos, rápidos y orientados al negocio. Diseño y construyo sitios, aplicaciones y sistemas a medida combinando diseño, experiencia de usuario y tecnología.</>
              )
            : (
                <>I'm Rodrigo Opalo. I work under the <span className="font-semibold">devrodri</span> brand and build modern, fast, business-driven digital products. I design and develop custom websites, applications and systems combining UX, design and engineering.</>
              )}
        </p>
        <p className="text-gray-700 md:text-gray-600 text-base md:text-lg leading-relaxed max-w-[60ch] mx-auto mb-6">
          {language === "es"
            ? "También implemento automatizaciones y asistentes con n8n y MCP: CRMs, pagos, webhooks y dashboards; además de integraciones con APIs como OpenAI y Stripe para escalar procesos y reducir costos operativos."
            : "I also implement automations and assistants using n8n and MCP: CRMs, payments, webhooks and dashboards — plus integrations with APIs like OpenAI and Stripe to scale operations and reduce costs."}
        </p>
        <div className="flex items-center justify-center gap-4 mt-2 md:mt-3">
          <a
            href="/portfolio"
            className="px-5 py-2 rounded-lg bg-[#3B82F6] text-white font-medium hover:opacity-90 transition"
            aria-label={language === "es" ? "Ver casos del porfolio" : "View portfolio work"}
            data-analytics="about-cta-primary"
          >
            {language === "es" ? "Ver casos" : "View work"}
          </a>
          <a
            href="/#contacto"
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-100 transition focus-visible:ring-2 ring-offset-2 ring-gray-300"
            aria-label={language === "es" ? "Hablemos" : "Let’s talk"}
            data-analytics="about-cta-secondary"
          >
            {language === "es" ? "Hablemos" : "Let’s talk"}
          </a>
        </div>
        <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[12.5px] tracking-wide text-gray-500/90">
          <li>{language === "es"
            ? "Next.js · React · Node.js · Python · Firebase · Docker · CI/CD · Stripe · OpenAI API · Automatizaciones con n8n y MCP"
            : "Next.js · React · Node.js · Python · Firebase · Docker · CI/CD · Stripe · OpenAI API · Automations with n8n & MCP"}</li>
        </ul>
        {/* Certifications */}
        <div className="mt-4 flex flex-col items-center gap-1">
          <a
            href="https://www.credly.com/badges/26e359b2-526b-4f12-85b4-34a51759be15/linked_in_profile"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg ring-1 ring-gray-300 px-3 py-1.5 hover:bg-gray-100 text-sm text-gray-700"
            aria-label={language === "es" ? "Verificar certificado IBM Full Stack en Credly" : "Verify IBM Full Stack certificate on Credly"}
          >
            <span className="font-medium">IBM Full Stack Software Developer Professional Certificate (V5)</span>
            <span className="text-primary underline">{language === "es" ? "Verificar" : "Verify"}</span>
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
              alt="IBM Full Stack Certificate"
              className="h-16 w-auto rounded ring-1 ring-gray-300 hover:ring-gray-400 shadow-sm hover:scale-105 transition-transform duration-300"
              loading="lazy"
              decoding="async"
            />
          </a>
          <p className="text-[11px] text-gray-400 mt-1">{language === "es" ? "Vista previa" : "Preview"}</p>
          <p className="text-xs text-gray-500 text-center">
            {language === "es"
              ? "Certificación profesional dictada por IBM Skills Network · Acreditada en Credly"
              : "Professional certification issued by IBM Skills Network · Verified on Credly"}
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