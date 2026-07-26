// src/Components/ImpactSection.tsx
import { useLanguage } from "../LanguageContext";
import translations from "../translations";
export default function ImpactSection() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <>
      <section
        id="impacto"
        className="bg-black text-white py-28 px-4 sm:px-6"
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-10 items-center">
          {/* Texto */}
          <div className="md:pl-10 md:col-span-6">
            <h2 className="text-4xl sm:text-5xl font-semibold leading-tight mb-5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] md:drop-shadow-none">
              {t.transitionVisual.title}
            </h2>
            <p className="text-gray-300 text-lg mb-8 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] md:drop-shadow-none">
              {t.transitionVisual.paragraph}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="/portfolio"
                aria-label={language === "es" ? "Ver casos seleccionados" : "View selected case studies"}
                data-analytics="impact-cta-primary"
                className="px-5 py-2 rounded-lg bg-primary-on-light text-white font-medium hover:opacity-90 transition"
              >
                {language === "es" ? "Ver casos" : "View case studies"}
              </a>
              <a
                href="/#contacto"
                aria-label={language === "es" ? "Contar mi proyecto" : "Tell Rodrigo about my project"}
                data-analytics="impact-cta-secondary"
                className="px-5 py-2 rounded-lg border border-gray-600 hover:bg-gray-800 transition"
              >
                {language === "es" ? "Contame tu proyecto" : "Tell me about your project"}
              </a>
            </div>
            <ul className="mt-6 grid gap-x-6 gap-y-2 text-sm leading-relaxed text-gray-300/90 sm:grid-cols-2">
              {t.transitionVisual.principles.map((principle) => (
                <li key={principle} className="flex items-start gap-2">
                  <span aria-hidden="true">•</span>
                  <span>{principle}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Imagen con overlay limpio */}
          <div className="relative rounded-xl overflow-hidden shadow-xl md:col-span-6">
            <img
              src="/img/impact.jpg"
              alt=""
              aria-hidden="true"
              width={1200}
              height={900}
              loading="lazy"
              decoding="async"
              sizes="(min-width:768px) 50vw, 100vw"
              className="object-cover w-full h-full object-right"
              style={{ objectPosition: "72% 46%" }}
            />
            {/* Overlay radial suave */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,.25),transparent_65%)] pointer-events-none" />
            {/* Fundido en los 4 lados para evitar cortes */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 via-black/30 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 via-black/30 to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black/45 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black/60 via-black/30 to-transparent pointer-events-none" />
          </div>
        </div>
      </section>
    </>
  );
}
