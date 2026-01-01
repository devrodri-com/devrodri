// src/Components/Navbar.tsx

import { useState, useEffect } from "react";
import { useLanguage } from "../LanguageContext";
import translations from "../translations";
import { FaBars, FaTimes } from "react-icons/fa";
import { FiGlobe } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    if (!savedLang) {
      const browserLang = navigator.language.startsWith("en") ? "en" : "es";
      setLanguage(browserLang);
    }
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md shadow-sm transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 py-1 flex justify-between items-center">
        {/* Nombre (link to Home) */}
        <Link
          to="/"
          className="text-lg font-medium text-white tracking-normal leading-snug hover:opacity-80 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded"
          aria-label={language === "es" ? "DEVRODRI - Inicio" : "DEVRODRI - Home"}
        >
          <span className="font-semibold">devrodri</span>
        </Link>

        {/* Ícono hamburguesa mobile */}
        <div className="sm:hidden">
          <button
            onClick={toggleMenu}
            className="text-white text-xl focus:outline-none"
            aria-label={menuOpen ? (language === "es" ? "Cerrar menú" : "Close menu") : (language === "es" ? "Abrir menú" : "Open menu")}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Links en desktop */}
        <div className="hidden sm:flex items-center space-x-6 text-sm font-medium text-white">
          <Link to="/#sobremi" className="hover:text-primary transition">{t.nav.about}</Link>
          <Link to="/#porqueelegirnos" className="hover:text-primary transition">{t.nav.why}</Link>
          <Link to="/portfolio" className="hover:text-primary transition">{t.nav.portfolio}</Link>
          <Link to="/#contacto" className="hover:text-primary transition">{t.nav.contact}</Link>
          <Link to="/#faq" className="hover:text-primary transition">{t.nav.faq}</Link>

          {/* Selector de idioma */}
          <div className="flex items-center gap-2 ml-4">
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
        </div>
      </div>

      {/* Menú desplegable mobile */}
      {menuOpen && (
        <div 
          className="sm:hidden px-4 pb-4 flex flex-col items-center space-y-4 text-sm font-medium bg-black/80 backdrop-blur-sm text-white"
          role="menu"
          aria-label={language === "es" ? "Menú de navegación" : "Navigation menu"}
        >
          <Link to="/#sobremi" onClick={closeMenu} className="hover:text-primary transition">{t.nav.about}</Link>
          <Link to="/#porqueelegirnos" onClick={closeMenu} className="hover:text-primary transition">{t.nav.why}</Link>
          <Link to="/portfolio" onClick={closeMenu} className="hover:text-primary transition">{t.nav.portfolio}</Link>
          <Link to="/#contacto" onClick={closeMenu} className="hover:text-primary transition">{t.nav.contact}</Link>
          <Link to="/#faq" onClick={closeMenu} className="hover:text-primary transition">{t.nav.faq}</Link>
          <div className="flex items-center gap-2 mt-2">
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
        </div>
      )}
    </nav>
  );
}