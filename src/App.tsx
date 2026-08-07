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
import ThankYouPage from "./pages/ThankYouPage";
import CTASection from "./Components/CTASection";
import {
  Routes,
  Route,
  useLocation,
  useNavigationType,
} from "react-router-dom";
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
import {
  focusElement,
  getHashTarget,
  userPrefersReducedMotion,
} from "./lib/navigationFocus";
import {
  isLocaleSwitchNavigationState,
  restoreLocaleScrollContext,
} from "./lib/localeScroll";

const PortfolioPage = lazy(() => import("./pages/PortfolioPage"));
const LemBoxCasePage = lazy(() => import("./pages/LemBoxCasePage"));
const ServicesHubPage = lazy(() => import("./pages/ServicesHubPage"));
const BusinessWebsitesPage = lazy(() => import("./pages/BusinessWebsitesPage"));
const CustomSoftwarePage = lazy(() => import("./pages/CustomSoftwarePage"));

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
  const lazyPageFallback = (
    <div className="min-h-[45vh] flex items-center justify-center bg-black text-white/70 text-sm px-4 text-center">
      {language === "es" ? "Cargando…" : "Loading…"}
    </div>
  );

  if (page === "home") return <HomePage />;
  if (page === "thank-you") return <ThankYouPage />;
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
  if (page === "services") {
    return (
      <Suspense fallback={lazyPageFallback}>
        <ServicesHubPage />
      </Suspense>
    );
  }
  if (page === "business-websites") {
    return (
      <Suspense fallback={lazyPageFallback}>
        <BusinessWebsitesPage />
      </Suspense>
    );
  }
  if (page === "custom-software") {
    return (
      <Suspense fallback={lazyPageFallback}>
        <CustomSoftwarePage />
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


const HASH_TARGET_WAIT_MS = 750;

function focusMainContent(): void {
  const main = document.getElementById("main-content");
  if (main instanceof HTMLElement) focusElement(main);
}

function NavigationFocusManager({ isNotFound }: { isNotFound: boolean }) {
  const location = useLocation();
  const navigationType = useNavigationType();
  const mounted = useRef(false);
  const previousLocation = useRef({
    hash: location.hash,
    pathname: location.pathname,
  });

  useEffect(() => {
    const main = document.getElementById("main-content");
    if (!(main instanceof HTMLElement)) return;

    if (!mounted.current) {
      mounted.current = true;
      if (isNotFound) focusElement(main);
      return;
    }

    const previous = previousLocation.current;
    const pathnameChanged = previous.pathname !== location.pathname;
    const hashChanged = previous.hash !== location.hash;
    previousLocation.current = {
      hash: location.hash,
      pathname: location.pathname,
    };

    if (!pathnameChanged && !hashChanged) return;

    const scrollBehavior = userPrefersReducedMotion() ? "auto" : "smooth";
    const scrollMainToTop = () => {
      if (navigationType !== "POP") {
        window.scrollTo({ behavior: scrollBehavior, left: 0, top: 0 });
      }
    };

    if (location.hash === "") {
      if (isLocaleSwitchNavigationState(location.state)) return;
      focusElement(main);
      scrollMainToTop();
      return;
    }

    let settled = false;
    let timeoutId = 0;

    const observer = new MutationObserver(() => {
      const target = getHashTarget(location.hash);
      if (target === null || settled) return;

      settled = true;
      observer.disconnect();
      window.clearTimeout(timeoutId);
      focusElement(target);
      target.scrollIntoView({ behavior: scrollBehavior, block: "start" });
    });

    const immediateTarget = getHashTarget(location.hash);
    if (immediateTarget !== null) {
      settled = true;
      focusElement(immediateTarget);
      immediateTarget.scrollIntoView({
        behavior: scrollBehavior,
        block: "start",
      });
      return;
    }

    observer.observe(main, { childList: true, subtree: true });
    timeoutId = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      observer.disconnect();
      focusElement(main);
      scrollMainToTop();
    }, HASH_TARGET_WAIT_MS);

    return () => {
      settled = true;
      observer.disconnect();
      window.clearTimeout(timeoutId);
    };
  }, [isNotFound, location.hash, location.pathname, location.state, navigationType]);

  return null;
}

function LocaleSwitchScrollRestoration() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const frameIds = useRef<number[]>([]);

  useEffect(() => {
    frameIds.current.forEach((id) => window.cancelAnimationFrame(id));
    frameIds.current = [];

    if (navigationType === "POP") return;
    if (location.hash !== "") return;
    if (!isLocaleSwitchNavigationState(location.state)) return;

    const { scrollContext } = location.state;

    const firstFrame = window.requestAnimationFrame(() => {
      const secondFrame = window.requestAnimationFrame(() => {
        restoreLocaleScrollContext(scrollContext);
      });
      frameIds.current.push(secondFrame);
    });
    frameIds.current.push(firstFrame);

    return () => {
      frameIds.current.forEach((id) => window.cancelAnimationFrame(id));
      frameIds.current = [];
    };
  }, [location.hash, location.key, location.state, navigationType]);

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
  const publicRoute = getPublicRoute(location.pathname);
  const isNotFound = publicRoute === null;
  const isFullHeightPage = isNotFound || publicRoute.page === "thank-you";
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
            isFullHeightPage ? " flex flex-col" : ""
          }`}
          style={isFullHeightPage ? { minHeight: "100dvh" } : undefined}
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
              isFullHeightPage
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
          <LocaleSwitchScrollRestoration />

          <Footer />
        </div>
      </MotionConfig>
    </HelmetProvider>
  );
}

export default App;
