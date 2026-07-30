// src/Components/SeoHead.tsx
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import translations from "../i18n";
import { useLanguage } from "../i18n/useLanguage";
import { useLocation } from "react-router-dom";
import { metaReactCredential, ibmFullStackCredential } from "../seo/homeCredentialsJsonLd";
import { lemBoxCase } from "../data/portfolio/cases/lemBox";

const SITE_ORIGIN = "https://www.devrodri.com";
/** Imagen OG/poster referenciada también en el hero; evita rutas rotas tipo meta-cover.jpg */
const DEFAULT_OG_IMAGE_PATH = "/img/hero-visual.jpg";
const STATIC_FALLBACK_META_SELECTORS = [
  'meta[name="description"]',
  'meta[property="og:title"]',
  'meta[property="og:description"]',
  'meta[property="og:type"]',
  'meta[property="og:url"]',
  'meta[property="og:image"]',
] as const;

function normalizeRoutedPathname(pathname: string): string {
  const pathnameWithoutTrailingSlash =
    pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return pathnameWithoutTrailingSlash.toLowerCase();
}

export default function SeoHead() {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const t = translations[language];

  const normalizedPathname = normalizeRoutedPathname(pathname);
  const isPortfolio = normalizedPathname === "/portfolio";
  const isLemBoxCase =
    normalizedPathname === lemBoxCase.caseStudy.path;
  const isNotFound =
    normalizedPathname !== "/" && !isPortfolio && !isLemBoxCase;
  const lemBoxSeo = lemBoxCase.caseStudy.content[language].seo;
  const notFoundSeo = {
    title:
      language === "es"
        ? "Página no encontrada | devrodri"
        : "Page not found | devrodri",
    description:
      language === "es"
        ? "La página solicitada no está disponible."
        : "The requested page is not available.",
    keywords: "",
  };
  const seo = isNotFound
    ? notFoundSeo
    : isLemBoxCase
      ? { ...lemBoxSeo, keywords: "" }
    : isPortfolio
      ? t.portfolio.seo
      : t.seo;
  const canonicalPath = isLemBoxCase
    ? lemBoxCase.caseStudy.path
    : isPortfolio
    ? "/portfolio"
    : pathname === "/"
      ? ""
      : pathname;
  const canonicalUrl = `${SITE_ORIGIN}${canonicalPath}`;
  const ogImageUrl = `${SITE_ORIGIN}${
    isLemBoxCase ? lemBoxCase.cover : DEFAULT_OG_IMAGE_PATH
  }`;
  const ogTitle =
    isPortfolio || isLemBoxCase || isNotFound ? seo.title : t.seo.ogTitle;
  const ogDescription =
    isPortfolio || isLemBoxCase || isNotFound
      ? seo.description
      : t.seo.ogDescription;

  useEffect(() => {
    if (!isLemBoxCase) return;

    STATIC_FALLBACK_META_SELECTORS.forEach((selector) => {
      document.head.querySelectorAll(selector).forEach((element) => {
        if (!element.hasAttribute("data-rh")) element.remove();
      });
    });
  }, [isLemBoxCase]);

  return (
    <Helmet>
      <html lang={language === "es" ? "es" : "en"} />
      <link rel="canonical" href={canonicalUrl} />
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      {isNotFound && <meta name="robots" content="noindex, nofollow" />}
      <meta name="author" content="Rodrigo Opalo" />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:type" content={isLemBoxCase ? "article" : "website"} />
      <meta
        property="og:locale"
        content={language === "es" ? "es_ES" : "en_US"}
      />
      <meta property="og:site_name" content="Rodrigo Opalo" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImageUrl} />
      {pathname === "/" && (
        <>
          <script type="application/ld+json">
            {JSON.stringify(metaReactCredential)}
          </script>
          <script type="application/ld+json">
            {JSON.stringify(ibmFullStackCredential)}
          </script>
        </>
      )}
    </Helmet>
  );
}
