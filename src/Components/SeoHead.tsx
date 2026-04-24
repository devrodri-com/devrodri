// src/Components/SeoHead.tsx
import { Helmet } from "react-helmet-async";
import { useLanguage } from "../LanguageContext";
import translations from "../translations";
import { useLocation } from "react-router-dom";
import { metaReactCredential, ibmFullStackCredential } from "../seo/homeCredentialsJsonLd";

const SITE_ORIGIN = "https://www.devrodri.com";
/** Imagen OG/poster referenciada también en el hero; evita rutas rotas tipo meta-cover.jpg */
const DEFAULT_OG_IMAGE_PATH = "/img/hero-visual.jpg";

export default function SeoHead() {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const t = translations[language];

  const isPortfolio = pathname === "/portfolio";
  const seo = isPortfolio ? t.portfolio.seo : t.seo;
  const path = pathname === "/" ? "/" : pathname;
  const canonicalUrl = `${SITE_ORIGIN}${path === "/" ? "" : path}`;
  const ogImageUrl = `${SITE_ORIGIN}${DEFAULT_OG_IMAGE_PATH}`;
  const ogTitle = isPortfolio ? seo.title : t.seo.ogTitle;
  const ogDescription = isPortfolio ? seo.description : t.seo.ogDescription;

  return (
    <Helmet>
      <html lang={language === "es" ? "es" : "en"} />
      <link rel="canonical" href={canonicalUrl} />
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
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
      {!isPortfolio && (
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
