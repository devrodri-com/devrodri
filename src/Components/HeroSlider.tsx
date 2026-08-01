// src/Components/HeroSlider.tsx
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type CSSProperties,
} from "react";
import { useLanguage } from "../i18n/useLanguage";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getLocalizedPath } from "../routes/siteRoutes";

type HeroImageStyle = CSSProperties & {
  "--hero-mobile-object-position": string;
};

const slides = [
  {
    id: 1,
    image: "/img/hero-visual.jpg",
    imageWidth: 1536,
    imageHeight: 1024,
    imageMobile: "/img/hero-visual-mobile.jpg",
    imageMobileWidth: 1000,
    imageMobileHeight: 1384,
    imageAlt: "Man working on web design project on laptop",
    mobileObjectPosition: "center 46%",
    claim: {
      es: "RODRIGO OPALO · DESARROLLO FULL-STACK",
      en: "RODRIGO OPALO · FULL-STACK DEVELOPMENT",
    },
    mobileEyebrow: {
      es: "RODRIGO OPALO · FULL-STACK",
      en: "RODRIGO OPALO · FULL-STACK",
    },
    title: {
      es: "Sitios web que comunican y convierten.",
      en: "Websites built to communicate and convert.",
    },
    description: {
      es: "Diseño y desarrollo experiencias digitales claras, rápidas y orientadas a objetivos reales de negocio.",
      en: "I design and develop clear, fast digital experiences aligned with real business goals.",
    },
    button: {
      es: "Ver trabajos",
      en: "View work",
    },
    buttonLink: "/portfolio",
    focusCase: null,
  },
  {
    id: 2,
    image: "/img/software-slide.jpg",
    imageWidth: 1536,
    imageHeight: 1024,
    imageMobile: "/img/software-slide-mobile.jpg",
    imageMobileWidth: 1024,
    imageMobileHeight: 1536,
    imageAlt: "Dashboard of a custom software with charts and code",
    mobileObjectPosition: "center 44%",
    claim: {
      es: "SISTEMAS · PORTALES · HERRAMIENTAS INTERNAS",
      en: "CUSTOM SYSTEMS · PORTALS · INTERNAL TOOLS",
    },
    mobileEyebrow: {
      es: "SISTEMAS · PORTALES",
      en: "SYSTEMS · PORTALS",
    },
    title: {
      es: "Software a medida para operar mejor.",
      en: "Custom software for better operations.",
    },
    description: {
      es: "Construyo plataformas alineadas con los procesos reales de cada negocio y preparadas para crecer.",
      en: "I build platforms around real business processes, designed to evolve and grow.",
    },
    button: {
      es: "Ver LEM-BOX",
      en: "View LEM-BOX",
    },
    buttonLink: "/portfolio/lem-box",
    focusCase: null,
  },
  {
    id: 3,
    image: "/img/branding-slide.jpg",
    imageWidth: 1536,
    imageHeight: 1024,
    imageMobile: "/img/branding-slide-mobile.jpg",
    imageMobileWidth: 1024,
    imageMobileHeight: 1536,
    imageAlt: "Brand strategy and color palette design on tablet",
    mobileObjectPosition: "center 50%",
    claim: {
      es: "ESTRATEGIA DE MARCA · DIRECCIÓN CREATIVA · LANZAMIENTO DIGITAL",
      en: "BRAND STRATEGY · CREATIVE DIRECTION · DIGITAL LAUNCH",
    },
    mobileEyebrow: {
      es: "MARCA · DIRECCIÓN CREATIVA",
      en: "BRAND · CREATIVE DIRECTION",
    },
    title: {
      es: "Marcas con dirección y presencia digital.",
      en: "Brands with direction and a strong digital presence.",
    },
    description: {
      es: "Defino la estrategia y coordino la identidad, la infraestructura y la web para lanzar una marca con coherencia.",
      en: "I shape the strategy and coordinate identity, infrastructure, and web development to launch a coherent brand.",
    },
    button: {
      es: "Ver ZENTRA",
      en: "View ZENTRA",
    },
    buttonLink: "/portfolio",
    focusCase: "zentra",
  },
  {
    id: 4,
    image: "/img/automations-slide.jpg",
    imageWidth: 1536,
    imageHeight: 1024,
    imageMobile: "/img/automations-slide-mobile.jpg",
    imageMobileWidth: 1024,
    imageMobileHeight: 1536,
    imageAlt: "Automation workflows dashboard",
    mobileObjectPosition: "center 48%",
    claim: {
      es: "AUTOMATIZACIONES · INTEGRACIONES · IA APLICADA",
      en: "AUTOMATION · INTEGRATIONS · APPLIED AI",
    },
    mobileEyebrow: {
      es: "AUTOMATIZACIÓN · INTEGRACIONES",
      en: "AUTOMATION · INTEGRATIONS",
    },
    title: {
      es: "Menos tareas manuales. Más tiempo para crecer.",
      en: "Less manual work. More time to grow.",
    },
    description: {
      es: "Conecto herramientas, APIs y flujos para reducir trabajo repetitivo y mejorar la operación.",
      en: "I connect tools, APIs, and workflows to reduce repetitive tasks and improve operations.",
    },
    button: {
      es: "Contame tu proceso",
      en: "Tell me about your process",
    },
    buttonLink: "#contacto",
    focusCase: null,
  },
] as const;

export default function HeroSlider() {
  const { language } = useLanguage();
  const [index, setIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const isTransitioning = useRef(false);
  const transitionTimer = useRef<number | null>(null);
  const wheelTimer = useRef<number | null>(null);

  // Swipe handler with shortened protection time
  const handleSwipe = useCallback((direction: "left" | "right") => {
    if (isTransitioning.current) return;
    
    isTransitioning.current = true;
    if (direction === "left") {
      setIndex((prev) => (prev + 1) % slides.length);
    } else if (direction === "right") {
      setIndex((prev) => (prev - 1 + slides.length) % slides.length);
    }
    
    // Reduced timeout to 300ms (animation is 500ms but we want to be responsive)
    transitionTimer.current = window.setTimeout(() => {
      isTransitioning.current = false;
      transitionTimer.current = null;
    }, 300);
  }, []);

  // Touch handling for mobile - improved
  const handleTouchStart = (e: React.TouchEvent) => {
    const firstTouch = e.touches[0];
    if (firstTouch === undefined) return;
    setTouchStartX(firstTouch.clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const changedTouch = e.changedTouches[0];
    if (changedTouch === undefined) return;
    const touchEndX = changedTouch.clientX;
    const distance = touchStartX - touchEndX;
    
    // Even lower threshold for better sensitivity
    if (distance > 20) handleSwipe("left");
    else if (distance < -20) handleSwipe("right");
    
    setTouchStartX(null);
  };

  // Optimized wheel handling for trackpads
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Simplified, more responsive wheel handler
    const handleWheel = (e: WheelEvent) => {
      // Only handle horizontal scrolling or diagonal scrolling that's primarily horizontal
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) * 0.5) {
        e.preventDefault();
        
        // Use a smaller threshold for immediate response
        const threshold = 15;
        
        // Clear any existing timer
        if (wheelTimer.current !== null) {
          window.clearTimeout(wheelTimer.current);
          wheelTimer.current = null;
        }
        
        // Set a very short delay (15ms) just to batch rapid events
        wheelTimer.current = window.setTimeout(() => {
          wheelTimer.current = null;
          if (e.deltaX > threshold) handleSwipe("left");
          else if (e.deltaX < -threshold) handleSwipe("right");
        }, 15);
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    
    return () => {
      el.removeEventListener("wheel", handleWheel);
      if (wheelTimer.current !== null) {
        window.clearTimeout(wheelTimer.current);
        wheelTimer.current = null;
      }
    };
  }, [handleSwipe]);

  useEffect(() => {
    return () => {
      if (transitionTimer.current !== null) {
        window.clearTimeout(transitionTimer.current);
        transitionTimer.current = null;
      }
      isTransitioning.current = false;
    };
  }, []);

  const currentSlide = slides[index] ?? slides[0];
  const buttonLink =
    currentSlide.buttonLink === "/portfolio/lem-box"
      ? getLocalizedPath("lem-box", language)
      : currentSlide.buttonLink === "/portfolio"
        ? getLocalizedPath("portfolio", language)
        : currentSlide.buttonLink;
  const heroImageStyle: HeroImageStyle = {
    "--hero-mobile-object-position": currentSlide.mobileObjectPosition,
  };
  const imagePriorityProps: { fetchpriority?: "high" } =
    index === 0 ? { fetchpriority: "high" } : {};

  return (
    <section
      ref={sectionRef}
      className="relative bg-black text-white overflow-hidden"
      id="hero"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id}
          className="absolute inset-0"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* One responsive image, preserving the mobile and desktop compositions. */}
          <div
            className="absolute inset-x-0 top-[3.3125rem] h-[clamp(18rem,38svh,21rem)] md:inset-y-0 md:left-auto md:h-auto md:w-1/2"
            style={heroImageStyle}
          >
            <picture className="block h-full w-full">
              <source
                media="(max-width: 767px)"
                srcSet={currentSlide.imageMobile}
                width={currentSlide.imageMobileWidth}
                height={currentSlide.imageMobileHeight}
              />
              <img
                src={currentSlide.image}
                alt=""
                width={currentSlide.imageWidth}
                height={currentSlide.imageHeight}
                {...imagePriorityProps}
                className="h-full w-full object-cover [object-position:var(--hero-mobile-object-position)] md:object-center"
                draggable="false"
              />
            </picture>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-black md:hidden" />
            <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-black/60 via-black/30 to-transparent md:block" />
            <div className="pointer-events-none absolute left-0 top-0 hidden h-full w-24 bg-gradient-to-r from-black to-transparent sm:w-40 md:block md:w-56" />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Contenido */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col px-6 pb-20 pt-[calc(3.3125rem+clamp(18rem,38svh,21rem))] max-md:pb-[max(1.5rem,env(safe-area-inset-bottom))] md:grid md:min-h-[600px] md:grid-cols-2 md:items-center md:gap-10 md:px-6 md:py-28 xl:grid-cols-[minmax(0,40rem)_minmax(0,1fr)]">
        <div className="flex flex-col pt-4 max-md:pt-[0.875rem] md:min-h-[320px] md:justify-center md:pt-0">
          <p className="mb-2 max-w-[22rem] text-[0.6875rem] uppercase tracking-[0.16em] text-primary sm:max-w-none sm:text-xs sm:tracking-widest max-md:max-w-none max-md:text-sm max-md:tracking-[0.12em]">
            <span className="md:hidden">
              {currentSlide.mobileEyebrow[language]}
            </span>
            <span className="hidden md:inline">
              {currentSlide.claim[language]}
            </span>
          </p>
          <h1 className="mb-6 max-w-[22rem] break-words text-3xl font-bold leading-tight text-primary sm:max-w-full sm:text-5xl max-md:mb-5 max-md:flex max-md:min-h-[10.5rem] max-md:max-w-none max-md:items-center max-md:text-[2.5rem] max-md:leading-[1.05]">
            {currentSlide.title[language]}
          </h1>
          <p className="mb-8 max-w-[22rem] text-base leading-relaxed text-gray-300 sm:max-w-2xl sm:text-lg max-md:mb-6 max-md:flex max-md:min-h-[6.75rem] max-md:max-w-none max-md:items-center max-md:text-lg max-md:leading-[1.5] min-[420px]:max-md:min-h-[5.0625rem]">
            {currentSlide.description[language]}
          </p>
          <div className="w-fit">
            {currentSlide.buttonLink === "#contacto" ? (
              <a
                href={currentSlide.buttonLink}
                className="whitespace-nowrap rounded-full bg-primary-on-light px-6 py-3 font-medium text-white shadow-md transition-all hover:bg-primary-on-light-hover"
              >
                {currentSlide.button[language]}
              </a>
            ) : (
              <Link
                to={buttonLink}
                state={
                  currentSlide.focusCase === null
                    ? {}
                    : { focusCase: currentSlide.focusCase }
                }
                className="whitespace-nowrap rounded-full bg-primary-on-light px-6 py-3 font-medium text-white shadow-md transition-all hover:bg-primary-on-light-hover"
              >
                {currentSlide.button[language]}
              </Link>
            )}
          </div>
          <div
            className="relative z-20 mt-[2.625rem] h-2 w-24 self-center md:absolute md:bottom-6 md:left-1/2 md:mt-0 md:-translate-x-1/2 md:self-auto"
            role="group"
            aria-label={
              language === "es" ? "Navegación de slides" : "Slide navigation"
            }
          >
            {slides.map((slide, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className="absolute top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                style={{ left: `${i * 24}px` }}
                aria-label={
                  language === "es"
                    ? `Ir al slide ${i + 1} de ${slides.length}: ${slide.title[language]}`
                    : `Go to slide ${i + 1} of ${slides.length}: ${slide.title[language]}`
                }
                aria-pressed={i === index}
              >
                <span
                  aria-hidden="true"
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    i === index ? "bg-white" : "border border-white"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
        <div className="hidden md:block" />
      </div>

      {/* Gradiente inferior */}
      <div className="pointer-events-none absolute bottom-0 left-0 hidden h-24 w-full bg-gradient-to-b from-transparent to-black md:block" />

      {/* Flechas navegación */}
      <div className="hidden md:flex justify-between items-center absolute top-1/2 left-0 right-0 px-6 z-20 pointer-events-none transform -translate-y-1/2">
        <button
          onClick={() => handleSwipe("right")}
          className="bg-black/40 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-300 pointer-events-auto"
          aria-label={language === "es" ? "Slide anterior" : "Previous slide"}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={() => handleSwipe("left")}
          className="bg-black/40 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-300 pointer-events-auto"
          aria-label={language === "es" ? "Slide siguiente" : "Next slide"}
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </section>
  );
}
