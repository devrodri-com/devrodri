// src/Components/HighlightsSection.tsx
import {
  BriefcaseBusiness,
  Compass,
  Cpu,
  Layers3,
  MessageCircle,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import translations from "../i18n";
import { useLanguage } from "../i18n/useLanguage";

type HighlightKey = keyof typeof translations.es.highlights.items;

const iconMap: Record<HighlightKey, LucideIcon> = {
  product: Compass,
  purpose: Cpu,
  direct: MessageCircle,
  business: BriefcaseBusiness,
  automation: Workflow,
  stages: Layers3,
};

export default function HighlightsSection() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <>
      <section className="bg-white text-center pt-6 pb-6">
        <p className="text-sm sm:text-base font-light text-gray-600 tracking-tight">
          {t.transitionIntro.text}
        </p>
      </section>

      <section
        id="porqueelegirnos"
        className="relative bg-[#02050d] py-28 px-4 sm:px-6 overflow-hidden"
      >
        <div
          aria-hidden="true"
          data-highlights-background
          className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[linear-gradient(135deg,#02050d_0%,#071426_46%,#030814_100%)]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_18%,rgba(10,132,255,0.18),transparent_42%),radial-gradient(ellipse_at_82%_78%,rgba(0,95,204,0.14),transparent_46%)]" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] mb-12 sm:mb-16">
            {t.highlights.title}
          </h2>

          <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 gap-y-12">
            {Object.entries(t.highlights.items).map(([key, item]) => {
              const iconKey = key as HighlightKey;
              const Icon = iconMap[iconKey];

              return (
                <div
                  key={key}
                  className="p-6 md:p-6 lg:p-7 rounded-xl bg-white/65 border border-white/30 shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:ring-1 hover:ring-white/30 transition-transform duration-300 transform-gpu backdrop-blur-md z-10"
                >
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/70 ring-1 ring-white/40 backdrop-blur-sm">
                      <Icon
                        aria-hidden="true"
                        data-highlight-icon={iconKey}
                        className="h-7 w-7 stroke-[1.8] text-primary-on-light"
                      />
                    </div>
                  </div>
                  <h3 className="text-[15px] font-semibold tracking-tight text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-gray-700/95 max-w-[32ch] mx-auto">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
