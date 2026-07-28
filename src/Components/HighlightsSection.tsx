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
import { useRef, useEffect } from "react";

type HighlightKey = keyof typeof translations.es.highlights.items;

const iconMap: Record<HighlightKey, LucideIcon> = {
  product: Compass,
  purpose: Cpu,
  direct: MessageCircle,
  business: BriefcaseBusiness,
  automation: Workflow,
  stages: Layers3,
};

function handlePlaybackRejection(
  video: HTMLVideoElement,
  error: unknown,
): void {
  if (
    error instanceof DOMException &&
    (error.name === "AbortError" || error.name === "NotAllowedError")
  ) {
    return;
  }
  video.pause();
}

export default function HighlightsSection() {
  const { language } = useLanguage();
  const t = translations[language];
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Respect reduced motion
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (prefersReduced) {
      video.pause();
      return;
    }

    // Ensure attributes for iOS/Safari
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");

    // Observer to play/pause based on visibility
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            void video.play().catch((error: unknown) => {
              handlePlaybackRejection(video, error);
            });
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.25 }
    );

    io.observe(video);

    return () => {
      io.disconnect();
    };
  }, []);

  return (
    <>
      <section className="bg-white text-center pt-6 pb-6">
        <p className="text-sm sm:text-base font-light text-gray-600 tracking-tight">
          {t.transitionIntro.text}
        </p>
      </section>

      <section
        id="porqueelegirnos"
        className="relative bg-white py-28 px-4 sm:px-6 overflow-hidden"
      >
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            loop
            playsInline
            preload="metadata"
            disableRemotePlayback
            aria-hidden="true"
            poster="/img/hero-visual.jpg"
            className="absolute inset-0 w-full h-full object-cover opacity-100"
            id="bgVideo"
            muted
          >
            <source src="/videos/highlights-bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,.45),transparent_60%)] pointer-events-none z-0" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/55 to-transparent pointer-events-none z-0" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-0" />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] mb-12 sm:mb-16">
            {t.highlights.title}
          </h2>

          <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 gap-y-12">
            <div className="pointer-events-none absolute inset-0 bg-black/10 md:bg-black/15 backdrop-blur-[1px] rounded-none z-0" />
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
