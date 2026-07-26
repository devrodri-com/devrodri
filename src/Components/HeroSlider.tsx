import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type TouchEvent,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import translations, { type TranslationsStructure } from "../translations";

type HeroSlideKey = keyof TranslationsStructure["hero"]["slides"];

type HeroSlide = {
  id: string;
  image: string;
  imageMobile: string;
  copyKey: HeroSlideKey;
};

const slides: HeroSlide[] = [
  {
    id: "websites",
    image: "/img/hero-visual.jpg",
    imageMobile: "/img/hero-visual-mobile.jpg",
    copyKey: "websites",
  },
  {
    id: "custom-systems",
    image: "/img/software-slide.jpg",
    imageMobile: "/img/software-slide-mobile.jpg",
    copyKey: "customSystems",
  },
  {
    id: "integrations",
    image: "/img/automations-slide.jpg",
    imageMobile: "/img/automations-slide-mobile.jpg",
    copyKey: "integrations",
  },
  {
    id: "brand-launches",
    image: "/img/branding-slide.jpg",
    imageMobile: "/img/branding-slide-mobile.jpg",
    copyKey: "brandLaunches",
  },
];

const SWIPE_DISTANCE = 48;
const SWIPE_DOMINANCE = 1.25;
const WHEEL_DOMINANCE = 1.15;
const WHEEL_TRIGGER_DISTANCE = 24;
const WHEEL_DIRECTION_DISTANCE = 12;
const WHEEL_IDLE_MS = 160;
const WHEEL_COOLDOWN_MS = 420;

export default function HeroSlider() {
  const { language } = useLanguage();
  const t = translations[language].hero;
  const prefersReducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const wheelAbsoluteX = useRef(0);
  const wheelAbsoluteY = useRef(0);
  const wheelDirectionX = useRef(0);
  const wheelConsumed = useRef(false);
  const wheelCooldownUntil = useRef(0);
  const wheelResetTimer = useRef<number | null>(null);

  const setActiveSlide = useCallback((nextIndex: number) => {
    setIndex((nextIndex + slides.length) % slides.length);
  }, []);

  const showPreviousSlide = useCallback(() => {
    setIndex((currentIndex) =>
      (currentIndex - 1 + slides.length) % slides.length
    );
  }, []);

  const showNextSlide = useCallback(() => {
    setIndex((currentIndex) => (currentIndex + 1) % slides.length);
  }, []);

  const handleTouchStart = (event: TouchEvent<HTMLElement>) => {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: TouchEvent<HTMLElement>) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;

    const touch = event.changedTouches[0];
    const deltaX = start.x - touch.clientX;
    const deltaY = start.y - touch.clientY;
    const horizontalDistance = Math.abs(deltaX);
    const verticalDistance = Math.abs(deltaY);

    if (
      horizontalDistance < SWIPE_DISTANCE ||
      horizontalDistance <= verticalDistance * SWIPE_DOMINANCE
    ) {
      return;
    }

    if (deltaX > 0) showNextSlide();
    else showPreviousSlide();
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const resetWheelGesture = () => {
      wheelAbsoluteX.current = 0;
      wheelAbsoluteY.current = 0;
      wheelDirectionX.current = 0;
      wheelConsumed.current = false;
      wheelResetTimer.current = null;
    };

    const scheduleWheelReset = () => {
      if (wheelResetTimer.current !== null) {
        window.clearTimeout(wheelResetTimer.current);
      }
      wheelResetTimer.current = window.setTimeout(
        resetWheelGesture,
        WHEEL_IDLE_MS
      );
    };

    const handleWheel = (event: WheelEvent) => {
      const deltaScale =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? 16
          : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
            ? window.innerWidth
            : 1;
      const deltaX = event.deltaX * deltaScale;
      const deltaY = event.deltaY * deltaScale;
      const isHorizontalEvent =
        Math.abs(deltaX) > Math.abs(deltaY) * WHEEL_DOMINANCE;

      if (wheelConsumed.current) {
        if (isHorizontalEvent) event.preventDefault();
        scheduleWheelReset();
        return;
      }

      if (Date.now() < wheelCooldownUntil.current) {
        scheduleWheelReset();
        return;
      }

      wheelAbsoluteX.current += Math.abs(deltaX);
      wheelAbsoluteY.current += Math.abs(deltaY);
      wheelDirectionX.current += deltaX;

      const isHorizontalGesture =
        wheelAbsoluteX.current >= WHEEL_TRIGGER_DISTANCE &&
        wheelAbsoluteX.current >
          wheelAbsoluteY.current * WHEEL_DOMINANCE &&
        Math.abs(wheelDirectionX.current) >= WHEEL_DIRECTION_DISTANCE;

      if (isHorizontalGesture) {
        event.preventDefault();
        wheelConsumed.current = true;
        wheelCooldownUntil.current = Date.now() + WHEEL_COOLDOWN_MS;
        if (wheelDirectionX.current > 0) showNextSlide();
        else showPreviousSlide();
      }

      scheduleWheelReset();
    };

    section.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      section.removeEventListener("wheel", handleWheel);
      if (wheelResetTimer.current !== null) {
        window.clearTimeout(wheelResetTimer.current);
      }
    };
  }, [showNextSlide, showPreviousSlide]);

  const activeSlide = slides[index];
  const activeCopy = t.slides[activeSlide.copyKey];
  const motionOffset = prefersReducedMotion ? 0 : 80;
  const transitionDuration = prefersReducedMotion ? 0 : 0.5;

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[600px] overflow-hidden bg-black text-white"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={() => {
        touchStart.current = null;
      }}
    >
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={activeSlide.id}
          className="absolute inset-0"
          initial={{ opacity: 0, x: motionOffset }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -motionOffset }}
          transition={{ duration: transitionDuration, ease: "easeInOut" }}
        >
          <div className="absolute inset-0 md:hidden">
            <img
              src={activeSlide.imageMobile}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover object-center"
              draggable="false"
            />
            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/35" />
          </div>

          <div className="absolute inset-y-0 right-0 hidden w-1/2 md:block">
            <img
              src={activeSlide.image}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover object-center"
              draggable="false"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            <div className="absolute inset-y-0 left-0 w-56 bg-gradient-to-r from-black to-transparent" />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 mx-auto grid min-h-[600px] max-w-6xl items-center gap-10 px-4 py-24 sm:px-6 sm:py-28 md:grid-cols-2">
        <div className="flex min-h-[320px] max-w-[34rem] flex-col justify-center">
          <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] md:drop-shadow-none">
            {t.eyebrow}
          </p>
          <h1
            className="mb-6 break-words text-4xl font-bold leading-[1.06] text-[#66B3FF] drop-shadow-[0_4px_18px_rgba(0,0,0,0.95)] sm:text-5xl md:text-[2.125rem] md:text-primary md:drop-shadow-none lg:text-4xl xl:text-[2.75rem]"
            aria-live="polite"
          >
            {activeCopy.title}
          </h1>
          <p className="mb-8 max-w-[34rem] text-base leading-relaxed text-gray-200 drop-shadow-[0_3px_14px_rgba(0,0,0,0.9)] sm:text-lg md:drop-shadow-none">
            {activeCopy.description}
          </p>
          <div className="w-fit">
            <a
              href="#contacto"
              data-analytics="hero-cta-primary"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary-on-light px-6 py-3 font-medium text-white shadow-md transition hover:bg-primary-on-light-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {t.primaryCta}
            </a>
          </div>
        </div>
        <div className="hidden md:block" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-black" />

      <div
        className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1"
        role="group"
        aria-label={t.carouselLabel}
      >
        {slides.map((slide, slideIndex) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setActiveSlide(slideIndex)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label={`${t.goToSlide} ${slideIndex + 1} ${t.slideCountConnector} ${slides.length}: ${t.slides[slide.copyKey].title}`}
            aria-current={slideIndex === index ? "true" : undefined}
          >
            <span
              className={`h-2.5 w-2.5 rounded-full transition-colors ${
                slideIndex === index
                  ? "bg-white"
                  : "border border-white bg-black/30"
              }`}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-between px-5 lg:flex">
        <button
          type="button"
          onClick={showPreviousSlide}
          className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label={t.previousSlide}
        >
          <ChevronLeft className="h-6 w-6" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={showNextSlide}
          className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label={t.nextSlide}
        >
          <ChevronRight className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
