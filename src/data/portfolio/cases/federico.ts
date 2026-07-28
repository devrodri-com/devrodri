import { en, es } from "../../../i18n";
import { definePortfolioCase } from "../types";

const stackEs = [
  "Frontend: React + Vite + TypeScript",
  "Animaciones: Framer Motion",
  "Firebase: Firestore · Auth · Hosting · Storage",
  "i18n: ES/EN con contenido centralizado (archivos por idioma)"
] as const;
const stackEn = [
  "Frontend: React + Vite + TypeScript",
  "Motion: Framer Motion",
  "Firebase: Firestore · Auth · Hosting · Storage",
  "i18n: ES/EN with centralized content (per-locale data files)"
] as const;
const integrationsEs = [
  "Vimeo (video courses)",
  "Cloudinary/ImageKit (optimized gallery)",
  "WhatsApp CTA",
  "SEO dinámico por sección"
] as const;
const integrationsEn = integrationsEs;

export const federicoCase = definePortfolioCase({
  key: "federico",
  portfolioOrder: 5,
  category: "web",
  cover: "/img/federico-cover.jpg",
  actions: [
    {
      href: "https://www.federicoroma.com",
      label: {
        es: es.portfolio.federico.link,
        en: en.portfolio.federico.link,
      },
    },
  ],
  content: {
    es: {
      title: es.portfolio.federico.title,
      description: es.portfolio.federico.desc,
      tags: [
        "Marca personal",
        "Cursos"
      ],
      details: {
        summary: "Sitio web personal y profesional del campeón mundial de kickboxing y muay thai. Incluye biografía, cursos en video, galería multimedia y testimonios reales de alumnos.",
        stack: stackEs,
        integrations: integrationsEs,
        challenges: [
          "Sitio moderno pero liviano, accesible y administrable sin CMS",
          "Adaptar contenido extenso (biografía, clases, testimonios) sin saturar al usuario",
          "Experiencia mobile‑first fluida y visualmente clara",
          "Sistema de testimonios dinámicos, ordenados y con traducciones"
        ],
        solution: [
          "Secciones por bloques reutilizables (Hero, Sobre mí, Galería, Clases, Testimonios, Contacto)",
          "Contenido multilenguaje centralizado (es.json / en.json)",
          "Testimonios escalables con tipado central y carga desde testimonialsData.ts",
          "Galería multimedia con hovers, fullscreen y CTA",
          "Enlaces limpios, SEO on‑page y metadatos por página"
        ],
        impact: [
          "Mayor profesionalismo y claridad para sponsors y academias",
          "Plataforma lista para vender cursos (estructura de video + catálogo)",
          "Menor rebote gracias al orden por secciones y CTA activos",
          "Más consultas vía WhatsApp en mobile"
        ],
      },
    },
    en: {
      title: en.portfolio.federico.title,
      description: en.portfolio.federico.desc,
      tags: [
        "Personal brand",
        "Courses"
      ],
      details: {
        summary: "Personal and professional website for a Muay Thai & kickboxing world champion. Includes bio, video courses, media gallery and real student testimonials.",
        stack: stackEn,
        integrations: integrationsEn,
        challenges: [
          "Modern yet lightweight site, accessible and CMS‑less",
          "Adapt long‑form content (bio, classes, testimonials) without overwhelming users",
          "Smooth mobile‑first UX with clear visual hierarchy",
          "Dynamic, translated testimonials system"
        ],
        solution: [
          "Reusable blocks (Hero, About, Gallery, Classes, Testimonials, Contact)",
          "Centralized bilingual content (es.json / en.json pattern)",
          "Scalable testimonials with typed schema and data loader",
          "Media gallery with hovers, fullscreen and CTA",
          "Clean URLs, on‑page SEO and per‑page metadata"
        ],
        impact: [
          "More professional and clear positioning for sponsors and academies",
          "Course‑ready platform (video structure + catalog)",
          "Lower bounce thanks to clear sections and active CTAs",
          "More WhatsApp inquiries on mobile"
        ],
      },
    },
  },
});
