import { en, es } from "../../../i18n";
import { definePortfolioCase } from "../types";

const stackEs = [
  "Frontend: React + Vite + TypeScript",
  "State & UX: React Context (Auth/Cart) + Framer Motion",
  "Backend admin: Vercel Serverless Functions + Firebase Admin SDK",
  "Firebase: Firestore · Authentication · Hosting · Storage",
  "Security: Custom Claims (admin / superadmin) + Firestore Rules",
  "Testing: Vitest · Playwright · Firestore Rules Testing",
  "Admin panel: React (users, roles, products, categorías, clientes)"
] as const;
const stackEn = stackEs;
const integrationsEs = [
  "Mercado Pago (Checkout Pro)",
  "ImageKit/Cloudinary (media optimizada)",
  "Integración de envíos",
  "Firebase Auth + Firestore",
  "Vercel Functions (API admin)"
] as const;
const integrationsEn = integrationsEs;

export const mutterCase = definePortfolioCase({
  key: "mutter",
  portfolioOrder: 3,
  category: "ecommerce",
  cover: "/img/mutter-cover.png",
  actions: [
    {
      href: "https://www.muttergames.com",
      label: {
        es: es.portfolio.mutter.link,
        en: en.portfolio.mutter.link,
      },
    },
  ],
  content: {
    es: {
      title: es.portfolio.mutter.title,
      description: es.portfolio.mutter.desc,
      tags: [
        "E‑commerce",
        "Mercado Pago"
      ],
      details: {
        summary: "Tienda online de videojuegos, consolas y coleccionables con catálogo dinámico, carrito y checkout integrado con Mercado Pago, panel admin completo y reglas de seguridad en Firebase.",
        stack: stackEs,
        integrations: integrationsEs,
        challenges: [
          "Implementar un checkout LATAM robusto con múltiples métodos de pago y flujo de órdenes seguro.",
          "Sincronizar carritos anónimos y usuarios registrados sin duplicar información ni perder contexto.",
          "Diseñar un panel admin completo con control de permisos, roles (admin/superadmin) y seguridad en Firebase.",
          "Separar frontend público de API admin para que ningún write crítico vaya directo desde el cliente a Firestore."
        ],
        solution: [
          "SDK de pagos de Mercado Pago con notificaciones en tiempo real y creación de órdenes desde backend admin.",
          "Catálogo tipado, filtros dinámicos y sincronización del carrito entre usuario anónimo y autenticado.",
          "API admin en Vercel con Firebase Admin SDK, verificación de tokens, Custom Claims y Firestore Rules específicas.",
          "Panel de administración modular para gestionar productos, stock, categorías, subcategorías, clientes y usuarios admin."
        ],
        impact: [
          "Rendimiento optimizado con Vite (LCP ~2.1s) y navegación fluida.",
          "Conversión mejorada gracias a un flujo de checkout claro, confiable y adaptado a métodos de pago regionales.",
          "Panel de administración que facilita la gestión integral sin conocimientos técnicos, con roles y permisos claros.",
          "Arquitectura lista para escalar como white‑label store, con backend seguro y suite de tests automatizada."
        ],
      },
    },
    en: {
      title: en.portfolio.mutter.title,
      description: en.portfolio.mutter.desc,
      tags: [
        "E‑commerce",
        "Mercado Pago"
      ],
      details: {
        summary: "Online store for videogames, consoles and collectibles with dynamic catalog, cart and Mercado Pago checkout, full admin panel and hardened Firebase security rules.",
        stack: stackEn,
        integrations: integrationsEn,
        challenges: [
          "Implement a robust LATAM checkout with multiple payment methods and a secure order flow.",
          "Sync guest carts and logged‑in users without data duplication or losing context.",
          "Design a full admin panel with permissions, roles (admin/superadmin) and Firebase‑backed security.",
          "Separate public frontend from admin API so no critical writes go directly from client to Firestore."
        ],
        solution: [
          "Mercado Pago SDK with real‑time notifications and order creation handled by the admin backend.",
          "Typed catalog, dynamic filters and cart synchronization between guest and authenticated users.",
          "Admin API on Vercel with Firebase Admin SDK, token verification, Custom Claims and dedicated Firestore security rules.",
          "Modular admin panel to manage products, stock, categories, subcategories, customers and admin users."
        ],
        impact: [
          "Optimized performance with Vite (LCP ~2.1s) and smooth navigation.",
          "Higher conversion thanks to a clear, trustworthy checkout flow tailored to regional payment methods.",
          "Admin panel that streamlines operations without technical expertise, with clear roles and permissions.",
          "Architecture ready to scale as a white‑label store, with a secure backend and automated test suite."
        ],
      },
    },
  },
  home: {
    order: 3,
    summary: {
      "es": "E-commerce · Catálogo dinámico y checkout integrado para aumentar ventas.",
      "en": "E-commerce · Dynamic catalog and integrated checkout to drive sales."
    },
  },
});
