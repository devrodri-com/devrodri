import { en, es } from "../../../i18n";
import { definePortfolioCase } from "../types";

const stackEs = [
  "Frontend: Next.js 16 (App Router) + TypeScript + TailwindCSS",
  "Infraestructura: Vercel (deploy continuo)",
  "Optimización SEO: metadata personalizada, OG automáticas, sitemap.xml y robots.txt",
  "Automatización: generación de imágenes con IA (Sora/OpenAI)",
  "Diseño: mockups personalizados + UI modular",
  "Gestión de datos: estructuras centralizadas en /src/data"
] as const;
const stackEn = [
  "Frontend: Next.js 16 (App Router) + TypeScript + TailwindCSS",
  "Infrastructure: Vercel (continuous deploy)",
  "SEO optimization: custom metadata, automatic OG, sitemap.xml and robots.txt",
  "Automation: AI image generation with Sora/OpenAI",
  "Design: custom mockups + modular UI",
  "Data management: centralized structures in /src/data"
] as const;
const integrationsEs = [
  "Mockups personalizados generados por IA (Sora)",
  "Formularios dinámicos por servicio",
  "WhatsApp API para contacto inmediato",
  "Mapa de ubicación embebido",
  "Carrusel automático de marcas/clientes",
  "Favicon y OG card personalizada para redes sociales"
] as const;
const integrationsEn = [
  "Custom AI-generated mockups (Sora)",
  "Service-based dynamic forms",
  "WhatsApp API for instant contact",
  "Embedded location map",
  "Automatic brand/client carousel",
  "Custom favicon and OG card for social media"
] as const;

export const magentaCase = definePortfolioCase({
  key: "magenta",
  portfolioOrder: 4,
  category: "web",
  cover: "/img/magenta-cover.png",
  actions: [
    {
      href: "https://magenta-paysandu-m5in.vercel.app",
      label: {
        es: es.portfolio.magenta.link,
        en: en.portfolio.magenta.link,
      },
    },
  ],
  content: {
    es: {
      title: es.portfolio.magenta.title,
      description: es.portfolio.magenta.desc,
      tags: [
        "Imprenta",
        "Next.js"
      ],
      details: {
        summary: "MVP funcional para una imprenta con 15 años de trayectoria. Incluye catálogo optimizado con mockups generados por IA, formulario dinámico de presupuestos y arquitectura moderna con Next.js 16.",
        stack: stackEs,
        integrations: integrationsEs,
        challenges: [
          "Organizar información comercial diversa (servicios, productos, catálogo, presupuesto) en una estructura clara y escalable.",
          "Diseñar una experiencia fluida que funcione igual de bien en desktop y mobile.",
          "Optimizar la carga inicial y el SEO para un negocio local (posicionamiento por ciudad y rubro).",
          "Crear un formulario flexible capaz de adaptarse a distintos servicios sin repetir lógica."
        ],
        solution: [
          "Arquitectura modular con componentes server/client correctamente separados.",
          "Catálogo de productos y servicios centralizado en estructuras de datos (src/data).",
          "Formularios dinámicos basados en reglas por servicio (libretas, tarjetas, afiches, etc.).",
          "Diseño limpio estilo Apple minimal con foco en claridad y velocidad de acceso.",
          "Optimización SEO completa (metadata, OG card, sitemap, robots).",
          "Deploy automatizado en Vercel con imágenes optimizadas."
        ],
        impact: [
          "Web rápida y confiable para un negocio local con mucha competencia.",
          "Mejor experiencia de usuario para pedidos de presupuesto (menos fricción).",
          "Imagen profesional consistente con la marca Magenta.",
          "Catálogo visual con mockups de alta calidad que elevan el branding.",
          "Preparado para futuras expansiones: e-commerce, panel administrativo, etc."
        ],
      },
    },
    en: {
      title: en.portfolio.magenta.title,
      description: en.portfolio.magenta.desc,
      tags: [
        "Print shop",
        "Next.js"
      ],
      details: {
        summary: "Functional MVP for a print shop with 15 years of experience. Includes an optimized catalog with AI-generated mockups, a dynamic quote form and a modern architecture with Next.js 16.",
        stack: stackEn,
        integrations: integrationsEn,
        challenges: [
          "Organize diverse commercial information (services, products, catalog, quotes) in a clear and scalable structure.",
          "Design a smooth experience that works equally well on desktop and mobile.",
          "Optimize initial load and SEO for a local business (city and industry targeting).",
          "Build a flexible form that adapts to different services without duplicating logic."
        ],
        solution: [
          "Modular architecture with proper separation between server and client components.",
          "Centralized product and service catalog in reusable data structures (src/data).",
          "Dynamic forms driven by per-service rules (notebooks, cards, posters, etc.).",
          "Clean Apple-like minimal design focused on clarity and fast access.",
          "Full SEO optimization (metadata, OG card, sitemap, robots).",
          "Automated deployment on Vercel with optimized images."
        ],
        impact: [
          "Fast and reliable website for a local business in a competitive market.",
          "Better user experience for quote requests (less friction).",
          "Professional image consistent with the Magenta brand.",
          "Visual catalog with high-quality mockups that elevate the branding.",
          "Ready for future expansions: e-commerce, admin panel, etc."
        ],
      },
    },
  },
});
