import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/useLanguage";

export default function NotFoundPage() {
  const { language } = useLanguage();
  const contentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    contentRef.current?.focus();
  }, []);

  return (
    <main
      ref={contentRef}
      tabIndex={-1}
      className="min-h-[70vh] bg-black px-6 py-28 text-white flex items-center justify-center focus:outline-none"
    >
      <div className="max-w-xl text-center">
        <p className="text-sm uppercase tracking-widest text-primary mb-3">
          devrodri
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold">
          {language === "es" ? "Página no encontrada" : "Page not found"}
        </h1>
        <p className="mt-5 text-gray-300 leading-relaxed">
          {language === "es"
            ? "La página que buscás no está disponible."
            : "The page you're looking for isn't available."}
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex min-h-[44px] items-center rounded-full bg-primary-on-light px-6 py-3 font-medium text-white hover:bg-primary-on-light-hover transition"
        >
          {language === "es" ? "Volver al inicio" : "Return home"}
        </Link>
      </div>
    </main>
  );
}
