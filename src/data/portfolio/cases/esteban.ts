import { en, es } from "../../../i18n";
import esteban480Avif from "../../../assets/portfolio/esteban/esteban-480.avif";
import esteban480Webp from "../../../assets/portfolio/esteban/esteban-480.webp";
import esteban768Avif from "../../../assets/portfolio/esteban/esteban-768.avif";
import esteban768Webp from "../../../assets/portfolio/esteban/esteban-768.webp";
import esteban1200Avif from "../../../assets/portfolio/esteban/esteban-1200.avif";
import esteban1200Webp from "../../../assets/portfolio/esteban/esteban-1200.webp";
import {
  definePortfolioCase,
  type ResponsivePortfolioCover,
} from "../types";

const estebanResponsiveCover = {
  width: 1200,
  height: 630,
  fit: "cover",
  sources: {
    avif: [
      { src: esteban480Avif, width: 480 },
      { src: esteban768Avif, width: 768 },
      { src: esteban1200Avif, width: 1200 },
    ],
    webp: [
      { src: esteban480Webp, width: 480 },
      { src: esteban768Webp, width: 768 },
      { src: esteban1200Webp, width: 1200 },
    ],
  },
} as const satisfies ResponsivePortfolioCover;

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
  portfolioOrder: 2,
  category: "web",
  cover: "/img/esteban.png",
  responsiveCover: estebanResponsiveCover,
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
    order: 2,
    summary: {
      "es": "Real estate · Landing, catálogo y SEO técnico para captar leads de preconstrucción.",
      "en": "Real estate · Landing, catalog and technical SEO to capture pre-construction leads."
    },
  },
});
