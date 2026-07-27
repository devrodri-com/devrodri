// src/Components/SeoHead.tsx
import { Helmet } from "react-helmet-async";
import translations from "../i18n";
import { useLanguage } from "../i18n/useLanguage";
import { useLocation } from "react-router-dom";
import { metaReactCredential, ibmFullStackCredential } from "../seo/homeCredentialsJsonLd";

const SITE_ORIGIN = "https://www.devrodri.com";
/** Imagen OG/poster referenciada también en el hero; evita rutas rotas tipo meta-cover.jpg */
const DEFAULT_OG_IMAGE_PATH = "/img/hero-visual.jpg";

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
  const isNotFound = normalizedPathname !== "/" && !isPortfolio;
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
    : isPortfolio
      ? t.portfolio.seo
      : t.seo;
  const canonicalPath = isPortfolio
    ? "/portfolio"
    : pathname === "/"
      ? ""
      : pathname;
  const canonicalUrl = `${SITE_ORIGIN}${canonicalPath}`;
  const ogImageUrl = `${SITE_ORIGIN}${DEFAULT_OG_IMAGE_PATH}`;
  const ogTitle =
    isPortfolio || isNotFound ? seo.title : t.seo.ogTitle;
  const ogDescription =
    isPortfolio || isNotFound ? seo.description : t.seo.ogDescription;

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
      <meta property="og:type" content="website" />
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
