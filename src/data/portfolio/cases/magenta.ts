import { en, es } from "../../../i18n";
import { definePortfolioCase } from "../types";

const stackEs = [
  "Frontend: Next.js 16 (App Router) + TypeScript + Tailwind CSS",
  "Infraestructura: Vercel con despliegue continuo",
  "SEO técnico: metadata y Open Graph; sitemap y robots controlados por una configuración que mantiene deshabilitada la indexación hasta la publicación definitiva",
  "Recursos visuales del MVP: mockups generados con GPT Image 2",
  "Gestión de datos: productos y servicios centralizados en src/data"
] as const;
const stackEn = [
  "Frontend: Next.js 16 (App Router) + TypeScript + Tailwind CSS",
  "Infrastructure: Vercel with continuous deployment",
  "Technical SEO: metadata, Open Graph, sitemap, and robots controlled by an indexing gate until cutover",
  "MVP visual assets: mockups generated with GPT Image 2",
  "Data management: products and services centralized in src/data"
] as const;
const integrationsEs = [
  "Formulario dinámico de presupuesto por servicio",
  "Cloudflare Turnstile para protección antiabuso",
  "Integración con Resend para entrega transaccional por email",
  "Enlace directo a WhatsApp",
  "Mapa de ubicación embebido",
  "Carrusel de marcas y clientes",
  "Favicon y Open Graph card para redes sociales"
] as const;
const integrationsEn = [
  "Service-based dynamic quote form",
  "Cloudflare Turnstile for abuse protection",
  "Resend integration for transactional email delivery",
  "Direct WhatsApp link",
  "Embedded location map",
  "Brand and client carousel",
  "Favicon and Open Graph card for social sharing"
] as const;

export const magentaCase = definePortfolioCase({
  key: "magenta",
  portfolioOrder: 5,
  category: "web",
  cover: "/img/magenta-cover.png",
  actions: [
    {
      href: "https://magenta-paysandu.vercel.app",
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
        summary: "MVP público para una imprenta de Paysandú activa desde 2010, disponible para revisión antes de la publicación definitiva. Centraliza productos, servicios y solicitudes de presupuesto en una arquitectura modular con Next.js 16.",
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
          "Configuración SEO para la etapa previa a la publicación definitiva, con metadata, Open Graph, sitemap y robots; la indexación permanece deshabilitada hasta completar esa transición.",
          "Deploy automatizado en Vercel con imágenes optimizadas."
        ],
        impact: [
          "MVP público disponible en Vercel para revisión antes de la publicación definitiva.",
          "Productos, servicios y solicitud de presupuesto reunidos en una experiencia responsive.",
          "Flujo de presupuesto con protección Turnstile e integración de entrega por email mediante Resend.",
          "Sistema visual coherente con la identidad de Magenta y mockups creados con GPT Image 2.",
          "Arquitectura modular preparada para nuevas iteraciones, sin presentar e-commerce ni panel administrativo como funciones implementadas."
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
        summary: "Public pre-cutover MVP for a Paysandú print shop operating since 2010. It centralizes products, services, and quote requests in a modular architecture built with Next.js 16.",
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
          "Pre-cutover SEO contract with metadata, Open Graph, sitemap, and robots controlled through configuration; indexing remains disabled until cutover.",
          "Automated deployment on Vercel with optimized images."
        ],
        impact: [
          "Public MVP available on Vercel for pre-cutover review.",
          "Products, services, and quote requests brought together in a responsive experience.",
          "Quote flow with Turnstile protection and email delivery integrated through Resend.",
          "Visual system consistent with the Magenta identity, with mockups created using GPT Image 2.",
          "Modular architecture ready for further iterations, without presenting e-commerce or an admin panel as implemented features."
        ],
      },
    },
  },
});
