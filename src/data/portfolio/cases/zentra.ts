import { en, es } from "../../../i18n";
import { definePortfolioCase } from "../types";

export const zentraCase = definePortfolioCase({
  key: "zentra",
  portfolioOrder: 1,
  category: "brand",
  cover: "/img/zentra-cover.jpg",
  actions: [
    {
      href: "https://zentrascent.com",
      label: {
        es: es.portfolio.zentra.link,
        en: en.portfolio.zentra.link,
      },
    },
  ],
  content: {
    es: {
      title: es.portfolio.zentra.title,
      description: es.portfolio.zentra.desc,
      tags: ["Estrategia de marca y lanzamiento digital"],
      status: es.portfolio.zentra.status,
      role:
        "Estrategia de marca, naming, dirección creativa, coordinación de identidad, infraestructura digital y desarrollo web.",
      details: {
        summary:
          "Estrategia de marca y lanzamiento digital para una experiencia olfativa premium",
        stackLabel: "Capacidades",
        stack: [
          "Estrategia de marca",
          "Naming",
          "Dirección creativa",
          "Coordinación de identidad",
          "Infraestructura digital",
          "Desarrollo web bilingüe",
        ],
        integrationsLabel: "Infraestructura",
        integrations: [
          "Dominio zentrascent.com",
          "Landing bilingüe ES/EN",
        ],
        challenges: [
          "Transformar una idea de negocio en una marca reconocible y escalable, con una dirección premium consistente y un sistema capaz de sostener futuras aplicaciones físicas y digitales.",
        ],
        solution: [
          "Lideré el descubrimiento, la estrategia, el naming, el brief y la dirección creativa. Coordiné a un diseñador especializado para la identidad visual y configuré el dominio, la infraestructura digital y la landing bilingüe.",
        ],
        impact: [
          "ZENTRA cuenta hoy con una identidad definida y una presencia digital propia. El siguiente paso es desarrollar su plataforma comercial y aplicar la marca en catálogo, productos y materiales de venta, todo todavía en etapa de definición y desarrollo.",
          "Identidad visual desarrollada en colaboración con un diseñador especializado.",
        ],
      },
    },
    en: {
      title: en.portfolio.zentra.title,
      description: en.portfolio.zentra.desc,
      tags: ["Brand strategy and digital launch"],
      status: en.portfolio.zentra.status,
      role:
        "Brand strategy, naming, creative direction, visual identity coordination, digital infrastructure, and web development.",
      details: {
        summary:
          "Brand strategy and digital launch for a premium scent experience",
        stackLabel: "Capabilities",
        stack: [
          "Brand strategy",
          "Naming",
          "Creative direction",
          "Visual identity coordination",
          "Digital infrastructure",
          "Bilingual web development",
        ],
        integrationsLabel: "Infrastructure",
        integrations: [
          "zentrascent.com domain",
          "Bilingual ES/EN landing page",
        ],
        challenges: [
          "Turn an early business idea into a distinctive, scalable brand with a consistent premium direction and a system capable of supporting future physical and digital applications.",
        ],
        solution: [
          "I led discovery, strategy, naming, the creative brief, and creative direction. I coordinated a specialist designer for the visual identity and configured the domain, digital infrastructure, and bilingual launch page.",
        ],
        impact: [
          "ZENTRA now has a defined identity and its own digital presence. The next phase is the commercial platform and brand applications across its catalog, products, and sales materials, all still in definition and development.",
          "Visual identity developed in collaboration with a specialist designer.",
        ],
      },
    },
  },
  home: {
    order: 1,
    summary: {
      es: "Desarrollo integral de una marca de aromatización premium: estrategia, naming, dirección creativa, coordinación de identidad, infraestructura digital y landing bilingüe. La nueva plataforma comercial y sus aplicaciones continúan en desarrollo.",
      en: "A complete premium scent brand project covering strategy, naming, creative direction, visual identity coordination, digital infrastructure, and a bilingual launch page. Its commercial platform and broader brand applications are still in development.",
    },
  },
});
