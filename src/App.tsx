// src/App.tsx
import { useLanguage } from "./i18n/useLanguage";
import {
  HelmetProvider,
  type FilledContext,
} from "react-helmet-async";
import SeoHead from "./Components/SeoHead";
import { lazy, Suspense, useEffect, useRef } from "react";
import HeroSlider from "./Components/HeroSlider";
import SobreMiSection from "./Components/SobreMiSection";
import HighlightsSection from "./Components/HighlightsSection";
import PortfolioSection from "./Components/PortfolioSection";
import ContactSection from "./Components/ContactSection";
import FaqSection from "./Components/FaqSection";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import ImpactSection from "./Components/ImpactSection";
import ExperienceSection from "./Components/ExperienceSection";
import TransitionServicesIntro from "./Components/TransitionServicesIntro";
import NotFoundPage from "./pages/NotFoundPage";
import CTASection from "./Components/CTASection";
import { Routes, Route, useLocation } from "react-router-dom";
import {
  isAnalyticsClickLabel,
  trackAnalyticsClick,
  trackPageView,
} from "./lib/analytics";
import {
  getPublicRoute,
  PUBLIC_ROUTES,
  type PageKey,
} from "./routes/siteRoutes";

const PortfolioPage = lazy(() => import("./pages/PortfolioPage"));
const LemBoxCasePage = lazy(() => import("./pages/LemBoxCasePage"));

const HomePage = () => (
  <>
    {/* Hero Slider */}
    <HeroSlider />
    {/* Impact Section */}
    <ImpactSection />
    {/* SOBRE MÍ con curva incluida internamente */}
    <SobreMiSection />
    {/* Experience */}
    <ExperienceSection />
    {/* Highlights */}
    <HighlightsSection />
    {/* Intro antes del bloque de servicios */}
    <TransitionServicesIntro />
    {/* Portfolio */}
    <PortfolioSection />
    {/* Bridge blanco entre Portfolio y Contacto */}
    <TransitionServicesIntro variant="afterPortfolio" />
    {/* Contacto */}
    <ContactSection />
    {/* Preguntas Frecuentes */}
    <FaqSection />
    {/* CTASection */}
    <CTASection />
  </>
);

function PublicPage({ page }: { page: PageKey }) {
  const { language } = useLanguage();

  if (page === "home") return <HomePage />;
  if (page === "portfolio") {
    return (
      <Suspense
        fallback={
          <div className="min-h-[45vh] flex items-center justify-center bg-black text-white/70 text-sm px-4 text-center">
            {language === "es" ? "Cargando portfolio…" : "Loading portfolio…"}
          </div>
        }
      >
        <PortfolioPage />
      </Suspense>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-[45vh] flex items-center justify-center bg-black text-white/70 text-sm px-4 text-center">
          {language === "es"
            ? "Cargando caso LEM-BOX…"
            : "Loading LEM-BOX case study…"}
        </div>
      }
    >
      <LemBoxCasePage />
    </Suspense>
  );
}


function ScrollToHash() {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [location.pathname, location.hash]);
  return null;
}

function usePageview() {
  const location = useLocation();
  const lastTrackedPathname = useRef<string | null>(null);

  useEffect(() => {
    if (lastTrackedPathname.current === location.pathname) return;
    lastTrackedPathname.current = location.pathname;
    trackPageView(location.pathname);
  }, [location.pathname]);
}

function useAnalyticsEvents() {
  useEffect(() => {
    const handler = (e: Event) => {
      if (!(e.target instanceof Element)) return;
      const target = e.target.closest<HTMLElement>("[data-analytics]");
      const label = target?.dataset.analytics;
      if (label === undefined || !isAnalyticsClickLabel(label)) return;
      trackAnalyticsClick(label);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);
}

function App({
  helmetContext,
}: {
  helmetContext?: Partial<FilledContext>;
} = {}) {
  const location = useLocation();
  const isNotFound = getPublicRoute(location.pathname) === null;

  usePageview();
  useAnalyticsEvents();

  return (
    <HelmetProvider
      {...(helmetContext === undefined ? {} : { context: helmetContext })}
    >
      <div
        className={`font-sans bg-neutral text-gray-900 min-h-screen${
          isNotFound ? " flex flex-col" : ""
        }`}
        style={isNotFound ? { minHeight: "100dvh" } : undefined}
      >
        <SeoHead />

        {/* ✅ Navbar */}
        <Navbar />

        <ScrollToHash />

        <Routes>
          {PUBLIC_ROUTES.map((route) => (
            <Route
              key={route.routeKey}
              path={route.pathname}
              element={<PublicPage page={route.page} />}
            />
          ))}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        <Footer />
      </div>
    </HelmetProvider>
  );
}

export default App;
