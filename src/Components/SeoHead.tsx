import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import {
  getLocaleForPathname,
  getNotFoundMetadata,
  getPublicRoute,
  isIndexablePublicRoute,
} from "../routes/siteRoutes";
import { getStructuredData } from "../seo/structuredData";

export default function SeoHead() {
  const { pathname } = useLocation();
  const route = getPublicRoute(pathname);
  const locale = route?.locale ?? getLocaleForPathname(pathname);
  const metadata = route?.metadata ?? getNotFoundMetadata(locale);
  const structuredData = route !== null && isIndexablePublicRoute(route)
    ? getStructuredData(route.routeKey)
    : null;

  return (
    <Helmet>
      <html lang={locale} />
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      <meta name="robots" content={metadata.robots} />
      <meta name="author" content="Rodrigo Opalo" />

      {metadata.canonical !== null && (
        <link rel="canonical" href={metadata.canonical} />
      )}
      {metadata.hreflang.map(({ href, hrefLang }) => (
        <link
          key={hrefLang}
          rel="alternate"
          hrefLang={hrefLang}
          href={href}
        />
      ))}

      {metadata.og !== null && (
        <meta property="og:title" content={metadata.og.title} />
      )}
      {metadata.og !== null && (
        <meta property="og:description" content={metadata.og.description} />
      )}
      {metadata.og !== null && (
        <meta property="og:type" content={metadata.og.type} />
      )}
      {metadata.og !== null && (
        <meta
          property="og:locale"
          content={route?.locale === "en" ? "en_US" : "es_ES"}
        />
      )}
      {metadata.og !== null && (
        <meta property="og:site_name" content="Rodrigo Opalo" />
      )}
      {metadata.og !== null && (
        <meta property="og:url" content={metadata.og.url} />
      )}
      {metadata.og !== null && (
        <meta property="og:image" content={metadata.og.image.url} />
      )}
      {metadata.og !== null && (
        <meta
          property="og:image:width"
          content={String(metadata.og.image.width)}
        />
      )}
      {metadata.og !== null && (
        <meta
          property="og:image:height"
          content={String(metadata.og.image.height)}
        />
      )}
      {metadata.og !== null && (
        <meta property="og:image:alt" content={metadata.og.image.alt} />
      )}

      {metadata.twitter !== null && (
        <meta name="twitter:card" content={metadata.twitter.card} />
      )}
      {metadata.twitter !== null && (
        <meta name="twitter:title" content={metadata.twitter.title} />
      )}
      {metadata.twitter !== null && (
        <meta
          name="twitter:description"
          content={metadata.twitter.description}
        />
      )}
      {metadata.twitter !== null && (
        <meta name="twitter:image" content={metadata.twitter.image.url} />
      )}
      {metadata.twitter !== null && (
        <meta
          name="twitter:image:alt"
          content={metadata.twitter.image.alt}
        />
      )}

      {structuredData !== null && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}
