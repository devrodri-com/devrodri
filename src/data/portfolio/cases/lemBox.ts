import { en, es } from "../../../i18n";
import { definePortfolioCase } from "../types";

const stack = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Firebase Authentication",
  "Cloud Firestore",
  "Firebase Storage",
  "Vercel",
] as const;

export const lemBoxCase = definePortfolioCase({
  key: "lem_box",
  portfolioOrder: 0,
  category: "systems",
  cover: "/img/lem-box-cover.png",
  actions: [
    {
      href: "https://lem-box.com",
      label: {
        es: es.portfolio.lem_box.platformLink,
        en: en.portfolio.lem_box.platformLink,
      },
      note: {
        es: es.portfolio.lem_box.platformNote,
        en: en.portfolio.lem_box.platformNote,
      },
    },
    {
      href: "https://lem-box.com.uy",
      label: {
        es: es.portfolio.lem_box.uruguayLink,
        en: en.portfolio.lem_box.uruguayLink,
      },
    },
    {
      href: "https://lem-box.com.ar",
      label: {
        es: es.portfolio.lem_box.argentinaLink,
        en: en.portfolio.lem_box.argentinaLink,
      },
    },
  ],
  content: {
    es: {
      title: es.portfolio.lem_box.title,
      description: es.portfolio.lem_box.desc,
      tags: [
        "Producto propio · Plataforma operativa · Desarrollo full-stack",
      ],
      status: es.portfolio.lem_box.status,
      role:
        "Fundador, propietario, Operations Manager, responsable de producto y desarrollador full-stack.",
      details: {
        summary:
          "Ecosistema digital para una operación logística internacional",
        stack,
        integrationsLabel: "Integraciones y canales",
        integrations: [
          "Resend para formularios de contacto",
          "WhatsApp y email como canales comerciales",
          "PayPal como medio online vigente",
          "Transferencias manuales con comprobante",
        ],
        challenges: [
          "Conectar la captación comercial con una operación que incluye recepción, fotografías, peso, asignación, consolidación, cajas, embarques, tracking, pagos y atención, sin depender de herramientas dispersas.",
        ],
        solution: [
          "Diseñé y desarrollé experiencias diferenciadas por rol para clientes, partners y equipo interno, con trazabilidad desde la recepción hasta el embarque. Los sitios de Uruguay y Argentina conectan cada mercado con el mismo ecosistema operativo.",
        ],
        impact: [
          "El sistema centraliza la operación diaria, reduce tareas manuales dispersas y mantiene el producto alineado con los procesos reales del negocio. Actualmente atraviesa una etapa continua de documentación, pruebas y hardening.",
          "Roadmap: preparación técnica y de seguridad para una futura expansión a Android e iOS.",
        ],
      },
    },
    en: {
      title: en.portfolio.lem_box.title,
      description: en.portfolio.lem_box.desc,
      tags: [
        "Own product · Operations platform · Full-stack development",
      ],
      status: en.portfolio.lem_box.status,
      role:
        "Founder, owner, Operations Manager, product lead, and full-stack developer.",
      details: {
        summary:
          "Digital ecosystem for an international logistics operation",
        stack,
        integrationsLabel: "Integrations and channels",
        integrations: [
          "Resend for contact forms",
          "WhatsApp and email as commercial channels",
          "PayPal as the current online payment method",
          "Manual bank transfers with proof of payment",
        ],
        challenges: [
          "Connect customer acquisition with a real operation involving package intake, photos, weight, assignment, consolidation, boxes, shipments, tracking, payments, and customer support without relying on scattered tools.",
        ],
        solution: [
          "I designed and developed role-specific experiences for customers, partners, and internal teams, with traceability from intake through shipment. The Uruguay and Argentina websites connect each market to the same operational ecosystem.",
        ],
        impact: [
          "The platform centralizes daily operations, reduces scattered manual work, and keeps the product aligned with the business's actual processes. It is currently undergoing continuous documentation, testing, and security hardening.",
          "Roadmap: technical and security preparation for a future expansion to Android and iOS.",
        ],
      },
    },
  },
  home: {
    order: 0,
    summary: {
      es: "Producto propio que conecta los sitios de Uruguay y Argentina con una plataforma central para clientes, partners y operación interna. Centraliza paquetes, cajas, embarques, tracking y procesos logísticos en un solo ecosistema.",
      en: "A product built for LEM-BOX's real logistics operation, connecting the Uruguay and Argentina websites with a central platform for customers, partners, and internal teams. It centralizes packages, shipments, tracking, and operational workflows.",
    },
  },
});
