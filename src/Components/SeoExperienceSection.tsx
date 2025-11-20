// src/Components/SeoExperienceSection.tsx
import { Helmet } from "react-helmet-async";
import { useLanguage } from "../LanguageContext";

export default function SeoExperienceSection() {
  const { language } = useLanguage();

  const seo = {
    title: language === "es" ? "Más que diseño, creo experiencias" : "More than design, I create experiences",
    description:
      language === "es"
        ? "Diseño sitios que comunican antes del clic. Interfaces intuitivas, limpias y veloces que generan impacto."
        : "I design websites that communicate before the click. Clean, intuitive, and fast interfaces that make an impact.",
    keywords:
      language === "es"
        ? "experiencias digitales, diseño web, interfaces intuitivas, diseño moderno"
        : "digital experiences, web design, intuitive interfaces, modern design",
  };

  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
    </Helmet>
  );
}
