// src/Components/HighlightsSection.tsx
import { ChevronDown, Zap, Smartphone, Target, Rocket, Workflow, CreditCard } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import translations from "../translations";
import SeoHighlightsSection from "./SeoHighlightsSection";
import { useRef, useEffect } from "react";

const iconMap = {
  fast: (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/70 ring-1 ring-white/40 backdrop-blur-sm">
      <Zap className="h-7 w-7 stroke-[1.8] text-[#3B82F6]" />
    </div>
  ),
  responsive: (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/70 ring-1 ring-white/40 backdrop-blur-sm">
      <Smartphone className="h-7 w-7 stroke-[1.8] text-[#3B82F6]" />
    </div>
  ),
  results: (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/70 ring-1 ring-white/40 backdrop-blur-sm">
      <Target className="h-7 w-7 stroke-[1.8] text-[#3B82F6]" />
    </div>
  ),
  seo: (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/70 ring-1 ring-white/40 backdrop-blur-sm">
      <Rocket className="h-7 w-7 stroke-[1.8] text-[#3B82F6]" />
    </div>
  ),
  automation: (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/70 ring-1 ring-white/40 backdrop-blur-sm">
      <Workflow className="h-7 w-7 stroke-[1.8] text-[#3B82F6]" />
    </div>
  ),
  payments: (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/70 ring-1 ring-white/40 backdrop-blur-sm">
      <CreditCard className="h-7 w-7 stroke-[1.8] text-[#3B82F6]" />
    </div>
  ),
};

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
            video.play().catch(() => {});
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
      <section className="bg-white text-center pt-6 pb-2">
        <p className="text-sm sm:text-base font-light text-gray-600 tracking-tight">
          {t.transitionIntro.text}
        </p>
        <div className="flex justify-center mt-1">
          <ChevronDown className="h-3.5 w-3.5 text-gray-400 animate-bounce" />
        </div>
      </section>

      <section
        id="porqueelegirnos"
        className="relative bg-white py-28 px-4 sm:px-6 overflow-hidden"
      >
        <SeoHighlightsSection />

        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            loop
            playsInline
            preload="metadata"
            disableRemotePlayback
            aria-hidden="true"
            poster="/img/highlights-bg.jpg"
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
            {Object.entries(t.highlights.items).map(([key, item]) => (
              <div
                key={key}
                className="p-6 md:p-6 lg:p-7 rounded-xl bg-white/65 border border-white/30 shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:ring-1 hover:ring-white/30 transition-transform duration-300 transform-gpu backdrop-blur-md z-10"
              >
                <div className="mb-4 flex justify-center">
                  {iconMap[key as keyof typeof iconMap]}
                </div>
                <h3 className="text-[15px] font-semibold tracking-tight text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-gray-700/95 max-w-[32ch] mx-auto">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
