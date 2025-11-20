// src/Components/HeroSlider.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "../LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SeoHeroSlide from "./SeoHeroSlide";

const slides = [
  {
    id: 1,
    image: "/img/hero-visual.jpg",
    imageMobile: "/img/hero-visual-mobile.jpg",
    imageAlt: "Man working on web design project on laptop",
    claim: {
      es: "SEO · Impacto visual · Experiencia de usuario",
      en: "SEO · Visual impact · User experience",
    },
    title: {
      es: "Diseño web profesional.",
      en: "Professional web design.",
    },
    description: {
      es: "Desarrollamos sitios modernos, optimizados y con propósito. Experiencias digitales que comunican, convierten y hacen destacar tu marca.",
      en: "We build modern, optimized, purpose-driven websites. Digital experiences that connect, convert, and elevate your brand.",
    },
    button: {
      es: "Ver trabajos",
      en: "See portfolio",
    },
    buttonLink: "/portfolio",
  },
  {
    id: 2,
    image: "/img/software-slide.jpg",
    imageMobile: "/img/software-slide-mobile.jpg",
    imageAlt: "Dashboard of a custom software with charts and code",
    claim: {
      es: "SaaS · Apps Web · Desarrollo a medida",
      en: "SaaS · Web apps · Custom development",
    },
    title: {
      es: "Software funcional y escalable.",
      en: "Functional and scalable software.",
    },
    description: {
      es: "Creamos soluciones a medida con arquitectura moderna, integración de APIs y foco en la experiencia del usuario.",
      en: "We build custom solutions with modern architecture, API integration, and a strong focus on user experience.",
    },
    button: {
      es: "Solicitar desarrollo",
      en: "Request development",
    },
    buttonLink: "mailto:rodrigo@lem-box.com",
  },
  {
    id: 3,
    image: "/img/branding-slide.jpg",
    imageMobile: "/img/branding-slide-mobile.jpg",
    imageAlt: "Brand strategy and color palette design on tablet",
    claim: {
      es: "Identidad visual · Marca · Estrategia",
      en: "Visual identity · Branding · Strategy",
    },
    title: {
      es: <>Partiendo de tu visión,<br />somos tu proyección.</>,
      en: <>Starting from your vision,<br />we become your projection.</>,
    },
    description: {
      es: "Diseño coherente, memorable y alineado a tu visión. Creamos marcas que conectan y perduran.",
      en: "Consistent, memorable design aligned with your vision. We build brands that connect and endure.",
    },
    button: {
      es: "Impulsar mi marca",
      en: "Boost my brand",
    },
    buttonLink: "mailto:r.opalo@icloud.com", // ✨ Cambio aquí
  },
  {
    id: 4,
    image: "/img/automations-slide.jpg",
    imageMobile: "/img/automations-slide-mobile.jpg",
    imageAlt: "Automation workflows dashboard",
    claim: {
      es: "Automatizaciones · MCP · n8n",
      en: "Automations · MCP · n8n",
    },
    title: {
      es: "Procesos que trabajan por vos.",
      en: "Workflows that work for you.",
    },
    description: {
      es: "Bots, integraciones y flujos que ahorran tiempo y escalan tu negocio.",
      en: "Bots, integrations and flows that save time and scale your business.",
    },
    button: {
      es: "Automatizar mi empresa",
      en: "Automate my business",
    },
    buttonLink: "#contacto",
  },
];

export default function HeroSlider() {
  const { language } = useLanguage();
  const [index, setIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const isTransitioning = useRef(false);
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
    setTimeout(() => {
      isTransitioning.current = false;
    }, 300);
  }, []);

  // Touch handling for mobile - improved
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
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
      }
    };
  }, [handleSwipe]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-black text-white overflow-hidden"
      id="hero"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <SeoHeroSlide index={index} />

      <AnimatePresence mode="wait">
        <motion.div
          key={slides[index].id}
          className="absolute inset-0"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Mobile background image (full-bleed) */}
          <div className="absolute inset-0 md:hidden">
            <img
              src={slides[index].imageMobile}
              alt={slides[index].imageAlt}
              className="h-full w-full object-cover object-center"
              draggable="false"
            />
            {/* Softer overlay for mobile to avoid harsh cuts and keep text legible */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent pointer-events-none" />
          </div>

          {/* Desktop image on the right half (unchanged) */}
          <div className="absolute inset-y-0 right-0 w-1/2 hidden md:block">
            <img
              src={slides[index].image}
              alt={slides[index].imageAlt}
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
        <div className="min-h-[320px] flex flex-col justify-center">
          <p className="text-xs uppercase tracking-widest text-primary mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] md:drop-shadow-none">
            {slides[index].claim[language]}
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-primary mb-6 leading-tight break-words max-w-[90vw] sm:max-w-full drop-shadow-[0_4px_18px_rgba(0,0,0,0.95)] md:drop-shadow-none">
  {slides[index].title[language]}
</h1>
<p className="text-base sm:text-lg text-gray-300 mb-8 leading-relaxed max-w-[90vw] sm:max-w-2xl drop-shadow-[0_3px_14px_rgba(0,0,0,0.9)] md:drop-shadow-none">
  {slides[index].description[language]}
</p>
          <div className="w-fit">
            <a
              href={slides[index].buttonLink}
              className="bg-primary text-white font-medium px-6 py-3 rounded-full shadow-md hover:bg-primary-dark transition-all whitespace-nowrap"
            >
              {slides[index].button[language]}
            </a>
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