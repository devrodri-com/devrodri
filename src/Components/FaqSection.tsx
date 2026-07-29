// src/Components/FaqSection.tsx
import translations from "../i18n";
import { useLanguage } from "../i18n/useLanguage";

const FAQ_KEYS = [
  "projectTypes",
  "projectStart",
  "websiteVsSystem",
  "phasedWork",
  "websiteCapabilities",
  "automations",
  "brandDevelopment",
  "budgetAndPayment",
  "postLaunch",
] as const;

export default function FaqSection() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <section
      id="faq"
      className="relative bg-black py-28 px-4 sm:px-6 overflow-hidden"
    >
      {/* Imagen de fondo centrada y ampliada con degradado sutil */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="/img/faq-bg.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover scale-125" // aumentamos el tamaño
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
      </div>

      {/* Degradado superior (desde negro a imagen) */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black to-transparent z-10" />

      {/* Degradado inferior (imagen a negro) */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black to-transparent z-10" />

      {/* Contenido principal */}
      <div className="relative z-20 max-w-4xl mx-auto">
        <h2
          className="text-4xl sm:text-5xl font-bold text-center text-white mb-12 tracking-tight leading-tight drop-shadow-sm"
        >
          {t.faq.title}
        </h2>

        <div className="space-y-8">
          {FAQ_KEYS.map((key) => (
            <div
              key={key}
              data-faq-key={key}
              className="bg-white p-6 sm:p-7 px-5 sm:px-6 rounded-2xl shadow-md border border-gray-100 cursor-default transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:shadow-lg hover:scale-[1.01]"
            >
              <h3 className="font-semibold text-lg sm:text-xl text-primary-on-light mb-2">
                {t.faq.questions[key].question}
              </h3>
              <p className="text-neutral-800 text-base leading-relaxed">
                {t.faq.questions[key].answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
