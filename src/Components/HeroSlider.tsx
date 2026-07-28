// src/Components/HeroSlider.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "../i18n/useLanguage";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const slides = [
  {
    id: 1,
    image: "/img/hero-visual.jpg",
    imageMobile: "/img/hero-visual-mobile.jpg",
    imageAlt: "Man working on web design project on laptop",
    mobileObjectPosition: "58% center",
    mobileOverlayClassName:
      "bg-[linear-gradient(90deg,rgba(0,0,0,0.99)_0%,rgba(0,0,0,0.95)_72%,rgba(0,0,0,0.8)_100%)]",
    claim: {
      es: "RODRIGO OPALO · DESARROLLO FULL-STACK",
      en: "RODRIGO OPALO · FULL-STACK DEVELOPMENT",
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
    imageMobile: "/img/software-slide-mobile.jpg",
    imageAlt: "Dashboard of a custom software with charts and code",
    mobileObjectPosition: "64% center",
    mobileOverlayClassName:
      "bg-[linear-gradient(90deg,rgba(0,0,0,0.95)_0%,rgba(0,0,0,0.84)_72%,rgba(0,0,0,0.5)_100%)]",
    claim: {
      es: "SISTEMAS · PORTALES · HERRAMIENTAS INTERNAS",
      en: "CUSTOM SYSTEMS · PORTALS · INTERNAL TOOLS",
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
    buttonLink: "/portfolio",
    focusCase: "lem_box",
  },
  {
    id: 3,
    image: "/img/branding-slide.jpg",
    imageMobile: "/img/branding-slide-mobile.jpg",
    imageAlt: "Brand strategy and color palette design on tablet",
    mobileObjectPosition: "68% center",
    mobileOverlayClassName:
      "bg-[linear-gradient(90deg,rgba(0,0,0,0.98)_0%,rgba(0,0,0,0.93)_72%,rgba(0,0,0,0.75)_100%)]",
    claim: {
      es: "ESTRATEGIA DE MARCA · DIRECCIÓN CREATIVA · LANZAMIENTO DIGITAL",
      en: "BRAND STRATEGY · CREATIVE DIRECTION · DIGITAL LAUNCH",
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
    imageMobile: "/img/automations-slide-mobile.jpg",
    imageAlt: "Automation workflows dashboard",
    mobileObjectPosition: "72% center",
    mobileOverlayClassName:
      "bg-[linear-gradient(90deg,rgba(0,0,0,0.96)_0%,rgba(0,0,0,0.9)_72%,rgba(0,0,0,0.66)_100%)]",
    claim: {
      es: "AUTOMATIZACIONES · INTEGRACIONES · IA APLICADA",
      en: "AUTOMATION · INTEGRATIONS · APPLIED AI",
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
          {/* Mobile background image (full-bleed) */}
          <div className="absolute inset-0 md:hidden">
            <img
              src={currentSlide.imageMobile}
              alt={currentSlide.imageAlt}
              className="h-full w-full object-cover object-center"
              style={{ objectPosition: currentSlide.mobileObjectPosition }}
              draggable="false"
            />
            <div
              className={`absolute inset-0 pointer-events-none ${currentSlide.mobileOverlayClassName}`}
            />
          </div>

          {/* Desktop image on the right half (unchanged) */}
          <div className="absolute inset-y-0 right-0 w-1/2 hidden md:block">
            <img
              src={currentSlide.image}
              alt={currentSlide.imageAlt}
              className="h-full w-full object-cover object-center"
              draggable="false"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent pointer-events-none" />
            <div className="absolute left-0 top-0 h-full w-24 sm:w-40 md:w-56 bg-gradient-to-r from-black to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Contenido */}
      <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center px-4 sm:px-6 py-28 min-h-[600px]">
        <div className="min-h-[320px] flex max-w-[34rem] flex-col justify-center md:max-w-none">
          <p className="mb-2 max-w-[22rem] text-[0.6875rem] uppercase tracking-[0.16em] text-primary sm:max-w-none sm:text-xs sm:tracking-widest">
            {currentSlide.claim[language]}
          </p>
          <h1 className="mb-6 max-w-[22rem] break-words text-3xl font-bold leading-tight text-primary sm:max-w-full sm:text-5xl">
            {currentSlide.title[language]}
          </h1>
          <p className="mb-8 max-w-[22rem] text-base leading-relaxed text-gray-300 sm:max-w-2xl sm:text-lg">
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
                to={currentSlide.buttonLink}
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
        </div>
        <div className="hidden md:block" />
      </div>

      {/* Gradiente inferior */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-b from-transparent to-black pointer-events-none" />

      {/* Indicadores */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-20" role="tablist" aria-label={language === "es" ? "Navegación de slides" : "Slide navigation"}>
        {slides.map((slide, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              i === index ? "bg-white" : "border border-white"
            }`}
            role="tab"
            aria-label={language === "es" 
              ? `Ir al slide ${i + 1} de ${slides.length}: ${slide.title[language]}`
              : `Go to slide ${i + 1} of ${slides.length}: ${slide.title[language]}`
            }
            aria-selected={i === index}
            aria-controls={`slide-${i}`}
          ></button>
        ))}
      </div>

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
