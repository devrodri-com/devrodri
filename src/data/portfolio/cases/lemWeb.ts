import { en, es } from "../../../i18n";
import { definePortfolioCase } from "../types";

const stackEs = [
  "Frontend: Next.js 15 + TypeScript + Tailwind",
  "Hosting: Vercel",
  "Integraciones: WhatsApp · Instagram · Email (Resend)",
  "Arquitectura multipaís: lem-box.com (selector), lem-box.com.uy, lem-box.com.ar"
] as const;
const stackEn = stackEs;
const integrationsEs = [
  "Resend (email)",
  "WhatsApp",
  "Instagram"
] as const;
const integrationsEn = integrationsEs;

export const lemWebCase = definePortfolioCase({
  key: "lem_web",
  portfolioOrder: 2,
  category: "services",
  cover: "/img/lem-box-cover.png",
  actions: [
    {
      href: "https://lem-box.com.uy",
      label: { es: "UY", en: "UY" },
    },
    {
      href: "https://lem-box.com.ar",
      label: { es: "AR", en: "AR" },
    },
  ],
  content: {
    es: {
      title: es.portfolio.lem_web.title,
      description: es.portfolio.lem_web.desc,
      tags: [
        "Logística",
        "Next.js",
        "SEO",
        "Multi-país"
      ],
      details: {
        summary: "Logística en Miami y envíos internacionales (Uruguay + Argentina). Landing mobile-first, multipaís y contacto con Resend. Sitios: lem-box.com.uy y lem-box.com.ar",
        stack: stackEs,
        integrations: integrationsEs,
        challenges: [
          "Crear un sitio de logística con estética premium (Apple-like) en un rubro tradicional",
          "Alinear branding digital con la operativa real de un warehouse en Miami",
          "Optimizar tiempos de carga y experiencia mobile",
          "Implementar arquitectura multipaís con SEO específico por país"
        ],
        solution: [
          "Diseño consistente y minimalista con colores corporativos (#02120F y #EB6619)",
          "Flujo de navegación claro: landing → contacto → WhatsApp/email",
          "Implementación de arquitectura multipaís (selector + sitios locales)",
          "SEO optimizado para Uruguay y Argentina con metadata específica"
        ],
        impact: [
          "Primera versión productiva en Uruguay lista para producción",
          "Roadmap claro para expansión regional (Argentina activa)",
          "Sitio rápido, responsive y con identidad propia, diferenciado de la competencia",
          "Performance optimizado para ambos países con carga rápida"
        ],
      },
    },
    en: {
      title: en.portfolio.lem_web.title,
      description: en.portfolio.lem_web.desc,
      tags: [
        "Logistics",
        "Next.js",
        "SEO",
        "Multi-country"
      ],
      details: {
        summary: "Logistics in Miami and international shipping (Uruguay + Argentina). Mobile-first, multi-country landing with Resend contact. Sites: lem-box.com.uy and lem-box.com.ar",
        stack: stackEn,
        integrations: integrationsEn,
        challenges: [
          "Build a premium (Apple-like) logistics site in a traditional industry",
          "Align digital branding with the real Miami warehouse operations",
          "Optimize load times and mobile UX",
          "Implement multi-country architecture with country-specific SEO"
        ],
        solution: [
          "Consistent, minimal design with brand colors (#02120F and #EB6619)",
          "Clear navigation flow: landing → contact → WhatsApp/email",
          "Multi-country architecture (selector + local sites)",
          "SEO optimized for Uruguay and Argentina with specific metadata"
        ],
        impact: [
          "First productive version for Uruguay, ready for production",
          "Clear roadmap for regional expansion (Argentina active)",
          "Fast, responsive site with its own identity",
          "Optimized performance for both countries with fast loading"
        ],
      },
    },
  },
  home: {
    order: 2,
    summary: {
      "es": "Logística · Web multipaís (UY/AR), SEO y performance para captar clientes.",
      "en": "Logistics · Multi-country web (UY/AR), SEO and performance to acquire customers."
    },
  },
});
