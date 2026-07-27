import { en, es } from "../../../i18n";
import { definePortfolioCase } from "../types";

const stackEs = [
  "Frontend: React + TypeScript + TailwindCSS",
  "Backend: Firebase (Auth, Firestore, Storage)",
  "Pagos: Stripe Checkout + Webhooks",
  "Seguridad: Firestore Rules + Custom Claims",
  "Búsqueda: Paginación con tokens + índices escalables",
  "UI: Componentes modulares + gestión de permisos"
] as const;
const stackEn = stackEs;
const integrationsEs = [
  "Firebase Authentication (roles y claims)",
  "Firestore (datos + reglas de seguridad)",
  "Firebase Storage (multi-foto inbound)",
  "Stripe (checkout + webhooks para facturación)",
  "Sistema de permisos RBAC (Role-Based Access Control)"
] as const;
const integrationsEn = integrationsEs;

export const lemPortalCase = definePortfolioCase({
  key: "lem_portal",
  portfolioOrder: 3,
  category: "services",
  cover: "/img/lem-box-cover.png",
  actions: [
    {
      href: "https://portal.lem-box.com",
      label: {
        es: es.portfolio.lem_portal.link,
        en: en.portfolio.lem_portal.link,
      },
      note: {
        es: "(requiere credenciales)",
        en: "(credentials required)",
      },
    },
  ],
  content: {
    es: {
      title: es.portfolio.lem_portal.title,
      description: es.portfolio.lem_portal.desc,
      tags: [
        "Portal",
        "Firebase",
        "Stripe",
        "Permisos"
      ],
      details: {
        summary: "Sistema operativo para gestión de logística con roles (superadmin/admin/operador/partner/client), trazabilidad, cajas/embarques, facturación y pagos con Stripe. Acceso restringido (requiere credenciales).",
        stack: stackEs,
        integrations: integrationsEs,
        challenges: [
          "Implementar sistema de roles granular (superadmin/admin/operador/partner/client) con permisos específicos",
          "Gestionar trazabilidad completa de cajas y embarques con búsqueda escalable",
          "Integrar facturación con Stripe y webhooks para sincronización en tiempo real",
          "Crear sistema de inbound multi-foto con galería y gestión de permisos por rol",
          "Asegurar Firestore Rules y Custom Claims para reconciliación de permisos"
        ],
        solution: [
          "Arquitectura de roles con Custom Claims en Firebase Auth y verificación en Firestore Rules",
          "Búsqueda escalable con paginación basada en tokens y índices optimizados",
          "Integración completa de Stripe: checkout embebido, webhooks para actualización de estado y facturación automática",
          "Sistema de inbound con carga múltiple de fotos, galería organizada y permisos por operador",
          "Firestore Rules dinámicas que validan roles y claims en tiempo real"
        ],
        impact: [
          "Sistema operativo completo con control de acceso granular y trazabilidad total",
          "Facturación automatizada con Stripe y sincronización en tiempo real",
          "Búsqueda escalable que maneja grandes volúmenes de datos sin degradación",
          "Gestión eficiente de inbound con multi-foto y permisos por operador",
          "Arquitectura segura lista para escalar con múltiples usuarios y roles"
        ],
      },
    },
    en: {
      title: en.portfolio.lem_portal.title,
      description: en.portfolio.lem_portal.desc,
      tags: [
        "Portal",
        "Firebase",
        "Stripe",
        "RBAC"
      ],
      details: {
        summary: "Operational system for logistics management with roles (superadmin/admin/operator/partner/client), traceability, boxes/shipments, invoicing and Stripe payments. Restricted access (credentials required).",
        stack: stackEn,
        integrations: integrationsEn,
        challenges: [
          "Implement granular role system (superadmin/admin/operator/partner/client) with specific permissions",
          "Manage complete traceability of boxes and shipments with scalable search",
          "Integrate invoicing with Stripe and webhooks for real-time synchronization",
          "Create multi-photo inbound system with gallery and role-based permission management",
          "Secure Firestore Rules and Custom Claims for permission reconciliation"
        ],
        solution: [
          "Role architecture with Custom Claims in Firebase Auth and verification in Firestore Rules",
          "Scalable search with token-based pagination and optimized indexes",
          "Complete Stripe integration: embedded checkout, webhooks for status updates and automatic invoicing",
          "Inbound system with multiple photo upload, organized gallery and operator-based permissions",
          "Dynamic Firestore Rules that validate roles and claims in real-time"
        ],
        impact: [
          "Complete operational system with granular access control and full traceability",
          "Automated invoicing with Stripe and real-time synchronization",
          "Scalable search that handles large data volumes without degradation",
          "Efficient inbound management with multi-photo and operator-based permissions",
          "Secure architecture ready to scale with multiple users and roles"
        ],
      },
    },
  },
  home: {
    order: 3,
    summary: {
      "es": "Operativa & pagos · Portal interno con roles, tracking, cajas/embarques y Stripe.",
      "en": "Ops & payments · Internal portal with roles, tracking, boxes/shipments and Stripe."
    },
  },
});
