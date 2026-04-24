// src/data/portfolioCases.ts
/**
 * Portfolio data only (no React). To add a case: extend `ProjectKey`, add a `projects` row,
 * matching `projectMeta` + `caseDetails`, then `portfolio.<key>` in `translations.ts` (ES/EN).
 * Optional: card on the home `PortfolioSection` and `focusCase` key must match `ProjectKey`.
 */

export type ProjectKey = "lem_web" | "lem_portal" | "esteban" | "mutter" | "federico" | "boating" | "magenta" | "campings_demo";
export type Project = { key: ProjectKey; href?: string; cover: string };

export const projects: Project[] = [
  { key: "campings_demo", href: "https://reservas-campings-nacionales.vercel.app", cover: "/img/parques-nacionales-logo.png" },
  { key: "magenta", href: "https://magenta-paysandu-m5in.vercel.app", cover: "/img/magenta-cover.png" },
  { key: "esteban", href: "https://estebanfirpo.com", cover: "/img/esteban.png" },
  { key: "lem_web",   href: "https://lem-box.com.uy",            cover: "/img/lem-box-cover.png" },
  { key: "lem_portal",   href: "https://portal.lem-box.com",            cover: "/img/lem-box-cover.png" },
  { key: "mutter",   href: "https://www.muttergames.com",            cover: "/img/mutter-cover.png" },
  { key: "federico", href: "https://www.federicoroma.com",            cover: "/img/federico-cover.jpg" },
  { key: "boating",  href: "https://www.boatingadventuresmiami.com", cover: "/img/Fondo.jpg" },
];

export type Category = "all" | "ecom" | "personal" | "services";
export const projectMeta: Record<ProjectKey, { category: Category; tags: string[]; tagsEn: string[] }> = {
  lem_web:      { category: "services", tags: ["Logística", "Next.js", "SEO", "Multi-país"],         tagsEn: ["Logistics", "Next.js", "SEO", "Multi-country"] },
  lem_portal:      { category: "services", tags: ["Portal", "Firebase", "Stripe", "Permisos"],         tagsEn: ["Portal", "Firebase", "Stripe", "RBAC"] },
  esteban:  { category: "services", tags: ["Real Estate", "Next.js"],     tagsEn: ["Real Estate", "Next.js"] },
  mutter:   { category: "ecom",     tags: ["E‑commerce", "Mercado Pago"],            tagsEn: ["E‑commerce", "Mercado Pago"] },
  federico: { category: "personal", tags: ["Marca personal", "Cursos"],             tagsEn: ["Personal brand", "Courses"] },
  magenta:  { category: "services", tags: ["Imprenta", "Next.js"],                  tagsEn: ["Print shop", "Next.js"] },
  boating:  { category: "services", tags: ["Servicios", "Reservas"],                tagsEn: ["Services", "Bookings"] },
  campings_demo: { category: "services", tags: ["Reservas", "Next.js", "Firebase", "Admin", "MVP"], tagsEn: ["Bookings", "Next.js", "Firebase", "Admin", "MVP"] },
};

export const filters: { key: Category; es: string; en: string }[] = [
  { key: "all",      es: "Todos",       en: "All" },
  { key: "ecom",     es: "E‑commerce", en: "E‑commerce" },
  { key: "personal", es: "Personal",    en: "Personal" },
  { key: "services", es: "Servicios",   en: "Services" },
];


export type PortfolioCaseDetail = {
  summaryEs: string;
  summaryEn: string;
  stack: string[];
  integrations: string[];
  stackEn?: string[];
  integrationsEn?: string[];
  challengesEs: string[];
  challengesEn: string[];
  solutionEs: string[];
  solutionEn: string[];
  resultsEs: string[];
  resultsEn: string[];
};

export const caseDetails: Record<ProjectKey, PortfolioCaseDetail> = {
  lem_web: {
    summaryEs: "Logística en Miami y envíos internacionales (Uruguay + Argentina). Landing mobile-first, multipaís y contacto con Resend. Sitios: lem-box.com.uy y lem-box.com.ar",
    summaryEn: "Logistics in Miami and international shipping (Uruguay + Argentina). Mobile-first, multi-country landing with Resend contact. Sites: lem-box.com.uy and lem-box.com.ar",
    stack: [
      "Frontend: Next.js 15 + TypeScript + Tailwind",
      "Hosting: Vercel",
      "Integraciones: WhatsApp · Instagram · Email (Resend)",
      "Arquitectura multipaís: lem-box.com (selector), lem-box.com.uy, lem-box.com.ar"
    ],
    integrations: ["Resend (email)", "WhatsApp", "Instagram"],
    challengesEs: [
      "Crear un sitio de logística con estética premium (Apple-like) en un rubro tradicional",
      "Alinear branding digital con la operativa real de un warehouse en Miami",
      "Optimizar tiempos de carga y experiencia mobile",
      "Implementar arquitectura multipaís con SEO específico por país"
    ],
    challengesEn: [
      "Build a premium (Apple-like) logistics site in a traditional industry",
      "Align digital branding with the real Miami warehouse operations",
      "Optimize load times and mobile UX",
      "Implement multi-country architecture with country-specific SEO"
    ],
    solutionEs: [
      "Diseño consistente y minimalista con colores corporativos (#02120F y #EB6619)",
      "Flujo de navegación claro: landing → contacto → WhatsApp/email",
      "Implementación de arquitectura multipaís (selector + sitios locales)",
      "SEO optimizado para Uruguay y Argentina con metadata específica"
    ],
    solutionEn: [
      "Consistent, minimal design with brand colors (#02120F and #EB6619)",
      "Clear navigation flow: landing → contact → WhatsApp/email",
      "Multi-country architecture (selector + local sites)",
      "SEO optimized for Uruguay and Argentina with specific metadata"
    ],
    resultsEs: [
      "Primera versión productiva en Uruguay lista para producción",
      "Roadmap claro para expansión regional (Argentina activa)",
      "Sitio rápido, responsive y con identidad propia, diferenciado de la competencia",
      "Performance optimizado para ambos países con carga rápida"
    ],
    resultsEn: [
      "First productive version for Uruguay, ready for production",
      "Clear roadmap for regional expansion (Argentina active)",
      "Fast, responsive site with its own identity",
      "Optimized performance for both countries with fast loading"
    ],
  },
  lem_portal: {
    summaryEs: "Sistema operativo para gestión de logística con roles (superadmin/admin/operador/partner/client), trazabilidad, cajas/embarques, facturación y pagos con Stripe. Acceso restringido (requiere credenciales).",
    summaryEn: "Operational system for logistics management with roles (superadmin/admin/operator/partner/client), traceability, boxes/shipments, invoicing and Stripe payments. Restricted access (credentials required).",
    stack: [
      "Frontend: React + TypeScript + TailwindCSS",
      "Backend: Firebase (Auth, Firestore, Storage)",
      "Pagos: Stripe Checkout + Webhooks",
      "Seguridad: Firestore Rules + Custom Claims",
      "Búsqueda: Paginación con tokens + índices escalables",
      "UI: Componentes modulares + gestión de permisos"
    ],
    integrations: [
      "Firebase Authentication (roles y claims)",
      "Firestore (datos + reglas de seguridad)",
      "Firebase Storage (multi-foto inbound)",
      "Stripe (checkout + webhooks para facturación)",
      "Sistema de permisos RBAC (Role-Based Access Control)"
    ],
    challengesEs: [
      "Implementar sistema de roles granular (superadmin/admin/operador/partner/client) con permisos específicos",
      "Gestionar trazabilidad completa de cajas y embarques con búsqueda escalable",
      "Integrar facturación con Stripe y webhooks para sincronización en tiempo real",
      "Crear sistema de inbound multi-foto con galería y gestión de permisos por rol",
      "Asegurar Firestore Rules y Custom Claims para reconciliación de permisos"
    ],
    challengesEn: [
      "Implement granular role system (superadmin/admin/operator/partner/client) with specific permissions",
      "Manage complete traceability of boxes and shipments with scalable search",
      "Integrate invoicing with Stripe and webhooks for real-time synchronization",
      "Create multi-photo inbound system with gallery and role-based permission management",
      "Secure Firestore Rules and Custom Claims for permission reconciliation"
    ],
    solutionEs: [
      "Arquitectura de roles con Custom Claims en Firebase Auth y verificación en Firestore Rules",
      "Búsqueda escalable con paginación basada en tokens y índices optimizados",
      "Integración completa de Stripe: checkout embebido, webhooks para actualización de estado y facturación automática",
      "Sistema de inbound con carga múltiple de fotos, galería organizada y permisos por operador",
      "Firestore Rules dinámicas que validan roles y claims en tiempo real"
    ],
    solutionEn: [
      "Role architecture with Custom Claims in Firebase Auth and verification in Firestore Rules",
      "Scalable search with token-based pagination and optimized indexes",
      "Complete Stripe integration: embedded checkout, webhooks for status updates and automatic invoicing",
      "Inbound system with multiple photo upload, organized gallery and operator-based permissions",
      "Dynamic Firestore Rules that validate roles and claims in real-time"
    ],
    resultsEs: [
      "Sistema operativo completo con control de acceso granular y trazabilidad total",
      "Facturación automatizada con Stripe y sincronización en tiempo real",
      "Búsqueda escalable que maneja grandes volúmenes de datos sin degradación",
      "Gestión eficiente de inbound con multi-foto y permisos por operador",
      "Arquitectura segura lista para escalar con múltiples usuarios y roles"
    ],
    resultsEn: [
      "Complete operational system with granular access control and full traceability",
      "Automated invoicing with Stripe and real-time synchronization",
      "Scalable search that handles large data volumes without degradation",
      "Efficient inbound management with multi-photo and operator-based permissions",
      "Secure architecture ready to scale with multiple users and roles"
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
      "i18n: ES/EN con contenido centralizado (archivos por idioma)",
    ],
    stackEn: [
      "Frontend: React + Vite + TypeScript",
      "Motion: Framer Motion",
      "Firebase: Firestore · Auth · Hosting · Storage",
      "i18n: ES/EN with centralized content (per-locale data files)",
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
      "Centralized bilingual content (es.json / en.json pattern)",
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
  campings_demo: {
    summaryEs:
      "MVP funcional avanzado para gestionar reservas de campings y áreas recreativas. Incluye catálogo público, flujo de reserva, consulta por código, panel administrativo con roles y soporte de inventario híbrido: por capacidad o por unidades físicas.",
    summaryEn:
      "Advanced functional MVP to manage campground and recreational area bookings. It includes a public catalog, booking flow, code-based booking lookup, an admin panel with roles, and hybrid inventory support: by capacity or by physical units.",
    stack: [
      "Frontend: Next.js 16 + React 19 + TypeScript + App Router",
      "Backend/servicios: Firebase Auth + Cloud Firestore",
      "Server-side puntual: Firebase Admin SDK en rutas API",
      "Arquitectura: flujo público + panel admin + inventario híbrido",
      "Deploy compatible con Vercel",
    ],
    stackEn: [
      "Frontend: Next.js 16 + React 19 + TypeScript + App Router",
      "Backend/services: Firebase Auth + Cloud Firestore",
      "Server-side actions: Firebase Admin SDK in selected API routes",
      "Architecture: public flow + admin panel + hybrid inventory",
      "Vercel-compatible deployment",
    ],
    integrations: [
      "Firebase Auth",
      "Cloud Firestore",
      "Firebase Admin SDK",
      "Mercado Pago (flujo simulado / no productivo)",
    ],
    integrationsEn: [
      "Firebase Auth",
      "Cloud Firestore",
      "Firebase Admin SDK",
      "Mercado Pago (simulated / non-production flow)",
    ],
    challengesEs: [
      "Modelar dos tipos de inventario en un mismo sistema: por capacidad general y por unidades físicas.",
      "Resolver disponibilidad, bloqueos y reservas por rango de fechas.",
      "Separar flujo público y operación administrativa con roles.",
      "Preparar la base técnica para evolución futura sin forzar features incompletas.",
    ],
    challengesEn: [
      "Model two inventory types in the same system: general capacity and physical units.",
      "Handle availability, blocks and bookings across date ranges.",
      "Separate the public booking flow from role-based admin operations.",
      "Prepare the technical foundation for future evolution without forcing unfinished features.",
    ],
    solutionEs: [
      "Aplicación web con catálogo público, detalle de camping, reserva online y consulta por código.",
      "Panel admin con roles, reservas manuales, cancelación, exportación y operación por camping.",
      "Soporte para inventario híbrido con lógica específica según el tipo de camping.",
      "Separación entre datos privados y proyección pública para disponibilidad.",
    ],
    solutionEn: [
      "Web application with public catalog, campground detail pages, online booking and code-based lookup.",
      "Admin panel with roles, manual bookings, cancellation, exports and per-campground operations.",
      "Hybrid inventory support with specific logic depending on campground type.",
      "Separation between private booking data and a public availability projection.",
    ],
    resultsEs: [
      "Núcleo del producto resuelto en versión demostrable.",
      "Operación administrativa principal ya modelada dentro del MVP.",
      "Base técnica preparada para evolucionar a pagos reales, mapa interactivo y automatizaciones.",
      "Caso apto para portfolio si se presenta explícitamente como MVP/demo.",
    ],
    resultsEn: [
      "Core product flow solved in a demonstrable version.",
      "Primary admin operations already modeled within the MVP.",
      "Technical foundation prepared for real payments, interactive maps and automations.",
      "Portfolio-ready only if presented explicitly as an MVP/demo.",
    ],
  },
};

export const initialExpandedState: Record<ProjectKey, boolean> = (
  Object.keys(caseDetails) as ProjectKey[]
).reduce(
  (acc, key) => ({ ...acc, [key]: false }),
  {} as Record<ProjectKey, boolean>
);
