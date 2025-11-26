// src/Components/SeoHead.tsx
import { Helmet } from "react-helmet-async";
import { useLanguage } from "../LanguageContext";
import translations from "../translations";

export default function SeoHead() {
  const { language } = useLanguage();
  const seo = translations[language]?.seo;

  if (!seo) return null;

  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      <meta name="author" content="Rodrigo Opalo" />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:type" content="website" />
      <meta
        property="og:locale"
        content={language === "es" ? "es_ES" : "en_US"}
      />
      <meta property="og:site_name" content="Rodrigo Opalo" />
      <meta property="og:url" content="https://www.devrodri.com" />
      <meta property="og:image" content="https://www.devrodri.com/img/meta-cover.jpg" />
    </Helmet>
  );
}