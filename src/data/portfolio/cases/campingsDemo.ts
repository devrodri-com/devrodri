import { en, es } from "../../../i18n";
import { definePortfolioCase } from "../types";

const stackEs = [
  "Frontend: Next.js 16 + React 19 + TypeScript + App Router",
  "Backend/servicios: Firebase Auth + Cloud Firestore",
  "Server-side puntual: Firebase Admin SDK en rutas API",
  "Arquitectura: flujo público + panel admin + inventario híbrido",
  "Deploy compatible con Vercel"
] as const;
const stackEn = [
  "Frontend: Next.js 16 + React 19 + TypeScript + App Router",
  "Backend/services: Firebase Auth + Cloud Firestore",
  "Server-side actions: Firebase Admin SDK in selected API routes",
  "Architecture: public flow + admin panel + hybrid inventory",
  "Vercel-compatible deployment"
] as const;
const integrationsEs = [
  "Firebase Auth",
  "Cloud Firestore",
  "Firebase Admin SDK",
  "Mercado Pago (flujo simulado / no productivo)"
] as const;
const integrationsEn = [
  "Firebase Auth",
  "Cloud Firestore",
  "Firebase Admin SDK",
  "Mercado Pago (simulated / non-production flow)"
] as const;

export const campingsDemoCase = definePortfolioCase({
  key: "campings_demo",
  portfolioOrder: 7,
  category: "services",
  cover: "/img/campings-concept-cover.jpg",
  actions: [
    {
      href: "https://github.com/devrodri-com/reservas-campings-nacionales",
      label: {
        es: es.portfolio.campings_demo.link,
        en: en.portfolio.campings_demo.link,
      },
    },
  ],
  content: {
    es: {
      title: es.portfolio.campings_demo.title,
      description: es.portfolio.campings_demo.desc,
      tags: [
        "Labs",
        "Prototipo",
        "Next.js",
        "Firebase",
        "Admin"
      ],
      status: es.portfolio.campings_demo.status,
      disclaimer: es.portfolio.campings_demo.disclaimer,
      details: {
        summary: "Prototipo técnico con flujo público, consulta de reservas, panel administrativo con roles e inventario híbrido por capacidad o unidades físicas.",
        stack: stackEs,
        integrations: integrationsEs,
        challenges: [
          "Modelar dos tipos de inventario en un mismo sistema: por capacidad general y por unidades físicas.",
          "Resolver disponibilidad, bloqueos y reservas por rango de fechas.",
          "Separar flujo público y operación administrativa con roles.",
          "Preparar la base técnica para evolución futura sin forzar features incompletas."
        ],
        solution: [
          "Aplicación web con catálogo público, detalle de camping, reserva online y consulta por código.",
          "Panel admin con roles, reservas manuales, cancelación, exportación y operación por camping.",
          "Soporte para inventario híbrido con lógica específica según el tipo de camping.",
          "Separación entre datos privados y proyección pública para disponibilidad."
        ],
        impact: [
          "Flujo público y panel administrativo disponibles en un prototipo navegable.",
          "Disponibilidad, reservas e inventario híbrido modelados de extremo a extremo.",
          "Pagos mantenidos de forma explícitamente simulada y no productiva.",
          "Base técnica preparada para experimentación futura."
        ],
      },
    },
    en: {
      title: en.portfolio.campings_demo.title,
      description: en.portfolio.campings_demo.desc,
      tags: [
        "Labs",
        "Prototype",
        "Next.js",
        "Firebase",
        "Admin"
      ],
      status: en.portfolio.campings_demo.status,
      disclaimer: en.portfolio.campings_demo.disclaimer,
      details: {
        summary: "Technical prototype with a public flow, booking lookup, role-based admin panel and hybrid inventory by capacity or physical units.",
        stack: stackEn,
        integrations: integrationsEn,
        challenges: [
          "Model two inventory types in the same system: general capacity and physical units.",
          "Handle availability, blocks and bookings across date ranges.",
          "Separate the public booking flow from role-based admin operations.",
          "Prepare the technical foundation for future evolution without forcing unfinished features."
        ],
        solution: [
          "Web application with public catalog, campground detail pages, online booking and code-based lookup.",
          "Admin panel with roles, manual bookings, cancellation, exports and per-campground operations.",
          "Hybrid inventory support with specific logic depending on campground type.",
          "Separation between private booking data and a public availability projection."
        ],
        impact: [
          "Public flow and admin panel available in a navigable prototype.",
          "Availability, bookings and hybrid inventory modeled end to end.",
          "Payments kept explicitly simulated and non-production.",
          "Technical foundation prepared for future experimentation."
        ],
      },
    },
  },
});
