// src/Components/Navbar.tsx

import { useState, useEffect, useRef } from "react";
import translations from "../i18n";
import { useLanguage } from "../i18n/useLanguage";
import { FaBars, FaTimes } from "react-icons/fa";
import { FiGlobe } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import {
  getEquivalentLocalePath,
  getLocalizedPath,
} from "../routes/siteRoutes";
import type { Language } from "../i18n/language";

const MOBILE_NAVIGATION_ID = "mobile-navigation-panel";

type NoJavaScriptLanguageLinksProps = {
  className: string;
  language: Language;
  pathname: string;
};

function NoJavaScriptLanguageLinks({
  className,
  language,
  pathname,
}: NoJavaScriptLanguageLinksProps) {
  const spanishPath = getEquivalentLocalePath(pathname, "es");
  const englishPath = getEquivalentLocalePath(pathname, "en");
  const linkClassName =
    "rounded-sm transition hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black";

  return (
    <div
      data-nojs-language
      className={`hidden ${className}`}
      role="group"
      aria-label={language === "es" ? "Selector de idioma" : "Language selector"}
    >
      <FiGlobe className="text-white text-lg" aria-hidden="true" />
      <a
        href={spanishPath}
        className={`${linkClassName} ${language === "es" ? "text-primary" : "text-white"}`}
        aria-current={language === "es" ? "page" : undefined}
        aria-label={language === "es" ? "Español, idioma actual" : "Switch to Spanish"}
      >
        ES
      </a>
      <a
        href={englishPath}
        className={`${linkClassName} ${language === "en" ? "text-primary" : "text-white"}`}
        aria-current={language === "en" ? "page" : undefined}
        aria-label={language === "es" ? "Cambiar a inglés" : "English, current language"}
      >
        EN
      </a>
    </div>
  );
}

export default function Navbar() {
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const t = translations[language];
  const homePath = getLocalizedPath("home", language);
  const servicesPath = getLocalizedPath("services", language);
  const portfolioPath = getLocalizedPath("portfolio", language);
  const navigationLinks = [
    { id: "about", href: `${homePath}#sobremi`, label: t.nav.about },
    {
      id: "why",
      href: `${homePath}#porqueelegirnos`,
      label: t.nav.why,
    },
    { id: "services", href: servicesPath, label: t.nav.services },
    { id: "portfolio", href: portfolioPath, label: t.nav.portfolio },
    { id: "contact", href: `${homePath}#contacto`, label: t.nav.contact },
    { id: "faq", href: `${homePath}#faq`, label: t.nav.faq },
  ] as const;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => setMenuOpen((open) => !open);
  const closeMenu = () => {
    setMenuOpen(false);
    menuTriggerRef.current?.focus();
  };

  useEffect(() => {
    if (!menuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuTriggerRef.current?.focus();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [menuOpen]);

  return (
    <nav
      data-nojs-navbar
      className="fixed top-0 w-full z-50 bg-black/70 backdrop-blur-xl backdrop-saturate-150 border-b border-white/10 shadow-sm transition-all duration-300"
      aria-label={language === "es" ? "Navegación principal" : "Primary navigation"}
    >
      <div className="max-w-6xl mx-auto px-4 py-1 flex justify-between items-center">
        {/* Nombre (link to Home) */}
        <Link
          to={homePath}
          className="text-lg font-medium text-white tracking-normal leading-snug hover:opacity-80 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded"
          aria-label={language === "es" ? "DEVRODRI - Inicio" : "DEVRODRI - Home"}
        >
          <span className="font-semibold">devrodri</span>
        </Link>

        {/* Ícono hamburguesa mobile */}
        <div data-nojs-hide className="sm:hidden">
          <button
            ref={menuTriggerRef}
            onClick={toggleMenu}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded text-white text-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            aria-label={menuOpen ? (language === "es" ? "Cerrar menú" : "Close menu") : (language === "es" ? "Abrir menú" : "Open menu")}
            aria-expanded={menuOpen}
            aria-controls={menuOpen ? MOBILE_NAVIGATION_ID : undefined}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Links en desktop */}
        <div
          data-navbar-desktop
          className="hidden sm:flex items-center space-x-6 text-sm font-medium text-white"
        >
          {navigationLinks.map((link) => (
            <Link
              key={link.id}
              to={link.href}
              className="hover:text-primary transition"
            >
              {link.label}
            </Link>
          ))}

          {/* Selector de idioma */}
          <div data-nojs-hide className="flex items-center gap-2 ml-4">
            <FiGlobe className="text-white text-lg" aria-hidden="true" />
            <button
              onClick={() => setLanguage("es")}
              className={`text-sm ${language === "es" ? "text-primary" : "text-white"} hover:text-primary transition`}
              aria-label={language === "es" ? "Idioma español seleccionado" : "Switch to Spanish"}
              aria-pressed={language === "es"}
            >
              ES
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`text-sm ${language === "en" ? "text-primary" : "text-white"} hover:text-primary transition`}
              aria-label={language === "es" ? "Cambiar a inglés" : "Switch to English"}
              aria-pressed={language === "en"}
            >
              EN
            </button>
          </div>
          <NoJavaScriptLanguageLinks
            className="items-center gap-2 ml-4 text-sm"
            language={language}
            pathname={location.pathname}
          />
        </div>
      </div>

      {/* Menú desplegable mobile */}
      {menuOpen && (
        <div
          id={MOBILE_NAVIGATION_ID}
          data-nojs-hide
          className="sm:hidden px-4 pb-4 flex flex-col items-center space-y-4 text-sm font-medium bg-black/90 backdrop-blur-sm text-white"
        >
          {navigationLinks.map((link) => (
            <Link
              key={link.id}
              to={link.href}
              onClick={closeMenu}
              className="hover:text-primary transition"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-2 mt-2">
            <FiGlobe className="text-white text-lg" aria-hidden="true" />
            <button
              onClick={() => {
                setLanguage("es");
                closeMenu();
              }}
              className={`text-sm ${language === "es" ? "text-primary" : "text-white"} hover:text-primary transition`}
              aria-label={language === "es" ? "Idioma español seleccionado" : "Switch to Spanish"}
              aria-pressed={language === "es"}
            >
              ES
            </button>
            <button
              onClick={() => {
                setLanguage("en");
                closeMenu();
              }}
              className={`text-sm ${language === "en" ? "text-primary" : "text-white"} hover:text-primary transition`}
              aria-label={language === "es" ? "Cambiar a inglés" : "Switch to English"}
              aria-pressed={language === "en"}
            >
              EN
            </button>
          </div>
        </div>
      )}

      <div
        data-nojs-mobile-nav
        className="hidden px-4 pb-4 flex-col items-center gap-4 text-sm font-medium bg-black/90 backdrop-blur-sm text-white"
      >
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
          {navigationLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className="rounded transition hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              {link.label}
            </a>
          ))}
        </div>
        <NoJavaScriptLanguageLinks
          className="items-center gap-3 text-sm"
          language={language}
          pathname={location.pathname}
        />
      </div>
    </nav>
  );
}
