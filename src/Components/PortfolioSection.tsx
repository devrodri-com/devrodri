// src/components/PortfolioSection.tsx
import { motion } from "framer-motion";
import { useLanguage } from "../LanguageContext";
import translations from "../translations";
import { Link } from "react-router-dom";

export default function PortfolioSection() {
  const { language } = useLanguage();
  const t = translations[language];

  const highlights = [
    {
      key: "esteban",
      logo: "/img/esteban.jpg",
      title: t.portfolio.esteban.title,
      summary:
        language === "es"
          ? "Real estate · Landing, catálogo y SEO técnico para captar leads de preconstrucción."
          : "Real estate · Landing, catalog and technical SEO to capture pre-construction leads.",
    },
    {
      key: "lem",
      logo: "/img/lem-box-cover.jpg",
      title: t.portfolio.lem.title,
      summary:
        language === "es"
          ? "Logística internacional · Web a medida e integraciones para gestionar envíos y clientes."
          : "International logistics · Custom site and integrations to manage shipments and customers.",
    },
    {
      key: "mutter",
      logo: "/img/mutter-cover.jpg",
      title: t.portfolio.mutter.title,
      summary:
        language === "es"
          ? "E‑commerce de videojuegos · Catálogo dinámico y checkout integrado para aumentar ventas."
          : "Video‑games e‑commerce · Dynamic catalog and integrated checkout to drive sales.",
    },
  ];

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
          {language === "es" ? "Portafolio" : "Portfolio"}
        </motion.p>

        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-center text-white leading-tight mb-4 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {language === "es" ? "Algunos resultados recientes" : "Recent work & results"}
        </motion.h2>

        <motion.p
          className="text-sm sm:text-base text-center text-white/80 max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {language === "es"
            ? "Sitios a medida para real estate, logística, gaming, suplementos y turismo náutico. Diseño limpio, SEO técnico y rendimiento listo para escalar."
            : "Custom sites for real estate, logistics, gaming, supplements and boat rentals. Clean design, technical SEO and performance ready to scale."}
        </motion.p>

        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map((p, index) => (
            <motion.div
              key={p.key}
              className="group rounded-2xl bg-white/95 backdrop-blur border border-gray-200/80 p-5 sm:p-6 flex flex-col gap-3 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 * index }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl overflow-hidden bg-white border border-gray-200">
                  <img
                    src={p.logo}
                    alt={language === "es" ? `Logo de ${p.title}` : `Logo of ${p.title}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 tracking-tight">
                    {p.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5 leading-snug">{p.summary}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-4">
          <p className="text-sm text-white/75 text-center max-w-xl">
            {language === "es"
              ? "En el portfolio completo podés ver más casos, métricas y detalles del proceso."
              : "In the full portfolio you can see more projects, metrics and process details."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="/#contacto"
              className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold bg-[#3B82F6] text-white hover:opacity-90 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              {language === "es" ? "Hablemos de tu proyecto" : "Let's talk about your project"}
            </a>
            <Link
              to="/portfolio"
              className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold border border-white/30 bg-white/5 text-white/90 hover:bg-white/15 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              {language === "es" ? "Ver portfolio completo" : "View full portfolio"}
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
}