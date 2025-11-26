/* 
import { Helmet } from "react-helmet-async";
import { useLanguage } from "../LanguageContext";
import translations from "../translations";

export default function SeoServicesSection() {
  const { language } = useLanguage();
  const seo = translations[language].services.seoMeta;

  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
    </Helmet>
  );
}
*/
