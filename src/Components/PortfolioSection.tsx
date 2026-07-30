// src/components/PortfolioSection.tsx
import { motion } from "framer-motion";
import { homePortfolioCases } from "../data/portfolio";
import { useLanguage } from "../i18n/useLanguage";
import { Link } from "react-router-dom";

export default function PortfolioSection() {
  const { language } = useLanguage();
  const highlights = homePortfolioCases.map((portfolioCase) => ({
    category: portfolioCase.content[language].tags[0],
    key: portfolioCase.key,
    cover: portfolioCase.cover,
    status: portfolioCase.content[language].status,
    title: portfolioCase.content[language].title,
    summary: portfolioCase.home.summary[language],
    caseStudyPath: portfolioCase.caseStudy?.path,
    caseStudyCta:
      portfolioCase.caseStudy?.content[language].header.homeCta,
  }));

  return (
    <motion.section
      id="portfolio"
      className="relative py-28 px-4 sm:px-6 text-white overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
    >
      {/* Fondo visual con oscurecimiento */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: "url('/img/ojo.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute top-0 left-0 w-full h-40 sm:h-48 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
      </div>

      {/* Contenido */}
      <div className="relative z-20 max-w-6xl mx-auto">
        <motion.p
          className="text-xs sm:text-sm uppercase tracking-widest text-white/80 drop-shadow-md mb-3 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          PORTFOLIO
        </motion.p>

        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-center text-white leading-tight mb-4 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {language === "es" ? "Proyectos seleccionados" : "Selected projects"}
        </motion.h2>

        <motion.p
          className="text-sm sm:text-base text-center text-white/80 max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {language === "es"
            ? "Sitios, sistemas, automatizaciones y proyectos de marca desarrollados para resolver necesidades reales de negocio."
            : "Websites, systems, automations, and brand projects built to solve real business needs."}
        </motion.p>

        <div className="grid gap-6 md:grid-cols-2">
          {highlights.map((p, index) => (
            <Link
              key={p.key}
              to={p.caseStudyPath ?? "/portfolio"}
              {...(p.caseStudyPath === undefined
                ? { state: { focusCase: p.key } }
                : {})}
              className="block h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 min-h-[72px]"
              aria-label={
                p.caseStudyCta ??
                (language === "es"
                  ? `Ver este caso en el portfolio: ${p.title}`
                  : `View this case in the portfolio: ${p.title}`)
              }
            >
              <motion.div
                className="group h-full overflow-hidden rounded-2xl bg-white/95 backdrop-blur border border-gray-200/80 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.05 * index }}
                viewport={{ once: true }}
              >
                <div className="aspect-[2/1] overflow-hidden bg-white">
                  <img
                    src={p.cover}
                    alt={
                      language === "es"
                        ? `Portada de ${p.title}`
                        : `${p.title} cover`
                    }
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="flex h-full flex-col gap-3 p-5 sm:p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    {p.status !== undefined && (
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">
                        {p.status}
                      </span>
                    )}
                    <p className="text-xs font-medium text-gray-600">
                      {p.category}
                    </p>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
                    {p.title}
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {p.summary}
                  </p>
                  <span className="mt-auto inline-flex min-h-[44px] items-center text-sm font-semibold text-primary-on-light underline">
                    {p.caseStudyCta ??
                      (language === "es" ? "Ver caso" : "View case study")}
                  </span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-4">
          <p className="text-sm text-white/75 text-center max-w-xl">
            {language === "es"
              ? "En el portfolio completo hay más casos y el detalle técnico de cada uno."
              : "The full portfolio lists more cases and the technical detail for each one."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/#contacto"
              className="inline-flex items-center justify-center min-h-[44px] rounded-lg px-4 py-2 text-sm font-semibold bg-primary-on-light text-white hover:opacity-90 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              {language === "es" ? "Escribime por el formulario" : "Message me via the form"}
            </Link>
            <Link
              to="/portfolio"
              className="inline-flex items-center justify-center min-h-[44px] rounded-lg px-4 py-2 text-sm font-semibold border border-white/30 bg-white/5 text-white/90 hover:bg-white/15 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              {language === "es" ? "Ver portfolio completo" : "View full portfolio"}
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
