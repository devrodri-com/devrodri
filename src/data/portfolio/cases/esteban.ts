import { en, es } from "../../../i18n";
import { definePortfolioCase } from "../types";

const stackEs = [
  "Frontend: Next.js 15 (App Router) + TypeScript + Tailwind",
  "Multilenguaje: next-intl (ES/EN)",
  "Deploy: Vercel",
  "Sistema de diseño reutilizable (componentes React, Navy + Gold)"
] as const;
const stackEn = stackEs;
const integrationsEs = [
  "ImageKit (imágenes optimizadas de proyectos)",
  "Google Maps embebido",
  "WhatsApp (botones de contacto)",
  "Google Calendar (agendar reunión)"
] as const;
const integrationsEn = integrationsEs;

export const estebanCase = definePortfolioCase({
  key: "esteban",
  portfolioOrder: 1,
  category: "services",
  cover: "/img/esteban.png",
  actions: [
    {
      href: "https://estebanfirpo.com",
      label: {
        es: es.portfolio.esteban.link,
        en: en.portfolio.esteban.link,
      },
    },
  ],
  content: {
    es: {
      title: es.portfolio.esteban.title,
      description: es.portfolio.esteban.desc,
      tags: [
        "Real Estate",
        "Next.js"
      ],
      details: {
        summary: "Sitio inmobiliario para preconstrucción en Miami. Incluye catálogo dinámico de proyectos, galerías, planos de pago, fichas multilenguaje (ES/EN), integración con WhatsApp y optimización SEO.",
        stack: stackEs,
        integrations: integrationsEs,
        challenges: [
          "Gestionar +40 proyectos con fichas independientes",
          "Mantener diseño mobile-first, estética Apple-like y branding de Esteban",
          "SEO específico por proyecto (og:image, meta, descripción)"
        ],
        solution: [
          "Estructura modular (.tsx por proyecto) con data centralizada",
          "Bloques reutilizables (Highlights, Specs, PaymentPlan, FAQs, Ubicación)",
          "Integración continua con Vercel para despliegues rápidos"
        ],
        impact: [
          "Web veloz y optimizada (First Load < 2.5s)",
          "Posicionamiento con metatags custom por proyecto",
          "Catálogo escalable para sumar nuevos desarrollos",
          "Herramienta comercial activa para captar inversores"
        ],
      },
    },
    en: {
      title: en.portfolio.esteban.title,
      description: en.portfolio.esteban.desc,
      tags: [
        "Real Estate",
        "Next.js"
      ],
      details: {
        summary: "Real‑estate site for Miami preconstruction. Dynamic project catalog, galleries, payment plans, ES/EN pages, WhatsApp integration and SEO optimization.",
        stack: stackEn,
        integrations: integrationsEn,
        challenges: [
          "+40 independent project pages",
          "Mobile-first design with Apple-like aesthetic and brand consistency",
          "Per‑project SEO (og:image, meta, description)"
        ],
        solution: [
          "Modular structure (.tsx per project) with centralized data",
          "Reusable blocks (Highlights, Specs, PaymentPlan, FAQs, Location)",
          "Vercel integration for fast deployments"
        ],
        impact: [
          "Fast, optimized site (First Load < 2.5s)",
          "Per‑project custom metatags for SEO",
          "Scalable catalog for new developments",
          "Active sales tool to capture investors"
        ],
      },
    },
  },
  home: {
    order: 1,
    summary: {
      "es": "Real estate · Landing, catálogo y SEO técnico para captar leads de preconstrucción.",
      "en": "Real estate · Landing, catalog and technical SEO to capture pre-construction leads."
    },
  },
});
