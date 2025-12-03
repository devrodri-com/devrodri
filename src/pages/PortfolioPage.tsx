// src/pages/PortfolioPage.tsx
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../LanguageContext";
import translations from "../translations";
import SeoPortfolioSection from "../Components/SeoPortfolioSection";

type ProjectKey = "lem" | "esteban" | "mutter" | "federico" | "bionova" | "boating" | "magenta";
type Project = { key: ProjectKey; href: string; cover: string };

const projects: Project[] = [
  { key: "magenta", href: "https://magenta-paysandu-m5in.vercel.app", cover: "/img/magenta-cover.svg" },
  { key: "esteban", href: "https://estebanfirpo.com", cover: "/img/esteban.jpg" },
  { key: "lem",   href: "https://lem-box.com.uy",            cover: "/img/lem-box-cover.jpg" },
  { key: "mutter",   href: "https://www.muttergames.com",            cover: "/img/mutter-cover.jpg" },
  { key: "federico", href: "https://www.federicoroma.com",            cover: "/img/federico-cover.jpg" },
  { key: "bionova",  href: "https://www.getbionova.com",              cover: "/img/bionova-cover.jpg" },
  { key: "boating",  href: "https://www.boatingadventuresmiami.com", cover: "/img/Fondo.jpg" },
];

type Category = "all" | "ecom" | "personal" | "services";
const projectMeta: Record<ProjectKey, { category: Category; tags: string[]; tagsEn: string[] }> = {
  lem:      { category: "services", tags: ["Logística", "Next.js"],         tagsEn: ["Logistics", "Next.js"] },
  esteban:  { category: "services", tags: ["Real Estate", "Next.js"],     tagsEn: ["Real Estate", "Next.js"] },
  mutter:   { category: "ecom",     tags: ["E‑commerce", "Mercado Pago"],            tagsEn: ["E‑commerce", "Mercado Pago"] },
  federico: { category: "personal", tags: ["Marca personal", "Cursos"],             tagsEn: ["Personal brand", "Courses"] },
  bionova:  { category: "ecom",     tags: ["E‑commerce", "Stripe/PayPal"],          tagsEn: ["E‑commerce", "Stripe/PayPal"] },
  magenta:  { category: "services", tags: ["Imprenta", "Next.js"],                  tagsEn: ["Print shop", "Next.js"] },
  boating:  { category: "services", tags: ["Servicios", "Reservas"],                tagsEn: ["Services", "Bookings"] },
};

const filters: { key: Category; es: string; en: string }[] = [
  { key: "all",      es: "Todos",       en: "All" },
  { key: "ecom",     es: "E‑commerce", en: "E‑commerce" },
  { key: "personal", es: "Personal",    en: "Personal" },
  { key: "services", es: "Servicios",   en: "Services" },
];

const caseDetails: Record<ProjectKey, {
  summaryEs: string; summaryEn: string;
  stack: string[]; integrations: string[];
  stackEn?: string[]; integrationsEn?: string[];
  challengesEs: string[]; challengesEn: string[];
  solutionEs: string[]; solutionEn: string[];
  resultsEs: string[]; resultsEn: string[];
}> = {
  lem: {
    summaryEs: "Logística en Miami y envíos internacionales (Uruguay + Argentina). Landing mobile-first, multipaís y contacto con Resend.",
    summaryEn: "Logistics in Miami and international shipping (Uruguay + Argentina). Mobile-first, multi-country landing with Resend contact.",
    stack: [
      "Frontend: Next.js 15 + TypeScript + Tailwind",
      "Hosting: Vercel",
      "Integraciones: WhatsApp · Instagram · Email (Resend)",
      "Roadmap multipaís: lem-box.com (selector), lem-box.com.uy, lem-box.com.ar"
    ],
    integrations: ["Resend (email)", "WhatsApp", "Instagram"],
    challengesEs: [
      "Crear un sitio de logística con estética premium (Apple-like) en un rubro tradicional",
      "Alinear branding digital con la operativa real de un warehouse en Miami",
      "Optimizar tiempos de carga y experiencia mobile"
    ],
    challengesEn: [
      "Build a premium (Apple-like) logistics site in a traditional industry",
      "Align digital branding with the real Miami warehouse operations",
      "Optimize load times and mobile UX"
    ],
    solutionEs: [
      "Diseño consistente y minimalista con colores corporativos (#02120F y #EB6619)",
      "Flujo de navegación claro: landing → contacto → WhatsApp/email",
      "Implementación de arquitectura multipaís (selector + sitios locales)",
      "SEO optimizado para Uruguay y Argentina"
    ],
    solutionEn: [
      "Consistent, minimal design with brand colors (#02120F and #EB6619)",
      "Clear navigation flow: landing → contact → WhatsApp/email",
      "Multi-country architecture (selector + local sites)",
      "SEO optimized for Uruguay and Argentina"
    ],
    resultsEs: [
      "Primera versión productiva en Uruguay lista para producción",
      "Roadmap claro para expansión regional",
      "Sitio rápido, responsive y con identidad propia, diferenciado de la competencia"
    ],
    resultsEn: [
      "First productive version for Uruguay, ready for production",
      "Clear roadmap for regional expansion",
      "Fast, responsive site with its own identity"
    ],
  },
  esteban: {
    summaryEs: "Sitio inmobiliario para preconstrucción en Miami. Incluye catálogo dinámico de proyectos, galerías, planos de pago, fichas multilenguaje (ES/EN), integración con WhatsApp y optimización SEO.",
    summaryEn: "Real‑estate site for Miami preconstruction. Dynamic project catalog, galleries, payment plans, ES/EN pages, WhatsApp integration and SEO optimization.",
    stack: [
      "Frontend: Next.js 15 (App Router) + TypeScript + Tailwind",
      "Multilenguaje: next-intl (ES/EN)",
      "Deploy: Vercel",
      "Sistema de diseño reutilizable (componentes React, Navy + Gold)"
    ],
    integrations: [
      "ImageKit (imágenes optimizadas de proyectos)",
      "Google Maps embebido",
      "WhatsApp (botones de contacto)",
      "Google Calendar (agendar reunión)"
    ],
    challengesEs: [
      "Gestionar +40 proyectos con fichas independientes",
      "Mantener diseño mobile-first, estética Apple-like y branding de Esteban",
      "SEO específico por proyecto (og:image, meta, descripción)"
    ],
    challengesEn: [
      "+40 independent project pages",
      "Mobile-first design with Apple-like aesthetic and brand consistency",
      "Per‑project SEO (og:image, meta, description)"
    ],
    solutionEs: [
      "Estructura modular (.tsx por proyecto) con data centralizada",
      "Bloques reutilizables (Highlights, Specs, PaymentPlan, FAQs, Ubicación)",
      "Integración continua con Vercel para despliegues rápidos"
    ],
    solutionEn: [
      "Modular structure (.tsx per project) with centralized data",
      "Reusable blocks (Highlights, Specs, PaymentPlan, FAQs, Location)",
      "Vercel integration for fast deployments"
    ],
    resultsEs: [
      "Web veloz y optimizada (First Load < 2.5s)",
      "Posicionamiento con metatags custom por proyecto",
      "Catálogo escalable para sumar nuevos desarrollos",
      "Herramienta comercial activa para captar inversores"
    ],
    resultsEn: [
      "Fast, optimized site (First Load < 2.5s)",
      "Per‑project custom metatags for SEO",
      "Scalable catalog for new developments",
      "Active sales tool to capture investors"
    ],
  },
  mutter: {
    summaryEs:
      "Tienda online de videojuegos, consolas y coleccionables con catálogo dinámico, carrito y checkout integrado con Mercado Pago, panel admin completo y reglas de seguridad en Firebase.",
    summaryEn:
      "Online store for videogames, consoles and collectibles with dynamic catalog, cart and Mercado Pago checkout, full admin panel and hardened Firebase security rules.",
    stack: [
      "Frontend: React + Vite + TypeScript",
      "State & UX: React Context (Auth/Cart) + Framer Motion",
      "Backend admin: Vercel Serverless Functions + Firebase Admin SDK",
      "Firebase: Firestore · Authentication · Hosting · Storage",
      "Security: Custom Claims (admin / superadmin) + Firestore Rules",
      "Testing: Vitest · Playwright · Firestore Rules Testing",
      "Admin panel: React (users, roles, products, categorías, clientes)"
    ],
    integrations: [
      "Mercado Pago (Checkout Pro)",
      "ImageKit/Cloudinary (media optimizada)",
      "Integración de envíos",
      "Firebase Auth + Firestore",
      "Vercel Functions (API admin)"
    ],
    challengesEs: [
      "Implementar un checkout LATAM robusto con múltiples métodos de pago y flujo de órdenes seguro.",
      "Sincronizar carritos anónimos y usuarios registrados sin duplicar información ni perder contexto.",
      "Diseñar un panel admin completo con control de permisos, roles (admin/superadmin) y seguridad en Firebase.",
      "Separar frontend público de API admin para que ningún write crítico vaya directo desde el cliente a Firestore."
    ],
    challengesEn: [
      "Implement a robust LATAM checkout with multiple payment methods and a secure order flow.",
      "Sync guest carts and logged‑in users without data duplication or losing context.",
      "Design a full admin panel with permissions, roles (admin/superadmin) and Firebase‑backed security.",
      "Separate public frontend from admin API so no critical writes go directly from client to Firestore."
    ],
    solutionEs: [
      "SDK de pagos de Mercado Pago con notificaciones en tiempo real y creación de órdenes desde backend admin.",
      "Catálogo tipado, filtros dinámicos y sincronización del carrito entre usuario anónimo y autenticado.",
      "API admin en Vercel con Firebase Admin SDK, verificación de tokens, Custom Claims y Firestore Rules específicas.",
      "Panel de administración modular para gestionar productos, stock, categorías, subcategorías, clientes y usuarios admin."
    ],
    solutionEn: [
      "Mercado Pago SDK with real‑time notifications and order creation handled by the admin backend.",
      "Typed catalog, dynamic filters and cart synchronization between guest and authenticated users.",
      "Admin API on Vercel with Firebase Admin SDK, token verification, Custom Claims and dedicated Firestore security rules.",
      "Modular admin panel to manage products, stock, categories, subcategories, customers and admin users."
    ],
    resultsEs: [
      "Rendimiento optimizado con Vite (LCP ~2.1s) y navegación fluida.",
      "Conversión mejorada gracias a un flujo de checkout claro, confiable y adaptado a métodos de pago regionales.",
      "Panel de administración que facilita la gestión integral sin conocimientos técnicos, con roles y permisos claros.",
      "Arquitectura lista para escalar como white‑label store, con backend seguro y suite de tests automatizada."
    ],
    resultsEn: [
      "Optimized performance with Vite (LCP ~2.1s) and smooth navigation.",
      "Higher conversion thanks to a clear, trustworthy checkout flow tailored to regional payment methods.",
      "Admin panel that streamlines operations without technical expertise, with clear roles and permissions.",
      "Architecture ready to scale as a white‑label store, with a secure backend and automated test suite."
    ],
  },
  federico: {
    summaryEs: "Sitio web personal y profesional del campeón mundial de kickboxing y muay thai. Incluye biografía, cursos en video, galería multimedia y testimonios reales de alumnos.",
    summaryEn: "Personal and professional website for a Muay Thai & kickboxing world champion. Includes bio, video courses, media gallery and real student testimonials.",
    stack: [
      "Frontend: React + Vite + TypeScript",
      "Animaciones: Framer Motion",
      "Firebase: Firestore · Auth · Hosting · Storage",
      "i18n: i18next (ES/EN)"
    ],
    integrations: [
      "Vimeo (video courses)",
      "Cloudinary/ImageKit (optimized gallery)",
      "WhatsApp CTA",
      "SEO dinámico por sección"
    ],
    challengesEs: [
      "Sitio moderno pero liviano, accesible y administrable sin CMS",
      "Adaptar contenido extenso (biografía, clases, testimonios) sin saturar al usuario",
      "Experiencia mobile‑first fluida y visualmente clara",
      "Sistema de testimonios dinámicos, ordenados y con traducciones"
    ],
    challengesEn: [
      "Modern yet lightweight site, accessible and CMS‑less",
      "Adapt long‑form content (bio, classes, testimonials) without overwhelming users",
      "Smooth mobile‑first UX with clear visual hierarchy",
      "Dynamic, translated testimonials system"
    ],
    solutionEs: [
      "Secciones por bloques reutilizables (Hero, Sobre mí, Galería, Clases, Testimonios, Contacto)",
      "Contenido multilenguaje centralizado (es.json / en.json)",
      "Testimonios escalables con tipado central y carga desde testimonialsData.ts",
      "Galería multimedia con hovers, fullscreen y CTA",
      "Enlaces limpios, SEO on‑page y metadatos por página"
    ],
    solutionEn: [
      "Reusable blocks (Hero, About, Gallery, Classes, Testimonials, Contact)",
      "Centralized i18n content (es.json / en.json)",
      "Scalable testimonials with typed schema and data loader",
      "Media gallery with hovers, fullscreen and CTA",
      "Clean URLs, on‑page SEO and per‑page metadata"
    ],
    resultsEs: [
      "Mayor profesionalismo y claridad para sponsors y academias",
      "Plataforma lista para vender cursos (estructura de video + catálogo)",
      "Menor rebote gracias al orden por secciones y CTA activos",
      "Más consultas vía WhatsApp en mobile"
    ],
    resultsEn: [
      "More professional and clear positioning for sponsors and academies",
      "Course‑ready platform (video structure + catalog)",
      "Lower bounce thanks to clear sections and active CTAs",
      "More WhatsApp inquiries on mobile"
    ],
  },
  bionova: {
    summaryEs: "Tienda online profesional en EE.UU. para venta de suplementos (ES/EN). Variantes por producto (60/120 caps), precios diferenciados, stock real, checkout con Stripe/PayPal y panel de administración.",
    summaryEn: "Professional US‑based supplements store (ES/EN). Product variants (60/120 caps), tiered pricing, real stock, Stripe/PayPal checkout and an admin dashboard.",
    stack: [
      "Frontend: React + Vite + TypeScript",
      "Firebase: Firestore · Auth · Hosting · Storage",
      "i18n: i18next",
      "Rich content: TipTap (descripciones)"
    ],
    integrations: [
      "Stripe (Elements/Checkout)",
      "PayPal Buttons",
      "ImageKit/Cloudinary (medios optimizados)"
    ],
    challengesEs: [
      "Gestionar variantes con stock y precios por variante",
      "Checkout real para EE.UU. (Stripe/PayPal)",
      "Migración y optimización de imágenes (ImageKit)",
      "SEO on‑page y datos abiertos en multilenguaje"
    ],
    challengesEn: [
      "Variant management with per‑variant stock & pricing",
      "Real US checkout (Stripe/PayPal)",
      "Image migration & optimization (ImageKit)",
      "Multilingual on‑page SEO & Open Graph"
    ],
    solutionEs: [
      "Modelo de producto tipado con variantes y stock",
      "Stripe Elements + PayPal integrados en el flujo de compra",
      "Pipeline de medios con transformaciones en CDN (ImageKit)",
      "Editor enriquecido TipTap y metadatos por página"
    ],
    solutionEn: [
      "Typed product model with variants & stock",
      "Stripe Elements + PayPal integrated in the checkout flow",
      "Media pipeline with CDN transforms (ImageKit)",
      "TipTap rich editor and per‑page metadata"
    ],
    resultsEs: [
      "UX más rápida y clara",
      "Menos fricción en el pago (Stripe/PayPal)",
      "Administración centralizada de catálogo y pedidos"
    ],
    resultsEn: [
      "Faster, clearer UX",
      "Lower payment friction (Stripe/PayPal)",
      "Centralized catalog & orders management"
    ],
  },
  magenta: {
    summaryEs:
      "MVP funcional para una imprenta con 15 años de trayectoria. Incluye catálogo optimizado con mockups generados por IA, formulario dinámico de presupuestos y arquitectura moderna con Next.js 16.",
    summaryEn:
      "Functional MVP for a print shop with 15 years of experience. Includes an optimized catalog with AI-generated mockups, a dynamic quote form and a modern architecture with Next.js 16.",
    stack: [
      "Frontend: Next.js 16 (App Router) + TypeScript + TailwindCSS",
      "Infraestructura: Vercel (deploy continuo)",
      "Optimización SEO: metadata personalizada, OG automáticas, sitemap.xml y robots.txt",
      "Automatización: generación de imágenes con IA (Sora/OpenAI)",
      "Diseño: mockups personalizados + UI modular",
      "Gestión de datos: estructuras centralizadas en /src/data",
    ],
    stackEn: [
      "Frontend: Next.js 16 (App Router) + TypeScript + TailwindCSS",
      "Infrastructure: Vercel (continuous deploy)",
      "SEO optimization: custom metadata, automatic OG, sitemap.xml and robots.txt",
      "Automation: AI image generation with Sora/OpenAI",
      "Design: custom mockups + modular UI",
      "Data management: centralized structures in /src/data",
    ],
    integrations: [
      "Mockups personalizados generados por IA (Sora)",
      "Formularios dinámicos por servicio",
      "WhatsApp API para contacto inmediato",
      "Mapa de ubicación embebido",
      "Carrusel automático de marcas/clientes",
      "Favicon y OG card personalizada para redes sociales",
    ],
    integrationsEn: [
      "Custom AI-generated mockups (Sora)",
      "Service-based dynamic forms",
      "WhatsApp API for instant contact",
      "Embedded location map",
      "Automatic brand/client carousel",
      "Custom favicon and OG card for social media",
    ],
    challengesEs: [
      "Organizar información comercial diversa (servicios, productos, catálogo, presupuesto) en una estructura clara y escalable.",
      "Diseñar una experiencia fluida que funcione igual de bien en desktop y mobile.",
      "Optimizar la carga inicial y el SEO para un negocio local (posicionamiento por ciudad y rubro).",
      "Crear un formulario flexible capaz de adaptarse a distintos servicios sin repetir lógica.",
    ],
    challengesEn: [
      "Organize diverse commercial information (services, products, catalog, quotes) in a clear and scalable structure.",
      "Design a smooth experience that works equally well on desktop and mobile.",
      "Optimize initial load and SEO for a local business (city and industry targeting).",
      "Build a flexible form that adapts to different services without duplicating logic.",
    ],
    solutionEs: [
      "Arquitectura modular con componentes server/client correctamente separados.",
      "Catálogo de productos y servicios centralizado en estructuras de datos (src/data).",
      "Formularios dinámicos basados en reglas por servicio (libretas, tarjetas, afiches, etc.).",
      "Diseño limpio estilo Apple minimal con foco en claridad y velocidad de acceso.",
      "Optimización SEO completa (metadata, OG card, sitemap, robots).",
      "Deploy automatizado en Vercel con imágenes optimizadas.",
    ],
    solutionEn: [
      "Modular architecture with proper separation between server and client components.",
      "Centralized product and service catalog in reusable data structures (src/data).",
      "Dynamic forms driven by per-service rules (notebooks, cards, posters, etc.).",
      "Clean Apple-like minimal design focused on clarity and fast access.",
      "Full SEO optimization (metadata, OG card, sitemap, robots).",
      "Automated deployment on Vercel with optimized images.",
    ],
    resultsEs: [
      "Web rápida y confiable para un negocio local con mucha competencia.",
      "Mejor experiencia de usuario para pedidos de presupuesto (menos fricción).",
      "Imagen profesional consistente con la marca Magenta.",
      "Catálogo visual con mockups de alta calidad que elevan el branding.",
      "Preparado para futuras expansiones: e-commerce, panel administrativo, etc.",
    ],
    resultsEn: [
      "Fast and reliable website for a local business in a competitive market.",
      "Better user experience for quote requests (less friction).",
      "Professional image consistent with the Magenta brand.",
      "Visual catalog with high-quality mockups that elevate the branding.",
      "Ready for future expansions: e-commerce, admin panel, etc.",
    ],
  },
  boating: {
    summaryEs: "Sitio de servicios con reservas y WhatsApp directo.",
    summaryEn: "Service site with bookings and direct WhatsApp.",
    stack: ["React"],
    integrations: ["WhatsApp", "Maps"],
    challengesEs: ["SEO local", "Reservas"],
    challengesEn: ["Local SEO", "Bookings"],
    solutionEs: ["Páginas optimizadas", "CTA claros"],
    solutionEn: ["Optimized pages", "Clear CTAs"],
    resultsEs: ["Más leads", "Mejor visibilidad"],
    resultsEn: ["More leads", "Better visibility"],
  },
};

export default function PortfolioPage() {
  const { language } = useLanguage();
  const t = translations[language];

  const [filter, setFilter] = useState<Category>("all");
  const [expanded, setExpanded] = useState<Record<ProjectKey, boolean>>({
    lem: false,
    esteban: false,
    mutter: false,
    federico: false,
    bionova: false,
    boating: false,
    magenta: false,
  });
  const list = useMemo(() =>
    projects.filter(p => filter === "all" || projectMeta[p.key].category === filter)
  , [filter]);

  // Helper tipado para evitar problemas con acceso dinámico
  const P: Record<ProjectKey, { title: string; desc: string; link: string }> = {
    lem: t.portfolio.lem,
    esteban: t.portfolio.esteban,
    mutter: t.portfolio.mutter,
    federico: t.portfolio.federico,
    bionova: t.portfolio.bionova,
    boating: t.portfolio.boating,
    magenta: t.portfolio.magenta,
  };

  return (
    <>
      <SeoPortfolioSection />
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">{t.portfolio.title}</h1>
          <p className="text-gray-600 mt-2 max-w-[44rem] mx-auto">
            {language === "es"
              ? "Casos seleccionados de e‑commerce, marca personal y servicios."
              : "Selected work across e‑commerce, personal brands and services."}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {filters.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-2 text-sm transition border-b-2 ${filter === f.key ? "border-black text-black" : "border-transparent text-gray-600 hover:text-black"}`}
                aria-pressed={filter === f.key}
              >
                {language === "es" ? f.es : f.en}
              </button>
            ))}
          </div>
          <div className="mt-5">
            <a
              href={`mailto:r.opalo@icloud.com?subject=${encodeURIComponent(language === "es" ? "Solicitud de caso detallado" : "Request detailed case")}`}
              className="inline-flex items-center justify-center rounded-lg bg-[#3B82F6] text-white text-sm font-medium px-5 py-2 shadow-md hover:shadow-lg hover:opacity-90 transition"
              aria-label={language === "es" ? "Solicitar caso detallado" : "Request detailed case"}
              data-analytics="portfolio-request-case"
            >
              {language === "es" ? "Solicitar caso detallado" : "Request detailed case"}
            </a>
          </div>
        </div>

        <div className="space-y-10">
          {list.map((p) => (
            <motion.div
              key={p.key}
              className="border border-gray-200 rounded-2xl shadow-sm bg-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-5/12 p-4 md:p-6">
                  <img
                    src={p.cover}
                    alt={language === "es" ? `Imagen del proyecto ${P[p.key].title}` : `Project cover: ${P[p.key].title}`}
                    className="w-full h-64 md:h-full object-cover rounded-xl"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="md:w-7/12 p-6">
                  <h3 className="text-xl font-semibold tracking-tight">{P[p.key].title}</h3>
                  <p className="text-gray-700 mt-2 max-w-[62ch]">{P[p.key].desc}</p>
                  <p className="mt-3 text-sm text-gray-600">• {(language === "es" ? projectMeta[p.key].tags : projectMeta[p.key].tagsEn).join(" · ")}</p>
                  <div className="mt-4 flex items-center gap-4">
                    <a href={p.href} target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:text-primary-dark underline focus-visible:ring-2 ring-offset-2 ring-[#3B82F6] rounded-sm">{P[p.key].link}</a>
                    <button
                      onClick={() => setExpanded(e => ({ ...e, [p.key]: !e[p.key] }))}
                      className="text-sm text-gray-700 hover:text-black underline focus-visible:ring-2 ring-offset-2 ring-gray-300 rounded-sm"
                    >
                      {expanded[p.key] ? (language === "es" ? "Ver menos" : "View less") : (language === "es" ? "Ver más" : "View details")}
                    </button>
                  </div>

                  {expanded[p.key] && (
                    <div className="mt-5 border-t border-gray-100 pt-6">
                      <p className="text-gray-800 font-medium">{language === "es" ? caseDetails[p.key].summaryEs : caseDetails[p.key].summaryEn}</p>
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">{language === "es" ? "Stack" : "Stack"}</h4>
                          <ul className="text-sm text-gray-700 list-disc ml-5">
                            {(language === "es"
                              ? caseDetails[p.key].stack
                              : (caseDetails[p.key].stackEn ?? caseDetails[p.key].stack)
                            ).map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">{language === "es" ? "Integraciones" : "Integrations"}</h4>
                          <ul className="text-sm text-gray-700 list-disc ml-5">
                            {(language === "es"
                              ? caseDetails[p.key].integrations
                              : (caseDetails[p.key].integrationsEn ?? caseDetails[p.key].integrations)
                            ).map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">{language === "es" ? "Retos" : "Challenges"}</h4>
                          <ul className="text-sm text-gray-700 list-disc ml-5">
                            {(language === "es" ? caseDetails[p.key].challengesEs : caseDetails[p.key].challengesEn).map((s,i)=>(<li key={i}>{s}</li>))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">{language === "es" ? "Solución" : "Solution"}</h4>
                          <ul className="text-sm text-gray-700 list-disc ml-5">
                            {(language === "es" ? caseDetails[p.key].solutionEs : caseDetails[p.key].solutionEn).map((s,i)=>(<li key={i}>{s}</li>))}
                          </ul>
                        </div>
                      </div>
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">{language === "es" ? "Impacto" : "Impact"}</h4>
                        <ul className="text-sm text-gray-700 list-disc ml-5">
                          {(language === "es" ? caseDetails[p.key].resultsEs : caseDetails[p.key].resultsEn).map((s,i)=>(<li key={i}>{s}</li>))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        </div>
      </section>
    </>
  );
}
