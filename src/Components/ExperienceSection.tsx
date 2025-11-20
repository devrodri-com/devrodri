// src/Components/ExperienceSection.tsx
import { useLanguage } from "../LanguageContext";
import translations from "../translations";
import SeoExperienceSection from "./SeoExperienceSection";

export default function ExperienceSection() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <section
      id="experiencia"
      data-section="experience"
      className="bg-black text-white py-28 px-4 sm:px-6"
    >
      <SeoExperienceSection />
      <div className="max-w-6xl mx-auto grid md:grid-cols-12 items-center gap-12">
        {/* Imagen */}
        <div className="relative rounded-xl overflow-hidden shadow-xl md:col-span-6 order-1 md:order-none min-h-[360px]">
          <img
            src="/img/experience.jpg"
            alt="Detalle visual que representa experiencias digitales"
            width={1200}
            height={900}
            loading="lazy"
            decoding="async"
            sizes="(min-width:768px) 50vw, 100vw"
            className="object-cover w-full h-full"
            style={{ objectPosition: "53% 50%" }}
          />
          {/* Overlays para fundir sin cortes */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,.15),transparent_65%)] pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 via-black/30 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 via-black/30 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black/45 via-black/20 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black/60 via-black/30 to-transparent pointer-events-none" />
        </div>

        {/* Texto */}
        <div className="md:col-span-6">
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-tight mb-8 max-w-[40rem]">
            {t.experience.title1} {t.experience.title2}
          </h2>
          <p className="text-gray-300/90 text-lg leading-relaxed max-w-[36rem]">
            {t.experience.description}
          </p>
        </div>
      </div>
    </section>
  );
}