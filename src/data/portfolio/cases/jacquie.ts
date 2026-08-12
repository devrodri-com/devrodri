import { en, es } from "../../../i18n";
import jacquie480Avif from "../../../assets/portfolio/jacquie/jacquie-480.avif";
import jacquie480Webp from "../../../assets/portfolio/jacquie/jacquie-480.webp";
import jacquie768Avif from "../../../assets/portfolio/jacquie/jacquie-768.avif";
import jacquie768Webp from "../../../assets/portfolio/jacquie/jacquie-768.webp";
import jacquie1200Avif from "../../../assets/portfolio/jacquie/jacquie-1200.avif";
import jacquie1200Webp from "../../../assets/portfolio/jacquie/jacquie-1200.webp";
import {
  definePortfolioCase,
  type ResponsivePortfolioCover,
} from "../types";

const jacquieResponsiveCover = {
  width: 1200,
  height: 630,
  fit: "cover",
  sources: {
    avif: [
      { src: jacquie480Avif, width: 480 },
      { src: jacquie768Avif, width: 768 },
      { src: jacquie1200Avif, width: 1200 },
    ],
    webp: [
      { src: jacquie480Webp, width: 480 },
      { src: jacquie768Webp, width: 768 },
      { src: jacquie1200Webp, width: 1200 },
    ],
  },
} as const satisfies ResponsivePortfolioCover;

const stack = [
  "Next.js 15",
  "React 19",
  "TypeScript",
  "Tailwind CSS",
  "next-intl",
  "ImageKit",
  "Vercel",
] as const;

export const jacquieCase = definePortfolioCase({
  key: "jacquie",
  portfolioOrder: 2,
  category: "web",
  cover: "/img/jacquie-cover.jpg",
  responsiveCover: jacquieResponsiveCover,
  coverAlt: {
    es: "Portada del sitio de Jacquie Zárate, con su retrato editorial junto al monograma JZ, su nombre y la referencia Realtor en Florida.",
    en: "Jacquie Zárate website cover, featuring her editorial portrait next to the JZ monogram, her name, and the Realtor in Florida credential.",
  },
  actions: [
    {
      href: "https://jacquiezarate.com",
      label: {
        es: es.portfolio.jacquie.link,
        en: en.portfolio.jacquie.link,
      },
    },
  ],
  content: {
    es: {
      title: es.portfolio.jacquie.title,
      description: es.portfolio.jacquie.desc,
      tags: ["Real Estate", "Trilingüe", "Next.js"],
      details: {
        summary:
          "Sitio inmobiliario trilingüe para compradores e inversores en Miami. Incluye catálogo de preconstrucción con búsqueda, filtros, ordenamiento y carga progresiva, fichas de proyecto, propiedades publicadas, contenido de financiación y contacto directo.",
        stack,
        integrations: [
          "WhatsApp (contacto directo)",
          "Google Maps embebido (ubicación de proyectos)",
        ],
        challenges: [
          "Ordenar una oferta inmobiliaria amplia para clientes que deciden a distancia, sostener contenido real en tres idiomas y permitir explorar proyectos sin convertir la experiencia en un marketplace genérico.",
        ],
        solution: [
          "Una arquitectura estática por idioma, con catálogo filtrable, fichas reutilizables, SEO localizado, imágenes optimizadas y caminos de contacto de baja fricción.",
        ],
        impact: [
          "Sitio publicado en tres idiomas, con catálogo de preconstrucción, propiedades, orientación financiera y una experiencia responsive centrada en claridad y conversación.",
        ],
      },
    },
    en: {
      title: en.portfolio.jacquie.title,
      description: en.portfolio.jacquie.desc,
      tags: ["Real Estate", "Trilingual", "Next.js"],
      details: {
        summary:
          "Trilingual real estate site for buyers and investors in Miami. It includes a pre-construction catalog with search, filters, sorting and progressive loading, project pages, published properties, financing content and direct contact.",
        stack,
        integrations: [
          "WhatsApp (direct contact)",
          "Embedded Google Maps (project location)",
        ],
        challenges: [
          "Organize a broad real estate offering for clients making decisions remotely, maintain real content in three languages, and let users explore projects without turning the experience into a generic marketplace.",
        ],
        solution: [
          "A static per-language architecture with a filterable catalog, reusable detail pages, localized SEO, optimized images and low-friction contact paths.",
        ],
        impact: [
          "A live site in three languages, with a pre-construction catalog, properties, financing guidance and a responsive experience focused on clarity and conversation.",
        ],
      },
    },
  },
  home: {
    order: 2,
    summary: {
      es: "Sitio inmobiliario trilingüe con catálogo filtrable, SEO por idioma y contacto directo por WhatsApp.",
      en: "Trilingual real estate site with a filterable catalog, per-language SEO, and direct WhatsApp contact.",
    },
  },
});
