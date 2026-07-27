import { en, es } from "../../../i18n";
import { definePortfolioCase } from "../types";

const stackEs = [
  "React"
] as const;
const stackEn = stackEs;
const integrationsEs = [
  "WhatsApp",
  "Maps"
] as const;
const integrationsEn = integrationsEs;

export const boatingCase = definePortfolioCase({
  key: "boating",
  portfolioOrder: 6,
  category: "services",
  cover: "/img/Fondo.jpg",
  actions: [
    {
      href: "https://www.boatingadventuresmiami.com",
      label: {
        es: es.portfolio.boating.link,
        en: en.portfolio.boating.link,
      },
    },
  ],
  content: {
    es: {
      title: es.portfolio.boating.title,
      description: es.portfolio.boating.desc,
      tags: [
        "Servicios",
        "Reservas"
      ],
      details: {
        summary: "Sitio de servicios con reservas y WhatsApp directo.",
        stack: stackEs,
        integrations: integrationsEs,
        challenges: [
          "SEO local",
          "Reservas"
        ],
        solution: [
          "Páginas optimizadas",
          "CTA claros"
        ],
        impact: [
          "Más leads",
          "Mejor visibilidad"
        ],
      },
    },
    en: {
      title: en.portfolio.boating.title,
      description: en.portfolio.boating.desc,
      tags: [
        "Services",
        "Bookings"
      ],
      details: {
        summary: "Service site with bookings and direct WhatsApp.",
        stack: stackEn,
        integrations: integrationsEn,
        challenges: [
          "Local SEO",
          "Bookings"
        ],
        solution: [
          "Optimized pages",
          "Clear CTAs"
        ],
        impact: [
          "More leads",
          "Better visibility"
        ],
      },
    },
  },
});
