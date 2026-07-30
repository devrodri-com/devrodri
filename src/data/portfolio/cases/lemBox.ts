import { en, es } from "../../../i18n";
import {
  definePortfolioCase,
  type Localized,
  type PortfolioAction,
} from "../types";

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

const publicRole = {
  es: "Fundador, propietario y Operations Manager. Lidero producto, procesos y desarrollo full-stack del ecosistema digital.",
  en: "Founder, owner, and Operations Manager. I lead product, processes, and full-stack development of the digital ecosystem.",
} as const satisfies Localized<string>;

type LemBoxPublicLink = PortfolioAction & {
  directory: Localized<{
    action: string;
    description: string;
    domain: string;
    title: string;
  }>;
};

export const lemBoxPublicLinksSection = {
  es: {
    eyebrow: "ENLACES PÚBLICOS",
    title: "Conocer el ecosistema",
    description:
      "Accedé a la plataforma central y conocé la presencia comercial de LEM-BOX en Uruguay y Argentina.",
  },
  en: {
    eyebrow: "PUBLIC LINKS",
    title: "Explore the ecosystem",
    description:
      "Access the central platform and explore LEM-BOX's commercial presence in Uruguay and Argentina.",
  },
} as const satisfies Localized<{
  description: string;
  eyebrow: string;
  title: string;
}>;

export const lemBoxPublicLinks = [
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
    directory: {
      es: {
        title: "Plataforma central",
        domain: "lem-box.com",
        description: "Acceso con credenciales",
        action: "Abrir plataforma",
      },
      en: {
        title: "Central platform",
        domain: "lem-box.com",
        description: "Sign-in required",
        action: "Open platform",
      },
    },
  },
  {
    href: "https://lem-box.com.uy",
    label: {
      es: es.portfolio.lem_box.uruguayLink,
      en: en.portfolio.lem_box.uruguayLink,
    },
    directory: {
      es: {
        title: "Uruguay",
        domain: "lem-box.com.uy",
        description: "Sitio comercial para Uruguay",
        action: "Visitar sitio",
      },
      en: {
        title: "Uruguay",
        domain: "lem-box.com.uy",
        description: "Commercial website for Uruguay",
        action: "Visit website",
      },
    },
  },
  {
    href: "https://lem-box.com.ar",
    label: {
      es: es.portfolio.lem_box.argentinaLink,
      en: en.portfolio.lem_box.argentinaLink,
    },
    directory: {
      es: {
        title: "Argentina",
        domain: "lem-box.com.ar",
        description: "Sitio comercial para Argentina",
        action: "Visitar sitio",
      },
      en: {
        title: "Argentina",
        domain: "lem-box.com.ar",
        description: "Commercial website for Argentina",
        action: "Visit website",
      },
    },
  },
] as const satisfies readonly LemBoxPublicLink[];

export const lemBoxCase = definePortfolioCase({
  key: "lem_box",
  portfolioOrder: 0,
  category: "systems",
  cover: "/img/lem-box-cover.png",
  actions: lemBoxPublicLinks,
  content: {
    es: {
      title: es.portfolio.lem_box.title,
      description: es.portfolio.lem_box.desc,
      tags: ["Producto propio · Plataforma operativa"],
      status: es.portfolio.lem_box.status,
      role: publicRole.es,
    },
    en: {
      title: en.portfolio.lem_box.title,
      description: en.portfolio.lem_box.desc,
      tags: ["Own product · Operations platform"],
      status: en.portfolio.lem_box.status,
      role: publicRole.en,
    },
  },
  caseStudy: {
    slug: "lem-box",
    path: "/portfolio/lem-box",
    coverWidth: 1200,
    coverHeight: 630,
    stack,
    publicLinks: lemBoxPublicLinks,
    finalCtaHref: "/#contacto",
    content: {
      es: {
        seo: {
          title:
            "LEM-BOX: plataforma logística y producto propio | Rodrigo Opalo",
          description:
            "Caso de producto propio: un ecosistema digital conectado con la operación logística de LEM-BOX en Estados Unidos, Uruguay y Argentina.",
        },
        header: {
          badges: ["Producto propio", "En operación"],
          subtitle: "Ecosistema digital para una operación logística internacional",
          coverAlt: "Portada de LEM-BOX",
          backLabel: "Volver al portfolio",
          homeCta: "Ver caso LEM-BOX",
          portfolioCta: "Ver caso completo",
        },
        summary: {
          title: "Un producto conectado a una operación real",
          text:
            "LEM-BOX es un negocio logístico con más de 10 años de trayectoria. Su ecosistema digital actual forma parte de una evolución más reciente y conecta los sitios comerciales de Uruguay y Argentina con una plataforma central utilizada por clientes, partners y el equipo operativo.",
          clarification: "",
        },
        challenge: {
          title: "El desafío",
          text:
            "La operación necesitaba continuidad entre la captación comercial, la recepción y consolidación de paquetes, los embarques, el tracking, los pagos y la atención. El desafío no era crear una web aislada, sino conectar mercados, usuarios y procesos en un producto alineado con la operación real.",
        },
        role: {
          title: "Mi rol",
          text:
            "Mi trabajo parte de la operación diaria: traduzco necesidades reales en prioridades de producto, flujos y funcionalidades, y llevo esas decisiones hasta la implementación y evolución técnica del ecosistema.",
        },
        ecosystem: {
          title: "Un ecosistema, distintas experiencias",
          items: [
            {
              title: "Sitios por mercado",
              text:
                "Los sitios de Uruguay y Argentina comunican el servicio y acompañan la captación comercial de cada mercado.",
            },
            {
              title: "Plataforma central",
              text:
                "Un único punto de acceso ofrece experiencias diferenciadas según el rol y el contexto operativo de cada usuario.",
            },
            {
              title: "Operación conectada",
              text:
                "La plataforma acompaña procesos de recepción, evidencia fotográfica, peso, asignación, cajas, embarques, tracking, pagos y comprobantes.",
            },
          ],
        },
        audiences: {
          title: "Experiencias según cada necesidad",
          items: [
            {
              title: "Clientes",
              text:
                "Acceden a la información y a las funciones habilitadas para su relación con la operación.",
            },
            {
              title: "Partners",
              text:
                "Trabajan con el contexto operativo y las responsabilidades asignadas a su rol.",
            },
            {
              title: "Equipo operativo",
              text:
                "Coordina recepción, consolidación, embarques, estados y atención dentro de la plataforma.",
            },
          ],
        },
        solution: {
          title: "De procesos dispersos a un producto conectado",
          text:
            "Diseñé y desarrollé una plataforma central conectada con las superficies comerciales de cada mercado. El resultado es un ecosistema donde la información acompaña el recorrido desde la captación hasta la operación y el seguimiento.",
        },
        architecture: {
          title: "Base técnica",
          text:
            "La arquitectura combina interfaces web, autenticación, datos, archivos y despliegues en una base preparada para evolucionar junto con el producto.",
          stackLabel: "Tecnologías principales",
        },
        markets: {
          title: "Una operación, tres mercados",
          text:
            "La operación logística se desarrolla en Estados Unidos, mientras Uruguay y Argentina cuentan con experiencias comerciales adaptadas a cada mercado y conectadas al mismo ecosistema operativo.",
        },
        evolution: {
          title: "Un producto que evoluciona con la operación",
          text:
            "LEM-BOX continúa adaptándose a los procesos, necesidades y prioridades reales del negocio.",
          qualityTitle: "Calidad y reducción de riesgo",
          qualityText:
            "Su desarrollo se apoya en pruebas automatizadas, autorización por roles, revisión de arquitectura, documentación técnica y despliegues controlados. Cada cambio forma parte de un proceso continuo de mejora y reducción de riesgo.",
        },
        mobileFuture: {
          title: "Siguiente etapa",
          text:
            "El ecosistema atraviesa una etapa de documentación, pruebas y preparación técnica para una futura extensión a Android e iOS. Estas aplicaciones forman parte de la evolución prevista y todavía no se presentan como productos disponibles.",
        },
        currentState: {
          title: "ESTADO ACTUAL · PRODUCTO ACTIVO",
          text: "",
        },
        publicLinksTitle: lemBoxPublicLinksSection.es.title,
        finalCta: {
          title: "¿Necesitás un sistema conectado a una operación real?",
          text:
            "Contame el contexto y vemos cuál puede ser el mejor punto de partida.",
          buttonLabel: "Contame tu proyecto",
        },
      },
      en: {
        seo: {
          title:
            "LEM-BOX: logistics platform and own product | Rodrigo Opalo",
          description:
            "Own-product case study: a digital ecosystem connected to LEM-BOX's logistics operation across the United States, Uruguay, and Argentina.",
        },
        header: {
          badges: ["Own product", "In operation"],
          subtitle: "Digital ecosystem for an international logistics operation",
          coverAlt: "LEM-BOX cover",
          backLabel: "Back to portfolio",
          homeCta: "View LEM-BOX case study",
          portfolioCta: "View full case study",
        },
        summary: {
          title: "A product connected to a real operation",
          text:
            "LEM-BOX is a logistics business with more than 10 years of experience. Its current digital ecosystem is part of a more recent evolution and connects the commercial websites for Uruguay and Argentina with a central platform used by customers, partners, and the operations team.",
          clarification: "",
        },
        challenge: {
          title: "The challenge",
          text:
            "The operation needed continuity across customer acquisition, package intake and consolidation, shipments, tracking, payments, and support. The challenge was not to build an isolated website, but to connect markets, users, and processes through a product aligned with the real operation.",
        },
        role: {
          title: "My role",
          text:
            "My work starts with day-to-day operations: I turn real needs into product priorities, workflows, and features, and carry those decisions through implementation and the ecosystem's technical evolution.",
        },
        ecosystem: {
          title: "One ecosystem, different experiences",
          items: [
            {
              title: "Market-specific websites",
              text:
                "The Uruguay and Argentina websites communicate the service and support customer acquisition in each market.",
            },
            {
              title: "Central platform",
              text:
                "A single access point provides different experiences based on each user's role and operational context.",
            },
            {
              title: "Connected operations",
              text:
                "The platform supports intake, photo evidence, weight, assignment, boxes, shipments, tracking, payments, and receipts.",
            },
          ],
        },
        audiences: {
          title: "Experiences built around different needs",
          items: [
            {
              title: "Customers",
              text:
                "They access the information and features available for their relationship with the operation.",
            },
            {
              title: "Partners",
              text:
                "They work with the operational context and responsibilities assigned to their role.",
            },
            {
              title: "Operations team",
              text:
                "They coordinate intake, consolidation, shipments, statuses, and support within the platform.",
            },
          ],
        },
        solution: {
          title: "From scattered processes to a connected product",
          text:
            "I designed and developed a central platform connected to the commercial surfaces of each market. The result is an ecosystem where information follows the journey from acquisition through operations and tracking.",
        },
        architecture: {
          title: "Technical foundation",
          text:
            "The architecture combines web interfaces, authentication, data, files, and deployments on a foundation designed to evolve with the product.",
          stackLabel: "Core technologies",
        },
        markets: {
          title: "One operation, three markets",
          text:
            "The logistics operation is based in the United States, while Uruguay and Argentina have commercial experiences tailored to each market and connected to the same operational ecosystem.",
        },
        evolution: {
          title: "A product that evolves with the operation",
          text:
            "LEM-BOX continues adapting to the real processes, needs, and priorities of the business.",
          qualityTitle: "Quality and risk reduction",
          qualityText:
            "Its development is supported by automated testing, role-based authorization, architecture reviews, technical documentation, and controlled deployments. Each change is part of an ongoing process of improvement and risk reduction.",
        },
        mobileFuture: {
          title: "Next stage",
          text:
            "The ecosystem is currently in a stage of documentation, testing, and technical preparation for a future extension to Android and iOS. These applications are part of the planned evolution and are not yet presented as available products.",
        },
        currentState: {
          title: "CURRENT STATUS · ACTIVE PRODUCT",
          text: "",
        },
        publicLinksTitle: lemBoxPublicLinksSection.en.title,
        finalCta: {
          title: "Need a system connected to a real operation?",
          text:
            "Share the context and we'll identify the best place to start.",
          buttonLabel: "Tell me about your project",
        },
      },
    },
  },
  home: {
    order: 0,
    summary: {
      es: "Producto propio que conecta la presencia comercial de LEM-BOX en Uruguay y Argentina con una plataforma central utilizada en su operación logística entre Estados Unidos y ambos mercados.",
      en: "A product built for LEM-BOX's real operation, connecting its commercial presence in Uruguay and Argentina with a central platform used across its logistics workflows between the United States and both markets.",
    },
  },
});
