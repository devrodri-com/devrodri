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
  es: "Fundador, propietario y Operations Manager. Responsable de producto, diseño de procesos y desarrollo full-stack del ecosistema digital.",
  en: "Founder, owner, and Operations Manager. Product lead, process designer, and full-stack developer of the digital ecosystem.",
} as const satisfies Localized<string>;

const publicLinks = [
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
] as const satisfies readonly PortfolioAction[];

export const lemBoxCase = definePortfolioCase({
  key: "lem_box",
  portfolioOrder: 0,
  category: "systems",
  cover: "/img/lem-box-cover.png",
  actions: publicLinks,
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
    publicLinks,
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
          badges: ["Producto propio", "Producto activo"],
          subtitle: "Ecosistema digital para una operación logística internacional",
          coverAlt: "Portada de LEM-BOX",
          backLabel: "Volver al portfolio",
          homeCta: "Ver caso LEM-BOX",
          portfolioCta: "Ver caso completo",
        },
        summary: {
          title: "Un producto conectado a una operación real",
          text:
            "LEM-BOX es un negocio logístico con más de 10 años de trayectoria. Su ecosistema digital conecta los sitios comerciales de Uruguay y Argentina con una plataforma central utilizada por clientes, partners y el equipo operativo.",
          clarification:
            "Los más de 10 años corresponden a la trayectoria del negocio, no a la antigüedad de la plataforma actual.",
        },
        challenge: {
          title: "El desafío",
          text:
            "La operación necesitaba continuidad entre la captación comercial, la recepción de paquetes, la consolidación, los embarques, el tracking, los pagos y la atención. El desafío no era crear una web aislada, sino conectar mercados, usuarios y procesos dentro de un producto coherente con la operación real.",
        },
        role: {
          title: "Mi rol",
          text:
            "Como fundador, propietario y Operations Manager, defino prioridades desde la operación diaria. También lidero producto, diseño de procesos y desarrollo full-stack del ecosistema digital.",
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
            "La arquitectura combina interfaces web, autenticación, datos, archivos y despliegues dentro de una base preparada para evolucionar junto con el producto.",
          stackLabel: "Stack estructural",
        },
        markets: {
          title: "Estados Unidos, Uruguay y Argentina",
          text:
            "La operación logística se desarrolla en Estados Unidos. Uruguay y Argentina cuentan con experiencias comerciales adaptadas a cada mercado y conectadas con el mismo ecosistema operativo.",
        },
        evolution: {
          title: "Un producto en evolución continua",
          text:
            "LEM-BOX es un producto activo que continúa adaptándose a los procesos reales del negocio.",
          qualityTitle: "Calidad y reducción de riesgo",
          qualityText:
            "La evolución del producto incluye pruebas automatizadas, autorización por roles, revisión de arquitectura, documentación técnica y despliegues controlados. Estos mecanismos forman parte de un proceso continuo de calidad y reducción de riesgo.",
        },
        mobileFuture: {
          title: "Próxima evolución",
          text:
            "El ecosistema se encuentra en una etapa continua de documentación, pruebas y preparación técnica para una futura extensión a Android e iOS. Estas aplicaciones forman parte de la evolución prevista y aún no se presentan como productos disponibles.",
        },
        currentState: {
          title: "Estado actual",
          text: "Producto activo en documentación, pruebas y evolución continua.",
        },
        publicLinksTitle: "Conocer el ecosistema",
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
          badges: ["Own product", "Active product"],
          subtitle: "Digital ecosystem for an international logistics operation",
          coverAlt: "LEM-BOX cover",
          backLabel: "Back to portfolio",
          homeCta: "View LEM-BOX case study",
          portfolioCta: "View full case study",
        },
        summary: {
          title: "A product connected to a real operation",
          text:
            "LEM-BOX is a logistics business with more than 10 years of experience. Its digital ecosystem connects the commercial websites for Uruguay and Argentina with a central platform used by customers, partners, and the operations team.",
          clarification:
            "The more than 10 years refer to the business's trajectory, not the age of the current platform.",
        },
        challenge: {
          title: "The challenge",
          text:
            "The operation needed continuity across customer acquisition, package intake, consolidation, shipments, tracking, payments, and support. The challenge was not to build an isolated website, but to connect markets, users, and processes through a product aligned with the real operation.",
        },
        role: {
          title: "My role",
          text:
            "As founder, owner, and Operations Manager, I define priorities from daily operations. I also lead product, process design, and full-stack development of the digital ecosystem.",
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
            "The architecture combines web interfaces, authentication, data, files, and deployments within a foundation designed to evolve with the product.",
          stackLabel: "Structural stack",
        },
        markets: {
          title: "The United States, Uruguay, and Argentina",
          text:
            "The logistics operation is based in the United States. Uruguay and Argentina have market-specific commercial experiences connected to the same operational ecosystem.",
        },
        evolution: {
          title: "A product in continuous evolution",
          text:
            "LEM-BOX is an active product that continues adapting to the real processes of the business.",
          qualityTitle: "Quality and risk reduction",
          qualityText:
            "The product's evolution includes automated testing, role-based authorization, architecture reviews, technical documentation, and controlled deployments. These mechanisms are part of a continuous process of quality and risk reduction.",
        },
        mobileFuture: {
          title: "Next evolution",
          text:
            "The ecosystem is in an ongoing stage of documentation, testing, and technical preparation for a future extension to Android and iOS. These applications are part of the planned evolution and are not yet presented as available products.",
        },
        currentState: {
          title: "Current status",
          text:
            "Active product in continuous documentation, testing, and evolution.",
        },
        publicLinksTitle: "Explore the ecosystem",
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
