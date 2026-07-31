// src/App.tsx
import { useLanguage } from "./i18n/useLanguage";
import {
  HelmetProvider,
  type FilledContext,
} from "react-helmet-async";
import SeoHead from "./Components/SeoHead";
import { lazy, Suspense, useEffect, useRef } from "react";
import { MotionConfig } from "framer-motion";
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


const PROGRAMMATICALLY_FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]",
  '[contenteditable="true"]',
].join(",");

function prefersReducedMotion(): boolean {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function focusElement(element: HTMLElement): () => void {
  const needsTemporaryTabIndex = !element.matches(
    PROGRAMMATICALLY_FOCUSABLE_SELECTOR,
  );

  if (needsTemporaryTabIndex) element.setAttribute("tabindex", "-1");
  element.focus({ preventScroll: true });

  if (!needsTemporaryTabIndex) return () => undefined;

  const removeTemporaryTabIndex = () => {
    if (element.getAttribute("tabindex") === "-1") {
      element.removeAttribute("tabindex");
    }
  };
  element.addEventListener("blur", removeTemporaryTabIndex, { once: true });

  return () => {
    element.removeEventListener("blur", removeTemporaryTabIndex);
    removeTemporaryTabIndex();
  };
}

function getHashTarget(hash: string): HTMLElement | null {
  const rawId = hash.slice(1);
  let id = rawId;
  try {
    id = decodeURIComponent(rawId);
  } catch {
    // An invalid encoded fragment cannot match a document ID.
  }
  return document.getElementById(id);
}

function focusMainContent(): void {
  const main = document.getElementById("main-content");
  if (main !== null) focusElement(main);
}

function NavigationFocusManager({ isNotFound }: { isNotFound: boolean }) {
  const location = useLocation();
  const hasMounted = useRef(false);
  const previousLocation = useRef({
    hash: location.hash,
    pathname: location.pathname,
  });

  useEffect(() => {
    const main = document.getElementById("main-content");
    if (main === null) return;

    if (!hasMounted.current) {
      hasMounted.current = true;
      if (isNotFound) focusElement(main);
      return;
    }

    const previous = previousLocation.current;
    if (
      previous.pathname === location.pathname &&
      previous.hash === location.hash
    ) {
      return;
    }
    previousLocation.current = {
      hash: location.hash,
      pathname: location.pathname,
    };

    if (location.hash === "") {
      const removeFocusCleanup = focusElement(main);
      window.scrollTo({ top: 0, behavior: "auto" });
      return removeFocusCleanup;
    }

    const scrollBehavior = prefersReducedMotion() ? "auto" : "smooth";
    let removeFocusCleanup: (() => void) | undefined;
    let settled = false;
    let fallbackTimer = 0;

    const focusHashTarget = () => {
      if (settled) return;
      const target = getHashTarget(location.hash);
      if (target === null) return;

      settled = true;
      observer.disconnect();
      window.clearTimeout(fallbackTimer);
      removeFocusCleanup = focusElement(target);
      target.scrollIntoView({ behavior: scrollBehavior, block: "start" });
    };

    const observer = new MutationObserver(focusHashTarget);
    observer.observe(main, { childList: true, subtree: true });
    focusHashTarget();
    if (!settled) {
      fallbackTimer = window.setTimeout(() => {
        if (settled) return;
        settled = true;
        observer.disconnect();
        removeFocusCleanup = focusElement(main);
        window.scrollTo({ top: 0, behavior: "auto" });
      }, 400);
    }

    return () => {
      settled = true;
      observer.disconnect();
      window.clearTimeout(fallbackTimer);
      removeFocusCleanup?.();
    };
  }, [isNotFound, location.hash, location.pathname]);

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
  const { language } = useLanguage();

  usePageview();
  useAnalyticsEvents();

  return (
    <HelmetProvider
      {...(helmetContext === undefined ? {} : { context: helmetContext })}
    >
      <MotionConfig reducedMotion="user">
        <div
          className={`font-sans bg-neutral text-gray-900 min-h-screen${
            isNotFound ? " flex flex-col" : ""
          }`}
          style={isNotFound ? { minHeight: "100dvh" } : undefined}
        >
          <SeoHead />

          <a
            className="skip-link"
            href="#main-content"
            onClick={focusMainContent}
          >
            {language === "es"
              ? "Saltar al contenido principal"
              : "Skip to main content"}
          </a>

          {/* ✅ Navbar */}
          <Navbar />

          <main
            id="main-content"
            tabIndex={-1}
            className={
              isNotFound
                ? "flex flex-1 focus:outline-none"
                : "focus:outline-none"
            }
          >
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
          </main>

          <NavigationFocusManager isNotFound={isNotFound} />

          <Footer />
        </div>
      </MotionConfig>
    </HelmetProvider>
  );
}

export default App;
